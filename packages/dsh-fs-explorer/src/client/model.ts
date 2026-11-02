/**
 * Pure file-tree logic.
 *
 * The tree, its sorting, its icon vocabulary, the truncation copy and the
 * virtual window are all decided here, without React, the DOM or a host
 * import. The view layer only turns these rows into elements, which is what
 * lets the acceptance probe drive the built bundle in plain Node and compare
 * `buildTree` against the real directory listing.
 */
import { baseName } from "dsh-preview-viewers/address.ts";

import { LISTING_TRUNCATED_LABEL } from "../shared.ts";
import {
  changeDiff,
  indexDirectoryChanges,
  statusOf,
  type FsChangeDiff,
  type FsChangeStatus,
  type StatusMap,
  type StatusTone,
} from "./status.ts";
import { workspaceTagFor, type WorkspaceTag } from "./workspace-map.ts";

/** A directory child as the host listing describes it. */
export interface FsEntryLike {
  readonly name: string;
  /** Acceptance fixtures use `kind`; the host wire uses `type`. */
  readonly kind?: string;
  readonly type?: string;
  readonly size?: number;
}

/** One sorted child kept for presentation. */
export interface TreeNode {
  readonly name: string;
  readonly kind: TreeKind;
  readonly size?: number;
}

/** The only two shapes the tree renders; `other` host entries read as files. */
export type TreeKind = "directory" | "file";

/** Directory names that never surface in the explorer. */
export const NOISE_NAMES: ReadonlySet<string> = new Set(["node_modules", ".git", "dist", "__pycache__"]);

/** Whether one basename is filtered out of every level. */
export function isNoise(name: string): boolean {
  return NOISE_NAMES.has(name);
}

function entryKind(entry: FsEntryLike): TreeKind {
  return entry.kind === "directory" || entry.type === "directory" ? "directory" : "file";
}

/**
 * Sort one directory listing into the tree's presentation order.
 *
 * Directories come first, then both groups sort by name with numeric runs
 * compared as numbers so `file2` precedes `file10`. Filtering happens here and
 * not in the view, so every consumer of `buildTree` sees the same level.
 * @param entries - direct children from the host listing, or a fixture.
 * @returns directories first, then files, both name-sorted.
 */
export function buildTree(entries: readonly FsEntryLike[]): TreeNode[] {
  const nodes: TreeNode[] = [];
  for (const entry of entries) {
    const name = typeof entry?.name === "string" ? entry.name : "";
    if (name === "" || isNoise(name)) continue;
    const kind = entryKind(entry);
    const size = typeof entry.size === "number" && Number.isFinite(entry.size) ? entry.size : undefined;
    nodes.push(size === undefined ? { name, kind } : { name, kind, size });
  }
  nodes.sort((left, right) => {
    if (left.kind !== right.kind) return left.kind === "directory" ? -1 : 1;
    return left.name.localeCompare(right.name, undefined, { numeric: true, sensitivity: "base" });
  });
  return nodes;
}

/** The visual family one file badge belongs to. */
export type IconKind =
  | "code"
  | "markdown"
  | "data"
  | "image"
  | "style"
  | "config"
  | "archive"
  | "folder"
  | "file";

const CODE_EXTENSIONS: ReadonlySet<string> = new Set([
  "ts", "tsx", "mts", "cts", "js", "jsx", "mjs", "cjs", "vue", "svelte", "astro",
  "py", "pyi", "rb", "go", "rs", "java", "kt", "kts", "scala", "clj", "cljs",
  "c", "cc", "cpp", "cxx", "h", "hh", "hpp", "cs", "fs", "fsx", "php", "swift",
  "m", "mm", "sh", "bash", "zsh", "fish", "ps1", "bat", "cmd", "lua", "r",
  "sql", "graphql", "gql", "proto", "asm", "s", "wat", "wasm", "dart", "ex", "exs",
]);

const MARKDOWN_EXTENSIONS: ReadonlySet<string> = new Set(["md", "mdx", "markdown", "mdown", "rst", "adoc"]);

const DATA_EXTENSIONS: ReadonlySet<string> = new Set([
  "json", "jsonc", "json5", "yaml", "yml", "toml", "xml", "csv", "tsv", "ndjson",
  "sqlite", "db", "parquet", "avro", "lock", "map",
]);

const IMAGE_EXTENSIONS: ReadonlySet<string> = new Set([
  "png", "jpg", "jpeg", "gif", "webp", "avif", "svg", "bmp", "ico", "tif", "tiff",
  "psd", "heic", "heif", "raw", "exr", "hdr",
]);

const STYLE_EXTENSIONS: ReadonlySet<string> = new Set([
  "css", "scss", "sass", "less", "styl", "stylus", "pcss", "postcss", "tailwind",
]);

const ARCHIVE_EXTENSIONS: ReadonlySet<string> = new Set([
  "zip", "tar", "gz", "tgz", "bz2", "xz", "7z", "rar", "jar", "war", "dmg", "iso", "zst",
]);

/** Basenames that are configuration regardless of their extension. */
const CONFIG_NAMES: ReadonlySet<string> = new Set([
  "dockerfile", "docker-compose.yml", "docker-compose.yaml", "makefile", "cmakelists.txt",
  "package.json", "pnpm-workspace.yaml", "tsconfig.json", "jsconfig.json", ".gitignore",
  ".gitattributes", ".gitmodules", ".npmrc", ".nvmrc", ".editorconfig", ".prettierrc",
  ".eslintrc", ".eslintignore", ".prettierignore", ".browserslistrc", "vercel.json",
  "netlify.toml", "turbo.json", "nx.json", "lerna.json", "biome.json", "cargo.toml",
  "go.mod", "go.sum", "requirements.txt", "pyproject.toml", "gemfile", "rakefile",
]);

/**
 * The suffix of one basename, lowercased, without its dot.
 *
 * The basename is taken first because the same helper serves tree rows (which
 * pass a name) and panel tabs (which pass a path), and a dotted directory such
 * as `v1.2` would otherwise read as the file's extension.
 * @param name - basename or path.
 * @returns the suffix, or an empty string for a name without one.
 */
function extensionOf(name: string): string {
  const base = baseName(name.toLowerCase());
  const dot = base.lastIndexOf(".");
  return dot <= 0 ? "" : base.slice(dot + 1);
}

/**
 * Pick the coloured badge family for one entry.
 * @param name - basename shown in the row.
 * @param kind - directory rows always answer `folder`.
 * @returns the icon family the row paints.
 */
export function iconFor(name: string, kind: TreeKind = "file"): IconKind {
  if (kind === "directory") return "folder";
  const base = baseName(name.toLowerCase());
  if (CONFIG_NAMES.has(base) || base.startsWith(".env")) return "config";
  if (base === "readme" || base === "changelog" || base === "license") return "markdown";
  const extension = extensionOf(base);
  if (extension === "") return "file";
  if (CODE_EXTENSIONS.has(extension)) return "code";
  if (MARKDOWN_EXTENSIONS.has(extension)) return "markdown";
  if (DATA_EXTENSIONS.has(extension)) return "data";
  if (IMAGE_EXTENSIONS.has(extension)) return "image";
  if (STYLE_EXTENSIONS.has(extension)) return "style";
  if (ARCHIVE_EXTENSIONS.has(extension)) return "archive";
  return "file";
}

/** Badges for basenames whose extension would read poorly in two or three letters. */
const SPECIAL_BADGES: Readonly<Record<string, string>> = {
  "dockerfile": "DK",
  "makefile": "MK",
  "package.json": "PKG",
  "pnpm-workspace.yaml": "PNPM",
  "tsconfig.json": "TS",
  "jsconfig.json": "JS",
  ".gitignore": "GIT",
  ".gitattributes": "GIT",
  ".npmrc": "NPM",
  ".env": "ENV",
  "readme.md": "MD",
  "license": "LIC",
};

const EXTENSION_BADGES: Readonly<Record<string, string>> = {
  json: "{}",
  jsonc: "{}",
  json5: "{}",
  yaml: "{}",
  yml: "{}",
  toml: "{}",
  xml: "<>",
  csv: "CSV",
  ts: "TS",
  tsx: "TSX",
  js: "JS",
  jsx: "JSX",
  mjs: "JS",
  cjs: "JS",
  md: "MD",
  mdx: "MD",
  png: "IMG",
  jpg: "IMG",
  jpeg: "IMG",
  gif: "IMG",
  webp: "IMG",
  svg: "SVG",
  css: "#",
  scss: "#",
  sass: "#",
  less: "#",
  zip: "ZIP",
  tar: "TAR",
  gz: "GZ",
  py: "PY",
  rs: "RS",
  go: "GO",
  sh: "SH",
};

/**
 * The two or three characters painted inside a file badge.
 * @param name - basename shown in the row.
 * @returns a short uppercase label, never empty.
 */
export function badgeFor(name: string): string {
  const base = baseName(name.toLowerCase());
  const special = SPECIAL_BADGES[base];
  if (special !== undefined) return special;
  const extension = extensionOf(base);
  const badge = EXTENSION_BADGES[extension];
  if (badge !== undefined) return badge;
  if (extension !== "") return extension.slice(0, 3).toUpperCase();
  const letters = base.replace(/[^A-Za-z0-9]/gu, "");
  return (letters.slice(0, 2) || "?").toUpperCase();
}

/** Copy for one truncated or complete listing. */
export interface ListingSummary {
  readonly truncated: boolean;
  readonly label: string;
  readonly total: number;
}

/**
 * Describe how much of one directory listing reached the tree.
 *
 * The host caps a listing at `maxEntries` and reports the cut; the tree cannot
 * page the endpoint, so the only honest copy states the cap. It must not offer
 * an action the host has no parameter for.
 * @param input - the returned entries, the host's truncation flag and its total.
 * @returns the flag plus the label the footer or status row paints.
 */
export function describeListing(input: {
  readonly entries: readonly unknown[];
  readonly truncated?: boolean;
  readonly total?: number;
}): ListingSummary {
  const shown = Array.isArray(input.entries) ? input.entries.length : 0;
  const truncated = input.truncated === true;
  const total =
    typeof input.total === "number" && Number.isFinite(input.total) && input.total > shown
      ? Math.trunc(input.total)
      : shown;
  return truncated
    ? { truncated: true, label: `${LISTING_TRUNCATED_LABEL} ${String(shown)} 项`, total }
    : { truncated: false, label: `${String(shown)} 项`, total };
}

/** Viewport inputs for {@link computeTreeWindow}. */
export interface TreeWindowOptions {
  readonly scrollTop: number;
  readonly height: number;
  readonly rowHeight: number;
  readonly overscan?: number;
}

/** The mounted slice of a virtual tree. */
export interface TreeWindow<Row> {
  readonly rows: readonly Row[];
  readonly startIndex: number;
  readonly endIndex: number;
}

/**
 * Slice the visible rows out of a potentially huge flattened tree.
 *
 * Same contract as the Git history window: overscan keeps fast scrolling from
 * exposing a blank band, and the start clamps so the final page still fills the
 * viewport from the bottom.
 * @param rows - every row of the flattened tree.
 * @param options - scroll offset, viewport height, row height and overscan.
 * @returns the mounted rows plus the absolute index of the first one.
 */
export function computeTreeWindow<Row>(rows: readonly Row[], options: TreeWindowOptions): TreeWindow<Row> {
  const rowHeight = Math.max(1, options.rowHeight || 1);
  const height = Math.max(0, options.height || 0);
  const overscan = Math.max(0, Math.trunc(options.overscan ?? 6));
  const visible = Math.max(1, Math.ceil(height / rowHeight));
  const maxStart = Math.max(0, rows.length - visible - overscan * 2);
  const rawStart = Math.floor(Math.max(0, options.scrollTop) / rowHeight) - overscan;
  const startIndex = Math.min(Math.max(rawStart, 0), maxStart);
  const endIndex = Math.min(rows.length, startIndex + visible + overscan * 2);
  return { rows: rows.slice(startIndex, endIndex), startIndex, endIndex };
}

/**
 * The scroll offset that brings one row into view with minimum movement.
 *
 * A windowed list only mounts the rows around the current offset, so a row
 * picked from outside the viewport has to be scrolled to before the reader can
 * see its highlight. Minimum movement rather than centering: the reader is
 * arriving, and the rows above stay on screen.
 * @param input - current offset, viewport height, row height and the row index.
 * @returns the offset to apply; the current one when the row already fits.
 */
export function revealScrollTop(input: {
  readonly scrollTop: number;
  readonly viewport: number;
  readonly rowHeight: number;
  readonly index: number;
}): number {
  const rowHeight = Math.max(1, input.rowHeight || 1);
  const viewport = Math.max(0, input.viewport || 0);
  const scrollTop = Math.max(0, input.scrollTop);
  const top = Math.max(0, input.index) * rowHeight;
  if (top < scrollTop) return top;
  if (top + rowHeight > scrollTop + viewport) return top + rowHeight - viewport;
  return scrollTop;
}

/**
 * Map the tree's level key to the path `workspaceFiles.list` accepts.
 *
 * The ledger keys the root as `""`, but the host refuses an empty path
 * (`path is required`) and resolves `"."` against the session workspace root.
 * @param path - a level key from the tree ledger.
 * @returns the path sent on the wire.
 */
export function listingPath(path: string): string {
  return path === "" ? "." : path;
}

/**
 * Whether a path names an absolute filesystem location.
 *
 * The host accepts three spellings, so all three are absolute here: POSIX, a
 * Windows drive and a UNC share. Everything else is resolved against the
 * session's workspace root.
 * @param path - a path or a bare name.
 * @returns true for a path that does not need a workspace root.
 */
export function isAbsolutePath(path: string): boolean {
  return path.startsWith("/") || /^[A-Za-z]:[/\\]/u.test(path) || path.startsWith("\\\\");
}

/** Join a parent workspace path and a child basename with the host's separator. */
export function joinPath(parent: string, name: string): string {
  const clean = parent.replace(/\/+$/u, "");
  return clean === "" ? name : `${clean}/${name}`;
}

/**
 * The ancestor directories between the root and one workspace file.
 *
 * Reveal keeps every ancestor of the active panel open so its row stays
 * reachable. The file's own segment is not a directory, and the root (`""`)
 * is always loaded, so neither belongs to the chain. `./` prefixes and
 * backslashes are normalized the way panel keys are, so every chain entry
 * keys the level ledger exactly.
 * @param path - a workspace-relative path.
 * @returns ancestor directory paths, outermost first; empty for a bare name.
 */
export function ancestorChain(path: string): string[] {
  const segments = path
    .replace(/\\/gu, "/")
    .replace(/^(?:\.\/)+/u, "")
    .split("/")
    .filter(Boolean);
  const chain: string[] = [];
  let prefix = "";
  for (const segment of segments.slice(0, -1)) {
    prefix = joinPath(prefix, segment);
    chain.push(prefix);
  }
  return chain;
}

/** A focus request carried by `openView("fs-explorer", "path:<path>:<line>")`. */
export interface FocusTarget {
  readonly path: string;
  readonly line: number;
  /**
   * Whether {@link path} is a filesystem path rather than a workspace one.
   *
   * An absolute target skips the tree reveal (no row can match a path outside
   * the workspace) and is handed to the file service unchanged; a relative one
   * resolves against the session's workspace root as it always has.
   */
  readonly absolute: boolean;
  /**
   * Commit object id when this target names a commit version.
   *
   * A revision target is read through the Git `show` endpoint instead of the
   * working-tree file service, and the panel stack keys it by
   * `(revision, path)` so two versions of one file stay two tabs.
   */
  readonly revision?: string;
}

/** Parse the optional `:<line>` suffix; a missing or bad value reads as line 1. */
function lineOf(raw: string | undefined): number {
  return raw === undefined ? 1 : Math.max(1, Number.parseInt(raw, 10));
}

/**
 * Parse the focus string a caller hands this view.
 *
 * Three spellings travel. `path:<workspace path>[:<line>]` comes from the Git
 * changes pane and the command palette and stays relative to the session's
 * workspace root. `abs:<filesystem path>[:<line>]` comes from the address
 * bridge, which forwards files that may sit outside that root — its leading `/`
 * is the difference between `/Users/x/a.ts` and a workspace-relative
 * `Users/x/a.ts`, so unlike `path:` it must survive. `git:<hash>:<line>:<path>`
 * comes from commit details and names a file as one commit holds it; its
 * revision is normalized to lowercase and its line segment is mandatory
 * because a git path may itself end in digits.
 *
 * The line suffix is optional in the first two spellings. Backslashes are
 * normalized because the same jump is produced on Windows hosts.
 * @param focus - the raw focus string, or undefined when the tab was opened directly.
 * @returns the normalized target, or undefined when the focus is not a path.
 */
export function parseFocus(focus: string | undefined): FocusTarget | undefined {
  if (typeof focus !== "string") return undefined;
  const trimmed = focus.trim();

  const gitMatch = /^git:([0-9a-f]{4,64}):(\d+):(.+)$/iu.exec(trimmed);
  if (gitMatch !== null) {
    const line = lineOf(gitMatch[2]);
    const path = (gitMatch[3] ?? "").replace(/\\/gu, "/").replace(/^(?:\.\/)+/u, "").replace(/^\/+/u, "");
    if (path === "" || line < 1) return undefined;
    return { path, line, absolute: false, revision: (gitMatch[1] ?? "").toLowerCase() };
  }

  const absoluteMatch = /^abs:(.+?)(?::(\d+))?$/u.exec(trimmed);
  if (absoluteMatch !== null) {
    const path = (absoluteMatch[1] ?? "").replace(/\\/gu, "/").replace(/^(?:\.\/)+/u, "");
    if (path === "") return undefined;
    return { path, line: lineOf(absoluteMatch[2]), absolute: true };
  }

  const match = /^path:(.+?)(?::(\d+))?$/u.exec(trimmed);
  if (match === null) return undefined;
  const raw = match[1] ?? "";
  const path = raw.replace(/\\/gu, "/").replace(/^\.\//u, "").replace(/^\/+/u, "");
  if (path === "") return undefined;
  return { path, line: lineOf(match[2]), absolute: false };
}

/**
 * Whether a rebuilt row list should copy the open file back onto the cursor.
 *
 * The open panel is one fact and the keyboard cursor is another. They meet when
 * the reader opens a file, and they part when the reader navigates: collapsing
 * a directory or stepping up to its parent rebuilds the rows while the panel
 * still shows the file they came from. Copying that file back would undo the
 * key they just pressed, which is exactly what a left arrow on a folder must
 * not do. A row list that no longer contains the cursor (a collapse that hid
 * it, a refreshed listing) still adopts the open file, because there is no
 * cursor left to protect.
 * @param input - the cursor before this row list, and whether the open file moved.
 * @returns true when the cursor should become the open file's row.
 */
export function adoptsOpenFile(input: {
  readonly cursorPath: string | undefined;
  readonly selectionMoved: boolean;
}): boolean {
  if (input.selectionMoved) return true;
  return input.cursorPath === undefined;
}

/**
 * The first entry row directly inside one directory, once its listing is on screen.
 *
 * Drilling into a directory with the right arrow lands the keyboard cursor
 * here. The answer is an index rather than a path because the cursor is an
 * index, and a directory that is still loading, empty or collapsed has no row
 * to land on yet, so it answers `undefined` and the caller waits for the next
 * render instead of guessing.
 * @param rows - the flattened tree.
 * @param path - the directory just opened.
 * @returns the index of its first child entry, or undefined when none is visible.
 */
export function firstChildIndex(rows: readonly TreeRow[], path: string): number | undefined {
  const parent = rows.findIndex(row => row.type === "entry" && row.path === path);
  const row = rows[parent];
  if (row?.type !== "entry" || !row.expanded) return undefined;
  for (let index = parent + 1; index < rows.length; index += 1) {
    const candidate = rows[index];
    if (candidate?.type !== "entry") continue;
    if (candidate.depth <= row.depth) return undefined;
    if (candidate.depth === row.depth + 1) return index;
  }
  return undefined;
}

/** One loaded directory level as the view stores it. */
export interface TreeLevel {
  readonly status: "loading" | "ready" | "failed";
  readonly nodes: readonly TreeNode[];
  readonly truncated: boolean;
  readonly total: number;
  readonly message?: string;
}

/** One row of the flattened tree: an entry or the status block under a directory. */
export type TreeRow =
  | {
      readonly type: "entry";
      readonly path: string;
      readonly name: string;
      readonly kind: TreeKind;
      readonly depth: number;
      readonly expanded: boolean;
      readonly size?: number;
      /** File rows carry their own status; directory rows carry an aggregate. */
      readonly status?: FsChangeStatus;
      readonly statusCount?: number;
      readonly statusTone?: StatusTone;
      /** Line counts for a changed file row; untracked files carry none. */
      readonly diff?: FsChangeDiff;
      /** Identity badge a directory row carries; files never ask for one. */
      readonly tag?: WorkspaceTag;
    }
  | {
      readonly type: "status";
      readonly key: string;
      readonly path: string;
      readonly depth: number;
      readonly state: "loading" | "failed" | "empty" | "truncated";
      readonly message?: string;
      readonly label?: string;
    };

/**
 * Flatten the loaded levels into the rows the virtual list mounts.
 *
 * A directory contributes its children only while expanded. Its own loading,
 * failure, empty and truncation states become status rows directly below it,
 * so the tree has one row vocabulary and one scroll height. Working-tree
 * statuses come from the Git snapshot and do not depend on a level being
 * loaded, so a collapsed directory can still advertise its change count.
 * @param levels - loaded directory levels keyed by workspace path (`""` is the root).
 * @param expanded - workspace paths currently open.
 * @param statuses - parsed `git status` map, or undefined when Git is unavailable.
 * @param tags - workspace identity map, or undefined when no manifest was read.
 * @returns visible rows in display order.
 */
export function flattenTree(
  levels: ReadonlyMap<string, TreeLevel>,
  expanded: ReadonlySet<string>,
  statuses?: StatusMap,
  tags?: ReadonlyMap<string, WorkspaceTag>,
): TreeRow[] {
  const rows: TreeRow[] = [];
  const statusIndex = indexDirectoryChanges(statuses);

  const visit = (path: string, depth: number): void => {
    const level = levels.get(path);
    if (level === undefined || level.status !== "ready") return;
    for (const node of level.nodes) {
      const child = joinPath(path, node.name);
      const isDirectory = node.kind === "directory";
      const open = isDirectory && expanded.has(child);
      // A file row's key is exact in the status map, so its marker answers both
      // the badge and the line counts; directories never carry counts.
      const marker = isDirectory || statuses === undefined ? undefined : statuses[child];
      const fileStatus = marker?.status ?? (isDirectory ? undefined : statusOf(child, statuses));
      const diff = marker === undefined ? undefined : changeDiff(marker);
      const aggregate = isDirectory ? statusIndex.get(child) : undefined;
      const tag = isDirectory ? workspaceTagFor(tags, child) : undefined;
      rows.push({
        type: "entry",
        path: child,
        name: node.name,
        kind: node.kind,
        depth,
        expanded: open,
        ...(node.size === undefined ? {} : { size: node.size }),
        ...(fileStatus === undefined ? {} : { status: fileStatus }),
        ...(aggregate === undefined ? {} : { statusCount: aggregate.count, statusTone: aggregate.tone }),
        ...(diff === undefined ? {} : { diff }),
        ...(tag === undefined ? {} : { tag }),
      });
      if (!open) continue;
      const childLevel = levels.get(child);
      if (childLevel === undefined || childLevel.status === "loading") {
        rows.push({ type: "status", key: `${child}:loading`, path: child, depth: depth + 1, state: "loading" });
        continue;
      }
      if (childLevel.status === "failed") {
        rows.push({
          type: "status",
          key: `${child}:failed`,
          path: child,
          depth: depth + 1,
          state: "failed",
          message: childLevel.message ?? "加载失败",
        });
        continue;
      }
      if (childLevel.nodes.length === 0) {
        rows.push({ type: "status", key: `${child}:empty`, path: child, depth: depth + 1, state: "empty" });
        continue;
      }
      visit(child, depth + 1);
      if (childLevel.truncated) {
        rows.push({
          type: "status",
          key: `${child}:truncated`,
          path: child,
          depth: depth + 1,
          state: "truncated",
          label: describeListing({ entries: childLevel.nodes, truncated: true, total: childLevel.total }).label,
        });
      }
    }
  };

  visit("", 0);
  return rows;
}

/**
 * Basenames that count as a workspace's front page.
 *
 * Only the text spellings: entering the view opens the file in a panel, so a
 * README in a format the previewer cannot paint would greet the reader with a
 * failure instead of a front page.
 */
const README_BASENAMES: ReadonlySet<string> = new Set([
  "readme",
  "readme.md",
  "readme.markdown",
  "readme.mdx",
  "readme.txt",
]);

/** The basename of a workspace path, for both separators the host may return. */
function basenameOf(path: string): string {
  const cut = Math.max(path.lastIndexOf("/"), path.lastIndexOf("\\"));
  return (cut < 0 ? path : path.slice(cut + 1)).toLowerCase();
}

/**
 * The root-level README row a fresh view can open by itself.
 *
 * Only the workspace root qualifies: nested READMEs are package docs, and
 * opening one on arrival would answer a question the reader did not ask. The
 * row is returned rather than its path so the caller can open and focus from
 * one value.
 * @param rows - the flattened tree.
 * @returns the front-page row, or undefined when the root has none.
 */
export function findRootReadme(rows: readonly TreeRow[]): TreeRow | undefined {
  return rows.find(
    row => row.type === "entry" && row.depth === 0 && row.kind === "file" && README_BASENAMES.has(basenameOf(row.path)),
  );
}

/** What entering the view should do, once per mount. */
export type EntryIntent =
  | { readonly kind: "skip"; readonly reason: "modal" | "no-rows" }
  | { readonly kind: "tree"; readonly open: string | undefined; readonly focus: string | undefined };

/**
 * Decide the arrival gesture for a freshly mounted view.
 *
 * The panel stack outlives the mount, so "empty" is a fact about the session,
 * not about this render: the first arrival opens the front page, a later one
 * leaves the reader's panels alone and only hands them the keyboard. A modal
 * on screen owns the caret; the caller must not spend the claim on it.
 * @param input - the flattened tree, the open panel count and whether a modal owns focus.
 * @returns the path to open (if any) and the row the cursor lands on.
 */
export function entryIntent(input: {
  readonly rows: readonly TreeRow[];
  readonly panelCount: number;
  readonly hasModal: boolean;
}): EntryIntent {
  if (input.hasModal) return { kind: "skip", reason: "modal" };
  // An empty tree renders a state block, not a scroll container to focus.
  if (input.rows.length === 0) return { kind: "skip", reason: "no-rows" };
  if (input.panelCount > 0) return { kind: "tree", open: undefined, focus: undefined };
  const readme = findRootReadme(input.rows);
  if (readme === undefined) return { kind: "tree", open: undefined, focus: undefined };
  return { kind: "tree", open: readme.path, focus: readme.path };
}

/**
 * Human byte size for the row's right-aligned metadata column.
 * @param bytes - file size from the listing.
 * @returns a short label such as `1.2 KB`, or an empty string for bad input.
 */
export function formatSize(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes < 0) return "";
  const units = ["B", "KB", "MB", "GB", "TB"] as const;
  let value = bytes;
  let unit = 0;
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024;
    unit += 1;
  }
  const digits = unit === 0 || value >= 10 ? 0 : 1;
  return `${value.toFixed(digits)} ${units[unit] ?? "B"}`;
}
