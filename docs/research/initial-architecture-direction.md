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
