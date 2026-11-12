/**
 * The live board: a run's own events turned into the rows the panel draws.
 *
 * The point of this module is what it refuses to carry. Every test here is one
 * of the two promises the board makes while a run is going: the tree is built
 * from this run's results (nothing from the previous run survives a full run),
 * and a scoped rerun only rebuilds the file it names.
 */
import { describe, expect, it } from "vitest";

import { liveSnapshotOf } from "../src/client/live.ts";
import type { TestCase, TestSnapshot } from "../src/client/model.ts";
import type { RunProgress, RunScope } from "../src/shared.ts";

/** One finished run of the settled board: two files, one of them red. */
const SETTLED: TestSnapshot = {
  version: 2,
  statusSource: "vitest",
  packages: [
    { name: "alpha", files: [{ path: "packages/alpha/test/one.test.ts", cases: [] }] },
    {
      name: "beta",
      files: [
        {
          path: "packages/beta/test/two.test.ts",
          cases: [
            { path: "packages/beta/test/two.test.ts", line: 8, name: "paints", status: "failed", durationMs: 12 },
            { path: "packages/beta/test/two.test.ts", line: 20, name: "mounts", status: "passed", durationMs: 3 },
          ],
        },
      ],
    },
  ],
};

/** A run over the whole workspace, or over one file. */
function runOf(scope: RunScope, cases: RunProgress["cases"]): RunProgress {
  return {
    runId: "run-1",
    scope,
    status: "running",
    phase: "running",
    runNumber: 1,
    startedAt: "2026-11-12T00:00:00.000Z",
    elapsedMs: 1200,
    completedFiles: 1,
    totalFiles: scope.kind === "file" ? 1 : null,
    counts: { passed: 0, failed: 0, skipped: 0, total: 0 },
    series: [],
    failures: [],
    cases,
  };
}

/** The paths a snapshot holds, in tree order. */
function pathsOf(snapshot: TestSnapshot): string[] {
  return snapshot.packages.flatMap(pkg => pkg.files.map(file => file.path));
}

/** The cases of one file in a snapshot. */
function casesOf(snapshot: TestSnapshot, path: string): readonly TestCase[] {
  return snapshot.packages.flatMap(pkg => pkg.files).find(file => file.path === path)?.cases ?? [];
}

describe("liveSnapshotOf", () => {
  it("groups a run's cases by the package their path names", () => {
    const live = liveSnapshotOf(
      runOf({ kind: "all" }, [
        { path: "test/root.test.ts", name: "boots", status: "passed", durationMs: 1, atMs: 10 },
        { path: "packages/alpha/test/one.test.ts", name: "adds", status: "passed", durationMs: 2, atMs: 20 },
      ]),
      undefined,
    );

    expect(live.packages.map(pkg => pkg.name)).toEqual([".", "alpha"]);
    expect(pathsOf(live)).toEqual(["test/root.test.ts", "packages/alpha/test/one.test.ts"]);
  });

  it("keeps a full run's rows in completion order, one case at a time", () => {
    const live = liveSnapshotOf(
      runOf({ kind: "all" }, [
        { path: "packages/beta/test/two.test.ts", name: "mounts", status: "passed", durationMs: 1, atMs: 10 },
        { path: "packages/alpha/test/one.test.ts", name: "adds", status: "passed", durationMs: 1, atMs: 20 },
        { path: "packages/beta/test/two.test.ts", name: "paints", status: "passed", durationMs: 1, atMs: 30 },
      ]),
      undefined,
    );

    expect(casesOf(live, "packages/beta/test/two.test.ts").map(entry => entry.name)).toEqual(["mounts", "paints"]);
    expect(live.packages.flatMap(pkg => pkg.files).map(file => file.path)).toEqual([
      "packages/alpha/test/one.test.ts",
      "packages/beta/test/two.test.ts",
    ]);
  });

  it("drops the settled board entirely on a full run", () => {
    // The settled board's failure belongs to the previous run, and this run has
    // not produced one: showing it is exactly the stale red the live board exists
    // to prevent.
    const live = liveSnapshotOf(
      runOf({ kind: "all" }, [
        { path: "packages/beta/test/two.test.ts", name: "paints", status: "passed", durationMs: 2, atMs: 10 },
      ]),
      SETTLED,
    );

    expect(pathsOf(live)).toEqual(["packages/beta/test/two.test.ts"]);
    const cases = casesOf(live, "packages/beta/test/two.test.ts");
    expect(cases.map(entry => [entry.name, entry.status])).toEqual([["paints", "passed"]]);
  });

  it("is empty before the first case lands, rather than falling back to the old board", () => {
    expect(liveSnapshotOf(runOf({ kind: "all" }, []), SETTLED).packages).toEqual([]);
  });

  it("keeps the rest of the board when a rerun covers one file", () => {
    const live = liveSnapshotOf(
      runOf({ kind: "file", path: "packages/beta/test/two.test.ts" }, [
        { path: "packages/beta/test/two.test.ts", name: "paints", status: "passed", durationMs: 2, atMs: 10 },
      ]),
      SETTLED,
    );

    expect(pathsOf(live)).toEqual(["packages/alpha/test/one.test.ts", "packages/beta/test/two.test.ts"]);
    // Only the file the rerun covers is rebuilt; the other files are not being
    // redone, so their last reading stands.
    expect(casesOf(live, "packages/beta/test/two.test.ts")).toHaveLength(1);
    expect(casesOf(live, "packages/alpha/test/one.test.ts")).toEqual([]);
  });

  it("keeps the rerun file in place before its first case lands", () => {
    const live = liveSnapshotOf(runOf({ kind: "file", path: "packages/beta/test/two.test.ts" }, []), SETTLED);

    // The row is the reader's place in the tree, so it stays put and is simply
    // empty for now.
    expect(pathsOf(live)).toEqual(["packages/alpha/test/one.test.ts", "packages/beta/test/two.test.ts"]);
    expect(casesOf(live, "packages/beta/test/two.test.ts")).toEqual([]);
  });

  it("gives a rerun of an unknown file a row of its own", () => {
    const live = liveSnapshotOf(runOf({ kind: "file", path: "packages/gamma/test/three.test.ts" }, []), SETTLED);

    expect(pathsOf(live)).toEqual([
      "packages/alpha/test/one.test.ts",
      "packages/beta/test/two.test.ts",
      "packages/gamma/test/three.test.ts",
    ]);
    expect(live.packages.map(pkg => pkg.name)).toEqual(["alpha", "beta", "gamma"]);
  });

  it("borrows the settled board's line numbers for the source highlight", () => {
    // The stream carries titles, not positions. The previous board already knows
    // where those titles sit, and re-reading every file behind every poll is not
    // worth a highlight.
    const live = liveSnapshotOf(
      runOf({ kind: "all" }, [
        { path: "packages/beta/test/two.test.ts", name: "mounts", status: "passed", durationMs: 1, atMs: 10 },
        { path: "packages/beta/test/two.test.ts", name: "paints", status: "passed", durationMs: 1, atMs: 20 },
      ]),
      SETTLED,
    );

    expect(casesOf(live, "packages/beta/test/two.test.ts").map(entry => entry.line)).toEqual([20, 8]);
  });

  it("gives two cases that share a title the two lines the board had", () => {
    const settled: TestSnapshot = {
      version: 2,
      statusSource: "vitest",
      packages: [
        {
          name: "alpha",
          files: [
            {
              path: "packages/alpha/test/one.test.ts",
              cases: [
                { path: "packages/alpha/test/one.test.ts", line: 4, name: "works", status: "passed", durationMs: 1 },
                { path: "packages/alpha/test/one.test.ts", line: 9, name: "works", status: "passed", durationMs: 1 },
              ],
            },
          ],
        },
      ],
    };
    const live = liveSnapshotOf(
      runOf({ kind: "all" }, [
        { path: "packages/alpha/test/one.test.ts", name: "works", status: "passed", durationMs: 1, atMs: 10 },
        { path: "packages/alpha/test/one.test.ts", name: "works", status: "passed", durationMs: 1, atMs: 20 },
      ]),
      settled,
    );

    expect(casesOf(live, "packages/alpha/test/one.test.ts").map(entry => entry.line)).toEqual([4, 9]);
  });

  it("reports line 0 for a case no settled board placed", () => {
    const live = liveSnapshotOf(
      runOf({ kind: "all" }, [
        { path: "packages/alpha/test/one.test.ts", name: "brand new", status: "passed", durationMs: 1, atMs: 10 },
      ]),
      SETTLED,
    );

    expect(casesOf(live, "packages/alpha/test/one.test.ts")[0]?.line).toBe(0);
  });

  it("calls itself a real reading, because it is one", () => {
    const live = liveSnapshotOf(runOf({ kind: "all" }, []), SETTLED);

    expect(live.statusSource).toBe("vitest");
    expect(live.version).toBe(SETTLED.version);
  });
});
