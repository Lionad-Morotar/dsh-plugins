/**
 * The keyboard model for the left column, tested without a DOM.
 *
 * Every rule the board promises a keyboard user lives here rather than in the
 * view's handler: the flat order a selection walks, what each key does to the
 * selection and to the expanded set, and what happens at either end of the list.
 * Keeping it pure is what lets the awkward cases (no selection yet, a selection
 * whose file was filtered away, a case whose file got collapsed) be pinned
 * instead of discovered by pressing keys in the real tab.
 */
import { describe, expect, it } from "vitest";

import type { TestCase, TestFileRow } from "../src/client/model.ts";
import {
  applyNavIntent,
  flattenNav,
  navKeyIntent,
  normalizeSelection,
  pageStep,
  type NavSelection,
} from "../src/client/nav.ts";

/**
 * Build one file row the way the read model would.
 * @param path - repo-relative test file path.
 * @param statuses - one status per case, in order.
 * @returns the row.
 */
function row(path: string, statuses: readonly ("passed" | "failed" | "skipped")[]): TestFileRow {
  const cases: TestCase[] = statuses.map((status, index) => ({
    path,
    name: `${path}#${String(index)}`,
    line: index + 1,
    status,
    durationMs: 1 + index,
  }));
  const failed = statuses.filter(status => status === "failed").length;
  const skipped = statuses.filter(status => status === "skipped").length;
  return {
    packageName: path.split("/")[1] ?? "",
    path,
    cases,
    passed: statuses.length - failed - skipped,
    failed,
    skipped,
    durationMs: cases.reduce((sum, entry) => sum + entry.durationMs, 0),
    hasFailed: failed > 0,
  };
}

const ROWS: readonly TestFileRow[] = [
  row("packages/a/test/one.test.ts", ["passed", "failed"]),
  row("packages/b/test/two.test.ts", ["passed"]),
  row("packages/c/test/three.test.ts", ["passed", "passed", "skipped"]),
];

const NO_EXPANDED: ReadonlySet<string> = new Set();

/** The flat order with the first file open: file, its two cases, then the rest. */
const ONE_OPEN: ReadonlySet<string> = new Set([ROWS[0]?.path ?? ""]);

describe("flattenNav", () => {
  it("lists files only while nothing is expanded", () => {
    expect(flattenNav(ROWS, NO_EXPANDED)).toEqual([
      { kind: "file", path: "packages/a/test/one.test.ts" },
      { kind: "file", path: "packages/b/test/two.test.ts" },
      { kind: "file", path: "packages/c/test/three.test.ts" },
    ]);
  });

  it("puts an open file's cases directly under it, in their recorded order", () => {
    expect(flattenNav(ROWS, ONE_OPEN)).toEqual([
      { kind: "file", path: "packages/a/test/one.test.ts" },
      { kind: "case", path: "packages/a/test/one.test.ts", index: 0 },
      { kind: "case", path: "packages/a/test/one.test.ts", index: 1 },
      { kind: "file", path: "packages/b/test/two.test.ts" },
      { kind: "file", path: "packages/c/test/three.test.ts" },
    ]);
  });

  it("is empty for a board with no rows", () => {
    expect(flattenNav([], ONE_OPEN)).toEqual([]);
  });
});

describe("normalizeSelection", () => {
  it("keeps a selection that is still on screen", () => {
    const selection: NavSelection = { kind: "file", path: "packages/b/test/two.test.ts" };
    expect(normalizeSelection(selection, ROWS, NO_EXPANDED)).toEqual(selection);
  });

  it("drops a selection whose file a filter removed", () => {
    const selection: NavSelection = { kind: "file", path: "packages/gone/test/x.test.ts" };
    expect(normalizeSelection(selection, ROWS, NO_EXPANDED)).toBeUndefined();
  });

  it("demotes a case selection to its file once that file is collapsed", () => {
    // A case row is not on screen when its file is shut, so keeping the case
    // selected would leave the right pane describing a row the reader cannot see.
    const selection: NavSelection = { kind: "case", path: "packages/a/test/one.test.ts", index: 1 };
    expect(normalizeSelection(selection, ROWS, NO_EXPANDED)).toEqual({ kind: "file", path: "packages/a/test/one.test.ts" });
    expect(normalizeSelection(selection, ROWS, ONE_OPEN)).toEqual(selection);
  });

  it("demotes a case index the file no longer has", () => {
    const selection: NavSelection = { kind: "case", path: "packages/b/test/two.test.ts", index: 9 };
    expect(normalizeSelection(selection, ROWS, new Set([ROWS[1]?.path ?? ""]))).toEqual({
      kind: "file",
      path: "packages/b/test/two.test.ts",
    });
  });

  it("passes an absent selection through", () => {
    expect(normalizeSelection(undefined, ROWS, NO_EXPANDED)).toBeUndefined();
  });
});

describe("navKeyIntent", () => {
  it("maps the navigation keys", () => {
    expect(navKeyIntent("ArrowDown", false)).toBe("down");
    expect(navKeyIntent("ArrowUp", false)).toBe("up");
    expect(navKeyIntent("ArrowRight", false)).toBe("expand");
    expect(navKeyIntent("ArrowLeft", false)).toBe("collapse");
    expect(navKeyIntent("Enter", false)).toBe("activate");
    expect(navKeyIntent(" ", false)).toBe("activate");
    expect(navKeyIntent("Escape", false)).toBe("back");
    expect(navKeyIntent("Home", false)).toBe("first");
    expect(navKeyIntent("End", false)).toBe("last");
  });

  it("leaves modified chords and typing keys alone", () => {
    expect(navKeyIntent("ArrowDown", true)).toBeNull();
    expect(navKeyIntent("Enter", true)).toBeNull();
    expect(navKeyIntent("a", false)).toBeNull();
    expect(navKeyIntent("Tab", false)).toBeNull();
  });
});

describe("applyNavIntent", () => {
  const state = (selection: NavSelection | undefined, expanded: ReadonlySet<string> = NO_EXPANDED) => ({
    selection,
    expanded,
  });

  it("selects the first row on the first ArrowDown when nothing is selected", () => {
    const result = applyNavIntent("down", state(undefined), ROWS);
    expect(result.selection).toEqual({ kind: "file", path: "packages/a/test/one.test.ts" });
  });

  it("selects the last row on the first ArrowUp when nothing is selected", () => {
    const result = applyNavIntent("up", state(undefined), ROWS);
    expect(result.selection).toEqual({ kind: "file", path: "packages/c/test/three.test.ts" });
  });

  it("walks the flat order including open files' cases", () => {
    let current = applyNavIntent("down", state(undefined, ONE_OPEN), ROWS);
    expect(current.selection).toEqual({ kind: "file", path: "packages/a/test/one.test.ts" });

    current = applyNavIntent("down", current, ROWS);
    expect(current.selection).toEqual({ kind: "case", path: "packages/a/test/one.test.ts", index: 0 });

    current = applyNavIntent("down", current, ROWS);
    expect(current.selection).toEqual({ kind: "case", path: "packages/a/test/one.test.ts", index: 1 });

    current = applyNavIntent("down", current, ROWS);
    expect(current.selection).toEqual({ kind: "file", path: "packages/b/test/two.test.ts" });

    current = applyNavIntent("up", current, ROWS);
    expect(current.selection).toEqual({ kind: "case", path: "packages/a/test/one.test.ts", index: 1 });
  });

  it("stops at both ends instead of wrapping", () => {
    const first = applyNavIntent("first", state(undefined, ONE_OPEN), ROWS);
    expect(first.selection).toEqual({ kind: "file", path: "packages/a/test/one.test.ts" });
    expect(applyNavIntent("up", first, ROWS).selection).toEqual(first.selection);

    const last = applyNavIntent("last", state(undefined, ONE_OPEN), ROWS);
    expect(last.selection).toEqual({ kind: "file", path: "packages/c/test/three.test.ts" });
    expect(applyNavIntent("down", last, ROWS).selection).toEqual(last.selection);
  });

  it("jumps to the first and last rows with Home and End", () => {
    const middle = state({ kind: "file", path: "packages/b/test/two.test.ts" });
    expect(applyNavIntent("first", middle, ROWS).selection).toEqual({ kind: "file", path: "packages/a/test/one.test.ts" });
    expect(applyNavIntent("last", middle, ROWS).selection).toEqual({ kind: "file", path: "packages/c/test/three.test.ts" });
  });

  it("opens the selected file on ArrowRight without moving the selection", () => {
    const selection: NavSelection = { kind: "file", path: "packages/b/test/two.test.ts" };
    const result = applyNavIntent("expand", state(selection), ROWS);
    expect(result.expanded.has("packages/b/test/two.test.ts")).toBe(true);
    expect(result.selection).toEqual(selection);
  });

  it("does nothing on ArrowRight over a case", () => {
    const selection: NavSelection = { kind: "case", path: "packages/a/test/one.test.ts", index: 0 };
    const result = applyNavIntent("expand", state(selection, ONE_OPEN), ROWS);
    expect(result.expanded).toEqual(ONE_OPEN);
    expect(result.selection).toEqual(selection);
  });

  it("steps from a case back to its file on ArrowLeft", () => {
    const selection: NavSelection = { kind: "case", path: "packages/a/test/one.test.ts", index: 1 };
    const result = applyNavIntent("collapse", state(selection, ONE_OPEN), ROWS);
    expect(result.selection).toEqual({ kind: "file", path: "packages/a/test/one.test.ts" });
    // The file stays open: the first ArrowLeft moves the selection, the second
    // closes the row. Closing both in one press would hide the row just chosen.
    expect(result.expanded.has("packages/a/test/one.test.ts")).toBe(true);
  });

  it("closes an open file on ArrowLeft when the file itself is selected", () => {
    const selection: NavSelection = { kind: "file", path: "packages/a/test/one.test.ts" };
    const result = applyNavIntent("collapse", state(selection, ONE_OPEN), ROWS);
    expect(result.expanded.has("packages/a/test/one.test.ts")).toBe(false);
    expect(result.selection).toEqual(selection);
  });

  it("leaves a closed, selected file alone on ArrowLeft", () => {
    const selection: NavSelection = { kind: "file", path: "packages/b/test/two.test.ts" };
    const result = applyNavIntent("collapse", state(selection), ROWS);
    expect(result.expanded).toEqual(NO_EXPANDED);
    expect(result.selection).toEqual(selection);
  });

  it("toggles the selected file on Enter and Space", () => {
    const selection: NavSelection = { kind: "file", path: "packages/b/test/two.test.ts" };
    const opened = applyNavIntent("activate", state(selection), ROWS);
    expect(opened.expanded.has("packages/b/test/two.test.ts")).toBe(true);
    const closed = applyNavIntent("activate", opened, ROWS);
    expect(closed.expanded.has("packages/b/test/two.test.ts")).toBe(false);
  });

  it("keeps Enter on a case idempotent, since selecting it already shows its detail", () => {
    const selection: NavSelection = { kind: "case", path: "packages/a/test/one.test.ts", index: 0 };
    const result = applyNavIntent("activate", state(selection, ONE_OPEN), ROWS);
    expect(result.selection).toEqual(selection);
    expect(result.expanded).toEqual(ONE_OPEN);
  });

  it("steps from a case back to its file on Escape", () => {
    const selection: NavSelection = { kind: "case", path: "packages/a/test/one.test.ts", index: 1 };
    const result = applyNavIntent("back", state(selection, ONE_OPEN), ROWS);
    expect(result.selection).toEqual({ kind: "file", path: "packages/a/test/one.test.ts" });
    expect(result.expanded).toEqual(ONE_OPEN);
  });

  it("clears the selection on Escape from a file, leaving the file open", () => {
    const selection: NavSelection = { kind: "file", path: "packages/a/test/one.test.ts" };
    const result = applyNavIntent("back", state(selection, ONE_OPEN), ROWS);
    expect(result.selection).toBeUndefined();
    expect(result.expanded).toEqual(ONE_OPEN);
  });

  it("reports the row to reveal after a move, and nothing when the board is empty", () => {
    const moved = applyNavIntent("down", state(undefined), ROWS);
    expect(moved.reveal).toEqual({ kind: "file", path: "packages/a/test/one.test.ts" });

    const empty = applyNavIntent("down", state(undefined), []);
    expect(empty.selection).toBeUndefined();
    expect(empty.reveal).toBeUndefined();
  });
});

/**
 * The half-screen step.
 *
 * PageUp/PageDown move the selection by what a reader can actually see, which is
 * a layout question the pure model cannot answer on its own: it takes the two
 * measurements the DOM reports and turns them into a row count. Pinning it here
 * keeps the view's handler from growing its own arithmetic, and keeps the
 * degenerate cases (no layout, one row) out of the browser.
 */
describe("pageStep", () => {
  it("moves by half the visible rows", () => {
    // 400px viewport over 20px rows is 20 rows on screen, so half is 10.
    expect(pageStep(400, 2000, 100)).toBe(10);
  });

  it("rounds down so a half row never overshoots the fold", () => {
    // 21 visible rows halve to 10.5; landing on 10 keeps the target on screen.
    expect(pageStep(420, 2000, 100)).toBe(10);
  });

  it("never moves less than one row", () => {
    // A viewport shorter than two rows still has to advance, or the key is dead.
    expect(pageStep(20, 2000, 100)).toBe(1);
  });

  it("never moves the whole list, which is what Home and End are for", () => {
    // A viewport taller than the content would otherwise step past the end.
    expect(pageStep(4000, 2000, 10)).toBe(9);
  });

  it("falls back to one row when the layout reports nothing", () => {
    // jsdom reports zeroes for every box; a zero step would swallow the key.
    expect(pageStep(0, 0, 100)).toBe(1);
    expect(pageStep(0, 2000, 100)).toBe(1);
    expect(pageStep(400, 0, 100)).toBe(1);
  });

  it("falls back to one row for a list with no rows", () => {
    expect(pageStep(400, 2000, 0)).toBe(1);
  });

  it("falls back to one row for a single row", () => {
    // max(1, rowCount - 1) is 1 here, so a one-row list still reports a step
    // rather than a zero the caller would have to special-case.
    expect(pageStep(400, 20, 1)).toBe(1);
  });
});
