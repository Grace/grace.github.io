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
ad · oteldemo.AdService/GetAds     self 6.96ms → 1.89s     z 410
```

The runner-up scored **0.5**. Not a close call.

And the span that makes the point is the one that didn't rank. The frontend's
client span for that same call — the outbound side of the identical request —
moved like this:

```
duration   +1885.6ms
self time     +3.6ms
```

Its duration moved five hundred times more than its own work did. On a duration
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
z=410 against 0.5. It changed a label on the row underneath, which is the row
someone reads when the top one doesn't look right. The demo's actual numbers are
the regression test now.

## The part I can't tell you yet

One case is an anecdote. I don't have an accuracy number, and until I do, nothing
here is a claim about how well this works — only about what it measures and why
that measurement is the right one.

Getting that number is mostly mechanical: the demo ships fourteen feature flags
that inject specific failures, so ground truth comes from whoever flipped the
flag rather than from the tool. What it isn't is quick, and it comes with its own
traps. `intlShippingSlowdown` looked like the ideal first case — latency injected
straight into one service — and is unusable, because it only delays non-US
addresses and exactly one of the demo's nine load-generator personas is Canadian.
About a tenth of an already-rare operation, which is both below any sample floor
and a tail effect rather than a shift in typical behaviour.

When the number exists it'll be published whatever it says, with the demo commit,
the flags, the window length, and the case count. A localizer that's right 60% of
the time and quiet the rest is usable at 3am. One that's right 60% of the time and
confidently wrong the rest is not — and both of them score 60% if you only count
hits. So the scoring keeps *wrong* and *declined* in separate columns, and a
service that only ever appeared as "waiting on something below it" counts as a
miss, never a hit. Anything else is marking your own homework on the one
distinction the tool claims to make.

The code is at [github.com/Grace/inquest](https://github.com/Grace/inquest).
Pre-alpha, and the README says so.
