/**
 * The read-only editor every language chunk mounts.
 *
 * This module is copied into each language chunk on purpose. A chunk is its own
 * bundle, and the host's `require` resolves only React and the primitive kit —
 * never `@codemirror/*`. So a grammar built in one chunk cannot be handed to an
 * editor built in another: both bundles inline their own CodeMirror core, and
 * `Facet`/`Compartment` identity fails across the boundary with "multiple
 * instances of @codemirror/state are loaded".
 *
 * The consequence is that the editor and the grammar have to be born in the same
 * bundle, which is why this file exists here rather than in the preview chunk.
 * The cost is one CodeMirror core per language chunk; that is the host contract's
 * price, not a mistake to optimise away.
 */
import { Compartment, EditorState, type Extension } from "@codemirror/state";
import { EditorView, lineNumbers } from "@codemirror/view";
import { HighlightStyle, syntaxHighlighting } from "@codemirror/language";
import { tags } from "@lezer/highlight";

/** What one mount needs: the page text, its path, and its first line number. */
export interface ReadOnlyOptions {
  readonly text: string;
  readonly path: string;
  /** First line of the page; the gutter starts numbering here. */
  readonly offset: number;
}

/** The handle a mounted read-only editor exposes. */
export interface ReadOnlyHandle {
  update(text: string, offset: number): void;
  /**
   * Select one half-open interval of the current page and bring it into view.
   *
   * `from` and `to` are page-text offsets, which the editor's document is a
   * verbatim copy of. It cannot change the document — the state is read-only
   * and this dispatches a selection only — so a find never marks a draft dirty.
   */
  revealRange(from: number, to: number): void;
  /** Collapse the selection in place, without moving the viewport. */
  clearSelection(): void;
  destroy(): void;
}

/**
 * Colours come from the shell's tokens so the editor follows the theme.
 *
 * `defaultHighlightStyle` is tuned for one background; this table resolves
 * through the same `--dsw-alias-*` variables as the rest of the panel. It is
 * duplicated per chunk along with everything else here, and must stay identical
 * to the copy in the preview chunk or the same file would colour differently
 * depending on which path drew it.
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
 * Mount one read-only editor with its grammar already in place.
 *
 * The grammar goes straight into the extension array rather than into a
 * compartment: it is built in this bundle by the caller, so there is nothing to
 * wait for and nothing to swap in later. Line numbers carry the page's absolute
 * offset, so page two starts at 201 rather than at 1.
 * @param host - the element the editor fills.
 * @param options - page text, path and first line.
 * @param grammar - the language extension, built in this same bundle.
 * @returns the update/destroy handle.
 */
export function mountReadOnly(host: HTMLElement, options: ReadOnlyOptions, grammar: Extension): ReadOnlyHandle {
  const gutter = new Compartment();
  const view = new EditorView({
    parent: host,
    state: EditorState.create({
      doc: options.text,
      extensions: [
        EditorState.readOnly.of(true),
        EditorView.editable.of(false),
        gutter.of(lineNumbers({ formatNumber: line => String(line + options.offset - 1) })),
        grammar,
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
