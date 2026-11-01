/**
 * Workspace identity for directory rows.
 *
 * A directory can carry two identity badges: a git submodule (a fact git
 * itself states in `.gitmodules`) or a workspace child package (a pattern
 * statement from a workspace manifest). Both answers are read through the
 * host's own `workspaceFiles.read` seam by the view; this module only turns
 * the collected texts into one lookup structure, so the acceptance probe can
 * drive it in plain Node.
 *
 * The map mixes two key spellings on purpose: submodules key their exact
 * workspace-relative path, while package patterns key the manifest's own glob
 * (`packages/*`, `apps/**`). A pattern cannot name its matches up front — the
 * children it claims are only known as the tree lazily lists them — so the
 * match is evaluated per row by {@link workspaceTagFor} instead of being
 * expanded here.
 */

/** The identity a directory row can carry beside its name. */
export type WorkspaceTag = "submodule" | "package";

/** The candidate manifests the view reads, keyed here by file name. */
export const MANIFEST_FILES: readonly string[] = [
  ".gitmodules",
  "pnpm-workspace.yaml",
  "package.json",
  "turbo.json",
  "lerna.json",
];

/**
 * The only two glob spellings accepted, e.g. `packages/*` and `apps/**`.
 *
 * The prefix segment must be a plain directory name (no metacharacters, not
 * `.` or `..`); anything else — brace expansion, bare names, a leading `**` —
 * is ignored whole rather than guessed at, because a wrong badge on a
 * directory is worse than a missing one.
 */
const PATTERN = /^(?!\.{1,2}$)[^/*?{}[\]]+\/(\*\*|\*)$/u;

/** The literal prefix directory of one supported pattern, or null. */
function patternSegment(pattern: string): string | null {
  return PATTERN.test(pattern) ? pattern.slice(0, pattern.indexOf("/")) : null;
}

/** Strip a YAML trailing comment and matching quotes off one list item. */
function yamlItem(raw: string): string {
  const comment = raw.indexOf(" #");
  const trimmed = (comment >= 0 ? raw.slice(0, comment) : raw).trim();
  if (trimmed.length >= 2) {
    const first = trimmed[0];
    const last = trimmed.at(-1);
    if ((first === "'" && last === "'") || (first === '"' && last === '"')) return trimmed.slice(1, -1);
  }
  return trimmed;
}

/**
 * Extract the `packages` list patterns from a `pnpm-workspace.yaml` text.
 *
 * The file is scanned line by line: the top-level `packages:` key is located
 * (no indent, colon-terminated, possibly with an inline comment or an empty
 * value), then the indented `- ` items under it are collected until the next
 * line that starts at column zero. Everything else — nested keys, anchors,
 * multi-document markers — is an unrecognised line and is ignored.
 * @param text - the raw file content.
 * @returns the supported patterns, in file order, possibly empty.
 */
function parsePnpmWorkspace(text: string): readonly string[] {
  const lines = text.split(/\r?\n/u);
  const patterns: string[] = [];
  let index = 0;
  while (index < lines.length && !/^packages\s*:/u.test(lines[index] ?? "")) index += 1;
  if (index === lines.length) return patterns;
  for (index += 1; index < lines.length; index += 1) {
    const line = lines[index] ?? "";
    if (line.trim() === "") continue;
    if (!/^\s/u.test(line)) break;
    const item = /^(\s*)-\s+(.*)$/u.exec(line);
    if (item === null) continue;
    const candidate = yamlItem(item[2] ?? "");
    if (candidate !== "" && PATTERN.test(candidate)) patterns.push(candidate);
  }
  return patterns;
}

/**
 * Extract every submodule path from a `.gitmodules` text.
 *
 * The file is git-config INI: `[submodule "name"]` sections whose `path =`
 * value is the workspace-relative directory. Comments (`#`, `;`) and blank
 * lines are skipped, and a section that never states a path contributes
 * nothing. Values are compared verbatim after trimming, so a quoted path is a
 * miss rather than a guess.
 * @param text - the raw file content.
 * @returns the submodule paths, deduplicated.
 */
function parseGitmodules(text: string): readonly string[] {
  const paths: string[] = [];
  let current: string | undefined;
  let inSubmodule = false;
  const flush = (): void => {
    if (inSubmodule && current !== undefined && current !== "") paths.push(current);
    current = undefined;
  };
  for (const raw of text.split(/\r?\n/u)) {
    const line = raw.trim();
    if (line === "" || line.startsWith("#") || line.startsWith(";")) continue;
    const header = /^\[(.+)\]$/u.exec(line);
    if (header !== null) {
      flush();
      inSubmodule = /^submodule(\s|$)/u.test(header[1] ?? "");
      continue;
    }
    if (!inSubmodule) continue;
    const pair = /^path\s*=\s*(.*)$/u.exec(line);
    if (pair !== null) current = (pair[1] ?? "").trim().replace(/^\.\/+/u, "").replace(/\/+$/u, "");
  }
  flush();
  return [...new Set(paths)];
}

/** Parse one JSON object, answering undefined on anything unhealthy. */
function jsonObject(text: string): Record<string, unknown> | undefined {
  try {
    const parsed: unknown = JSON.parse(text);
    if (parsed === null || typeof parsed !== "object" || Array.isArray(parsed)) return undefined;
    return parsed as Record<string, unknown>;
  } catch {
    return undefined;
  }
}

/** Every string inside one field, whatever array it arrived in. */
function stringArray(value: unknown): readonly string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

/**
 * Build the workspace identity map from the collected manifest texts.
 *
 * Sources are unioned: a directory named by several manifests is marked once,
 * and a submodule path never competes with a pattern because their key
 * spellings cannot collide. Patterns are kept only when their literal prefix
 * directory is present in the root listing — holding back a pattern whose
 * directory the workspace does not have keeps the miss honest.
 * @param files - the manifest texts keyed by file name; absent means unread.
 * @param rootDirectories - directory names from the workspace root listing.
 * @returns submodule paths and package patterns with their tag; empty when
 * nothing was recognised.
 */
export function buildWorkspaceMap(
  files: ReadonlyMap<string, string>,
  rootDirectories: ReadonlySet<string>,
): ReadonlyMap<string, WorkspaceTag> {
  const map = new Map<string, WorkspaceTag>();

  const gitmodules = files.get(".gitmodules");
  if (typeof gitmodules === "string") {
    for (const path of parseGitmodules(gitmodules)) map.set(path, "submodule");
  }

  const patterns = new Set<string>();
  const pnpm = files.get("pnpm-workspace.yaml");
  if (typeof pnpm === "string") for (const pattern of parsePnpmWorkspace(pnpm)) patterns.add(pattern);

  const pkg = files.get("package.json");
  if (typeof pkg === "string") {
    const record = jsonObject(pkg);
    if (record !== undefined) {
      const workspaces = record.workspaces;
      const nested =
        workspaces !== null && typeof workspaces === "object" && !Array.isArray(workspaces)
          ? (workspaces as { packages?: unknown }).packages
          : undefined;
      for (const pattern of stringArray(Array.isArray(workspaces) ? workspaces : nested)) patterns.add(pattern);
    }
  }

  for (const name of ["turbo.json", "lerna.json"] as const) {
    const text = files.get(name);
    if (typeof text !== "string") continue;
    const record = jsonObject(text);
    if (record !== undefined) for (const pattern of stringArray(record.packages)) patterns.add(pattern);
  }

  for (const pattern of patterns) {
    const segment = patternSegment(pattern);
    if (segment !== null && rootDirectories.has(segment)) map.set(pattern, "package");
  }
  return map;
}

/**
 * Resolve the identity tag of one directory row.
 *
 * The exact submodule identity is the stronger fact and wins outright; the
 * pattern match then covers a `<parent>/*` hit on the row's own level and any
 * `<ancestor>/**` hit above it.
 * @param map - the built map, or undefined when the workspace has no identity.
 * @param path - workspace-relative directory path of the row.
 * @returns the tag, or undefined for an unremarkable directory.
 */
export function workspaceTagFor(
  map: ReadonlyMap<string, WorkspaceTag> | undefined,
  path: string,
): WorkspaceTag | undefined {
  if (map === undefined || path === "") return undefined;
  const exact = map.get(path);
  if (exact !== undefined) return exact;
  const slash = path.lastIndexOf("/");
  if (slash > 0 && map.get(`${path.slice(0, slash)}/*`) === "package") return "package";
  for (let at = path.indexOf("/"); at > 0; at = path.indexOf("/", at + 1)) {
    if (map.get(`${path.slice(0, at)}/**`) === "package") return "package";
  }
  return undefined;
}
