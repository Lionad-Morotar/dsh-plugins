/**
 * Values both halves of the package agree on.
 *
 * The view identity lives here rather than in the client entry because the
 * build script, the tests and the host all key on the same literals, and a
 * second spelling of any of them is a tab that silently never appears.
 *
 * `ROUTE_PREFIX` is declared before anything serves it on purpose: the review
 * data half will register under this prefix, and pinning the spelling now keeps
 * the client from inventing a second one later.
 */

/** Loader row name; must match `package.json#name` and the patch row id. */
export const PACKAGE_NAME = "dsh-review-map";

/** Host slot the review map view registers into, beside files, Git and the board. */
export const VIEW_SLOT = "conversation.view";

/** Cell id inside that list slot. */
export const VIEW_ID = "review-map";

/** Tab order in the conversation view row; files 100, Git 110, arch 120, board 130. */
export const VIEW_ORDER = 140;

/** Locale namespace owned by the client half. */
export const LOCALE_NAMESPACE = "review-map";

/**
 * Prefix the host half will register and the client half will fetch under.
 *
 * Relative on purpose: the GUI port changes on every host boot, so a composed
 * absolute URL would be stale by the time a tab reads it.
 */
export const ROUTE_PREFIX = "/review-map/api";

/**
 * The `require` the ModuleLoader factory hands to a client bundle.
 *
 * Declared even though this slice fetches nothing: the factory signature is the
 * loader's, not this package's, and a bundle that never names it cannot grow a
 * lazy chunk without changing its own shape.
 */
export interface LoaderRequire {
  (specifier: string): unknown;
  /** Fetch a package-local chunk; the specifier must be `./<file>`. */
  async(specifier: string): Promise<unknown>;
}

/**
 * What the reader wants compared.
 *
 * Two scopes, deliberately not one scope with a flag: a worktree review is
 * about what is not committed yet, a branch review is about what is. Folding
 * them into one comparison would make "uncommitted changes are not counted"
 * impossible to state, and that is the whole difference between them.
 *
 * `baseRef` is optional because the common request is "compare this branch to
 * whatever it forked from", and the client should not have to guess that. An
 * absent `baseRef` is resolved against the remote's default branch, then the
 * local `main`, then `master`.
 */
export type ReviewScope =
  | { readonly kind: "worktree" }
  | { readonly kind: "branch"; readonly baseRef?: string };

/**
 * A scope with its old side pinned to a concrete revision.
 *
 * `baseRef` is `HEAD` for a worktree review and the resolved baseline for a
 * branch review. Every read below takes this instead of a scope, so no module
 * re-derives the old side and disagrees with another one about it.
 */
export interface ResolvedScope {
  readonly kind: "worktree" | "branch";
  readonly baseRef: string;
}

/**
 * What happened to one path between the old side and the new side.
 *
 * `unknown` exists so a status letter this package does not model still
 * produces a row: a file the reader cannot see is worse than one labelled
 * vaguely.
 */
export type ChangedFileStatus =
  | "added"
  | "modified"
  | "deleted"
  | "renamed"
  | "copied"
  | "type-changed"
  | "untracked"
  | "conflicted"
  | "unknown";

/**
 * One path in the comparison.
 *
 * `path` is the new side's path, except for a deletion, where the new side has
 * no path and the old one is the only name the reader can act on.
 *
 * `additions` and `deletions` are null for a binary file and for an untracked
 * one: git reports no line counts for either, and a zero would read as "empty
 * file" rather than "not counted".
 */
export interface ChangedFile {
  readonly path: string;
  /** The old side's path, on a rename or a copy. */
  readonly oldPath?: string;
  readonly status: ChangedFileStatus;
  readonly additions: number | null;
  readonly deletions: number | null;
  readonly binary: boolean;
  readonly untracked: boolean;
}

/** Where the new side sits in history. */
export interface ReviewHead {
  readonly kind: "branch" | "detached";
  /** Branch name, or `HEAD` when detached. */
  readonly ref: string;
  readonly shortHash: string;
}

/** Totals over the file list; unknown line counts contribute nothing. */
export interface ReviewSummary {
  readonly files: number;
  readonly additions: number;
  readonly deletions: number;
}

/** One repository's comparison, ready to render. */
export interface ReviewSnapshot {
  /** Basename of the repository's top level, for the panel's title. */
  readonly repo: string;
  readonly head: ReviewHead;
  readonly scope: "worktree" | "branch";
  /** The old side; null for a worktree review, which compares against `HEAD`. */
  readonly baseRef: string | null;
  /** Files with uncommitted changes, whatever the scope: a separate fact. */
  readonly uncommitted: number;
  /** Sorted by `path`, so two reads of one tree agree. */
  readonly files: readonly ChangedFile[];
  readonly summary: ReviewSummary;
}

/**
 * Every way a review read can fail.
 *
 * Wire values, not prose: the client maps each to its own copy, so a new code
 * without a matching translation is a blank panel rather than a wrong sentence.
 */
export type ReviewErrorCode =
  | "not-a-repo"
  | "no-base"
  | "no-session"
  | "conflicted"
  | "unreadable"
  | "too-large"
  | "bad-request";

export interface ReviewError {
  readonly code: ReviewErrorCode;
  /** Detail for a log or a tooltip; never the only thing shown to a reader. */
  readonly message: string;
}

/** One line of a hunk. `oldLine`/`newLine` are null where the line does not exist. */
export interface DiffLine {
  readonly kind: "add" | "del" | "context";
  readonly oldLine: number | null;
  readonly newLine: number | null;
  readonly text: string;
}

/** One `@@` block, with the counts git reported rather than the lines seen. */
export interface DiffHunk {
  readonly oldStart: number;
  readonly oldLines: number;
  readonly newStart: number;
  readonly newLines: number;
  /** The text after the closing `@@`, when the diff carries a function name. */
  readonly heading?: string;
  readonly lines: readonly DiffLine[];
}

/**
 * One file's detail.
 *
 * Deleted and untracked files carry whole-file text rather than hunks: there is
 * no second side to diff against, and a hunk list of "everything" would make
 * the reader's own tooling work to recover what it already had.
 */
export type FileDiff =
  | { readonly kind: "text"; readonly path: string; readonly hunks: readonly DiffHunk[]; readonly truncated: boolean }
  | { readonly kind: "deleted"; readonly path: string; readonly lines: readonly string[] }
  | { readonly kind: "untracked"; readonly path: string; readonly lines: readonly string[] }
  | { readonly kind: "binary"; readonly path: string; readonly bytes: number | null };

/** `GET` snapshot answer. */
export type ReviewSnapshotResult =
  | { readonly ok: true; readonly snapshot: ReviewSnapshot }
  | { readonly ok: false; readonly error: ReviewError };

/** `GET` file-diff answer. */
export type FileDiffResult =
  | { readonly ok: true; readonly diff: FileDiff }
  | { readonly ok: false; readonly error: ReviewError };
