# Principles

## Activate HTML rather than own it

YAUIT should progressively activate existing HTML regardless of how that HTML was produced. It should not require ownership of rendering through a virtual DOM, reconciliation loop, component compiler, or reactive template language.

## Keep HTML event-oriented

HTML may declare translations from native interactions to semantic domain events and relationships from domain events to presentation actions. It should not refer directly to application state paths, model properties, or domain payload structures. Ordinary HTML control values remain part of the interface; JavaScript translates them into validated domain payloads.

## Keep application behavior in JavaScript

JavaScript owns application behavior, data processing, state transitions, asynchronous effects, validation, and rendering implementations. Declarative HTML wiring should not contain computational expressions or business workflows.

## Express domain events as facts

A domain event is an immutable record of something that has occurred and matters in domain language. An event ending in `requested` records that a request occurred, not that its desired outcome succeeded. Commands and technical runtime notifications are separate concepts.

## Make build tooling optional for consumers

Applications should be able to consume browser-ready YAUIT without a build step. The library itself may use TypeScript and build tooling to produce those distributable artifacts.
