/**
 * The browsing state one conversation keeps for the file explorer.
 *
 * The host mounts only the active conversation view, so switching to the Git
 * or chat tab unmounts the file tree and the panel stack's memory of where the
 * reader was in it; the open panels already survive through the panel-stack
 * registry, but the tree cursor, the expanded directories and the scroll
 * offset did not. The view factory lives for the life of the apply, so this
 * record lives there, keyed by session id: two conversations never share a
 * tree position, and returning to a session puts the cursor back on the row it
 * left.
 *
 * The record is deliberately in-memory: it restores across view switches, not
 * across a page reload. A fresh page starts from the workspace root, which is
 * the honest answer after the workspace may have changed while the tab was
 * closed.
 */

/** Everything one session remembers about its tree. */
export interface FsViewMemory {
  /** Directories whose children were listed, by workspace-relative path. */
  expanded?: readonly string[];
  /** The row the keyboard cursor rested on. */
  cursor?: string;
  /** The tree scroller's offset, in pixels. */
  scrollTop?: number;
}

/** The session-keyed registry the view factory owns. */
export interface FsViewMemoryRegistry {
  /**
   * The record one session writes to.
   * @param sessionId - the conversation the view is bound to, or undefined on a
   * session-less mount (one record per such mount, never shared with a real id).
   * @returns the live record; callers mutate it in place.
   */
  forSession(sessionId: string | undefined): FsViewMemory;
}

/**
 * Build the registry.
 *
 * Same shape as the other workbench views: one map for the life of the apply, a
 * record created on first use, and the empty session id standing in for a mount
 * the host gave no session.
 * @returns the registry.
 */
export function createFsViewMemoryRegistry(): FsViewMemoryRegistry {
  const records = new Map<string, FsViewMemory>();
  return {
    forSession(sessionId) {
      const key = sessionId ?? "";
      const existing = records.get(key);
      if (existing !== undefined) return existing;
      const created: FsViewMemory = {};
      records.set(key, created);
      return created;
    },
  };
}
