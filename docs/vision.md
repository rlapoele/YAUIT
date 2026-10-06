# Vision

YAUIT should help developers who are comfortable with vanilla HTML and JavaScript build web interfaces with less plumbing.

It should let them define and compose presentation units with standard HTML, including `<template>` and a restrained set of declarative attributes, then connect those units to separately implemented JavaScript behaviors through explicit contracts.

The `<script>`-tag workflow must be first-class and require no build step. npm, TypeScript, bundlers, and optimizers may remain optional. YAUIT should activate HTML regardless of whether it was produced by CSR, SSR, SSG, or a hybrid rendering strategy rather than owning those strategies.

Presentation units may be static and need no JavaScript. Interactive units should keep appearance and structure separate from behavior and data processing. YAUIT should not require a framework-wide state container.

The initial direction is a small activation and composition kernel with optional capabilities, not a complete application framework.

See [ADR-001](decisions/ADR-001-html-presentation-units-and-behaviors.md) for the accepted direction and [the concept brief](ideas/html-presentation-units.md) for assumptions still requiring validation.
