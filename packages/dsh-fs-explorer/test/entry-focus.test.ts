// @vitest-environment jsdom
/**
 * Arriving in the file view should leave the reader somewhere they can type:
 * a fresh visit opens the workspace front page and parks the keyboard cursor on
 * its row, a return visit only takes the keyboard. The decision is a pure
 * function so the three shapes can be asserted without a React renderer, and
 * the DOM half is exercised against a real document.
 */
import { describe, expect, it } from "vitest";

import { entryIntent, findRootReadme, revealScrollTop, type TreeRow } from "../src/client/model.ts";
import { focusTreeEntry } from "../src/client/tree.tsx";

/** One entry row as `flattenTree` would emit it. */
function entry(path: string, depth: number, kind: "file" | "directory" = "file"): TreeRow {
  const name = path.slice(path.lastIndexOf("/") + 1);
  return { type: "entry", path, name, kind, depth, expanded: false };
}

describe("entryIntent", () => {
  it("opens the root README and lands the cursor on its row when nothing was open", () => {
    const rows = [entry("src", 0, "directory"), entry("README.md", 0)];
    expect(findRootReadme(rows)?.path).toBe("README.md");
    expect(entryIntent({ rows, panelCount: 0, hasModal: false })).toEqual({
      kind: "tree",
      open: "README.md",
      focus: "README.md",
    });
    // The spelling a workspace happens to use is not the reader's problem.
    expect(findRootReadme([entry("readme.markdown", 0)])?.path).toBe("readme.markdown");
  });

  it("leaves the reader's panels alone on a return visit and only takes the keyboard", () => {
    const rows = [entry("src", 0, "directory"), entry("README.md", 0)];
    expect(entryIntent({ rows, panelCount: 1, hasModal: false })).toEqual({
      kind: "tree",
      open: undefined,
      focus: undefined,
    });
  });

  it("does not open a nested README to answer a question the reader did not ask", () => {
    const rows = [
      entry("packages", 0, "directory"),
      entry("packages/a/README.md", 1),
      entry("package.json", 0),
    ];
    expect(findRootReadme(rows)).toBeUndefined();
    expect(entryIntent({ rows, panelCount: 0, hasModal: false })).toEqual({
      kind: "tree",
      open: undefined,
      focus: undefined,
    });
  });

  it("keeps the claim unspent while a modal owns the caret or the tree has not listed", () => {
    const rows = [entry("README.md", 0)];
    expect(entryIntent({ rows, panelCount: 0, hasModal: true })).toEqual({ kind: "skip", reason: "modal" });
    expect(entryIntent({ rows: [], panelCount: 0, hasModal: false })).toEqual({ kind: "skip", reason: "no-rows" });
  });
});

describe("focusTreeEntry", () => {
  it("parks focus on the scroll container without stealing it from a click that landed first", () => {
    const scroller = document.createElement("div");
    scroller.className = "fx-scroll";
    scroller.tabIndex = 0;
    const row = document.createElement("button");
    row.className = "fx-row";
    scroller.append(row);
    document.body.append(scroller);

    // Nothing focused yet, and the container is where the key handler lives, so
    // that is what gets the caret rather than the row.
    expect(() => {
      focusTreeEntry(null);
    }).not.toThrow();
    focusTreeEntry(scroller);
    expect(document.activeElement).toBe(scroller);

    // A reader who already clicked into the tree keeps their own target.
    row.focus();
    focusTreeEntry(scroller);
    expect(document.activeElement).toBe(row);
    scroller.remove();
  });
});

describe("revealScrollTop", () => {
  const rowHeight = 22;

  it("scrolls only as far as the arrival row needs to become visible", () => {
    // Above the window: align its top edge.
    expect(revealScrollTop({ scrollTop: 220, viewport: 110, rowHeight, index: 3 })).toBe(66);
    // Below the window: bring its bottom edge in.
    expect(revealScrollTop({ scrollTop: 0, viewport: 110, rowHeight, index: 9 })).toBe(9 * 22 + 22 - 110);
    // Already visible: leave the scroll where the reader left it.
    expect(revealScrollTop({ scrollTop: 66, viewport: 110, rowHeight, index: 4 })).toBe(66);
  });
});
