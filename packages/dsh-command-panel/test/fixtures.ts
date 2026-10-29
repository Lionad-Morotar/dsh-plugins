/**
 * Fixtures shared by the suites.
 *
 * They are deliberately minimal records rather than builders: a test should read
 * as the exact host state it exercises, and an over-parameterised factory hides
 * the one field that matters to the assertion.
 */

import type {
  CommandDescriptor,
  SessionFace,
  CommandsRemote,
  FileReferenceCandidate,
  FileReferencesRemote,
  SessionListState,
  SessionSummary,
  SessionsService,
  WorkspaceSnapshot,
  WorkspaceView,
  WorkspacesService,
} from "../src/client/dsh.ts";

export const SESSION_A: SessionSummary = {
  id: "sess-a",
  displayTitle: "重构命令面板",
  cwd: "/Users/lionad/Github/Lionad-Morotar/dsh-plugins",
  running: false,
  blank: false,
  updatedAt: 1_000_000,
  retainedBy: { mainView: 1 },
};

export const SESSION_B: SessionSummary = {
  id: "sess-b",
  displayTitle: "dsh 插件市场调研",
  cwd: "/Users/lionad/Github/other",
  running: true,
  blank: false,
  updatedAt: 2_000_000,
};

export const SESSION_BLANK: SessionSummary = {
  id: "sess-blank",
  displayTitle: "新会话",
  cwd: "/Users/lionad/Github/Lionad-Morotar/dsh-plugins",
  running: false,
  blank: true,
  updatedAt: 3_000_000,
};

export const SESSION_SUBAGENT: SessionSummary = {
  id: "sess-child",
  displayTitle: "子代理",
  cwd: "/Users/lionad/Github/Lionad-Morotar/dsh-plugins",
  running: false,
  blank: false,
  updatedAt: 4_000_000,
  parentId: "sess-a",
  origin: "subagent",
};

export const SESSION_C: SessionSummary = {
  id: "sess-c",
  displayTitle: "历史对话",
  cwd: "/Users/lionad/Github/other",
  running: false,
  blank: false,
  updatedAt: 1_500_000,
};

export const SESSION_ARCHIVED: SessionSummary = {
  id: "sess-archived",
  displayTitle: "归档的会话",
  cwd: "/Users/lionad/Github/Lionad-Morotar/dsh-plugins",
  running: false,
  blank: false,
  updatedAt: 5_000_000,
};

export function sessionList(sessions: readonly SessionSummary[]): SessionListState {
  const byId: Record<string, SessionSummary | undefined> = {};
  for (const session of sessions) byId[session.id] = session;
  return { ids: sessions.map(session => session.id), byId, phase: "ready" };
}

export const WORKSPACE_ONE: WorkspaceView = {
  workspaceId: "ws-one",
  path: "/Users/lionad/Github/Lionad-Morotar/dsh-plugins",
  title: "dsh-plugins",
  sessionIds: ["sess-a", "sess-archived", "sess-blank"],
  createdAt: "2026-10-01T00:00:00.000Z",
  updatedAt: "2026-10-29T00:00:00.000Z",
};

export const WORKSPACE_TWO: WorkspaceView = {
  workspaceId: "ws-two",
  path: "/Users/lionad/Github/other",
  title: "other",
  sessionIds: ["sess-b"],
  createdAt: "2026-10-02T00:00:00.000Z",
  updatedAt: "2026-10-29T00:00:00.000Z",
};

export function workspaceSnapshot(
  items: readonly WorkspaceView[] = [WORKSPACE_ONE, WORKSPACE_TWO],
  archived: readonly string[] = [SESSION_ARCHIVED.id],
): WorkspaceSnapshot {
  return { items, archivedSessionIds: archived, pinnedSessionIds: [], state: "idle" };
}

/** The Host verbs a retained binding exposes; both succeed by default. */
export const SESSION_FACE: SessionFace = {
  cancel: async () => ({ ok: true, value: {} }),
  rename: async () => ({ ok: true, value: {} }),
};

export interface FakeSessionOptions {
  readonly createdId?: string;
  readonly createThrows?: unknown;
  readonly face?: Partial<SessionFace>;
}

export function fakeSessions(state: SessionListState, options: FakeSessionOptions = {}): SessionsService {
  const face: SessionFace = { ...SESSION_FACE, ...options.face };
  return {
    list: { getSnapshot: () => state, subscribe: () => () => undefined },
    using: async (target, _options, operation) =>
      operation({
        sessionId: target,
        binding: { session: face },
        ready: Promise.resolve(),
        release: () => undefined,
      }),
    scope: () => undefined,
    create: async () => {
      if (options.createThrows !== undefined) throw options.createThrows;
      return options.createdId ?? "sess-created";
    },
  };
}

export function fakeWorkspaces(snapshot: WorkspaceSnapshot): WorkspacesService {
  return { list: { getSnapshot: () => snapshot, subscribe: () => () => undefined } };
}

export interface RemoteScript {
  readonly files?: readonly FileReferenceCandidate[];
  readonly commands?: readonly CommandDescriptor[];
  readonly fileError?: string;
  readonly commandError?: string;
}

export function fakeFileReferences(script: RemoteScript = {}): FileReferencesRemote {
  return {
    list: async () =>
      script.fileError === undefined
        ? { ok: true, value: script.files ?? [] }
        : { ok: false, error: { code: script.fileError } },
  };
}

export function fakeCommands(script: RemoteScript = {}): CommandsRemote {
  return {
    list: async () =>
      script.commandError === undefined
        ? { ok: true, value: script.commands ?? [] }
        : { ok: false, error: { code: script.commandError } },
    execute: async () => ({ ok: true, value: undefined }),
  };
}
