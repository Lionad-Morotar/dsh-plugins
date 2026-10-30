/**
 * The tree's rendering layer.
 *
 * Rows are positioned absolutely inside one virtual list; only the slice the
 * viewport asks for is mounted, so a 5 000-file workspace costs the same DOM as
 * a 30-file one. The row vocabulary is deliberately small: an entry row (file
 * or directory) and a status row for loading, failure, emptiness and host-side
 * truncation.
 */
import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties, type KeyboardEvent as ReactKeyboardEvent, type UIEvent } from "react";

import type { Translate } from "./copy.ts";
import {
  badgeFor,
  computeTreeWindow,
  formatSize,
  iconFor,
  type TreeRow,
} from "./model.ts";
import { statusBadge, statusLabelKey, statusTone } from "./status.ts";

/** Row height shared by the virtual window, the CSS and the scroll math. */
export const TREE_ROW_HEIGHT = 22;

/** The entry half of {@link TreeRow}. */
export type EntryRow = Extract<TreeRow, { type: "entry" }>;
/** The status half of {@link TreeRow}. */
export type StatusRow = Extract<TreeRow, { type: "status" }>;

/** The opened or closed folder glyph, drawn inline so the bundle stays icon-free. */
export function FolderIcon({ open = true, size = 14 }: { readonly open?: boolean; readonly size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {open ? (
        <>
          <path d="M1.9 12.4V4.1c0-.6.5-1.1 1.1-1.1h3.1l1.4 1.6H12c.6 0 1.1.5 1.1 1.1v.9" />
          <path d="M1.9 12.4 3.5 7.3c.1-.4.5-.7.9-.7h8.2c.6 0 1 .5.9 1.1l-1.1 4c-.1.4-.5.7-.9.7H3c-.6 0-1.1-.5-1.1-1.1Z" />
        </>
      ) : (
        <path d="M1.9 12.4V4.1c0-.6.5-1.1 1.1-1.1h3.1l1.4 1.6H12c.6 0 1.1.5 1.1 1.1v6.7c0 .6-.5 1.1-1.1 1.1H3c-.6 0-1.1-.5-1.1-1.1Z" />
      )}
    </svg>
  );
}

/** The disclosure chevron; the CSS rotates the wrapper when the directory opens. */
export function ChevronIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6 3.5 10.5 8 6 12.5" />
    </svg>
  );
}

/** The header's refresh glyph. */
export function RefreshIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M13 6.2A5.3 5.3 0 1 0 13.1 10" />
      <path d="M13 2.8v3.4H9.6" />
    </svg>
  );
}

/** The header's collapse-all glyph. */
export function CollapseIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 6.2 8 2.5l4 3.7M4 9.8l4 3.7 4-3.7" />
    </svg>
  );
}

/**
 * The coloured file-type badge.
 * @param props - the basename the badge describes.
 * @returns a short uppercase label tinted by the file's icon family.
 */
export function FileBadge({ name }: { readonly name: string }) {
  return (
    <span className="fx-badge" data-icon={iconFor(name)} aria-hidden="true">
      {badgeFor(name)}
    </span>
  );
}

/** Props for one entry row. */
export interface TreeRowViewProps {
  readonly row: EntryRow;
  readonly selected: boolean;
  /** Whether the keyboard cursor rests on this row, regardless of open tabs. */
  readonly cursor: boolean;
  readonly top: number;
  readonly t: Translate;
  readonly onToggle: (path: string) => void;
  readonly onSelect: (path: string) => void;
  /** Announced on every row activation so the tree cursor follows the mouse. */
  readonly onRowActivate: (path: string) => void;
}

/**
 * Render one file or directory row.
 * @param props - the row, its selected state and the two tree gestures.
 * @returns the row element.
 */
export function TreeRowView({ row, selected, cursor, top, t, onToggle, onSelect, onRowActivate }: TreeRowViewProps) {
  const directory = row.kind === "directory";
  const style: CSSProperties = { top, paddingLeft: 8 + row.depth * 12 };
  return (
    <button
      type="button"
      className="fx-row"
      role="treeitem"
      aria-level={row.depth + 1}
      aria-selected={selected}
      {...(directory ? { "aria-expanded": row.expanded } : {})}
      data-kind={row.kind}
      data-selected={selected ? "true" : "false"}
      data-cursor={cursor ? "true" : "false"}
      data-expanded={directory ? (row.expanded ? "true" : "false") : undefined}
      data-status={row.status}
      data-testid="fx-row"
      title={row.path}
      style={style}
      onClick={() => {
        onRowActivate(row.path);
        if (directory) onToggle(row.path);
        else onSelect(row.path);
      }}
    >
      <span
        className="fx-chevron"
        data-open={directory && row.expanded ? "true" : "false"}
        data-visible={directory ? "true" : "false"}
        aria-hidden="true"
      >
        <ChevronIcon />
      </span>
      {directory ? (
        <span className="fx-folder" data-open={row.expanded ? "true" : "false"} aria-hidden="true">
          <FolderIcon open={row.expanded} />
        </span>
      ) : (
        <FileBadge name={row.name} />
      )}
      <span className="fx-name">{row.name}</span>
      {row.status === undefined ? null : (
        <span
          className="fx-status-badge fx-tone"
          data-tone={statusTone(row.status)}
          data-testid="fx-file-status"
          title={t(statusLabelKey(row.status))}
          aria-label={t(statusLabelKey(row.status))}
        >
          {statusBadge(row.status)}
        </span>
      )}
      {row.statusCount === undefined ? null : (
        <span
          className="fx-dir-status fx-tone"
          data-tone={row.statusTone ?? "neutral"}
          data-testid="fx-dir-status"
        >
          {t("status.directoryChanges").replace("{count}", String(row.statusCount))}
        </span>
      )}
      <span className="fx-row-fill" />
      {row.size === undefined ? null : <span className="fx-size">{formatSize(row.size)}</span>}
    </button>
  );
}

/** Props for one status row. */
export interface StatusRowViewProps {
  readonly row: StatusRow;
  readonly top: number;
  readonly t: Translate;
  readonly onRetry: (path: string) => void;
}

/**
 * Render a loading, failure, empty-directory or truncation row.
 * @param props - the status row, its top offset and the retry gesture.
 * @returns the row element.
 */
export function StatusRowView({ row, top, t, onRetry }: StatusRowViewProps) {
  const message =
    row.state === "loading"
      ? t("state.loadingDirectory")
      : row.state === "empty"
        ? t("state.emptyDirectory")
        : row.state === "failed"
          ? row.message ?? t("state.failedDirectory")
          : row.label ?? t("state.truncated");
  return (
    <div
      className="fx-status"
      data-state={row.state}
      data-testid="fx-status"
      role="note"
      style={{ top, paddingLeft: 8 + row.depth * 12 + 22 }}
    >
      {row.state === "loading" ? <span className="fx-spinner" aria-hidden="true" /> : null}
      <span className="fx-status-text" title={message}>
        {message}
      </span>
      {row.state === "truncated" ? <span className="fx-status-note" aria-hidden="true">↧</span> : null}
      {row.state === "failed" ? (
        <button type="button" className="fx-linkbtn" onClick={() => onRetry(row.path)}>
          {t("action.retry")}
        </button>
      ) : null}
    </div>
  );
}

/** Props for the virtualized tree body. */
export interface TreeBodyProps {
  readonly rows: readonly TreeRow[];
  readonly selectedPath: string | undefined;
  readonly t: Translate;
  readonly onToggle: (path: string) => void;
  readonly onSelect: (path: string) => void;
  readonly onRetry: (path: string) => void;
}

/**
 * Render the viewport-windowed tree.
 * @param props - flattened rows, selection and the tree gestures.
 * @returns the scroll container and the mounted slice.
 */
export function TreeBody({ rows, selectedPath, t, onToggle, onSelect, onRetry }: TreeBodyProps) {
  const scroller = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [height, setHeight] = useState(0);
  // The keyboard cursor is an index into `rows` and only ever rests on entry
  // rows; status placeholders (loading, failed, truncated) are skipped.
  const [cursor, setCursor] = useState<number | undefined>(undefined);
  const entryIndexes = useMemo(
    () => rows.flatMap((row, index) => (row.type === "entry" ? [index] : [])),
    [rows],
  );

  // A click or an outside jump keeps the cursor honest so the very first arrow
  // key press continues from where the user is looking.
  useEffect(() => {
    if (selectedPath === undefined) return;
    const index = rows.findIndex(row => row.type === "entry" && row.path === selectedPath);
    if (index >= 0) setCursor(index);
  }, [selectedPath, rows]);

  // Discard a cursor that pointed into a row the outside world removed (a
  // directory collapse from a cross-panel jump, a refreshed listing).
  useEffect(() => {
    if (cursor !== undefined && rows[cursor]?.type !== "entry") setCursor(undefined);
  }, [rows, cursor]);

  // Keep the cursor visible with minimum scrolling, unlike the centered reveal
  // a cross-panel jump performs.
  useEffect(() => {
    const element = scroller.current;
    if (cursor === undefined || element === null) return;
    const top = cursor * TREE_ROW_HEIGHT;
    if (top < element.scrollTop) element.scrollTop = top;
    else if (top + TREE_ROW_HEIGHT > element.scrollTop + element.clientHeight) {
      element.scrollTop = top + TREE_ROW_HEIGHT - element.clientHeight;
    }
  }, [cursor]);

  const moveCursor = useCallback(
    (index: number): void => {
      setCursor(index);
      scroller.current?.focus({ preventScroll: true });
    },
    [],
  );

  const handleRowActivate = useCallback((path: string): void => {
    const index = rows.findIndex(row => row.type === "entry" && row.path === path);
    if (index >= 0) setCursor(index);
  }, [rows]);

  const handleTreeKeyDown = useCallback(
    (event: ReactKeyboardEvent<HTMLDivElement>): void => {
      if (event.nativeEvent.isComposing || event.altKey || event.metaKey || event.ctrlKey) return;
      const last = entryIndexes.at(-1);
      if (event.key === "ArrowDown") {
        event.preventDefault();
        if (cursor === undefined) {
          if (entryIndexes[0] !== undefined) moveCursor(entryIndexes[0]);
          return;
        }
        const next = entryIndexes.find(index => index > cursor);
        if (next !== undefined) moveCursor(next);
        return;
      }
      if (event.key === "ArrowUp") {
        event.preventDefault();
        if (cursor === undefined) {
          if (last !== undefined) moveCursor(last);
          return;
        }
        const previous = [...entryIndexes].reverse().find(index => index < cursor);
        if (previous !== undefined) moveCursor(previous);
        return;
      }
      if (cursor === undefined) return;
      const row = rows[cursor];
      if (row === undefined || row.type !== "entry") return;
      if (event.key === "ArrowRight") {
        event.preventDefault();
        if (row.kind === "directory" && !row.expanded) onToggle(row.path);
        else {
          const next = entryIndexes.find(index => index > cursor);
          if (next !== undefined && rows[next]?.depth === row.depth + 1) moveCursor(next);
        }
        return;
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        if (row.kind === "directory" && row.expanded) onToggle(row.path);
        else {
          const parent = [...entryIndexes]
            .reverse()
            .find(index => index < cursor && rows[index]?.type === "entry" && rows[index].depth < row.depth);
          if (parent !== undefined) moveCursor(parent);
        }
        return;
      }
      if (event.key === "Enter" && row.kind !== "directory") {
        event.preventDefault();
        onSelect(row.path);
        return;
      }
      if (event.key === "Home") {
        event.preventDefault();
        if (entryIndexes[0] !== undefined) moveCursor(entryIndexes[0]);
        return;
      }
      if (event.key === "End") {
        event.preventDefault();
        if (last !== undefined) moveCursor(last);
      }
    },
    [cursor, entryIndexes, moveCursor, onToggle, onSelect, rows],
  );

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

  // A jump from the Git panel selects a row that may sit outside the current
  // window; centering it once keeps the reveal gesture honest.
  useEffect(() => {
    if (selectedPath === undefined) return;
    const element = scroller.current;
    if (element === null) return;
    const index = rows.findIndex(row => row.type === "entry" && row.path === selectedPath);
    if (index < 0) return;
    const top = index * TREE_ROW_HEIGHT;
    if (top < element.scrollTop || top + TREE_ROW_HEIGHT > element.scrollTop + element.clientHeight) {
      element.scrollTop = Math.max(0, top - element.clientHeight / 2);
    }
  }, [selectedPath, rows]);

  const handleScroll = (event: UIEvent<HTMLDivElement>): void => {
    setScrollTop(event.currentTarget.scrollTop);
  };

  const window = computeTreeWindow(rows, {
    scrollTop,
    height: height === 0 ? 480 : height,
    rowHeight: TREE_ROW_HEIGHT,
  });

  return (
    <div
      className="fx-scroll"
      ref={scroller}
      onScroll={handleScroll}
      onKeyDown={handleTreeKeyDown}
      tabIndex={0}
      data-testid="fs-tree-scroll"
      role="tree"
      aria-label={t("view.tree")}
    >
      <div className="fx-vlist" style={{ height: rows.length * TREE_ROW_HEIGHT }}>
        {window.rows.map((row, offset) => {
          const top = (window.startIndex + offset) * TREE_ROW_HEIGHT;
          return row.type === "entry" ? (
            <TreeRowView
              key={row.path}
              row={row}
              top={top}
              selected={row.path === selectedPath}
              cursor={cursor === window.startIndex + offset}
              t={t}
              onToggle={onToggle}
              onSelect={onSelect}
              onRowActivate={handleRowActivate}
            />
          ) : (
            <StatusRowView key={row.key} row={row} top={top} t={t} onRetry={onRetry} />
          );
        })}
      </div>
    </div>
  );
}
