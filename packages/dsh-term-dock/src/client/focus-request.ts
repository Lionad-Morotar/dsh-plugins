/**
 * When the dock may move the caret into a terminal.
 *
 * The dock stays mounted while it is hidden (`display: none`) and while it is
 * minimized, so "the screen component mounted" is not "the user just opened it".
 * A request is therefore explicit and named: the dock records *which* panel the
 * caret belongs in, and only that panel's screen receives a token. Naming the
 * panel is what lets a split focus the pane it just created while a session
 * switch that auto-opens a pane does not touch the caret at all — a token that
 * only said "focus the active panel" would let the auto-opened pane inherit a
 * request made minutes earlier.
 *
 * Requests are dropped while the dock is hidden: the caret belongs to the
 * conversation then, and a queued request would fire at the next reveal.
 */

/** One pending request: a panel id and the serial that changes when it re-requests. */
export interface FocusRequest {
  readonly serial: number;
  readonly panelId: string;
}

/** Whether the terminal is on screen, and the one panel waiting for the caret. */
export interface FocusState {
  readonly shown: boolean;
  readonly serial: number;
  readonly request: FocusRequest | null;
}

/**
 * A state that has not requested focus yet.
 * @param shown - whether the dock is visible and not minimized right now.
 */
export function initialFocusState(shown: boolean): FocusState {
  return { shown, serial: 0, request: null };
}

/**
 * Record a visibility edge.
 *
 * Opening does not request anything by itself: only the surface knows which
 * panel is active (and whether it has to create one first). Hiding drops a
 * pending request, because a caret placed on reveal would drag the reader out of
 * the conversation.
 * @param state - the previous state. Returned unchanged when `shown` did not move.
 * @param shown - the dock is visible and its body is on screen.
 */
export function noteShown(state: FocusState, shown: boolean): FocusState {
  if (state.shown === shown) return state;
  return { shown, serial: state.serial, request: null };
}

/**
 * Ask one panel's screen to take the caret.
 * @param state - the previous state.
 * @param panelId - the panel that should focus.
 * @returns the next state; a hidden dock ignores the request.
 */
export function requestFocus(state: FocusState, panelId: string): FocusState {
  if (!state.shown || panelId === "") return state;
  const serial = state.serial + 1;
  return { shown: true, serial, request: { serial, panelId } };
}

/**
 * Drop a pending request without spending a serial.
 * @param state - the previous state.
 * @returns the next state.
 */
export function clearFocus(state: FocusState): FocusState {
  return state.request === null ? state : { shown: state.shown, serial: state.serial, request: null };
}

/**
 * The token one panel's screen should receive.
 *
 * Zero for every panel that is not the request's target, which is what keeps a
 * stale request from firing in a pane the reader did not ask for.
 * @param state - the previous state.
 * @param panelId - the panel currently rendering.
 */
export function focusTokenFor(state: FocusState, panelId: string): number {
  return state.request !== null && state.request.panelId === panelId ? state.request.serial : 0;
}
