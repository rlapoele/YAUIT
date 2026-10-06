# Principles

1. **Standard HTML first.** HTML, CSS, `<template>`, and JavaScript remain the primary materials.
2. **No build step required.** A direct `<script>`-tag workflow is first-class; build tooling is optional.
3. **Rendering-origin agnostic.** YAUIT activates HTML without owning whether it came from CSR, SSR, SSG, or a hybrid.
4. **Presentation and behavior remain separable.** A presentation unit can exist without behavior; reusable JavaScript behavior can be attached through an explicit contract.
5. **Declare connections, not implementations.** HTML may name or configure capabilities but should not contain arbitrary JavaScript source.
6. **Composition without imposed methodology.** YAUIT may enable atomic-design-style composition without encoding atoms, molecules, or another design taxonomy.
7. **Small core, optional capabilities.** Routing, persistence, remote fragments, and application-process support must not become mandatory core concerns without separate decisions.
8. **No mandatory global state model.** Applications may keep state where it fits; YAUIT does not require a framework-wide state container.
