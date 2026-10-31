/**
 * The `sessionCompaction` fold, pinned against the log's own lifecycle rules.
 *
 * Three cases carry the design. `compaction/start` must not be counted: it is the
 * durable lock written before summarization yields, so counting it would report an
 * attempt that never finished. `compaction/summary` must not be counted either: it
 * is the first event of the commit, written before the replacement surface, and a
 * commit can fail between the two — the close that follows carries the `error`, so
 * `compaction/end` is the one event that decides both "landed" and "failed".
 * And a forked session's log starts with the parent's events, so everything before
 * the inherited cut must be skipped or the child claims the parent's compressions.
 */
import { describe, expect, it } from "vitest";

import {
  COMPACTION_PROJECTION_KEY,
  COMPACTION_STATE_VERSION,
  compactionStateSchema,
  compactionView,
  compactionViewSchema,
  createCompactionState,
  foldCompaction,
  sessionCompactionProjection,
  type CompactionState,
} from "../src/compaction.ts";

/** A closed compaction, successful unless an error is passed. */
function end(seq: number, error?: string): { type: string; seq: number; data: Record<string, unknown> } {
  return {
    type: "compaction/end",
    seq,
    data: { compactionId: `c-${seq}`, ...(error === undefined ? {} : { error }) },
  };
}

/** Fold a list of events from a state. */
function foldAll(
  events: readonly Parameters<typeof foldCompaction>[1][],
  state: CompactionState = createCompactionState(),
): CompactionState {
  return events.reduce<CompactionState>((current, event) => foldCompaction(current, event), state);
}

describe("createCompactionState", () => {
  it("starts with nothing compressed and no inherited prefix", () => {
    expect(createCompactionState()).toEqual({ compactions: 0, failures: 0, fromSeq: 0 });
  });

  it("records the fork-inherited prefix length", () => {
    expect(createCompactionState(4_821).fromSeq).toBe(4_821);
  });

  it("ignores an unusable inherited length", () => {
    expect(createCompactionState(-1).fromSeq).toBe(0);
    expect(createCompactionState(1.5).fromSeq).toBe(0);
    expect(createCompactionState("12").fromSeq).toBe(0);
  });
});

describe("foldCompaction", () => {
  it("counts a close without an error as a landed compression", () => {
    expect(foldAll([end(10)])).toEqual({ compactions: 1, failures: 0, fromSeq: 0 });
  });

  it("counts a close with an error as a failure, never as a compression", () => {
    // The case a summary-based count would get wrong: the commit failed after the
    // summary was written, so the surface was never replaced.
    expect(foldAll([end(10, "surface replacement failed")])).toEqual({ compactions: 0, failures: 1, fromSeq: 0 });
  });

  it("does not count the start marker", () => {
    // An attempt that never closed (process died mid-compaction) leaves this and
    // nothing else; counting it would report a compression that never landed.
    expect(foldAll([{ type: "compaction/start", seq: 5 }]).compactions).toBe(0);
  });

  it("does not count the summary marker", () => {
    expect(foldAll([{ type: "compaction/summary", seq: 6 }]).compactions).toBe(0);
  });

  it("keeps attempts and landings apart across a whole log", () => {
    const state = foldAll([end(10), end(20, "commit failed"), end(30), end(40, "cancelled")]);
    expect(state).toEqual({ compactions: 2, failures: 2, fromSeq: 0 });
  });

  it("skips the fork-inherited prefix", () => {
    // Measured on this machine: a seeded session carries 8 closes, 4 of them in
    // the inherited prefix. Only its own four may be reported.
    const state = foldAll([end(10), end(20), end(5_000), end(5_001)], createCompactionState(4_821));
    expect(state).toEqual({ compactions: 2, failures: 0, fromSeq: 4_821 });
  });

  it("returns the same reference for events it does not count", () => {
    // Every token chunk passes through this fold; a new object per event would
    // make the registry's Object.is change check fire on every delta.
    const state = createCompactionState();
    for (const event of [{ type: "assistant/message" }, { type: "chunk" }, { type: "step/end" }, { type: "compaction/prune" }]) {
      expect(foldCompaction(state, event)).toBe(state);
    }
  });

  it("returns the same reference for an inherited close", () => {
    const state = createCompactionState(100);
    expect(foldCompaction(state, end(99))).toBe(state);
  });

  it("does not mutate the state it is given", () => {
    // The registry keeps the previous state for its change check.
    const state = createCompactionState();
    foldCompaction(state, end(10));
    expect(state).toEqual({ compactions: 0, failures: 0, fromSeq: 0 });
  });
});

describe("compactionView", () => {
  it("exposes the two figures and drops the fold bookkeeping", () => {
    expect(compactionView({ compactions: 3, failures: 1, fromSeq: 42 })).toEqual({ compactions: 3, failures: 1 });
  });
});

describe("schemas", () => {
  it("accept a well-formed state and view", () => {
    const state = { compactions: 2, failures: 0, fromSeq: 0 };
    expect(compactionStateSchema.parse(state)).toBe(state);
    const view = { compactions: 2, failures: 0 };
    expect(compactionViewSchema.parse(view)).toBe(view);
  });

  it("reject negative, fractional and missing counts", () => {
    expect(() => compactionStateSchema.parse({ compactions: -1, failures: 0, fromSeq: 0 })).toThrow();
    expect(() => compactionStateSchema.parse({ compactions: 1.5, failures: 0, fromSeq: 0 })).toThrow();
    expect(() => compactionStateSchema.parse({ failures: 0, fromSeq: 0 })).toThrow();
  });

  it("reject a state missing the inherited offset", () => {
    // The offset decides what the counters mean; a cache row without it cannot be
    // read as this session's own history.
    expect(() => compactionStateSchema.parse({ compactions: 0, failures: 0 })).toThrow();
  });

  it("reject unknown fields on the wire view", () => {
    // The view is what the browser receives; the offset is host bookkeeping.
    expect(() => compactionViewSchema.parse({ compactions: 0, failures: 0, fromSeq: 0 })).toThrow();
  });
});

describe("sessionCompactionProjection", () => {
  it("registers a stable key at the declared state version", () => {
    expect(COMPACTION_PROJECTION_KEY).toBe("sessionCompaction");
    expect(sessionCompactionProjection.key).toBe(COMPACTION_PROJECTION_KEY);
    expect(sessionCompactionProjection.stateVersion).toBe(COMPACTION_STATE_VERSION);
  });

  it("takes the inherited prefix from the registry's init arguments", () => {
    // The registry calls init(header, inheritedEventCount) both on session
    // creation and when a cell is built lazily from a log.
    expect(sessionCompactionProjection.init({}, 77).fromSeq).toBe(77);
  });

  it("folds the same way the unit's own apply does", () => {
    const state = sessionCompactionProjection.apply(createCompactionState(), end(7));
    expect(state).toEqual({ compactions: 1, failures: 0, fromSeq: 0 });
    expect(sessionCompactionProjection.wire.view(state)).toEqual({ compactions: 1, failures: 0 });
  });
});
