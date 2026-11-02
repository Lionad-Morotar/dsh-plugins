import { describe, expect, it, vi } from "vitest";

import { copyFor } from "../src/client/copy.ts";
import { rankRows } from "../src/client/ranking.ts";
import { loadRows, type LoadRequest, type SourceServices } from "../src/client/sources.ts";
import type { GitExplorerRemote } from "../src/client/dsh.ts";
import {
  COMMIT_FOCUS,
  SESSION_A,
  SESSION_ARCHIVED,
  SESSION_B,
  SESSION_BLANK,
  SESSION_C,
  SESSION_SUBAGENT,
  fakeCommands,
  fakeFileReferences,
  fakeGitExplorer,
  fakePathExplorer,
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
    pathExplorer: () => fakePathExplorer(),
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

describe("loadRows: navigate with an absolute query", () => {
  it("asks the filesystem service instead of the workspace index", async () => {
    const list = vi.fn(async () => ({ ok: true as const, value: [] }));
    const result = await loadRows(
      services({
        fileReferences: () => ({ list }),
        pathExplorer: () =>
          fakePathExplorer({
            home: "/Users/lionad",
            entries: [{ path: "/Users/lionad/notes/todo.md", kind: "file", exists: true }],
          }),
      }),
      request({ query: "/Users/lionad/notes/tod" }),
    );

    expect(list).not.toHaveBeenCalled();
    expect(result.status).toBe("ready");
    expect(result.rows.map(row => row.label)).toEqual(["/Users/lionad/notes/todo.md"]);
    expect(result.rows[0]?.origin).toBe("filesystem");
  });

  it("needs no session to browse the filesystem", async () => {
    const result = await loadRows(
      services({
        pathExplorer: () =>
          fakePathExplorer({ home: "/tmp", entries: [{ path: "/tmp/notes", kind: "directory", exists: true }] }),
      }),
      request({ query: "/tmp/", sessionId: null }),
    );

    expect(result.status).toBe("ready");
    expect(result.rows.map(row => row.label)).toEqual(["/tmp/notes/"]);
  });

  it("reports a missing filesystem service like any missing service", async () => {
    const result = await loadRows(
      services({ pathExplorer: () => undefined }),
      request({ query: "/tmp/" }),
    );
    expect(result.status).toBe("error");
    expect(result.message).toBe(copy.failed);
  });

  it("surfaces a filesystem failure by its code", async () => {
    const result = await loadRows(
      services({ pathExplorer: () => fakePathExplorer({ error: "gateway/not-found" }) }),
      request({ query: "/tmp/" }),
    );
    expect(result).toMatchObject({ status: "error", message: "gateway/not-found" });
  });
});

describe("loadRows: navigate with a hex query", () => {
  it("attaches the commit group ahead of the workspace files", async () => {
    const query = vi.fn(async () => ({
      ok: true as const,
      value: { ok: true as const, page: { commits: [COMMIT_FOCUS] } },
    }));
    const result = await loadRows(
      services({
        fileReferences: () => fakeFileReferences({ files: [{ path: "src/panel.ts", kind: "file" }] }),
        gitExplorer: () => ({ query } satisfies GitExplorerRemote),
      }),
      request({ query: "  9393130AB " }),
    );

    expect(query).toHaveBeenCalledWith(
      { sessionId: SESSION_A.id, ref: "9393130ab", limit: 5 },
      expect.anything(),
    );
    expect(result.status).toBe("ready");
    expect(result.rows[0]?.group).toBe(copy.groupCommits);
    expect(result.rows[0]?.label).toBe(COMMIT_FOCUS.subject);
    expect(result.rows.some(row => row.group !== copy.groupCommits)).toBe(true);
  });

  it("issues no commit query when no gitExplorer face answers, and shows no error", async () => {
    const result = await loadRows(services({ gitExplorer: () => undefined }), request({ query: "9393130" }));

    expect(result.status).toBe("ready");
    expect(result.rows.some(row => row.group === copy.groupCommits)).toBe(false);
    expect(result.message).toBeUndefined();
  });

  it("degrades a refused prefix and a failed transport to no commit rows, silently", async () => {
    for (const gitExplorer of [
      fakeGitExplorer({ error: "git-failed" }),
      { query: async () => ({ ok: false as const, error: { code: "rpc-error" } }) } satisfies GitExplorerRemote,
    ]) {
      const result = await loadRows(
        services({ gitExplorer: () => gitExplorer }),
        request({ query: "9393130" }),
      );
      expect(result.status).toBe("ready");
      expect(result.rows.some(row => row.group === copy.groupCommits)).toBe(false);
      expect(result.message).toBeUndefined();
    }
  });

  it("keeps a non-hex query on the workspace plane alone", async () => {
    const query = vi.fn();
    await loadRows(
      services({ gitExplorer: () => ({ query } as unknown as GitExplorerRemote) }),
      request({ query: "panel" }),
    );
    expect(query).not.toHaveBeenCalled();
  });
});

describe("loadRows: command", () => {
  it("returns an empty plane with no session, because the panel builds its own rows", async () => {
    const result = await loadRows(services(), request({ mode: "command", sessionId: null }));
    expect(result.status).toBe("ready");
    expect(result.rows).toEqual([]);
  });

  it("returns the host catalogue as its own plane, labelled like a command", async () => {
    const result = await loadRows(
      services({
        commands: () => fakeCommands({ commands: [{ name: "goal", description: "设定目标" }] }),
      }),
      request({ mode: "command" }),
    );
    expect(result.rows.map(row => row.label)).toEqual(["/goal"]);
    expect(result.rows[0]?.group).toBe(copy.groupCommands);
  });

  it("reports a failed catalogue as a warning with an empty plane", async () => {
    const result = await loadRows(
      services({ commands: () => fakeCommands({ commandError: "session/writer-held" }) }),
      request({ mode: "command" }),
    );
    expect(result.status).toBe("ready");
    expect(result.rows).toEqual([]);
    expect(result.warning).toBe("session/writer-held");
  });
});

describe("loadRows: switch", () => {
  it("returns workspaces at the top level, closing with the two fixed rows", async () => {
    const result = await loadRows(services(), request({ mode: "switch" }));
    expect(result.status).toBe("ready");
    expect(result.rows.map(row => row.label)).toEqual([
      "dsh-plugins",
      "other",
      copy.allSessions,
      copy.ungrouped,
      copy.newSession,
      copy.archivedSessions,
    ]);
  });

  it("closes a workspace's sessions with a new-session row and an archived-sessions row", async () => {
    const result = await loadRows(
      services(),
      request({ mode: "switch", level: "sessions", scope: { kind: "workspace", workspaceId: "ws-one" } }),
    );
    expect(result.rows.map(row => row.label)).toEqual(["重构命令面板", copy.newSession, copy.archivedSessions]);
    expect(result.rows.at(-2)?.action).toEqual({
      kind: "create-session",
      scope: "workspace",
      workspaceId: "ws-one",
    });
    expect(result.rows.at(-1)?.action).toEqual({ kind: "drill-archived" });
    // ws-one's only archived session is sess-archived in the fixture.
    expect(result.rows.at(-1)?.hint).toBe(copy.sessionsCount(1));
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

  it("merges cross-workspace session rows once the root query is non-empty", async () => {
    const result = await loadRows(services(), request({ mode: "switch", query: "调研" }));
    expect(result.status).toBe("ready");
    // The loader returns the merged unranked plane — the title lives on no
    // workspace row, so only this addition can answer a session-title query.
    const merged = result.rows.find(row => row.label === SESSION_B.displayTitle);
    expect(merged?.action).toEqual({ kind: "open-session", sessionId: SESSION_B.id });
    // Ranked the way the runtime projects it, the title reaches the session
    // without the drill: workspace and aggregate rows stay silent.
    expect(rankRows(result.rows, "调研").map(row => row.label)).toEqual([SESSION_B.displayTitle]);
  });

  it("keeps a workspace query answered by its row first, its sessions below", async () => {
    const result = await loadRows(services(), request({ mode: "switch", query: "dsh-plugins" }));
    const ranked = rankRows(result.rows, "dsh-plugins").map(row => row.label);
    expect(ranked.indexOf("dsh-plugins")).toBeLessThan(ranked.indexOf(SESSION_A.displayTitle));
    // The other workspace's session rides in only via its own title, and
    // "dsh-plugins" is not part of it.
    expect(ranked).not.toContain(SESSION_B.displayTitle);
  });
});

describe("loadRows: navigate with a parent-step query", () => {
  it("browses the filesystem against the session cwd", async () => {
    let seen: { query: string; base?: string } | undefined;
    const list = vi.fn(async () => ({ ok: true as const, value: [] }));
    const result = await loadRows(
      services({
        fileReferences: () => ({ list }),
        pathExplorer: () =>
          fakePathExplorer({
            entries: [{ path: "/Users/lionad/notes", kind: "directory", exists: true }],
            onResolve: request => {
              seen = request;
            },
          }),
      }),
      request({ query: "../notes" }),
    );

    expect(list).not.toHaveBeenCalled();
    expect(seen).toEqual({ query: "../notes", base: "/Users/lionad/Github/Lionad-Morotar/dsh-plugins" });
    expect(result.status).toBe("ready");
    expect(result.rows[0]?.origin).toBe("filesystem");
  });

  it("explains the missing session instead of resolving without a base", async () => {
    const result = await loadRows(
      services({ pathExplorer: () => fakePathExplorer() }),
      request({ query: "../notes", sessionId: null }),
    );

    expect(result.status).toBe("error");
    expect(result.message).toBe(copy.noticeNoSession);
  });
});
