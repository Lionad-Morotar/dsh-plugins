/**
 * The markdown language chunk.
 *
 * The grammar only; the GFM pipeline that renders READMEs lives in the preview
 * chunk, because reading a README and editing one need different halves.
 */
import { markdown } from "@codemirror/lang-markdown";
import type { Extension } from "@codemirror/state";

/** Diagnostic marker; the build asserts it survives minification. */
export const renderer = "markdown" as const;

export function language(): Extension {
  return markdown();
}
