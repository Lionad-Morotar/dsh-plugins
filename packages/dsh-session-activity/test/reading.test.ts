/**
 * The tint's read side.
 *
 * These cases pin the two product decisions the tint rests on: which of the four
 * intensity tiers a row lands in, and how a workspace's members fold into the one
 * reading its title is painted from. A session is read on its own clock, so the
 * fold only ever answers for a workspace header.
 *
 * The expected values are written as literals rather than derived from the
 * constants under test, because a ladder that quietly changed shape would still
 * satisfy a self-consistent assertion.
 */
import { describe, expect, it } from "vitest";
import {
  DEFAULT_ACTIVITY_CONFIG,
  aggregateWorkspace,
  archiveSet,
  narrowView,
  readSession,
  resolveConfig,
  selectActivity,
  sessionIdsOf,
  tierOf,
  type ActivityConfig,
  type ActivityReading,
  type SessionListWire,
} from "../src/client/reading.ts";

const MINUTE_MS = 60_000;
const HOUR_MS = 3_600_000;
const DAY_MS = 86_400_000;
const NOW = 1_800_000_000_000;

/** A complete reading, with the fields a case does not care about zeroed. */
function reading(overrides: Partial<ActivityReading> = {}): ActivityReading {
  return { lastActivityAt: null, promptCount: 0, turnCount: 0, toolCallCount: 0, ...overrides };
}

/** A well-formed `sessionActivity` view as the host ships it. */
function view(lastActivityAt: number | null): Record<string, unknown> {
  return { lastActivityAt, promptCount: 1, turnCount: 2, toolCallCount: 3 };
}

/** A snapshot with one session, overridden per case. */
function listWith(entry: {
  summary?: Record<string, unknown>;
  shared?: { values?: Record<string, unknown>; state: string };
}): SessionListWire {
  const byId: Record<string, unknown> = {};
  if (entry.summary !== undefined) byId.s1 = entry.summary;
  const projectionsBySession: Record<string, unknown> = {};
  if (entry.shared !== undefined) projectionsBySession.s1 = entry.shared;
  return { byId, projectionsBySession } as unknown as SessionListWire;
}

/** A snapshot over several sessions, each carrying its projection on the object layer. */
function listOf(summaries: Record<string, Record<string, unknown>>): SessionListWire {
  return { byId: summaries, projectionsBySession: {} } as unknown as SessionListWire;
}

/** One tier decision with the shared defaults. */
function tierOfAge(ageMs: number, config: ActivityConfig = DEFAULT_ACTIVITY_CONFIG): string {
  return tierOf({
    reading: reading({ lastActivityAt: NOW - ageMs }),
    running: false,
    updatedAt: undefined,
    now: NOW,
    config,
  });
}

describe("narrowView", () => {
  it("reads a complete view", () => {
    expect(narrowView(view(5_000))).toEqual({ lastActivityAt: 5_000, promptCount: 1, turnCount: 2, toolCallCount: 3 });
  });

  it("accepts a null instant, which is how a session with no log reads", () => {
    expect(narrowView(view(null))?.lastActivityAt).toBeNull();
  });

  it("refuses every shape it cannot read confidently", () => {
    const bad: readonly unknown[] = [
      undefined,
      null,
      42,
      "activity",
      [],
      {},
      { promptCount: 0, turnCount: 0, toolCallCount: 0 },
      { lastActivityAt: 0, promptCount: 0, turnCount: 0 },
      { lastActivityAt: -1, promptCount: 0, turnCount: 0, toolCallCount: 0 },
      { lastActivityAt: Number.NaN, promptCount: 0, turnCount: 0, toolCallCount: 0 },
      { lastActivityAt: null, promptCount: -1, turnCount: 0, toolCallCount: 0 },
      { lastActivityAt: null, promptCount: 1.5, turnCount: 0, toolCallCount: 0 },
      { lastActivityAt: null, promptCount: "3", turnCount: 0, toolCallCount: 0 },
      { lastActivityAt: null, promptCount: 0, turnCount: 0, toolCallCount: Number.POSITIVE_INFINITY },
    ];
    for (const raw of bad) expect(narrowView(raw), `accepted ${JSON.stringify(raw)}`).toBeUndefined();
  });
});

describe("selectActivity", () => {
  it("prefers the shared projection cell", () => {
    const list = listWith({
      summary: { running: false, projectionValues: { sessionActivity: view(100) } },
      shared: { state: "ready", values: { sessionActivity: view(500) } },
    });
    expect(selectActivity(list, "s1")?.lastActivityAt).toBe(500);
  });

  it("falls back to the object layer while the shared cell is still loading", () => {
    const list = listWith({
      summary: { running: false, projectionValues: { sessionActivity: view(100) } },
      shared: { state: "loading", values: { sessionActivity: view(500) } },
    });
    expect(selectActivity(list, "s1")?.lastActivityAt).toBe(100);
  });

  it("falls back to the object layer when the shared cell carries no view yet", () => {
    const list = listWith({
      summary: { running: false, projectionValues: { sessionActivity: view(100) } },
      shared: { state: "ready", values: {} },
    });
    expect(selectActivity(list, "s1")?.lastActivityAt).toBe(100);
  });

  it("reads nothing when neither layer carries a readable view", () => {
    expect(selectActivity(listWith({ summary: { running: false } }), "s1")).toBeUndefined();
    expect(selectActivity(listWith({ summary: { running: false, projectionValues: { sessionActivity: {} } } }), "s1")).toBeUndefined();
    expect(selectActivity(listWith({}), "s1")).toBeUndefined();
  });

  it("reads nothing for a session the snapshot does not list", () => {
    expect(selectActivity(listWith({ summary: { running: false } }), "s2")).toBeUndefined();
  });

  it("reads nothing and throws nothing when the shared container is missing", () => {
    const list = { byId: {} } as unknown as SessionListWire;
    expect(() => selectActivity(list, "s1")).not.toThrow();
    expect(selectActivity(list, "s1")).toBeUndefined();
  });

  it("reads nothing when a shared cell is null", () => {
    const list = { byId: {}, projectionsBySession: { s1: null } } as unknown as SessionListWire;
    expect(() => selectActivity(list, "s1")).not.toThrow();
    expect(selectActivity(list, "s1")).toBeUndefined();
  });

  it("reads nothing when a ready cell carries no values record", () => {
    const list = { byId: {}, projectionsBySession: { s1: { state: "ready", values: null } } } as unknown as SessionListWire;
    expect(() => selectActivity(list, "s1")).not.toThrow();
    expect(selectActivity(list, "s1")).toBeUndefined();
  });

  it("falls through a null shared cell to the object layer", () => {
    const list = {
      byId: { s1: { projectionValues: { sessionActivity: view(100) } } },
      projectionsBySession: { s1: null },
    } as unknown as SessionListWire;
    expect(selectActivity(list, "s1")?.lastActivityAt).toBe(100);
  });

  it("reads nothing for a null summary or a null object-layer cell", () => {
    const nullSummary = { byId: { s1: null }, projectionsBySession: {} } as unknown as SessionListWire;
    expect(() => selectActivity(nullSummary, "s1")).not.toThrow();
    expect(selectActivity(nullSummary, "s1")).toBeUndefined();

    const nullValues = { byId: { s1: { projectionValues: null } }, projectionsBySession: {} } as unknown as SessionListWire;
    expect(() => selectActivity(nullValues, "s1")).not.toThrow();
    expect(selectActivity(nullValues, "s1")).toBeUndefined();
  });
});

describe("sessionIdsOf", () => {
  it("lists every session the snapshot carries, because each row is now decided on its own", () => {
    expect([...sessionIdsOf(listOf({ s1: { updatedAt: NOW }, s2: { updatedAt: NOW } }))].sort()).toEqual(["s1", "s2"]);
  });

  it("reads nothing from a snapshot with no readable summary container", () => {
    for (const unreadable of [{}, { byId: null }, { byId: 42 }, { byId: [] }]) {
      expect(sessionIdsOf(unreadable as unknown as SessionListWire)).toEqual([]);
    }
  });

  it("keeps the key of a session whose summary cell is null, and leaves the painting to the caller", () => {
    // The id set is the raw key set of the host's container: narrowing a cell is
    // `readSession`'s job, and a null cell must not make the id disappear here.
    expect(sessionIdsOf({ byId: { s1: null } } as unknown as SessionListWire)).toEqual(["s1"]);
  });
});

describe("readSession", () => {
  it("narrows the reading, the live status and the host clock in one pass", () => {
    const list = listWith({ summary: { running: true, updatedAt: 42, projectionValues: { sessionActivity: view(7) } } });
    expect(readSession(list, "s1")).toEqual({
      reading: { lastActivityAt: 7, promptCount: 1, turnCount: 2, toolCallCount: 3 },
      running: true,
      updatedAt: 42,
    });
  });

  it("reads nothing for a session the snapshot does not carry", () => {
    expect(readSession(listWith({ summary: { running: false } }), "s2")).toBeUndefined();
    expect(readSession({ byId: { s1: null } } as unknown as SessionListWire, "s1")).toBeUndefined();
    expect(readSession({} as unknown as SessionListWire, "s1")).toBeUndefined();
  });

  it("treats an unreadable updatedAt as no clock, and a missing live flag as not running", () => {
    for (const bad of [-1, Number.NaN, Number.POSITIVE_INFINITY, "5", null, undefined]) {
      const facts = readSession(listWith({ summary: { updatedAt: bad } }), "s1");
      expect(facts?.updatedAt, `accepted ${String(bad)}`).toBeUndefined();
      expect(facts?.running).toBe(false);
    }
  });
});

describe("archiveSet", () => {
  it("folds the host's archive list into a lookup and drops unreadable entries", () => {
    expect([...archiveSet(["s1", 42, null, "s2"])]).toEqual(["s1", "s2"]);
  });

  it("reads an unreadable set as nothing archived, which only costs the filter", () => {
    for (const unreadable of [undefined, null, "s1", 42, {}]) expect(archiveSet(unreadable).size).toBe(0);
  });
});

describe("aggregateWorkspace", () => {
  it("takes the newest instant across the members, not the first or the last", () => {
    const list = listOf({
      s1: { updatedAt: NOW - 30 * DAY_MS, projectionValues: { sessionActivity: view(NOW - 10 * DAY_MS) } },
      s2: { updatedAt: NOW - 2 * DAY_MS, projectionValues: { sessionActivity: view(NOW - 5 * DAY_MS) } },
      s3: { updatedAt: NOW - 3 * DAY_MS, projectionValues: { sessionActivity: view(NOW - HOUR_MS) } },
    });
    expect(aggregateWorkspace(list, ["s1", "s2", "s3"])).toEqual({ lastActivityAt: NOW - HOUR_MS, running: false });
  });

  it("falls back to a member's updatedAt when its projection carries no instant", () => {
    const list = listOf({
      s1: { updatedAt: NOW - 4 * HOUR_MS, projectionValues: { sessionActivity: view(null) } },
      s2: { updatedAt: NOW - 2 * HOUR_MS },
    });
    expect(aggregateWorkspace(list, ["s1", "s2"])?.lastActivityAt).toBe(NOW - 2 * HOUR_MS);
  });

  it("propagates running from any single member", () => {
    const list = listOf({
      s1: { running: false, updatedAt: NOW - 3 * DAY_MS },
      s2: { running: true, updatedAt: NOW - 3 * DAY_MS },
    });
    expect(aggregateWorkspace(list, ["s1", "s2"])).toEqual({ lastActivityAt: NOW - 3 * DAY_MS, running: true });
    expect(aggregateWorkspace(listOf({ s1: { running: false, updatedAt: NOW } }), ["s1"])?.running).toBe(false);
  });

  it("reads nothing when no member resolves, so an empty workspace is never painted", () => {
    expect(aggregateWorkspace(listOf({}), [])).toBeUndefined();
    expect(aggregateWorkspace(listOf({ s1: { updatedAt: NOW } }), ["gone"])).toBeUndefined();
    expect(aggregateWorkspace(listOf({ s1: { updatedAt: NOW } }), undefined)).toBeUndefined();
    expect(aggregateWorkspace(listOf({ s1: { updatedAt: NOW } }), "s1")).toBeUndefined();
    expect(aggregateWorkspace({ byId: { s1: null } } as unknown as SessionListWire, ["s1"])).toBeUndefined();
    expect(aggregateWorkspace({} as unknown as SessionListWire, ["s1"])).toBeUndefined();
  });

  it("keeps a readable member that has no clock yet, which the ladder reads as undecided", () => {
    expect(aggregateWorkspace(listOf({ s1: { running: false } }), ["s1"])).toEqual({ lastActivityAt: null, running: false });
  });

  it("skips the members the snapshot cannot resolve and keeps the rest", () => {
    const list = listOf({ s2: { updatedAt: NOW - HOUR_MS } });
    expect(aggregateWorkspace(list, ["gone", 42, "s2"])).toEqual({ lastActivityAt: NOW - HOUR_MS, running: false });
  });

  it("keeps an archived member in the factor, because archiving is a sidebar filter", () => {
    // The archive set is no longer an argument: it cannot change the fold. A
    // workspace whose only session was archived is still one a human worked in.
    const list = listOf({ s1: { updatedAt: NOW - 30 * DAY_MS } });
    expect(aggregateWorkspace(list, ["s1"])).toEqual({ lastActivityAt: NOW - 30 * DAY_MS, running: false });
  });

  it("feeds the same ladder as a session reading", () => {
    const quiet = { lastActivityAt: NOW - 2 * HOUR_MS, running: false };
    const live = { lastActivityAt: null, running: true };
    expect(tierOf({ reading: quiet, running: quiet.running, updatedAt: undefined, now: NOW, config: DEFAULT_ACTIVITY_CONFIG })).toBe("mid");
    expect(tierOf({ reading: live, running: live.running, updatedAt: undefined, now: NOW, config: DEFAULT_ACTIVITY_CONFIG })).toBe("strong");
  });
});

describe("tierOf", () => {
  it("treats a running session as strong whatever its log says", () => {
    expect(
      tierOf({ reading: reading({ lastActivityAt: NOW - 30 * DAY_MS }), running: true, updatedAt: undefined, now: NOW, config: DEFAULT_ACTIVITY_CONFIG }),
    ).toBe("strong");
    expect(tierOf({ reading: undefined, running: true, updatedAt: undefined, now: NOW, config: DEFAULT_ACTIVITY_CONFIG })).toBe("strong");
  });

  it("keeps the first hour strong, the second hour mid, the fifth faint", () => {
    expect(tierOfAge(0)).toBe("strong");
    expect(tierOfAge(59 * MINUTE_MS)).toBe("strong");
    expect(tierOfAge(HOUR_MS)).toBe("strong");
    expect(tierOfAge(HOUR_MS + 1)).toBe("mid");
    expect(tierOfAge(2 * HOUR_MS)).toBe("mid");
    expect(tierOfAge(2 * HOUR_MS + 1)).toBe("faint");
    expect(tierOfAge(5 * HOUR_MS)).toBe("faint");
  });

  it("paints nothing past the fifth hour, which is where the host's own colour takes over", () => {
    expect(tierOfAge(5 * HOUR_MS + MINUTE_MS)).toBe("none");
    expect(tierOfAge(DAY_MS)).toBe("none");
    expect(tierOfAge(30 * DAY_MS)).toBe("none");
  });

  it("falls back to the host's updatedAt when the projection has no instant", () => {
    expect(
      tierOf({ reading: reading({ lastActivityAt: null }), running: false, updatedAt: NOW - 2 * HOUR_MS, now: NOW, config: DEFAULT_ACTIVITY_CONFIG }),
    ).toBe("mid");
  });

  it("reads nothing when neither time source exists", () => {
    expect(tierOf({ reading: undefined, running: false, updatedAt: undefined, now: NOW, config: DEFAULT_ACTIVITY_CONFIG })).toBe("none");
    expect(
      tierOf({ reading: reading({ lastActivityAt: null }), running: false, updatedAt: undefined, now: NOW, config: DEFAULT_ACTIVITY_CONFIG }),
    ).toBe("none");
  });

  it("treats an instant ahead of the clock as fresh", () => {
    expect(tierOfAge(-5 * HOUR_MS)).toBe("strong");
  });

  it("follows a configured ladder, and running still wins over every threshold", () => {
    const config = resolveConfig({ strongWithinMs: 10 * MINUTE_MS, midWithinMs: 30 * MINUTE_MS, faintWithinMs: 2 * HOUR_MS });
    expect(tierOfAge(9 * MINUTE_MS, config)).toBe("strong");
    expect(tierOfAge(20 * MINUTE_MS, config)).toBe("mid");
    expect(tierOfAge(90 * MINUTE_MS, config)).toBe("faint");
    expect(tierOfAge(3 * HOUR_MS, config)).toBe("none");
    expect(
      tierOf({ reading: reading({ lastActivityAt: NOW - DAY_MS }), running: true, updatedAt: undefined, now: NOW, config }),
    ).toBe("strong");
  });
});

describe("resolveConfig", () => {
  it("defaults to an hour strong, two hours mid and five hours faint", () => {
    expect(DEFAULT_ACTIVITY_CONFIG).toEqual({
      strongWithinMs: HOUR_MS,
      midWithinMs: 2 * HOUR_MS,
      faintWithinMs: 5 * HOUR_MS,
      faintMixPercent: 55,
      enabled: true,
    });
    expect(resolveConfig()).toEqual(DEFAULT_ACTIVITY_CONFIG);
  });

  it("carries only the five keys the ladder reads, so no dead knob survives a rewrite", () => {
    expect(Object.keys(DEFAULT_ACTIVITY_CONFIG).sort()).toEqual([
      "enabled",
      "faintMixPercent",
      "faintWithinMs",
      "midWithinMs",
      "strongWithinMs",
    ]);
  });

  it("keeps the values a loader row overrides", () => {
    expect(resolveConfig({ strongWithinMs: 2 * HOUR_MS, faintMixPercent: 40, enabled: false })).toEqual({
      ...DEFAULT_ACTIVITY_CONFIG,
      strongWithinMs: 2 * HOUR_MS,
      faintMixPercent: 40,
      enabled: false,
    });
  });

  it("falls back to the default for a value outside its legal range", () => {
    expect(resolveConfig({ strongWithinMs: -1 }).strongWithinMs).toBe(HOUR_MS);
    expect(resolveConfig({ midWithinMs: Number.NaN }).midWithinMs).toBe(2 * HOUR_MS);
    expect(resolveConfig({ faintWithinMs: Number.POSITIVE_INFINITY }).faintWithinMs).toBe(5 * HOUR_MS);
    expect(resolveConfig({ faintMixPercent: -1 }).faintMixPercent).toBe(55);
    expect(resolveConfig({ faintMixPercent: 101 }).faintMixPercent).toBe(55);
    expect(resolveConfig({ faintMixPercent: Number.NaN }).faintMixPercent).toBe(55);
    expect(resolveConfig({ enabled: "yes" as unknown as boolean }).enabled).toBe(true);
  });

  it("accepts the two ends of the mix range, since both are legal CSS", () => {
    expect(resolveConfig({ faintMixPercent: 0 }).faintMixPercent).toBe(0);
    expect(resolveConfig({ faintMixPercent: 100 }).faintMixPercent).toBe(100);
  });
});
