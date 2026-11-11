/**
 * The json language chunk.
 *
 * `json()` is the strict grammar; JSONC and JSON Lines rows in the catalogue
 * approximate with the javascript grammar instead, so they never land here.
 */
import { json } from "@codemirror/lang-json";
import type { Extension } from "@codemirror/state";

/** Diagnostic marker; the build asserts it survives minification. */
export const renderer = "json" as const;

export function language(): Extension {
  return json();
}
