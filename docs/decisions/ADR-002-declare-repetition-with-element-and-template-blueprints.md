# ADR-002: Declare repetition with element and template blueprints

- **Date:** 2026-10-07
- **Status:** Accepted

## Context

YAUIT needs to express that a piece of presentation is instantiated once for every value in a collection. HTML should declare the repeated presentation structure, while JavaScript should supply and understand the collection without embedding application-data expressions in HTML.

Repetition must support a normal single-root element and a multi-root fragment. It must also leave room for later rerendering without requiring a visible wrapper.

## Decision

`data-repeat` identifies a repetition blueprint:

```html
<li data-repeat>...</li>
```

On an ordinary element, the element itself is the single-root blueprint.

```html
<template data-repeat>
  <dt>...</dt>
  <dd>...</dd>
</template>
```

On `<template>`, the template contents are a multi-root fragment blueprint. YAUIT will not introduce a general `data-fragment` convention that unwraps an arbitrary HTML element.

Every repeat declaration creates a persistent logical repeat region. The region owns zero or more iterations and remains addressable after an empty collection or rerender, regardless of whether it has a visible wrapper. The mechanism used to track that region is not decided.

HTML declares the blueprint and repetition location. JavaScript supplies the collection and performs any application-data-to-presentation work.

## Alternatives considered

### Require `<template data-repeat>` for every repetition

This provides a native inert marker but adds unnecessary ceremony when a single element is the complete blueprint. Rejected as the only syntax.

### Use an arbitrary element with `data-fragment`

YAUIT could remove the wrapper and repeat its children. Rejected because the wrapper participates in parsing, semantics, accessibility, styling, and layout before removal; its attributes would have ambiguous meaning; and removing it would not by itself preserve a rerender boundary.

### Declare collection expressions in HTML

Syntax such as `data-for="todo in todos"` would require data scopes and an expression language. Rejected from the current direction because application-data knowledge remains in JavaScript.

## Consequences

- Single-root repetition is concise and resembles the intended resulting DOM.
- Multi-root repetition uses the web platform's native inert fragment primitive.
- Implementations must preserve logical repeat-region ownership even when no visible wrapper exists.
- The JavaScript collection API, presentation callback contract, snapshot-versus-keyed update semantics, and internal boundary mechanism remain open.
- Named-unit use syntax, conditional presentation, empty states, and asynchronous states remain separate questions.
- `data-outlet`, `data-part`, and a general `data-fragment` are not introduced by this decision.

## Standards basis

- The HTML Standard defines [`template`](https://html.spec.whatwg.org/multipage/scripting.html#the-template-element) as a declaration of clonable HTML fragments that represents nothing when rendered.
- The DOM Standard defines [ranges](https://dom.spec.whatwg.org/#ranges) as content between boundary points; this is relevant background but does not prescribe YAUIT's internal region mechanism.

## Related records

- [ADR-001](ADR-001-html-presentation-units-and-behaviors.md)
- [Concept brief](../ideas/html-presentation-units.md)
- [Session record](../sessions/2026-10-07-presentation-repetition.md)
