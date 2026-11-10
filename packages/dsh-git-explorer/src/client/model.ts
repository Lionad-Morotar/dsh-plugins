/**
 * Pure view logic: porcelain grouping, commit formatting, jump targets, row
 * windows and the lane layout that feeds the SVG graph.
 *
 * These functions have no React, no DOM and no host imports so the acceptance
 * probe can load the built client bundle in plain Node and drive them with
 * captured command output. Anything that needs a service lives in `view.tsx`.
 */
import { revealSpan } from "./cursor.ts";
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

/** A parsed `commit:<hash>` focus target. */
export interface CommitFocus {
  readonly hash: string;
}

/** The `viewFocus` queue slice a commit jump hands its target to. */
export interface CommitJumpViewFocus {
  request?(view: string, focus: string): void;
  take?(view: string): string | undefined;
}

/** Every seam a commit-file jump may deliver through, newest first. */
export interface CommitJumpSeam {
  openViewOrSwitch?(id: string, focus?: string): { readonly opened: boolean; readonly focused: boolean };
  views?: JumpViews;
  openView?(id: string, focus?: string): boolean | void;
  viewFocus?: CommitJumpViewFocus;
}

/** What one commit-file jump closure owns. */
export interface CommitJumpWiring {
  readonly seam: CommitJumpSeam;
  readonly sessionId: string;
}

/**
 * Build the commit-detail-to-files jump.
 *
 * The target names a commit version, not a workspace path: `git:<hash>:<line>:<path>`
 * keeps the line segment before the path so a path may itself contain colons.
 * The queue-then-switch order is the one the command palette already uses: the
 * focus waits in `viewFocus` before the switch so a view that mounts on the
 * switch can take it, and a delivered focus drops its queued copy so it cannot
 * replay on a later mount.
 * @param wiring - the workbench seams and the session whose views open.
 * @returns a `(hash, path, line)` function.
 */
export function createCommitJump({ seam, sessionId }: CommitJumpWiring): (hash: string, path: string, line?: number) => void {
  return (hash, path, line = 1) => {
    const cleanHash = typeof hash === "string" ? hash.trim().toLowerCase() : "";
    if (cleanHash === "" || typeof path !== "string") return;
    const cleanPath = path.trim().replace(/\\/gu, "/").replace(/^(?:\.\/)+/u, "");
    if (cleanPath === "") return;
    const target = Number.isFinite(line) && line > 0 ? Math.floor(line) : 1;
    const focus = `git:${cleanHash}:${String(target)}:${cleanPath}`;

    if (seam.openViewOrSwitch !== undefined) {
      seam.viewFocus?.request?.("fs-explorer", focus);
      const result = seam.openViewOrSwitch("fs-explorer", focus);
      if (result.focused) {
        seam.viewFocus?.take?.("fs-explorer");
        return;
      }
      if (result.opened) return;
      seam.viewFocus?.take?.("fs-explorer");
    }
    if (seam.views?.open(sessionId, "fs-explorer", focus) === true) return;
    if (seam.openView?.("fs-explorer", focus) === true) return;
    seam.viewFocus?.request?.("fs-explorer", focus);
  };
}

/**
 * Every seam a review-compare jump may deliver through, newest first.
 *
 * Same shape as {@link CommitJumpSeam}: the target view differs, the delivery
 * rules do not. Kept as its own type so a reader can see the two jumps are
 * independent features rather than one parameterised function.
 */
export interface ReviewCompareSeam {
  openViewOrSwitch?(id: string, focus?: string): { readonly opened: boolean; readonly focused: boolean };
  views?: JumpViews;
  openView?(id: string, focus?: string): boolean | void;
  viewFocus?: CommitJumpViewFocus;
}

/** What one review-compare jump closure owns. */
export interface ReviewCompareWiring {
  readonly seam: ReviewCompareSeam;
  readonly sessionId: string;
}

/**
 * Build the commit-detail-to-PR-view jump.
 *
 * The PR view reads `compare:<base>:<head>`: this commit is the base and `HEAD`
 * is the head, which is the range a pull request would show. The queue-then-
 * switch order is the one the command palette and the commit-file jump already
 * use: the focus waits in `viewFocus` before the switch so a view that mounts on
 * the switch can take it, and a delivered focus drops its queued copy so it
 * cannot replay on a later mount.
 * @param wiring - the workbench seams and the session whose views open.
 * @returns a `(hash)` function.
 */
export function createReviewCompareJump({ seam, sessionId }: ReviewCompareWiring): (hash: string) => void {
  return hash => {
    const cleanHash = typeof hash === "string" ? hash.trim().toLowerCase() : "";
    if (cleanHash === "") return;
    const focus = `compare:${cleanHash}:HEAD`;

    if (seam.openViewOrSwitch !== undefined) {
      seam.viewFocus?.request?.("pr-explorer", focus);
      const result = seam.openViewOrSwitch("pr-explorer", focus);
      if (result.focused) {
        seam.viewFocus?.take?.("pr-explorer");
        return;
      }
      if (result.opened) return;
      seam.viewFocus?.take?.("pr-explorer");
    }
    if (seam.views?.open(sessionId, "pr-explorer", focus) === true) return;
    if (seam.openView?.("pr-explorer", focus) === true) return;
    seam.viewFocus?.request?.("pr-explorer", focus);
  };
}

/** `commit:` followed by one 4-64 digit hex id, either case. */
const COMMIT_FOCUS_PATTERN = /^commit:([0-9a-f]{4,64})$/iu;

/**
 * Parse a `commit:<hash>` focus string.
 *
 * The command panel addresses a commit by a hex prefix, as short as git
 * accepts and never longer than a full object id; the hash is normalized to
 * lowercase because that is what the commit endpoint and the loaded list
 * compare against. Any other payload belongs to another focus scheme.
 * @param focus - the focus handed over with a view request.
 * @returns the normalized hash, or undefined when this is not a commit focus.
 */
export function parseCommitFocus(focus: string | undefined): CommitFocus | undefined {
  if (focus === undefined) return undefined;
  const match = COMMIT_FOCUS_PATTERN.exec(focus);
  return match === null ? undefined : { hash: (match[1] ?? "").toLowerCase() };
}

/**
 * History row height at the design font size.
 *
 * One baseline feeds three consumers that must agree: the CSS variable
 * `--gx-row-h` in the stylesheet (scaled from the host's text size at this
 * ratio), {@link computeWindow}'s row arithmetic and {@link revealScrollTop}'s
 * inverse. The pane scales it with `useRowHeight`; a cursor followed by a
 * different row height drifts by the difference on every row, so the value lives
 * here rather than in the component that happens to render it.
 */
export const HISTORY_ROW_HEIGHT = 24;

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

/** Inputs for {@link revealRowIndex}. */
export interface RevealRowOptions {
  readonly scrollTop: number;
  readonly viewport: number;
  readonly rowHeight: number;
  readonly index: number;
  /** Rows in the list; the index is clamped so a stale cursor cannot overscroll. */
  readonly rowCount: number;
}

/**
 * The scroll offset that brings one row of a uniform list into view.
 *
 * {@link computeWindow} answers "which rows does this offset mount"; the keyboard
 * cursor asks the opposite question, "what offset mounts this row", and the two
 * must derive from the same row height or the reveal lands on a neighbour. The
 * index is clamped to the list because a cursor can outlive a filtered or
 * truncated list by one render.
 * @param options - current offset, viewport height, row height, index and count.
 * @returns the offset to apply; the current one when the row already fits.
 */
export function revealRowIndex(options: RevealRowOptions): number {
  const rowHeight = Math.max(1, options.rowHeight || 1);
  const last = Math.max(0, Math.trunc(options.rowCount) - 1);
  const index = Math.min(Math.max(0, Math.trunc(options.index)), last);
  return revealSpan({
    scrollTop: options.scrollTop,
    viewport: options.viewport,
    top: index * rowHeight,
    height: rowHeight,
  });
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

/** The viewport rectangle of the file row a hover card points at. */
export interface PreviewAnchor {
  readonly left: number;
  readonly top: number;
  readonly right: number;
  readonly bottom: number;
}

/** A measured box on screen. */
export interface PreviewSize {
  readonly width: number;
  readonly height: number;
}

/** A top-left offset inside the viewport. */
export interface PreviewPoint {
  readonly left: number;
  readonly top: number;
}

/**
 * Key a first-page cache entry. The hash is case-insensitive because Git is;
 * the path is kept verbatim so two files differing only in case never collide.
 * @param hash - commit object id as the detail pane knows it.
 * @param path - repository-relative path.
 * @returns an opaque cache key.
 */
export function previewCacheKey(hash: string, path: string): string {
  return `${hash.trim().toLowerCase()}\u0000${path}`;
}

/** A fixed-capacity least-recently-used cache. */
export interface PreviewCache<T> {
  get(key: string): T | undefined;
  set(key: string, value: T): void;
  readonly size: number;
}

/**
 * Build a small LRU for the hover card's first pages.
 *
 * A `Map` already iterates in insertion order, so a read that re-inserts the
 * entry and an insert that drops the first key are all the bookkeeping a
 * 24-entry cache needs; the cap keeps a long review session bounded.
 * @param capacity - maximum live entries; values below one are raised to one.
 * @returns the cache.
 */
export function createPreviewCache<T>(capacity: number): PreviewCache<T> {
  const limit = Math.max(1, Math.trunc(capacity));
  const entries = new Map<string, T>();
  return {
    get(key) {
      const value = entries.get(key);
      if (value === undefined) return undefined;
      entries.delete(key);
      entries.set(key, value);
      return value;
    },
    set(key, value) {
      entries.delete(key);
      entries.set(key, value);
      if (entries.size > limit) {
        const oldest = entries.keys().next();
        if (!oldest.done) entries.delete(oldest.value);
      }
    },
    get size() {
      return entries.size;
    },
  };
}

/**
 * Place the hover card beside a file row without letting it leave the viewport.
 *
 * The card prefers the right of the row; if the right edge would clip it, it
 * flips to the left, and when neither side has full room it is pulled inward
 * from the nearest margin. Vertically it opens below the row so the row itself
 * stays visible, and flips above when the bottom edge is too close.
 * @param anchor - the row's viewport rectangle.
 * @param card - the card's measured size.
 * @param viewport - the window's inner size.
 * @param gap - space between row and card.
 * @param margin - minimum distance from every viewport edge.
 * @returns the card's fixed-position offset.
 */
export function placePreviewCard(
  anchor: PreviewAnchor,
  card: PreviewSize,
  viewport: PreviewSize,
  gap = 10,
  margin = 8,
): PreviewPoint {
  const maxLeft = Math.max(margin, viewport.width - card.width - margin);
  let left = anchor.right + gap;
  if (left > maxLeft) {
    left = anchor.left - card.width - gap;
    if (left < margin) left = Math.min(maxLeft, Math.max(margin, anchor.left));
  }
  const maxTop = Math.max(margin, viewport.height - card.height - margin);
  const below = anchor.bottom + gap;
  const above = anchor.top - card.height - gap;
  let top: number;
  if (below <= maxTop) top = Math.max(margin, below);
  else if (above >= margin) top = above;
  else top = Math.min(maxTop, Math.max(margin, anchor.top));
  return { left, top };
}
