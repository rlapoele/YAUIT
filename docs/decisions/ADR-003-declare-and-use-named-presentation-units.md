# ADR-003: Declare and use named presentation units

- **Date:** 2026-10-07
- **Status:** Accepted

## Context

Developers need to declare that some HTML is a reusable presentation blueprint that should remain inert until requested. They also need a declarative way to request an instance of that blueprint from other HTML.

The web platform's `<template>` element already provides inert, clonable HTML contents without a rendered wrapper.

## Decision

A named reusable presentation-unit definition is declared with a `<template>` carrying `data-unit`:

```html
<template data-unit="todo-list-item">
  <li>...</li>
</template>
```

The `data-unit` value is the unit's name. The template remains inert and provides the blueprint for instances.

A `data-use` declaration requests an instance of a named unit at its location:

```html
<template data-use="todo-list-item"></template>
```

The `data-use` value resolves to a matching `data-unit` definition. Combining `data-use` with `data-repeat` requests repeated instances of the named unit, with the collection supplied by JavaScript:

```html
<template data-use="todo-list-item" data-repeat></template>
```

This decision establishes the declaration and reference vocabulary. It does not decide whether `data-use` may appear on every element, whether an ordinary use-site host is replaced or populated, or how names are scoped and validated.

## Alternatives considered

### Display reusable markup directly and extract it during activation

This would expose definition markup before activation and require YAUIT to remove or hide it. `<template>` already provides the required inert semantics, so a live definition element is unnecessary.

### Instantiate units only through JavaScript

This would avoid an HTML directive but would weaken the goal of declaring presentation composition in HTML. Rejected as the only use mechanism.

## Consequences

- Unit definitions are valid, inert HTML and need no build-time transformation.
- HTML can declare composition without embedding JavaScript or application-data expressions.
- `data-unit`, `data-use`, and `data-repeat` have distinct roles: definition, reference, and cardinality.
- Unit-name grammar, lookup scope, duplicate and missing-name diagnostics, nesting, cycle handling, and placement semantics require later specification.
- Conditional use remains a separate capability.

## Standards basis

- The HTML Standard defines [`template`](https://html.spec.whatwg.org/multipage/scripting.html#the-template-element) as a declaration of clonable HTML fragments that represents nothing when rendered.

## Related records

- [ADR-001](ADR-001-html-presentation-units-and-behaviors.md)
- [ADR-002](ADR-002-declare-repetition-with-element-and-template-blueprints.md)
- [Concept brief](../ideas/html-presentation-units.md)
- [Session record](../sessions/2026-10-07-presentation-repetition.md)
