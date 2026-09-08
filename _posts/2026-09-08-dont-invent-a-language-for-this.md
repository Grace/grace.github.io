---
layout: post
title: "Don’t invent a language for this"
subtitle: "The obvious next step after normalizing LLM telemetry is a config format for the mappings, and a standard to submit it to. One of those is a mistake, one is real, and they are not the ones you would guess."
description: "Should telemetry normalization have its own DSL, and should the mappings be standardized? OTTL already exists and half the rules cannot be data in any format. The gap worth standardizing is cross-registry equivalence with value transforms, and a vocabulary for what a translation cost."
date: 2026-09-08 09:00:00 -0400
---

[Last post][prev] I argued that GenAI instrumentation libraries each spell the
same facts differently, that you should normalize them at the pipeline, and that
whatever your normalizer cannot carry should be written onto the span rather
than dropped in silence.

Two questions came back, and they are the right two. Should the mappings become
a format — JSON, a small DSL, something SPL-shaped — instead of code? And should
this be a standard, submitted to somebody?

The short answers are no and yes. But the *no* is more interesting than it
sounds, and the *yes* is not about the thing you would standardize first.

## Three layers that keep getting conflated

Normalizing telemetry is three separable things, and almost every conversation
about it slides between them mid-sentence.

**The rules.** `llm.token_count.prompt` and `gen_ai.usage.input_tokens` are the
same fact. That is data. It is a table.

**The execution.** Something has to actually rewrite the span, in a pipeline, at
volume, without dropping anything.

**The claim.** An assertion that the two names *are* the same fact, that
translating between them costs nothing — or costs exactly this much — and that
the assertion is auditable by somebody who was not there when it was made.

The industry has quietly settled the second layer several times over, privately,
inside each vendor's ingest. It has never published the third. Arize AX rewrites
inbound `gen_ai.*` attributes into OpenInference before your spans are stored.
That is a defensible product decision and I am not picking on them; the point is
that you cannot read the mapping, cannot version it, and cannot find out what it
discarded. Every backend is doing some version of this and none of them will
show you the table.

So: which layer would a new language be for?

## The rules should be data. That is not the same as a new format.

I went and did this to my own code, which is the only honest way to find out
what it costs.

`genai-interlingua` had two halves that both looked like tables and only one of
which was. The schema half — which attribute name each convention version uses,
which values it admits — is now *generated* from the registries OpenTelemetry
publishes, rather than transcribed by me. That was straightforwardly correct and
I should have done it first. The derivation turned out to be a rule with one
exception: the attribute key is `gen_ai.` plus the field name, except for the
token-cache field that v1.41.0 spells `cache_creation` and the new repository
spells `cache_write`. Fifty keys and seventy-two keys, reproduced exactly. The
hand-typed tables had been right, which I would not have bet on.

The mapping half is where it gets interesting. I converted one dialect's rules
from Go calls into a declared table, and the split fell out at almost exactly
half. Twenty mappings state cleanly as data: read this key, lowercase it, run it
through this lookup, write it there. The rest do not, and they do not fail to be
data in a way a better format would fix.

Consider reassembling `gen_ai.prompt.0.tool_calls.1.arguments` — two levels of
indexing — into one nested JSON document. Or deciding what `traceloop.entity.name`
means by looking at whether a sibling attribute says this span is an agent or a
tool. Or refusing to map a Braintrust span carrying three evaluation scores,
because the conventions model one evaluation per span and picking one silently
would be worse than admitting the mismatch.

Those are not transformations of a value. They are *readings of a span*. A
format expressive enough to state them has conditionals, loops and a JSON parser
— at which point you have written a programming language, and a worse one than
the several already available.

## And one of those already exists

OTTL — the OpenTelemetry Transformation Language — is a DSL for exactly this,
governed by OpenTelemetry, shipped in every Collector distribution, running in
production at a scale mine never will. Proposing a new config format for
telemetry rewriting in 2026 means proposing to compete with it. That is a bad
trade for a mapping table.

The better move is the opposite one: emit OTTL. So `genai-interlingua` now does.

```console
$ interlingua -emit ottl -dialect litellm -target v1.41.0
```

Out comes a `transform` processor you paste into your own Collector. No custom
build, no Go, no dependency on my repository continuing to exist. A stock
Collector accepts it; I checked, in both target schemas, because a generated
config that has only ever been compared against a golden file has not been
tested, it has been photographed.

And because the export is a subset, it says so in its own header:

```yaml
# WHAT THIS CARRIES (20 attributes)
# ...
# WHAT THIS CANNOT CARRY (4 attributes)
#
#   gen_ai.input.messages
#   gen_ai.output.messages
#   gen_ai.response.finish_reasons
#   gen_ai.tool.definitions
```

Three things do not survive the trip. The unstated mappings, above. Per-span
loss accounting, because `interlingua.lossy` is computed from what a given span
turned out to carry and a static config can only describe itself. And detection:
picking a dialect means scoring every candidate across the whole span and taking
the maximum, and OTTL has neither a loop nor an argmax. An exported config is
pinned to one library and scoped by the spellings only that library uses.

That last one is a genuine limit, not a gap to fill later. It is also the
smallest of the three.

The rule I would give anyone else: **if your mapping can be stated as data,
state it as data, then hand the data to a language somebody else maintains.**
Keep code for the rules that are readings rather than transformations, and be
loud about which is which. My compiler cannot tell those apart, so a test does —
it runs every captured span through the parser and fails the build if any field
comes out that is neither declared as a rule nor admitted as unstateable.
Without it, the next mapping I add as a method quietly disappears from the
export while the header still claims completeness.

## So what would you standardize?

Not the mapping table. That is data with a shelf life. OpenInference
instrumentations already dual-emit `gen_ai.*`; the conventions are stabilizing;
in two years the dialect tables are archaeology. A standards body should not be
asked to ratify a compatibility shim for a problem that is actively dissolving.

The durable thing is the third layer — the claim — and it is genuinely missing.
Here is what exists today and what each artifact can say:

| | can express | cannot express |
| --- | --- | --- |
| [Telemetry Schema File 1.1.0][sf] | `rename_attributes`, `rename_events`, `rename_metrics`, metrics-only `split` | value rewriting, unit or type change, flattening, translation between vendors |
| [Weaver `schema-changes`][wsc] | added / renamed / obsoleted, within one registry's own lineage | value-level transforms, cross-registry mappings |
| [Weaver registries][wr] | third-party registries, dependencies, layering | equivalence claims *between* sibling registries |
| OTTL | all of it, imperatively | a portable, reviewable claim about equivalence and fidelity |

The gap is the same shape in every row. You can rename an attribute. You cannot
say that `bedrock` and `aws.bedrock` are the same provider, that milliseconds
and seconds are the same duration, or — the one I care about most — that a
particular translation was *not faithful*, and in exactly which respect.

I stopped asserting that and measured it. `genai-interlingua` now emits schema
files too, and [the resulting gap table][gap] is generated from the rule tables
rather than written by me. The blunt version: for LiteLLM at v1.41.0, a schema
file expresses **zero** of the mappings. At `genai-main` it manages one. Not
because the format is bad — because every transformation it has changes a
*name*, and the two mappings LiteLLM actually needs change a *value*. Eighteen
of the rest need no rename at all, since LiteLLM already writes the conventions'
own names, and counting those as coverage would credit the format for work
nobody did.

That measurement also cost me half my argument, which is the useful part. Most
of what a schema file cannot carry, it cannot carry because the work is a
reading of a span — and no declarative format should try to express that.
Adding value transforms would not make schema files sufficient for normalizing
GenAI telemetry. It would make them able to describe migrations the conventions
have *already made*, which is a narrower claim and the only one the evidence
supports. I would rather find that out generating a table than in review.

Two things are worth writing down:

**Cross-registry equivalence with value transforms.** Not just "this key became
that key" but the lookup, the unit, the coercion.

**A fidelity vocabulary.** A way to record, on the telemetry itself, which
schema it was translated from, which it was translated to, what could not be
carried, and — when the source convention was inferred rather than declared —
how confident that inference was. I have been emitting a private version of this
for months. It has no business being private. It generalizes far past GenAI:
every semantic-convention migration, every vendor's ingest pipeline, the whole
HTTP attribute rename wave, has the same unanswerable question sitting under it.

And the ground is explicitly reserved. [OTEP 0152][otep], which introduced
telemetry schemas in the first place, says the transformation set was held to
"the bare minimum … with more types of transformations potentially proposed in
the future," and that changing the file format version **must** go through the
OTEP process. That is not a wall. That is a door with a sign on it.

## Who you submit it to

OpenTelemetry. Three different places, depending on which piece:

- The GenAI mapping work, and the missing schema URL, go to
  [`semantic-conventions-genai`][genai] — whose README still reads
  `Schema URL: TODO`, which is a fair summary of the situation.
- Cross-registry composition is [Weaver][weaver]'s territory, and Weaver is
  actively building multi-registry layering right now.
- A change to the schema file format is an OTEP, filed in the specification
  repository's `oteps/` directory. Note that the standalone `oteps` repo was
  archived in November 2025; proposals moved.

Not W3C — they own trace *context*, the propagation format on the wire, not
attribute semantics. Not IETF. Not CNCF directly, which hosts OpenTelemetry but
does not review its specs. And not a bilateral deal with the instrumentation
vendors, who have entirely rational product reasons to keep their own
vocabularies.

One more thing, which is the part nobody puts in the "how to contribute" guide:
**the order matters more than the document.** An OTEP filed cold by someone with
no history in the project is a document that gets politely queued. The sequence
that works is to ship the thing, get a couple of real users, open an issue
describing the problem rather than your solution, show up to the SIG call twice
before proposing anything, and file small useful patches first. The spec comes
last, if it comes at all. I am at the beginning of that, not the end of it, and
I would rather say so than write this post as though the standard were already
in flight.

## The short version

Don't build a language; one exists, and half your rules were never going to be
data anyway. Do make the statable half statable, and export it into the language
somebody else maintains. Do not try to standardize your mapping table.

Do standardize the thing nobody currently can say: *this telemetry was
translated, here is from what and to what, and here is precisely what did not
survive.*

Both proposals are [drafted in the open][drafts] and neither is filed, which is
the honest state of them. The second one is visibly weaker than the first, and
its own draft says so.

A translation layer that drops data silently is worse than no translation layer,
because you will trust the result. That is true of my normalizer, it is true of
your vendor's ingest pipeline, and right now neither of us has a standard way to
tell you which.

[prev]: /2026/09/07/normalizing-llm-telemetry/
[gap]: https://github.com/Grace/genai-interlingua/blob/main/docs/export-gap.md
[drafts]: https://github.com/Grace/genai-interlingua/tree/main/docs/oteps
[repo]: https://github.com/Grace/genai-interlingua
[sf]: https://opentelemetry.io/docs/specs/otel/schemas/file_format_v1.1.0/
[wsc]: https://github.com/open-telemetry/weaver/blob/main/docs/schema-changes.md
[wr]: https://github.com/open-telemetry/weaver/blob/main/docs/define-your-own-telemetry-schema.md
[otep]: https://github.com/open-telemetry/opentelemetry-specification/blob/main/oteps/0152-telemetry-schemas.md
[genai]: https://github.com/open-telemetry/semantic-conventions-genai
[weaver]: https://github.com/open-telemetry/weaver
