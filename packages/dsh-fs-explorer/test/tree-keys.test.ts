// @vitest-environment jsdom
/**
 * Keyboard navigation against the mounted tree.
 *
 * The cursor and the open panel are different facts, and a left arrow is the
 * place they come apart: collapsing a folder rebuilds the rows while the panel
 * still shows the file opened on arrival. These tests press the key and read
 * the row the cursor actually rests on.
 */
import { act, createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { TreeBody, type TreeBodyProps } from "../src/client/tree.tsx";
import type { TreeRow } from "../src/client/model.ts";

/** One entry row, as `flattenTree` would emit it. */
function entry(
  path: string,
  depth: number,
  kind: "file" | "directory" = "file",
  expanded = false,
): TreeRow {
  const name = path.slice(path.lastIndexOf("/") + 1);
  return { type: "entry", path, name, kind, depth, expanded };
}

/** The rows the screenshot describes: README open, assets expanded. */
function workspaceRows(assetsOpen: boolean): TreeRow[] {
  return [
    entry(".claude", 0, "directory"),
    entry("assets", 0, "directory", assetsOpen),
    ...(assetsOpen
      ? [entry("assets/share-3x4.jpg", 1), entry("assets/share-7x5.jpg", 1)]
      : []),
    entry("docs", 0, "directory"),
    entry("README.md", 0),
  ];
}

/** The row the keyboard cursor rests on, or undefined when it rests nowhere. */
function cursorPath(container: HTMLElement): string | undefined {
  const marked = container.querySelector('[data-cursor="true"]');
  return marked?.getAttribute("title") ?? undefined;
}

/** Props with the gestures a test can observe. */
function props(rows: TreeRow[], overrides: Partial<TreeBodyProps> = {}): TreeBodyProps {
  return {
    rows,
    selectedPath: "README.md",
    entryFocus: undefined,
    t: key => key,
    onToggle: () => undefined,
    onSelect: () => undefined,
    onRetry: () => undefined,
    onEntryFocusSettled: undefined,
    onContextMenu: () => undefined,
    ...overrides,
  };
}

describe("tree keyboard cursor", () => {
  let host: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    host = document.createElement("div");
    document.body.append(host);
    root = createRoot(host);
  });

  afterEach(async () => {
    await act(async () => root.unmount());
    host.remove();
  });

  /** Render and flush the effects that place the cursor. */
  async function show(next: TreeBodyProps): Promise<void> {
    await act(async () => {
      root.render(createElement(TreeBody, next));
    });
  }

  /** Press one key on the scroll container, where the handler lives. */
  function press(key: string): void {
    const scroller = host.querySelector("[data-testid='fs-tree-scroll']");
    if (!(scroller instanceof HTMLElement)) throw new Error("tree scroller missing");
    act(() => {
      scroller.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true }));
    });
  }

  it("keeps the cursor on a collapsed folder while the open panel stays on the file", async () => {
    const toggled: string[] = [];
    await show(props(workspaceRows(true), { onToggle: path => toggled.push(path) }));
    // Arrival parks the cursor on the open file, which is what the reader sees.
    press("ArrowUp");
    expect(cursorPath(host)).toBe("docs");
    press("ArrowUp");
    expect(cursorPath(host)).toBe("assets/share-7x5.jpg");
    press("ArrowUp");
    expect(cursorPath(host)).toBe("assets/share-3x4.jpg");
    press("ArrowUp");
    expect(cursorPath(host)).toBe("assets");

    // Left arrow on an open folder collapses it. The panel does not change.
    press("ArrowLeft");
    expect(toggled).toEqual(["assets"]);
    await show(props(workspaceRows(false), { onToggle: path => toggled.push(path) }));

    // The cursor stays on the folder. Copying the open file back would land it
    // on README.md, which is the bug.
    expect(cursorPath(host)).toBe("assets");
  });

  it("steps up to the parent folder when left arrow is pressed on a file inside it", async () => {
    await show(props(workspaceRows(true)));
    press("ArrowUp");
    press("ArrowUp");
    press("ArrowUp");
    expect(cursorPath(host)).toBe("assets/share-3x4.jpg");

    press("ArrowLeft");
    expect(cursorPath(host)).toBe("assets");
  });

  it("follows the cursor onto a file the reader opens", async () => {
    await show(props(workspaceRows(true), { selectedPath: undefined }));
    await show(props(workspaceRows(true), { selectedPath: "README.md" }));
    expect(cursorPath(host)).toBe("README.md");
  });
});
