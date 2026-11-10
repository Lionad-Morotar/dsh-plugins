/**
 * Values both halves of the package agree on.
 *
 * The view identity lives here rather than in the client entry because the
 * build script, the tests and the host all key on the same literals, and a
 * second spelling of any of them is a tab that silently never appears.
 *
 * `ROUTE_PREFIX` is declared before anything serves it on purpose: the PR data
 * half will register under this prefix, and pinning the spelling now keeps the
 * client from inventing a second one later.
 */

/** Loader row name; must match `package.json#name` and the patch row id. */
export const PACKAGE_NAME = "dsh-pr-explorer";

/** Host slot the PR view registers into, beside files, Git and the board. */
export const VIEW_SLOT = "conversation.view";

/** Cell id inside that list slot. */
export const VIEW_ID = "pr-explorer";

/**
 * Tab order in the conversation view row.
 *
 * Files 100, Git 110, PR 115, arch 120, board 130, review 140: the PR tab sits
 * between the Git panel it reads from and the architecture map, because a range
 * comparison is a reading of the same repository the Git panel shows.
 */
export const VIEW_ORDER = 115;

/** Locale namespace owned by the client half. */
export const LOCALE_NAMESPACE = "pr-explorer";

/**
 * Prefix the host half will register and the client half will fetch under.
 *
 * Relative on purpose: the GUI port changes on every host boot, so a composed
 * absolute URL would be stale by the time a tab reads it.
 */
export const ROUTE_PREFIX = "/pr-explorer/api";

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
 * Every way a PR read can fail.
 *
 * Wire values, not prose: the client maps each to its own copy, so a new code
 * without a matching translation is a blank panel rather than a wrong sentence.
 * `no-session` belongs to the route layer rather than the data layer: a git read
 * never sees a session, so only the handler that resolves one can answer it.
 */
export type PrErrorCode =
  | "not-a-repo"
  | "invalid-ref"
  | "no-merge-base"
  | "no-session"
  | "bad-request"
  | "unreadable"
  | "too-large";

export interface PrError {
  readonly code: PrErrorCode;
  /** Detail for a log or a tooltip; never the only thing shown to a reader. */
  readonly message: string;
}

/** One revision as the comparison reads it: what was asked for, and what it is. */
export interface RefReading {
  /** The ref as the caller spelled it, so the panel can echo the request. */
  readonly input: string;
  readonly hash: string;
  readonly short: string;
}

/**
 * One x...y comparison, pinned.
 *
 * `mergeBase` is the third point of the three-dot range and the only honest old
 * side for a review: a two-dot diff against a base that has moved on reports the
 * base's own later commits as this branch's work. `ahead` and `behind` are the
 * two counts from that same range, so a reader can say "3 commits ahead, 12
 * behind" without a second round trip.
 */
export interface CompareReading {
  readonly base: RefReading;
  readonly head: RefReading;
  readonly mergeBase: { readonly hash: string; readonly short: string };
  /** Commits reachable from head but not from base. */
  readonly ahead: number;
  /** Commits reachable from base but not from head. */
  readonly behind: number;
}

/** What a ref name points at, for the picker. */
export type RefKind = "branch" | "remote" | "tag";

export interface RefEntry {
  /** Short name: `main`, `origin/main`, `v1.2.0`. */
  readonly name: string;
  readonly kind: RefKind;
  /** True for the branch the panel would pick as a base by default. */
  readonly isDefault: boolean;
}

/** Where HEAD sits, in the same shape the review tab uses. */
export interface PrHead {
  readonly kind: "branch" | "detached";
  /** Branch name, or `HEAD` when detached. */
  readonly ref: string;
  readonly shortHash: string;
}

/** The picker's whole world: what can be compared, and what it defaults to. */
export interface RefListing {
  /** Basename of the repository's top level, for the panel's title. */
  readonly repo: string;
  readonly head: PrHead;
  /** Sorted: branches, then remotes, then tags, each by name. */
  readonly refs: readonly RefEntry[];
  /** The base a fresh panel starts on; null when the repository names none. */
  readonly defaultBase: string | null;
}

/** One commit in the range. */
export interface CommitEntry {
  readonly hash: string;
  readonly short: string;
  readonly subject: string;
  readonly author: string;
  /** ISO date, `YYYY-MM-DD`. */
  readonly date: string;
  /** Decorations such as `HEAD -> main, origin/main`, when git reports any. */
  readonly refs?: string;
}

/**
 * The commits in a range, newest first.
 *
 * `truncated` is its own field rather than shared with the file list: a range
 * with 400+ commits and a diff with 5000+ lines are two different facts, and one
 * flag for both would tell the reader the wrong one.
 */
export interface CommitList {
  readonly commits: readonly CommitEntry[];
  readonly truncated: boolean;
}

/**
 * What happened to one path between the merge base and the head.
 *
 * `unknown` exists so a status letter this package does not model still produces
 * a row: a file the reader cannot see is worse than one labelled vaguely.
 */
export type PrFileStatus = "added" | "modified" | "deleted" | "renamed" | "copied" | "type-changed" | "unknown";

/**
 * One path in the comparison.
 *
 * `additions` and `deletions` are null for a binary file: git reports no line
 * counts for one, and a zero would read as "empty file" rather than "not
 * counted".
 */
export interface PrChangedFile {
  readonly path: string;
  /** The old side's path, on a rename or a copy. */
  readonly oldPath?: string;
  readonly status: PrFileStatus;
  readonly additions: number | null;
  readonly deletions: number | null;
  readonly binary: boolean;
}

/** Totals over the file list; unknown line counts contribute nothing. */
export interface PrSummary {
  readonly files: number;
  readonly additions: number;
  readonly deletions: number;
}

/** The changed files of one range, sorted by path. */
export interface CompareFiles {
  readonly files: readonly PrChangedFile[];
  readonly summary: PrSummary;
}

/** One line of a hunk. `oldLine`/`newLine` are null where the line does not exist. */
export interface PrDiffLine {
  readonly kind: "add" | "del" | "context";
  readonly oldLine: number | null;
  readonly newLine: number | null;
  readonly text: string;
}

/** One `@@` block, with the counts git reported rather than the lines seen. */
export interface PrDiffHunk {
  readonly oldStart: number;
  readonly oldLines: number;
  readonly newStart: number;
  readonly newLines: number;
  /** The text after the closing `@@`, when the diff carries a function name. */
  readonly heading?: string;
  readonly lines: readonly PrDiffLine[];
}

/**
 * One file's detail.
 *
 * A deleted file carries the merge base's whole text rather than hunks: there is
 * no new side to diff against, and a hunk list of "everything removed" would
 * make the reader's own tooling work to recover what git can hand over intact.
 */
export type PrFileDiff =
  | { readonly kind: "text"; readonly path: string; readonly hunks: readonly PrDiffHunk[]; readonly truncated: boolean }
  | { readonly kind: "deleted"; readonly path: string; readonly lines: readonly string[] }
  | { readonly kind: "binary"; readonly path: string; readonly bytes: number | null };

/** The picker's answer. */
export type RefListingResult =
  | { readonly ok: true; readonly listing: RefListing }
  | { readonly ok: false; readonly error: PrError };

/** The pinned comparison's answer. */
export type CompareReadingResult =
  | { readonly ok: true; readonly reading: CompareReading }
  | { readonly ok: false; readonly error: PrError };

/** The commit list's answer. */
export type CommitListResult =
  | { readonly ok: true; readonly list: CommitList }
  | { readonly ok: false; readonly error: PrError };

/** The changed files' answer. */
export type CompareFilesResult =
  | { readonly ok: true; readonly comparison: CompareFiles }
  | { readonly ok: false; readonly error: PrError };

/** One file's detail answer. */
export type PrFileDiffResult =
  | { readonly ok: true; readonly diff: PrFileDiff }
  | { readonly ok: false; readonly error: PrError };

/**
 * One x...y comparison as the panel renders it: the pinned range, the commits in
 * it, and the files it touches.
 *
 * The three parts are one object rather than three responses because they are
 * one answer to one question. A client that fetched them separately could show a
 * commit list from one range beside a file list from another, and the panel has
 * no way to tell that happened.
 *
 * `reading` is the pin those two lists were read against, not a fourth read: the
 * assembly pins the range once and hands the same reading to both, so the commit
 * list and the file list cannot disagree about which merge base they used.
 */
export interface CompareSnapshot {
  readonly reading: CompareReading;
  readonly commits: CommitList;
  readonly files: CompareFiles;
}

/** The comparison's answer. */
export type CompareSnapshotResult =
  | { readonly ok: true; readonly compare: CompareSnapshot }
  | { readonly ok: false; readonly error: PrError };
