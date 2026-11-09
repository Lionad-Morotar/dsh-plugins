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
 */
import type { ReactElement } from "react";

import { fileNameOf, fileDirectoryOf, formatDuration } from "../format.ts";
import type { CaseTick } from "../motion.ts";
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
  /**
   * One tick per case, already resolved by `caseTickStates`.
   *
   * The row does not compute them: the reading depends on the run's scope and
   * phase, which the view owns, and a row that guessed would disagree with its
   * neighbours.
   */
  readonly ticks: readonly CaseTick[];
  /** Whether the reader asked for reduced motion. */
  readonly reduced: boolean;
  readonly strings: LaneRowStrings;
  readonly onSelect: (path: string) => void;
  readonly onRun: (path: string) => void;
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
  ticks,
  reduced,
  strings,
  onSelect,
  onRun,
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
      data-has-failed={row.hasFailed ? "true" : "false"}
      data-expanded={expanded ? "true" : "false"}
      data-selected={selected ? "true" : "false"}
      aria-selected={selected}
      aria-expanded={expanded}
      onClick={() => onSelect(row.path)}
    >
      <span data-tst="lane-name">
        <span data-tst="lane-file">{fileNameOf(row.path)}</span>
        <span data-tst="lane-dir">{directory}</span>
      </span>

      <TickMatrix ticks={ticks} reduced={reduced} />

      <span data-tst="lane-reading">
        {row.hasFailed ? (
          <span data-tst="lane-failed">
            {row.failed} {strings.failed}
          </span>
        ) : (
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
        {strings.runFile}
      </button>
    </div>
  );
}
