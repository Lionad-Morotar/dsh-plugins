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
  /** 1-based line in the file where this case's title starts; the code pane highlights it. */
  readonly line: number;
  readonly status: TestStatus;
  readonly durationMs: number;
  /**
   * The runner's own failure text, when it produced one.
   *
   * Carried per case rather than per file because the detail pane shows one
   * case: a file-level message would have to be re-split to find the case it
   * belongs to, and the reporter already attributes it.
   */
  readonly message?: string;
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
 *
 * The three optional fields are only present on a real run: a synthetic
 * snapshot is generated at build time and has no workspace, no stamp and no
 * measured elapsed time (its `wallClockMs` is derived from the parallel-process
 * assumption instead).
 */
export interface TestSnapshot {
  readonly version: number;
  readonly statusSource: "synthetic" | "vitest";
  readonly packages: readonly TestPackage[];
  /** Absolute workspace the run happened in; absent on a synthetic snapshot. */
  readonly workspace?: string;
  /** ISO stamp of when the run finished. */
  readonly generatedAt?: string;
  /**
   * How long the run actually took.
   *
   * A real run measures this, so it replaces the parallel-process estimate the
   * header otherwise derives. Absent means "derive it", not "zero".
   */
  readonly wallClockMs?: number;
}

/** Totals for the board's header. */
export interface TestSummary {
  readonly total: number;
  readonly passed: number;
  readonly failed: number;
  readonly skipped: number;
  /** Sum of every case's own duration. Not the run's elapsed time; see `wallClockMs`. */
  readonly durationMs: number;
  /** How long the run actually took, with the suite's processes running at once. */
  readonly wallClockMs: number;
}

/**
 * How many test processes this repository's suite runs at once.
 *
 * The snapshot stores one duration per case and no timestamps, so the only way
 * to recover elapsed time is to divide by how much ran in parallel. The suite is
 * a pnpm workspace run: each package's `test` script is its own process, and
 * pnpm starts them concurrently rather than one after another.
 *
 * This is a property of how the suite is executed, not a dial for making the
 * chart look better. If the run stops being parallel, this number is wrong and
 * the timeline with it.
 */
export const PARALLEL_TEST_PROCESSES = 12;

/**
 * The run's elapsed time, in milliseconds.
 *
 * The snapshot sums to the time every case spent running, which is roughly the
 * suite's total CPU time. Twelve processes working at once means the wall clock
 * is that sum divided by twelve; reporting the sum as the run's duration would
 * claim a four-minute suite took forty.
 * @param snapshot - the loaded snapshot.
 * @returns elapsed milliseconds, or 0 for an empty snapshot.
 */
export function wallClockMs(snapshot: TestSnapshot): number {
  let serialMs = 0;
  for (const pkg of snapshot.packages) {
    for (const file of pkg.files) {
      for (const entry of file.cases) serialMs += entry.durationMs;
    }
  }
  return Math.ceil(serialMs / PARALLEL_TEST_PROCESSES);
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
  /**
   * Whether these rows describe a run that is still going.
   *
   * A live run's rows are the cases it has reported so far: their durations are
   * partial and their failures are the ones that have happened yet, so the two
   * ordering rules would rank them on numbers that are still moving. A reader
   * would see a row jump every poll. Live rows therefore keep the order they
   * arrived in, which is also the order the reader watched them appear; the
   * chosen sort applies the moment the run settles and its figures are final.
   */
  readonly live?: boolean;
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
  return {
    total: passed + failed + skipped,
    passed,
    failed,
    skipped,
    durationMs,
    // A measured run reports what it measured; only a synthetic snapshot falls
    // back to the parallel-process estimate, and then from the same sum, so the
    // header's duration and the timeline can never disagree.
    wallClockMs: snapshot.wallClockMs ?? Math.ceil(durationMs / PARALLEL_TEST_PROCESSES),
  };
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
  // A live run has no final figures to order by, so its rows stay in the order
  // the snapshot lists them, which is the order they arrived in. See
  // `ListOptions.live`.
  if (options.live === true) return rows;
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

/** One directory in a package's tree: its own files and its subdirectories. */
export interface DirectoryNode {
  /**
   * The directory's path inside the package, e.g. `test/unit`.
   *
   * The full path rather than the segment, because this is the identity a later
   * collapse state keys on: `test/unit` and `src/unit` are different directories
   * that share a name.
   */
  readonly key: string;
  /** The last path segment, which is what the header shows. */
  readonly name: string;
  /** Nesting level, root directories at 0; drives the header's indent. */
  readonly depth: number;
  readonly files: readonly TestFileRow[];
  readonly directories: readonly DirectoryNode[];
  /** Totals for this directory and everything below it. */
  readonly stats: { readonly files: number; readonly failed: number; readonly durationMs: number };
}

/** One package's slice of the board: either a tree, or its rows flat. */
export interface PackageTree {
  readonly packageName: string;
  /**
   * Whether the rows render through `directories`.
   *
   * A package with one directory and no nesting has nothing to show a header
   * for, so it keeps the flat list it always had; `rows` and `directories` are
   * never both populated.
   */
  readonly grouped: boolean;
  readonly rows: readonly TestFileRow[];
  /**
   * Rows that live directly in the package, outside every directory.
   *
   * They render under the package heading before the tree. Dropping them when a
   * package is grouped would hide a `smoke.test.ts` that the flat list used to
   * show, and no directory header could stand for it.
   */
  readonly rootFiles: readonly TestFileRow[];
  readonly directories: readonly DirectoryNode[];
}

/**
 * The board's package group for one test file.
 *
 * The board groups by package because that is how the repository is laid out and
 * how a reader thinks about a suite. Anything not under `packages/<name>/` lands
 * in the root group `"."`, which is a real group (this package's own tests live
 * there) rather than a leftover bucket.
 *
 * The host's report parse and the client's live grouping both call this: a file
 * must land in the same group whether the run has finished or is still going.
 *
 * @param path - workspace-relative test file path, forward slashes.
 * @returns the package name, or `"."` for the root group.
 */
export function packageNameOf(path: string): string {
  const match = /^packages\/([^/]+)\//u.exec(path);
  return match?.[1] ?? ".";
}

/**
 * The directory a row sits in, relative to its package.
 *
 * Package rows are under `packages/<name>/`, so the prefix comes off. The root
 * group's rows are not under `packages/./`, so they keep their whole path.
 * @param row - the file row.
 * @returns the directory path, or an empty string for a file at the package root.
 */
function directoryOfRow(row: TestFileRow): string {
  const prefix = `packages/${row.packageName}/`;
  const relative = row.path.startsWith(prefix) ? row.path.slice(prefix.length) : row.path;
  const index = relative.lastIndexOf("/");
  return index === -1 ? "" : relative.slice(0, index);
}

/** A directory while it is being built, before its totals are known. */
interface DraftDirectory {
  readonly name: string;
  readonly key: string;
  readonly depth: number;
  readonly files: TestFileRow[];
  readonly directories: Map<string, DraftDirectory>;
}

/**
 * Fold a draft directory into its finished node, totals included.
 *
 * The totals are summed on the way out rather than maintained on the way in: a
 * directory's figures are its own files plus its children's, and computing them
 * once here keeps the two from drifting apart.
 * @param draft - the directory being finished.
 * @returns the node, children sorted by name.
 */
function finishDirectory(draft: DraftDirectory): DirectoryNode {
  const directories = [...draft.directories.values()]
    .sort((left, right) => (left.name < right.name ? -1 : left.name > right.name ? 1 : 0))
    .map(child => finishDirectory(child));
  let files = draft.files.length;
  let failed = draft.files.reduce((sum, row) => sum + row.failed, 0);
  let durationMs = draft.files.reduce((sum, row) => sum + row.durationMs, 0);
  for (const child of directories) {
    files += child.stats.files;
    failed += child.stats.failed;
    durationMs += child.stats.durationMs;
  }
  return {
    key: draft.key,
    name: draft.name,
    depth: draft.depth,
    files: draft.files,
    directories,
    stats: { files, failed, durationMs },
  };
}

/**
 * Renumber a subtree's depths from one level.
 *
 * A compressed chain lifts its child's children up by however many links were
 * joined, so their old depths no longer describe where they are drawn. The
 * indent is the only thing depth drives, and a stale one would leave a branch
 * hanging under a header it no longer belongs to.
 * @param node - the node to renumber.
 * @param depth - the level this node now sits at.
 * @returns the node with its subtree renumbered.
 */
function withDepth(node: DirectoryNode, depth: number): DirectoryNode {
  return {
    ...node,
    depth,
    directories: node.directories.map(child => withDepth(child, depth + 1)),
  };
}

/**
 * Join a directory that holds nothing but one child into that child.
 *
 * A monorepo's test trees are mostly chains: `test` holds only `unit`, which
 * holds only `nested`. A header per link is three lines that each say one word
 * of the same address, and the reader has to read all three to learn where the
 * files are. Collapsing the chain into `test/unit/nested` says it once.
 *
 * Only a link in a chain is joined: a directory with its own files is a place
 * the reader can stop at, and one with two children is a fork worth seeing. The
 * compressed node keeps the outer directory's key and depth, so a fold key and
 * the indent still describe where the branch starts rather than where it ends.
 * @param node - the finished node.
 * @returns the node with every single-child chain joined into one title.
 */
function compressChain(node: DirectoryNode): DirectoryNode {
  const directories = node.directories.map(child => compressChain(child));
  if (node.files.length > 0 || directories.length !== 1) {
    return { ...node, directories };
  }
  const only = directories[0];
  if (only === undefined) return { ...node, directories };
  return {
    key: node.key,
    name: `${node.name}/${only.name}`,
    depth: node.depth,
    files: only.files,
    directories: only.directories.map(child => withDepth(child, node.depth + 1)),
    stats: only.stats,
  };
}

/**
 * Group file rows into one directory tree per package.
 *
 * The board used to list a package's files flat, with the directory repeated on
 * every row; in a repository where one directory holds a hundred and eighty
 * files that is a hundred and eighty copies of the same word. The tree says it
 * once.
 *
 * Two properties matter more than the shape. The rows arrive already filtered,
 * searched and sorted, so the builder never reorders files: the reader's chosen
 * order survives, and a directory's files stay in the sequence they were given.
 * And a package with a single unnested directory is returned flat, because a
 * header over a list that is already all one directory is a line of noise.
 * @param rows - rows from `listFileRows`.
 * @returns one entry per package, package name ascending.
 */
export function groupFileRowsIntoTree(rows: readonly TestFileRow[]): PackageTree[] {
  const byPackage = new Map<string, TestFileRow[]>();
  for (const row of rows) {
    const bucket = byPackage.get(row.packageName);
    if (bucket === undefined) byPackage.set(row.packageName, [row]);
    else bucket.push(row);
  }

  return [...byPackage.entries()]
    .sort(([left], [right]) => (left < right ? -1 : left > right ? 1 : 0))
    .map(([packageName, packageRows]) => {
      const roots = new Map<string, DraftDirectory>();
      const rootFiles: TestFileRow[] = [];
      for (const row of packageRows) {
        const segments = directoryOfRow(row).split("/").filter(segment => segment !== "");
        if (segments.length === 0) {
          rootFiles.push(row);
          continue;
        }
        let level = roots;
        let key = "";
        for (let depth = 0; depth < segments.length; depth += 1) {
          const name = segments[depth] ?? "";
          key = key === "" ? name : `${key}/${name}`;
          let node = level.get(name);
          if (node === undefined) {
            node = { name, key, depth, files: [], directories: new Map() };
            level.set(name, node);
          }
          if (depth === segments.length - 1) node.files.push(row);
          level = node.directories;
        }
      }

      const directories = [...roots.values()]
        .sort((left, right) => (left.name < right.name ? -1 : left.name > right.name ? 1 : 0))
        .map(draft => finishDirectory(draft))
        .map(node => compressChain(node));

      // One directory, no nesting: the header would name the only place the rows
      // could be. A row at the package root also lands here, since it has no
      // directory to file it under.
      const flat = directories.length === 1 && (directories[0]?.directories.length ?? 0) === 0;
      if (flat || directories.length === 0) {
        return { packageName, grouped: false, rows: packageRows, rootFiles: [], directories: [] };
      }
      return { packageName, grouped: true, rows: [], rootFiles, directories };
    });
}

/**
 * Every row a package renders, in the order the tree draws them.
 *
 * The board's keyboard order and its selection normalisation both walk this, so
 * it is the tree's own traversal rather than a second sort: a flat list in any
 * other order would make ArrowDown jump around the screen.
 * @param pkg - one package's tree.
 * @returns the rows, a directory's files before its children's.
 */
export function treeFileRows(pkg: PackageTree): TestFileRow[] {
  if (!pkg.grouped) return [...pkg.rows];
  const walk = (node: DirectoryNode): TestFileRow[] => [
    ...node.files,
    ...node.directories.flatMap(child => walk(child)),
  ];
  return [...pkg.rootFiles, ...pkg.directories.flatMap(node => walk(node))];
}

/**
 * The rows still on screen with some directories folded away.
 *
 * A collapsed directory takes its own files and its whole subtree with it: the
 * child headers are not rendered either, so their rows must not be navigable.
 * A suppressed package has no headers to fold, so it always contributes every
 * row, whatever a stray key in the set says.
 * @param trees - the packages, in render order.
 * @param collapsed - the directory keys that are folded.
 * @returns the rows, in the order the tree draws them.
 */
export function visibleFileRows(
  trees: readonly PackageTree[],
  collapsed: ReadonlySet<string>,
): TestFileRow[] {
  const rows: TestFileRow[] = [];
  for (const pkg of trees) {
    if (!pkg.grouped) {
      rows.push(...pkg.rows);
      continue;
    }
    rows.push(...pkg.rootFiles);
    const walk = (node: DirectoryNode): void => {
      if (collapsed.has(`${pkg.packageName}:${node.key}`)) return;
      rows.push(...node.files);
      for (const child of node.directories) walk(child);
    };
    for (const node of pkg.directories) walk(node);
  }
  return rows;
}

/**
 * The directory keys above one file, from the root down.
 *
 * A chip can point at a file the reader has folded away, and revealing it means
 * unfolding every branch between the package and the file. The keys are the
 * same strings the tree puts on its headers, so the caller can subtract them
 * from the collapsed set without parsing anything.
 * @param path - repo-relative test file path.
 * @param packageName - the package the file belongs to.
 * @returns the keys, outermost first; empty for a file at its package root.
 */
export function directoryKeysForFile(path: string, packageName: string): string[] {
  const prefix = `packages/${packageName}/`;
  const relative = path.startsWith(prefix) ? path.slice(prefix.length) : path;
  const index = relative.lastIndexOf("/");
  if (index === -1) return [];
  const segments = relative.slice(0, index).split("/").filter(segment => segment !== "");
  const keys: string[] = [];
  let dirPath = "";
  for (const segment of segments) {
    dirPath = dirPath === "" ? segment : `${dirPath}/${segment}`;
    keys.push(`${packageName}:${dirPath}`);
  }
  return keys;
}

/**
 * Where the selection should go when its row is no longer on screen.
 *
 * Folding a directory can hide the file the reader was looking at. The nearest
 * surviving row is the one that took its place: the next visible file, or the
 * previous one when the fold was at the end of the list. Nothing visible at all
 * leaves the selection empty, which the right pane already renders as its hint.
 * @param allRows - every row, in render order.
 * @param visibleRows - the rows still on screen, in the same order.
 * @param selectedPath - the file the selection points at.
 * @returns the path to select instead, or undefined when there is nothing left.
 */
export function nearestVisiblePath(
  allRows: readonly TestFileRow[],
  visibleRows: readonly TestFileRow[],
  selectedPath: string,
): string | undefined {
  if (visibleRows.some(row => row.path === selectedPath)) return selectedPath;
  const visible = new Set(visibleRows.map(row => row.path));
  const index = allRows.findIndex(row => row.path === selectedPath);
  if (index === -1) return undefined;
  for (let next = index + 1; next < allRows.length; next += 1) {
    const candidate = allRows[next];
    if (candidate !== undefined && visible.has(candidate.path)) return candidate.path;
  }
  for (let previous = index - 1; previous >= 0; previous -= 1) {
    const candidate = allRows[previous];
    if (candidate !== undefined && visible.has(candidate.path)) return candidate.path;
  }
  return undefined;
}

/** One second of the run: how many cases finished, and how many of those failed. */
export interface ThroughputBucket {
  readonly second: number;
  readonly completed: number;
  readonly failed: number;
}

/**
 * Bucket the run's completions into one-second steps of wall clock.
 *
 * The snapshot carries no timestamps, only per-case durations, so the run is
 * reconstructed by walking the cases in execution order (package, then file,
 * then case) and treating each duration as the time that case took. A case
 * counts in the second its own completion lands in, which is what makes a
 * failure show up as a spike in the second it happened rather than at the start.
 *
 * The running total is the suite's CPU time, so it is folded onto the wall clock
 * before it becomes a second index: twelve processes finish in a twelfth of the
 * summed time. Without that division the repository's own suite draws ~2,470
 * points on a 1000px canvas, which is a noise band rather than a chart.
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
        const second = Math.max(0, Math.ceil(elapsedMs / (1000 * PARALLEL_TEST_PROCESSES)) - 1);
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
