---
layout: post
title: "Duration is why every service on the path looks guilty"
subtitle: "A span's duration includes the time its children were running. When something deep in a call tree slows down, every ancestor slows by the same amount — and a ranked list of what got slower names all of them."
description: "A span's duration includes its children, so a slow leaf inflates its whole ancestry and every service on the path looks responsible. Self time is the measurement that separates the cause from the callers waiting on it."
date: 2026-09-05 18:00:00 -0400
---

Here is the moment you notice. Something is slow, you pull up the services on
the request path sorted by how much worse they got, and five of them are at the
top. Frontend: worse. The service it called: worse. The service *that* called:
worse, by almost exactly the same amount. The list is correct and it has told
you nothing.

## This is structural, not a bug

A span's duration is wall clock from start to end, and that includes every
moment its children were running. So when a leaf slows down by 1.9 seconds,
its parent's duration grows by 1.9 seconds, and its parent's parent's duration
grows by 1.9 seconds, all the way up to the entry point. Every one of those
services genuinely did take longer. None of them except the last did anything
differently.

<figure class="fig">
<svg viewBox="0 0 760 222" role="img" aria-label="Eight spans on one request path: all last about three seconds, only the last is doing work.">
<text class="hd" x="0" y="14">span</text>
<text class="hd" x="272" y="14">total duration</text>
<text class="hd" x="498" y="14">its own work</text>
<line class="rule" x1="0" y1="28" x2="760" y2="28"/>
<text class="mut" x="0" y="52">frontend-proxy · GET</text>
<rect class="wait" x="272" y="45" width="196.0" height="13" rx="2"/>
<rect class="own" x="498" y="45" width="0.8" height="13" rx="2"/>
<text class="mut" x="504.8" y="52">0.2ms</text>
<text class="mut" x="0" y="73">  frontend-proxy · router frontend egress</text>
<rect class="wait" x="272" y="66" width="196.0" height="13" rx="2"/>
<rect class="own" x="498" y="66" width="0.8" height="13" rx="2"/>
<text class="mut" x="504.8" y="73">0.7ms</text>
<text class="mut" x="0" y="94">    frontend · GET /api/data</text>
<rect class="wait" x="272" y="87" width="196.0" height="13" rx="2"/>
<rect class="own" x="498" y="87" width="0.8" height="13" rx="2"/>
<text class="mut" x="504.8" y="94">1ms</text>
<text class="mut" x="0" y="115">      frontend · GET /api/data</text>
<rect class="wait" x="272" y="108" width="195.9" height="13" rx="2"/>
<rect class="own" x="498" y="108" width="0.8" height="13" rx="2"/>
<text class="mut" x="504.8" y="115">1ms</text>
<text class="mut" x="0" y="136">        frontend · executing api route (p…</text>
<rect class="wait" x="272" y="129" width="195.8" height="13" rx="2"/>
<rect class="own" x="498" y="129" width="0.8" height="13" rx="2"/>
<text class="mut" x="504.8" y="136">2ms</text>
<text class="mut" x="0" y="157">          frontend · oteldemo.AdService/G…</text>
<rect class="wait" x="272" y="150" width="195.7" height="13" rx="2"/>
<rect class="own" x="498" y="150" width="2.8" height="13" rx="2"/>
<text class="mut" x="506.8" y="157">44ms</text>
<text class="" x="0" y="178">            ad · oteldemo.AdService/GetAds</text>
<rect class="wait" x="272" y="171" width="192.9" height="13" rx="2"/>
<rect class="cause" x="498" y="171" width="192.9" height="13" rx="2"/>
<text class="mut" x="696.9" y="178">3034ms</text>
<text class="mut" x="0" y="199">              ad · getAdsByCategory</text>
<rect class="wait" x="272" y="192" width="1.0" height="13" rx="2"/>
<rect class="own" x="498" y="192" width="0.8" height="13" rx="2"/>
<text class="mut" x="504.8" y="199">0.1ms</text>
</svg>
<figcaption>One real request from the <code>adManualGc</code> window, trace <code>5be7c5ada59b</code>. Every span on the path lasts about 3.08 seconds — left column. Only the last one is <em>doing</em> anything — right column, same scale. The seven above it are waiting on it.</figcaption>
</figure>

Ranking by duration, or by any dimensional diff over durations, cannot separate
them, because on that measurement they are not different. The signal you want
isn't in the numbers being compared. It's in the shape of the tree they came
from.

## Self time is the measurement that separates them

Take a span's duration and subtract the wall-clock time its children covered.
What's left is the work that span did itself.

When the leaf slows down, only the leaf's self time moves. Its ancestors' self
times don't move at all — they were waiting, and waiting is not work. The
ranked list collapses from five services to one.

Two details matter more than they look.

**Merge the children as intervals; don't sum them.** A fan-out to three services
at once overlaps in wall clock. Summing three concurrent 80ms children against a
100ms parent gives you 240ms of "children" and a self time of negative 140ms,
which reads as the parent having gotten *faster* while the system got slower.
The question is how much of the parent's wall clock was not covered by anything
below it, and that's a union.

**Clamp children to their parent's window.** Clock skew across hosts is normal,
and a child that reports starting before its parent will manufacture self time
out of nothing if you let it.

## What it does to a real incident

I ran this against the OpenTelemetry Demo — commit `8c47d47` — with the
`adManualGc` flag on, which triggers full manual garbage collections in the ad
service. Five minutes of baseline, five minutes with the flag on, 88 operations
ranked.

The top of the list:

```
ad · oteldemo.AdService/GetAds     self 4.22ms → 2.10s     z 742
```

The runner-up scored **1.7**. Not a close call.

<figure class="fig">
<svg viewBox="0 0 760 304" role="img" aria-label="Ranked by duration the true cause is fourth; ranked by self time it is first and alone.">
<text class="hd" x="0" y="10">ranked by duration shift</text>
<line class="rule" x1="0" y1="21" x2="760" y2="21"/>
<text class="mut" x="0" y="40">1. frontend · executing api route (pages) /ap…</text>
<rect class="wait" x="300" y="33" width="340.0" height="13" rx="2"/>
<text class="mut" x="646.0" y="40">+2126ms</text>
<text class="mut" x="0" y="61">2. frontend · oteldemo.AdService/GetAds</text>
<rect class="wait" x="300" y="54" width="339.9" height="13" rx="2"/>
<text class="mut" x="645.9" y="61">+2125ms</text>
<text class="mut" x="0" y="82">3. frontend · GET /api/data</text>
<rect class="wait" x="300" y="75" width="336.4" height="13" rx="2"/>
<text class="mut" x="642.4" y="82">+2103ms</text>
<text class="" x="0" y="103">4. ad · oteldemo.AdService/GetAds</text>
<rect class="cause" x="300" y="96" width="335.5" height="13" rx="2"/>
<text class="mut" x="641.5" y="103">+2098ms</text>
<text class="mut" x="0" y="124">5. flagd · flagd.evaluation.v1.Service/EventS…</text>
<rect class="wait" x="300" y="117" width="39.3" height="13" rx="2"/>
<text class="mut" x="345.3" y="124">+246ms</text>
<text class="hd" x="0" y="167">ranked by self-time shift</text>
<line class="rule" x1="0" y1="178" x2="760" y2="178"/>
<text class="" x="0" y="197">1. ad · oteldemo.AdService/GetAds</text>
<rect class="cause" x="300" y="190" width="335.3" height="13" rx="2"/>
<text class="mut" x="641.3" y="197">+2096ms</text>
<text class="mut" x="0" y="218">2. flagd · flagd.evaluation.v1.Service/EventS…</text>
<rect class="own" x="300" y="211" width="39.3" height="13" rx="2"/>
<text class="mut" x="345.3" y="218">+246ms</text>
<text class="mut" x="0" y="239">3. load-generator · browser_change_currency</text>
<rect class="own" x="300" y="232" width="14.7" height="13" rx="2"/>
<text class="mut" x="320.7" y="239">+92ms</text>
<text class="mut" x="0" y="260">4. frontend · oteldemo.AdService/GetAds</text>
<rect class="own" x="300" y="253" width="1.4" height="13" rx="2"/>
<text class="mut" x="307.4" y="260">+9ms</text>
<text class="mut" x="0" y="281">5. product-catalog · oteldemo.ProductCatalogS…</text>
<rect class="own" x="300" y="274" width="1.2" height="13" rx="2"/>
<text class="mut" x="307.2" y="281">+7ms</text>
</svg>
<figcaption>The same window, ranked two ways. By duration the service that actually stalled is <strong>fourth</strong>, behind three frontend spans that were only waiting for it — all four within 30ms of each other. By self time it is first, by a factor of eight over anything else in the window.</figcaption>
</figure>

And the span that makes the point is the one that didn't rank. The frontend's
client span for that same call — the outbound side of the identical request —
moved like this:

```
duration   +2125.1ms
self time      +9.0ms
```

Its duration moved roughly two hundred times more than its own work did. On a duration
ranking it's the second-worst thing in the system. On self time it's a service
sitting patiently on a socket, which is what it actually was.

## What real traces taught that my own tests hadn't

I had a test for this. Synthetic traces, a caller whose duration moved and whose
self time didn't, asserting the caller gets labelled as waiting. It passed.

Then real traces arrived and the caller got labelled as the cause.

The classifier asked two questions in the wrong order. It checked an absolute
floor first — *did this operation's self time move by at least a couple of
milliseconds* — and only asked about proportion if the answer was no. In my
synthetic fixtures the caller's own noise was fifteen microseconds, comfortably
under the floor, so the proportion question always got asked and the test always
passed.

Real callers are not that quiet. The frontend picked up 3.6ms of its own jitter
during a window where the thing underneath it was pausing for whole seconds.
3.6ms clears any floor worth having. So the operation was called slower, and the
list handed an on-call engineer the wrong service.

Waiting is a question about proportion and it has to be asked first: did this
operation's own work account for a real share of its own slowdown, or did
something below it? An operation whose self time explains less than a fifth of
its duration shift didn't cause it, however many milliseconds that fifth
happens to be.

The fix didn't change the answer — the ad service ranked first either way, at
z=742 against 1.7. It changed a label on the row underneath, which is the row
someone reads when the top one doesn't look right. The demo's actual numbers are
the regression test now.

## The number, and what's wrong with it

Four labeled failures from the demo, five minutes of baseline and five minutes
per incident, scored two ways:

| ranking | top-1 | top-3 | wrong | declined |
| --- | --- | --- | --- | --- |
| deviation (robust-z) | 25% | 25% | **50%** | 25% |
| effect size | 25% | 50% | 25% | 25% |

Four cases is not a benchmark. It is enough to say the tool names the wrong
service more often than the right one, and that's the number to carry rather
than the one case it nailed.

The second row is there because measuring this exposed a mistake in the ranking
itself. Robust-z asks how far a shift falls outside an operation's own history —
that's a significance test — and I was reading it as importance. Across tiers
those come apart badly: a browser page-load timing moving 30% of a 2.4-second
baseline outscores a gRPC handler that tripled 3.5ms, and only one of those is a
cause. Scoring the shift as a fraction of the operation's own baseline instead —
an effect size — halves the wrong rate. Everything with no instrumented children
made it worse, because a span with no children has self time equal to its
duration *by construction*, so it can never be called a waiter and always looks
like its own cause. Browser and load-generator spans are almost all leaves.

The bigger finding isn't in the tool. I captured one baseline at the start of
the run and compared it against windows up to 32 minutes later, and the ad
service ends the run about 2.5× slower than it began with nothing injected into
it:

```
baseline                     GetAds p50   4.33ms
productCatalogFailure        GetAds p50  11.19ms   ← ad untouched
recommendationCacheFailure   GetAds p50  10.42ms   ← ad untouched
```

That drift gets attributed to whichever flag happened to be on. It's why the ad
service tops the ranking in a window about a recommendation-service cache leak —
a false positive my harness manufactured, not the ranking. So 25% is a floor on
the error rate, not an estimate of it, and the fix is interleaving a fresh
baseline between injections instead of reusing one.

Three other things the harness got wrong before the tool got a chance to.
`cartFailure` only fires inside `EmptyCart`, which sees about three calls a
minute — 14 samples against a floor of 20, so it can't clear the bar in five
minutes and it's out of the set. `intlShippingSlowdown` looked like the ideal
first case and is unusable: it only delays non-US addresses, and exactly one of
the demo's nine load-generator personas is Canadian. And `productCatalogFailure`
couldn't fire at all for two runs, because the demo ships it with a targeting
rule whose branches are *both* `"off"` — and a targeting rule overrides the
default variant, so flipping the default left the flag disabled while appearing
to work. It scored as a decline. That was me, not the tool, and it's why every
case now verifies its own injection and writes the evidence next to the result.

The scoring keeps *wrong* and *declined* in separate columns throughout. A
localizer that's right 60% of the time and quiet the rest is usable at 3am; one
that's right 60% and confidently wrong the rest is not, and both score 60% if
you only count hits. A service that only ever appeared as "waiting on something
below it" counts as a miss, never a hit — anything else is marking your own
homework on the one distinction the tool claims to make.

The code is at [github.com/Grace/inquest](https://github.com/Grace/inquest).
Pre-alpha, and the README says so.
