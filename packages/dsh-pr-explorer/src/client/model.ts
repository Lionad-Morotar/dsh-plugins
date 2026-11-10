/**
 * The read model: pure projections over one comparison.
 *
 * Everything the view has to decide is decided here, so the component only
 * places values. The split is not tidiness: the awkward cases (a `+0` that should
 * have been omitted, a binary file that must not claim zero lines, a default pair
 * that would compare a branch to itself) are the ones that get a component
 * wrong, and none of them need a DOM to test.
 *
 * No React and no DOM import: this module is the part a future preview, a test
 * and the tab all share.
 */
import type {
  CommitEntry,
  CompareSnapshot,
  PrChangedFile,
  PrDiffHunk,
  PrFileDiff,
  PrFileStatus,
  RefEntry,
  RefKind,
  RefListing,
} from "../shared.ts";

/** The minus sign for a deletion count. U+2212, not a hyphen. */
const MINUS = "\u2212";

/** The plus sign for an addition count. */
const PLUS = "+";

/** The order refs are listed in: branches, then remotes, then tags. */
const KIND_ORDER: Readonly<Record<RefKind, number>> = { branch: 0, remote: 1, tag: 2 };

/** One option in a ref picker. */
export interface RefOption {
  readonly name: string;
  readonly kind: RefKind;
  readonly isDefault: boolean;
}

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
  readonly note: "binary" | "unknown" | null;
}

/** One path split for a two-part row: a weak directory and a strong name. */
export interface PathParts {
  /** The directory with its trailing slash, or "" for a root-level file. */
  readonly dir: string;
  readonly name: string;
}

/** The numbers the summary band shows. */
export interface SummaryReading {
  readonly ahead: number;
  readonly behind: number;
  readonly files: number;
  readonly additions: number;
  readonly deletions: number;
  readonly commits: number;
  readonly truncatedCommitList: boolean;
}

/** One row of the detail panel. */
export type DiffRow =
  | { readonly kind: "hunk"; readonly header: string }
  | {
      readonly kind: "line";
      readonly key: string;
      readonly lineKind: "add" | "del" | "context";
      readonly oldLine: number | null;
      readonly newLine: number | null;
      /** The gutter character: `+`, `\u2212` or a space for context. */
      readonly sign: string;
      readonly text: string;
    };

/**
 * The ref picker's options.
 *
 * Grouped by kind and sorted by name inside each group, because a picker that
 * mixed tags into the branch list would make a reader scroll past every release
 * to find the branch they want.
 *
 * A current value that the listing does not contain is kept: `HEAD` is the
 * common case, since a detached checkout has no branch to list but the selector
 * still has to show what is selected.
 * @param listing - the host's ref listing.
 * @param options - the values currently selected, to preserve.
 * @returns the options, in display order.
 */
export function refOptions(listing: RefListing, options: { readonly current?: readonly string[] } = {}): RefOption[] {
  const entries: RefOption[] = listing.refs.map(ref => ({ name: ref.name, kind: ref.kind, isDefault: ref.isDefault }));
  const known = new Set(entries.map(entry => entry.name));
  for (const name of options.current ?? []) {
    if (name === "" || known.has(name)) continue;
    known.add(name);
    // A value the listing does not name has no kind of its own; it is grouped
    // with branches so it appears near the top rather than after every tag.
    entries.push({ name, kind: "branch", isDefault: false });
  }
  return entries.sort((left, right) => {
    const byKind = KIND_ORDER[left.kind] - KIND_ORDER[right.kind];
    if (byKind !== 0) return byKind;
    return left.name < right.name ? -1 : left.name > right.name ? 1 : 0;
  });
}

/**
 * The pair a fresh panel starts on.
 *
 * The base is the repository's own statement about where work lands, then the
 * first local branch, then `HEAD`. The head is the branch being read, or `HEAD`
 * on a detached checkout.
 *
 * A pair that would compare a ref to itself is not a range: it reads as "no
 * changes" rather than "you picked the same thing twice", so the head moves to
 * `HEAD` instead.
 * @param listing - the host's ref listing.
 * @returns the two refs to compare.
 */
export function defaultPair(listing: RefListing): { readonly base: string; readonly head: string } {
  const firstBranch = listing.refs.find(ref => ref.kind === "branch")?.name;
  const base = listing.defaultBase ?? firstBranch ?? "HEAD";
  const head = listing.head.kind === "branch" ? listing.head.ref : "HEAD";
  return base === head ? { base, head: "HEAD" } : { base, head };
}

/**
 * Keep the commit list in the order the host sent it.
 *
 * The host reads `git log`, which is already newest first. Re-sorting here would
 * be a second opinion about history, and it would be wrong.
 * @param commits - the host's commit list.
 * @returns a copy, in the same order.
 */
export function sortCommits(commits: readonly CommitEntry[]): CommitEntry[] {
  return [...commits];
}

/**
 * The one-letter mark for a status.
 *
 * `?` for a status this package does not model: it is deliberately not a letter,
 * so a reader cannot mistake it for a git code.
 * @param status - the change status.
 * @returns the mark shown in the row's badge.
 */
export function statusMark(status: PrFileStatus): "A" | "M" | "D" | "R" | "C" | "T" | "?" {
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
    default:
      return "?";
  }
}

/**
 * The churn a row shows.
 *
 * A binary file has no counts at all, so it is labelled rather than counted. A
 * status this build does not model is labelled too: printing `+0` for it would
 * claim the file is empty.
 * @param file - one changed file.
 * @returns the numbers to print, and the label that replaces them.
 */
export function churnOf(file: PrChangedFile): Churn {
  if (file.binary) return { additions: null, deletions: null, note: "binary" };
  if (file.status === "unknown") return { additions: null, deletions: null, note: "unknown" };
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
 * Order the file list for reading.
 *
 * Largest churn first, because that is what a reviewer triages by, and a path
 * tiebreak so two reads of one tree agree. A file whose counts are unknown (a
 * binary) sorts as zero churn rather than being dropped: it is still a change,
 * it just has nothing to rank on.
 *
 * The input is not mutated: the comparison is the host's answer, and reordering
 * it in place would make the next render depend on the last one.
 * @param files - the comparison's file list.
 * @returns a new list, largest change first.
 */
export function sortFiles(files: readonly PrChangedFile[]): PrChangedFile[] {
  const churn = (file: PrChangedFile): number => (file.additions ?? 0) + (file.deletions ?? 0);
  return [...files].sort((left, right) => {
    const difference = churn(right) - churn(left);
    if (difference !== 0) return difference;
    return left.path < right.path ? -1 : left.path > right.path ? 1 : 0;
  });
}

/**
 * The three-dot range as a reader spells it.
 * @param base - the base ref.
 * @param head - the head ref.
 * @returns the label.
 */
export function rangeLabel(base: string, head: string): string {
  return `${base}...${head}`;
}

/**
 * The numbers the summary band shows.
 *
 * The file totals come from the host's own summary, because it computed them
 * over the same file list and rounding them again here would be a second
 * opinion. The commit count is the length of the list, which is the only place
 * it exists.
 * @param snapshot - one comparison.
 * @returns the readings.
 */
export function summaryReading(snapshot: CompareSnapshot): SummaryReading {
  return {
    ahead: snapshot.reading.ahead,
    behind: snapshot.reading.behind,
    files: snapshot.files.summary.files,
    additions: snapshot.files.summary.additions,
    deletions: snapshot.files.summary.deletions,
    commits: snapshot.commits.commits.length,
    truncatedCommitList: snapshot.commits.truncated,
  };
}

/**
 * The `@@` header of one hunk, spelled the way git spells it.
 * @param hunk - one hunk.
 * @returns the header line, with the function heading when the hunk has one.
 */
export function hunkHeader(hunk: PrDiffHunk): string {
  const range = `@@ -${String(hunk.oldStart)},${String(hunk.oldLines)} +${String(hunk.newStart)},${String(hunk.newLines)} @@`;
  return hunk.heading === undefined || hunk.heading === "" ? range : `${range} ${hunk.heading}`;
}

/**
 * The sign a line shows in the gutter.
 * @param kind - the line's kind.
 * @returns the character, with a space for a context line so the text does not
 *   shift left against the changed lines.
 */
function signOf(kind: "add" | "del" | "context"): string {
  if (kind === "add") return "+";
  if (kind === "del") return MINUS;
  return " ";
}

/**
 * One line row.
 *
 * The key is the pair of line numbers rather than an index: a diff can repeat a
 * line's text, and an index would make React reuse a row across a hunk boundary
 * when the list changes.
 * @param lineKind - add, del or context.
 * @param oldLine - the old side's number, or null.
 * @param newLine - the new side's number, or null.
 * @param text - the line's text.
 * @returns the row.
 */
function lineRow(
  lineKind: "add" | "del" | "context",
  oldLine: number | null,
  newLine: number | null,
  text: string,
): Extract<DiffRow, { kind: "line" }> {
  return {
    kind: "line",
    key: `${String(oldLine ?? "x")}:${String(newLine ?? "x")}`,
    lineKind,
    oldLine,
    newLine,
    sign: signOf(lineKind),
    text,
  };
}

/**
 * Flatten one file's detail into the rows the panel renders.
 *
 * The line numbers are taken from the wire, never recounted: git already
 * computed them, and a second count drifts at the first gap between hunks. That
 * is also why a deleted file gets its numbers here rather than in the component:
 * that shape carries no numbers at all, so this is the only place that knows a
 * whole file is numbered from one.
 *
 * A binary file produces no rows: the panel shows a size instead, and an empty
 * table with a header would read as a broken render.
 * @param diff - one file's detail.
 * @returns the rows, in reading order.
 */
export function diffLines(diff: PrFileDiff): DiffRow[] {
  if (diff.kind === "binary") return [];
  if (diff.kind === "deleted") {
    return diff.lines.map((text, index) => lineRow("del", index + 1, null, text));
  }
  const rows: DiffRow[] = [];
  for (const hunk of diff.hunks) {
    rows.push({ kind: "hunk", header: hunkHeader(hunk) });
    for (const line of hunk.lines) {
      rows.push(lineRow(line.kind, line.oldLine, line.newLine, line.text));
    }
  }
  return rows;
}

/**
 * The file a detail panel is about.
 * @param diff - one file's detail.
 * @returns its repository-relative path.
 */
export function diffTitle(diff: PrFileDiff): string {
  return diff.path;
}

/**
 * A byte count as a reader would say it.
 *
 * Binary sizes span four orders of magnitude, and a raw byte count is unreadable
 * at the top of that range: a 2MB icon and a 2048-byte one should not look
 * alike. One decimal is enough to tell them apart without implying precision
 * nobody has.
 * @param bytes - the size in bytes.
 * @returns the formatted size.
 */
export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${String(bytes)} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Fill the named placeholders in one template.
 *
 * A missing value leaves its placeholder in place rather than printing
 * `undefined`: a visible `{count}` is a bug report, and `undefined` in a header
 * is a support ticket.
 * @param template - the sentence, with `{name}` placeholders.
 * @param values - the values to substitute.
 * @returns the filled sentence.
 */
export function fill(template: string, values: Readonly<Record<string, string>>): string {
  return template.replace(/\{(\w+)\}/gu, (whole, key: string) => values[key] ?? whole);
}
