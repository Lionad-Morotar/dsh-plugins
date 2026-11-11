/**
 * The preview's heavy half, fetched only when a file is selected.
 *
 * Two renderers share this chunk because they share the same trigger: a reader
 * who opens a source file needs CodeMirror, a reader who opens a README needs
 * the GFM renderer, and either way the fetch is one page-lifetime decision.
 *
 * No grammar lives here. A file whose language has its own chunk is drawn by
 * that chunk instead, which carries the grammar and the editor it needs in one
 * bundle; this chunk draws the monochrome fallback for everything else, plus the
 * GFM reader. The split is why a reader who opens a `.py` file never downloads
 * the json, css, html, markdown or yaml grammars.
 */
import { Compartment, EditorState, type Extension } from "@codemirror/state";
import { EditorView, lineNumbers } from "@codemirror/view";
import { HighlightStyle, syntaxHighlighting } from "@codemirror/language";
import { tags } from "@lezer/highlight";

import type { CodePreviewHandle, CodePreviewOptions, PreviewChunkModule } from "../preview-chunk.ts";
import { boot as bootChunkLoader, type LoaderRequire } from "./boot.ts";
import { MarkdownView } from "./markdown-view.tsx";

/**
 * The GFM reader lives in its own module so a test can mount it without pulling
 * CodeMirror in; re-exported here because this chunk is where the pane looks for
 * it, and the chunk's export shape must not move.
 */
export { MarkdownView } from "./markdown-view.tsx";
export type { MarkdownViewProps } from "./markdown-view.tsx";

/**
 * The chunk's own handle on the diagram loader.
 *
 * Re-exported rather than left to `boot.ts` alone because this chunk is what
 * fetches the renderer: naming the loader here is what keeps the build's route
 * assertion meaningful, and it is the entry the Markdown reader calls once a
 * fence asks for a diagram.
 */
export { loadMermaidChunk } from "./boot.ts";

/** Marker the build asserts and the pane exposes as `data-renderer`. */
export const renderer = "codemirror" as const;

/**
 * Colours come from the shell's tokens so the editor follows the theme.
 *
 * `defaultHighlightStyle` is tuned for one background; this table resolves
 * through the same `--dsw-alias-*` variables as the rest of the panel.
 */
const highlightStyle = HighlightStyle.define([
  { tag: [tags.keyword, tags.modifier, tags.operatorKeyword], color: "var(--fx-syn-keyword)" },
  { tag: [tags.string, tags.special(tags.string), tags.regexp], color: "var(--fx-syn-string)" },
  { tag: [tags.number, tags.bool, tags.null, tags.atom], color: "var(--fx-syn-number)" },
  { tag: [tags.comment, tags.lineComment, tags.blockComment], color: "var(--fx-syn-comment)", fontStyle: "italic" },
  { tag: [tags.function(tags.variableName), tags.function(tags.propertyName)], color: "var(--fx-syn-function)" },
  { tag: [tags.typeName, tags.className, tags.namespace, tags.tagName], color: "var(--fx-syn-type)" },
  { tag: [tags.propertyName, tags.attributeName], color: "var(--fx-syn-property)" },
  { tag: [tags.heading, tags.strong], color: "var(--fx-syn-heading)", fontWeight: "600" },
  { tag: [tags.link, tags.url], color: "var(--fx-syn-link)", textDecoration: "underline" },
  { tag: tags.invalid, color: "var(--fx-syn-invalid)" },
]);

const editorTheme = EditorView.theme(
  {
    "&": {
      height: "100%",
      backgroundColor: "transparent",
      color: "var(--fx-text)",
      fontSize: "12px",
    },
    "&.cm-focused": { outline: "none" },
    ".cm-scroller": {
      fontFamily: "var(--fx-mono)",
      lineHeight: "1.55",
      overflow: "auto",
    },
    ".cm-content": { padding: "10px 0 48px", caretColor: "transparent" },
    ".cm-gutters": {
      backgroundColor: "transparent",
      color: "var(--fx-caption)",
      borderRight: "1px solid var(--fx-border-soft)",
    },
    ".cm-lineNumbers .cm-gutterElement": { padding: "0 10px 0 12px", minWidth: "3ch" },
    ".cm-activeLine": { backgroundColor: "transparent" },
    ".cm-activeLineGutter": { backgroundColor: "transparent", color: "var(--fx-text-2)" },
  },
  { dark: false },
);

/**
 * Mount one read-only editor over one page.
 *
 * Line numbers carry the page's absolute offset, so page two starts at 201
 * rather than at 1. The gutter sits in a compartment because the page can move
 * without the document identity changing.
 *
 * The editor is monochrome by construction: no grammar is passed and none can be
 * added later, because a grammar built in another chunk cannot be accepted here
 * (each chunk inlines its own CodeMirror core). A file that should be coloured
 * is drawn by its language chunk, which mounts its own editor.
 * @param host - the element the editor fills.
 * @param options - page text, path and first line.
 * @returns the update/destroy handle.
 */
export function mountCodePreview(host: HTMLElement, options: CodePreviewOptions): CodePreviewHandle {
  const gutter = new Compartment();
  const view = new EditorView({
    parent: host,
    state: EditorState.create({
      doc: options.text,
      extensions: [
        EditorState.readOnly.of(true),
        EditorView.editable.of(false),
        gutter.of(lineNumbers({ formatNumber: line => String(line + options.offset - 1) })),
        syntaxHighlighting(highlightStyle),
        editorTheme,
      ],
    }),
  });
  return {
    update(text, offset) {
      view.dispatch({
        changes: { from: 0, to: view.state.doc.length, insert: text },
        effects: gutter.reconfigure(lineNumbers({ formatNumber: line => String(line + offset - 1) })),
      });
      view.scrollDOM.scrollTop = 0;
    },
    revealRange(from, to) {
      const length = view.state.doc.length;
      // A page change lands between the find bar's read and this dispatch, so
      // the interval is clamped rather than trusted; a selection is not worth
      // throwing over.
      const start = Math.max(0, Math.min(from, length));
      const end = Math.max(start, Math.min(to, length));
      view.dispatch({
        selection: { anchor: start, head: end },
        scrollIntoView: true,
      });
    },
    clearSelection() {
      // Collapsing in place keeps the reader where they were reading; a find
      // that jumps the viewport back on close would lose that place.
      const head = view.state.selection.main.head;
      view.dispatch({ selection: { anchor: head } });
    },
    destroy() {
      view.destroy();
    },
  };
}

/**
 * Take the loader require into this bundle.
 *
 * The chunk is its own bundle with its own copy of `chunk/boot.ts`, so the `boot`
 * the startup entry calls never reaches it. `loadPreviewChunk` calls this one
 * when it resolves the chunk, which is what lets a diagram fetch the mermaid
 * chunk at all.
 * @param require - the loader's require, with `async` attached.
 */
export function boot(require: LoaderRequire): void {
  bootChunkLoader(require);
}

const chunkModule: PreviewChunkModule = { renderer, mountCodePreview, MarkdownView, boot };

export default chunkModule;
