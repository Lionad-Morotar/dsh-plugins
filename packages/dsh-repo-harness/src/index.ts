/**
 * `dsh-repo-harness` host plugin.
 *
 * The package is the future home of repository-level automation and
 * governance; merge-steer is its first feature. This module is wiring only:
 * read the optional working-directory service, hand the Agent registry and a
 * bounded Git runner factory to the feature, and tie its lifetime to the
 * Cordis fiber.
 */
import Schema from "@deepseek-ai/schemastery";

import { createGitRunner } from "./git.ts";
import { normalizeConfig } from "./merge-steer/config.ts";
import { createMergeSteerCore } from "./merge-steer/core.ts";
import type { AgentsLike, LoggerLike, SubprocessLike, WorkingDirectoryLike } from "./types.ts";

/** Loader row name; matches `cordis.patch.yml`. */
export const name = "repo-harness";

/** The two host services merge-steer cannot work without. */
export const inject = ["agents", "subprocess"];

/** Plugin-row schema; merge-steer owns one namespaced branch. */
export const Config = Schema.object({
  mergeSteer: Schema.object({
    pollMs: Schema.number().default(15_000).description("轮询间隔（毫秒），15 秒是正确性地板"),
    watch: Schema.boolean().default(true).description("是否用 fs.watch 提前触发轮询"),
    maxCatchUpMs: Schema.number().default(300_000).description("休眠或暂停超过该时长后重建基线，不补发历史合并"),
    maxNoticeChars: Schema.number().default(420).description("单条提醒的字素硬上限"),
    maxMessageChars: Schema.number().default(200).description("提交说明的字素上限"),
    includePulls: Schema.boolean().default(false).description("是否把 git pull 的 reflog 也视为合并"),
    notifySubagents: Schema.boolean().default(false).description("是否提醒子代理会话"),
    audienceAll: Schema.boolean().default(false).description("是否对同仓库所有 running 会话广播"),
  })
    .default({})
    .description("merge-steer 特性配置"),
});

/** Structural slice of the Cordis context this plugin consumes. */
export interface PluginContextLike {
  readonly agents?: AgentsLike;
  readonly subprocess?: SubprocessLike;
  readonly logger?: LoggerLike;
  get?(service: string): unknown;
  on?(event: string, handler: (...args: unknown[]) => void, options?: { global?: boolean }): (() => void) | void;
  effect?(setup: () => (() => void) | void, label?: string): unknown;
}

function workingDirectoryOf(ctx: PluginContextLike): WorkingDirectoryLike | undefined {
  const candidate = ctx.get?.("workingDirectory");
  if (typeof candidate === "object" && candidate !== null) {
    const get = (candidate as { get?: unknown }).get;
    if (typeof get === "function") return candidate as WorkingDirectoryLike;
  }
  return undefined;
}

function mergeSteerConfigOf(raw: unknown): unknown {
  return typeof raw === "object" && raw !== null ? (raw as Record<string, unknown>)["mergeSteer"] : undefined;
}

/**
 * Mount the repository harness.
 * @param ctx - host context; `agents` and `subprocess` are required by `inject`.
 * @param rawConfig - parsed plugin-row config, including the `mergeSteer` branch.
 */
export function apply(ctx: PluginContextLike, rawConfig?: unknown): void {
  const { agents, subprocess } = ctx;
  if (agents === undefined || subprocess === undefined) {
    ctx.logger?.warn?.("repo-harness: agents or subprocess is unavailable; merge-steer stays inert");
    return;
  }

  const config = normalizeConfig(mergeSteerConfigOf(rawConfig));
  const workingDirectory = workingDirectoryOf(ctx);
  const core = createMergeSteerCore({
    agents,
    createRunner: (cwd) => createGitRunner({ subprocess, cwd }),
    ...(workingDirectory === undefined ? {} : { workingDirectory }),
    ...(ctx.logger === undefined ? {} : { logger: ctx.logger }),
    config,
    ...(ctx.on === undefined
      ? {}
      : { on: (event: string, handler: (...args: unknown[]) => void, options?: { global?: boolean }) => ctx.on?.(event, handler, options) }),
  });

  const start = (): void => {
    core.start();
    ctx.logger?.info?.(`repo-harness: merge-steer active; poll=${String(config.pollMs)}ms`);
  };
  const stop = (): void => {
    core.dispose();
  };

  if (ctx.effect !== undefined) {
    ctx.effect(() => {
      start();
      return stop;
    }, "repo-harness:merge-steer");
    return;
  }
  ctx.logger?.warn?.("repo-harness: ctx.effect is unavailable; merge-steer has no disposal hook");
  start();
}
