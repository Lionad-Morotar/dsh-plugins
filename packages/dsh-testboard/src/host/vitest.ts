/**
 * The vitest seam: what to run, and how to read what it reported.
 *
 * Both halves are pure. The argv is built here so the one place that spawns a
 * process never composes a command line, and the reporter's JSON is mapped here
 * so the mapping can be pinned without a real suite.
 *
 * The reporter's shape is treated as untrusted input throughout: it has changed
 * between vitest majors, and a missing field must cost one case, not the board.
 */
import { posix } from "node:path";

import type { TestCase, TestFile, TestPackage, TestSnapshot, TestStatus } from "../client/model.ts";
import type { RunScope } from "../shared.ts";

/** Bumped when the emitted snapshot's shape changes. */
const SNAPSHOT_VERSION = 2;

/**
 * Build the argv for one run.
 *
 * The workspace's own binary is used rather than a resolved package: a workspace
 * that has not installed vitest should fail as "no runner here", not silently
 * run this repository's copy against another project's config.
 *
 * `--outputFile` is passed as two argv entries because the reporter accepts the
 * separated form and an `=` would have to be quoted if a path ever contained one.
 *
 * @param options - workspace, scope and where the reporter should write.
 * @returns the argv, executable first.
 */
export function buildVitestArgv(options: {
  readonly workspace: string;
  readonly scope: RunScope;
  readonly outputFile: string;
}): string[] {
  const argv = [
    posix.join(options.workspace, "node_modules", ".bin", "vitest"),
    "run",
  ];
  if (options.scope.kind === "file") argv.push(options.scope.path);
  argv.push("--reporter=json", "--outputFile", options.outputFile);
  return argv;
}

/**
 * The board's package group for one test file.
 *
 * The board groups by package because that is how the repository is laid out and
 * how a reader thinks about a suite. Anything not under `packages/<name>/` lands
 * in the root group `"."`, which is a real group (this package's own tests live
 * there) rather than a leftover bucket.
 *
 * @param path - workspace-relative test file path, forward slashes.
 * @returns the package name, or `"."` for the root group.
 */
export function packageNameOf(path: string): string {
  const match = /^packages\/([^/]+)\//u.exec(path);
  return match?.[1] ?? ".";
}

/**
 * The 1-based line a case's title starts on.
 *
 * The reporter reports titles, not positions, so the position comes from the
 * file's own text. Both `it(` and `test(` are searched, with the title matched
 * as a literal: titles routinely contain parentheses and brackets, which is
 * exactly where a naive regex would either miss or match the wrong call.
 *
 * @param text - the test file's full source.
 * @param title - the case title as the reporter spelled it.
 * @returns the line number, or 0 when the title is not in the file (a computed
 *   title, or a file the reader could not load).
 */
export function lineOfCase(text: string, title: string): number {
  if (title === "") return 0;
  const needles = [`it("${title}"`, `test("${title}"`, `it('${title}'`, `test('${title}'`];
  let offset = -1;
  for (const needle of needles) {
    const found = text.indexOf(needle);
    if (found !== -1 && (offset === -1 || found < offset)) offset = found;
  }
  if (offset === -1) return 0;
  let line = 1;
  for (let index = 0; index < offset; index += 1) {
    if (text[index] === "\n") line += 1;
  }
  return line;
}

/** One assertion entry, as much of it as this package reads. */
interface RawAssertion {
  readonly title?: unknown;
  readonly fullName?: unknown;
  readonly status?: unknown;
  readonly duration?: unknown;
  readonly failureMessages?: unknown;
}

/** One file entry, as much of it as this package reads. */
interface RawFile {
  readonly name?: unknown;
  readonly assertionResults?: unknown;
}

/**
 * Map one reporter status onto the board's three states.
 *
 * The board has three because a reader acts on three: green, red, and "did not
 * run". `pending` and `todo` are both the third case — a case that was collected
 * but never executed is not a pass, and showing it as one would overstate the
 * suite.
 *
 * @param raw - the reporter's status string.
 * @returns the board's status.
 */
function toStatus(raw: unknown): TestStatus {
  if (raw === "passed") return "passed";
  if (raw === "failed") return "failed";
  return "skipped";
}

/**
 * Rewrite a reporter path as a workspace-relative one.
 *
 * The reporter reports absolute paths. The board keys on workspace-relative ones
 * because that is what the source route takes and what a reader recognizes.
 *
 * @param raw - the reporter's file name.
 * @param workspace - the run's workspace.
 * @returns the relative path, forward slashes.
 */
function toRelativePath(raw: string, workspace: string): string {
  const normalized = raw.split("\\").join("/");
  const root = workspace.split("\\").join("/").replace(/\/+$/u, "");
  if (normalized === root) return "";
  if (normalized.startsWith(`${root}/`)) return normalized.slice(root.length + 1);
  return normalized;
}

/** Everything `parseVitestJson` may consult besides the payload itself. */
export interface ParseOptions {
  /** Workspace the run happened in; recorded on the snapshot and stripped from paths. */
  readonly workspace: string;
  /** File text by workspace-relative path, for placing cases on lines. */
  readonly fileTextOf?: (path: string) => string | undefined;
  /** ISO stamp to record; omitted means the snapshot carries none. */
  readonly generatedAt?: string;
  /** Measured elapsed time; omitted means the header derives its own estimate. */
  readonly wallClockMs?: number;
}

/**
 * Read one reporter payload as the board's snapshot.
 *
 * @param raw - the reporter's JSON, as text or already parsed.
 * @param options - workspace, file reader and the run's own measurements.
 * @returns the snapshot, grouped by package and sorted so two runs of the same
 *   suite produce the same board.
 * @throws when the payload is not JSON at all — that is a broken reporter, not a
 *   suite with no tests, and the caller turns it into an error state.
 */
export function parseVitestJson(raw: unknown, options: ParseOptions): TestSnapshot {
  const payload = typeof raw === "string" ? (JSON.parse(raw) as unknown) : raw;
  const results = (payload as { testResults?: unknown } | null)?.testResults;
  const files = Array.isArray(results) ? (results as RawFile[]) : [];

  const byPackage = new Map<string, TestFile[]>();
  for (const file of files) {
    if (typeof file !== "object" || file === null) continue;
    if (typeof file.name !== "string" || file.name === "") continue;
    const path = toRelativePath(file.name, options.workspace);
    if (path === "") continue;
    const text = options.fileTextOf?.(path);
    const assertions = Array.isArray(file.assertionResults) ? (file.assertionResults as RawAssertion[]) : [];
    const cases: TestCase[] = [];
    for (const assertion of assertions) {
      if (typeof assertion !== "object" || assertion === null) continue;
      // A case with no title cannot be rendered and cannot be located; inventing
      // one would put a row on the board that no suite contains.
      const title = typeof assertion.title === "string" ? assertion.title : undefined;
      if (title === undefined || title === "") continue;
      const durationMs = typeof assertion.duration === "number" && Number.isFinite(assertion.duration) ? assertion.duration : 0;
      const message = Array.isArray(assertion.failureMessages)
        ? assertion.failureMessages.filter((entry): entry is string => typeof entry === "string").join("\n")
        : "";
      cases.push({
        path,
        name: title,
        line: text === undefined ? 0 : lineOfCase(text, title),
        status: toStatus(assertion.status),
        durationMs,
        ...(message === "" ? {} : { message }),
      });
    }
    const packageName = packageNameOf(path);
    const bucket = byPackage.get(packageName);
    if (bucket === undefined) byPackage.set(packageName, [{ path, cases }]);
    else bucket.push({ path, cases });
  }

  const packages: TestPackage[] = [...byPackage.entries()]
    .sort(([left], [right]) => (left < right ? -1 : left > right ? 1 : 0))
    .map(([name, packageFiles]) => ({
      name,
      files: packageFiles.sort((left, right) => (left.path < right.path ? -1 : left.path > right.path ? 1 : 0)),
    }));

  return {
    version: SNAPSHOT_VERSION,
    statusSource: "vitest",
    packages,
    workspace: options.workspace,
    ...(options.generatedAt === undefined ? {} : { generatedAt: options.generatedAt }),
    ...(options.wallClockMs === undefined ? {} : { wallClockMs: options.wallClockMs }),
  };
}

/**
 * Whether a finished run should read as failed.
 *
 * The exit code is the runner's verdict and covers a suite that crashed before
 * reporting anything; a reported failure counts even when the code is clean,
 * because a board that shows green over a red case is the one bug this panel
 * cannot afford.
 *
 * @param snapshot - the parsed run, when there was one.
 * @param exitCode - the child's exit code.
 * @returns true when the run failed.
 */
export function runFailed(snapshot: TestSnapshot | undefined, exitCode: number | null): boolean {
  if (exitCode !== null && exitCode !== 0) return true;
  if (snapshot === undefined) return true;
  return snapshot.packages.some(pkg => pkg.files.some(file => file.cases.some(entry => entry.status === "failed")));
}

/**
 * Count the files a default-reporter stdout line reports as finished.
 *
 * The json reporter only speaks at the end, so progress comes from the human
 * reporter's per-file lines: `✓ path (3 tests) 12ms`, `× path`, `❯ path`. The
 * path is the only part this package needs, and it is what makes the count
 * idempotent — the same file reported twice is still one file.
 *
 * @param line - one stdout line.
 * @returns the file path it reports, or undefined when the line is not one.
 */
export function completedFileOf(line: string): string | undefined {
  // Strip the leading marker and any ANSI colour the reporter may have emitted.
  const cleaned = line.replace(/\u001B\[[0-9;]*m/gu, "").trim();
  const match = /^(?:[✓×❯✗↓]|\[[^\]]*\])\s+(\S+\.test\.tsx?)\b/u.exec(cleaned);
  return match?.[1];
}
