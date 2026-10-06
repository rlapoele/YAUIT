# 2026-10-06: Product direction

## Conclusions

- The primary user is comfortable with vanilla HTML and JavaScript and wants less plumbing.
- Direct `<script>` usage without a build step is first-class; package managers, TypeScript, bundlers, and optimization are optional.
- YAUIT consumes and activates HTML independently of whether CSR, SSR, SSG, or a hybrid produced it.
- The primary authoring concept is an HTML-defined presentation unit with an explicit contract and optional registered JavaScript behaviors.
- Presentation and behavior remain separate. Static presentation units require no JavaScript.
- A small activation kernel plus optional capabilities is preferred over a complete framework.
- Atomic-design-style composition should be possible but not prescribed.
- Arbitrary inline JavaScript is outside the direction; declarative connections to registered capabilities remain possible.
- Application processes are distinct from presentation-unit behaviors and should not directly own view manipulation.

## Unresolved

- The exact definition and boundary of a presentation unit.
- The roles of existing DOM subtrees, `<template>`, custom elements, and fragments.
- Contract vocabulary and syntax.
- Behavior registration and lifecycle.
- Communication among composed units and application processes.

## Records affected

- [Vision](../vision.md)
- [Principles](../principles.md)
- [Glossary](../glossary.md)
- [Roadmap](../roadmap.md)
- [ADR-001](../decisions/ADR-001-html-presentation-units-and-behaviors.md)
- [Concept brief](../ideas/html-presentation-units.md)
