import { describe, expect, it } from "vitest";

import { sessionTier, statusStamp, workspaceTier } from "../src/client/status.ts";
import type { SessionListState } from "../src/client/dsh.ts";
import { SESSION_A, SESSION_ARCHIVED, SESSION_B, SESSION_C, sessionList, withActivity } from "./fixtures.ts";

const HOUR = 60 * 60 * 1000;
const NOW = 10 * HOUR;

function tierFor(list: SessionListState, id: string, now = NOW) {
  return sessionTier(list, id, now);
}

describe("sessionTier", () => {
  it("reads strong for activity inside the first hour, boundaries closed", () => {
    const list = withActivity(sessionList([SESSION_A]), { "sess-a": NOW - 30 * 60 * 1000 });
    expect(tierFor(list, "sess-a")).toBe("strong");
    const wholeHour = withActivity(sessionList([SESSION_A]), { "sess-a": NOW - HOUR });
    expect(tierFor(wholeHour, "sess-a")).toBe("strong");
  });

  it("steps through mid and faint, then stops producing a rung", () => {
    const mid = withActivity(sessionList([SESSION_A]), { "sess-a": NOW - 90 * 60 * 1000 });
    expect(tierFor(mid, "sess-a")).toBe("mid");
    const wholeSecondHour = withActivity(sessionList([SESSION_A]), { "sess-a": NOW - 2 * HOUR });
    expect(tierFor(wholeSecondHour, "sess-a")).toBe("mid");
    const faint = withActivity(sessionList([SESSION_A]), { "sess-a": NOW - 3 * HOUR });
    expect(tierFor(faint, "sess-a")).toBe("faint");
    const wholeFifthHour = withActivity(sessionList([SESSION_A]), { "sess-a": NOW - 5 * HOUR });
    expect(tierFor(wholeFifthHour, "sess-a")).toBe("faint");
    const past = withActivity(sessionList([SESSION_A]), { "sess-a": NOW - 5 * HOUR - 1 });
    expect(tierFor(past, "sess-a")).toBeUndefined();
  });

  it("reads a running session strong regardless of its clock", () => {
    const list = withActivity(sessionList([SESSION_B]), { "sess-b": NOW - 8 * HOUR });
    expect(tierFor(list, "sess-b")).toBe("strong");
  });

  it("falls back to the row's updatedAt when no projection cell exists", () => {
    const list = sessionList([SESSION_A]);
    expect(tierFor(list, "sess-a", SESSION_A.updatedAt + HOUR)).toBe("strong");
    expect(tierFor(list, "sess-a", SESSION_A.updatedAt + 6 * HOUR)).toBeUndefined();
  });

  it("treats a null reading as no clock rather than as zero", () => {
    const list = withActivity(sessionList([SESSION_A]), { "sess-a": null });
    expect(tierFor(list, "sess-a", SESSION_A.updatedAt + HOUR)).toBe("strong");
  });

  it("ignores a shared cell that has not settled and reads the row fallback", () => {
    const unsettled: SessionListState = {
      ...sessionList([SESSION_A]),
      projectionsBySession: { "sess-a": { state: "loading" } },
      byId: {
        "sess-a": {
          ...SESSION_A,
          projectionValues: { sessionActivity: { lastActivityAt: NOW - 30 * 60 * 1000 } },
        },
      },
    };
    expect(tierFor(unsettled, "sess-a")).toBe("strong");
  });

  it("reads silence for an unknown session or non-finite timestamps", () => {
    const list = sessionList([SESSION_A]);
    expect(tierFor(list, "missing")).toBeUndefined();
    const poisoned = withActivity(sessionList([SESSION_A]), { "sess-a": Number.NaN });
    expect(tierFor(poisoned, "sess-a", SESSION_A.updatedAt + HOUR)).toBe("strong");
  });
});

describe("workspaceTier", () => {
  it("folds members onto the newest member clock", () => {
    const list = withActivity(
      sessionList([SESSION_A, SESSION_ARCHIVED]),
      { "sess-a": NOW - 90 * 60 * 1000, "sess-archived": NOW - 30 * 60 * 1000 },
    );
    expect(workspaceTier(list, ["sess-a", "sess-archived"], NOW)).toBe("strong");
  });

  it("counts archived members into the fold, mirroring the sidebar aggregate", () => {
    const list = withActivity(
      sessionList([SESSION_A, SESSION_ARCHIVED]),
      { "sess-a": NOW - 8 * HOUR, "sess-archived": NOW - 30 * 60 * 1000 },
    );
    expect(workspaceTier(list, ["sess-a", "sess-archived"], NOW)).toBe("strong");
  });

  it("reads a workspace strong when any member runs", () => {
    const quiet = withActivity(sessionList([SESSION_A, SESSION_C]), { "sess-a": NOW - 8 * HOUR, "sess-c": null });
    const running = { ...quiet, byId: { ...quiet.byId, "sess-c": { ...SESSION_C, running: true } } };
    const members = [...quiet.ids];
    expect(workspaceTier(quiet, members, NOW)).toBeUndefined();
    expect(workspaceTier(running, members, NOW)).toBe("strong");
  });

  it("reads undefined when no member has a clock", () => {
    const list = withActivity(sessionList([SESSION_A]), { "sess-a": null });
    const noClock = { ...list, byId: { "sess-a": { ...SESSION_A, updatedAt: Number.NaN } } };
    expect(workspaceTier(noClock, ["sess-a"], NOW)).toBeUndefined();
    expect(workspaceTier(noClock, [], NOW)).toBeUndefined();
  });
});

describe("statusStamp", () => {
  it("moves when a projection reading settles without any summary change", () => {
    const bare = sessionList([SESSION_A]);
    const settled = withActivity(bare, { "sess-a": NOW - 30 * 60 * 1000 });
    expect(statusStamp(settled)).not.toBe(statusStamp(bare));
  });

  it("counts ready cells so settlement alone is a visible change", () => {
    const empty = withActivity(sessionList([SESSION_A]), {});
    const ready = { ...empty, projectionsBySession: { "sess-a": { state: "ready" } } };
    expect(statusStamp(ready)).not.toBe(statusStamp(empty));
  });
});
