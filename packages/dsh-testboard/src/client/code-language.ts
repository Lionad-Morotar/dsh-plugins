/**
 * Which grammar a test file needs.
 *
 * The board only lists test files, all of which are JavaScript-family sources.
 * Kept DOM-free and separate from the chunk so the mapping is testable without
 * pulling CodeMirror into the test process.
 */

/** The grammars the code view can install. */
export type CodeLanguage = "typescript" | "tsx" | "javascript" | "jsx";

/**
 * Snap a path's extension onto a grammar.
 *
 * `.tsx`/`.jsx` are their own family because JSX changes the parse, not just the
 * highlighting; anything unrecognised gets the TypeScript grammar, since the
 * only files this pane shows are test sources and the parser is tolerant.
 * @param path - repo-relative test path.
 * @returns the grammar to install.
 */
export function codeLanguageOf(path: string): CodeLanguage {
  const lower = path.toLowerCase();
  if (lower.endsWith(".tsx")) return "tsx";
  if (lower.endsWith(".jsx")) return "jsx";
  if (lower.endsWith(".js") || lower.endsWith(".mjs") || lower.endsWith(".cjs")) return "javascript";
  return "typescript";
}
