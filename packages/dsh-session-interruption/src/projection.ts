/**
 * The `sessionInterruption` projection unit.
 *
 * A whole-log fold of durable session events into one question: did the
 * session's latest turn ever close? It exists because every shipped sidebar
 * status fact (`running`, `pendingInteraction`, `completionUnread`) is a
 * client-runtime observation that resets when the harness restarts, while the
 * conversation view derives a persistent "interrupted" reading from the same
 * open-turn shape this fold captures. Folding it host-side makes the fact
 * readable for every listed session — including ones nobody has opened — so
 * the sidebar can mark what is worth resuming after a forced quit.
 *
 * The fold deliberately reads only turn and tool-call events. A turn the user
 * cancelled still lands a `turn/end` (the agent loop appends one in a
 * `finally`), so cancellations read closed and never light the marker; a turn
 * cut by the host dying has nothing after its `turn/start`, and stays open
 * forever. Judging "latest turn only" is what makes a resumed session — whose
 * old open turn is superseded by a fresh, closing one — read as healthy.
 *
 * @module dsh-session-interruption/projection
 */
import { isInterruptionEvent, type InterruptionEvent, type UnknownEvent } from "./event.ts";
import { interruptionStateSchema, interruptionViewSchema } from "./schema.ts";
import type { InterruptionState, InterruptionView } from "./types.ts";

/** Build the fold's zero state. */
export function createInterruptionState(): InterruptionState {
  return {
    lastTurn: null,
    lastTurnClosed: true,
    lastTurnStart: null,
    lastTurnStartSeq: null,
    pendingCalls: {},
  };
}

/**
 * Fold one `turn/start`: the newest turn is now this one, open, and any tool
 * calls left hanging by an older turn are retired with it.
 * @param state - the current fold state.
 * @param event - the committed `turn/start`.
 * @returns the advanced state.
 */
function openTurn(state: InterruptionState, event: Extract<InterruptionEvent, { type: "turn/start" }>): InterruptionState {
  return {
    lastTurn: event.data.turn,
    lastTurnClosed: false,
    lastTurnStart: event.time,
    lastTurnStartSeq: event.seq,
    pendingCalls: {},
  };
}

/**
 * Fold one `turn/end`: a matching turn closes its reading; an end for a turn
 * other than the newest one is a stale append this fold does not let rewrite
 * the newest turn's state.
 * @param state - the current fold state.
 * @param event - the committed `turn/end`.
 * @returns the same reference when the end is stale, else the closed state.
 */
function closeTurn(state: InterruptionState, event: Extract<InterruptionEvent, { type: "turn/end" }>): InterruptionState {
  if (state.lastTurn === null || event.data.turn !== state.lastTurn) return state;
  return { ...state, lastTurnClosed: true, pendingCalls: {} };
}

/** Fold one committed event; return the same reference when nothing changed. */
function fold(state: InterruptionState, event: InterruptionEvent): InterruptionState {
  switch (event.type) {
    case "turn/start":
      return openTurn(state, event);
    case "turn/end":
      return closeTurn(state, event);
    case "tool/call":
      return { ...state, pendingCalls: { ...state.pendingCalls, [event.data.callId]: event.time } };
    case "tool/result": {
      const callId = event.data.message.source.callId;
      if (!Object.hasOwn(state.pendingCalls, callId)) return state;
      return {
        ...state,
        pendingCalls: Object.fromEntries(Object.entries(state.pendingCalls).filter(([id]) => id !== callId)),
      };
    }
  }
}

/** The finished reading: only the newest turn's openness is published. */
function view(state: InterruptionState): InterruptionView {
  const interrupted = state.lastTurn !== null && !state.lastTurnClosed;
  return {
    interrupted,
    turn: interrupted ? state.lastTurn : null,
    since: interrupted ? state.lastTurnStart : null,
    pendingToolCount: interrupted ? Object.keys(state.pendingCalls).length : 0,
  };
}

/** The `sessionInterruption` unit registered on `ctx.sessionProjections`. */
export const sessionInterruptionProjectionDefinition = {
  key: "sessionInterruption",
  stateVersion: 1,
  stateSchema: interruptionStateSchema,
  init: () => createInterruptionState(),
  apply: (state: InterruptionState, event: UnknownEvent): InterruptionState => (isInterruptionEvent(event) ? fold(state, event) : state),
  wire: {
    viewSchema: interruptionViewSchema,
    view,
  },
};
