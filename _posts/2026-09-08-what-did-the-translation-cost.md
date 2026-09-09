---
layout: post
title: "Your telemetry was rewritten on the way here"
subtitle: "Collectors normalize it, backends remap it at ingest, schema files convert it between versions. All of that is load-bearing and none of it leaves a trace. There is no standard way for telemetry to say it was translated, or what the translation cost."
description: "Telemetry is rewritten constantly in transit — by collectors, by schema files, by vendor ingest pipelines — and none of it can say so. A proposal for recording translation provenance: what it was translated from, to what, and precisely what did not survive."
date: 2026-09-08 02:08:31 -0400
---

> **Added 2026-09-09.** When I wrote this I was arguing from my own normalizer.
> It turns out the strongest evidence for the argument is in someone else's:
> [`processor/genainormalizer`][gnorm], which ships in `otelcol-contrib`, drops
> what it cannot carry — by design, and it says so in its own source. From
> `internal/otelsemconv/coerce.go`: *"src cannot be safely coerced; callers must
> drop the attribute"* and *"Map / Slice / Bytes: do not stringify. Caller drops
> the rename."* With its `remove_originals: true` the source attribute is deleted
> too, so the evidence goes with the data. That is not a criticism of a component
> I am now [contributing to][upstream]. It is the point of this post, written by
> someone else, in a comment, where no query can reach it.

Here is a span attribute: `gen_ai.usage.input_tokens: 412`.

You cannot tell, from that, whether the library emitted it that way. It might
have been renamed from `gen_ai.usage.prompt_tokens` by a collector. It might have
been translated from `llm.token_count.prompt` by something that also dropped
three attributes it had nowhere to put. It might have been rewritten at ingest by
your vendor, into or out of a vocabulary you never chose. All four produce a span
that looks exactly like this one.

That is not a hypothetical about a thing that might start happening. It is a
description of a Tuesday.

## Everything rewrites telemetry

Four layers, all doing it now, none of them exotic:

**A collector normalizes vendor attributes.** This is the recommended practice.
It is what the `transform` processor is for and what I spent [the last two
posts][prev] building.

**A backend remaps at ingest.** Arize AX converts inbound `gen_ai.*` attributes
into OpenInference before your spans are stored. That is documented and
defensible, and it means the attribute names you query are not the attribute
names you sent.

**A schema file converts between versions.** OpenTelemetry has a whole mechanism
for this: [telemetry schemas][schemas], applied in the collector, renaming
attributes as conventions evolve.

**A migration is bridged.** When the HTTP conventions renamed half their
attributes, everybody ran something in the middle for a year.

Every one of these is a good idea. Together they mean the telemetry arriving in
your backend has been through an unknown number of rewrites, by an unknown set of
implementations, losing an unknown amount on the way — and there is no standard
way for any of them to say so.

## `schema_url` answers a different question

The nearest existing mechanism is `schema_url`, and it is worth being precise
about why it does not cover this.

`schema_url` says which version of a schema the telemetry *claims to conform
to*. That is useful. It is not the same as saying a conversion happened, which
direction it went, what the source vocabulary was when the source was not a
schema version at all, or what the conversion could not carry.

And it is absent exactly when it would help most. The GenAI semantic conventions
currently have no released version to point at — the attributes were deprecated
out of the main repository and moved to one that has never tagged anything — so
there is no URL to put there. That is not an edge case I went looking for; it is
the situation that made me build a normalizer in the first place.

## The failure this produces

> A translation layer that drops data silently is worse than no translation
> layer, because you will trust the result.

That sentence is the whole argument and I would like to defend it with something
other than assertion.

While building the thing, I recorded on every rewritten span the list of keys
that span was *not* a faithful carrier of. Not a log line — an attribute, next to
the data, queryable. It is the least glamorous feature in the repository.

Five of seven captures of real instrumentation libraries turned up a mapping bug
that a completely green test suite could not see. Every one was found by reading
that list and asking why something was on it. The suite was green because the
tests encoded the same misunderstanding the code did. The loss list was the only
artifact that disagreed with me.

Then it did it again, in the export path. A generated OTTL config that parsed
cleanly in a real collector turned out to carry less than its own header claimed,
and I only found out by running both implementations over the same spans and
diffing the results — which is, again, just the question "what did this
translation cost" asked mechanically.

I am not claiming the idea is clever. I am claiming it is the only part of the
system that has ever told me I was wrong.

## What to record

Six attributes. No file format changes, no SDK work, no new parser — a namespace
and a convention:

| | |
| --- | --- |
| **source** | The vocabulary the telemetry arrived in. A schema URL when there is one; otherwise an identifier, because the common case is that the source declared nothing. |
| **source confidence** | How decisive the identification was, when it was inferred rather than declared. |
| **target** | What it was translated into. |
| **lossy** | The keys this telemetry is *not* a faithful carrier of. |
| **lossy count** | The length of that list, **written even when zero**. |
| **by** | Which implementation did it, when several implementations of one mapping exist and they do not all carry the same amount. |

Two of those deserve defending, because both look redundant.

**The count, when it is zero.** "This translation lost nothing" and "nobody
checked" are different claims and an absent array cannot tell them apart. Writing
zero is an assertion. It is also the difference between a dimension your backend
will aggregate over and one it will not — "which service is losing the most in
translation" should be a query, not an afternoon.

**The confidence.** In practice the source is almost never declared.
Instrumentation libraries do not stamp their own name on spans, so anything
handling more than one has to *infer* which it is looking at from the shape of
the attributes. That inference is usually easy and occasionally a coin flip. An
inference recorded without its confidence is indistinguishable from a fact.

## What this deliberately is not

It is not a way to describe the mapping. That is a much larger proposal, it
[belongs to a different argument][prev], and it is considerably less likely to
go anywhere.

This one is only: telemetry that has been translated should be able to say so.
Worth doing even if no transformation format ever changes, because the
translations are happening right now, in collectors and OTTL configs and vendor
ingest pipelines, and not one of them can leave a trace.

## Where it goes

OpenTelemetry, and specifically the Semantic Conventions SIG — this is an
attribute convention, not a protocol change. Not W3C, who own trace *context*,
the propagation format on the wire, and not attribute semantics. Not IETF.

I have [drafted it][otep] and **not filed it**, which I would rather say plainly
than let a directory called `oteps/` imply otherwise. The order that works for
this kind of thing is: ship it, get a couple of real users, open an issue
describing the problem rather than your solution, show up to the SIG call twice
before proposing anything, file small useful patches first. The document comes
last, if it comes at all. An OTEP filed cold by somebody with no history in a
project is a document that gets politely queued, and that is a reasonable thing
for a project to do with it.

What exists today is the running version, under a namespace named after my own
tool — which is exactly what a shared convention must not be, and why the draft
proposes a neutral one. It is published as a [Weaver registry][registry] that
`weaver registry check` validates, so it can be resolved and depended on without
adopting a line of my code.

That is a different conversation from a proposal that exists only as prose. It is
not yet the conversation, and I would rather be at the beginning of it honestly
than describe it as further along.

[prev]: /2026/09/08/dont-invent-a-language-for-this/
[schemas]: https://opentelemetry.io/docs/specs/otel/schemas/
[otep]: https://github.com/Grace/genai-interlingua/blob/main/docs/oteps/0001-translation-provenance.md
[registry]: https://github.com/Grace/genai-interlingua/tree/main/registry
[gnorm]: https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/processor/genainormalizerprocessor
[upstream]: https://github.com/Grace/genai-interlingua/blob/main/docs/upstream.md
