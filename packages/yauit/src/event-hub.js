export function createEventHub() {
  const subscribers = new Map();

  function subscribe(type, subscriber) {
    if (typeof type !== 'string' || type === '') {
      throw new TypeError('An event subscription requires a non-empty event type.');
    }
    if (typeof subscriber !== 'function') {
      throw new TypeError('An event subscription requires a function.');
    }

    const listeners = subscribers.get(type) ?? new Set();
    listeners.add(subscriber);
    subscribers.set(type, listeners);

    let active = true;
    return () => {
      if (!active) return;
      active = false;
      listeners.delete(subscriber);
      if (listeners.size === 0) subscribers.delete(type);
    };
  }

  function publish(type, payload, metadata = {}) {
    const message = Object.freeze({
      type,
      payload,
      metadata: Object.freeze({ ...metadata })
    });

    const listeners = subscribers.get(type);
    if (!listeners) return message;

    for (const subscriber of [...listeners]) {
      subscriber(message);
    }

    return message;
  }

  return Object.freeze({ subscribe, publish });
}
