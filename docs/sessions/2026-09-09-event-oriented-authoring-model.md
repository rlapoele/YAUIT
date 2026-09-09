# Event-oriented authoring model

- **Date:** 2026-09-09
- **Topic:** Intended YAUIT authoring experience

## Conclusion

Accepted an event-oriented DOM activation model. HTML declares native-interaction-to-domain-event translations and domain-event-to-presentation-action relationships. JavaScript owns behavior, data processing, state transitions, effects, validation, and rendering implementations. HTML does not bind directly to application state paths or model properties.

The model is rendering-origin agnostic: server-rendered, statically generated, incrementally generated, and client-rendered HTML can carry the same declarations. This compatibility does not require YAUIT to implement those rendering strategies.

See [ADR-002](../decisions/ADR-002-event-oriented-dom-activation.md).

## Open questions

- Define the `data-emit` syntax, payload, cancellation, and diagnostic contract.
- Define domain-event routing and application scopes.
- Define the `data-on` presentation-action contract.
- Define lifecycle and cleanup behavior.
