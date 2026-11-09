/**
 * The run engine: one vitest process per workspace, one run at a time.
 *
 * The subprocess service is injected so the whole state machine — busy, cancel,
 * failure, temp-file cleanup — is exercised without spawning vitest. The fake
 * spawn writes the reporter's output file the way the real reporter would, so
 * the engine's own file read and parse stay on the tested path.
 */
import { readFile, writeFile } from "node:fs/promises";

import { describe, expect, it } from "vitest";

import type { RunScope } from "../src/shared.ts";
import {
  createRunEngine,
  type RunEngine,
  type SpawnedProcess,
  type StartedRun,
  type SubprocessLike,
} from "../src/host/run-engine.ts";

const WORKSPACE = "/ws";

/** A reporter payload with one passing and one failing case. */
const REPORT = {
  testResults: [
    {
      name: "/ws/packages/alpha/test/one.test.ts",
      assertionResults: [
        { title: "adds", status: "passed", duration: 5 },
        { title: "subtracts", status: "failed", duration: 7, failureMessages: ["expected 1 to be 2"] },
      ],
    },
  ],
};

/** What one spawn was asked to do, so tests can assert the argv and cwd. */
interface SpawnCall {
  readonly argv: readonly string[];
  readonly cwd: string;
  readonly signal?: AbortSignal;
}

interface FakeOptions {
  /** Reporter payload written to the output file; `null` writes nothing. */
  readonly report?: unknown;
  readonly exitCode?: number | null;
  /** Lines the default reporter prints, used for progress. */
  readonly stdout?: readonly string[];
  /** Resolve only when the caller aborts, the way a killed child behaves. */
  readonly hangUntilAbort?: boolean;
  /** Reject the `done` promise outright. */
  readonly fail?: Error;
}

function makeSubprocess(options: FakeOptions = {}): { subprocess: SubprocessLike; calls: SpawnCall[] } {
  const calls: SpawnCall[] = [];
  const subprocess: SubprocessLike = {
    spawn(spec) {
      calls.push({ argv: spec.argv, cwd: spec.cwd, signal: spec.signal });
      const outputFile = spec.argv[spec.argv.indexOf("--outputFile") + 1] ?? "";
      const stdoutText = (options.stdout ?? []).join("\n");
      const done = (async () => {
        if (options.hangUntilAbort === true) {
          await new Promise<void>((_resolve, reject) => {
            spec.signal?.addEventListener("abort", () => reject(new Error("aborted")), { once: true });
          });
        }
        if (options.fail !== undefined) throw options.fail;
        if (options.report !== null && outputFile !== "") {
          await writeFile(outputFile, JSON.stringify(options.report ?? REPORT), "utf8");
        }
        return { exitCode: options.exitCode ?? 0 };
      })();
      const handle: SpawnedProcess = {
        done,
        collected: {
          stdout: { readFrom: () => ({ text: stdoutText, lossy: false }) },
          stderr: { readFrom: () => ({ text: "", lossy: false }) },
        },
      };
      return handle;
    },
  };
  return { subprocess, calls };
}

const ALL: RunScope = { kind: "all" };

/**
 * Start a run that is expected to be accepted.
 *
 * The engine answers a union, and every assertion below is about a run that did
 * start; narrowing once here keeps the failure message useful.
 */
function startOk(engine: RunEngine, workspace: string, scope: RunScope): StartedRun {
  const started = engine.start(workspace, scope);
  if (!started.ok) throw new Error(`expected a started run, got ${started.error}`);
  return started;
}

describe("createRunEngine", () => {
  it("starts idle with no snapshot and no run", () => {
    const { subprocess } = makeSubprocess();
    const engine = createRunEngine({ subprocess });

    expect(engine.getState(WORKSPACE)).toEqual({});
  });

  it("spawns the workspace's vitest with the workspace as cwd", async () => {
    const { subprocess, calls } = makeSubprocess();
    const engine = createRunEngine({ subprocess });

    const started = startOk(engine, WORKSPACE, ALL);
    await started.done;

    expect(calls[0]?.cwd).toBe(WORKSPACE);
    expect(calls[0]?.argv.slice(0, 2)).toEqual(["/ws/node_modules/.bin/vitest", "run"]);
  });

  it("reports running while the child is alive", () => {
    const { subprocess } = makeSubprocess({ hangUntilAbort: true });
    const engine = createRunEngine({ subprocess });

    const started = startOk(engine, WORKSPACE, ALL);
    const state = engine.getState(WORKSPACE);

    expect(state.run?.status).toBe("running");
    expect(state.run?.runId).toBe(started.runId);
    expect(state.run?.scope).toEqual(ALL);
    expect(state.run?.finishedAt).toBeUndefined();
    engine.cancel(WORKSPACE);
  });

  it("replaces the snapshot with the parsed run", async () => {
    const { subprocess } = makeSubprocess({ exitCode: 1 });
    const engine = createRunEngine({ subprocess });

    await startOk(engine, WORKSPACE, ALL).done;
    const state = engine.getState(WORKSPACE);

    expect(state.run?.finishedAt).toBeTypeOf("string");
    expect(state.snapshot?.statusSource).toBe("vitest");
    expect(state.snapshot?.workspace).toBe(WORKSPACE);
    expect(state.snapshot?.packages[0]?.files[0]?.cases).toHaveLength(2);
  });

  it("finishes failed when a case failed, whatever the exit code says", async () => {
    const { subprocess } = makeSubprocess({ exitCode: 0 });
    const engine = createRunEngine({ subprocess });

    await startOk(engine, WORKSPACE, ALL).done;

    expect(engine.getState(WORKSPACE).run?.status).toBe("failed");
  });

  it("finishes passed when the exit code is clean and no case failed", async () => {
    const { subprocess } = makeSubprocess({
      exitCode: 0,
      report: { testResults: [{ name: "/ws/test/a.test.ts", assertionResults: [{ title: "ok", status: "passed" }] }] },
    });
    const engine = createRunEngine({ subprocess });

    await startOk(engine, WORKSPACE, ALL).done;

    expect(engine.getState(WORKSPACE).run?.status).toBe("passed");
  });

  it("records the run's wall clock on the snapshot", async () => {
    const { subprocess } = makeSubprocess();
    let clock = 1000;
    const engine = createRunEngine({ subprocess, now: () => (clock += 500) });

    await startOk(engine, WORKSPACE, ALL).done;

    expect(engine.getState(WORKSPACE).snapshot?.wallClockMs).toBeGreaterThan(0);
  });

  it("refuses a second run in the same workspace while one is active", () => {
    const { subprocess } = makeSubprocess({ hangUntilAbort: true });
    const engine = createRunEngine({ subprocess });

    startOk(engine, WORKSPACE, ALL);
    const second = engine.start(WORKSPACE, ALL);

    expect(second).toEqual({ ok: false, error: "busy" });
    engine.cancel(WORKSPACE);
  });

  it("allows a second run once the first settled", async () => {
    const { subprocess } = makeSubprocess();
    const engine = createRunEngine({ subprocess });

    await startOk(engine, WORKSPACE, ALL).done;
    const second = engine.start(WORKSPACE, ALL);

    expect(second.ok).toBe(true);
    await (second as StartedRun).done;
  });

  it("keeps workspaces independent", async () => {
    const { subprocess } = makeSubprocess();
    const engine = createRunEngine({ subprocess });

    await startOk(engine, WORKSPACE, ALL).done;

    expect(engine.getState("/other")).toEqual({});
  });

  it("cancels through the abort signal and keeps the previous snapshot", async () => {
    const { subprocess, calls } = makeSubprocess({ hangUntilAbort: true });
    const engine = createRunEngine({ subprocess });

    const first = startOk(engine, WORKSPACE, ALL);
    expect(engine.cancel(WORKSPACE)).toBe(true);
    await first.done;

    expect(calls[0]?.signal?.aborted).toBe(true);
    expect(engine.getState(WORKSPACE).run?.status).toBe("cancelled");
  });

  it("reports false when there is nothing to cancel", () => {
    const { subprocess } = makeSubprocess();
    const engine = createRunEngine({ subprocess });

    expect(engine.cancel(WORKSPACE)).toBe(false);
  });

  it("errors with a message when the child produced no report", async () => {
    const { subprocess } = makeSubprocess({ report: null, exitCode: 1 });
    const engine = createRunEngine({ subprocess });

    await startOk(engine, WORKSPACE, ALL).done;
    const state = engine.getState(WORKSPACE);

    expect(state.run?.status).toBe("error");
    expect(state.run?.message).toBeTruthy();
    expect(state.snapshot).toBeUndefined();
  });

  it("errors when the spawn itself rejects", async () => {
    const { subprocess } = makeSubprocess({ fail: new Error("ENOENT vitest") });
    const engine = createRunEngine({ subprocess });

    await startOk(engine, WORKSPACE, ALL).done;
    const state = engine.getState(WORKSPACE);

    expect(state.run?.status).toBe("error");
    expect(state.run?.message).toContain("ENOENT");
  });

  it("counts completed files from the distinct paths the verbose stream names", async () => {
    const { subprocess } = makeSubprocess({
      stdout: [
        [
          " ✓ packages/alpha/test/one.test.ts > s > a 12ms",
          " ✓ packages/beta/test/two.test.ts > s > b 4ms",
          " × packages/beta/test/three.test.ts > s > c 9ms",
        ].join("\n"),
      ],
    });
    const engine = createRunEngine({ subprocess });

    await startOk(engine, WORKSPACE, ALL).done;

    expect(engine.getState(WORKSPACE).run?.completedFiles).toBe(3);
  });

  it("counts each file once even when it reports several cases", async () => {
    const { subprocess } = makeSubprocess({
      stdout: [
        [" ✓ test/a.test.ts > s > first 1ms", " ✓ test/a.test.ts > s > second 2ms"].join("\n"),
      ],
    });
    const engine = createRunEngine({ subprocess });

    await startOk(engine, WORKSPACE, ALL).done;

    expect(engine.getState(WORKSPACE).run?.completedFiles).toBe(1);
  });

  it("sets totalFiles to 1 for a file scope and leaves it unknown for all", async () => {
    const { subprocess } = makeSubprocess();
    const engine = createRunEngine({ subprocess });

    const fileRun = startOk(engine, WORKSPACE, { kind: "file", path: "test/a.test.ts" });
    expect(engine.getState(WORKSPACE).run?.totalFiles).toBe(1);
    await fileRun.done;

    startOk(engine, WORKSPACE, ALL);
    expect(engine.getState(WORKSPACE).run?.totalFiles).toBeNull();
    engine.cancel(WORKSPACE);
  });

  it("deletes the temp report file once it has been parsed", async () => {
    const { subprocess, calls } = makeSubprocess();
    const engine = createRunEngine({ subprocess });

    await startOk(engine, WORKSPACE, ALL).done;
    const outputFile = calls[0]?.argv[calls[0].argv.indexOf("--outputFile") + 1] ?? "";

    await expect(readFile(outputFile, "utf8")).rejects.toThrow();
  });

  it("uses a distinct output file per run", async () => {
    const { subprocess, calls } = makeSubprocess();
    const engine = createRunEngine({ subprocess });

    await startOk(engine, WORKSPACE, ALL).done;
    await startOk(engine, WORKSPACE, ALL).done;

    const first = calls[0]?.argv[calls[0].argv.indexOf("--outputFile") + 1];
    const second = calls[1]?.argv[calls[1].argv.indexOf("--outputFile") + 1];
    expect(first).not.toBe(second);
  });

  it("places each case on its line using the injected file reader", async () => {
    const { subprocess } = makeSubprocess();
    const engine = createRunEngine({
      subprocess,
      fileTextOf: (workspace, path) =>
        workspace === WORKSPACE && path === "packages/alpha/test/one.test.ts" ? 'it("adds", () => {});' : undefined,
    });

    await startOk(engine, WORKSPACE, ALL).done;

    expect(engine.getState(WORKSPACE).snapshot?.packages[0]?.files[0]?.cases[0]?.line).toBe(1);
  });
});

/**
 * The verbose stream, as this repository's vitest prints it.
 *
 * Same shape as the fixture in `host-vitest.test.ts`: the run header, one line
 * per finished case, and the failure summary. The engine reads this while the
 * child is still alive, so the tests below can assert what a polling client sees
 * before the json report exists.
 */
const VERBOSE_STREAM = [
  " RUN  v3.2.7 /ws",
  "",
  " \u2713 packages/alpha/test/one.test.ts > suite > adds 1ms",
  " \u00d7 packages/alpha/test/one.test.ts > suite > subtracts 3ms",
  "   \u2192 expected 1 to be 2",
  " \u2193 packages/alpha/test/one.test.ts > suite > later",
  "",
  "\u2500\u2500\u2500\u2500 Failed Tests 1 \u2500\u2500\u2500\u2500",
  "",
  " FAIL  packages/alpha/test/one.test.ts > suite > subtracts",
  "",
].join("\n");

describe("createRunEngine: live progress", () => {
  it("reports the running phase and a run number before anything finishes", () => {
    const { subprocess } = makeSubprocess({ hangUntilAbort: true });
    const engine = createRunEngine({ subprocess });

    startOk(engine, WORKSPACE, ALL);
    const run = engine.getState(WORKSPACE).run;

    expect(run?.phase).toBe("running");
    expect(run?.runNumber).toBe(1);
    expect(run?.counts).toEqual({ passed: 0, failed: 0, skipped: 0, total: 0 });
    expect(run?.cases).toEqual([]);
    // Nothing has finished, so the chart has nothing to draw yet.
    expect(run?.series).toEqual([]);
    engine.cancel(WORKSPACE);
  });

  it("appends one case event per finished case, in completion order", async () => {
    const { subprocess } = makeSubprocess({ stdout: [VERBOSE_STREAM] });
    const engine = createRunEngine({ subprocess });

    await startOk(engine, WORKSPACE, ALL).done;
    const run = engine.getState(WORKSPACE).run;

    expect(run?.cases.map(entry => entry.name)).toEqual(["adds", "subtracts", "later"]);
    expect(run?.cases.map(entry => entry.status)).toEqual(["passed", "failed", "skipped"]);
    expect(run?.cases.map(entry => entry.durationMs)).toEqual([1, 3, 0]);
  });

  it("counts the three states separately and totals them", async () => {
    const { subprocess } = makeSubprocess({ stdout: [VERBOSE_STREAM] });
    const engine = createRunEngine({ subprocess });

    await startOk(engine, WORKSPACE, ALL).done;

    expect(engine.getState(WORKSPACE).run?.counts).toEqual({ passed: 1, failed: 1, skipped: 1, total: 3 });
  });

  it("records the moment each failure happened", async () => {
    const { subprocess } = makeSubprocess({ stdout: [VERBOSE_STREAM] });
    let clock = 1000;
    const engine = createRunEngine({ subprocess, now: () => (clock += 10) });

    await startOk(engine, WORKSPACE, ALL).done;
    const failures = engine.getState(WORKSPACE).run?.failures ?? [];

    expect(failures).toHaveLength(1);
    expect(failures[0]).toMatchObject({ path: "packages/alpha/test/one.test.ts", name: "subtracts" });
    expect(failures[0]?.tMs).toBeGreaterThanOrEqual(0);
  });

  it("buckets the series by second, cumulatively", async () => {
    const { subprocess } = makeSubprocess({ stdout: [VERBOSE_STREAM] });
    let clock = 0;
    // Each read of the clock advances 600ms, so the three cases land in
    // different seconds and the buckets are distinguishable.
    const engine = createRunEngine({ subprocess, now: () => (clock += 600) });

    await startOk(engine, WORKSPACE, ALL).done;
    const series = engine.getState(WORKSPACE).run?.series ?? [];

    expect(series.length).toBeGreaterThan(0);
    // Cumulative by construction: the last bucket carries every finished case.
    const last = series[series.length - 1];
    expect(last?.finished).toBe(3);
    expect(last?.passed).toBe(1);
    expect(last?.failed).toBe(1);
    // And no bucket ever goes backwards.
    for (let index = 1; index < series.length; index += 1) {
      expect(series[index]?.finished).toBeGreaterThanOrEqual(series[index - 1]?.finished ?? 0);
    }
  });

  it("makes a finished case visible while the child is still alive", async () => {
    // The child never exits, so anything the state shows came from the stream
    // the engine read mid-run rather than from the final report.
    const { subprocess } = makeSubprocess({ hangUntilAbort: true, stdout: [VERBOSE_STREAM] });
    const engine = createRunEngine({ subprocess });

    startOk(engine, WORKSPACE, ALL);
    // Outlast one poll of the collected stream: the engine reads the pipe on a
    // timer, so a zero-delay wait would observe the state before the first read.
    await new Promise(resolve => setTimeout(resolve, 300));
    const run = engine.getState(WORKSPACE).run;

    expect(run?.phase).toBe("running");
    expect(run?.cases.length).toBeGreaterThan(0);
    engine.cancel(WORKSPACE);
  });

  it("counts completed files from the distinct paths in the stream", async () => {
    const { subprocess } = makeSubprocess({ stdout: [VERBOSE_STREAM] });
    const engine = createRunEngine({ subprocess });

    await startOk(engine, WORKSPACE, ALL).done;

    // Three cases, one file: the file count is not the case count.
    expect(engine.getState(WORKSPACE).run?.completedFiles).toBe(1);
  });

  it("reports the finished phase and the final elapsed time", async () => {
    const { subprocess } = makeSubprocess({ stdout: [VERBOSE_STREAM] });
    let clock = 0;
    const engine = createRunEngine({ subprocess, now: () => (clock += 100) });

    await startOk(engine, WORKSPACE, ALL).done;
    const run = engine.getState(WORKSPACE).run;

    expect(run?.phase).toBe("finished");
    expect(run?.finishedAt).toBeTypeOf("string");
    expect(run?.elapsedMs).toBeGreaterThan(0);
  });

  it("keeps the finished phase when cases failed, leaving the verdict to status", async () => {
    const { subprocess } = makeSubprocess({ stdout: [VERBOSE_STREAM] });
    const engine = createRunEngine({ subprocess });

    await startOk(engine, WORKSPACE, ALL).done;
    const run = engine.getState(WORKSPACE).run;

    // A run that finished with red cases did not break; the panel says
    // "N failing tests" from the counts, not from the phase.
    expect(run?.phase).toBe("finished");
    expect(run?.status).toBe("failed");
    expect(run?.counts.failed).toBe(1);
  });

  it("numbers each run in a workspace, and keeps workspaces separate", async () => {
    const { subprocess } = makeSubprocess({ stdout: [VERBOSE_STREAM] });
    const engine = createRunEngine({ subprocess });

    await startOk(engine, WORKSPACE, ALL).done;
    expect(engine.getState(WORKSPACE).run?.runNumber).toBe(1);

    await startOk(engine, WORKSPACE, ALL).done;
    expect(engine.getState(WORKSPACE).run?.runNumber).toBe(2);

    expect(engine.getState("/other")).toEqual({});
  });

  it("keeps the partial events and the previous snapshot when cancelled", async () => {
    const { subprocess } = makeSubprocess({ stdout: [VERBOSE_STREAM], hangUntilAbort: true });
    const engine = createRunEngine({ subprocess });

    const started = startOk(engine, WORKSPACE, ALL);
    // Outlast one poll so there is something partial to keep.
    await new Promise(resolve => setTimeout(resolve, 300));
    engine.cancel(WORKSPACE);
    await started.done;
    const run = engine.getState(WORKSPACE).run;

    expect(run?.phase).toBe("cancelled");
    expect(run?.status).toBe("cancelled");
    // Whatever finished before the abort stays on the board: throwing it away
    // would blank rows the reader was watching.
    expect(run?.cases.length).toBeGreaterThan(0);
  });
});

describe("createRunEngine: single-file rerun", () => {
  /** A report with two files, so a rerun of one can be told from a full run. */
  const TWO_FILES = {
    testResults: [
      {
        name: "/ws/packages/alpha/test/one.test.ts",
        assertionResults: [{ title: "adds", status: "passed", duration: 5 }],
      },
      {
        name: "/ws/packages/beta/test/two.test.ts",
        assertionResults: [{ title: "works", status: "passed", duration: 6 }],
      },
    ],
  };

  /** A report covering only the beta file, as a file-scoped run would produce. */
  const BETA_ONLY = {
    testResults: [
      {
        name: "/ws/packages/beta/test/two.test.ts",
        assertionResults: [{ title: "works", status: "failed", duration: 9, failureMessages: ["broke"] }],
      },
    ],
  };

  /**
   * A subprocess that hands out a different report on each spawn.
   *
   * A rerun is two runs in one engine, so the fake has to answer twice; a single
   * fixed report would make the merge assertion vacuous.
   * @param reports - one reporter payload per spawn, in order.
   * @returns the seam and the calls it recorded.
   */
  function makeSequence(reports: readonly unknown[]): { subprocess: SubprocessLike; calls: SpawnCall[] } {
    const calls: SpawnCall[] = [];
    let index = 0;
    const subprocess: SubprocessLike = {
      spawn(spec) {
        calls.push({ argv: spec.argv, cwd: spec.cwd, signal: spec.signal });
        const report = reports[index] ?? reports[reports.length - 1];
        index += 1;
        const outputFile = spec.argv[spec.argv.indexOf("--outputFile") + 1] ?? "";
        const done = (async () => {
          if (outputFile !== "") await writeFile(outputFile, JSON.stringify(report), "utf8");
          return { exitCode: 0 };
        })();
        return {
          done,
          collected: {
            stdout: { readFrom: () => ({ text: "", lossy: false }) },
            stderr: { readFrom: () => ({ text: "", lossy: false }) },
          },
        };
      },
    };
    return { subprocess, calls };
  }

  it("replaces only the rerun file's result and keeps the rest", async () => {
    const { subprocess } = makeSequence([TWO_FILES, BETA_ONLY]);
    const engine = createRunEngine({ subprocess });

    await startOk(engine, WORKSPACE, ALL).done;
    const before = engine.getState(WORKSPACE).snapshot;
    // The fixture spans two packages, so the files are collected across them.
    expect(before?.packages.flatMap(pkg => pkg.files)).toHaveLength(2);

    await startOk(engine, WORKSPACE, { kind: "file", path: "packages/beta/test/two.test.ts" }).done;

    const files = engine.getState(WORKSPACE).snapshot?.packages.flatMap(pkg => pkg.files) ?? [];
    expect(files).toHaveLength(2);
    // Alpha is untouched, beta carries the rerun's verdict.
    expect(files.find(file => file.path === "packages/alpha/test/one.test.ts")?.cases[0]?.status).toBe("passed");
    expect(files.find(file => file.path === "packages/beta/test/two.test.ts")?.cases[0]?.status).toBe("failed");
  });

  it("records the scope and bumps the run number on a rerun", async () => {
    const { subprocess } = makeSequence([TWO_FILES, BETA_ONLY]);
    const engine = createRunEngine({ subprocess });

    await startOk(engine, WORKSPACE, ALL).done;
    const scope: RunScope = { kind: "file", path: "packages/beta/test/two.test.ts" };
    await startOk(engine, WORKSPACE, scope).done;

    const run = engine.getState(WORKSPACE).run;
    expect(run?.scope).toEqual(scope);
    expect(run?.runNumber).toBe(2);
  });

  it("replaces the whole snapshot on a full run after a rerun", async () => {
    const { subprocess } = makeSequence([TWO_FILES, BETA_ONLY, BETA_ONLY]);
    const engine = createRunEngine({ subprocess });

    await startOk(engine, WORKSPACE, ALL).done;
    await startOk(engine, WORKSPACE, { kind: "file", path: "packages/beta/test/two.test.ts" }).done;
    await startOk(engine, WORKSPACE, ALL).done;

    // A full run is authoritative: it does not merge, it replaces.
    const files = engine.getState(WORKSPACE).snapshot?.packages.flatMap(pkg => pkg.files) ?? [];
    expect(files).toHaveLength(1);
    expect(files[0]?.path).toBe("packages/beta/test/two.test.ts");
  });

  it("keeps the previous snapshot when a rerun produced no report", async () => {
    const calls: SpawnCall[] = [];
    let index = 0;
    const subprocess: SubprocessLike = {
      spawn(spec) {
        calls.push({ argv: spec.argv, cwd: spec.cwd, signal: spec.signal });
        const first = index === 0;
        index += 1;
        const outputFile = spec.argv[spec.argv.indexOf("--outputFile") + 1] ?? "";
        const done = (async () => {
          // The first run reports; the rerun dies before writing anything.
          if (first && outputFile !== "") await writeFile(outputFile, JSON.stringify(TWO_FILES), "utf8");
          return { exitCode: first ? 0 : 1 };
        })();
        return {
          done,
          collected: {
            stdout: { readFrom: () => ({ text: "", lossy: false }) },
            stderr: { readFrom: () => ({ text: "boom", lossy: false }) },
          },
        };
      },
    };
    const engine = createRunEngine({ subprocess });

    await startOk(engine, WORKSPACE, ALL).done;
    const before = engine.getState(WORKSPACE).snapshot;
    expect(before).toBeDefined();

    await startOk(engine, WORKSPACE, { kind: "file", path: "packages/beta/test/two.test.ts" }).done;

    // The rerun errored, so the board keeps what it had rather than blanking.
    expect(engine.getState(WORKSPACE).run?.phase).toBe("error");
    expect(engine.getState(WORKSPACE).snapshot).toEqual(before);
  });
});

describe("createRunEngine: streaming", () => {
  /**
   * A reader matching the host service's contract: everything from the offset on.
   *
   * The real service collects a pipe and hands back the whole tail, so a fake
   * that returned fixed-size slices would be testing a different interface. The
   * shared state lets the test grow the text between polls, which is how a child
   * printing progressively looks to the engine.
   */
  function tailReader(state: { text: string }): { readFrom(from: number): { text: string; lossy: boolean } } {
    return {
      readFrom(from) {
        return { text: state.text.slice(from), lossy: false };
      },
    };
  }

  it("publishes cases before the child exits, growing as the stream grows", async () => {
    const firstHalf = [
      " \u2713 test/a.test.ts > s > one 1ms",
      " \u2713 test/a.test.ts > s > two 2ms",
      "",
    ].join("\n");
    const secondHalf = [" \u00d7 test/a.test.ts > s > three 3ms", " FAIL  test/a.test.ts > s > three", ""].join("\n");
    const state = { text: firstHalf };
    const subprocess: SubprocessLike = {
      spawn(spec) {
        const outputFile = spec.argv[spec.argv.indexOf("--outputFile") + 1] ?? "";
        const done = (async () => {
          // The child prints its second half, then exits.
          await new Promise(resolve => setTimeout(resolve, 250));
          state.text = firstHalf + secondHalf;
          await new Promise(resolve => setTimeout(resolve, 250));
          if (outputFile !== "") await writeFile(outputFile, JSON.stringify(REPORT), "utf8");
          return { exitCode: 1 };
        })();
        return {
          done,
          collected: { stdout: tailReader(state), stderr: tailReader({ text: "" }) },
        };
      },
    };
    const engine = createRunEngine({ subprocess });

    const started = startOk(engine, WORKSPACE, ALL);
    // Sample the way a polling client does, and record what the state showed.
    const seen: number[] = [];
    const timer = setInterval(() => {
      const run = engine.getState(WORKSPACE).run;
      if (run !== undefined) seen.push(run.cases.length);
    }, 100);
    await started.done;
    clearInterval(timer);

    // The count has to move before the run settles: that is the whole feature.
    expect(seen.some(count => count > 0 && count < 3)).toBe(true);
    const run = engine.getState(WORKSPACE).run;
    expect(run?.cases).toHaveLength(3);
    expect(run?.failures).toHaveLength(1);
  });

  it("does not lose a line that arrives split across two reads", async () => {
    // A pipe hands out whatever has been flushed, so a case line can arrive in
    // two pieces. The engine holds the partial tail until it is complete.
    const full = [" \u2713 test/a.test.ts > s > one 1ms", " \u2713 test/a.test.ts > s > two 2ms", ""].join("\n");
    const cut = full.indexOf("two");
    const state = { text: full.slice(0, cut) };
    const subprocess: SubprocessLike = {
      spawn(spec) {
        const outputFile = spec.argv[spec.argv.indexOf("--outputFile") + 1] ?? "";
        const done = (async () => {
          await new Promise(resolve => setTimeout(resolve, 250));
          state.text = full;
          await new Promise(resolve => setTimeout(resolve, 250));
          if (outputFile !== "") await writeFile(outputFile, JSON.stringify(REPORT), "utf8");
          return { exitCode: 0 };
        })();
        return {
          done,
          collected: { stdout: tailReader(state), stderr: tailReader({ text: "" }) },
        };
      },
    };
    const engine = createRunEngine({ subprocess });

    await startOk(engine, WORKSPACE, ALL).done;

    expect(engine.getState(WORKSPACE).run?.cases.map(entry => entry.name)).toEqual(["one", "two"]);
  });
});
