/**
 * The `skillUsage` fold: how many times each skill was invoked in this session.
 *
 * The count has to come from the log rather than from anything the shell
 * publishes, and the log is noisy: every token chunk, every tool call and every
 * turn boundary passes through the same fold. So the fold's first duty is to
 * return the *same reference* for everything it does not count, because the
 * projection registry detects change by `Object.is` and a fresh object per event
 * would invalidate every snapshot on every chunk.
 *
 * The invocation itself is a `user/message` whose `source` is the host's durable
 * marker: `{ kind: 'skill-invocation', name, form: 'instructions' }`. The host
 * writes it only after validating the name against the user-invocable catalogue,
 * so the fold trusts `name` and does not re-validate it against anything.
 *
 * Fork scope matters here for the same reason it does in `compaction.ts`: a
 * seeded session's log begins with the parent's events, and a subagent that
 * invoked nothing must not report its parent's invocations as its own.
 */
import { describe, expect, it } from "vitest";

import {
  SKILL_USAGE_PROJECTION_KEY,
  SKILL_USAGE_STATE_VERSION,
  createSkillUsageState,
  foldSkillUsage,
  sessionSkillUsageProjection,
  skillUsageStateSchema,
  skillUsageView,
  skillUsageViewSchema,
  type SkillUsageState,
} from "../src/skill-usage.ts";

/** A `user/message` event carrying one message source. */
function message(seq: number, source?: unknown): { type: string; seq: number; data: unknown } {
  return { type: "user/message", seq, data: source === undefined ? {} : { source } };
}

/** A `user/message` that the host stamped as a skill invocation. */
function invocation(seq: number, name: unknown): { type: string; seq: number; data: unknown } {
  return message(seq, { kind: "skill-invocation", name, form: "instructions" });
}

/** Fold a list of events from a state. */
function foldAll(
  events: readonly Parameters<typeof foldSkillUsage>[1][],
  state: SkillUsageState = createSkillUsageState(),
): SkillUsageState {
  return events.reduce<SkillUsageState>((current, event) => foldSkillUsage(current, event), state);
}

describe("createSkillUsageState", () => {
  it("starts empty with no inherited prefix", () => {
    expect(createSkillUsageState()).toEqual({ counts: {}, fromSeq: 0 });
  });

  it("takes a positive integer as the inherited prefix length", () => {
    expect(createSkillUsageState(5)).toEqual({ counts: {}, fromSeq: 5 });
  });

  it("ignores anything that is not a positive integer", () => {
    for (const value of [0, -1, -5, 1.5, Number.NaN, Number.POSITIVE_INFINITY, "5", null, undefined, {}]) {
      expect(createSkillUsageState(value).fromSeq).toBe(0);
    }
  });
});

describe("foldSkillUsage", () => {
  it("counts one skill invocation", () => {
    const state = foldSkillUsage(createSkillUsageState(), invocation(1, "flow-workflow"));

    expect(state.counts).toEqual({ "flow-workflow": 1 });
  });

  it("accumulates repeat invocations of the same skill", () => {
    const state = foldAll([invocation(1, "flow-workflow"), invocation(2, "flow-workflow")]);

    expect(state.counts).toEqual({ "flow-workflow": 2 });
  });

  it("counts two different skills separately", () => {
    const state = foldAll([invocation(1, "flow-workflow"), invocation(2, "code-review")]);

    expect(state.counts).toEqual({ "flow-workflow": 1, "code-review": 1 });
  });

  it("leaves the inherited-prefix offset alone while counting", () => {
    const state = foldSkillUsage(createSkillUsageState(3), invocation(7, "flow-workflow"));

    expect(state.fromSeq).toBe(3);
  });

  it("returns the same reference for a plain user message", () => {
    const state = createSkillUsageState();
    const event = message(1, { kind: "user" });

    expect(Object.is(foldSkillUsage(state, event), state)).toBe(true);
  });

  it("returns the same reference for a message with no source", () => {
    const state = createSkillUsageState();

    expect(Object.is(foldSkillUsage(state, message(1)), state)).toBe(true);
  });

  it("returns the same reference when the source is not an object", () => {
    const state = createSkillUsageState();

    for (const source of ["skill-invocation", 42, true, null, []]) {
      expect(Object.is(foldSkillUsage(state, message(1, source)), state)).toBe(true);
    }
  });

  it("returns the same reference for a source of another kind", () => {
    const state = createSkillUsageState();

    for (const kind of ["user", "plugin", "model", "skill-catalog", ""]) {
      expect(Object.is(foldSkillUsage(state, message(1, { kind, name: "flow-workflow" })), state)).toBe(true);
    }
  });

  it("returns the same reference when the name is missing or unusable", () => {
    const state = createSkillUsageState();

    for (const name of [undefined, null, "", 42, {}, []]) {
      expect(Object.is(foldSkillUsage(state, invocation(1, name)), state)).toBe(true);
    }
  });

  it("returns the same reference for events of another type", () => {
    const state = createSkillUsageState();
    const source = { kind: "skill-invocation", name: "flow-workflow", form: "instructions" };

    for (const type of ["tool/call", "turn/start", "compaction/end", "assistant/message"]) {
      expect(Object.is(foldSkillUsage(state, { type, seq: 1, data: { source } }), state)).toBe(true);
    }
  });

  it("skips invocations inside the fork-inherited prefix", () => {
    const state = createSkillUsageState(5);

    expect(Object.is(foldSkillUsage(state, invocation(3, "flow-workflow")), state)).toBe(true);
  });

  it("counts an invocation at or after the inherited cut", () => {
    const state = createSkillUsageState(5);

    expect(foldSkillUsage(state, invocation(5, "flow-workflow")).counts).toEqual({ "flow-workflow": 1 });
    expect(foldSkillUsage(state, invocation(7, "flow-workflow")).counts).toEqual({ "flow-workflow": 1 });
  });

  it("counts an invocation whose seq is not a number", () => {
    // A log without seq offsets is still a log; only a numeric seq can prove an
    // event is inherited, so an unknown one is treated as this session's own.
    const state = foldSkillUsage(createSkillUsageState(5), { type: "user/message", data: { source: { kind: "skill-invocation", name: "x" } } });

    expect(state.counts).toEqual({ x: 1 });
  });

  it("does not mutate the state it was given", () => {
    const state = createSkillUsageState();
    foldSkillUsage(state, invocation(1, "flow-workflow"));

    expect(state.counts).toEqual({});
  });
});

describe("skillUsageView", () => {
  it("carries the counts and drops the fold bookkeeping", () => {
    const view = skillUsageView({ counts: { "flow-workflow": 2 }, fromSeq: 5 });

    expect(view).toEqual({ counts: { "flow-workflow": 2 } });
    expect("fromSeq" in view).toBe(false);
  });
});

describe("skillUsageStateSchema", () => {
  it("accepts a valid state", () => {
    const state = { counts: { a: 0, b: 3 }, fromSeq: 0 };

    expect(skillUsageStateSchema.parse(state)).toBe(state);
  });

  it("rejects a non-object", () => {
    for (const value of [null, undefined, "x", 1, []]) {
      expect(() => skillUsageStateSchema.parse(value)).toThrow();
    }
  });

  it("rejects a malformed counts map", () => {
    for (const counts of [undefined, null, "x", [], { a: -1 }, { a: 1.5 }, { a: "1" }]) {
      expect(() => skillUsageStateSchema.parse({ counts, fromSeq: 0 })).toThrow();
    }
  });

  it("rejects a malformed fromSeq", () => {
    for (const fromSeq of [undefined, -1, 1.5, "0"]) {
      expect(() => skillUsageStateSchema.parse({ counts: {}, fromSeq })).toThrow();
    }
  });
});

describe("skillUsageViewSchema", () => {
  it("accepts a valid view", () => {
    const view = { counts: { a: 1 } };

    expect(skillUsageViewSchema.parse(view)).toBe(view);
  });

  it("rejects an extra field", () => {
    expect(() => skillUsageViewSchema.parse({ counts: {}, fromSeq: 0 })).toThrow();
  });

  it("rejects a malformed counts map", () => {
    for (const counts of [undefined, null, [], { a: -1 }]) {
      expect(() => skillUsageViewSchema.parse({ counts })).toThrow();
    }
  });
});

describe("sessionSkillUsageProjection", () => {
  it("registers under the documented key and version", () => {
    expect(sessionSkillUsageProjection.key).toBe(SKILL_USAGE_PROJECTION_KEY);
    expect(sessionSkillUsageProjection.stateVersion).toBe(SKILL_USAGE_STATE_VERSION);
  });

  it("folds and views through the definition the registry calls", () => {
    const state = sessionSkillUsageProjection.init(undefined, undefined);
    const next = sessionSkillUsageProjection.apply(state, invocation(1, "flow-workflow"));

    expect(sessionSkillUsageProjection.wire.view(next)).toEqual({ counts: { "flow-workflow": 1 } });
  });

  it("starts from the inherited prefix the registry passes in", () => {
    expect(sessionSkillUsageProjection.init(undefined, 4).fromSeq).toBe(4);
  });
});
