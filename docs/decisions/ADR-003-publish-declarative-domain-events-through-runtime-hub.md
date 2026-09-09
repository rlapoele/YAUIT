# ADR-003: Publish declarative domain events through a runtime hub

- **Date:** 2026-09-09
- **Status:** Accepted

## Context

The accepted authoring model lets HTML declare that a native DOM event should produce a semantic domain event. YAUIT needs to decide whether that domain event travels through DOM propagation, a global singleton bus, or an explicitly owned publish-subscribe facility. It also needs to decide whether HTML declares the domain payload structure.

## Options considered

1. Dispatch a `CustomEvent` from the declaring DOM element and use DOM bubbling, capturing, and composed-event behavior for domain routing.
2. Publish every domain event through one process-wide singleton bus.
3. Give each explicitly activated YAUIT runtime an event hub and publish declarative domain events through the owning runtime.

For payloads, the considered options were literal JSON in HTML, automatic inference from element types, or construction by registered JavaScript.

## Decision

Each YAUIT runtime will own one event hub. A `data-emit` declaration will translate a native event received for its element into a domain event published through that runtime's hub. Domain events will not use DOM bubbling or capturing as their default routing mechanism.

A domain event is always an immutable record of something that has occurred and matters in the application's domain. An event ending in `requested` records that a user or business request occurred; it does not assert that the requested outcome succeeded. Imperative commands and technical runtime notifications are not domain events.

Components and features installed in one runtime share its hub; they do not receive separate hubs. Independent runtime instances are isolated by default. If communication between independent hubs is later supported, it must use an explicit, directional, disposable bridge with an event allowlist rather than implicit global forwarding.

The declaring element and triggering native event may be retained as publication metadata for payload construction and diagnostics. They are not part of the domain payload contract by default.

The `data-emit` grammar will be validated and may contain modifiers. Modifiers apply only to the triggering native event; they do not change domain-event delivery. The exact initial modifier set and parsing diagnostics will be finalized through the first experiment.

YAUIT will not provide a generic `data-emit-detail` JSON payload attribute in the initial design and will not infer a payload from the source element's type. Registered JavaScript associated with the domain event contract will construct and validate the payload from the source element and native event. Ordinary HTML control values may provide interface input without exposing application state paths or domain payload property names in markup. A declarative event with no registered payload builder is payloadless.

## Consequences

- Domain routing is independent of DOM ancestry, shadow boundaries, and element relocation.
- One page can host isolated applications without accidental event sharing.
- Most applications can use one document-root runtime and experience the hub as application-wide without relying on a singleton.
- Runtime ownership, nested roots, logical scopes, and event visibility still require a routing decision.
- Web Components that expose public DOM `CustomEvent`s will require an explicit adapter to publish selected events into a runtime hub; selected hub events could likewise be exposed to the DOM through a future adapter.
- Dynamic payload construction remains testable JavaScript and can share validation with programmatic event publication.
- Simple payload-bearing controls require a JavaScript payload builder, trading some convenience for a smaller and more disciplined HTML API.
