/**
 * The dependency-free Markdown reading renderer.
 *
 * Markdown arrives before the preview chunk does: a page is already in memory
 * the moment a file is selected, so the first paint should not wait for a
 * half-megabyte editor. This module renders the subset a README actually uses
 * (headings, paragraphs, lists, quotes, fenced code, inline emphasis and links)
 * into a React element tree. It never builds HTML strings, so raw HTML in the
 * document is inert text by construction rather than by a sanitiser.
 *
 * The chunk upgrades this first paint to `react-markdown` + `remark-gfm`, which
 * adds tables, task lists and the rest of GFM. Both paths share one rule: no
 * `dangerouslySetInnerHTML`, no `innerHTML`, no event attributes.
 */
import { createElement, type ReactElement, type ReactNode } from "react";

/** A plain element descriptor, used when the platform React does not materialize elements. */
interface ElementDescriptor {
  readonly type: string;
  readonly props: Record<string, unknown>;
  readonly key: null;
}

/**
 * Create one element without ever falling back to an HTML string.
 *
 * In the browser `createElement` answers a real React element. The acceptance
 * probe hands the bundle a React stand-in whose `createElement` answers `null`;
 * a descriptor with the same `type` and `props` keeps the tree observable
 * there, which is exactly what the "no raw HTML" assertion walks.
 * @param type - host element name.
 * @param props - attributes; event handlers are never passed by this module.
 * @param children - already-built child nodes.
 * @returns a React element, or its descriptor under a non-materializing React.
 */
function element(type: string, props: Record<string, unknown> | null, ...children: ReactNode[]): ReactElement {
  const kids = children.filter(child => child !== null && child !== undefined && child !== false);
  const built = createElement(type, props ?? undefined, ...(kids as ReactNode[]));
  if (built !== null && typeof built === "object") return built;
  const nextProps: Record<string, unknown> = { ...(props ?? {}) };
  if (kids.length === 1) nextProps.children = kids[0];
  else if (kids.length > 1) nextProps.children = kids;
  return { type, props: nextProps, key: null } as unknown as ElementDescriptor as ReactElement;
}

/** Only absolute web links, mail, and same-document paths survive. */
function safeHref(raw: string): string | undefined {
  const href = raw.trim();
  if (href === "" || href.startsWith("//")) return undefined;
  if (/^(https?:|mailto:)/iu.test(href)) return href;
  if (href.startsWith("/") || href.startsWith("#") || href.startsWith("./") || href.startsWith("../")) return href;
  return undefined;
}

const INLINE = /(`[^`\n]+`|\*\*[^*\n]+\*\*|__[^_\n]+__|~~[^~\n]+~~|\*[^*\n]+\*|_[^_\n]+_|\[[^\]\n]+\]\([^)\n]+\))/gu;

/**
 * Render one line's inline markup.
 * @param text - the line's text.
 * @returns text and inline elements in source order.
 */
export function renderInline(text: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let cursor = 0;
  for (const match of text.matchAll(INLINE)) {
    const start = match.index ?? 0;
    if (start > cursor) nodes.push(text.slice(cursor, start));
    const token = match[0];
    if (token.startsWith("`")) {
      nodes.push(element("code", null, token.slice(1, -1)));
    } else if (token.startsWith("**") || token.startsWith("__")) {
      nodes.push(element("strong", null, ...renderInline(token.slice(2, -2))));
    } else if (token.startsWith("~~")) {
      nodes.push(element("del", null, ...renderInline(token.slice(2, -2))));
    } else if (token.startsWith("*") || token.startsWith("_")) {
      nodes.push(element("em", null, ...renderInline(token.slice(1, -1))));
    } else {
      const link = /^\[([^\]]+)\]\(([^)]+)\)$/u.exec(token);
      const label = link?.[1] ?? token;
      const href = link === null ? undefined : safeHref(link[2] ?? "");
      nodes.push(href === undefined ? label : element("a", { href, rel: "noreferrer noopener" }, label));
    }
    cursor = start + token.length;
  }
  if (cursor < text.length) nodes.push(text.slice(cursor));
  return nodes;
}

const FENCE = /^\s{0,3}(`{3,}|~{3,})\s*([\w#+.-]*)\s*$/u;
const HEADING = /^\s{0,3}(#{1,6})\s+(.*?)\s*#*\s*$/u;
const RULE = /^\s{0,3}(?:(?:\*\s*){3,}|(?:-\s*){3,}|(?:_\s*){3,})$/u;
const QUOTE = /^\s{0,3}>\s?(.*)$/u;
const UNORDERED = /^\s{0,3}[-*+]\s+(.*)$/u;
const ORDERED = /^\s{0,3}\d+[.)]\s+(.*)$/u;

function isBlockStart(line: string): boolean {
  return (
    FENCE.test(line) ||
    HEADING.test(line) ||
    RULE.test(line) ||
    QUOTE.test(line) ||
    UNORDERED.test(line) ||
    ORDERED.test(line)
  );
}

/**
 * Render the block structure of a page.
 * @param lines - the page split by newline.
 * @returns one element per block.
 */
function renderBlocks(lines: readonly string[]): ReactNode[] {
  const blocks: ReactNode[] = [];
  let index = 0;
  while (index < lines.length) {
    const line = lines[index] ?? "";
    if (line.trim() === "") {
      index += 1;
      continue;
    }
    const fence = FENCE.exec(line);
    if (fence !== null) {
      const fenceChar = (fence[1] ?? "```").slice(0, 1);
      const language = fence[2] ?? "";
      const body: string[] = [];
      index += 1;
      while (index < lines.length && !new RegExp(`^\\s{0,3}${fenceChar}{3,}\\s*$`, "u").test(lines[index] ?? "")) {
        body.push(lines[index] ?? "");
        index += 1;
      }
      index += 1;
      blocks.push(
        element("pre", null, element("code", language === "" ? null : { className: `language-${language}` }, body.join("\n"))),
      );
      continue;
    }
    const heading = HEADING.exec(line);
    if (heading !== null) {
      const level = (heading[1] ?? "#").length;
      blocks.push(element(`h${String(level)}`, null, ...renderInline(heading[2] ?? "")));
      index += 1;
      continue;
    }
    if (RULE.test(line)) {
      blocks.push(element("hr", null));
      index += 1;
      continue;
    }
    if (QUOTE.test(line)) {
      const body: string[] = [];
      while (index < lines.length) {
        const quote = QUOTE.exec(lines[index] ?? "");
        if (quote === null) break;
        body.push(quote[1] ?? "");
        index += 1;
      }
      blocks.push(element("blockquote", null, ...renderBlocks(body)));
      continue;
    }
    const unordered = UNORDERED.exec(line);
    if (unordered !== null) {
      const items: ReactNode[] = [];
      while (index < lines.length) {
        const item = UNORDERED.exec(lines[index] ?? "");
        if (item === null) break;
        items.push(element("li", null, ...renderInline(item[1] ?? "")));
        index += 1;
      }
      blocks.push(element("ul", null, ...items));
      continue;
    }
    const ordered = ORDERED.exec(line);
    if (ordered !== null) {
      const items: ReactNode[] = [];
      while (index < lines.length) {
        const item = ORDERED.exec(lines[index] ?? "");
        if (item === null) break;
        items.push(element("li", null, ...renderInline(item[1] ?? "")));
        index += 1;
      }
      blocks.push(element("ol", null, ...items));
      continue;
    }
    const paragraph: string[] = [line.trim()];
    index += 1;
    while (index < lines.length) {
      const next = lines[index] ?? "";
      if (next.trim() === "" || isBlockStart(next)) break;
      paragraph.push(next.trim());
      index += 1;
    }
    blocks.push(element("p", null, ...renderInline(paragraph.join(" "))));
  }
  return blocks;
}

/**
 * Render Markdown into a React element tree.
 *
 * This is the preview's instant reading mode and its permanent fallback when
 * the heavy renderer cannot be fetched. Raw HTML is never parsed, so a
 * `<script>` or an `onerror` payload in the source is displayed as literal text.
 * @param source - Markdown text.
 * @returns a `div.fx-md` element holding the document.
 */
export function renderMarkdown(source: string): ReactElement {
  const lines = source.replace(/\r\n?/gu, "\n").split("\n");
  return element("div", { className: "fx-md" }, ...renderBlocks(lines));
}
