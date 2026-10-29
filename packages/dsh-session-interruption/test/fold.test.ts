/**
 * The interruption fold.
 *
 * These cases pin the reading the sidebar marker is built on: the session is
 * interrupted exactly when its newest turn never saw a `turn/end`. Cancels,
 * resumes, superseded turns, and unrelated event types must all read healthy
 * or stay silent — a marker that lights on those would train the user to
 * ignore it.
 */
import { describe, expect, it } from "vitest";
import { event } from "./fold-fixtures.ts";
import { createInterruptionState, sessionInterruptionProjectionDefinition } from "../src/projection.ts";
import { interruptionStateSchema, interruptionViewSchema } from "../src/schema.ts";

const definition = sessionInterruptionProjectionDefinition;
/** Replay one event list from the definition's own init. */
function replay(events: ReturnType<typeof event>[]) {
  return events.reduce((state, one) => definition.apply(state, one), createInterruptionState());
}
/** The wire value the client reads. */
function view(events: ReturnType<typeof event>[]) {
  return interruptionViewSchema.parse(definition.wire.view(replay(events)));
}

describe("session interruption fold", () => {
  it("reads a cleanly closed turn as not interrupted", () => {
    const value = view([
      event(1_000, "turn/start", { turn: 1 }),
      event(1_100, "step/start", { turn: 1, step: 1 }),
      event(3_900, "step/end", { turn: 1, step: 1 }),
      event(4_000, "turn/end", { turn: 1 }),
    ]);
    expect(value.interrupted).toBe(false);
    expect(value.turn).toBeNull();
    expect(value.since).toBeNull();
    expect(value.pendingToolCount).toBe(0);
  });

  it("reads a turn cut by a forced stop as interrupted since its start", () => {
    const value = view([
      event(1_000, "turn/start", { turn: 1 }),
      event(1_100, "step/start", { turn: 1, step: 1 }),
    ]);
    expect(value.interrupted).toBe(true);
    expect(value.turn).toBe(1);
    expect(value.since).toBe(1_000);
  });

  it("reads a user-cancelled turn as not interrupted, because the loop still lands turn/end", () => {
    const value = view([
      event(1_000, "turn/start", { turn: 1 }),
      event(1_100, "step/start", { turn: 1, step: 1 }),
      event(1_500, "step/end", { turn: 1, step: 1 }),
      event(1_600, "turn/end", { turn: 1 }),
    ]);
    expect(value.interrupted).toBe(false);
  });

  it("lets a newer closed turn supersede an older open one", () => {
    const value = view([
      event(1_000, "turn/start", { turn: 1 }),
      event(2_000, "turn/start", { turn: 2 }),
      event(3_000, "turn/end", { turn: 2 }),
    ]);
    expect(value.interrupted).toBe(false);
    expect(value.turn).toBeNull();
  });

  it("keeps the interrupted reading while the newest turn is the open one", () => {
    const value = view([
      event(1_000, "turn/start", { turn: 1 }),
      event(2_000, "turn/end", { turn: 1 }),
      event(5_000, "turn/start", { turn: 2 }),
      event(5_100, "step/start", { turn: 2, step: 1 }),
    ]);
    expect(value.interrupted).toBe(true);
    expect(value.turn).toBe(2);
    expect(value.since).toBe(5_000);
  });

  it("counts tool calls still hanging inside the open turn", () => {
    const value = view([
      event(1_000, "turn/start", { turn: 1 }),
      event(1_200, "tool/call", { callId: "call_a" }),
      event(1_300, "tool/call", { callId: "call_b" }),
    ]);
    expect(value.interrupted).toBe(true);
    expect(value.pendingToolCount).toBe(2);
  });

  it("drops a pending count once the result lands", () => {
    const value = view([
      event(1_000, "turn/start", { turn: 1 }),
      event(1_200, "tool/call", { callId: "call_a" }),
      event(1_800, "tool/result", { message: { source: { callId: "call_a" } } }),
    ]);
    expect(value.pendingToolCount).toBe(0);
    expect(value.interrupted).toBe(true);
  });

  it("retires a superseded turn's hanging calls when a new turn opens", () => {
    const value = view([
      event(1_000, "turn/start", { turn: 1 }),
      event(1_200, "tool/call", { callId: "call_a" }),
      event(2_000, "turn/start", { turn: 2 }),
      event(3_000, "turn/end", { turn: 2 }),
    ]);
    expect(value.interrupted).toBe(false);
    expect(value.pendingToolCount).toBe(0);
  });

  it("ignores event types outside the fold's slice", () => {
    const value = view([
      event(500, "approval/policy", {}),
      event(600, "agent/inbox/spliced", {}),
      event(700, "session/end-seed", {}),
    ]);
    expect(value.interrupted).toBe(false);
    expect(value.turn).toBeNull();
    expect(value.since).toBeNull();
    expect(value.pendingToolCount).toBe(0);
  });

  it("does not let a stale end for an older turn close the newest open one", () => {
    const value = view([
      event(1_000, "turn/start", { turn: 1 }),
      event(2_000, "turn/start", { turn: 2 }),
      event(2_500, "turn/end", { turn: 1 }),
    ]);
    expect(value.interrupted).toBe(true);
    expect(value.turn).toBe(2);
  });

  it("validates the persisted state and rejects a widened wire view", () => {
    const state = replay([
      event(1_000, "turn/start", { turn: 1 }),
      event(1_200, "tool/call", { callId: "call_a" }),
    ]);
    expect(() => interruptionStateSchema.parse(state)).not.toThrow();
    expect(() => interruptionStateSchema.parse({ ...state, lastTurn: -1 })).toThrow(/lastTurn/);
    expect(() => interruptionStateSchema.parse({ ...state, lastTurnClosed: "yes" })).toThrow(/lastTurnClosed/);
    expect(() => interruptionStateSchema.parse({ ...state, pendingCalls: [] })).toThrow(/pendingCalls/);
    const wire = definition.wire.view(replay([event(1_000, "turn/start", { turn: 1 })]));
    expect(() => interruptionViewSchema.parse(wire)).not.toThrow();
    expect(() => interruptionViewSchema.parse({ ...wire, since: -5 })).toThrow(/since/);
    expect(() => interruptionViewSchema.parse({ ...wire, interrupted: 1 })).toThrow(/interrupted/);
    expect(() => interruptionViewSchema.parse({ ...wire, extra: true })).toThrow(/extra field/);
  });
});
