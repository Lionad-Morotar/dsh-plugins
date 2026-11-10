/**
 * The runtime seam: everything the review tab asks of the host, behind one
 * interface.
 *
 * The view is written against this interface and never against the HTTP
 * implementation, which is what lets a test, a preview and the tab all drive the
 * same component. `createHttpRuntime` is the real one; the tests supply their
 * own.
 *
 * Every request is a same-origin relative path. The GUI port changes on every
 * host boot, so an absolute URL composed here would be stale by the time a tab
 * read it.
 */
import { ROUTE_PREFIX, type FileDiffResult, type ReviewScope, type ReviewSnapshotResult } from "../shared.ts";

/** What the view asks of the host. */
export interface ReviewRuntime {
  /** The workspace's change list for one session and one comparison. */
  loadSnapshot(sessionId: string, scope: ReviewScope): Promise<ReviewSnapshotResult>;
  /** One file's detail for the same comparison. */
  loadDiff(sessionId: string, scope: ReviewScope, path: string): Promise<FileDiffResult>;
}

/**
 * One JSON request against the host.
 *
 * A non-2xx answer and an unparseable body are both errors: the caller renders
 * an error state, and returning a plausible-looking empty snapshot instead would
 * make a broken host look like a workspace with no changes.
 *
 * @param fetchImpl - the fetch to use.
 * @param url - a same-origin relative path.
 * @returns the parsed body.
 * @throws when the request failed or the body is not JSON.
 */
async function requestJson(fetchImpl: typeof fetch, url: string): Promise<unknown> {
  const response = await fetchImpl(url);
  if (!response.ok) throw new Error(`${url} answered ${String(response.status)}`);
  return (await response.json()) as unknown;
}

/**
 * Build the runtime that talks to the host's routes.
 *
 * @param fetchImpl - the fetch to use; injectable so the contract is testable.
 * @returns the runtime.
 */
export function createHttpRuntime(fetchImpl: typeof fetch = fetch): ReviewRuntime {
  return {
    async loadSnapshot(sessionId, scope) {
      const query = new URLSearchParams({ sessionId, scope: scope.kind });
      // The base is only sent when the caller named one: an empty `base=` would
      // read as "resolve it yourself" on the host, which is a different request
      // than the one this caller made.
      if (scope.kind === "branch" && scope.baseRef !== undefined) query.set("base", scope.baseRef);
      const body = await requestJson(fetchImpl, `${ROUTE_PREFIX}/state?${query.toString()}`);
      // A domain failure (200 + ok:false) is passed through untouched: the view
      // maps the code to its own copy, and translating here would put the
      // vocabulary in two places.
      return body as ReviewSnapshotResult;
    },

    async loadDiff(sessionId, scope, path) {
      const query = new URLSearchParams({ sessionId, path, scope: scope.kind });
      if (scope.kind === "branch" && scope.baseRef !== undefined) query.set("base", scope.baseRef);
      // The path goes through URLSearchParams rather than string concatenation:
      // a repository-relative path can hold `&`, `#` and non-ASCII names, and a
      // hand-built query would cut it in half at the first of those.
      const body = await requestJson(fetchImpl, `${ROUTE_PREFIX}/diff?${query.toString()}`);
      return body as FileDiffResult;
    },
  };
}
