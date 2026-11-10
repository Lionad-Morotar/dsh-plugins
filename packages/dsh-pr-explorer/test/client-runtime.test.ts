/**
 * The HTTP runtime: three routes, one shape, and the two ways each can fail.
 *
 * The fetch is injected, so these cases assert the exact URL the runtime builds
 * (path and query), what it does with each answer shape, and that a broken host
 * throws instead of returning something that looks like an empty range.
 */
import { describe, expect, it } from "vitest";

import { createHttpRuntime } from "../src/client/runtime.ts";
import { ROUTE_PREFIX } from "../src/shared.ts";
import type { CompareSnapshotResult, PrFileDiffResult, RefListingResult } from "../src/shared.ts";

const LISTING: RefListingResult = {
  ok: true,
  listing: {
    repo: "dsh-plugins",
    head: { kind: "branch", ref: "feature", shortHash: "abc1234" },
    refs: [
      { name: "feature", kind: "branch", isDefault: false },
      { name: "main", kind: "branch", isDefault: true },
    ],
    defaultBase: "main",
  },
};

const COMPARE: CompareSnapshotResult = {
  ok: true,
  compare: {
    reading: {
      base: { input: "main", hash: "a".repeat(40), short: "aaaaaaa" },
      head: { input: "feature", hash: "b".repeat(40), short: "bbbbbbb" },
      mergeBase: { hash: "c".repeat(40), short: "ccccccc" },
      ahead: 2,
      behind: 1,
    },
    commits: { commits: [], truncated: false },
    files: { files: [], summary: { files: 0, additions: 0, deletions: 0 } },
  },
};

const DIFF: PrFileDiffResult = {
  ok: true,
  diff: { kind: "text", path: "a.ts", hunks: [], truncated: false },
};

/** One recorded request. */
interface Call {
  readonly url: string;
}

/**
 * A fetch that answers with one body and records the url it was asked for.
 * @param body - the JSON body to answer with.
 * @param status - the HTTP status.
 * @returns the fetch and the recorded calls.
 */
function fakeFetch(body: unknown, status = 200) {
  const calls: Call[] = [];
  const impl = (async (url: string) => {
    calls.push({ url });
    return {
      ok: status >= 200 && status < 300,
      status,
      async json() {
        return body;
      },
    };
  }) as unknown as typeof fetch;
  return { impl, calls };
}

/** The query of a recorded url, decoded. */
function queryOf(url: string): Record<string, string> {
  return Object.fromEntries(new URL(url, "http://pr-explorer.local").searchParams.entries());
}

describe("the refs request", () => {
  it("asks the package's own relative refs route", async () => {
    const { impl, calls } = fakeFetch(LISTING);
    const runtime = createHttpRuntime(impl);

    await runtime.loadRefs("session-1");

    expect(calls).toHaveLength(1);
    // Same-origin relative: the GUI port changes on every host boot, so an
    // absolute URL composed here would be stale by the time it was read.
    expect(calls[0]?.url.startsWith(`${ROUTE_PREFIX}/refs?`)).toBe(true);
    expect(calls[0]?.url.startsWith("/")).toBe(true);
  });

  it("sends only the session id", async () => {
    const { impl, calls } = fakeFetch(LISTING);
    const runtime = createHttpRuntime(impl);

    await runtime.loadRefs("session-1");

    expect(queryOf(calls[0]?.url ?? "")).toEqual({ sessionId: "session-1" });
  });

  it("escapes a session id that needs it", async () => {
    const { impl, calls } = fakeFetch(LISTING);
    const runtime = createHttpRuntime(impl);

    await runtime.loadRefs("a b&c");

    expect(queryOf(calls[0]?.url ?? "").sessionId).toBe("a b&c");
  });

  it("returns a successful listing unchanged", async () => {
    const { impl } = fakeFetch(LISTING);
    const runtime = createHttpRuntime(impl);

    await expect(runtime.loadRefs("session-1")).resolves.toEqual(LISTING);
  });

  it("returns a domain failure unchanged", async () => {
    // A 200 with `ok: false` is a state the client renders, not a transport
    // error; translating it here would put the copy in two places.
    const failure: RefListingResult = { ok: false, error: { code: "not-a-repo", message: "not a repository" } };
    const { impl } = fakeFetch(failure);
    const runtime = createHttpRuntime(impl);

    await expect(runtime.loadRefs("session-1")).resolves.toEqual(failure);
  });

  it("throws on a non-2xx answer", async () => {
    const { impl } = fakeFetch({ ok: false }, 500);
    const runtime = createHttpRuntime(impl);

    await expect(runtime.loadRefs("session-1")).rejects.toThrow(/500/u);
  });

  it("throws when the body is not JSON", async () => {
    const impl = (async () => ({
      ok: true,
      status: 200,
      async json(): Promise<unknown> {
        throw new SyntaxError("Unexpected token < in JSON");
      },
    })) as unknown as typeof fetch;
    const runtime = createHttpRuntime(impl);

    await expect(runtime.loadRefs("session-1")).rejects.toThrow(/JSON/u);
  });
});

describe("the compare request", () => {
  it("sends the session and both refs", async () => {
    const { impl, calls } = fakeFetch(COMPARE);
    const runtime = createHttpRuntime(impl);

    await runtime.loadCompare("session-1", "main", "feature");

    expect(calls[0]?.url.startsWith(`${ROUTE_PREFIX}/compare?`)).toBe(true);
    expect(queryOf(calls[0]?.url ?? "")).toEqual({ sessionId: "session-1", base: "main", head: "feature" });
  });

  it("escapes a ref name that needs it", async () => {
    const { impl, calls } = fakeFetch(COMPARE);
    const runtime = createHttpRuntime(impl);

    await runtime.loadCompare("session-1", "origin/发布", "feature");

    // The decoded query is what the host sees; the raw url must not carry a bare
    // `&` or the ref would be cut in half on the way.
    expect(queryOf(calls[0]?.url ?? "").base).toBe("origin/发布");
    expect(calls[0]?.url).not.toContain("发布");
  });

  it("returns a successful comparison unchanged", async () => {
    const { impl } = fakeFetch(COMPARE);
    const runtime = createHttpRuntime(impl);

    await expect(runtime.loadCompare("session-1", "main", "feature")).resolves.toEqual(COMPARE);
  });

  it("returns an invalid-ref failure unchanged", async () => {
    const failure: CompareSnapshotResult = { ok: false, error: { code: "invalid-ref", message: "nope" } };
    const { impl } = fakeFetch(failure);
    const runtime = createHttpRuntime(impl);

    await expect(runtime.loadCompare("session-1", "nope", "feature")).resolves.toEqual(failure);
  });

  it("throws on a non-2xx answer", async () => {
    const { impl } = fakeFetch({ ok: false }, 404);
    const runtime = createHttpRuntime(impl);

    await expect(runtime.loadCompare("session-1", "main", "feature")).rejects.toThrow(/404/u);
  });
});

describe("the diff request", () => {
  it("sends the session, both refs and the path", async () => {
    const { impl, calls } = fakeFetch(DIFF);
    const runtime = createHttpRuntime(impl);

    await runtime.loadDiff("session-1", "main", "feature", "src/a.ts");

    expect(calls[0]?.url.startsWith(`${ROUTE_PREFIX}/diff?`)).toBe(true);
    expect(queryOf(calls[0]?.url ?? "")).toEqual({
      sessionId: "session-1",
      base: "main",
      head: "feature",
      path: "src/a.ts",
    });
  });

  it("encodes a path that needs it", async () => {
    const { impl, calls } = fakeFetch(DIFF);
    const runtime = createHttpRuntime(impl);

    await runtime.loadDiff("session-1", "main", "feature", "文档/评审 & 备注.md");

    expect(queryOf(calls[0]?.url ?? "").path).toBe("文档/评审 & 备注.md");
    expect(calls[0]?.url).not.toContain("评审 &");
  });

  it("returns a successful diff unchanged", async () => {
    const { impl } = fakeFetch(DIFF);
    const runtime = createHttpRuntime(impl);

    await expect(runtime.loadDiff("session-1", "main", "feature", "a.ts")).resolves.toEqual(DIFF);
  });

  it("returns a too-large failure unchanged", async () => {
    const failure: PrFileDiffResult = { ok: false, error: { code: "too-large", message: "big" } };
    const { impl } = fakeFetch(failure);
    const runtime = createHttpRuntime(impl);

    await expect(runtime.loadDiff("session-1", "main", "feature", "big.ts")).resolves.toEqual(failure);
  });

  it("throws when the request itself rejects", async () => {
    const impl = (async () => {
      throw new TypeError("Failed to fetch");
    }) as unknown as typeof fetch;
    const runtime = createHttpRuntime(impl);

    await expect(runtime.loadDiff("session-1", "main", "feature", "a.ts")).rejects.toThrow(/Failed to fetch/u);
  });
});
