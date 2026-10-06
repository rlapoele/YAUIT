# 2026-10-07: Presentation-unit repetition

## Conclusions

- Application-level decomposition remains the developer's choice; YAUIT does not require every structural wrapper or empty state to be a presentation unit.
- `<template data-unit="name">` declares a named reusable presentation-unit blueprint.
- `data-use="name"` requests an instance of the matching named unit.
- A `<template data-use>` declaration is consumed during activation; it is not retained as a component host or element-level runtime marker.
- Any internal boundary retained for a wrapper-free instance must create no rendered box and must not participate in ordinary element-based CSS selection; its exact mechanism remains open.
- A presentation unit is a template-oriented composition concept, while a component has a persistent runtime identity through which it may own presentation, lifecycle, behavior, or a public interface.
- Combining `data-use` and `data-repeat` requests repeated instances of a named unit, with JavaScript supplying the collection.
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
- Internal non-element boundary and ownership mechanics for consumed `<template data-use>` declarations.
- Unit-name grammar, resolution scope, missing and duplicate definitions, and cycle handling.
- Whether an ordinary `data-use` host is replaced, populated, or supports an explicit choice.
- Conditional presentation, including empty, loading, and error states.
- The broader presentation-unit declaration and use grammar.

## Records affected

- [Current state](../current.md)
- [Glossary](../glossary.md)
- [Roadmap](../roadmap.md)
- [ADR-002](../decisions/ADR-002-declare-repetition-with-element-and-template-blueprints.md)
- [ADR-003](../decisions/ADR-003-declare-and-use-named-presentation-units.md)
- [Concept brief](../ideas/html-presentation-units.md)
