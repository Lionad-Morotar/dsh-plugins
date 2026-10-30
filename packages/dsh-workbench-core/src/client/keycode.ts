/**
 * Which physical keys the host's shortcut editor accepts.
 *
 * The host normalizes a binding by regex (`Key[A-Z]`, `Digit[0-9]`, `F1`–`F24`)
 * plus a fixed name table, and *throws* for anything else. Its editor never
 * offers an unsupported key, but this panel captures raw `keydown` events, so
 * Insert, End, Home, PageUp and the like arrive here and would otherwise escape
 * as an uncaught error from `describeBinding`. Mirroring the grammar locally
 * turns that crash into a sentence the reader can act on.
 */

/** Named keys the host's `keyNames` table carries, verbatim. */
export const NAMED_SHORTCUT_CODES: readonly string[] = [
  "Slash",
  "Comma",
  "Period",
  "Backslash",
  "Backquote",
  "Minus",
  "Equal",
  "BracketLeft",
  "BracketRight",
  "Semicolon",
  "Quote",
  "Enter",
  "Escape",
  "Space",
  "Tab",
  "Backspace",
  "Delete",
  "ArrowUp",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
];

const NAMED = new Set(NAMED_SHORTCUT_CODES);
const PATTERN = /^(Key[A-Z]|Digit[0-9]|F([1-9]|1[0-9]|2[0-4]))$/u;

/**
 * Whether the host can normalize this physical code.
 * @param code - `KeyboardEvent.code` from a captured key.
 * @returns true when the host's grammar accepts it.
 */
export function isSupportedShortcutCode(code: string): boolean {
  return PATTERN.test(code) || NAMED.has(code);
}
