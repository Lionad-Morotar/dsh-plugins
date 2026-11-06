/**
 * Which CodeMirror language a path gets.
 *
 * Kept apart from the editor chunk so the mapping is assertable in Node: the
 * chunk itself imports CodeMirror and cannot be loaded without a DOM. The ids
 * mirror the explorer's own `languageFor`, because a file highlighted one way in
 * the read-only view and another way here would be a visible regression.
 */

/** The language ids this editor can highlight. */
export type EditorLanguage = "javascript" | "json" | "markdown" | "css" | "html" | "yaml" | "plaintext";

const LANGUAGE_BY_SUFFIX: Readonly<Record<string, EditorLanguage>> = {
  ts: "javascript",
  tsx: "javascript",
  mts: "javascript",
  cts: "javascript",
  js: "javascript",
  jsx: "javascript",
  mjs: "javascript",
  cjs: "javascript",
  json: "json",
  jsonc: "json",
  json5: "json",
  md: "markdown",
  mdx: "markdown",
  markdown: "markdown",
  mdown: "markdown",
  css: "css",
  scss: "css",
  sass: "css",
  less: "css",
  html: "html",
  htm: "html",
  xhtml: "html",
  vue: "html",
  svelte: "html",
  yml: "yaml",
  yaml: "yaml",
};

/**
 * Map a file name to the language the editor highlights it as.
 *
 * A suffix this table does not know is `plaintext` rather than an error: the
 * file is still editable, it just gets no parser. Guessing a language from a
 * near-miss suffix (`h` as C, `m` as Objective-C) would colour half of them
 * wrong, so the table stays explicit.
 * @param path - workspace path or bare filename.
 * @returns the language id for that file.
 */
export function languageOf(path: string): EditorLanguage {
  const base = path.slice(path.lastIndexOf("/") + 1).toLowerCase();
  const dot = base.lastIndexOf(".");
  if (dot <= 0) return "plaintext";
  return LANGUAGE_BY_SUFFIX[base.slice(dot + 1)] ?? "plaintext";
}
