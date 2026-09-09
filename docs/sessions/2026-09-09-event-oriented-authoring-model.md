# Event-oriented authoring model

- **Date:** 2026-09-09
- **Topic:** Intended YAUIT authoring experience

## Conclusion

Accepted an event-oriented DOM activation model. HTML declares native-interaction-to-domain-event translations and domain-event-to-presentation-action relationships. JavaScript owns behavior, data processing, state transitions, effects, validation, and rendering implementations. HTML does not bind directly to application state paths or model properties.

The model is rendering-origin agnostic: server-rendered, statically generated, incrementally generated, and client-rendered HTML can carry the same declarations. This compatibility does not require YAUIT to implement those rendering strategies.

The `data-emit` architectural contract was also accepted. A declaration translates a native event into a domain event published through the owning runtime's event hub rather than dispatched through the DOM. Modifiers concern only the native event. Domain payload structures are constructed and validated in JavaScript rather than declared as JSON in HTML.

One runtime owns one hub. Independent runtime instances are isolated by default; components and features do not receive separate hubs. Any future communication between independent hubs must be explicit.

See [ADR-002](../decisions/ADR-002-event-oriented-dom-activation.md) and [ADR-003](../decisions/ADR-003-publish-declarative-domain-events-through-runtime-hub.md).

## Open questions

- Define domain-event routing and application scopes.
- Define the `data-on` presentation-action contract.
- Define lifecycle and cleanup behavior.
- Select the initial closed set of native-event modifiers and finalize parsing diagnostics through the first experiment.
