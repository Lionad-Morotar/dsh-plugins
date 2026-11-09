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
  readonly selected: boolean;
  /** DOM id, so the listbox can point `aria-activedescendant` at this row. */
  readonly optionId: string;
  readonly strings: LaneRowStrings;
  readonly onSelect: (path: string) => void;
}

/**
 * Render one file lane.
 * @param props - the row, its expanded and selected state, and the click handler.
 * @returns the row element.
 */
export function LaneRow({ row, expanded, selected, optionId, strings, onSelect }: LaneRowProps): ReactElement {
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
    </div>
  );
}
