/**
 * The python language chunk.
 *
 * The one grammar here that no other chunk shares, which is why it is the
 * natural first anchor when measuring what a single language costs.
 */
import { python } from "@codemirror/lang-python";
import type { Extension } from "@codemirror/state";

/** Diagnostic marker; the build asserts it survives minification. */
export const renderer = "python" as const;

export function language(): Extension {
  return python();
}
