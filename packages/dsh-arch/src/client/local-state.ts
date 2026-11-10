/**
 * The degraded-mode persistence layer: the same workspace state the host
 * store would hold, kept in localStorage when `storageDomain` is missing.
 *
 * Keyed by session id — on the degraded path the workspace realpath never
 * reached the client, and one session maps to one workspace for the panel's
 * lifetime. Every access is guarded: a sandboxed or quota-exhausted storage
 * must degrade to "nothing saved", never to a thrown error taking the panel
 * down with it.
 */
import {
  mergeArchWorkspaceState,
  readArchWorkspaceState,
  type ArchStateChanges,
  type ArchWorkspaceState,
} from "../shared.ts";

const keyOf = (sessionId: string): string => `dsh-arch:state:${sessionId}`;

/**
 * Read the locally kept state; null when none is stored or storage is unusable.
 *
 * The stored JSON goes through the same normalization as the host record, so a
 * state written before viewports were cached per view migrates instead of
 * being restored with its single viewport applied to the wrong tab.
 */
export function loadLocalState(sessionId: string): ArchWorkspaceState | null {
  try {
    const raw = localStorage.getItem(keyOf(sessionId));
    if (raw === null) return null;
    return readArchWorkspaceState(JSON.parse(raw));
  } catch {
    return null;
  }
}

/**
 * Persist the state locally; an unusable storage drops the save silently.
 *
 * The degraded path runs the same slice merge as the host store: two panels on
 * one session (the tab and the dock panel) both write this key, and a whole
 * state write would let the last one roll the other's framing back.
 */
export function saveLocalState(sessionId: string, state: ArchWorkspaceState, changes?: ArchStateChanges): void {
  try {
    const raw = localStorage.getItem(keyOf(sessionId));
    const existing = raw === null ? null : readArchWorkspaceState(JSON.parse(raw));
    const next =
      existing === null || changes === undefined ? state : mergeArchWorkspaceState(existing, state, changes);
    localStorage.setItem(keyOf(sessionId), JSON.stringify(next));
  } catch {
    // Quota or sandbox: the host store remains the source of truth when it
    // exists, and a lost local save only costs the degraded-mode restore.
  }
}
