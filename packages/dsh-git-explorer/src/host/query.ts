/**
 * Paged history queries.
 *
 * The page is fetched with one extra commit so `hasMore` comes from the data
 * instead of from guessing; the extra row is dropped before the lane layout, so
 * the visible page is exactly what the caller asked for.
 */
import { fail, runFailure } from "./failure.ts";
import type { GitRunner } from "./git.ts";
import { assignLanes } from "./lanes.ts";
import { parseLog } from "./parse.ts";
import type { GitQueryRequest, GitQueryResult } from "./types.ts";

export interface QueryOptions {
  readonly runner: GitRunner;
  readonly cwd: string;
  readonly defaultLimit: number;
}

const MAX_LIMIT = 5000;
const MAX_SKIP = 1_000_000;
const LOG_FORMAT = "--pretty=format:%H|%P|%an|%at|%s";
/** A ref accepted as a revision argument: no revision syntax, no leading dash. */
const SAFE_REF = /^[A-Za-z0-9][A-Za-z0-9._/-]*$/u;

function clampInt(value: number | undefined, fallback: number, min: number, max: number): number {
  if (value === undefined || !Number.isFinite(value)) return fallback;
  return Math.min(max, Math.max(min, Math.trunc(value)));
}

function cleanFilter(value: string | undefined): string | undefined {
  if (value === undefined) return undefined;
  const trimmed = value.trim();
  if (trimmed === "" || trimmed.includes("\0")) return undefined;
  return trimmed;
}

/** Run one paged history query against a repository root. */
export async function collectQuery(
  options: QueryOptions,
  request: GitQueryRequest = {},
  signal?: AbortSignal,
): Promise<GitQueryResult> {
  const cwd = request.cwd ?? options.cwd;
  const ref = request.ref === undefined ? undefined : request.ref.trim();
  if (ref !== undefined && (ref === "" || ref.length > 512 || !SAFE_REF.test(ref) || ref.includes(".."))) {
    return { ok: false, error: { code: "invalid-request", message: "ref must be a branch, tag or commit name" } };
  }
  const limit = clampInt(request.limit, options.defaultLimit, 1, MAX_LIMIT);
  const skip = clampInt(request.skip, 0, 0, MAX_SKIP);
  const argv = ["log", "--topo-order", "--parents", LOG_FORMAT, `--max-count=${limit + 1}`];
  if (skip > 0) argv.push(`--skip=${skip}`);
  const search = cleanFilter(request.search);
  if (search !== undefined) argv.push(`--grep=${search}`);
  const author = cleanFilter(request.author);
  if (author !== undefined) argv.push(`--author=${author}`);
  if (ref === undefined) argv.push("--all");
  else argv.push("--end-of-options", ref);
  const result = await options.runner.run(argv, { cwd, signal });
  const failure = runFailure(result);
  if (failure !== null) return { ok: false, error: failure };
  if (result.stdoutLossy) return fail("git-failed", "command output exceeded the collection budget");
  const parsed = parseLog(result.stdout);
  const hasMore = parsed.length > limit;
  const commits = parsed.slice(0, limit);
  return { ok: true, page: { commits, lanes: assignLanes(commits), hasMore } };
}
