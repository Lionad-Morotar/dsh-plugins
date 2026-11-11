/**
 * The javascript language chunk.
 *
 * One grammar per entry file, with no shared factory: a factory imported by all
 * ten entries would put every grammar in every chunk, which is the cost the
 * split exists to avoid. The dialect is fixed here rather than derived from the
 * path, because the catalogue already decided which language this chunk is.
 */
import { javascript } from "@codemirror/lang-javascript";
import type { Extension } from "@codemirror/state";

/** Diagnostic marker; the build asserts it survives minification. */
export const renderer = "javascript" as const;

export function language(): Extension {
  return javascript({});
}
