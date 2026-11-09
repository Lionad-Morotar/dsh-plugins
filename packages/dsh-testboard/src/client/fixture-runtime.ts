/**
 * The preview's runtime: a demo loop over the committed snapshot.
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
 * sweeps the failed file back to grey and relights it green, and the finished
 * stage holds before starting over.
 */
import type { TestSnapshot } from "./model.ts";
import type { SourceBundle } from "./source.ts";
import type { TestboardRuntime } from "./runtime.ts";
import type { RunProgress, TestboardState } from "../shared.ts";

/** What the fixture runtime serves. */
export interface FixtureRuntimeOptions {
  readonly snapshot: TestSnapshot;
  readonly sources: SourceBundle;
  /**
   * How long one demo cycle's running stage lasts.
   *
   * Short enough that a reader watching the preview sees the whole arc without
   * waiting, long enough that the tick-by-tick lighting is visible rather than a
   * flicker. The demo is the only place these numbers matter.
   */
  readonly runDurationMs?: number;
  /** Whether the demo loop starts on its own. Defaults to true. */
  readonly autoStart?: boolean;
  /** The model name the fixing card shows. */
  readonly modelName?: string;
}

/** The default length of one demo stage. */
const DEMO_RUN_MS = 2600;

/** How long the fixing stage holds before the rerun starts. */
const DEMO_FIX_MS = 1800;

/** How long the finished stage holds before the loop restarts. */
const DEMO_HOLD_MS = 2200;

/** How often the demo publishes a new state while it is running. */
const DEMO_TICK_MS = 60;

/**
 * The demo's simulated throughput, in cases per second.
 *
 * This is what the chart's y axis is scaled against. A real suite of this size
 * finishes tens of cases a second; the demo's own clock is compressed, so the
 * buckets are laid out against this figure instead of against wall time.
 */
const DEMO_CASES_PER_SECOND = 40;

/** The model the fixing card names. */
const DEMO_MODEL = "claude-sonnet-5.5";

/**
 * Build the runtime the preview page uses.
 *
 * This is a demonstration surface, and it is the only place the board invents
 * data. It answers the same interface the HTTP runtime does, so the view has one
 * data path and the preview stays evidence about the real tab rather than a
 * second implementation of it.
 *
 * The loop is the reference's narration: a run lights up case by case, a fixing
 * stage shows the card the real host cannot produce (D18: the host has no agent
 * repair events, so inventing them online would be fake information), a rerun
 * sweeps the failed file back to grey and relights it green, and the finished
 * stage holds before starting over.
 *
 * @param options - the snapshot, the source bundle and the demo's pacing.
 * @returns the runtime.
 */
export function createFixtureRuntime(options: FixtureRuntimeOptions): TestboardRuntime {
  const runDurationMs = options.runDurationMs ?? DEMO_RUN_MS;
  const modelName = options.modelName ?? DEMO_MODEL;
  const snapshot = options.snapshot;

  /** Every case in the snapshot, in the order the demo will finish them. */
  const allCases = snapshot.packages.flatMap(pkg =>
    pkg.files.flatMap(file => file.cases.map(entry => ({ path: file.path, name: entry.name, status: entry.status }))),
  );
  /** The cases the demo reports as failing on the first pass. */
  const failing = allCases.filter(entry => entry.status === "failed");
  /** The file the fixing card names, which is the first one with a failure. */
  const fixingPath = failing[0]?.path ?? allCases[0]?.path ?? "";

  let run: RunProgress | undefined;
  let runCount = 0;
  let startedAtMs = 0;
  let reported = 0;
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

  /** Publish the run as the demo's clock says it should look right now. */
  function publish(): void {
    if (run === undefined) return;
    const elapsedMs = Date.now() - startedAtMs;
    const cases = allCases.slice(0, reported).map((entry, index) => ({
      path: entry.path,
      name: entry.name,
      status: entry.status,
      durationMs: 1 + (index % 5),
      atMs: Math.round((index / Math.max(1, allCases.length)) * elapsedMs),
    }));
    const counts = { passed: 0, failed: 0, skipped: 0, total: cases.length };
    for (const entry of cases) {
      if (entry.status === "failed") counts.failed += 1;
      else if (entry.status === "skipped") counts.skipped += 1;
      else counts.passed += 1;
    }
    // The series is the same cumulative-per-second shape the host publishes, so
    // the chart's growth animation is driven by real bucket arithmetic.
    //
    // The demo compresses a real suite's minutes into a few seconds, so the
    // buckets are laid out across a fixed span rather than across the demo's own
    // elapsed time: reading the elapsed clock would put every case in the first
    // second and report a peak in the thousands, which is a number no real run
    // produces and which makes the chart's y axis meaningless.
    const spanSeconds = Math.max(6, Math.ceil(allCases.length / DEMO_CASES_PER_SECOND));
    const progress = Math.min(1, cases.length / Math.max(1, allCases.length));
    const shownSeconds = Math.max(2, Math.ceil(spanSeconds * progress));
    const series = Array.from({ length: shownSeconds }, (_unused, second) => {
      const until = ((second + 1) / shownSeconds) * cases.length;
      const slice = cases.slice(0, Math.floor(until));
      let passed = 0;
      let failed = 0;
      for (const entry of slice) {
        if (entry.status === "failed") failed += 1;
        else if (entry.status === "passed") passed += 1;
      }
      return { tMs: second * 1000, finished: slice.length, passed, failed };
    });
    const failures = cases
      .filter(entry => entry.status === "failed")
      .map(entry => ({ tMs: entry.atMs, path: entry.path, name: entry.name }));

    run = {
      ...run,
      elapsedMs,
      completedFiles: new Set(cases.map(entry => entry.path)).size,
      counts,
      series,
      failures,
      cases,
    };
  }

  /** Move the demo to its next stage. */
  function advance(): void {
    if (disposed) return;
    if (demoPhase === "running") {
      // The first pass finished red: hold on the fixing card, which is the stage
      // the real host cannot produce.
      demoPhase = "fixing";
      publish();
      run = { ...(run as RunProgress), phase: "finished", status: "failed", finishedAt: new Date().toISOString() };
      timers.push(setTimeout(advance, DEMO_FIX_MS));
      return;
    }
    if (demoPhase === "fixing") {
      // The rerun: the failed file's ticks sweep back to grey, then relight.
      demoPhase = "rerunning";
      runCount += 1;
      startedAtMs = Date.now();
      reported = 0;
      run = {
        runId: `demo-run-${String(runCount)}`,
        scope: { kind: "file", path: fixingPath },
        status: "running",
        phase: "running",
        runNumber: runCount,
        startedAt: new Date(startedAtMs).toISOString(),
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
        reported = Math.min(allCases.length, reported + Math.max(1, Math.ceil(allCases.length / 24)));
        publish();
        if (reported >= allCases.length) {
          if (ticker !== undefined) clearInterval(ticker);
          ticker = undefined;
          demoPhase = "finished";
          run = {
            ...(run as RunProgress),
            phase: "finished",
            status: "passed",
            finishedAt: new Date().toISOString(),
          };
          timers.push(setTimeout(advance, DEMO_HOLD_MS));
        }
      }, DEMO_TICK_MS);
      return;
    }
    if (demoPhase === "finished") {
      startDemo();
    }
  }

  /** Begin a first pass: every case lights up in order, failures included. */
  function startDemo(): void {
    if (disposed) return;
    clearTimers();
    demoPhase = "running";
    runCount += 1;
    startedAtMs = Date.now();
    reported = 0;
    run = {
      runId: `demo-run-${String(runCount)}`,
      scope: { kind: "all" },
      status: "running",
      phase: "running",
      runNumber: runCount,
      startedAt: new Date(startedAtMs).toISOString(),
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
      reported = Math.min(allCases.length, reported + Math.max(1, Math.ceil(allCases.length / 28)));
      publish();
      if (reported >= allCases.length) {
        if (ticker !== undefined) clearInterval(ticker);
        ticker = undefined;
        timers.push(setTimeout(advance, 400));
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
        ? { demo: { phase: "fixing" as const, path: fixingPath, model: modelName, seconds: 3 } }
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
        demoPhase = "fixing";
        timers.push(setTimeout(advance, 200));
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
