/**
 * The browsing state one conversation keeps for the Git view.
 *
 * The host mounts only the active conversation view, so switching to the Files
 * or chat tab unmounts this panel and takes every `useState` with it; coming
 * back used to reset the selection to the newest commit and both lists to the
 * top. The view factory is built once per apply and outlives those mounts, so
 * the memory lives there, keyed by session id: two conversations never share a
 * selection, and returning to a session restores what the reader was looking
 * at.
 *
 * The records are deliberately in-memory. They restore the reader's place
 * across view switches, not across a page reload: a fresh page starts from the
 * repository's current head, which is the honest answer when the worktree may
 * have moved while the panel was closed.
 */

/** History selection plus the keyboard and scroll position that framed it. */
export interface HistoryMemory {
  /**
   * The selected row: a commit hash or the working-tree sentinel.
   *
   * The pane exports the sentinel as {@link UNCOMMITTED}; it is kept as a plain
   * string here so this module stays free of the pane's React imports.
   */
  selected?: string;
  /** The row the keyboard cursor rests on, same identity as {@link selected}. */
  cursor?: string;
  /** Scroll offset of the history list, in pixels. */
  scrollTop?: number;
  /** The active host-side history search, or absent when the box is empty. */
  search?: string;
}

/** Left column filter, cursor and scroll. */
export interface ChangesMemory {
  /** The row key the cursor rests on (`file:<path>` or `group:<dir>`). */
  cursor?: string;
  /** Path filter text, or absent when the box is empty. */
  query?: string;
  /** Scroll offset of the changes list, in pixels. */
  scrollTop?: number;
}

/** Everything one session remembers about its Git view. */
export interface SessionViewMemory {
  readonly history: HistoryMemory;
  readonly changes: ChangesMemory;
}

/** The session-keyed registry the view factory owns. */
export interface ViewMemoryRegistry {
  /**
   * The record one session writes to.
   * @param sessionId - the conversation the view is bound to, or undefined on a
   * session-less mount (one record per such mount, never shared with a real id).
   * @returns the live record; callers mutate it in place.
   */
  forSession(sessionId: string | undefined): SessionViewMemory;
}

/**
 * Build the registry.
 *
 * Same shape as the file panel's stack registry: one map for the life of the
 * apply, a record created on first use, and the empty session id standing in
 * for a mount the host gave no session.
 * @returns the registry.
 */
export function createViewMemoryRegistry(): ViewMemoryRegistry {
  const records = new Map<string, SessionViewMemory>();
  return {
    forSession(sessionId) {
      const key = sessionId ?? "";
      const existing = records.get(key);
      if (existing !== undefined) return existing;
      const created: SessionViewMemory = { history: {}, changes: {} };
      records.set(key, created);
      return created;
    },
  };
}
