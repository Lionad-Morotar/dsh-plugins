/**
 * The on-disk result cache.
 *
 * A run is expensive and its reading is the whole point of the tab, so the
 * result outlives the host process: every settled run is written under the
 * workspace as `logs/testboard/<YYMMDD>/<HHmmss>/result.json`, and the board
 * falls back to the newest readable file when it has no in-memory state (a
 * fresh boot, a new session for the same workspace, a reloaded GUI).
 *
 * The layout is the workspace's own, not the plugin's: a reader who wants the
 * raw numbers can open the directory, and deleting the tree is a safe way to
 * reset the board. Writes are best-effort: a read-only checkout or a full disk
 * must not fail a run that already produced a result.
 */
import { readdir, readFile, rename, writeFile, mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";

import type { TestSnapshot } from "../client/model.ts";
import type { RunProgress } from "../shared.ts";

/** Directory under the workspace that holds every cached run. */
export const RESULT_ROOT = join("logs", "testboard");

/** The file name inside one run's directory. */
export const RESULT_FILE = "result.json";

/**
 * On-disk schema version.
 *
 * A reader that meets another version treats the file as unreadable rather than
 * guessing: an old layout would otherwise reappear as a board with the wrong
 * columns.
 */
const RESULT_VERSION = 1;

/** One run recovered from disk. */
export interface CachedResult {
  /** When the file was written. */
  readonly savedAt: string;
  /** The run that produced the snapshot, as the board last rendered it. */
  readonly run: RunProgress;
  /** The snapshot the run replaced the board with. */
  readonly snapshot: TestSnapshot;
}

/** What {@link ResultsStore.save} writes. */
export interface ResultRecord {
  readonly run: RunProgress;
  readonly snapshot: TestSnapshot;
}

/** The two operations the host half needs. */
export interface ResultsStore {
  /**
   * Persist one settled run under the workspace.
   *
   * Best-effort by contract: the caller does not await it, and a failed write is
   * reported as undefined rather than thrown.
   * @param workspace - the canonical workspace root.
   * @param result - the run and the snapshot it produced.
   * @param now - the clock, injectable so the directory layout is testable.
   * @returns the file written, or undefined when the write failed.
   */
  save(workspace: string, result: ResultRecord, now?: Date): Promise<string | undefined>;
  /**
   * The newest readable run for one workspace, or undefined when there is none.
   *
   * Answers come from memory after the first read; {@link ResultsStore.save}
   * refreshes that memory, so a run started in this process is visible at once.
   * @param workspace - the canonical workspace root.
   * @returns the cached run, or undefined.
   */
  latest(workspace: string): Promise<CachedResult | undefined>;
}

/**
 * Two-digit clock field.
 * @param value - a numeric date part.
 * @returns the part padded to two digits.
 */
function two(value: number): string {
  return String(value).padStart(2, "0");
}

/**
 * The workspace-relative directory one run is written to.
 *
 * Local time on purpose: a person looking for "the run I did this afternoon"
 * reads the directory name, not a UTC offset. Two runs inside one second
 * collide here, which is why the caller suffixes retries.
 * @param now - the write clock.
 * @returns `logs/testboard/<YYMMDD>/<HHmmss>`.
 */
export function resultDirectory(now: Date): string {
  const day = `${String(now.getFullYear()).slice(-2)}${two(now.getMonth() + 1)}${two(now.getDate())}`;
  const time = `${two(now.getHours())}${two(now.getMinutes())}${two(now.getSeconds())}`;
  return join(RESULT_ROOT, day, time);
}

/**
 * Validate one parsed file before the board is allowed to render it.
 *
 * The snapshot is the load-bearing half: a run without one has nothing to show.
 * The check is shallow on purpose, so a hand-edited file that still carries the
 * right shape remains readable.
 * @param value - the parsed JSON.
 * @returns the result, or undefined when the file is not ours.
 */
function readRecord(value: unknown): CachedResult | undefined {
  if (value === null || typeof value !== "object") return undefined;
  const fields = value as {
    readonly version?: unknown;
    readonly savedAt?: unknown;
    readonly run?: unknown;
    readonly snapshot?: unknown;
  };
  if (fields.version !== RESULT_VERSION) return undefined;
  if (fields.snapshot === null || typeof fields.snapshot !== "object") return undefined;
  if (fields.run === null || typeof fields.run !== "object") return undefined;
  const run = fields.run as RunProgress;
  if (typeof run.phase !== "string" || typeof run.startedAt !== "string") return undefined;
  const savedAt = typeof fields.savedAt === "string" ? fields.savedAt : run.finishedAt ?? run.startedAt;
  return {
    savedAt,
    run,
    snapshot: fields.snapshot as TestSnapshot,
  };
}

/**
 * Newest-first ordering for the directory names this module writes.
 *
 * `YYMMDD` and `HHmmss` both sort lexicographically in time order, which is why
 * the layout uses fixed-width numeric names instead of anything human-sized.
 * @param left - one directory name.
 * @param right - the other.
 * @returns the sort result, descending.
 */
function descending(left: string, right: string): number {
  return left < right ? 1 : left > right ? -1 : 0;
}

/**
 * Build the result cache.
 *
 * @returns the store; each instance keeps its own memory map.
 */
export function createResultsStore(): ResultsStore {
  const memory = new Map<string, CachedResult | undefined>();

  async function newestPath(workspace: string): Promise<CachedResult | undefined> {
    const root = join(workspace, RESULT_ROOT);
    let days: string[];
    try {
      days = (await readdir(root, { withFileTypes: true })).filter(entry => entry.isDirectory()).map(entry => entry.name);
    } catch {
      return undefined;
    }
    days.sort(descending);
    for (const day of days.slice(0, 30)) {
      let times: string[];
      try {
        times = (await readdir(join(root, day), { withFileTypes: true }))
          .filter(entry => entry.isDirectory())
          .map(entry => entry.name);
      } catch {
        continue;
      }
      times.sort(descending);
      for (const time of times.slice(0, 50)) {
        let raw: string;
        try {
          raw = await readFile(join(root, day, time, RESULT_FILE), "utf8");
        } catch {
          continue;
        }
        let parsed: unknown;
        try {
          parsed = JSON.parse(raw);
        } catch {
          continue;
        }
        const record = readRecord(parsed);
        // The first readable file in newest-first order is the one the board
        // should show; a malformed newest file is skipped rather than blanking
        // the board.
        if (record !== undefined) return record;
      }
    }
    return undefined;
  }

  return {
    async save(workspace, result, now = new Date()) {
      const directory = resultDirectory(now);
      const body = JSON.stringify({
        version: RESULT_VERSION,
        savedAt: now.toISOString(),
        run: result.run,
        snapshot: result.snapshot,
      });
      // Two runs can settle inside one second. The directory itself is the
      // claim: `mkdir` without `recursive` either creates this run's directory
      // or answers EEXIST, which is a collision rather than a failure. The
      // suffix keeps both runs and still leaves the newer one first in the
      // lexicographic order the reader uses.
      for (let attempt = 1; attempt <= 20; attempt += 1) {
        const suffix = attempt === 1 ? "" : `-${String(attempt)}`;
        const runDirectory = join(workspace, `${directory}${suffix}`);
        try {
          await mkdir(dirname(runDirectory), { recursive: true });
          await mkdir(runDirectory);
        } catch (error) {
          const code = (error as { readonly code?: unknown }).code;
          if (code === "EEXIST") continue;
          // A read-only checkout or a missing parent: retrying with a suffix
          // would fail the same way, so the write is reported as skipped.
          return undefined;
        }
        const absolute = join(runDirectory, RESULT_FILE);
        try {
          const temporary = `${absolute}.tmp-${String(process.pid)}-${String(Date.now())}`;
          await writeFile(temporary, body, "utf8");
          await rename(temporary, absolute);
        } catch {
          // The directory was claimed but the file was not written; the next
          // attempt takes the next suffix rather than overwriting another run.
          continue;
        }
        memory.set(workspace, {
          savedAt: now.toISOString(),
          run: result.run,
          snapshot: result.snapshot,
        });
        return absolute;
      }
      return undefined;
    },

    async latest(workspace) {
      if (memory.has(workspace)) return memory.get(workspace);
      const record = await newestPath(workspace);
      memory.set(workspace, record);
      return record;
    },
  };
}
