/**
 * Pure file-tree logic.
 *
 * The tree, its sorting, its icon vocabulary, the truncation copy and the
 * virtual window are all decided here, without React, the DOM or a host
 * import. The view layer only turns these rows into elements, which is what
 * lets the acceptance probe drive the built bundle in plain Node and compare
 * `buildTree` against the real directory listing.
 */

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

function extensionOf(name: string): string {
  const lower = name.toLowerCase();
  const dot = lower.lastIndexOf(".");
  return dot <= 0 ? "" : lower.slice(dot + 1);
}

/**
 * Pick the coloured badge family for one entry.
 * @param name - basename shown in the row.
 * @param kind - directory rows always answer `folder`.
 * @returns the icon family the row paints.
 */
export function iconFor(name: string, kind: TreeKind = "file"): IconKind {
  if (kind === "directory") return "folder";
  const lower = name.toLowerCase();
  if (CONFIG_NAMES.has(lower) || lower.startsWith(".env")) return "config";
  if (lower === "readme" || lower === "changelog" || lower === "license") return "markdown";
  const extension = extensionOf(lower);
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
  const lower = name.toLowerCase();
  const special = SPECIAL_BADGES[lower];
  if (special !== undefined) return special;
  const extension = extensionOf(lower);
  const badge = EXTENSION_BADGES[extension];
  if (badge !== undefined) return badge;
  if (extension !== "") return extension.slice(0, 3).toUpperCase();
  const letters = name.replace(/[^A-Za-z0-9]/gu, "");
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
 * page the endpoint, so the honest UI is a hint that more children exist.
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
    ? { truncated: true, label: `已显示 ${String(shown)} 项，继续加载`, total }
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

/** Join a parent workspace path and a child basename with the host's separator. */
export function joinPath(parent: string, name: string): string {
  const clean = parent.replace(/\/+$/u, "");
  return clean === "" ? name : `${clean}/${name}`;
}

/** A focus request carried by `openView("fs-explorer", "path:<path>:<line>")`. */
export interface FocusTarget {
  readonly path: string;
  readonly line: number;
}

/**
 * Parse the focus string the Git panel hands to this view.
 *
 * The path is workspace-relative and may contain dots and slashes; the line
 * suffix is optional. Backslashes are normalized because the same jump is
 * produced on Windows hosts.
 * @param focus - the raw focus string, or undefined when the tab was opened directly.
 * @returns the normalized target, or undefined when the focus is not a path.
 */
export function parseFocus(focus: string | undefined): FocusTarget | undefined {
  if (typeof focus !== "string") return undefined;
  const match = /^path:(.+?)(?::(\d+))?$/u.exec(focus.trim());
  if (match === null) return undefined;
  const raw = match[1] ?? "";
  const path = raw.replace(/\\/gu, "/").replace(/^\.\//u, "").replace(/^\/+/u, "");
  if (path === "") return undefined;
  const line = match[2] === undefined ? 1 : Math.max(1, Number.parseInt(match[2], 10));
  return { path, line };
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
 * so the tree has one row vocabulary and one scroll height.
 * @param levels - loaded directory levels keyed by workspace path (`""` is the root).
 * @param expanded - workspace paths currently open.
 * @returns visible rows in display order.
 */
export function flattenTree(
  levels: ReadonlyMap<string, TreeLevel>,
  expanded: ReadonlySet<string>,
): TreeRow[] {
  const rows: TreeRow[] = [];

  const visit = (path: string, depth: number): void => {
    const level = levels.get(path);
    if (level === undefined || level.status !== "ready") return;
    for (const node of level.nodes) {
      const child = joinPath(path, node.name);
      const isDirectory = node.kind === "directory";
      const open = isDirectory && expanded.has(child);
      rows.push({
        type: "entry",
        path: child,
        name: node.name,
        kind: node.kind,
        depth,
        expanded: open,
        ...(node.size === undefined ? {} : { size: node.size }),
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
