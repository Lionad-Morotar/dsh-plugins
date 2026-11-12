/**
 * The browsing state one conversation keeps for the PR view.
 *
 * The host mounts only the active conversation view, so switching to the Files
 * or Git tab unmounts this panel and every `useState` with it; coming back used
 * to reset the comparison to the default pair, the tab to "commits" and the
 * detail pane to nothing. The view factory is built once per apply and outlives
 * those mounts, so the memory lives there, keyed by session id: two
 * conversations never share a range, and returning to a session restores the
 * review the reader was in the middle of.
 *
 * The records are deliberately in-memory: they restore the reader's place
 * across view switches, not across a page reload. A fresh page starts from the
 * repository's current default pair, which is the honest answer after branches
 * may have moved while the panel was closed.
 */

/** The two ways the left pane lists one range. */
export type PrTab = "commits" | "files";

/** Everything one session remembers about its PR view. */
export interface PrViewMemory {
  /** The old side the reader pinned, or absent before the first load. */
  base?: string;
  /** The new side the reader pinned, or absent before the first load. */
  head?: string;
  /** The list tab that was showing. */
  tab?: PrTab;
  /** The selected commit hash, when the commits tab was showing. */
  selectedCommit?: string;
  /** The selected file path, when the files tab was showing. */
  selectedFile?: string;
}

/** The session-keyed registry the view factory owns. */
export interface PrViewMemoryRegistry {
  /**
   * The record one session writes to.
   * @param sessionId - the conversation the view is bound to, or undefined on a
   * session-less mount (one record per such mount, never shared with a real id).
   * @returns the live record; callers mutate it in place.
   */
  forSession(sessionId: string | undefined): PrViewMemory;
}

/**
 * Build the registry.
 *
 * Same shape as the Git view's: one map for the life of the apply, a record
 * created on first use, and the empty session id standing in for a mount the
 * host gave no session.
 * @returns the registry.
 */
export function createPrViewMemoryRegistry(): PrViewMemoryRegistry {
  const records = new Map<string, PrViewMemory>();
  return {
    forSession(sessionId) {
      const key = sessionId ?? "";
      const existing = records.get(key);
      if (existing !== undefined) return existing;
      const created: PrViewMemory = {};
      records.set(key, created);
      return created;
    },
  };
}
