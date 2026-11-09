/**
 * The run engine: one vitest process per workspace, one run at a time.
 *
 * The engine owns the state machine and the temp file; the subprocess service is
 * injected so the whole thing is testable without spawning vitest. Two rules
 * shape it:
 *
 * - One active run per workspace. A second `start` answers `busy` instead of
 *   queueing, because a queue would let a reader pile up runs they cannot see.
 * - The result is read from the reporter's output file, not from stdout. The
 *   human reporter's lines are parsed only for progress, and a run that produced
 *   no file is an error rather than an empty board.
 */
import { readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

import type { RunProgress, RunScope, TestboardError, TestboardState } from "../shared.ts";
import { buildVitestArgv, completedFileOf, parseVitestJson, runFailed } from "./vitest.ts";

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
}

/**
 * Output budget for one stream.
 *
 * A full suite prints a line per file plus a summary; four megabytes is far past
 * any real run and exists so a runaway reporter cannot grow the host's memory.
 */
const MAX_STREAM_BYTES = 4 * 1024 * 1024;

/** How long a killed child may take to die before the host stops waiting. */
const GRACE_MS = 500;

/** One workspace's mutable board state. */
interface WorkspaceEntry {
  snapshot?: TestboardState["snapshot"];
  run?: RunProgress;
  controller?: AbortController;
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
    const created: WorkspaceEntry = {};
    entries.set(workspace, created);
    return created;
  }

  function readStream(reader: CollectedReader | undefined): string {
    if (reader === undefined) return "";
    const read = reader.readFrom(0);
    return read.text;
  }

  /**
   * Count the distinct files the human reporter announced.
   *
   * Best-effort by construction: a reporter that prints nothing leaves the count
   * at zero, which the board renders as an indeterminate run rather than as
   * "no files".
   */
  function countCompletedFiles(stdout: string): number {
    const seen = new Set<string>();
    for (const line of stdout.split("\n")) {
      const path = completedFileOf(line);
      if (path !== undefined) seen.add(path);
    }
    return seen.size;
  }

  async function execute(workspace: string, scope: RunScope, runId: string, entry: WorkspaceEntry): Promise<void> {
    const controller = new AbortController();
    entry.controller = controller;
    const startedAtMs = now();
    const outputFile = join(tmpdir(), `dsh-testboard-${runId}.json`);
    const startedAt = new Date(startedAtMs).toISOString();
    entry.run = {
      runId,
      scope,
      status: "running",
      startedAt,
      completedFiles: 0,
      totalFiles: scope.kind === "file" ? 1 : null,
    };

    const settle = (status: RunProgress["status"], message?: string): void => {
      const finishedAtMs = now();
      entry.run = {
        runId,
        scope,
        status,
        startedAt,
        finishedAt: new Date(finishedAtMs).toISOString(),
        completedFiles: entry.run?.completedFiles ?? 0,
        totalFiles: scope.kind === "file" ? 1 : null,
        ...(message === undefined ? {} : { message }),
      };
      entry.controller = undefined;
    };

    try {
      const handle = options.subprocess.spawn({
        argv: buildVitestArgv({ workspace, scope, outputFile }),
        cwd: workspace,
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

      let exitCode: number | null = null;
      try {
        ({ exitCode } = await handle.done);
      } catch (error) {
        if (controller.signal.aborted) {
          settle("cancelled");
          return;
        }
        throw error;
      }

      const stdout = readStream(handle.collected.stdout);
      entry.run = { ...(entry.run as RunProgress), completedFiles: countCompletedFiles(stdout) };

      if (controller.signal.aborted) {
        settle("cancelled");
        return;
      }

      let raw: string;
      try {
        raw = await readFile(outputFile, "utf8");
      } catch {
        // No report file: the runner died before reporting (a config error, a
        // missing binary, a crash). The stderr tail is the only explanation the
        // reader can act on.
        const stderr = readStream(handle.collected.stderr).trim();
        settle("error", stderr === "" ? "vitest produced no report" : stderr.split("\n").slice(-8).join("\n"));
        return;
      }

      const snapshot = parseVitestJson(raw, {
        workspace,
        ...(options.fileTextOf === undefined ? {} : { fileTextOf: path => options.fileTextOf?.(workspace, path) }),
        generatedAt: new Date(now()).toISOString(),
        wallClockMs: Math.max(0, now() - startedAtMs),
      });
      entry.snapshot = snapshot;
      settle(runFailed(snapshot, exitCode) ? "failed" : "passed");
    } catch (error) {
      settle("error", error instanceof Error ? error.message : String(error));
    } finally {
      // The report is megabytes of JSON nobody reads twice, and a leaked file per
      // run would accumulate in the system temp directory forever.
      await rm(outputFile, { force: true });
    }
  }

  return {
    getState(workspace) {
      const entry = entries.get(workspace);
      if (entry === undefined) return {};
      return {
        ...(entry.snapshot === undefined ? {} : { snapshot: entry.snapshot }),
        ...(entry.run === undefined ? {} : { run: entry.run }),
      };
    },

    start(workspace, scope) {
      const entry = entryOf(workspace);
      if (entry.run?.status === "running") return { ok: false, error: "busy" };
      const runId = `run-${now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
      // The run is marked running synchronously, before the promise is returned:
      // a caller that starts twice in one tick must see the second as busy.
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
