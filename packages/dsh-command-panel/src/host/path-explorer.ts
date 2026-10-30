/**
 * Host half: literal filesystem exploration for the panel's absolute-path
 * branch.
 *
 * The host's own file surfaces are workspace-bound on purpose
 * (`workspaceFiles.list` refuses to leave the root, and the file reference
 * index folds out-of-root absolutes to nothing), while the panel's readers
 * legitimately navigate `~/.config`, `/tmp` and peers. This service is that
 * one capability: given the text as typed, expand `~`, list one directory,
 * filter by the last segment, and never throw.
 *
 * No host service is required, so `inject` stays empty: an entry the host does
 * not define would keep the whole plugin waiting forever, silently.
 */
import { readdir, stat } from "node:fs/promises";
import type { Dirent } from "node:fs";
import { homedir } from "node:os";
import { isAbsolute } from "node:path";

import type { Context } from "@deepseek-ai/cordis";
import { Remote, TypertRemoteService } from "@deepseek-ai/dsh-typert-protocol";

import { PATH_SERVICE, type PathEntry, type PathResolveRequest, type PathResolveResult } from "../shared.ts";

export { PATH_SERVICE };
export type { PathEntry, PathResolveRequest, PathResolveResult };

/** Answer length when the caller says nothing; also the floor of the clamp. */
export const DEFAULT_LIMIT = 20;
/** Answer length ceiling; a panel is a picker, not a file manager. */
export const MAX_LIMIT = 100;

/** Normalize an untrusted limit into [1, MAX_LIMIT]. */
export function clampLimit(value: unknown): number {
  if (typeof value !== "number" || !Number.isFinite(value)) return DEFAULT_LIMIT;
  return Math.min(MAX_LIMIT, Math.max(1, Math.trunc(value)));
}

/**
 * Expand the tilde forms a shell reader types.
 *
 * `~` and `~/…` become the home directory; `~user/…` keeps its literal text
 * (checked for existence as-is, never expanded), matching the slice's stated
 * boundary.
 */
export function expandHome(query: string, home: string): string {
  if (query === "~") return home;
  if (query.startsWith("~/") || query.startsWith("~\\")) return `${home}${query.slice(1)}`;
  return query;
}

function invalid(message: string): PathResolveResult {
  return { ok: false, error: { code: "invalid-request", message } };
}

/** stat that answers undefined instead of throwing; the caller degrades. */
async function statOf(target: string): Promise<{ isDirectory(): boolean } | undefined> {
  try {
    return await stat(target);
  } catch {
    return undefined;
  }
}

/** Direct children of one directory, directories first, base-insensitive. */
async function childrenOf(directory: string): Promise<PathEntry[]> {
  let dirents: readonly Dirent[];
  try {
    dirents = await readdir(directory, { withFileTypes: true });
  } catch {
    // EACCES and peers mean "this directory shows nothing", not "the request
    // failed": an unreadable folder stays explorable one level up.
    return [];
  }
  const entries: PathEntry[] = dirents.map(dirent => ({
    path: `${directory}${dirent.name}`,
    kind: dirent.isDirectory() ? ("directory" as const) : ("file" as const),
    exists: true,
  }));
  entries.sort((left, right) => {
    if (left.kind !== right.kind) return left.kind === "directory" ? -1 : 1;
    return left.path.toLowerCase() < right.path.toLowerCase() ? -1 : 1;
  });
  return entries;
}

/**
 * Resolve one typed path fragment against the filesystem.
 *
 * Wire shape: the request object is the first parameter and an optional
 * trailing `AbortSignal` the last, per the gateway's pass-through contract.
 */
export class PathExplorerService extends TypertRemoteService {
  static inject: string[] = [];

  constructor(ctx: Context) {
    super(ctx, PATH_SERVICE);
  }

  @Remote("resolve")
  async resolve(request: PathResolveRequest, _signal?: AbortSignal): Promise<PathResolveResult> {
    const home = homedir();
    const query = request.query;
    if (typeof query !== "string" || query === "") return invalid("query must be a non-empty string");
    // A bare `~` names the home directory without carrying a separator.
    if (query !== "~" && !query.includes("/") && !query.includes("\\")) {
      return invalid("query must contain a path separator");
    }
    const target = expandHome(query, home);
    if (!isAbsolute(target) && !query.startsWith("~")) {
      return invalid("query must be absolute: start with /, a drive letter, ~, or a UNC root");
    }

    // Split into the directory to list and the fragment to filter by. A bare
    // `~` names the home directory itself, exactly like a trailing separator
    // (whose separator the listing path keeps, so children join cleanly).
    const lastSeparator = Math.max(target.lastIndexOf("/"), target.lastIndexOf("\\"));
    const namesDirectory = query === "~" || lastSeparator === target.length - 1;
    const directory = namesDirectory
      ? /[\\/]$/.test(target)
        ? target
        : `${target}/`
      : target.slice(0, lastSeparator + 1);
    const fragment = namesDirectory ? "" : target.slice(lastSeparator + 1);
    const needle = fragment.toLowerCase();

    const entries: PathEntry[] = [];
    if ((await statOf(directory))?.isDirectory() === true) {
      const children = await childrenOf(directory);
      for (const child of children) {
        if (child.path === target) continue; // the self row below replaces it
        if (needle !== "" && !child.path.slice(directory.length).toLowerCase().startsWith(needle)) continue;
        entries.push(child);
      }
    }
    if (!namesDirectory) {
      const self = await statOf(target);
      if (self !== undefined) {
        entries.unshift({ path: target, kind: self.isDirectory() ? "directory" : "file", exists: true });
      }
    }

    return { ok: true, home, entries: entries.slice(0, clampLimit(request.limit)) };
  }
}

export default PathExplorerService;
