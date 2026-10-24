import { describe, expect, it } from "vitest";

import { collectTurns, renderTurns } from "../src/history.ts";
import type { SessionEventLike } from "../src/history.ts";

/** One assistant message event, spelled the way the session log really does. */
function assistant(turn: number, seq: number, text: string, extra: Record<string, unknown> = {}): SessionEventLike {
  return {
    type: "assistant/message",
    seq,
    time: seq,
    data: {
      turn,
      step: 1,
      message: { content: [{ type: "text", text }] },
      ...extra,
    },
  } as SessionEventLike;
}

/** One user prompt event; `source.kind` tells a human prompt from injected context. */
function user(seq: number, text: string, kind = "user"): SessionEventLike {
  return {
    type: "user/message",
    seq,
    time: seq,
    data: { content: [{ type: "text", text }], source: { kind } },
  };
}

describe("collecting the last n turns", () => {
  it("takes the final reply of each turn, not every step's reply", () => {
    const events = [
      user(1, "first question"),
      assistant(1, 2, "draft after tool"),
      assistant(1, 3, "final answer one"),
      user(4, "second question"),
      assistant(2, 5, "final answer two"),
    ];
    expect(collectTurns(events, { count: 1, includeUser: false })).toEqual([
      { turn: 2, assistant: "final answer two", user: undefined },
    ]);
    expect(collectTurns(events, { count: 2, includeUser: false })).toEqual([
      { turn: 1, assistant: "final answer one", user: undefined },
      { turn: 2, assistant: "final answer two", user: undefined },
    ]);
  });

  it("orders the selection oldest-first so the clipboard reads like the conversation", () => {
    const events = [
      assistant(1, 1, "one"),
      assistant(2, 2, "two"),
      assistant(3, 3, "three"),
    ];
    expect(collectTurns(events, { count: 2, includeUser: false }).map(turn => turn.assistant)).toEqual(["two", "three"]);
  });

  it("includes the prompt that opened each selected turn only when asked", () => {
    const events = [
      { type: "turn/start", seq: 0, time: 0, data: { turn: 1 } },
      user(1, "please refactor"),
      assistant(1, 2, "done"),
      { type: "turn/start", seq: 2, time: 2, data: { turn: 2 } },
      user(3, "now test it"),
      assistant(2, 4, "tested"),
    ];
    expect(collectTurns(events, { count: 1, includeUser: true })).toEqual([
      { turn: 2, assistant: "tested", user: "now test it" },
    ]);
  });

  it("skips injected context and keeps the human prompt", () => {
    const events = [
      { type: "turn/start", seq: 0, time: 0, data: { turn: 1 } },
      user(1, "system notice about a changed file", "system-prompt"),
      user(2, "real question"),
      assistant(1, 3, "answer"),
    ];
    expect(collectTurns(events, { count: 1, includeUser: true })).toEqual([
      { turn: 1, assistant: "answer", user: "real question" },
    ]);
  });

  it("keeps every human prompt of a turn, because a queued follow-up lands there too", () => {
    const events = [
      { type: "turn/start", seq: 0, time: 0, data: { turn: 1 } },
      user(1, "start on the parser"),
      user(2, "also rename the field"),
      assistant(1, 3, "did both"),
    ];
    expect(collectTurns(events, { count: 1, includeUser: true })).toEqual([
      { turn: 1, assistant: "did both", user: "start on the parser\n\nalso rename the field" },
    ]);
  });

  it("skips a turn whose assistant text is empty or blank", () => {
    const events = [
      assistant(1, 1, "   "),
      assistant(2, 2, "real"),
    ];
    expect(collectTurns(events, { count: 5, includeUser: false })).toEqual([
      { turn: 2, assistant: "real", user: undefined },
    ]);
  });

  it("keeps text blocks only and joins them without a separator", () => {
    const events = [
      {
        type: "assistant/message",
        seq: 1,
        time: 1,
        data: {
          turn: 1,
          step: 1,
          message: {
            content: [
              { type: "reasoning", text: "thinking hard" },
              { type: "text", text: "part one" },
              { type: "text", text: " part two" },
            ],
          },
          stream: [],
        },
      },
    ];
    expect(collectTurns(events, { count: 1, includeUser: false })[0]?.assistant).toBe("part one part two");
  });

  it("ignores events that are not messages", () => {
    const events = [
      { type: "turn/start", seq: 1, time: 1, data: { turn: 1 } },
      assistant(1, 2, "answer"),
      { type: "tool/call", seq: 3, time: 3, data: { turn: 1, step: 1, callId: "c", name: "bash", arguments: "{}" } },
    ];
    expect(collectTurns(events, { count: 1, includeUser: false })).toHaveLength(1);
  });

  it("returns an empty selection when the log holds nothing copyable", () => {
    expect(collectTurns([], { count: 3, includeUser: true })).toEqual([]);
  });

  it("takes the newest turns and never more than exist", () => {
    const events = [assistant(1, 1, "one"), assistant(2, 2, "two")];
    expect(collectTurns(events, { count: 9, includeUser: false })).toHaveLength(2);
  });
});

describe("rendering the selection", () => {
  it("separates turns with a blank line and keeps the prompt above its reply", () => {
    const text = renderTurns([
      { turn: 1, assistant: "first answer", user: undefined },
      { turn: 2, assistant: "second answer", user: "second question" },
    ]);
    expect(text).toBe("first answer\n\nsecond question\n\nsecond answer");
  });

  it("returns an empty string for an empty selection", () => {
    expect(renderTurns([])).toBe("");
  });
});
