# Principles

## Activate HTML rather than own it

YAUIT should progressively activate existing HTML regardless of how that HTML was produced. It should not require ownership of rendering through a virtual DOM, reconciliation loop, component compiler, or reactive template language.

## Keep HTML event-oriented

HTML may declare translations from native interactions to semantic domain events and relationships from domain events to presentation actions. It should not refer directly to application state paths, model properties, or domain payload structures. Ordinary HTML control values remain part of the interface; JavaScript translates them into validated domain payloads.

## Keep application behavior in JavaScript

JavaScript owns application behavior, data processing, state transitions, asynchronous effects, validation, and rendering implementations. Declarative HTML wiring should not contain computational expressions or business workflows.

## Make the safe path the easy path

The common developer experience should be small, direct, and unsurprising. YAUIT should hide repetitive runtime plumbing and provide useful defaults without hiding domain-event ownership, weakening validation, coupling HTML to application state, or requiring framework-specific architecture. Advanced configuration and low-level APIs should remain available when an application needs them, but ordinary usage should not require them.

## Express domain events as facts

A domain event is an immutable record of something that has occurred and matters in domain language. An event ending in `requested` records that a request occurred, not that its desired outcome succeeded. Commands and technical runtime notifications are separate concepts.

## Make build tooling optional for consumers

Applications should be able to consume browser-ready YAUIT without a build step. The library itself may use TypeScript and build tooling to produce those distributable artifacts.
