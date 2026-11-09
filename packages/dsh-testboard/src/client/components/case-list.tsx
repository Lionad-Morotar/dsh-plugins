/**
 * The expanded case list under a lane row.
 *
 * Rendered only for the row the reader opened, so a board of three hundred
 * files costs nothing until one is expanded. Each entry is a name, a status dot
 * and a duration; a failure also carries its stand-in assertion line, which is
 * the one place the board shows why rather than just what.
 */
import type { ReactElement } from "react";

import { formatDuration, syntheticFailure } from "../format.ts";
import type { TestCase } from "../model.ts";

/** Props the case list takes. */
export interface CaseListProps {
  readonly cases: readonly TestCase[];
}

/**
 * Render one file's cases.
 * @param props - the file's cases, in their recorded order.
 * @returns the list element.
 */
export function CaseList({ cases }: CaseListProps): ReactElement {
  return (
    <ul data-testid="case-list" data-tst="case-list">
      {cases.map((entry, index) => (
        <li key={`${entry.name}-${String(index)}`} data-testid="case-item" data-tst="case" data-status={entry.status}>
          <span data-tst="case-dot" data-status={entry.status} />
          <span data-tst="case-name">{entry.name}</span>
          <span data-tst="case-duration">{formatDuration(entry.durationMs)}</span>
          {entry.status === "failed" ? <span data-tst="case-error">{syntheticFailure(entry.name)}</span> : null}
        </li>
      ))}
    </ul>
  );
}
