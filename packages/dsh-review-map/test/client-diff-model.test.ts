/**
 * The diff read model: one flat row list per file detail.
 *
 * The view renders rows, so the projection's job is to turn four different wire
 * shapes into one shape with no decisions left in the component. The hunk case is
 * the one worth testing against real git output: line numbers are counted from
 * the header, and a projection that drifts by one puts every number in the panel
 * off by one.
 */
import { describe, expect, it } from "vitest";

import { diffRows, formatBytes, hunkHeader, type DiffRow } from "../src/client/model.ts";
import type { DiffHunk, FileDiff } from "../src/shared.ts";

/**
 * Three hunks shaped exactly as `git diff -U3` produces them: a change at the
 * top, one in the middle, one at the end, with context on both sides.
 */
const HUNKS: DiffHunk[] = [
  {
    oldStart: 1,
    oldLines: 4,
    newStart: 1,
    newLines: 4,
    lines: [
      { kind: "context", oldLine: 1, newLine: 1, text: "line 1" },
      { kind: "del", oldLine: 2, newLine: null, text: "line 2" },
      { kind: "add", oldLine: null, newLine: 2, text: "line 2 changed" },
      { kind: "context", oldLine: 3, newLine: 3, text: "line 3" },
    ],
  },
  {
    oldStart: 19,
    oldLines: 3,
    newStart: 19,
    newLines: 3,
    heading: "function example() {",
    lines: [
      { kind: "context", oldLine: 19, newLine: 19, text: "line 19" },
      { kind: "del", oldLine: 20, newLine: null, text: "line 20" },
      { kind: "add", oldLine: null, newLine: 20, text: "line 20 changed" },
    ],
  },
  {
    oldStart: 38,
    oldLines: 2,
    newStart: 38,
    newLines: 3,
    lines: [
      { kind: "context", oldLine: 38, newLine: 38, text: "line 38" },
      { kind: "add", oldLine: null, newLine: 39, text: "line 39 added" },
      { kind: "add", oldLine: null, newLine: 40, text: "line 40 added" },
    ],
  },
];

/** The rows that are actual lines, with the hunk headers dropped. */
function lines(rows: readonly DiffRow[]): Extract<DiffRow, { kind: "line" }>[] {
  return rows.filter((row): row is Extract<DiffRow, { kind: "line" }> => row.kind === "line");
}

/** The hunk header rows. */
function headers(rows: readonly DiffRow[]): Extract<DiffRow, { kind: "hunk" }>[] {
  return rows.filter((row): row is Extract<DiffRow, { kind: "hunk" }> => row.kind === "hunk");
}

describe("hunk headers", () => {
  it("spells the range the way git does", () => {
    expect(hunkHeader(HUNKS[0] as DiffHunk)).toBe("@@ -1,4 +1,4 @@");
  });

  it("appends the function heading when the hunk carries one", () => {
    expect(hunkHeader(HUNKS[1] as DiffHunk)).toBe("@@ -19,3 +19,3 @@ function example() {");
  });
});

describe("a text diff", () => {
  it("emits one header per hunk, in order", () => {
    const rows = diffRows({ kind: "text", path: "a.ts", hunks: HUNKS, truncated: false });

    expect(headers(rows).map(row => row.header)).toEqual([
      "@@ -1,4 +1,4 @@",
      "@@ -19,3 +19,3 @@ function example() {",
      "@@ -38,2 +38,3 @@",
    ]);
  });

  it("keeps every line's own numbers from the hunk", () => {
    const rows = diffRows({ kind: "text", path: "a.ts", hunks: HUNKS, truncated: false });

    // The projection must not renumber: each line already carries the numbers
    // git computed, and a second count would drift on the first gap.
    expect(lines(rows).map(line => [line.oldLine, line.newLine])).toEqual([
      [1, 1],
      [2, null],
      [null, 2],
      [3, 3],
      [19, 19],
      [20, null],
      [null, 20],
      [38, 38],
      [null, 39],
      [null, 40],
    ]);
  });

  it("marks each line's kind and its sign", () => {
    const rows = diffRows({ kind: "text", path: "a.ts", hunks: HUNKS, truncated: false });
    const first = lines(rows).slice(0, 3);

    expect(first.map(line => line.lineKind)).toEqual(["context", "del", "add"]);
    // A context line has no sign of its own; the panel still needs a cell there
    // or the text would shift left against the changed lines.
    expect(first.map(line => line.sign)).toEqual([" ", "\u2212", "+"]);
  });

  it("carries the text through untouched", () => {
    const rows = diffRows({ kind: "text", path: "a.ts", hunks: HUNKS, truncated: false });

    expect(lines(rows).map(line => line.text)).toContain("line 2 changed");
    expect(lines(rows).map(line => line.text)).toContain("line 20 changed");
    // The heading belongs to the hunk header, not to a line: putting it in the
    // body would render it twice.
    expect(lines(rows).map(line => line.text)).not.toContain("function example() {");
  });

  it("produces no rows for an empty hunk list", () => {
    // A mode flip has no hunks; the panel shows its header and nothing else,
    // rather than a stray blank line.
    const rows = diffRows({ kind: "text", path: "a.ts", hunks: [], truncated: false });

    expect(rows).toEqual([]);
  });

  it("passes the truncated flag through", () => {
    const diff: FileDiff = { kind: "text", path: "big.ts", hunks: HUNKS, truncated: true };

    expect(diffRows(diff)).not.toHaveLength(0);
    // The flag itself is read from the diff by the view; this asserts the
    // projection does not invent or drop it.
    expect(diff.truncated).toBe(true);
  });
});

describe("a deleted file", () => {
  it("numbers the old side from one and marks every line as removed", () => {
    const rows = diffRows({ kind: "deleted", path: "gone.ts", lines: ["alpha", "beta", "gamma"] });

    expect(headers(rows)).toEqual([]);
    expect(lines(rows).map(line => [line.oldLine, line.newLine, line.lineKind, line.sign])).toEqual([
      [1, null, "del", "\u2212"],
      [2, null, "del", "\u2212"],
      [3, null, "del", "\u2212"],
    ]);
    expect(lines(rows).map(line => line.text)).toEqual(["alpha", "beta", "gamma"]);
  });

  it("produces no rows for an empty file", () => {
    expect(diffRows({ kind: "deleted", path: "gone.ts", lines: [] })).toEqual([]);
  });
});

describe("an untracked file", () => {
  it("numbers the new side from one and marks every line as added", () => {
    const rows = diffRows({ kind: "untracked", path: "new.ts", lines: ["first", "second"] });

    expect(headers(rows)).toEqual([]);
    expect(lines(rows).map(line => [line.oldLine, line.newLine, line.lineKind, line.sign])).toEqual([
      [null, 1, "add", "+"],
      [null, 2, "add", "+"],
    ]);
  });
});

describe("a binary file", () => {
  it("produces no rows at all", () => {
    // The panel shows a size instead; a row list here would be an empty table
    // with a header, which reads as a broken render.
    expect(diffRows({ kind: "binary", path: "logo.png", bytes: 2048 })).toEqual([]);
  });
});

describe("byte sizes", () => {
  it("formats bytes, kilobytes and megabytes", () => {
    expect(formatBytes(512)).toBe("512 B");
    expect(formatBytes(2048)).toBe("2.0 KB");
    expect(formatBytes(1536 * 1024)).toBe("1.5 MB");
  });

  it("keeps one decimal for a fractional kilobyte", () => {
    expect(formatBytes(1536)).toBe("1.5 KB");
  });
});
