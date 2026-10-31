/**
 * The tint's read side.
 *
 * These cases pin the two product decisions the tint rests on: how alive a row
 * reads (its tier) and how far it fades (its opacity), plus the fold that turns a
 * workspace's member sessions into the one reading its title is painted from. The
 * expected values are written as literals rather than derived from the constants
 * under test, because a curve that quietly changed shape would still satisfy a
 * self-consistent assertion.
 *
 * Both themes are asserted, because they are two curves and not one curve behind a
 * token: light loses more per day and bottoms out higher, so the light sidebar
 * still separates a two-day-old workspace from a two-week-old one.
 */
import { describe, expect, it } from "vitest";
import {
  DEFAULT_ACTIVITY_CONFIG,
  aggregateWorkspace,
  narrowView,
  opacityFor,
  resolveConfig,
  selectActivity,
  tierOf,
  type ActivityConfig,
  type ActivityReading,
  type SessionListWire,
} from "../src/client/reading.ts";

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

  it("counts archived members too, because the archive set is not an input here", () => {
    // The fold reads the workspace's member ids and the session list, nothing
    // else: archiving lives on the workspaces snapshot, so a member the host has
    // archived is just another member. A workspace whose only session is archived
    // is still one a human worked in.
    const list = listOf({ s1: { updatedAt: NOW - 30 * DAY_MS } });
    expect(aggregateWorkspace(list, ["s1"])).toEqual({ lastActivityAt: NOW - 30 * DAY_MS, running: false });
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

  it("keeps a readable member that has no clock yet, which the curve reads as undecided", () => {
    expect(aggregateWorkspace(listOf({ s1: { running: false } }), ["s1"])).toEqual({ lastActivityAt: null, running: false });
  });

  it("skips the members the snapshot cannot resolve and keeps the rest", () => {
    const list = listOf({ s2: { updatedAt: NOW - HOUR_MS } });
    expect(aggregateWorkspace(list, ["gone", 42, "s2"])).toEqual({ lastActivityAt: NOW - HOUR_MS, running: false });
  });

  it("feeds the same curve as a session reading", () => {
    const quiet = { lastActivityAt: NOW - 2 * HOUR_MS, running: false };
    const live = { lastActivityAt: null, running: true };
    expect(tierOf({ reading: quiet, running: quiet.running, updatedAt: undefined, now: NOW, config: DEFAULT_ACTIVITY_CONFIG })).toBe("warm");
    expect(tierOf({ reading: live, running: live.running, updatedAt: undefined, now: NOW, config: DEFAULT_ACTIVITY_CONFIG })).toBe("hot");
  });
});

describe("tierOf", () => {
  it("treats a running session as hot whatever its log says", () => {
    expect(
      tierOf({ reading: reading({ lastActivityAt: NOW - 30 * DAY_MS }), running: true, updatedAt: undefined, now: NOW, config: DEFAULT_ACTIVITY_CONFIG }),
    ).toBe("hot");
    expect(tierOf({ reading: undefined, running: true, updatedAt: undefined, now: NOW, config: DEFAULT_ACTIVITY_CONFIG })).toBe("hot");
  });

  it("keeps the last hour hot and the rest of the first day warm", () => {
    expect(tierOfAge(59 * 60_000)).toBe("hot");
    expect(tierOfAge(HOUR_MS)).toBe("warm");
    expect(tierOfAge(23 * HOUR_MS)).toBe("warm");
  });

  it("dims from the first full day onwards", () => {
    expect(tierOfAge(DAY_MS)).toBe("dim");
    expect(tierOfAge(5 * DAY_MS)).toBe("dim");
  });

  it("falls back to the host's updatedAt when the projection has no instant", () => {
    expect(
      tierOf({ reading: reading({ lastActivityAt: null }), running: false, updatedAt: NOW - 2 * HOUR_MS, now: NOW, config: DEFAULT_ACTIVITY_CONFIG }),
    ).toBe("warm");
  });

  it("reads nothing when neither time source exists", () => {
    expect(tierOf({ reading: undefined, running: false, updatedAt: undefined, now: NOW, config: DEFAULT_ACTIVITY_CONFIG })).toBe("none");
    expect(
      tierOf({ reading: reading({ lastActivityAt: null }), running: false, updatedAt: undefined, now: NOW, config: DEFAULT_ACTIVITY_CONFIG }),
    ).toBe("none");
  });

  it("treats an instant ahead of the clock as fresh", () => {
    expect(tierOfAge(-5 * HOUR_MS)).toBe("hot");
  });
});

describe("opacityFor", () => {
  it("stays fully opaque through the first day in both themes", () => {
    for (const theme of ["light", "dark"] as const) {
      expect(opacityFor(0, DEFAULT_ACTIVITY_CONFIG, theme)).toBe(1);
      expect(opacityFor(DAY_MS, DEFAULT_ACTIVITY_CONFIG, theme)).toBe(1);
    }
  });

  it("fades a step per day after that in the dark theme", () => {
    expect(opacityFor(2 * DAY_MS, DEFAULT_ACTIVITY_CONFIG, "dark")).toBe(0.85);
    expect(opacityFor(4 * DAY_MS, DEFAULT_ACTIVITY_CONFIG, "dark")).toBe(0.55);
  });

  it("bottoms the dark theme out on the fifth day", () => {
    expect(opacityFor(5 * DAY_MS, DEFAULT_ACTIVITY_CONFIG, "dark")).toBe(0.45);
    expect(opacityFor(30 * DAY_MS, DEFAULT_ACTIVITY_CONFIG, "dark")).toBe(0.45);
  });

  it("fades the light theme faster and further", () => {
    expect(opacityFor(2 * DAY_MS, DEFAULT_ACTIVITY_CONFIG, "light")).toBe(0.8);
    expect(opacityFor(3 * DAY_MS, DEFAULT_ACTIVITY_CONFIG, "light")).toBe(0.6);
    expect(opacityFor(4 * DAY_MS, DEFAULT_ACTIVITY_CONFIG, "light")).toBe(0.4);
  });

  it("bottoms the light theme out on the fifth day, at a lighter floor", () => {
    expect(opacityFor(4.5 * DAY_MS, DEFAULT_ACTIVITY_CONFIG, "light")).toBe(0.3);
    expect(opacityFor(5 * DAY_MS, DEFAULT_ACTIVITY_CONFIG, "light")).toBe(0.3);
    expect(opacityFor(30 * DAY_MS, DEFAULT_ACTIVITY_CONFIG, "light")).toBe(0.3);
  });

  it("keeps the two themes apart at every age past the first day", () => {
    for (const ageDays of [1.5, 2, 3, 4, 6, 30]) {
      const age = ageDays * DAY_MS;
      expect(opacityFor(age, DEFAULT_ACTIVITY_CONFIG, "light")).toBeLessThan(
        opacityFor(age, DEFAULT_ACTIVITY_CONFIG, "dark"),
      );
    }
  });

  it("quantises to a hundredth so the stylesheet text stays stable", () => {
    const light = opacityFor(1.5 * DAY_MS, DEFAULT_ACTIVITY_CONFIG, "light");
    expect(light).toBe(0.9);
    expect(opacityFor(1.5 * DAY_MS, DEFAULT_ACTIVITY_CONFIG, "light")).toBe(light);
    expect(opacityFor(1.5 * DAY_MS, DEFAULT_ACTIVITY_CONFIG, "dark")).toBe(0.93);
  });

  it("follows a configured curve and floor per theme", () => {
    const config = resolveConfig({ dimPerDay: 0.3, dimFloor: 0.2, dimPerDayLight: 0.1, dimFloorLight: 0.6 });
    expect(opacityFor(2 * DAY_MS, config, "dark")).toBe(0.7);
    expect(opacityFor(9 * DAY_MS, config, "dark")).toBe(0.2);
    expect(opacityFor(2 * DAY_MS, config, "light")).toBe(0.9);
    expect(opacityFor(9 * DAY_MS, config, "light")).toBe(0.6);
  });

  it("stays opaque for an unreadable age", () => {
    expect(opacityFor(Number.NaN, DEFAULT_ACTIVITY_CONFIG, "light")).toBe(1);
    expect(opacityFor(Number.NaN, DEFAULT_ACTIVITY_CONFIG, "dark")).toBe(1);
  });
});

describe("resolveConfig", () => {
  it("defaults to an hour of heat, a day before dimming, and a per-theme curve", () => {
    expect(DEFAULT_ACTIVITY_CONFIG).toEqual({
      hotWithinMs: HOUR_MS,
      dimAfterMs: DAY_MS,
      dimPerDay: 0.15,
      dimFloor: 0.45,
      dimPerDayLight: 0.2,
      dimFloorLight: 0.3,
      enabled: true,
    });
    expect(resolveConfig()).toEqual(DEFAULT_ACTIVITY_CONFIG);
  });

  it("keeps the values a loader row overrides", () => {
    expect(resolveConfig({ hotWithinMs: 2 * HOUR_MS, enabled: false })).toEqual({
      ...DEFAULT_ACTIVITY_CONFIG,
      hotWithinMs: 2 * HOUR_MS,
      enabled: false,
    });
  });

  it("keeps an overridden light curve", () => {
    expect(resolveConfig({ dimPerDayLight: 0.05, dimFloorLight: 0.7 })).toEqual({
      ...DEFAULT_ACTIVITY_CONFIG,
      dimPerDayLight: 0.05,
      dimFloorLight: 0.7,
    });
  });

  it("falls back to the default for a value outside its legal range", () => {
    expect(resolveConfig({ hotWithinMs: -1 }).hotWithinMs).toBe(HOUR_MS);
    expect(resolveConfig({ dimAfterMs: Number.NaN }).dimAfterMs).toBe(DAY_MS);
    expect(resolveConfig({ dimPerDay: 2 }).dimPerDay).toBe(0.15);
    expect(resolveConfig({ dimFloor: -0.2 }).dimFloor).toBe(0.45);
    expect(resolveConfig({ dimPerDayLight: 1.5 }).dimPerDayLight).toBe(0.2);
    expect(resolveConfig({ dimFloorLight: Number.NaN }).dimFloorLight).toBe(0.3);
    expect(resolveConfig({ enabled: "yes" as unknown as boolean }).enabled).toBe(true);
  });
});
