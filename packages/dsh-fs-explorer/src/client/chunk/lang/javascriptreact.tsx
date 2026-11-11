/**
 * The javascriptreact language chunk.
 *
 * JSX without TypeScript, so `.jsx` keeps plain JavaScript semantics.
 */
import { javascript } from "@codemirror/lang-javascript";
import type { Extension } from "@codemirror/state";

/** Diagnostic marker; the build asserts it survives minification. */
export const renderer = "javascriptreact" as const;

export function language(): Extension {
  return javascript({ jsx: true });
}
