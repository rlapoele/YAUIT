# ADR-004: Use a decoupled todo application as the reference system

- **Date:** 2026-09-09
- **Status:** Accepted

## Context

Abstract event and lifecycle discussions need a shared scenario against which proposed YAUIT contracts can be evaluated. The scenario must exercise native-event translation, domain payload construction, application processing, rendering, persistence, dynamic DOM, and runtime isolation without becoming a large product project. It must also demonstrate that YAUIT remains a library used by an application rather than the owner of that application's architecture.

## Options considered

1. Continue discussing each capability through isolated examples.
2. Build the reference application directly around YAUIT APIs and state facilities.
3. Use a small application with an independent core, connected to YAUIT and persistence through adapters.

## Decision

Use a todo-item management system as the shared reference for subsequent architecture discussions and experiments. It will cover creating, editing, completing, reopening, deleting, and filtering items; loading and saving them through a persistence port; presenting meaningful persistence failure; and rendering both pre-existing and dynamically introduced DOM.

The reference must be able to represent two independent todo-list instances on one page. This will exercise runtime ownership, event visibility, and isolation rather than allowing a global mechanism to appear sufficient accidentally.

The todo system will be architecturally separate from YAUIT and use a lightweight Clean Architecture with ports and adapters:

- The todo domain and application core own todo rules, processes, state or read models, event names, payload contracts, and persistence requirements.
- The core must not import YAUIT or depend on `document`, DOM element types, `CustomEvent`, `localStorage`, or another persistence implementation.
- A YAUIT adapter owns DOM-to-domain payload construction and registered presentation actions.
- A persistence adapter implements an application-owned repository port, initially with browser-local persistence if implementation is requested.
- An outer composition root selects the runtime root, application instance, processes, event contracts, payload builders, presentation actions, and persistence adapter.
- YAUIT owns only generic runtime, hub, declarative binding, scope, lifecycle, registry, validation, and diagnostic mechanisms.

The reference is currently a specification tool. This decision does not authorize implementation during the exploration phase.

## Consequences

- Every proposed YAUIT capability can be tested against the same end-to-end language and interactions.
- Todo processing can be tested without a browser or YAUIT runtime.
- Persistence can change without changing todo rules, event contracts, or declarative HTML.
- Supporting two list instances exposes scope and routing problems early.
- Server-rendered, statically rendered, client-rendered, and replaced fragments can be treated as different origins of the same activatable HTML.
- The reference application must not drive todo-specific features into the YAUIT core.
- Filtering may prove to be presentation or application view state rather than persisted todo-domain state; its placement remains an explicit modeling question.
