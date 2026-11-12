/**
 * The browsing state one conversation keeps for the test board.
 *
 * The host mounts only the active conversation view, so switching to another
 * tab unmounts the board and every `useState` with it; coming back used to
 * reopen the latest run, lose the picked history entry, reset the filter and
 * sort, fold every directory and close the detail pane. The view factory is
 * built once per apply and outlives those mounts, so the memory lives there,
 * keyed by session id: two conversations never share a board, and returning to
 * a session shows the reading the reader was in the middle of.
 *
 * The records are deliberately in-memory: they restore the reader's place
 * across view switches, not across a page reload. A fresh page starts from the
 * latest run, which is the honest answer after the workspace may have run again
 * while the tab was closed.
 */
import type { RowFilter, RowSort } from "./model.ts";
import type { NavSelection } from "./nav.ts";

/** Everything one session remembers about its board. */
export interface TestboardMemory {
  /** The picked history run; absent means the latest run. */
  selectedRun?: string;
  /** The row filter, or absent before the first choice. */
  filter?: RowFilter;
  /** The list search text. */
  query?: string;
  /** The row ordering. */
  sort?: RowSort;
  /** Files whose cases are open, in click order. */
  expanded?: readonly string[];
  /** Folded directories, keyed `${packageName}:${dirPath}`. */
  collapsed?: readonly string[];
  /** The selected file or case. */
  selection?: NavSelection;
}

/** The session-keyed registry the view factory owns. */
export interface TestboardMemoryRegistry {
  /**
   * The record one session writes to.
   * @param sessionId - the conversation the view is bound to, or undefined on a
   * session-less mount (one record per such mount, never shared with a real id).
   * @returns the live record; callers mutate it in place.
   */
  forSession(sessionId: string | undefined): TestboardMemory;
}

/**
 * Build the registry.
 *
 * Same shape as the other workbench views: one map for the life of the apply, a
 * record created on first use, and the empty session id standing in for a mount
 * the host gave no session.
 * @returns the registry.
 */
export function createTestboardMemoryRegistry(): TestboardMemoryRegistry {
  const records = new Map<string, TestboardMemory>();
  return {
    forSession(sessionId) {
      const key = sessionId ?? "";
      const existing = records.get(key);
      if (existing !== undefined) return existing;
      const created: TestboardMemory = {};
      records.set(key, created);
      return created;
    },
  };
}
