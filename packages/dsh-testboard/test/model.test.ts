/**
 * The board's read model: what the view asks of the snapshot.
 *
 * These are the decisions the UI will lean on, so they are pinned here rather
 * than discovered in the view: a summary counts what the board shows, the row
 * lists apply filter, query and sort in one pass, and grouping keeps the
 * package order stable so the board does not reshuffle between renders.
 */
import { describe, expect, it } from "vitest";

import snapshotData from "../src/client/data/snapshot.json" with { type: "json" };

import {
  groupByPackage,
  groupFileRows,
  listFileRows,
  listRows,
  PARALLEL_TEST_PROCESSES,
  peakThroughput,
  summarize,
  throughputSeries,
  wallClockMs,
  type TestCase,
  type TestSnapshot,
} from "../src/client/model.ts";

/**
 * The committed snapshot, for the assertions that are about the real suite.
 *
 * The hand-built fixture below is the right tool for behaviour; the size and
 * shape of the repository's own run can only be checked against the data the
 * board actually ships.
 */
const REAL_SNAPSHOT = snapshotData as unknown as TestSnapshot;

const CASES: TestCase[] = [
  { path: "packages/a/test/one.test.ts", line: 1, name: "passes quickly", status: "passed", durationMs: 4 },
  { path: "packages/a/test/one.test.ts", line: 1, name: "fails slowly", status: "failed", durationMs: 900 },
  { path: "packages/b/test/two.test.ts", line: 1, name: "passes slowly", status: "passed", durationMs: 700 },
  { path: "packages/b/test/two.test.ts", line: 1, name: "skipped one", status: "skipped", durationMs: 1 },
];

const SNAPSHOT: TestSnapshot = {
  version: 1,
  statusSource: "synthetic",
  packages: [
    { name: "a", files: [{ path: "packages/a/test/one.test.ts", cases: CASES.slice(0, 2) }] },
    { name: "b", files: [{ path: "packages/b/test/two.test.ts", cases: CASES.slice(2) }] },
  ],
};

describe("summarize", () => {
  it("counts cases by status and totals their duration", () => {
    expect(summarize(SNAPSHOT)).toEqual({
      total: 4,
      passed: 2,
      failed: 1,
      skipped: 1,
      durationMs: 1605,
      wallClockMs: Math.ceil(1605 / PARALLEL_TEST_PROCESSES),
    });
  });

  it("reports an empty snapshot as zeroes rather than NaN", () => {
    expect(summarize({ version: 1, statusSource: "synthetic", packages: [] })).toEqual({
      total: 0,
      passed: 0,
      failed: 0,
      skipped: 0,
      durationMs: 0,
      wallClockMs: 0,
    });
  });
});

describe("listRows", () => {
  it("flattens every case into a row carrying its file and package", () => {
    const rows = listRows(SNAPSHOT, { filter: "all", query: "", sort: "fail-first" });
    expect(rows).toHaveLength(4);
    expect(rows[0]).toMatchObject({ packageName: expect.any(String), path: expect.any(String), name: expect.any(String) });
  });

  it("keeps only failures when the filter asks for them", () => {
    const rows = listRows(SNAPSHOT, { filter: "failed", query: "", sort: "fail-first" });
    expect(rows.map(row => row.name)).toEqual(["fails slowly"]);
  });

  it("matches the query against the file path, case-insensitively", () => {
    expect(listRows(SNAPSHOT, { filter: "all", query: "TWO.test", sort: "fail-first" }).map(row => row.name)).toEqual([
      "passes slowly",
      "skipped one",
    ]);
    expect(listRows(SNAPSHOT, { filter: "all", query: "nothing-matches", sort: "fail-first" })).toEqual([]);
  });

  it("puts failures first, then the slowest", () => {
    expect(listRows(SNAPSHOT, { filter: "all", query: "", sort: "fail-first" }).map(row => row.name)).toEqual([
      "fails slowly",
      "passes slowly",
      "passes quickly",
      "skipped one",
    ]);
  });

  it("orders purely by duration when asked for the slowest first", () => {
    expect(listRows(SNAPSHOT, { filter: "all", query: "", sort: "slow-first" }).map(row => row.name)).toEqual([
      "fails slowly",
      "passes slowly",
      "passes quickly",
      "skipped one",
    ]);
  });

  it("breaks ties by name so the order is stable", () => {
    const tied: TestSnapshot = {
      version: 1,
      statusSource: "synthetic",
      packages: [
        {
          name: "a",
          files: [
            {
              path: "packages/a/test/one.test.ts",
              cases: [
                { path: "packages/a/test/one.test.ts", line: 1, name: "zeta", status: "passed", durationMs: 5 },
                { path: "packages/a/test/one.test.ts", line: 1, name: "alpha", status: "passed", durationMs: 5 },
              ],
            },
          ],
        },
      ],
    };
    expect(listRows(tied, { filter: "all", query: "", sort: "slow-first" }).map(row => row.name)).toEqual(["alpha", "zeta"]);
  });
});

describe("groupByPackage", () => {
  it("groups rows by package and keeps the snapshot's package order", () => {
    const rows = listRows(SNAPSHOT, { filter: "all", query: "", sort: "fail-first" });
    const groups = groupByPackage(rows);
    expect(groups.map(group => group.packageName)).toEqual(["a", "b"]);
    expect(groups[0]?.rows).toHaveLength(2);
    expect(groups[1]?.rows).toHaveLength(2);
  });

  it("drops packages whose every row was filtered out", () => {
    const rows = listRows(SNAPSHOT, { filter: "failed", query: "", sort: "fail-first" });
    expect(groupByPackage(rows).map(group => group.packageName)).toEqual(["a"]);
  });
});

describe("listFileRows", () => {
  it("returns one row per file, with its case tallies", () => {
    const rows = listFileRows(SNAPSHOT, { filter: "all", query: "", sort: "fail-first" });
    expect(rows.map(row => row.path)).toEqual(["packages/a/test/one.test.ts", "packages/b/test/two.test.ts"]);
    expect(rows[0]).toMatchObject({ packageName: "a", passed: 1, failed: 1, skipped: 0, hasFailed: true });
    expect(rows[1]).toMatchObject({ packageName: "b", passed: 1, failed: 0, skipped: 1, hasFailed: false });
  });

  it("sums a file's duration from its cases", () => {
    const rows = listFileRows(SNAPSHOT, { filter: "all", query: "", sort: "fail-first" });
    expect(rows[0]?.durationMs).toBe(904);
    expect(rows[1]?.durationMs).toBe(701);
  });

  it("keeps only files holding at least one failure when filtering", () => {
    const rows = listFileRows(SNAPSHOT, { filter: "failed", query: "", sort: "fail-first" });
    expect(rows.map(row => row.path)).toEqual(["packages/a/test/one.test.ts"]);
    // The filter picks files, not cases: the row still carries every case so the
    // expanded list shows the passing siblings beside the failure.
    expect(rows[0]?.cases).toHaveLength(2);
  });

  it("matches the query against the file path, case-insensitively", () => {
    expect(listFileRows(SNAPSHOT, { filter: "all", query: "TWO.test", sort: "fail-first" }).map(row => row.path)).toEqual([
      "packages/b/test/two.test.ts",
    ]);
    expect(listFileRows(SNAPSHOT, { filter: "all", query: "nope", sort: "fail-first" })).toEqual([]);
  });

  it("orders purely by total duration when asked for the slowest first", () => {
    const rows = listFileRows(SNAPSHOT, { filter: "all", query: "", sort: "slow-first" });
    expect(rows.map(row => row.durationMs)).toEqual([904, 701]);
  });

  it("breaks duration ties by path so the order is stable", () => {
    const tied: TestSnapshot = {
      version: 1,
      statusSource: "synthetic",
      packages: [
        {
          name: "a",
          files: [
            {
              path: "packages/a/test/zeta.test.ts",
              cases: [{ path: "packages/a/test/zeta.test.ts", line: 1, name: "z", status: "passed", durationMs: 5 }],
            },
            {
              path: "packages/a/test/alpha.test.ts",
              cases: [{ path: "packages/a/test/alpha.test.ts", line: 1, name: "a", status: "passed", durationMs: 5 }],
            },
          ],
        },
      ],
    };
    expect(listFileRows(tied, { filter: "all", query: "", sort: "slow-first" }).map(row => row.path)).toEqual([
      "packages/a/test/alpha.test.ts",
      "packages/a/test/zeta.test.ts",
    ]);
  });
});

describe("groupFileRows", () => {
  it("groups file rows by package, package name ascending", () => {
    const groups = groupFileRows(listFileRows(SNAPSHOT, { filter: "all", query: "", sort: "fail-first" }));
    expect(groups.map(group => group.packageName)).toEqual(["a", "b"]);
    expect(groups[0]?.rows).toHaveLength(1);
  });

  it("drops a package whose files were all filtered out", () => {
    const groups = groupFileRows(listFileRows(SNAPSHOT, { filter: "failed", query: "", sort: "fail-first" }));
    expect(groups.map(group => group.packageName)).toEqual(["a"]);
  });
});

describe("throughputSeries", () => {
  it("buckets completions by wall clock, not by summed case time", () => {
    // 4 cases over 1605ms of case time. Twelve processes run the suite at once,
    // so the run itself takes ~134ms and fits in a single second. Summing the
    // durations instead would draw 1605 seconds of timeline for a run that never
    // took that long.
    const series = throughputSeries(SNAPSHOT);
    expect(series.map(bucket => bucket.second)).toEqual([0]);
    expect(series.map(bucket => bucket.completed)).toEqual([4]);
  });

  it("spans about two hundred seconds for the repository's own suite", () => {
    const series = throughputSeries(REAL_SNAPSHOT);
    // 2,467,345ms of case time over 12 processes is ~206s of wall clock. The
    // band is loose on purpose: it pins the order of magnitude, which is the
    // thing that was wrong, without turning every regenerated snapshot into a
    // red suite.
    expect(series.length).toBeGreaterThan(180);
    expect(series.length).toBeLessThan(230);
  });

  it("keeps the peak readable once the run is folded onto wall clock", () => {
    const peak = peakThroughput(throughputSeries(REAL_SNAPSHOT));
    // A readable spike: tens of cases a second, not a thousand.
    expect(peak).toBeGreaterThan(10);
    expect(peak).toBeLessThan(60);
  });

  it("is deterministic and never reads the clock", () => {
    expect(throughputSeries(SNAPSHOT)).toEqual(throughputSeries(SNAPSHOT));
  });

  it("returns a dense series, with a zero bucket for a quiet second", () => {
    // A sparse array here leaves holes that `map` skips, and the sparkline then
    // draws a path with missing segments. A second with no completion is a real
    // reading of zero, so it has to be present.
    const quiet: TestSnapshot = {
      version: 1,
      statusSource: "synthetic",
      packages: [
        {
          name: "a",
          files: [
            {
              path: "packages/a/test/one.test.ts",
              cases: [
                { path: "packages/a/test/one.test.ts", line: 1, name: "first", status: "passed", durationMs: 500 },
                // 30s of case time is 2.5s of wall clock across 12 processes, so
                // this lands in the third second and leaves the second one quiet.
                { path: "packages/a/test/one.test.ts", line: 1, name: "late", status: "passed", durationMs: 30_000 },
              ],
            },
          ],
        },
      ],
    };
    const series = throughputSeries(quiet);
    expect(series).toHaveLength(3);
    expect(series.map(bucket => bucket.completed)).toEqual([1, 0, 1]);
    expect(series.every(bucket => typeof bucket.completed === "number")).toBe(true);
  });

  it("puts every failure pin in the second that failure finished", () => {
    const series = throughputSeries(REAL_SNAPSHOT);
    const failedCases = REAL_SNAPSHOT.packages
      .flatMap(pkg => pkg.files.flatMap(file => file.cases))
      .filter(entry => entry.status === "failed");
    expect(series.reduce((sum, bucket) => sum + bucket.failed, 0)).toBe(failedCases.length);
    // No pin may land past the end of the series: a pin outside the drawn range
    // is a failure the chart silently drops.
    expect(series.every(bucket => bucket.second < series.length)).toBe(true);
  });

  it("returns an empty series for an empty snapshot", () => {
    expect(throughputSeries({ version: 1, statusSource: "synthetic", packages: [] })).toEqual([]);
    expect(peakThroughput([])).toBe(0);
  });
});

describe("wallClockMs", () => {
  it("folds the summed case time onto the parallel run", () => {
    // 1605ms of case time over 12 processes is 134ms of wall clock.
    expect(wallClockMs(SNAPSHOT)).toBe(Math.ceil(1605 / PARALLEL_TEST_PROCESSES));
  });

  it("agrees with the summary's own reading", () => {
    expect(summarize(REAL_SNAPSHOT).wallClockMs).toBe(wallClockMs(REAL_SNAPSHOT));
  });

  it("leaves the serial duration alone", () => {
    // `durationMs` keeps its old meaning: the sum of every case. Only the new
    // field is the wall clock, so existing readers do not change behaviour.
    // Asserted against the snapshot's own sum rather than a literal: the number
    // moves whenever this repository's tests change, and pinning it would make
    // every such change look like a regression in the model.
    const serial = REAL_SNAPSHOT.packages
      .flatMap(pkg => pkg.files.flatMap(file => file.cases))
      .reduce((sum, entry) => sum + entry.durationMs, 0);
    expect(summarize(REAL_SNAPSHOT).durationMs).toBe(serial);
    expect(summarize(REAL_SNAPSHOT).wallClockMs).toBeLessThan(serial);
  });

  it("reports zero for an empty snapshot", () => {
    expect(wallClockMs({ version: 1, statusSource: "synthetic", packages: [] })).toBe(0);
  });
});
