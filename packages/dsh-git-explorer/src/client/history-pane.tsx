/** The right column's top half: a virtualized commit list with an SVG graph, a row cursor and a host-side search. */
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type UIEvent,
} from "react";

import { computeWindow, graphLaneCount, HISTORY_ROW_HEIGHT, relativeTime, revealRowIndex, type GraphRow } from "./model.ts";
import { cursorActionOf, nearTail, stepCursor } from "./cursor.ts";
import type { Translate } from "./copy.ts";
import type { GitCommitNode } from "../host/types.ts";
import { GraphSvg } from "./graph.tsx";

export { HISTORY_ROW_HEIGHT };
/** How close to the last loaded row a cursor may walk before the list fetches. */
const CURSOR_FETCH_AHEAD = 12;

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
      {row === undefined ? <span className="gx-graph" style={{ width: 16 }} /> : <GraphSvg row={row} laneCount={laneCount} height={HISTORY_ROW_HEIGHT} />}
      <span className="gx-hash">{commit.hash.slice(0, 7)}</span>
      <span className="gx-subject">{commit.subject}</span>
      {commit.refs.slice(0, 2).map(ref => (
        // The row is one button, and a button's own title wins over a child's,
        // so the chip carries its full name in a hover label instead.
        <span key={`${ref.kind}:${ref.name}`} className="gx-ref" data-kind={ref.kind}>
          <span className="gx-ref-name">{ref.name}</span>
          <span className="gx-ref-tip" role="tooltip">{ref.name}</span>
        </span>
      ))}
      <span className="gx-author">{commit.author}</span>
      <span className="gx-time" title={new Date(commit.time * 1000).toLocaleString()}>
        {relativeTime(commit.time)}
      </span>
    </button>
  );
}

/**
 * Render the history list.
 * @param props - commits, graph layout, paging state, the search query and selection callbacks.
 * @returns the pane element.
 */
export function HistoryPane(props: HistoryPaneProps) {
  const { commits, graph, selectedHash, headHash, total, hasMore, loadingMore, loadError, searching, search, t, onSelect, onLoadMore, onSearch } = props;
  const scroller = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [height, setHeight] = useState(0);
  const pending = useRef(false);
  // The cursor is an index into `commits` and doubles as this pane's notion of
  // "which commit is under the keyboard". Moving it selects the commit, which is
  // what the detail pane follows; `selectedHash` can also change from a click or
  // a cross-panel jump, so the two are kept in sync in one direction only.
  const [cursor, setCursor] = useState<number | undefined>(undefined);
  const cursorPath = cursor === undefined ? undefined : commits[cursor]?.hash;
  const seenSelection = useRef<string | undefined>(undefined);

  useEffect(() => {
    const element = scroller.current;
    if (element === null) return;
    const measure = (): void => setHeight(element.clientHeight);
    measure();
    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

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
  // row now happens to sit at the old index.
  useEffect(() => {
    const hash = cursorPath;
    if (hash === undefined) return;
    const index = commits.findIndex(commit => commit.hash === hash);
    if (index !== cursor && index >= 0) setCursor(index);
    else if (index < 0) setCursor(undefined);
  }, [commits, cursor, cursorPath]);

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
    const index = commits.findIndex(commit => commit.hash === selectedHash);
    if (index >= 0 && index !== cursor) setCursor(index);
  }, [selectedHash, commits, cursor]);

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
      rowCount: commits.length,
    });
    if (next === element.scrollTop) return;
    element.scrollTop = next;
    setScrollTop(next);
  }, [cursor, commits.length]);

  // Walking into the tail asks for the next page, so the cursor keeps going
  // instead of stopping at the last loaded row. The scroll path above does the
  // same for a pointer; both go through `maybeLoad`, which owns the guard.
  useEffect(() => {
    if (cursor === undefined || !nearTail(cursor, commits.length, CURSOR_FETCH_AHEAD)) return;
    maybeLoad();
  }, [cursor, commits.length, maybeLoad]);

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
      // With no cursor yet, the walk starts from the commit the detail pane is
      // showing: the reader is looking at it, so "next" means the one below it.
      const seed = cursor ?? commits.findIndex(commit => commit.hash === selectedHash);
      const next = stepCursor(seed < 0 ? undefined : seed, action, commits.length);
      if (next === undefined) return;
      setCursor(next);
      const commit = commits[next];
      // Moving the cursor is selecting: the detail pane is what the reader is
      // reading, and it must not need a second Enter to catch up.
      if (commit !== undefined) onSelect(commit.hash);
    },
    [commits, cursor, onSelect, selectedHash],
  );

  const slice = computeWindow(commits, {
    scrollTop,
    height: height === 0 ? 480 : height,
    rowHeight: HISTORY_ROW_HEIGHT,
  });
  const laneCount = Math.max(1, graphLaneCount(graph));
  // An empty list means two different things: the repository has no commit, or
  // the current query matched none. The query is what decides, not the in-flight
  // flag, because the flag is already false by the time the empty page lands.
  const queried = search.trim() !== "";
  const emptyLabel = queried ? t("history.noMatch") : (props.emptyTitle ?? t("history.empty"));
  const emptyDescription = queried ? undefined : props.emptyDescription;

  return (
    <section className="gx-pane" data-testid="git-history">
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
      {commits.length === 0 ? (
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
        <div
          className="gx-scroll"
          ref={scroller}
          tabIndex={0}
          data-testid="git-history-scroll"
          onScroll={handleScroll}
          onKeyDown={handleKeyDown}
        >
          <div className="gx-vlist" style={{ height: commits.length * HISTORY_ROW_HEIGHT }}>
            {slice.rows.map((commit, offset) => {
              const index = slice.startIndex + offset;
              return (
                <CommitRow
                  key={commit.hash}
                  commit={commit}
                  row={graph[index]}
                  laneCount={laneCount}
                  top={index * HISTORY_ROW_HEIGHT}
                  selected={commit.hash === selectedHash}
                  head={commit.hash === headHash}
                  cursor={commit.hash === cursorPath}
                  onSelect={hash => {
                    setCursor(index);
                    onSelect(hash);
                  }}
                />
              );
            })}
          </div>
        </div>
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
