/**
 * Fixtures shared by the suites.
 *
 * They are deliberately minimal records rather than builders: a test should read
 * as the exact host state it exercises, and an over-parameterised factory hides
 * the one field that matters to the assertion.
 */

import type { PathInspectAnswer } from "../src/shared.ts";
import type {
  CommandDescriptor,
  SessionFace,
  CommandsRemote,
  FileReferenceCandidate,
  FileReferencesRemote,
  GitCommitSummary,
  GitExplorerRemote,
  PathExplorerRemote,
  ProjectionSnapshotWire,
  SessionListState,
  NativeOpenFace,
  SessionOpenFace,
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

/**
 * Attach settled `sessionActivity` readings to a session list, the way the host
 * rides projection cells onto the snapshot. `null` marks a session whose log
 * has produced no reading yet (the activity clock itself reads null).
 */
export function withActivity(
  list: SessionListState,
  readings: Readonly<Record<string, number | null>>,
): SessionListState {
  const projectionsBySession: Record<string, ProjectionSnapshotWire> = {};
  for (const [id, lastActivityAt] of Object.entries(readings)) {
    projectionsBySession[id] = {
      state: "ready",
      values: {
        sessionActivity: {
          lastActivityAt,
          promptCount: 1,
          turnCount: 1,
          toolCallCount: 0,
        },
      },
    };
  }
  return { ...list, projectionsBySession };
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

export interface PathScript {
  readonly home?: string;
  readonly entries?: ReadonlyArray<{ readonly path: string; readonly kind: "file" | "directory"; readonly exists: boolean; readonly link?: string }>;
  readonly error?: string;
  /** Observed request, for specs that pin what the loader sent. */
  readonly onResolve?: (request: { readonly query: string; readonly base?: string }) => void;
  /** Answers `inspect`; absent leaves the endpoint off the face, like an older host half. */
  readonly inspect?: (request: { readonly path: string }) => PathInspectAnswer;
  /** Observed inspections, for specs that pin which path was asked about. */
  readonly onInspect?: (request: { readonly path: string }) => void;
}

/** The filesystem exploration service this package's own host half publishes. */
export function fakePathExplorer(script: PathScript = {}): PathExplorerRemote {
  return {
    resolve: async request => {
      script.onResolve?.(request);
      return script.error === undefined
        ? {
            ok: true as const,
            value: { ok: true as const, home: script.home ?? "/Users/lionad", entries: script.entries ?? [] },
          }
        : { ok: false as const, error: { code: script.error } };
    },
    ...(script.inspect === undefined
      ? {}
      : {
          inspect: async (request: { readonly path: string }) => {
            script.onInspect?.(request);
            return { ok: true as const, value: script.inspect!(request) };
          },
        }),
  };
}

export interface SessionOpenScript {
  readonly canOpen?: boolean;
  readonly openError?: string;
}

export interface NativeOpenScript {
  /** What the host half answers; defaults to a successful open. */
  readonly result?: "opened" | "unavailable" | "failed";
  /**
   * Carrier failure code. Set when the gateway never delivered a verdict
   * (`ok: false`), which is not the same as the host half answering `"failed"`.
   */
  readonly error?: string;
}

/** The `remote.nativeOpen` face this package's own host half publishes. */
export function fakeNativeOpen(script: NativeOpenScript = {}): NativeOpenFace {
  return {
    open: async () =>
      script.error === undefined
        ? { ok: true as const, value: script.result ?? "opened" }
        : { ok: false as const, error: { code: script.error } },
  };
}

/** The `remote.session` pair the reveal fallback asks for. */
export function fakeSessionOpen(script: SessionOpenScript = {}): SessionOpenFace {
  return {
    canOpenWorkspacePath: async () => ({ ok: true as const, value: script.canOpen ?? true }),
    openWorkspacePath: async () =>
      script.openError === undefined
        ? { ok: true as const, value: { opened: true as const } }
        : { ok: false as const, error: { code: script.openError } },
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

/** One history commit the way `git log` spells it, at a fixed point in time. */
export const COMMIT_FOCUS: GitCommitSummary = {
  hash: "9393130e5f1ad2c61b8e04ff9cf01a53d1c7b6e2",
  author: "Lionad",
  time: 4_000,
  subject: "视图消费 commit:<hash> 焦点",
};

export interface GitScript {
  readonly commits?: readonly GitCommitSummary[];
  /** Business failure code the git host half would answer with. */
  readonly error?: string;
}

/** The `remote.gitExplorer` query face dsh-git-explorer's host half publishes. */
export function fakeGitExplorer(script: GitScript = {}): GitExplorerRemote {
  return {
    query: async () =>
      script.error === undefined
        ? { ok: true as const, value: { ok: true as const, page: { commits: script.commits ?? [] } } }
        : { ok: true as const, value: { ok: false as const, error: { code: script.error } } },
  };
}
