/**
 * Host half: the Git data service behind the workbench panel.
 *
 * `GitExplorerService` owns three Remote endpoints. `snapshot` and `query` are
 * real; `run` is a typed placeholder until the action slice lands. The heavy
 * lifting lives in `host/`: parsers and the lane layout are pure, the runner is
 * the only place that touches the host subprocess service.
 */
import { isAbsolute } from "node:path";

import type { Context } from "@deepseek-ai/cordis";
import { Remote, TypertRemoteService } from "@deepseek-ai/dsh-typert-protocol";
import Schema from "@deepseek-ai/schemastery";

import { fail } from "./host/failure.ts";
import { createGitRunner, type GitRunner, type SubprocessLike } from "./host/git.ts";
import { assignLanes } from "./host/lanes.ts";
import { parseLog, parseRefs, parseStatusZ } from "./host/parse.ts";
import { collectQuery } from "./host/query.ts";
import { collectSnapshot } from "./host/snapshot.ts";
import type {
  GitQueryRequest,
  GitQueryResult,
  GitRunRequest,
  GitRunResult,
  GitSnapshotRequest,
  GitSnapshotResult,
} from "./host/types.ts";
import { GIT_SERVICE, PACKAGE_NAME } from "./shared.ts";

export { PACKAGE_NAME, GIT_SERVICE };
export type {
  GitChange,
  GitCommit,
  GitFailure,
  GitRef,
  GitRefEntry,
  GitSnapshot,
  GitSnapshotResult,
} from "./host/types.ts";
export type { LaneEdge, LaneRow } from "./host/lanes.ts";

/** Loader row name; matches `package.json#name` and the patch row id. */
export const name = PACKAGE_NAME;

/** Services the host half needs before it can answer a request. */
export const inject = ["subprocess", "typert", "workingDirectory"];

/**
 * A live Session handle. Typert's `session` lookup resolves the wire-level
 * session id to the host object; this package never reads any other field.
 */
export interface SessionHandle {
  readonly id: string;
}

/** Structural slice of the working-directory service. */
export interface WorkingDirectoryFace {
  get(session: SessionHandle): string;
  readonly defaultDirectory: string;
}

export interface GitExplorerConfig {
  readonly timeoutMs: number;
  readonly maxBytes: number;
  readonly maxCommits: number;
}

export const DEFAULT_CONFIG: GitExplorerConfig = {
  timeoutMs: 20_000,
  maxBytes: 4 * 1024 * 1024,
  maxCommits: 400,
};

function clampInt(value: unknown, fallback: number, min: number, max: number): number {
  if (typeof value !== "number" || !Number.isFinite(value)) return fallback;
  return Math.min(max, Math.max(min, Math.trunc(value)));
}

/** Normalize live-edited config without trusting the plugin row contents. */
export function normalizeConfig(config?: Partial<GitExplorerConfig>): GitExplorerConfig {
  return {
    timeoutMs: clampInt(config?.timeoutMs, DEFAULT_CONFIG.timeoutMs, 1_000, 120_000),
    maxBytes: clampInt(config?.maxBytes, DEFAULT_CONFIG.maxBytes, 64 * 1024, 64 * 1024 * 1024),
    maxCommits: clampInt(config?.maxCommits, DEFAULT_CONFIG.maxCommits, 1, 5_000),
  };
}

function messageOf(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

/**
 * Host-side Git data service.
 *
 * The `typert` service is injected because the gateway that exports these
 * endpoints is the consumer of the Remote markers; `workingDirectory` is the
 * only authority for the directory a session's Git panel should read.
 *
 * Wire shape: the typert `session` lookup turns the payload's `sessionId` into
 * the live Session object these methods receive; the rest of the payload is
 * `request`, and an optional final `signal` carries cancellation.
 */
export class GitExplorerService extends TypertRemoteService {
  static inject = inject;

  static Config = Schema.object({
    timeoutMs: Schema.number().default(DEFAULT_CONFIG.timeoutMs).description("单条 git 命令的超时（毫秒）"),
    maxBytes: Schema.number().default(DEFAULT_CONFIG.maxBytes).description("单条 git 命令的输出上限（字节）"),
    maxCommits: Schema.number().default(DEFAULT_CONFIG.maxCommits).description("快照与查询默认的提交条数上限"),
  });

  private readonly subprocess: SubprocessLike;
  private readonly workingDirectory: WorkingDirectoryFace | undefined;
  private readonly config: GitExplorerConfig;

  constructor(ctx: Context, config?: Partial<GitExplorerConfig>) {
    super(ctx, GIT_SERVICE);
    this.config = normalizeConfig(config);
    const services = ctx as unknown as {
      readonly subprocess?: SubprocessLike;
      readonly workingDirectory?: WorkingDirectoryFace;
    };
    const subprocess = services.subprocess;
    if (subprocess === undefined) {
      throw new Error("dsh-git-explorer: subprocess service is unavailable");
    }
    this.subprocess = subprocess;
    this.workingDirectory = services.workingDirectory;
  }

  /** Resolve the repository base directory for one call. */
  private baseDirectory(session: SessionHandle, override?: string): string {
    if (override !== undefined && isAbsolute(override)) return override;
    try {
      const directory = this.workingDirectory?.get(session);
      if (directory !== undefined && directory !== "") return directory;
    } catch {
      // A session that is no longer live has no projection to read; fall back to
      // the deployment directory instead of failing the whole panel.
    }
    return this.workingDirectory?.defaultDirectory ?? process.cwd();
  }

  private runnerFor(cwd: string): GitRunner {
    return createGitRunner({
      subprocess: this.subprocess,
      cwd,
      timeoutMs: this.config.timeoutMs,
      maxBytes: this.config.maxBytes,
    });
  }

  @Remote("snapshot")
  async snapshot(
    session: SessionHandle,
    request: GitSnapshotRequest = {},
    signal?: AbortSignal,
  ): Promise<GitSnapshotResult> {
    const cwd = this.baseDirectory(session, request.cwd);
    try {
      return await collectSnapshot({ runner: this.runnerFor(cwd), cwd, maxCommits: this.config.maxCommits }, request, signal);
    } catch (error) {
      return fail("internal", messageOf(error));
    }
  }

  @Remote("query")
  async query(session: SessionHandle, request: GitQueryRequest = {}, signal?: AbortSignal): Promise<GitQueryResult> {
    const cwd = this.baseDirectory(session, request.cwd);
    try {
      return await collectQuery({ runner: this.runnerFor(cwd), cwd, defaultLimit: this.config.maxCommits }, request, signal);
    } catch (error) {
      return fail("internal", messageOf(error));
    }
  }

  @Remote("run")
  async run(request: GitRunRequest = {}): Promise<GitRunResult> {
    void request;
    return {
      ok: false,
      error: { code: "not-implemented", message: "actions arrive in a later slice; the data layer is read-only" },
    };
  }
}

/**
 * Pure surfaces for the acceptance probe and the unit tests.
 *
 * These are exported from the host bundle because the acceptance harness
 * imports `lib/index.js` in plain Node and drives them without a host context.
 */
export const __test = { parseLog, parseRefs, parseStatusZ, assignLanes };

export default GitExplorerService;
