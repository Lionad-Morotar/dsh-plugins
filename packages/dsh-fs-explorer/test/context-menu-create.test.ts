/**
 * The create rows and the directory they address.
 *
 * Two decisions are under test. Which directory a create lands in is a property
 * of what was right-clicked, not of the tree's state: a file row means its own
 * directory, a directory row means itself, and the blank area means the root.
 * And the two rows exist on every row kind, because "new file here" is the
 * action a reader wants most often and hiding it on a file row would be a
 * surprise.
 */
import { describe, expect, it } from "vitest";

import {
  MENU_ACTION,
  buildContextMenu,
  parentDirectory,
  type ContextMenuEntry,
  type ContextMenuRow,
} from "../src/client/context-menu.ts";
import type { WorkspaceCapabilities } from "../src/host/types.ts";

const t = (key: string): string => key;

function fileRow(): ContextMenuRow {
  return { type: "entry", path: "docs/guides/a.md", name: "a.md", kind: "file" };
}

function directoryRow(): ContextMenuRow {
  return { type: "entry", path: "docs/guides", name: "guides", kind: "directory" };
}

function capabilities(): WorkspaceCapabilities {
  return { fileManager: "finder", canReveal: true };
}

/** One row by action id. */
function entry(entries: readonly ContextMenuEntry[], id: string): ContextMenuEntry {
  const found = entries.find(candidate => candidate.id === id);
  if (found === undefined) throw new Error(`the menu has no ${id} row`);
  return found;
}

describe("parentDirectory", () => {
  it("drops the last segment of a nested path", () => {
    expect(parentDirectory("a/b")).toBe("a");
    expect(parentDirectory("a/b/c.md")).toBe("a/b");
  });

  it("answers the root for a top-level entry", () => {
    expect(parentDirectory("a")).toBe("");
    expect(parentDirectory("a.md")).toBe("");
  });

  it("answers the root for the root itself", () => {
    expect(parentDirectory("")).toBe("");
  });

  it("ignores a trailing separator", () => {
    expect(parentDirectory("a/b/")).toBe("a");
  });
});

describe("buildContextMenu create rows", () => {
  it("offers both create rows on a file row", () => {
    const entries = buildContextMenu(
      {
        row: fileRow(),
        notices: { workspace: true },
        capabilities: capabilities(),
        absolutePath: "/workspace/docs/guides/a.md",
        createParent: "docs/guides",
        remoteLinks: undefined,
        bookmarkTarget: undefined,
      },
      t,
    );
    expect(entry(entries, MENU_ACTION.createFile).label).toBe("menu.create.file");
    expect(entry(entries, MENU_ACTION.createFolder).label).toBe("menu.create.folder");
    expect(entry(entries, MENU_ACTION.createFile).disabled).not.toBe(true);
  });

  it("offers both create rows on a directory row", () => {
    const entries = buildContextMenu(
      {
        row: directoryRow(),
        notices: { workspace: true },
        capabilities: capabilities(),
        absolutePath: "/workspace/docs/guides",
        createParent: "docs/guides",
        remoteLinks: undefined,
        bookmarkTarget: undefined,
      },
      t,
    );
    expect(entry(entries, MENU_ACTION.createFile).disabled).not.toBe(true);
    expect(entry(entries, MENU_ACTION.createFolder).disabled).not.toBe(true);
  });

  it("offers both create rows on the blank area, at the root", () => {
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
    expect(entry(entries, MENU_ACTION.createFile).disabled).not.toBe(true);
    expect(entry(entries, MENU_ACTION.createFolder).disabled).not.toBe(true);
    // The blank area still has no reveal or copy target.
    expect(entries.some(candidate => candidate.id === MENU_ACTION.reveal)).toBe(false);
  });

  it("disables both create rows with one reason when the channel is missing", () => {
    const entries = buildContextMenu(
      {
        row: fileRow(),
        notices: { workspace: false },
        capabilities: undefined,
        absolutePath: undefined,
        createParent: "docs/guides",
        remoteLinks: undefined,
        bookmarkTarget: undefined,
      },
      t,
    );
    for (const id of [MENU_ACTION.createFile, MENU_ACTION.createFolder]) {
      expect(entry(entries, id).disabled).toBe(true);
      expect(entry(entries, id).reason).toBe("menu.create.reason");
    }
  });

  it("disables both create rows when no parent could be worked out", () => {
    const entries = buildContextMenu(
      {
        row: fileRow(),
        notices: { workspace: true },
        capabilities: capabilities(),
        absolutePath: "/workspace/docs/guides/a.md",
        createParent: undefined,
        remoteLinks: undefined,
        bookmarkTarget: undefined,
      },
      t,
    );
    expect(entry(entries, MENU_ACTION.createFile).disabled).toBe(true);
    expect(entry(entries, MENU_ACTION.createFolder).disabled).toBe(true);
  });

  it("keeps the create rows above the reveal row", () => {
    const entries = buildContextMenu(
      {
        row: fileRow(),
        notices: { workspace: true },
        capabilities: capabilities(),
        absolutePath: "/workspace/docs/guides/a.md",
        createParent: "docs/guides",
        remoteLinks: undefined,
        bookmarkTarget: undefined,
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

  it("keeps the action ids stable for the view's dispatch", () => {
    expect(MENU_ACTION.createFile).toBe("create.file");
    expect(MENU_ACTION.createFolder).toBe("create.folder");
  });
});
