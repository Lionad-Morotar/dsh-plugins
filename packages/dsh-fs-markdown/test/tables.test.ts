/**
 * The GFM table scanner: one case per rule the widget and planner depend on.
 *
 * The scanner decides which lines a widget replaces and where each cell starts,
 * so it is asserted against offsets in Node. Cases come from the GitHub
 * Flavored Markdown table extension, with the shapes this editor meets in real
 * files.
 */
import { describe, expect, it } from "vitest";

import { planTables, splitCells, tableIntersects, type TableBlock } from "../src/client/tables.ts";
import { splitLines } from "../src/client/lines.ts";

/** Cell contents as a reader would see them, for readable assertions. */
function cellTexts(text: string, table: TableBlock): string[][] {
  return [table.header, ...table.rows].map(row => row.cells.map(cell => text.slice(cell.from, cell.to)));
}

/** The first table of a document, failing the test when there is none. */
function only(text: string): TableBlock {
  const tables = planTables(text);
  expect(tables).toHaveLength(1);
  const table = tables[0];
  if (table === undefined) throw new Error("expected one table");
  return table;
}

describe("planTables", () => {
  it("reads a basic table with its header, alignment row and body", () => {
    const text = "| a | b |\n| --- | --- |\n| 1 | 2 |\n";
    const table = only(text);

    expect(table.from).toBe(0);
    expect(table.to).toBe(text.length - 1);
    expect([table.firstLine, table.lastLine]).toEqual([0, 2]);
    expect(table.alignments).toEqual(["none", "none"]);
    expect(cellTexts(text, table)).toEqual([
      ["a", "b"],
      ["1", "2"],
    ]);
  });

  it("accepts outer pipes in any combination", () => {
    const text = "a | b\n| --- | --- |\nc | d\n";
    const table = only(text);

    expect(cellTexts(text, table)).toEqual([
      ["a", "b"],
      ["c", "d"],
    ]);
  });

  it("keeps escaped pipes inside a cell and unescaped ones as boundaries", () => {
    const text = "| a \\| b | c |\n| --- | --- |\n| `x|y` | z |\n";
    const table = only(text);

    expect(cellTexts(text, table)[0]).toEqual(["a \\| b", "c"]);
    // GFM does not protect a pipe inside a code span, so that row splits into
    // three cells and the extra one is dropped when normalized to two columns.
    expect(cellTexts(text, table)[1]).toEqual(["`x", "y`"]);
  });

  it("trims spaces and tabs around every cell", () => {
    const text = "|\ta\t|\t b \t|\n| --- | --- |\n| 1 | 2 |\n";
    expect(cellTexts(text, only(text))[0]).toEqual(["a", "b"]);
  });

  it("reads the three alignment forms", () => {
    const text = "| a | b | c | d |\n| :--- | :---: | ---: | --- |\n";
    expect(only(text).alignments).toEqual(["left", "center", "right", "none"]);
  });

  it("requires the delimiter to carry a pipe and match the header width", () => {
    // No pipe: a setext heading, not a table.
    expect(planTables("a\n---\nb\n")).toEqual([]);
    // Header has two cells, delimiter one.
    expect(planTables("| a | b |\n| --- |\n| 1 | 2 |\n")).toEqual([]);
    // Spaces inside a delimiter cell are not valid.
    expect(planTables("| a |\n| : - : |\n")).toEqual([]);
    // A one-column table is still legal.
    expect(planTables("| a |\n| - |\n")).toHaveLength(1);
  });

  it("ends at the first blank line", () => {
    const text = "| a |\n| --- |\n| 1 |\n\nafter\n";
    const table = only(text);
    expect(table.lastLine).toBe(2);
    expect(table.to).toBe("| a |\n| --- |\n| 1 |".length);
  });

  it("ends at the next block-level structure", () => {
    const tail = ["# heading", "> quote", "- item", "1. item", "---", "```", "~~~", "    code", "<div>"];
    for (const line of tail) {
      const text = `| a |\n| --- |\n| 1 |\n${line}\n`;
      const tables = planTables(text);
      expect(tables, line).toHaveLength(1);
      expect(tables[0]?.lastLine, line).toBe(2);
    }
  });

  it("treats a body line without pipes as a row and pads it to the header width", () => {
    const text = "| a | b |\n| --- | --- |\nbar\n";
    expect(cellTexts(text, only(text))[1]).toEqual(["bar", ""]);
  });

  it("truncates a row that has more cells than the header", () => {
    const text = "| a | b |\n| --- | --- |\n| 1 | 2 | 3 |\n";
    expect(cellTexts(text, only(text))[1]).toEqual(["1", "2"]);
  });

  it("interrupts a paragraph when the header line follows it directly", () => {
    const text = "intro\n| a | b |\n| --- | --- |\n| 1 | 2 |\n";
    const table = only(text);
    expect(table.firstLine).toBe(1);
  });

  it("does not read a table inside a closed fence", () => {
    const text = "```md\n| a |\n| --- |\n| 1 |\n```\n";
    expect(planTables(text)).toEqual([]);
  });

  it("does not read a table inside the leading frontmatter", () => {
    const text = "---\n| a |\n| --- |\n| 1 |\n---\n";
    expect(planTables(text)).toEqual([]);
  });

  it("keeps offsets stable for CRLF input and for a table at end of file", () => {
    const text = "| a |\r\n| --- |\r\n| 1 |";
    const table = only(text);
    expect(text.slice(table.from, table.to)).toBe("| a |\r\n| --- |\r\n| 1 |");
    expect(cellTexts(text, table)).toEqual([
      ["a"],
      ["1"],
    ]);
  });

  it("finds several tables in document order", () => {
    const text = "| a |\n| --- |\n| 1 |\n\npara\n\n| b |\n| --- |\n| 2 |\n";
    const tables = planTables(text);
    expect(tables).toHaveLength(2);
    expect(tables[0]?.from).toBeLessThan(tables[1]?.from ?? 0);
    expect(tables[0]?.lastLine).toBeLessThan(tables[1]?.firstLine ?? 0);
  });
});

describe("splitCells", () => {
  it("treats a line without pipes as one cell", () => {
    const text = "hello\n";
    const line = splitLines(text)[0];
    if (line === undefined) throw new Error("missing line");
    expect(splitCells(text, line)).toEqual([{ from: 0, to: 5 }]);
  });

  it("does not create cells for the outer pipes", () => {
    const text = "| a | b |\n";
    const line = splitLines(text)[0];
    if (line === undefined) throw new Error("missing line");
    expect(splitCells(text, line).map(cell => text.slice(cell.from, cell.to))).toEqual(["a", "b"]);
  });
});

describe("tableIntersects", () => {
  const text = "| a |\n| --- |\n| 1 |\n";
  const table = only(text);

  it("is active for a cursor on the header, a body row, or a spanning selection", () => {
    expect(tableIntersects(table, { from: 0, to: 0 })).toBe(true);
    expect(tableIntersects(table, { from: 12, to: 12 })).toBe(true);
    expect(tableIntersects(table, { from: 0, to: text.length - 1 })).toBe(true);
  });

  it("is inactive for a cursor outside the table or no selection at all", () => {
    expect(tableIntersects(table, { from: text.length, to: text.length })).toBe(false);
    expect(tableIntersects(table, null)).toBe(false);
  });
});
