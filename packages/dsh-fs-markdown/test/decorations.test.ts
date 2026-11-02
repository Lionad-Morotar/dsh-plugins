/**
 * The decoration planner: one case per rule the editor layer depends on.
 *
 * The planner is the only place where "what a reader should see" is decided, so
 * it is asserted in Node against offsets instead of through a mounted editor.
 * Every case also runs the range contract (bounds, sorting, no overlap, no
 * duplicates), because a broken plan produces CodeMirror exceptions rather than
 * a merely ugly document.
 */
import { describe, expect, it } from "vitest";

import { planDecorations, type PlanRange } from "../src/client/decorations.ts";

function plan(text: string, active: { from: number; to: number } | null = null): readonly PlanRange[] {
  return planDecorations(text, active);
}

function hides(text: string, active: { from: number; to: number } | null = null): PlanRange[] {
  return plan(text, active).filter(range => range.kind === "hide");
}

function styles(text: string, active: { from: number; to: number } | null = null): PlanRange[] {
  return plan(text, active).filter(range => range.kind === "style");
}

function expectContract(text: string, ranges: readonly PlanRange[]): void {
  let previousTo = 0;
  const seen = new Set<string>();
  for (const range of ranges) {
    expect(Number.isInteger(range.from)).toBe(true);
    expect(Number.isInteger(range.to)).toBe(true);
    expect(range.from).toBeGreaterThanOrEqual(0);
    expect(range.to).toBeGreaterThan(range.from);
    expect(range.to).toBeLessThanOrEqual(text.length);
    expect(range.from).toBeGreaterThanOrEqual(previousTo);
    previousTo = range.to;

    const key = `${String(range.from)}:${String(range.to)}:${range.kind}:${range.style ?? ""}`;
    expect(seen.has(key)).toBe(false);
    seen.add(key);
  }
}

describe("planDecorations", () => {
  it("splits blocks on blank lines and activates the whole intersecting block", () => {
    const text = "a **b**\nc **d**\n\ne **f**\n";
    const result = plan(text, { from: 0, to: 0 });

    expectContract(text, result);
    // The cursor is in the first block, so both of its lines keep their markers;
    // only the block after the blank line still hides its markers.
    expect(hides(text, { from: 0, to: 0 }).map(range => range.from)).toEqual([19, 22]);
    expect(result.some(range => range.style === "strong" && range.from <= 4)).toBe(true);
  });

  it("treats a fenced block as one block even when it contains blank lines", () => {
    const text = "```ts\nconst a = 1;\n\n**inside**\n```\n\n**outside**\n";
    const result = plan(text, { from: 7, to: 7 });

    expectContract(text, result);
    // Cursor inside the fence: neither fence line is hidden and the interior
    // stays raw, but it is still marked as code.
    const fenceEnd = text.indexOf("```", 3) + 3;
    expect(hides(text, { from: 7, to: 7 }).filter(range => range.from < fenceEnd)).toEqual([]);
    expect(styles(text, { from: 7, to: 7 }).some(range => range.style === "code-block")).toBe(true);
    expect(styles(text, { from: 7, to: 7 }).some(range => range.style === "strong" && range.from < fenceEnd)).toBe(false);
    // The paragraph after the fence is a different block, so its markers hide.
    expect(hides(text, { from: 7, to: 7 }).some(range => range.from > 30)).toBe(true);
  });

  it("styles headings 1 through 6 and hides the marker together with its spaces", () => {
    for (let level = 1; level <= 6; level += 1) {
      const text = `${"#".repeat(level)} title\n`;
      const ranges = styles(text);
      expectContract(text, ranges);
      expect(ranges).toEqual([
        { from: level + 1, to: text.length - 1, kind: "style", style: `heading${String(level)}` },
      ]);
      expect(hides(text)).toEqual([{ from: 0, to: level + 1, kind: "hide" }]);
    }
  });

  it("keeps the whole heading line styled when the block is active", () => {
    const text = "## title\n";
    const ranges = plan(text, { from: 3, to: 3 });

    expectContract(text, ranges);
    expect(hides(text, { from: 3, to: 3 })).toEqual([]);
    expect(ranges).toEqual([{ from: 0, to: text.length - 1, kind: "style", style: "heading2" }]);
  });

  it("hides both bold marker pairs and styles the inside", () => {
    const star = "**bold**\n";
    const starRanges = plan(star);
    expectContract(star, starRanges);
    expect(starRanges).toEqual([
      { from: 0, to: 2, kind: "hide" },
      { from: 2, to: 6, kind: "style", style: "strong" },
      { from: 6, to: 8, kind: "hide" },
    ]);

    const underscore = "__bold__\n";
    expect(plan(underscore)).toEqual([
      { from: 0, to: 2, kind: "hide" },
      { from: 2, to: 6, kind: "style", style: "strong" },
      { from: 6, to: 8, kind: "hide" },
    ]);
  });

  it("hides italic markers and never reads the inside of bold as italic", () => {
    const text = "*em* and _em_ and **strong**\n";
    const result = plan(text);

    expectContract(text, result);
    expect(result.filter(range => range.style === "em").map(range => [range.from, range.to])).toEqual([
      [1, 3],
      [10, 12],
    ]);
    expect(result.filter(range => range.style === "strong").map(range => [range.from, range.to])).toEqual([[20, 26]]);
    // Four emphasis runs, eight markers: no marker may be hidden twice.
    expect(result.filter(range => range.kind === "hide")).toHaveLength(6);
  });

  it("hides inline-code backticks and styles the inside", () => {
    const text = "run `npm test` now\n";
    const result = plan(text);

    expectContract(text, result);
    expect(result).toEqual([
      { from: 4, to: 5, kind: "hide" },
      { from: 5, to: 13, kind: "style", style: "code" },
      { from: 13, to: 14, kind: "hide" },
    ]);
  });

  it("hides a link's brackets and target while styling its label", () => {
    const text = "see [docs](https://example.com) now\n";
    const result = plan(text);

    expectContract(text, result);
    expect(result).toEqual([
      { from: 4, to: 5, kind: "hide" },
      { from: 5, to: 9, kind: "style", style: "link" },
      { from: 9, to: 31, kind: "hide" },
    ]);
  });

  it("hides a quote marker when inactive and styles the line as a quote", () => {
    const text = "> quoted **text**\n";
    const inactive = plan(text);
    expectContract(text, inactive);
    expect(inactive).toEqual([
      { from: 0, to: 2, kind: "hide" },
      { from: 2, to: 17, kind: "style", style: "quote" },
    ]);

    const active = plan(text, { from: 5, to: 5 });
    expect(active).toEqual([{ from: 0, to: 17, kind: "style", style: "quote" }]);
  });

  it("styles list markers without hiding them", () => {
    const text = "- item\n  1. nested\n";
    const result = plan(text);

    expectContract(text, result);
    expect(result.filter(range => range.style === "list-marker")).toEqual([
      { from: 0, to: 1, kind: "style", style: "list-marker" },
      { from: 9, to: 11, kind: "style", style: "list-marker" },
    ]);
    expect(result.filter(range => range.kind === "hide")).toEqual([]);
  });

  it("hides both fence lines when inactive and marks the interior as a code block", () => {
    const text = "```ts\nconst a = 1;\n```\n";
    const result = plan(text);

    expectContract(text, result);
    expect(result).toEqual([
      { from: 0, to: 5, kind: "hide" },
      { from: 6, to: 18, kind: "style", style: "code-block" },
      { from: 19, to: 22, kind: "hide" },
    ]);
  });

  it("produces no ranges at all inside the frontmatter", () => {
    const text = "---\ntitle: **not bold**\n---\n# heading\n";
    const result = plan(text);

    expectContract(text, result);
    const frontmatterEnd = text.indexOf("# heading");
    expect(result.every(range => range.from >= frontmatterEnd)).toBe(true);
    expect(result.some(range => range.style === "heading1")).toBe(true);
  });

  it("only marks table lines as monospace and never hides cell text", () => {
    const text = "| a | **b** |\n| --- | --- |\n| 1 | 2 |\n";
    const result = plan(text);

    expectContract(text, result);
    expect(result.filter(range => range.kind === "hide")).toEqual([]);
    expect(result).toEqual([
      { from: 0, to: 13, kind: "style", style: "code-block" },
      { from: 14, to: 27, kind: "style", style: "code-block" },
      { from: 28, to: 37, kind: "style", style: "code-block" },
    ]);
  });

  it("emits nothing for markers that never close", () => {
    const cases = ["**open\n", "*open\n", "`open\n", "[label](\n", "__open\n", "_open\n"];
    for (const text of cases) {
      const result = plan(text);
      expectContract(text, result);
      expect(result).toEqual([]);
    }
  });

  it("keeps every range inside the document and free of overlaps on a mixed document", () => {
    const text = [
      "---",
      "title: t",
      "---",
      "# Title **bold**",
      "",
      "> quote [link](https://a.b)",
      "",
      "- item with `code` and *em*",
      "",
      "```ts",
      "const x = __1__;",
      "```",
      "",
      "| a | b |",
      "| --- | --- |",
    ].join("\n");
    const result = plan(text, { from: 40, to: 44 });

    expectContract(text, result);
    expect(result.length).toBeGreaterThan(0);
  });
});
