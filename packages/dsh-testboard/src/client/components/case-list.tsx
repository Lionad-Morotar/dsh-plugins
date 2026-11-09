/**
 * The expanded case list under a lane row.
 *
 * Rendered only for the row the reader opened, so a board of three hundred
 * files costs nothing until one is expanded. Each entry is a name, a status dot
 * and a duration; a failure also carries its stand-in assertion line, which is
 * the one place the list shows why rather than just what.
 *
 * The entries are listbox options like the file rows above them, so the arrow
 * keys walk from a file straight into its cases without a second focus target.
 */
import type { ReactElement } from "react";

import { formatDuration, syntheticFailure } from "../format.ts";
import type { TestCase } from "../model.ts";

/** Props the case list takes. */
export interface CaseListProps {
  readonly cases: readonly TestCase[];
  /** The selected case's index within this file, or -1 when none of these is selected. */
  readonly selectedIndex: number;
  /** Builds the DOM id for one case, so the listbox can point at it. */
  readonly optionId: (index: number) => string;
  readonly onSelect: (index: number) => void;
}

/**
 * Render one file's cases.
 * @param props - the file's cases, its selection and the click handler.
 * @returns the list element.
 */
export function CaseList({ cases, selectedIndex, optionId, onSelect }: CaseListProps): ReactElement {
  return (
    <ul data-testid="case-list" data-tst="case-list" role="group">
      {cases.map((entry, index) => (
        <li
          key={`${entry.name}-${String(index)}`}
          id={optionId(index)}
          role="option"
          data-testid="case-item"
          data-tst="case"
          data-status={entry.status}
          data-index={index}
          data-selected={index === selectedIndex ? "true" : "false"}
          aria-selected={index === selectedIndex}
          onClick={() => onSelect(index)}
        >
          <span data-tst="case-dot" data-status={entry.status} />
          <span data-tst="case-name">{entry.name}</span>
          <span data-tst="case-duration">{formatDuration(entry.durationMs)}</span>
          {entry.status === "failed" ? <span data-tst="case-error">{syntheticFailure(entry.name)}</span> : null}
        </li>
      ))}
    </ul>
  );
}
