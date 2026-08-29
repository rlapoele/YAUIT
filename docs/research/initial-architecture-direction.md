# Initial architecture direction

- **Date:** 2026-08-29
- **Status:** Exploration hypothesis; not a decision

## Core interests

Explore whether a small front-end library or framework can:

1. Facilitate component-oriented UI development using existing Web APIs only.
2. Separate UI/presentation from behavior, potentially using finite-state-machine concepts.
3. Use custom events as the communication mechanism between components, with a central behavior registry and command centre for application-level coordination.
4. Support server-side rendering of components as well as browser use.

## Design questions to investigate

- Which browser APIs should form the component foundation: Custom Elements, Shadow DOM, slots, templates, `EventTarget`, or something else?
- Which responsibilities remain inside a component, and which belong to a behavior/state layer?
- How can a central event mechanism remain observable and explicit without becoming a global, unstructured event bus?
- What does server-side support mean in practice: HTML generation, progressive enhancement, hydration, Declarative Shadow DOM, or all of these?
- Which limitations are acceptable in exchange for using the web platform directly?

## Related concepts to study

- Web Components and Custom Elements
- State machines and statecharts
- Event-driven architecture, commands, and event routing
- Server rendering and progressive enhancement
