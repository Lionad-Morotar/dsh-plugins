/**
 * The editor every editable language block mounts.
 *
 * This module is copied into each of the four blocks on purpose. A chunk is its
 * own bundle and the host seeds no `@codemirror/*`, so a grammar built in one
 * chunk cannot be handed to an editor built in another: both would inline their
 * own CodeMirror core and the extension identity check would fail. The editor and
 * its grammar therefore have to be born in the same bundle, which is why this
 * lives here rather than only in the shell.
 *
 * What it owns is everything language-independent: the colour table, the base
 * extension stack (history, save chord, half-viewport paging, selection drawing),
 * the change sink, and the annotation that marks an external write. The shell
 * imports the same colour table and the same annotation, so a `.rs` file and a
 * `.md` file page, save and colour identically.
 */
import { defaultKeymap, history } from "@codemirror/commands";
import { HighlightStyle, syntaxHighlighting } from "@codemirror/language";
import { Annotation, EditorSelection, EditorState, type Extension } from "@codemirror/state";
import { EditorView, drawSelection, keymap, type KeyBinding } from "@codemirror/view";
import { tags } from "@lezer/highlight";

import type { EditableHandle, EditableMountOptions } from "../contracts.ts";

// Re-exported so a block (and its test) can name the handle without reaching
// into the contracts module for a type it only ever receives from here.
export type { EditableHandle, EditableMountOptions } from "../contracts.ts";

/**
 * Marks a document replacement the editor made itself, not the reader.
 *
 * Exported because the shell defines its own editor and must use the same
 * annotation: two annotations with the same name are still two identities, and a
 * transaction carrying the wrong one would echo an external write back as a user
 * edit.
 */
export const ExternalChange = Annotation.define<boolean>();

/**
 * Colours come from the shell's tokens so the editor follows the theme.
 *
 * `defaultHighlightStyle` is tuned for one background; this table resolves
 * through the same `--fmd-syn-*` variables as the rest of the panel. It is the
 * only colour table in the package: the shell imports this one rather than
 * keeping a second copy, because two tables drift and then the same token is two
 * colours on two surfaces.
 */
export const EDITOR_HIGHLIGHT_STYLE = HighlightStyle.define([
  { tag: [tags.keyword, tags.modifier, tags.operatorKeyword], color: "var(--fmd-syn-keyword)" },
  { tag: [tags.string, tags.special(tags.string), tags.regexp], color: "var(--fmd-syn-string)" },
  { tag: [tags.number, tags.bool, tags.null, tags.atom], color: "var(--fmd-syn-number)" },
  { tag: [tags.comment, tags.lineComment, tags.blockComment], color: "var(--fmd-syn-comment)", fontStyle: "italic" },
  { tag: [tags.function(tags.variableName), tags.function(tags.propertyName)], color: "var(--fmd-syn-function)" },
  { tag: [tags.typeName, tags.className, tags.namespace, tags.tagName], color: "var(--fmd-syn-type)" },
  { tag: [tags.propertyName, tags.attributeName], color: "var(--fmd-syn-property)" },
  { tag: [tags.heading, tags.strong], color: "var(--fmd-syn-heading)", fontWeight: "600" },
  { tag: [tags.link, tags.url], color: "var(--fmd-syn-link)", textDecoration: "underline" },
  { tag: tags.invalid, color: "var(--fmd-syn-invalid)" },
]);

/**
 * The save chord, as a keymap entry rather than a DOM listener.
 *
 * `preventDefault` is the whole point: the editor holds an unsaved draft, so
 * letting the browser or the host shell answer ⌘S first would offer to save a
 * page or open a file dialog instead of writing this document.
 * @param onSave - the session write the body handed down.
 * @returns the binding for `Mod-s` (Command on macOS, Control elsewhere).
 */
function saveKeyBinding(onSave: () => void): KeyBinding {
  return {
    key: "Mod-s",
    preventDefault: true,
    run: () => {
      onSave();
      return true;
    },
  };
}

/**
 * PageUp/PageDown as half a viewport of caret travel, with the view following.
 *
 * CodeMirror's default bindings move the caret by a whole viewport, and a full
 * page leaves no shared line between the screen before and the screen after: the
 * line being read is gone and has to be found again. Half a viewport keeps the
 * upper half in place, which is what makes paging readable at speed.
 * @returns the four page bindings, ahead of the default whole-page ones.
 */
function pageKeyBindings(): KeyBinding[] {
  return [
    pageKey("PageUp", -1, false),
    pageKey("PageDown", 1, false),
    pageKey("Shift-PageUp", -1, true),
    pageKey("Shift-PageDown", 1, true),
  ];
}

function pageKey(key: string, direction: -1 | 1, extend: boolean): KeyBinding {
  return {
    key,
    preventDefault: true,
    run: view => {
      pageCaret(view, direction, extend);
      return true;
    },
  };
}

/**
 * Walk the caret half a viewport of lines along the document.
 *
 * Rows are measured from the scroll viewport rather than from the caret's own
 * line box: the step is "half of what is on screen", so a short window pages
 * fewer lines than a tall one without any extra configuration. The walk stops
 * early at either end of the document, where `moveVertically` reports the same
 * position twice.
 */
function pageCaret(view: EditorView, direction: -1 | 1, extend: boolean): void {
  const lineHeight = view.defaultLineHeight > 0 ? view.defaultLineHeight : 20;
  const rows = Math.max(1, Math.round(view.scrollDOM.clientHeight / 2 / lineHeight));
  const main = view.state.selection.main;
  let caret = EditorSelection.cursor(main.head);
  for (let row = 0; row < rows; row += 1) {
    const next = view.moveVertically(caret, direction > 0, lineHeight);
    if (next.head === caret.head) break;
    caret = next;
  }
  view.dispatch({
    selection: { anchor: extend ? main.anchor : caret.head, head: caret.head },
    scrollIntoView: true,
  });
}

/**
 * The language-independent extension stack.
 *
 * Everything a language block and the shell have in common lives here, so the two
 * cannot drift on paging, saving or the change sink.
 * @param options - the sinks the shell handed down.
 * @param text - the document, so its line separator can be preserved.
 * @returns the extensions, without any grammar.
 */
export function editorBaseExtensions(options: EditableMountOptions, text: string): Extension[] {
  // CodeMirror normalizes every line break to \n when it builds a state.
  // Remembering the document's own separator here is what keeps a one-character
  // edit in a CRLF file from rewriting every line of it.
  const lineSeparator = text.includes("\r\n") ? "\r\n" : undefined;
  return [
    ...(lineSeparator === undefined ? [] : [EditorState.lineSeparator.of(lineSeparator)]),
    history(),
    keymap.of([saveKeyBinding(() => options.onSave())]),
    // Ahead of `defaultKeymap`: both bind the page keys, and the first matching
    // binding wins.
    keymap.of(pageKeyBindings()),
    keymap.of(defaultKeymap),
    drawSelection(),
    EditorView.lineWrapping,
    syntaxHighlighting(EDITOR_HIGHLIGHT_STYLE),
    EditorView.updateListener.of(update => {
      if (!update.docChanged) return;
      // Every document change, user or external, is a new text the find counter
      // was not taken against. Ask for a recount before the user-edit filter
      // below, which exists for the draft store, not for the bar.
      options.onFindInvalidate();
      if (update.transactions.some(transaction => transaction.annotation(ExternalChange) === true)) return;
      // `sliceDoc` rebuilds the text with the separator the state was created
      // with, so a CRLF file stays CRLF.
      options.onChange(update.state.sliceDoc());
    }),
  ];
}

/**
 * Mount one editable editor with its grammar already in place.
 *
 * The grammar goes straight into the extension array rather than into a
 * compartment: it is built in this bundle by the caller, so there is nothing to
 * wait for and nothing to swap in later.
 * @param host - the element the editor fills.
 * @param options - the document, its language and the shell's sinks.
 * @param grammar - the language extension, built in this same bundle.
 * @returns the handle the shell keeps while the document is open.
 */
export function mountEditable(host: HTMLElement, options: EditableMountOptions, grammar: Extension): EditableHandle {
  // The host arrives bare. The stylesheet defines the whole `--fmd-*` set on
  // `.fmd-read, .fmd-source-editor`, so without these classes every syntax colour
  // falls back to currentColor and the document paints one flat colour.
  host.classList.add("fmd-editor", "fmd-source-editor");
  const view = new EditorView({
    parent: host,
    state: EditorState.create({
      doc: options.text,
      extensions: [...editorBaseExtensions(options, options.text), grammar],
    }),
  });

  return {
    setText(text) {
      if (view.state.sliceDoc() === text) return;
      // The annotation is what keeps this write out of the draft store: it is the
      // shell's own text coming back, not a keystroke.
      view.dispatch({
        changes: { from: 0, to: view.state.doc.length, insert: text },
        annotations: ExternalChange.of(true),
      });
    },
    revealRange(from, to) {
      const length = view.state.doc.length;
      // A page change can land between the find bar's read and this dispatch, so
      // the interval is clamped rather than trusted.
      const start = Math.max(0, Math.min(from, length));
      const end = Math.max(start, Math.min(to, length));
      view.dispatch({ selection: { anchor: start, head: end }, scrollIntoView: true });
    },
    clearSelection() {
      // Collapsing in place keeps the reader where they were reading.
      const head = view.state.selection.main.head;
      view.dispatch({ selection: { anchor: head } });
    },
    focus() {
      view.focus();
    },
    destroy() {
      view.destroy();
    },
  };
}
