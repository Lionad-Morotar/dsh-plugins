/**
 * The fold's contract, pinned on real Turn shapes.
 *
 * The long case is lifted verbatim from the session that motivated the package:
 * a Turn that asked a question at 04:21, was answered at 13:25, and therefore
 * reported 9h39m of "deep diving" for 2h30m of work. Its numbers are the
 * acceptance test — the correction has to land within a millisecond of the
 * arithmetic a human does from the event log.
 */
import { describe, expect, it } from "vitest";
import { turnClockProjectionDefinition } from "../src/projection.ts";
import { clockStateSchema, clockViewSchema, createClockState } from "../src/schema.ts";
import type { UnknownEvent } from "../src/event.ts";
import type { TurnClockState } from "../src/types.ts";

/** Fold one event through the registered unit, exactly as the registry would. */
function apply(state: TurnClockState, event: UnknownEvent): TurnClockState {
  return turnClockProjectionDefinition.apply(state, event);
}

/** Fold a whole event list from the zero state. */
function fold(events: readonly UnknownEvent[]): TurnClockState {
  return events.reduce(apply, createClockState());
}

/** One `turn/start`. */
function turnStart(seq: number, time: number, turn: number): UnknownEvent {
  return { seq, time, type: "turn/start", data: { turn } };
}

/** One `turn/end`. */
function turnEnd(seq: number, time: number, turn: number): UnknownEvent {
  return { seq, time, type: "turn/end", data: { turn } };
}

/** One `ask_user_question` call. */
function askCall(seq: number, time: number, callId: string): UnknownEvent {
  return { seq, time, type: "tool/call", data: { name: "ask_user_question", callId } };
}

/** One tool result closing `callId`. */
function toolResult(seq: number, time: number, callId: string): UnknownEvent {
  return { seq, time, type: "tool/result", data: { message: { source: { callId } } } };
}

/** One late user-question reply. */
function questionReply(seq: number, time: number, callId: string): UnknownEvent {
  return { seq, time, type: "user/message", data: { source: { kind: "user-question-reply", callId } } };
}

/** The 9.66-hour Turn from the motivating session: two question waits inside one Turn. */
const LONG_TURN: readonly UnknownEvent[] = [
  turnStart(1800, 1_793_995_731_847, 2),
  askCall(1090, 1_793_996_170_457, "ask-1"),
  toolResult(1100, 1_793_996_494_475, "ask-1"),
  askCall(2601, 1_794_003_694_558, "ask-2"),
  toolResult(2602, 1_794_029_106_263, "ask-2"),
  turnEnd(2800, 1_794_030_505_256, 2),
];

/** Wall span, both waits, and the working time they leave. */
const LONG_TURN_WALL = 34_773_409;
const LONG_TURN_WAIT = 324_018 + 25_411_705;
const LONG_TURN_NET = LONG_TURN_WALL - LONG_TURN_WAIT;

describe("turnClock fold", () => {
  it("starts empty", () => {
    expect(createClockState()).toEqual({
      inheritedEventCount: 0,
      currentTurn: null,
      turnStart: null,
      waitMs: 0,
      ask: null,
      totalWaitMs: 0,
      turnNet: {},
    });
  });

  it("records a Turn's wall span as its net when nothing was asked", () => {
    const state = fold([turnStart(1, 1_000, 1), turnEnd(2, 61_000, 1)]);
    expect(state.turnNet).toEqual({ "1": 60_000 });
    expect(state.totalWaitMs).toBe(0);
    expect(state.currentTurn).toBeNull();
  });

  it("reproduces the motivating 9.66-hour Turn as 2h30m of work", () => {
    const state = fold(LONG_TURN);
    expect(state.turnNet["2"]).toBe(LONG_TURN_NET);
    expect(LONG_TURN_NET).toBe(9_037_686);
    expect(state.totalWaitMs).toBe(LONG_TURN_WAIT);
  });

  it("reports the open question while the Turn is blocked", () => {
    const state = fold([turnStart(1, 1_000, 1), askCall(2, 2_000, "ask-1")]);
    expect(state.currentTurn).toBe(1);
    expect(state.turnStart).toBe(1_000);
    expect(state.ask).toEqual({ callId: "ask-1", since: 2_000 });
    expect(state.waitMs).toBe(0);
    expect(turnClockProjectionDefinition.wire.view(state).waitSince).toBe(2_000);
  });

  it("settles the wait into both counters when the result lands", () => {
    const state = fold([turnStart(1, 1_000, 1), askCall(2, 2_000, "ask-1"), toolResult(3, 5_000, "ask-1")]);
    expect(state.ask).toBeNull();
    expect(state.waitMs).toBe(3_000);
    expect(state.totalWaitMs).toBe(3_000);
    expect(turnClockProjectionDefinition.wire.view(state).waitSince).toBeNull();
  });

  it("ignores every other tool's call and result", () => {
    const state = fold([
      turnStart(1, 1_000, 1),
      { seq: 2, time: 2_000, type: "tool/call", data: { name: "bash", callId: "call-bash" } },
      toolResult(3, 9_000, "call-bash"),
      turnEnd(4, 11_000, 1),
    ]);
    expect(state.turnNet).toEqual({ "1": 10_000 });
    expect(state.totalWaitMs).toBe(0);
  });

  it("keeps the first anchor when a second question overlaps", () => {
    const state = fold([turnStart(1, 1_000, 1), askCall(2, 2_000, "ask-1"), askCall(3, 3_000, "ask-2")]);
    expect(state.ask).toEqual({ callId: "ask-1", since: 2_000 });
    // The second call's result closes nothing; the first one still owns the gate.
    expect(fold([turnStart(1, 1_000, 1), askCall(2, 2_000, "ask-1"), askCall(3, 3_000, "ask-2"), toolResult(4, 4_000, "ask-1")]).waitMs).toBe(2_000);
  });

  it("closes a timed-out question on its pending result, not on the late reply", () => {
    const state = fold([
      turnStart(1, 1_000, 1),
      askCall(2, 2_000, "ask-1"),
      // The timed tool returns the pending payload at its deadline; the model
      // resumes work then, and the answer arrives much later as a user message.
      toolResult(3, 122_000, "ask-1"),
      turnEnd(4, 200_000, 1),
      questionReply(5, 900_000, "ask-1"),
    ]);
    expect(state.turnNet["1"]).toBe(200_000 - 1_000 - 120_000);
    expect(state.totalWaitMs).toBe(120_000);
  });

  it("closes a wait that a late reply beats the result to", () => {
    const state = fold([turnStart(1, 1_000, 1), askCall(2, 2_000, "ask-1"), questionReply(3, 7_000, "ask-1")]);
    expect(state.ask).toBeNull();
    expect(state.waitMs).toBe(5_000);
  });

  it("settles a wait the Turn ended inside of", () => {
    const state = fold([turnStart(1, 1_000, 1), askCall(2, 2_000, "ask-1"), turnEnd(3, 62_000, 1)]);
    expect(state.ask).toBeNull();
    expect(state.turnNet["1"]).toBe(1_000);
    expect(state.totalWaitMs).toBe(60_000);
  });

  it("skips events a fork inherited from its parent", () => {
    const state = turnClockProjectionDefinition.apply(
      createClockState(10),
      { seq: 9, time: 1_000, type: "turn/start", data: { turn: 1 } },
    );
    expect(state.turnStart).toBeNull();
    const afterInherit = turnClockProjectionDefinition.apply(createClockState(10), turnStart(11, 5_000, 3));
    expect(afterInherit.turnStart).toBe(5_000);
  });

  it("keeps Turn durations across several Turns", () => {
    const state = fold([
      turnStart(1, 1_000, 1),
      turnEnd(2, 11_000, 1),
      turnStart(3, 20_000, 2),
      askCall(4, 21_000, "ask-1"),
      toolResult(5, 26_000, "ask-1"),
      turnEnd(6, 31_000, 2),
    ]);
    expect(state.turnNet).toEqual({ "1": 10_000, "2": 6_000 });
  });

  it("returns the same state reference for unrelated events", () => {
    const state = fold([turnStart(1, 1_000, 1)]);
    expect(apply(state, { seq: 2, time: 2_000, type: "assistant/message", data: { turn: 1, step: 1 } })).toBe(state);
  });

  it("validates its own wire view", () => {
    const state = fold(LONG_TURN);
    const view = turnClockProjectionDefinition.wire.view(state);
    expect(clockViewSchema.parse(structuredClone(view))).toEqual(view);
    expect(clockStateSchema.parse(structuredClone(state))).toEqual(state);
    expect(() => clockViewSchema.parse({ ...view, waitMs: -1 })).toThrow(/waitMs/u);
    expect(() => clockViewSchema.parse({ ...view, turnNet: { "2": "9" } })).toThrow(/turnNet/u);
    expect(() => clockViewSchema.parse({ ...view, extra: 1 })).toThrow(/extra field/u);
  });
});
