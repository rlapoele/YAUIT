# 2026-10-07: Presentation-unit repetition

## Conclusions

- Application-level decomposition remains the developer's choice; YAUIT does not require every structural wrapper or empty state to be a presentation unit.
- HTML declares repeated presentation structure, while JavaScript supplies the collection.
- `data-repeat` on an ordinary element repeats that single-root element blueprint.
- `<template data-repeat>` repeats a multi-root fragment blueprint.
- An arbitrary element will not be removed merely because it has a proposed `data-fragment` attribute.
- Repetition creates a persistent logical region that can own zero or more iterations and support later rerendering without a visible wrapper.
- A named `data-outlet` and `data-part` binding or reference mechanism are not required by the accepted repetition model.

## Unresolved

- The JavaScript API that supplies a collection to a repeat declaration.
- Snapshot replacement versus keyed reconciliation and instance preservation.
- Internal repeat-region boundary and ownership mechanics.
- Syntax for repeatedly using a separately defined presentation unit.
- Conditional presentation, including empty, loading, and error states.
- The broader presentation-unit declaration and use grammar.

## Records affected

- [Current state](../current.md)
- [Glossary](../glossary.md)
- [Roadmap](../roadmap.md)
- [ADR-002](../decisions/ADR-002-declare-repetition-with-element-and-template-blueprints.md)
- [Concept brief](../ideas/html-presentation-units.md)
