/** The left column: working-tree changes grouped by directory, with a row cursor and a path filter. */
import { useCallback, useEffect, useMemo, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from "react";

import { basename, statusLetter, type ChangeEntry, type ChangeGroup } from "./model.ts";
import { cursorActionOf, pageRowCount, stepCursor } from "./cursor.ts";
import { filterChangeGroups } from "./filter.ts";
import type { Translate } from "./copy.ts";
import type { ChangesMemory } from "./view-memory.ts";

/** Line counts for one path, absent for untracked files. */
export interface ChangeStatFace {
  readonly additions: number | null;
  readonly deletions: number | null;
}

/** Props one changes pane mount reads. */
export interface ChangesPaneProps {
  readonly groups: readonly ChangeGroup[];
  readonly stats: ReadonlyMap<string, ChangeStatFace>;
  readonly t: Translate;
  readonly onOpen: (path: string, line?: number) => void;
  /** Whether entering the view still owes the pane one focus claim. */
  readonly claimFocus: boolean;
  /** Called once the claim is spent, so a reload cannot replay it. */
  readonly onFocusClaimed: () => void;
  /**
   * The session's remembered browsing state.
   *
   * The host unmounts the whole view on a tab switch, so the filter, the cursor
   * row and the scroll offset live in the view's per-session record: the pane
   * reads them on mount and writes every change back. Omitted by tests.
   */
  readonly memory?: ChangesMemory;
}

/**
 * One row the keyboard can rest on: a directory header or a file.
 *
 * Headers are stops even though they only label a group. The list is what the
 * reader is walking, and a cursor that skipped a visible line would look like it
 * had missed a step. What Enter does is decided separately from whether a row can
 * hold the cursor.
 */
type ChangeRow =
  | { readonly kind: "group"; readonly dir: string; readonly count: number }
  | { readonly kind: "file"; readonly file: ChangeEntry };

/**
 * The stable name of a keyboard row.
 *
 * A filter rewrites the row list under the cursor, so the cursor has to be
 * remembered as something the rewrite cannot silently repoint: a path for a
 * file, the directory for a header.
 * @param row - the row to name.
 * @returns a key that survives filtering and reordering.
 */
function rowKey(row: ChangeRow): string {
  return row.kind === "group" ? `group:${row.dir}` : `file:${row.file.path}`;
}

/**
 * Flatten groups into the keyboard's row order.
 * @param groups - visible groups, already filtered.
 * @returns headers and file rows interleaved exactly as they render.
 */
function changeRows(groups: readonly ChangeGroup[]): ChangeRow[] {
  const rows: ChangeRow[] = [];
  for (const group of groups) {
    rows.push({ kind: "group", dir: group.dir, count: group.files.length });
    for (const file of group.files) rows.push({ kind: "file", file });
  }
  return rows;
}

/**
 * Move keyboard focus onto the first file row of the changes pane.
 *
 * Directory rows only label a group; a file row is what opens in the file
 * panel, so a file row is what the claim is about. Two situations must leave
 * focus alone: one already inside the pane, because that placement was
 * deliberate, and a list with no file row, because parking focus on an empty
 * container reads as a lost focus rather than a moved one.
 * @param pane - the changes pane element, or null before its first render.
 */
export function focusFirstChangeRow(pane: HTMLElement | null): void {
  if (pane === null) return;
  const doc = pane.ownerDocument;
  if (pane.contains(doc.activeElement)) return;
  const row = pane.querySelector<HTMLElement>('button.gx-file[data-directory="false"]');
  if (row === null) return;
  // `preventScroll` keeps the browser from jumping the pane before the panel
  // below has laid out; the row then decides how far the list should move.
  row.focus({ preventScroll: true });
  row.scrollIntoView?.({ block: "nearest" });
}

/**
 * Focus the row at one mounted index, restoring a remembered cursor.
 *
 * Unlike the first-file claim this may land on a directory header, which only
 * labels a group: the header is not focusable, so the scroll container takes the
 * keyboard there while the row still scrolls into view.
 * @param scroller - the scrolling list, or null before its first render.
 * @param index - the row index in render order; negative leaves focus alone.
 */
export function focusChangeRow(scroller: HTMLElement | null, index: number): void {
  if (scroller === null || index < 0) return;
  const row = scroller.querySelectorAll<HTMLElement>(".gx-file, .gx-group-head")[index];
  if (row === undefined) return;
  if (row.tagName === "BUTTON") row.focus({ preventScroll: true });
  else scroller.focus({ preventScroll: true });
  row.scrollIntoView?.({ block: "nearest" });
}

function Stat({ stat }: { readonly stat: ChangeStatFace | undefined }) {
  if (stat === undefined) return null;
  if (stat.additions === null && stat.deletions === null) return <span className="gx-stat-muted">bin</span>;
  return (
    <>
      <span className="gx-add">{`+${String(stat.additions ?? 0)}`}</span>
      <span className="gx-del">{`-${String(stat.deletions ?? 0)}`}</span>
    </>
  );
}

/**
 * Render the changes pane.
 * @param props - grouped changes, line stats, copy, the jump callback and the focus claim.
 * @returns the pane element.
 */
export function ChangesPane({ groups, stats, t, onOpen, claimFocus, onFocusClaimed, memory }: ChangesPaneProps) {
  const pane = useRef<HTMLElement>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState(() => memory?.query ?? "");
  const visible = useMemo(() => filterChangeGroups(groups, query), [groups, query]);
  const rows = useMemo(() => changeRows(visible), [visible]);
  const rowKeys = useMemo(() => rows.map(rowKey), [rows]);
  const total = groups.reduce((sum, group) => sum + group.files.length, 0);
  const matched = useMemo(() => visible.reduce((sum, group) => sum + group.files.length, 0), [visible]);
  const filtered = query.trim() !== "";

  // The cursor names a row by key, not by index: the filter replaces the row
  // list underneath it, and an index would quietly come to mean a different row.
  const [cursorKey, setCursorKey] = useState<string | undefined>(() => memory?.cursor);
  const cursor = useMemo(() => {
    if (cursorKey === undefined) return -1;
    return rowKeys.indexOf(cursorKey);
  }, [cursorKey, rowKeys]);
  /**
   * Move the cursor and record it in one step.
   *
   * The write is synchronous on purpose: a click on a file row also switches
   * the conversation to the file panel, and the unmount can land before a
   * passive effect would have run. Writing through the setter is what keeps the
   * remembered row the row the reader actually left on.
   */
  const rememberCursor = useCallback(
    (key: string | undefined): void => {
      if (memory !== undefined) {
        if (key === undefined) delete memory.cursor;
        else memory.cursor = key;
      }
      setCursorKey(key);
    },
    [memory],
  );
  // Where the cursor last stood, so a filter that hides it can land in the same
  // neighbourhood instead of snapping to the top of the list.
  const resting = useRef(0);
  useEffect(() => {
    if (cursor >= 0) resting.current = cursor;
  }, [cursor]);

  // The claim must not re-run when the row list changes: it lands the cursor once
  // on entry, and a second landing would undo an arrow press made right after.
  // Reading the rows through a ref keeps that effect independent of them.
  const rowsRef = useRef(rows);
  rowsRef.current = rows;

  // A claim that spans a re-render must not drag the cursor back to the first
  // row afterwards, so it is served exactly once: a snapshot reload unmounts and
  // remounts this pane, and a claim kept here would fire again and pull a
  // keyboard reader off whatever row they had moved on to since. The local guard
  // also covers a host that leaves the claim prop set after the callback.
  const claimed = useRef(false);
  useEffect(() => {
    if (!claimFocus || claimed.current) return;
    claimed.current = true;
    onFocusClaimed();
    // A returning mount remembers the row the reader left on: the claim takes
    // them back to it instead of landing on the first file like a fresh entry.
    if (cursor >= 0) {
      focusChangeRow(scroller.current, cursor);
      return;
    }
    focusFirstChangeRow(pane.current);
    // The claim is about a row that opens something, so a header cannot hold it.
    const first = rowsRef.current.find(row => row.kind === "file");
    if (first !== undefined) rememberCursor(rowKey(first));
  }, [claimFocus, cursor, onFocusClaimed]);

  // The remembered offset is applied once, before the reveal below can move it
  // to keep the restored cursor on screen.
  const pendingScroll = useRef<number | undefined>(memory?.scrollTop);
  useEffect(() => {
    const element = scroller.current;
    const offset = pendingScroll.current;
    if (element === null || offset === undefined) return;
    pendingScroll.current = undefined;
    element.scrollTop = offset;
  }, []);

  // A cursor whose row the filter removed has to move somewhere visible; keeping
  // it would leave Enter aimed at a row nobody can see. The move also lands in
  // the session record, so the restored filter and the restored cursor agree.
  useEffect(() => {
    if (cursorKey === undefined || cursor >= 0 || rows.length === 0) return;
    const landed = rows[Math.min(resting.current, rows.length - 1)];
    if (landed !== undefined) rememberCursor(rowKey(landed));
  }, [cursor, cursorKey, rows]);

  const moveCursor = useCallback(
    (index: number): void => {
      const key = rowKeys[index];
      if (key === undefined) return;
      rememberCursor(key);
      scroller.current?.focus({ preventScroll: true });
    },
    [rowKeys],
  );

  // Minimum-movement reveal: the browser's "nearest" block is exactly that, and
  // it measures the real row heights, which a formula could not do here because
  // headers and file rows differ.
  useEffect(() => {
    if (cursor < 0) return;
    const row = scroller.current?.querySelector<HTMLElement>('[data-cursor="true"]');
    row?.scrollIntoView?.({ block: "nearest" });
  }, [cursor, cursorKey]);

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
      if (action === "activate") {
        const row = cursor < 0 ? undefined : rows[cursor];
        // A header labels a group and a directory row is a working-tree entry
        // with no file behind it; neither has anything to open, and falling
        // through to a neighbouring file would open something nobody chose.
        if (row?.kind === "file" && !row.file.isDirectory) onOpen(row.file.path, 1);
        return;
      }
      // Group headers are shorter than file rows, so the page height is
      // measured off a mounted row rather than assumed.
      const viewport = scroller.current?.clientHeight ?? 480;
      const mounted = scroller.current?.querySelector<HTMLElement>(".gx-file, .gx-group-head");
      const rowHeight = mounted?.getBoundingClientRect().height ?? 26;
      const next = stepCursor(
        cursor < 0 ? undefined : cursor,
        action,
        rows.length,
        pageRowCount(viewport, rowHeight),
      );
      if (next !== undefined) moveCursor(next);
    },
    [cursor, moveCursor, onOpen, rows],
  );

  return (
    <section ref={pane} className="gx-pane" data-testid="git-changes">
      <header className="gx-pane-head">
        <span>{t("changes.title")}</span>
        <span className="gx-count">{filtered ? `${String(matched)} / ${String(total)}` : total}</span>
        <span className="gx-spacer" />
        {/* The filter sits in the header, outside `.gx-scroll`: an input inside
            the key handler's container would be handed the arrows it types. */}
        <input
          className="gx-filter"
          type="search"
          value={query}
          spellCheck={false}
          placeholder={t("changes.filter")}
          aria-label={t("changes.filter")}
          data-testid="gx-changes-filter"
          onChange={event => {
            const next = event.currentTarget.value;
            if (memory !== undefined) {
              if (next === "") delete memory.query;
              else memory.query = next;
            }
            setQuery(next);
          }}
        />
      </header>
      <div
        className="gx-scroll"
        ref={scroller}
        tabIndex={0}
        data-testid="git-changes-scroll"
        data-page-keys="own"
        onKeyDown={handleKeyDown}
        onScroll={event => {
          if (memory !== undefined) memory.scrollTop = event.currentTarget.scrollTop;
        }}
      >
        {total === 0 ? (
          <div className="gx-empty gx-empty-inline">
            <strong>{t("changes.empty")}</strong>
          </div>
        ) : rows.length === 0 ? (
          <div className="gx-empty gx-empty-inline" data-testid="git-changes-no-match">
            <strong>{t("changes.noMatch")}</strong>
          </div>
        ) : (
          rows.map(row =>
            row.kind === "group" ? (
              <div key={rowKey(row)} className="gx-group-head" data-cursor={rowKey(row) === cursorKey ? "true" : "false"}>
                <span className="gx-group-dir">{row.dir === "" ? t("changes.root") : row.dir}</span>
                <span className="gx-count">{row.count}</span>
              </div>
            ) : (
              <button
                key={rowKey(row)}
                type="button"
                className="gx-file"
                data-status={row.file.status}
                data-directory={row.file.isDirectory ? "true" : "false"}
                data-renamed={row.file.origPath === undefined ? "false" : "true"}
                data-cursor={rowKey(row) === cursorKey ? "true" : "false"}
                data-testid="git-change-file"
                title={
                  row.file.isDirectory
                    ? `${t(`status.${row.file.status}`)} · ${t("changes.directory")}`
                    : `${t(`status.${row.file.status}`)} · ${t("changes.jump")}`
                }
                onClick={() => {
                  rememberCursor(rowKey(row));
                  scroller.current?.focus({ preventScroll: true });
                  if (!row.file.isDirectory) onOpen(row.file.path, 1);
                }}
              >
                <span className="gx-badge" data-status={row.file.status}>
                  {statusLetter(row.file.status)}
                </span>
                <span className="gx-file-name">
                  {basename(row.file.path)}
                  {row.file.origPath === undefined ? null : (
                    <span className="gx-file-orig">{basename(row.file.origPath)}</span>
                  )}
                </span>
                <span className="gx-file-stats">
                  <Stat stat={stats.get(row.file.path)} />
                </span>
              </button>
            ),
          )
        )}
      </div>
    </section>
  );
}
