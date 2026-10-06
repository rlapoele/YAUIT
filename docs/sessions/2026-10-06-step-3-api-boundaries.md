# Step 3 API boundaries

- **Date:** 2026-10-06
- **Topic:** Application-process and presentation-action contracts

## Conclusions

Reconfirmed the element-oriented mental model: `data-emit` declares an outgoing semantic event and `data-on` declares an incoming event reaction. From the application boundary these are respectively DOM input and output adapters. The existing names remain preferable because they describe event operations without relying on a direction that changes with perspective.

Clarified that `data-emit` publishes a domain event rather than invoking a process directly. Domain events may also originate from programmatic and external sources. An application process may produce zero, one, or multiple domain events, but does not manipulate the DOM. A presentation action is the entry point to presentation work; it may render directly or delegate to a presenter or view module, but does not modify domain state.

Accepted lightweight structural APIs for both YAUIT-facing processes and presentation actions. The common path will use plain JavaScript functions and objects, ordinary composition, and optional definition helpers rather than mandatory classes, decorators, dependency injection, stores, or build tooling. YAUIT may automate subscription, action lookup, publication of process results, cleanup, and diagnostics while the application retains ownership of behavior, state, persistence, and presentation implementation.

See [ADR-005](../decisions/ADR-005-restrict-data-on-to-presentation-actions.md) and [ADR-006](../decisions/ADR-006-use-lightweight-structural-runtime-contracts.md).

## Open questions

- Define the exact presentation-action invocation context and return semantics.
- Define the exact process descriptor, result normalization, async behavior, ordering, cancellation, and error semantics.
- Decide initialization behavior and how actions may obtain read-model data.
- Define runtime scopes and lifecycle after the remaining `data-on` contract is accepted.
