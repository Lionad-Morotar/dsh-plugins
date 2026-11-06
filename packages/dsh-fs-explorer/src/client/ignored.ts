/**
 * The ignored-path index the tree dims rows against.
 *
 * The host answers one flat list of paths git ignores, and the tree asks that
 * list about every row it renders. Two decisions shape this module.
 *
 * Inheritance is the first. `git ls-files --directory` folds a wholly ignored
 * directory into a single entry, so `node_modules` arrives as one path and
 * `node_modules/.bin/x` never appears in the list at all. A membership test
 * alone would dim the folder and leave every child inside it looking tracked,
 * which is the opposite of what git reports. A row is therefore ignored when it,
 * or any ancestor directory of it, is in the index.
 *
 * Segment-wise ancestry is the second. The ancestor walk compares whole path
 * segments rather than string prefixes: `docs` is an ancestor of `docs/a.md` but
 * not of `docs-extra/x`, and a prefix test would get that wrong on exactly the
 * kind of sibling directory a real workspace has.
 */

/**
 * The set of workspace-relative paths git ignores.
 *
 * Read-only because the view hands one index to every row and to the header
 * toggle: a consumer that mutated it would change what every other row sees.
 */
export type IgnoredIndex = ReadonlySet<string>;

/**
 * Normalize one path into the key space the index uses.
 *
 * Backslashes become `/` because a Windows host may spell the same path either
 * way, repeated `./` prefixes are dropped because the tree never builds them but
 * a listing may carry them, and trailing slashes go because `--directory` marks
 * a folded directory with one while the tree's key for that directory has none.
 * A blank line is dropped rather than trimmed into a key: a path that is only
 * whitespace names nothing, and keeping it would put an unreachable entry in the
 * set every row is tested against.
 * @param path - a path as the host or the tree spells it.
 * @returns the normalized key, or an empty string when nothing is left.
 */
function normalize(path: string): string {
  const key = path
    .replace(/\\/gu, "/")
    .replace(/^(?:\.\/)+/u, "")
    .replace(/\/+$/u, "");
  return key.trim() === "" ? "" : key;
}

/**
 * Build the index the tree tests rows against.
 *
 * An empty input answers an empty set rather than `undefined`: callers pass the
 * result straight into {@link isIgnoredPath}, and a missing index there would
 * mean "unknown", which is a different state from "nothing is ignored".
 * @param entries - workspace-relative paths from the host, or undefined when the
 * endpoint answered nothing.
 * @returns every distinct normalized path.
 */
export function indexIgnoredPaths(entries: readonly string[] | undefined): IgnoredIndex {
  const index = new Set<string>();
  if (!Array.isArray(entries)) return index;
  for (const entry of entries) {
    if (typeof entry !== "string") continue;
    const key = normalize(entry);
    if (key === "" || key === ".") continue;
    index.add(key);
  }
  return index;
}

/**
 * Whether one row is git-ignored, by itself or through an ancestor.
 *
 * The walk goes up by whole segments and stops at the first hit, so its cost is
 * the path's depth and it never asks the index about a path it did not build.
 * @param path - the row's workspace-relative path.
 * @param index - the ignored index, or undefined when the host answered nothing.
 * @returns true when the path or any ancestor directory is ignored.
 */
export function isIgnoredPath(path: string, index: IgnoredIndex | undefined): boolean {
  if (index === undefined || index.size === 0) return false;
  const key = normalize(path);
  if (key === "" || key === ".") return false;
  if (index.has(key)) return true;
  let cut = key.lastIndexOf("/");
  while (cut > 0) {
    const ancestor = key.slice(0, cut);
    if (index.has(ancestor)) return true;
    cut = ancestor.lastIndexOf("/");
  }
  return false;
}
