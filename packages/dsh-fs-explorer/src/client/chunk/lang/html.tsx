/**
 * The html language chunk.
 *
 * Also serves the catalogue's html-approximated rows (razor, vue, svelte) once
 * the read side routes them here; the chunk itself is only the grammar.
 */
import { html } from "@codemirror/lang-html";
import type { Extension } from "@codemirror/state";

/** Diagnostic marker; the build asserts it survives minification. */
export const renderer = "html" as const;

export function language(): Extension {
  return html();
}
