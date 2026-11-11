/**
 * The motion layer's pure half: everything the animation needs to decide,
 * without a DOM.
 *
 * Animation is the one part of this board that cannot be asserted by reading the
 * rendered output: a tween's intermediate value, a phase's label, a tick's
 * colour are all decided by arithmetic that a jsdom render only shows the last
 * frame of. So the arithmetic lives here, in functions that take the run's state
 * and return what the frame should show, and the components only apply it.
 *
 * That split is also what keeps the board honest about `prefers-reduced-motion`:
 * the reduced-motion path is not a second implementation, it is the same target
 * values with the interpolation skipped.
 */
import { describe, expect, it } from "vitest";

import {
  bucketIndexAt,
  bucketOfSeries,
  caseTickStates,
  countTween,
  defaultMotion,
  easeOutCubic,
  elapsedOf,
  isReducedMotion,
  phaseLabel,
  rowReading,
  runMeta,
  stackedSeries,
  tickDelayMs,
  type MotionInput,
} from "../src/client/motion.ts";
import type { RunProgress } from "../src/shared.ts";

/** A finished run with one failure, as the host would report it. */
function run(overrides: Partial<RunProgress> = {}): RunProgress {
  return {
    runId: "run-1",
    scope: { kind: "all" },
    status: "failed",
    phase: "finished",
    runNumber: 1,
    startedAt: "2026-11-10T00:00:00.000Z",
    finishedAt: "2026-11-10T00:00:12.400Z",
    elapsedMs: 12_400,
    completedFiles: 6,
    totalFiles: null,
    counts: { passed: 142, failed: 3, skipped: 0, total: 145 },
    series: [
      { tMs: 0, finished: 10, passed: 10, failed: 0 },
      { tMs: 1000, finished: 40, passed: 40, failed: 0 },
      { tMs: 2000, finished: 90, passed: 88, failed: 2 },
    ],
    failures: [
      { tMs: 2000, path: "test/hero.test.ts", name: "renders" },
      { tMs: 2500, path: "test/hero.test.ts", name: "mounts" },
    ],
    cases: [
      { path: "test/hero.test.ts", name: "renders", status: "failed", durationMs: 4, atMs: 2000 },
      { path: "test/hero.test.ts", name: "mounts", status: "failed", durationMs: 2, atMs: 2500 },
      { path: "test/brand.test.ts", name: "paints", status: "passed", durationMs: 3, atMs: 3000 },
    ],
    ...overrides,
  };
}

/** The strings the label and meta functions read. */
const STRINGS = {
  running: "Running tests",
  rerunning: "Rerunning",
  finished: "Tests finished",
  failing: "failing tests",
  notRunYet: "尚未运行",
  run: "Run",
  rerun: "Rerun",
  tests: "tests",
};

describe("easeOutCubic", () => {
  it("pins both ends", () => {
    expect(easeOutCubic(0)).toBe(0);
    expect(easeOutCubic(1)).toBe(1);
  });

  it("is ahead of linear in the middle, which is what makes it read as settling", () => {
    expect(easeOutCubic(0.5)).toBeGreaterThan(0.5);
  });

  it("clamps outside the unit interval rather than overshooting", () => {
    expect(easeOutCubic(-1)).toBe(0);
    expect(easeOutCubic(2)).toBe(1);
  });
});

describe("countTween", () => {
  it("returns the target immediately when motion is off", () => {
    const tween = countTween({ from: 0, to: 142, elapsedMs: 0, durationMs: 300, reduced: true });

    expect(tween).toBe(142);
  });

  it("starts at the previous value and lands on the target", () => {
    expect(countTween({ from: 0, to: 142, elapsedMs: 0, durationMs: 300, reduced: false })).toBe(0);
    expect(countTween({ from: 0, to: 142, elapsedMs: 300, durationMs: 300, reduced: false })).toBe(142);
  });

  it("rounds to a whole number, because a count is not a fraction", () => {
    const middle = countTween({ from: 0, to: 100, elapsedMs: 150, durationMs: 300, reduced: false });

    expect(Number.isInteger(middle)).toBe(true);
    expect(middle).toBeGreaterThan(0);
    expect(middle).toBeLessThan(100);
  });

  it("counts down as readily as up", () => {
    expect(countTween({ from: 100, to: 0, elapsedMs: 300, durationMs: 300, reduced: false })).toBe(0);
  });
});

describe("phaseLabel", () => {
  it("says nothing has run when there is no run", () => {
    expect(phaseLabel(undefined, STRINGS)).toEqual({ phase: "idle", text: STRINGS.notRunYet, tone: "idle" });
  });

  it("says running while the host is running", () => {
    const label = phaseLabel(run({ phase: "running", status: "running", counts: { passed: 8, failed: 2, skipped: 0, total: 10 } }), STRINGS);

    expect(label.phase).toBe("running");
    expect(label.text).toBe(STRINGS.running);
    expect(label.tone).toBe("idle");
  });

  it("counts the failures once a run finished red", () => {
    const label = phaseLabel(run(), STRINGS);

    expect(label.phase).toBe("finished");
    expect(label.text).toBe(`3 ${STRINGS.failing}`);
    // The failure count is the one red thing in the header.
    expect(label.tone).toBe("failed");
  });

  it("says finished plainly when a run finished green", () => {
    const label = phaseLabel(run({ status: "passed", counts: { passed: 145, failed: 0, skipped: 0, total: 145 } }), STRINGS);

    expect(label.phase).toBe("finished");
    expect(label.text).toBe(STRINGS.finished);
    expect(label.tone).toBe("passed");
  });

  it("says rerunning when a scoped run is going over an existing result", () => {
    const label = phaseLabel(
      run({ phase: "running", status: "running", scope: { kind: "file", path: "test/hero.test.ts" }, runNumber: 2 }),
      STRINGS,
    );

    expect(label.phase).toBe("rerunning");
    expect(label.text).toContain(STRINGS.rerunning);
  });

  it("says rerunning for a full rerun too, because the run number moved", () => {
    const label = phaseLabel(run({ phase: "running", status: "running", runNumber: 3 }), STRINGS);

    expect(label.phase).toBe("rerunning");
  });

  it("reports a cancelled run as finished, since the process is over", () => {
    expect(phaseLabel(run({ phase: "cancelled", status: "cancelled" }), STRINGS).phase).toBe("finished");
  });
});

describe("elapsedOf", () => {
  it("uses the run's own elapsed time once it settled", () => {
    expect(elapsedOf(run(), 99_999)).toBe(12_400);
  });

  it("measures from the start while it is still going", () => {
    const started = new Date(1_000_000).toISOString();
    const running = run({ phase: "running", status: "running", startedAt: started, elapsedMs: 0 });

    expect(elapsedOf(running, 1_004_500)).toBe(4_500);
  });

  it("never goes backwards when the clock is behind the start", () => {
    const started = new Date(2_000_000).toISOString();
    const running = run({ phase: "running", status: "running", startedAt: started, elapsedMs: 0 });

    expect(elapsedOf(running, 1_000_000)).toBe(0);
  });

  it("is zero with no run at all", () => {
    expect(elapsedOf(undefined, 5_000)).toBe(0);
  });
});

describe("runMeta", () => {
  it("labels a first run with its number, its case count and its duration", () => {
    expect(runMeta(run(), STRINGS)).toBe("Run 1 · 145 tests · 12.4s");
  });

  it("labels a rerun with the rerun wording and its own duration", () => {
    const meta = runMeta(run({ runNumber: 2, elapsedMs: 800 }), STRINGS);

    expect(meta).toBe("Rerun · 0.8s");
  });

  it("is empty with no run", () => {
    expect(runMeta(undefined, STRINGS)).toBe("");
  });
});

describe("stackedSeries", () => {
  it("turns the cumulative buckets into one stack per second", () => {
    const chart = stackedSeries(run().series, { width: 100, height: 50 });

    // 10 then +30 then +50; the last second carries two failures.
    expect(chart.buckets.map(bucket => [bucket.passed, bucket.failed])).toEqual([
      [10, 0],
      [30, 0],
      [48, 2],
    ]);
    expect(chart.buckets[0]?.x).toBe(0);
    expect(chart.buckets[2]?.x).toBe(100);
    expect(chart.max).toBe(50);
    expect(chart.passedTop).toHaveLength(3);
    expect(chart.failedTop).toHaveLength(3);
  });

  it("raises a lone failure to a tenth of the stack so its shape stays visible", () => {
    const chart = stackedSeries([{ tMs: 0, finished: 1001, passed: 1000, failed: 1 }], { width: 100, height: 50 });

    const bucket = chart.buckets[0];
    expect(bucket?.failed).toBe(1);
    expect(bucket?.shownFailed).toBeCloseTo(100.1, 5);
    expect(bucket?.shownPassed).toBeCloseTo(900.9, 5);
    expect(bucket?.compressed).toBe(true);
  });

  it("keeps a failure that is already above the floor at its real height", () => {
    const chart = stackedSeries([{ tMs: 0, finished: 30, passed: 25, failed: 5 }], { width: 100, height: 50 });

    const bucket = chart.buckets[0];
    expect(bucket?.shownFailed).toBe(5);
    expect(bucket?.shownPassed).toBe(25);
    expect(bucket?.compressed).toBe(false);
  });

  it("draws nothing for an empty series", () => {
    expect(stackedSeries([], { width: 100, height: 50 })).toEqual({
      buckets: [],
      max: 0,
      passedTop: [],
      failedTop: [],
    });
  });

  it("survives a single bucket without dividing by zero", () => {
    const chart = stackedSeries([{ tMs: 0, finished: 5, passed: 5, failed: 0 }], { width: 100, height: 50 });

    expect(chart.buckets).toHaveLength(1);
    expect(Number.isFinite(chart.passedTop[0]?.y)).toBe(true);
    // One bucket is a whole-run rate, so its band fills the plot rather than
    // drawing a single vertical line at the left edge.
    expect(chart.passedTop.map(point => point.x)).toEqual([0, 100]);
    expect(chart.max).toBe(5);
  });
});

describe("bucketIndexAt", () => {
  it("rounds to the nearest bucket across the plot", () => {
    expect(bucketIndexAt(0, 3)).toBe(0);
    expect(bucketIndexAt(0.4, 3)).toBe(1);
    expect(bucketIndexAt(0.8, 3)).toBe(2);
  });

  it("clamps outside the plot and collapses a single bucket", () => {
    expect(bucketIndexAt(-1, 3)).toBe(0);
    expect(bucketIndexAt(2, 3)).toBe(2);
    expect(bucketIndexAt(0.5, 1)).toBe(0);
  });
});

describe("bucketOfSeries", () => {
  it("reports the peak of the per-second deltas, not of the cumulative total", () => {
    // 10, then +30, then +50: the busiest second finished 50.
    expect(bucketOfSeries(run().series)).toBe(50);
  });

  it("is zero for an empty series", () => {
    expect(bucketOfSeries([])).toBe(0);
  });
});

describe("caseTickStates", () => {
  /** The snapshot's own cases for one file, before any run touched them. */
  const SNAPSHOT_CASES = [
    { name: "one", status: "passed" as const },
    { name: "two", status: "passed" as const },
    { name: "three", status: "failed" as const },
  ];

  it("leaves every tick unrun before a run reports anything", () => {
    // `running` is what makes the row grey: without a run in flight the snapshot
    // is the only reading there is, and showing it grey would hide a result.
    const ticks = caseTickStates({ snapshotCases: SNAPSHOT_CASES, runCases: [], scope: undefined, running: true });

    expect(ticks.map(tick => tick.state)).toEqual(["unrun", "unrun", "unrun"]);
  });

  it("shows the snapshot's own reading when no run is in flight", () => {
    const ticks = caseTickStates({ snapshotCases: SNAPSHOT_CASES, runCases: [], scope: undefined });

    expect(ticks.map(tick => tick.state)).toEqual(["passed", "passed", "failed"]);
  });

  it("lights a tick as its case arrives, in completion order", () => {
    const ticks = caseTickStates({
      snapshotCases: SNAPSHOT_CASES,
      runCases: [{ path: "f", name: "one", status: "passed", durationMs: 1, atMs: 100 }],
      scope: undefined,
      running: true,
    });

    expect(ticks.map(tick => tick.state)).toEqual(["passed", "unrun", "unrun"]);
  });

  it("carries a failure through as its own state", () => {
    const ticks = caseTickStates({
      snapshotCases: SNAPSHOT_CASES,
      runCases: [
        { path: "f", name: "one", status: "passed", durationMs: 1, atMs: 100 },
        { path: "f", name: "three", status: "failed", durationMs: 2, atMs: 200 },
      ],
      scope: undefined,
      running: true,
    });

    expect(ticks.map(tick => tick.state)).toEqual(["passed", "unrun", "failed"]);
  });

  it("appends a case the snapshot never had, at the end of the row", () => {
    const ticks = caseTickStates({
      snapshotCases: SNAPSHOT_CASES,
      runCases: [{ path: "f", name: "brand new", status: "passed", durationMs: 1, atMs: 100 }],
      scope: undefined,
    });

    expect(ticks).toHaveLength(4);
    expect(ticks[3]).toMatchObject({ name: "brand new", state: "passed" });
  });

  it("keeps a skipped case visually distinct from a pass", () => {
    const ticks = caseTickStates({
      snapshotCases: SNAPSHOT_CASES,
      runCases: [{ path: "f", name: "one", status: "skipped", durationMs: 0, atMs: 100 }],
      scope: undefined,
    });

    expect(ticks[0]?.state).toBe("skipped");
  });

  it("scans a rerun's scope back to unrun before the new events arrive", () => {
    // A rerun of one file: that file's ticks go grey again, the others keep
    // their last reading. This is the "sweep back" the reference shows.
    const ticks = caseTickStates({
      snapshotCases: SNAPSHOT_CASES,
      runCases: [],
      scope: { kind: "file", path: "f" },
      rerunning: true,
      running: true,
    });

    expect(ticks.map(tick => tick.state)).toEqual(["unrun", "unrun", "unrun"]);
  });

  it("leaves other files alone during a scoped rerun", () => {
    const ticks = caseTickStates({
      snapshotCases: SNAPSHOT_CASES,
      runCases: [],
      scope: { kind: "file", path: "other" },
      rerunning: true,
      running: true,
      path: "f",
    });

    // The scope names a different file, so this row keeps its last reading.
    expect(ticks.map(tick => tick.state)).toEqual(["passed", "passed", "failed"]);
  });
});

describe("tickDelayMs", () => {
  it("staggers ticks inside one file so they light in sequence", () => {
    expect(tickDelayMs(0)).toBe(0);
    expect(tickDelayMs(1)).toBeGreaterThan(tickDelayMs(0));
    expect(tickDelayMs(2)).toBeGreaterThan(tickDelayMs(1));
  });

  it("keeps the stagger inside the 20-40ms band the spec asks for", () => {
    expect(tickDelayMs(1) - tickDelayMs(0)).toBeGreaterThanOrEqual(20);
    expect(tickDelayMs(1) - tickDelayMs(0)).toBeLessThanOrEqual(40);
  });

  it("caps the total so a long file does not take a second to finish lighting", () => {
    expect(tickDelayMs(500)).toBeLessThanOrEqual(400);
  });
});

describe("isReducedMotion", () => {
  it("reads the media query when the environment has one", () => {
    expect(isReducedMotion({ matches: true })).toBe(true);
    expect(isReducedMotion({ matches: false })).toBe(false);
  });

  it("treats a missing media query as motion allowed", () => {
    // jsdom's matchMedia is absent or always false; the board must still render.
    expect(isReducedMotion(undefined)).toBe(false);
  });
});

describe("defaultMotion", () => {
  it("is the full-motion configuration", () => {
    const motion = defaultMotion({ matches: false });

    expect(motion.reduced).toBe(false);
    expect(motion.countMs).toBeGreaterThan(200);
    expect(motion.countMs).toBeLessThanOrEqual(350);
  });

  it("collapses every duration to zero under reduced motion", () => {
    const motion = defaultMotion({ matches: true });

    expect(motion.reduced).toBe(true);
    expect(motion.countMs).toBe(0);
    expect(motion.tickMs).toBe(0);
    expect(motion.phaseMs).toBe(0);
  });
});

describe("MotionInput", () => {
  it("is the shape the view hands the motion layer", () => {
    // A compile-time assertion with a runtime body: if the interface drifts, the
    // assignment stops type-checking and this test stops building.
    const input: MotionInput = { run: run(), nowMs: 5_000, reduced: false };

    expect(input.run?.runNumber).toBe(1);
  });
});

/**
 * What one row's right-hand reading should say.
 *
 * The board renders rows from the snapshot, and the snapshot carries the last
 * run's numbers. During a run those numbers are stale: a file the current run
 * has not reached yet would still show the previous run's duration and its red
 * "1 failed", which reads as a result this run has already produced. The row
 * reading is what decides between "show the snapshot", "show this run's own
 * numbers" and "show nothing yet".
 */
describe("rowReading", () => {
  /** One file's cases as the current run reported them. */
  const reported = (statuses: readonly ("passed" | "failed")[]) =>
    statuses.map((status, index) => ({
      path: "test/a.test.ts",
      name: `case ${String(index)}`,
      status,
      durationMs: 10,
      atMs: index * 100,
    }));

  it("shows the snapshot's duration when nothing is running", () => {
    const reading = rowReading({
      snapshotDurationMs: 16_000,
      snapshotFailed: 0,
      snapshotCaseCount: 3,
      runCases: [],
      running: false,
      inScope: true,
    });

    expect(reading).toEqual({ kind: "duration", durationMs: 16_000 });
  });

  it("shows the snapshot's failure count when nothing is running", () => {
    const reading = rowReading({
      snapshotDurationMs: 16_000,
      snapshotFailed: 1,
      snapshotCaseCount: 3,
      runCases: [],
      running: false,
      inScope: true,
    });

    expect(reading).toEqual({ kind: "failed", failed: 1 });
  });

  it("shows nothing for a row the current run has not reached", () => {
    const reading = rowReading({
      snapshotDurationMs: 16_000,
      snapshotFailed: 1,
      snapshotCaseCount: 3,
      runCases: [],
      running: true,
      inScope: true,
    });

    // The stale 16s and the stale "1 failed" are exactly what must not appear.
    expect(reading).toEqual({ kind: "pending" });
  });

  it("keeps showing nothing while the file is still being reported", () => {
    const reading = rowReading({
      snapshotDurationMs: 16_000,
      snapshotFailed: 1,
      snapshotCaseCount: 3,
      runCases: reported(["passed", "passed"]),
      running: true,
      inScope: true,
    });

    expect(reading).toEqual({ kind: "pending" });
  });

  it("shows this run's own duration once the file's cases are all in", () => {
    const reading = rowReading({
      snapshotDurationMs: 16_000,
      snapshotFailed: 1,
      snapshotCaseCount: 3,
      runCases: reported(["passed", "passed", "passed"]),
      running: true,
      inScope: true,
    });

    // 3 cases at 10ms each, and no failure this time.
    expect(reading).toEqual({ kind: "duration", durationMs: 30 });
  });

  it("shows this run's own failure count once the file's cases are all in", () => {
    const reading = rowReading({
      snapshotDurationMs: 16_000,
      snapshotFailed: 0,
      snapshotCaseCount: 3,
      runCases: reported(["passed", "failed", "passed"]),
      running: true,
      inScope: true,
    });

    expect(reading).toEqual({ kind: "failed", failed: 1 });
  });

  it("leaves a row outside a scoped run alone", () => {
    const reading = rowReading({
      snapshotDurationMs: 16_000,
      snapshotFailed: 1,
      snapshotCaseCount: 3,
      runCases: [],
      running: true,
      inScope: false,
    });

    // A scoped rerun does not touch this file, so its last reading stands.
    expect(reading).toEqual({ kind: "failed", failed: 1 });
  });
});

describe("phaseLabel: finished counts", () => {
  it("reports the merged snapshot's failures, not the last run's scope", () => {
    // A rerun of three cases settles green, but the board still holds other
    // files. The header is about the board, not about the run that just ended.
    const label = phaseLabel(run({ phase: "finished", status: "passed", counts: { passed: 3, failed: 0, skipped: 0, total: 3 } }), STRINGS, undefined, {
      failed: 2,
    });

    expect(label.text).toBe(`2 ${STRINGS.failing}`);
    expect(label.tone).toBe("failed");
  });

  it("says finished when the merged snapshot has no failures left", () => {
    const label = phaseLabel(run({ phase: "finished", status: "passed", counts: { passed: 3, failed: 0, skipped: 0, total: 3 } }), STRINGS, undefined, {
      failed: 0,
    });

    expect(label.text).toBe(STRINGS.finished);
    expect(label.tone).toBe("passed");
  });

  it("falls back to the run's own count when no snapshot figure is given", () => {
    expect(phaseLabel(run(), STRINGS).text).toBe(`3 ${STRINGS.failing}`);
  });
});
