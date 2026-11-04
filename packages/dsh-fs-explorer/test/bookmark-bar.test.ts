// @vitest-environment jsdom
/**
 * The bookmark bar: what it shows and where a click goes.
 *
 * The bar is a navigation surface, so every assertion here is about a
 * destination. A file chip opens that file; a folder chip expands and locates
 * that directory; a group opens a flyout that reaches any depth. The one thing
 * that is not navigation is the empty group, which still has to offer the only
 * action it can: creating a group inside it.
 *
 * Nesting is the part worth testing hardest. The host `Menu` only opens one
 * level of submenu, which is why this bar draws its own flyouts, and a third
 * level that silently fails to appear would look exactly like a group with no
 * children.
 */
import { act, createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { BookmarkBar } from "../src/client/bookmark-bar.tsx";
import type { BookmarkGroup, BookmarkNode, BookmarkTree } from "../src/bookmarks.ts";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const t = (key: string): string => key;

/** One bookmark node with a predictable id. */
function file(id: string, path = `docs/${id}.md`): BookmarkNode {
  return { id, kind: "file", name: id, path, createdAt: 1 };
}

function folder(id: string, path = `docs/${id}`): BookmarkNode {
  return { id, kind: "folder", name: id, path, createdAt: 1 };
}

function group(id: string, children: readonly BookmarkNode[] = []): BookmarkGroup {
  return { id, kind: "group", name: id, createdAt: 1, children };
}

/** A tree over the given roots, in the order given. */
function treeOf(roots: readonly BookmarkNode[]): BookmarkTree {
  return { version: 1, roots, updatedAt: "2026-11-03T00:00:00.000Z" };
}

describe("BookmarkBar", () => {
  let host: HTMLDivElement;
  let root: Root;
  let opened: string[];
  let folders: string[];

  beforeEach(() => {
    host = document.createElement("div");
    document.body.append(host);
    root = createRoot(host);
    opened = [];
    folders = [];
  });

  afterEach(async () => {
    await act(async () => {
      root.unmount();
    });
    host.remove();
  });

  /** Mount the bar over one tree. */
  async function mount(
    tree: BookmarkTree,
    options: { readonly onCreateGroup?: (parentId: string | null) => void } = {},
  ): Promise<void> {
    await act(async () => {
      root.render(
        createElement(BookmarkBar, {
          tree,
          t,
          onOpenFile: (path: string) => void opened.push(path),
          onOpenFolder: (path: string) => void folders.push(path),
          ...(options.onCreateGroup === undefined ? {} : { onCreateGroup: options.onCreateGroup }),
        }),
      );
    });
  }

  /** The bar's root element. */
  function bar(): HTMLElement {
    const found = host.querySelector<HTMLElement>('[data-testid="fx-bookmarks"]');
    if (found === null) throw new Error("no bookmark bar");
    return found;
  }

  /** The top-level chip whose text is `name`. */
  function chip(name: string): HTMLElement {
    const found = [...bar().querySelectorAll<HTMLElement>('[data-testid="fx-bookmark"]')].find(
      element => element.textContent?.trim() === name,
    );
    if (found === undefined) throw new Error(`no chip named ${name}`);
    return found;
  }

  /** Every flyout currently mounted. */
  function flyouts(): HTMLElement[] {
    return [...host.querySelectorAll<HTMLElement>('[data-testid="fx-bookmark-flyout"]')];
  }

  /** The menu item whose text is `name`, across every open flyout. */
  function item(name: string): HTMLElement {
    const found = [...host.querySelectorAll<HTMLElement>('[data-testid="fx-bookmark-item"]')].find(
      element => element.textContent?.trim() === name,
    );
    if (found === undefined) throw new Error(`no menu item named ${name}`);
    return found;
  }

  /**
   * Hover one element.
   *
   * React synthesizes `onPointerEnter` from `pointerover`, so that is the event
   * a test has to dispatch: a raw `pointerenter` never reaches the handler.
   */
  async function hover(element: HTMLElement): Promise<void> {
    await act(async () => {
      element.dispatchEvent(new MouseEvent("pointerover", { bubbles: true, relatedTarget: null }));
    });
  }

  /** Move the pointer off one element. */
  async function unhover(element: HTMLElement): Promise<void> {
    await act(async () => {
      element.dispatchEvent(new MouseEvent("pointerout", { bubbles: true, relatedTarget: null }));
    });
  }

  it("opens a file when its chip is clicked", async () => {
    await mount(treeOf([file("a", "docs/a.md")]));
    await act(async () => {
      chip("a").click();
    });
    expect(opened).toEqual(["docs/a.md"]);
    expect(folders).toEqual([]);
  });

  it("locates a folder when its chip is clicked", async () => {
    await mount(treeOf([folder("docs", "docs")]));
    await act(async () => {
      chip("docs").click();
    });
    expect(folders).toEqual(["docs"]);
    expect(opened).toEqual([]);
  });

  it("shows a group's children on hover and opens a child file", async () => {
    await mount(treeOf([group("work", [file("a", "docs/a.md")])]));
    expect(flyouts()).toHaveLength(0);

    await hover(chip("work"));
    expect(flyouts()).toHaveLength(1);

    await act(async () => {
      item("a").click();
    });
    expect(opened).toEqual(["docs/a.md"]);
    // Choosing an item closes the menu: the reader got what they came for.
    expect(flyouts()).toHaveLength(0);
  });

  it("reaches the third level of nested groups", async () => {
    // The host `Menu` stops at one level, which is why this bar draws its own.
    const deep = group("g1", [group("g2", [group("g3", [file("deep", "docs/deep.md")])])]);
    await mount(treeOf([deep]));

    await hover(chip("g1"));
    await hover(item("g2"));
    await hover(item("g3"));

    expect(flyouts()).toHaveLength(3);
    await act(async () => {
      item("deep").click();
    });
    expect(opened).toEqual(["docs/deep.md"]);
  });

  it("offers a new group inside an empty group", async () => {
    const created: (string | null)[] = [];
    await mount(treeOf([group("empty")]), { onCreateGroup: parentId => void created.push(parentId) });
    await hover(chip("empty"));

    const entry = item("bookmarks.newGroup");
    expect(entry.getAttribute("aria-disabled")).not.toBe("true");
    await act(async () => {
      entry.click();
    });
    expect(created).toEqual(["empty"]);
  });

  it("disables the new-group row when nothing can create one", async () => {
    await mount(treeOf([group("empty")]));
    await hover(chip("empty"));

    const entry = item("bookmarks.newGroup");
    expect(entry.getAttribute("aria-disabled")).toBe("true");
    expect(entry.getAttribute("title")).toBe("bookmarks.newGroup.reason");
  });

  it("closes the flyout on Escape", async () => {
    await mount(treeOf([group("work", [file("a")])]));
    await hover(chip("work"));
    expect(flyouts()).toHaveLength(1);

    await act(async () => {
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    });
    expect(flyouts()).toHaveLength(0);
  });

  it("shows the roots in the order the tree gives them", async () => {
    // Not sorted by createdAt: the array order is the display order, which is
    // what lets the reader drag a bookmark somewhere and have it stay.
    await mount(
      treeOf([
        { id: "late", kind: "file", name: "late", path: "late.md", createdAt: 30 },
        { id: "early", kind: "file", name: "early", path: "early.md", createdAt: 10 },
        { id: "mid", kind: "file", name: "mid", path: "mid.md", createdAt: 20 },
      ]),
    );
    const names = [...bar().querySelectorAll<HTMLElement>('[data-testid="fx-bookmark"]')].map(element =>
      element.textContent?.trim(),
    );
    expect(names).toEqual(["late", "early", "mid"]);
  });

  it("shows the empty hint when there is nothing to show", async () => {
    await mount(treeOf([]));
    expect(bar().textContent).toContain("bookmarks.empty");
  });

  it("marks a group chip as a menu trigger", async () => {
    await mount(treeOf([group("work", [file("a")])]));
    const trigger = chip("work");
    expect(trigger.getAttribute("aria-haspopup")).toBe("menu");
    expect(trigger.getAttribute("aria-expanded")).toBe("false");

    await hover(trigger);
    expect(trigger.getAttribute("aria-expanded")).toBe("true");
  });

  it("opens a group from the keyboard", async () => {
    await mount(treeOf([group("work", [file("a")])]));
    await act(async () => {
      chip("work").dispatchEvent(new FocusEvent("focusin", { bubbles: true }));
    });
    expect(flyouts()).toHaveLength(1);
  });

  it("keeps the flyout open while the pointer crosses the gap", async () => {
    // The 120ms grace is what makes moving from the chip into the card work:
    // without it the menu closes in the gap and the reader can never reach it.
    vi.useFakeTimers();
    try {
      await mount(treeOf([group("work", [file("a")])]));
      await hover(chip("work"));
      const card = flyouts()[0];
      if (card === undefined) throw new Error("no flyout");

      await unhover(chip("work"));
      await hover(card);
      await act(async () => {
        vi.advanceTimersByTime(200);
      });
      expect(flyouts()).toHaveLength(1);
    } finally {
      vi.useRealTimers();
    }
  });
});

describe("BookmarkBar management", () => {
  let host: HTMLDivElement;
  let root: Root;
  let renamed: string[];
  let removed: string[];
  let moved: string[];
  let reordered: { parentId: string | null; ids: readonly string[] }[];
  let createdGroups: (string | null)[];

  beforeEach(() => {
    host = document.createElement("div");
    document.body.append(host);
    root = createRoot(host);
    renamed = [];
    removed = [];
    moved = [];
    reordered = [];
    createdGroups = [];
  });

  afterEach(async () => {
    await act(async () => {
      root.unmount();
    });
    host.remove();
  });

  /** Mount the bar with every management gesture recorded. */
  async function mount(tree: BookmarkTree): Promise<void> {
    await act(async () => {
      root.render(
        createElement(BookmarkBar, {
          tree,
          t,
          onOpenFile: () => undefined,
          onOpenFolder: () => undefined,
          onCreateGroup: (parentId: string | null) => void createdGroups.push(parentId),
          onRename: (node: BookmarkNode) => void renamed.push(node.id),
          onRemove: (node: BookmarkNode) => void removed.push(node.id),
          onMove: (node: BookmarkNode) => void moved.push(node.id),
          onReorder: (parentId: string | null, ids: readonly string[]) => void reordered.push({ parentId, ids }),
        }),
      );
    });
  }

  /** The management button of the slot whose chip text is `name`. */
  function manageButton(name: string): HTMLElement {
    const slot = [...host.querySelectorAll<HTMLElement>(".fx-bookmark-slot")].find(
      element => element.querySelector('[data-testid="fx-bookmark"]')?.textContent?.trim() === name,
    );
    const button = slot?.querySelector<HTMLElement>('[data-testid="fx-bookmark-manage"]');
    if (button === null || button === undefined) throw new Error(`no manage button for ${name}`);
    return button;
  }

  /** One row of the open management menu. */
  function manageRow(action: string): HTMLElement {
    const found = host.querySelector<HTMLElement>(`[data-testid="fx-bookmark-manage-${action}"]`);
    if (found === null) throw new Error(`no manage row ${action}`);
    return found;
  }

  /** Open one chip's management menu. */
  async function openManage(name: string): Promise<void> {
    await act(async () => {
      manageButton(name).click();
    });
  }

  /** The first top-level chip. */
  function chip(): HTMLElement {
    const found = host.querySelector<HTMLElement>('[data-testid="fx-bookmark"]');
    if (found === null) throw new Error("no chip");
    return found;
  }

  it("opens a management menu with the five actions", async () => {
    await mount(treeOf([file("a"), file("b")]));
    await openManage("a");
    const menu = host.querySelector('[data-testid="fx-bookmark-manage-menu"]');
    expect(menu).not.toBeNull();
    expect(menu?.getAttribute("role")).toBe("menu");
    for (const action of ["rename", "remove", "up", "down", "move"]) {
      expect(manageRow(action)).not.toBeNull();
    }
  });

  it("reports a rename", async () => {
    await mount(treeOf([file("a")]));
    await openManage("a");
    await act(async () => {
      manageRow("rename").click();
    });
    expect(renamed).toEqual(["a"]);
    // The menu closes on a choice.
    expect(host.querySelector('[data-testid="fx-bookmark-manage-menu"]')).toBeNull();
  });

  it("reports a removal", async () => {
    await mount(treeOf([file("a")]));
    await openManage("a");
    await act(async () => {
      manageRow("remove").click();
    });
    expect(removed).toEqual(["a"]);
  });

  it("reports a move", async () => {
    await mount(treeOf([file("a")]));
    await openManage("a");
    await act(async () => {
      manageRow("move").click();
    });
    expect(moved).toEqual(["a"]);
  });

  it("reorders upward with the full sibling list", async () => {
    await mount(treeOf([file("a"), file("b"), file("c")]));
    await openManage("b");
    await act(async () => {
      manageRow("up").click();
    });
    expect(reordered).toEqual([{ parentId: null, ids: ["b", "a", "c"] }]);
  });

  it("reorders downward with the full sibling list", async () => {
    await mount(treeOf([file("a"), file("b"), file("c")]));
    await openManage("b");
    await act(async () => {
      manageRow("down").click();
    });
    expect(reordered).toEqual([{ parentId: null, ids: ["a", "c", "b"] }]);
  });

  it("disables up on the first row and down on the last", async () => {
    await mount(treeOf([file("a"), file("b")]));
    await openManage("a");
    expect((manageRow("up") as HTMLButtonElement).disabled).toBe(true);
    await act(async () => {
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    });
    await openManage("b");
    expect((manageRow("down") as HTMLButtonElement).disabled).toBe(true);
  });

  it("reorders by dragging one chip onto another", async () => {
    await mount(treeOf([file("a"), file("b"), file("c")]));
    const slots = [...host.querySelectorAll<HTMLElement>(".fx-bookmark-slot")];
    const first = slots[0];
    const third = slots[2];
    if (first === undefined || third === undefined) throw new Error("missing slots");

    await act(async () => {
      first.dispatchEvent(new Event("dragstart", { bubbles: true }));
    });
    expect(first.getAttribute("data-dragging")).toBe("true");
    await act(async () => {
      third.dispatchEvent(new Event("dragover", { bubbles: true, cancelable: true }));
    });
    await act(async () => {
      third.dispatchEvent(new Event("drop", { bubbles: true, cancelable: true }));
    });
    expect(reordered).toEqual([{ parentId: null, ids: ["b", "c", "a"] }]);
  });

  it("lets an empty group create one now that the gesture is wired", async () => {
    await mount(treeOf([group("empty")]));
    await act(async () => {
      chip().dispatchEvent(new MouseEvent("pointerover", { bubbles: true, relatedTarget: null }));
    });
    const row = [...host.querySelectorAll<HTMLElement>('[data-testid="fx-bookmark-item"]')].find(
      element => element.textContent === "bookmarks.newGroup",
    );
    if (row === undefined) throw new Error("no new-group row");
    expect(row.getAttribute("aria-disabled")).not.toBe("true");
    await act(async () => {
      row.click();
    });
    expect(createdGroups).toEqual(["empty"]);
  });

  it("opens the same management menu from a right-click on a chip", async () => {
    // The requirement names right-click; the `⋯` button is the discoverable
    // path, and this is the gesture the requirement asks for.
    await mount(treeOf([file("a")]));
    const event = new MouseEvent("contextmenu", { bubbles: true, cancelable: true, clientX: 30, clientY: 40 });
    await act(async () => {
      chip().dispatchEvent(event);
    });
    expect(event.defaultPrevented).toBe(true);
    expect(host.querySelector('[data-testid="fx-bookmark-manage-menu"]')).not.toBeNull();
    // The same rows, not a second menu.
    expect(manageRow("rename")).not.toBeNull();
    expect(manageRow("remove")).not.toBeNull();
  });

  it("opens the management menu from a right-click inside a flyout", async () => {
    await mount(treeOf([group("work", [file("a")])]));
    await act(async () => {
      chip().dispatchEvent(new MouseEvent("pointerover", { bubbles: true, relatedTarget: null }));
    });
    const row = host.querySelector<HTMLElement>('[data-testid="fx-bookmark-item"]');
    if (row === null) throw new Error("no flyout row");
    await act(async () => {
      row.dispatchEvent(new MouseEvent("contextmenu", { bubbles: true, cancelable: true, clientX: 5, clientY: 6 }));
    });
    expect(host.querySelector('[data-testid="fx-bookmark-manage-menu"]')).not.toBeNull();
  });

  it("closes the management menu on Escape", async () => {
    await mount(treeOf([file("a")]));
    await openManage("a");
    await act(async () => {
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    });
    expect(host.querySelector('[data-testid="fx-bookmark-manage-menu"]')).toBeNull();
  });
});
