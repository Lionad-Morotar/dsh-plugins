// @vitest-environment jsdom
/**
 * The tree's right-click gestures.
 *
 * Two properties matter and neither is cosmetic. A right-click on a row must
 * address that row, not whichever row the keyboard cursor happened to be on, and
 * the browser's own menu must not appear. And the keyboard's right-click
 * (Shift+F10, the ContextMenu key) must reach the same menu, or the feature is
 * mouse-only for no reason.
 */
import { act, createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import type { TreeRow } from "../src/client/model.ts";
import { TreeBody, type ContextMenuGesture } from "../src/client/tree.tsx";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const t = (key: string): string => key;

/** Two rows: a directory and a file inside it. */
const ROWS: TreeRow[] = [
  { type: "entry", path: "docs", name: "docs", kind: "directory", depth: 0, expanded: true },
  { type: "entry", path: "docs/a.md", name: "a.md", kind: "file", depth: 1, expanded: false },
];

/** One recorded gesture. */
interface Gesture {
  readonly path: string | undefined;
  readonly x: number;
  readonly y: number;
  /** The element the menu was opened from, which is where focus returns. */
  readonly trigger: HTMLElement | undefined;
}

describe("tree context menu gestures", () => {
  let host: HTMLDivElement;
  let root: Root;
  let gestures: Gesture[];

  beforeEach(() => {
    host = document.createElement("div");
    document.body.append(host);
    root = createRoot(host);
    gestures = [];
  });

  afterEach(async () => {
    await act(async () => {
      root.unmount();
    });
    host.remove();
  });

  /** Mount the tree with a gesture recorder. */
  async function mount(rows: TreeRow[] = ROWS): Promise<void> {
    const onContextMenu: ContextMenuGesture = (row, anchor, trigger) => {
      gestures.push({ path: row?.path, x: anchor.x, y: anchor.y, trigger });
    };
    await act(async () => {
      root.render(
        createElement(TreeBody, {
          rows,
          selectedPath: undefined,
          entryFocus: undefined,
          t,
          onToggle: () => undefined,
          onSelect: () => undefined,
          onRetry: () => undefined,
          onEntryFocusSettled: undefined,
          onContextMenu,
        }),
      );
    });
  }

  /** The mounted row for one path. */
  function row(path: string): HTMLElement {
    const found = host.querySelector<HTMLElement>(`[data-path="${path}"]`);
    if (found === null) throw new Error(`no row for ${path}`);
    return found;
  }

  it("reports the right-clicked row and the pointer position", async () => {
    await mount();
    const event = new MouseEvent("contextmenu", { bubbles: true, cancelable: true, clientX: 120, clientY: 44 });
    await act(async () => {
      row("docs/a.md").dispatchEvent(event);
    });
    expect(gestures).toHaveLength(1);
    expect(gestures[0]).toMatchObject({ path: "docs/a.md", x: 120, y: 44 });
    // The row itself is the focus return target: a right-click leaves focus on
    // the body, and the next Tab from there restarts at the top of the page.
    expect(gestures[0]?.trigger).toBe(row("docs/a.md"));
    // The browser's own menu is what the reader would otherwise get.
    expect(event.defaultPrevented).toBe(true);
  });

  it("addresses a directory row the same way", async () => {
    await mount();
    await act(async () => {
      row("docs").dispatchEvent(
        new MouseEvent("contextmenu", { bubbles: true, cancelable: true, clientX: 10, clientY: 20 }),
      );
    });
    expect(gestures).toHaveLength(1);
    expect(gestures[0]).toMatchObject({ path: "docs", x: 10, y: 20 });
  });

  it("reports the blank area with no row", async () => {
    await mount();
    const scroller = host.querySelector<HTMLElement>('[data-testid="fs-tree-scroll"]');
    if (scroller === null) throw new Error("no scroller");
    await act(async () => {
      scroller.dispatchEvent(
        new MouseEvent("contextmenu", { bubbles: true, cancelable: true, clientX: 30, clientY: 400 }),
      );
    });
    expect(gestures).toHaveLength(1);
    expect(gestures[0]).toMatchObject({ path: undefined, x: 30, y: 400 });
    expect(gestures[0]?.trigger).toBe(scroller);
  });

  it("opens the same menu from Shift+F10 on the focused row", async () => {
    await mount();
    // The cursor starts on the first row after a down arrow.
    const scroller = host.querySelector<HTMLElement>('[data-testid="fs-tree-scroll"]');
    if (scroller === null) throw new Error("no scroller");
    await act(async () => {
      scroller.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }));
    });
    await act(async () => {
      scroller.dispatchEvent(new KeyboardEvent("keydown", { key: "F10", shiftKey: true, bubbles: true }));
    });
    expect(gestures.map(gesture => gesture.path)).toEqual(["docs"]);
  });

  it("opens the same menu from the ContextMenu key", async () => {
    await mount();
    const scroller = host.querySelector<HTMLElement>('[data-testid="fs-tree-scroll"]');
    if (scroller === null) throw new Error("no scroller");
    await act(async () => {
      scroller.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }));
    });
    await act(async () => {
      scroller.dispatchEvent(new KeyboardEvent("keydown", { key: "ContextMenu", bubbles: true }));
    });
    expect(gestures.map(gesture => gesture.path)).toEqual(["docs"]);
  });

  it("leaves the keyboard alone when nothing is focused", async () => {
    await mount();
    const scroller = host.querySelector<HTMLElement>('[data-testid="fs-tree-scroll"]');
    if (scroller === null) throw new Error("no scroller");
    await act(async () => {
      scroller.dispatchEvent(new KeyboardEvent("keydown", { key: "ContextMenu", bubbles: true }));
    });
    expect(gestures).toEqual([]);
  });
});
