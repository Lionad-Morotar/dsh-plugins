/**
 * The throughput chart: tests finished per second, with the failures marked.
 *
 * The reference's chart is the board's heartbeat. It is drawn as two SVG paths
 * rather than a chart library because that is all it is: a line, an area under
 * it, and a red rule wherever a second finished a failure.
 *
 * The line grows from the left as points arrive. That is done with a clip
 * rectangle whose width follows the newest point, not with a path-length
 * animation: the path is re-drawn every poll anyway, and a clip is the one
 * technique that survives the path changing shape mid-animation.
 */
import type { ReactElement, ReactNode } from "react";

import type { RunProgress } from "../../shared.ts";
import { bucketOfSeries, failureMarkers, seriesPoints } from "../motion.ts";

/** The viewBox the chart is laid out in; the SVG scales to its container. */
const VIEW_WIDTH = 1000;
const VIEW_HEIGHT = 120;

/** Strings the chart renders. */
export interface AreaChartStrings {
  readonly title: string;
  readonly peak: string;
  readonly perSecond: string;
}

/** Props the chart takes. */
export interface AreaChartProps {
  /** The run's cumulative buckets, or an empty array before anything finished. */
  readonly series: RunProgress["series"];
  /** The run's failures, which become the red rules. */
  readonly failures: RunProgress["failures"];
  /** The run's span, which places the rules on the same axis as the points. */
  readonly spanMs: number;
  /** Whether the reader asked for reduced motion. */
  readonly reduced: boolean;
  readonly strings: AreaChartStrings;
  /**
   * An overlay pinned to the chart's bottom right.
   *
   * The preview's fixing card lives here rather than beside the chart because
   * the card is positioned against the plot: it annotates a moment on the run,
   * and a card that floated against the page would drift away from the line it
   * is about.
   */
  readonly overlay?: ReactNode;
}

/**
 * Render the chart.
 * @param props - the series, its failures and the locale-bound words.
 * @returns the chart element.
 */
export function AreaChart({ series, failures, spanMs, reduced, strings, overlay }: AreaChartProps): ReactElement {
  const points = seriesPoints(series, { width: VIEW_WIDTH, height: VIEW_HEIGHT });
  const peak = bucketOfSeries(series);
  const markers = failureMarkers(failures, { width: VIEW_WIDTH, height: VIEW_HEIGHT, spanMs });

  const line = points.length === 0 ? "" : `M${points.map(point => `${point.x.toFixed(2)},${point.y.toFixed(2)}`).join(" L")}`;
  const area =
    points.length === 0
      ? ""
      : `M0,${String(VIEW_HEIGHT)} L${points.map(point => `${point.x.toFixed(2)},${point.y.toFixed(2)}`).join(" L")} L${String(VIEW_WIDTH)},${String(VIEW_HEIGHT)} Z`;

  // The clip follows the newest point, so the line appears to be drawn as the
  // run progresses rather than popping into its final shape each poll.
  const grownTo = points.length === 0 ? 0 : (points[points.length - 1]?.x ?? 0);

  return (
    <section data-testid="throughput" data-tst="throughput">
      <div data-tst="chart-head">
        <span data-tst="chart-title">{strings.title}</span>
        <span data-testid="peak" data-tst="peak">
          {peak} {strings.perSecond}
        </span>
      </div>
      <svg
        data-tst="spark"
        viewBox={`0 0 ${String(VIEW_WIDTH)} ${String(VIEW_HEIGHT)}`}
        preserveAspectRatio="none"
        role="img"
        aria-label={`${String(peak)}${strings.perSecond}`}
      >
        <defs>
          <clipPath id="tst-chart-grow">
            <rect data-testid="chart-clip" x={0} y={0} width={grownTo} height={VIEW_HEIGHT} />
          </clipPath>
        </defs>
        <g clipPath="url(#tst-chart-grow)" data-tst="chart-grow" data-reduced={reduced ? "true" : "false"}>
          <path data-testid="chart-area" data-tst="spark-area" d={area} />
          <path data-testid="chart-line" data-tst="spark-line" d={line} />
        </g>
        {markers.map((marker, index) => (
          <line
            key={`${String(marker.x)}-${String(index)}`}
            data-testid="failure-pin"
            data-tst="pin"
            x1={marker.x.toFixed(2)}
            x2={marker.x.toFixed(2)}
            y1={0}
            y2={VIEW_HEIGHT}
          />
        ))}
      </svg>
      {overlay}
    </section>
  );
}
