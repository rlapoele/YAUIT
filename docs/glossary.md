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

A reusable presentation unit with an explicit contract and optional behaviors. A YAUIT component is not necessarily a custom element and does not necessarily require JavaScript.

## Contract

The explicit boundary through which a presentation unit and JavaScript capability connect. It may eventually define inputs, configuration, emitted outcomes, exposed actions, and lifecycle expectations; the exact model is undecided.

## Fragment

A chunk of HTML that can participate in composition. A fragment is not necessarily reusable, interactive, remotely loaded, or a component.

## Presentation unit

An HTML-defined presentation boundary that can be composed, reused, or activated. It may range from an existing DOM subtree or `<template>` instance to a custom element, page section, or page. Its exact qualification rules are the next subject of exploration.

## Template

An inert HTML blueprint, normally represented by `<template>`, from which DOM content may be instantiated. A template may define a presentation unit but is not synonymous with one.
