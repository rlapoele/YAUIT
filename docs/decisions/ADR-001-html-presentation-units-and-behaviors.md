# ADR-001: Center YAUIT on HTML presentation units and JavaScript behaviors

- **Date:** 2026-10-06
- **Status:** Accepted

## Context

YAUIT aims to reduce plumbing for developers comfortable with vanilla HTML and JavaScript while retaining a first-class no-build workflow and compatibility with independently chosen rendering strategies.

Candidate directions included a minimal DOM behavior activator, a component-contract library, a fragment-oriented system, a process-oriented runtime, a complete buildless framework, and a small kernel with optional capabilities.

## Decision

YAUIT will center its authoring model on reusable HTML-defined presentation units with explicit contracts and optional, separately implemented JavaScript behaviors.

A small DOM activation kernel will support that model. Capabilities beyond activation and composition should be optional unless later decisions establish that they belong in the core.

A presentation unit need not be a custom element, need not be interactive, and need not require JavaScript. YAUIT will enable composition methodologies such as atomic design without imposing their taxonomy.

HTML may declaratively connect to registered capabilities but will not contain arbitrary JavaScript implementations. Application processes remain conceptually separate from presentation units and local behaviors.

## Rationale

This direction preserves standard web primitives, keeps presentation separable from interaction and data processing, supports buildless adoption, and avoids prematurely turning YAUIT into a rendering framework or complete application runtime.

## Consequences

- The presentation-unit boundary, contract model, behavior lifecycle, and registration API require further exploration and specification.
- Static units without JavaScript are first-class.
- CSR, SSR, SSG, and hybrid rendering are compatibility contexts rather than YAUIT-owned rendering modes.
- No framework-wide state container, router, persistence system, or remote-fragment mechanism is implied.

## Related records

- [Vision](../vision.md)
- [Concept brief](../ideas/html-presentation-units.md)
- [Session record](../sessions/2026-10-06-product-direction.md)
