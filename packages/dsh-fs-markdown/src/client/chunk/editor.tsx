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
import { yaml } from "@codemirror/lang-yaml";
import { HighlightStyle, syntaxHighlighting } from "@codemirror/language";
import { Annotation, Compartment, EditorState, type Extension } from "@codemirror/state";
import { Decoration, EditorView, drawSelection, keymap, type KeyBinding } from "@codemirror/view";
import { tags } from "@lezer/highlight";
import { useEffect, useRef, type ReactElement } from "react";

import { CLASS_NAMES } from "../classes.ts";
import type { EditorBodyProps } from "../contracts.ts";
import { planDecorations } from "../decorations.ts";
import { languageOf, type EditorLanguage } from "../language.ts";
import { TableWidget } from "../table-widget.ts";
import { planTables, tableIntersects } from "../tables.ts";

/** Marks a document replacement this component made itself, not the reader. */
const ExternalChange = Annotation.define<boolean>();

/**
 * Colours come from the shell's tokens so the editor follows the theme.
 *
 * `defaultHighlightStyle` is tuned for one background; this table resolves
 * through the same `--dsw-alias-*` variables as the rest of the panel.
 */
const highlightStyle = HighlightStyle.define([
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
 * The parser for one language id.
 *
 * `plaintext` is an empty extension rather than a null language: the file stays
 * editable, it just gets no parser, which is the honest answer for a suffix this
 * editor has no grammar for.
 * @param language - id resolved from the path.
 * @returns the extension to install in the language compartment.
 */
function languageExtension(language: EditorLanguage): Extension {
  switch (language) {
    case "javascript":
      return javascript({ jsx: true, typescript: true });
    case "json":
      return json();
    case "markdown":
      return markdown();
    case "css":
      return css();
    case "html":
      return html();
    case "yaml":
      return yaml();
    default:
      return [];
  }
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
          keymap.of(defaultKeymap),
          drawSelection(),
          EditorView.lineWrapping,
          languageCompartment.current.of(languageExtension(language)),
          syntaxHighlighting(highlightStyle),
          decorationCompartment.current.of(decorationExtension(decorate && mode === "reading")),
          EditorView.updateListener.of(update => {
            if (!update.docChanged) return;
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
      effects: languageCompartment.current.reconfigure(languageExtension(language)),
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
      className="fmd-editor"
      data-testid="fs-md-editor"
      data-mode={mode}
      data-renderer="codemirror"
      ref={host}
    />
  );
}

const chunkModule = { renderer: "codemirror" as const, EditorBody };

export default chunkModule;
