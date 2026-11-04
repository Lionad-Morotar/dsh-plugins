/**
 * The changes pane's filter: which files a query keeps.
 *
 * The filter is a plain case-insensitive substring of the repository path. A
 * path carries its directories, so matching the path also matches a directory
 * name; a separate directory match would only decide which of two identical
 * results to show first. Grouping is a product statement about where a file
 * lives, so the filter drops rows and never re-buckets them: a reader who
 * filtered to `src` should still see which of those files sit in `src/client`.
 *
 * Row order is deliberately not defined here. The keyboard's rows include the
 * group headers (they are visible lines the cursor walks), so the definition of
 * "row N" belongs to the pane that renders them; a second flattening function
 * here would be a second answer to the same question.
 */
import type { ChangeGroup } from "./model.ts";

/**
 * Narrow grouped changes to the paths matching one query.
 * @param groups - grouped changes, in render order.
 * @param query - raw filter input; surrounding whitespace is ignored.
 * @returns the same groups with non-matching files removed; groups left with no
 * file are dropped because a header over nothing is noise rather than context.
 */
export function filterChangeGroups(groups: readonly ChangeGroup[], query: string): ChangeGroup[] {
  const needle = query.trim().toLowerCase();
  if (needle === "") return [...groups];
  const kept: ChangeGroup[] = [];
  for (const group of groups) {
    const files = group.files.filter(file => file.path.toLowerCase().includes(needle));
    if (files.length > 0) kept.push({ dir: group.dir, files });
  }
  return kept;
}
