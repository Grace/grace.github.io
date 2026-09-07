---
layout: post
title: "LLM telemetry has no standard. Here’s how to normalize it."
subtitle: "Every GenAI instrumentation library spells the same facts differently, so nothing about your model calls can be queried as one thing — and the semantic conventions that would settle it currently have no released version to normalize against."
description: "GenAI instrumentation libraries each use their own attribute names, so LLM telemetry cannot be queried as one dataset. Here is how to normalize it, and how to handle the fact that the conventions you would normalize to have not shipped a release."
date: 2026-09-07 12:00:00 -0400
---

Here is the moment you notice. Finance wants the model spend broken down by
provider, you have OpenTelemetry traces from every service, and you write the
obvious query: sum the input tokens, group by provider. The number comes back
and it is far too small. Not zero — small. One team's worth.

The query is correct. It matched one service, because that service is the only
one whose library spells the token count the way your query does.

## This is structural, not a bug

Four services, four teams, four reasonable choices made at four different times.
Here is the same fact — how many tokens went into a model call — as each of them
records it.

| | prompt tokens | provider |
| --- | --- | --- |
| OpenLLMetry, before its migration | `gen_ai.usage.prompt_tokens` | `gen_ai.system` |
| OpenInference | `llm.token_count.prompt` | `llm.provider`, or `llm.system` |
| Vercel AI SDK | `ai.usage.promptTokens` | `ai.model.provider` |
| the conventions | `gen_ai.usage.input_tokens` | `gen_ai.provider.name` |

None of these is wrong. Each library picked names before there was a standard to
pick, or picked them from a version of the standard that has since changed. The
data is all there. It is just not addressable as one column, and no dashboard
can sum a column that does not exist.

So you do the obvious thing: translate every dialect into one vocabulary, at
the pipeline, where you can do it once instead of in every service.

## What that looks like

I built [genai-interlingua][repo] for this. It recognizes the dialect a span is
written in, rewrites it into one `gen_ai.*` schema, and records on the span
whatever the translation could not carry.

The fastest way to see what it does to your own data is the CLI, which reads
OTLP/JSON on stdin and writes it on stdout:

```
go install github.com/Grace/genai-interlingua/cmd/interlingua@v0.2.0
cat captured-span.json | interlingua -target v1.41.0
```

An OpenLLMetry span goes in with `gen_ai.usage.prompt_tokens` and
`traceloop.workflow.name` on it. It comes out still carrying those — nothing is
deleted by default — plus the normalized keys:

```
gen_ai.provider.name           = openai
gen_ai.usage.input_tokens      = 412
gen_ai.usage.output_tokens     = 27

interlingua.dialect            = openllmetry
interlingua.target             = v1.41.0
interlingua.lossy              = [gen_ai.usage.total_tokens, ...]
interlingua.lossy.count        = 5
```

That last pair is the part I care about most, and I will come back to it.

If you would rather not install anything, [the same thing runs in your
browser][demo] — it is this compiled to WebAssembly, with the captured spans
from all seven libraries as presets. Switching the target there is the fastest
way to see what the rest of this post is about.

**The CLI is for looking, not for running.** It is how you check what the
mapping does to a payload you have captured, before you trust it. In a real
pipeline you would not shell out per span — the same logic ships as an
OpenTelemetry Collector processor, which is the integration that actually
matters:

```yaml
processors:
  genaiinterlingua:
    target: v1.41.0
```

One processor in the collector, and every service behind it starts speaking one
vocabulary with nothing re-instrumented.

Which raises the question the rest of this post is about: **normalize to
what, exactly?**

## There is no version to normalize to

The `gen_ai.*` attributes used to live in
`open-telemetry/semantic-conventions`, alongside HTTP and database and
everything else. At **v1.42.0** they were deprecated there and moved to a
dedicated repository, `open-telemetry/semantic-conventions-genai`.

That is a reasonable decision. GenAI conventions change much faster than HTTP
conventions, and a domain moving at a different speed deserves its own release
cadence.

Here is the state of that decision today:

| | |
| --- | --- |
| `semantic-conventions` v1.41.0 | 2026-04-28 — last release with live `gen_ai.*` |
| `semantic-conventions-genai` created | 2026-05-05 |
| `semantic-conventions` v1.42.0 | 2026-06-12 — `gen_ai.*` deprecated and moved out |
| `semantic-conventions` v1.43.0 | 2026-07-03 |
| `semantic-conventions` v1.44.0 | 2026-08-04 |
| `semantic-conventions-genai` releases | **zero** |
| `semantic-conventions-genai` tags | **zero** |

The main repository has tagged three releases since the move. The repository
that actually owns these attributes has tagged nothing, while committing to
`main` steadily — twenty-one commits in the thirty days before I last checked.

The definitions are moving faster than they were before the split, and there is
now no version number anywhere on them.

## What that costs you, specifically

For most semantic conventions this question is boring. You pick a version, you
put it in `schema_url`, and a consumer reading your span in three years can look
up exactly what you meant by every key on it. Schema URLs are also what lets a
backend apply transformations to carry old data forward.

There is no such string for GenAI. You cannot pin `main`. You can pin a commit,
but nothing in the ecosystem will resolve it and no consumer will know what to
do with it.

So "normalize to the GenAI conventions" is an underspecified instruction, and
whoever writes the normalizer has to answer it. There are two answers and
neither is correct:

**Pin the last tagged cut, v1.41.0.** It is frozen, it is deprecated at its
source, and it is missing everything added in the months since. But it is a
version, and a reader six months from now can reconstruct exactly what it meant.

**Track `main`.** You get the current definitions, and "conformant" becomes a
claim with no version attached, which may quietly stop being true on any given
Tuesday.

What is *not* defensible is making the choice silently, which is what a
normalizer with a hardcoded attribute table does. Whoever wrote that table
picked a version. They just did not write down which one, and neither did the
spans.

## The measurement that made me feel better

I expected pinning the frozen cut to be expensive. It is not, yet.

OpenTelemetry ships first-party GenAI instrumentation
(`opentelemetry-instrumentation-openai-v2`). I captured a span from it and
normalized that span to both targets — the frozen v1.41.0 and current `main`.
The entire difference between the two outputs was one string: the label
recording which target had been used. Every attribute the reference
implementation emits today is expressible at the frozen cut.

So for spans from the official instrumentation, pinning costs nothing at all
right now. That is a much better argument for the frozen default than "it is the
only version you can name."

Two caveats, and they are the point rather than footnotes. Those packages are
versioned `2.4b0` and `1.1b0` — beta code tracking an untagged specification.
The gap can open at any time with no version number changing to warn anyone. And
even that span carries `openai.response.system_fingerprint`, which no target
expresses at any version, so even the reference implementation emits data the
conventions have no home for.

## What to do about it

Three things, none of which require the upstream situation to resolve.

**Make the target a parameter, not a constant.** If your normalizer has a table
of attribute names in it, that table is a snapshot of one version of a moving
schema, and the version it snapshotted is not written down anywhere. Make it a
flag with an enum, and make the default a decision you can defend out loud.

**Put the target on the span.** There is no `schema_url` to carry it, so the
span itself is the only durable record of which vocabulary its `gen_ai.*` keys
belong to. One attribute. A reader six months from now should not have to find
the collector config that produced the data.

**Record what the translation cost.** Normalizing is lossy: some fields have no
home at your target, some values are outside its enum, some emitters pack three
facts into one JSON blob. A normalizer that drops those silently is worse than
no normalizer, because you will trust the result. Put the list of keys the span
is *not* a faithful carrier of on the span, next to the data. Then "which
library is losing us the most" is a query rather than an afternoon.

**And check the schema you copied from.** I transcribed both attribute tables by
hand from upstream YAML, which is a fine way to build them and a terrible way to
keep them. Upstream publishes machine-readable registries; a test that compares
your tables against them turns silent staleness into a build failure. Mine
passes today, which I would not have bet on before writing it.

---

[genai-interlingua][repo] does all four, across six instrumentation dialects.
There is a [browser demo][demo] if you want to see it work before installing
anything; source and Collector configuration are in the repository, and there
are [binaries on the releases page][releases] for the usual six platforms.

Two things in it go further than this post does. The
[moving-target write-up][mt] is the long version of the schema argument, with
the full timeline and what happens to everyone the day that repository finally
tags something. And [what capturing the real libraries found][findings] is what
happened when I stopped trusting my own fixtures and recorded spans from the
libraries actually running: five of seven captures turned up a mapping bug that
a completely green test suite could not see, including one in OpenTelemetry's
own instrumentation output.

[repo]: https://github.com/Grace/genai-interlingua
[demo]: /demos/genai-interlingua/
[releases]: https://github.com/Grace/genai-interlingua/releases
[mt]: https://github.com/Grace/genai-interlingua/blob/main/docs/moving-target.md
[findings]: https://github.com/Grace/genai-interlingua/blob/main/docs/findings.md
