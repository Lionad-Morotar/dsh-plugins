/**
 * The completions-per-second sparkline.
 *
 * A thin polyline over the run's seconds, with a red pin on every second that
 * finished a failure. Drawn as an SVG path rather than a chart library: the
 * shape is one line and a handful of pins, and the board's whole point is that
 * it stays legible at 56px.
 */
import type { ReactElement } from "react";

import type { ThroughputBucket } from "../model.ts";

/** The viewBox the path is laid out in; the SVG scales to its container. */
const VIEW_WIDTH = 1000;
const VIEW_HEIGHT = 56;

/** Strings the sparkline renders. */
export interface ThroughputStrings {
  readonly peak: string;
  readonly perSecond: string;
}

/** Props the sparkline takes. */
export interface ThroughputSparklineProps {
  readonly series: readonly ThroughputBucket[];
  readonly peak: number;
  readonly strings: ThroughputStrings;
}

/**
 * Map one value onto the viewBox's vertical axis.
 *
 * The line sits in the lower part of the box so the pins above it have room;
 * a flat run of zero completions would otherwise draw on the baseline and read
 * as an empty chart.
 * @param value - completions in this second.
 * @param max - the run's peak.
 * @returns the y coordinate.
 */
function yOf(value: number, max: number): number {
  const usable = VIEW_HEIGHT - 8;
  const ratio = max === 0 ? 0 : value / max;
  return VIEW_HEIGHT - 4 - ratio * usable;
}

/**
 * Render the sparkline.
 * @param props - the series, its peak and locale-bound strings.
 * @returns the chart element.
 */
export function ThroughputSparkline({ series, peak, strings }: ThroughputSparklineProps): ReactElement {
  const step = series.length <= 1 ? VIEW_WIDTH : VIEW_WIDTH / (series.length - 1);
  const points = series.map((bucket, index) => `${(index * step).toFixed(2)},${yOf(bucket.completed, peak).toFixed(2)}`);
  const line = points.length === 0 ? "" : `M${points.join(" L")}`;
  // A filled area under the line gives the thin stroke some weight without a
  // second colour; it closes back along the baseline.
  const area =
    points.length === 0 ? "" : `M0,${VIEW_HEIGHT} L${points.join(" L")} L${VIEW_WIDTH},${VIEW_HEIGHT} Z`;

  return (
    <section data-testid="throughput" data-tst="throughput">
      <svg
        data-tst="spark"
        viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
        preserveAspectRatio="none"
        role="img"
        aria-label={`${peak}${strings.perSecond}`}
      >
        <path data-tst="spark-area" d={area} />
        <path data-tst="spark-line" d={line} />
        {series.map((bucket, index) =>
          bucket.failed === 0 ? null : (
            <line
              key={bucket.second}
              data-testid="failure-pin"
              data-tst="pin"
              x1={(index * step).toFixed(2)}
              x2={(index * step).toFixed(2)}
              y1={0}
              y2={VIEW_HEIGHT}
            />
          ),
        )}
      </svg>
      <span data-testid="peak" data-tst="peak">
        {strings.peak} {peak}
        {strings.perSecond}
      </span>
    </section>
  );
}
