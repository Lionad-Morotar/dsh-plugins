/**
 * One file's tick matrix: a 3px bar per case, lit as the run reports it.
 *
 * This is the board's densest reading. A file's shape is its cases in order, so
 * a single red bar in a run of green is visible at a glance without reading a
 * single title, and a row that is still grey is a row this run has not reached.
 *
 * The lighting is CSS, not React: each bar carries its state as an attribute and
 * the stylesheet animates the transition, staggered by an inline delay. That
 * keeps a thousand bars from costing a thousand re-renders, and it means the
 * reduced-motion path is the same markup with the transition duration at zero.
 */
import type { ReactElement } from "react";

import { tickDelayMs, type CaseTick } from "../motion.ts";

/** Props the matrix takes. */
export interface TickMatrixProps {
  /** One tick per case, in row order. */
  readonly ticks: readonly CaseTick[];
  /** Whether the reader asked for reduced motion. */
  readonly reduced: boolean;
}

/**
 * Render one file's ticks.
 * @param props - the ticks and the motion preference.
 * @returns the matrix element.
 */
export function TickMatrix({ ticks, reduced }: TickMatrixProps): ReactElement {
  return (
    <span data-testid="tick-matrix" data-tst="ticks" data-reduced={reduced ? "true" : "false"}>
      {ticks.map((tick, index) => (
        <span
          key={`${tick.name}-${String(index)}`}
          data-testid="tick"
          data-tst="tick"
          data-state={tick.state}
          data-status={tick.state}
          title={tick.name}
          style={reduced ? undefined : { transitionDelay: `${String(tickDelayMs(index))}ms` }}
        />
      ))}
    </span>
  );
}
