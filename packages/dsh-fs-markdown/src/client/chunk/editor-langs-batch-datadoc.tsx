/**
 * The editable batch-datadoc block: query, markup and document languages.
 *
 * One chunk per batch, because the edit surface's own chunk holds only the ten
 * in-service grammars. The grammar sources mirror the read-only block of the
 * same name, so a file colours the same whether it is read or edited.
 */
import { sql } from "@codemirror/lang-sql";
import { xml } from "@codemirror/lang-xml";
import { StreamLanguage } from "@codemirror/language";
import { diff } from "@codemirror/legacy-modes/mode/diff";
import { dockerFile } from "@codemirror/legacy-modes/mode/dockerfile";
import { json } from "@codemirror/legacy-modes/mode/javascript";
import { stex } from "@codemirror/legacy-modes/mode/stex";
import type { Extension } from "@codemirror/state";

import type { EditableHandle, EditableMountOptions } from "../contracts.ts";
import { mountEditable } from "./editor-kit.tsx";

/** Diagnostic marker; the build asserts it survives minification. */
export const renderer = "batch-datadoc" as const;

/**
 * The languages this block draws, in the catalogue's order.
 *
 * `test/editor-langs.test.ts` asserts this list equals the catalogue's for this
 * block, element for element; `scripts/build.mjs` guards the block set itself.
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
 * JSONC, JSON Lines and code snippets are JSON with comments or one per line, so
 * the legacy javascript mode is the closest superset: the strict json grammar
 * produces error nodes the moment a comment appears. XSL is XML with a
 * stylesheet vocabulary, and TeX and LaTeX share the stex mode.
 */
export const grammars: Readonly<Record<string, () => Extension>> = {
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
 * @param options - the document, its language and the shell's sinks.
 * @returns the handle the shell keeps.
 */
export function mount(host: HTMLElement, options: EditableMountOptions): EditableHandle {
  const factory = grammars[options.language];
  return mountEditable(host, options, factory === undefined ? [] : factory());
}
