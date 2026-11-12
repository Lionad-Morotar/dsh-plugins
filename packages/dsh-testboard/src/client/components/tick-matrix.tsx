/**
 * One file's tick matrix: a 3px bar per case, as this run reported them.
 *
 * This is the board's densest reading. A file's shape is its cases in order, so
 * a single red bar in a run of green is visible at a glance without reading a
 * single title. The bar appears when its case does: a live row grows its ticks
 * as the run reports them, which is what makes the row a progress reading rather
 * than a result.
 *
 * The bar's state is an attribute, and the stylesheet owns both the colour and
 * the entrance fade. That keeps a thousand bars from costing a thousand
 * re-renders, and it means the reduced-motion path is the same markup with the
 * animation removed.
 */
import type { ReactElement } from "react";

import type { TestCase } from "../model.ts";

/** Props the matrix takes. */
export interface TickMatrixProps {
  /** The file's cases, in the order the run reported them. */
  readonly cases: readonly TestCase[];
}

/**
 * Render one file's ticks.
 * @param props - the file's cases and the motion preference.
 * @returns the matrix element.
 */
export function TickMatrix({ cases }: TickMatrixProps): ReactElement {
  return (
    <span data-testid="tick-matrix" data-tst="ticks">
      {cases.map((entry, index) => (
        <span
          key={`${entry.name}-${String(index)}`}
          data-testid="tick"
          data-tst="tick"
          data-state={entry.status}
          data-status={entry.status}
          title={entry.name}
        />
      ))}
    </span>
  );
}
