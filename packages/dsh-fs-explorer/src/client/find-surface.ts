/**
 * The surface the preview's find bar drives, and the channel a mounted body
 * publishes its own text through.
 *
 * There is one surface per pane, but two ways to answer it. A body that can
 * speak in its own text's offsets publishes a {@link FindSource}, and the pane
 * turns it into an offset surface; that is the only shape that reaches text a
 * virtualized view left out of the DOM, and it is what every editable body in
 * this workbench uses. Everything else falls back to a DOM reading, which is
 * honest only for bodies the browser laid out in full: the shipped fallback
 * Markdown and the plain-text `<pre>`.
 *
 * The two shapes cannot share an offset space. An editor's offsets are its own
 * document's, so a hit interval is directly a selection; rendered bodies are
 * laid out by the browser, where source markers (`**bold**`) and dropped images
 * occupy no visible character at all. So a surface answers only "how many hits"
 * and "show me the nth", plus how much text it covers, and each shape keeps its
 * own mapping internally.
 */
import { findMatches, layoutText, positionAt, type FindMatch, type TextLayout } from "./find.ts";

/**
 * How much of a body's text one source covers.
 *
 * The counter says "page" or "document" so the number cannot promise more than
 * the reader is looking at: the built-in read-only viewer holds the pager's
 * page, while the editable bodies hold the whole file.
 */
export type FindScope = "page" | "document";

/** What the find bar needs from whichever body is mounted. */
export interface FindSurface {
  /** Whether the search covers one page or the whole document. */
  readonly scope: FindScope;
  /** How many hits the query has in this surface. */
  count(query: string): number;
  /** Select and reveal the nth hit; out-of-range indices are ignored. */
  reveal(query: string, index: number): void;
  /** Clear the selection the last `reveal` made. */
  clear(): void;
}

/**
 * What a body hands the pane so find can search the body's own text.
 *
 * The pane owns the matching; the body owns the text and the selection, because
 * only the body knows which string its own offsets address. The `text` getter
 * must return that string: offsets into anything else (a `sliceDoc()` that
 * rebuilds CRLF, a rendered projection) would select the wrong interval.
 */
export interface FindSource {
  /** How much text {@link FindSource.text} covers; absent means one page. */
  readonly scope?: FindScope;
  /**
   * The text find searches, read per call.
   *
   * A getter rather than a value because the body outlives the text it holds:
   * the pane mounts an editor once per file and swaps the document per page,
   * so a captured string would search the page the reader has already left.
   */
  readonly text: () => string;
  /** Select and scroll to one `[from, to)` interval of that text. */
  readonly select: (from: number, to: number) => void;
  /** Clear the selection the last `select` made, without moving the viewport. */
  readonly clear: () => void;
}

/**
 * The channel a mounted body publishes its find source through.
 *
 * Handed to every renderer body as `find`. Absent outside a pane, where there
 * is no find bar to answer; a body that publishes nothing leaves the pane's
 * DOM reading as the answer.
 */
export interface FindSourceSink {
  /** Offer the body's source, or null when the body can no longer answer. */
  register(source: FindSource | null): void;
  /**
   * Announce that the source's text changed under an open query.
   *
   * Registration would move the selection again; this only asks the bar to
   * recount, so an edit in the body updates the counter without yanking the
   * reader's caret back to a hit.
   */
  invalidate?(): void;
}

/**
 * A surface whose offsets are the searched text's own offsets.
 *
 * This is every body that publishes a {@link FindSource}, because the source's
 * offsets are the only space it can select in. Rendered surfaces must not use
 * this — see {@link createDomSurface}.
 * @param options - the live text, the selection gesture and the clearing one.
 * @returns the surface.
 */
export function createOffsetSurface(options: FindSource): FindSurface {
  // The bar counts, then reveals the same query one effect later. Scanning the
  // whole document twice per keystroke is the one cost worth caching away; the
  // text getter's string identity is what invalidates it, so a body that edits
  // its document is picked up on the next call.
  let scannedText: string | null = null;
  let scannedQuery: string | null = null;
  let scannedHits: readonly FindMatch[] = [];
  const hits = (query: string): readonly FindMatch[] => {
    const text = options.text();
    if (text !== scannedText || query !== scannedQuery) {
      scannedText = text;
      scannedQuery = query;
      scannedHits = findMatches(text, query);
    }
    return scannedHits;
  };
  return {
    scope: options.scope ?? "page",
    count: query => hits(query).length,
    reveal: (query, index) => {
      const hit = hits(query)[index];
      if (hit !== undefined) options.select(hit.from, hit.to);
    },
    clear: options.clear,
  };
}

/**
 * Elements whose boundaries break a match.
 *
 * A query must not match across a paragraph break: the counter would name a hit
 * the reader cannot see on screen. `BR` is here because it creates a break with
 * no element nesting of its own.
 */
const BLOCK_TAGS: ReadonlySet<string> = new Set([
  "ADDRESS", "ARTICLE", "ASIDE", "BLOCKQUOTE", "BR", "DD", "DIV", "DL", "DT", "FIGCAPTION",
  "FIGURE", "FOOTER", "FORM", "H1", "H2", "H3", "H4", "H5", "H6", "HEADER", "HR", "LI", "MAIN",
  "NAV", "OL", "P", "PRE", "SECTION", "TABLE", "TBODY", "TD", "TFOOT", "TH", "THEAD", "TR", "UL",
]);

/** Elements whose contents are never part of the rendered text. */
const SKIPPED_TAGS: ReadonlySet<string> = new Set(["SCRIPT", "STYLE", "TEMPLATE"]);

/** The rendered text of one body, plus the nodes it was read from. */
interface RenderedText {
  readonly layout: TextLayout;
  readonly nodes: readonly Text[];
}

/**
 * Collect the visible text of a subtree in document order.
 *
 * Groups runs into blocks so {@link layoutText} can separate them, and keeps the
 * text nodes themselves so an offset in the joined string can be turned back
 * into a `Range` afterwards.
 * @param root - the rendered body.
 * @returns the searchable layout and the nodes its runs index into.
 */
function readRenderedText(root: HTMLElement): RenderedText {
  const blocks: string[][] = [];
  const nodes: Text[] = [];
  const walk = (parent: Node): void => {
    for (const child of Array.from(parent.childNodes)) {
      if (child.nodeType === 3) {
        const data = (child as Text).data;
        if (data === "") continue;
        const current = blocks.at(-1);
        if (current === undefined) blocks.push([data]);
        else current.push(data);
        nodes.push(child as Text);
        continue;
      }
      if (child.nodeType !== 1) continue;
      const element = child as Element;
      const tag = element.tagName.toUpperCase();
      if (SKIPPED_TAGS.has(tag)) continue;
      if (tag === "BR") {
        blocks.push([]);
        continue;
      }
      // A block element opens and closes a block, so text on either side of it
      // keeps the newline that the reader sees as a line break.
      const block = BLOCK_TAGS.has(tag);
      if (block) blocks.push([]);
      walk(element);
      if (block) blocks.push([]);
    }
  };
  walk(root);
  return { layout: layoutText(blocks), nodes };
}

/**
 * The DOM surface a pane uses for bodies that publish nothing.
 *
 * Read afresh on every call: the body is replaced by a renderer swap or a page
 * change, and a layout cached from the previous body would point at detached
 * nodes that no selection can reach.
 * @param body - the mounted body element, or null before the first paint.
 * @returns the surface.
 */
export function createDomSurface(body: () => HTMLElement | null): FindSurface {
  const read = (): RenderedText | undefined => {
    const root = body();
    return root === null ? undefined : readRenderedText(root);
  };
  const selection = (): Selection | undefined => {
    const root = body();
    return root?.ownerDocument.defaultView?.getSelection() ?? undefined;
  };
  return {
    // A body that publishes nothing renders its text in full; there is no page
    // boundary to count against, so the bar names the page it can see.
    scope: "page",
    count: query => {
      const rendered = read();
      return rendered === undefined ? 0 : findMatches(rendered.layout.text, query).length;
    },
    reveal: (query, index) => {
      const rendered = read();
      const root = body();
      if (rendered === undefined || root === null) return;
      const hit = findMatches(rendered.layout.text, query)[index];
      if (hit === undefined) return;
      const from = positionAt(rendered.layout, hit.from);
      const to = positionAt(rendered.layout, hit.to);
      if (from === undefined || to === undefined) return;
      const startNode = rendered.nodes[from.node];
      const endNode = rendered.nodes[to.node];
      if (startNode === undefined || endNode === undefined) return;
      const range = root.ownerDocument.createRange();
      try {
        range.setStart(startNode, Math.min(from.offset, startNode.data.length));
        range.setEnd(endNode, Math.min(to.offset, endNode.data.length));
      } catch {
        // A node replaced between the read and the selection is no hit at all.
        return;
      }
      const target = selection();
      if (target !== undefined) {
        target.removeAllRanges();
        target.addRange(range);
      }
      // jsdom implements no layout, so the scroll step is skipped where it
      // cannot mean anything; the selection is the whole contract.
      const anchor = range.startContainer.parentElement;
      if (anchor !== null && typeof anchor.scrollIntoView === "function") {
        anchor.scrollIntoView({ block: "center" });
      }
    },
    clear: () => selection()?.removeAllRanges(),
  };
}
