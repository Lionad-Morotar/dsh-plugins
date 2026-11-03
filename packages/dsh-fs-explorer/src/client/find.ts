/**
 * In-page find.
 *
 * The preview holds one page of at most `PREVIEW_MAX_LINES` lines, and the
 * three text surfaces disagree about what an offset means: the editor's
 * document is the page text verbatim, while the Markdown and plain-text
 * surfaces are laid out by the browser from rendered nodes, where source
 * markers (`**bold**`) and image placeholders occupy no text at all. So this
 * module answers one question only — where does the query occur in a given
 * string — and callers keep their offsets in their own space.
 *
 * Nothing here touches the document: a hit is an interval, and what a surface
 * does with it (an editor selection, a DOM `Range`) stays with that surface.
 */

/** One half-open `[from, to)` hit interval over the searched text. */
export interface FindMatch {
  readonly from: number;
  readonly to: number;
}

/**
 * Escape every character a regular expression would read as syntax.
 *
 * Deliberately limited to the `SyntaxCharacter` set: the pattern is compiled
 * with the `u` flag, where escaping anything else (`\-`, `\ `) is itself a
 * syntax error.
 * @param value - the literal text to escape.
 * @returns the same text, safe inside a pattern.
 */
function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&");
}

/**
 * Every occurrence of `query` in `text`, case-insensitively.
 *
 * Hits never overlap — the scan resumes after each match, so searching `aa` in
 * `aaa` answers one hit, which is what a reader stepping through them expects
 * to see. Case folding goes through the regex engine rather than
 * `toLowerCase()`, because lowercasing can change a string's length and would
 * desynchronize the intervals from the text they point into.
 * @param text - the searched text, in the caller's own offset space.
 * @param query - the literal query; empty means no hits rather than every gap.
 * @returns hits in ascending order.
 */
export function findMatches(text: string, query: string): readonly FindMatch[] {
  if (text === "" || query === "") return [];
  const matches: FindMatch[] = [];
  for (const match of text.matchAll(new RegExp(escapeRegExp(query), "giu"))) {
    const from = match.index;
    // `matchAll` only yields indexed matches for a global pattern, which this
    // one is; the guard answers the type without a cast.
    if (from === undefined) continue;
    const to = from + match[0].length;
    if (to > from) matches.push({ from, to });
  }
  return matches;
}

/**
 * Step to another hit, wrapping at both ends.
 *
 * Wrapping is the find-bar convention and it also keeps the counter honest
 * when the reader holds the key down: `n/m` always names a real hit.
 * @param index - the current hit index.
 * @param count - how many hits the current query has.
 * @param delta - `1` for next, `-1` for previous.
 * @returns the next index, or `0` when there is nothing to step through.
 */
export function stepHit(index: number, count: number, delta: number): number {
  if (count <= 0) return 0;
  return (((index + delta) % count) + count) % count;
}

/**
 * The offsets one rendered text node's character occupies in a layout.
 *
 * `start` and `length` are derived from the node list, but they are stored
 * because every reveal lookup walks them and recomputing a prefix sum per hit
 * would make the mapping quadratic on a page of many small nodes.
 */
export interface TextRun {
  /** Index of this run in the node list the layout was built from. */
  readonly node: number;
  /** Offset of the run's first character in {@link TextLayout.text}. */
  readonly start: number;
  readonly length: number;
}

/**
 * A searchable string built from rendered nodes, plus where those nodes landed.
 *
 * The DOM surface cannot search the page text: the browser drops markup, so
 * `**bold**` is six characters of source and four of visible text, and a
 * `Range` over visible text has no relation to a page-text offset. This layout
 * is the bridge — `text` is what the reader sees, `runs` says which node each
 * slice of it came from, so a hit found in `text` converts back to a `Range`.
 */
export interface TextLayout {
  readonly text: string;
  readonly runs: readonly TextRun[];
}

/**
 * Lay out rendered text so block boundaries cannot be matched across.
 *
 * Nodes are grouped by the block that owns them and blocks are joined with a
 * newline: without it, the last word of one paragraph would run into the first
 * word of the next and a query would report a hit that is visible nowhere.
 * @param blocks - one entry per block, each holding its text nodes in order.
 * @returns the searchable text and the node offsets within it.
 */
export function layoutText(blocks: readonly (readonly string[])[]): TextLayout {
  const parts: string[] = [];
  const runs: TextRun[] = [];
  let cursor = 0;
  let node = 0;
  blocks.forEach((texts, block) => {
    if (block > 0) {
      parts.push("\n");
      cursor += 1;
    }
    for (const text of texts) {
      if (text !== "") runs.push({ node, start: cursor, length: text.length });
      parts.push(text);
      cursor += text.length;
      node += 1;
    }
  });
  return { text: parts.join(""), runs };
}

/** Where one offset lands once a layout has been walked. */
export interface TextPosition {
  /** Index of the node in the list the layout was built from. */
  readonly node: number;
  /** Offset inside that node's own text. */
  readonly offset: number;
}

/**
 * Convert a layout offset back to a node and an offset inside it.
 *
 * An offset that falls on a block separator resolves to the position just past
 * the previous node's last character, which is where the browser would place
 * the caret for that spot.
 * @param layout - the layout the offset was measured in.
 * @param offset - a `[0, layout.text.length]` offset.
 * @returns the node position, or undefined when no node owns the offset.
 */
export function positionAt(layout: TextLayout, offset: number): TextPosition | undefined {
  const clamped = Math.max(0, Math.min(offset, layout.text.length));
  // The last run that starts at or before the offset owns it. Taking the later
  // of two adjacent runs keeps the answer on a run boundary at the start of the
  // next node rather than the end of the previous one; a block separator has no
  // run at all, so it lands past the previous run's last character.
  let owner: TextRun | undefined;
  for (const run of layout.runs) {
    if (run.start > clamped) break;
    owner = run;
  }
  if (owner === undefined) return undefined;
  return { node: owner.node, offset: Math.min(clamped - owner.start, owner.length) };
}
