/**
 * The runtime seam: everything the PR tab asks of the host, behind one interface.
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
import {
  ROUTE_PREFIX,
  type CompareSnapshotResult,
  type PrFileDiffResult,
  type RefListingResult,
} from "../shared.ts";

/** What the view asks of the host. */
export interface PrRuntime {
  /** The workspace's ref listing, for the two pickers. */
  loadRefs(sessionId: string): Promise<RefListingResult>;
  /** The pinned comparison: reading, commits and files. */
  loadCompare(sessionId: string, base: string, head: string): Promise<CompareSnapshotResult>;
  /** One file's detail for the same range. */
  loadDiff(sessionId: string, base: string, head: string, path: string): Promise<PrFileDiffResult>;
}

/**
 * One JSON request against the host.
 *
 * A non-2xx answer and an unparseable body are both errors: the caller renders
 * an error state, and returning a plausible-looking empty comparison instead
 * would make a broken host look like two refs with nothing between them.
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
export function createHttpRuntime(fetchImpl: typeof fetch = fetch): PrRuntime {
  return {
    async loadRefs(sessionId) {
      const query = new URLSearchParams({ sessionId });
      const body = await requestJson(fetchImpl, `${ROUTE_PREFIX}/refs?${query.toString()}`);
      // A domain failure (200 + ok:false) is passed through untouched: the view
      // maps the code to its own copy, and translating here would put the
      // vocabulary in two places.
      return body as RefListingResult;
    },

    async loadCompare(sessionId, base, head) {
      const query = new URLSearchParams({ sessionId, base, head });
      const body = await requestJson(fetchImpl, `${ROUTE_PREFIX}/compare?${query.toString()}`);
      return body as CompareSnapshotResult;
    },

    async loadDiff(sessionId, base, head, path) {
      // The path goes through URLSearchParams rather than string concatenation:
      // a repository-relative path can hold `&`, `#` and non-ASCII names, and a
      // hand-built query would cut it in half at the first of those.
      const query = new URLSearchParams({ sessionId, base, head, path });
      const body = await requestJson(fetchImpl, `${ROUTE_PREFIX}/diff?${query.toString()}`);
      return body as PrFileDiffResult;
    },
  };
}
