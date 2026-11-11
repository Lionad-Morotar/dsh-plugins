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
  directoryKeysForFile,
  groupByPackage,
  groupFileRows,
  groupFileRowsIntoTree,
  listFileRows,
  listRows,
  nearestVisiblePath,
  PARALLEL_TEST_PROCESSES,
  peakThroughput,
  summarize,
  throughputSeries,
  treeFileRows,
  visibleFileRows,
  wallClockMs,
  type TestCase,
  type TestFileRow,
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

/**
 * One file row, built by hand.
 *
 * The tree builder is a pure function over rows, so its fixtures are rows: going
 * through a snapshot would make every case carry a package and a file it does
 * not care about, and the order the builder must preserve is the order of this
 * array, which a snapshot cannot express.
 * @param packageName - owning package.
 * @param path - repo-relative test path.
 * @param failed - how many of the file's cases failed.
 * @param durationMs - the file's summed case time.
 * @returns the row.
 */
function fileRow(packageName: string, path: string, failed = 0, durationMs = 0): TestFileRow {
  return { packageName, path, cases: [], passed: 0, failed, skipped: 0, durationMs, hasFailed: failed > 0 };
}

describe("groupFileRowsIntoTree", () => {
  it("nests directories by path segment and keys each by its full path", () => {
    const tree = groupFileRowsIntoTree([
      fileRow("a", "packages/a/test/unit/two.test.ts"),
      fileRow("a", "packages/a/test/unit/deep/one.test.ts"),
      fileRow("a", "packages/a/test/integration/three.test.ts"),
    ]);

    expect(tree).toHaveLength(1);
    const pkg = tree[0];
    if (pkg === undefined) throw new Error("no package");
    expect(pkg.grouped).toBe(true);
    // A grouped package renders its rows through the tree, so the flat list is
    // empty: two sources of the same row would render it twice.
    expect(pkg.rows).toEqual([]);
    expect(pkg.directories.map(node => node.name)).toEqual(["test"]);

    const test = pkg.directories[0];
    if (test === undefined) throw new Error("no test dir");
    expect(test.key).toBe("test");
    expect(test.depth).toBe(0);
    expect(test.directories.map(node => node.name)).toEqual(["integration", "unit"]);

    const unit = test.directories[1];
    if (unit === undefined) throw new Error("no unit dir");
    expect(unit.key).toBe("test/unit");
    expect(unit.depth).toBe(1);
    expect(unit.files.map(row => row.path)).toEqual(["packages/a/test/unit/two.test.ts"]);
    expect(unit.directories.map(node => node.name)).toEqual(["deep"]);
    expect(unit.directories[0]?.key).toBe("test/unit/deep");
    expect(unit.directories[0]?.depth).toBe(2);
  });

  it("orders sibling directories by segment name, not by insertion", () => {
    const tree = groupFileRowsIntoTree([
      fileRow("a", "packages/a/zeta/one.test.ts"),
      fileRow("a", "packages/a/alpha/two.test.ts"),
      fileRow("a", "packages/a/middle/three.test.ts"),
    ]);
    expect(tree[0]?.directories.map(node => node.key)).toEqual(["alpha", "middle", "zeta"]);
  });

  it("keeps the input's file order inside a directory", () => {
    // The rows arrive already filtered, searched and sorted; re-sorting them here
    // would quietly undo the reader's chosen order.
    const tree = groupFileRowsIntoTree([
      fileRow("a", "packages/a/test/unit/zeta.test.ts"),
      fileRow("a", "packages/a/test/unit/alpha.test.ts"),
    ]);
    expect(tree[0]?.directories[0]?.directories[0]?.files.map(row => row.path)).toEqual([
      "packages/a/test/unit/zeta.test.ts",
      "packages/a/test/unit/alpha.test.ts",
    ]);
  });

  it("keeps a package whose only directory has no children flat", () => {
    const tree = groupFileRowsIntoTree([
      fileRow("a", "packages/a/test/one.test.ts"),
      fileRow("a", "packages/a/test/two.test.ts"),
    ]);
    const pkg = tree[0];
    if (pkg === undefined) throw new Error("no package");
    expect(pkg.grouped).toBe(false);
    expect(pkg.directories).toEqual([]);
    expect(pkg.rows.map(row => row.path)).toEqual(["packages/a/test/one.test.ts", "packages/a/test/two.test.ts"]);
  });

  it("groups a package whose one top directory has subdirectories", () => {
    // The suppression is about a package that has nothing to nest, not about the
    // number of top-level directories: `test` plus `test/integration` is a tree.
    const tree = groupFileRowsIntoTree([
      fileRow("a", "packages/a/test/one.test.ts"),
      fileRow("a", "packages/a/test/integration/two.test.ts"),
    ]);
    const pkg = tree[0];
    if (pkg === undefined) throw new Error("no package");
    expect(pkg.grouped).toBe(true);
    expect(pkg.directories.map(node => node.key)).toEqual(["test"]);
    expect(pkg.directories[0]?.directories.map(node => node.key)).toEqual(["test/integration"]);
  });

  it("uses the whole path as the directory for the root group", () => {
    // The root group's rows are not under `packages/./`, so there is no prefix to
    // strip: `tests/server/api` is already the directory.
    const tree = groupFileRowsIntoTree([
      fileRow(".", "tests/server/api/one.test.ts"),
      fileRow(".", "tests/client/two.test.ts"),
    ]);
    const pkg = tree[0];
    if (pkg === undefined) throw new Error("no package");
    expect(pkg.packageName).toBe(".");
    expect(pkg.grouped).toBe(true);
    expect(pkg.directories.map(node => node.key)).toEqual(["tests"]);
    expect(pkg.directories[0]?.directories.map(node => node.key)).toEqual(["tests/client", "tests/server"]);
    expect(pkg.directories[0]?.directories[1]?.directories.map(node => node.key)).toEqual(["tests/server/api"]);
  });

  it("aggregates file, failure and duration totals up the tree", () => {
    const tree = groupFileRowsIntoTree([
      fileRow("a", "packages/a/test/one.test.ts", 2, 100),
      fileRow("a", "packages/a/test/unit/two.test.ts", 1, 50),
      fileRow("a", "packages/a/test/unit/deep/three.test.ts", 0, 25),
    ]);
    const test = tree[0]?.directories[0];
    if (test === undefined) throw new Error("no test dir");
    expect(test.stats).toEqual({ files: 3, failed: 3, durationMs: 175 });
    expect(test.directories[0]?.stats).toEqual({ files: 2, failed: 1, durationMs: 75 });
  });

  it("orders packages by name, like groupFileRows", () => {
    const tree = groupFileRowsIntoTree([
      fileRow("b", "packages/b/test/one.test.ts"),
      fileRow("a", "packages/a/test/two.test.ts"),
    ]);
    expect(tree.map(pkg => pkg.packageName)).toEqual(["a", "b"]);
  });

  it("reports nothing for an empty row list", () => {
    expect(groupFileRowsIntoTree([])).toEqual([]);
  });

  it("keeps every file of the real snapshot exactly once", () => {
    const rows = listFileRows(REAL_SNAPSHOT, { filter: "all", query: "", sort: "fail-first" });
    const tree = groupFileRowsIntoTree(rows);
    const seen = tree.flatMap(pkg => treeFileRows(pkg)).map(row => row.path);
    expect(seen).toHaveLength(rows.length);
    expect(new Set(seen).size).toBe(rows.length);
  });
});

describe("treeFileRows", () => {
  it("walks a grouped tree in render order: a directory's files, then its children", () => {
    const tree = groupFileRowsIntoTree([
      fileRow("a", "packages/a/test/integration/three.test.ts"),
      fileRow("a", "packages/a/test/one.test.ts"),
      fileRow("a", "packages/a/test/unit/two.test.ts"),
    ]);
    const pkg = tree[0];
    if (pkg === undefined) throw new Error("no package");
    // The order the tree draws, which is also the order the keyboard walks: a
    // flat list in any other order would make ArrowDown jump around the screen.
    expect(treeFileRows(pkg).map(row => row.path)).toEqual([
      "packages/a/test/one.test.ts",
      "packages/a/test/integration/three.test.ts",
      "packages/a/test/unit/two.test.ts",
    ]);
  });

  it("returns a flat package's own rows untouched", () => {
    const tree = groupFileRowsIntoTree([
      fileRow("a", "packages/a/test/zeta.test.ts"),
      fileRow("a", "packages/a/test/alpha.test.ts"),
    ]);
    const pkg = tree[0];
    if (pkg === undefined) throw new Error("no package");
    expect(treeFileRows(pkg).map(row => row.path)).toEqual([
      "packages/a/test/zeta.test.ts",
      "packages/a/test/alpha.test.ts",
    ]);
  });
});

describe("visibleFileRows", () => {
  /** A tree with two top directories, one of them nested. */
  const TREE = groupFileRowsIntoTree([
    fileRow("a", "packages/a/test/one.test.ts"),
    fileRow("a", "packages/a/test/unit/two.test.ts"),
    fileRow("a", "packages/a/test/unit/deep/three.test.ts"),
    fileRow("a", "packages/a/integration/four.test.ts"),
  ]);

  it("returns every row when nothing is collapsed", () => {
    // Render order is the tree's: directories by segment name, so `integration`
    // comes before `test`.
    expect(visibleFileRows(TREE, new Set()).map(row => row.path)).toEqual([
      "packages/a/integration/four.test.ts",
      "packages/a/test/one.test.ts",
      "packages/a/test/unit/two.test.ts",
      "packages/a/test/unit/deep/three.test.ts",
    ]);
  });

  it("drops a collapsed leaf directory's files", () => {
    expect(visibleFileRows(TREE, new Set(["a:test/unit/deep"])).map(row => row.path)).toEqual([
      "packages/a/integration/four.test.ts",
      "packages/a/test/one.test.ts",
      "packages/a/test/unit/two.test.ts",
    ]);
  });

  it("drops a collapsed parent's own files and its whole subtree", () => {
    // Collapsing `test/unit` has to take `test/unit/deep` with it: the child is
    // not on screen either, so its rows must not be navigable.
    expect(visibleFileRows(TREE, new Set(["a:test/unit"])).map(row => row.path)).toEqual([
      "packages/a/integration/four.test.ts",
      "packages/a/test/one.test.ts",
    ]);
  });

  it("keeps a flat package's rows whatever is collapsed", () => {
    // A suppressed package has no headers, so no key can name it; a stray key
    // must not hide its rows.
    const flat = groupFileRowsIntoTree([
      fileRow("b", "packages/b/test/one.test.ts"),
      fileRow("b", "packages/b/test/two.test.ts"),
    ]);
    expect(visibleFileRows(flat, new Set(["b:test"])).map(row => row.path)).toEqual([
      "packages/b/test/one.test.ts",
      "packages/b/test/two.test.ts",
    ]);
  });

  it("collapses the root group's directories by their own keys", () => {
    const root = groupFileRowsIntoTree([
      fileRow(".", "tests/client/a.test.ts"),
      fileRow(".", "tests/server/api/b.test.ts"),
    ]);
    expect(visibleFileRows(root, new Set([".:tests/server"])).map(row => row.path)).toEqual([
      "tests/client/a.test.ts",
    ]);
  });

  it("returns nothing when every directory is collapsed", () => {
    expect(visibleFileRows(TREE, new Set(["a:test", "a:integration"]))).toEqual([]);
  });
});

describe("directoryKeysForFile", () => {
  it("lists a package file's directories from the root down", () => {
    expect(directoryKeysForFile("packages/a/test/unit/deep/three.test.ts", "a")).toEqual([
      "a:test",
      "a:test/unit",
      "a:test/unit/deep",
    ]);
  });

  it("uses the whole path for a root-group file", () => {
    expect(directoryKeysForFile("tests/server/api/b.test.ts", ".")).toEqual([
      ".:tests",
      ".:tests/server",
      ".:tests/server/api",
    ]);
  });

  it("returns nothing for a file at its package root", () => {
    expect(directoryKeysForFile("packages/a/one.test.ts", "a")).toEqual([]);
  });
});

describe("nearestVisiblePath", () => {
  const ALL = [
    fileRow("a", "packages/a/test/one.test.ts"),
    fileRow("a", "packages/a/test/unit/two.test.ts"),
    fileRow("a", "packages/a/test/unit/deep/three.test.ts"),
    fileRow("a", "packages/a/integration/four.test.ts"),
  ];

  it("keeps a selection that is still visible", () => {
    const visible = [ALL[0]!, ALL[3]!];
    expect(nearestVisiblePath(ALL, visible, "packages/a/test/one.test.ts")).toBe("packages/a/test/one.test.ts");
  });

  it("moves forward to the next visible row", () => {
    const visible = [ALL[0]!, ALL[3]!];
    expect(nearestVisiblePath(ALL, visible, "packages/a/test/unit/two.test.ts")).toBe(
      "packages/a/integration/four.test.ts",
    );
  });

  it("falls back to the previous visible row when nothing follows", () => {
    const tail = [ALL[0]!, ALL[1]!];
    expect(nearestVisiblePath(ALL, tail, "packages/a/integration/four.test.ts")).toBe(
      "packages/a/test/unit/two.test.ts",
    );
  });

  it("returns undefined when nothing is visible", () => {
    expect(nearestVisiblePath(ALL, [], "packages/a/test/one.test.ts")).toBeUndefined();
  });

  it("returns undefined for a path that is not in the full order", () => {
    expect(nearestVisiblePath(ALL, [ALL[0]!], "packages/a/nope.test.ts")).toBeUndefined();
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

  it("spans a few hundred seconds for the repository's own suite", () => {
    const series = throughputSeries(REAL_SNAPSHOT);
    // The band pins the order of magnitude, which is the thing that was wrong
    // (a serial sum drew a four-minute suite as forty), and nothing finer: the
    // corpus grows on its own as packages, submodules and test files are added,
    // so any tighter ceiling turns an unrelated commit into a red suite. The
    // floor still catches the real regression, a snapshot that stopped summing
    // case durations; the ceiling catches a sum that stopped being divided by
    // the parallel-process count.
    expect(series.length).toBeGreaterThan(180);
    expect(series.length).toBeLessThan(360);
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
