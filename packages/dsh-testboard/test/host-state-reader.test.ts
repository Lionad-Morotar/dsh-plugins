/**
 * The precedence between memory and disk.
 *
 * The board must never show an older reading than the process already holds,
 * and must never show "not run yet" when the workspace has a readable result on
 * disk. Both are one decision each, so they are pinned without a Cordis context
 * or a filesystem: the engine and the cache are fakes.
 */
import { describe, expect, it, vi } from "vitest";

import type { TestSnapshot } from "../src/client/model.ts";
import type { CachedResult } from "../src/host/results-store.ts";
import { createStateReader } from "../src/host/state-reader.ts";
import type { RunProgress, TestboardState } from "../src/shared.ts";

const WORKSPACE = "/work/repo";

const SNAPSHOT: TestSnapshot = { version: 1, statusSource: "vitest", packages: [] };

/**
 * A finished run; only the fields the reader looks at carry real values.
 * @param overrides - fields to replace.
 * @returns the run.
 */
function run(overrides: Partial<RunProgress> = {}): RunProgress {
  return {
    runId: "run-1",
    scope: { kind: "all" },
    status: "passed",
    phase: "finished",
    runNumber: 1,
    startedAt: "2026-11-11T01:00:00.000Z",
    finishedAt: "2026-11-11T01:00:05.000Z",
    elapsedMs: 5000,
    completedFiles: 0,
    totalFiles: null,
    counts: { passed: 0, failed: 0, skipped: 0, total: 0 },
    series: [],
    failures: [],
    cases: [],
    ...overrides,
  };
}

/**
 * Build the reader over one in-memory state and one cache answer.
 * @param memory - what the engine reports.
 * @param cached - what the disk cache reports, or undefined for none.
 * @returns the reader and the cache spy.
 */
function reader(memory: TestboardState, cached?: CachedResult) {
  const latest = vi.fn(async () => cached);
  const readerFn = createStateReader({
    engine: { getState: () => memory },
    results: { latest },
    isDirectory: async value => value === WORKSPACE,
  });
  return { read: readerFn, latest };
}

describe("createStateReader", () => {
  it("prefers the process's own state and never touches the disk", async () => {
    const live = { snapshot: SNAPSHOT, run: run({ runNumber: 2 }) };
    const { read, latest } = reader(live);

    const state = await read(WORKSPACE);

    expect(state.snapshot).toBe(SNAPSHOT);
    expect(state.run?.runNumber).toBe(2);
    expect(state.cached).toBeUndefined();
    expect(latest).not.toHaveBeenCalled();
  });

  it("falls back to the newest on-disk result when memory is empty", async () => {
    const cached: CachedResult = {
      savedAt: "2026-11-11T01:00:05.000Z",
      run: run(),
      snapshot: SNAPSHOT,
    };
    const { read } = reader({}, cached);

    const state = await read(WORKSPACE);

    expect(state.cached).toBe(true);
    expect(state.snapshot).toBe(SNAPSHOT);
    expect(state.run?.runId).toBe("run-1");
    expect(state.workspaceName).toBe("repo");
  });

  it("leaves the board empty when there is neither memory nor a cache", async () => {
    const { read } = reader({});

    const state = await read(WORKSPACE);

    expect(state).toEqual({ workspace: WORKSPACE, workspaceName: "repo" });
    expect(state.cached).toBeUndefined();
    expect(state.error).toBeUndefined();
  });

  it("reports a vanished workspace before reading either source", async () => {
    const { read } = reader({ snapshot: SNAPSHOT });

    const state = await read("/work/deleted");

    expect(state).toEqual({ workspace: "/work/deleted", error: "unknown-workspace" });
  });

  it("maps a stored errored run to the board's error code", async () => {
    const { read } = reader({ snapshot: SNAPSHOT, run: run({ status: "error", phase: "error" }) });

    const state = await read(WORKSPACE);

    expect(state.error).toBe("run-failed");
    expect(state.snapshot).toBe(SNAPSHOT);
  });
});
