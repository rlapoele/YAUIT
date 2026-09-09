# ADR-005: Restrict `data-on` to presentation actions

- **Date:** 2026-09-09
- **Status:** Accepted

## Context

YAUIT needs to define what may appear on the right-hand side of a `data-on` declaration. Allowing arbitrary functions, application services, or business commands would make HTML responsible for application workflow and weaken the event-oriented boundary established in [ADR-002](ADR-002-event-oriented-dom-activation.md).

The decision must also clarify where application state changes occur. A native interaction translated by `data-emit` is an input to the application; it is not itself a state mutation. Likewise, reflecting an event in the DOM is a presentation concern rather than a domain operation.

## Decision

`data-on` will relate a domain event only to a registered presentation action. The element carrying `data-on` is the presentation target. The action is resolved through the owning runtime rather than through a global function registry.

Presentation actions may update the DOM and browser presentation concerns such as accessibility state, focus, and animation. They do not own domain decisions, persistence, application workflows, or application-state mutation.

Neither `data-emit` nor `data-on` mutates application state:

- `data-emit` is a DOM input adapter that publishes a domain event.
- An application-owned process or use case consumes relevant events, applies business rules, coordinates persistence or state changes, and may publish resulting domain events.
- `data-on` is a DOM output adapter that invokes a presentation action in response to a domain event.

Application processes are installed through JavaScript composition and remain usable without YAUIT or the DOM. Their eventual registration API is outside this decision. Low-level event subscription remains available for non-presentation consumers and exceptional integration needs.

The accepted `data-on` mapping form is:

```text
<domain-event> -> <presentation-action>[; ...]
```

Each mapping relates one domain-event type to one presentation-action name. Semicolons permit multiple mappings on the same element. The left-hand side uses the domain-event naming rules established in [ADR-003](ADR-003-publish-declarative-domain-events-through-runtime-hub.md). The right-hand side is a stable key in the owning runtime's action registry, such as `todo-list.render`; it is not a global JavaScript function reference, a function call, or an expression.

Action registration, invocation arguments, ordering, initialization, modifiers, failure handling, scope, and lifecycle remain to be decided.

## Consequences

- HTML cannot invoke arbitrary application services or business behavior.
- Action names remain stable across JavaScript module organization and do not expose functions globally.
- Presentation wiring can be declarative without coupling markup to application state or workflow.
- Application state may change in response to DOM interaction or non-DOM sources such as initial loading, server messages, timers, and other application processes.
- YAUIT can automate presentation subscription and cleanup while retaining a low-level publish-subscribe API.
- Application authors still implement their business operations, but repetitive hub subscription should not be required as the ordinary process-registration experience.
