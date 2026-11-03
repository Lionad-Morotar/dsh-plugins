// @vitest-environment jsdom
/**
 * The bookmark destination picker.
 *
 * Every assertion here is about where a bookmark ends up. The picker walks one
 * level at a time, so the tests walk too: root, into a group, and back out. The
 * empty group matters most, because it is the case where a picker that only
 * listed existing children would look broken.
 */
import { act, createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { BookmarkPicker } from "../src/client/bookmark-picker.tsx";
import { findNode } from "../src/client/bookmarks-model.ts";
import type { BookmarkGroup, BookmarkNode, BookmarkTree } from "../src/bookmarks.ts";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const t = (key: string): string => key;

function group(id: string, children: readonly BookmarkNode[] = []): BookmarkGroup {
  return { id, kind: "group", name: id, createdAt: 1, children };
}

function file(id: string, path = `docs/${id}.md`): BookmarkNode {
  return { id, kind: "file", name: id, path, createdAt: 1 };
}

function treeOf(roots: readonly BookmarkNode[]): BookmarkTree {
  return { version: 1, roots, updatedAt: "2026-11-03T00:00:00.000Z" };
}

describe("BookmarkPicker", () => {
  let host: HTMLDivElement;
  let root: Root;
  let committed: BookmarkTree[];

  beforeEach(() => {
    host = document.createElement("div");
    document.body.append(host);
    root = createRoot(host);
    committed = [];
  });

  afterEach(async () => {
    await act(async () => {
      root.unmount();
    });
    host.remove();
  });

  /** Mount the picker. */
  async function mount(
    tree: BookmarkTree,
    options: {
      readonly mode?: "add" | "move";
      readonly node?: BookmarkNode;
      readonly onClose?: () => void;
    } = {},
  ): Promise<void> {
    await act(async () => {
      root.render(
        createElement(BookmarkPicker, {
          tree,
          target: { name: "a.md", path: "docs/a.md", kind: "file" },
          t,
          mode: options.mode ?? "add",
          ...(options.node === undefined ? {} : { node: options.node }),
          onCommit: (next: BookmarkTree) => void committed.push(next),
          onClose: options.onClose ?? (() => undefined),
        }),
      );
    });
  }

  /** The picker card. */
  function card(): HTMLElement {
    const found = host.querySelector<HTMLElement>('[data-testid="fx-bookmark-picker"]');
    if (found === null) throw new Error("no picker");
    return found;
  }

  /** One group row inside the current level. */
  function groupRow(name: string): HTMLElement {
    const found = [...host.querySelectorAll<HTMLElement>('[data-testid="fx-bookmark-picker-group"]')].find(
      element => element.textContent?.trim() === name,
    );
    if (found === undefined) throw new Error(`no group row ${name}`);
    return found;
  }

  /** The commit button. */
  function commit(): HTMLElement {
    const found = host.querySelector<HTMLElement>('[data-testid="fx-bookmark-picker-commit"]');
    if (found === null) throw new Error("no commit button");
    return found;
  }

  it("adds a file at the root", async () => {
    await mount(treeOf([]));
    expect(card().getAttribute("role")).toBe("dialog");
    await act(async () => {
      commit().click();
    });
    expect(committed).toHaveLength(1);
    expect(committed[0]?.roots).toHaveLength(1);
    expect(committed[0]?.roots[0]).toMatchObject({ kind: "file", name: "a.md", path: "docs/a.md" });
  });

  it("adds a directory as a folder bookmark", async () => {
    await act(async () => {
      root.render(
        createElement(BookmarkPicker, {
          tree: treeOf([]),
          target: { name: "docs", path: "docs", kind: "directory" },
          t,
          mode: "add",
          onCommit: (next: BookmarkTree) => void committed.push(next),
          onClose: () => undefined,
        }),
      );
    });
    await act(async () => {
      commit().click();
    });
    expect(committed[0]?.roots[0]).toMatchObject({ kind: "folder", name: "docs", path: "docs" });
  });

  it("walks into a group and adds there", async () => {
    await mount(treeOf([group("work")]));
    await act(async () => {
      groupRow("work").click();
    });
    await act(async () => {
      commit().click();
    });
    const added = findNode(committed[0] ?? treeOf([]), "work");
    expect(added?.kind).toBe("group");
    expect(added?.kind === "group" ? added.children : []).toHaveLength(1);
  });

  it("shows the new-group row and the commit row even in an empty group", async () => {
    await mount(treeOf([group("empty")]));
    await act(async () => {
      groupRow("empty").click();
    });
    // Neither action may disappear: an empty group is still a destination.
    expect(host.textContent).toContain("bookmarks.newGroup");
    expect(commit().textContent).toBe("bookmarks.picker.addHere");
  });

  it("creates a group and steps into it", async () => {
    await mount(treeOf([]));
    await act(async () => {
      [...host.querySelectorAll<HTMLElement>("button")].find(element => element.textContent === "bookmarks.newGroup")?.click();
    });
    const input = host.querySelector<HTMLInputElement>('[data-testid="fx-name-input"]');
    if (input === null) throw new Error("no name input");
    await act(async () => {
      const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set;
      setter?.call(input, "reading");
      input.dispatchEvent(new Event("input", { bubbles: true }));
    });
    await act(async () => {
      input.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
    });

    // The card now sits inside the group it just made, so committing lands there.
    await act(async () => {
      commit().click();
    });
    const created = committed[0]?.roots.find(node => node.kind === "group" && node.name === "reading");
    expect(created?.kind).toBe("group");
    expect(created?.kind === "group" ? created.children : []).toHaveLength(1);
  });

  it("moves a node into the chosen group", async () => {
    const moved = file("a");
    await mount(treeOf([group("work"), moved]), { mode: "move", node: moved });
    await act(async () => {
      groupRow("work").click();
    });
    await act(async () => {
      commit().click();
    });
    const work = findNode(committed[0] ?? treeOf([]), "work");
    expect(work?.kind === "group" ? work.children.map(child => child.id) : []).toEqual(["a"]);
    // And it left the root.
    expect(committed[0]?.roots.map(node => node.id)).toEqual(["work"]);
  });

  it("refuses to move a group into itself and says why", async () => {
    const work = group("work");
    await mount(treeOf([work]), { mode: "move", node: work });
    await act(async () => {
      groupRow("work").click();
    });
    await act(async () => {
      commit().click();
    });
    expect(committed).toEqual([]);
    expect(host.querySelector('[data-testid="fx-bookmark-picker-error"]')).not.toBeNull();
  });

  it("closes on Escape", async () => {
    let closed = 0;
    await mount(treeOf([]), { onClose: () => void (closed += 1) });
    await act(async () => {
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    });
    expect(closed).toBe(1);
  });

  it("closes on a click outside the card", async () => {
    let closed = 0;
    await mount(treeOf([]), { onClose: () => void (closed += 1) });
    await act(async () => {
      document.body.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true }));
    });
    expect(closed).toBe(1);
  });
});
