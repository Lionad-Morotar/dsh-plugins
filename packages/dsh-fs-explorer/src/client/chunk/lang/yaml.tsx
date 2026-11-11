/**
 * The yaml language chunk.
 *
 * Compose files reach this grammar through the catalogue's dockercompose row,
 * which is why that row needs no chunk of its own.
 */
import { yaml } from "@codemirror/lang-yaml";
import type { Extension } from "@codemirror/state";

/** Diagnostic marker; the build asserts it survives minification. */
export const renderer = "yaml" as const;

export function language(): Extension {
  return yaml();
}
