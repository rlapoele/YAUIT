# Event-oriented authoring model

- **Date:** 2026-09-09
- **Topic:** Intended YAUIT authoring experience

## Conclusion

Accepted an event-oriented DOM activation model. HTML declares native-interaction-to-domain-event translations and domain-event-to-presentation-action relationships. JavaScript owns behavior, data processing, state transitions, effects, validation, and rendering implementations. HTML does not bind directly to application state paths or model properties.

The model is rendering-origin agnostic: server-rendered, statically generated, incrementally generated, and client-rendered HTML can carry the same declarations. This compatibility does not require YAUIT to implement those rendering strategies.

The `data-emit` architectural contract was also accepted. A declaration translates a native event into a domain event published through the owning runtime's event hub rather than dispatched through the DOM. Modifiers concern only the native event. Domain payload structures are constructed and validated in JavaScript rather than declared as JSON in HTML.

One runtime owns one hub. Independent runtime instances are isolated by default; components and features do not receive separate hubs. Any future communication between independent hubs must be explicit.

Clarified that YAUIT uses the DDD meaning of domain event: it is a record of something that has already occurred. A `requested` event records the occurrence of a user or business request, while a later event records whether the requested outcome was established, rejected, or failed. Commands and technical runtime notifications are separate concepts.

Completed the initial `data-emit` contract. It uses semicolon-separated, validated `<native-event>[.<modifier>...] -> <domain-event>` mappings. The first modifier set is `.prevent`, `.once`, and `.self`. A synchronous JavaScript payload builder associated with the domain-event type returns immutable plain structured data; HTML carries no domain payload structure. Invalid syntax, payload construction, and contract violations produce structured diagnostics. Keyboard filters, debounce, throttle, and conditional expressions or filters are recorded as future considerations rather than initial capabilities.

Accepted a persisted, filterable todo-item management system as the shared reference scenario for subsequent design work. The todo system will be a separate consumer of YAUIT and use a lightweight Clean Architecture with ports and adapters. Its application core must not depend on YAUIT, the DOM, or a persistence technology; an outer composition root will connect YAUIT and persistence adapters. Multiple list instances and both pre-rendered and dynamically inserted HTML will exercise routing and lifecycle decisions.

Added developer experience as an explicit design constraint: common usage should be concise and straightforward, with repetitive runtime plumbing handled by YAUIT. This convenience must not weaken the accepted boundaries around domain-event ownership, payload validation, application-state isolation from HTML, or rendering independence. Low-level APIs remain available for exceptional cases rather than becoming mandatory ceremony.

Started the `data-on` contract by restricting it to runtime-registered presentation actions. The declaring element is the presentation target. Neither declarative attribute mutates application state: `data-emit` adapts DOM input into a domain event, an application-owned process or use case makes business and state decisions, and `data-on` adapts a resulting domain event into presentation work. HTML cannot invoke arbitrary application services or business commands.

Accepted the initial `data-on` mapping form `<domain-event> -> <presentation-action>[; ...]`. Each mapping connects one event type to one stable action-registry key, such as `todo-list.render`. The action name is not a global function reference, function call, or expression. Registration and invocation semantics remain open.

See [ADR-002](../decisions/ADR-002-event-oriented-dom-activation.md), [ADR-003](../decisions/ADR-003-publish-declarative-domain-events-through-runtime-hub.md), [ADR-004](../decisions/ADR-004-use-decoupled-todo-reference-system.md), and [ADR-005](../decisions/ADR-005-restrict-data-on-to-presentation-actions.md).

## Open questions

- Define domain-event routing and application scopes.
- Define the `data-on` presentation-action contract.
- Define lifecycle and cleanup behavior.
- Revisit deferred `data-emit` filters and timing modifiers after the initial contract is exercised.
