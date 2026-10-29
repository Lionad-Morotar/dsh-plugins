/**
 * Tree navigation over the navigate-mode query.
 *
 * The host already gives this query path semantics: a query containing a
 * separator is answered by a live `readdir` of that directory, an empty query
 * lists the workspace root, and a bare word is a fuzzy workspace-wide search.
 * So the tree cursor *is* the query text, and the arrows only rewrite it.
 *
 * That choice keeps one source of truth. A second "current directory" field
 * would be able to disagree with the text the reader sees, and every disagreement
 * would show up as a list that ignores the directory in the header.
 */

import type { PanelRow } from "./rows.ts";

/**
 * The query that enters this row's directory, or undefined when the row is not
 * one. Directory labels keep the host's trailing separator, which is exactly the
 * shape that makes the next query a directory read.
 */
export function directoryQuery(row: PanelRow | undefined): string | undefined {
  if (row?.kind !== "directory") return undefined;
  const label = row.label.replace(/\\/gu, "/");
  return label.endsWith("/") ? label : `${label}/`;
}

/**
 * The query one level up.
 *
 * A trailing separator means the text names a directory, so climbing drops that
 * name and lands in its parent. Otherwise the last segment is an unfinished
 * fragment, and climbing drops the fragment while staying inside the directory
 * that holds it. Undefined means there is nothing above: either the text is a
 * bare search word with no path context, or it is already the root.
 *
 * @param query - the current query text.
 * @returns the parent query, or undefined when climbing would be a no-op.
 */
export function parentQuery(query: string): string | undefined {
  const trimmed = query.replace(/[\\/]+$/u, "");
  const cut = Math.max(trimmed.lastIndexOf("/"), trimmed.lastIndexOf("\\"));
  const namesDirectory = /[\\/]$/u.test(query);
  if (namesDirectory) {
    if (trimmed === "") return undefined;
    return cut < 0 ? "" : trimmed.slice(0, cut + 1);
  }
  if (cut < 0) return undefined;
  return trimmed.slice(0, cut + 1);
}

/**
 * Workspace-relative path of a file row, in the shape the file workbench's focus
 * protocol accepts. Directories have no file panel, so they yield nothing.
 *
 * @param row - the highlighted row.
 * @returns the relative path, or undefined when there is no file to reveal.
 */
export function focusPath(row: PanelRow | undefined): string | undefined {
  if (row === undefined || row.kind === "directory") return undefined;
  const path = row.label.replace(/\\/gu, "/").replace(/^\.\//u, "").replace(/^\/+/u, "");
  return path === "" ? undefined : path;
}
