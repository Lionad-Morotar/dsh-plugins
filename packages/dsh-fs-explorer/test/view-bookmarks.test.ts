// @vitest-environment jsdom
/**
 * Bookmark management through the view.
 *
 * The bar and the picker are tested on their own; this file is about the wiring
 * between them and the store. A picker that commits into a tree nobody saves, or
 * a rename that updates the bar but not the record, would pass every component
 * test and still lose the reader's bookmarks on reload.
 */
import { act, createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import type { BookmarkTree } from "../src/bookmarks.ts";
import { createFsExplorerView, type WorkbenchFace } from "../src/client/view.tsx";
import type { WorkspaceClient } from "../src/client/workspace-face.ts";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const t = (key: string): string => key;

/** The listing the fake file service answers with. */
const LISTING = {
  ok: true as const,
  value: { entries: [{ name: "a.md", type: "file" }], truncated: false },
};

/** A workspace channel whose bookmark calls are recorded. */
function fakeWorkspace(initial: BookmarkTree | null): {
  readonly client: WorkspaceClient;
  readonly saved: BookmarkTree[];
} {
  const saved: BookmarkTree[] = [];
  return {
    saved,
    client: {
      capabilities: async () => ({ ok: true, capabilities: { fileManager: "finder", canReveal: true } }),
      info: async (_sessionId, path) => ({
        ok: true,
        info: { absolutePath: `/workspace/${path}`, type: "file", exists: true },
      }),
      reveal: async () => ({ ok: true }),
      loadBookmarks: async () => ({ ok: true, tree: initial }),
      saveBookmarks: async (_sessionId, tree) => {
        saved.push(tree);
        return { ok: true };
      },
    },
  };
}

const workbench: WorkbenchFace = {
  version: 1,
  currentSessionId: () => "s1",
  openViewOrSwitch: () => ({ opened: false, focused: false }),
};

describe("file view bookmark management", () => {
  let host: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    host = document.createElement("div");
    document.body.append(host);
    root = createRoot(host);
  });

  afterEach(async () => {
    await act(async () => {
      root.unmount();
    });
    host.remove();
  });

  /** Mount the view over one file, with the given stored tree. */
  async function mount(workspace: WorkspaceClient): Promise<void> {
    const View = createFsExplorerView({
      workbench,
      version: 1,
      t,
      files: () => ({ list: async () => LISTING }),
      status: () => undefined,
      workspace: () => workspace,
    });
    await act(async () => {
      root.render(createElement(View, { sessionId: "s1" }));
    });
    // The root listing and the bookmark load both land on a microtask.
    await act(async () => {
      await Promise.resolve();
    });
    await act(async () => {
      await Promise.resolve();
    });
  }

  /** Right-click the one file row. */
  async function rightClickRow(): Promise<void> {
    const row = host.querySelector<HTMLElement>('[data-path="a.md"]');
    if (row === null) throw new Error("no row");
    await act(async () => {
      row.dispatchEvent(new MouseEvent("contextmenu", { bubbles: true, cancelable: true, clientX: 10, clientY: 20 }));
    });
    await act(async () => {
      await Promise.resolve();
    });
  }

  /** One menu row by action id. */
  function menuItem(action: string): HTMLElement {
    const found = host.querySelector<HTMLElement>(`[data-action="${action}"]`);
    if (found === null) throw new Error(`no menu row ${action}`);
    return found;
  }

  it("opens the picker from the context menu and saves what it commits", async () => {
    const workspace = fakeWorkspace(null);
    await mount(workspace.client);
    await rightClickRow();

    await act(async () => {
      menuItem("add.bookmark").click();
    });
    expect(host.querySelector('[data-testid="fx-bookmark-picker"]')).not.toBeNull();

    const commit = host.querySelector<HTMLElement>('[data-testid="fx-bookmark-picker-commit"]');
    if (commit === null) throw new Error("no commit button");
    await act(async () => {
      commit.click();
    });
    await act(async () => {
      await Promise.resolve();
    });

    expect(workspace.saved).toHaveLength(1);
    expect(workspace.saved[0]?.roots[0]).toMatchObject({ kind: "file", name: "a.md", path: "a.md" });
    // The bar shows it without a reload.
    const chip = host.querySelector<HTMLElement>('[data-testid="fx-bookmark"]');
    expect(chip?.textContent?.trim()).toBe("a.md");
  });

  it("renames a bookmark and saves the new name", async () => {
    const workspace = fakeWorkspace({
      version: 1,
      updatedAt: "2026-11-03T00:00:00.000Z",
      roots: [{ id: "f1", kind: "file", name: "old", path: "a.md", createdAt: 1 }],
    });
    await mount(workspace.client);

    const manage = host.querySelector<HTMLElement>('[data-testid="fx-bookmark-manage"]');
    if (manage === null) throw new Error("no manage button");
    await act(async () => {
      manage.click();
    });
    const rename = host.querySelector<HTMLElement>('[data-testid="fx-bookmark-manage-rename"]');
    if (rename === null) throw new Error("no rename row");
    await act(async () => {
      rename.click();
    });

    const input = host.querySelector<HTMLInputElement>('[data-testid="fx-name-input"]');
    if (input === null) throw new Error("no name input");
    // The card opens on the current name, so a rename is an edit not a retype.
    expect(input.value).toBe("old");
    await act(async () => {
      const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set;
      setter?.call(input, "renamed");
      input.dispatchEvent(new Event("input", { bubbles: true }));
    });
    await act(async () => {
      input.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
    });
    await act(async () => {
      await Promise.resolve();
    });

    expect(workspace.saved).toHaveLength(1);
    expect(workspace.saved[0]?.roots[0]).toMatchObject({ id: "f1", name: "renamed" });
  });

  it("removes a bookmark and saves the shorter tree", async () => {
    const workspace = fakeWorkspace({
      version: 1,
      updatedAt: "2026-11-03T00:00:00.000Z",
      roots: [{ id: "f1", kind: "file", name: "a", path: "a.md", createdAt: 1 }],
    });
    await mount(workspace.client);

    const manage = host.querySelector<HTMLElement>('[data-testid="fx-bookmark-manage"]');
    if (manage === null) throw new Error("no manage button");
    await act(async () => {
      manage.click();
    });
    const remove = host.querySelector<HTMLElement>('[data-testid="fx-bookmark-manage-remove"]');
    if (remove === null) throw new Error("no remove row");
    await act(async () => {
      remove.click();
    });
    await act(async () => {
      await Promise.resolve();
    });

    expect(workspace.saved).toHaveLength(1);
    expect(workspace.saved[0]?.roots).toEqual([]);
    expect(host.querySelector('[data-testid="fx-bookmark-empty"]')).not.toBeNull();
  });

  it("creates a group from an empty group's row", async () => {
    const workspace = fakeWorkspace({
      version: 1,
      updatedAt: "2026-11-03T00:00:00.000Z",
      roots: [{ id: "g1", kind: "group", name: "work", createdAt: 1, children: [] }],
    });
    await mount(workspace.client);

    const chip = host.querySelector<HTMLElement>('[data-testid="fx-bookmark"]');
    if (chip === null) throw new Error("no chip");
    await act(async () => {
      chip.dispatchEvent(new MouseEvent("pointerover", { bubbles: true, relatedTarget: null }));
    });
    const newGroup = [...host.querySelectorAll<HTMLElement>('[data-testid="fx-bookmark-item"]')].find(
      element => element.textContent === "bookmarks.newGroup",
    );
    if (newGroup === undefined) throw new Error("no new-group row");
    await act(async () => {
      newGroup.click();
    });

    const input = host.querySelector<HTMLInputElement>('[data-testid="fx-name-input"]');
    if (input === null) throw new Error("no name input");
    await act(async () => {
      const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set;
      setter?.call(input, "nested");
      input.dispatchEvent(new Event("input", { bubbles: true }));
    });
    await act(async () => {
      input.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
    });
    await act(async () => {
      await Promise.resolve();
    });

    expect(workspace.saved).toHaveLength(1);
    const work = workspace.saved[0]?.roots[0];
    expect(work?.kind === "group" ? work.children : []).toHaveLength(1);
    expect(work?.kind === "group" ? work.children[0]?.name : undefined).toBe("nested");
  });
});
