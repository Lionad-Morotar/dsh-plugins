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

  it("counts completed files from the default reporter's stdout", async () => {
    const { subprocess } = makeSubprocess({
      stdout: [
        " ✓ packages/alpha/test/one.test.ts (3 tests) 12ms",
        " ✓ packages/beta/test/two.test.ts (1 test) 4ms",
        " × packages/beta/test/three.test.ts (2 tests) 9ms",
      ],
    });
    const engine = createRunEngine({ subprocess });

    await startOk(engine, WORKSPACE, ALL).done;

    expect(engine.getState(WORKSPACE).run?.completedFiles).toBe(3);
  });

  it("counts each file once even when the reporter repeats it", async () => {
    const { subprocess } = makeSubprocess({
      stdout: [" ✓ test/a.test.ts (1 test) 1ms", " ✓ test/a.test.ts (1 test) 2ms"],
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
