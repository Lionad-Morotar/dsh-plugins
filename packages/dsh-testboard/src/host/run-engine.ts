/**
 * The run engine: one vitest process per workspace, one run at a time.
 *
 * The engine owns the state machine and the temp file; the subprocess service is
 * injected so the whole thing is testable without spawning vitest. Three rules
 * shape it:
 *
 * - One active run per workspace. A second `start` answers `busy` instead of
 *   queueing, because a queue would let a reader pile up runs they cannot see.
 * - Two sources of truth, in order. The verbose reporter's stdout is read while
 *   the child runs and drives the live rows; the json report is read once the
 *   child exits and replaces the snapshot, because it carries the statuses and
 *   failure messages the human lines do not. A run that produced no json file is
 *   an error rather than an empty board.
 * - A file-scoped run merges. Rerunning one file must not blank the other rows,
 *   so its result replaces that file's entry in the existing snapshot instead of
 *   replacing the snapshot.
 */
import { readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

import type { TestFile, TestPackage, TestSnapshot } from "../client/model.ts";
import type {
  RunCaseEvent,
  RunCounts,
  RunFailure,
  RunPhase,
  RunProgress,
  RunScope,
  RunSeriesPoint,
  TestboardError,
  TestboardState,
} from "../shared.ts";
import { buildVitestArgv, parseVerboseOutput, parseVitestJson, runFailed } from "./vitest.ts";

/** One collected stream read. Mirrors `SubprocessOutputRead` structurally. */
export interface CollectedRead {
  readonly text: string;
  readonly lossy: boolean;
  readonly spillPath?: string;
}

export interface CollectedReader {
  readFrom(fromByte: number): CollectedRead;
}

export interface SpawnedProcess {
  readonly done: Promise<{ readonly exitCode: number | null }>;
  readonly collected: {
    readonly stdout?: CollectedReader;
    readonly stderr?: CollectedReader;
  };
}

/** The slice of the subprocess service this engine consumes. */
export interface SubprocessLike {
  spawn(spec: {
    readonly argv: readonly string[];
    readonly cwd: string;
    readonly stdio: {
      readonly stdin: "ignore" | { readonly data: string };
      readonly stdout: { readonly collect: { readonly maxBytes: number; readonly spill?: { readonly maxBytes: number } } };
      readonly stderr: { readonly collect: { readonly maxBytes: number; readonly spill?: { readonly maxBytes: number } } };
    };
    readonly graceMs: number;
    readonly signal?: AbortSignal;
  }): SpawnedProcess;
}

/** A run that was accepted; `done` settles when the child's state is recorded. */
export interface StartedRun {
  readonly ok: true;
  readonly runId: string;
  readonly done: Promise<void>;
}

/** A run that was refused, with the reason the board should show. */
export interface RefusedRun {
  readonly ok: false;
  readonly error: TestboardError;
}

export type StartResult = StartedRun | RefusedRun;

export interface RunEngine {
  /** The workspace's board state: last snapshot, current or last run. */
  getState(workspace: string): TestboardState;
  /** Begin a run, or refuse when one is already active here. */
  start(workspace: string, scope: RunScope): StartResult;
  /** Abort the workspace's active run; false when nothing was running. */
  cancel(workspace: string): boolean;
}

export interface RunEngineOptions {
  readonly subprocess: SubprocessLike;
  /**
   * File text by workspace and workspace-relative path, for placing cases on
   * lines. The workspace is part of the call because the engine serves many of
   * them and a reader that only knew the path would have to guess which one.
   */
  readonly fileTextOf?: (workspace: string, path: string) => string | undefined;
  /** Clock, injectable so a test can pin the wall clock. */
  readonly now?: () => number;
  /**
   * Turn one run into the process that executes it.
   *
   * The default is a single vitest invocation at the workspace root. The host
   * half replaces it when the workspace is a monorepo whose suite is only
   * runnable through per-package configs; the engine itself only spawns what it
   * is given.
   */
  readonly plan?: (input: { readonly workspace: string; readonly scope: RunScope; readonly outputFile: string }) => Promise<{
    readonly argv: readonly string[];
    readonly cwd: string;
    readonly cleanup?: () => Promise<void>;
  }>;
  /**
   * Called once a run has settled with a snapshot to show.
   *
   * Separate from the engine's own state because persistence is a side effect
   * the caller owns: the engine answers "what does the board know", the host
   * half decides where that answer is worth keeping. Only a `finished` run with
   * a snapshot qualifies; a cancelled or errored run has no new reading.
   * @param workspace - the canonical workspace root.
   * @param result - the settled run and the snapshot it produced.
   */
  readonly onSettled?: (
    workspace: string,
    result: {
      readonly run: RunProgress;
      readonly snapshot: NonNullable<TestboardState["snapshot"]>;
      readonly log?: RunProgress;
    },
  ) => void;
}

/**
 * Output budget for one stream.
 *
 * A full suite prints a line per case plus a summary; four megabytes is far past
 * any real run and exists so a runaway reporter cannot grow the host's memory.
 */
const MAX_STREAM_BYTES = 4 * 1024 * 1024;

/** How long a killed child may take to die before the host stops waiting. */
const GRACE_MS = 500;

/** A shared empty buffer, so a clean read does not allocate one per poll. */
const EMPTY_BUFFER = Buffer.alloc(0);

/**
 * How many bytes at the end of a buffer belong to an incomplete UTF-8 character.
 *
 * A UTF-8 character is one to four bytes, and its length is encoded in the lead
 * byte: `0xxxxxxx` is one, `110xxxxx` starts a two-byte sequence, and so on. If
 * the buffer ends inside a sequence, those bytes have to wait for the rest.
 *
 * @param buffer - the bytes read so far.
 * @returns the count of trailing bytes that do not yet form a character, or 0.
 */
function incompleteTailBytes(buffer: Buffer): number {
  // Four is the longest sequence, so no tail can be longer than three bytes.
  const limit = Math.min(4, buffer.length);
  for (let back = 1; back <= limit; back += 1) {
    const byte = buffer[buffer.length - back];
    if (byte === undefined) return 0;
    // A continuation byte: keep walking back to the lead byte.
    if ((byte & 0b1100_0000) === 0b1000_0000) continue;
    const needed = byte >= 0b1111_0000 ? 4 : byte >= 0b1110_0000 ? 3 : byte >= 0b1100_0000 ? 2 : 1;
    return needed > back ? back : 0;
  }
  // Nothing but continuation bytes in the whole buffer: it is a fragment.
  return buffer.length;
}

/**
 * How often the engine re-reads the child's collected stdout while it runs.
 *
 * The host's subprocess service collects a pipe and exposes `readFrom(offset)`,
 * so the text is available incrementally even though nothing pushes it. Polling
 * is what turns that into live rows: without it the board would only learn about
 * a case once the whole suite had finished, which is the behaviour this slice
 * exists to replace.
 *
 * 200ms is fast enough that a row lights up while the reader is still looking at
 * it, and slow enough that a thousand-case suite costs five parses a second
 * rather than a thousand.
 */
const STREAM_POLL_MS = 200;

/** The width of one point on the throughput chart. */
const SERIES_BUCKET_MS = 1000;

/** One workspace's mutable board state. */
interface WorkspaceEntry {
  snapshot?: TestSnapshot;
  run?: RunProgress;
  /**
   * The last all-scope run, which the chart and the "last run" line speak for.
   *
   * A scoped rerun updates `run` and the snapshot but leaves this untouched, so
   * a reader who fixes failures one file at a time keeps the full run's shape
   * on screen while the rows turn green.
   */
  log?: RunProgress;
  controller?: AbortController;
  /** Runs started in this workspace, so the board can label a rerun. */
  runCount: number;
}

/** The live half of a run: what the verbose stream has reported so far. */
interface LiveProgress {
  readonly cases: RunCaseEvent[];
  readonly failures: RunFailure[];
  completedFiles: number;
}

/**
 * Create the engine over one subprocess service.
 *
 * @param options - the subprocess seam, an optional file reader and clock.
 * @returns the engine.
 */
export function createRunEngine(options: RunEngineOptions): RunEngine {
  const now = options.now ?? Date.now;
  const entries = new Map<string, WorkspaceEntry>();

  function entryOf(workspace: string): WorkspaceEntry {
    const existing = entries.get(workspace);
    if (existing !== undefined) return existing;
    const created: WorkspaceEntry = { runCount: 0 };
    entries.set(workspace, created);
    return created;
  }

  function readStream(reader: CollectedReader | undefined): string {
    if (reader === undefined) return "";
    return reader.readFrom(0).text;
  }

  /**
   * Read whatever the child has printed since the last read.
   *
   * The host's reader is offset-based, so the engine keeps its own cursor and
   * only parses the new tail. Re-parsing the whole buffer every poll would make
   * the cost grow with the suite instead of with the new lines.
   *
   * The cursor is a byte offset, because that is what `readFrom` takes. Advancing
   * it by the decoded string's length would agree only while the output is ASCII:
   * a Chinese case title or an emoji in a failure message makes the two units
   * diverge, and every later poll then re-reads a slice it already parsed.
   *
   * A read can also end mid-character, since the host slices the collected bytes
   * rather than the decoded text. The incomplete tail is held back and prepended
   * to the next read; decoding it now would produce a replacement character and
   * make the line unparseable.
   *
   * @param reader - the collected stdout, when the host provided one.
   * @param cursor - the byte offset already consumed.
   * @param carry - bytes left over from a read that ended mid-character.
   * @returns the decoded text and the state to use next time.
   */
  function readNew(
    reader: CollectedReader | undefined,
    cursor: number,
    carry: Buffer,
  ): { text: string; next: number; carry: Buffer } {
    if (reader === undefined) return { text: "", next: cursor, carry };
    const read = reader.readFrom(cursor);
    if (read.text === "") return { text: "", next: cursor, carry };

    // The reader hands back decoded text, so its byte length is the length of
    // the bytes it consumed. A tail that decoded to a replacement character is
    // not recoverable from the string, which is why the carry is tracked in
    // bytes on our side rather than re-derived here.
    const fresh = Buffer.from(read.text, "utf8");
    const chunk = carry.length === 0 ? fresh : Buffer.concat([carry, fresh]);
    const incomplete = incompleteTailBytes(chunk);
    const complete = incomplete === 0 ? chunk : chunk.subarray(0, chunk.length - incomplete);

    return {
      text: complete.toString("utf8"),
      // The cursor moves by what the reader consumed, not by what we managed to
      // decode: the bytes held back have already been read.
      next: cursor + fresh.length,
      carry: incomplete === 0 ? EMPTY_BUFFER : Buffer.from(chunk.subarray(chunk.length - incomplete)),
    };
  }

  /**
   * Fold the finished cases into the run's tallies.
   * @param cases - every case that has finished.
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
    return { passed, failed, skipped, total: cases.length };
  }

  /**
   * Bucket the finished cases into one point per elapsed second.
   *
   * The points are cumulative because the chart draws a running total: a reader
   * asking "how fast is this going" wants the slope, and a per-second delta
   * would have to be re-accumulated by every consumer.
   *
   * @param cases - every case that has finished, in completion order.
   * @param elapsedMs - how long the run has been going.
   * @returns one point per second, including the seconds nothing finished in.
   */
  function seriesOf(cases: readonly RunCaseEvent[], elapsedMs: number): RunSeriesPoint[] {
    // Nothing has finished, so there is no curve to draw. A single zero point
    // would render as a flat line at the baseline, which reads as "the run is
    // producing nothing" rather than "the run has not produced anything yet".
    if (cases.length === 0) return [];
    const spanMs = Math.max(elapsedMs, cases[cases.length - 1]?.atMs ?? 0);
    const buckets = Math.floor(spanMs / SERIES_BUCKET_MS) + 1;
    const points: RunSeriesPoint[] = [];
    let cursor = 0;
    let passed = 0;
    let failed = 0;
    for (let index = 0; index < buckets; index += 1) {
      const until = (index + 1) * SERIES_BUCKET_MS;
      while (cursor < cases.length && (cases[cursor]?.atMs ?? 0) < until) {
        const entry = cases[cursor];
        if (entry !== undefined) {
          if (entry.status === "failed") failed += 1;
          else if (entry.status === "passed") passed += 1;
        }
        cursor += 1;
      }
      points.push({ tMs: index * SERIES_BUCKET_MS, finished: cursor, passed, failed });
    }
    return points;
  }

  /**
   * Build the run's public state from the live half and the clock.
   *
   * @param base - the immutable facts about this run.
   * @param live - what the stream has reported.
   * @param elapsedMs - wall clock since the run started.
   * @returns the progress object the board reads.
   */
  function progressOf(
    base: { runId: string; scope: RunScope; runNumber: number; startedAt: string; totalFiles: number | null },
    live: LiveProgress,
    elapsedMs: number,
  ): RunProgress {
    return {
      runId: base.runId,
      scope: base.scope,
      status: "running",
      phase: "running",
      runNumber: base.runNumber,
      startedAt: base.startedAt,
      elapsedMs,
      completedFiles: live.completedFiles,
      totalFiles: base.totalFiles,
      counts: countsOf(live.cases),
      series: seriesOf(live.cases, elapsedMs),
      failures: [...live.failures],
      cases: [...live.cases],
    };
  }

  /**
   * Merge one file's result into an existing snapshot.
   *
   * A file-scoped run reports only the file it ran, so replacing the whole
   * snapshot would blank every other row. The file's entry is swapped in place
   * and the package list is rebuilt from the same grouping rule the full parse
   * uses, so a merge and a full run produce the same shape.
   *
   * @param previous - the snapshot to merge into, when there is one.
   * @param incoming - the snapshot the scoped run produced.
   * @param scopePath - the file the run covered.
   * @returns the merged snapshot.
   */
  function mergeScoped(previous: TestSnapshot | undefined, incoming: TestSnapshot, scopePath: string): TestSnapshot {
    if (previous === undefined) return incoming;
    const replacement = incoming.packages.flatMap(pkg => pkg.files).find(file => file.path === scopePath);
    // The run reported nothing for the file it was asked to run: keep the old
    // rows rather than deleting a file the reader can still see on disk.
    if (replacement === undefined) return previous;

    const byPackage = new Map<string, TestFile[]>();
    for (const pkg of previous.packages) {
      for (const file of pkg.files) {
        if (file.path === scopePath) continue;
        const bucket = byPackage.get(pkg.name);
        if (bucket === undefined) byPackage.set(pkg.name, [file]);
        else bucket.push(file);
      }
    }
    // The replacement goes back under the package its path names, which is the
    // same rule the full parse applies.
    const packageName = incoming.packages.find(pkg => pkg.files.some(file => file.path === scopePath))?.name ?? ".";
    const bucket = byPackage.get(packageName);
    if (bucket === undefined) byPackage.set(packageName, [replacement]);
    else bucket.push(replacement);

    const packages: TestPackage[] = [...byPackage.entries()]
      .sort(([left], [right]) => (left < right ? -1 : left > right ? 1 : 0))
      .map(([name, files]) => ({
        name,
        files: [...files].sort((left, right) => (left.path < right.path ? -1 : left.path > right.path ? 1 : 0)),
      }));

    return { ...incoming, packages };
  }

  /**
   * Patch the canonical run log with one file's new verdicts.
   *
   * The log is history: it keeps the full run's timing, but a failure that has
   * since been fixed should stop painting the chart red. Each case the rerun
   * reported is updated where it originally landed, and cases the run added are
   * appended at the log's end. Totals and the failure list are then recomputed
   * from the patched cases so the chart and the last-run line agree with the
   * board's patched snapshot.
   *
   * @param log - the full run the board narrates.
   * @param incoming - the snapshot the scoped run produced.
   * @param scopePath - the file the rerun covered.
   * @returns the patched log.
   */
  function patchLog(log: RunProgress, incoming: TestSnapshot, scopePath: string): RunProgress {
    const replacement = incoming.packages.flatMap(pkg => pkg.files).find(file => file.path === scopePath);
    if (replacement === undefined) return log;

    // Case names are not unique inside a file: two `it("works")` under
    // different describes are two cases. Pair them by name in report order,
    // one verdict per old completion, instead of collapsing the name to its
    // last verdict.
    const verdictQueues = new Map<string, { status: RunCaseEvent["status"]; durationMs: number }[]>();
    for (const verdict of replacement.cases) {
      const queue = verdictQueues.get(verdict.name);
      const entry = { status: verdict.status, durationMs: verdict.durationMs };
      if (queue === undefined) verdictQueues.set(verdict.name, [entry]);
      else queue.push(entry);
    }
    const used = new Map<string, number>();
    const cases: RunCaseEvent[] = [];
    for (const event of log.cases) {
      if (event.path !== scopePath) {
        cases.push(event);
        continue;
      }
      const verdict = verdictQueues.get(event.name)?.shift();
      // A case the rerun no longer reports was removed from the file: its old
      // completion should not stay in a log that describes the current board.
      if (verdict === undefined) continue;
      used.set(event.name, (used.get(event.name) ?? 0) + 1);
      cases.push({ ...event, status: verdict.status, durationMs: verdict.durationMs });
    }
    for (const verdict of replacement.cases) {
      const matched = used.get(verdict.name) ?? 0;
      if (matched > 0) {
        used.set(verdict.name, matched - 1);
        continue;
      }
      cases.push({
        path: scopePath,
        name: verdict.name,
        status: verdict.status,
        durationMs: verdict.durationMs,
        atMs: log.elapsedMs,
      });
    }

    const counts = countsOf(cases);
    const failures = cases
      .filter(event => event.status === "failed")
      .map(event => ({ tMs: event.atMs, path: event.path, name: event.name }));
    return {
      ...log,
      status: failures.length === 0 ? "passed" : "failed",
      counts,
      failures,
      cases,
      series: seriesOf(cases, log.elapsedMs),
    };
  }

  async function execute(workspace: string, scope: RunScope, runId: string, entry: WorkspaceEntry): Promise<void> {
    const controller = new AbortController();
    entry.controller = controller;
    const startedAtMs = now();
    const outputFile = join(tmpdir(), `dsh-testboard-${runId}.json`);
    const startedAt = new Date(startedAtMs).toISOString();
    entry.runCount += 1;
    const base = {
      runId,
      scope,
      runNumber: entry.runCount,
      startedAt,
      totalFiles: scope.kind === "file" ? 1 : null,
    };
    const live: LiveProgress = { cases: [], failures: [], completedFiles: 0 };
    // A line can arrive in two reads; the tail is held until it is complete.
    let pending = "";
    const finishedFiles = new Set<string>();
    // Marked running synchronously so a second `start` in the same tick is busy.
    entry.run = progressOf(base, live, 0);

    /**
     * Fold one chunk of the verbose stream into the live half.
     *
     * A chunk can end mid-line, so the trailing partial line is held back until
     * the next read completes it. Without that, a case printed across two reads
     * would be parsed twice as two broken lines and lost.
     *
     * @param chunk - the text read since the last call.
     */
    const absorb = (chunk: string): void => {
      const combined = pending + chunk;
      const lastBreak = combined.lastIndexOf("\n");
      if (lastBreak === -1) {
        pending = combined;
        return;
      }
      pending = combined.slice(lastBreak + 1);
      const complete = combined.slice(0, lastBreak);
      for (const event of parseVerboseOutput(complete)) {
        const atMs = Math.max(0, now() - startedAtMs);
        if (event.kind === "case") {
          live.cases.push({
            path: event.path,
            name: event.name,
            status: event.status,
            durationMs: event.durationMs,
            atMs,
          });
          finishedFiles.add(event.path);
        } else {
          live.failures.push({ tMs: atMs, path: event.path, name: event.name });
        }
      }
      live.completedFiles = finishedFiles.size;
    };

    /**
     * Fold in whatever is left after the child exited.
     *
     * `absorb` holds back a trailing partial line, and the reporter's last line
     * has no newline after it, so without this the final case of every run would
     * be silently dropped.
     */
    const flush = (): void => {
      if (pending === "") return;
      const tail = pending;
      pending = "";
      absorb(`${tail}\n`);
    };

    const settle = (phase: RunPhase, status: RunProgress["status"], message?: string): void => {
      const elapsedMs = Math.max(0, now() - startedAtMs);
      entry.run = {
        ...progressOf(base, live, elapsedMs),
        status,
        phase,
        elapsedMs,
        series: seriesOf(live.cases, elapsedMs),
        ...(phase === "running" ? {} : { finishedAt: new Date(now()).toISOString() }),
        ...(message === undefined ? {} : { message }),
      };
      entry.controller = undefined;
    };

    let planned: { argv: readonly string[]; cwd: string; cleanup?: () => Promise<void> } = {
      argv: buildVitestArgv({ workspace, scope, outputFile }),
      cwd: workspace,
    };
    try {
      if (options.plan !== undefined) planned = await options.plan({ workspace, scope, outputFile });
      const handle = options.subprocess.spawn({
        argv: planned.argv,
        cwd: planned.cwd,
        stdio: {
          // A test run must never wait on input: a prompt with no stdin is a
          // hang, and a hang is indistinguishable from a slow suite.
          stdin: "ignore",
          stdout: { collect: { maxBytes: MAX_STREAM_BYTES } },
          stderr: { collect: { maxBytes: MAX_STREAM_BYTES } },
        },
        graceMs: GRACE_MS,
        signal: controller.signal,
      });

      // The stream is read while the child runs, not after it exits: the host
      // collects a pipe and exposes an offset read, so polling it is what makes
      // a case visible to a polling client before the suite is over. The timer
      // is cleared in the `finally` below, and one last read after `done` picks
      // up whatever landed between the final poll and the exit.
      let cursor = 0;
      let carry: Buffer = EMPTY_BUFFER;
      const stdoutReader = handle.collected.stdout;
      const drain = (): void => {
        const read = readNew(stdoutReader, cursor, carry);
        cursor = read.next;
        carry = read.carry;
        if (read.text === "") return;
        absorb(read.text);
        entry.run = progressOf(base, live, Math.max(0, now() - startedAtMs));
      };
      const poll = setInterval(drain, STREAM_POLL_MS);

      let exitCode: number | null = null;
      try {
        ({ exitCode } = await handle.done);
      } catch (error) {
        clearInterval(poll);
        if (controller.signal.aborted) {
          settle("cancelled", "cancelled");
          return;
        }
        throw error;
      }
      clearInterval(poll);
      drain();
      flush();
      entry.run = progressOf(base, live, Math.max(0, now() - startedAtMs));

      if (controller.signal.aborted) {
        settle("cancelled", "cancelled");
        return;
      }

      let raw: string;
      try {
        raw = await readFile(outputFile, "utf8");
      } catch {
        // No report file: the runner died before reporting (a config error, a
        // missing binary, a crash). The stderr tail is the only explanation the
        // reader can act on, and the previous snapshot stays on the board.
        const stderr = readStream(handle.collected.stderr).trim();
        settle("error", "error", stderr === "" ? "vitest produced no report" : stderr.split("\n").slice(-8).join("\n"));
        return;
      }

      const parsed = parseVitestJson(raw, {
        workspace,
        ...(options.fileTextOf === undefined ? {} : { fileTextOf: path => options.fileTextOf?.(workspace, path) }),
        generatedAt: new Date(now()).toISOString(),
        wallClockMs: Math.max(0, now() - startedAtMs),
      });
      entry.snapshot =
        scope.kind === "file" ? mergeScoped(entry.snapshot, parsed, scope.path) : parsed;
      settle("finished", runFailed(parsed, exitCode) ? "failed" : "passed");
      // A full run is the new story. A scoped rerun is a patch to the current
      // one: the board's rows come from the merged snapshot, and the chart's
      // story is the full run with the rerun's verdicts folded in, so a fixed
      // file stops painting the chart red. The first run of either scope becomes
      // the log because there is nothing older to preserve.
      if (scope.kind === "all" || entry.log === undefined) entry.log = entry.run;
      else entry.log = patchLog(entry.log, parsed, scope.path);
      // Both halves are defined here: the snapshot was just assigned and
      // `settle` just wrote the run. The callback is invoked synchronously so a
      // caller that reads the board in the same tick sees the same result the
      // cache is about to hold.
      if (entry.snapshot !== undefined && entry.run !== undefined) {
        options.onSettled?.(workspace, {
          snapshot: entry.snapshot,
          run: entry.run,
          ...(entry.log === undefined ? {} : { log: entry.log }),
        });
      }
    } catch (error) {
      settle("error", "error", error instanceof Error ? error.message : String(error));
    } finally {
      // The report is megabytes of JSON nobody reads twice, and a leaked file per
      // run would accumulate in the system temp directory forever.
      await rm(outputFile, { force: true });
      await planned.cleanup?.();
    }
  }

  return {
    getState(workspace) {
      const entry = entries.get(workspace);
      if (entry === undefined) return {};
      return {
        ...(entry.snapshot === undefined ? {} : { snapshot: entry.snapshot }),
        ...(entry.run === undefined ? {} : { run: entry.run }),
        ...(entry.log === undefined ? {} : { log: entry.log }),
      };
    },

    start(workspace, scope) {
      const entry = entryOf(workspace);
      if (entry.run?.phase === "running") return { ok: false, error: "busy" };
      const runId = `run-${now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
      const done = execute(workspace, scope, runId, entry);
      return { ok: true, runId, done };
    },

    cancel(workspace) {
      const entry = entries.get(workspace);
      const controller = entry?.controller;
      if (controller === undefined) return false;
      controller.abort();
      return true;
    },
  };
}
