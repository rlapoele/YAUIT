# Initial architecture direction

- **Date:** 2026-08-29
- **Status:** Exploration hypothesis; not a decision

## Core interests

Explore whether a small front-end library or framework can:

1. Facilitate component-oriented UI development using existing Web APIs only.
2. Separate UI/presentation from behavior, potentially using finite-state-machine concepts.
3. Use custom events as the communication mechanism between components, with a central behavior registry and command centre for application-level coordination.
4. Support server-side rendering of components as well as browser use.

## Declarative component-to-behavior linking

The central hypothesis is that defining a component should involve only a declarative description of:

1. Its presentation for the UI states it can represent.
2. Its inputs.
3. Its outputs, expressed as event contracts.
4. The separately defined behaviors with which it is associated.

Behavior code, scripts, state machines, and side effects would be defined elsewhere and registered by name or capability. At runtime, the system would link an instance of a declared component to its declared behavior. A component need not carry its own behavior script.

This could make a component a declarative UI contract rather than a bundle of presentation and imperative logic. It remains to be investigated whether that model is performant, usable, and sufficiently expressive.

## Semantic event contracts

A component's declared inputs and outputs should use custom events that express domain or business meaning, rather than browser gestures such as `click` or `hover`. For example, a colour-theme switcher could work with events such as `colour-theme.apply.requested` and `colour-theme.applied`.

Native browser events may still be used privately to capture interaction and translate it into semantic custom events. They are not part of the component's public contract. This keeps the component usable from other interaction mechanisms and makes the behavior layer independent of a particular gesture.

The model should distinguish an intent or request from an established fact. A UI component may emit `colour-theme.apply.requested`; the behavior that performs the action should emit `colour-theme.applied` only after it succeeds. Components can then react to that resulting semantic event or to the state derived from it.

### Working event-name convention

Use a subject-first dotted namespace for semantic event types:

```text
<subject>.<aspect-or-action>.<lifecycle>
```

For example, `colour-theme.preference.requested` describes a request about the colour-theme preference. This groups all events concerning the same subject together, such as `colour-theme.preference.requested`, `colour-theme.applied`, and `colour-theme.system-preference.changed`.

This is a working convention, not a final standard. Consistency and discoverability matter more than a universally correct order; if a broader preference domain proves more useful, revisit the convention.

## Declarative DOM event bridge

Explore a generic runtime facility that recognizes declarative DOM attributes such as:

```html
data-emit-event="click:colour-theme.preference.requested"
data-event-detail='{"preference":"light"}'
```

Its sole role would be to translate the native `click` interaction into a semantic `CustomEvent` with type `colour-theme.preference.requested` and the declared value as `event.detail`. It must not mutate application state or invoke the colour-theme process directly.

A likely efficient model is event delegation: one listener on an application root receives bubbling native events, finds the relevant declarative binding on the event target or an ancestor, and dispatches the semantic custom event from that DOM location. DOM nodes added after initial page load would then work without rescanning or per-node listener setup. A `MutationObserver` may be useful only for explicit lifecycle work or optional pre-validation, not as the normal dispatch path.

Open questions include attribute syntax, payload validation and dynamic values, how bindings are cached or inspected, event cancellation, component boundaries, and development-time diagnostics.

### Event catalog and validation

The browser permits arbitrary `CustomEvent` names, so the event bridge can remain open at runtime. Separately, explore an optional application-level event catalog for semantic events. It would declare an event type, its payload contract, and possibly its known producers and consumers.

The catalog should be assembled during application composition, before the DOM event bridge is activated. Reusable presentation definitions and detached processes could each declare the event contracts they emit or consume; the application composition selects and validates the contracts in use. In development, this enables diagnostics for unknown event types and invalid payloads. Production need not pay for exhaustive validation.

Keep the catalog distinct from the event dispatcher: one describes and validates the protocol; the other routes runtime events. The model should also allow intentional unregistered events for browser interoperation or incremental adoption.

## Component purpose and process wiring

A visual component is provisionally understood as a reusable presentation unit, potentially with reusable private presentation logic. Its public contract describes what it can represent, its inputs, and its semantic output events; it should not embed application-specific process logic.

An association between a component and a detached process may therefore be derived from the component's declared event contract and an event/process registry, rather than declared directly by the component. A declarative application-level composition or wiring manifest may make those derived associations inspectable without coupling a reusable component to a particular application workflow.

The detached unit is not yet named. It is expected to receive semantic events, optionally retain state, decide transitions, invoke effects or commands, emit semantic events, and possibly supply state for presentation. Candidate names include *behavior*, *process*, *reaction*, *controller*, and *orchestrator*. `Process` is currently a useful working term for a stateful unit; `reaction` may describe a smaller stateless response.

## Shared exploration example: colour-theme preference UI

Use a portion of the DOM that lets a person choose a colour-theme preference as a recurring discussion example. Do not treat it as a component yet.

Its initial responsibilities are to:

1. Show the currently active colour theme.
2. Show whether the active theme comes from an explicit human choice or from the system colour-scheme setting.
3. Expose controls through which a person can request an explicit light theme, an explicit dark theme, or use of the system colour theme.

Questions to examine through this example include the distinction between an explicit preference, the system preference, and the effective rendered theme; semantic event contracts; process ownership; browser integration; and server rendering.

## Design questions to investigate

- Which browser APIs should form the component foundation: Custom Elements, Shadow DOM, slots, templates, `EventTarget`, or something else?
- Which responsibilities remain inside a component, and which belong to a behavior/state layer?
- How can a central event mechanism remain observable and explicit without becoming a global, unstructured event bus?
- What does server-side support mean in practice: HTML generation, progressive enhancement, hydration, Declarative Shadow DOM, or all of these?
- How are separately defined behaviors named, scoped per component instance, linked, started, and disposed?
- Are behaviors ordinary JavaScript modules, declarative state-machine descriptions, or a combination of both?
- Which limitations are acceptable in exchange for using the web platform directly?

## Related concepts to study

- Web Components and Custom Elements
- State machines and statecharts
- Event-driven architecture, commands, and event routing
- Server rendering and progressive enhancement
