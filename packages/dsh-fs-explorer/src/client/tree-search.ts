/**
 * The file tree's search.
 *
 * Two paths, deliberately unequal. The workspace fuzzy index answers for the
 * whole workspace, including directories the lazy tree has never opened, which
 * is the only way a query can find the file the reader has in mind. When that
 * index is absent — it is an optional host service — the panel falls back to
 * the rows it has already listed, and says so, because a filtered subset
 * presented as a workspace search would be a lie the reader cannot see.
 *
 * Everything here is pure: what the panel does with the rows is the tree's
 * existing row vocabulary, not a second one.
 */
import { ancestorChain, joinPath, type TreeKind, type TreeRow } from "./model.ts";
import type { StatusMap } from "./status.ts";
import { statusOf } from "./status.ts";

/**
 * The last segment of a workspace path, keeping its case.
 *
 * Not `model.ts`'s own basename helper: that one lowercases because it only
 * matches README filenames, while these rows display the name they were given.
 * @param path - a workspace-relative path in either separator style.
 * @returns the final segment.
 */
function pathName(path: string): string {
  const cut = Math.max(path.lastIndexOf("/"), path.lastIndexOf("\\"));
  return cut < 0 ? path : path.slice(cut + 1);
}

/** Where a search answer came from, which is what the panel's scope label says. */
export type SearchOrigin = "index" | "loaded";

/** One directory listing as the host wire carries it, as far as search reads it. */
export interface FileReferenceCandidateLike {
  readonly path: string;
  readonly kind: "file" | "directory";
}

/** The host's optional workspace-wide fuzzy file index. */
export interface FileReferencesFace {
  list(
    agentId: string,
    query: string,
    signal?: AbortSignal,
  ): Promise<unknown> | unknown;
}

/** The slice of the client context this package probes for that index. */
export interface FileReferencesContextLike {
  readonly fileReferences?: unknown;
  readonly remote?: { readonly fileReferences?: unknown } | unknown;
  get?(name: string): unknown;
}

/** Whether a value is the file-reference face rather than a Cordis stub. */
export function isFileReferencesFace(value: unknown): value is FileReferencesFace {
  if (value === null || typeof value !== "object") return false;
  return typeof (value as { list?: unknown }).list === "function";
}

/** Read a service without letting an unmounted stub throw. */
function probe(read: () => unknown): unknown {
  try {
    return read();
  } catch {
    // A service this package did not declare in `inject` answers with a facade
    // that throws until it is mounted; absent and unmounted are the same thing
    // to a search that has a fallback.
    return undefined;
  }
}

/**
 * Resolve the workspace index from the context.
 *
 * Read per call rather than captured once: the host may mount the namespace
 * after this plugin, and a search that gave up at mount time would stay on the
 * degraded path for the rest of the session. The dotted name and the `remote`
 * carrier are both probed because a host build may expose either.
 * @param ctx - the client context this entry was applied to.
 * @returns a resolver, or undefined when search should never ask at all.
 */
export function createFileReferencesResolver(
  ctx: FileReferencesContextLike,
): (() => FileReferencesFace | undefined) | undefined {
  return () => {
    const direct = probe(() => ctx.fileReferences);
    if (isFileReferencesFace(direct)) return direct;
    const viaContext = probe(() => (typeof ctx.get === "function" ? ctx.get("fileReferences") : undefined));
    if (isFileReferencesFace(viaContext)) return viaContext;
    const remote = probe(() => (ctx.remote as { readonly fileReferences?: unknown } | undefined)?.fileReferences);
    if (isFileReferencesFace(remote)) return remote;
    const viaRemote = probe(() => (typeof ctx.get === "function" ? ctx.get("remote.fileReferences") : undefined));
    return isFileReferencesFace(viaRemote) ? viaRemote : undefined;
  };
}

/**
 * Normalize one index answer into candidates.
 *
 * The generated Remote wraps the list in `{ok, value}`; a direct service answers
 * the array itself. Every other shape reads as an empty answer, which the caller
 * shows as "no match" rather than as a failure: a refused search has nothing
 * better to do than say it found nothing.
 * @param response - whatever `list` resolved to.
 * @returns the candidates, filtered to the two kinds the row vocabulary paints.
 */
export function normalizeReferences(response: unknown): FileReferenceCandidateLike[] {
  if (response === null || typeof response !== "object") return [];
  const record = response as { readonly ok?: unknown; readonly value?: unknown };
  if (record.ok === false) return [];
  const value = record.ok === true ? record.value : response;
  if (!Array.isArray(value)) return [];
  const candidates: FileReferenceCandidateLike[] = [];
  for (const entry of value as readonly unknown[]) {
    if (entry === null || typeof entry !== "object") continue;
    const candidate = entry as { readonly path?: unknown; readonly kind?: unknown };
    if (typeof candidate.path !== "string" || candidate.path === "") continue;
    if (candidate.kind !== "file" && candidate.kind !== "directory") continue;
    candidates.push({ path: candidate.path, kind: candidate.kind });
  }
  return candidates;
}

/**
 * Whether a query is worth a host round trip.
 *
 * A single character against a workspace index returns most of the workspace,
 * which is slower than the reader can read and hides the useful answers. The
 * loaded-row fallback has no such cost and answers immediately.
 * @param query - the raw input value.
 * @returns the trimmed query when it can be searched, or undefined.
 */
export function searchQuery(query: string): string | undefined {
  const trimmed = query.trim();
  return trimmed === "" ? undefined : trimmed;
}

/**
 * Build the result rows for a query against the workspace index.
 *
 * Each row is an ordinary entry row at depth 0 with the basename as its name,
 * so it reuses the row's icons, badges and status markers, and the directory
 * prefix is spelled by {@link resultDirectory} rather than by indentation: a
 * flattened list has no hierarchy to indent into.
 * @param candidates - the index's answer.
 * @param statuses - the parsed Git status map, for the file badges.
 * @returns rows in the index's own order.
 */
export function referenceRows(
  candidates: readonly FileReferenceCandidateLike[],
  statuses: StatusMap | undefined,
): TreeRow[] {
  const rows: TreeRow[] = [];
  const seen = new Set<string>();
  for (const candidate of candidates) {
    const path = candidate.path.replace(/\\/gu, "/").replace(/^(?:\.\/)+/u, "");
    if (path === "" || seen.has(path)) continue;
    seen.add(path);
    const kind: TreeKind = candidate.kind;
    const marker = kind === "file" ? statusOf(path, statuses) : undefined;
    const directory = resultDirectory(path);
    rows.push({
      type: "entry",
      path,
      name: pathName(path),
      kind,
      // Flat results, not a tree: every row is a leaf of the answer set.
      depth: 0,
      expanded: false,
      ...(marker === undefined ? {} : { status: marker }),
      ...(directory === "" ? {} : { directory }),
    });
  }
  return rows;
}

/**
 * The directory part of a result path, for the dimmed prefix beside a row name.
 * @param path - a workspace-relative path.
 * @returns the parent path, or an empty string for a row at the workspace root.
 */
export function resultDirectory(path: string): string {
  const normalized = path.replace(/\\/gu, "/");
  const cut = normalized.lastIndexOf("/");
  return cut <= 0 ? "" : normalized.slice(0, cut);
}

/**
 * Every entry path the tree has already listed.
 *
 * The loaded ledger, not the visible rows: a collapsed directory has been read
 * and its children are known, they are just not on screen, and filtering only
 * what is on screen would make the fallback answer a subset of a subset.
 * @param levels - the loaded level ledger, keyed by directory path.
 * @returns `<path, kind>` pairs for every listed entry, directories included.
 */
export function listedEntries(
  levels: ReadonlyMap<string, { readonly nodes: readonly { readonly name: string; readonly kind: TreeKind }[] }>,
): { readonly path: string; readonly kind: TreeKind }[] {
  const entries: { path: string; kind: TreeKind }[] = [];
  for (const [directory, level] of levels) {
    for (const node of level.nodes) {
      entries.push({ path: joinPath(directory, node.name), kind: node.kind });
    }
  }
  return entries;
}

/**
 * Filter already-listed entries by name.
 *
 * Case-insensitive substring rather than subsequence: the index's fuzzy
 * semantics are the host's, and inventing a second, weaker fuzzy matcher here
 * would make the two paths disagree about what "matches". A substring answers
 * the question the fallback can actually keep: "of what I have read, what has
 * this in its name".
 * @param entries - the listed entries.
 * @param query - the trimmed, non-empty query.
 * @returns matching entries in listing order.
 */
export function filterListedEntries(
  entries: readonly { readonly path: string; readonly kind: TreeKind }[],
  query: string,
): { readonly path: string; readonly kind: TreeKind }[] {
  const needle = query.toLowerCase();
  return entries.filter(entry => pathName(entry.path).toLowerCase().includes(needle));
}

/**
 * The directories to open so one result row's file is reachable in the tree.
 *
 * Entering a search result does what opening the file from the tree would: the
 * ancestors open, so the row survives the search ending.
 * @param path - a workspace-relative file path.
 * @returns ancestor directory paths, outermost first.
 */
export function revealChain(path: string): readonly string[] {
  return ancestorChain(path);
}
