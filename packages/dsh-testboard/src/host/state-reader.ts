/**
 * What the board shows for one workspace, in memory or on disk.
 *
 * The two sources answer different questions. The engine knows what this host
 * process has run since it booted; the results cache knows what the workspace
 * last produced, across restarts and sessions. A reader opening the tab after a
 * reload should land on the last reading rather than on "not run yet", so the
 * cache is the fallback exactly when the engine is empty.
 *
 * Kept out of `index.ts` so the precedence rule is testable without a Cordis
 * context: the wiring there is a line, the rule here is the product decision.
 */
import { basename } from "node:path";

import type { TestboardState } from "../shared.ts";
import type { CachedResult, ResultsStore } from "./results-store.ts";
import type { RunEngine } from "./run-engine.ts";

/** The two readers this module composes. */
export interface StateReaderDeps {
  /** The in-process state, which always wins when it has anything to say. */
  readonly engine: Pick<RunEngine, "getState">;
  /** The on-disk cache, read only when the engine is empty. */
  readonly results: Pick<ResultsStore, "latest">;
  /** Whether a path is still a live directory. */
  readonly isDirectory: (path: string) => Promise<boolean>;
}

/**
 * Build the reader the `/state` route answers with.
 * @param deps - the two state sources and the directory probe.
 * @returns a function from workspace path to the board's state.
 */
/**
 * The board state one cached run renders.
 * @param workspace - the canonical workspace root.
 * @param cached - the record read from disk.
 * @param selectedRun - the id the reader picked, when it is not the latest.
 * @returns the state the `/state` route answers with.
 */
export function cachedState(workspace: string, cached: CachedResult, selectedRun?: string): TestboardState {
  return {
    workspace,
    workspaceName: basename(workspace),
    snapshot: cached.snapshot,
    run: cached.run,
    ...(cached.log === undefined ? {} : { log: cached.log }),
    cached: true,
    ...(selectedRun === undefined ? {} : { selectedRun }),
  };
}

export function createStateReader(deps: StateReaderDeps): (workspace: string) => Promise<TestboardState> {
  return async workspace => {
    // A session can outlive the directory it pointed at (a deleted checkout, a
    // renamed folder). Saying so is more useful than an empty board that looks
    // like a workspace with no tests.
    if (!(await deps.isDirectory(workspace))) return { workspace, error: "unknown-workspace" };

    const state = deps.engine.getState(workspace);
    const empty = state.snapshot === undefined && state.run === undefined;
    if (empty) {
      const cached = await deps.results.latest(workspace);
      // A fallback that found nothing is still an empty workspace; the board
      // says "not run yet" and keeps its run button.
      if (cached === undefined) return { workspace, workspaceName: basename(workspace) };
      return cachedState(workspace, cached);
    }

    return {
      workspace,
      workspaceName: basename(workspace),
      ...state,
      // The last run's error is also the board's: a reader who reloads after a
      // crashed run must still see why the numbers are stale.
      ...(state.run?.status === "error" ? { error: "run-failed" as const } : {}),
    };
  };
}

/** The reader for a run the reader explicitly picked from the history. */
export interface SelectedStateReaderDeps {
  /** The on-disk cache, which is the only source an explicit pick can name. */
  readonly results: Pick<ResultsStore, "load">;
  /** Whether a path is still a live directory. */
  readonly isDirectory: (path: string) => Promise<boolean>;
}

/**
 * Build the reader behind `/state?run=<id>`.
 *
 * A picked run answers from disk directly: the engine may hold a newer run, but
 * the reader asked for this one, and a fallback to anything else would silently
 * show a different board than the picker's label claims.
 * @param deps - the cache and the directory probe.
 * @returns a function from workspace and run id to the board's state.
 */
export function createSelectedStateReader(
  deps: SelectedStateReaderDeps,
): (workspace: string, runId: string) => Promise<TestboardState> {
  return async (workspace, runId) => {
    if (!(await deps.isDirectory(workspace))) return { workspace, error: "unknown-workspace" };
    const cached = await deps.results.load(workspace, runId);
    if (cached === undefined) return { workspace, workspaceName: basename(workspace), error: "run-missing", selectedRun: runId };
    return cachedState(workspace, cached, runId);
  };
}
