/**
 * The remote rows of the context menu.
 *
 * One level of submenu is the host `Menu`'s hard limit, so "copy remote address"
 * is a top-level row with the remotes under it rather than a row nested inside
 * "copy path". These tests pin that shape, plus the two ways a row can be
 * unavailable: no remote at all, and a remote whose URL the client could not
 * parse.
 */
import { describe, expect, it } from "vitest";

import {
  MENU_ACTION,
  buildContextMenu,
  type ContextMenuEntry,
  type ContextMenuRow,
} from "../src/client/context-menu.ts";
import type { RemoteLink } from "../src/client/remote-url.ts";
import type { WorkspaceCapabilities } from "../src/host/types.ts";

const t = (key: string): string => key;

function fileRow(): ContextMenuRow {
  return { type: "entry", path: "docs/a.md", name: "a.md", kind: "file" };
}

function capabilities(): WorkspaceCapabilities {
  return { fileManager: "finder", canReveal: true };
}

/** Two links, as the builder would produce for one repository. */
function links(): readonly RemoteLink[] {
  return [
    { id: "copy.remote.origin", label: "origin · GitHub", url: "https://github.com/acme/app/blob/main/a.md" },
    { id: "copy.remote.upstream", label: "upstream · GitHub", url: "https://github.com/acme/up/app/blob/main/a.md" },
  ];
}

/** One row by action id. */
function entry(entries: readonly ContextMenuEntry[], id: string): ContextMenuEntry {
  const found = entries.find(candidate => candidate.id === id);
  if (found === undefined) throw new Error(`the menu has no ${id} row`);
  return found;
}

describe("buildContextMenu remote rows", () => {
  it("lists one submenu row per remote", () => {
    const entries = buildContextMenu(
      {
        row: fileRow(),
        notices: { workspace: true },
        capabilities: capabilities(),
        absolutePath: "/repo/a.md",
        createParent: "docs",
        remoteLinks: links(),
      },
      t,
    );
    const remote = entry(entries, MENU_ACTION.copyRemote);
    expect(remote.label).toBe("menu.copy.remote");
    expect(remote.disabled).not.toBe(true);
    expect(remote.submenu?.map(child => child.id)).toEqual(["copy.remote.origin", "copy.remote.upstream"]);
    expect(remote.submenu?.map(child => child.label)).toEqual(["origin · GitHub", "upstream · GitHub"]);
  });

  it("disables the row with a reason when the repository has no remote", () => {
    const entries = buildContextMenu(
      {
        row: fileRow(),
        notices: { workspace: true },
        capabilities: capabilities(),
        absolutePath: "/repo/a.md",
        createParent: "docs",
        remoteLinks: [],
      },
      t,
    );
    const remote = entry(entries, MENU_ACTION.copyRemote);
    expect(remote.disabled).toBe(true);
    expect(remote.reason).toBe("menu.copy.remote.reason");
    // No submenu: an empty card would look like a bug.
    expect(remote.submenu).toBeUndefined();
  });

  it("disables the row when the channel never answered", () => {
    const entries = buildContextMenu(
      {
        row: fileRow(),
        notices: { workspace: true },
        capabilities: capabilities(),
        absolutePath: "/repo/a.md",
        createParent: "docs",
        remoteLinks: undefined,
      },
      t,
    );
    expect(entry(entries, MENU_ACTION.copyRemote).disabled).toBe(true);
  });

  it("keeps the remote row out of the copy submenu, one level deep", () => {
    // The host `Menu` opens exactly one level. Nesting this row inside "copy
    // path" would make it a second level and it would silently never open.
    const entries = buildContextMenu(
      {
        row: fileRow(),
        notices: { workspace: true },
        capabilities: capabilities(),
        absolutePath: "/repo/a.md",
        createParent: "docs",
        remoteLinks: links(),
      },
      t,
    );
    const copy = entry(entries, "menu.copy");
    expect(copy.submenu?.map(child => child.id)).toEqual([MENU_ACTION.copyAbsolute, MENU_ACTION.copyRelative]);
    expect(entries.map(candidate => candidate.id)).toContain(MENU_ACTION.copyRemote);
  });

  it("places the remote row after the copy submenu", () => {
    const entries = buildContextMenu(
      {
        row: fileRow(),
        notices: { workspace: true },
        capabilities: capabilities(),
        absolutePath: "/repo/a.md",
        createParent: "docs",
        remoteLinks: links(),
      },
      t,
    );
    expect(entries.map(candidate => candidate.id)).toEqual([
      MENU_ACTION.createFile,
      MENU_ACTION.createFolder,
      MENU_ACTION.reveal,
      "menu.copy",
      MENU_ACTION.copyRemote,
    ]);
  });

  it("does not offer the remote row on the blank area", () => {
    // The blank area has no path, so there is nothing to link to.
    const entries = buildContextMenu(
      {
        row: undefined,
        notices: { workspace: true },
        capabilities: capabilities(),
        absolutePath: undefined,
        createParent: "",
        remoteLinks: links(),
      },
      t,
    );
    expect(entries.some(candidate => candidate.id === MENU_ACTION.copyRemote)).toBe(false);
  });

  it("keeps the action id prefix stable for the view's dispatch", () => {
    expect(MENU_ACTION.copyRemote).toBe("copy.remote");
  });
});
