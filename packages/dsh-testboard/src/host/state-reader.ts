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
import type { ResultsStore } from "./results-store.ts";
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
      return {
        workspace,
        workspaceName: basename(workspace),
        snapshot: cached.snapshot,
        run: cached.run,
        cached: true,
      };
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
