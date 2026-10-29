/**
 * First-paint repository snapshot: identity, refs, working tree and the newest
 * history page, all read through the argv-only runner.
 */
import { fail, runFailure } from "./failure.ts";
import type { GitRunner } from "./git.ts";
import { assignLanes } from "./lanes.ts";
import { parseLog, parseNumStatZ, parseRefListing, parseStatusBranch, parseStatusZ } from "./parse.ts";
import type {
  GitBranchState,
  GitChangeStat,
  GitCommitNode,
  GitHead,
  GitRef,
  GitRefEntry,
  GitSnapshot,
  GitSnapshotRequest,
  GitSnapshotResult,
} from "./types.ts";

export interface SnapshotOptions {
  readonly runner: GitRunner;
  readonly cwd: string;
  /** Upper bound for the history page when the request does not pick one. */
  readonly maxCommits: number;
}

export const MAX_SNAPSHOT_COMMITS = 5000;

const REF_FORMAT = "--format=%(refname)%00%(objectname)%00%(HEAD)";
const LOG_FORMAT = "--pretty=format:%H|%P|%an|%at|%s";

function emptySnapshot(root: string): GitSnapshot {
  return {
    root,
    isRepository: false,
    head: null,
    branches: [],
    changes: [],
    commits: [],
    lanes: [],
    counts: { commits: 0, branches: 0, changes: 0 },
    status: "",
    stats: [],
  };
}

/** Sum staged and worktree line counts per path; a binary side makes the sum unknown. */
function mergeStats(
  staged: readonly { path: string; additions: number | null; deletions: number | null }[],
  worktree: readonly { path: string; additions: number | null; deletions: number | null }[],
): GitChangeStat[] {
  const merged = new Map<string, { additions: number | null; deletions: number | null }>();
  for (const stat of [...staged, ...worktree]) {
    const previous = merged.get(stat.path);
    if (previous === undefined) {
      merged.set(stat.path, { additions: stat.additions, deletions: stat.deletions });
      continue;
    }
    merged.set(stat.path, {
      additions: previous.additions === null || stat.additions === null ? null : previous.additions + stat.additions,
      deletions: previous.deletions === null || stat.deletions === null ? null : previous.deletions + stat.deletions,
    });
  }
  return [...merged.entries()]
    .map(([path, counts]) => ({ path, ...counts }))
    .sort((left, right) => left.path.localeCompare(right.path));
}

function toHead(branch: GitBranchState): GitHead {
  return {
    hash: branch.hash,
    branch: branch.branch,
    detached: branch.detached,
    ...(branch.upstream === undefined ? {} : { upstream: branch.upstream }),
    ...(branch.ahead === undefined ? {} : { ahead: branch.ahead }),
    ...(branch.behind === undefined ? {} : { behind: branch.behind }),
  };
}

function groupRefs(entries: readonly GitRefEntry[]): Map<string, GitRef[]> {
  const grouped = new Map<string, GitRef[]>();
  for (const entry of entries) {
    const ref: GitRef = { kind: entry.kind, name: entry.name, head: entry.head };
    const list = grouped.get(entry.hash);
    if (list === undefined) grouped.set(entry.hash, [ref]);
    else list.push(ref);
  }
  return grouped;
}

function clampCommits(requested: number | undefined, fallback: number): number {
  const value = requested === undefined || !Number.isFinite(requested) ? fallback : Math.trunc(requested);
  return Math.min(MAX_SNAPSHOT_COMMITS, Math.max(1, value));
}

/**
 * Collect one snapshot from `cwd`.
 *
 * A directory that is not a worktree is a valid answer (`isRepository: false`),
 * not a failed call: the panel's empty state depends on telling "no repository"
 * apart from a broken or missing git binary.
 */
export async function collectSnapshot(
  options: SnapshotOptions,
  request: Omit<GitSnapshotRequest, "sessionId"> = {},
  signal?: AbortSignal,
): Promise<GitSnapshotResult> {
  const cwd = request.cwd ?? options.cwd;
  const probe = await options.runner.run(["rev-parse", "--show-toplevel"], { cwd, signal });
  const probeFailure = runFailure(probe);
  if (probeFailure !== null) {
    if (probeFailure.code === "git-failed") {
      // `rev-parse` fails for a plain directory and for a bare repository. Both
      // are empty-state answers; the panel retries against another directory.
      return { ok: true, snapshot: emptySnapshot(cwd) };
    }
    return { ok: false, error: probeFailure };
  }
  const root = probe.stdout.trim();
  if (root === "") return { ok: true, snapshot: emptySnapshot(cwd) };

  // A repository with no commit yet answers HEAD with exit 1. That is an empty
  // repository, not a failure: `git log` cannot run there, so the first-paint
  // value is built from status alone.
  const headProbe = await options.runner.run(["rev-parse", "--quiet", "--verify", "HEAD"], { cwd: root, signal });
  const headFailure = runFailure(headProbe);
  if (headFailure !== null && headFailure.code !== "git-failed") return { ok: false, error: headFailure };
  const unborn = headFailure !== null;

  const maxCommits = clampCommits(request.maxCommits, options.maxCommits);
  const commands = [
    options.runner.run(["status", "--porcelain=v2", "-z", "--branch"], { cwd: root, signal }),
    options.runner.run(["for-each-ref", REF_FORMAT, "refs/heads", "refs/remotes", "refs/tags"], { cwd: root, signal }),
    options.runner.run(["diff", "--numstat", "-z"], { cwd: root, signal }),
    options.runner.run(["diff", "--cached", "--numstat", "-z"], { cwd: root, signal }),
  ] as const;
  const historyCommands = unborn
    ? null
    : ([
        options.runner.run(["log", "--all", "--topo-order", "--parents", LOG_FORMAT, `--max-count=${maxCommits}`], {
          cwd: root,
          signal,
        }),
        options.runner.run(["rev-list", "--count", "--all"], { cwd: root, signal }),
      ] as const);
  const [status, refs, worktreeStats, stagedStats] = await Promise.all(commands);
  const history = historyCommands === null ? null : await Promise.all(historyCommands);
  const log = history?.[0];
  const count = history?.[1];
  for (const result of [status, refs, worktreeStats, stagedStats, ...(history ?? [])]) {
    const failure = runFailure(result);
    if (failure !== null) return { ok: false, error: failure };
    if (result.stdoutLossy) return fail("git-failed", "command output exceeded the collection budget");
  }

  const branch = parseStatusBranch(status.stdout);
  const changes = parseStatusZ(status.stdout);
  const branches = parseRefListing(refs.stdout);
  const commits = log === undefined ? [] : parseLog(log.stdout);
  const refsByHash = groupRefs(branches);
  const nodes: GitCommitNode[] = commits.map(commit => ({
    ...commit,
    refs: refsByHash.get(commit.hash) ?? [],
  }));
  const lanes = assignLanes(commits);
  const total = count === undefined ? 0 : Number.parseInt(count.stdout.trim(), 10);
  return {
    ok: true,
    snapshot: {
      root,
      isRepository: true,
      head: toHead(branch),
      branches,
      changes,
      commits: nodes,
      lanes,
      counts: {
        commits: Number.isFinite(total) ? total : commits.length,
        branches: branches.length,
        changes: changes.length,
      },
      status: status.stdout,
      stats: mergeStats(parseNumStatZ(stagedStats.stdout), parseNumStatZ(worktreeStats.stdout)),
    },
  };
}
