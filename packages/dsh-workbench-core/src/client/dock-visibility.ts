/**
 * Observable workbench dock visibility.
 *
 * The service used to expose a read/write boolean pair. Every reader captured
 * the value once at mount, so the `⌘⇧M` command could flip the bit while the
 * terminal dock kept its height. Hiding a dock is a runtime action, not a
 * remount: the dock subscribes to this store and releases or restores its own
 * height without touching the terminal processes.
 *
 * `workbench.dockVisible()` / `setDockVisible()` stay as a compatibility
 * facade over the same store, so a feature package written before this module
 * keeps reading a truthful answer.
 */

/** Called once per accepted transition, with the new value. */
export type DockVisibilityListener = (visible: boolean) => void;

/** Read/subscribe face the terminal dock consumes. */
export interface DockVisibility {
  /** The current answer; true means the dock may occupy its slot. */
  get(): boolean;
  /** Publish one value; setting the current value is a no-op. */
  set(visible: boolean): void;
  /** Invert the current value. */
  toggle(): void;
  /** Subscribe to transitions; returns the unsubscribe function. */
  subscribe(listener: DockVisibilityListener): () => void;
}

/**
 * Create the visibility store for one client mount.
 * @param initial - starting value; the workbench shows its dock by default.
 * @returns the store; listeners live only in this closure.
 */
export function createDockVisibility(initial = true): DockVisibility {
  let visible = initial;
  const listeners = new Set<DockVisibilityListener>();

  const set = (next: boolean): void => {
    if (next === visible) return;
    visible = next;
    // Copy before iterating: a listener may unsubscribe itself while notified.
    for (const listener of [...listeners]) listener(visible);
  };

  return {
    get: () => visible,
    set,
    toggle: () => set(!visible),
    subscribe(listener) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
  };
}
