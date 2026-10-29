/** The right column's top half: a virtualized commit list with an SVG graph. */
import { useCallback, useEffect, useRef, useState, type UIEvent } from "react";

import { computeWindow, graphLaneCount, relativeTime, type GraphRow } from "./model.ts";
import type { Translate } from "./copy.ts";
import type { GitCommitNode } from "../host/types.ts";
import { GraphSvg } from "./graph.tsx";

/** Row height shared by the virtual window, the CSS and the graph. */
export const HISTORY_ROW_HEIGHT = 24;
/** Rows fetched by one "load more" call. */
export const HISTORY_PAGE_SIZE = 100;

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
  readonly t: Translate;
  readonly onSelect: (hash: string) => void;
  readonly onLoadMore: () => void;
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
  onSelect,
}: {
  readonly commit: GitCommitNode;
  readonly row: GraphRow | undefined;
  readonly laneCount: number;
  readonly top: number;
  readonly selected: boolean;
  readonly head: boolean;
  readonly onSelect: (hash: string) => void;
}) {
  return (
    <button
      type="button"
      className="gx-row"
      style={{ top }}
      data-selected={selected ? "true" : "false"}
      data-head={head ? "true" : "false"}
      data-testid="git-history-row"
      title={`${commit.hash.slice(0, 7)} ${commit.subject}`}
      onClick={() => onSelect(commit.hash)}
    >
      {row === undefined ? <span className="gx-graph" style={{ width: 16 }} /> : <GraphSvg row={row} laneCount={laneCount} height={HISTORY_ROW_HEIGHT} />}
      <span className="gx-hash">{commit.hash.slice(0, 7)}</span>
      <span className="gx-subject">{commit.subject}</span>
      {commit.refs.slice(0, 2).map(ref => (
        <span key={`${ref.kind}:${ref.name}`} className="gx-ref" data-kind={ref.kind} title={ref.name}>
          {ref.name}
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
 * @param props - commits, graph layout, paging state and selection callbacks.
 * @returns the pane element.
 */
export function HistoryPane(props: HistoryPaneProps) {
  const { commits, graph, selectedHash, headHash, total, hasMore, loadingMore, loadError, t, onSelect, onLoadMore } = props;
  const scroller = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [height, setHeight] = useState(0);
  const pending = useRef(false);

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

  const slice = computeWindow(commits, {
    scrollTop,
    height: height === 0 ? 480 : height,
    rowHeight: HISTORY_ROW_HEIGHT,
  });
  const laneCount = Math.max(1, graphLaneCount(graph));

  return (
    <section className="gx-pane" data-testid="git-history">
      <header className="gx-pane-head">
        <span>{t("history.title")}</span>
        <span className="gx-count">{`${String(commits.length)} / ${String(total)}`}</span>
      </header>
      {commits.length === 0 ? (
        <div className="gx-empty">
          <strong>{props.emptyTitle ?? t("history.empty")}</strong>
          {props.emptyDescription === undefined ? null : <span>{props.emptyDescription}</span>}
          {props.onRetry === undefined ? null : (
            <button type="button" className="gx-btn" onClick={props.onRetry}>
              {props.retryLabel ?? t("action.retry")}
            </button>
          )}
        </div>
      ) : (
        <div className="gx-scroll" ref={scroller} onScroll={handleScroll} data-testid="git-history-scroll">
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
                  onSelect={onSelect}
                />
              );
            })}
          </div>
        </div>
      )}
      <footer className="gx-loadbar">
        <span>{`${t("history.loaded")} ${String(commits.length)}`}</span>
        {loadError === undefined ? null : <span className="gx-del">{loadError}</span>}
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
