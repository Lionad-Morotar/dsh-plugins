// @vitest-environment jsdom
/**
 * The history list's virtual geometry follows the host's text size.
 *
 * Rows are absolutely positioned from a row height computed in TypeScript while
 * the CSS sizes the same rows from a variable; the SVG graph paints at the same
 * height. These tests pin the TypeScript half and its live update, so a
 * font-size shortcut can never leave the window, the graph and the stylesheet
 * disagreeing.
 */
import { act, createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { attachFontScale } from "../src/client/font-scale.ts";
import { HistoryPane } from "../src/client/history-pane.tsx";
import type { GitCommitNode } from "../src/host/types.ts";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const t = (key: string): string => key;

/** A small commit page; the content does not matter, only the row count. */
function commits(count: number): GitCommitNode[] {
  return Array.from({ length: count }, (_, index) => ({
    hash: `hash${String(index).padStart(2, "0")}`,
    parents: [],
    author: "Alice",
    time: 1_700_000_000 - index,
    subject: `subject ${String(index)}`,
    refs: [],
  }));
}

/** The working tree the list draws as its synthetic first row. */
const WORKING_TREE = { groups: [], stats: new Map(), fileCount: 2 } as const;

/** A theme service whose snapshot can be changed from the test. */
function fakeTheme(text: number): {
  getTheme(): unknown;
  setText(px: number): void;
  readonly listeners: Set<() => void>;
} {
  const snapshot = { fontSizes: { text } };
  const listeners = new Set<() => void>();
  return {
    listeners,
    getTheme: () => snapshot,
    setText(px: number): void {
      snapshot.fontSizes.text = px;
      for (const listener of [...listeners]) listener();
    },
  };
}

/** A context that injects the theme service immediately. */
function fakeContext(theme: { getTheme(): unknown; listeners: Set<() => void> }): {
  inject(services: string[], callback: (scope: {
    get(name: string): unknown;
    on(event: string, listener: () => void): () => boolean;
  }) => void | (() => void)): unknown;
} {
  return {
    inject(services, callback) {
      expect(services).toEqual(["theme"]);
      const result = callback({
        get: (name: string) => (name === "theme" ? theme : undefined),
        on: (_event, listener) => {
          theme.listeners.add(listener);
          return () => theme.listeners.delete(listener);
        },
      });
      return { dispose: () => (typeof result === "function" ? result() : undefined) };
    },
  };
}

/** The rendered history list with a dirty working tree on top. */
function historyPane(): ReturnType<typeof createElement> {
  const list = commits(3);
  return createElement(HistoryPane, {
    commits: list,
    graph: list.map(() => ({ lane: 0, color: 0, merge: false, segments: [] })),
    selectedHash: undefined,
    headHash: list[0]?.hash ?? null,
    total: list.length,
    hasMore: false,
    loadingMore: false,
    loadError: undefined,
    searching: false,
    search: "",
    t,
    onSelect: () => undefined,
    onLoadMore: () => undefined,
    onSearch: () => undefined,
    workingTree: WORKING_TREE,
    onSelectUncommitted: () => undefined,
  });
}

/** Top offsets of the mounted rows, read from their inline styles. */
function rowTops(host: HTMLElement): number[] {
  return [...host.querySelectorAll<HTMLElement>(".gx-row")].map(element => Number.parseInt(element.style.top, 10));
}

describe("history geometry at the host's text size", () => {
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

  it("sizes rows from the design baseline by default", async () => {
    await act(async () => root.render(historyPane()));
    expect(rowTops(host)).toEqual([0, 24, 48, 72]);
    expect(host.querySelector<HTMLElement>(".gx-vlist")?.style.height).toBe("96px");
  });

  it("publishes the integer row height the window uses onto the pane", async () => {
    await act(async () => root.render(historyPane()));
    const pane = host.querySelector<HTMLElement>('[data-testid="git-history"]');
    if (pane === null) throw new Error("history pane missing");
    // The column header lives outside the scroller, so the variable has to be on
    // the pane root for both to share it.
    expect(host.querySelector('[data-testid="git-history-colhead"]') !== null).toBe(true);
    expect(pane.style.getPropertyValue("--gx-row-h")).toBe("24px");

    const theme = fakeTheme(14);
    await act(async () => {
      attachFontScale(fakeContext(theme));
    });
    // The stylesheet's ratio form is only the fallback: the mounted list sizes
    // every row from this integer, so positioning and box height cannot drift.
    for (const [text, expected] of [[16, 27], [18, 31], [22, 38], [14, 24]] as const) {
      await act(async () => theme.setText(text));
      expect(pane.style.getPropertyValue("--gx-row-h")).toBe(`${String(expected)}px`);
      expect(rowTops(host)).toEqual([0, expected, expected * 2, expected * 3]);
      expect(host.querySelector<HTMLElement>(".gx-vlist")?.style.height).toBe(`${String(expected * 4)}px`);
    }
  });

  it("rescales the list, the graph and the ring together when the host changes size", async () => {
    await act(async () => root.render(historyPane()));
    const theme = fakeTheme(14);
    await act(async () => {
      attachFontScale(fakeContext(theme));
    });
    // 24 * 18 / 14 = 30.86, rounded to 31: the offsets, the total height, the
    // SVG height and the ring's centre are all derived from that one number.
    await act(async () => theme.setText(18));
    expect(rowTops(host)).toEqual([0, 31, 62, 93]);
    expect(host.querySelector<HTMLElement>(".gx-vlist")?.style.height).toBe("124px");
    const ring = host.querySelector('[data-testid="git-uncommitted-node"]');
    expect(ring?.getAttribute("cy")).toBe("15.5");
    const graph = ring?.closest("svg");
    expect(graph?.getAttribute("height")).toBe("31");
  });
});
