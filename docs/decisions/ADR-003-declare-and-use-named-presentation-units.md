# ADR-003: Declare and use named presentation units

- **Date:** 2026-10-07
- **Status:** Accepted

## Context

Developers need to declare that some HTML is a reusable presentation blueprint that should remain inert until requested. They also need a declarative way to request an instance of that blueprint from other HTML.

The web platform's `<template>` element already provides inert, clonable HTML contents without a rendered wrapper.

A use declaration is a composition instruction, not necessarily a component host. Retaining its `<template>` element after activation would create no rendered box, but it would remain an element in the document tree and could affect structural CSS selectors and element-oriented DOM traversal.

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

The `data-use` value resolves to a matching `data-unit` definition. During activation, YAUIT consumes a `<template data-use>` declaration and inserts the instantiated content at that logical location. The author-written `<template>` is not a persistent component host or runtime wrapper.

YAUIT may retain an internal logical boundary so that it can continue to own, replace, or update the instantiated nodes. Any runtime boundary used for a consumed `<template data-use>` must create no rendered box and must not participate in ordinary element-based CSS selection. The exact boundary mechanism remains an implementation question.

Combining `data-use` with `data-repeat` requests repeated instances of the named unit, with the collection supplied by JavaScript:

```html
<template data-use="todo-list-item" data-repeat></template>
```

This decision establishes the declaration and reference vocabulary. It does not decide whether `data-use` may appear on every element, whether an ordinary use-site host is replaced or populated, or how names are scoped and validated.

A presentation unit is template-oriented: its definition is a blueprint and its use produces an instance of that blueprint. Reuse, activation, or attachment of a behavior does not by itself make the instance a component. A component is a separate, broader construct with persistent runtime identity through which it may own presentation, lifecycle, behavior, or a public interface. It may use a retained host or a custom element, and YAUIT presentation units may be used to construct or populate it.

## Alternatives considered

### Display reusable markup directly and extract it during activation

This would expose definition markup before activation and require YAUIT to remove or hide it. `<template>` already provides the required inert semantics, so a live definition element is unnecessary.

### Instantiate units only through JavaScript

This would avoid an HTML directive but would weaken the goal of declaring presentation composition in HTML. Rejected as the only use mechanism.

### Retain `<template data-use>` as the runtime marker

Although `<template>` represents nothing when rendered, it remains an element in the document tree. Retaining it could change the meaning of selectors such as `:last-child`, `:only-child`, `:nth-child()`, sibling combinators, and `:empty`, as well as element-oriented DOM traversal. Rejected in favor of consuming the declaration and retaining only a non-element logical boundary if one is needed.

### Treat every presentation-unit instance as a component

This would impose component identity and lifecycle semantics on simple template composition. Rejected because wrapper-free presentation reuse should remain possible, while persistent components can be built separately and may use native custom elements.

## Consequences

- Unit definitions are valid, inert HTML and need no build-time transformation.
- HTML can declare composition without embedding JavaScript or application-data expressions.
- `data-unit`, `data-use`, and `data-repeat` have distinct roles: definition, reference, and cardinality.
- A `<template data-use>` declaration is consumed during activation and does not remain as an element-level CSS or DOM boundary.
- YAUIT must be able to track a wrapper-free unit instance as a logical region when later ownership or updates require it.
- Presentation units and components are related but distinct concepts; component semantics are not imposed on template composition.
- Unit-name grammar, lookup scope, duplicate and missing-name diagnostics, nesting, cycle handling, and placement semantics require later specification.
- Conditional use remains a separate capability.

## Standards basis

- The HTML Standard defines [`template`](https://html.spec.whatwg.org/multipage/scripting.html#the-template-element) as a declaration of clonable HTML fragments that represents nothing when rendered.
- Selectors Level 4 defines [tree-structural pseudo-classes](https://drafts.csswg.org/selectors/#structural-pseudos) in terms of the document's element tree and specifies that comment nodes do not affect [`:empty`](https://drafts.csswg.org/selectors/#the-empty-pseudo).

## Related records

- [ADR-001](ADR-001-html-presentation-units-and-behaviors.md)
- [ADR-002](ADR-002-declare-repetition-with-element-and-template-blueprints.md)
- [Concept brief](../ideas/html-presentation-units.md)
- [Session record](../sessions/2026-10-07-presentation-repetition.md)
