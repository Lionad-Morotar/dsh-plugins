// @vitest-environment jsdom
/**
 * The tree's virtual geometry follows the host's text size.
 *
 * The mounted rows are absolutely positioned from a row height computed in
 * TypeScript while the CSS sizes the same rows from a variable; these tests pin
 * the TypeScript half and its live update, so a font-size shortcut can never
 * leave the window and the stylesheet disagreeing.
 */
import { act, createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { attachFontScale } from "../src/client/font-scale.ts";
import type { TreeRow } from "../src/client/model.ts";
import { TreeBody, type TreeBodyProps } from "../src/client/tree.tsx";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

/** One flattened entry row. */
function entry(path: string, depth: number): TreeRow {
  return { type: "entry", path, name: path, kind: "file", depth, expanded: false };
}

/** The props a mount needs; every gesture is a no-op here. */
function props(rows: TreeRow[]): TreeBodyProps {
  return {
    rows,
    selectedPath: undefined,
    entryFocus: undefined,
    t: key => key,
    onToggle: () => undefined,
    onSelect: () => undefined,
    onRetry: () => undefined,
    onEntryFocusSettled: undefined,
    onContextMenu: () => undefined,
  };
}

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

/** Top offset of one mounted tree row, read from its inline style. */
function rowTops(host: HTMLElement): number[] {
  return [...host.querySelectorAll<HTMLElement>('[role="treeitem"]')].map(element =>
    Number.parseInt(element.style.top, 10),
  );
}

describe("tree geometry at the host's text size", () => {
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
    await act(async () => root.render(createElement(TreeBody, props([entry("a", 0), entry("b", 0), entry("c", 0)]))));
    expect(rowTops(host)).toEqual([0, 22, 44]);
    expect(host.querySelector<HTMLElement>(".fx-vlist")?.style.height).toBe("66px");
  });

  it("publishes the integer row height the window uses onto the container", async () => {
    await act(async () => root.render(createElement(TreeBody, props([entry("a", 0), entry("b", 0)]))));
    const scroller = host.querySelector<HTMLElement>('[data-testid="fs-tree-scroll"]');
    if (scroller === null) throw new Error("tree scroller missing");
    expect(scroller.style.getPropertyValue("--fx-row-h")).toBe("22px");

    const theme = fakeTheme(14);
    await act(async () => {
      attachFontScale(fakeContext(theme));
    });
    // The stylesheet's ratio form is only the fallback: the mounted tree sizes
    // every row from this integer, so positioning and box height cannot drift.
    for (const [text, expected] of [[16, 25], [18, 28], [22, 35], [14, 22]] as const) {
      await act(async () => theme.setText(text));
      expect(scroller.style.getPropertyValue("--fx-row-h")).toBe(`${String(expected)}px`);
      expect(rowTops(host)).toEqual([0, expected]);
      expect(host.querySelector<HTMLElement>(".fx-vlist")?.style.height).toBe(`${String(expected * 2)}px`);
    }
  });

  it("rescales the mounted window when the host changes size", async () => {
    await act(async () => root.render(createElement(TreeBody, props([entry("a", 0), entry("b", 0), entry("c", 0)]))));
    const theme = fakeTheme(14);
    await act(async () => {
      attachFontScale(fakeContext(theme));
    });
    // 22 * 18 / 14 = 28.28, rounded to 28: the offsets, the total height and the
    // CSS variable all move together.
    await act(async () => theme.setText(18));
    expect(rowTops(host)).toEqual([0, 28, 56]);
    expect(host.querySelector<HTMLElement>(".fx-vlist")?.style.height).toBe("84px");
  });
});
