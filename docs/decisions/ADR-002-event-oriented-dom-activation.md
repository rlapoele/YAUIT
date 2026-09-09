# ADR-002: Use an event-oriented DOM activation model

- **Date:** 2026-09-09
- **Status:** Accepted

## Context

YAUIT needs a clear boundary between what application authors express in HTML and what they implement in JavaScript. It should work with HTML produced through server rendering, static generation, client rendering, multi-page applications, single-page applications, or combinations of these approaches. It should not require application authors to adopt virtual-DOM reconciliation, a template compiler, or a build step.

## Options considered

1. Own rendering through framework-specific templates and data bindings to application state.
2. Use existing HTML as an event-oriented declaration surface and implement behavior and rendering in JavaScript.
3. Provide only imperative JavaScript APIs with no declarative HTML wiring.

## Decision

YAUIT will progressively activate existing HTML regardless of how that HTML was produced. Its HTML API will be event-oriented rather than data-binding-oriented.

HTML may declare:

- Translation from a native DOM interaction to a semantic domain event.
- A relationship from a domain event to a registered presentation action.

HTML will not refer directly to application state paths or model properties. JavaScript will own application behavior, data processing, state transitions, asynchronous effects, validation, and rendering implementations.

YAUIT will not require a virtual DOM, reconciliation loop, component compiler, reactive template language, or consumer build step. YAUIT may itself be authored using TypeScript and build tooling as long as it publishes browser-ready JavaScript.

Compatibility with server-side, static, incremental, and client-side rendering means that their resulting HTML can carry the same declarations and be activated by the browser runtime. It does not commit YAUIT to implementing those rendering systems.

## Consequences

- The declarative surface remains valid, inspectable HTML and can progressively enhance server- or client-produced DOM.
- Domain event contracts, rather than state-object structure, become the boundary between markup and application behavior.
- Registered presentation actions provide the JavaScript extension point for reflecting domain events in the DOM.
- Rendering algorithms and application state remain replaceable without rewriting HTML state expressions.
- Attribute syntax, event payloads, routing, scope, cancellation, diagnostics, and lifecycle still require separate decisions.
- Application authors who want automatic property-level bindings or framework-owned rendering will need to implement those behaviors as JavaScript presentation actions or use another tool.
