/**
 * Working-tree status for the file tree.
 *
 * The Git panel's host half already runs `git status --porcelain=v2 -z` and
 * exposes the raw bytes on its snapshot; this module folds that text into one
 * status per path and turns each status into a semantic tone and a one-letter
 * badge. Nothing here runs git or touches the DOM, so the tree can be coloured
 * from a plain fixture in unit tests and degrade to "no status" when the Git
 * namespace is absent.
 */

/** The working-tree vocabulary the file tree paints with. */
export type FsChangeStatus = "modified" | "added" | "deleted" | "renamed" | "untracked" | "conflicted";

/** One path's status, shaped as the acceptance probe expects. */
export interface FsChangeMarker {
  readonly status: FsChangeStatus;
}

/** Every changed path, keyed by its workspace-relative path. */
export type StatusMap = Readonly<Record<string, FsChangeMarker>>;

/** Semantic colour families; the CSS owns the actual tokens. */
export type StatusTone = "warning" | "success" | "danger" | "info" | "accent" | "conflict" | "neutral";

const STATUS_TONES: Readonly<Record<FsChangeStatus, StatusTone>> = {
  modified: "warning",
  added: "success",
  deleted: "danger",
  renamed: "accent",
  untracked: "info",
  conflicted: "conflict",
};

const STATUS_BADGES: Readonly<Record<FsChangeStatus, string>> = {
  modified: "M",
  added: "A",
  deleted: "D",
  renamed: "R",
  untracked: "U",
  conflicted: "!",
};

const STATUSES: ReadonlySet<string> = new Set<FsChangeStatus>([
  "modified",
  "added",
  "deleted",
  "renamed",
  "untracked",
  "conflicted",
]);

/** Whether a runtime value is one of the six statuses. */
export function isFsChangeStatus(value: unknown): value is FsChangeStatus {
  return typeof value === "string" && STATUSES.has(value);
}

/**
 * Read `count` space-separated fields and return the unparsed remainder.
 *
 * Paths may contain spaces, so the parser consumes a fixed field count and
 * keeps everything after the last separator as the path. A record that ends
 * before the path is malformed and answers null.
 */
function takeFields(text: string, count: number): { readonly fields: readonly string[]; readonly rest: string } | null {
  const fields: string[] = [];
  let cursor = 0;
  for (let index = 0; index < count; index += 1) {
    const separator = text.indexOf(" ", cursor);
    if (separator < 0) return null;
    fields.push(text.slice(cursor, separator));
    cursor = separator + 1;
  }
  return { fields, rest: text.slice(cursor) };
}

/**
 * Fold the index/worktree columns of a `1` record into one status.
 *
 * Deletion wins over modification because a file that is gone must read as
 * gone even when the other column still holds an M; additions and renames are
 * checked before the neutral modification fallback.
 */
function statusFromXY(x: string, y: string): FsChangeStatus {
  if (x === "D" || y === "D") return "deleted";
  if (x === "A" || y === "A") return "added";
  if (x === "R" || y === "R" || x === "C" || y === "C") return "renamed";
  if (x === "U" || y === "U") return "conflicted";
  return "modified";
}

/**
 * Parse `git status --porcelain=v2 -z` into one status per path.
 *
 * Records are NUL separated. A rename (`2`) carries the new path in its own
 * record and the original path in the following field; the map is keyed by the
 * new path only, because that is the row the tree displays. `u` records are
 * conflicts, `?` untracked and `!` ignored (skipped).
 * @param raw - the raw porcelain v2 text, optionally with `#` headers.
 * @returns every changed path and its status; empty on malformed input.
 */
export function parseStatusZ(raw: string): Record<string, FsChangeMarker> {
  const changes: Record<string, FsChangeMarker> = {};
  if (typeof raw !== "string" || raw === "") return changes;
  const records = raw.split("\0");
  for (let index = 0; index < records.length; index += 1) {
    const record = records[index];
    if (record === undefined || record === "") continue;
    if (record.startsWith("# ")) continue;
    const kind = record[0];
    if (kind === "?") {
      if (record[1] !== " ") continue;
      const path = record.slice(2);
      if (path !== "") changes[path] = { status: "untracked" };
      continue;
    }
    if (kind === "!") continue;
    if (kind === "1" || kind === "2") {
      const fields = takeFields(record.slice(2), kind === "1" ? 7 : 8);
      if (fields === null) continue;
      const xy = fields.fields[0] ?? "";
      const path = fields.rest;
      if (path === "" || xy.length < 2) continue;
      if (kind === "2") {
        const original = records[index + 1];
        if (original === undefined || original === "") continue;
        index += 1;
        changes[path] = { status: "renamed" };
        continue;
      }
      changes[path] = { status: statusFromXY(xy[0] ?? ".", xy[1] ?? ".") };
      continue;
    }
    if (kind === "u") {
      const fields = takeFields(record.slice(2), 9);
      if (fields === null) continue;
      const path = fields.rest;
      if (path === "") continue;
      changes[path] = { status: "conflicted" };
    }
  }
  return changes;
}

/**
 * The semantic colour family for one status.
 * @param status - a parsed status or any runtime value.
 * @returns a tone name; unknown values read neutral.
 */
export function statusTone(status: string): StatusTone {
  if (!isFsChangeStatus(status)) return "neutral";
  return STATUS_TONES[status];
}

/**
 * The one-letter badge painted beside a file name.
 * @param status - a parsed status or any runtime value.
 * @returns M, A, D, R, U, ! or ? for unknown values.
 */
export function statusBadge(status: string): string {
  if (!isFsChangeStatus(status)) return "?";
  return STATUS_BADGES[status];
}

/** The copy key naming one status, shared by badges and tooltips. */
export function statusLabelKey(status: FsChangeStatus): string {
  return `status.${status}`;
}

/**
 * Look up one tree path, tolerating git's trailing slash on untracked
 * directories (`? temp/`) while tree rows key directories without it.
 * @param path - workspace-relative path of the tree row.
 * @param statuses - the parsed map, or undefined when Git is unavailable.
 * @returns the status, or undefined when the path is clean.
 */
export function statusOf(path: string, statuses: StatusMap | undefined): FsChangeStatus | undefined {
  if (statuses === undefined || path === "") return undefined;
  const direct = statuses[path];
  if (direct !== undefined) return direct.status;
  const asDirectory = statuses[`${path.replace(/\/+$/u, "")}/`];
  return asDirectory?.status;
}

/** Aggregate marker for one directory row. */
export interface DirectoryChanges {
  /** Number of changed paths at or below this directory. */
  readonly count: number;
  /** Tone of the most significant status inside, so conflicts stay visible. */
  readonly tone: StatusTone;
}

/** Severity order for a directory's tone; the first present status wins. */
const SEVERITY: readonly FsChangeStatus[] = ["conflicted", "deleted", "renamed", "added", "modified", "untracked"];

/** One directory's running aggregate while the index is built. */
interface DirectoryAccumulator {
  count: number;
  readonly present: Set<FsChangeStatus>;
}

function toneOf(present: ReadonlySet<FsChangeStatus>): StatusTone {
  return statusTone(SEVERITY.find(status => present.has(status)) ?? "modified");
}

/**
 * Index every changed path under each of its ancestor directories.
 *
 * One pass over the status map instead of one scan per rendered row: a
 * directory row asks the resulting map by path, which keeps flattening a
 * 10 000-directory tree linear in the number of changes. A directory entry
 * (`? temp/`) counts for itself and its ancestors, a file only for ancestors.
 * @param statuses - the parsed map, or undefined when Git is unavailable.
 * @returns directory path to count and dominant tone.
 */
export function indexDirectoryChanges(statuses: StatusMap | undefined): ReadonlyMap<string, DirectoryChanges> {
  const accumulators = new Map<string, DirectoryAccumulator>();
  if (statuses !== undefined) {
    for (const [key, marker] of Object.entries(statuses)) {
      const clean = key.replace(/\/+$/u, "");
      if (clean === "") continue;
      const segments = clean.split("/");
      const limit = key.endsWith("/") ? segments.length : segments.length - 1;
      let prefix = "";
      for (let index = 0; index < limit; index += 1) {
        const segment = segments[index];
        if (segment === undefined || segment === "") continue;
        prefix = prefix === "" ? segment : `${prefix}/${segment}`;
        const accumulator = accumulators.get(prefix);
        if (accumulator === undefined) {
          accumulators.set(prefix, { count: 1, present: new Set([marker.status]) });
        } else {
          accumulator.count += 1;
          accumulator.present.add(marker.status);
        }
      }
    }
  }
  const index = new Map<string, DirectoryChanges>();
  for (const [directory, accumulator] of accumulators) {
    index.set(directory, { count: accumulator.count, tone: toneOf(accumulator.present) });
  }
  return index;
}

/**
 * Count every changed path at or below one directory.
 *
 * A path counts once even when it is the directory itself (`? temp/`), and the
 * tone follows the most severe status present rather than the most frequent
 * one: a single conflict inside twenty modifications is what a reviewer must
 * see at a glance.
 * @param path - workspace-relative directory path, without trailing slash.
 * @param statuses - the parsed map, or undefined when Git is unavailable.
 * @returns the count and tone, or undefined for a clean directory.
 */
export function directoryChanges(path: string, statuses: StatusMap | undefined): DirectoryChanges | undefined {
  if (statuses === undefined || path === "") return undefined;
  return indexDirectoryChanges(statuses).get(path.replace(/\/+$/u, ""));
}
