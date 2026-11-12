/**
 * The on-disk result cache, exercised against real directories.
 *
 * The cache decides what the board opens with after a reload, so the tests pin
 * the two product rules around it: the newest readable run wins, and a broken
 * file is skipped rather than blanking the board. The clock is injected where
 * the layout is asserted; the filesystem is a temp directory, never the repo.
 */
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import type { TestSnapshot } from "../src/client/model.ts";
import { RESULT_FILE, RESULT_ROOT, createResultsStore, resultDirectory } from "../src/host/results-store.ts";
import type { RunProgress } from "../src/shared.ts";

/** The smallest snapshot the cache accepts; the store validates shape only. */
const SNAPSHOT: TestSnapshot = {
  version: 1,
  statusSource: "vitest",
  packages: [
    {
      name: "alpha",
      files: [
        {
          path: "packages/alpha/test/one.test.ts",
          cases: [
            { path: "packages/alpha/test/one.test.ts", name: "adds", line: 1, status: "passed", durationMs: 5 },
          ],
        },
      ],
    },
  ],
};

/**
 * A finished run, shaped the way the engine hands one over.
 * @param runNumber - which run in the workspace this was.
 * @param status - its verdict.
 * @returns the run progress.
 */
function finishedRun(runNumber = 1, status: RunProgress["status"] = "passed"): RunProgress {
  return {
    runId: `run-${String(runNumber)}`,
    scope: { kind: "all" },
    status,
    phase: "finished",
    runNumber,
    startedAt: "2026-11-11T01:00:00.000Z",
    finishedAt: "2026-11-11T01:00:05.000Z",
    elapsedMs: 5000,
    completedFiles: 1,
    totalFiles: null,
    counts: { passed: 1, failed: 0, skipped: 0, total: 1 },
    series: [{ tMs: 0, finished: 1, passed: 1, failed: 0 }],
    failures: [],
    cases: [{ path: "packages/alpha/test/one.test.ts", name: "adds", status: "passed", durationMs: 5, atMs: 4 }],
  };
}

let workspace: string;

beforeEach(async () => {
  workspace = await mkdtemp(join(tmpdir(), "dsh-testboard-results-"));
});

afterEach(async () => {
  await rm(workspace, { recursive: true, force: true });
});

/** Read back the one file a save produced. */
async function readSaved(path: string): Promise<{ version: number; run: RunProgress; snapshot: TestSnapshot }> {
  return JSON.parse(await readFile(path, "utf8")) as {
    version: number;
    run: RunProgress;
    snapshot: TestSnapshot;
  };
}

describe("resultDirectory", () => {
  it("lays one run out as logs/testboard/<YYMMDD>/<HHmmss> in local time", () => {
    // Local constructor on purpose: the directory names the hour the person
    // remembers, not a UTC offset.
    const now = new Date(2026, 10, 11, 9, 5, 7);
    expect(resultDirectory(now)).toBe(join(RESULT_ROOT, "261111", "090507"));
  });
});

describe("createResultsStore", () => {
  it("writes one file with the run and the snapshot it produced", async () => {
    const store = createResultsStore();
    const now = new Date(2026, 10, 11, 9, 5, 7);
    const path = await store.save(workspace, { run: finishedRun(), snapshot: SNAPSHOT }, now);

    expect(path).toBe(join(workspace, RESULT_ROOT, "261111", "090507", RESULT_FILE));
    if (path === undefined) throw new Error("save produced no path");
    const saved = await readSaved(path);
    expect(saved.version).toBe(1);
    expect(saved.run.runId).toBe("run-1");
    expect(saved.snapshot).toEqual(SNAPSHOT);
  });

  it("persists the canonical log beside the latest run, so a scoped patch survives a reload", async () => {
    const store = createResultsStore();
    const full = finishedRun(1);
    const scoped: RunProgress = {
      ...finishedRun(2),
      scope: { kind: "file", path: "packages/beta/test/two.test.ts" },
    };
    const now = new Date(2026, 10, 11, 9, 5, 7);
    const path = await store.save(workspace, { run: scoped, snapshot: SNAPSHOT, log: full }, now);
    if (path === undefined) throw new Error("save produced no path");

    // A fresh store reads from disk, which is the path a reload takes.
    const latest = await createResultsStore().latest(workspace);
    expect(latest?.run.runId).toBe("run-2");
    expect(latest?.log?.runId).toBe("run-1");
  });

  it("reads a record written before the log existed without inventing one", async () => {
    const directory = join(workspace, RESULT_ROOT, "261111", "100000");
    await mkdir(directory, { recursive: true });
    await writeFile(
      join(directory, RESULT_FILE),
      JSON.stringify({ version: 1, savedAt: "2026-11-11T10:00:00.000Z", run: finishedRun(), snapshot: SNAPSHOT }),
      "utf8",
    );

    const latest = await createResultsStore().latest(workspace);
    expect(latest?.run.runId).toBe("run-1");
    expect(latest?.log).toBeUndefined();
  });

  it("answers with the saved run straight away, from memory", async () => {
    const store = createResultsStore();
    await store.save(workspace, { run: finishedRun(), snapshot: SNAPSHOT }, new Date(2026, 10, 11, 9, 5, 7));

    const latest = await store.latest(workspace);
    expect(latest?.run.runId).toBe("run-1");
    expect(latest?.snapshot).toEqual(SNAPSHOT);
  });

  it("keeps two runs inside the same second apart, and reads the later one", async () => {
    const store = createResultsStore();
    const now = new Date(2026, 10, 11, 9, 5, 7);
    await store.save(workspace, { run: finishedRun(1), snapshot: SNAPSHOT }, now);
    const second = await store.save(workspace, { run: finishedRun(2), snapshot: SNAPSHOT }, now);

    expect(second).toContain("090507-2");
    // save refreshes the memory map, so the reader sees the run it just wrote.
    expect((await store.latest(workspace))?.run.runNumber).toBe(2);
  });

  it("picks the newest day over an older one when reading cold", async () => {
    const store = createResultsStore();
    await store.save(workspace, { run: finishedRun(1), snapshot: SNAPSHOT }, new Date(2026, 10, 11, 23, 59, 59));
    await store.save(workspace, { run: finishedRun(2), snapshot: SNAPSHOT }, new Date(2026, 10, 12, 0, 0, 1));

    // A fresh instance is what a rebooted host gets: no memory, only the disk.
    const latest = await createResultsStore().latest(workspace);
    expect(latest?.run.runNumber).toBe(2);
  });

  it("skips a malformed newest file instead of blanking the board", async () => {
    const store = createResultsStore();
    await store.save(workspace, { run: finishedRun(1), snapshot: SNAPSHOT }, new Date(2026, 10, 11, 10, 0, 0));
    const brokenDay = join(workspace, RESULT_ROOT, "261112", "100000");
    await mkdir(brokenDay, { recursive: true });
    await writeFile(join(brokenDay, RESULT_FILE), "{ not json", "utf8");

    const latest = await createResultsStore().latest(workspace);
    // The older readable run still answers; a damaged newest file is not a
    // reason to show nothing.
    expect(latest?.run.runNumber).toBe(1);
  });

  it("ignores a file written by another schema version", async () => {
    const directory = join(workspace, RESULT_ROOT, "261111", "100000");
    await mkdir(directory, { recursive: true });
    await writeFile(
      join(directory, RESULT_FILE),
      JSON.stringify({ version: 2, run: finishedRun(), snapshot: SNAPSHOT }),
      "utf8",
    );

    expect(await createResultsStore().latest(workspace)).toBeUndefined();
  });

  it("lists the cached runs newest first for the history picker", async () => {
    const store = createResultsStore();
    await store.save(workspace, { run: finishedRun(1), snapshot: SNAPSHOT }, new Date(2026, 10, 11, 9, 0, 0));
    await store.save(workspace, { run: finishedRun(2), snapshot: SNAPSHOT }, new Date(2026, 10, 11, 10, 0, 0));
    await store.save(workspace, { run: finishedRun(3), snapshot: SNAPSHOT }, new Date(2026, 10, 12, 8, 0, 0));

    // A fresh store has no memory: the list is the disk's answer, which is the
    // one a reloaded tab gets.
    const runs = await createResultsStore().list(workspace);
    expect(runs.map(entry => entry.runNumber)).toEqual([3, 2, 1]);
    expect(runs[0]).toMatchObject({ id: "261112/080000", files: 1, cases: 1, status: "passed" });
    expect(runs[1]?.id).toBe("261111/100000");
  });

  it("backfills a summary for a run written before summaries existed", async () => {
    const directory = join(workspace, RESULT_ROOT, "261111", "100000");
    await mkdir(directory, { recursive: true });
    await writeFile(
      join(directory, RESULT_FILE),
      JSON.stringify({ version: 1, savedAt: "2026-11-11T02:00:00.000Z", run: finishedRun(7), snapshot: SNAPSHOT }),
      "utf8",
    );

    const runs = await createResultsStore().list(workspace);
    expect(runs.map(entry => entry.runNumber)).toEqual([7]);
    const summary = JSON.parse(await readFile(join(directory, "summary.json"), "utf8")) as { id?: string; runNumber?: number };
    expect(summary.id).toBe("261111/100000");
    expect(summary.runNumber).toBe(7);
  });

  it("loads one run by id, including a same-second suffix", async () => {
    const store = createResultsStore();
    const now = new Date(2026, 10, 11, 9, 5, 7);
    await store.save(workspace, { run: finishedRun(1), snapshot: SNAPSHOT }, now);
    await store.save(workspace, { run: finishedRun(2), snapshot: SNAPSHOT }, now);

    expect((await store.load(workspace, "261111/090507"))?.run.runNumber).toBe(1);
    expect((await store.load(workspace, "261111/090507-2"))?.run.runNumber).toBe(2);
    expect(await store.load(workspace, "261111/090508")).toBeUndefined();
  });

  it("refuses an id that would leave the cache root", async () => {
    const store = createResultsStore();
    expect(await store.load(workspace, "../../etc/passwd")).toBeUndefined();
    expect(await store.load(workspace, "261111/090507/extra")).toBeUndefined();
  });

  it("answers undefined for a workspace that has never run anything", async () => {
    expect(await createResultsStore().latest(workspace)).toBeUndefined();
  });

  it("does not throw when the workspace cannot be written", async () => {
    const store = createResultsStore();
    const readOnly = join(workspace, "not-a-directory");
    await writeFile(readOnly, "x", "utf8");
    // The workspace path here is a file, so every directory creation below it
    // fails the way a read-only checkout would: the run still stands.
    expect(await store.save(readOnly, { run: finishedRun(), snapshot: SNAPSHOT })).toBeUndefined();
  });
});
