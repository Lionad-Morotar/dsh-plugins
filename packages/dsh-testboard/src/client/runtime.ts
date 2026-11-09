/**
 * The runtime seam: everything the board asks of the host, behind one interface.
 *
 * Two implementations, one contract. The HTTP one talks to `/testboard/api`; the
 * fixture one serves the committed snapshot so the preview page can render the
 * same view with no host at all. The view is written against the interface and
 * never against either implementation, which is what keeps the preview honest:
 * a preview that took a different path would stop being evidence about the tab.
 *
 * Every request is a same-origin relative path. The GUI port changes on every
 * host boot, so an absolute URL composed here would be stale by the time a tab
 * read it.
 */
import type { TestSnapshot } from "./model.ts";
import type { SourceBundle } from "./source.ts";
import {
  ROUTE_PREFIX,
  type RunProgress,
  type RunScope,
  type TestboardState,
  type WireCancelResponse,
  type WireRunStartResponse,
  type WireSourceResponse,
} from "../shared.ts";

/** What the view asks of the host. */
export interface TestboardRuntime {
  /** The workspace's board state for one session. */
  loadState(sessionId: string): Promise<TestboardState>;
  /** Begin a run, or learn why it was refused. */
  startRun(sessionId: string, scope: RunScope): Promise<WireRunStartResponse>;
  /** Abort the session's active run; false when nothing was running. */
  cancelRun(sessionId: string): Promise<boolean>;
  /** One test file's text, by workspace-relative path. */
  loadSource(sessionId: string, path: string): Promise<string>;
}

/**
 * One JSON request against the host.
 *
 * A non-2xx answer and an unparseable body are both errors: the caller renders
 * an error state, and returning a plausible-looking empty value instead would
 * make a broken host look like a workspace with no tests.
 *
 * @param fetchImpl - the fetch to use.
 * @param url - a same-origin relative path.
 * @param init - method and body, when the route takes one.
 * @returns the parsed body.
 * @throws when the request failed or the body is not JSON.
 */
async function requestJson(fetchImpl: typeof fetch, url: string, init?: RequestInit): Promise<unknown> {
  const response = await fetchImpl(url, init);
  if (!response.ok) {
    throw new Error(`${url} answered ${String(response.status)}`);
  }
  return (await response.json()) as unknown;
}

/**
 * Build the runtime that talks to the host's routes.
 *
 * @param fetchImpl - the fetch to use; injectable so the contract is testable.
 * @returns the runtime.
 */
export function createHttpRuntime(fetchImpl: typeof fetch = fetch): TestboardRuntime {
  return {
    async loadState(sessionId) {
      const query = new URLSearchParams({ sessionId });
      const body = await requestJson(fetchImpl, `${ROUTE_PREFIX}/state?${query.toString()}`);
      return body as TestboardState;
    },

    async startRun(sessionId, scope) {
      const body = await requestJson(fetchImpl, `${ROUTE_PREFIX}/run`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ sessionId, scope }),
      });
      return body as WireRunStartResponse;
    },

    async cancelRun(sessionId) {
      const body = (await requestJson(fetchImpl, `${ROUTE_PREFIX}/cancel`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ sessionId }),
      })) as WireCancelResponse;
      return body.ok === true;
    },

    async loadSource(sessionId, path) {
      const query = new URLSearchParams({ sessionId, path });
      const body = (await requestJson(fetchImpl, `${ROUTE_PREFIX}/source?${query.toString()}`)) as WireSourceResponse;
      if (typeof body.text !== "string") throw new Error("source route answered without text");
      return body.text;
    },
  };
}

/** What the fixture runtime serves. */
export interface FixtureRuntimeOptions {
  readonly snapshot: TestSnapshot;
  readonly sources: SourceBundle;
  /**
   * How long a fixture run stays in the running phase.
   *
   * Short enough that a reader watching the preview sees the whole arc, long
   * enough that the running state is visible rather than a flicker. The demo
   * loop the motion slice adds will drive this itself; until then this is the
   * one knob.
   */
  readonly runDurationMs?: number;
}

/** The default fixture run length. */
const FIXTURE_RUN_MS = 1200;

/**
 * Build the runtime the preview page uses.
 *
 * It answers the same interface from the committed snapshot, and it invents a
 * run so the preview can show the running and finished states at all. The
 * invented run is labelled with the fixture's own counts rather than a real
 * suite's, and it never claims a workspace: this is a demonstration surface, and
 * a preview that pretended to have run a real suite would be a lie about the
 * panel.
 *
 * @param options - the snapshot, the source bundle and the run length.
 * @returns the runtime.
 */
export function createFixtureRuntime(options: FixtureRuntimeOptions): TestboardRuntime {
  const runDurationMs = options.runDurationMs ?? FIXTURE_RUN_MS;
  let run: RunProgress | undefined;
  let settleTimer: ReturnType<typeof setTimeout> | undefined;
  let runCount = 0;

  /** The fixture's tallies, so the invented run agrees with the snapshot. */
  function countsOf(snapshot: TestSnapshot): { passed: number; failed: number; skipped: number; total: number } {
    let passed = 0;
    let failed = 0;
    let skipped = 0;
    for (const pkg of snapshot.packages) {
      for (const file of pkg.files) {
        for (const entry of file.cases) {
          if (entry.status === "failed") failed += 1;
          else if (entry.status === "skipped") skipped += 1;
          else passed += 1;
        }
      }
    }
    return { passed, failed, skipped, total: passed + failed + skipped };
  }

  function stateOf(): TestboardState {
    return {
      workspace: "fixture",
      workspaceName: "fixture",
      snapshot: options.snapshot,
      ...(run === undefined ? {} : { run }),
    };
  }

  return {
    async loadState() {
      return stateOf();
    },

    async startRun(_sessionId, scope) {
      if (run?.phase === "running") return { ok: false, error: "busy" };
      runCount += 1;
      const counts = countsOf(options.snapshot);
      const startedAt = new Date().toISOString();
      run = {
        runId: `fixture-run-${String(runCount)}`,
        scope,
        status: "running",
        phase: "running",
        runNumber: runCount,
        startedAt,
        elapsedMs: 0,
        completedFiles: 0,
        totalFiles: scope.kind === "file" ? 1 : null,
        counts: { passed: 0, failed: 0, skipped: 0, total: 0 },
        series: [],
        failures: [],
        cases: [],
      };
      settleTimer = setTimeout(() => {
        if (run === undefined || run.phase !== "running") return;
        run = {
          ...run,
          status: counts.failed > 0 ? "failed" : "passed",
          phase: "finished",
          finishedAt: new Date().toISOString(),
          elapsedMs: runDurationMs,
          completedFiles: scope.kind === "file" ? 1 : options.snapshot.packages.reduce((sum, pkg) => sum + pkg.files.length, 0),
          counts,
        };
        settleTimer = undefined;
      }, runDurationMs);
      return { ok: true, runId: run.runId };
    },

    async cancelRun() {
      if (run === undefined || run.phase !== "running") return false;
      if (settleTimer !== undefined) {
        clearTimeout(settleTimer);
        settleTimer = undefined;
      }
      run = { ...run, status: "cancelled", phase: "cancelled", finishedAt: new Date().toISOString() };
      return true;
    },

    async loadSource(_sessionId, path) {
      const text = options.sources.files[path];
      if (typeof text !== "string") throw new Error(`fixture has no source for ${path}`);
      return text;
    },
  };
}
