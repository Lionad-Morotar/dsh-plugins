/**
 * Which panel rows borrow the file tree's mark, and which borrow the sidebar's.
 *
 * The drawing itself is not here. A file or directory row is rendered with the
 * file tree's `EntryMark`; a workspace row is rendered with the same folder
 * icon the sidebar header uses. This module only tells those two apart and
 * spells the dimmed directory the tree shows beside a search result.
 */
import type { PanelRow } from "./rows.ts";

/** Props the file tree's `EntryMark` needs for one panel row. */
export interface FileMark {
  readonly name: string;
  readonly kind: "file" | "directory";
}

/**
 * The file-tree mark for one row, or nothing when the row is not a file.
 * @param row - one panel row.
 * @returns the basename and kind, or undefined for every other row.
 */
export function fileMarkOf(row: PanelRow): FileMark | undefined {
  if (row.kind !== "file" && row.kind !== "directory") return undefined;
  if (row.name === undefined || row.name === "") return undefined;
  return { name: row.name, kind: row.kind };
}

/**
 * The parent directory a file row shows dimmed beside its name.
 *
 * Same split the file tree's search rows use: the name is the row, the
 * directory is context. A root entry has no parent to show.
 * @param row - one panel row.
 * @returns the parent path, or undefined at the root.
 */
export function entryDirectory(row: PanelRow): string | undefined {
  if (fileMarkOf(row) === undefined) return undefined;
  const bare = row.label.replace(/[\\/]+$/u, "");
  const slash = Math.max(bare.lastIndexOf("/"), bare.lastIndexOf("\\"));
  if (slash <= 0) return undefined;
  return bare.slice(0, slash);
}

/**
 * Whether the row is a workspace header.
 *
 * The sidebar tells a workspace from a session by the same fact: the row drills
 * into one workspace, rather than naming a path or opening a session.
 * @param row - one panel row.
 */
export function isWorkspaceRow(row: PanelRow): boolean {
  return row.action.kind === "drill" && row.action.scope.kind === "workspace";
}
