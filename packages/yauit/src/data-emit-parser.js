const DOMAIN_EVENT_NAME = /^[a-z][a-z0-9]*(?:-[a-z0-9]+)*(?:\.[a-z][a-z0-9]*(?:-[a-z0-9]+)*)+$/;
const NATIVE_EVENT_NAME = /^[A-Za-z][A-Za-z0-9:_-]*$/;

export const INITIAL_DATA_EMIT_MODIFIERS = Object.freeze([
  'once',
  'prevent',
  'self'
]);

const KNOWN_MODIFIERS = new Set(INITIAL_DATA_EMIT_MODIFIERS);

export function isDomainEventName(value) {
  return DOMAIN_EVENT_NAME.test(value);
}

export function parseDataEmit(value) {
  const diagnostics = [];
  const mappings = [];

  if (typeof value !== 'string' || value.trim() === '') {
    diagnostics.push(diagnostic(
      'YAUIT_EMIT_ATTRIBUTE_EMPTY',
      'data-emit must contain at least one mapping.',
      typeof value === 'string' ? value : ''
    ));

    return freezeResult(mappings, diagnostics);
  }

  const rawMappings = value.split(';');
  const hasTrailingSeparator = value.trimEnd().endsWith(';');
  const seen = new Set();

  rawMappings.forEach((rawMapping, index) => {
    const mappingText = rawMapping.trim();
    const isAllowedTrailingEmpty =
      mappingText === '' &&
      index === rawMappings.length - 1 &&
      hasTrailingSeparator;

    if (isAllowedTrailingEmpty) return;

    if (mappingText === '') {
      diagnostics.push(diagnostic(
        'YAUIT_EMIT_MAPPING_EMPTY',
        'Empty data-emit mappings are not allowed.',
        rawMapping
      ));
      return;
    }

    const arrowParts = mappingText.split('->');
    if (arrowParts.length !== 2) {
      diagnostics.push(diagnostic(
        'YAUIT_EMIT_MAPPING_INVALID',
        'A data-emit mapping must contain exactly one -> separator.',
        mappingText
      ));
      return;
    }

    const sourceText = arrowParts[0].trim();
    const domainEvent = arrowParts[1].trim();
    const sourceParts = sourceText.split('.');
    const nativeEvent = sourceParts.shift()?.trim() ?? '';
    const modifiers = sourceParts.map((part) => part.trim());
    let invalid = false;

    if (!NATIVE_EVENT_NAME.test(nativeEvent)) {
      diagnostics.push(diagnostic(
        'YAUIT_EMIT_NATIVE_EVENT_INVALID',
        `Invalid native event name: ${nativeEvent || '(missing)'}.`,
        mappingText
      ));
      invalid = true;
    }

    if (!isDomainEventName(domainEvent)) {
      diagnostics.push(diagnostic(
        'YAUIT_EMIT_DOMAIN_EVENT_INVALID',
        `Invalid domain event name: ${domainEvent || '(missing)'}.`,
        mappingText
      ));
      invalid = true;
    }

    const modifierSet = new Set();
    for (const modifier of modifiers) {
      if (!KNOWN_MODIFIERS.has(modifier)) {
        diagnostics.push(diagnostic(
          'YAUIT_EMIT_MODIFIER_UNKNOWN',
          `Unknown data-emit modifier: ${modifier || '(empty)'}.`,
          mappingText
        ));
        invalid = true;
        continue;
      }

      if (modifierSet.has(modifier)) {
        diagnostics.push(diagnostic(
          'YAUIT_EMIT_MODIFIER_REPEATED',
          `Repeated data-emit modifier: ${modifier}.`,
          mappingText
        ));
        invalid = true;
        continue;
      }

      modifierSet.add(modifier);
    }

    if (invalid) return;

    const canonicalModifiers = [...modifierSet].sort();
    const identity = `${nativeEvent}.${canonicalModifiers.join('.')}->${domainEvent}`;

    if (seen.has(identity)) {
      diagnostics.push(diagnostic(
        'YAUIT_EMIT_MAPPING_DUPLICATE',
        'Duplicate data-emit mapping.',
        mappingText
      ));
      return;
    }

    seen.add(identity);
    mappings.push(Object.freeze({
      nativeEvent,
      domainEvent,
      modifiers: Object.freeze([...modifierSet]),
      raw: mappingText
    }));
  });

  return freezeResult(mappings, diagnostics);
}

function diagnostic(code, message, mapping) {
  return Object.freeze({ code, message, mapping });
}

function freezeResult(mappings, diagnostics) {
  return Object.freeze({
    mappings: Object.freeze(mappings),
    diagnostics: Object.freeze(diagnostics)
  });
}
