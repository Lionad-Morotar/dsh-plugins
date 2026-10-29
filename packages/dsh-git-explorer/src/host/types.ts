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
}

export type GitFailureCode =
  | "git-unavailable"
  | "timeout"
  | "git-failed"
  | "invalid-request"
  | "not-implemented"
  | "internal";

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

/** Actions are a later slice; the data layer only acknowledges the shape. */
export interface GitRunRequest {
  readonly action?: string;
}

export type GitRunResult =
  | { readonly ok: true; readonly value: unknown }
  | { readonly ok: false; readonly error: GitFailure };
