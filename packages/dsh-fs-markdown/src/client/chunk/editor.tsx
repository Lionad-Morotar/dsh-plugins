/**
 * The editable text surface.
 *
 * This is the only module in the package that imports CodeMirror, and it lives
 * in a lazy chunk: a reader who never opens an editable file pays neither the
 * parser nor the editor. The document stays the literal source.
 *
 * Two presentations come out of one view. Markdown turns the decoration layer on:
 * markers in the cursor's block stay visible, every other block renders as
 * formatted text. Every other text file turns it off and gets syntax highlighting
 * instead, because the planner behind that layer understands Markdown only and
 * would hide characters it mistook for markers.
 *
 * The same `EditorView` serves both modes. Source mode is not a second editor
 * with a second history: it reconfigures the decoration compartment to an empty
 * extension, so switching modes preserves scroll, selection and undo.
 */
import { defaultKeymap, history } from "@codemirror/commands";
import { css } from "@codemirror/lang-css";
import { html } from "@codemirror/lang-html";
import { javascript } from "@codemirror/lang-javascript";
import { json } from "@codemirror/lang-json";
import { markdown } from "@codemirror/lang-markdown";
import { python } from "@codemirror/lang-python";
import { yaml } from "@codemirror/lang-yaml";
import { syntaxHighlighting } from "@codemirror/language";
import { Compartment, EditorSelection, EditorState, type Extension } from "@codemirror/state";
import { Decoration, EditorView, drawSelection, keymap, type KeyBinding } from "@codemirror/view";
import { useEffect, useRef, type ReactElement } from "react";

import { CLASS_NAMES } from "../classes.ts";
import type { EditorBodyProps } from "../contracts.ts";
import { planDecorations } from "../decorations.ts";
import { BLOCK_ASSIGNMENT } from "dsh-text-languages/catalog.ts";

import { ExternalChange, EDITOR_HIGHLIGHT_STYLE } from "./editor-kit.tsx";
import { languageOf, type EditorLanguage } from "../language.ts";
import { TableWidget } from "../table-widget.ts";
import { planTables, tableIntersects } from "../tables.ts";

/**
 * The colour table and the external-write annotation come from the editor kit.
 *
 * Both are shared with the four editable language blocks. A second colour table
 * here would drift from the blocks and paint the same token two ways; a second
 * annotation would carry a different identity, so a write marked by one would
 * echo back as a user edit through the other.
 */
const highlightStyle = EDITOR_HIGHLIGHT_STYLE;

/**
 * One grammar per block.
 *
 * Keyed by block name rather than language id, because a block is what the
 * catalogue actually assigns and several languages share one. `vue` is drawn by
 * the html block, so keying by id would need an entry per alias and would drift
 * the moment the catalogue learned a new one; keying by block asks the catalogue
 * which block a language belongs to and then looks that block up.
 *
 * The four javascript dialects are one package with different flags, and the
 * flags are the whole difference: `.js` used to be parsed with both JSX and
 * TypeScript on, which made type annotations look valid in a plain script and
 * accepted JSX in a file that has none. VS Code parses `.js` as plain
 * JavaScript, and so does this.
 */
const BLOCK_GRAMMARS: Readonly<Record<string, () => Extension>> = {
  javascript: () => javascript({}),
  javascriptreact: () => javascript({ jsx: true }),
  typescript: () => javascript({ typescript: true }),
  typescriptreact: () => javascript({ typescript: true, jsx: true }),
  json: () => json(),
  markdown: () => markdown(),
  css: () => css(),
  html: () => html(),
  yaml: () => yaml(),
  python: () => python(),
};

/**
 * The parser for one language id.
 *
 * Two lookups: the catalogue says which block the language belongs to, and the
 * table above says which grammar that block installs. An id with no block, or a
 * block this table does not carry, gets an empty extension rather than a null
 * language: the file stays editable, it just gets no parser, which is the honest
 * answer for something this editor has no grammar for.
 *
 * The four batch blocks (`batch-systems`, `batch-script`, `batch-webstyle`,
 * `batch-datadoc`) are deliberately absent. Their grammars live inside the
 * read-only chunk, which carries its own editor; this surface is one bundle that
 * holds its grammars statically, so importing them here would put every batch
 * grammar into the `.md` first-open cost. Widening the edit surface is a later
 * slice's problem, and until then those files stay monochrome here.
 * @param id - language id resolved from the path.
 * @returns the extension to install in the language compartment.
 */
export function grammarFor(id: EditorLanguage): Extension {
  const block = BLOCK_ASSIGNMENT[id];
  if (block === undefined) return [];
  const factory = BLOCK_GRAMMARS[block];
  return factory === undefined ? [] : factory();
}

/**
 * Turn the pure plan into CodeMirror decorations.
 *
 * `compute` runs on document and selection changes only; viewport-dependent
 * decorations must not come from here, so every range is clamped to the
 * document by the planner before it gets this far.
 */
function decorationExtension(enabled: boolean): Extension {
  return EditorView.decorations.compute(["doc", "selection"], state => {
    if (!enabled) return Decoration.none;
    const text = state.doc.toString();
    const selection = state.selection.main;
    const ranges = planDecorations(text, selection).map(range =>
      range.kind === "hide"
        ? Decoration.replace({}).range(range.from, range.to)
        : Decoration.mark({ class: CLASS_NAMES[range.style ?? "code"] }).range(range.from, range.to),
    );
    // Every table the selection does not touch is painted as a block widget in
    // place of its source. The planner leaves those lines unstyled, so a
    // replacement and a mark can never overlap on the same line.
    for (const table of planTables(text)) {
      if (tableIntersects(table, selection)) continue;
      ranges.push(Decoration.replace({ widget: new TableWidget(table, text), block: true }).range(table.from, table.to));
    }
    ranges.sort((left, right) => left.from - right.from);
    return Decoration.set(ranges, true);
  });
}

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
 * page leaves no shared line between the screen before and the screen after:
 * the line being read is gone and has to be found again. Half a viewport keeps
 * the upper half in place, which is what makes paging readable at speed.
 *
 * The caret leads and the view follows it, in that order. The selection is
 * dispatched first and `scrollIntoView` brings the new position onto the
 * screen, so after the stroke the caret still sits on the line the reader was
 * reading. Shift extends the selection by the same half viewport.
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
 * Mount the editor for one document.
 *
 * The view is created once; text and mode arrive as effects afterwards. That is
 * what lets a parent re-render on every keystroke without destroying the
 * selection, the undo history or the scroll position.
 * @param props - renderer props plus the live text and the change sink.
 * @returns the editor host element.
 */
export function EditorBody(props: EditorBodyProps): ReactElement {
  const { text, mode, visible, path } = props;
  // Markdown is the only family whose planner understands the document, so the
  // decoration layer is on only when the caller asked for it.
  const decorate = props.decorate !== false;
  const language = languageOf(path);
  const host = useRef<HTMLDivElement>(null);
  const view = useRef<EditorView | null>(null);
  const decorationCompartment = useRef(new Compartment());
  const languageCompartment = useRef(new Compartment());
  const onChange = useRef(props.onChange);
  onChange.current = props.onChange;
  const onSave = useRef(props.onSave);
  onSave.current = props.onSave;
  const find = props.find;
  const findSink = useRef(props.find);
  findSink.current = props.find;

  useEffect(() => {
    const element = host.current;
    if (element === null) return;
    // CodeMirror normalizes every line break to \n when it builds a state.
    // Remembering the document's own separator here is what keeps a one-character
    // edit in a CRLF file from rewriting every line of it.
    const lineSeparator = text.includes("\r\n") ? "\r\n" : undefined;
    const created = new EditorView({
      parent: element,
      state: EditorState.create({
        doc: text,
        extensions: [
          ...(lineSeparator === undefined ? [] : [EditorState.lineSeparator.of(lineSeparator)]),
          history(),
          keymap.of([saveKeyBinding(() => onSave.current?.())]),
          // Ahead of `defaultKeymap`: both bind the page keys, and the first
          // matching binding wins.
          keymap.of(pageKeyBindings()),
          keymap.of(defaultKeymap),
          drawSelection(),
          EditorView.lineWrapping,
          languageCompartment.current.of(grammarFor(language)),
          syntaxHighlighting(highlightStyle),
          decorationCompartment.current.of(decorationExtension(decorate && mode === "reading")),
          EditorView.updateListener.of(update => {
            if (!update.docChanged) return;
            // Every document change, user or external, is a new text the find
            // counter was not taken against. Ask for a recount before the
            // user-edit filter below, which exists for the draft store, not
            // for the bar.
            findSink.current?.invalidate?.();
            if (update.transactions.some(transaction => transaction.annotation(ExternalChange) === true)) return;
            // `toString()` always joins with \n; sliceDoc rebuilds the text with
            // the separator the state was created with.
            onChange.current(update.state.sliceDoc());
          }),
        ],
      }),
    });
    view.current = created;
    return () => {
      created.destroy();
      view.current = null;
    };
    // The view is created once per mounted body; `text` and `mode` below are
    // applied as transactions so they never rebuild it. `language` and `decorate`
    // are read here for the same reason: a panel is mounted per file, so neither
    // can change under a live view.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const current = view.current;
    if (current === null) return;
    if (current.state.sliceDoc() === text) return;
    current.dispatch({
      changes: { from: 0, to: current.state.doc.length, insert: text },
      annotations: ExternalChange.of(true),
    });
  }, [text]);
  // The find bar searches this editor's whole document, not the page the pane's
  // pager holds and not the visible lines: the pane can read neither out of the
  // DOM of a virtualized view. Publishing the source here also keeps focus out
  // of the editor — a selection dispatched on an unfocused CodeMirror view is
  // not written into the contenteditable, so the find input keeps the keyboard
  // while the hit is still highlighted by the selection layer.
  useEffect(() => {
    const current = view.current;
    if (current === null || find === undefined) return;
    find.register({
      // The editor reads the whole file, unlike the pane's pager: say so, or a
      // long document's counter would claim "on this page" while counting
      // every line.
      scope: "document",
      // `doc.toString()` and not `sliceDoc()`: a CodeMirror position counts a
      // line break as one unit whatever the file's separator is, and the
      // document's own `toString()` uses the same \n. `sliceDoc()` returns
      // CRLF for a CRLF file, whose offsets would drift by one per line before
      // the hit and select the wrong text.
      text: () => current.state.doc.toString(),
      select: (from, to) => {
        const length = current.state.doc.length;
        const start = Math.max(0, Math.min(from, length));
        const end = Math.max(start, Math.min(to, length));
        current.dispatch({ selection: { anchor: start, head: end }, scrollIntoView: true });
      },
      clear: () => {
        // Collapsing in place keeps the reader where they were reading; a find
        // that jumped the viewport back on close would lose that place.
        const head = current.state.selection.main.head;
        current.dispatch({ selection: { anchor: head } });
      },
    });
    return () => find.register(null);
  }, [find]);

  useEffect(() => {
    const current = view.current;
    if (current === null) return;
    current.dispatch({
      effects: decorationCompartment.current.reconfigure(decorationExtension(decorate && mode === "reading")),
    });
  }, [mode, decorate]);

  useEffect(() => {
    const current = view.current;
    if (current === null) return;
    current.dispatch({
      effects: languageCompartment.current.reconfigure(grammarFor(language)),
    });
  }, [language]);

  useEffect(() => {
    // CodeMirror measures its viewport when it becomes visible again; a panel
    // mounted hidden would otherwise paint zero-height content forever.
    if (visible === false) return;
    view.current?.requestMeasure();
  }, [visible]);

  return (
    <div
      // The scope class is not decoration: the whole `--fmd-*` set, including the
      // ten syntax colours, is defined on `.fmd-read, .fmd-source-editor` in the
      // stylesheet. Without one of them on an ancestor every `var(--fmd-syn-*)`
      // falls back to `currentColor` and the editor paints one flat colour. The
      // body wrapper carries it too, but a body mounted on its own does not, so
      // the root has to carry it as well.
      className={`fmd-editor ${mode === "source" ? "fmd-source-editor" : "fmd-read"}`}
      data-testid="fs-md-editor"
      data-mode={mode}
      data-renderer="codemirror"
      ref={host}
    />
  );
}

const chunkModule = { renderer: "codemirror" as const, EditorBody };

export default chunkModule;
