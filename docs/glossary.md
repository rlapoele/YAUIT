# Glossary

These are working product definitions. Their exact API semantics remain open.

## Activation

The act of discovering a presentation unit in existing or newly inserted HTML and connecting it to any declared YAUIT capabilities.

## Application process

JavaScript orchestration that coordinates a workflow, potentially across presentation units and asynchronous or persistent boundaries. It should not be owned by one DOM node or directly manipulate presentation as part of its core responsibility.

## Behavior

A reusable JavaScript capability that gives one or more presentation-unit instances interactivity. A behavior is separate from the unit's HTML and may manage local interaction and lifecycle concerns.

## Command

A request for an operation to be performed. Whether commands are part of YAUIT's public contract model remains open.

## Component

A presentation construct with persistent runtime identity through which it may own presentation, lifecycle, behavior, or a public interface. It may use a retained host or a custom element. A presentation unit may help construct or populate a component, but reuse, activation, or attachment of a behavior does not by itself make a presentation-unit instance a component.

## Contract

The explicit boundary through which a presentation unit and JavaScript capability connect. It may eventually define inputs, configuration, emitted outcomes, exposed actions, and lifecycle expectations; the exact model is undecided.

## Fragment

A presentation blueprint with multiple top-level nodes and no rendered wrapper. For repetition, YAUIT represents such a blueprint with `<template data-repeat>`. A fragment is not necessarily reusable, interactive, remotely loaded, or a component.

## Presentation unit

An HTML-defined presentation boundary that can be composed, reused, or activated. It may range from an existing DOM subtree or `<template>` instance to a custom element, page section, or page. Its exact qualification rules are the next subject of exploration.

## Presentation-unit definition

An inert, named, reusable presentation blueprint declared with `<template data-unit="name">`. Its template contents are the source from which instances can be created.

## Presentation-unit instance

The DOM content created from a presentation-unit definition. An instance may occupy a wrapper-free logical region that YAUIT tracks for ownership or later updates. It is not necessarily a component and does not require a persistent host element.

## Repeat declaration

An HTML declaration marked with `data-repeat` that identifies a presentation blueprint to instantiate once for each value supplied by JavaScript. On an ordinary element, the element is the single-root blueprint. On a `<template>`, its contents are the multi-root blueprint.

## Repeat region

The persistent logical location owned by a repeat declaration. It contains zero or more rendered iterations and survives an empty collection or rerender even when no visible wrapper exists.

## Template

An inert HTML blueprint, normally represented by `<template>`, from which DOM content may be instantiated. A template may define a presentation unit but is not synonymous with one.

## Use declaration

An HTML declaration marked with `data-use="name"` that requests an instance of the named presentation-unit definition at that location. A `<template data-use>` declaration is consumed during activation rather than retained as a component host. Combining it with `data-repeat` requests one instance for each value supplied by JavaScript. Semantics for `data-use` on ordinary elements remain open.
