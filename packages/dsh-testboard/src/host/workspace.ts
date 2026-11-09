/**
 * Session → workspace resolution.
 *
 * The board follows the session's working directory, so this is the one place
 * that decides which project a tab is looking at. The realpath is the join key:
 * a session cwd may be a symlinked path while the same workspace is reached
 * through its canonical one elsewhere, and two spellings of one directory would
 * be two boards with two separate run states.
 */
import { realpath } from "node:fs/promises";

/** Structural slice of the Cordis sessions store (live session objects). */
export interface SessionsFace {
  get(id: string): { readonly header?: { readonly cwd?: string } } | undefined;
}

/** Structural slice of the sessionPersistence service (persisted header). */
export interface SessionPersistenceFace {
  stat(id: string): Promise<{ readonly header?: { readonly cwd?: string } } | undefined>;
}

/**
 * Normalize a directory to its canonical absolute path.
 *
 * @param dir - the path to normalize.
 * @returns the realpath, or the input unchanged when it does not exist. The
 *   caller decides whether a missing directory is an empty state or an error;
 *   swallowing it here would hide a deleted workspace behind a plausible path.
 */
export async function canonicalPath(dir: string): Promise<string> {
  try {
    return await realpath(dir);
  } catch {
    return dir;
  }
}

/**
 * Resolve the workspace directory behind one session.
 *
 * Order: the live session header, then the persisted one. A missing cwd returns
 * undefined rather than falling back to the process cwd: the board would then
 * show some other project's tests, which is worse than showing that it does not
 * know which workspace this is.
 *
 * @param sessionId - the conversation whose workspace is wanted.
 * @param sessions - live session store, when the host has one.
 * @param persistence - persisted session store, for a session that is not live.
 * @returns the canonical workspace path, or undefined when neither side knows one.
 */
export async function resolveSessionRoot(
  sessionId: string,
  sessions?: SessionsFace,
  persistence?: SessionPersistenceFace,
): Promise<string | undefined> {
  const live = sessions?.get(sessionId)?.header?.cwd;
  if (typeof live === "string" && live !== "") return canonicalPath(live);
  try {
    const persisted = (await persistence?.stat(sessionId))?.header?.cwd;
    if (typeof persisted === "string" && persisted !== "") return canonicalPath(persisted);
  } catch {
    // Persistence may be mid-restart; an unreadable header is the same outcome
    // as an absent one for this panel.
  }
  return undefined;
}
