const POLICIES = new Set(['off', 'throw', 'warn']);

export class YauitDiagnosticError extends Error {
  constructor(diagnostic) {
    super(`[${diagnostic.code}] ${diagnostic.message}`, { cause: diagnostic.cause });
    this.name = 'YauitDiagnosticError';
    this.diagnostic = diagnostic;
  }
}

export function createDiagnosticReporter({ policy = 'warn', onDiagnostic } = {}) {
  if (!POLICIES.has(policy)) {
    throw new TypeError(`Unknown YAUIT diagnostic policy: ${policy}.`);
  }
  if (onDiagnostic !== undefined && typeof onDiagnostic !== 'function') {
    throw new TypeError('onDiagnostic must be a function when provided.');
  }

  return function reportDiagnostic(input) {
    const diagnostic = Object.freeze({
      severity: 'error',
      ...input
    });

    onDiagnostic?.(diagnostic);

    if (policy === 'off') return diagnostic;

    if (policy === 'throw') {
      throw new YauitDiagnosticError(diagnostic);
    }

    console.warn(`[YAUIT ${diagnostic.code}] ${diagnostic.message}`, diagnostic);
    return diagnostic;
  };
}
