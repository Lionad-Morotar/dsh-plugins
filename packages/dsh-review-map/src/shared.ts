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
 * The package-local chunk the map renderer is fetched from.
 *
 * Named here rather than in the loader because three things have to agree on
 * the spelling and none of them can import the others: the build script that
 * emits the file, the `chunk:` field the chunk registers with, and the loader
 * reference bundled into the entry. The build asserts all three against this
 * constant, so a drift is a failed build rather than a tab that fetches a file
 * nobody built.
 */
export const MAP_CHUNK = "client.map.js";

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

/**
 * One file in the structure index.
 *
 * `path` is the new side's path, except for a deletion, which has no new side
 * and is indexed under the old one: a file that vanished from the tree is
 * exactly what a reviewer is looking for, and dropping it would make the map
 * quietly disagree with the change list.
 *
 * `lines` is a newline count, not a line count in the editor sense: it equals
 * `wc -l`, so a file with no trailing newline reports one fewer than the number
 * of lines a reader sees. That is the number git's own statistics agree with.
 * It is null for a binary file, because zero would read as "empty file".
 */
export interface StructureFile {
  readonly path: string;
  readonly lines: number | null;
  readonly binary: boolean;
  readonly deleted: boolean;
  /**
   * The file is in the tree but its content was not read.
   *
   * Distinct from `lines: null` on a binary file, which is a measurement that
   * says "this has no line count". An unindexed file has no measurement at all:
   * the budget ran out before it was read, so its size is unknown rather than
   * zero, and a client must render it as unknown rather than as an empty file.
   */
  readonly unindexed?: true;
}

/**
 * One directory's aggregate over its whole subtree.
 *
 * Every field is the sum of the same field over the files below it, so a
 * directory can always be drilled into and reconciled. `path` is the
 * repository-relative directory path, and the root is the empty string rather
 * than `"."` so a client can join it without special-casing.
 *
 * `changed`, `additions` and `deletions` come from the change list, not from the
 * structure read: they are the same numbers the left panel shows, and a second
 * source for them would eventually disagree.
 */
export interface StructureDir {
  readonly path: string;
  readonly lines: number;
  readonly files: number;
  readonly changed: number;
  readonly additions: number;
  readonly deletions: number;
}

/**
 * What happened to one import edge between the two sides.
 *
 * `kept` is not "unchanged file": it is an edge present on both sides. A file
 * can be modified and still keep every import it had.
 */
export type ImportState = "added" | "removed" | "kept";

/** One import edge, directed from the importing file to the imported one. */
export interface ImportEdge {
  readonly from: string;
  readonly to: string;
  readonly state: ImportState;
}

/**
 * One `@@` header's line ranges, without the lines themselves.
 *
 * The map draws a distribution bar per changed card, which needs to know where
 * in the file the edits landed but not what they said. Reading them from the
 * same `-U0` diff the detail view uses keeps the bar and the hunks in agreement.
 *
 * A count is never zero in git's own output (`@@ -1 +1 @@` means one line), so
 * the parser fills the default; an untracked file has no old side at all and
 * reports `oldStart: 0, oldLines: 0`.
 */
export interface HunkRange {
  readonly oldStart: number;
  readonly oldLines: number;
  readonly newStart: number;
  readonly newLines: number;
}

/**
 * One changed file as the map needs it.
 *
 * The identity set here must equal the snapshot's file list: same paths, same
 * statuses, same counts. `hunks` is empty when there is nothing to place on a
 * bar (a binary file, a mode-only change), which is a different statement from
 * "no changes in this file" and is rendered differently.
 */
export interface ChangedMapEntry {
  readonly path: string;
  readonly status: ChangedFileStatus;
  readonly additions: number | null;
  readonly deletions: number | null;
  readonly binary: boolean;
  readonly hunks: readonly HunkRange[];
}

/**
 * How much of the tree the index actually covers.
 *
 * `complete` is the one field a client must not guess at: an incomplete index
 * means the edge set is a lower bound, and the requirement is explicit that a
 * lower bound is shown as `≥N` rather than as a definite zero. `note` says why
 * it stopped ("time budget 4000ms", "file budget 8000"), because "incomplete"
 * without a reason is not actionable.
 *
 * `files` is how many files the structure pass covered; `parsed` is how many
 * files the import pass actually read. They differ when the import budget ran
 * out first, and that difference is what the client shows as partial coverage.
 */
export interface IndexCompleteness {
  readonly files: number;
  readonly parsed: number;
  readonly complete: boolean;
  readonly note: string | null;
}

/**
 * The whole map's data: structure, change placement and import edges.
 *
 * `snapshotId` is the discard key. The index is slower than the change list, so
 * a result can arrive after the reader has switched scope; the client compares
 * this against the snapshot it is currently showing and drops a mismatch rather
 * than painting stale edges over a fresh map.
 *
 * `unresolved` is a count plus the files it came from, never a silent drop: an
 * import that could not be resolved produces no edge, so without this the map
 * would claim a file has no dependents when the truth is that nobody looked.
 */
export interface ReviewIndex {
  readonly files: readonly StructureFile[];
  readonly dirs: readonly StructureDir[];
  readonly changed: readonly ChangedMapEntry[];
  readonly edges: readonly ImportEdge[];
  readonly imports: { readonly newImports: number; readonly droppedImports: number };
  readonly unresolved: { readonly count: number; readonly files: readonly string[] };
  readonly indexed: IndexCompleteness;
  readonly snapshotId: string;
}

/** `GET` index answer. */
export type ReviewIndexResult =
  | { readonly ok: true; readonly index: ReviewIndex }
  | { readonly ok: false; readonly error: ReviewError };
