/**
 * Client-half contracts that do not need a renderer.
 *
 * The seat markup is a React tree, but everything it decides from data —
 * whether a row shows the marker, what the hover card prints, what dismissal
 * remembers — is pure. These cases pin that half plus the delivery shape the
 * loader mounts.
 */
import { describe, expect, it } from "vitest";
import { narrowView, selectReading, readDismissed, writeDismiss, formatRelative, PROJECTION_KEY, type SessionListWire, type StorageLike } from "../src/client/reading.ts";
import { buildInterruptionFace, type SessionsLike } from "../src/client/face.ts";
import { EN, ZH } from "../src/client/copy.ts";
import { DISMISS_STORAGE_KEY } from "../src/client/reading.ts";
import { ENTRY_ID_BADGE, ENTRY_ID_DISMISS, ENTRY_ID_HOVER, SLOT_HOVER, SLOT_LEADING, SLOT_MENU } from "../src/client/registration.ts";

/** A translate seat over one dictionary, with the shipped parameter syntax. */
function seat(dictionary: Record<string, string>): (key: string, params?: Record<string, unknown>) => string {
  return (key, params) => {
    const template = dictionary[key] ?? key;
    return template.replace(/\{(\w+)\}/gu, (_match, name: string) => String(params?.[name] ?? "{name}"));
  };
}

/** An interrupted wire view as the host projection ships it. */
function interruptedView(overrides: Record<string, unknown> = {}): Record<string, unknown> {
  return { interrupted: true, turn: 3, since: 1_000, turnStartSeq: 12, pendingToolCount: 1, ...overrides };
}

/** A list snapshot with one interrupted idle session and knobs for the case. */
function list(overrides: {
  running?: boolean;
  state?: string;
  values?: Record<string, unknown>;
  projectionValues?: Record<string, unknown>;
} = {}): SessionListWire {
  const cell =
    overrides.values === undefined && overrides.projectionValues === undefined
      ? { values: { [PROJECTION_KEY]: interruptedView() }, state: overrides.state ?? "ready" }
      : { values: overrides.values ?? {}, state: overrides.state ?? "ready" };
  return {
    byId: {
      s1: { running: overrides.running ?? false, ...(overrides.projectionValues !== undefined ? { projectionValues: overrides.projectionValues } : {}) },
    },
    projectionsBySession: { s1: cell },
  };
}

describe("reading selection", () => {
  it("reads an interrupted idle session from the shared projection cell", () => {
    const reading = selectReading(list(), "s1");
    expect(reading).toEqual({ since: 1_000, turnStartSeq: 12, pendingToolCount: 1 });
  });

  it("never reads a running session, because an open turn under live work is progress", () => {
    expect(selectReading(list({ running: true }), "s1")).toBeUndefined();
  });

  it("falls back to the object layer's cell when the shared one is not ready", () => {
    const value = selectReading(list({ state: "idle", projectionValues: { [PROJECTION_KEY]: interruptedView() } }), "s1");
    expect(value).toEqual({ since: 1_000, turnStartSeq: 12, pendingToolCount: 1 });
  });

  it("treats absent, unready, and healthy projections as silence", () => {
    expect(selectReading({ byId: {}, projectionsBySession: {} }, "s1")).toBeUndefined();
    expect(selectReading(list({ state: "error" }), "s1")).toBeUndefined();
    expect(selectReading(list({ values: { [PROJECTION_KEY]: { interrupted: false, turn: null, since: null, turnStartSeq: null, pendingToolCount: 0 } } }), "s1")).toBeUndefined();
  });

  it("narrows hostile shapes into silence, never a wrong marker", () => {
    expect(narrowView(undefined)).toBeUndefined();
    expect(narrowView("interrupted")).toBeUndefined();
    expect(narrowView({ interrupted: "yes" })).toBeUndefined();
    expect(narrowView(interruptedView({ since: "long ago" }))).toEqual({ since: null, turnStartSeq: 12, pendingToolCount: 1 });
    expect(narrowView(interruptedView({ pendingToolCount: -3 }))).toEqual({ since: 1_000, turnStartSeq: 12, pendingToolCount: 0 });
  });
});

/** A map-backed storage double shared by the dismissal and face cases. */
function storage(initial: Record<string, string> = {}): StorageLike {
  const map = new Map(Object.entries(initial));
  return {
    getItem: (key) => map.get(key) ?? null,
    setItem: (key, value) => void map.set(key, value),
  };
}

const DAY_MS = 86_400_000;

describe("dismissal record", () => {

  it("round-trips a dismissal and drops malformed entries", () => {
    const store = storage();
    writeDismiss(store, "s1", 12);
    expect(readDismissed(store)).toEqual({ s1: 12 });
    store.setItem(DISMISS_STORAGE_KEY, "{not json");
    expect(readDismissed(store)).toEqual({});
    store.setItem(DISMISS_STORAGE_KEY, JSON.stringify({ s1: "no", s2: 7, s3: -1 }));
    expect(readDismissed(store)).toEqual({ s2: 7 });
  });

  it("keeps one record per session so a newer interruption marks again", () => {
    const store = storage();
    writeDismiss(store, "s1", 12);
    writeDismiss(store, "s1", 30);
    expect(readDismissed(store)).toEqual({ s1: 30 });
  });
});

describe("interruption face", () => {
  /** A sessions double with an in-memory snapshot and listener list. */
  function sessionsDouble(snapshot: unknown): SessionsLike & { emit(): void; refreshCalls: string[] } {
    const listeners = new Set<() => void>();
    const refreshCalls: string[] = [];
    return {
      list: {
        getSnapshot: () => snapshot,
        subscribe: (onChange: () => void) => {
          listeners.add(onChange);
          return () => listeners.delete(onChange);
        },
      },
      refreshProjections: (sessionId: string) => {
        refreshCalls.push(sessionId);
        return Promise.resolve();
      },
      emit: () => listeners.forEach((listener) => listener()),
      refreshCalls,
    };
  }

  it("filters the reading through the dismissal record and notifies on dismiss", () => {
    const sessions = sessionsDouble(list());
    const face = buildInterruptionFace(sessions, storage());
    const seen: Array<string> = [];
    const stop = face.subscribe(() => seen.push(face.read("s1") === undefined ? "silent" : "marked"));
    expect(face.read("s1")).toEqual({ since: 1_000, turnStartSeq: 12, pendingToolCount: 1 });
    face.dismiss("s1", 12);
    expect(face.read("s1")).toBeUndefined();
    expect(seen).toContain("silent");
    stop();
    face.dispose();
  });

  it("refreshes projections per row and swallows host failures", () => {
    const sessions = sessionsDouble(list());
    const face = buildInterruptionFace(sessions, storage());
    face.refresh("s1");
    expect(sessions.refreshCalls).toEqual(["s1"]);
    const failing: SessionsLike = {
      list: sessions.list,
      refreshProjections: () => Promise.reject(new Error("host said no")),
    };
    expect(() => buildInterruptionFace(failing, storage()).refresh("s1")).not.toThrow();
  });
});

describe("relative time", () => {
  it("renders coarse units in both languages", () => {
    const now = 10 * DAY_MS;
    expect(formatRelative(now - 5_000, now, seat(ZH))).toBe("5秒前");
    expect(formatRelative(now - 90_000, now, seat(ZH))).toBe("1分钟前");
    expect(formatRelative(now - 2 * 3_600_000, now, seat(EN))).toBe("2h ago");
    expect(formatRelative(now - 3 * 86_400_000, now, seat(ZH))).toBe("3天前");
    expect(formatRelative(Number.NaN, now, seat(ZH))).toBeUndefined();
  });
});

describe("registration constants", () => {
  it("keep the seat names and ids the slots contract expects", () => {
    expect(SLOT_LEADING).toBe("sidebar.session.row.leading");
    expect(SLOT_HOVER).toBe("sidebar.session.row.hover");
    expect(SLOT_MENU).toBe("sidebar.workspaces.session.menu.item");
    expect(ENTRY_ID_BADGE).toBe("interruption-mark");
    expect(ENTRY_ID_HOVER).toBe("interruption-note");
    expect(ENTRY_ID_DISMISS).toBe("interruption-dismiss");
  });
});
