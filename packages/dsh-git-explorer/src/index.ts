/**
 * Host half: the Git data service behind the workbench panel.
 *
 * `GitExplorerService` owns four Remote endpoints. `snapshot`, `query` and
 * `commit` are real; `run` is a typed placeholder until the action slice lands.
 * The heavy lifting lives in `host/`: parsers and the lane layout are pure, the
 * runner is the only place that touches the host subprocess service.
 */
import { isAbsolute } from "node:path";

import type { Context } from "@deepseek-ai/cordis";
import { Remote, TypertRemoteService } from "@deepseek-ai/dsh-typert-protocol";
import Schema from "@deepseek-ai/schemastery";

import { collectCommit } from "./host/detail.ts";
import { fail } from "./host/failure.ts";
import { createGitRunner, type GitRunner, type SubprocessLike } from "./host/git.ts";
import { assignLanes } from "./host/lanes.ts";
import { parseLog, parseRefs, parseStatusZ } from "./host/parse.ts";
import { collectQuery } from "./host/query.ts";
import { collectSnapshot } from "./host/snapshot.ts";
import type {
  GitCommitRequest,
  GitCommitResult,
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
  GitChangeStat,
  GitCommit,
  GitCommitDetail,
  GitCommitFile,
  GitCommitRequest,
  GitCommitResult,
  GitFailure,
  GitRef,
  GitRefEntry,
  GitQueryPage,
  GitQueryRequest,
  GitRunRequest,
  GitRunResult,
  GitSnapshot,
  GitSnapshotRequest,
  GitSnapshotResult,
} from "./host/types.ts";
export type { LaneEdge, LaneRow } from "./host/lanes.ts";

/** Loader row name; matches `package.json#name` and the patch row id. */
export const name = PACKAGE_NAME;

/** Services the host half needs before it can answer a request. */
export const inject = ["subprocess", "sessions", "sessionPersistence"];

/**
 * Structural slice of the Cordis sessions store (live session objects).
 *
 * Only the persisted header cwd is read; every other field of the live session
 * is off limits so a host upgrade cannot break this panel through a shape this
 * package never depended on.
 */
export interface SessionsFace {
  get(id: string): { readonly header?: { readonly cwd?: string } } | undefined;
}

/** Structural slice of the sessionPersistence service (persisted header). */
export interface SessionPersistenceFace {
  stat(id: string): Promise<{ readonly header?: { readonly cwd?: string } } | undefined>;
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
 * `static inject` names exactly the services the app host guarantees. Listing a
 * name the host does not define (a `typert` helper, a session working
 * directory) would keep this whole plugin inactive forever, silently, because
 * Cordis reads a missing inject as "wait for it". Optional collaborators are
 * read through `ctx.get` per call instead, so a service that activates late is
 * picked up and an absent one degrades instead of blocking activation.
 *
 * Wire shape: the gateway passes the payload straight through — the request
 * object is the first parameter and an optional trailing `AbortSignal` the
 * last. Session identity travels inside the request as `sessionId`, and the
 * gateway's resource reader picks it up from that first object argument.
 */
export class GitExplorerService extends TypertRemoteService {
  static inject = inject;

  static Config = Schema.object({
    timeoutMs: Schema.number().default(DEFAULT_CONFIG.timeoutMs).description("单条 git 命令的超时（毫秒）"),
    maxBytes: Schema.number().default(DEFAULT_CONFIG.maxBytes).description("单条 git 命令的输出上限（字节）"),
    maxCommits: Schema.number().default(DEFAULT_CONFIG.maxCommits).description("快照与查询默认的提交条数上限"),
  });

  private readonly subprocess: SubprocessLike;
  private readonly sessions: SessionsFace | undefined;
  private readonly sessionPersistence: SessionPersistenceFace | undefined;
  private readonly config: GitExplorerConfig;

  constructor(ctx: Context, config?: Partial<GitExplorerConfig>) {
    super(ctx, GIT_SERVICE);
    this.config = normalizeConfig(config);
    const reader = ctx as unknown as { get?(name: string): unknown };
    const read = (name: string): unknown => {
      const value = reader.get?.call(ctx, name);
      return value === null ? undefined : value;
    };
    const subprocess = read("subprocess");
    const observed = {
      subprocess: subprocess !== undefined,
      sessions: read("sessions") !== undefined,
      sessionPersistence: read("sessionPersistence") !== undefined,
    };
    // Activation observability: a silent pending fiber is indistinguishable
    // from a missing module from the outside, and both have bitten already.
    console.info(`[dsh-git-explorer] activating; services=${JSON.stringify(observed)}`);
    if (subprocess === undefined) {
      throw new Error("dsh-git-explorer: subprocess service is unavailable");
    }
    this.subprocess = subprocess as SubprocessLike;
    this.sessions = read("sessions") as SessionsFace | undefined;
    this.sessionPersistence = read("sessionPersistence") as SessionPersistenceFace | undefined;
  }

  /**
   * Resolve the repository base directory for one call.
   *
   * Order: explicit absolute override, the live session header, the persisted
   * session header, then the process cwd. Every step tolerates absence, so a
   * closed session still renders a panel rooted at the deployment directory
   * instead of failing the request.
   */
  private async baseDirectory(sessionId: string, override?: string): Promise<string> {
    if (override !== undefined && isAbsolute(override)) return override;
    const live = this.sessions?.get(sessionId)?.header?.cwd;
    if (typeof live === "string" && live !== "") return live;
    try {
      const persisted = (await this.sessionPersistence?.stat(sessionId))?.header?.cwd;
      if (typeof persisted === "string" && persisted !== "") return persisted;
    } catch {
      // Persistence may be mid-restart; the deployment cwd is the last resort.
    }
    return process.cwd();
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
  async snapshot(request: GitSnapshotRequest, signal?: AbortSignal): Promise<GitSnapshotResult> {
    const cwd = await this.baseDirectory(request.sessionId, request.cwd);
    try {
      return await collectSnapshot({ runner: this.runnerFor(cwd), cwd, maxCommits: this.config.maxCommits }, request, signal);
    } catch (error) {
      return fail("internal", messageOf(error));
    }
  }

  @Remote("query")
  async query(request: GitQueryRequest, signal?: AbortSignal): Promise<GitQueryResult> {
    const cwd = await this.baseDirectory(request.sessionId, request.cwd);
    try {
      return await collectQuery({ runner: this.runnerFor(cwd), cwd, defaultLimit: this.config.maxCommits }, request, signal);
    } catch (error) {
      return fail("internal", messageOf(error));
    }
  }

  @Remote("commit")
  async commit(request: GitCommitRequest, signal?: AbortSignal): Promise<GitCommitResult> {
    const cwd = await this.baseDirectory(request.sessionId, request.cwd);
    try {
      return await collectCommit({ runner: this.runnerFor(cwd), cwd }, request, signal);
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
