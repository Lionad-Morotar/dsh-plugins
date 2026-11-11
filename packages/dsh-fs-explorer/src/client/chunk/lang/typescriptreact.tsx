/**
 * The typescriptreact language chunk.
 *
 * Both dialects on, matching the catalogue row: `.tsx` is TypeScript with JSX.
 */
import { javascript } from "@codemirror/lang-javascript";
import type { Extension } from "@codemirror/state";

/** Diagnostic marker; the build asserts it survives minification. */
export const renderer = "typescriptreact" as const;

export function language(): Extension {
  return javascript({ typescript: true, jsx: true });
}
