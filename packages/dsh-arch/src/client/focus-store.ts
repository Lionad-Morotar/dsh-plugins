/**
 * The hand-off for "select this element" requests that arrive from outside the
 * panel.
 *
 * A chip click happens in the composer, which knows nothing about the chrome:
 * the arch tab may not even be mounted yet, and when it is, the diagram handle
 * lives inside a closure the click cannot reach. This module is the one place
 * both sides meet. It is deliberately DOM-free and React-free so the ordering
 * rules below are testable on their own.
 *
 * One pending request, not a queue: a focus is a "where the reader wants to be"
 * statement, so the latest click wins and a stale target must never replay on
 * some later unrelated mount.
 */

/** One listener the store notifies when a request lands. */
export type ArchFocusListener = () => void;

let pending: string | undefined;
const listeners = new Set<ArchFocusListener>();

/**
 * Ask the panel to select one element.
 *
 * Called before the tab switch, never after: the view is mounted lazily, so a
 * request that arrived later would miss the mount that could have consumed it.
 * @param elementId - the element id as the model spells it.
 */
export function requestArchFocus(elementId: string): void {
  const id = elementId.trim();
  if (id === "") return;
  pending = id;
  for (const listener of [...listeners]) listener();
}

/**
 * Take whatever is waiting.
 *
 * Taking clears: the request is consumed by exactly one mount, and a second
 * consumer would move the diagram under a reader who has already moved on.
 * @returns the element id, or undefined when nothing is waiting.
 */
export function takeArchFocus(): string | undefined {
  const id = pending;
  pending = undefined;
  return id;
}

/**
 * Observe requests.
 *
 * The listener is expected to call {@link takeArchFocus} itself: the store does
 * not know whether the subscriber is a mounted panel that can act now or a
 * component that is about to unmount.
 * @param listener - called after every accepted request.
 * @returns disposer that unsubscribes.
 */
export function subscribeArchFocus(listener: ArchFocusListener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/**
 * Drop any waiting request.
 *
 * Used when the click could not be honoured at all (no arch tab in the host's
 * row): leaving it behind would move the diagram the next time the panel
 * happens to mount for an unrelated reason.
 */
export function clearArchFocus(): void {
  pending = undefined;
}
