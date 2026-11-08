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
