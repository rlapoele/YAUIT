# Initial `data-emit` prototype

- **Date:** 2026-09-09
- **Topic:** Executable experiment for the accepted Step 2 contract

## Implemented scope

- Added a buildless, browser-native ES module runtime under `packages/yauit/`.
- Added a runtime-owned event hub with no global singleton.
- Implemented validated, semicolon-separated `data-emit` parsing.
- Implemented `.prevent`, `.once`, and `.self` native-event modifiers.
- Added synchronous payload builders, payload validation, immutable plain-data cloning, strict event catalogs, and structured diagnostics.
- Added `start()` and `stop()` for the currently activated bindings.
- Added a todo Step 2 fixture covering creation requests, completion-change requests, filter selection, and deletion requests.
- Added dependency-free parser and runtime tests.

## Provisional implementation choices

The accepted documentation remains authoritative. Direct per-element native listeners, synchronous hub subscriber delivery, current API names, diagnostic object shape, and deep production payload freezing are prototype choices rather than accepted architecture. Dynamic DOM observation is intentionally absent.

## Verification

- The Node test suite passed 11 tests.
- A real Chromium run confirmed form default prevention, immutable normalized payloads, once-only publication, self-target filtering, filter payload construction, and a clean browser console.
- Two runtime instances were verified to keep their hubs isolated.

## Next questions

- Define the `data-on` presentation-action contract before implementing it.
- Later decide hub delivery, runtime scopes, dynamic activation, and cleanup semantics.

## Related decisions

- [ADR-003: Publish declarative domain events through a runtime hub](../decisions/ADR-003-publish-declarative-domain-events-through-runtime-hub.md)
- [ADR-004: Use a decoupled todo application as the reference system](../decisions/ADR-004-use-decoupled-todo-reference-system.md)
