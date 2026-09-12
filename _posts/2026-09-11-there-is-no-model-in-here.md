---
layout: post
title: "There is no model in here"
subtitle: "How normalizing GenAI telemetry actually works, in pseudocode: counting evidence instead of predicting it, an integer margin instead of a confidence score, and a rule table small enough to print. The highest score usually loses, and that is the interesting part."
description: "A walkthrough of how genai-interlingua recognizes which instrumentation library wrote a span, translates it into one gen_ai.* vocabulary, and records what the translation cost. Pseudocode for each stage, and the measurements from six real dialects."
date: 2026-09-11 20:30:00 -0400
---

Three posts ago I argued that [GenAI instrumentation libraries each spell the
same facts differently][prev1], that [the mappings should be data but not a new
language][prev2], and that [a translated span should say what the translation
cost][prev3]. Those were arguments. This one is the machine: what actually
happens to a span, stage by stage, in pseudocode.

You can follow it without reading any Go, and there is no machine learning in it
anywhere. That is worth saying at the top, because "figure out which library
wrote this" sounds like a classification problem and gets built like one
depressingly often. It is a counting problem. Everything below follows from
that.

Two pages run the real thing in your browser if you would rather poke at it than
read: the [normalizer][demo], the [inspector][insp] for one span attribute at a
time, and [what translation costs][conf] for the measurements across six
libraries.

## The problem, in four lines

A model call produced 412 input tokens. Here are four of the ways it gets
written down:

```
gen_ai.usage.prompt_tokens   = 412     OpenLLMetry
llm.token_count.prompt       = 412     OpenInference
ai.usage.promptTokens        = 412     Vercel AI SDK
gen_ai.usage.input_tokens    = 412     the conventions themselves
```

One fact, four spellings, and none of them can be summed with the others. So the
job is to rewrite all of them into one vocabulary. To rewrite a span you first
have to know which library wrote it, because nobody stamps their own name on it.

## Stage 1: which library wrote this?

Each library gets to look at the span and say how much evidence it sees *that
only it would have written*. Not "does this look like an LLM call" — everyone
looks like an LLM call. Only the fingerprints.

Braintrust's entire answer is two lines, and it is the clearest one:

```
score(span):
    if any attribute starts with "braintrust."   →  3
    otherwise                                   →  0
```

Most are a little richer. A whole namespace is worth 2 or 3; an individual
telltale key is worth 1:

```
score_openllmetry(span):
    points = 0
    if span has any "traceloop.*"             points += 2
    for key in [gen_ai.usage.prompt_tokens,
                gen_ai.usage.completion_tokens,
                gen_ai.usage.total_tokens,
                llm.request.type]:
        if span has key                       points += 1
    if span has "gen_ai.prompt.*"
            or  "gen_ai.completion.*"         points += 1
    return points
```

Then you pick the winner:

```
detect(span):
    high, second, winner = 0, 0, none
    for each dialect:
        n = dialect.score(span)
        if n > high:     winner, high, second = dialect, n, high
        elif n > second: second = n

    confidence = high - second
    return winner, confidence
```

`high - second` is the whole confidence model. If one library scored 7 and the
next best scored 0, the margin is 7. If they scored 5 and 3, the margin is 2 —
same winner, much less comfortable. That integer gets written onto the span as
`interlingua.dialect.confidence`, and a human or a query can use it to find the
spans where the answer was close.

**It is not a probability, and it cannot be turned into one.** There is no
denominator. The scores are unbounded evidence counts on scales that differ per
library — one library's 3 is a namespace, another's 3 is three separate keys —
so there is nothing to divide by. A percentage here would be a number invented
to look like a measurement, which is why [the page that draws these
measurements][conf] does not publish one.

### The highest score usually loses

Here is the part I did not expect when I built it. Five of the six dialects are
named libraries. The sixth, `raw`, recognizes hand-rolled instrumentation by
*shape* — it counts attributes the conventions themselves define, plus a table of
common folk spellings:

```
score_raw(span):
    conformant = keys the conventions define        # worth 2 each
    folk       = keys in the folk-spelling table    # worth 1 each

    if conformant == 0 and folk < 2:  return 0      # a lone `model` attribute
    return conformant*2 + folk                      # is evidence of nothing
```

Because it counts *every* conventions-defined key at 2, `raw` scores enormously
on spans that belong to somebody else. On a real LangChain span:

| span | raw | openllmetry | winner | margin |
|---|---|---|---|---|
| `ChatOpenAI.chat` | **32** | 3 | openllmetry | 3 |
| `litellm_request` | **24** | 3 (litellm 5) | litellm | 2 |
| `ai.generateText` | 0 | 0 (vercel 7) | vercel | 7 |
| `chat gpt-4o-mini` | 26 | 0 | **raw** | **0** |

`raw` out-scores the winner on eight of the fifteen spans in the corpus and wins
none of the ones it competes for. It is marked as a **fallback** and excluded
from the race entirely — consulted only when nothing that knows what it is
looking at has claimed the span:

```
detect(span):
    contenders = dialects that are not fallbacks
    ...argmax over contenders, margin = high - second...

    if nobody claimed it:
        winner = best-scoring fallback
        confidence = 0            # it did not beat anything.
                                  # it was the only thing left.
```

The reason this belongs in detection rather than in the scoring is precise, and
it is the nicest small design argument in the codebase: a fallback that scores on
every GenAI span *would not win* those spans, but the points it took would come
straight out of the winner's margin. A positive identification would read as less
confident merely because a fallback also exists. So the fallback tier is
separate, and a span labeled `raw` with a confidence of 0 is telling the truth
about how it was identified.

Note the last row. Margin 0 does not mean "coin flip". It means "claimed from the
fallback tier".

## Stage 2: translating it

Now the winner reads the span. About half of that work is a lookup table. A rule
is three things:

```
Rule:
    field      the concept being produced        (not an attribute name)
    keys       source keys, in precedence order  (first one present wins)
    transform  what happens to the value on the way through
```

The `field` is deliberately not a name. `gen_ai.usage.cache_write.input_tokens`
in the current draft of the conventions is spelled
`gen_ai.usage.cache_creation.input_tokens` in the released version, and it is the
same idea both times. So the middle of the pipeline traffics in concepts, and
names are applied last, on the way out.

The transform is a **closed set** — six operations, applied in a fixed order:

```
transform:
    lower         lowercase it            "OpenAI" → "openai"
    cut_after     keep the part before a separator
    trim_suffix   strip a known suffix
    map           look it up in a table   (+ what to do if it's not in the table)
    divide        unit conversion         milliseconds → seconds
    to_list       wrap a scalar in a one-element list
```

Here is a real rule, and it uses three of them. The Vercel AI SDK writes its
provider as `<provider>.<api surface>` — `openai.chat`,
`amazon-bedrock.messages`, `google.generative-ai` — and only the first segment
names the provider:

```
{ field: provider_name,
  keys:  [ai.model.provider, gen_ai.system],
  transform: lower, cut_after ".", map(vercel_providers) }
```

**Every one of those six operations is a total function of one value.** It cannot
look at another attribute, iterate the span, or branch on anything but its own
input. That constraint is the whole reason the table is a table: a rule that can
be *stated* can also be printed, audited, and exported — into an OpenTelemetry
Collector config that runs without this binary at all.

And it is why the other half of the mapping is not a table. Reassembling
`gen_ai.prompt.0.tool_calls.1.name`-style indexed attributes into one nested
document, or deciding what `traceloop.entity.name` means by looking at a sibling
attribute, are not transforms of a value. They are *readings of a span*. Those
stay as code, and the tool reports them as the part an export cannot carry. I
[tried making them data][prev2] and that is the post about why it failed.

## Stage 3: what could not be carried

This is the part other normalizers do not do, and it is the only reason this
project is interesting.

When a rule cannot carry something, the reason is recorded on the span rather
than dropped. Five reasons, and they are five genuinely different problems:

| reason | what it means |
|---|---|
| `no_field` | the conventions have **no concept** for this, at any version |
| `unstructured` | a provider-shaped blob the translator declined to parse |
| `flattened` | indexed attributes collapsed into one field; per-index structure lost |
| `coerced` | the value survived but its type did not |
| `ambiguous` | it could have meant two different fields, so nothing was guessed |

`coerced` has the best small example. The `divide` operation exists because the
Vercel SDK reports milliseconds where the conventions specify seconds. If the
value is not a number, it is **not** passed through unchanged:

```
divide(value, by):
    if value is not a number:
        return loss(coerced, "value is not a number")
    return value / by
```

Passing it through would put a millisecond count under an attribute the
conventions define in seconds — wrong by exactly a thousand, and it looks fine.
Refusing is the more useful answer.

(A pedantic detail I enjoy: it divides by 1000 rather than multiplying by 0.001.
Over the first 200,000 millisecond values those two disagree in the last bit
26,651 times, because 0.001 has no exact float64 representation and 1000 does.)

### The counter that counts what you forgot

Recording losses as you find them has an obvious failure: you only record the
ones you thought to name. So after the rules run, there is a sweep. For every
attribute under a namespace this dialect *claimed as its own*, that it neither
read nor already reported, the sweep names it and records `no_field`.

Without that, `lossy.count = 0` means "I recognized none of the things I know I
drop," which is very nearly the opposite of what any reader would take it for. A
loss counter that only counts remembered losses is not a measurement. The
shape-matching fallback had this right first and the five purpose-built dialects
did not, which is an embarrassing way round for it to be.

### What that measures, across six real dialects

Six dialects, nine span fixtures — seven captured from the libraries running,
two hand-built — and thirty distinct fields. **105 source attributes have
nowhere in the conventions to go:**

| dialect | fields carried (of 30) | attributes with no home |
|---|---|---|
| openllmetry | 21 | 24 |
| vercel | 19 | 8 |
| openinference | 17 | 7 |
| litellm | 13 | **53** |
| raw | 13 | 6 |
| braintrust | 9 | 7 |

Ninety of the 105 are `no_field` — not a missing name, a missing *concept*.

LiteLLM's 53 is not noise and it is not sloppiness. It is an entire cost model —
`gen_ai.cost.input_cost`, `output_cost`, `margin_percent`, `discount_amount` —
plus every `user_api_key_*` field recording who spent what. The conventions price
nothing, at any version. **That is a finding about the conventions, not about
LiteLLM**, and costing is a large part of why anyone puts a proxy in front of a
model in the first place.

One more thing about the 105, because it is the question everyone asks: nothing
was deleted. Under the default, every one of those attributes is still on the
span under the name its library gave it. What it lacks is a `gen_ai.*` name, so a
query written in the conventions' vocabulary will not find it. The tool has a
mode that removes them and it is not the default, because that is a choice
somebody should make on purpose.

## Stage 4: pinning a target costs something too

There is a second translation, and a second kind of loss. Concepts have to be
written out under some specific version of the conventions, and the versions
differ:

```
render(field, value, target):
    key = target.name_for(field)
    if no key:            return loss(no_attribute)   # this release has no such attribute
    if not target.accepts(field, value):
        return loss(no_value)                          # it has the attribute, not this value
    write key = value
```

The released `v1.41.0` can express 27 of the 30 fields; the current draft can
express all 30. Concretely, pinning the released version costs you
`gen_ai.prompt.version` and both audio-token fields. And `no_value` bites on both
targets: OpenLLMetry states an operation name and a provider name that are
outside the conventions' permitted value sets, so they are recorded as refused
rather than written.

Both choices are defensible. Neither is correct. What is not defensible is making
the choice silently, which is what a normalizer with a hardcoded table does —
[so the target is a flag][mt].

## What ends up on the span

The translation writes its own account of itself, in attributes you can group by:

```
interlingua.dialect            = openllmetry
interlingua.dialect.confidence = 7
interlingua.target             = v1.41.0
interlingua.lossy              = [gen_ai.completion.*, gen_ai.prompt.version, ...]
interlingua.lossy.count        = 4
interlingua.hops               = 1
interlingua.mapping            = 9f2c1ab4e07d5c83
```

Three choices there that took a while to get right.

`lossy.count` is written **even when it is zero**, because "this span lost
nothing" and "this span was never normalized" are different facts and several
backends store an array attribute as an opaque string you cannot count.

`hops` is an integer rather than a chain of translations. That is a concession to
reality: Honeycomb types every array-valued attribute as a string column —
including the conventions' own `gen_ai.input.messages` — so a chain would arrive
as a blob you cannot group by, filter into, or count. An integer you can alert on
beats a structure you cannot query.

`mapping` is the one I would defend hardest. It is a digest over **the rule
tables themselves** — every rule, every transform field including the ones left
at their defaults, every target's key map — and not a commit hash. A commit hash
moves on every commit, including the ones that change nothing a span could
possibly see, so it cannot answer "was this span translated under the same rules
as that one?" The criterion is worth stating as a general rule, because it is the
same one that makes me refuse a conformance percentage:

> A number is a measurement only if it moves when the measured thing moves, and
> not otherwise.

The digest's honest limit, stated rather than papered over: rewriting *how* a
method reassembles messages, while changing nothing about which fields come out,
leaves the digest where it was.

## Go and look

Everything above is running in your browser, compiled from the same Go the
command line and the Collector processor run, so the pages cannot disagree with
the tool about what a span becomes. Nothing you paste is uploaded; there is no
server to upload it to.

- **[Normalize a span][demo]** — paste one in, or pick a real capture, and watch
  it rewritten.
- **[The inspector][insp]** — one attribute at a time: which source key produced
  this value, what evidence the reading turned on, and what it could not carry.
- **[What translation costs][conf]** — the measurements above, drawn: the scoring
  race per span, and where all 105 losses go.

The [source is here][repo]. Two of its documents are generated by the test suite
rather than written, which is the only reason I trust the numbers in this post:
[the census][census] is regenerated from the fixtures and CI fails when it and
the fixtures disagree, and [what capturing the real libraries found][findings] is
the log of the five defects that turned up when I stopped writing fixtures from
documentation and started recording what the libraries actually emit. Five of
seven captures found something wrong. Every one of them was invisible to a
completely green test suite.

## What this is not

There is already a first-party component for this. [`processor/genainormalizer`][gnorm]
has been in `opentelemetry-collector-contrib` since February and ships in the
`otelcol-contrib` binary you are probably already running. It maps OpenInference
and OpenLLMetry and needs no custom build. **If those are the libraries you have,
reach for it first.**

So the claim here is not that translating GenAI telemetry is novel. It is that
none of the translators record what the translation cost. That component's own
source says `callers must drop the attribute`, and with `remove_originals: true`
the source attribute goes too — so the evidence leaves with the data. Those 105
attributes are what that silence is hiding, and the differences are going
[upstream][upstream] rather than into a competing component, because a second
one would be worse for everyone than one good one.

Normalization you cannot audit is just another assertion. Everything in this post
exists to make the assertion checkable.

[prev1]: /2026/09/07/normalizing-llm-telemetry/
[prev2]: /2026/09/08/dont-invent-a-language-for-this/
[prev3]: /2026/09/08/what-did-the-translation-cost/
[demo]: /demos/genai-interlingua/
[insp]: /demos/genai-interlingua/inspector/
[conf]: /demos/genai-interlingua/conformance.html
[repo]: https://github.com/Grace/genai-interlingua
[mt]: https://github.com/Grace/genai-interlingua/blob/main/docs/moving-target.md
[findings]: https://github.com/Grace/genai-interlingua/blob/main/docs/findings.md
[census]: https://github.com/Grace/genai-interlingua/blob/main/docs/conformance.md
[gnorm]: https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/processor/genainormalizerprocessor
[upstream]: https://github.com/Grace/genai-interlingua/blob/main/docs/upstream.md
