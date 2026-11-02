/**
 * Local branch inventory for the branch switcher: every ref under `refs/heads`,
 * which one HEAD points at, and which branch is already checked out in another
 * worktree.
 *
 * The occupancy answer is not decoration: git refuses to check out a branch a
 * second worktree holds, so the client needs that fact before it can offer the
 * switch. Occupancy is derived by comparing each worktree path with the toplevel
 * the probe reports, which is the worktree the request is running in.
 *
 * Everything is read through the argv-only runner and nothing here writes.
 */
import { fail, runFailure } from "./failure.ts";
import type { GitRunner } from "./git.ts";
import type { GitBranch, GitBranchList, GitBranchListRequest, GitBranchListResult } from "./types.ts";

export interface BranchOptions {
  readonly runner: GitRunner;
  readonly cwd: string;
}

/** One record of `git worktree list --porcelain`. */
export interface GitWorktree {
  readonly path: string;
  /** Full object id of the commit checked out there; absent on a bare block. */
  readonly head?: string;
  /** Local branch name without `refs/heads/`; absent when detached or bare. */
  readonly branch?: string;
  readonly detached: boolean;
  readonly bare: boolean;
  readonly locked: boolean;
  readonly prunable: boolean;
}

const HEADS_PREFIX = "refs/heads/";
const REMOTES_PREFIX = "refs/remotes/";
const BRANCH_FORMAT = "--format=%(refname)%00%(objectname)%00%(HEAD)%00%(upstream)";
const WORKTREE_PREFIX = "worktree ";

/**
 * Drop the full ref's namespace.
 *
 * The inventory reads full refs because the short forms are ambiguous when a
 * tag shares the name: git then prints `heads/<name>` for a branch and
 * `remotes/<remote>/<name>` for an upstream, neither of which a switch accepts.
 * A local upstream (`branch.<name>.remote` is `.`) lives under `refs/heads`
 * and shortens to the branch name just like the branch field.
 */
function shortRef(ref: string): string {
  if (ref.startsWith(HEADS_PREFIX)) return ref.slice(HEADS_PREFIX.length);
  if (ref.startsWith(REMOTES_PREFIX)) return ref.slice(REMOTES_PREFIX.length);
  return ref;
}

interface WorktreeDraft {
  path: string;
  head?: string;
  branch?: string;
  detached: boolean;
  bare: boolean;
  locked: boolean;
  prunable: boolean;
}

/**
 * Parse `git for-each-ref` output for local branches.
 *
 * The format uses NUL separators, so a branch name with spaces survives; the
 * upstream field is the empty string when the branch has none, which is why it
 * is dropped rather than carried as an empty string. Records outside
 * `refs/heads` are not branch inventory and are skipped, matching the full-ref
 * contract `switchBranch` checks names against.
 */
export function parseBranchRefs(text: string): GitBranch[] {
  const branches: GitBranch[] = [];
  for (const raw of text.split("\n")) {
    const line = raw.endsWith("\r") ? raw.slice(0, -1) : raw;
    if (line === "") continue;
    const fields = line.split("\0");
    const ref = fields[0] ?? "";
    const hash = fields[1] ?? "";
    if (!ref.startsWith(HEADS_PREFIX) || hash === "") continue;
    const name = shortRef(ref);
    if (name === "") continue;
    const upstreamRef = fields[3] ?? "";
    const upstream = upstreamRef === "" ? "" : shortRef(upstreamRef);
    branches.push({
      name,
      hash,
      current: (fields[2] ?? "") === "*",
      ...(upstream === "" ? {} : { upstream }),
    });
  }
  return branches;
}

/**
 * Parse `git worktree list --porcelain`.
 *
 * Blocks are separated by blank lines and a worktree path may contain spaces,
 * so the path is whatever follows the `worktree ` prefix, never a field of a
 * split line. `locked` and `prunable` may carry a reason; only the flag matters
 * here, the reason stays out of the record.
 */
export function parseWorktreeList(text: string): GitWorktree[] {
  const worktrees: GitWorktree[] = [];
  let draft: WorktreeDraft | null = null;
  const flush = (): void => {
    if (draft !== null && draft.path !== "") {
      worktrees.push({
        path: draft.path,
        ...(draft.head === undefined ? {} : { head: draft.head }),
        ...(draft.branch === undefined ? {} : { branch: draft.branch }),
        detached: draft.detached,
        bare: draft.bare,
        locked: draft.locked,
        prunable: draft.prunable,
      });
    }
    draft = null;
  };
  for (const raw of text.split("\n")) {
    const line = raw.endsWith("\r") ? raw.slice(0, -1) : raw;
    if (line === "") {
      flush();
      continue;
    }
    if (line.startsWith(WORKTREE_PREFIX)) {
      flush();
      draft = {
        path: line.slice(WORKTREE_PREFIX.length),
        detached: false,
        bare: false,
        locked: false,
        prunable: false,
      };
      continue;
    }
    if (draft === null) continue;
    if (line.startsWith("HEAD ")) draft.head = line.slice("HEAD ".length);
    else if (line.startsWith("branch ")) draft.branch = line.slice("branch ".length).replace(/^refs\/heads\//u, "");
    else if (line === "detached") draft.detached = true;
    else if (line === "bare") draft.bare = true;
    else if (line === "locked" || line.startsWith("locked ")) draft.locked = true;
    else if (line === "prunable" || line.startsWith("prunable ")) draft.prunable = true;
  }
  flush();
  return worktrees;
}

function emptyList(root: string): GitBranchList {
  return { root, isRepository: false, detached: false, headHash: null, branches: [] };
}

/**
 * Read the branch inventory of one directory.
 *
 * A directory outside a worktree answers with `isRepository: false` instead of
 * an error, the same contract the snapshot endpoint uses, so the panel can show
 * an empty state for both.
 */
export async function collectBranches(
  options: BranchOptions,
  request: Omit<GitBranchListRequest, "sessionId"> = {},
  signal?: AbortSignal,
): Promise<GitBranchListResult> {
  const cwd = request.cwd ?? options.cwd;
  const probe = await options.runner.run(["rev-parse", "--show-toplevel"], { cwd, signal });
  const probeFailure = runFailure(probe);
  if (probeFailure !== null) {
    if (probeFailure.code === "git-failed") return { ok: true, list: emptyList(cwd) };
    return { ok: false, error: probeFailure };
  }
  const root = probe.stdout.trim();
  if (root === "") return { ok: true, list: emptyList(cwd) };

  const [refsRun, worktreesRun] = await Promise.all([
    options.runner.run(["for-each-ref", BRANCH_FORMAT, "refs/heads"], { cwd: root, signal }),
    options.runner.run(["worktree", "list", "--porcelain"], { cwd: root, signal }),
  ]);
  for (const result of [refsRun, worktreesRun]) {
    const failure = runFailure(result);
    if (failure !== null) return { ok: false, error: failure };
    if (result.stdoutLossy) return fail("git-failed", "command output exceeded the collection budget");
  }

  const refs = parseBranchRefs(refsRun.stdout);
  const occupied = new Map<string, string>();
  for (const worktree of parseWorktreeList(worktreesRun.stdout)) {
    if (worktree.branch === undefined || worktree.path === root) continue;
    // A branch checked out twice needs `git worktree add --force`; the first
    // holder is the one a switch would collide with, so keep it.
    if (!occupied.has(worktree.branch)) occupied.set(worktree.branch, worktree.path);
  }
  const branches = refs.map((branch): GitBranch => {
    const worktreePath = occupied.get(branch.name);
    return worktreePath === undefined ? branch : { ...branch, worktreePath };
  });

  if (branches.some(branch => branch.current)) {
    return { ok: true, list: { root, isRepository: true, detached: false, headHash: null, branches } };
  }

  // `%(HEAD)` marks only the branch HEAD points at, so no mark means either a
  // detached HEAD or a repository with no commit yet. Only a resolving HEAD
  // tells them apart, and a failed resolve is exactly the unborn case.
  const headRun = await options.runner.run(["rev-parse", "--short", "HEAD"], { cwd: root, signal });
  const headFailure = runFailure(headRun);
  if (headFailure !== null) {
    if (headFailure.code === "git-failed") {
      return { ok: true, list: { root, isRepository: true, detached: false, headHash: null, branches } };
    }
    return { ok: false, error: headFailure };
  }
  const headHash = headRun.stdout.trim();
  return {
    ok: true,
    list: {
      root,
      isRepository: true,
      detached: true,
      headHash: headHash === "" ? null : headHash,
      branches,
    },
  };
}
