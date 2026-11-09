/**
 * The source pane's editor: a read-only CodeMirror with a line gutter, syntax
 * highlighting and the selected case's line marked.
 *
 * This module is loaded from a lazy chunk, and it is the only file in the
 * package that imports CodeMirror. The highlight palette resolves through the
 * board's `--tst-syn-*` variables, which in turn read the host's semantic
 * tokens, so the code follows the same light/dark palette as the rest of the
 * tab instead of shipping a second theme.
 */
import { javascript } from "@codemirror/lang-javascript";
import { HighlightStyle, syntaxHighlighting } from "@codemirror/language";
import { Compartment, EditorState, type Extension } from "@codemirror/state";
import { Decoration, EditorView, lineNumbers } from "@codemirror/view";
import { tags } from "@lezer/highlight";
import { useEffect, useRef, type ReactElement } from "react";

import type { CodeViewProps } from "./code-contract.ts";
import { codeLanguageOf } from "./code-language.ts";

/** Token colours, bound to the board's palette rather than a fixed theme. */
const highlightStyle = HighlightStyle.define([
  { tag: [tags.keyword, tags.modifier, tags.operatorKeyword], color: "var(--tst-syn-keyword)" },
  { tag: [tags.string, tags.special(tags.string), tags.regexp], color: "var(--tst-syn-string)" },
  { tag: [tags.number, tags.bool, tags.null, tags.atom], color: "var(--tst-syn-number)" },
  { tag: [tags.comment, tags.lineComment, tags.blockComment], color: "var(--tst-syn-comment)", fontStyle: "italic" },
  { tag: [tags.function(tags.variableName), tags.function(tags.propertyName)], color: "var(--tst-syn-function)" },
  { tag: [tags.typeName, tags.className, tags.namespace], color: "var(--tst-syn-type)" },
  { tag: [tags.propertyName, tags.attributeName], color: "var(--tst-syn-property)" },
  { tag: tags.invalid, color: "var(--tst-syn-invalid)" },
]);

/** Marks the selected case's line; the palette supplies its background. */
const activeLineDecoration = Decoration.line({ class: "tst-code-active-line" });

/** Re-created whenever the selected case moves, so the old mark disappears. */
const activeLineCompartment = new Compartment();

/**
 * The grammar for one test path.
 * @param path - repo-relative test path.
 * @returns the language extension.
 */
function languageExtension(path: string): Extension {
  const language = codeLanguageOf(path);
  return javascript({
    typescript: language === "typescript" || language === "tsx",
    jsx: language === "tsx" || language === "jsx",
  });
}

/**
 * Decoration for one 1-based line, clamped to the document.
 * @param line - the line to mark, or undefined for none.
 * @returns the extension installed in the compartment.
 */
function activeLineExtension(line: number | undefined): Extension {
  if (line === undefined) return [];
  return EditorView.decorations.compute(["doc"], state => {
    const target = Math.min(Math.max(1, Math.trunc(line)), state.doc.lines);
    return Decoration.set([activeLineDecoration.range(state.doc.line(target).from)]);
  });
}

/**
 * Scroll one line to the middle of the viewport.
 * @param view - the editor view.
 * @param line - the 1-based line to reveal.
 */
function revealLine(view: EditorView, line: number): void {
  const target = Math.min(Math.max(1, Math.trunc(line)), view.state.doc.lines);
  view.dispatch({ effects: EditorView.scrollIntoView(view.state.doc.line(target).from, { y: "center" }) });
}

/**
 * The editor theme: no chrome of its own, the pane supplies the surface.
 * @param theme - the host's resolved theme.
 * @returns the theme extension.
 */
function codeTheme(theme: "dark" | "light"): Extension {
  return EditorView.theme(
    {
      "&": { height: "100%", backgroundColor: "transparent", color: "var(--tst-ink)", fontSize: "var(--tst-fs-code)" },
      ".cm-scroller": { fontFamily: "var(--tst-mono)", lineHeight: "1.55", overflow: "auto" },
      ".cm-content": { padding: "0 0 40px", caretColor: "transparent" },
      ".cm-line": { padding: "0 10px 0 0" },
      ".cm-gutters": { backgroundColor: "transparent", color: "var(--tst-ink-faint)", border: "none" },
      ".cm-lineNumbers .cm-gutterElement": { padding: "0 12px 0 0", minWidth: "3ch" },
      "&.cm-focused": { outline: "none" },
      ".tst-code-active-line": { backgroundColor: "color-mix(in srgb, var(--tst-ink) 9%, transparent)", borderRadius: "3px" },
      ".cm-cursor, .cm-dropCursor": { display: "none" },
      ".cm-selectionBackground, &.cm-focused .cm-selectionBackground": {
        backgroundColor: "color-mix(in srgb, var(--tst-ink) 18%, transparent)",
      },
    },
    { dark: theme === "dark" },
  );
}

/**
 * Render the editor for one file.
 * @param props - the source, its path, the selected line and the theme.
 * @returns the editor host element.
 */
export function CodeView({ text, path, activeLine, theme }: CodeViewProps): ReactElement {
  const host = useRef<HTMLDivElement | null>(null);
  const view = useRef<EditorView | null>(null);
  // The mount effect reads the latest line without re-creating the view when
  // only the selection moves; the second effect reconfigures the mark.
  const lineRef = useRef(activeLine);
  lineRef.current = activeLine;

  useEffect(() => {
    const parent = host.current;
    if (parent === null) return undefined;
    const created = new EditorView({
      state: EditorState.create({
        doc: text,
        extensions: [
          lineNumbers(),
          syntaxHighlighting(highlightStyle),
          languageExtension(path),
          activeLineCompartment.of(activeLineExtension(lineRef.current)),
          EditorView.editable.of(false),
          EditorState.readOnly.of(true),
          codeTheme(theme),
        ],
      }),
      parent,
    });
    view.current = created;
    if (lineRef.current !== undefined) revealLine(created, lineRef.current);
    return () => {
      created.destroy();
      view.current = null;
    };
  }, [text, path, theme]);

  useEffect(() => {
    const active = view.current;
    if (active === null) return;
    active.dispatch({ effects: activeLineCompartment.reconfigure(activeLineExtension(activeLine)) });
    if (activeLine !== undefined) revealLine(active, activeLine);
  }, [activeLine]);

  return <div data-testid="code-view" data-tst="code-view" ref={host} />;
}
