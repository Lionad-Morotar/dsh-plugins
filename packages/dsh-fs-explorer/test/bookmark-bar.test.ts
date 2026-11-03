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
