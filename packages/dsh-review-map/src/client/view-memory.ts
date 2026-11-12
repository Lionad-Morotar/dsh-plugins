/**
 * The browsing state one conversation keeps for the review map.
 *
 * The host mounts only the active conversation view, so switching to the Files
 * or chat tab unmounts this panel and every `useState` with it; coming back used
 * to reset the comparison range to "uncommitted", drop the selected row and
 * close the detail panel. The view factory is built once per apply and outlives
 * those mounts, so the memory lives there, keyed by session id: two
 * conversations never share a range, and returning to a session restores the
 * review the reader was in the middle of.
 *
 * The records are deliberately in-memory: they restore the reader's place
 * across view switches, not across a page reload. A fresh page compares the
 * working tree as it is now, which is the honest answer after the repo may have
 * moved while the panel was closed.
 */

/** The two comparison ranges the panel offers. */
export type ReviewScopeKind = "worktree" | "branch";

/** Everything one session remembers about its review. */
export interface ReviewMapMemory {
  /** The comparison range last shown, or absent before the first choice. */
  scopeKind?: ReviewScopeKind;
  /** The row the reader last selected. */
  selectedPath?: string;
  /** The file whose detail panel was open. */
  openPath?: string;
}

/** The session-keyed registry the view factory owns. */
export interface ReviewMapMemoryRegistry {
  /**
   * The record one session writes to.
   * @param sessionId - the conversation the view is bound to, or undefined on a
   * session-less mount (one record per such mount, never shared with a real id).
   * @returns the live record; callers mutate it in place.
   */
  forSession(sessionId: string | undefined): ReviewMapMemory;
}

/**
 * Build the registry.
 *
 * Same shape as the Git view's: one map for the life of the apply, a record
 * created on first use, and the empty session id standing in for a mount the
 * host gave no session.
 * @returns the registry.
 */
export function createReviewMapMemoryRegistry(): ReviewMapMemoryRegistry {
  const records = new Map<string, ReviewMapMemory>();
  return {
    forSession(sessionId) {
      const key = sessionId ?? "";
      const existing = records.get(key);
      if (existing !== undefined) return existing;
      const created: ReviewMapMemory = {};
      records.set(key, created);
      return created;
    },
  };
}
