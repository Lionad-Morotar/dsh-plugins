/**
 * The typescript language chunk.
 *
 * Shares the javascript grammar package with three siblings; esbuild emits the
 * shared module once per chunk, so each chunk stays self-contained and no chunk
 * depends on another having loaded first.
 */
import { javascript } from "@codemirror/lang-javascript";
import type { Extension } from "@codemirror/state";

/** Diagnostic marker; the build asserts it survives minification. */
export const renderer = "typescript" as const;

export function language(): Extension {
  return javascript({ typescript: true });
}
