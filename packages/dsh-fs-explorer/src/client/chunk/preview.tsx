/**
 * The preview's heavy half, fetched only when a file is selected.
 *
 * Two renderers share this chunk because they share the same trigger: a reader
 * who opens a source file needs CodeMirror, a reader who opens a README needs
 * the GFM renderer, and either way the fetch is one page-lifetime decision. The
 * entry image stays free of both.
 */
import { Compartment, EditorState, type Extension } from "@codemirror/state";
import { EditorView, lineNumbers } from "@codemirror/view";
import { HighlightStyle, syntaxHighlighting } from "@codemirror/language";
import { javascript } from "@codemirror/lang-javascript";
import { json } from "@codemirror/lang-json";
import { markdown as markdownLanguage } from "@codemirror/lang-markdown";
import { css } from "@codemirror/lang-css";
import { html } from "@codemirror/lang-html";
import { yaml } from "@codemirror/lang-yaml";
import { tags } from "@lezer/highlight";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import type { LanguageId } from "../preview.ts";
import type { CodePreviewHandle, CodePreviewOptions, PreviewChunkModule } from "../preview-chunk.ts";

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
 * Resolve the language extension for one file.
 *
 * TypeScript is a parser flag rather than a separate package, so the path is
 * consulted for the two boolean options; the language id alone cannot tell a
 * `.tsx` from a `.js`.
 * @param language - the id from {@link languageFor}.
 * @param path - the file's workspace path.
 * @returns the extension, or an empty list for plaintext.
 */
function languageExtension(language: LanguageId, path: string): Extension {
  switch (language) {
    case "javascript":
      return javascript({
        jsx: /\.(jsx|tsx)$/iu.test(path),
        typescript: /\.(ts|tsx|mts|cts)$/iu.test(path),
      });
    case "json":
      return json();
    case "markdown":
      return markdownLanguage();
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
 * Mount one read-only editor over one page.
 *
 * Line numbers carry the page's absolute offset, so page two starts at 201
 * rather than at 1. The gutter sits in a compartment because the page can move
 * without the document identity changing; language is compartmented for the
 * same reason when a selection switches between files of the same page size.
 * @param host - the element the editor fills.
 * @param options - page text, language, path and first line.
 * @returns the update/destroy handle.
 */
export function mountCodePreview(host: HTMLElement, options: CodePreviewOptions): CodePreviewHandle {
  const gutter = new Compartment();
  const language = new Compartment();
  const view = new EditorView({
    parent: host,
    state: EditorState.create({
      doc: options.text,
      extensions: [
        EditorState.readOnly.of(true),
        EditorView.editable.of(false),
        gutter.of(lineNumbers({ formatNumber: line => String(line + options.offset - 1) })),
        language.of(languageExtension(options.language, options.path)),
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
    destroy() {
      view.destroy();
    },
  };
}

/**
 * The GFM reading mode.
 *
 * `skipHtml` drops raw HTML nodes instead of passing them through: no
 * `rehype-raw` is installed, so nothing in a document can become live markup.
 * @param props - the page text.
 * @returns the rendered document.
 */
export function MarkdownView({ text }: { readonly text: string }) {
  return (
    <div className="fx-md" data-renderer="react-markdown">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        skipHtml
        components={{
          // A workspace-relative image has no URL the page can fetch; showing a
          // named placeholder beats a broken-image glyph that says nothing.
          img: ({ src, alt }) => {
            const source = typeof src === "string" ? src : "";
            if (!/^(https?:|data:|blob:)/iu.test(source)) {
              return (
                <span className="fx-md-img" title={source}>
                  {alt === undefined || alt === "" ? "image" : alt}
                </span>
              );
            }
            return <img src={source} alt={alt ?? ""} loading="lazy" />;
          },
        }}
      >
        {text}
      </ReactMarkdown>
    </div>
  );
}

const chunkModule: PreviewChunkModule = { renderer, mountCodePreview, MarkdownView };

export default chunkModule;
