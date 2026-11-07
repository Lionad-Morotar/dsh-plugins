/**
 * The "add bookmark" row of the context menu.
 *
 * The row exists only where it can act: a file or directory row has a path to
 * record, the blank area does not. That is a product decision, not an
 * implementation detail, so it is asserted as one.
 */
import { describe, expect, it } from "vitest";

import { MENU_ACTION, buildContextMenu, type ContextMenuEntry, type ContextMenuRow } from "../src/client/context-menu.ts";
import type { WorkspaceCapabilities } from "../src/host/types.ts";

const t = (key: string): string => key;

function fileRow(): ContextMenuRow {
  return { type: "entry", path: "docs/a.md", name: "a.md", kind: "file" };
}

function directoryRow(): ContextMenuRow {
  return { type: "entry", path: "docs", name: "docs", kind: "directory" };
}

function capabilities(): WorkspaceCapabilities {
  return { fileManager: "finder", canReveal: true };
}

/** One row by action id, or undefined when the menu does not offer it. */
function entry(entries: readonly ContextMenuEntry[], id: string): ContextMenuEntry | undefined {
  return entries.find(candidate => candidate.id === id);
}

describe("buildContextMenu add-bookmark row", () => {
  it("offers the row on a file row and names the file", () => {
    const entries = buildContextMenu(
      {
        row: fileRow(),
        notices: { workspace: true },
        capabilities: capabilities(),
        absolutePath: "/w/docs/a.md",
        createParent: "docs",
        remoteLinks: undefined,
        bookmarkTarget: { name: "a.md", path: "docs/a.md", kind: "file" },
      },
      t,
    );
    const row = entry(entries, MENU_ACTION.addBookmark);
    expect(row?.label).toBe("menu.addBookmark");
    expect(row?.disabled).not.toBe(true);
  });

  it("offers the row on a directory row", () => {
    const entries = buildContextMenu(
      {
        row: directoryRow(),
        notices: { workspace: true },
        capabilities: capabilities(),
        absolutePath: "/w/docs",
        createParent: "docs",
        remoteLinks: undefined,
        bookmarkTarget: { name: "docs", path: "docs", kind: "directory" },
      },
      t,
    );
    expect(entry(entries, MENU_ACTION.addBookmark)?.disabled).not.toBe(true);
  });

  it("does not offer the row on the blank area", () => {
    // No row means no path, and a bookmark with no path is a row that cannot be
    // clicked.
    const entries = buildContextMenu(
      {
        row: undefined,
        notices: { workspace: true },
        capabilities: capabilities(),
        absolutePath: undefined,
        createParent: "",
        remoteLinks: undefined,
        bookmarkTarget: undefined,
      },
      t,
    );
    expect(entry(entries, MENU_ACTION.addBookmark)).toBeUndefined();
  });

  it("disables the row when the workspace channel is missing", () => {
    const entries = buildContextMenu(
      {
        row: fileRow(),
        notices: { workspace: false },
        capabilities: undefined,
        absolutePath: undefined,
        createParent: "docs",
        remoteLinks: undefined,
        bookmarkTarget: { name: "a.md", path: "docs/a.md", kind: "file" },
      },
      t,
    );
    const row = entry(entries, MENU_ACTION.addBookmark);
    expect(row?.disabled).toBe(true);
    expect(row?.reason).toBe("menu.addBookmark.reason");
  });

  it("keeps the action id stable for the view's dispatch", () => {
    expect(MENU_ACTION.addBookmark).toBe("add.bookmark");
  });

  it("places the row after the copy and remote rows", () => {
    const entries = buildContextMenu(
      {
        row: fileRow(),
        notices: { workspace: true },
        capabilities: capabilities(),
        absolutePath: "/w/docs/a.md",
        createParent: "docs",
        remoteLinks: undefined,
        bookmarkTarget: { name: "a.md", path: "docs/a.md", kind: "file" },
      },
      t,
    );
    expect(entries.map(candidate => candidate.id)).toEqual([
      MENU_ACTION.createFile,
      MENU_ACTION.createFolder,
      MENU_ACTION.reveal,
      "menu.copy",
      MENU_ACTION.copyRemote,
      MENU_ACTION.reference,
      MENU_ACTION.addBookmark,
    ]);
  });
});
