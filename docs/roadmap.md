# Roadmap

## Current phase: explore

- Clarify the problem and intended users.
- Examine front-end concepts, techniques, architectures, and trade-offs.
- Identify a narrow learning-oriented first experiment.
- Define the `data-on` domain-event-to-presentation-action contract.
- Test emerging contracts against the decoupled todo reference system defined in [ADR-004](decisions/ADR-004-use-decoupled-todo-reference-system.md).
- Evolve the initial `data-emit` prototype only as additional contracts are accepted.

## Open questions

- What kind of front-end authoring should become easier?
- Who is the primary user of the library or framework?
- What should it intentionally leave to existing tools?
- What constraints or principles should guide the design?
- What arguments, ordering, initialization, and error semantics should `data-on` presentation actions have?
- After `data-on` is specified, how should runtime scopes affect event visibility and process ownership?

## Deferred `data-emit` extensions

- Keyboard filters.
- Debounce modifiers.
- Throttle modifiers.
- Conditional expressions or filters; whether these belong in declarative HTML remains undecided.
- Native propagation and listener options such as stop, capture, and passive behavior.
