/**
 * Import a vitest JSON report written outside this host.
 *
 * The board's own runs are spawned by the run engine, but a reader also runs
 * `pnpm test` from a terminal or an agent. A vitest JSON report is the one
 * machine-readable trace those runs leave behind; this module turns one into
 * the same cache entry the host writes, so an external run joins the history
 * picker instead of being invisible.
 *
 * The contract is a file, not a process: anything that can ask vitest for
 * `--reporter=json --outputFile=<workspace>/logs/testboard/<name>.vitest.json`
 * feeds the board. The file is renamed after a successful import, so a report
 * cannot produce two history entries when the board polls again.
 */
import { readFileSync } from "node:fs";
import { readdir, readFile, rename } from "node:fs/promises";
import { join } from "node:path";

import type { TestFile, TestPackage, TestSnapshot } from "../client/model.ts";
import type { RunCaseEvent, RunCounts, RunFailure, RunProgress, RunSeriesPoint } from "../shared.ts";
import { parseVitestJson } from "./vitest.ts";
import { RESULT_ROOT, type CachedResult, type ResultsStore } from "./results-store.ts";

/** The suffix a report must carry to be picked up. */
export const REPORT_SUFFIX = ".vitest.json";

/** The directory reports are dropped into. */
export const REPORT_ROOT = RESULT_ROOT;

/** Raw timing stamps of one file in a vitest report. */
interface RawTiming {
  readonly name: string;
  readonly startTime?: number;
  readonly endTime?: number;
}

/**
 * Read the timing half of a vitest report.
 *
 * `parseVitestJson` owns names, statuses and line numbers; timings are only in
 * the raw payload, and the chart needs a completion moment per case.
 * @param raw - the parsed report.
 * @returns the files with only the fields this module reads.
 */
function timingsOf(raw: unknown): RawTiming[] {
  const results = (raw as { readonly testResults?: unknown } | null)?.testResults;
  if (!Array.isArray(results)) return [];
  return results.flatMap((entry): RawTiming[] => {
    if (entry === null || typeof entry !== "object") return [];
    const record = entry as { name?: unknown; startTime?: unknown; endTime?: unknown };
    if (typeof record.name !== "string") return [];
    return [
      {
        name: record.name,
        ...(typeof record.startTime === "number" ? { startTime: record.startTime } : {}),
        ...(typeof record.endTime === "number" ? { endTime: record.endTime } : {}),
      },
    ];
  });
}

/**
 * Count the three statuses into the wire's tally.
 * @param cases - the run's cases.
 * @returns the counts.
 */
function countsOf(cases: readonly RunCaseEvent[]): RunCounts {
  let passed = 0;
  let failed = 0;
  let skipped = 0;
  for (const entry of cases) {
    if (entry.status === "failed") failed += 1;
    else if (entry.status === "skipped") skipped += 1;
    else passed += 1;
  }
  return { passed, failed, skipped, total: passed + failed + skipped };
}

/**
 * Bucket completed cases into one cumulative point per second.
 * @param cases - the run's cases, with their completion offset.
 * @param elapsedMs - the run's wall clock.
 * @returns one point per second, cumulative.
 */
function seriesOf(cases: readonly RunCaseEvent[], elapsedMs: number): RunSeriesPoint[] {
  const sorted = [...cases].sort((left, right) => left.atMs - right.atMs);
  const last = sorted[sorted.length - 1]?.atMs ?? 0;
  const seconds = Math.max(1, Math.ceil(Math.max(elapsedMs, last) / 1000));
  const series: RunSeriesPoint[] = [];
  let index = 0;
  let passed = 0;
  let failed = 0;
  let finished = 0;
  for (let second = 0; second <= seconds; second += 1) {
    const limit = second * 1000;
    while (index < sorted.length && (sorted[index]?.atMs ?? Infinity) <= limit) {
      const entry = sorted[index];
      if (entry === undefined) break;
      finished += 1;
      if (entry.status === "failed") failed += 1;
      else if (entry.status !== "skipped") passed += 1;
      index += 1;
    }
    series.push({ tMs: limit, finished, passed, failed });
  }
  return series;
}

/**
 * Walk a parsed snapshot with the report's file clock.
 *
 * A file's cases start at its own `startTime` and follow each other by their
 * durations. Files run in parallel, so the resulting series reconstructs the
 * per-file order rather than claiming a global clock, which is the best trace a
 * finished process leaves behind.
 * @param snapshot - the parsed snapshot.
 * @param rawFiles - the report's per-file timings.
 * @param runStart - the earliest file start, when the report has stamps.
 * @returns one event per case, in report order.
 */
function caseClock(snapshot: TestSnapshot, rawFiles: readonly RawTiming[], runStart: number | undefined): RunCaseEvent[] {
  const bySuffix = new Map(rawFiles.map(file => [file.name.split(/[\\/]/u).join("/"), file]));
  const events: RunCaseEvent[] = [];
  for (const pkg of snapshot.packages) {
    for (const file of pkg.files) {
      let rawFile: RawTiming | undefined;
      for (const [name, candidate] of bySuffix) {
        if (name.endsWith(`/${file.path}`) || name === file.path) {
          rawFile = candidate;
          break;
        }
      }
      const fileStart = rawFile?.startTime === undefined || runStart === undefined ? 0 : Math.max(0, rawFile.startTime - runStart);
      let offset = 0;
      for (const entry of file.cases) {
        events.push({
          path: file.path,
          name: entry.name,
          status: entry.status === "failed" ? "failed" : entry.status === "skipped" ? "skipped" : "passed",
          durationMs: entry.durationMs,
          atMs: fileStart + offset,
        });
        offset += entry.durationMs;
      }
    }
  }
  return events;
}

/**
 * Merge files the report did not cover from the previous snapshot.
 *
 * A report can be a subset (an affected-only run). The board is a reading of
 * the workspace, so a subset replaces its own files and leaves the rest of the
 * last reading standing; a full report simply replaces everything.
 * @param snapshot - the snapshot parsed from this report.
 * @param previous - the last cached snapshot, when there is one.
 * @returns the snapshot the board should show.
 */
function mergeSnapshot(snapshot: TestSnapshot, previous: CachedResult | undefined): TestSnapshot {
  if (previous === undefined) return snapshot;
  const incoming = new Set(snapshot.packages.flatMap((pkg: TestPackage) => pkg.files.map(file => file.path)));
  const covered = previous.snapshot.packages.flatMap(pkg => pkg.files).filter(file => incoming.has(file.path)).length;
  const all = previous.snapshot.packages.reduce((sum, pkg) => sum + pkg.files.length, 0);
  // A report that names every file the previous reading knew about is a full
  // reading; anything smaller is a patch. An empty previous snapshot makes the
  // report full by definition.
  if (covered >= all) return snapshot;
  const order: string[] = [];
  const files = new Map<string, TestFile[]>();
  for (const pkg of previous.snapshot.packages) {
    order.push(pkg.name);
    files.set(pkg.name, [...pkg.files]);
  }
  for (const pkg of snapshot.packages) {
    let bucket = files.get(pkg.name);
    if (bucket === undefined) {
      bucket = [];
      files.set(pkg.name, bucket);
      order.push(pkg.name);
    }
    for (const file of pkg.files) {
      const index = bucket.findIndex(candidate => candidate.path === file.path);
      if (index === -1) bucket.push(file);
      else bucket[index] = file;
    }
  }
  return { ...previous.snapshot, packages: order.map(name => ({ name, files: files.get(name) ?? [] })) };
}

/**
 * Convert one vitest JSON report into a cache record.
 *
 * `parseVitestJson` is reused so an imported run reads exactly like a spawned
 * one: same package grouping, same line numbers, same case names. The report's
 * timestamps become the run's series; the snapshot is patched over the last
 * reading when the report covers only a subset.
 * @param workspace - the canonical workspace root.
 * @param raw - the parsed report (or its text).
 * @param previous - the last cache entry, for the run number and a partial patch.
 * @param now - the import clock.
 * @returns the record, or undefined when the report has no usable cases.
 */
export function recordFromReport(
  workspace: string,
  raw: unknown,
  previous: CachedResult | undefined,
  now = new Date(),
): { readonly run: RunProgress; readonly snapshot: TestSnapshot } | undefined {
  const snapshot = parseVitestJson(raw, {
    workspace,
    fileTextOf: path => {
      try {
        return readFileSync(join(workspace, path), "utf8");
      } catch {
        return undefined;
      }
    },
    generatedAt: now.toISOString(),
    wallClockMs: 0,
  });
  if (snapshot.packages.length === 0) return undefined;

  const rawFiles = timingsOf(raw);
  const starts = rawFiles.flatMap(file => (typeof file.startTime === "number" ? [file.startTime] : []));
  const ends = rawFiles.flatMap(file => (typeof file.endTime === "number" ? [file.endTime] : []));
  const runStart = starts.length === 0 ? undefined : Math.min(...starts);
  const runEnd = ends.length === 0 ? undefined : Math.max(...ends);
  const events = caseClock(snapshot, rawFiles, runStart);
  const summed = events.reduce((sum, entry) => sum + entry.durationMs, 0);
  const elapsedMs = runStart !== undefined && runEnd !== undefined ? Math.max(1, runEnd - runStart) : Math.max(1, summed);
  const counts = countsOf(events);
  const failures: RunFailure[] = events
    .filter(entry => entry.status === "failed")
    .map(entry => ({ tMs: entry.atMs, path: entry.path, name: entry.name }));
  const run: RunProgress = {
    runId: `import-${String(now.getTime())}`,
    scope: { kind: "all" },
    status: failures.length === 0 ? "passed" : "failed",
    phase: "finished",
    runNumber: (previous?.run.runNumber ?? 0) + 1,
    startedAt: (runStart === undefined ? now : new Date(runStart)).toISOString(),
    finishedAt: now.toISOString(),
    elapsedMs,
    completedFiles: snapshot.packages.reduce((sum, pkg) => sum + pkg.files.length, 0),
    totalFiles: null,
    counts,
    series: seriesOf(events, elapsedMs),
    failures,
    cases: events,
  };
  return { run, snapshot: mergeSnapshot(snapshot, previous) };
}

/**
 * Import every report waiting under the workspace's cache root.
 *
 * Reports are claimed by renaming them first, so two concurrent board reads
 * cannot import the same file twice. A report that does not parse is renamed
 * with a `.bad` suffix rather than retried on every poll.
 * @param workspace - the canonical workspace root.
 * @param results - the cache the records are written to.
 * @param now - the import clock.
 * @returns how many reports were imported.
 */
export async function importReports(
  workspace: string,
  results: Pick<ResultsStore, "latest" | "save">,
  now = new Date(),
): Promise<number> {
  const root = join(workspace, REPORT_ROOT);
  let names: string[];
  try {
    names = (await readdir(root, { withFileTypes: true }))
      .filter(entry => entry.isFile() && entry.name.endsWith(REPORT_SUFFIX))
      .map(entry => entry.name);
  } catch {
    return 0;
  }
  let imported = 0;
  let previous = await results.latest(workspace);
  for (const name of names) {
    const source = join(root, name);
    const claimed = `${source}.importing`;
    try {
      await rename(source, claimed);
    } catch {
      continue;
    }
    try {
      const raw: unknown = JSON.parse(await readFile(claimed, "utf8"));
      const record = recordFromReport(workspace, raw, previous, now);
      if (record === undefined) {
        await rename(claimed, `${source}.bad`);
        continue;
      }
      const saved = await results.save(workspace, record, now);
      if (saved === undefined) {
        await rename(claimed, source);
        continue;
      }
      await rename(claimed, `${source}.imported`);
      imported += 1;
      previous = { savedAt: now.toISOString(), ...record };
    } catch {
      await rename(claimed, `${source}.bad`).catch(() => undefined);
    }
  }
  return imported;
}
