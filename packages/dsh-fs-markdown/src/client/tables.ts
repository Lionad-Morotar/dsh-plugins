/**
 * The GFM table scanner.
 *
 * The editor renders a table as a block widget, which means it has to know
 * exactly which lines belong to it and where every cell starts. That decision
 * lives here, as a pure function over the document, so the reading rules can be
 * asserted in Node and so the decoration planner and the widget agree on one
 * answer instead of two lookalike regexes.
 *
 * The rules follow the GitHub Flavored Markdown table extension as implemented
 * by `micromark-extension-gfm-table`, which the upstream chat renderer uses
 * too. The cases that matter in practice:
 *
 * - A table needs a header line and a delimiter line whose cell counts match.
 *   The delimiter line must carry at least one unescaped pipe; without it the
 *   pair is a setext heading, not a table.
 * - Outer pipes are optional; escaped pipes (`\|`) belong to the cell.
 * - A table interrupts a paragraph and ends at the first blank line or the
 *   first line that starts another block (heading, fence, quote, list, rule,
 *   indented code, HTML block). A body line without any pipe is still a row,
 *   which is what makes the table swallow stray paragraph lines until a block
 *   boundary.
 * - Rows are normalized to the header's column count: short rows gain empty
 *   cells, long rows lose their tail.
 * - Tables inside a closed fence or inside the leading frontmatter are not
 *   scanned. A table nested in a blockquote or a list item is out of scope:
 *   the planner renders those containers as their own blocks.
 */

import { frontmatterLast, isBlankLine, isEscaped, pairFences, splitLines, type Line } from "./lines.ts";

/** How one column aligns its text. */
export type TableAlignment = "none" | "left" | "center" | "right";

/** One cell's content, trimmed; `from === to` for a cell that has no content. */
export interface TableCell {
  readonly from: number;
  readonly to: number;
}

/** One table line: header, delimiter is not a row, body. */
export interface TableRow {
  /** The full line, line terminator excluded. */
  readonly from: number;
  readonly to: number;
  readonly cells: readonly TableCell[];
}

/** One table, from its header line to its last body line. */
export interface TableBlock {
  /** Start of the header line. */
  readonly from: number;
  /** End of the last body line, line terminator excluded. */
  readonly to: number;
  readonly firstLine: number;
  readonly lastLine: number;
  readonly alignments: readonly TableAlignment[];
  readonly header: TableRow;
  readonly rows: readonly TableRow[];
}

/** Content bounds of one line, after trimming spaces and tabs. */
interface Bounds {
  readonly from: number;
  readonly to: number;
}

const DELIMITER_CELL = /^:?-+:?$/u;

/** Lines that end a table and cannot be its header: the block starts GFM names. */
const BLOCK_STARTS = [
  // ATX heading.
  /^ {0,3}#{1,6}(?:[ \t]|$)/u,
  // Fenced code.
  /^ {0,3}(?:`{3,}|~{3,})/u,
  // Blockquote.
  /^ {0,3}>/u,
  // List item; a bare marker is an empty item.
  /^ {0,3}(?:[-*+]|\d{1,9}[.)])(?:[ \t]|$)/u,
  // Thematic break.
  /^ {0,3}(?:(?:\*[ \t]*){3,}|(?:-[ \t]*){3,}|(?:_[ \t]*){3,})$/u,
  // Indented code.
  /^(?: {4}|\t)/u,
  // HTML block. Only the leading `<` is checked: a table row that begins with
  // markup is not a table row anyone writes on purpose.
  /^ {0,3}</u,
];

function isPadding(char: string | undefined): boolean {
  return char === " " || char === "\t";
}

/** Trim spaces and tabs inside `from`..`to`, in document coordinates. */
function trimBounds(text: string, from: number, to: number): Bounds {
  let start = from;
  let end = to;
  while (start < end && isPadding(text[start])) start += 1;
  while (end > start && isPadding(text[end - 1])) end -= 1;
  return { from: start, to: end };
}

/** Positions of every pipe that is not escaped, in document coordinates. */
function unescapedPipes(text: string, from: number, to: number): number[] {
  const pipes: number[] = [];
  for (let index = from; index < to; index += 1) {
    if (text[index] === "|" && !isEscaped(text, index)) pipes.push(index);
  }
  return pipes;
}

/**
 * Split one line into cell content bounds.
 *
 * A line without an unescaped pipe is one cell: GFM lets a body row omit its
 * pipes entirely, and the table then pads it to the header's width. Leading and
 * trailing pipes are boundaries, not empty cells.
 * @param text - the whole document, so offsets stay absolute.
 * @param line - the line to split.
 * @returns trimmed content bounds per cell.
 */
export function splitCells(text: string, line: Line): readonly TableCell[] {
  const bounds = trimBounds(text, line.start, line.end);
  const pipes = unescapedPipes(text, bounds.from, bounds.to);
  if (pipes.length === 0) return [{ from: bounds.from, to: bounds.to }];
  const cells: TableCell[] = [];
  let cursor = bounds.from;
  for (let position = 0; position < pipes.length; position += 1) {
    const pipe = pipes[position] ?? bounds.to;
    // A pipe at the very start opens the row rather than closing an empty cell.
    const leading = position === 0 && pipe === bounds.from;
    if (!leading) cells.push(trimBounds(text, cursor, pipe));
    cursor = pipe + 1;
  }
  // The final pipe closes the row; anything after it is the last cell's content.
  const lastPipe = pipes[pipes.length - 1] ?? bounds.to;
  if (lastPipe !== bounds.to - 1) cells.push(trimBounds(text, cursor, bounds.to));
  return cells;
}

/** The alignment a delimiter cell declares. */
function alignmentOf(raw: string): TableAlignment {
  const left = raw.startsWith(":");
  const right = raw.endsWith(":");
  if (left && right) return "center";
  if (right) return "right";
  if (left) return "left";
  return "none";
}

/**
 * Read the delimiter row of a table.
 * @param text - the whole document.
 * @param line - the candidate delimiter line.
 * @returns one alignment per column, or null when the line is not a delimiter.
 */
function parseDelimiter(text: string, line: Line): readonly TableAlignment[] | null {
  const bounds = trimBounds(text, line.start, line.end);
  // A delimiter without a pipe would collide with a setext heading underline.
  if (unescapedPipes(text, bounds.from, bounds.to).length === 0) return null;
  const cells = splitCells(text, line);
  if (cells.length === 0) return null;
  const alignments: TableAlignment[] = [];
  for (const cell of cells) {
    const raw = text.slice(cell.from, cell.to);
    if (!DELIMITER_CELL.test(raw)) return null;
    alignments.push(alignmentOf(raw));
  }
  return alignments;
}

/** Whether a line begins another block, which ends a table. */
function isBlockStart(text: string): boolean {
  return BLOCK_STARTS.some(pattern => pattern.test(text));
}

/**
 * Build one row, normalized to `columns` cells.
 * @param text - the whole document.
 * @param line - the row line.
 * @param columns - the header's column count.
 * @returns the row with short lines padded and long lines truncated.
 */
function buildRow(text: string, line: Line, columns: number): TableRow {
  const found = splitCells(text, line);
  const cells: TableCell[] = [];
  for (let index = 0; index < columns; index += 1) {
    cells.push(found[index] ?? { from: line.end, to: line.end });
  }
  return { from: line.start, to: line.end, cells };
}

/**
 * Find every table in one document.
 *
 * The scan is linear and independent of the selection: the selection only
 * decides whether a found table is painted as a table or shown as source.
 * @param text - the whole document.
 * @returns tables in document order.
 */
export function planTables(text: string): readonly TableBlock[] {
  const lines = splitLines(text);
  const first = frontmatterLast(lines) + 1;
  const fences = pairFences(lines, first);
  const tables: TableBlock[] = [];
  let index = first;
  while (index < lines.length) {
    const fenceEnd = fences.get(index);
    if (fenceEnd !== undefined) {
      index = fenceEnd + 1;
      continue;
    }
    const headerLine = lines[index];
    if (headerLine === undefined) break;
    if (isBlankLine(headerLine.text) || isBlockStart(headerLine.text)) {
      index += 1;
      continue;
    }
    const delimiterLine = lines[index + 1];
    if (delimiterLine === undefined) break;
    const alignments = parseDelimiter(text, delimiterLine);
    if (alignments === null) {
      index += 1;
      continue;
    }
    const headerCells = splitCells(text, headerLine);
    if (headerCells.length !== alignments.length) {
      index += 1;
      continue;
    }
    const rows: TableRow[] = [];
    let cursor = index + 2;
    while (cursor < lines.length) {
      const row = lines[cursor];
      if (row === undefined || isBlankLine(row.text) || isBlockStart(row.text)) break;
      rows.push(buildRow(text, row, alignments.length));
      cursor += 1;
    }
    const lastLine = cursor - 1;
    tables.push({
      from: headerLine.start,
      to: lines[lastLine]?.end ?? headerLine.end,
      firstLine: index,
      lastLine,
      alignments,
      header: { from: headerLine.start, to: headerLine.end, cells: headerCells },
      rows,
    });
    index = cursor;
  }
  return tables;
}

/**
 * Whether a selection touches a table, in the same sense the planner uses for
 * every other block: either endpoint inside the block's line range, or the
 * selection spanning it entirely.
 * @param table - one table.
 * @param active - the current selection, or null when nothing is focused.
 * @returns true when the table must show its source.
 */
export function tableIntersects(
  table: TableBlock,
  active: { readonly from: number; readonly to: number } | null,
): boolean {
  return active !== null && active.from <= table.to && active.to >= table.from;
}
