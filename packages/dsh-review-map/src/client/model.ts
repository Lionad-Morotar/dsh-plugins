/**
 * The read model: pure projections over one snapshot.
 *
 * Everything the view has to decide is decided here, so the component only
 * places values. The split is not tidiness: the awkward cases (a `+0` that
 * should have been omitted, a binary file that must not claim zero lines, a
 * rename that has to keep its old path reachable) are the ones that get a
 * component wrong, and none of them need a DOM to test.
 *
 * No React and no DOM import: this module is the part a future preview, a test
 * and the tab all share.
 */
import type { ChangedFile, ChangedFileStatus, ReviewSnapshot } from "../shared.ts";

/** The minus sign for a deletion count. U+2212, not a hyphen. */
const MINUS = "\u2212";

/** The plus sign for an addition count. */
const PLUS = "+";

/**
 * What a row's churn column reads.
 *
 * `null` means "do not print this side". A zero side is omitted rather than
 * printed as `+0`, because a file that only grew should read as one number, and
 * a pure rename should read as none.
 */
export interface Churn {
  readonly additions: number | null;
  readonly deletions: number | null;
  /** A label that replaces the numbers entirely, when there are none to show. */
  readonly note: "binary" | "untracked" | "conflicted" | null;
}

/** One path split for a two-part row: a weak directory and a strong name. */
export interface PathParts {
  /** The directory with its trailing slash, or "" for a root-level file. */
  readonly dir: string;
  readonly name: string;
}

/** The two numbers the stats row shows. */
export interface ReviewSummaryView {
  readonly files: number;
  readonly additions: number;
  readonly deletions: number;
}

/**
 * The one-letter mark for a status.
 *
 * `!` for a conflict and `?` for a status this package does not model: both are
 * deliberately not letters, so a reader cannot mistake them for a git code.
 * @param status - the change status.
 * @returns the mark shown in the row's badge.
 */
export function statusMark(status: ChangedFileStatus): "A" | "M" | "D" | "R" | "C" | "T" | "U" | "!" | "?" {
  switch (status) {
    case "added":
      return "A";
    case "modified":
      return "M";
    case "deleted":
      return "D";
    case "renamed":
      return "R";
    case "copied":
      return "C";
    case "type-changed":
      return "T";
    case "untracked":
      return "U";
    case "conflicted":
      return "!";
    default:
      return "?";
  }
}

/**
 * The churn a row shows.
 *
 * A conflict wins over a binary label: a conflicted path may also be binary, and
 * the conflict is the thing the reader has to act on. An untracked file has no
 * counts at all, so it is labelled rather than counted.
 * @param file - one changed file.
 * @returns the numbers to print, and the label that replaces them.
 */
export function churnOf(file: ChangedFile): Churn {
  if (file.status === "conflicted") return { additions: null, deletions: null, note: "conflicted" };
  if (file.untracked) return { additions: null, deletions: null, note: "untracked" };
  if (file.binary) return { additions: null, deletions: null, note: "binary" };
  const additions = file.additions !== null && file.additions > 0 ? file.additions : null;
  const deletions = file.deletions !== null && file.deletions > 0 ? file.deletions : null;
  return { additions, deletions, note: null };
}

/**
 * The text of a churn column.
 *
 * Kept beside `churnOf` so the two signs are spelled once: a caller that
 * formatted its own would be free to reach for a hyphen, and a hyphen does not
 * line up with the plus in a monospace face.
 * @param churn - the projection.
 * @returns the column's text, or "" when there is nothing to say.
 */
export function churnText(churn: Churn): string {
  const parts: string[] = [];
  if (churn.additions !== null) parts.push(`${PLUS}${String(churn.additions)}`);
  if (churn.deletions !== null) parts.push(`${MINUS}${String(churn.deletions)}`);
  return parts.join(" ");
}

/**
 * Split a path into its directory and its file name.
 *
 * The directory keeps its trailing slash so the two halves concatenate back to
 * the original path, which is what lets a row render them as two spans without
 * a separator of its own.
 * @param path - a repository-relative path.
 * @returns the two halves; the directory is "" for a root-level file.
 */
export function splitPath(path: string): PathParts {
  const cut = path.lastIndexOf("/");
  if (cut < 0) return { dir: "", name: path };
  return { dir: path.slice(0, cut + 1), name: path.slice(cut + 1) };
}

/**
 * Order the change list for reading.
 *
 * Largest churn first, because that is what a reviewer triages by, and a path
 * tiebreak so two reads of one tree agree. A file whose counts are unknown (a
 * binary, an untracked file) sorts as zero churn rather than being dropped: it
 * is still a change, it just has nothing to rank on.
 *
 * The input is not mutated: the snapshot is the host's answer, and reordering it
 * in place would make the next render depend on the last one.
 * @param files - the snapshot's file list.
 * @returns a new list, largest change first.
 */
export function sortFiles(files: readonly ChangedFile[]): ChangedFile[] {
  const churn = (file: ChangedFile): number => (file.additions ?? 0) + (file.deletions ?? 0);
  return [...files].sort((left, right) => {
    const difference = churn(right) - churn(left);
    if (difference !== 0) return difference;
    return left.path < right.path ? -1 : left.path > right.path ? 1 : 0;
  });
}

/**
 * The totals the stats row shows.
 *
 * The snapshot's own summary is preferred, because the host computed it over the
 * same file list and rounding it again here would be a second opinion. It is
 * aggregated from the files when the field is missing or its file count is zero,
 * which is what a host that grew the field later would send.
 * @param snapshot - one review snapshot.
 * @returns the file count and the two line totals.
 */
export function summaryOf(snapshot: ReviewSnapshot): ReviewSummaryView {
  const declared = snapshot.summary;
  const files = declared !== undefined && declared.files > 0 ? declared.files : snapshot.files.length;
  if (declared !== undefined && declared.files > 0) {
    return { files, additions: declared.additions, deletions: declared.deletions };
  }
  let additions = 0;
  let deletions = 0;
  for (const file of snapshot.files) {
    additions += file.additions ?? 0;
    deletions += file.deletions ?? 0;
  }
  return { files, additions, deletions };
}

/**
 * The short form of a revision, for a header that has no room for forty hex.
 * @param ref - a full sha, a short sha, or a ref name.
 * @returns the first seven characters.
 */
export function shortRef(ref: string): string {
  return ref.slice(0, 7);
}

/**
 * Fill the named placeholders in one template.
 *
 * A missing value leaves its placeholder in place rather than printing
 * `undefined`: a visible `{base}` is a bug report, and `undefined` in a header is
 * a support ticket.
 * @param template - the sentence, with `{name}` placeholders.
 * @param values - the values to substitute.
 * @returns the filled sentence.
 */
export function fill(template: string, values: Readonly<Record<string, string>>): string {
  return template.replace(/\{(\w+)\}/gu, (whole, key: string) => values[key] ?? whole);
}
