/**
 * The editable Markdown surface.
 *
 * This is the only module in the package that imports CodeMirror, and it lives
 * in a lazy chunk: a reader who never opens a Markdown file pays neither the
 * parser nor the editor. The document stays the literal source; what changes is
 * the decoration plan — markers in the cursor's block stay visible, every other
 * block renders as formatted text.
 *
 * The same `EditorView` serves both modes. Source mode is not a second editor
 * with a second history: it reconfigures the decoration compartment to an empty
 * extension, so switching modes preserves scroll, selection and undo.
 */
import { defaultKeymap, history } from "@codemirror/commands";
import { markdown } from "@codemirror/lang-markdown";
import { Annotation, Compartment, EditorState, type Extension } from "@codemirror/state";
import { Decoration, EditorView, drawSelection, keymap } from "@codemirror/view";
import { useEffect, useRef, type ReactElement } from "react";

import type { EditorBodyProps } from "../contracts.ts";
import { planDecorations, type DecorationStyle } from "../decorations.ts";

/** Marks a document replacement this component made itself, not the reader. */
const ExternalChange = Annotation.define<boolean>();

/** Planner vocabulary to the CSS class the stylesheet defines. */
const CLASS_NAMES: Readonly<Record<DecorationStyle, string>> = {
  heading1: "fmd-h1",
  heading2: "fmd-h2",
  heading3: "fmd-h3",
  heading4: "fmd-h4",
  heading5: "fmd-h5",
  heading6: "fmd-h6",
  strong: "fmd-strong",
  em: "fmd-em",
  code: "fmd-code",
  link: "fmd-link",
  quote: "fmd-quote",
  "list-marker": "fmd-list-marker",
  "code-block": "fmd-code-block",
};

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
    const ranges = planDecorations(state.doc.toString(), state.selection.main).map(range =>
      range.kind === "hide"
        ? Decoration.replace({}).range(range.from, range.to)
        : Decoration.mark({ class: CLASS_NAMES[range.style ?? "code"] }).range(range.from, range.to),
    );
    return Decoration.set(ranges, true);
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
  const { text, mode, visible } = props;
  const host = useRef<HTMLDivElement>(null);
  const view = useRef<EditorView | null>(null);
  const decorationCompartment = useRef(new Compartment());
  const onChange = useRef(props.onChange);
  onChange.current = props.onChange;

  useEffect(() => {
    const element = host.current;
    if (element === null) return;
    const created = new EditorView({
      parent: element,
      state: EditorState.create({
        doc: text,
        extensions: [
          history(),
          keymap.of(defaultKeymap),
          drawSelection(),
          EditorView.lineWrapping,
          markdown(),
          decorationCompartment.current.of(decorationExtension(mode === "reading")),
          EditorView.updateListener.of(update => {
            if (!update.docChanged) return;
            if (update.transactions.some(transaction => transaction.annotation(ExternalChange) === true)) return;
            onChange.current(update.state.doc.toString());
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
    // applied as transactions so they never rebuild it.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const current = view.current;
    if (current === null) return;
    if (current.state.doc.toString() === text) return;
    current.dispatch({
      changes: { from: 0, to: current.state.doc.length, insert: text },
      annotations: ExternalChange.of(true),
    });
  }, [text]);

  useEffect(() => {
    const current = view.current;
    if (current === null) return;
    current.dispatch({
      effects: decorationCompartment.current.reconfigure(decorationExtension(mode === "reading")),
    });
  }, [mode]);

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
