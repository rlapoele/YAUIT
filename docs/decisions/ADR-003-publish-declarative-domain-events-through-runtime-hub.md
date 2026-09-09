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

The `data-emit` grammar is validated and may contain modifiers. Modifiers apply only to the triggering native event; they do not change domain-event delivery.

YAUIT will not provide a generic `data-emit-detail` JSON payload attribute in the initial design and will not infer a payload from the source element's type. Registered JavaScript associated with the domain event contract will construct and validate the payload from the source element and native event. Ordinary HTML control values may provide interface input without exposing application state paths or domain payload property names in markup. A declarative event with no registered payload builder is payloadless.

### Attribute grammar

The initial grammar is:

```text
data-emit="<native-event>[.<modifier>...] -> <domain-event>[; ...]"
```

- A semicolon separates mappings; a trailing semicolon is allowed.
- Whitespace around arrows and semicolons is insignificant.
- Names and modifiers are case-sensitive.
- Mappings for the same native event publish in declaration order.
- Exact duplicate mappings produce a diagnostic.
- An invalid mapping is disabled without disabling valid sibling mappings.
- Dots in the native-event portion introduce modifiers. Custom native-event names must therefore use another separator, such as a hyphen or colon.

Domain-event names use lowercase, dotted, subject-first terminology, with kebab case inside a segment and an occurrence expressed as a past fact. Mechanical syntax is validated by YAUIT; whether a name expresses a meaningful domain fact remains an application responsibility.

### Native-event source

The element carrying `data-emit` is the declaration source even when the native event originated in one of its descendants. Synthetic native events are eligible. When nested declaring elements observe the same bubbling native event, each qualifying mapping publishes according to native propagation order. A delegated implementation must preserve the behavior observable from direct listeners.

### Initial modifiers

The initial closed modifier set is:

- `.prevent`, which calls `preventDefault()` on the native event before payload construction and publication.
- `.once`, which deactivates that element's mapping after its first successful domain publication. A filtered occurrence or payload or publication failure does not consume it.
- `.self`, which qualifies only when the native event's visible target is the declaring element.

Modifier order is insignificant. Repeated and unknown modifiers are invalid.

Stop, capture, and passive behavior are deferred. Keyboard filters, debounce, and throttle are expected follow-up needs but are outside the initial contract. Conditional expressions or filters are also recorded for later evaluation without a commitment to putting expressions in HTML.

### Payload construction and immutability

A runtime may associate one synchronous JavaScript payload builder with a domain-event type. The builder receives the declaration source and native event, performs no side effects, and returns plain structured data. It does not receive application state or the runtime hub and must not publish another event. Returning a promise is invalid; asynchronous processing begins after publication.

The builder is resolved when the native event occurs. It may normalize multiple supported source-element representations. HTML can carry ordinary interface values, while domain property names and translation remain in JavaScript.

An event with no registered builder has an `undefined` payload. If an enabled contract requires a payload, a missing builder or payload prevents publication. Domain payloads contain no DOM nodes, native events, functions, or application-service references and are immutable after publication. The source element and native event may be retained separately as transient metadata; this metadata is not persisted or forwarded between hubs by default.

### Failure and diagnostics

YAUIT does not silently ignore invalid declarative bindings. Activation diagnostics cover malformed or duplicate mappings, invalid names, and unknown, repeated, or incompatible modifiers. Occurrence diagnostics cover missing required builders, thrown builders, promise-returning builders, invalid payloads, and events unknown to a strict catalog.

A diagnostic identifies the declaring element, complete attribute value, individual mapping, stable diagnostic code, and underlying error when one exists. Valid sibling mappings remain active when another mapping is invalid. The runtime may offer explicit warn, throw, and off policies without relying on a consumer build environment.

### Reference examples

The initial contract will be exercised using:

```html
<form data-emit="submit.prevent -> todo.creation.requested">...</form>

<input
  type="checkbox"
  value="todo-123"
  data-emit="change -> todo.completion-change.requested"
>

<select data-emit="change -> todo-list.filter.selected">...</select>
```

Their JavaScript payload builders respectively translate form fields, the checkbox value and checked state, and the selected filter into application-owned payload contracts. `todo.creation.requested` and `todo.completion-change.requested` record that requests occurred; `todo-list.filter.selected` records an already completed selection occurrence.

## Consequences

- Domain routing is independent of DOM ancestry, shadow boundaries, and element relocation.
- One page can host isolated applications without accidental event sharing.
- Most applications can use one document-root runtime and experience the hub as application-wide without relying on a singleton.
- Runtime ownership, nested roots, logical scopes, and event visibility still require a routing decision.
- Web Components that expose public DOM `CustomEvent`s will require an explicit adapter to publish selected events into a runtime hub; selected hub events could likewise be exposed to the DOM through a future adapter.
- Dynamic payload construction remains testable JavaScript and can share validation with programmatic event publication.
- Simple payload-bearing controls require a JavaScript payload builder, trading some convenience for a smaller and more disciplined HTML API.
- Declarative bindings remain compact, but applications must register payload builders for payload-bearing domain events.
- Timing, keyboard, propagation, and conditional extensions can be evaluated against a stable initial grammar rather than added implicitly.
