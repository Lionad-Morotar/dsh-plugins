/**
 * Line bookkeeping shared by the decoration planner and the table scanner.
 *
 * Both consume the whole document as flat UTF-16 offsets and have to agree on
 * where a line starts and ends, CRLF included, so that split lives here rather
 * than in either consumer. Keeping it a set of pure functions over a string is
 * what makes the two planners assertable in Node without an editor.
 */

/** One physical line; `end` excludes the line terminator. */
export interface Line {
  readonly start: number;
  readonly end: number;
  readonly text: string;
}

const FENCE_OPEN = /^ {0,3}(`{3,})(.*)$/u;
const FENCE_CLOSE = /^ {0,3}(`{3,})\s*$/u;

/** Whether a line carries no content at all. */
export function isBlankLine(text: string): boolean {
  return text.trim() === "";
}

/** Split into lines while keeping absolute offsets stable for CRLF input. */
export function splitLines(text: string): Line[] {
  const lines: Line[] = [];
  let start = 0;
  while (start <= text.length) {
    const newline = text.indexOf("\n", start);
    const rawEnd = newline === -1 ? text.length : newline;
    const end = rawEnd > start && text[rawEnd - 1] === "\r" ? rawEnd - 1 : rawEnd;
    lines.push({ start, end, text: text.slice(start, end) });
    if (newline === -1) break;
    start = newline + 1;
  }
  return lines;
}

/** Whether the line opens a fence, and how long its backtick run is. */
export function fenceOpener(line: Line): number | null {
  const match = FENCE_OPEN.exec(line.text);
  return match === null ? null : (match[1] ?? "").length;
}

/** Whether the line closes a fence opened with `width` backticks. */
export function fenceCloser(line: Line, width: number): boolean {
  const match = FENCE_CLOSE.exec(line.text);
  return match !== null && (match[1] ?? "").length >= width;
}

/**
 * Pair every fence opener with the line that closes it.
 *
 * Pairing happens before blocks are formed because a blank line inside a fence
 * must not split it. An opener with no closer is left out on purpose: an
 * unclosed fence stays ordinary text rather than swallowing the rest of the
 * document.
 * @param lines - the document's lines.
 * @param first - index to start scanning from (past the frontmatter).
 * @returns opening line index to closing line index.
 */
export function pairFences(lines: readonly Line[], first: number): Map<number, number> {
  const ends = new Map<number, number>();
  for (let index = first; index < lines.length; index += 1) {
    const line = lines[index];
    if (line === undefined || isBlankLine(line.text)) continue;
    const width = fenceOpener(line);
    if (width === null) continue;
    for (let close = index + 1; close < lines.length; close += 1) {
      const candidate = lines[close];
      if (candidate !== undefined && fenceCloser(candidate, width)) {
        ends.set(index, close);
        index = close;
        break;
      }
    }
  }
  return ends;
}

/**
 * Index of the line closing a leading frontmatter block, or -1.
 *
 * Frontmatter is presentation-neutral: the planner skips it entirely and the
 * table scanner must not find a table in YAML either, which is why both ask
 * this one function instead of re-detecting the block.
 * @param lines - the document's lines.
 * @returns the last frontmatter line index, or -1 when the document has none.
 */
export function frontmatterLast(lines: readonly Line[]): number {
  if (lines[0]?.text.trim() !== "---") return -1;
  for (let index = 1; index < lines.length; index += 1) {
    if (lines[index]?.text.trim() === "---") return index;
  }
  return -1;
}

/** Whether `index` is preceded by an odd number of backslashes. */
export function isEscaped(text: string, index: number): boolean {
  let count = 0;
  for (let cursor = index - 1; cursor >= 0 && text[cursor] === "\\"; cursor -= 1) count += 1;
  return count % 2 === 1;
}
