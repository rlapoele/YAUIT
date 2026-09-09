import assert from 'node:assert/strict';
import test from 'node:test';

import { createYauitRuntime } from '../packages/yauit/src/index.js';

class FakeElement extends EventTarget {
  constructor(dataEmit) {
    super();
    this.dataEmit = dataEmit;
    this.value = '';
  }

  getAttribute(name) {
    return name === 'data-emit' ? this.dataEmit : null;
  }

  matches(selector) {
    return selector === '[data-emit]' && this.dataEmit !== null;
  }

  querySelectorAll() {
    return [];
  }
}

test('publishes an immutable payload through the owning runtime hub', () => {
  const element = new FakeElement('change -> todo.description.changed');
  element.value = 'Buy milk';
  const runtime = createYauitRuntime({ root: element, diagnostics: 'throw' });
  const messages = [];

  runtime.events.define('todo.description.changed', {
    payloadRequired: true,
    buildPayload({ source }) {
      return { description: source.value, nested: { source: 'control' } };
    },
    validatePayload(payload) {
      return payload.description.length > 0;
    }
  });
  runtime.events.subscribe('todo.description.changed', (message) => {
    messages.push(message);
  });

  runtime.start();
  element.dispatchEvent(new Event('change'));

  assert.equal(messages.length, 1);
  assert.deepEqual(messages[0].payload, {
    description: 'Buy milk',
    nested: { source: 'control' }
  });
  assert.equal(Object.isFrozen(messages[0]), true);
  assert.equal(Object.isFrozen(messages[0].payload), true);
  assert.equal(Object.isFrozen(messages[0].payload.nested), true);
});

test('.prevent cancels the native default and .once publishes successfully once', () => {
  const element = new FakeElement(
    'submit.prevent.once -> todo.creation.requested'
  );
  const runtime = createYauitRuntime({ root: element, diagnostics: 'throw' });
  let publications = 0;

  runtime.events.define('todo.creation.requested');
  runtime.events.subscribe('todo.creation.requested', () => {
    publications += 1;
  });
  runtime.start();

  const firstAccepted = element.dispatchEvent(
    new Event('submit', { cancelable: true })
  );
  const secondAccepted = element.dispatchEvent(
    new Event('submit', { cancelable: true })
  );

  assert.equal(firstAccepted, false);
  assert.equal(secondAccepted, true);
  assert.equal(publications, 1);
});

test('.once remains active when asynchronous payload construction is rejected', () => {
  const diagnostics = [];
  const element = new FakeElement('click.once -> todo.selected');
  const runtime = createYauitRuntime({
    root: element,
    diagnostics: 'off',
    onDiagnostic(diagnostic) {
      diagnostics.push(diagnostic);
    }
  });
  let attempts = 0;
  let publications = 0;

  runtime.events.define('todo.selected', {
    payloadRequired: true,
    buildPayload() {
      attempts += 1;
      return attempts === 1 ? Promise.resolve({ todoId: 'todo-123' }) : {
        todoId: 'todo-123'
      };
    }
  });
  runtime.events.subscribe('todo.selected', () => {
    publications += 1;
  });
  runtime.start();

  element.dispatchEvent(new Event('click'));
  element.dispatchEvent(new Event('click'));
  element.dispatchEvent(new Event('click'));

  assert.deepEqual(
    diagnostics.map(({ code }) => code),
    ['YAUIT_PAYLOAD_BUILDER_ASYNC']
  );
  assert.equal(attempts, 2);
  assert.equal(publications, 1);
});

test('two runtimes have isolated hubs', () => {
  const firstElement = new FakeElement('click -> todo.selected');
  const secondElement = new FakeElement('click -> todo.selected');
  const firstRuntime = createYauitRuntime({ root: firstElement });
  const secondRuntime = createYauitRuntime({ root: secondElement });
  let firstPublications = 0;
  let secondPublications = 0;

  firstRuntime.events.subscribe('todo.selected', () => {
    firstPublications += 1;
  });
  secondRuntime.events.subscribe('todo.selected', () => {
    secondPublications += 1;
  });
  firstRuntime.start();
  secondRuntime.start();

  firstElement.dispatchEvent(new Event('click'));

  assert.equal(firstPublications, 1);
  assert.equal(secondPublications, 0);
});

test('stop removes declarative native-event listeners', () => {
  const element = new FakeElement('click -> todo.selected');
  const runtime = createYauitRuntime({ root: element });
  let publications = 0;

  runtime.events.subscribe('todo.selected', () => {
    publications += 1;
  });
  runtime.start();
  runtime.stop();
  element.dispatchEvent(new Event('click'));

  assert.equal(publications, 0);
});

test('reports invalid mappings without disabling valid siblings', () => {
  const diagnostics = [];
  const element = new FakeElement(
    'click.unknown -> todo.invalid; change -> todo.description.changed'
  );
  const runtime = createYauitRuntime({
    root: element,
    diagnostics: 'off',
    onDiagnostic(diagnostic) {
      diagnostics.push(diagnostic);
    }
  });
  let publications = 0;

  runtime.events.subscribe('todo.description.changed', () => {
    publications += 1;
  });
  runtime.start();
  element.dispatchEvent(new Event('change'));

  assert.deepEqual(
    diagnostics.map(({ code }) => code),
    ['YAUIT_EMIT_MODIFIER_UNKNOWN']
  );
  assert.equal(publications, 1);
});

test('rejects non-plain payload data before publication', () => {
  const diagnostics = [];
  const element = new FakeElement('click -> todo.selected');
  const runtime = createYauitRuntime({
    root: element,
    diagnostics: 'off',
    onDiagnostic(diagnostic) {
      diagnostics.push(diagnostic);
    }
  });
  let publications = 0;

  runtime.events.define('todo.selected', {
    buildPayload() {
      return { selectedAt: new Date() };
    }
  });
  runtime.events.subscribe('todo.selected', () => {
    publications += 1;
  });
  runtime.start();
  element.dispatchEvent(new Event('click'));

  assert.deepEqual(
    diagnostics.map(({ code }) => code),
    ['YAUIT_EVENT_PAYLOAD_NOT_PLAIN_DATA']
  );
  assert.equal(publications, 0);
});
