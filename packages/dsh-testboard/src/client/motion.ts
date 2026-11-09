/**
 * The motion layer's pure half: what each frame should show, without a DOM.
 *
 * Animation is the one part of this board that cannot be asserted from rendered
 * output: a tween's intermediate value, a phase's label and a tick's colour are
 * decided by arithmetic, and a jsdom render only ever shows the last frame. So
 * the arithmetic lives here, and the components apply it.
 *
 * The split also keeps `prefers-reduced-motion` honest. Reduced motion is not a
 * second implementation: it is the same target values with every duration
 * collapsed to zero, which is why every function here takes the reduced flag
 * rather than the components branching on it.
 */
import type { RunProgress, RunScope } from "../shared.ts";

/** One point on the throughput chart, in viewBox units. */
export interface ChartPoint {
  readonly x: number;
  readonly y: number;
}

/** One red line marking a second that finished a failure. */
export interface FailureMarker {
  readonly x: number;
}

/** The box a chart is laid out in. */
export interface ChartBox {
  readonly width: number;
  readonly height: number;
}

/** The chart box plus the run's own time span, which places the markers. */
export interface MarkerBox extends ChartBox {
  readonly spanMs: number;
}

/** How one case's tick should read. */
export type TickState = "unrun" | "passed" | "failed" | "skipped";

/** One tick in a file's row. */
export interface CaseTick {
  readonly name: string;
  readonly state: TickState;
}

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

/** Everything the view hands the motion layer for one frame. */
export interface MotionInput {
  readonly run: RunProgress | undefined;
  readonly nowMs: number;
  readonly reduced: boolean;
}

/** The durations one frame's animation uses. */
export interface MotionConfig {
  readonly reduced: boolean;
  /** How long a count takes to reach its new value. */
  readonly countMs: number;
  /** How long one tick takes to light. */
  readonly tickMs: number;
  /** How long the phase line takes to cross-fade. */
  readonly phaseMs: number;
}

/** The stagger between two ticks in one file, in milliseconds. */
const TICK_STAGGER_MS = 30;

/**
 * The most a tick's stagger may add up to.
 *
 * A file with hundreds of cases would otherwise take seconds to finish lighting,
 * which stops reading as progress and starts reading as a stuck board. Past this
 * cap the ticks light together.
 */
const TICK_STAGGER_CAP_MS = 400;

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
 * @returns the phase, its text and its tone.
 */
export function phaseLabel(run: RunProgress | undefined, strings: MotionStrings): PhaseLabel {
  if (run === undefined) return { phase: "idle", text: strings.notRunYet, tone: "idle" };

  if (run.phase === "running") {
    // A scoped run, or any run after the first, is rerunning: the board already
    // has a result and this one is replacing part or all of it.
    const rerun = run.runNumber > 1 || run.scope.kind === "file";
    return rerun
      ? { phase: "rerunning", text: `${strings.rerunning} ${String(run.counts.total)} ${strings.tests}`, tone: "idle" }
      : { phase: "running", text: strings.running, tone: "idle" };
  }

  // A cancelled run is over: the process ended, and the board's job is to say
  // what it has rather than to keep narrating an interruption.
  if (run.counts.failed > 0) {
    return { phase: "finished", text: `${String(run.counts.failed)} ${strings.failing}`, tone: "failed" };
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
export function runMeta(run: RunProgress | undefined, strings: MotionStrings): string {
  if (run === undefined) return "";
  const seconds = `${(run.elapsedMs / 1000).toFixed(1)}s`;
  if (run.runNumber > 1) return `${strings.rerun} · ${seconds}`;
  return `${strings.run} ${String(run.runNumber)} · ${String(run.counts.total)} ${strings.tests} · ${seconds}`;
}

/**
 * The chart's points, in viewBox units.
 *
 * The y axis is the cumulative total, not the per-second delta: the reference's
 * line climbs, and a delta line would sawtooth. The peak reading beside the
 * chart is the delta's maximum, which is a different number and is computed
 * separately.
 *
 * @param series - the host's cumulative buckets.
 * @param box - the viewBox.
 * @returns one point per bucket, left to right.
 */
export function seriesPoints(
  series: RunProgress["series"],
  box: ChartBox,
): ChartPoint[] {
  if (series.length === 0) return [];
  const max = series.reduce((peak, bucket) => Math.max(peak, bucket.finished), 0);
  const step = series.length <= 1 ? 0 : box.width / (series.length - 1);
  return series.map((bucket, index) => ({
    x: series.length <= 1 ? 0 : index * step,
    // A flat run of zero completions draws on the baseline; the small inset
    // keeps the stroke inside the box rather than half-clipped by its edge.
    y: max === 0 ? box.height : box.height - (bucket.finished / max) * box.height,
  }));
}

/**
 * The red lines marking seconds that finished a failure.
 *
 * Several failures in one second are one line: the chart is a per-second
 * reading, and stacking three lines on the same pixel would only make the stroke
 * darker.
 *
 * @param failures - the run's failures, with their times.
 * @param box - the viewBox plus the run's span.
 * @returns one marker per failing second.
 */
export function failureMarkers(failures: RunProgress["failures"], box: MarkerBox): FailureMarker[] {
  if (failures.length === 0 || box.spanMs <= 0) return [];
  const seen = new Set<number>();
  const markers: FailureMarker[] = [];
  for (const failure of failures) {
    const second = Math.floor(failure.tMs / 1000);
    if (seen.has(second)) continue;
    seen.add(second);
    markers.push({ x: Math.min(box.width, (failure.tMs / box.spanMs) * box.width) });
  }
  return markers;
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

/** What one file row's ticks are computed from. */
export interface TickInput {
  /** The snapshot's cases for this file, in file order. */
  readonly snapshotCases: readonly { readonly name: string; readonly status: "passed" | "failed" | "skipped" }[];
  /** The run's incremental events, already filtered to this file. */
  readonly runCases: RunProgress["cases"];
  /** The run's scope, when it has one. */
  readonly scope: RunScope | undefined;
  /** Whether this run is a rerun that has not reported anything yet. */
  readonly rerunning?: boolean;
  /**
   * Whether a run is in flight.
   *
   * This is what decides whether an unreported case reads as grey or as its
   * snapshot value. With no run going, the snapshot is the only reading there
   * is and greying it out would hide a result the reader came to see.
   */
  readonly running?: boolean;
  /**
   * The file this row belongs to.
   *
   * Needed because a scoped run only touches one file: the other rows are not
   * being redone, so they keep their last reading even while the run is going.
   */
  readonly path?: string;
}

/**
 * The ticks one file's row should show.
 *
 * Three rules, in order:
 *
 * 1. A case the run reported takes that reading, matched by name.
 * 2. A case the run did not report keeps the snapshot's reading, so a scoped
 *    rerun does not blank the files it did not touch.
 * 3. A case the snapshot never had is appended, because a run can discover one.
 *
 * Rule 2 has two exceptions, both about a run in flight. While a run is going,
 * a case it has not reported yet is grey: that is the reference's tick-by-tick
 * lighting, and showing the previous run's green would claim a result this run
 * has not produced. And while a scoped rerun has reported nothing at all, the
 * file it targets goes grey wholesale, which is the "scan back, then light up
 * again" that tells a reader the row is being redone.
 *
 * @param input - the snapshot's cases, the run's events and the scope.
 * @returns one tick per case, in row order.
 */
export function caseTickStates(input: TickInput): CaseTick[] {
  const reported = new Map<string, TickState>();
  for (const entry of input.runCases) reported.set(entry.name, entry.status);

  // A scoped run only redoes the file it names. Every other row keeps its last
  // reading: greying them would claim the board is redoing work it is not.
  const inScope =
    input.scope === undefined || input.scope.kind === "all" || input.path === undefined || input.scope.path === input.path;
  const running = input.running === true && inScope;
  const sweeping =
    running &&
    input.rerunning === true &&
    input.runCases.length === 0 &&
    (input.scope === undefined || input.scope.kind === "all" || input.scope.path === undefined);

  const ticks: CaseTick[] = input.snapshotCases.map(entry => {
    if (sweeping) return { name: entry.name, state: "unrun" };
    const reportedState = reported.get(entry.name);
    if (reportedState !== undefined) return { name: entry.name, state: reportedState };
    // A run in flight has not reached this case yet; a settled one never will,
    // so the snapshot's reading stands.
    return { name: entry.name, state: running ? "unrun" : entry.status };
  });

  // A case the run found but the snapshot did not know about has no row to sit
  // in, so it joins the end. Dropping it would hide a real result.
  const known = new Set(input.snapshotCases.map(entry => entry.name));
  for (const entry of input.runCases) {
    if (known.has(entry.name)) continue;
    known.add(entry.name);
    ticks.push({ name: entry.name, state: entry.status });
  }

  return ticks;
}

/**
 * How long a tick waits before it starts lighting.
 *
 * The stagger is what makes a row read as cases finishing one after another
 * rather than as a bar filling. It is capped so a file with hundreds of cases
 * does not take seconds to finish.
 *
 * @param index - the tick's position in its row.
 * @returns the delay in milliseconds.
 */
export function tickDelayMs(index: number): number {
  return Math.min(TICK_STAGGER_CAP_MS, Math.max(0, index) * TICK_STAGGER_MS);
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

/**
 * The durations one frame animates with.
 *
 * Under reduced motion every duration is zero rather than the functions being
 * skipped: the same code path then produces the final value on its first frame,
 * so there is no second implementation to keep in sync.
 *
 * @param query - the media query's result.
 * @returns the configuration.
 */
export function defaultMotion(query: { readonly matches: boolean } | undefined): MotionConfig {
  const reduced = isReducedMotion(query);
  return {
    reduced,
    countMs: reduced ? 0 : 300,
    tickMs: reduced ? 0 : 120,
    phaseMs: reduced ? 0 : 150,
  };
}
