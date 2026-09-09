export function cloneAndFreezePlainData(value) {
  return cloneValue(value, '$', new WeakSet());
}

function cloneValue(value, path, ancestors) {
  if (
    value === undefined ||
    value === null ||
    typeof value === 'string' ||
    typeof value === 'boolean'
  ) {
    return value;
  }

  if (typeof value === 'number') {
    if (!Number.isFinite(value)) {
      throw new TypeError(`Domain payload contains a non-finite number at ${path}.`);
    }
    return value;
  }

  if (typeof value !== 'object') {
    throw new TypeError(`Domain payload contains unsupported ${typeof value} data at ${path}.`);
  }

  if (ancestors.has(value)) {
    throw new TypeError(`Domain payload contains a circular reference at ${path}.`);
  }

  const isArray = Array.isArray(value);
  const prototype = Object.getPrototypeOf(value);
  if (!isArray && prototype !== Object.prototype && prototype !== null) {
    throw new TypeError(`Domain payload contains a non-plain object at ${path}.`);
  }

  if (Object.getOwnPropertySymbols(value).length > 0) {
    throw new TypeError(`Domain payload contains symbol properties at ${path}.`);
  }

  ancestors.add(value);

  const clone = isArray ? [] : {};
  for (const key of Object.keys(value)) {
    const descriptor = Object.getOwnPropertyDescriptor(value, key);
    if (descriptor?.get || descriptor?.set) {
      throw new TypeError(`Domain payload contains an accessor at ${path}.${key}.`);
    }

    const item = cloneValue(value[key], `${path}.${key}`, ancestors);
    Object.defineProperty(clone, key, {
      value: item,
      enumerable: true,
      configurable: false,
      writable: false
    });
  }

  ancestors.delete(value);
  return Object.freeze(clone);
}
