import { createDiagnosticReporter } from './diagnostics.js';
import { isDomainEventName, parseDataEmit } from './data-emit-parser.js';
import { createEventHub } from './event-hub.js';
import { cloneAndFreezePlainData } from './plain-data.js';

const DATA_EMIT_ATTRIBUTE = 'data-emit';

export function createYauitRuntime({
  root = globalThis.document,
  diagnostics = 'warn',
  onDiagnostic,
  strictEvents = false
} = {}) {
  assertRoot(root);

  const report = createDiagnosticReporter({
    policy: diagnostics,
    onDiagnostic
  });
  const hub = createEventHub();
  const definitions = new Map();
  const elementCleanups = new Map();
  let started = false;

  function define(type, definition = {}) {
    if (!isDomainEventName(type)) {
      report({
        code: 'YAUIT_EVENT_DEFINITION_NAME_INVALID',
        phase: 'registration',
        message: `Invalid domain event name: ${type}.`
      });
      return false;
    }

    if (definitions.has(type)) {
      report({
        code: 'YAUIT_EVENT_DEFINITION_DUPLICATE',
        phase: 'registration',
        message: `Domain event is already defined: ${type}.`
      });
      return false;
    }

    const {
      buildPayload,
      payloadRequired = false,
      validatePayload
    } = definition;

    if (buildPayload !== undefined && typeof buildPayload !== 'function') {
      throw new TypeError(`buildPayload for ${type} must be a function.`);
    }
    if (validatePayload !== undefined && typeof validatePayload !== 'function') {
      throw new TypeError(`validatePayload for ${type} must be a function.`);
    }

    definitions.set(type, Object.freeze({
      buildPayload,
      payloadRequired: Boolean(payloadRequired),
      validatePayload
    }));
    return true;
  }

  function subscribe(type, subscriber) {
    return hub.subscribe(type, subscriber);
  }

  function publish(type, payload, metadata = {}) {
    if (!isDomainEventName(type)) {
      report({
        code: 'YAUIT_EVENT_NAME_INVALID',
        phase: 'publication',
        message: `Invalid domain event name: ${type}.`
      });
      return null;
    }

    const definition = definitions.get(type);
    if (strictEvents && !definition) {
      report({
        code: 'YAUIT_EVENT_UNKNOWN',
        phase: 'publication',
        message: `Domain event is not defined in this strict runtime: ${type}.`
      });
      return null;
    }

    if (definition?.payloadRequired && payload === undefined) {
      report({
        code: 'YAUIT_EVENT_PAYLOAD_REQUIRED',
        phase: 'publication',
        message: `Domain event requires a payload: ${type}.`
      });
      return null;
    }

    if (definition?.validatePayload) {
      let validationResult;
      try {
        validationResult = definition.validatePayload(payload);
      } catch (cause) {
        report({
          code: 'YAUIT_EVENT_PAYLOAD_VALIDATION_FAILED',
          phase: 'publication',
          message: `Payload validation threw for domain event: ${type}.`,
          cause
        });
        return null;
      }

      if (isPromiseLike(validationResult)) {
        report({
          code: 'YAUIT_EVENT_PAYLOAD_VALIDATOR_ASYNC',
          phase: 'publication',
          message: `Payload validation must be synchronous for domain event: ${type}.`
        });
        return null;
      }

      if (validationResult === false) {
        report({
          code: 'YAUIT_EVENT_PAYLOAD_INVALID',
          phase: 'publication',
          message: `Payload validation failed for domain event: ${type}.`
        });
        return null;
      }
    }

    let immutablePayload;
    try {
      immutablePayload = cloneAndFreezePlainData(payload);
    } catch (cause) {
      report({
        code: 'YAUIT_EVENT_PAYLOAD_NOT_PLAIN_DATA',
        phase: 'publication',
        message: `Domain event payload is not immutable plain data: ${type}.`,
        cause
      });
      return null;
    }

    return hub.publish(type, immutablePayload, metadata);
  }

  function start() {
    if (started) return runtime;
    started = true;

    for (const element of findDeclarativeElements(root)) {
      bindElement(element);
    }

    return runtime;
  }

  function stop() {
    if (!started) return runtime;

    for (const cleanups of elementCleanups.values()) {
      for (const cleanup of cleanups) cleanup();
    }

    elementCleanups.clear();
    started = false;
    return runtime;
  }

  function bindElement(element) {
    const attributeValue = element.getAttribute(DATA_EMIT_ATTRIBUTE);
    const parsed = parseDataEmit(attributeValue);

    for (const diagnostic of parsed.diagnostics) {
      report({
        ...diagnostic,
        phase: 'activation',
        element,
        attributeValue
      });
    }

    const cleanups = [];
    for (const mapping of parsed.mappings) {
      const modifierSet = new Set(mapping.modifiers);
      let active = true;

      const listener = (nativeEvent) => {
        if (!active) return;
        if (modifierSet.has('self') && nativeEvent.target !== element) return;

        if (modifierSet.has('prevent')) {
          nativeEvent.preventDefault();
        }

        const payloadResult = buildPayload({
          type: mapping.domainEvent,
          source: element,
          nativeEvent,
          attributeValue,
          mapping
        });

        if (!payloadResult.ok) return;

        let message;
        try {
          message = publish(mapping.domainEvent, payloadResult.payload, {
            source: element,
            cause: nativeEvent
          });
        } catch (cause) {
          if (modifierSet.has('once')) deactivate();
          throw cause;
        }

        if (message && modifierSet.has('once')) {
          deactivate();
        }
      };

      const deactivate = () => {
        active = false;
        element.removeEventListener(mapping.nativeEvent, listener);
      };

      element.addEventListener(mapping.nativeEvent, listener);
      cleanups.push(deactivate);
    }

    if (cleanups.length > 0) elementCleanups.set(element, cleanups);
  }

  function buildPayload({
    type,
    source,
    nativeEvent,
    attributeValue,
    mapping
  }) {
    const definition = definitions.get(type);

    if (!definition?.buildPayload) {
      if (definition?.payloadRequired) {
        report({
          code: 'YAUIT_PAYLOAD_BUILDER_MISSING',
          phase: 'occurrence',
          message: `No DOM payload builder is registered for domain event: ${type}.`,
          element: source,
          attributeValue,
          mapping: mapping.raw
        });
        return { ok: false };
      }

      return { ok: true, payload: undefined };
    }

    let payload;
    try {
      payload = definition.buildPayload({ source, nativeEvent });
    } catch (cause) {
      report({
        code: 'YAUIT_PAYLOAD_BUILDER_FAILED',
        phase: 'occurrence',
        message: `DOM payload builder threw for domain event: ${type}.`,
        element: source,
        attributeValue,
        mapping: mapping.raw,
        cause
      });
      return { ok: false };
    }

    if (isPromiseLike(payload)) {
      report({
        code: 'YAUIT_PAYLOAD_BUILDER_ASYNC',
        phase: 'occurrence',
        message: `DOM payload builder must be synchronous for domain event: ${type}.`,
        element: source,
        attributeValue,
        mapping: mapping.raw
      });
      return { ok: false };
    }

    return { ok: true, payload };
  }

  const events = Object.freeze({ define, publish, subscribe });
  const runtime = Object.freeze({ events, start, stop });
  return runtime;
}

function findDeclarativeElements(root) {
  const elements = [];

  if (typeof root.matches === 'function' && root.matches(`[${DATA_EMIT_ATTRIBUTE}]`)) {
    elements.push(root);
  }

  elements.push(...root.querySelectorAll(`[${DATA_EMIT_ATTRIBUTE}]`));
  return elements;
}

function assertRoot(root) {
  if (
    !root ||
    typeof root.querySelectorAll !== 'function'
  ) {
    throw new TypeError('A YAUIT runtime requires a Document or Element root.');
  }
}

function isPromiseLike(value) {
  return value !== null &&
    (typeof value === 'object' || typeof value === 'function') &&
    typeof value.then === 'function';
}
