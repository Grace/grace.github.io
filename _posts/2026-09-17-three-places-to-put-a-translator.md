---
layout: post
title: "Three places to put a translator"
subtitle: "\"We are not maintaining a fork of the Collector so one vocabulary of spans can be renamed\" is a correct objection, and it ends most conversations about a processor. The way out is to stop shipping a binary and start shipping the decision."
description: "Where genai-interlingua runs: as a Collector processor, as a CLI beside the pipeline, or as config text executed by a stock otelcol-contrib that has never heard of it. Three deployments, one mapping decision, and the design property that makes that possible."
date: 2026-09-17 16:20:00 -0400
---

Every previous post here argued about what a translated span should say. This
one is about a duller question that decides whether any of it gets used: where
does the translator actually run?

The objection I keep hearing, and which is correct, goes like this. A platform
team has settled on `otelcol-contrib`. It is in their base image, it is pinned,
it is in their upgrade rota, and somebody has already argued about which
processors are enabled. Asking them to maintain a custom Collector build so one
family of spans can be renamed is asking for a permanent maintenance obligation
in exchange for a dashboard. The answer is no, and it should be no.

So there are three places this can run, and [the architecture page][arch] draws
all three. Two are ordinary. The third is the one worth talking about.

## A: in the path

Build `processor/genaiinterlingua` into your Collector distribution and put it
between the receiver and the exporter. This is the version with the maintenance
obligation, and it is the only one that gets to normalize spans the moment they
arrive. It is a separate Go module, so building it in does not drag the CLI's
dependencies along, and the core has none.

## B: beside the path

`interlingua` over captured OTLP JSON. This is how fixtures get built, how the
[conformance census][census] is regenerated, and how you find out what a library
actually emits rather than what its documentation claims. Five of seven captures
found something the docs-derived version had wrong, which is the entire reason
the fixtures are captured and not written.

## C: not in the path at all

`-emit ottl` prints a config for `transformprocessor`. `-emit schema-file`
prints a Telemetry Schema File for `schemaprocessor`. Both of those processors
are already in the binary that platform team is running.

So the mapping runs, in their pipeline, on their spans, under their upgrade
policy, and my code is not there. It ran once, on a laptop, to produce a text
file they read before applying.

That is not a trick. It is what happens when the thing you have to distribute is
a decision rather than an implementation.

## Why it works

`normalize.Span` does not mutate a span. It returns a `Result`: attributes to
set, attributes to remove, which dialect claimed the span, how big the winner's
margin was, and what the translation could not carry. A description of an edit,
not the edit.

The Collector processor takes that description and applies it to pdata. The CLI
applies the same description to OTLP JSON. The emitters render it as OTTL
statements or as schema-file transformations for somebody else to apply. Three
appliers, one decision, and a disagreement between them would be a bug rather
than a configuration difference.

The same property is why the mapping can be golden tested at all. You cannot
diff a mutation. You can diff a `Result`.

## What C gives up

I would rather measure this than wave at it. A Telemetry Schema File carries
less than the processor does, because the schema-file format can express a
rename and cannot express reassembling a nested message document out of indexed
keys. The size of that shortfall is [measured on the conformance page][conf],
per dialect, rather than described as "some limitations apply."

The honest summary is that row C is right for the renames, which is most of the
volume, and row A is right when you need the parts of the mapping that are more
than a rename. Knowing which one you are in is a question about your own
telemetry, and the CLI in row B is how you answer it without deploying anything.

## The part I actually care about

There is a general rule hiding in here, and it took me a while to see it.

A component that can only run as itself has to win a deployment argument before
it can be evaluated. A component that can emit its decision as somebody else's
configuration gets evaluated first and deployed only if it earns it. The second
kind is much harder to say no to, and it is also much harder to build, because
it forces the decision to be data all the way through rather than a pile of
`if` statements with side effects.

It is also why the differences between this and the [upstream
`genainormalizer`][gnorm] are going [upstream][upstream] rather than into a
competing component. If the useful part is the decision and not the binary, then
the decision belongs where the most people can run it, which is not here.

[arch]: /demos/genai-interlingua/architecture.html
[conf]: /demos/genai-interlingua/conformance.html
[census]: https://github.com/Grace/genai-interlingua/blob/main/docs/conformance.md
[gnorm]: https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/processor/genainormalizerprocessor
[upstream]: https://github.com/Grace/genai-interlingua/blob/main/docs/upstream.md
