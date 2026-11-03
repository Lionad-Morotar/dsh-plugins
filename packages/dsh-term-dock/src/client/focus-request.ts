/**
 * When the dock may move the caret into the active terminal.
 *
 * The dock stays mounted while it is hidden (`display: none`) and while it is
 * minimized, so "the screen component mounted" is not "the user just opened
 * it". A token counts two kinds of edge: the dock becoming shown, and an
 * explicit claim (the user picked a panel). The renderer focuses only when the
 * token changes.
 *
 * A gate that starts already shown does not spend a token on that first
 * observation. Page load and the session auto-open must not steal the caret
 * from the conversation.
 */

/** Whether the terminal is on screen, and how many focus requests have been issued. */
export interface FocusGate {
  readonly shown: boolean;
  readonly token: number;
}

/**
 * A gate that has not requested focus yet.
 * @param shown - whether the dock is visible and not minimized right now.
 */
export function initialFocusGate(shown: boolean): FocusGate {
  return { shown, token: 0 };
}

/**
 * Record a visibility edge. Hidden to shown spends one token; the other way keeps it.
 * @param gate - the previous gate. Returned unchanged when `shown` did not change.
 * @param shown - the dock is visible and its body is on screen.
 */
export function noteShown(gate: FocusGate, shown: boolean): FocusGate {
  if (gate.shown === shown) return gate;
  if (!shown) return { shown: false, token: gate.token };
  return { shown: true, token: gate.token + 1 };
}

/**
 * Record that the user picked a panel. No-op while the dock is not shown,
 * so a click that also un-hides the dock does not double-count with {@link noteShown}.
 * @param gate - the previous gate. Returned unchanged while hidden.
 */
export function noteClaim(gate: FocusGate): FocusGate {
  if (!gate.shown) return gate;
  return { shown: true, token: gate.token + 1 };
}
