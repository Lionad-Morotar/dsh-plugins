/**
 * The live board: a run's own events, shaped like the snapshot the board draws.
 *
 * The host's authoritative result is the json reporter, and that reporter speaks
 * once, when the process exits. Waiting for it is what used to make the panel
 * sit on the previous run until the suite was over: every row, every directory
 * heading and every count on screen described a run that had already finished.
 * The verbose stream, by contrast, reports each case as it lands, and the host
 * publishes those events while the child is still running.
 *
 * So while a run is going, the board is drawn from this module's snapshot instead
 * of the settled one. Two properties follow, and both are the point:
 *
 * - Nothing from the previous run survives. The tree is built from the cases this
 *   run has reported, so a file appears when its first case lands, and a failure
 *   count that is on screen is one this run produced.
 * - The tree grows per poll. Files and cases are appended in completion order,
 *   which the ordering rules defer to for exactly this reason (see
 *   `ListOptions.live`).
 *
 * A scoped rerun is the exception that proves the rule: it patches one file of a
 * board it did not produce, so the rest of the board stays and only the file it
 * re-runs is rebuilt from the live events.
 */
import { packageNameOf, type TestCase, type TestFile, type TestPackage, type TestSnapshot } from "./model.ts";
import type { RunProgress } from "../shared.ts";

/** The separator inside a line-index key, so a path and a title cannot collide. */
const KEY_SEPARATOR = "\u0000";

/**
 * Where the settled board placed each case.
 *
 * The live stream carries titles and no positions, and reading each test file
 * again to find them would put a disk read behind every poll. The previous board
 * already knows where each title sits; a title that moved since then is not worth
 * a second read, because a stale line highlights the wrong row for one run, while
 * no line highlights nothing.
 *
 * Titles are not unique inside a file, so the index hands out one line per
 * occurrence, in the order the cases arrive: two `it("works")` under different
 * describes get the two lines the settled board gave them.
 *
 * @param settled - the board the previous run produced, when there is one.
 * @returns a reader that consumes one line per call, or 0 when unknown.
 */
function lineReader(settled: TestSnapshot | undefined): (path: string, name: string) => number {
  const queues = new Map<string, number[]>();
  if (settled !== undefined) {
    for (const pkg of settled.packages) {
      for (const file of pkg.files) {
        for (const entry of file.cases) {
          const key = `${file.path}${KEY_SEPARATOR}${entry.name}`;
          const queue = queues.get(key);
          if (queue === undefined) queues.set(key, [entry.line]);
          else queue.push(entry.line);
        }
      }
    }
  }
  return (path, name) => {
    const queue = queues.get(`${path}${KEY_SEPARATOR}${name}`);
    return queue === undefined ? 0 : (queue.shift() ?? 0);
  };
}

/**
 * Group files into the snapshot's package shape.
 *
 * Packages are sorted by name, the same way the report parse sorts them, so a
 * package's heading does not move between the live board and the settled one.
 * Files keep the order they were given: that order is completion order on a live
 * board, and the reader's chosen sort once it settles.
 *
 * @param files - the files, already in render order.
 * @returns one entry per package.
 */
function groupFiles(files: readonly TestFile[]): TestPackage[] {
  const byPackage = new Map<string, TestFile[]>();
  for (const file of files) {
    const name = packageNameOf(file.path);
    const bucket = byPackage.get(name);
    if (bucket === undefined) byPackage.set(name, [file]);
    else bucket.push(file);
  }
  return [...byPackage.entries()]
    .sort(([left], [right]) => (left < right ? -1 : left > right ? 1 : 0))
    .map(([name, packageFiles]) => ({ name, files: packageFiles }));
}

/**
 * The snapshot the board draws while one run is in flight.
 *
 * @param run - the run the host is publishing.
 * @param settled - the board the previous run produced, when there is one.
 * @returns the rows this run has produced so far, in completion order.
 */
export function liveSnapshotOf(run: RunProgress, settled: TestSnapshot | undefined): TestSnapshot {
  const lineOf = lineReader(settled);
  const byPath = new Map<string, TestCase[]>();
  for (const event of run.cases) {
    const entry: TestCase = {
      path: event.path,
      name: event.name,
      line: lineOf(event.path, event.name),
      status: event.status,
      durationMs: event.durationMs,
    };
    const bucket = byPath.get(event.path);
    if (bucket === undefined) byPath.set(event.path, [entry]);
    else bucket.push(entry);
  }

  const files: TestFile[] =
    run.scope.kind === "file"
      ? scopedFiles(settled, run.scope.path, byPath.get(run.scope.path) ?? [])
      : [...byPath.entries()].map(([path, cases]) => ({ path, cases }));

  return {
    // The live board never leaves the browser, so it borrows the settled
    // snapshot's format version rather than claiming one of its own.
    version: settled?.version ?? 1,
    statusSource: "vitest",
    packages: groupFiles(files),
  };
}

/**
 * The files of a scoped rerun's board: the settled reading, with one file rebuilt.
 *
 * The rerun covers one file, so the others are not being redone and their last
 * reading is still the only one there is. The file it does cover is replaced by
 * what this run has reported for it, even when that is still nothing: the row
 * keeps its place in the tree (a rerun is not a new file), and its cases arrive
 * one by one like every other live row.
 *
 * @param settled - the board the previous run produced.
 * @param path - the file this run covers.
 * @param cases - this run's cases for that file, possibly still empty.
 * @returns the files, in tree order.
 */
function scopedFiles(
  settled: TestSnapshot | undefined,
  path: string,
  cases: readonly TestCase[],
): TestFile[] {
  const replacement: TestFile = { path, cases: [...cases] };
  if (settled === undefined) return [replacement];
  const files = settled.packages.flatMap(pkg => pkg.files);
  let replaced = false;
  const rebuilt = files.map(file => {
    if (file.path !== path) return file;
    replaced = true;
    return replacement;
  });
  // A file the board never had (a rerun of something the last report omitted)
  // still has a row: the reader asked to run it.
  if (!replaced) rebuilt.push(replacement);
  return rebuilt;
}
