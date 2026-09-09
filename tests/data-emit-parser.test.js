import assert from 'node:assert/strict';
import test from 'node:test';

import {
  isDomainEventName,
  parseDataEmit
} from '../packages/yauit/src/data-emit-parser.js';

test('parses multiple mappings and an allowed trailing semicolon', () => {
  const result = parseDataEmit(`
    submit.prevent -> todo.creation.requested;
    reset.once.self -> todo-form.reset-requested;
  `);

  assert.equal(result.diagnostics.length, 0);
  assert.deepEqual(
    result.mappings.map(({ nativeEvent, domainEvent, modifiers }) => ({
      nativeEvent,
      domainEvent,
      modifiers
    })),
    [
      {
        nativeEvent: 'submit',
        domainEvent: 'todo.creation.requested',
        modifiers: ['prevent']
      },
      {
        nativeEvent: 'reset',
        domainEvent: 'todo-form.reset-requested',
        modifiers: ['once', 'self']
      }
    ]
  );
});

test('keeps valid siblings when another mapping is invalid', () => {
  const result = parseDataEmit(
    'click.unknown -> todo.selected; change -> todo.completion.requested'
  );

  assert.equal(result.mappings.length, 1);
  assert.equal(result.mappings[0].domainEvent, 'todo.completion.requested');
  assert.deepEqual(
    result.diagnostics.map(({ code }) => code),
    ['YAUIT_EMIT_MODIFIER_UNKNOWN']
  );
});

test('rejects repeated modifiers and equivalent duplicate mappings', () => {
  const result = parseDataEmit(`
    click.once.once -> todo.selected;
    submit.prevent.once -> todo.creation.requested;
    submit.once.prevent -> todo.creation.requested
  `);

  assert.equal(result.mappings.length, 1);
  assert.deepEqual(
    result.diagnostics.map(({ code }) => code),
    [
      'YAUIT_EMIT_MODIFIER_REPEATED',
      'YAUIT_EMIT_MAPPING_DUPLICATE'
    ]
  );
});

test('validates dotted lowercase domain event names', () => {
  assert.equal(isDomainEventName('todo.created'), true);
  assert.equal(isDomainEventName('todo-list.filter.selected'), true);
  assert.equal(isDomainEventName('Todo.Created'), false);
  assert.equal(isDomainEventName('created'), false);
  assert.equal(isDomainEventName('todo.filter_selected'), false);
});
