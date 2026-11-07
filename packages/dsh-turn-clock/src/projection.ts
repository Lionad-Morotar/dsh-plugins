/**
 * The `turnClock` projection unit.
 *
 * A whole-log fold that answers one question: how much of a Turn was the model
 * actually working? The shipped Turn labels answer with `turn.end.time −
 * turn.start.time`, which is the wall span — and a Turn that asked a question at
 * 04:21 and was answered at 13:25 reports nine hours of "deep diving" for what
 * was a few minutes of work. This fold measures the `ask_user_question` waits
 * separately so both labels can subtract them.
 *
 * Only the foreground wait is measured: from the tool call to the tool result
 * that closes it. A timed question that timed out closes its wait the moment the
 * pending result lands, which is right — the model resumes work then, and a late
 * reply is a new user message rather than more waiting.
 *
 * @module dsh-turn-clock/projection
 */
import { ASK_USER_QUESTION_TOOL, isClockEvent, USER_QUESTION_REPLY_SOURCE, type ClockEvent, type UnknownEvent } from "./event.ts";
import { clockStateSchema, clockViewSchema, createClockState } from "./schema.ts";
import type { OpenAsk, TurnClockState, TurnClockView } from "./types.ts";

/**
 * How many closed Turns keep a net duration.
 *
 * The wire view ships this table with every projection update, so it is a
 * rolling window rather than a history: a session long past 256 Turns loses the
 * label correction on its oldest rows, and nothing else.
 */
const TURN_NET_LIMIT = 256;

/**
 * Close one open question wait.
 * @param state - the fold state carrying the wait.
 * @param closedAt - instant the closing event was committed.
 * @returns the state with the wait settled into both counters.
 */
function settleAsk(state: TurnClockState, closedAt: number): TurnClockState {
  const ask = state.ask;
  if (ask === null) return state;
  const waited = Math.max(0, closedAt - ask.since);
  return {
    ...state,
    waitMs: state.waitMs + waited,
    totalWaitMs: state.totalWaitMs + waited,
    ask: null,
  };
}

/**
 * Record one Turn's net duration, trimming the oldest entry past the window.
 *
 * Turn keys are integer-like, so `Object.keys` already returns them in numeric
 * order; the first key is always the oldest Turn.
 * @param table - the current net table.
 * @param turn - the closed Turn number.
 * @param netMs - its wall span minus its waits.
 * @returns the new table, or the same reference when nothing changed.
 */
function rememberTurn(table: Readonly<Record<string, number>>, turn: number, netMs: number): Readonly<Record<string, number>> {
  const key = String(turn);
  if (table[key] === netMs) return table;
  const next: Record<string, number> = { ...table, [key]: netMs };
  const keys = Object.keys(next);
  if (keys.length > TURN_NET_LIMIT) {
    const oldest = keys[0];
    if (oldest !== undefined) delete next[oldest];
  }
  return next;
}

/** Fold one committed event; return the same reference when nothing changed. */
function fold(state: TurnClockState, event: ClockEvent): TurnClockState {
  switch (event.type) {
    case "turn/start":
      return { ...state, currentTurn: event.data.turn, turnStart: event.time, waitMs: 0, ask: null };
    case "tool/call": {
      // A second concurrent question keeps the first wait's anchor: the model is
      // blocked on whichever call opened the gate first, and both close in order.
      if (event.data.name !== ASK_USER_QUESTION_TOOL || state.ask !== null) return state;
      const ask: OpenAsk = { callId: event.data.callId, since: event.time };
      return { ...state, ask };
    }
    case "tool/result": {
      if (state.ask === null || state.ask.callId !== event.data.message.source.callId) return state;
      return settleAsk(state, event.time);
    }
    case "user/message": {
      // A continued question answered after its timeout: the model stopped
      // waiting when the pending result landed, so this only closes a wait that
      // is still open (a reply racing the pending result).
      const source = event.data.source;
      if (source.kind !== USER_QUESTION_REPLY_SOURCE || state.ask === null || state.ask.callId !== source.callId) return state;
      return settleAsk(state, event.time);
    }
    case "turn/end": {
      const settled = state.ask === null ? state : settleAsk(state, event.time);
      const closed: TurnClockState = {
        ...settled,
        currentTurn: null,
        turnStart: null,
        waitMs: 0,
        ask: null,
      };
      if (state.turnStart === null) return closed;
      const net = Math.max(0, event.time - state.turnStart - settled.waitMs);
      return { ...closed, turnNet: rememberTurn(settled.turnNet, event.data.turn, net) };
    }
    default:
      return state;
  }
}

/** The `turnClock` unit registered on `ctx.sessionProjections`. */
export const turnClockProjectionDefinition = {
  key: "turnClock",
  stateVersion: 1,
  stateSchema: clockStateSchema,
  init: (_header: unknown, inheritedEventCount: number): TurnClockState => createClockState(inheritedEventCount),
  apply: (state: TurnClockState, event: UnknownEvent): TurnClockState => {
    if (event.seq < state.inheritedEventCount) return state;
    return isClockEvent(event) ? fold(state, event) : state;
  },
  wire: {
    /**
     * Kept out of the Session summary.
     *
     * The summary block rides every session row in the list wire, and this view
     * carries a per-Turn table that no row renders. The opened conversation
     * still receives the whole view over the Session control stream, which is
     * how the seat reads it.
     */
    summary: false,
    viewSchema: clockViewSchema,
    view: (state: TurnClockState): TurnClockView => ({
      currentTurn: state.currentTurn,
      turnStart: state.turnStart,
      waitMs: state.waitMs,
      waitSince: state.ask === null ? null : state.ask.since,
      totalWaitMs: state.totalWaitMs,
      turnNet: state.turnNet,
    }),
  },
};
