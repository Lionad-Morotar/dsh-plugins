/**
 * The context menu's content, decided without React or the DOM.
 *
 * These tests pin the product decision behind the slice: every row kind gets a
 * menu, the reveal row names the platform's own file manager, and a row that
 * cannot run says why instead of disappearing. Action ids are asserted as
 * literals because the view dispatches on them; a rename here without the view
 * would turn every click into a no-op.
 */
import { describe, expect, it } from "vitest";

import {
  MENU_ACTION,
  buildContextMenu,
  type ContextMenuEntry,
  type ContextMenuRow,
} from "../src/client/context-menu.ts";
import type { WorkspaceCapabilities } from "../src/host/types.ts";

/** Identity translator: labels come back as their keys, which is what we assert. */
const t = (key: string): string => key;

function fileRow(): ContextMenuRow {
  return { type: "entry", path: "docs/a.md", name: "a.md", kind: "file" };
}

function directoryRow(): ContextMenuRow {
  return { type: "entry", path: "docs", name: "docs", kind: "directory" };
}

function capabilities(fileManager: WorkspaceCapabilities["fileManager"]): WorkspaceCapabilities {
  return { fileManager, canReveal: fileManager !== null };
}

/** The reveal row of a built menu. */
function revealEntry(entries: readonly ContextMenuEntry[]): ContextMenuEntry {
  const entry = entries.find(candidate => candidate.id === MENU_ACTION.reveal);
  if (entry === undefined) throw new Error("the menu has no reveal row");
  return entry;
}

/** The copy submenu's rows. */
function copyEntries(entries: readonly ContextMenuEntry[]): readonly ContextMenuEntry[] {
  return entries.find(candidate => candidate.submenu !== undefined)?.submenu ?? [];
}

describe("buildContextMenu", () => {
  it("gives a file row the reveal row and both copy rows", () => {
    const entries = buildContextMenu(
      {
        row: fileRow(),
        notices: { workspace: true },
        capabilities: capabilities("finder"),
        absolutePath: "/workspace/docs/a.md",
        createParent: "docs",
      },
      t,
    );

    expect(entries.map(entry => entry.id)).toEqual([
      MENU_ACTION.createFile,
      MENU_ACTION.createFolder,
      MENU_ACTION.reveal,
      "menu.copy",
    ]);
    expect(copyEntries(entries).map(entry => entry.id)).toEqual([
      MENU_ACTION.copyAbsolute,
      MENU_ACTION.copyRelative,
    ]);
    expect(entries.every(entry => entry.disabled !== true)).toBe(true);
  });

  it("gives a directory row the same menu as a file row", () => {
    const input = {
      notices: { workspace: true as const },
      capabilities: capabilities("finder"),
      absolutePath: "/workspace/docs",
      createParent: "docs",
    };
    const forDirectory = buildContextMenu({ ...input, row: directoryRow() }, t);
    const forFile = buildContextMenu({ ...input, row: fileRow() }, t);
    expect(forDirectory.map(entry => entry.id)).toEqual(forFile.map(entry => entry.id));
  });

  it("offers only the create rows on the tree's blank area", () => {
    const entries = buildContextMenu(
      {
        row: undefined,
        notices: { workspace: true },
        capabilities: capabilities("finder"),
        absolutePath: undefined,
        createParent: "",
      },
      t,
    );
    expect(entries.map(entry => entry.id)).toEqual([MENU_ACTION.createFile, MENU_ACTION.createFolder]);
    // No row means nothing to reveal or copy: those actions need a target.
    expect(entries.some(entry => entry.id === MENU_ACTION.reveal)).toBe(false);
    expect(entries.some(entry => entry.submenu !== undefined)).toBe(false);
  });

  it("names the file manager the host reported", () => {
    const label = (fileManager: WorkspaceCapabilities["fileManager"]): string =>
      revealEntry(
        buildContextMenu(
          {
            row: fileRow(),
            notices: { workspace: true },
            capabilities: capabilities(fileManager),
            absolutePath: "/w/a.md",
            createParent: "docs",
          },
          t,
        ),
      ).label;

    expect(label("finder")).toBe("menu.reveal.finder");
    expect(label("explorer")).toBe("menu.reveal.explorer");
    expect(label("directory")).toBe("menu.reveal.directory");
  });

  it("disables the reveal row with a reason when the host has no file manager", () => {
    const entry = revealEntry(
      buildContextMenu(
        {
          row: fileRow(),
          notices: { workspace: true },
          capabilities: capabilities(null),
          absolutePath: "/w/a.md",
          createParent: "docs",
        },
        t,
      ),
    );
    expect(entry.disabled).toBe(true);
    expect(entry.reason).toBe("menu.reveal.reason");
    // The label still names a file manager so the row reads as an action.
    expect(entry.label).toBe("menu.reveal.directory");
  });

  it("disables the reveal row when the workspace channel never answered", () => {
    const entry = revealEntry(
      buildContextMenu(
        {
          row: fileRow(),
          notices: { workspace: false },
          capabilities: undefined,
          absolutePath: undefined,
          createParent: "docs",
        },
        t,
      ),
    );
    expect(entry.disabled).toBe(true);
    expect(entry.reason).toBe("menu.reveal.reason");
  });

  it("keeps the relative copy available without an absolute path", () => {
    const entries = buildContextMenu(
      {
        row: fileRow(),
        notices: { workspace: true },
        capabilities: capabilities("finder"),
        absolutePath: undefined,
        createParent: "docs",
      },
      t,
    );
    const [absolute, relative] = copyEntries(entries);
    expect(absolute?.disabled).toBe(true);
    expect(absolute?.reason).toBe("menu.copy.absolute.reason");
    expect(relative?.disabled).not.toBe(true);
  });

  it("keeps the action ids stable for the view's dispatch", () => {
    expect(MENU_ACTION).toEqual({
      createFile: "create.file",
      createFolder: "create.folder",
      reveal: "reveal",
      copyAbsolute: "copy.absolute",
      copyRelative: "copy.relative",
    });
  });
});
