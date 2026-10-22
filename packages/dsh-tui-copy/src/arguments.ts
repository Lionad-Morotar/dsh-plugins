/**
 * The `/copy` grammar. One place decides what a raw input means, so the
 * handler never re-reads the string: an unparsable input names a wrong scope,
 * and silently copying a different scope than the user asked for is the one
 * failure a clipboard command cannot recover from.
 */

/** Shape of the last n turns this invocation copies. */
export interface CopyRequest {
  /** How many turns to copy, newest first, clamped to {@link MAX_COUNT}. */
  readonly count: number;
  /** Whether the user's own prompts ride along with the assistant replies. */
  readonly includeUser: boolean;
}

export type CopyInput =
  | ({ readonly ok: true } & CopyRequest)
  | { readonly ok: false; readonly message: string };

/** Ceiling on a single request: the command reads the live session log, and an
 *  unbounded count would walk every event of a long session. */
export const MAX_COUNT = 50;

export const USAGE = "Usage: /copy [<number=1>] [--all]";

/** Long and short spellings of the include-user-prompts flag. */
const INCLUDE_USER_FLAGS = new Set(["--all", "-a"]);

/**
 * Parse the exact text following the command name.
 *
 * Accepted: nothing (one turn), a positive integer, the include flag, and the
 * flag combined with a count in either order. Everything else is refused with
 * the usage line, including a repeated count — the grammar has no defined
 * winner, and picking one would hide a typo.
 */
export function parseCopyInput(rawInput: string): CopyInput {
  const tokens = rawInput.trim().split(/\s+/u).filter(token => token !== "");
  let count: number | undefined;
  let includeUser = false;

  for (const token of tokens) {
    if (INCLUDE_USER_FLAGS.has(token.toLowerCase())) {
      if (includeUser) return { ok: false, message: USAGE };
      includeUser = true;
      continue;
    }
    if (!/^\d+$/u.test(token)) return { ok: false, message: USAGE };
    if (count !== undefined) return { ok: false, message: USAGE };
    const parsed = Number.parseInt(token, 10);
    if (!Number.isSafeInteger(parsed) || parsed < 1) return { ok: false, message: USAGE };
    count = parsed;
  }

  return { ok: true, count: Math.min(count ?? 1, MAX_COUNT), includeUser };
}
