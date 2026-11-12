/**
 * The runtime seam: everything the board asks of the host, behind one interface.
 *
 * Two implementations, one contract. This module is the HTTP one, which talks to
 * `/testboard/api`. The preview's fixture runtime lives in `fixture-runtime.ts`
 * rather than beside this one: it is a demonstration surface, and a bundler
 * cannot drop an unused export from a module it has already pulled in, so
 * keeping it here would put the demo loop in every user's boot path.
 *
 * The view is written against the interface and never against either
 * implementation, which is what keeps the preview honest: a preview that took a
 * different path would stop being evidence about the tab.
 *
 * Every request is a same-origin relative path. The GUI port changes on every
 * host boot, so an absolute URL composed here would be stale by the time a tab
 * read it.
 */
import {
  ROUTE_PREFIX,
  type RunProgress,
  type RunScope,
  type RunSummary,
  type TestboardState,
  type WireCancelResponse,
  type WireHistoryResponse,
  type WireRunStartResponse,
  type WireSourceResponse,
} from "../shared.ts";

/** What the view asks of the host. */
export interface TestboardRuntime {
  /**
   * The workspace's board state for one session.
   *
   * `runId` asks for one cached run by id instead of the live/newest reading;
   * the host answers from disk, so the picker can show history without pretending
   * a past run is the current one.
   */
  loadState(sessionId: string, runId?: string): Promise<TestboardState>;
  /** Every cached run for the workspace, newest first. */
  listRuns(sessionId: string): Promise<readonly RunSummary[]>;
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
    async loadState(sessionId, runId) {
      const query = new URLSearchParams({ sessionId });
      if (runId !== undefined) query.set("run", runId);
      const body = await requestJson(fetchImpl, `${ROUTE_PREFIX}/state?${query.toString()}`);
      return body as TestboardState;
    },

    async listRuns(sessionId) {
      const query = new URLSearchParams({ sessionId });
      const body = (await requestJson(fetchImpl, `${ROUTE_PREFIX}/history?${query.toString()}`)) as WireHistoryResponse;
      return Array.isArray(body.runs) ? body.runs : [];
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
