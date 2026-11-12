/**
 * The motion layer's pure half: what each frame should show, without a DOM.
 *
 * Animation is the one part of this board that cannot be asserted from rendered
 * output: a tween's intermediate value, a phase's label, the shape of the
 * throughput chart are decided by arithmetic, and a jsdom render only ever shows
 * the last frame. So the arithmetic lives here, and the components apply it.
 *
 * A row's ticks are not computed here. They are the cases the run has reported
 * for that file, in the order it reported them, so the row already says what to
 * draw; what this module owns is when and how it draws it.
 *
 * The split also keeps `prefers-reduced-motion` honest. Reduced motion is not a
 * second implementation: it is the same target values with every duration
 * collapsed to zero, which is why every function here takes the reduced flag
 * rather than the components branching on it.
 */
import type { RunProgress } from "../shared.ts";

/** One point on the throughput chart, in viewBox units. */
export interface ChartPoint {
  readonly x: number;
  readonly y: number;
}

/** The box a chart is laid out in. */
export interface ChartBox {
  readonly width: number;
  readonly height: number;
}

/**
 * One second of the stacked throughput chart.
 *
 * `passed` and `failed` are the second's own completions, not the cumulative
 * bucket: the chart is a rate, and a cumulative stack could only grow.
 */
export interface ChartBucket {
  /** Milliseconds since the run started, on the host's one-second grid. */
  readonly tMs: number;
  /** Position in the viewBox, left to right. */
  readonly x: number;
  readonly passed: number;
  readonly failed: number;
  /** Height the passed band is drawn at after the failure floor is applied. */
  readonly shownPassed: number;
  readonly shownFailed: number;
  /** Whether the failed band was raised to its floor for this second. */
  readonly compressed: boolean;
}

/** The stacked chart's geometry in viewBox units. */
export interface StackedChart {
  readonly buckets: readonly ChartBucket[];
  /** The tallest stack, which is the chart's scale. */
  readonly max: number;
  /** The top edge of the passed band. */
  readonly passedTop: readonly ChartPoint[];
  /** The top edge of the failed band, which is the stack's total height. */
  readonly failedTop: readonly ChartPoint[];
}

/**
 * The least share of a stack a failed second is drawn at.
 *
 * A suite that fails one case while passing a thousand would draw that failure
 * as a hairline, and the shape of the failures (which is what a reader is
 * watching for) would be invisible. Raising the failed band to a tenth compresses
 * the passed-to-failed ratio to at most nine to one; the tooltip reports the
 * real numbers, so the floor never turns into a false count.
 */
const MIN_FAILED_SHARE = 0.1;

/** What the header's phase line says. */
export type PhaseKind = "idle" | "running" | "rerunning" | "finished";

/** The header's phase line: its kind, its words, and the colour it takes. */
export interface PhaseLabel {
  readonly phase: PhaseKind;
  readonly text: string;
  readonly tone: "idle" | "passed" | "failed";
}

/** The strings the motion layer reads. */
export interface MotionStrings {
  readonly running: string;
  readonly rerunning: string;
  readonly finished: string;
  readonly failing: string;
  readonly notRunYet: string;
  readonly run: string;
  readonly rerun: string;
  readonly tests: string;
}

/**
 * What a rerun is about to redo.
 *
 * A scoped run starts with no cases reported, so its own `counts.total` is zero
 * for the first frames. The header would then announce "Rerunning 0 tests",
 * which is both wrong and the one number a reader would notice. The size has to
 * come from outside the run.
 */
export interface RerunSize {
  /** How many cases the scope covers, when the caller knows. */
  readonly total: number | undefined;
}

/**
 * The board's own tallies, after the run's result has been merged in.
 *
 * A run reports what it covered; the board shows what it holds. Those differ the
 * moment a run is scoped, and the header has to speak for the board.
 */
export interface BoardTotals {
  readonly failed: number;
}

/**
 * Ease-out cubic: fast at the start, settling at the end.
 *
 * The reference's counters shoot up and then creep into their final value, which
 * is what makes a count read as arriving rather than as a progress bar. Linear
 * interpolation reads mechanical; ease-in would make the first frames look
 * stuck.
 *
 * @param t - progress through the tween, clamped to [0, 1].
 * @returns the eased fraction.
 */
export function easeOutCubic(t: number): number {
  const clamped = Math.min(1, Math.max(0, t));
  return 1 - (1 - clamped) ** 3;
}

/** One count tween's inputs. */
export interface CountTweenInput {
  readonly from: number;
  readonly to: number;
  readonly elapsedMs: number;
  readonly durationMs: number;
  readonly reduced: boolean;
}

/**
 * The value a counter shows partway through a change.
 *
 * Rounded to a whole number because a count is not a fraction: a reader seeing
 * `141.7 passed` would be reading a rendering artefact, not a result.
 *
 * @param input - the endpoints, the elapsed time and the duration.
 * @returns the value to render.
 */
export function countTween(input: CountTweenInput): number {
  if (input.reduced || input.durationMs <= 0) return input.to;
  const progress = easeOutCubic(input.elapsedMs / input.durationMs);
  return Math.round(input.from + (input.to - input.from) * progress);
}

/**
 * The header's phase line for one run.
 *
 * The four states are the reference's narration: nothing has run, a run is
 * going, a run finished red, a run finished green. A rerun is told from a first
 * run by the run number, which is the host's own count and therefore the only
 * honest signal that this is not the first time.
 *
 * @param run - the run, or undefined before anything has run.
 * @param strings - the locale-bound words.
 * @param rerunSize - how many cases a rerun covers, when the caller knows.
 * @returns the phase, its text and its tone.
 */
export function phaseLabel(
  run: RunProgress | undefined,
  strings: MotionStrings,
  rerunSize?: RerunSize,
  boardTotals?: BoardTotals,
): PhaseLabel {
  if (run === undefined) return { phase: "idle", text: strings.notRunYet, tone: "idle" };

  if (run.phase === "running") {
    // A scoped run, or any run after the first, is rerunning: the board already
    // has a result and this one is replacing part or all of it.
    const rerun = run.runNumber > 1 || run.scope.kind === "file";
    if (!rerun) return { phase: "running", text: strings.running, tone: "idle" };
    // A scoped run reports nothing for its first frames, so its own total is
    // zero then. The scope's size is what the line is about, not how far it has
    // got, so the caller's figure wins when it has one.
    const size = rerunSize?.total ?? run.counts.total;
    return { phase: "rerunning", text: `${strings.rerunning} ${String(size)} ${strings.tests}`, tone: "idle" };
  }

  // A cancelled run is over: the process ended, and the board's job is to say
  // what it has rather than to keep narrating an interruption.
  //
  // The failure count is the board's, not the run's. A scoped rerun reports the
  // three cases it covered, so reading its own count would announce "Tests
  // finished" while other files still hold failures. The caller passes the
  // merged snapshot's figure when it has one.
  const failed = boardTotals?.failed ?? run.counts.failed;
  if (failed > 0) {
    return { phase: "finished", text: `${String(failed)} ${strings.failing}`, tone: "failed" };
  }
  return { phase: "finished", text: strings.finished, tone: "passed" };
}

/**
 * How long the run has been going, in milliseconds.
 *
 * A settled run reports its own measured duration. A running one has to be
 * measured against the clock, because the host's `elapsedMs` only advances when
 * it publishes a new state and a 0.1s timer cannot wait for that.
 *
 * @param run - the run, or undefined.
 * @param nowMs - the current wall clock.
 * @returns elapsed milliseconds, never negative.
 */
export function elapsedOf(run: RunProgress | undefined, nowMs: number): number {
  if (run === undefined) return 0;
  if (run.phase !== "running") return run.elapsedMs;
  const startedMs = Date.parse(run.startedAt);
  if (Number.isNaN(startedMs)) return run.elapsedMs;
  return Math.max(0, nowMs - startedMs);
}

/**
 * The small line under the chart: which run this is, how many cases, how long.
 *
 * A rerun says only that it is one and how long it took, because the counts are
 * already in the header and repeating them here would be the same number twice.
 *
 * @param run - the run, or undefined.
 * @param strings - the locale-bound words.
 * @returns the line, or an empty string when there is no run.
 */
export function runMeta(run: RunProgress | undefined, strings: MotionStrings, elapsedMs?: number): string {
  if (run === undefined) return "";
  // The caller passes the same clock the header's timer reads. Two readings of
  // the same run would drift apart by a poll interval, and the board would show
  // "0.9s" beside "0.7s" for one run.
  const seconds = `${((elapsedMs ?? run.elapsedMs) / 1000).toFixed(1)}s`; 
  if (run.runNumber > 1) return `${strings.rerun} · ${seconds}`;
  return `${strings.run} ${String(run.runNumber)} · ${String(run.counts.total)} ${strings.tests} · ${seconds}`;
}

/**
 * The chart's buckets and the two bands they stack into.
 *
 * The stack is passed below, failed above, and the whole stack is as tall as
 * that second's completions. The failed band has a floor (see
 * `MIN_FAILED_SHARE`), so a second with one failure among hundreds still shows
 * a band a reader can see; `compressed` says the drawn height is not the real
 * count, and the tooltip is what restores the number.
 *
 * @param series - the host's cumulative buckets.
 * @param box - the viewBox.
 * @returns the buckets, the scale, and the two top edges.
 */
export function stackedSeries(
  series: RunProgress["series"],
  box: ChartBox,
): StackedChart {
  if (series.length === 0) return { buckets: [], max: 0, passedTop: [], failedTop: [] };

  const perSecond = series.map((bucket, index) => {
    const previous = series[index - 1];
    return {
      tMs: bucket.tMs,
      passed: Math.max(0, bucket.passed - (previous?.passed ?? 0)),
      failed: Math.max(0, bucket.failed - (previous?.failed ?? 0)),
    };
  });
  const totals = perSecond.map(bucket => bucket.passed + bucket.failed);
  const max = totals.reduce((peak, value) => Math.max(peak, value), 0);
  const step = series.length <= 1 ? 0 : box.width / (series.length - 1);

  const buckets = perSecond.map((bucket, index) => {
    const total = totals[index] ?? 0;
    const compressed = bucket.failed > 0 && total > 0 && bucket.failed < total * MIN_FAILED_SHARE;
    const shownFailed = compressed ? total * MIN_FAILED_SHARE : bucket.failed;
    return {
      tMs: bucket.tMs,
      x: series.length <= 1 ? 0 : index * step,
      passed: bucket.passed,
      failed: bucket.failed,
      shownPassed: total - shownFailed,
      shownFailed,
      compressed,
    };
  });

  const yOf = (value: number): number =>
    max === 0 ? box.height : box.height - (value / max) * box.height;
  const passedTop = buckets.map(bucket => ({ x: bucket.x, y: yOf(bucket.shownPassed) }));
  const failedTop = buckets.map(bucket => ({ x: bucket.x, y: yOf(bucket.shownPassed + bucket.shownFailed) }));
  // A one-bucket run would otherwise draw one vertical line at the left edge.
  // The reading is a rate for the whole run, so it fills the plot's width.
  if (series.length === 1) {
    passedTop.push({ x: box.width, y: passedTop[0]?.y ?? box.height });
    failedTop.push({ x: box.width, y: failedTop[0]?.y ?? box.height });
  }
  return { buckets, max, passedTop, failedTop };
}

/**
 * The bucket a pointer at `ratio` across the chart is nearest to.
 *
 * The chart has no discrete hover targets: the reader points at a moment, and
 * the nearest second is the one the tooltip should speak for. Rounding rather
 * than flooring means the left half of a gap belongs to the left bucket and the
 * right half to the right one, which is what the eye expects.
 *
 * @param ratio - pointer position across the plot, 0 at the left edge and 1 at the right.
 * @param count - how many buckets the chart drew.
 * @returns the index to read, clamped into the series.
 */
export function bucketIndexAt(ratio: number, count: number): number {
  if (count <= 1) return 0;
  return Math.min(count - 1, Math.max(0, Math.round(ratio * (count - 1))));
}

/**
 * The busiest second's completion count, for the peak reading.
 *
 * The series is cumulative, so the per-second figure is the difference between
 * one bucket and the one before it. Reading the last bucket would report the
 * run's total as its peak.
 *
 * @param series - the host's cumulative buckets.
 * @returns the largest per-second delta.
 */
export function bucketOfSeries(series: RunProgress["series"]): number {
  let peak = 0;
  let previous = 0;
  for (const bucket of series) {
    peak = Math.max(peak, bucket.finished - previous);
    previous = bucket.finished;
  }
  return peak;
}

/**
 * Whether the reader asked for reduced motion.
 *
 * @param query - the media query's result, when the environment has one.
 * @returns true when animation should be skipped.
 */
export function isReducedMotion(query: { readonly matches: boolean } | undefined): boolean {
  return query?.matches === true;
}
