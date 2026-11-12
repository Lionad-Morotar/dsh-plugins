/**
 * External vitest reports joining the board's history.
 *
 * The importer is the bridge between a run the host did not spawn and the cache
 * the board already knows how to read. These tests pin the two decisions that
 * make that safe: the report's timestamps place its cases, and a subset report
 * patches the last reading instead of deleting the files it did not cover.
 */
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { createResultsStore, RESULT_ROOT } from "../src/host/results-store.ts";
import { importReports, recordFromReport, REPORT_SUFFIX } from "../src/host/report-import.ts";

let workspace: string;

beforeEach(async () => {
  workspace = await mkdtemp(join(tmpdir(), "dsh-testboard-import-"));
});

afterEach(async () => {
  await rm(workspace, { recursive: true, force: true });
});

/** One vitest JSON report covering two files, one red. */
function report(): unknown {
  return {
    numTotalTests: 4,
    startTime: 1_000,
    testResults: [
      {
        name: join(workspace, "tests/a.test.ts"),
        startTime: 1_000,
        endTime: 1_500,
        status: "failed",
        assertionResults: [
          { title: "a1", status: "passed", duration: 100 },
          { title: "a2", status: "failed", duration: 200, failureMessages: ["boom"] },
        ],
      },
      {
        name: join(workspace, "packages/beta/tests/b.test.ts"),
        startTime: 1_200,
        endTime: 1_400,
        status: "passed",
        assertionResults: [
          { title: "b1", status: "passed", duration: 50 },
          { title: "b2", status: "skipped", duration: 0 },
        ],
      },
    ],
  };
}

describe("recordFromReport", () => {
  it("turns the report into a finished run and the same snapshot the parser builds", () => {
    const record = recordFromReport(workspace, report(), undefined, new Date("2026-11-12T02:00:00.000Z"));
    if (record === undefined) throw new Error("no record");

    expect(record.snapshot.packages.map(pkg => pkg.name)).toEqual([".", "beta"]);
    expect(record.run.phase).toBe("finished");
    expect(record.run.status).toBe("failed");
    expect(record.run.counts).toEqual({ passed: 2, failed: 1, skipped: 1, total: 4 });
    expect(record.run.elapsedMs).toBe(500);
    expect(record.run.failures.map(failure => failure.name)).toEqual(["a2"]);
    // The first point is the start line: it already carries the cases whose
    // file started at offset zero, and the last second accounts for both files.
    expect(record.run.series[0]).toMatchObject({ tMs: 0, finished: 1 });
    expect(record.run.series[record.run.series.length - 1]).toMatchObject({ passed: 2, failed: 1 });
  });

  it("records the case names the board row will show", () => {
    const record = recordFromReport(workspace, report(), undefined);
    const names = record?.snapshot.packages.flatMap(pkg => pkg.files.flatMap(file => file.cases.map(entry => entry.name)));
    expect(names).toEqual(["a1", "a2", "b1", "b2"]);
  });

  it("answers undefined for a report with no cases", () => {
    expect(recordFromReport(workspace, { testResults: [] }, undefined)).toBeUndefined();
  });

  it("patches a subset report over the previous reading instead of dropping its files", () => {
    const full = recordFromReport(workspace, report(), undefined);
    if (full === undefined) throw new Error("no full record");
    const previous = { savedAt: "2026-11-12T02:00:00.000Z", ...full };

    const subset = {
      testResults: [
        {
          name: join(workspace, "tests/a.test.ts"),
          startTime: 2_000,
          endTime: 2_100,
          assertionResults: [{ title: "a1", status: "passed", duration: 10 }],
        },
      ],
    };
    const patched = recordFromReport(workspace, subset, previous, new Date("2026-11-12T02:05:00.000Z"));
    if (patched === undefined) throw new Error("no patched record");

    // a.test.ts is replaced by the subset; beta's file is still on the board.
    expect(patched.snapshot.packages.flatMap(pkg => pkg.files).map(file => file.path).sort()).toEqual([
      "packages/beta/tests/b.test.ts",
      "tests/a.test.ts",
    ]);
    expect(patched.run.runNumber).toBe(2);
    expect(patched.run.counts.total).toBe(1);
  });
});

describe("importReports", () => {
  it("imports a waiting report, records it, and does not import it twice", async () => {
    const store = createResultsStore();
    const root = join(workspace, RESULT_ROOT);
    await mkdir(root, { recursive: true });
    const file = join(root, `external${REPORT_SUFFIX}`);
    await writeFile(file, JSON.stringify(report()), "utf8");

    expect(await importReports(workspace, store, new Date("2026-11-12T02:00:00.000Z"))).toBe(1);
    await expect(readFile(`${file}.imported`, "utf8")).resolves.toContain("tests/a.test.ts");

    const latest = await store.latest(workspace);
    expect(latest?.run.counts.failed).toBe(1);
    expect(latest?.snapshot.packages).toHaveLength(2);

    // The renamed file is no longer a candidate; a poll that follows must not
    // append the same run again.
    expect(await importReports(workspace, store)).toBe(0);
  });

  it("quarantines a malformed report instead of retrying it forever", async () => {
    const store = createResultsStore();
    const root = join(workspace, RESULT_ROOT);
    await mkdir(root, { recursive: true });
    const file = join(root, `broken${REPORT_SUFFIX}`);
    await writeFile(file, "{ not json", "utf8");

    expect(await importReports(workspace, store)).toBe(0);
    await expect(readFile(`${file}.bad`, "utf8")).resolves.toContain("not json");
  });

  it("answers zero for a workspace with no report directory", async () => {
    expect(await importReports(workspace, createResultsStore())).toBe(0);
  });
});
