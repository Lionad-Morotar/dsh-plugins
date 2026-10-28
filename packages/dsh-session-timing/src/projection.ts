/**
 * The `sessionTiming` projection unit.
 *
 * A whole-log fold of durable session events into wall times and counts. It
 * exists because the shipped `sessionStats` fold measures model time from
 * `step/start` and never re-anchors: a step that failed once reports the failed
 * attempt plus the backoff wait as model time, which also drags its TTFT and
 * decode readings. This fold re-anchors at every `llm/retry-started`, so model
 * time covers only the attempt that shipped, and it reports the backoff wait as
 * its own figure.
 *
 * `step/end` — not `assistant/message` — is the counted step event, matching the
 * shipped fold: it is the step lifecycle authority and the loop appends exactly
 * one per entered step in a `finally`, so completed, failed, cancelled, and
 * max-tokens steps all land one. Turn counts ride the same event for the same
 * reason: a cancelled step appends no message but does append `step/end`.
 *
 * @module dsh-session-timing/projection
 */
import { firstTokenTime, usageOutputTokens } from "./first-token.ts";
import { isTimingEvent, type TimingEvent, type UnknownEvent } from "./event.ts";
import { timingStateSchema, timingViewSchema } from "./schema.ts";
import type { OpenStep, TimingState } from "./types.ts";

/** Build the fold's zero state. */
export function createTimingState(): TimingState {
  return {
    turns: 0,
    steps: 0,
    llmMs: 0,
    toolMs: 0,
    ttftMs: 0,
    ttftSteps: 0,
    decodeMs: 0,
    decodeTokens: 0,
    retryMs: 0,
    retries: 0,
    lastTurn: null,
    openStep: null,
    pendingCalls: {},
  };
}

/** What a step-scoped event carries regardless of its own payload. */
interface StepScope {
  readonly data: { readonly turn: number; readonly step: number };
}

/**
 * Whether one event belongs to the open step.
 * @param open - the open step, or null between steps.
 * @param event - the committed event.
 * @returns true when the event carries this step's turn and step.
 */
function onOpenStep(open: OpenStep | null, event: StepScope): boolean {
  return open !== null && open.turn === event.data.turn && open.step === event.data.step;
}

/**
 * Fold one `llm/retry-started`: close the wait it ended and re-anchor model time
 * onto the attempt that is about to run.
 * @param open - the open step the retry belongs to.
 * @param time - the retry-started wall time.
 * @returns the re-anchored step boundary.
 */
function reanchor(open: OpenStep, time: number): OpenStep {
  const waited = open.pendingRetryTime === null ? 0 : Math.max(0, time - open.pendingRetryTime);
  return {
    ...open,
    anchorTime: time,
    attemptFirstTokenTime: null,
    retries: open.retries + 1,
    retryMs: open.retryMs + waited,
    pendingRetryTime: null,
  };
}

/** Fold one committed event; return the same reference when nothing changed. */
function fold(state: TimingState, event: TimingEvent): TimingState {
  switch (event.type) {
    case "step/start":
      return {
        ...state,
        openStep: {
          turn: event.data.turn,
          step: event.data.step,
          anchorTime: event.time,
          attemptFirstTokenTime: null,
          retries: 0,
          retryMs: 0,
          pendingRetryTime: null,
        },
      };
    case "llm/retry": {
      const open = state.openStep;
      if (open === null || !onOpenStep(open, event)) return state;
      return { ...state, openStep: { ...open, pendingRetryTime: event.time } };
    }
    case "llm/retry-started": {
      const open = state.openStep;
      if (open === null || !onOpenStep(open, event)) return state;
      return { ...state, openStep: reanchor(open, event.time) };
    }
    case "assistant/attempt": {
      const open = state.openStep;
      if (open === null || !onOpenStep(open, event) || open.attemptFirstTokenTime !== null) return state;
      const first = firstTokenTime(event.data.stream);
      if (first === undefined) return state;
      return { ...state, openStep: { ...open, attemptFirstTokenTime: first } };
    }
    case "assistant/message": {
      const open = state.openStep;
      if (open === null || !onOpenStep(open, event)) return state;
      const first = open.attemptFirstTokenTime ?? firstTokenTime(event.data.stream) ?? null;
      const settled: TimingState = {
        ...state,
        llmMs: state.llmMs + Math.max(0, event.time - open.anchorTime),
        retryMs: state.retryMs + open.retryMs,
        retries: state.retries + open.retries,
        openStep: null,
      };
      if (first === null) return settled;
      const ttftMs = state.ttftMs + Math.max(0, first - open.anchorTime);
      const ttftSteps = state.ttftSteps + 1;
      const outputTokens = usageOutputTokens(event.data.usage);
      if (outputTokens === null) return { ...settled, ttftMs, ttftSteps };
      return {
        ...settled,
        ttftMs,
        ttftSteps,
        decodeMs: state.decodeMs + Math.max(0, event.time - first),
        decodeTokens: state.decodeTokens + outputTokens,
      };
    }
    case "tool/call":
      return { ...state, pendingCalls: { ...state.pendingCalls, [event.data.callId]: event.time } };
    case "tool/result": {
      const callId = event.data.message.source.callId;
      if (!Object.hasOwn(state.pendingCalls, callId)) return state;
      const dispatched = state.pendingCalls[callId] ?? event.time;
      const pendingCalls = Object.fromEntries(Object.entries(state.pendingCalls).filter(([id]) => id !== callId));
      return { ...state, toolMs: state.toolMs + Math.max(0, event.time - dispatched), pendingCalls };
    }
    case "step/end": {
      const open = state.openStep;
      const closed: TimingState = {
        ...state,
        steps: state.steps + 1,
        turns: state.lastTurn === event.data.turn ? state.turns : state.turns + 1,
        lastTurn: event.data.turn,
        openStep: null,
      };
      // A step that never assembled a message (cancelled, or failed past its
      // retry budget) still waited; its retries belong to the session totals.
      if (open === null) return closed;
      return { ...closed, retryMs: state.retryMs + open.retryMs, retries: state.retries + open.retries };
    }
    case "turn/end":
      return Object.keys(state.pendingCalls).length === 0 ? state : { ...state, pendingCalls: {} };
  }
}

/** The `sessionTiming` unit registered on `ctx.sessionProjections`. */
export const sessionTimingProjectionDefinition = {
  key: "sessionTiming",
  stateVersion: 1,
  stateSchema: timingStateSchema,
  init: () => createTimingState(),
  apply: (state: TimingState, event: UnknownEvent): TimingState => (isTimingEvent(event) ? fold(state, event) : state),
  wire: {
    viewSchema: timingViewSchema,
    view: (state: TimingState) => ({
      turns: state.turns,
      steps: state.steps,
      llmMs: state.llmMs,
      toolMs: state.toolMs,
      ttftMs: state.ttftMs,
      ttftSteps: state.ttftSteps,
      decodeMs: state.decodeMs,
      decodeTokens: state.decodeTokens,
      retryMs: state.retryMs,
      retries: state.retries,
    }),
  },
};
