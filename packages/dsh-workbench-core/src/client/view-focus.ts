/**
 * Pending view focus requests.
 *
 * The host hands its `openView(id, focus)` capability to the View More menu, so
 * a caller acting from outside that menu can switch a view but cannot deliver
 * the focus string that tells the view *what* to open. A view is also mounted
 * lazily: at the moment the switch happens it may not exist yet.
 *
 * This queue closes both gaps without reaching into the host. The caller drops a
 * request and switches; the target view takes it when it is on screen, either
 * because it mounted with one waiting or because one arrived while it was up.
 *
 * The queue holds one request per view on purpose: a focus is a "where the
 * reader wants to be" statement, so the latest one wins and stale targets must
 * never replay after the reader has moved on.
 */

/** One pending request, addressed to a view id. */
export interface ViewFocusRequest {
  readonly view: string;
  readonly focus: string;
}

/** The queue face carried by the workbench service. */
export interface ViewFocusQueue {
  /** Replace the pending request for one view. */
  request(view: string, focus: string): void;
  /** What is waiting, if anything. Read-only. */
  pending(): ViewFocusRequest | undefined;
  /**
   * Take the waiting focus for one view.
   * @param view - the view asking.
   * @returns the focus string, or undefined when nothing was waiting for it.
   */
  take(view: string): string | undefined;
  /** Observe requests; the target view subscribes so a live view reacts at once. */
  subscribe(listener: () => void): () => void;
}

/**
 * Create an empty queue.
 * @returns the queue; state lives only in this closure.
 */
export function createViewFocusQueue(): ViewFocusQueue {
  let waiting: ViewFocusRequest | undefined;
  const listeners = new Set<() => void>();

  const publish = (): void => {
    for (const listener of [...listeners]) listener();
  };

  return {
    request(view, focus) {
      if (waiting?.view === view && waiting.focus === focus) return;
      waiting = { view, focus };
      publish();
    },
    pending: () => waiting,
    take(view) {
      if (waiting === undefined || waiting.view !== view) return undefined;
      const focus = waiting.focus;
      waiting = undefined;
      return focus;
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
  };
}
