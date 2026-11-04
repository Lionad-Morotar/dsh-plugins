/**
 * The two surfaces the preview's find bar drives.
 *
 * They cannot share an offset space. The editor's document is the page text
 * verbatim, so a hit offset is directly usable; the Markdown and plain-text
 * bodies are laid out by the browser from rendered nodes, where source markers
 * (`**bold**`) and dropped images occupy no visible character at all. So a
 * surface answers only "how many hits" and "show me the nth", and each keeps
 * its own mapping internally.
 */
import { createContext, useContext } from "react";

import { findMatches, layoutText, positionAt, type TextLayout } from "./find.ts";

/** What the find bar needs from whichever body is mounted. */
export interface FindSurface {
  /** How many hits the query has in this surface. */
  count(query: string): number;
  /** Select and reveal the nth hit; out-of-range indices are ignored. */
  reveal(query: string, index: number): void;
  /** Drop the current selection. */
  clear(): void;
}

/** The seams an offset-measured surface closes over. */
export interface OffsetSurfaceOptions {
  /**
   * The page text, read per call.
   *
   * A getter rather than a value because the editor outlives the page it holds:
   * the pane mounts it once per file and swaps the document per page, so a
   * captured string would search the page the reader has already left.
   */
  readonly text: () => string;
  /** Select and scroll to one `[from, to)` interval of the current page. */
  readonly select: (from: number, to: number) => void;
  /** Drop the selection the last `select` made. */
  readonly clear: () => void;
}

/**
 * A surface whose offsets are the searched text's own offsets.
 *
 * This is the editor's shape, and only the editor's: its document is the page
 * text verbatim, so a hit interval is directly a selection. The rendered
 * surfaces must not use this — see {@link createDomSurface}.
 * @param options - the live page text, the selection gesture and the clearing one.
 * @returns the surface.
 */
export function createOffsetSurface(options: OffsetSurfaceOptions): FindSurface {
  const hits = (query: string) => findMatches(options.text(), query);
  return {
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
 * A surface over what the browser actually laid out.
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

/**
 * The channel a mounted body publishes its surface through.
 *
 * The body is chosen by the renderer registry and receives only
 * {@link RendererBodyProps}, so it cannot be handed the find bar as a prop —
 * that type is the public seam plugins implement. A context carries the other
 * direction instead: the pane offers a sink, the mounted body registers into it,
 * and the pane keeps the DOM surface as the answer for bodies that never will.
 */
export interface FindSurfaceSink {
  /** Offer the mounted body's surface, or null when it is going away. */
  register(surface: FindSurface | null): void;
}

/** Absent outside a pane, where a rendered body has nothing to be found in. */
export const FindSurfaceContext = createContext<FindSurfaceSink | null>(null);

/**
 * The sink of the enclosing pane.
 * @returns the sink, or null when this body is mounted outside a preview pane.
 */
export function useFindSurfaceSink(): FindSurfaceSink | null {
  return useContext(FindSurfaceContext);
}
