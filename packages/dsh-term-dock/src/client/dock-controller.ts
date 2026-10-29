/**
 * Bind one dock mount to the core's observable visibility.
 *
 * The old entry read `dockVisible()` once, so the `⌘⇧M` command changed the
 * core's answer while the mounted dock kept its height. This controller is the
 * single subscription point: the current value is delivered once on creation
 * (so a subscriber never has to race a transition between its first read and
 * `subscribe`), every later transition is forwarded, and dispose detaches.
 */

/** The read/subscribe face the core's `dockVisibility` store exposes. */
export interface DockVisibilitySource {
  get(): boolean;
  subscribe(listener: (visible: boolean) => void): () => void;
}

/** What one controller closes over. */
export interface DockControllerOptions {
  readonly visibility: DockVisibilitySource;
  /** Called with the current value and then once per transition. */
  onChange(visible: boolean): void;
}

/** The node-drivable handle the entry and the acceptance probe use. */
export interface DockController {
  /** Stop forwarding transitions; idempotent. */
  dispose(): void;
}

/**
 * Create the subscription for one dock mount.
 * @param options - visibility source and the sink that applies the value.
 * @returns the handle; the subscription is live before this returns.
 */
export function createDockController({ visibility, onChange }: DockControllerOptions): DockController {
  let disposed = false;
  // Deliver the current value first: the dock is mounted with the answer the
  // store holds now, not with a value captured before the subscription.
  onChange(visibility.get());
  const off = visibility.subscribe(visible => {
    if (disposed) return;
    onChange(visible);
  });
  return {
    dispose() {
      if (disposed) return;
      disposed = true;
      off();
    },
  };
}
