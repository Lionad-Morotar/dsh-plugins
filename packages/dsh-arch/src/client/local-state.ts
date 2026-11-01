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
import type { ArchWorkspaceState } from "../shared.ts";

const keyOf = (sessionId: string): string => `dsh-arch:state:${sessionId}`;

/** Read the locally kept state; null when none is stored or storage is unusable. */
export function loadLocalState(sessionId: string): ArchWorkspaceState | null {
  try {
    const raw = localStorage.getItem(keyOf(sessionId));
    if (raw === null) return null;
    return JSON.parse(raw) as ArchWorkspaceState;
  } catch {
    return null;
  }
}

/** Persist the state locally; an unusable storage drops the save silently. */
export function saveLocalState(sessionId: string, state: ArchWorkspaceState): void {
  try {
    localStorage.setItem(keyOf(sessionId), JSON.stringify(state));
  } catch {
    // Quota or sandbox: the host store remains the source of truth when it
    // exists, and a lost local save only costs the degraded-mode restore.
  }
}
