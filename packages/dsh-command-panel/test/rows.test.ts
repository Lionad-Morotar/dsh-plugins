import { describe, expect, it } from "vitest";

import { copyFor } from "../src/client/copy.ts";
import { CATALOG } from "../src/client/catalog.ts";
import {
  catalogRows,
  commandRows,
  fileRows,
  sessionRows,
  visibleSessions,
  workspaceRows,
  type PanelRow,
} from "../src/client/rows.ts";
import {
  SESSION_A,
  SESSION_ARCHIVED,
  SESSION_B,
  SESSION_BLANK,
  SESSION_C,
  SESSION_SUBAGENT,
  sessionList,
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
    expect(rows[1]?.detail).toBe(copy.directory);
  });

  it("matches on a basename without losing the full path in the label", () => {
    const rows = fileRows({ cwd: "/repo", candidates: [{ path: "a/b/panel.ts", kind: "file" }] }, copy);
    expect(rows[0]?.alias).toBe("panel.ts");
    expect(rows[0]?.label).toBe("a/b/panel.ts");
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

describe("workspaceRows", () => {
  const list = sessionList([SESSION_A, SESSION_B, SESSION_C, SESSION_BLANK, SESSION_SUBAGENT, SESSION_ARCHIVED]);
  const rows = workspaceRows(workspaceSnapshot(), list, copy);

  it("lists workspaces with visible-session counts, then the aggregate scopes", () => {
    expect(labels(rows)).toEqual(["dsh-plugins", "other", copy.allSessions, copy.ungrouped]);
    expect(rows[0]?.hint).toBe(copy.sessionsCount(1));
    expect(rows[2]?.action).toEqual({ kind: "drill", scope: { kind: "all" }, title: copy.allSessions });
  });

  it("omits the ungrouped row when every visible session has an owner", () => {
    const owned = workspaceSnapshot([
      { ...workspaceSnapshot().items[0]!, sessionIds: ["sess-a", "sess-b"] },
    ]);
    expect(labels(workspaceRows(owned, sessionList([SESSION_A, SESSION_B]), copy))).not.toContain(
      copy.ungrouped,
    );
  });

  it("keeps the workspace path as a matchable alias", () => {
    expect(rows[0]?.alias).toContain("dsh-plugins");
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
    expect(rows[0]?.detail).toContain("小时前");
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
});
