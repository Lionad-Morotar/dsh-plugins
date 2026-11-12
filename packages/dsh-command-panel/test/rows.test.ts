import { describe, expect, it } from "vitest";

import { scoreText } from "../src/client/ranking.ts";
import { copyFor } from "../src/client/copy.ts";
import { CATALOG } from "../src/client/catalog.ts";
import {
  archivedSessions,
  catalogRows,
  commandRows,
  commitRows,
  dateBucketLabel,
  fileRows,
  filesystemRows,
  newestSession,
  sessionRows,
  shortcutRows,
  visibleSessions,
  withShortcutHints,
  workspaceRows,
  type PanelRow,
} from "../src/client/rows.ts";
import type { SessionSummary, ShortcutCatalogEntry } from "../src/client/dsh.ts";
import {
  COMMIT_FOCUS,
  SESSION_A,
  SESSION_ARCHIVED,
  SESSION_B,
  SESSION_BLANK,
  SESSION_C,
  SESSION_SUBAGENT,
  WORKSPACE_ONE,
  WORKSPACE_TWO,
  sessionList,
  withActivity,
  workspaceSnapshot,
} from "./fixtures.ts";

const copy = copyFor("zh");
const now = 5_000_000 + 2 * 60 * 60 * 1000;

function labels(rows: readonly PanelRow[]): string[] {
  return rows.map(row => row.label);
}

describe("fileRows", () => {
  it("carries the absolute path as the payload and the relative path as the label", () => {
    const rows = fileRows(
      {
        cwd: "/repo",
        candidates: [
          { path: "src/client/panel.ts", kind: "file" },
          { path: "src/client", kind: "directory" },
        ],
      },
      copy,
    );

    expect(labels(rows)).toEqual(["src/client/panel.ts", "src/client/"]);
    expect(rows[0]?.action).toEqual({
      kind: "insert-path",
      absolutePath: "/repo/src/client/panel.ts",
    });
    expect(rows[1]?.action).toEqual({ kind: "insert-path", absolutePath: "/repo/src/client/" });
    expect(rows.map(row => row.name)).toEqual(["panel.ts", "client"]);
    expect(rows[1]?.detail).toBeUndefined();
  });

  it("matches on a basename without losing the full path in the label", () => {
    const rows = fileRows({ cwd: "/repo", candidates: [{ path: "a/b/panel.ts", kind: "file" }] }, copy);
    expect(rows[0]?.alias).toBe("panel.ts");
    expect(rows[0]?.label).toBe("a/b/panel.ts");
  });
});

describe("fileRows", () => {
  const cwd = "/Users/lionad/Github/Lionad-Morotar/dsh-plugins";

  it("records what each row names, so navigation need not read a label", () => {
    const rows = fileRows(
      {
        cwd,
        candidates: [
          { path: "src/client/", kind: "directory" },
          { path: "src/client/panel.ts", kind: "file" },
        ],
      },
      copy,
    );
    expect(rows.map(row => row.kind)).toEqual(["directory", "file"]);
    expect(rows.map(row => row.label)).toEqual(["src/client/", "src/client/panel.ts"]);
    expect(rows[1]?.action).toEqual({
      kind: "insert-path",
      absolutePath: `${cwd}/src/client/panel.ts`,
    });
  });
});

describe("filesystemRows", () => {
  it("labels with the expanded absolute path and carries the tilde alias under home", () => {
    const rows = filesystemRows(
      {
        home: "/Users/lionad",
        entries: [
          { path: "/Users/lionad/notes/todo.md", kind: "file", exists: true },
          { path: "/Users/lionad/notes", kind: "directory", exists: true },
        ],
      },
      copy,
    );

    expect(rows.map(row => row.label)).toEqual(["/Users/lionad/notes/todo.md", "/Users/lionad/notes/"]);
    expect(rows.map(row => row.alias)).toEqual(["~/notes/todo.md", "~/notes/"]);
    expect(rows.map(row => row.kind)).toEqual(["file", "directory"]);
    expect(rows[0]?.action).toEqual({ kind: "insert-path", absolutePath: "/Users/lionad/notes/todo.md" });
    expect(rows[1]?.action).toEqual({ kind: "insert-path", absolutePath: "/Users/lionad/notes/" });
  });

  it("marks the rows as filesystem origin and names each entry by its basename", () => {
    const rows = filesystemRows(
      {
        home: "/Users/lionad",
        entries: [
          { path: "/opt/tool/bin", kind: "directory", exists: true },
          { path: "/opt/tool/bin/run", kind: "file", exists: true },
        ],
      },
      copy,
    );

    expect(rows.map(row => row.origin)).toEqual(["filesystem", "filesystem"]);
    expect(rows.map(row => row.group)).toEqual([copy.groupFilesystem, copy.groupFilesystem]);
    expect(rows.map(row => row.name)).toEqual(["bin", "run"]);
    expect(rows[0]?.detail).toBeUndefined();
    expect(rows[1]?.detail).toBeUndefined();
    expect(rows.map(row => row.key)).toEqual([
      "fsys:directory:/opt/tool/bin/",
      "fsys:file:/opt/tool/bin/run",
    ]);
    expect(rows[0]?.alias).toBeUndefined();
  });
});

describe("commitRows", () => {
  it("labels with the subject and jumps with the full hash", () => {
    const rows = commitRows({ commits: [COMMIT_FOCUS], now }, copy);

    expect(rows[0]).toMatchObject({
      key: `commit:${COMMIT_FOCUS.hash}`,
      label: COMMIT_FOCUS.subject,
      group: copy.groupCommits,
      action: { kind: "open-commit", hash: COMMIT_FOCUS.hash },
    });
    expect(rows[0]?.detail).toBe(`${COMMIT_FOCUS.author} · ${copy.age(now - COMMIT_FOCUS.time * 1000)}`);
  });

  it("matches the hash itself, so refining the prefix past seven digits keeps the row", () => {
    const rows = commitRows({ commits: [COMMIT_FOCUS], now }, copy);
    // The alias is the full hash: a 7-character abbreviation would stop
    // matching on the 8th keystroke, exactly when the reader is closing in.
    expect(rows[0]?.alias).toBe(COMMIT_FOCUS.hash);
    expect(scoreText(COMMIT_FOCUS.hash.slice(0, 12), rows[0]?.alias ?? "")).not.toBeNull();
  });
});

describe("commandRows", () => {
  it("renders the slash form and advertises the input hint", () => {
    const rows = commandRows(
      [
        { name: "goal", description: "设定目标" },
        { name: "compact", description: "压缩历史", input: { hint: "<说明>" } },
      ],
      copy,
    );
    expect(labels(rows)).toEqual(["/goal", "/compact"]);
    expect(rows[0]?.action).toEqual({ kind: "execute-command", name: "goal", needsInput: false });
    expect(rows[1]?.action).toEqual({ kind: "execute-command", name: "compact", needsInput: true });
    expect(rows[1]?.hint).toBe("<说明>");
  });
});

describe("catalogRows", () => {
  const entries = CATALOG.filter(
    entry => entry.id === "panel.navigate" || entry.id === "session.archive" || entry.id === "view.theme",
  );

  it("prefixes the category word and keeps catalogue order", () => {
    const rows = catalogRows(copy, entries, new Map());
    expect(labels(rows)).toEqual(["面板：文件导航", "会话：归档当前会话", "视图：切换亮暗主题"]);
    expect(rows[0]?.action).toEqual({ kind: "open-mode", mode: "navigate" });
  });

  it("shows the host keycap when the shortcut is bound", () => {
    const hints = new Map([
      ["command-panel.navigate", "⌘P"],
      ["session.archive", "⌥⇧A"],
    ]);
    const rows = catalogRows(copy, entries, hints);
    expect(rows.map(row => row.hint)).toEqual(["⌘P", "⌥⇧A", undefined]);
  });

  it("leaves the hint empty for an action with no host shortcut", () => {
    const [row] = catalogRows(copy, CATALOG.filter(entry => entry.id === "view.theme"), new Map());
    expect(row?.hint).toBeUndefined();
  });

  it("carries the shortcut id so the row can answer its own chord", () => {
    // The keycap alone is display; the id is what lets the panel run the command
    // when the reader presses it, which is why both travel on the row.
    const rows = catalogRows(copy, entries, new Map());
    expect(rows.map(row => row.shortcutId)).toEqual([
      "command-panel.navigate",
      "session.archive",
      undefined,
    ]);
  });

  it("leaves the shortcut id off an action that declares none", () => {
    const [row] = catalogRows(copy, CATALOG.filter(entry => entry.id === "view.theme"), new Map());
    expect(row?.shortcutId).toBeUndefined();
  });
});

describe("shortcutRows", () => {
  const entries: readonly ShortcutCatalogEntry[] = [
    {
      id: "inspector.toggle",
      label: "展开或收起 NodeJS 诊断",
      aliases: ["inspector", "nodejs", "devtools"],
      keys: ["⌘", "⇧", "."],
      binding: { code: "Period", modifiers: ["meta", "shift"] },
      modified: false,
      conflicts: [],
      issue: null,
    },
    {
      id: "sidebar.left.toggle",
      label: "切换侧栏",
      keys: ["⌘", "B"],
      binding: { code: "KeyB", modifiers: ["meta"] },
      modified: false,
      conflicts: [],
      issue: null,
    },
    {
      id: "workbench.terminal",
      label: "聚焦终端 dock",
      aliases: ["term"],
      keys: [],
      binding: null,
      modified: false,
      conflicts: [],
      issue: null,
    },
  ];

  it("lists uncovered commands with their keycap and aliases", () => {
    const rows = shortcutRows(entries, copy, new Set());
    expect(labels(rows)).toEqual(["展开或收起 NodeJS 诊断", "切换侧栏", "聚焦终端 dock"]);
    expect(rows[0]?.alias).toBe("inspector nodejs devtools");
    expect(rows[0]?.hint).toBe("⌘ ⇧ .");
    expect(rows[0]?.group).toBe(copy.groupShortcuts);
    expect(rows[0]?.action).toEqual({ kind: "invoke-shortcut", id: "inspector.toggle" });
  });

  it("drops ids the default catalogue already renders", () => {
    const rows = shortcutRows(entries, copy, new Set(["sidebar.left.toggle"]));
    expect(labels(rows)).toEqual(["展开或收起 NodeJS 诊断", "聚焦终端 dock"]);
  });

  it("keeps unbound commands runnable without a keycap", () => {
    const rows = shortcutRows(entries, copy, new Set(["sidebar.left.toggle"]));
    expect(rows[1]?.hint).toBeUndefined();
    expect(rows[1]?.action).toEqual({ kind: "invoke-shortcut", id: "workbench.terminal" });
  });
});

describe("withShortcutHints", () => {
  const bound: readonly ShortcutCatalogEntry[] = [
    {
      id: "session.new",
      label: "新建会话",
      keys: ["⌘", "N"],
      binding: { code: "KeyN", modifiers: ["meta"] },
      modified: false,
      conflicts: [],
      issue: null,
    },
  ];

  const list = sessionList([SESSION_A, SESSION_B]);
  const snapshot = workspaceSnapshot();

  it("puts the live keycap on the rows that speak for the host command", () => {
    const rows = withShortcutHints(workspaceRows(snapshot, list, copy, now), bound);
    expect(rows.at(-2)?.hint).toBe("⌘ N");
    // The second level's row starts a session in the drilled workspace, while
    // the chord starts one where the reader currently is: no keycap there.
    const scoped = withShortcutHints(
      sessionRows(list, snapshot, { kind: "workspace", workspaceId: "ws-one" }, copy, now),
      bound,
    );
    expect(scoped.at(-2)?.hint).toBeUndefined();
  });

  it("leaves the row without a hint when the shortcut is not usable", () => {
    const unbound: readonly ShortcutCatalogEntry[] = [{ ...bound[0]!, binding: null, keys: [] }];
    const rows = withShortcutHints(workspaceRows(snapshot, list, copy, now), unbound);
    expect(rows.at(-2)?.hint).toBeUndefined();
  });

  it("leaves the row without a hint when the catalogue does not carry the id", () => {
    const rows = withShortcutHints(workspaceRows(snapshot, list, copy, now), []);
    expect(rows.at(-2)?.hint).toBeUndefined();
  });

  it("never overwrites a hint the row already carries", () => {
    const rows = workspaceRows(snapshot, list, copy, now);
    const hinted = withShortcutHints(rows, bound);
    // The workspace rows and the archive row speak their own trailing text.
    expect(hinted[0]?.hint).toBe(rows[0]?.hint);
    expect(hinted.at(-1)?.hint).toBe(rows.at(-1)?.hint);
  });

  it("returns the same array when no row declares a shortcut", () => {
    const rows = sessionRows(list, snapshot, { kind: "all" }, copy, now);
    expect(withShortcutHints(rows, bound)).toBe(rows);
  });
});

describe("visibleSessions", () => {
  const list = sessionList([SESSION_A, SESSION_B, SESSION_C, SESSION_BLANK, SESSION_SUBAGENT, SESSION_ARCHIVED]);
  const snapshot = workspaceSnapshot();

  it("drops blank, subagent and archived rows from the all scope", () => {
    expect(visibleSessions(list, snapshot, { kind: "all" }).map(session => session.displayTitle)).toEqual([
      "重构命令面板",
      "dsh 插件市场调研",
      "历史对话",
    ]);
  });

  it("scopes to a workspace's owned sessions", () => {
    const scoped = visibleSessions(list, snapshot, { kind: "workspace", workspaceId: "ws-one" });
    expect(scoped.map(session => session.displayTitle)).toEqual(["重构命令面板"]);
  });

  it("lists the sessions no workspace owns", () => {
    const ungrouped = visibleSessions(list, snapshot, { kind: "ungrouped" });
    expect(ungrouped.map(session => session.displayTitle)).toEqual(["历史对话"]);
  });
});

describe("newestSession", () => {
  const list = sessionList([SESSION_A, SESSION_B, SESSION_C, SESSION_BLANK, SESSION_SUBAGENT, SESSION_ARCHIVED]);
  const snapshot = workspaceSnapshot();

  it("answers with the row the scope's second level would have put first", () => {
    // sess-a is ws-one's only live session: the blank and the archived members
    // are filtered out before recency is even consulted.
    const scoped = newestSession(list, snapshot, { kind: "workspace", workspaceId: "ws-one" });
    expect(scoped?.id).toBe(SESSION_A.id);
    const rows = sessionRows(list, snapshot, { kind: "workspace", workspaceId: "ws-one" }, copy, now);
    expect(rows[0]?.action).toEqual({ kind: "open-session", sessionId: scoped?.id });
  });

  it("picks the most recently updated session of the all scope", () => {
    expect(newestSession(list, snapshot, { kind: "all" })?.id).toBe(SESSION_B.id);
  });

  it("scopes the ungrouped remainder the same way its list does", () => {
    expect(newestSession(list, snapshot, { kind: "ungrouped" })?.id).toBe(SESSION_C.id);
  });

  it("answers nothing when the scope has no live session to open", () => {
    const onlyHidden = sessionList([SESSION_ARCHIVED, SESSION_BLANK]);
    const owned = workspaceSnapshot([{ ...WORKSPACE_ONE, sessionIds: [SESSION_ARCHIVED.id, SESSION_BLANK.id] }]);
    expect(newestSession(onlyHidden, owned, { kind: "workspace", workspaceId: "ws-one" })).toBeUndefined();
  });
});

describe("workspaceRows", () => {
  const list = sessionList([SESSION_A, SESSION_B, SESSION_C, SESSION_BLANK, SESSION_SUBAGENT, SESSION_ARCHIVED]);
  const rows = workspaceRows(workspaceSnapshot(), list, copy, now);

  it("lists workspaces with visible-session counts, then the aggregate scopes, then the fixed rows", () => {
    expect(labels(rows)).toEqual([
      "dsh-plugins",
      "other",
      copy.allSessions,
      copy.ungrouped,
      copy.newSession,
      copy.archivedSessions,
    ]);
    expect(rows[0]?.hint).toBe(copy.sessionsCount(1));
    expect(rows[2]?.action).toEqual({ kind: "drill", scope: { kind: "all" }, title: copy.allSessions });
  });

  it("shows the archive count on the fixed archive row", () => {
    const archiveRow = rows.at(-1);
    expect(archiveRow?.hint).toBe(copy.sessionsCount(1));
    expect(archiveRow?.action).toEqual({ kind: "drill-archived" });
  });

  it("offers a plain new-session row that inherits the current workspace", () => {
    const newRow = rows.at(-2);
    expect(newRow?.action).toEqual({ kind: "create-session", scope: "workspace" });
  });

  it("declares the host's new-session shortcut on that row", () => {
    expect(rows.at(-2)?.shortcutId).toBe("session.new");
  });

  it("omits the ungrouped row when every visible session has an owner", () => {
    const owned = workspaceSnapshot([
      { ...workspaceSnapshot().items[0]!, sessionIds: ["sess-a", "sess-b"] },
    ]);
    expect(labels(workspaceRows(owned, sessionList([SESSION_A, SESSION_B]), copy, now))).not.toContain(
      copy.ungrouped,
    );
  });

  it("keeps the workspace path as a matchable alias and off the row", () => {
    expect(rows[0]?.alias).toContain("dsh-plugins");
    expect(rows[0]?.detail).toBeUndefined();
    expect(rows[0]?.action).toMatchObject({ kind: "drill", scope: { kind: "workspace" } });
  });
});

describe("sessionRows", () => {
  const list = sessionList([SESSION_A, SESSION_B, SESSION_C, SESSION_BLANK, SESSION_SUBAGENT, SESSION_ARCHIVED]);
  const snapshot = workspaceSnapshot();

  it("orders by last update, newest first, not by host list order", () => {
    const rows = sessionRows(list, snapshot, { kind: "all" }, copy, now);
    expect(labels(rows)).toEqual(["dsh 插件市场调研", "历史对话", "重构命令面板"]);
  });

  it("shows the workspace when the scope spans workspaces, and only the age when unowned", () => {
    const rows = sessionRows(list, snapshot, { kind: "all" }, copy, now);
    expect(rows[0]?.detail).toContain("other");
    expect(rows[0]?.detail).toContain("小时");
    expect(rows[1]?.detail).toBe(copy.age(now - SESSION_C.updatedAt));
  });

  it("marks a running session", () => {
    const rows = sessionRows(list, snapshot, { kind: "all" }, copy, now);
    expect(rows[0]?.hint).toBe(copy.running);
  });

  it("never lists an archived or subagent session", () => {
    const rows = sessionRows(list, snapshot, { kind: "all" }, copy, now);
    expect(labels(rows)).not.toContain("归档的会话");
    expect(labels(rows)).not.toContain("子代理");
  });

  it("closes a workspace scope with new-session then that workspace's archived sessions", () => {
    const scoped = sessionRows(list, snapshot, { kind: "workspace", workspaceId: "ws-one" }, copy, now);
    expect(labels(scoped).slice(-2)).toEqual([copy.newSession, copy.archivedSessions]);
    expect(scoped.at(-2)?.action).toEqual({
      kind: "create-session",
      scope: "workspace",
      workspaceId: "ws-one",
    });
    const archiveRow = scoped.at(-1);
    expect(archiveRow?.key).toBe("scope:archived");
    expect(archiveRow?.hint).toBe(copy.sessionsCount(1));
    expect(archiveRow?.action).toEqual({ kind: "drill-archived" });
  });

  it("leaves the host shortcut off the workspace-scoped row", () => {
    // Enter starts a session in this workspace; `session.new` starts one in the
    // current session's workspace. Advertising the chord here would promise the
    // wrong destination.
    const scoped = sessionRows(list, snapshot, { kind: "workspace", workspaceId: "ws-one" }, copy, now);
    expect(scoped.at(-2)?.shortcutId).toBeUndefined();
    expect(scoped.at(-2)?.action).toEqual({
      kind: "create-session",
      scope: "workspace",
      workspaceId: "ws-one",
    });
  });

  it("keeps the archived-sessions row out of the all scope", () => {
    const across = sessionRows(list, snapshot, { kind: "all" }, copy, now);
    expect(across.find(row => row.key === "scope:archived")).toBeUndefined();
  });

  it("shows the workspace archive row with a zero count when nothing is archived there", () => {
    const rows = sessionRows(list, snapshot, { kind: "workspace", workspaceId: "ws-two" }, copy, now);
    expect(rows.at(-1)?.key).toBe("scope:archived");
    expect(rows.at(-1)?.hint).toBe(copy.sessionsCount(0));
  });
});

describe("archivedSessions", () => {
  const list = sessionList([SESSION_A, SESSION_ARCHIVED, SESSION_BLANK, SESSION_SUBAGENT, SESSION_C]);
  const snapshot = workspaceSnapshot(
    [WORKSPACE_ONE, WORKSPACE_TWO],
    [SESSION_ARCHIVED.id, SESSION_BLANK.id, SESSION_SUBAGENT.id, SESSION_C.id],
  );

  it("lists only archived, non-blank, non-subagent sessions in the all scope", () => {
    expect(archivedSessions(list, snapshot, { kind: "all" }).map(session => session.displayTitle)).toEqual([
      "归档的会话",
      "历史对话",
    ]);
  });

  it("scopes to a workspace's own archived sessions", () => {
    const scoped = archivedSessions(list, snapshot, { kind: "workspace", workspaceId: "ws-one" });
    expect(scoped.map(session => session.displayTitle)).toEqual(["归档的会话"]);
  });
});

describe("sessionRows in the archive view", () => {
  // 本地时区构造：2026-10-20 12:00 起算，dayOffset 天前的同点时刻。
  const noon = new Date(2026, 9, 20, 12, 0, 0).getTime();
  const at = (dayOffset: number): number => new Date(2026, 9, 20 - dayOffset, 12, 0, 0).getTime();
  const archivedAt = (id: string, dayOffset: number): SessionSummary => ({
    id,
    displayTitle: `归档 ${id}`,
    running: false,
    blank: false,
    updatedAt: at(dayOffset),
  });

  const list = sessionList([
    archivedAt("old-1", 0),
    archivedAt("old-2", 0),
    archivedAt("yesterday-1", 1),
    archivedAt("week-1", 5),
    archivedAt("month-1", 20),
    archivedAt("older-1", 40),
  ]);
  const snapshot = workspaceSnapshot(
    [],
    ["old-1", "old-2", "yesterday-1", "week-1", "month-1", "older-1"],
  );

  it("groups archived sessions into calendar-day buckets that stay contiguous", () => {
    const rows = sessionRows(list, snapshot, { kind: "all" }, copy, noon, true);
    expect(labels(rows)).toEqual([
      "归档 old-1",
      "归档 old-2",
      "归档 yesterday-1",
      "归档 week-1",
      "归档 month-1",
      "归档 older-1",
    ]);
    expect(rows.map(row => row.group)).toEqual([
      copy.bucketToday,
      copy.bucketToday,
      copy.bucketYesterday,
      copy.bucketWeek,
      copy.bucketMonth,
      copy.bucketOlder,
    ]);
  });

  it("rows restore a session instead of opening it directly", () => {
    const rows = sessionRows(list, snapshot, { kind: "all" }, copy, noon, true);
    expect(rows[0]?.action).toEqual({ kind: "restore-session", sessionId: "old-1" });
    expect(rows[0]?.hint).toBe(copy.restoreHint);
  });
});

describe("dateBucketLabel", () => {
  const noon = new Date(2026, 9, 20, 12, 0, 0).getTime();
  const at = (dayOffset: number, hour = 12): number =>
    new Date(2026, 9, 20 - dayOffset, hour, 0, 0).getTime();

  it("buckets by local calendar days, not by elapsed hours", () => {
    expect(dateBucketLabel(at(0, 6), noon, copy)).toBe(copy.bucketToday);
    expect(dateBucketLabel(at(1, 23), noon, copy)).toBe(copy.bucketYesterday);
    expect(dateBucketLabel(at(2), noon, copy)).toBe(copy.bucketWeek);
    expect(dateBucketLabel(at(7), noon, copy)).toBe(copy.bucketWeek);
    expect(dateBucketLabel(at(8), noon, copy)).toBe(copy.bucketMonth);
    expect(dateBucketLabel(at(30), noon, copy)).toBe(copy.bucketMonth);
    expect(dateBucketLabel(at(31), noon, copy)).toBe(copy.bucketOlder);
  });
});

describe("rows with status readings", () => {
  const HOUR = 60 * 60 * 1000;
  // 本块自带时间基：fixtures 的 epoch 很小，相对它取「八小时前」会造出负时间戳，
  // 被 status 的非负守卫拒绝后回落 updatedAt，档位随之失真。
  const statusNow = 100 * HOUR;
  const snapshot = workspaceSnapshot();

  it("carries the ladder rung on session rows and the running tone on the badge", () => {
    const fresh = { ...SESSION_A, updatedAt: SESSION_A.updatedAt };
    const stale = { ...SESSION_C };
    const list = withActivity(sessionList([fresh, stale]), {
      [fresh.id]: statusNow - 30 * 60 * 1000,
      [stale.id]: statusNow - 8 * HOUR,
    });
    const rows = sessionRows(list, snapshot, { kind: "all" }, copy, statusNow);
    expect(rows.find(row => row.key === "session:sess-a")?.tone).toBe("strong");
    expect(rows.find(row => row.key === "session:sess-c")?.tone).toBeUndefined();
  });

  it("paints the running badge green via hintTone", () => {
    const list = sessionList([SESSION_B]);
    const rows = sessionRows(list, snapshot, { kind: "all" }, copy, statusNow);
    expect(rows[0]?.hintTone).toBe("running");
    const idle = sessionList([{ ...SESSION_B, running: false }]);
    expect(sessionRows(idle, snapshot, { kind: "all" }, copy, statusNow)[0]?.hintTone).toBeUndefined();
  });

  it("folds workspace rows from their members: tint always, bold only on the upper rungs", () => {
    const list = withActivity(sessionList([SESSION_A, SESSION_ARCHIVED]), {
      "sess-a": statusNow - 90 * 60 * 1000,
      "sess-archived": null,
    });
    const rows = workspaceRows(snapshot, list, copy, statusNow);
    const workspace = rows[0]!;
    expect(workspace.tone).toBe("mid");
    expect(workspace.weight).toBe("bold");

    const faint = withActivity(sessionList([SESSION_A, SESSION_ARCHIVED]), {
      "sess-a": statusNow - 4 * HOUR,
      "sess-archived": null,
    });
    const faintRow = workspaceRows(snapshot, faint, copy, statusNow)[0]!;
    expect(faintRow.tone).toBe("faint");
    expect(faintRow.weight).toBeUndefined();

    const past = withActivity(sessionList([SESSION_A, SESSION_ARCHIVED]), {
      "sess-a": statusNow - 8 * HOUR,
      "sess-archived": null,
    });
    expect(workspaceRows(snapshot, past, copy, statusNow)[0]?.tone).toBeUndefined();
  });

  it("never bolds session rows, whatever their rung", () => {
    const list = withActivity(sessionList([SESSION_A]), { "sess-a": statusNow - 30 * 60 * 1000 });
    const rows = sessionRows(list, snapshot, { kind: "all" }, copy, statusNow);
    expect(rows[0]?.tone).toBe("strong");
    expect(rows[0]?.weight).toBeUndefined();
  });
});
