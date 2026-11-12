/**
 * The browsing state one conversation keeps for the architecture tab.
 *
 * The host unmounts the conversation view on every tab switch, so the chrome
 * remounts and its selection is gone; the viewport and the selected diagram
 * already survive through the workspace state, but the element a reader had
 * selected (and the details pane that came with it) did not. The factory is
 * built once per apply and outlives those mounts, so the selection lives there,
 * keyed by session id: two conversations never share a reading, and coming back
 * to a session restores the element it was looking at.
 *
 * The record is deliberately in-memory: it restores across view switches, not
 * across a page reload or a model change. A fresh mount with a different model
 * has no guarantee the element still exists, and the chrome ignores an id it
 * cannot find.
 */

/** Everything one session remembers about its architecture tab. */
export interface ArchViewMemory {
  /** The element that was selected when the tab was left. */
  selectedId?: string;
}

/** The session-keyed registry the view factory owns. */
export interface ArchViewMemoryRegistry {
  /**
   * The record one session writes to.
   * @param sessionId - the conversation the view is bound to, or undefined on a
   * session-less mount (one record per such mount, never shared with a real id).
   * @returns the live record; callers mutate it in place.
   */
  forSession(sessionId: string | undefined): ArchViewMemory;
}

/**
 * Build the registry.
 *
 * Same shape as the other workbench views: one map for the life of the apply, a
 * record created on first use, and the empty session id standing in for a mount
 * the host gave no session.
 * @returns the registry.
 */
export function createArchViewMemoryRegistry(): ArchViewMemoryRegistry {
  const records = new Map<string, ArchViewMemory>();
  return {
    forSession(sessionId) {
      const key = sessionId ?? "";
      const existing = records.get(key);
      if (existing !== undefined) return existing;
      const created: ArchViewMemory = {};
      records.set(key, created);
      return created;
    },
  };
}
