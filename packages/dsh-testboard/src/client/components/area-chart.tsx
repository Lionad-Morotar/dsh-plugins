/**
 * The throughput chart: tests finished per second, stacked by outcome.
 *
 * The chart answers one question the board's header cannot: is the suite
 * speeding up, stalling, or failing in bursts. A single line of completions
 * hides the failures, and a failure count that is a hundredth of the passes is
 * a hairline nobody can read. So the plot is a stack: passed cases below,
 * failed above, with the failed band floored at a tenth of the stack so its
 * shape stays visible. The tooltip speaks the real numbers.
 *
 * Drawing is two SVG paths rather than a chart library: the plot is thirty
 * seconds of buckets, and a dependency that ships axes nobody reads would cost
 * more than the whole panel.
 *
 * The line grows from the left as points arrive. That is done with a clip
 * rectangle whose width follows the newest point, not with a path-length
 * animation: the path is re-drawn every poll anyway, and a clip is the one
 * technique that survives the path changing shape mid-animation.
 */
import { useState, type PointerEvent, type ReactElement, type ReactNode } from "react";

import type { RunProgress } from "../../shared.ts";
import { bucketIndexAt, bucketOfSeries, stackedSeries, type ChartPoint } from "../motion.ts";

/** The viewBox the chart is laid out in; the SVG scales to its container. */
const VIEW_WIDTH = 1000;
const VIEW_HEIGHT = 120;

/** Strings the chart renders. */
export interface AreaChartStrings {
  readonly title: string;
  readonly peak: string;
  readonly perSecond: string;
  /** Legend label for the passed band. */
  readonly passed: string;
  /** Legend label for the failed band. */
  readonly failed: string;
  /** Unit suffix for the tooltip's second reading. */
  readonly second: string;
  /** Shown in the tooltip when the failed band is drawn above its real height. */
  readonly compressedNote: string;
}

/** Props the chart takes. */
export interface AreaChartProps {
  /** The run's cumulative buckets, or an empty array before anything finished. */
  readonly series: RunProgress["series"];
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
 * The filled band between two edges, as one SVG path.
 * @param top - the upper edge, left to right.
 * @param bottom - the lower edge, left to right.
 * @returns the path data, or an empty string when there is nothing to draw.
 */
function bandPath(top: readonly ChartPoint[], bottom: readonly ChartPoint[]): string {
  if (top.length === 0 || bottom.length === 0) return "";
  const upper = top.map(point => `${point.x.toFixed(2)},${point.y.toFixed(2)}`).join(" L");
  const lower = [...bottom].reverse().map(point => `${point.x.toFixed(2)},${point.y.toFixed(2)}`).join(" L");
  return `M${upper} L${lower} Z`;
}

/**
 * Render the chart.
 * @param props - the series, the motion preference and the locale-bound words.
 * @returns the chart element.
 */
export function AreaChart({ series, reduced, strings, overlay }: AreaChartProps): ReactElement {
  const [hovered, setHovered] = useState<number | null>(null);
  const chart = stackedSeries(series, { width: VIEW_WIDTH, height: VIEW_HEIGHT });
  const peak = bucketOfSeries(series);

  const baseline = chart.passedTop.map(point => ({ x: point.x, y: VIEW_HEIGHT }));
  const passedBand = bandPath(chart.passedTop, baseline);
  const failedBand = bandPath(chart.failedTop, chart.passedTop);

  // The clip follows the newest point, so the bands appear to be drawn as the
  // run progresses rather than popping into their final shape each poll.
  const last = chart.buckets[chart.buckets.length - 1];
  const grownTo = last === undefined ? 0 : chart.buckets.length === 1 ? VIEW_WIDTH : last.x;

  const readAt = (event: PointerEvent<SVGSVGElement>): void => {
    const rect = event.currentTarget.getBoundingClientRect();
    if (rect.width <= 0 || chart.buckets.length === 0) return;
    setHovered(bucketIndexAt((event.clientX - rect.left) / rect.width, chart.buckets.length));
  };
  const readBucket = hovered === null ? undefined : chart.buckets[hovered];
  // The tooltip is anchored over the plot, not at the pointer: a pointer that
  // sits on the last bucket would push a pointer-anchored card off the panel.
  const tooltipLeft = readBucket === undefined ? 0 : Math.min(86, Math.max(14, (readBucket.x / VIEW_WIDTH) * 100));

  return (
    <section data-testid="throughput" data-tst="throughput">
      <div data-tst="chart-head">
        <span data-tst="chart-title">{strings.title}</span>
        <span data-testid="chart-legend" data-tst="chart-legend">
          <span data-tst="legend-passed">
            <i data-tst="legend-swatch" data-kind="passed" aria-hidden="true" />
            {strings.passed}
          </span>
          <span data-tst="legend-failed">
            <i data-tst="legend-swatch" data-kind="failed" aria-hidden="true" />
            {strings.failed}
          </span>
        </span>
        <span data-testid="peak" data-tst="peak">
          {peak} {strings.perSecond}
        </span>
      </div>
      <svg
        data-tst="spark"
        viewBox={`0 0 ${String(VIEW_WIDTH)} ${String(VIEW_HEIGHT)}`}
        preserveAspectRatio="none"
        role="img"
        aria-label={`${String(peak)} ${strings.perSecond}`}
        onPointerMove={readAt}
        onPointerLeave={() => setHovered(null)}
      >
        <defs>
          <clipPath id="tst-chart-grow">
            <rect data-testid="chart-clip" x={0} y={0} width={grownTo} height={VIEW_HEIGHT} />
          </clipPath>
        </defs>
        <g clipPath="url(#tst-chart-grow)" data-tst="chart-grow" data-reduced={reduced ? "true" : "false"}>
          <path data-testid="chart-passed" data-tst="spark-passed" d={passedBand} />
          <path data-testid="chart-failed" data-tst="spark-failed" d={failedBand} />
        </g>
        {readBucket === undefined ? null : (
          <line
            data-testid="chart-guide"
            data-tst="chart-guide"
            x1={readBucket.x.toFixed(2)}
            x2={readBucket.x.toFixed(2)}
            y1={0}
            y2={VIEW_HEIGHT}
          />
        )}
      </svg>
      {readBucket === undefined ? null : (
        <div data-testid="chart-tooltip" data-tst="chart-tooltip" style={{ left: `${String(tooltipLeft)}%` }}>
          <span data-tst="chart-tooltip-time">
            {Math.round(readBucket.tMs / 1000)}
            {strings.second}
          </span>
          <span data-tst="chart-tooltip-passed">
            {strings.passed} {readBucket.passed}
          </span>
          <span data-tst="chart-tooltip-failed">
            {strings.failed} {readBucket.failed}
          </span>
          {readBucket.compressed ? <span data-tst="chart-tooltip-note">{strings.compressedNote}</span> : null}
        </div>
      )}
      {overlay}
    </section>
  );
}
