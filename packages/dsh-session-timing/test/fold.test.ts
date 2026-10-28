/**
 * The retry-aware timing fold.
 *
 * The shipped `sessionStats` fold anchors a step at `step/start` and never
 * re-anchors, so a retried step reports the failed attempt plus the backoff
 * wait as model time. These cases pin the corrected reading: model time starts
 * at the attempt that produced the shipped message, and the backoff wait is
 * reported on its own line.
 */
import { describe, expect, it } from "vitest";
import { event, streamTokensAt } from "./fold-fixtures.ts";
import { createTimingState, sessionTimingProjectionDefinition } from "../src/projection.ts";
import { timingStateSchema, timingViewSchema } from "../src/schema.ts";

const definition = sessionTimingProjectionDefinition;
/** Replay one event list from the definition's own init. */
function replay(events: ReturnType<typeof event>[]) {
  return events.reduce((state, one) => definition.apply(state, one), createTimingState());
}
/** The wire value the client reads. */
function view(events: ReturnType<typeof event>[]) {
  return timingViewSchema.parse(definition.wire.view(replay(events)));
}

describe("session timing fold", () => {
  it("reads one clean step as model, first-token, and decode spans", () => {
    const value = view([
      event(1_000, "step/start", { turn: 1, step: 1 }),
      event(1_500, "assistant/attempt", { turn: 1, step: 1, stream: streamTokensAt([1_500]) }),
      event(3_000, "assistant/message", { turn: 1, step: 1, stream: [], usage: { outputTokens: 100 } }),
      event(3_100, "step/end", { turn: 1, step: 1 }),
    ]);
    expect(value.llmMs).toBe(2_000);
    expect(value.ttftMs).toBe(500);
    expect(value.ttftSteps).toBe(1);
    expect(value.decodeMs).toBe(1_500);
    expect(value.decodeTokens).toBe(100);
    expect(value.retryMs).toBe(0);
    expect(value.retries).toBe(0);
    expect(value.turns).toBe(1);
    expect(value.steps).toBe(1);
  });

  it("starts model time at the attempt that shipped, and reports the wait apart", () => {
    const value = view([
      event(1_000, "step/start", { turn: 1, step: 1 }),
      event(1_200, "assistant/attempt", { turn: 1, step: 1, stream: streamTokensAt([1_200]) }),
      event(1_600, "llm/retry", { turn: 1, step: 1, retry: 1, delayMs: 1_000 }),
      event(2_600, "llm/retry-started", { turn: 1, step: 1, retry: 1 }),
      event(2_800, "assistant/attempt", { turn: 1, step: 1, stream: streamTokensAt([2_800]) }),
      event(4_000, "assistant/message", { turn: 1, step: 1, stream: [], usage: { outputTokens: 50 } }),
      event(4_100, "step/end", { turn: 1, step: 1 }),
    ]);
    expect(value.retryMs).toBe(1_000);
    expect(value.retries).toBe(1);
    expect(value.llmMs).toBe(1_400);
    expect(value.ttftMs).toBe(200);
    expect(value.decodeMs).toBe(1_200);
    expect(value.decodeTokens).toBe(50);
  });

  it("discards a mid-stream attempt when the retry replaces it", () => {
    const value = view([
      event(1_000, "step/start", { turn: 1, step: 1 }),
      event(1_100, "assistant/attempt", { turn: 1, step: 1, stream: streamTokensAt([1_100]) }),
      event(1_500, "llm/retry", { turn: 1, step: 1, retry: 1, delayMs: 500 }),
      event(2_000, "llm/retry-started", { turn: 1, step: 1, retry: 1 }),
      event(2_100, "assistant/attempt", { turn: 1, step: 1, stream: streamTokensAt([2_100]) }),
      event(3_000, "assistant/message", { turn: 1, step: 1, stream: [], usage: { outputTokens: 10 } }),
      event(3_100, "step/end", { turn: 1, step: 1 }),
    ]);
    expect(value.retryMs).toBe(500);
    expect(value.llmMs).toBe(1_000);
    expect(value.ttftMs).toBe(100);
    expect(value.decodeMs).toBe(900);
  });

  it("counts one wait per retry, not the planned delay", () => {
    const value = view([
      event(1_000, "step/start", { turn: 1, step: 1 }),
      event(1_100, "llm/retry", { turn: 1, step: 1, retry: 1, delayMs: 5_000 }),
      event(1_900, "llm/retry-started", { turn: 1, step: 1, retry: 1 }),
      event(2_000, "llm/retry", { turn: 1, step: 1, retry: 2, delayMs: 5_000 }),
      event(2_250, "llm/retry-started", { turn: 1, step: 1, retry: 2 }),
      event(2_400, "assistant/attempt", { turn: 1, step: 1, stream: streamTokensAt([2_400]) }),
      event(3_400, "assistant/message", { turn: 1, step: 1, stream: [], usage: { outputTokens: 5 } }),
      event(3_500, "step/end", { turn: 1, step: 1 }),
    ]);
    // Waits are measured, not planned: 800 + 250, not 5_000 + 5_000.
    expect(value.retryMs).toBe(1_050);
    expect(value.retries).toBe(2);
    // 3_400 − 2_250: only the attempt that shipped.
    expect(value.llmMs).toBe(1_150);
  });

  it("ignores a retry that never got past its wait", () => {
    const value = view([
      event(1_000, "step/start", { turn: 1, step: 1 }),
      event(1_100, "llm/retry", { turn: 1, step: 1, retry: 1, delayMs: 30_000 }),
      event(1_400, "step/end", { turn: 1, step: 1 }),
      event(2_000, "step/start", { turn: 1, step: 2 }),
      event(2_100, "assistant/attempt", { turn: 1, step: 2, stream: streamTokensAt([2_100]) }),
      event(2_600, "assistant/message", { turn: 1, step: 2, stream: [], usage: { outputTokens: 1 } }),
      event(2_700, "step/end", { turn: 1, step: 2 }),
    ]);
    expect(value.retryMs).toBe(0);
    expect(value.retries).toBe(0);
    // 2_600 − 2_000: the second step's own span, unaffected by the abandoned wait.
    expect(value.llmMs).toBe(600);
    expect(value.ttftMs).toBe(100);
  });

  it("does not let a stale wait land on the next step", () => {
    const value = view([
      event(1_000, "step/start", { turn: 1, step: 1 }),
      event(1_100, "llm/retry", { turn: 1, step: 1, retry: 1, delayMs: 900 }),
      event(1_200, "llm/retry-started", { turn: 1, step: 2, retry: 1 }),
      event(1_300, "assistant/attempt", { turn: 1, step: 1, stream: streamTokensAt([1_300]) }),
      event(2_300, "assistant/message", { turn: 1, step: 1, stream: [], usage: { outputTokens: 2 } }),
      event(2_400, "step/end", { turn: 1, step: 1 }),
    ]);
    expect(value.retryMs).toBe(0);
    expect(value.llmMs).toBe(1_300);
  });

  it("counts turns once and steps every time", () => {
    const value = view([
      event(1_000, "step/start", { turn: 1, step: 1 }),
      event(1_100, "assistant/message", { turn: 1, step: 1, stream: [], usage: { outputTokens: 1 } }),
      event(1_200, "step/end", { turn: 1, step: 1 }),
      event(1_300, "step/start", { turn: 1, step: 2 }),
      event(1_400, "assistant/message", { turn: 1, step: 2, stream: [], usage: { outputTokens: 1 } }),
      event(1_500, "step/end", { turn: 1, step: 2 }),
      event(1_600, "step/start", { turn: 2, step: 1 }),
      event(1_700, "assistant/message", { turn: 2, step: 1, stream: [], usage: { outputTokens: 1 } }),
      event(1_800, "step/end", { turn: 2, step: 1 }),
    ]);
    expect(value.turns).toBe(2);
    expect(value.steps).toBe(3);
  });

  it("pairs tool calls by callId and forgets the unfinished ones at turn end", () => {
    const call = (callId: string) => ({ message: { source: { callId } } });
    const value = view([
      event(1_000, "step/start", { turn: 1, step: 1 }),
      event(1_100, "tool/call", { callId: "a" }),
      event(1_400, "tool/result", call("a")),
      event(1_500, "tool/call", { callId: "b" }),
      event(1_600, "step/end", { turn: 1, step: 1 }),
      event(1_700, "turn/end", { turn: 1 }),
      event(1_800, "tool/call", { callId: "c" }),
      event(1_900, "tool/result", call("c")),
    ]);
    // a: 300ms; b never resolved and turn/end dropped it; c: 100ms.
    expect(value.toolMs).toBe(400);
  });

  it("leaves unrelated events on the same state reference", () => {
    const state = createTimingState();
    expect(definition.apply(state, event(1, "turn/start", { turn: 1 }))).toBe(state);
    expect(definition.apply(state, event(1, "request/header", {}))).toBe(state);
  });

  it("keeps the persisted shape and the wire shape separate", () => {
    const state = replay([
      event(1_000, "step/start", { turn: 1, step: 1 }),
      event(1_100, "tool/call", { callId: "a" }),
    ]);
    expect(() => timingStateSchema.parse(state)).not.toThrow();
    expect(Object.keys(timingViewSchema.parse(definition.wire.view(state)))).toEqual([
      "turns",
      "steps",
      "llmMs",
      "toolMs",
      "ttftMs",
      "ttftSteps",
      "decodeMs",
      "decodeTokens",
      "retryMs",
      "retries",
    ]);
    expect(() => timingStateSchema.parse({ ...state, llmMs: -1 })).toThrow();
    expect(() => timingViewSchema.parse({ turns: 0 })).toThrow();
  });
});