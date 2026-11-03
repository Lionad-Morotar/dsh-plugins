/**
 * How the history list turns a search box into host queries.
 *
 * The list has two callers that must agree: the search itself (page one of a
 * query) and paging (the next page of whatever query produced the rows on
 * screen). If paging read the input box instead of the loaded query, a page
 * requested mid-edit would append commits from a different search under a
 * filtered list, and the reader would see matches for text they had already
 * changed. One function builds both requests, so the agreement is structural
 * rather than something a review has to notice.
 */
import type { GitQueryRequest } from "../host/types.ts";

/** Rows fetched by one history page. */
export const HISTORY_PAGE_SIZE = 100;

/**
 * Build one `git log` page request.
 *
 * An empty query is spelled as an absent field, not as an empty string: the host
 * treats a present `search` as a `--grep`, and grepping for the empty string
 * matches every commit at a cost rather than restoring the plain snapshot list.
 * @param sessionId - session whose working directory backs the query.
 * @param query - the search text already trimmed by the caller, or "" for none.
 * @param skip - commits to skip, which is how many are already loaded.
 * @returns the request `remote.query` takes.
 */
export function pageQuery(sessionId: string, query: string, skip: number): GitQueryRequest {
  const search = query.trim();
  return {
    sessionId,
    skip: Math.max(0, Math.trunc(skip)),
    limit: HISTORY_PAGE_SIZE,
    ...(search === "" ? {} : { search }),
  };
}
