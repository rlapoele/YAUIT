# HTML presentation units connected to JavaScript behaviors

## Problem statement

How might YAUIT let developers comfortable with vanilla HTML and JavaScript compose reusable interfaces with less plumbing, while preserving standard HTML, requiring no build step, and remaining independent of rendering strategy?

## Recommended direction

Treat an HTML-defined presentation unit as YAUIT's primary authoring concept. A unit can be static or can acquire separately implemented JavaScript behavior through a small, explicit, declarative contract.

Support this experience with a minimal DOM activation kernel. Package capabilities beyond activation and composition as optional additions rather than making YAUIT a complete application runtime.

HTML declares repeated presentation structure while JavaScript supplies the collection. An ordinary element with `data-repeat` is a single-root blueprint; `<template data-repeat>` supplies a multi-root fragment blueprint. Both create a persistent logical repeat region rather than requiring a rendered wrapper.

## Key assumptions to validate

- [ ] Standard HTML, `<template>`, and restrained `data-*` declarations can express useful composition without growing into a templating language.
- [ ] Named behavior registration and explicit contracts remain understandable at application scale rather than becoming string-based indirection.
- [ ] Activation and cleanup can be predictable for initial, server-produced, and dynamically inserted HTML.
- [ ] Useful applications can be built without requiring a YAUIT-owned global state container.
- [ ] The separation of presentation from behavior offers enough practical value for developers to choose it over inline-expression-oriented alternatives.

## Minimum experiment

After the presentation-unit and contract models are specified, validate one small interface containing:

- a static presentation unit with no behavior;
- a reusable `<template>` instantiated more than once;
- single-root and multi-root repeated blueprints supplied with collections from JavaScript;
- a registered local behavior attached declaratively;
- composed units with explicit communication;
- both initially rendered and dynamically inserted HTML.

The same HTML contract should remain valid when the initial markup is supplied statically or by a server.

## Not doing yet

- **A complete application framework** — it would obscure the core value and prematurely couple unrelated concerns.
- **A YAUIT rendering strategy** — YAUIT should consume HTML rather than require ownership of its production.
- **Arbitrary JavaScript expressions in HTML** — they weaken separation and complicate security, testing, and diagnostics.
- **A mandatory state container** — state is unavoidable, but central ownership by YAUIT is not yet justified.
- **Routing, persistence, and remote-fragment semantics** — these may become optional capabilities after the core model proves useful.
- **An imposed atomic-design taxonomy** — nested composition should support such methodologies without prescribing one.
- **Arbitrary removable fragment wrappers** — native `<template>` already represents an inert multi-root blueprint without introducing layout, parsing, or semantic ambiguity.

## Open questions

- What precisely qualifies as a presentation unit, and how is its boundary identified?
- Is `<template>` the primary definition mechanism, one of several mechanisms, or merely a native primitive YAUIT can use?
- What is the minimum useful contract: configuration, inputs, actions, outcomes, lifecycle, or some subset?
- How are nested presentation units isolated or coordinated?
- Which responsibilities belong to a local behavior versus an application process?
- How should registration work in both direct-script and ES-module usage?
- How does JavaScript identify a repeat declaration and supply its collection?
- Does a later collection replace all iterations or reconcile stable keyed instances?
- How is conditional presentation declared and controlled?
- What syntax refers to a separately defined unit from a repeat declaration?
