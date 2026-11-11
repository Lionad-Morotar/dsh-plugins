/**
 * The css language chunk.
 *
 * SCSS has its own catalogue row and its own grammar package, so it does not
 * share this chunk.
 */
import { css } from "@codemirror/lang-css";
import type { Extension } from "@codemirror/state";

/** Diagnostic marker; the build asserts it survives minification. */
export const renderer = "css" as const;

export function language(): Extension {
  return css();
}
