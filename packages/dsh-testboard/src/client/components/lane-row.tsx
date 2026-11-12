/**
 * One test file's lane: its name, one tick per case, and its right-hand reading.
 *
 * The ticks are the board's whole idea in miniature: a file's shape is its
 * cases in order, so a single red tick in a run of green is visible without
 * reading anything. They are spans rather than an SVG because a row can hold
 * dozens of them and the layout is a flex line.
 *
 * The row is an `option` inside the left column's listbox rather than a button:
 * the list owns the focus and the arrow keys, and a row that took focus itself
 * would fight that. It stays clickable, which is the pointer's equivalent of
 * selecting the row.
 *
 * The run button inside it is the one exception, and it is a real button: it
 * stops the click from reaching the row, because running a file is not the same
 * gesture as opening it. That also means it must not take the list's focus on
 * click, which is why it is only reachable by pointer for now; the keyboard's
 * run affordance is the toolbar's "run all".
 *
 * Everything the row reports comes from that row: its ticks are its cases, and
 * its right-hand reading is their sum. A row therefore cannot disagree with the
 * board it belongs to, because there is no second source to disagree with.
 */
import type { CSSProperties, MouseEvent, ReactElement } from "react";

import { fileNameOf, fileDirectoryOf, formatDuration } from "../format.ts";
import type { TestFileRow } from "../model.ts";
import { TickMatrix } from "./tick-matrix.tsx";

/** Strings the row renders. */
export interface LaneRowStrings {
  readonly failed: string;
  readonly runFile: string;
}

/** Props the row takes. */
export interface LaneRowProps {
  readonly row: TestFileRow;
  readonly expanded: boolean;
  readonly selected: boolean;
  /** DOM id, so the listbox can point `aria-activedescendant` at this row. */
  readonly optionId: string;
  /** Whether the host is running something, which disables this row's button. */
  readonly running: boolean;
  readonly strings: LaneRowStrings;
  /**
   * Whether the row repeats the directory after the file name.
   *
   * Default true, which is the flat list's reading. Inside a directory tree the
   * header above the row already names the directory, so the suffix is dropped
   * there; a suppressed package has no header and keeps it.
   */
  readonly showDirectory?: boolean;
  /**
   * Extra left padding for the row's depth in a directory tree.
   *
   * Applied to the row itself rather than a wrapper: the row's right edge must
   * stay on the reading column, so the indent may only take width from the
   * name/tick side.
   */
  readonly indentPx?: number;
  readonly onSelect: (path: string) => void;
  readonly onRun: (path: string) => void;
  /** Right-click on the row: the view anchors its menu at the pointer. */
  readonly onContextMenu: (path: string, anchor: { readonly x: number; readonly y: number }) => void;
}

/**
 * Render one file lane.
 * @param props - the row, its expanded and selected state, and the click handler.
 * @returns the row element.
 */
export function LaneRow({
  row,
  expanded,
  selected,
  optionId,
  running,
  strings,
  showDirectory = true,
  indentPx = 0,
  onSelect,
  onRun,
  onContextMenu,
}: LaneRowProps): ReactElement {
  // The package section header already names the package; repeating it in every
  // row is what pushed the path into an ellipsis once the list became a column.
  const packagePrefix = `packages/${row.packageName}/`;
  const relativePath = row.path.startsWith(packagePrefix) ? row.path.slice(packagePrefix.length) : row.path;
  const directory = fileDirectoryOf(relativePath);
  return (
    <div
      id={optionId}
      role="option"
      data-testid="file-row"
      data-tst="lane"
      data-path={row.path}
      data-has-failed={row.failed > 0 ? "true" : "false"}
      data-expanded={expanded ? "true" : "false"}
      data-selected={selected ? "true" : "false"}
      style={{ "--tst-row-indent": `${String(indentPx)}px` } as CSSProperties}
      aria-selected={selected}
      aria-expanded={expanded}
      onClick={() => onSelect(row.path)}
      onContextMenu={(event: MouseEvent<HTMLElement>) => {
        // The row's own menu replaces the browser's; the view anchors it at the
        // pointer so it opens where the reader clicked.
        event.preventDefault();
        onContextMenu(row.path, { x: event.clientX, y: event.clientY });
      }}
    >
      <span data-tst="lane-name">
        <span data-tst="lane-file">{fileNameOf(row.path)}</span>
        {showDirectory ? <span data-tst="lane-dir">{directory}</span> : null}
      </span>

      <TickMatrix cases={row.cases} />

      {/* The row's own figures. A live row's numbers are what this run has
          reported so far, which is why the board never mixes them with the
          previous run's: there is nothing to mix in. A row this run has not
          reached has no figures at all, and a 0.0s there would read as a result
          it already produced. */}
      <span
        data-tst="lane-reading"
        data-reading={row.failed > 0 ? "failed" : row.cases.length === 0 ? "pending" : "duration"}
      >
        {row.failed > 0 ? (
          <span data-tst="lane-failed">
            {row.failed} {strings.failed}
          </span>
        ) : row.cases.length === 0 ? null : (
          <span data-tst="lane-duration">{formatDuration(row.durationMs)}</span>
        )}
      </span>

      <button
        type="button"
        data-testid="run-file"
        data-tst="run-file"
        data-path={row.path}
        disabled={running}
        title={strings.runFile}
        aria-label={`${strings.runFile} ${row.path}`}
        onClick={event => {
          // Without this the click would also select and expand the row, which
          // is a different gesture: the reader asked to run this file, not to
          // open it.
          event.stopPropagation();
          onRun(row.path);
        }}
      >
        {/* A glyph rather than the word: the row is a reading, and a labelled
            button on every line turned the list into a toolbar. The accessible
            name still comes from `aria-label`, so nothing is lost to a screen
            reader. */}
        <span aria-hidden="true" data-tst="run-file-glyph">
          ▶
        </span>
      </button>
    </div>
  );
}
