/**
 * Git domain vocabulary shared by the parsers, the lane layout and the two
 * read endpoints.
 *
 * Everything here is plain JSON: the host half returns these values over the
 * Typert gateway, so no `Date`, `Map` or branded class may appear in a field.
 */

/** One commit as `git log --pretty=format:%H|%P|%an|%at|%s` spells it. */
export interface GitCommit {
  readonly hash: string;
  readonly parents: readonly string[];
  readonly author: string;
  /** Commit time in Unix seconds (`%at`). */
  readonly time: number;
  readonly subject: string;
}

/** A decorative ref, either attached to a commit or listed on its own. */
export type GitRefKind = "branch" | "remote" | "tag";

export interface GitRef {
  readonly kind: GitRefKind;
  readonly name: string;
  readonly head: boolean;
}

export interface GitRefEntry extends GitRef {
  /** Full object id; short forms are a presentation concern. */
  readonly hash: string;
}

/** Working-tree state of one path, in the vocabulary the panel colours by. */
export type GitChangeStatus =
  | "added"
  | "modified"
  | "deleted"
  | "renamed"
  | "copied"
  | "typechange"
  | "untracked"
  | "conflicted";

export interface GitChange {
  readonly path: string;
  /** Present on a rename or copy: the path the entry came from. */
  readonly origPath?: string;
  readonly status: GitChangeStatus;
  /** Index-side change when true, worktree-side change when false. */
  readonly staged: boolean;
  readonly isDirectory: boolean;
  /** Raw porcelain columns, kept so the panel can distinguish MM from M. */
  readonly index: string;
  readonly worktree: string;
}

/** Branch facts from the porcelain v2 header. */
export interface GitBranchState {
  readonly hash: string | null;
  readonly branch: string | null;
  readonly detached: boolean;
  readonly upstream?: string;
  readonly ahead?: number;
  readonly behind?: number;
}

export interface GitHead {
  readonly hash: string | null;
  readonly branch: string | null;
  readonly detached: boolean;
  readonly upstream?: string;
  readonly ahead?: number;
  readonly behind?: number;
}

/** One history row after lane assignment. */
export interface GitCommitNode extends GitCommit {
  readonly refs: readonly GitRef[];
}

/** Line counts for one changed path, as `git diff --numstat` reports them. */
export interface GitChangeStat {
  readonly path: string;
  /** Null for a binary file, which git reports as `-`. */
  readonly additions: number | null;
  readonly deletions: number | null;
}

/** Snapshot counts, cheap enough to compute on first paint. */
export interface GitCounts {
  readonly commits: number;
  readonly branches: number;
  readonly changes: number;
}

/**
 * Everything the Git view needs for its first paint: where the repository is,
 * which branch is checked out, the working tree, and the newest history page.
 */
/**
 * One configured remote, as `git remote -v` reports it.
 *
 * The URL is kept exactly as git printed it, scp-style and https alike:
 * normalizing it is the client's job, because only the client knows which
 * provider's URL shape it is building.
 */
export interface GitRemote {
  readonly name: string;
  readonly url: string;
}

export interface GitSnapshot {
  /** Absolute worktree root reported by `git rev-parse --show-toplevel`. */
  readonly root: string;
  readonly isRepository: boolean;
  readonly head: GitHead | null;
  readonly branches: readonly GitRefEntry[];
  readonly changes: readonly GitChange[];
  readonly commits: readonly GitCommitNode[];
  readonly lanes: readonly import("./lanes.ts").LaneRow[];
  readonly counts: GitCounts;
  /** Raw `git status --porcelain=v2 -z` bytes; the panel groups them itself. */
  readonly status: string;
  /** Per-path line counts for tracked changes; untracked paths are absent. */
  readonly stats: readonly GitChangeStat[];
  /**
   * Configured remotes, one entry per name, sorted by name.
   *
   * A remote with distinct fetch and push URLs appears once, carrying its fetch
   * URL: that is the one a link to the code should name.
   */
  readonly remotes: readonly GitRemote[];
}

export type GitFailureCode =
  | "git-unavailable"
  | "timeout"
  | "git-failed"
  | "invalid-request"
  | "not-implemented"
  | "internal"
  | "not-found"
  | "too-large";

export interface GitFailure {
  readonly code: GitFailureCode;
  readonly message: string;
}

export type GitSnapshotResult =
  | { readonly ok: true; readonly snapshot: GitSnapshot }
  | { readonly ok: false; readonly error: GitFailure };

export interface GitSnapshotRequest {
  /** Session whose working directory backs this call; resolved server-side. */
  readonly sessionId: string;
  /** Absolute directory override; when absent the session's cwd is used. */
  readonly cwd?: string;
  /** Newest commits to include; clamped by the service config. */
  readonly maxCommits?: number;
}

export interface GitQueryRequest {
  /** Session whose working directory backs this call; resolved server-side. */
  readonly sessionId: string;
  /** Branch, tag or commit to walk; `--all` when absent. */
  readonly ref?: string;
  readonly search?: string;
  readonly author?: string;
  readonly skip?: number;
  readonly limit?: number;
  /** Absolute directory override; when absent the session's cwd is used. */
  readonly cwd?: string;
}

export interface GitQueryPage {
  readonly commits: readonly GitCommit[];
  readonly lanes: readonly import("./lanes.ts").LaneRow[];
  readonly hasMore: boolean;
}

export type GitQueryResult =
  | { readonly ok: true; readonly page: GitQueryPage }
  | { readonly ok: false; readonly error: GitFailure };

/** One file changed by a commit, with its line counts. */
export interface GitCommitFile {
  readonly path: string;
  /** Present on a rename or copy: the path the entry came from. */
  readonly origPath?: string;
  readonly status: GitChangeStatus;
  readonly additions: number | null;
  readonly deletions: number | null;
}

/** Everything the commit detail panel shows for one commit. */
export interface GitCommitDetail extends GitCommit {
  /** Full commit message body, without the subject line. */
  readonly body: string;
  /** Files changed against the first parent; empty for a merge with no diff. */
  readonly files: readonly GitCommitFile[];
}

export interface GitCommitRequest {
  /** Session whose working directory backs this call; resolved server-side. */
  readonly sessionId: string;
  /** Full or abbreviated object id. */
  readonly hash: string;
  /** Absolute directory override; when absent the session's cwd is used. */
  readonly cwd?: string;
}

export type GitCommitResult =
  | { readonly ok: true; readonly detail: GitCommitDetail }
  | { readonly ok: false; readonly error: GitFailure };

/** One page request for a file as a specific commit holds it. */
export interface GitShowRequest {
  /** Session whose working directory backs this call; resolved server-side. */
  readonly sessionId: string;
  /** Commit object id, 4-64 hexadecimal digits. */
  readonly hash: string;
  /** Repository-relative path. */
  readonly path: string;
  /** First line of the page, 1-based; defaults to 1. */
  readonly offset?: number;
  /** Largest line count of the page; defaults to 200 and caps at 5000. */
  readonly limit?: number;
  /** Absolute directory override; when absent the session's cwd is used. */
  readonly cwd?: string;
}

/** One page of a commit-version file, or the reason there is no text page. */
export interface GitBlobPage {
  readonly path: string;
  /** Complete object id of the blob that was read. */
  readonly revision: string;
  /** `first-parent` when the commit deleted the path and the parent kept it. */
  readonly source: "commit" | "first-parent";
  /** First line of the page, 1-based. */
  readonly offset: number;
  /** Lines held by this page; `0` for binary, submodule or past-the-end. */
  readonly lines: number;
  readonly text: string;
  readonly eof: boolean;
  /** Complete blob size in bytes. */
  readonly bytes: number;
  readonly binary: boolean;
  readonly kind: "text" | "binary" | "submodule";
}

export type GitShowResult =
  | { readonly ok: true; readonly page: GitBlobPage }
  | { readonly ok: false; readonly error: GitFailure };

/** Actions are a later slice; the data layer only acknowledges the shape. */
export interface GitRunRequest {
  readonly action?: string;
}

export type GitRunResult =
  | { readonly ok: true; readonly value: unknown }
  | { readonly ok: false; readonly error: GitFailure };

/** One local branch as the branch switcher lists it. */
export interface GitBranch {
  readonly name: string;
  readonly hash: string;
  /** True for the branch HEAD points at; false for every branch when detached. */
  readonly current: boolean;
  /** Absolute path of another worktree holding this branch; absent when free. */
  readonly worktreePath?: string;
  /** Upstream as git spells it (`origin/main`); absent when the branch has none. */
  readonly upstream?: string;
}

/**
 * Working-tree dirtiness of the session worktree, next to the branch inventory.
 *
 * Line counts cover tracked paths only: git has no line count for a file before
 * it enters the index, so untracked files are reported as a count instead of
 * pretending their contents were measured.
 */
export interface GitWorktreeDirty {
  readonly dirty: boolean;
  /** Sum of added lines across tracked changes (`git diff HEAD --numstat`). */
  readonly additions: number;
  /** Sum of deleted lines across tracked changes. */
  readonly deletions: number;
  /** Tracked paths with any modification (porcelain v2 non-`?` entries). */
  readonly trackedFiles: number;
  /** Untracked paths (`?` records). Their lines are not counted. */
  readonly untrackedFiles: number;
}

/**
 * Branch inventory for one session working directory.
 *
 * `headHash` is the short object id only when HEAD is detached: on a branch the
 * client already has `current`, and an unborn repository has no commit to show.
 */
export interface GitBranchList {
  readonly root: string;
  readonly isRepository: boolean;
  readonly detached: boolean;
  readonly headHash: string | null;
  readonly branches: readonly GitBranch[];
  /** Current working-tree state, so the header can show `+N -M` before a switch. */
  readonly worktree: GitWorktreeDirty;
}

export type GitBranchListResult =
  | { readonly ok: true; readonly list: GitBranchList }
  | { readonly ok: false; readonly error: GitFailure };

export interface GitBranchListRequest {
  /** Session whose working directory backs this call; resolved server-side. */
  readonly sessionId: string;
  /** Absolute directory override; when absent the session's cwd is used. */
  readonly cwd?: string;
}

/** Ask one worktree to check out a branch it already has. */
export interface GitSwitchRequest {
  /** Session whose working directory backs this call; resolved server-side. */
  readonly sessionId: string;
  /** Local branch name without the `refs/heads/` prefix. */
  readonly name: string;
  /** Absolute directory override; when absent the session's cwd is used. */
  readonly cwd?: string;
}

/**
 * What the automatic stash did around one successful switch.
 *
 * A switch is not atomic when the worktree is dirty: the changes are parked in
 * a stash entry first and applied back afterwards. `restored` and `conflict`
 * describe that second half; a conflict keeps the entry so nothing is lost.
 */
export interface GitSwitchStashOutcome {
  /** A stash entry was created before switching. */
  readonly stashed: boolean;
  /** The stash was applied back after switching. */
  readonly restored: boolean;
  /** The restore failed and left conflicts; the stash entry is kept. */
  readonly conflict?: boolean;
  /** Readable summary of the restore failure, for the popover. */
  readonly message?: string;
}

export type GitSwitchResult =
  | { readonly ok: true; readonly branch: string; readonly stash: GitSwitchStashOutcome }
  | { readonly ok: false; readonly error: GitFailure };
