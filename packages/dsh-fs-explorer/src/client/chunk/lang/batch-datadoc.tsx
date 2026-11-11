/**
 * The batch-datadoc block: query, markup and document languages.
 *
 * A block is a bundle, and every bundle inlines its own copy of CodeMirror, so
 * the languages outside the first slice share four blocks. This one holds the
 * data and document formats: SQL, XML and its XSL dialect, the JSON-adjacent
 * rows, and the diff, Dockerfile and TeX families.
 *
 * The editor is mounted here, in this bundle, because a grammar cannot cross a
 * chunk boundary: the host's `require` resolves no `@codemirror/*`. See
 * `read-only.tsx`.
 */
import { sql } from "@codemirror/lang-sql";
import { xml } from "@codemirror/lang-xml";
import { StreamLanguage } from "@codemirror/language";
import { diff } from "@codemirror/legacy-modes/mode/diff";
import { dockerFile } from "@codemirror/legacy-modes/mode/dockerfile";
import { json } from "@codemirror/legacy-modes/mode/javascript";
import { stex } from "@codemirror/legacy-modes/mode/stex";
import type { Extension } from "@codemirror/state";

import { mountReadOnly, type ReadOnlyHandle, type ReadOnlyOptions } from "./read-only.tsx";

/** Diagnostic marker; the build asserts it survives minification. */
export const renderer = "batch-datadoc" as const;

/**
 * The languages this block draws, in the catalogue's order.
 *
 * The build asserts this list equals the catalogue's for this block, element for
 * element.
 */
export const ids = [
  "sql",
  "xml",
  "xsl",
  "jsonc",
  "jsonl",
  "snippets",
  "diff",
  "dockerfile",
  "tex",
  "latex",
] as const;

/**
 * One grammar per language id.
 *
 * JSONC, JSON Lines and code snippets are JSON with comments or one-per-line, so
 * the legacy javascript mode is the closest superset: the strict json grammar
 * produces error nodes the moment a comment appears. XSL is XML with a
 * stylesheet vocabulary, and TeX and LaTeX share the stex mode.
 */
const grammars: Readonly<Record<string, () => Extension>> = {
  sql: () => sql(),
  xml: () => xml(),
  xsl: () => xml(),
  jsonc: () => StreamLanguage.define(json),
  jsonl: () => StreamLanguage.define(json),
  snippets: () => StreamLanguage.define(json),
  diff: () => StreamLanguage.define(diff),
  dockerfile: () => StreamLanguage.define(dockerFile),
  tex: () => StreamLanguage.define(stex),
  latex: () => StreamLanguage.define(stex),
};

/**
 * Mount the editor for one language in this block.
 * @param host - the element the editor fills.
 * @param options - page text, path and first line.
 * @param id - language id from the catalogue.
 * @returns the update/destroy handle.
 */
export function mount(host: HTMLElement, options: ReadOnlyOptions, id: string): ReadOnlyHandle {
  const factory = grammars[id];
  return mountReadOnly(host, options, factory === undefined ? [] : factory());
}
