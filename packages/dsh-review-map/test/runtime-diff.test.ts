/**
 * The diff half of the runtime: one more route, the same two failure modes.
 *
 * The path is the interesting parameter here. It is repository-relative and can
 * hold spaces, `#`, `&` and non-ASCII names, so the assertion is on the decoded
 * query rather than on the URL string: a runtime that forgot to encode would
 * still look right until a file name had an ampersand in it.
 */
import { describe, expect, it } from "vitest";

import { createHttpRuntime } from "../src/client/runtime.ts";
import { ROUTE_PREFIX } from "../src/shared.ts";
import type { FileDiffResult } from "../src/shared.ts";

const DIFF: FileDiffResult = {
  ok: true,
  diff: {
    kind: "text",
    path: "src/a.ts",
    hunks: [{ oldStart: 1, oldLines: 1, newStart: 1, newLines: 1, lines: [] }],
    truncated: false,
  },
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
  return Object.fromEntries(new URL(url, "http://review-map.local").searchParams.entries());
}

describe("the diff request", () => {
  it("asks the package's own relative diff route", async () => {
    const { impl, calls } = fakeFetch(DIFF);
    const runtime = createHttpRuntime(impl);

    await runtime.loadDiff("session-1", { kind: "worktree" }, "src/a.ts");

    expect(calls).toHaveLength(1);
    expect(calls[0]?.url.startsWith(`${ROUTE_PREFIX}/diff?`)).toBe(true);
    expect(calls[0]?.url.startsWith("/")).toBe(true);
  });

  it("sends the session, the path and the worktree scope", async () => {
    const { impl, calls } = fakeFetch(DIFF);
    const runtime = createHttpRuntime(impl);

    await runtime.loadDiff("session-1", { kind: "worktree" }, "src/a.ts");

    expect(queryOf(calls[0]?.url ?? "")).toEqual({
      sessionId: "session-1",
      path: "src/a.ts",
      scope: "worktree",
    });
  });

  it("sends the base ref for a branch review", async () => {
    const { impl, calls } = fakeFetch(DIFF);
    const runtime = createHttpRuntime(impl);

    await runtime.loadDiff("session-1", { kind: "branch", baseRef: "origin/main" }, "src/a.ts");

    expect(queryOf(calls[0]?.url ?? "")).toEqual({
      sessionId: "session-1",
      path: "src/a.ts",
      scope: "branch",
      base: "origin/main",
    });
  });

  it("omits the base when the branch review resolves its own", async () => {
    const { impl, calls } = fakeFetch(DIFF);
    const runtime = createHttpRuntime(impl);

    await runtime.loadDiff("session-1", { kind: "branch" }, "src/a.ts");

    expect(queryOf(calls[0]?.url ?? "")).toEqual({ sessionId: "session-1", path: "src/a.ts", scope: "branch" });
  });

  it("encodes a path that needs it", async () => {
    const { impl, calls } = fakeFetch(DIFF);
    const runtime = createHttpRuntime(impl);

    await runtime.loadDiff("session-1", { kind: "worktree" }, "文档/评审 & 备注.md");

    // The decoded query is what the host sees; the raw url must not carry a bare
    // `&` or the path would be cut in half on the way.
    expect(queryOf(calls[0]?.url ?? "").path).toBe("文档/评审 & 备注.md");
    expect(calls[0]?.url).not.toContain("评审 &");
  });

  it("returns a successful diff unchanged", async () => {
    const { impl } = fakeFetch(DIFF);
    const runtime = createHttpRuntime(impl);

    await expect(runtime.loadDiff("session-1", { kind: "worktree" }, "src/a.ts")).resolves.toEqual(DIFF);
  });

  it("returns a domain failure unchanged", async () => {
    const failure: FileDiffResult = { ok: false, error: { code: "conflicted", message: "a.ts is in conflict" } };
    const { impl } = fakeFetch(failure);
    const runtime = createHttpRuntime(impl);

    await expect(runtime.loadDiff("session-1", { kind: "worktree" }, "a.ts")).resolves.toEqual(failure);
  });

  it("throws on a non-2xx answer", async () => {
    const { impl } = fakeFetch({ ok: false }, 500);
    const runtime = createHttpRuntime(impl);

    await expect(runtime.loadDiff("session-1", { kind: "worktree" }, "a.ts")).rejects.toThrow(/500/u);
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

    await expect(runtime.loadDiff("session-1", { kind: "worktree" }, "a.ts")).rejects.toThrow(/JSON/u);
  });
});
