/**
 * Pure view logic: porcelain grouping, commit formatting, jump targets, row
 * windows and the lane layout that feeds the SVG graph.
 *
 * These functions have no React, no DOM and no host imports so the acceptance
 * probe can load the built client bundle in plain Node and drive them with
 * captured command output. Anything that needs a service lives in `view.tsx`.
 */
import type { GitChangeStatus, GitCommit } from "../host/types.ts";

/** One file row after grouping a raw porcelain status. */
export interface ChangeEntry {
  readonly path: string;
  readonly status: GitChangeStatus;
  readonly origPath?: string;
  readonly staged: boolean;
  readonly isDirectory: boolean;
}

/** One directory group in the changes pane. */
export interface ChangeGroup {
  readonly dir: string;
  readonly files: readonly ChangeEntry[];
}

/** The status letters the panel renders. */
const STATUS_LETTER: Record<GitChangeStatus, string> = {
  added: "A",
  modified: "M",
  deleted: "D",
  renamed: "R",
  copied: "C",
  typechange: "T",
  untracked: "U",
  conflicted: "!",
};

/**
 * The one-letter badge for a status.
 * @param status - change status.
 * @returns the letter shown in the badge.
 */
export function statusLetter(status: GitChangeStatus): string {
  return STATUS_LETTER[status];
}

/** Higher wins when the same path appears twice in a porcelain listing. */
const STATUS_RANK: Record<GitChangeStatus, number> = {
  modified: 1,
  typechange: 2,
  deleted: 3,
  added: 4,
  copied: 5,
  renamed: 6,
  untracked: 7,
  conflicted: 8,
};

/** Pick the status that carries the most information for a duplicated path. */
function strongerStatus(left: GitChangeStatus, right: GitChangeStatus): GitChangeStatus {
  return (STATUS_RANK[left] ?? 0) >= (STATUS_RANK[right] ?? 0) ? left : right;
}

/** Map one porcelain XY pair to the panel vocabulary. */
function statusFromXY(xy: string): GitChangeStatus {
  if (xy === "??") return "untracked";
  const index = xy[0] ?? ".";
  const worktree = xy[1] ?? ".";
  if (index === "U" || worktree === "U") return "conflicted";
  if (index === "R" || worktree === "R") return "renamed";
  if (index === "C" || worktree === "C") return "copied";
  if (index === "A" || worktree === "A") return "added";
  if (index === "D" || worktree === "D") return "deleted";
  if (index === "T" || worktree === "T") return "typechange";
  return "modified";
}

/** Read the first `count` space-separated fields, keeping the rest verbatim. */
function takePath(rest: string, fixedFields: number): string {
  let cursor = 0;
  for (let index = 0; index < fixedFields; index += 1) {
    const separator = rest.indexOf(" ", cursor);
    if (separator < 0) return "";
    cursor = separator + 1;
  }
  return rest.slice(cursor);
}

/**
 * Parse `git status --porcelain=v2 -z` into flat change entries.
 *
 * Record shapes handled: `1` (ordinary), `2` (rename/copy, original path in the
 * following NUL field), `u` (unmerged) and `?` (untracked). Branch headers are
 * skipped. A path that appears twice (staged and worktree side) is merged so
 * one file is one row.
 * @param text - raw porcelain v2 output, NUL separated.
 * @returns one entry per path, in input order.
 */
export function parsePorcelain(text: string): ChangeEntry[] {
  const parts = text.split("\0");
  const byPath = new Map<string, ChangeEntry>();
  const add = (entry: ChangeEntry): void => {
    const previous = byPath.get(entry.path);
    if (previous === undefined) {
      byPath.set(entry.path, entry);
      return;
    }
    byPath.set(entry.path, {
      ...previous,
      status: strongerStatus(previous.status, entry.status),
      staged: previous.staged || entry.staged,
      isDirectory: previous.isDirectory || entry.isDirectory,
      ...(previous.origPath === undefined && entry.origPath === undefined ? {} : { origPath: previous.origPath ?? entry.origPath }),
    });
  };

  for (let index = 0; index < parts.length; index += 1) {
    const record = parts[index];
    if (record === undefined || record === "" || record.startsWith("#")) continue;
    const kind = record[0];
    if (kind === "1") {
      const rest = record.slice(2);
      const xy = rest.slice(0, 2);
      const path = takePath(rest, 7);
      if (path !== "") add({ path, status: statusFromXY(xy), staged: xy[0] !== ".", isDirectory: false });
    } else if (kind === "2") {
      const rest = record.slice(2);
      const xy = rest.slice(0, 2);
      const path = takePath(rest, 8);
      const origPath = parts[index + 1] ?? "";
      if (path !== "" && origPath !== "") {
        index += 1;
        add({ path, status: statusFromXY(xy), staged: xy[0] !== ".", isDirectory: false, origPath });
      }
    } else if (kind === "u") {
      const rest = record.slice(2);
      const path = takePath(rest, 9);
      if (path !== "") add({ path, status: "conflicted", staged: false, isDirectory: false });
    } else if (kind === "?") {
      const raw = record.slice(2);
      if (raw === "") continue;
      const isDirectory = raw.endsWith("/");
      add({
        path: isDirectory ? raw.slice(0, -1) : raw,
        status: "untracked",
        staged: false,
        isDirectory,
      });
    }
  }
  return [...byPath.values()];
}

/** Directory part of a repository-relative path; empty for a root file. */
export function directoryOf(path: string): string {
  const separator = path.lastIndexOf("/");
  return separator < 0 ? "" : path.slice(0, separator);
}

/**
 * Group path-bearing entries by directory.
 * @param entries - flat entries; each keeps its own extra fields.
 * @returns groups sorted root-first, files sorted by path.
 */
export function groupByDirectory<T extends { readonly path: string }>(entries: readonly T[]): { readonly dir: string; readonly files: readonly T[] }[] {
  const groups = new Map<string, T[]>();
  for (const entry of entries) {
    const dir = directoryOf(entry.path);
    const bucket = groups.get(dir);
    if (bucket === undefined) groups.set(dir, [entry]);
    else bucket.push(entry);
  }
  return [...groups.entries()]
    .sort(([left], [right]) => (left === "" ? -1 : right === "" ? 1 : left.localeCompare(right)))
    .map(([dir, files]) => ({ dir, files: [...files].sort((left, right) => left.path.localeCompare(right.path)) }));
}

/**
 * Group raw `git status --porcelain=v2 -z` output for the changes pane.
 *
 * This is the function the acceptance probe drives against the real
 * repository; it must never delegate parsing to the host half.
 * @param text - raw porcelain v2 output.
 * @returns directory groups with one row per path.
 */
export function groupChanges(text: string): ChangeGroup[] {
  return groupByDirectory(parsePorcelain(text));
}

/** The subset of a commit the detail header formats. */
export interface CommitLike {
  readonly hash: string;
  readonly parents: readonly string[];
  readonly author: string;
  readonly time: number;
  readonly subject: string;
}

/** Formatted commit header fields. */
export interface FormattedCommit {
  readonly shortHash: string;
  readonly author: string;
  readonly subject: string;
  /** Compact, locale-neutral age such as `now`, `5m`, `3h`, `2d`, `4w`. */
  readonly relative: string;
}

/**
 * Compact relative age for a Unix-seconds timestamp.
 * @param time - commit time in seconds.
 * @param now - current time in milliseconds, injectable for tests.
 * @returns the compact age string.
 */
export function relativeTime(time: number, now = Date.now()): string {
  const seconds = Math.max(0, Math.floor(now / 1000) - Math.trunc(time));
  if (seconds < 60) return "now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d`;
  const weeks = Math.floor(days / 7);
  if (weeks < 5) return `${weeks}w`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo`;
  return `${Math.floor(days / 365)}y`;
}

/**
 * Format the commit detail header.
 * @param commit - the commit fields carried by the wire.
 * @param now - current time in milliseconds, injectable for tests.
 * @returns short hash, author, subject and compact age.
 */
export function formatCommitDetail(commit: CommitLike, now = Date.now()): FormattedCommit {
  return {
    shortHash: commit.hash.slice(0, 7),
    author: commit.author,
    subject: commit.subject,
    relative: relativeTime(commit.time, now),
  };
}

/** The `views.open` face the jump needs. */
export interface JumpViews {
  open(sessionId: string, id: string, focus?: string): unknown;
}

/** What one jump closure owns. */
export interface JumpWiring {
  readonly views: JumpViews;
  readonly sessionId: string;
}

/**
 * Build the changes-to-files jump.
 *
 * The fs explorer addresses a file as `path:<relative path>:<line>`; line is
 * clamped to one so a directory row or a caller without a line still lands on
 * the file header.
 * @param wiring - the core view seam and the session whose views open.
 * @returns a `(path, line)` function.
 */
export function createJump({ views, sessionId }: JumpWiring): (path: string, line?: number) => void {
  return (path, line = 1) => {
    if (path === "") return;
    const clean = path.replace(/^\.\//u, "").replace(/\\/gu, "/");
    const target = Number.isFinite(line) && line > 0 ? Math.floor(line) : 1;
    views.open(sessionId, "fs-explorer", `path:${clean}:${target}`);
  };
}

/** Viewport inputs for {@link computeWindow}. */
export interface WindowOptions {
  readonly scrollTop: number;
  readonly height: number;
  readonly rowHeight: number;
  readonly overscan?: number;
}

/** The mounted slice of a virtual list. */
export interface WindowResult<Row> {
  readonly rows: readonly Row[];
  readonly startIndex: number;
  readonly endIndex: number;
}

/**
 * Slice a virtual list to the rows a viewport can show.
 *
 * The overscan above and below keeps a fast scroll from exposing a blank band;
 * the start is clamped so the last page still fills the viewport from the
 * bottom instead of leaving an empty tail.
 * @param rows - every row of the list.
 * @param options - scroll offset, viewport height and row height.
 * @returns the rows to mount plus their absolute start index.
 */
export function computeWindow<Row>(rows: readonly Row[], options: WindowOptions): WindowResult<Row> {
  const rowHeight = Math.max(1, options.rowHeight || 1);
  const height = Math.max(0, options.height || 0);
  const overscan = Math.max(0, Math.trunc(options.overscan ?? 6));
  const visible = Math.max(1, Math.ceil(height / rowHeight));
  const maxStart = Math.max(0, rows.length - visible - overscan * 2);
  const rawStart = Math.floor(Math.max(0, options.scrollTop) / rowHeight) - overscan;
  const startIndex = Math.min(Math.max(rawStart, 0), maxStart);
  const endIndex = Math.min(rows.length, startIndex + visible + overscan * 2);
  return { rows: rows.slice(startIndex, endIndex), startIndex, endIndex };
}

/** One SVG segment inside a graph row. */
export interface GraphSegment {
  /** `into` ends at the node, `out` starts at it, `pass` crosses the row. */
  readonly kind: "into" | "out" | "pass";
  readonly from: number;
  readonly to: number;
  readonly color: number;
}

/** One laid-out history row. */
export interface GraphRow {
  readonly lane: number;
  readonly color: number;
  readonly merge: boolean;
  readonly segments: readonly GraphSegment[];
}

/** The minimal commit shape the lane layout reads. */
export interface GraphCommitLike {
  readonly hash: string;
  readonly parents: readonly string[];
}

/**
 * Lay out lanes and per-row segments for a newest-first history page.
 *
 * One pass, like the host's lane assignment: a lane always waits for one commit
 * hash, so a linear run keeps one column and a merge opens one lane per extra
 * parent. The difference is that this version emits the segments each row has
 * to draw (incoming, passing and outgoing), which is what makes a continuous
 * SVG possible without a second pass over the list.
 * @param commits - newest-first commits with parent links.
 * @returns one graph row per commit.
 */
export function layoutGraph(commits: readonly GraphCommitLike[]): GraphRow[] {
  let lanes: (string | null)[] = [];
  let laneColors: (number | null)[] = [];
  const freeColors: number[] = [];
  let nextColor = 0;
  const rows: GraphRow[] = [];

  const takeColor = (): number => {
    if (freeColors.length === 0) return nextColor++;
    freeColors.sort((left, right) => left - right);
    const color = freeColors.shift();
    return color ?? nextColor++;
  };
  const releaseColor = (color: number | null): void => {
    if (color !== null && !freeColors.includes(color)) freeColors.push(color);
  };
  const openLane = (): number => {
    const free = lanes.indexOf(null);
    if (free >= 0) return free;
    lanes.push(null);
    laneColors.push(null);
    return lanes.length - 1;
  };

  for (const commit of commits) {
    const beforeLanes = [...lanes];
    const beforeColors = [...laneColors];
    let nodeLane = beforeLanes.indexOf(commit.hash);
    const awaited = nodeLane >= 0;
    if (!awaited) nodeLane = openLane();
    let nodeColor = awaited ? laneColors[nodeLane] ?? null : null;
    if (nodeColor === null) {
      nodeColor = takeColor();
      laneColors[nodeLane] = nodeColor;
    }

    for (let index = 0; index < beforeLanes.length; index += 1) {
      if (index !== nodeLane && beforeLanes[index] === commit.hash) {
        releaseColor(laneColors[index] ?? null);
        lanes[index] = null;
        laneColors[index] = null;
      }
    }

    const firstParent = commit.parents[0];
    if (firstParent === undefined) {
      releaseColor(laneColors[nodeLane] ?? null);
      lanes[nodeLane] = null;
      laneColors[nodeLane] = null;
    } else {
      lanes[nodeLane] = firstParent;
      laneColors[nodeLane] = nodeColor;
    }

    const extraLanes: number[] = [];
    for (let parentIndex = 1; parentIndex < commit.parents.length; parentIndex += 1) {
      const parent = commit.parents[parentIndex];
      if (parent === undefined) continue;
      let lane = lanes.indexOf(parent);
      if (lane < 0) {
        lane = openLane();
        lanes[lane] = parent;
      }
      if (laneColors[lane] === null) laneColors[lane] = takeColor();
      extraLanes.push(lane);
    }

    const segments: GraphSegment[] = [];
    for (let index = 0; index < beforeLanes.length; index += 1) {
      const awaiting = beforeLanes[index];
      if (awaiting === null) continue;
      const color = beforeColors[index] ?? nodeColor;
      if (awaiting === commit.hash) {
        segments.push({ kind: "into", from: index, to: nodeLane, color });
      } else {
        segments.push({ kind: "pass", from: index, to: index, color });
      }
    }
    if (firstParent !== undefined) {
      segments.push({ kind: "out", from: nodeLane, to: nodeLane, color: laneColors[nodeLane] ?? nodeColor });
    }
    for (const lane of extraLanes) {
      segments.push({ kind: "out", from: nodeLane, to: lane, color: laneColors[lane] ?? nodeColor });
    }

    rows.push({ lane: nodeLane, color: nodeColor, merge: commit.parents.length >= 2, segments });
    while (lanes.length > 0 && lanes[lanes.length - 1] === null) {
      lanes.pop();
      laneColors.pop();
    }
  }
  return rows;
}

/**
 * The widest lane index any row or segment touches.
 * @param rows - laid-out rows.
 * @returns lane count, at least one.
 */
export function graphLaneCount(rows: readonly GraphRow[]): number {
  let max = 0;
  for (const row of rows) {
    max = Math.max(max, row.lane, row.segments.reduce((value, segment) => Math.max(value, segment.from, segment.to), 0));
  }
  return max + 1;
}

/** Things the history list needs from a commit, for tests and rendering. */
export type CommitRow = GraphCommitLike & Pick<GitCommit, "author" | "time" | "subject">;

/** Final path segment, for a row that already sits under its directory head. */
export function basename(path: string): string {
  const separator = path.lastIndexOf("/");
  return separator < 0 ? path : path.slice(separator + 1);
}
