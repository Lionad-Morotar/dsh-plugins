/**
 * The activity fold.
 *
 * These cases pin the reading the sidebar tint is built on: a session is as
 * alive as its newest committed event, and only a human prompt counts as a
 * prompt. The distinction matters because the host's own `updatedAt` is
 * `max(createdAt, lastPromptAt)`, which ignores everything an agent does on its
 * own — a session that spent twenty minutes in tool calls would read as stale.
 */
import { describe, expect, it } from "vitest";
import { assistantMessage, event, userMessage } from "./fold-fixtures.ts";
import { sessionActivityProjectionDefinition } from "../src/projection.ts";
import { activityStateSchema, activityViewSchema } from "../src/schema.ts";
import type { ActivityState, ActivityView, UnknownEvent } from "../src/types.ts";

const definition = sessionActivityProjectionDefinition;

/** Replay one event list from the definition's own init. */
function replay(events: readonly UnknownEvent[]): ActivityState {
  return events.reduce<ActivityState>((state, one) => definition.apply(state, one), definition.init());
}

/** The wire value the client reads. */
function view(events: readonly UnknownEvent[]): ActivityView {
  return activityViewSchema.parse(definition.wire.view(replay(events)));
}

describe("session activity fold", () => {
  it("reads an empty log as a session nothing has happened in", () => {
    expect(view([])).toEqual({ lastActivityAt: null, promptCount: 0, turnCount: 0, toolCallCount: 0 });
  });

  it("advances the last activity instant on an assistant message without counting a prompt", () => {
    const value = view([assistantMessage(4_000)]);
    expect(value.lastActivityAt).toBe(4_000);
    expect(value.promptCount).toBe(0);
  });

  it("counts a human prompt", () => {
    const value = view([userMessage(1_000, "user")]);
    expect(value.promptCount).toBe(1);
    expect(value.lastActivityAt).toBe(1_000);
  });

  it("does not count an injected message as a prompt but still treats it as activity", () => {
    const value = view([
      userMessage(1_000, "system"),
      event(2_000, "user/message", { content: [] }),
      event(3_000, "user/message", {}),
    ]);
    expect(value.promptCount).toBe(0);
    expect(value.lastActivityAt).toBe(3_000);
  });

  it("counts a tool call and treats it as activity", () => {
    const value = view([event(2_000, "tool/call", { callId: "call_a" })]);
    expect(value.toolCallCount).toBe(1);
    expect(value.lastActivityAt).toBe(2_000);
  });

  it("keeps the newest instant when a later event carries an older timestamp", () => {
    const value = view([event(5_000, "turn/start", { turn: 2 }), event(3_000, "tool/call", { callId: "call_a" })]);
    expect(value.lastActivityAt).toBe(5_000);
    expect(value.toolCallCount).toBe(1);
  });

  it("returns the same state reference when an event changes nothing", () => {
    const after = replay([event(5_000, "turn/start", { turn: 1 })]);
    expect(definition.apply(after, event(4_000, "turn/end", { turn: 1 }))).toBe(after);
    expect(definition.apply(after, event(5_000, "turn/end", { turn: 1 }))).toBe(after);
  });

  it("adds up one ordinary turn across every activity source", () => {
    const value = view([
      userMessage(1_000, "user"),
      event(1_100, "turn/start", { turn: 1 }),
      event(1_200, "tool/call", { callId: "call_a" }),
      event(1_900, "tool/result", { message: { source: { callId: "call_a" } } }),
      assistantMessage(2_000, 1),
      event(2_100, "turn/end", { turn: 1 }),
    ]);
    expect(value).toEqual({ lastActivityAt: 2_100, promptCount: 1, turnCount: 1, toolCallCount: 1 });
  });

  it("hands every session its own zero state", () => {
    expect(definition.init()).not.toBe(definition.init());
    expect(definition.init()).toEqual({ lastActivityAt: null, promptCount: 0, turnCount: 0, toolCallCount: 0 });
  });

  it("validates the persisted state and refuses a widened wire view", () => {
    const state = replay([userMessage(1_000, "user"), event(1_200, "tool/call", { callId: "call_a" })]);
    expect(() => activityStateSchema.parse(state)).not.toThrow();
    expect(() => activityStateSchema.parse({ ...state, promptCount: undefined })).toThrow(/promptCount/);
    expect(() => activityStateSchema.parse({ ...state, turnCount: "1" })).toThrow(/turnCount/);
    expect(() => activityStateSchema.parse({ ...state, lastActivityAt: -1 })).toThrow(/lastActivityAt/);

    const wire = definition.wire.view(state);
    expect(() => activityViewSchema.parse(wire)).not.toThrow();
    expect(() => activityViewSchema.parse({ ...wire, extra: true })).toThrow(/extra field/);
    expect(() => activityViewSchema.parse({ ...wire, toolCallCount: -1 })).toThrow(/toolCallCount/);
  });
});
