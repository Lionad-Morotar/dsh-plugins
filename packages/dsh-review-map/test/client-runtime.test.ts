/**
 * The HTTP runtime: one route, one shape, and the two ways it can fail.
 *
 * The fetch is injected, so these cases assert the exact URL the runtime builds
 * (path and query), what it does with each answer shape, and that a broken host
 * throws instead of returning something that looks like an empty workspace.
 */
import { describe, expect, it } from "vitest";

import { createHttpRuntime } from "../src/client/runtime.ts";
import { ROUTE_PREFIX } from "../src/shared.ts";
import type { ReviewIndexResult, ReviewSnapshotResult } from "../src/shared.ts";

const SNAPSHOT: ReviewSnapshotResult = {
  ok: true,
  snapshot: {
    repo: "dsh-plugins",
    head: { kind: "branch", ref: "main", shortHash: "abc1234" },
    scope: "worktree",
    baseRef: null,
    uncommitted: 2,
    files: [],
    summary: { files: 0, additions: 0, deletions: 0 },
  },
};

/** One recorded request. */
interface Call {
  readonly url: string;
  readonly init: RequestInit | undefined;
}

/**
 * A fetch that answers with one body and records what it was asked for.
 * @param body - the JSON body to answer with.
 * @param status - the HTTP status.
 * @returns the fetch and the recorded calls.
 */
function fakeFetch(body: unknown, status = 200) {
  const calls: Call[] = [];
  const impl = (async (url: string, init?: RequestInit) => {
    calls.push({ url, init });
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

/** The query of a recorded url, as a plain record. */
function queryOf(url: string): Record<string, string> {
  const parsed = new URL(url, "http://review-map.local");
  return Object.fromEntries(parsed.searchParams.entries());
}

describe("the state request", () => {
  it("asks the package's own relative route", async () => {
    const { impl, calls } = fakeFetch(SNAPSHOT);
    const runtime = createHttpRuntime(impl);

    await runtime.loadSnapshot("session-1", { kind: "worktree" });

    expect(calls).toHaveLength(1);
    // Same-origin relative: the GUI port changes on every host boot, so an
    // absolute URL composed here would be stale by the time it was read.
    expect(calls[0]?.url.startsWith(`${ROUTE_PREFIX}/state?`)).toBe(true);
    expect(calls[0]?.url.startsWith("/")).toBe(true);
  });

  it("sends the session and the worktree scope", async () => {
    const { impl, calls } = fakeFetch(SNAPSHOT);
    const runtime = createHttpRuntime(impl);

    await runtime.loadSnapshot("session-1", { kind: "worktree" });

    expect(queryOf(calls[0]?.url ?? "")).toEqual({ sessionId: "session-1", scope: "worktree" });
  });

  it("sends the base ref for a branch review", async () => {
    const { impl, calls } = fakeFetch(SNAPSHOT);
    const runtime = createHttpRuntime(impl);

    await runtime.loadSnapshot("session-1", { kind: "branch", baseRef: "origin/main" });

    expect(queryOf(calls[0]?.url ?? "")).toEqual({
      sessionId: "session-1",
      scope: "branch",
      base: "origin/main",
    });
  });

  it("omits the base when the branch review resolves its own", async () => {
    const { impl, calls } = fakeFetch(SNAPSHOT);
    const runtime = createHttpRuntime(impl);

    await runtime.loadSnapshot("session-1", { kind: "branch" });

    expect(queryOf(calls[0]?.url ?? "")).toEqual({ sessionId: "session-1", scope: "branch" });
  });

  it("escapes a session id that needs it", async () => {
    const { impl, calls } = fakeFetch(SNAPSHOT);
    const runtime = createHttpRuntime(impl);

    await runtime.loadSnapshot("a b&c", { kind: "worktree" });

    expect(queryOf(calls[0]?.url ?? "").sessionId).toBe("a b&c");
  });

  it("returns a successful snapshot unchanged", async () => {
    const { impl } = fakeFetch(SNAPSHOT);
    const runtime = createHttpRuntime(impl);

    await expect(runtime.loadSnapshot("session-1", { kind: "worktree" })).resolves.toEqual(SNAPSHOT);
  });

  it("returns a domain failure unchanged", async () => {
    // A 200 with `ok: false` is a state the client renders, not a transport
    // error; translating it here would put the copy in two places.
    const failure: ReviewSnapshotResult = { ok: false, error: { code: "not-a-repo", message: "not a repository" } };
    const { impl } = fakeFetch(failure);
    const runtime = createHttpRuntime(impl);

    await expect(runtime.loadSnapshot("session-1", { kind: "worktree" })).resolves.toEqual(failure);
  });

  it("throws on a non-2xx answer", async () => {
    const { impl } = fakeFetch({ ok: false }, 500);
    const runtime = createHttpRuntime(impl);

    // Never a fabricated empty snapshot: a broken host would then look like a
    // workspace with no changes.
    await expect(runtime.loadSnapshot("session-1", { kind: "worktree" })).rejects.toThrow(/500/u);
  });

  it("throws on a 404 answer", async () => {
    const { impl } = fakeFetch({ ok: false }, 404);
    const runtime = createHttpRuntime(impl);

    await expect(runtime.loadSnapshot("session-1", { kind: "worktree" })).rejects.toThrow(/404/u);
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

    await expect(runtime.loadSnapshot("session-1", { kind: "worktree" })).rejects.toThrow(/JSON/u);
  });

  it("throws when the request itself rejects", async () => {
    const impl = (async () => {
      throw new TypeError("Failed to fetch");
    }) as unknown as typeof fetch;
    const runtime = createHttpRuntime(impl);

    await expect(runtime.loadSnapshot("session-1", { kind: "worktree" })).rejects.toThrow(/Failed to fetch/u);
  });

  it("sends no body and no method override", async () => {
    const { impl, calls } = fakeFetch(SNAPSHOT);
    const runtime = createHttpRuntime(impl);

    await runtime.loadSnapshot("session-1", { kind: "worktree" });

    // A GET with no init at all: the route reads the query and nothing else.
    expect(calls[0]?.init).toBeUndefined();
  });
});

describe("the index request", () => {
  /** A minimal successful index answer. */
  const INDEX: ReviewIndexResult = {
    ok: true,
    index: {
      files: [],
      dirs: [],
      changed: [],
      edges: [],
      imports: { newImports: 0, droppedImports: 0 },
      unresolved: { count: 0, files: [] },
      indexed: { files: 0, parsed: 0, complete: true, note: null },
      snapshotId: "worktree:HEAD..HEAD",
    },
  };

  it("asks the index route with the session and the range", async () => {
    const { impl, calls } = fakeFetch(INDEX);
    const runtime = createHttpRuntime(impl);

    await runtime.loadIndex?.("session-1", { kind: "worktree" });

    const url = calls[0]?.url ?? "";
    expect(url.startsWith(`${ROUTE_PREFIX}/index?`)).toBe(true);
    expect(queryOf(url)).toEqual({ sessionId: "session-1", scope: "worktree" });
  });

  it("sends the base ref for a branch review", async () => {
    const { impl, calls } = fakeFetch(INDEX);
    const runtime = createHttpRuntime(impl);

    await runtime.loadIndex?.("session-1", { kind: "branch", baseRef: "origin/main" });

    expect(queryOf(calls[0]?.url ?? "")).toEqual({
      sessionId: "session-1",
      scope: "branch",
      base: "origin/main",
    });
  });

  it("omits the base when a branch review names none", async () => {
    const { impl, calls } = fakeFetch(INDEX);
    const runtime = createHttpRuntime(impl);

    await runtime.loadIndex?.("session-1", { kind: "branch" });

    // An empty `base=` would read as "resolve it yourself" on the host, which is
    // a different request than the one this caller made.
    expect(queryOf(calls[0]?.url ?? "")).toEqual({ sessionId: "session-1", scope: "branch" });
  });

  it("passes a domain failure through instead of throwing", async () => {
    const failure: ReviewIndexResult = { ok: false, error: { code: "not-a-repo", message: "nope" } };
    const { impl } = fakeFetch(failure);
    const runtime = createHttpRuntime(impl);

    const result = await runtime.loadIndex?.("session-1", { kind: "worktree" });

    expect(result).toEqual(failure);
  });

  it("throws on a non-2xx answer", async () => {
    const { impl } = fakeFetch({ ok: false }, 500);
    const runtime = createHttpRuntime(impl);

    await expect(runtime.loadIndex?.("session-1", { kind: "worktree" })).rejects.toThrow(/500/u);
  });
});
