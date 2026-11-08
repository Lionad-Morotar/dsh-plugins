/**
 * The board's read model: what the view asks of the snapshot.
 *
 * These are the decisions the UI will lean on, so they are pinned here rather
 * than discovered in the view: a summary counts what the board shows, the row
 * list applies filter, query and sort in one pass, and grouping keeps the
 * package order stable so the board does not reshuffle between renders.
 */
import { describe, expect, it } from "vitest";

import { groupByPackage, listRows, summarize, type TestCase, type TestSnapshot } from "../src/client/model.ts";

const CASES: TestCase[] = [
  { path: "packages/a/test/one.test.ts", name: "passes quickly", status: "passed", durationMs: 4 },
  { path: "packages/a/test/one.test.ts", name: "fails slowly", status: "failed", durationMs: 900 },
  { path: "packages/b/test/two.test.ts", name: "passes slowly", status: "passed", durationMs: 700 },
  { path: "packages/b/test/two.test.ts", name: "skipped one", status: "skipped", durationMs: 1 },
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
    });
  });

  it("reports an empty snapshot as zeroes rather than NaN", () => {
    expect(summarize({ version: 1, statusSource: "synthetic", packages: [] })).toEqual({
      total: 0,
      passed: 0,
      failed: 0,
      skipped: 0,
      durationMs: 0,
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
                { path: "packages/a/test/one.test.ts", name: "zeta", status: "passed", durationMs: 5 },
                { path: "packages/a/test/one.test.ts", name: "alpha", status: "passed", durationMs: 5 },
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
