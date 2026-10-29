import { describe, expect, it } from "vitest";

import { copyFor } from "../src/client/copy.ts";
import { loadRows, type LoadRequest, type SourceServices } from "../src/client/sources.ts";
import {
  SESSION_A,
  SESSION_ARCHIVED,
  SESSION_B,
  SESSION_BLANK,
  SESSION_C,
  SESSION_SUBAGENT,
  fakeCommands,
  fakeFileReferences,
  fakeSessions,
  fakeWorkspaces,
  sessionList,
  workspaceSnapshot,
} from "./fixtures.ts";

const copy = copyFor("zh");
const now = 5_000_000;
const signal = new AbortController().signal;

function services(overrides: Partial<SourceServices> = {}): SourceServices {
  const list = sessionList([SESSION_A, SESSION_B, SESSION_C, SESSION_BLANK, SESSION_SUBAGENT, SESSION_ARCHIVED]);
  return {
    fileReferences: () => fakeFileReferences(),
    commands: () => fakeCommands(),
    sessions: () => fakeSessions(list),
    workspaces: () => fakeWorkspaces(workspaceSnapshot()),
    now: () => now,
    ...overrides,
  };
}

function request(overrides: Partial<LoadRequest> = {}): LoadRequest {
  return {
    mode: "navigate",
    level: "root",
    scope: null,
    query: "",
    sessionId: SESSION_A.id,
    copy,
    hints: {},
    signal,
    ...overrides,
  };
}

describe("loadRows: navigate", () => {
  it("returns file rows with an absolute payload built from the session cwd", async () => {
    const result = await loadRows(
      services({
        fileReferences: () =>
          fakeFileReferences({
            files: [
              { path: "src/client/panel.ts", kind: "file" },
              { path: "src", kind: "directory" },
            ],
          }),
      }),
      request(),
    );

    expect(result.status).toBe("ready");
    expect(result.rows.map(row => row.action)).toEqual([
      { kind: "insert-path", absolutePath: `${SESSION_A.cwd}/src/client/panel.ts` },
      { kind: "insert-path", absolutePath: `${SESSION_A.cwd}/src/` },
    ]);
  });

  it("explains the missing session instead of querying without one", async () => {
    const result = await loadRows(services(), request({ sessionId: null }));
    expect(result.status).toBe("error");
    expect(result.message).toBe(copy.noticeNoSession);
  });

  it("surfaces a host failure by its code", async () => {
    const result = await loadRows(
      services({ fileReferences: () => fakeFileReferences({ fileError: "gateway/not-found" }) }),
      request(),
    );
    expect(result).toMatchObject({ status: "error", message: "gateway/not-found" });
  });

  it("does not fail when a service is missing", async () => {
    const result = await loadRows(services({ fileReferences: () => undefined }), request());
    expect(result.status).toBe("error");
    expect(result.message).toBe(copy.failed);
  });
});

describe("loadRows: command", () => {
  it("offers the panel's own entries even with no session", async () => {
    const result = await loadRows(services(), request({ mode: "command", sessionId: null }));
    expect(result.status).toBe("ready");
    expect(result.rows.map(row => row.label)).toEqual(["文件导航", "指令", "切换"]);
  });

  it("puts the panel's entries before the host catalogue", async () => {
    const result = await loadRows(
      services({
        commands: () => fakeCommands({ commands: [{ name: "goal", description: "设定目标" }] }),
      }),
      request({ mode: "command" }),
    );
    expect(result.rows.map(row => row.label)).toEqual(["文件导航", "指令", "切换", "/goal"]);
    expect(result.rows[3]?.group).toBe(copy.groupCommands);
  });

  it("keeps the panel's own entries usable when the host catalogue fails", async () => {
    const result = await loadRows(
      services({ commands: () => fakeCommands({ commandError: "session/writer-held" }) }),
      request({ mode: "command" }),
    );
    expect(result.status).toBe("ready");
    expect(result.rows.map(row => row.label)).toEqual(["文件导航", "指令", "切换"]);
    expect(result.warning).toBe("session/writer-held");
  });

  it("passes the keycaps it was given for the built-in rows", async () => {
    const result = await loadRows(
      services(),
      request({ mode: "command", sessionId: null, hints: { navigate: "⌘P" } }),
    );
    expect(result.rows[0]?.hint).toBe("⌘P");
  });
});

describe("loadRows: switch", () => {
  it("returns workspaces at the top level", async () => {
    const result = await loadRows(services(), request({ mode: "switch" }));
    expect(result.status).toBe("ready");
    expect(result.rows.map(row => row.label)).toEqual([
      "dsh-plugins",
      "other",
      copy.allSessions,
      copy.ungrouped,
    ]);
  });

  it("returns one workspace's sessions at the second level", async () => {
    const result = await loadRows(
      services(),
      request({ mode: "switch", level: "sessions", scope: { kind: "workspace", workspaceId: "ws-one" } }),
    );
    expect(result.rows.map(row => row.label)).toEqual(["重构命令面板"]);
  });

  it("needs no session and no remote at all", async () => {
    const result = await loadRows(
      services({
        fileReferences: () => undefined,
        commands: () => undefined,
        sessions: () => fakeSessions(sessionList([SESSION_A])),
      }),
      request({ mode: "switch", sessionId: null }),
    );
    expect(result.status).toBe("ready");
  });
});
