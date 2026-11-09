/**
 * The preview's runtime: a demo loop over a slice of the committed snapshot.
 *
 * Split out of `runtime.ts` on purpose. The startup bundle is evaluated on every
 * page boot whether or not the tab is ever opened, and the demo loop is a
 * preview-only surface: keeping it in the same module as the HTTP runtime would
 * put a few kilobytes of demonstration code in every user's boot path, because
 * a bundler cannot drop an unused export from a module it has already pulled in.
 *
 * The loop is the reference's narration: a run lights up case by case, a fixing
 * stage shows a card the real host cannot produce (D18: the host has no agent
 * repair events, so inventing them online would be fake information), a rerun
 * sweeps the failed cases back to grey and relights them green, and the finished
 * stage holds before starting over.
 *
 * The script is deliberately small and internally consistent. An earlier version
 * replayed the whole snapshot, which made the four stages disagree with each
 * other: the board showed one total while running, another while fixing, and a
 * third after the rerun. A demo whose numbers contradict themselves is worse
 * than no demo, so this one derives every stage from a single plan computed once
 * at construction.
 */
import type { TestSnapshot } from "./model.ts";
import type { SourceBundle } from "./source.ts";
import type { TestboardRuntime } from "./runtime.ts";
import type { RunProgress, TestboardState } from "../shared.ts";

/** What the fixture runtime serves. */
export interface FixtureRuntimeOptions {
  readonly snapshot: TestSnapshot;
  readonly sources: SourceBundle;
  /** Whether the demo loop starts on its own. Defaults to true. */
  readonly autoStart?: boolean;
  /** The model name the fixing card shows. */
  readonly modelName?: string;
}

/** How long the first pass takes, in wall clock. */
const DEMO_RUN_MS = 5200;

/** How long the fixing card holds before the rerun starts. */
const DEMO_FIX_MS = 2000;

/** How long the rerun takes, in wall clock. */
const DEMO_RERUN_MS = 1800;

/** How long the finished stage holds before the loop restarts. */
const DEMO_HOLD_MS = 2600;

/** How often the demo publishes a new state while a stage is running. */
const DEMO_TICK_MS = 60;

/** The model the fixing card names. */
const DEMO_MODEL = "claude-sonnet-5.5";

/** How many files the demo's slice takes from the snapshot. */
const DEMO_FILE_COUNT = 10;

/** How many cases the demo's slice aims for, matching the reference's scale. */
const DEMO_CASE_TARGET = 170;

/**
 * The per-second completion counts of the first pass.
 *
 * Hand-written rather than generated: the chart's whole job is showing that a
 * suite has a rhythm, and a formula that produced a smooth curve would read as a
 * synthetic ramp. These vary, dip where a slow file runs, and are sized so the
 * slice finishes in six seconds at 25-55 cases a second, which is what a real
 * suite of this size does. The table is scaled to the slice, so the shape
 * survives whatever the snapshot holds.
 */
const DEMO_THROUGHPUT = [26, 41, 33, 28, 38, 30];


/** One case in the demo's slice. */
interface DemoCase {
  readonly path: string;
  readonly name: string;
  /** The second of the first pass this case finishes in. */
  readonly second: number;
  /** Whether the first pass reports it as failing. */
  readonly fails: boolean;
}

/** The whole demo, computed once so every stage agrees with every other. */
interface DemoPlan {
  readonly cases: readonly DemoCase[];
  /** The per-second cumulative series of the first pass. */
  readonly series: RunProgress["series"];
  /** The cases the first pass reports as failing, in completion order. */
  readonly failing: readonly DemoCase[];
  /** The file the fixing card names. */
  readonly fixingPath: string;
  /** How many cases the run covers, which never changes across the stages. */
  readonly total: number;
}

/**
 * Build the demo's plan from a slice of the snapshot.
 *
 * The slice is taken from the front of the snapshot, which is already sorted by
 * package and path, so the demo's rows are the first few packages rather than a
 * random scatter: a reader comparing the preview with the real tab sees the same
 * files in the same order.
 *
 * @param snapshot - the committed snapshot.
 * @returns the plan every stage reads from.
 */
function planDemo(snapshot: TestSnapshot): DemoPlan {
  const files = snapshot.packages.flatMap(pkg => pkg.files).slice(0, DEMO_FILE_COUNT);

  // Take whole files until the slice is close to the target, then stop. Cutting
  // a file in half would put a row on screen whose tick count does not match its
  // case count.
  const chosen: { path: string; names: readonly string[] }[] = [];
  let taken = 0;
  for (const file of files) {
    if (taken >= DEMO_CASE_TARGET) break;
    chosen.push({ path: file.path, names: file.cases.map(entry => entry.name) });
    taken += file.cases.length;
  }

  // Lay the cases out against the throughput table. The table is a shape, not a
  // schedule: it says how the run's pace rises and falls, and it is scaled to
  // whatever the slice actually holds so the last second lands exactly on the
  // total. Using the raw numbers would leave a small slice finishing in the
  // first few seconds and every later bucket empty, which draws a chart that
  // stops halfway across.
  const tableTotal = DEMO_THROUGHPUT.reduce((sum, count) => sum + count, 0);
  const scale = tableTotal === 0 ? 1 : taken / tableTotal;
  const cases: DemoCase[] = [];
  let cursor = 0;
  let carried = 0;
  for (let second = 0; second < DEMO_THROUGHPUT.length && cursor < taken; second += 1) {
    const raw = (DEMO_THROUGHPUT[second] ?? 0) * scale + carried;
    const count = Math.floor(raw);
    carried = raw - count;
    for (let step = 0; step < count && cursor < taken; step += 1) {
      const flat = cursor;
      let remaining = flat;
      let owner = chosen[0];
      for (const file of chosen) {
        if (remaining < file.names.length) {
          owner = file;
          break;
        }
        remaining -= file.names.length;
      }
      const name = owner?.names[remaining] ?? `case ${String(flat)}`;
      cases.push({ path: owner?.path ?? "", name, second, fails: false });
      cursor += 1;
    }
  }
  // The rounding above can leave a case or two over; they join the last second
  // that has any, so the total is exactly the slice's.
  while (cursor < taken) {
    const lastSecond = cases[cases.length - 1]?.second ?? 0;
    const flat = cursor;
    let remaining = flat;
    let owner = chosen[0];
    for (const file of chosen) {
      if (remaining < file.names.length) {
        owner = file;
        break;
      }
      remaining -= file.names.length;
    }
    cases.push({ path: owner?.path ?? "", name: owner?.names[remaining] ?? `case ${String(flat)}`, second: lastSecond, fails: false });
    cursor += 1;
  }

  // The three failures are pinned to seconds that actually have cases. A fixed
  // table of seconds would silently drop a failure whenever the slice was small
  // enough to finish before that second arrived, and the demo would then claim
  // two failures where the script says three.
  const populated = [...new Set(cases.map(entry => entry.second))];
  const failing: DemoCase[] = [];
  for (const fraction of [0.25, 0.5, 0.75]) {
    const second = populated[Math.min(populated.length - 1, Math.floor(populated.length * fraction))];
    if (second === undefined) continue;
    const at = cases.findIndex(entry => entry.second === second && !entry.fails);
    if (at === -1) continue;
    const promoted = { ...(cases[at] as DemoCase), fails: true };
    cases[at] = promoted;
    failing.push(promoted);
  }

  // The cumulative series is derived from the cases themselves, so the chart and
  // the counts cannot disagree: every point is a count of what has finished.
  const series: { tMs: number; finished: number; passed: number; failed: number }[] = [];
  let finished = 0;
  let passed = 0;
  let failed = 0;
  for (let second = 0; second < DEMO_THROUGHPUT.length; second += 1) {
    for (const entry of cases) {
      if (entry.second !== second) continue;
      finished += 1;
      if (entry.fails) failed += 1;
      else passed += 1;
    }
    series.push({ tMs: second * 1000, finished, passed, failed });
  }

  return {
    cases,
    series,
    failing,
    fixingPath: failing[0]?.path ?? chosen[0]?.path ?? "",
    total: cases.length,
  };
}

/**
 * Build the runtime the preview page uses.
 *
 * This is a demonstration surface, and it is the only place the board invents
 * data. It answers the same interface the HTTP runtime does, so the view has one
 * data path and the preview stays evidence about the real tab rather than a
 * second implementation of it.
 *
 * @param options - the snapshot, the source bundle and the demo's pacing.
 * @returns the runtime.
 */
export function createFixtureRuntime(options: FixtureRuntimeOptions): TestboardRuntime {
  const modelName = options.modelName ?? DEMO_MODEL;
  const snapshot = options.snapshot;
  const plan = planDemo(snapshot);

  let run: RunProgress | undefined;
  let runCount = 0;
  let stageStartedMs = 0;
  let timers: ReturnType<typeof setTimeout>[] = [];
  let ticker: ReturnType<typeof setInterval> | undefined;
  let disposed = false;

  /** The demo's own phase, which is richer than the wire's. */
  let demoPhase: "idle" | "running" | "fixing" | "rerunning" | "finished" = "idle";

  function clearTimers(): void {
    for (const timer of timers) clearTimeout(timer);
    timers = [];
    if (ticker !== undefined) {
      clearInterval(ticker);
      ticker = undefined;
    }
  }

  /** The cases of the first pass that have finished by `elapsedMs`. */
  function finishedBy(elapsedMs: number): DemoCase[] {
    const spanMs = DEMO_RUN_MS;
    return plan.cases.filter(entry => (entry.second / DEMO_THROUGHPUT.length) * spanMs <= elapsedMs);
  }

  /** Build one case event, with the moment it landed. */
  function eventOf(entry: DemoCase, atMs: number, fails: boolean): RunProgress["cases"][number] {
    return {
      path: entry.path,
      name: entry.name,
      status: fails ? "failed" : "passed",
      durationMs: 1 + (entry.second % 5),
      atMs: Math.round(atMs),
    };
  }

  /** Publish the first pass as its clock says it should look right now. */
  function publishRunning(): void {
    if (run === undefined) return;
    const elapsedMs = Math.min(DEMO_RUN_MS, Date.now() - stageStartedMs);
    const done = finishedBy(elapsedMs);
    const cases = done.map(entry => eventOf(entry, (entry.second / DEMO_THROUGHPUT.length) * DEMO_RUN_MS, entry.fails));
    let passed = 0;
    let failed = 0;
    for (const entry of cases) {
      if (entry.status === "failed") failed += 1;
      else passed += 1;
    }
    // The series is clipped to the seconds already played, so the chart's line
    // grows with the run rather than showing its final shape from the start.
    const playedSeconds = Math.max(1, Math.ceil((elapsedMs / DEMO_RUN_MS) * DEMO_THROUGHPUT.length));
    const series = plan.series.slice(0, playedSeconds);
    const failures = cases
      .filter(entry => entry.status === "failed")
      .map(entry => ({ tMs: entry.atMs, path: entry.path, name: entry.name }));

    run = {
      ...run,
      elapsedMs,
      completedFiles: new Set(cases.map(entry => entry.path)).size,
      counts: { passed, failed, skipped: 0, total: cases.length },
      series,
      failures,
      cases,
    };
  }

  /** The first pass's settled result: everything finished, three red. */
  function settleFirstPass(): void {
    if (run === undefined) return;
    const cases = plan.cases.map(entry => eventOf(entry, (entry.second / DEMO_THROUGHPUT.length) * DEMO_RUN_MS, entry.fails));
    let passed = 0;
    let failed = 0;
    for (const entry of cases) {
      if (entry.status === "failed") failed += 1;
      else passed += 1;
    }
    run = {
      ...run,
      phase: "finished",
      status: "failed",
      finishedAt: new Date().toISOString(),
      elapsedMs: DEMO_RUN_MS,
      completedFiles: new Set(cases.map(entry => entry.path)).size,
      counts: { passed, failed, skipped: 0, total: plan.total },
      series: plan.series,
      failures: plan.failing.map(entry => ({
        tMs: (entry.second / DEMO_THROUGHPUT.length) * DEMO_RUN_MS,
        path: entry.path,
        name: entry.name,
      })),
      cases,
    };
  }

  /** Move the demo to its next stage. */
  function advance(): void {
    if (disposed) return;

    if (demoPhase === "running") {
      settleFirstPass();
      demoPhase = "fixing";
      timers.push(setTimeout(advance, DEMO_FIX_MS));
      return;
    }

    if (demoPhase === "fixing") {
      startRerun();
      return;
    }

    // `rerunning` has no branch here on purpose: the rerun's own ticker settles
    // it and schedules this call, so a branch would settle it twice.

    if (demoPhase === "finished") {
      startDemo();
    }
  }

  /**
   * The rerun: only the three failed cases run again.
   *
   * The scope is the file the first failure lives in, and the counts start from
   * zero because this is a new run: the board's totals for a scoped run are that
   * run's, not the previous one's. What stays fixed is the board's rows, which
   * keep their last reading for every case outside the scope.
   */
  function startRerun(): void {
    demoPhase = "rerunning";
    runCount += 1;
    stageStartedMs = Date.now();
    const scopePath = plan.fixingPath;
    run = {
      runId: `demo-run-${String(runCount)}`,
      scope: { kind: "file", path: scopePath },
      status: "running",
      phase: "running",
      runNumber: runCount,
      startedAt: new Date(stageStartedMs).toISOString(),
      elapsedMs: 0,
      completedFiles: 0,
      totalFiles: 1,
      counts: { passed: 0, failed: 0, skipped: 0, total: 0 },
      series: [],
      failures: [],
      cases: [],
    };
    ticker = setInterval(() => {
      if (disposed) return;
      const elapsedMs = Math.min(DEMO_RERUN_MS, Date.now() - stageStartedMs);
      const progress = elapsedMs / DEMO_RERUN_MS;
      // Rounded up, not down: a rerun that is 99% done has finished its last
      // case, and flooring would leave the board reporting two of three right
      // up to the moment the stage settles.
      const doneCount = Math.min(plan.failing.length, Math.ceil(progress * plan.failing.length));
      const cases = plan.failing.slice(0, doneCount).map((entry, index) =>
        eventOf(entry, (index / Math.max(1, plan.failing.length)) * DEMO_RERUN_MS, false),
      );
      const seconds = Math.max(1, Math.ceil(progress * 3));
      const series = Array.from({ length: seconds }, (_unused, second) => {
        const until = ((second + 1) / seconds) * cases.length;
        const slice = cases.slice(0, Math.floor(until));
        return { tMs: second * 1000, finished: slice.length, passed: slice.length, failed: 0 };
      });
      run = {
        ...(run as RunProgress),
        elapsedMs,
        completedFiles: cases.length > 0 ? 1 : 0,
        counts: { passed: cases.length, failed: 0, skipped: 0, total: cases.length },
        series,
        failures: [],
        cases,
      };
      if (doneCount >= plan.failing.length) {
        if (ticker !== undefined) clearInterval(ticker);
        ticker = undefined;
        // The stage is over, so it has to be settled and the next one scheduled.
        // Leaving the phase flipped while the run still reads `running` is what
        // made the demo freeze on a half-finished rerun: the board kept polling
        // a run that would never advance.
        settleRerun();
        demoPhase = "finished";
        timers.push(setTimeout(advance, DEMO_HOLD_MS));
      }
    }, DEMO_TICK_MS);
  }

  /** The rerun's settled result: the three cases are green and nothing is red. */
  function settleRerun(): void {
    if (run === undefined) return;
    const cases = plan.failing.map((entry, index) =>
      eventOf(entry, (index / Math.max(1, plan.failing.length)) * DEMO_RERUN_MS, false),
    );
    run = {
      ...run,
      phase: "finished",
      status: "passed",
      finishedAt: new Date().toISOString(),
      elapsedMs: DEMO_RERUN_MS,
      completedFiles: 1,
      counts: { passed: cases.length, failed: 0, skipped: 0, total: cases.length },
      series: [{ tMs: 0, finished: cases.length, passed: cases.length, failed: 0 }],
      failures: [],
      cases,
    };
  }

  /** Begin a first pass: every case lights up in order, failures included. */
  function startDemo(): void {
    if (disposed) return;
    clearTimers();
    demoPhase = "running";
    runCount += 1;
    stageStartedMs = Date.now();
    run = {
      runId: `demo-run-${String(runCount)}`,
      scope: { kind: "all" },
      status: "running",
      phase: "running",
      runNumber: runCount,
      startedAt: new Date(stageStartedMs).toISOString(),
      elapsedMs: 0,
      completedFiles: 0,
      totalFiles: null,
      counts: { passed: 0, failed: 0, skipped: 0, total: 0 },
      series: [],
      failures: [],
      cases: [],
    };
    ticker = setInterval(() => {
      if (disposed) return;
      publishRunning();
      if (Date.now() - stageStartedMs >= DEMO_RUN_MS) {
        if (ticker !== undefined) clearInterval(ticker);
        ticker = undefined;
        advance();
      }
    }, DEMO_TICK_MS);
  }

  if (options.autoStart !== false) {
    // Started synchronously, not on a timer. The view only polls while the host
    // reports a running run (S4's contract), so a demo that began after the
    // first `loadState` would never be discovered: the board would sit on its
    // idle state forever while the loop ran unseen behind it.
    startDemo();
  }

  function stateOf(): TestboardState {
    return {
      workspace: "dsh-plugins",
      workspaceName: "dsh-plugins",
      snapshot,
      ...(run === undefined ? {} : { run }),
      // The demo's own stage travels beside the wire shape: the fixing card is
      // not a run phase the host has, so it cannot be one here either.
      ...(demoPhase === "fixing"
        ? {
            demo: {
              phase: "fixing" as const,
              path: plan.fixingPath,
              model: modelName,
              seconds: Math.floor(DEMO_FIX_MS / 1000),
            },
          }
        : demoPhase === "idle"
          ? {}
          : { demo: { phase: demoPhase } }),
    };
  }

  return {
    async loadState() {
      return stateOf();
    },

    async startRun(_sessionId, scope) {
      if (run?.phase === "running") return { ok: false, error: "busy" };
      clearTimers();
      if (scope.kind === "file") {
        startRerun();
      } else {
        startDemo();
      }
      return { ok: true, runId: run?.runId ?? "demo-run" };
    },

    async cancelRun() {
      if (run === undefined || run.phase !== "running") return false;
      clearTimers();
      demoPhase = "idle";
      run = { ...run, status: "cancelled", phase: "cancelled", finishedAt: new Date().toISOString() };
      return true;
    },

    async loadSource(_sessionId, path) {
      const text = options.sources.files[path];
      if (typeof text !== "string") throw new Error(`fixture has no source for ${path}`);
      return text;
    },
  };
}
