import { describe, expect, it } from "vitest";

import { HISTORY_PAGE_SIZE, pageQuery } from "../src/client/history-query.ts";

describe("pageQuery", () => {
  it("asks for one page from the top when there is no search", () => {
    expect(pageQuery("s1", "", 0)).toEqual({ sessionId: "s1", skip: 0, limit: HISTORY_PAGE_SIZE });
  });

  it("omits the search field entirely rather than grepping the empty string", () => {
    // A present `search` becomes `--grep`; the empty pattern would match every
    // commit at the cost of a filter instead of restoring the snapshot list.
    expect("search" in pageQuery("s1", "   ", 0)).toBe(false);
  });

  it("carries the query into a page request", () => {
    expect(pageQuery("s1", "fix bug", 100)).toEqual({
      sessionId: "s1",
      skip: 100,
      limit: HISTORY_PAGE_SIZE,
      search: "fix bug",
    });
  });

  it("trims the query so leading space is not part of the grep", () => {
    expect(pageQuery("s1", "  fix  ", 0).search).toBe("fix");
  });

  it("pages the same query on from however many rows are loaded", () => {
    // This is the failure the design doc calls out: paging must repeat the
    // search it is paging, or unfiltered commits land under a filtered list.
    const first = pageQuery("s1", "typo", 0);
    const next = pageQuery("s1", "typo", HISTORY_PAGE_SIZE);
    expect(next.search).toBe(first.search);
    expect(next.skip).toBe(HISTORY_PAGE_SIZE);
  });

  it("never asks for a negative offset", () => {
    expect(pageQuery("s1", "", -5).skip).toBe(0);
  });
});
