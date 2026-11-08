/**
 * One test file's lane: its name, one tick per case, and its right-hand reading.
 *
 * The ticks are the board's whole idea in miniature: a file's shape is its
 * cases in order, so a single red tick in a run of green is visible without
 * reading anything. They are spans rather than an SVG because a row can hold
 * dozens of them and the layout is a flex line.
 */
import type { ReactElement } from "react";

import { fileNameOf, fileDirectoryOf, formatDuration } from "../format.ts";
import type { TestFileRow } from "../model.ts";

/** Strings the row renders. */
export interface LaneRowStrings {
  readonly failed: string;
}

/** Props the row takes. */
export interface LaneRowProps {
  readonly row: TestFileRow;
  readonly expanded: boolean;
  readonly strings: LaneRowStrings;
  readonly onToggle: (path: string) => void;
  readonly onHover: (path: string | undefined) => void;
}

/**
 * Render one file lane.
 *
 * The row is a button so it is reachable by keyboard and announces its expanded
 * state; the hover handlers only drive the detail card, which is decoration on
 * top of the same information the click reveals.
 * @param props - the row, its expanded state and the handlers.
 * @returns the row element.
 */
export function LaneRow({ row, expanded, strings, onToggle, onHover }: LaneRowProps): ReactElement {
  const directory = fileDirectoryOf(row.path);
  return (
    <button
      type="button"
      data-testid="file-row"
      data-tst="lane"
      data-path={row.path}
      data-has-failed={row.hasFailed ? "true" : "false"}
      data-expanded={expanded ? "true" : "false"}
      aria-expanded={expanded}
      onClick={() => onToggle(row.path)}
      onMouseEnter={() => onHover(row.path)}
      onMouseLeave={() => onHover(undefined)}
    >
      <span data-tst="lane-name">
        <span data-tst="lane-file">{fileNameOf(row.path)}</span>
        <span data-tst="lane-dir">{directory}</span>
      </span>

      <span data-tst="ticks">
        {row.cases.map((entry, index) => (
          <span
            key={`${entry.name}-${String(index)}`}
            data-tst="tick"
            data-status={entry.status}
            title={entry.name}
          />
        ))}
      </span>

      <span data-tst="lane-reading">
        {row.hasFailed ? (
          <span data-tst="lane-failed">
            {row.failed} {strings.failed}
          </span>
        ) : (
          <span data-tst="lane-duration">{formatDuration(row.durationMs)}</span>
        )}
      </span>
    </button>
  );
}
