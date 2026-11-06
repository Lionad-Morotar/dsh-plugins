/** The right column's top half: a virtualized commit list with an SVG graph, a row cursor and a host-side search. */
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  type UIEvent,
} from "react";

import { computeWindow, graphLaneCount, HISTORY_ROW_HEIGHT, relativeTime, revealRowIndex, type ChangeGroup, type GraphRow } from "./model.ts";
import { cursorActionOf, nearTail, stepCursor } from "./cursor.ts";
import type { Translate } from "./copy.ts";
import type { GitCommitNode } from "../host/types.ts";
import { GraphSvg } from "./graph.tsx";
import {
  DEFAULT_HISTORY_COLUMN_WIDTHS,
  HISTORY_COLUMN_SPECS,
  clampHistoryColumnWidth,
  columnDragReturnedToBase,
  columnResizeKeyAction,
  readHistoryColumnWidths,
  saveHistoryColumnWidth,
  type HistoryColumnId,
  type HistoryColumnWidths,
} from "./history-columns.ts";
import type { PaneWidthStorage } from "./pane-width.ts";

export { HISTORY_ROW_HEIGHT };
/** How close to the last loaded row a cursor may walk before the list fetches. */
const CURSOR_FETCH_AHEAD = 12;

/**
 * The selection value that stands for the working tree.
 *
 * Commit hashes are hexadecimal, so a word can never collide with one. The
 * sentinel travels through the same `selectedHash` channel a commit uses, which
 * is what lets a click, a keyboard move and a cross-panel jump all name the
 * working tree without a second selection state to keep in sync.
 */
export const UNCOMMITTED = "uncommitted";

/** What the synthetic first row needs to describe the working tree. */
export interface WorkingTreeSummary {
  readonly groups: readonly ChangeGroup[];
  readonly stats: ReadonlyMap<string, { readonly additions: number | null; readonly deletions: number | null }>;
  readonly fileCount: number;
}

/**
 * The graph column's width for a lane count, matching `GraphSvg`'s own sizing.
 * The two have to agree: the row grid reserves this track while the SVG paints
 * inside it, and a formula that drifted would clip the outermost lane.
 *
 * The floor is 36px because the header label needs it, not because the lanes
 * do: a single lane asks for 12px, and a 12px column truncates "Graph" to
 * "Gr…". From three lanes up the lane arithmetic already exceeds 36px, so this
 * floor only changes the one- and two-lane case, where the node stays centred
 * on lane 0.
 */
function graphColumnWidth(laneCount: number): number {
  return Math.min(116, Math.max(36, laneCount * 12));
}

/**
 * localStorage for column widths; null outside a browser or when access throws.
 * Mirrors the view's own accessor so both stores fail the same way.
 */
function columnWidthStorage(): PaneWidthStorage | null {
  if (typeof document === "undefined") return null;
  try {
    return document.defaultView?.localStorage ?? null;
  } catch {
    return null;
  }
}

/** Props one history pane mount reads. */
export interface HistoryPaneProps {
  readonly commits: readonly GitCommitNode[];
  readonly graph: readonly GraphRow[];
  readonly selectedHash: string | undefined;
  readonly headHash: string | null;
  readonly total: number;
  readonly hasMore: boolean;
  readonly loadingMore: boolean;
  readonly loadError: string | undefined;
  readonly searching: boolean;
  readonly search: string;
  readonly t: Translate;
  readonly onSelect: (hash: string) => void;
  readonly onLoadMore: () => void;
  readonly onSearch: (query: string) => void;
  /** Empty-repository copy replaces the list when the repo has no commit yet. */
  readonly emptyTitle?: string;
  readonly emptyDescription?: string;
  readonly onRetry?: () => void;
  readonly retryLabel?: string;
  /**
   * Where column widths are read and written. Omitted, the pane takes the
   * document's localStorage; tests inject a stand-in.
   */
  readonly columnStorage?: PaneWidthStorage | null;
  /**
   * The working tree, when it is dirty. Absent means clean, and the list is the
   * commits alone with no row reserved for a tree that has nothing to show.
   */
  readonly workingTree?: WorkingTreeSummary;
  /** Select the working tree; the view swaps the detail column for its summary. */
  readonly onSelectUncommitted?: () => void;
}

function CommitRow({
  commit,
  row,
  laneCount,
  top,
  selected,
  head,
  cursor,
  onSelect,
}: {
  readonly commit: GitCommitNode;
  readonly row: GraphRow | undefined;
  readonly laneCount: number;
  readonly top: number;
  readonly selected: boolean;
  readonly head: boolean;
  readonly cursor: boolean;
  readonly onSelect: (hash: string) => void;
}) {
  return (
    <button
      type="button"
      className="gx-row"
      style={{ top }}
      data-selected={selected ? "true" : "false"}
      data-head={head ? "true" : "false"}
      data-cursor={cursor ? "true" : "false"}
      data-testid="git-history-row"
      title={`${commit.hash.slice(0, 7)} ${commit.subject}`}
      onClick={() => onSelect(commit.hash)}
    >
      {row === undefined ? <span className="gx-graph" style={{ width: graphColumnWidth(laneCount) }} /> : <GraphSvg row={row} laneCount={laneCount} height={HISTORY_ROW_HEIGHT} />}
      {/* The refs cell sits between the graph and the subject, so a long branch
          name has a column of its own to be truncated in rather than pushing the
          subject around. */}
      <span className="gx-refs" data-testid="git-history-refs">
        {commit.refs.slice(0, 2).map(ref => (
          // The row is one button, and a button's own title wins over a child's,
          // so the chip carries its full name in a hover label instead.
          <span key={`${ref.kind}:${ref.name}`} className="gx-ref" data-kind={ref.kind}>
            <span className="gx-ref-name">{ref.name}</span>
            <span className="gx-ref-tip" role="tooltip">{ref.name}</span>
          </span>
        ))}
      </span>
      <span className="gx-subject">{commit.subject}</span>
      <span className="gx-time" title={new Date(commit.time * 1000).toLocaleString()}>
        {relativeTime(commit.time)}
      </span>
      <span className="gx-author">{commit.author}</span>
      <span className="gx-hash">{commit.hash.slice(0, 7)}</span>
    </button>
  );
}

/**
 * The synthetic first row: the working tree, drawn in the same grid as a commit.
 *
 * It is a row rather than a banner because the reader walks it with the same
 * keys and selects it with the same click; anything else would be a second
 * navigation model for one line. The graph cell is a hollow ring so the eye can
 * tell it from a commit dot before reading the label.
 */
function UncommittedRow({
  summary,
  laneCount,
  top,
  selected,
  cursor,
  t,
  onSelect,
}: {
  readonly summary: WorkingTreeSummary;
  readonly laneCount: number;
  readonly top: number;
  readonly selected: boolean;
  readonly cursor: boolean;
  readonly t: Translate;
  readonly onSelect: () => void;
}) {
  const width = graphColumnWidth(laneCount);
  const laneWidth = width / Math.max(1, laneCount);
  // The ring sits on lane 0's centre, the same spot a commit node would take.
  const cx = laneWidth / 2;
  let additions = 0;
  let deletions = 0;
  let counted = 0;
  for (const group of summary.groups) {
    for (const file of group.files) {
      const stat = summary.stats.get(file.path);
      if (stat === undefined) continue;
      additions += stat.additions ?? 0;
      deletions += stat.deletions ?? 0;
      counted += 1;
    }
  }
  return (
    <button
      type="button"
      className="gx-row gx-uncommitted"
      style={{ top }}
      data-selected={selected ? "true" : "false"}
      data-cursor={cursor ? "true" : "false"}
      data-testid="git-uncommitted-row"
      title={t("uncommitted.hint")}
      aria-label={t("uncommitted.hint")}
      onClick={onSelect}
    >
      <svg
        className="gx-graph"
        width={width}
        height={HISTORY_ROW_HEIGHT}
        viewBox={`0 0 ${String(width)} ${String(HISTORY_ROW_HEIGHT)}`}
        aria-hidden="true"
        focusable="false"
      >
        <circle
          data-testid="git-uncommitted-node"
          cx={cx}
          cy={HISTORY_ROW_HEIGHT / 2}
          r={3.6}
          fill="none"
          stroke="var(--gx-accent)"
          strokeWidth={1.6}
          aria-hidden="true"
        />
      </svg>
      <span className="gx-refs" data-testid="git-history-refs" />
      <span className="gx-subject gx-uncommitted-label">
        {`${t("uncommitted.label")} (${String(summary.fileCount)})`}
      </span>
      <span className="gx-time">
        {/* A tree of only untracked paths has no line counts, so the cell stays
            empty rather than reporting a misleading +0 -0. */}
        {counted === 0 ? null : (
          <>
            <span className="gx-add">{`+${String(additions)}`}</span>{" "}
            <span className="gx-del">{`-${String(deletions)}`}</span>
          </>
        )}
      </span>
      <span className="gx-author" />
      <span className="gx-hash" />
    </button>
  );
}

/** The six column labels, in the same order the row grid lays its cells out. */
const COLUMN_LABELS = [
  { id: "graph", key: "history.col.graph" },
  { id: "refs", key: "history.col.refs" },
  { id: "subject", key: "history.col.subject" },
  { id: "time", key: "history.col.time" },
  { id: "author", key: "history.col.author" },
  { id: "hash", key: "history.col.hash" },
] as const;

/**
 * The header row above the list.
 *
 * It lives outside the scroll container so its handles stay reachable while the
 * list scrolls, which also means it spans the full width while the rows inside
 * give up the scrollbar gutter. `gutter` is that difference, measured by the
 * pane and applied as padding so the two grids line up to the pixel.
 */
function ColumnHeader({
  widths,
  gutter,
  t,
  onPointerDown,
  onPointerMove,
  onPointerEnd,
  onKeyDown,
  onReset,
}: {
  readonly widths: HistoryColumnWidths;
  readonly gutter: number;
  readonly t: Translate;
  readonly onPointerDown: (id: HistoryColumnId, event: ReactPointerEvent<HTMLElement>) => void;
  readonly onPointerMove: (event: ReactPointerEvent<HTMLElement>) => void;
  readonly onPointerEnd: (event: ReactPointerEvent<HTMLElement>) => void;
  readonly onKeyDown: (id: HistoryColumnId, event: ReactKeyboardEvent<HTMLElement>) => void;
  readonly onReset: (id: HistoryColumnId) => void;
}) {
  const specOf = (id: HistoryColumnId) => HISTORY_COLUMN_SPECS.find(spec => spec.id === id);
  return (
    <div
      className="gx-colhead"
      data-testid="git-history-colhead"
      style={{ paddingRight: gutter === 0 ? undefined : gutter }}
    >
      {COLUMN_LABELS.map(cell => {
        const spec = cell.id === "graph" || cell.id === "subject" ? undefined : specOf(cell.id);
        return (
          <span key={cell.id} className={`gx-colhead-cell gx-colhead-${cell.id}`}>
            {/* The label is its own box so the cell can stop clipping. The cell
                has to overflow visibly for the handle to straddle the column
                boundary, which means the cell can no longer be what truncates
                the text; this inner span does that instead. */}
            <span className="gx-colhead-label">{t(cell.key)}</span>
            {spec === undefined ? null : (
              <span
                className="gx-col-handle"
                role="separator"
                aria-orientation="vertical"
                aria-label={`${t("history.col.resize")}: ${t(cell.key)}`}
                aria-valuemin={spec.min}
                aria-valuemax={spec.max}
                aria-valuenow={widths[spec.id]}
                title={t("history.col.resizeHint")}
                tabIndex={0}
                data-testid={`gx-col-handle-${spec.id}`}
                onPointerDown={event => onPointerDown(spec.id, event)}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerEnd}
                onPointerCancel={onPointerEnd}
                onLostPointerCapture={onPointerEnd}
                onKeyDown={event => onKeyDown(spec.id, event)}
                onDoubleClick={() => onReset(spec.id)}
              />
            )}
          </span>
        );
      })}
    </div>
  );
}

/**
 * Render the history list.
 * @param props - commits, graph layout, paging state, the search query and selection callbacks.
 * @returns the pane element.
 */
export function HistoryPane(props: HistoryPaneProps) {
  const { commits, graph, selectedHash, headHash, total, hasMore, loadingMore, loadError, searching, search, t, onSelect, onLoadMore, onSearch, onSelectUncommitted } = props;
  const scroller = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [height, setHeight] = useState(0);
  const pending = useRef(false);
  // The store is taken once per mount: a fresh identity on every render would
  // restart the drag callbacks and re-read localStorage mid-gesture.
  const [widthStorage] = useState<PaneWidthStorage | null>(() =>
    props.columnStorage === undefined ? columnWidthStorage() : props.columnStorage,
  );
  const [widths, setWidths] = useState<HistoryColumnWidths>(() => readHistoryColumnWidths(widthStorage));
  // The scrollbar gutter the rows give up and the header does not. jsdom lays
  // nothing out, so it measures 0 there and the header simply spans full width.
  const [gutter, setGutter] = useState(0);
  const columnDrag = useRef<{ pointerId: number; startX: number; baseWidth: number; restWidth: number; id: HistoryColumnId } | null>(null);
  // The cursor is an index into `commits` and doubles as this pane's notion of
  // "which commit is under the keyboard". Moving it selects the commit, which is
  // what the detail pane follows; `selectedHash` can also change from a click or
  // a cross-panel jump, so the two are kept in sync in one direction only.
  const [cursor, setCursor] = useState<number | undefined>(undefined);
  // The row set the cursor indexes: the working tree first when it is dirty,
  // then the commits. Every keyboard move, reveal and fetch decision reads this
  // length, so the synthetic row cannot shift one of them by one.
  const workingTree = props.workingTree;
  const hasUncommitted = workingTree !== undefined && workingTree.fileCount > 0;
  const rowOffset = hasUncommitted ? 1 : 0;
  const rowCount = commits.length + rowOffset;
  // The selection as a row index, so a sentinel and a hash resolve the same way.
  const selectedIndex =
    selectedHash === undefined
      ? -1
      : selectedHash === UNCOMMITTED
        ? hasUncommitted
          ? 0
          : -1
        : commits.findIndex(commit => commit.hash === selectedHash) + (hasUncommitted ? 1 : 0);
  const cursorPath = cursor === undefined ? undefined : cursor < rowOffset ? UNCOMMITTED : commits[cursor - rowOffset]?.hash;
  const seenSelection = useRef<string | undefined>(undefined);

  useEffect(() => {
    const element = scroller.current;
    if (element === null) return;
    const measure = (): void => {
      setHeight(element.clientHeight);
      // offsetWidth counts the scrollbar, clientWidth does not: the difference
      // is exactly what the rows lose and the header has to pad back.
      setGutter(Math.max(0, element.offsetWidth - element.clientWidth));
    };
    measure();
    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, [commits.length]);

  useEffect(() => {
    if (!loadingMore) pending.current = false;
  }, [loadingMore]);

  const maybeLoad = useCallback((): void => {
    if (!hasMore || loadingMore || pending.current) return;
    pending.current = true;
    onLoadMore();
  }, [hasMore, loadingMore, onLoadMore]);

  const handleScroll = (event: UIEvent<HTMLDivElement>): void => {
    const element = event.currentTarget;
    setScrollTop(element.scrollTop);
    if (element.scrollTop + element.clientHeight >= element.scrollHeight - 160) maybeLoad();
  };

  // A new page or a new query replaces the list under the cursor. The hash is
  // the identity that survives that, so the cursor is re-resolved from it and
  // dropped when the commit is no longer loaded rather than pointing at whatever
  // row now happens to sit at the old index. The sentinel is an identity too:
  // it resolves to row 0 while the working tree is dirty and to nothing once it
  // is clean.
  useEffect(() => {
    const path = cursorPath;
    if (path === undefined) return;
    const index = path === UNCOMMITTED ? (hasUncommitted ? 0 : -1) : commits.findIndex(commit => commit.hash === path) + rowOffset;
    if (index !== cursor && index >= 0) setCursor(index);
    else if (index < 0) setCursor(undefined);
  }, [commits, cursor, cursorPath, hasUncommitted, rowOffset]);

  // A click or a cross-panel jump moves the selection without the keyboard, and
  // the cursor should continue from where the reader is looking. It only follows
  // once the cursor exists: `data-cursor` is the keyboard's place, and painting
  // it on entry would put a second highlight on screen while the changes pane
  // already owns the arrival claim. A selection the cursor itself caused cannot
  // bounce it back, because that is the same index.
  useEffect(() => {
    const moved = seenSelection.current !== selectedHash;
    seenSelection.current = selectedHash;
    if (!moved || cursor === undefined || selectedHash === undefined) return;
    if (selectedIndex >= 0 && selectedIndex !== cursor) setCursor(selectedIndex);
  }, [selectedHash, commits, cursor, selectedIndex]);

  // Minimum-movement reveal, computed from the same row height the virtual
  // window mounts with; a formula that disagreed would land the cursor a row off
  // from what the reader sees.
  useEffect(() => {
    if (cursor === undefined) return;
    const element = scroller.current;
    if (element === null) return;
    const next = revealRowIndex({
      scrollTop: element.scrollTop,
      viewport: element.clientHeight === 0 ? 480 : element.clientHeight,
      rowHeight: HISTORY_ROW_HEIGHT,
      index: cursor,
      rowCount,
    });
    if (next === element.scrollTop) return;
    element.scrollTop = next;
    setScrollTop(next);
  }, [cursor, rowCount]);

  // Walking into the tail asks for the next page, so the cursor keeps going
  // instead of stopping at the last loaded row. The scroll path above does the
  // same for a pointer; both go through `maybeLoad`, which owns the guard. The
  // proximity rule counts commits, not rows: the synthetic row is not a commit
  // and must neither trigger a fetch early nor hold one back.
  useEffect(() => {
    if (cursor === undefined) return;
    const commitIndex = cursor - rowOffset;
    if (commitIndex < 0 || !nearTail(commitIndex, commits.length, CURSOR_FETCH_AHEAD)) return;
    maybeLoad();
  }, [cursor, commits.length, maybeLoad, rowOffset]);

  const handleKeyDown = useCallback(
    (event: ReactKeyboardEvent<HTMLDivElement>): void => {
      const action = cursorActionOf({
        key: event.key,
        composing: event.nativeEvent.isComposing,
        alt: event.altKey,
        ctrl: event.ctrlKey,
        meta: event.metaKey,
        shift: event.shiftKey,
      });
      if (action === null) return;
      event.preventDefault();
      // With no cursor yet, the walk starts from the row the detail pane is
      // showing: the reader is looking at it, so "next" means the one below it.
      const seed = cursor ?? (selectedIndex >= 0 ? selectedIndex : undefined);
      const next = stepCursor(seed, action, rowCount);
      if (next === undefined) return;
      setCursor(next);
      // Moving the cursor is selecting: the detail pane is what the reader is
      // reading, and it must not need a second Enter to catch up.
      if (next === 0 && hasUncommitted) {
        onSelectUncommitted?.();
        return;
      }
      const commit = commits[next - rowOffset];
      if (commit !== undefined) onSelect(commit.hash);
    },
    [commits, cursor, hasUncommitted, onSelect, onSelectUncommitted, rowCount, rowOffset, selectedIndex],
  );

  // The virtual window is computed over the row set, not the commit array: the
  // synthetic row occupies a real slot, and a window derived from the commits
  // alone would mount one row too few at the bottom.
  const slice = computeWindow(
    Array.from({ length: rowCount }, (_, index) => index),
    {
      scrollTop,
      height: height === 0 ? 480 : height,
      rowHeight: HISTORY_ROW_HEIGHT,
    },
  );
  const laneCount = Math.max(1, graphLaneCount(graph));

  // A pointer drag works in pixel deltas from the width the column had when the
  // gesture began. Only the resting width is written: the moves update state so
  // the grid follows the pointer, and a drag that lands back where it started
  // restores the pre-drag width instead of pinning transient pixels.
  const beginColumnDrag = useCallback(
    (id: HistoryColumnId, event: ReactPointerEvent<HTMLElement>): void => {
      if (event.button !== 0 || columnDrag.current !== null) return;
      // The handle sits in the header, not in a row, but a stray click must still
      // not read as a row selection or as a button press.
      event.preventDefault();
      event.stopPropagation();
      try {
        event.currentTarget.setPointerCapture(event.pointerId);
      } catch {
        return; // Without capture a pointer leaving the window strands the drag.
      }
      columnDrag.current = {
        pointerId: event.pointerId,
        startX: event.clientX,
        baseWidth: widths[id],
        restWidth: widths[id],
        id,
      };
      document.body.classList.add("gx-col-resizing");
    },
    [widths],
  );

  const moveColumnDrag = useCallback((event: ReactPointerEvent<HTMLElement>): void => {
    const drag = columnDrag.current;
    if (drag === null || drag.pointerId !== event.pointerId) return;
    const next = clampHistoryColumnWidth(drag.id, drag.baseWidth + event.clientX - drag.startX);
    setWidths(current => ({ ...current, [drag.id]: next }));
  }, []);

  const endColumnDrag = useCallback(
    (event: ReactPointerEvent<HTMLElement>): void => {
      const drag = columnDrag.current;
      if (drag === null || drag.pointerId !== event.pointerId) return;
      columnDrag.current = null;
      document.body.classList.remove("gx-col-resizing");
      try {
        event.currentTarget.releasePointerCapture(event.pointerId);
      } catch {
        // Capture is already gone; pointercancel beats this handler here.
      }
      const width = drag.baseWidth + event.clientX - drag.startX;
      if (columnDragReturnedToBase(width, drag.baseWidth)) {
        setWidths(current => ({ ...current, [drag.id]: drag.restWidth }));
        return;
      }
      setWidths(saveHistoryColumnWidth(widthStorage, drag.id, width));
    },
    [widthStorage],
  );

  const resetColumn = useCallback(
    (id: HistoryColumnId): void => {
      // Resetting one column keeps the others: writing the default through the
      // normal save path drops that column's entry from the sparse object and
      // removes the key once nothing differs. `resetHistoryColumnWidths` would
      // drop the whole key, which would reset all four columns from a handle
      // that only ever spoke for one.
      setWidths(saveHistoryColumnWidth(widthStorage, id, DEFAULT_HISTORY_COLUMN_WIDTHS[id]));
    },
    [widthStorage],
  );

  const onColumnHandleKeyDown = useCallback(
    (id: HistoryColumnId, event: ReactKeyboardEvent<HTMLElement>): void => {
      if (event.nativeEvent.isComposing) return;
      const action = columnResizeKeyAction(
        event.key,
        event.altKey || event.ctrlKey || event.metaKey || event.shiftKey,
      );
      if (action === null) return;
      event.preventDefault();
      event.stopPropagation();
      if (action.kind === "reset") {
        resetColumn(id);
        return;
      }
      const spec = HISTORY_COLUMN_SPECS.find(candidate => candidate.id === id);
      if (spec === undefined) return;
      const base = action.kind === "nudge" ? widths[id] + action.delta : action.kind === "min" ? spec.min : spec.max;
      setWidths(saveHistoryColumnWidth(widthStorage, id, base));
    },
    [resetColumn, widthStorage, widths],
  );

  const columnVars = useMemo(
    () =>
      ({
        "--gx-col-graph": `${String(graphColumnWidth(laneCount))}px`,
        "--gx-col-refs": `${String(widths.refs)}px`,
        "--gx-col-time": `${String(widths.time)}px`,
        "--gx-col-author": `${String(widths.author)}px`,
        "--gx-col-hash": `${String(widths.hash)}px`,
      }) as CSSProperties,
    [laneCount, widths],
  );
  // An empty list means two different things: the repository has no commit, or
  // the current query matched none. The query is what decides, not the in-flight
  // flag, because the flag is already false by the time the empty page lands.
  const queried = search.trim() !== "";
  const emptyLabel = queried ? t("history.noMatch") : (props.emptyTitle ?? t("history.empty"));
  const emptyDescription = queried ? undefined : props.emptyDescription;

  return (
    <section className="gx-pane" data-testid="git-history" style={columnVars}>
      <header className="gx-pane-head">
        <span>{t("history.title")}</span>
        <span className="gx-count">{`${String(commits.length)} / ${String(total)}`}</span>
        <span className="gx-spacer" />
        <input
          className="gx-filter"
          type="search"
          value={search}
          spellCheck={false}
          placeholder={t("history.search")}
          aria-label={t("history.search")}
          data-testid="gx-history-search"
          onChange={event => onSearch(event.currentTarget.value)}
        />
      </header>
      {/* Three cases, not two. A repository with no commits yet can still have a
          working tree worth showing: a fresh `git init` with staged or untracked
          files has nothing to list but has the uncommitted row, and the empty
          state would swallow the one line that explains why the panel is not
          blank. A query is different: it asks about commits, and the working
          tree is not an answer to it, so no-match keeps the empty state. */}
      {commits.length === 0 && !(hasUncommitted && !queried) ? (
        <div className="gx-empty">
          <strong>{emptyLabel}</strong>
          {emptyDescription === undefined ? null : <span>{emptyDescription}</span>}
          {props.onRetry === undefined ? null : (
            <button type="button" className="gx-btn" onClick={props.onRetry}>
              {props.retryLabel ?? t("action.retry")}
            </button>
          )}
        </div>
      ) : (
        <>
          {/* The header stays outside the scroller so its handles remain
              clickable while the list scrolls under them. */}
          <ColumnHeader
            widths={widths}
            gutter={gutter}
            t={t}
            onPointerDown={beginColumnDrag}
            onPointerMove={moveColumnDrag}
            onPointerEnd={endColumnDrag}
            onKeyDown={onColumnHandleKeyDown}
            onReset={resetColumn}
          />
          <div
            className="gx-scroll"
            ref={scroller}
            tabIndex={0}
            data-testid="git-history-scroll"
            onScroll={handleScroll}
            onKeyDown={handleKeyDown}
          >
          <div className="gx-vlist" style={{ height: rowCount * HISTORY_ROW_HEIGHT }}>
            {slice.rows.map(rowIndex => {
              const top = rowIndex * HISTORY_ROW_HEIGHT;
              if (rowIndex === 0 && hasUncommitted && workingTree !== undefined) {
                return (
                  <UncommittedRow
                    key="uncommitted"
                    summary={workingTree}
                    laneCount={laneCount}
                    top={top}
                    selected={selectedHash === UNCOMMITTED}
                    cursor={cursor === 0}
                    t={t}
                    onSelect={() => {
                      setCursor(0);
                      onSelectUncommitted?.();
                    }}
                  />
                );
              }
              const index = rowIndex - rowOffset;
              const commit = commits[index];
              if (commit === undefined) return null;
              return (
                <CommitRow
                  key={commit.hash}
                  commit={commit}
                  row={graph[index]}
                  laneCount={laneCount}
                  top={top}
                  selected={commit.hash === selectedHash}
                  head={commit.hash === headHash}
                  cursor={rowIndex === cursor}
                  onSelect={hash => {
                    setCursor(rowIndex);
                    onSelect(hash);
                  }}
                />
              );
            })}
          </div>
        </div>
        </>
      )}
      <footer className="gx-loadbar">
        <span>{`${t("history.loaded")} ${String(commits.length)}`}</span>
        {loadError === undefined ? null : <span className="gx-del">{loadError}</span>}
        {searching ? <span className="gx-search-status">{t("history.searching")}</span> : null}
        <span className="gx-spacer" />
        {hasMore ? (
          <button type="button" className="gx-linkbtn" disabled={loadingMore} onClick={maybeLoad}>
            {loadingMore ? t("history.loading") : t("history.loadMore")}
          </button>
        ) : (
          <span>{commits.length === 0 ? "" : t("history.noMore")}</span>
        )}
      </footer>
    </section>
  );
}
