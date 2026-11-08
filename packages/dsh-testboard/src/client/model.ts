/**
 * The board's read model: the shape of the snapshot and every pure query the
 * view makes over it.
 *
 * Kept free of React and of the loader so the board's behaviour can be tested
 * without a DOM or a chunk fetch. The view owns rendering; this module owns what
 * counts as a row, what a filter means and which order the rows come back in.
 */

/** One case's synthetic reading. */
export type TestStatus = "passed" | "failed" | "skipped";

/** One case, as stored in the snapshot. `path` is repeated per case so a row is self-describing. */
export interface TestCase {
  readonly path: string;
  readonly name: string;
  readonly status: TestStatus;
  readonly durationMs: number;
}

/** One test file and its cases. */
export interface TestFile {
  readonly path: string;
  readonly cases: readonly TestCase[];
}

/** One package and its test files. */
export interface TestPackage {
  readonly name: string;
  readonly files: readonly TestFile[];
}

/**
 * The whole snapshot.
 *
 * `statusSource` is part of the data, not a comment: the board renders a
 * prototype, and a reader (or a later slice) must be able to tell a synthetic
 * reading from a real run without consulting this package's source.
 */
export interface TestSnapshot {
  readonly version: number;
  readonly statusSource: "synthetic";
  readonly packages: readonly TestPackage[];
}

/** Totals for the board's header. */
export interface TestSummary {
  readonly total: number;
  readonly passed: number;
  readonly failed: number;
  readonly skipped: number;
  readonly durationMs: number;
}

/** Which rows the board shows. */
export type RowFilter = "all" | "failed";

/** How the board orders rows. */
export type RowSort = "fail-first" | "slow-first";

/** One rendered row: a case plus the package it came from. */
export interface TestRow {
  readonly packageName: string;
  readonly path: string;
  readonly name: string;
  readonly status: TestStatus;
  readonly durationMs: number;
}

/** One package's slice of the row list. */
export interface TestRowGroup {
  readonly packageName: string;
  readonly rows: readonly TestRow[];
}

/** Everything `listRows` needs to answer one render. */
export interface ListOptions {
  readonly filter: RowFilter;
  readonly query: string;
  readonly sort: RowSort;
}

/**
 * Count the snapshot for the header.
 * @param snapshot - the loaded snapshot.
 * @returns totals; an empty snapshot yields zeroes rather than NaN.
 */
export function summarize(snapshot: TestSnapshot): TestSummary {
  let passed = 0;
  let failed = 0;
  let skipped = 0;
  let durationMs = 0;
  for (const pkg of snapshot.packages) {
    for (const file of pkg.files) {
      for (const entry of file.cases) {
        if (entry.status === "failed") failed += 1;
        else if (entry.status === "skipped") skipped += 1;
        else passed += 1;
        durationMs += entry.durationMs;
      }
    }
  }
  return { total: passed + failed + skipped, passed, failed, skipped, durationMs };
}

/**
 * Order two rows for one sort mode.
 *
 * Every mode ends on the name so the order is total: two cases with the same
 * duration must not swap places between renders.
 * @param left - first row.
 * @param right - second row.
 * @param sort - the requested order.
 * @returns a comparison result.
 */
function compareRows(left: TestRow, right: TestRow, sort: RowSort): number {
  if (sort === "fail-first") {
    const leftFailed = left.status === "failed" ? 0 : 1;
    const rightFailed = right.status === "failed" ? 0 : 1;
    if (leftFailed !== rightFailed) return leftFailed - rightFailed;
  }
  if (right.durationMs !== left.durationMs) return right.durationMs - left.durationMs;
  return left.name < right.name ? -1 : left.name > right.name ? 1 : 0;
}

/**
 * Flatten the snapshot into the rows the board renders, filtered and sorted.
 *
 * The query matches the file path only: the board is a file-oriented view, and
 * matching case titles too would make a search for one word return most of the
 * suite.
 * @param snapshot - the loaded snapshot.
 * @param options - filter, query and sort for this render.
 * @returns the rows, in render order.
 */
export function listRows(snapshot: TestSnapshot, options: ListOptions): TestRow[] {
  const needle = options.query.trim().toLowerCase();
  const rows: TestRow[] = [];
  for (const pkg of snapshot.packages) {
    for (const file of pkg.files) {
      if (needle.length > 0 && !file.path.toLowerCase().includes(needle)) continue;
      for (const entry of file.cases) {
        if (options.filter === "failed" && entry.status !== "failed") continue;
        rows.push({
          packageName: pkg.name,
          path: file.path,
          name: entry.name,
          status: entry.status,
          durationMs: entry.durationMs,
        });
      }
    }
  }
  return rows.sort((left, right) => compareRows(left, right, options.sort));
}

/**
 * Group rows by package for the board's sections.
 *
 * Groups come back sorted by package name, which is also the snapshot's own
 * order, so a section does not move when the row sort changes. A package whose
 * every row was filtered out has no group at all rather than an empty header.
 * @param rows - rows from `listRows`.
 * @returns the groups, package name ascending.
 */
export function groupByPackage(rows: readonly TestRow[]): TestRowGroup[] {
  const groups = new Map<string, TestRow[]>();
  for (const row of rows) {
    const bucket = groups.get(row.packageName);
    if (bucket === undefined) groups.set(row.packageName, [row]);
    else bucket.push(row);
  }
  return [...groups.entries()]
    .sort(([left], [right]) => (left < right ? -1 : left > right ? 1 : 0))
    .map(([packageName, groupRows]) => ({ packageName, rows: groupRows }));
}

/** One rendered file row: a test file, its cases and its tallies. */
export interface TestFileRow {
  readonly packageName: string;
  readonly path: string;
  readonly cases: readonly TestCase[];
  readonly passed: number;
  readonly failed: number;
  readonly skipped: number;
  readonly durationMs: number;
  readonly hasFailed: boolean;
}

/** One package's slice of the file-row list. */
export interface TestFileRowGroup {
  readonly packageName: string;
  readonly rows: readonly TestFileRow[];
}

/**
 * Build one file row from a file's cases.
 * @param packageName - owning package.
 * @param file - the test file.
 * @returns the row, with tallies summed in one pass.
 */
function toFileRow(packageName: string, file: TestFile): TestFileRow {
  let passed = 0;
  let failed = 0;
  let skipped = 0;
  let durationMs = 0;
  for (const entry of file.cases) {
    if (entry.status === "failed") failed += 1;
    else if (entry.status === "skipped") skipped += 1;
    else passed += 1;
    durationMs += entry.durationMs;
  }
  return { packageName, path: file.path, cases: file.cases, passed, failed, skipped, durationMs, hasFailed: failed > 0 };
}

/**
 * Order two file rows for one sort mode.
 *
 * Every mode ends on the path so the order is total: two files with the same
 * duration must not swap places between renders.
 * @param left - first row.
 * @param right - second row.
 * @param sort - the requested order.
 * @returns a comparison result.
 */
function compareFileRows(left: TestFileRow, right: TestFileRow, sort: RowSort): number {
  if (sort === "fail-first") {
    const leftFailed = left.hasFailed ? 0 : 1;
    const rightFailed = right.hasFailed ? 0 : 1;
    if (leftFailed !== rightFailed) return leftFailed - rightFailed;
  }
  if (right.durationMs !== left.durationMs) return right.durationMs - left.durationMs;
  return left.path < right.path ? -1 : left.path > right.path ? 1 : 0;
}

/**
 * Flatten the snapshot into the file rows the board renders.
 *
 * The board is a file-oriented view: one row per test file, with its cases
 * carried along so an expanded row needs no second lookup. `filter: "failed"`
 * keeps files holding at least one failure rather than narrowing to the failing
 * cases, because the expanded list is where a reader compares the failure with
 * its passing siblings.
 * @param snapshot - the loaded snapshot.
 * @param options - filter, query and sort for this render.
 * @returns the rows, in render order.
 */
export function listFileRows(snapshot: TestSnapshot, options: ListOptions): TestFileRow[] {
  const needle = options.query.trim().toLowerCase();
  const rows: TestFileRow[] = [];
  for (const pkg of snapshot.packages) {
    for (const file of pkg.files) {
      if (needle.length > 0 && !file.path.toLowerCase().includes(needle)) continue;
      const row = toFileRow(pkg.name, file);
      if (options.filter === "failed" && !row.hasFailed) continue;
      rows.push(row);
    }
  }
  return rows.sort((left, right) => compareFileRows(left, right, options.sort));
}

/**
 * Group file rows by package for the board's sections.
 *
 * Groups come back sorted by package name, which is also the snapshot's own
 * order, so a section does not move when the row sort changes. A package whose
 * every file was filtered out has no group at all rather than an empty header.
 * @param rows - rows from `listFileRows`.
 * @returns the groups, package name ascending.
 */
export function groupFileRows(rows: readonly TestFileRow[]): TestFileRowGroup[] {
  const groups = new Map<string, TestFileRow[]>();
  for (const row of rows) {
    const bucket = groups.get(row.packageName);
    if (bucket === undefined) groups.set(row.packageName, [row]);
    else bucket.push(row);
  }
  return [...groups.entries()]
    .sort(([left], [right]) => (left < right ? -1 : left > right ? 1 : 0))
    .map(([packageName, groupRows]) => ({ packageName, rows: groupRows }));
}

/** One second of the run: how many cases finished, and how many of those failed. */
export interface ThroughputBucket {
  readonly second: number;
  readonly completed: number;
  readonly failed: number;
}

/**
 * Bucket the run's completions into one-second steps.
 *
 * The snapshot carries no timestamps, only per-case durations, so the run is
 * reconstructed by walking the cases in execution order (package, then file,
 * then case) and treating each duration as the time that case took. A case
 * counts in the second its own completion lands in, which is what makes a
 * failure show up as a spike in the second it happened rather than at the start.
 * @param snapshot - the loaded snapshot.
 * @returns one bucket per second the run spans, in order; empty for no cases.
 */
export function throughputSeries(snapshot: TestSnapshot): ThroughputBucket[] {
  const completed: number[] = [];
  const failed: number[] = [];
  let elapsedMs = 0;
  for (const pkg of snapshot.packages) {
    for (const file of pkg.files) {
      for (const entry of file.cases) {
        elapsedMs += entry.durationMs;
        // The second a completion lands in: a case ending exactly on a boundary
        // belongs to the second that just closed.
        const second = Math.max(0, Math.ceil(elapsedMs / 1000) - 1);
        completed[second] = (completed[second] ?? 0) + 1;
        if (entry.status === "failed") failed[second] = (failed[second] ?? 0) + 1;
      }
    }
  }
  // Dense on purpose. A second with no completion is a real reading of zero, and
  // a sparse array would leave holes that `map` skips, which the sparkline then
  // renders as gaps in its path.
  return Array.from({ length: completed.length }, (_unused, second) => ({
    second,
    completed: completed[second] ?? 0,
    failed: failed[second] ?? 0,
  }));
}

/**
 * The busiest second of the run, for the sparkline's caption.
 * @param series - buckets from `throughputSeries`.
 * @returns the largest completion count, or 0 for an empty series.
 */
export function peakThroughput(series: readonly ThroughputBucket[]): number {
  return series.reduce((peak, bucket) => Math.max(peak, bucket.completed), 0);
}
