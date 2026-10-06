# Current state

- **Phase:** Ideation
- **Active focus:** Complete the presentation-unit composition model, including conditional presentation.
- **Accepted product direction:** A small, buildless-first HTML activation and composition library centered on presentation units, reusable behaviors, and explicit contracts.
- **Accepted architecture or technology stack:** Standard HTML and JavaScript are first-class. A small activation kernel with optional capabilities is the current architectural direction. Named reusable units are declared with `<template data-unit="…">` and requested with `data-use="…"`. HTML declares repeated presentation structure, while JavaScript supplies collections. No complete public API or implementation design is accepted.
- **Implementation:** None.

## Next step

Explore conditional presentation as a capability separate from repetition. The JavaScript collection API, update and reconciliation semantics, use-site placement behavior, name-resolution rules, and internal repeat-region mechanism remain open.

Earlier project material remains recoverable from Git history but is not active project guidance.
