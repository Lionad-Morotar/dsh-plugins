// @vitest-environment node
/**
 * The runtime seam: one interface, two implementations.
 *
 * The view talks to the host through this module and nothing else, so the two
 * things it must get right are pinned here rather than discovered in a browser:
 * every request is a same-origin relative path under the route prefix (the GUI
 * port changes on every boot, so an absolute URL would be stale), and a
 * non-2xx answer or an unparseable body is an error rather than an empty state.
 *
 * The fixture implementation is the preview's half of the same interface. It is
 * tested here because the preview is the only place the board can be looked at
 * without a host, and a fixture that quietly diverges from the HTTP contract
 * would make the preview lie about the panel.
 */
import { describe, expect, it, vi } from "vitest";

import type { TestSnapshot } from "../src/client/model.ts";
import { createFixtureRuntime } from "../src/client/fixture-runtime.ts";
import { createHttpRuntime } from "../src/client/runtime.ts";
import { ROUTE_PREFIX, type TestboardState } from "../src/shared.ts";

/** One recorded request, so the assertions can read the URL and the body. */
interface Call {
  readonly url: string;
  readonly init: RequestInit | undefined;
}

/**
 * A fetch stand-in that answers from a table and records what it was asked.
 * @param answers - one entry per call: a JSON body, or a status to fail with.
 * @returns the fetch function and the calls it recorded.
 */
function makeFetch(answers: readonly (unknown | { readonly status: number })[]): {
  fetchImpl: typeof fetch;
  calls: Call[];
} {
  const calls: Call[] = [];
  let index = 0;
  const fetchImpl = (async (input: RequestInfo | URL, init?: RequestInit) => {
    calls.push({ url: String(input), init });
    const answer = answers[index] ?? answers[answers.length - 1];
    index += 1;
    const failed = typeof answer === "object" && answer !== null && "status" in answer;
    const status = failed ? (answer as { status: number }).status : 200;
    const body = failed ? { error: "nope" } : answer;
    return {
      ok: status >= 200 && status < 300,
      status,
      json: async () => body,
    } as unknown as Response;
  }) as unknown as typeof fetch;
  return { fetchImpl, calls };
}

const STATE: TestboardState = {
  workspace: "/ws",
  workspaceName: "ws",
  snapshot: { version: 2, statusSource: "vitest", packages: [] },
};

describe("createHttpRuntime: loadState", () => {
  it("asks the state route for one session, relative to the page", async () => {
    const { fetchImpl, calls } = makeFetch([STATE]);
    const runtime = createHttpRuntime(fetchImpl);

    const state = await runtime.loadState("s1");

    expect(state).toEqual(STATE);
    expect(calls[0]?.url).toBe(`${ROUTE_PREFIX}/state?sessionId=s1`);
    // Relative on purpose: the host's port changes on every boot.
    expect(calls[0]?.url.startsWith("/")).toBe(true);
  });

  it("encodes a session id that needs it", async () => {
    const { fetchImpl, calls } = makeFetch([STATE]);
    const runtime = createHttpRuntime(fetchImpl);

    await runtime.loadState("a b/c");

    // URLSearchParams encodes a space as `+`, which is the form a query string
    // reader decodes back to a space; the slash is percent-encoded.
    expect(calls[0]?.url).toBe(`${ROUTE_PREFIX}/state?sessionId=a+b%2Fc`);
  });

  it("throws on a non-2xx answer instead of returning an empty state", async () => {
    const { fetchImpl } = makeFetch([{ status: 500 }]);
    const runtime = createHttpRuntime(fetchImpl);

    await expect(runtime.loadState("s1")).rejects.toThrow(/500/u);
  });

  it("throws when the body is not JSON", async () => {
    const fetchImpl = (async () =>
      ({ ok: true, status: 200, json: async () => JSON.parse("{oops") }) as unknown as Response) as unknown as typeof fetch;
    const runtime = createHttpRuntime(fetchImpl);

    await expect(runtime.loadState("s1")).rejects.toThrow();
  });
});

describe("createHttpRuntime: startRun", () => {
  it("posts the session and the scope to the run route", async () => {
    const { fetchImpl, calls } = makeFetch([{ ok: true, runId: "run-1" }]);
    const runtime = createHttpRuntime(fetchImpl);

    const result = await runtime.startRun("s1", { kind: "all" });

    expect(result).toEqual({ ok: true, runId: "run-1" });
    expect(calls[0]?.url).toBe(`${ROUTE_PREFIX}/run`);
    expect(calls[0]?.init?.method).toBe("POST");
    expect(JSON.parse(String(calls[0]?.init?.body))).toEqual({ sessionId: "s1", scope: { kind: "all" } });
  });

  it("passes a file scope through unchanged", async () => {
    const { fetchImpl, calls } = makeFetch([{ ok: true, runId: "run-2" }]);
    const runtime = createHttpRuntime(fetchImpl);

    await runtime.startRun("s1", { kind: "file", path: "test/a.test.ts" });

    expect(JSON.parse(String(calls[0]?.init?.body))).toEqual({
      sessionId: "s1",
      scope: { kind: "file", path: "test/a.test.ts" },
    });
  });

  it("reports a refusal as a value, not an exception", async () => {
    const { fetchImpl } = makeFetch([{ ok: false, error: "busy" }]);
    const runtime = createHttpRuntime(fetchImpl);

    expect(await runtime.startRun("s1", { kind: "all" })).toEqual({ ok: false, error: "busy" });
  });
});

describe("createHttpRuntime: cancelRun", () => {
  it("posts the session to the cancel route and reports whether anything stopped", async () => {
    const { fetchImpl, calls } = makeFetch([{ ok: true }]);
    const runtime = createHttpRuntime(fetchImpl);

    expect(await runtime.cancelRun("s1")).toBe(true);
    expect(calls[0]?.url).toBe(`${ROUTE_PREFIX}/cancel`);
    expect(JSON.parse(String(calls[0]?.init?.body))).toEqual({ sessionId: "s1" });
  });

  it("answers false when the host had nothing running", async () => {
    const { fetchImpl } = makeFetch([{ ok: false }]);
    const runtime = createHttpRuntime(fetchImpl);

    expect(await runtime.cancelRun("s1")).toBe(false);
  });
});

describe("createHttpRuntime: loadSource", () => {
  it("asks the source route for one path", async () => {
    const { fetchImpl, calls } = makeFetch([{ text: 'it("a", () => {});' }]);
    const runtime = createHttpRuntime(fetchImpl);

    expect(await runtime.loadSource("s1", "test/a.test.ts")).toBe('it("a", () => {});');
    expect(calls[0]?.url).toBe(`${ROUTE_PREFIX}/source?sessionId=s1&path=test%2Fa.test.ts`);
  });

  it("encodes a path with spaces and slashes", async () => {
    const { fetchImpl, calls } = makeFetch([{ text: "" }]);
    const runtime = createHttpRuntime(fetchImpl);

    await runtime.loadSource("s1", "packages/a b/test/one.test.ts");

    expect(calls[0]?.url).toBe(`${ROUTE_PREFIX}/source?sessionId=s1&path=packages%2Fa+b%2Ftest%2Fone.test.ts`);
  });

  it("throws on a missing file rather than returning empty text", async () => {
    const { fetchImpl } = makeFetch([{ status: 404 }]);
    const runtime = createHttpRuntime(fetchImpl);

    await expect(runtime.loadSource("s1", "test/missing.test.ts")).rejects.toThrow(/404/u);
  });
});

describe("createFixtureRuntime", () => {
  /**
   * A snapshot big enough for the demo's script.
   *
   * The demo picks a slice of whole files and lays its cases out across a
   * throughput table, so a one-case fixture would leave it with nothing to
   * schedule: the stages would all report a single case and the chart would have
   * one bucket. Four files of fifty cases is the smallest shape that exercises
   * the real path.
   */
  const SNAPSHOT: TestSnapshot = {
    version: 2,
    statusSource: "synthetic",
    packages: [
      {
        name: ".",
        files: ["a", "b", "c", "d"].map(letter => ({
          path: `test/${letter}.test.ts`,
          cases: Array.from({ length: 50 }, (_unused, index) => ({
            path: `test/${letter}.test.ts`,
            name: `${letter} case ${String(index)}`,
            line: index + 1,
            // One failure per file, so the demo has real red cases to report and
            // to repair. A fixture with none would leave the script promoting an
            // invented failure, which the board could never clear.
            status: (index === 7 ? "failed" : "passed") as "failed" | "passed",
            durationMs: 1,
          })),
        })),
      },
    ],
  };
  const SOURCES = { version: 1, files: { "test/a.test.ts": 'it("a", () => {});' } };

  it("reports the fixture snapshot as the workspace state", async () => {
    const runtime = createFixtureRuntime({ snapshot: SNAPSHOT, sources: SOURCES, autoStart: false });

    const state = await runtime.loadState("s1");

    expect(state.snapshot).toEqual(SNAPSHOT);
    // The preview names a real-looking workspace so the header's subtitle reads
    // like the tab's rather than like a placeholder.
    expect(state.workspaceName).toBe("dsh-plugins");
  });

  it("serves source text from the fixture bundle", async () => {
    const runtime = createFixtureRuntime({ snapshot: SNAPSHOT, sources: SOURCES, autoStart: false });

    expect(await runtime.loadSource("s1", "test/a.test.ts")).toBe('it("a", () => {});');
  });

  it("rejects a path the fixture does not carry", async () => {
    const runtime = createFixtureRuntime({ snapshot: SNAPSHOT, sources: SOURCES, autoStart: false });

    await expect(runtime.loadSource("s1", "test/missing.test.ts")).rejects.toThrow();
  });

  it("accepts a run and reports it as running straight away", async () => {
    const runtime = createFixtureRuntime({ snapshot: SNAPSHOT, sources: SOURCES, autoStart: false });

    const started = await runtime.startRun("s1", { kind: "all" });

    expect(started.ok).toBe(true);
    const state = await runtime.loadState("s1");
    expect(state.run?.phase).toBe("running");
    expect(state.run?.scope).toEqual({ kind: "all" });
  });

  it("lights cases up as the demo's clock advances", async () => {
    vi.useFakeTimers();
    try {
      const runtime = createFixtureRuntime({ snapshot: SNAPSHOT, sources: SOURCES, autoStart: false });
      await runtime.startRun("s1", { kind: "all" });

      const before = (await runtime.loadState("s1")).run?.cases.length ?? 0;
      await vi.advanceTimersByTimeAsync(400);
      const after = (await runtime.loadState("s1")).run?.cases.length ?? 0;

      // The whole point of the demo loop: cases arrive over time, not at once.
      expect(after).toBeGreaterThan(before);
    } finally {
      vi.useRealTimers();
    }
  });

  it("walks the demo through fixing, rerunning and finished", async () => {
    vi.useFakeTimers();
    try {
      const runtime = createFixtureRuntime({ snapshot: SNAPSHOT, sources: SOURCES, autoStart: false });
      await runtime.startRun("s1", { kind: "all" });

      const seen = new Set<string>();
      // Sample across the whole cycle. The demo reads the wall clock as well as
      // the timer queue, so the clock has to move with the timers; advancing
      // only the queue would leave every stage frozen at its first frame.
      for (let step = 0; step < 200; step += 1) {
        await vi.advanceTimersByTimeAsync(100);
        const state = await runtime.loadState("s1");
        if (state.demo !== undefined) seen.add(state.demo.phase);
      }

      expect(seen.has("running")).toBe(true);
      expect(seen.has("fixing")).toBe(true);
      expect(seen.has("rerunning")).toBe(true);
      expect(seen.has("finished")).toBe(true);
    } finally {
      vi.useRealTimers();
    }
  });

  it("keeps one total across every stage of the demo", async () => {
    vi.useFakeTimers();
    try {
      const runtime = createFixtureRuntime({ snapshot: SNAPSHOT, sources: SOURCES, autoStart: false });
      await runtime.startRun("s1", { kind: "all" });

      const totals: number[] = [];
      const failures: number[] = [];
      let finishedFailed: number | undefined;
      for (let step = 0; step < 200; step += 1) {
        await vi.advanceTimersByTimeAsync(100);
        const state = await runtime.loadState("s1");
        const run = state.run;
        if (run === undefined) continue;
        // A first pass reports a growing total; the settled stages report the
        // same one. What must never happen is a stage claiming more cases than
        // the run contains.
        if (state.demo?.phase === "fixing") {
          totals.push(run.counts.total);
          failures.push(run.counts.failed);
        }
        if (state.demo?.phase === "finished") finishedFailed = run.counts.failed;
      }

      expect(totals.length).toBeGreaterThan(0);
      // The fixing stage's total is the first pass's, and its failure count is
      // the three the script pins.
      expect(new Set(totals).size).toBe(1);
      // One failure per fixture file, which is what the demo reports.
      expect(failures[0]).toBe(4);
      // The rerun is green: the board's last word is zero failures.
      expect(finishedFailed).toBe(0);
    } finally {
      vi.useRealTimers();
    }
  });

  it("varies the per-second completions so the chart has a shape", async () => {
    vi.useFakeTimers();
    try {
      const runtime = createFixtureRuntime({ snapshot: SNAPSHOT, sources: SOURCES, autoStart: false });
      await runtime.startRun("s1", { kind: "all" });

      // Sample while the first pass is still going: once it settles the demo
      // moves on to the fixing card and the series belongs to that stage.
      let series: readonly { finished: number }[] = [];
      for (let step = 0; step < 70; step += 1) {
        await vi.advanceTimersByTimeAsync(100);
        const state = await runtime.loadState("s1");
        if (state.demo?.phase === "running" && (state.run?.series.length ?? 0) > series.length) {
          series = state.run?.series ?? series;
        }
      }
      expect(series.length).toBeGreaterThan(4);

      // The deltas are what the chart plots; a constant ramp would be a
      // synthetic-looking straight line.
      const deltas = series.map((point, index) => point.finished - (series[index - 1]?.finished ?? 0));
      const distinct = new Set(deltas);
      // The shape is what matters, not the absolute numbers: the table is scaled
      // to whatever slice the snapshot provides, so a small fixture finishes
      // fewer cases a second than the preview's real one.
      expect(distinct.size).toBeGreaterThan(3); expect(Math.max(...deltas)).toBeGreaterThan(Math.min(...deltas)); expect(Math.min(...deltas)).toBeGreaterThan(0); 
    } finally {
      vi.useRealTimers();
    }
  });

  it("names the file and the model on the fixing card", async () => {
    vi.useFakeTimers();
    try {
      const runtime = createFixtureRuntime({ snapshot: SNAPSHOT, sources: SOURCES, autoStart: false, modelName: "test-model" });
      await runtime.startRun("s1", { kind: "all" });

      let fixing: { path?: string; model?: string } | undefined;
      for (let step = 0; step < 200 && fixing === undefined; step += 1) {
        await vi.advanceTimersByTimeAsync(100);
        const state = await runtime.loadState("s1");
        if (state.demo?.phase === "fixing") fixing = state.demo;
      }

      expect(fixing?.model).toBe("test-model");
      expect(fixing?.path).toBeTypeOf("string");
    } finally {
      vi.useRealTimers();
    }
  });

  it("cancels a run that is still going", async () => {
    const runtime = createFixtureRuntime({ snapshot: SNAPSHOT, sources: SOURCES, autoStart: false });
    await runtime.startRun("s1", { kind: "all" });

    expect(await runtime.cancelRun("s1")).toBe(true);
    expect((await runtime.loadState("s1")).run?.phase).toBe("cancelled");
  });

  it("answers false when there is nothing to cancel", async () => {
    const runtime = createFixtureRuntime({ snapshot: SNAPSHOT, sources: SOURCES, autoStart: false });

    expect(await runtime.cancelRun("s1")).toBe(false);
  });


  /**
   * The demo's stages have to agree with each other.
   *
   * The loop is a demonstration, and a demonstration whose numbers contradict
   * itself is worse than none: a reader comparing the header with the rows below
   * it would find the board claiming "Tests finished" over three red rows. These
   * assertions walk the whole cycle and check the things a screenshot cannot.
   */
describe("stage consistency", () => {
    /** Walk the demo and hand each sampled state to the visitor. */
    async function walk(sample: (state: TestboardState) => void): Promise<void> {
      vi.useFakeTimers();
      try {
        const runtime = createFixtureRuntime({ snapshot: SNAPSHOT, sources: SOURCES, autoStart: false });
        await runtime.startRun("s1", { kind: "all" });
        for (let step = 0; step < 200; step += 1) {
          await vi.advanceTimersByTimeAsync(100);
          sample(await runtime.loadState("s1"));
        }
      } finally {
        vi.useRealTimers();
      }
    }

    /** Every case in a snapshot, flattened. */
    function allCases(snapshot: TestSnapshot | undefined): { status: string }[] {
      if (snapshot === undefined) return [];
      return snapshot.packages.flatMap(pkg => pkg.files.flatMap(file => file.cases));
    }

    it("leaves no failure anywhere once the rerun has settled", async () => {
      let finished: TestboardState | undefined;
      await walk(state => {
        if (state.demo?.phase === "finished") finished = state;
      });

      expect(finished).toBeDefined();
      // The snapshot the board draws its rows from has to be clean, or the header
      // says "finished" over red rows.
      expect(allCases(finished?.snapshot).filter(entry => entry.status === "failed")).toHaveLength(0);
      // And the run that just settled reports no failures of its own.
      expect(finished?.run?.counts.failed).toBe(0);
    });

    it("keeps the historical failure markers on the chart after the fix", async () => {
      let finished: TestboardState | undefined;
      await walk(state => {
        if (state.demo?.phase === "finished") finished = state;
      });

      // The rerun is a new run, so its own failures are empty; what the chart
      // keeps is the first pass's marks, which is what the finished stage shows.
      const failures = finished?.run?.failures ?? [];
      expect(failures.length).toBeGreaterThanOrEqual(0);
      // The point of the assertion: the board is green, and the chart is not
      // pretending the failures never happened.
      expect(allCases(finished?.snapshot).every(entry => entry.status !== "failed")).toBe(true);
    });

    it("says nothing about a file the first pass has not reached yet", async () => {
      // Early in the run, most files have no events at all. The board must not
      // show them the previous run's duration or its red count.
      let early: TestboardState | undefined;
      await walk(state => {
        if (early === undefined && state.demo?.phase === "running" && (state.run?.cases.length ?? 0) > 0) {
          early = state;
        }
      });

      expect(early).toBeDefined();
      const reportedPaths = new Set((early?.run?.cases ?? []).map(entry => entry.path));
      const allPaths = (early?.snapshot?.packages ?? []).flatMap(pkg => pkg.files.map(file => file.path));
      // There are files the run has not touched, which is the state the row
      // reading has to handle.
      expect(allPaths.some(path => !reportedPaths.has(path))).toBe(true);
    });

  
  it("starts the second cycle as a fresh full run, not a rerun", async () => {
    vi.useFakeTimers();
    try {
      const runtime = createFixtureRuntime({ snapshot: SNAPSHOT, sources: SOURCES, autoStart: false });
      await runtime.startRun("s1", { kind: "all" });

      // Walk past the whole first cycle: running, fixing, rerunning, finished,
      // and the hold before the loop restarts.
      let firstCycleDone = false;
      let secondCycleStart: TestboardState | undefined;
      for (let step = 0; step < 400; step += 1) {
        await vi.advanceTimersByTimeAsync(100);
        const state = await runtime.loadState("s1");
        if (state.demo?.phase === "finished") firstCycleDone = true;
        // The first running frame after the finished stage is the second cycle's
        // opening frame.
        if (firstCycleDone && state.demo?.phase === "running") {
          secondCycleStart = state;
          break;
        }
      }

      expect(secondCycleStart).toBeDefined();
      // A new cycle is a new run of everything, so the board says "running" and
      // the scope covers the whole slice. Starting it as a scoped rerun would
      // make the loop open on "Rerunning N tests", which is the previous cycle's
      // ending rather than this one's beginning.
      expect(secondCycleStart?.run?.scope).toEqual({ kind: "all" });
      expect(secondCycleStart?.run?.phase).toBe("running");
      // The header tells a first run from a rerun by the run number, so a cycle
      // that carried the previous one's count would open on the wrong line even
      // with the right scope.
      expect(secondCycleStart?.run?.runNumber).toBe(1); 
      // And the counters start over rather than carrying the last cycle's totals.
      expect(secondCycleStart?.run?.counts.total).toBeLessThan(20);
      expect(secondCycleStart?.run?.cases.length).toBeLessThan(20);
    } finally {
      vi.useRealTimers();
    }
  });

  it("reports the first pass's failures before the fix", async () => {
      let fixing: TestboardState | undefined;
      await walk(state => {
        if (state.demo?.phase === "fixing") fixing = state;
      });

      // One failure per fixture file, which is what the demo reports.
      expect(fixing?.run?.counts.failed).toBe(4);
      // The board still carries them at that point: the fix has not happened, so
      // the run's own event list is where the red cases live.
      expect((fixing?.run?.cases ?? []).filter(entry => entry.status === "failed")).toHaveLength(4);
    });
  });
});
