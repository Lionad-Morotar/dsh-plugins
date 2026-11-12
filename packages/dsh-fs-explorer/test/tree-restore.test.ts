// @vitest-environment jsdom
/**
 * A returning mount's place in the tree.
 *
 * The host unmounts the file view on a tab switch, so the cursor, the expanded
 * folders and the scroll offset have to be carried back in by the view. These
 * tests drive the two props that carry the last two, against the mounted tree.
 */
import { act, createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { TreeBody, type TreeBodyProps } from "../src/client/tree.tsx";
import type { TreeRow } from "../src/client/model.ts";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

function entry(path: string, depth: number, kind: "file" | "directory" = "file", expanded = false): TreeRow {
  return { type: "entry", path, name: path.slice(path.lastIndexOf("/") + 1), kind, depth, expanded };
}

const ROWS: TreeRow[] = [
  entry("assets", 0, "directory", true),
  entry("assets/share.jpg", 1),
  entry("docs", 0, "directory"),
  entry("README.md", 0),
];

function props(overrides: Partial<TreeBodyProps> = {}): TreeBodyProps {
  return {
    rows: ROWS,
    selectedPath: undefined,
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

describe("tree restore", () => {
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

  async function show(next: TreeBodyProps): Promise<void> {
    await act(async () => {
      root.render(createElement(TreeBody, next));
    });
  }

  function scroller(): HTMLElement {
    const found = host.querySelector<HTMLElement>('[data-testid="fs-tree-scroll"]');
    if (found === null) throw new Error("tree scroller missing");
    return found;
  }

  function cursorPath(): string | undefined {
    return host.querySelector('[data-cursor="true"]')?.getAttribute("data-path") ?? undefined;
  }

  it("lands the cursor on the remembered row", async () => {
    await show(props({ initialCursorPath: "docs" }));
    expect(cursorPath()).toBe("docs");
  });

  it("restores the scroll offset", async () => {
    await show(props({ initialScrollTop: 240 }));
    expect(scroller().scrollTop).toBe(240);
  });

  it("reports scroll changes", async () => {
    const seen: number[] = [];
    await show(props({ onScrollTopChange: top => seen.push(top) }));
    const element = scroller();
    element.scrollTop = 180;
    await act(async () => {
      element.dispatchEvent(new Event("scroll", { bubbles: false }));
    });
    expect(seen.at(-1)).toBe(180);
  });

  it("lets an explicit arrival outrank the remembered cursor", async () => {
    await show(props({ initialCursorPath: "docs", entryFocus: { path: "README.md" } }));
    expect(cursorPath()).toBe("README.md");
  });
});
