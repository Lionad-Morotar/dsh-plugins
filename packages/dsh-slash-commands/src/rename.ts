/**
 * The `/rename` grammar, kept as a pure function so the whole decision surface
 * is testable without a host.
 *
 * Two shapes are accepted, both deliberately narrow: the title is whatever
 * follows the command name, normalized by trimming. Everything else
 * (empty input, a title that normalizes to nothing) is a usage error the
 * caller reports rather than a title the service would silently reject.
 */

/** Command name without the leading slash, shared with the manifest. */
export const RENAME_COMMAND_NAME = "rename";
export const RENAME_COMMAND_DESCRIPTION = "Rename the current session";

/** One parsed invocation. */
export type RenameRequest =
  | { readonly ok: true; readonly title: string }
  | { readonly ok: false; readonly message: string };

/** Usage line shown for every rejected invocation. */
export const RENAME_USAGE = "用法：/rename <新标题>";

/**
 * Parse the text following `/rename`.
 *
 * The accepted title is trimmed but otherwise taken verbatim: a title is user
 * prose, so collapsing inner whitespace would quietly rewrite what they typed.
 * Only the outer whitespace comes off, and only emptiness is rejected here;
 * the byte limit belongs to the title service that owns it.
 */
export function parseRenameInput(rawInput: string): RenameRequest {
  const title = rawInput.trim();
  if (title.length === 0) return { ok: false, message: RENAME_USAGE };
  return { ok: true, title };
}
