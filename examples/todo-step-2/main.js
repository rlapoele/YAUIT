import { createYauitRuntime } from '../../packages/yauit/src/index.js';

const eventLog = document.querySelector('#event-log');
const eventCount = document.querySelector('#event-count');
const diagnosticLog = document.querySelector('#diagnostic-log');
const diagnosticCount = document.querySelector('#diagnostic-count');

const diagnostics = [];
const receivedEvents = [];

const runtime = createYauitRuntime({
  root: document,
  diagnostics: 'warn',
  strictEvents: true,
  onDiagnostic(diagnostic) {
    diagnostics.push(diagnostic);
    diagnosticCount.textContent = countLabel(diagnostics.length, 'diagnostic');

    const item = document.createElement('li');
    item.textContent = `${diagnostic.code}: ${diagnostic.message}`;
    diagnosticLog.prepend(item);
  }
});

runtime.events.define('todo.creation.requested', {
  payloadRequired: true,
  buildPayload({ source }) {
    const fields = new FormData(source);
    return {
      description: String(fields.get('description') ?? '').trim()
    };
  },
  validatePayload(payload) {
    return typeof payload?.description === 'string' && payload.description.length > 0;
  }
});

runtime.events.define('todo.completion-change.requested', {
  payloadRequired: true,
  buildPayload({ source }) {
    return {
      todoId: source.value,
      completed: source.checked
    };
  },
  validatePayload(payload) {
    return typeof payload?.todoId === 'string' &&
      payload.todoId.length > 0 &&
      typeof payload.completed === 'boolean';
  }
});

runtime.events.define('todo-list.filter.selected', {
  payloadRequired: true,
  buildPayload({ source }) {
    return { filter: source.value };
  },
  validatePayload(payload) {
    return ['all', 'active', 'completed'].includes(payload?.filter);
  }
});

runtime.events.define('todo.deletion.requested', {
  payloadRequired: true,
  buildPayload({ source }) {
    return { todoId: source.value };
  },
  validatePayload(payload) {
    return typeof payload?.todoId === 'string' && payload.todoId.length > 0;
  }
});

for (const type of [
  'todo.creation.requested',
  'todo.completion-change.requested',
  'todo-list.filter.selected',
  'todo.deletion.requested'
]) {
  runtime.events.subscribe(type, appendEvent);
}

runtime.start();

function appendEvent(message) {
  receivedEvents.push(message);
  eventCount.textContent = countLabel(receivedEvents.length, 'event');

  const item = document.createElement('li');
  const heading = document.createElement('strong');
  const payload = document.createElement('pre');

  heading.textContent = message.type;
  payload.textContent = JSON.stringify(message.payload, null, 2);
  item.append(heading, payload);
  eventLog.prepend(item);
}

function countLabel(count, noun) {
  return `${count} ${noun}${count === 1 ? '' : 's'}`;
}

globalThis.todoStep2Prototype = Object.freeze({
  diagnostics,
  receivedEvents,
  runtime
});
