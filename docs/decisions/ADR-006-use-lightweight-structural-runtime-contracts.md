# ADR-006: Use lightweight structural contracts for processes and presentation actions

- **Date:** 2026-10-06
- **Status:** Accepted

## Context

YAUIT should be able to install application processes and presentation actions, derive their event subscriptions, publish resulting events, manage cleanup, and report contract failures. Without a common boundary, applications must repeat low-level hub plumbing and YAUIT cannot provide consistent lifecycle or diagnostics.

At the same time, YAUIT is intended to remain buildless for consumers and must not force application code into framework base classes, a dependency-injection container, a framework-owned store, or another prescribed internal architecture. The common path needs to remain ordinary JavaScript.

## Options considered

1. Leave processes and actions completely unconstrained and require applications to subscribe and clean up manually.
2. Require framework-specific classes, decorators, dependency injection, and lifecycle inheritance.
3. Define small structural contracts implemented by plain functions and objects, with optional helpers for validation and editor support.

## Decision

Use small, function-first structural contracts for YAUIT-facing application processes and presentation actions.

- A presentation action is an ordinary function registered under a stable action name. Its invocation includes an explicit DOM target and domain-event information. It may render directly or delegate to a presenter or view module.
- A YAUIT-facing application process consumes immutable domain-event messages and may produce zero, one, or multiple resulting domain-event descriptions. It performs no DOM work and may delegate to an application-owned use case that has no dependency on YAUIT.
- The runtime owns repetitive integration work: deriving subscriptions from registered contracts, resolving action names, publishing valid resulting events, cleaning up runtime-owned subscriptions, and producing diagnostics.
- Dependencies are supplied through ordinary JavaScript composition, such as closures and factories. YAUIT will not require a service locator or dependency-injection container.
- Optional helpers such as `defineProcess()` or `defineActions()` may provide early validation, types, and editor assistance. They must not be mandatory wrappers around otherwise conforming functions or objects.
- Browser-ready JavaScript and type declarations may expose these contracts without requiring a consumer build step.

The examples discussed so far are illustrative rather than accepted signatures. Exact object shapes, invocation arguments, return normalization, synchronous and asynchronous behavior, ordering, cancellation, error handling, scope, and lifecycle remain to be decided.

## Consequences

- Common applications can install behavior through concise composition rather than manual `subscribe()` calls.
- YAUIT can validate boundaries and automate infrastructure without owning business rules, state management, persistence, or rendering strategy.
- Application processes remain testable without a DOM, and presentation actions remain replaceable without changing application processes.
- Advanced applications retain low-level hub APIs and may place adapters around existing use cases instead of rewriting them for YAUIT.
- The structural contracts become public compatibility surfaces, so their exact signatures must be specified and tested before implementation is treated as stable.
