/**
 * `/resume` row construction, scope tabs and switch dispatch.
 *
 * The command is a session switch, not a model continuation: picking a row must
 * be the same single navigation action the sidebar performs when the user clicks
 * that session. So the rows are derived from the client's own session catalog and
 * the pick goes straight to the workspace navigator — there is no separate
 * "resume" state to keep consistent with the sidebar.
 *
 * Scope is a tab over the row set: the picker opens on the project in use and the
 * scope rows switch it to every session. Archived sessions belong to neither tab —
 * the sidebar deliberately hides them, so they are never loaded and search cannot
 * reach them.
 */
import { describe, expect, it, vi } from "vitest";

import {
  DEFAULT_SCOPE,
  RESUME_COMMAND_NAME,
  RESUME_SCOPES,
  SCOPE_ROW_PREFIX,
  nextScope,
  resumeOptions,
  resumeRows,
  scopeOfRow,
  scopeRow,
  switchTo,
  type ResumeScope,
  type SessionListLike,
  type SessionRowLike,
} from "../src/client/resume.ts";

/** Build a catalog snapshot; only the fields the command reads are populated. */
function catalog(
  rows: Array<{
    id: string;
    title: string;
    running?: boolean;
    blank?: boolean;
    cwd?: string;
    origin?: "subagent";
  }>,
): SessionListLike {
  const byId: Record<string, SessionRowLike> = {};
  const ids: string[] = [];
  for (const row of rows) {
    ids.push(row.id);
    byId[row.id] = {
      displayTitle: row.title,
      running: row.running ?? false,
      blank: row.blank ?? false,
      ...(row.cwd !== undefined ? { cwd: row.cwd } : {}),
      ...(row.origin !== undefined ? { origin: row.origin } : {}),
    };
  }
  return { ids, byId };
}

/** Derive one scope's rows for a session whose directory is the app under test. */
function rowsOf(state: SessionListLike, currentSessionId: string, scope: ResumeScope, archived: string[] = [], currentCwd?: string) {
  return resumeRows(state, {
    currentSessionId,
    scope,
    archived,
    ...(currentCwd !== undefined ? { currentCwd } : {}),
  });
}

describe("/resume row construction", () => {
  it("is named resume, because the slash menu keys rows by bare name", () => {
    expect(RESUME_COMMAND_NAME).toBe("resume");
  });

  it("lists every listed session in host order", () => {
    const state = catalog([
      { id: "s3", title: "third" },
      { id: "s1", title: "first" },
      { id: "s2", title: "second" },
    ]);

    expect(rowsOf(state, "s1", "all").map(row => row.id)).toEqual(["s3", "s1", "s2"]);
  });

  it("labels rows with the human title so no raw session id reaches the menu", () => {
    const state = catalog([{ id: "s1", title: "重构剪贴板写入器" }]);

    expect(rowsOf(state, "s1", "all").map(row => row.label)).toEqual(["重构剪贴板写入器"]);
  });

  it("parks the highlight on the session in use, so an accept without looking keeps it", () => {
    // SelectOption.active is the shell's highlight anchor, not decoration: the row
    // marked active is what an accept gesture made without looking confirms.
    const state = catalog([
      { id: "s1", title: "first" },
      { id: "s2", title: "second" },
    ]);

    expect(rowsOf(state, "s2", "all").map(row => row.active ?? false)).toEqual([false, true]);
  });

  it("marks no row active when the current session is not in the catalog", () => {
    // A brand-new session can open before the host list projects it; nothing may
    // claim the highlight in that window or the user's first accept picks it.
    const state = catalog([{ id: "s1", title: "first" }]);

    expect(rowsOf(state, "unlisted", "all").every(row => row.active !== true)).toBe(true);
  });

  it("never offers a blank session, since switching to one is not resuming work", () => {
    const state = catalog([
      { id: "s1", title: "first" },
      { id: "s2", title: "draft", blank: true },
    ]);

    expect(rowsOf(state, "s1", "all").map(row => row.id)).toEqual(["s1"]);
  });

  it("surfaces running sessions as a badge rather than a filter", () => {
    const state = catalog([
      { id: "s1", title: "idle" },
      { id: "s2", title: "busy", running: true },
    ]);

    expect(rowsOf(state, "s1", "all").map(row => row.badge)).toEqual([undefined, "运行中"]);
  });

  it("yields no rows when the catalog is empty", () => {
    expect(rowsOf({ ids: [], byId: {} }, "s1", "all")).toEqual([]);
  });
});

describe("/resume scope tabs", () => {
  it("offers exactly two scopes, project first because it is the default", () => {
    expect(RESUME_SCOPES).toEqual(["project", "all"]);
    expect(DEFAULT_SCOPE).toBe("project");
  });

  it("labels the scopes in the user's terms, not as internal enums", () => {
    expect(RESUME_SCOPES.map(scope => scopeRow(scope, false).label)).toEqual(["当前项目", "全部会话"]);
  });

  it("badges the scope in use instead of marking it active", () => {
    // `active` is the shell's highlight anchor, so marking the scope in use there
    // would make an accept without looking re-pick that scope rather than confirm
    // the session the user is already in. A badge states the same fact safely.
    const rows = RESUME_SCOPES.map(scope => scopeRow(scope, scope === "project")).map(row => ({
      badge: row.badge,
      active: row.active ?? false,
    }));

    expect(rows).toEqual([
      { badge: "当前", active: false },
      { badge: undefined, active: false },
    ]);
  });

  it("groups scope rows apart from sessions so they never read as a session", () => {
    expect(scopeRow("all", false).group?.label).toBe("范围");
  });

  it("recognises a scope row id and rejects a session id or a forged scope", () => {
    expect(scopeOfRow(`${SCOPE_ROW_PREFIX}all`)).toBe("all");
    expect(nextScope(`${SCOPE_ROW_PREFIX}project`)).toBe("project");
    expect(scopeOfRow("session-06195936")).toBeUndefined();
    expect(scopeOfRow(`${SCOPE_ROW_PREFIX}forged`)).toBeUndefined();
  });

  it("puts scope rows ahead of session rows, since the scope is chosen first", () => {
    const state = catalog([{ id: "s1", title: "only" }]);

    const options = resumeOptions(state, { currentSessionId: "s1", scope: "all", archived: [] });

    expect(options.map(row => row.id)).toEqual([`${SCOPE_ROW_PREFIX}project`, `${SCOPE_ROW_PREFIX}all`, "s1"]);
  });
});

describe("/resume scope filtering", () => {
  const state = catalog([
    { id: "o1", title: "other project", cwd: "/work/other" },
    { id: "p1", title: "project one", cwd: "/work/app" },
    { id: "p2", title: "project two", cwd: "/work/app" },
    { id: "n1", title: "no cwd" },
  ]);

  it("limits the project scope to the invoking session's own directory", () => {
    expect(rowsOf(state, "p1", "project", [], "/work/app").map(row => row.id)).toEqual(["p1", "p2"]);
  });

  it("shows every session in the all scope", () => {
    expect(rowsOf(state, "p1", "all", [], "/work/app").map(row => row.id)).toEqual(["o1", "p1", "p2", "n1"]);
  });

  it("drops archived sessions from both scopes, so search cannot resurrect them", () => {
    const archived = ["p2", "o1"];

    expect(rowsOf(state, "p1", "project", archived, "/work/app").map(row => row.id)).toEqual(["p1"]);
    expect(rowsOf(state, "p1", "all", archived, "/work/app").map(row => row.id)).toEqual(["p1", "n1"]);
  });

  it("drops subagent sessions, which are continuation addresses rather than resumable work", () => {
    const withChild = catalog([
      { id: "p1", title: "parent", cwd: "/work/app" },
      { id: "c1", title: "child", cwd: "/work/app", origin: "subagent" },
    ]);

    expect(rowsOf(withChild, "p1", "all").map(row => row.id)).toEqual(["p1"]);
  });

  it("keeps the host order inside a scope rather than re-sorting", () => {
    expect(rowsOf(state, "p1", "all").map(row => row.id)).toEqual(["o1", "p1", "p2", "n1"]);
  });

  it("falls back to every session when the invoking session has no directory", () => {
    // An empty picker would read as "you have no sessions" when the truth is
    // "this session has no project", so the project scope widens instead.
    expect(rowsOf(state, "n1", "project").map(row => row.id)).toEqual(["o1", "p1", "p2", "n1"]);
  });
});

describe("/resume switch dispatch", () => {
  it("opens the picked session through the same navigation call the sidebar uses", async () => {
    const openSession = vi.fn();

    await switchTo({ openSession }, { id: "s2" });

    expect(openSession).toHaveBeenCalledExactlyOnceWith("s2");
  });

  it("leaves the workspace alone when the pick names the session already in use", async () => {
    // Re-opening the current session is a navigation to where the user already is;
    // skipping it keeps the conversation's scroll and draft untouched.
    const openSession = vi.fn();

    await switchTo({ openSession }, { id: "s1" }, "s1");

    expect(openSession).not.toHaveBeenCalled();
  });

  it("reports a navigator failure instead of swallowing it", async () => {
    const openSession = vi.fn(() => {
      throw new Error("session vanished");
    });

    await expect(switchTo({ openSession }, { id: "s2" })).rejects.toThrow("session vanished");
  });
});
