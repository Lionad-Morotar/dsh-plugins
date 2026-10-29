/**
 * The `/archive` and `/unarchive` grammars, pure functions so the whole
 * decision surface is testable without a host.
 *
 * The archive set belongs to the host's workspace registry; these functions
 * only decide what a user's invocation means. Both grammars are deliberately
 * narrow: `/archive` accepts nothing or `--stop`, `/unarchive` accepts
 * nothing at all. There is no "archive session X" form because archiving
 * another session is what the sidebar's row menu is for, and there is no
 * "unarchive session X" because the client never loads archived sessions'
 * titles, so a picker would have nothing honest to show.
 */

/** Command names without the leading slash, shared with the manifest. */
export const ARCHIVE_COMMAND_NAME = "archive";
export const ARCHIVE_COMMAND_DESCRIPTION = "Archive the current session (--stop also stops its running work)";
export const UNARCHIVE_COMMAND_NAME = "unarchive";
export const UNARCHIVE_COMMAND_DESCRIPTION = "Bring the current session back from the archive";

/** Usage lines shown for every rejected invocation. */
export const ARCHIVE_USAGE = "用法：/archive [--stop]";
export const UNARCHIVE_USAGE = "用法：/unarchive";

/** One parsed `/archive` invocation. */
export type ArchiveRequest =
  | { readonly ok: true; readonly stopActivity: boolean }
  | { readonly ok: false; readonly message: string };

/** One parsed `/unarchive` invocation. */
export type UnarchiveRequest = { readonly ok: true } | { readonly ok: false; readonly message: string };

/** The one flag `/archive` knows, spelled out for readers and the usage line. */
const STOP_FLAG = "--stop";

/**
 * Parse the text following `/archive`.
 *
 * `--stop` asks the host to stop the session's running work instead of
 * refusing the archive because of it — the command-line translation of the
 * sidebar's confirm dialog. The flag is matched exactly: a spelling that
 * stops running work earns no case-folding leniency, because accepting
 * "--STOP" would hide a typo behind a destructive action. A repeated flag is
 * refused for the same reason `/copy` refuses a repeated count: the grammar
 * has no defined winner, and picking one would hide the mistake.
 */
export function parseArchiveInput(rawInput: string): ArchiveRequest {
  const tokens = rawInput.trim().split(/\s+/u).filter(token => token !== "");
  let stopActivity = false;
  for (const token of tokens) {
    if (token !== STOP_FLAG) return { ok: false, message: ARCHIVE_USAGE };
    if (stopActivity) return { ok: false, message: ARCHIVE_USAGE };
    stopActivity = true;
  }
  return { ok: true, stopActivity };
}

/**
 * Parse the text following `/unarchive`.
 *
 * Unarchiving targets the session in use and nothing else, so any argument at
 * all is a usage error rather than a hint to silently ignore.
 */
export function parseUnarchiveInput(rawInput: string): UnarchiveRequest {
  if (rawInput.trim().length !== 0) return { ok: false, message: UNARCHIVE_USAGE };
  return { ok: true };
}
