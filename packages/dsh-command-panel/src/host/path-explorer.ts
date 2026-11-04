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
import { lstat, readdir, realpath, stat } from "node:fs/promises";
import type { Dirent, Stats } from "node:fs";
import { homedir } from "node:os";
import { isAbsolute, normalize, resolve } from "node:path";

import type { Context } from "@deepseek-ai/cordis";
import { Remote, TypertRemoteService } from "@deepseek-ai/dsh-typert-protocol";

import {
  PATH_SERVICE,
  type PathEntry,
  type PathInspectAnswer,
  type PathInspectRequest,
  type PathResolveRequest,
  type PathResolveResult,
} from "../shared.ts";

export { PATH_SERVICE };
export type { PathEntry, PathInspectAnswer, PathInspectRequest, PathResolveRequest, PathResolveResult };

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
 * trailing `AbortSignal` the last. The gateway recognises cancellation by the
 * literal parameter name `signal` only — any other spelling becomes a JSON
 * business argument instead.
 */
export class PathExplorerService extends TypertRemoteService {
  static inject: string[] = [];

  constructor(ctx: Context) {
    super(ctx, PATH_SERVICE);
  }

  @Remote("resolve")
  async resolve(request: PathResolveRequest, signal?: AbortSignal): Promise<PathResolveResult> {
    void signal;
    const home = homedir();
    const query = request.query;
    if (typeof query !== "string" || query === "") return invalid("query must be a non-empty string");
    // A bare `~` names the home directory and a bare `..` names the parent of
    // the base, neither carrying a separator; any other separator-free word
    // belongs to the workspace index, not this plane.
    if (query !== "~" && (query.split(/[\\/]/, 1)[0] ?? "") !== ".." && !query.includes("/") && !query.includes("\\")) {
      return invalid("query must contain a path separator or a parent step");
    }
    // Dot segments fold before the directory/fragment split, or a mid-path
    // `..` would end up filtered against like a child name. Relative queries
    // climb from the session's working directory; without one there is
    // nothing to climb from, and that is a caller contract breach.
    const expanded = expandHome(query, home);
    let target: string;
    if (isAbsolute(expanded)) {
      target = normalize(expanded);
    } else if (expanded.startsWith("~")) {
      target = normalize(expanded);
    } else {
      const base = request.base;
      if (typeof base !== "string" || base === "" || !isAbsolute(base)) {
        return invalid("relative queries need an absolute session base directory");
      }
      target = normalize(resolve(base, expanded));
    }

    // Split into the directory to list and the fragment to filter by. A bare
    // `~` names the home directory itself, exactly like a trailing separator
    // (whose separator the listing path keeps, so children join cleanly).
    const lastSeparator = Math.max(target.lastIndexOf("/"), target.lastIndexOf("\\"));
    // `..`-ending queries name the climbed-to directory itself, the same way a
    // trailing separator does: the reader wants its children, not the entry.
    const namesDirectory =
      query === "~" || query === ".." || query.endsWith("/..") || query.endsWith("\\..") || lastSeparator === target.length - 1;
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

  /**
   * Say what one path is, and where a symlink points.
   *
   * The reason this exists at all: the host's file service refuses a final
   * symlink for every read, even one pointing inside the workspace, so a
   * surface that means to show the file behind a link must resolve it first.
   * Only the final component is followed, and only when it is itself a link,
   * which is the same depth the read gate refuses.
   */
  @Remote("inspect")
  async inspect(request: PathInspectRequest, signal?: AbortSignal): Promise<PathInspectAnswer> {
    void signal;
    const raw = request?.path;
    if (typeof raw !== "string" || !isAbsolute(raw)) throw new Error("path must be an absolute path");
    const path = resolve(raw);
    let entry: Stats;
    try {
      entry = await lstat(path);
    } catch {
      return { kind: "missing" };
    }
    if (!entry.isSymbolicLink()) {
      return { kind: entry.isFile() ? "file" : entry.isDirectory() ? "directory" : "other" };
    }
    try {
      const target = await realpath(path);
      const info = await stat(target);
      return {
        kind: "symlink",
        target,
        targetKind: info.isFile() ? "file" : info.isDirectory() ? "directory" : "other",
      };
    } catch {
      // A dangling or unreadable link: it is still a link, and there is nowhere
      // to send the reader.
      return { kind: "symlink" };
    }
  }
}

export default PathExplorerService;
