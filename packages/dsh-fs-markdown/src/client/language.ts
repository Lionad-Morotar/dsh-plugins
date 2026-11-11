/**
 * Which CodeMirror language a path gets.
 *
 * The mapping is not defined here. It lives in `dsh-text-languages`, which is the
 * single source of truth for every text surface in this repo, and this module
 * re-exports it so the editor chunk and its callers keep their import path.
 * Re-exporting rather than re-implementing is what makes the two surfaces agree:
 * the read-only pane and this editor resolve the same file to the same id, and a
 * second table here is exactly how they drifted apart before (`.ts` was
 * `javascript` on this side and `typescript` on the other).
 *
 * Kept apart from the editor chunk so the mapping is assertable in Node: the
 * chunk itself imports CodeMirror and needs a DOM.
 */
import { languageFor } from "dsh-text-languages/index.ts";

/**
 * A language id as this editor sees it.
 *
 * An alias rather than a union: the catalogue decides which ids exist, and a
 * union here would have to be edited every time it learns a language. The value
 * is opaque to this package — it is a key into the grammar factory table.
 */
export type EditorLanguage = string;

/**
 * Map a file name to the language the editor highlights it as.
 *
 * The catalogue's own function, re-exported unchanged: the identity matters,
 * because a caller comparing the two surfaces must get the same answer and the
 * same instance.
 */
export const languageOf = languageFor;
