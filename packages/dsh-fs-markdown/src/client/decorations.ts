/**
 * The decoration planner: which parts of the Markdown source collapse into
 * formatting and which stay literal.
 *
 * The editor asks this function for a plan on every document or selection
 * change. Keeping it a pure function over flat UTF-16 offsets is what makes the
 * behaviour assertable without a browser: CodeMirror is only the renderer, and
 * a rule that cannot be stated here cannot be relied on in the editor.
 *
 * The plan obeys one global contract: ranges are sorted, in-bounds, non-empty
 * and never overlap. `Decoration.replace` in particular throws on overlapping
 * or cross-line ranges, so the planner has to make those situations
 * unrepresentable rather than defensive at the call site.
 */

import { frontmatterLast, isBlankLine, isEscaped, pairFences, splitLines, type Line } from "./lines.ts";
import { planTables, tableIntersects, type TableBlock } from "./tables.ts";

/** What happens to a planned range. */
export type DecorationKind = "hide" | "style";

/** The visual class a styled range resolves to. */
export type DecorationStyle =
  | "heading1"
  | "heading2"
  | "heading3"
  | "heading4"
  | "heading5"
  | "heading6"
  | "strong"
  | "em"
  | "code"
  | "link"
  | "quote"
  | "list-marker"
  | "code-block";

/** One range of the plan, in UTF-16 offsets: `from` inclusive, `to` exclusive. */
export interface PlanRange {
  readonly from: number;
  readonly to: number;
  readonly kind: DecorationKind;
  readonly style?: DecorationStyle;
}

/** A run of lines the planner treats as one unit for activation. */
interface Block {
  readonly start: number;
  readonly end: number;
  readonly first: number;
  readonly last: number;
  readonly fence: boolean;
}

/** A closing bracket `]` and the end of the destination's `)`. */
interface LinkParts {
  readonly labelEnd: number;
  readonly end: number;
}

const HEADING = /^(#{1,6})(\s+)/u;
const QUOTE = /^(>\s?)/u;
const LIST_ITEM = /^(\s*)([-*+]|\d+\.)\s/u;

function runLength(text: string, from: number, to: number, char: string): number {
  let cursor = from;
  while (cursor < to && text[cursor] === char) cursor += 1;
  return cursor - from;
}

function isWordChar(char: string | undefined): boolean {
  return char !== undefined && /[\p{L}\p{N}_]/u.test(char);
}

/** Accumulates ranges and enforces the uniqueness part of the contract. */
class PlanBuilder {
  private readonly ranges: PlanRange[] = [];
  private readonly keys = new Set<string>();

  hide(from: number, to: number): void {
    this.add({ from, to, kind: "hide" });
  }

  style(from: number, to: number, style: DecorationStyle): void {
    this.add({ from, to, kind: "style", style });
  }

  private add(range: PlanRange): void {
    if (range.to <= range.from) return;
    const key = `${String(range.from)}:${String(range.to)}:${range.kind}:${range.style ?? ""}`;
    if (this.keys.has(key)) return;
    this.keys.add(key);
    this.ranges.push(range);
  }

  /**
   * Sort and drop anything that overlaps an earlier range.
   *
   * The rules are written so this never fires; the filter exists because the
   * consumer throws on overlap and a silently shortened plan is still safer
   * than a crashed document. Keeping it here means every other module can treat
   * the contract as true.
   */
  finish(): readonly PlanRange[] {
    const sorted = [...this.ranges].sort((left, right) => left.from - right.from || left.to - right.to);
    const kept: PlanRange[] = [];
    let previousTo = 0;
    for (const range of sorted) {
      if (range.from < previousTo) continue;
      kept.push(range);
      previousTo = range.to;
    }
    return kept;
  }
}

/** Find a closing emphasis marker of exactly `width` characters. */
function findEmphasisClose(
  text: string,
  from: number,
  to: number,
  char: string,
  width: number,
): number {
  let cursor = from;
  while (cursor < to) {
    const index = text.indexOf(char, cursor);
    if (index === -1 || index >= to) return -1;
    if (isEscaped(text, index)) {
      cursor = index + 1;
      continue;
    }
    const run = runLength(text, index, to, char);
    if (run < width || (width === 1 && run > 1)) {
      cursor = index + run;
      continue;
    }
    // CommonMark does not emphasise intraword underscores: `snake_case_name`
    // must stay a name, not become "snakecasename".
    if (char === "_" && isWordChar(text[index + width])) {
      cursor = index + run;
      continue;
    }
    return index;
  }
  return -1;
}

/** Find the matching `)` for a link destination, tolerating balanced parens. */
function findDestinationEnd(text: string, open: number, to: number): number {
  let depth = 0;
  for (let cursor = open; cursor < to; cursor += 1) {
    const char = text[cursor];
    if (char === "\\") {
      cursor += 1;
      continue;
    }
    if (char === "(") depth += 1;
    else if (char === ")") {
      depth -= 1;
      if (depth === 0) return cursor;
    }
  }
  return -1;
}

/** Parse `[label](url)` starting at `open`, or answer null when it never closes. */
function parseLink(text: string, open: number, to: number): LinkParts | null {
  const labelEnd = text.indexOf("]", open + 1);
  if (labelEnd === -1 || labelEnd >= to) return null;
  if (text[labelEnd + 1] !== "(") return null;
  const destinationEnd = findDestinationEnd(text, labelEnd + 1, to);
  if (destinationEnd === -1) return null;
  return { labelEnd, end: destinationEnd + 1 };
}

/**
 * Plan inline formatting inside one line.
 *
 * Constructs are consumed whole: once a link or a code span is taken, its
 * contents are not scanned again. That is what keeps the plan non-overlapping
 * without a nesting model, and it matches how the editor renders one mark per
 * stretch of text.
 */
function scanInline(text: string, from: number, to: number, active: boolean, builder: PlanBuilder): void {
  const hide = (start: number, end: number): void => {
    if (!active) builder.hide(start, end);
  };
  let cursor = from;
  while (cursor < to) {
    const char = text[cursor];
    if (char === "\\") {
      cursor += 2;
      continue;
    }
    if (char === "`") {
      const width = runLength(text, cursor, to, "`");
      const close = text.indexOf("`".repeat(width), cursor + width);
      if (close === -1 || close + width > to) {
        cursor += width;
        continue;
      }
      hide(cursor, cursor + width);
      hide(close, close + width);
      builder.style(cursor + width, close, "code");
      cursor = close + width;
      continue;
    }
    // An image is left literal on purpose: the first phase has no image
    // renderer, and hiding only its link brackets would leave a stray `!`.
    if (char === "!" && text[cursor + 1] === "[") {
      const image = parseLink(text, cursor + 1, to);
      cursor = image === null ? cursor + 1 : image.end;
      continue;
    }
    if (char === "[") {
      const link = parseLink(text, cursor, to);
      if (link === null) {
        cursor += 1;
        continue;
      }
      hide(cursor, cursor + 1);
      hide(link.labelEnd, link.end);
      builder.style(cursor + 1, link.labelEnd, "link");
      cursor = link.end;
      continue;
    }
    if (char === "*" || char === "_") {
      const previous = cursor > 0 ? text[cursor - 1] : undefined;
      if (char === "_" && isWordChar(previous)) {
        cursor += runLength(text, cursor, to, char);
        continue;
      }
      const width = runLength(text, cursor, to, char);
      if (width >= 2) {
        const close = findEmphasisClose(text, cursor + 2, to, char, 2);
        if (close === -1) {
          // A run of two or more is never re-read as italic: that would hide
          // the first two characters of an unclosed `**` marker.
          cursor += width;
          continue;
        }
        hide(cursor, cursor + 2);
        hide(close, close + 2);
        builder.style(cursor + 2, close, "strong");
        cursor = close + 2;
        continue;
      }
      const close = findEmphasisClose(text, cursor + 1, to, char, 1);
      if (close === -1) {
        cursor += 1;
        continue;
      }
      hide(cursor, cursor + 1);
      hide(close, close + 1);
      builder.style(cursor + 1, close, "em");
      cursor = close + 1;
      continue;
    }
    cursor += 1;
  }
}

/**
 * Plan the inline marks inside one stretch of text.
 *
 * The table widget uses this to paint emphasis, code spans and link labels in a
 * cell without going through CodeMirror: markers disappear and the remaining
 * text is grouped by the style it should carry. It is the same scanner the
 * editor uses, so a cell and a paragraph cannot disagree about what `**x**`
 * means.
 * @param text - the whole document, so offsets stay absolute.
 * @param from - first character of the stretch.
 * @param to - end of the stretch, exclusive.
 * @returns sorted, non-overlapping hide and style ranges.
 */
export function planInline(text: string, from: number, to: number): readonly PlanRange[] {
  const builder = new PlanBuilder();
  scanInline(text, from, to, false, builder);
  return builder.finish();
}

/** Emit one ordinary (non-fence) line's ranges. */
function planLine(text: string, lines: readonly Line[], index: number, active: boolean, builder: PlanBuilder): void {
  const line = lines[index];
  if (line === undefined || isBlankLine(line.text)) return;

  const quote = QUOTE.exec(line.text);
  if (quote !== null) {
    const prefix = quote[1] ?? "";
    if (!active) builder.hide(line.start, line.start + prefix.length);
    const from = active ? line.start : line.start + prefix.length;
    builder.style(from, line.end, "quote");
    return;
  }

  const heading = HEADING.exec(line.text);
  if (heading !== null) {
    const level = (heading[1] ?? "").length;
    const prefix = heading[0];
    if (!active) builder.hide(line.start, line.start + prefix.length);
    const from = active ? line.start : line.start + prefix.length;
    builder.style(from, line.end, `heading${String(level)}` as DecorationStyle);
    return;
  }

  const item = LIST_ITEM.exec(line.text);
  if (item !== null) {
    const indent = (item[1] ?? "").length;
    const marker = item[2] ?? "";
    builder.style(line.start + indent, line.start + indent + marker.length, "list-marker");
    scanInline(text, line.start + item[0].length, line.end, active, builder);
    return;
  }

  scanInline(text, line.start, line.end, active, builder);
}

/**
 * Plan the decorations for one document and one selection.
 * @param text - the whole document.
 * @param active - the current selection or cursor; null when nothing is focused.
 * @returns sorted, non-overlapping ranges to hide or style.
 */
export function planDecorations(
  text: string,
  active: { readonly from: number; readonly to: number } | null,
): readonly PlanRange[] {
  const lines = splitLines(text);
  const builder = new PlanBuilder();
  // Rule 11: a frontmatter block is presentation-neutral. It stays literal in
  // both modes, so it is excluded before any other rule can claim its lines.
  const frontmatterEnd = frontmatterLast(lines);
  // Fences pair before blocks are formed, because a blank line inside a fence
  // must not split it.
  const fenceEnds = pairFences(lines, frontmatterEnd + 1);

  // A table that is not being edited is replaced by a block widget, so its
  // lines emit no ranges here. Only the table the reader is editing keeps its
  // source, which is what the monospace range below marks.
  const tableByLine = new Map<number, TableBlock>();
  for (const table of planTables(text)) {
    for (let cursor = table.firstLine; cursor <= table.lastLine; cursor += 1) tableByLine.set(cursor, table);
  }

  const blocks: Block[] = [];
  let index = frontmatterEnd + 1;
  while (index < lines.length) {
    const line = lines[index];
    if (line === undefined) break;
    if (isBlankLine(line.text)) {
      index += 1;
      continue;
    }
    const fenceEnd = fenceEnds.get(index);
    if (fenceEnd !== undefined) {
      blocks.push({ start: line.start, end: lines[fenceEnd]?.end ?? line.end, first: index, last: fenceEnd, fence: true });
      index = fenceEnd + 1;
      continue;
    }
    let last = index;
    while (last + 1 < lines.length) {
      const next = lines[last + 1];
      if (next === undefined || isBlankLine(next.text) || fenceEnds.has(last + 1)) break;
      last += 1;
    }
    blocks.push({ start: line.start, end: lines[last]?.end ?? line.end, first: index, last, fence: false });
    index = last + 1;
  }

  const isActive = (block: Block): boolean =>
    active !== null && active.from <= block.end && active.to >= block.start;

  for (const block of blocks) {
    const blockActive = isActive(block);
    if (block.fence) {
      for (let cursor = block.first; cursor <= block.last; cursor += 1) {
        const line = lines[cursor];
        if (line === undefined || line.end <= line.start) continue;
        const opening = cursor === block.first || cursor === block.last;
        if (opening) {
          if (!blockActive) builder.hide(line.start, line.end);
          continue;
        }
        builder.style(line.start, line.end, "code-block");
      }
      continue;
    }
    for (let cursor = block.first; cursor <= block.last; cursor += 1) {
      const line = lines[cursor];
      if (line === undefined) continue;
      const table = tableByLine.get(cursor);
      if (table !== undefined) {
        if (tableIntersects(table, active)) builder.style(line.start, line.end, "code-block");
        continue;
      }
      planLine(text, lines, cursor, blockActive, builder);
    }
  }

  return builder.finish();
}
