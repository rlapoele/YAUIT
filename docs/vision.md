# Vision

## Problem to explore

How might a small library or framework help people create front-ends for websites and web applications more easily?

The project is pursuing a web-platform-first architecture that:

- Makes component-oriented UI development easier using existing Web APIs.
- Lets a component declaratively describe its presentation, inputs, outputs, and associated behaviors.
- Separates a component's UI/presentation from behavior code and state transitions.
- Uses immutable domain events carried by a runtime-owned event hub for application communication and coordination.
- Allows components to be rendered on the server as well as used in the browser.
- Progressively activates existing HTML regardless of whether it was rendered on the server, generated statically, or created in the browser.
- Keeps the HTML authoring API event-oriented rather than coupled to application state paths or model properties.

## Current status

Exploration has begun. The event-oriented DOM activation authoring model has been accepted, while the target users, scope, exact event semantics, implementation approach, and success criteria remain open questions.

## Non-goals for now

- Choosing a technical stack prematurely.
- Writing implementation code before the conceptual exploration is sufficiently grounded.
