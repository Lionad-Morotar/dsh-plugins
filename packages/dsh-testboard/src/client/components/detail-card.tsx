/**
 * The hover card: what is inside the file under the pointer.
 *
 * Failures lead. A reader hovering a lane is asking "what went wrong here", so
 * the card opens with the failing cases and their stand-in assertion text, then
 * lists the rest. The card is decoration over the click-to-expand list, never
 * the only way to reach the information.
 */
import type { ReactElement } from "react";

import { fileNameOf, formatDuration, syntheticFailure } from "../format.ts";
import type { TestCase, TestFileRow } from "../model.ts";

/** How many cases the card lists before it stops; the click reveals the rest. */
const CARD_CASE_LIMIT = 6;

/** Props the card takes. */
export interface DetailCardProps {
  readonly row: TestFileRow;
}

/**
 * Order a file's cases for the card: failures first, then by duration.
 * @param cases - the file's cases.
 * @returns a new array, never the snapshot's own.
 */
function orderedForCard(cases: readonly TestCase[]): TestCase[] {
  return [...cases].sort((left, right) => {
    const leftFailed = left.status === "failed" ? 0 : 1;
    const rightFailed = right.status === "failed" ? 0 : 1;
    if (leftFailed !== rightFailed) return leftFailed - rightFailed;
    return right.durationMs - left.durationMs;
  });
}

/**
 * Render the hover card for one file.
 * @param props - the row under the pointer.
 * @returns the card element.
 */
export function DetailCard({ row }: DetailCardProps): ReactElement {
  const ordered = orderedForCard(row.cases);
  const shown = ordered.slice(0, CARD_CASE_LIMIT);
  const hidden = ordered.length - shown.length;

  return (
    <div data-testid="detail-card" data-tst="card" data-path={row.path} role="tooltip">
      <div data-tst="card-head">
        <span data-tst="card-file">{fileNameOf(row.path)}</span>
        <span data-tst="card-meta">
          {row.cases.length} · {formatDuration(row.durationMs)}
        </span>
      </div>
      <ul data-tst="card-list">
        {shown.map((entry, index) => (
          <li key={`${entry.name}-${String(index)}`} data-testid="detail-case" data-tst="card-case" data-status={entry.status}>
            <span data-tst="card-dot" data-status={entry.status} />
            <span data-tst="card-name">{entry.name}</span>
            <span data-tst="card-duration">{formatDuration(entry.durationMs)}</span>
            {entry.status === "failed" ? (
              <span data-tst="card-error">{syntheticFailure(entry.name)}</span>
            ) : null}
          </li>
        ))}
      </ul>
      {hidden > 0 ? <div data-tst="card-more">+{hidden}</div> : null}
    </div>
  );
}
