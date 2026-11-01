/**
 * Workspace resolution: session → cwd → realpath → registry identity.
 *
 * The realpath is the join key of the whole host half: the renderer caches
 * instances and the arch store persists state under it, because a session cwd
 * may be a symlinked path while the registry only knows canonical ones.
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

/** Structural slice of the workspaceRegistry service. */
export interface WorkspaceRegistryFace {
  list(): ReadonlyArray<{ readonly id: string; readonly path: string }>;
  resolveByPath?(path: string): Promise<{ readonly id: string; readonly path: string } | undefined>;
}

export interface WorkspaceIdentity {
  readonly id: string;
  readonly path: string;
}

/**
 * Normalize a directory to its canonical absolute path.
 *
 * @returns the realpath, or the input unchanged when it does not exist (the
 *   caller decides whether that is an empty state or an error).
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
 * Order: the live session header, then the persisted one. Returns undefined
 * when neither knows a cwd — the caller falls back to the process cwd, the
 * same policy `dsh-git-explorer` uses so a closed session still renders.
 */
export async function resolveSessionRoot(
  sessionId: string,
  sessions?: SessionsFace,
  sessionPersistence?: SessionPersistenceFace,
): Promise<string | undefined> {
  const live = sessions?.get(sessionId)?.header?.cwd;
  if (typeof live === "string" && live !== "") return canonicalPath(live);
  try {
    const persisted = (await sessionPersistence?.stat(sessionId))?.header?.cwd;
    if (typeof persisted === "string" && persisted !== "") return canonicalPath(persisted);
  } catch {
    // Persistence may be mid-restart; absence is not an error here.
  }
  return undefined;
}

/**
 * Look up the registry identity of a canonical workspace path.
 *
 * Prefers the service's own `resolveByPath` when present (it also normalizes)
 * and falls back to a scan of `list()`; both tolerate a missing registry.
 */
export async function lookupWorkspace(
  path: string,
  registry?: WorkspaceRegistryFace,
): Promise<WorkspaceIdentity | undefined> {
  if (registry === undefined) return undefined;
  if (typeof registry.resolveByPath === "function") {
    const resolved = await registry.resolveByPath(path);
    if (resolved !== undefined) return { id: resolved.id, path: resolved.path };
  }
  return registry.list().find(entry => entry.path === path);
}
