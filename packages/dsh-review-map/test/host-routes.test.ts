/**
 * The two `/review-map/api` routes as a pure request/response function.
 *
 * Every case here goes through `handleReviewRequest` with a plain `{method, url}`
 * and asserts the status and body, because that is the whole wire contract: the
 * prefix registration below it is a transport adapter, and a status code that is
 * only reachable through a live server is a status code nobody tests.
 *
 * The dependency stubs record what they were asked for, so "the route passed the
 * session's workspace and the parsed scope down" is asserted rather than assumed.
 */
import { describe, expect, it } from "vitest";

import {
  handleReviewRequest,
  registerReviewRoutes,
  safeRelativePath,
  type ReviewRouteDeps,
  type WebServerFace,
} from "../src/host/routes.ts";
import { ROUTE_PREFIX } from "../src/shared.ts";
import type { FileDiffResult, ReviewIndexResult, ReviewScope, ReviewSnapshotResult } from "../src/shared.ts";

const SNAPSHOT_OK: ReviewSnapshotResult = {
  ok: true,
  snapshot: {
    repo: "dsh-plugins",
    head: { kind: "branch", ref: "main", shortHash: "abc1234" },
    scope: "worktree",
    baseRef: null,
    uncommitted: 1,
    files: [],
    summary: { files: 0, additions: 0, deletions: 0 },
  },
};

const DIFF_OK: FileDiffResult = {
  ok: true,
  diff: { kind: "text", path: "a.txt", hunks: [], truncated: false },
};

const INDEX_OK: ReviewIndexResult = {
  ok: true,
  index: {
    files: [{ path: "a.txt", lines: 1, binary: false, deleted: false }],
    dirs: [{ path: "", lines: 1, files: 1, changed: 1, additions: 1, deletions: 0 }],
    changed: [{ path: "a.txt", status: "modified", additions: 1, deletions: 0, binary: false, hunks: [] }],
    edges: [],
    imports: { newImports: 0, droppedImports: 0 },
    unresolved: { count: 0, files: [] },
    indexed: { files: 1, parsed: 0, complete: true, note: null },
    snapshotId: "worktree:HEAD..HEAD",
  },
};

/** One recorded call into the data layer. */
interface Call {
  readonly kind: "snapshot" | "diff" | "index";
  readonly workspace: string;
  readonly scope: ReviewScope;
  readonly path?: string;
}

function deps(overrides: Partial<ReviewRouteDeps> = {}) {
  const calls: Call[] = [];
  const base: ReviewRouteDeps = {
    async resolveWorkspaceRoot(sessionId) {
      return sessionId === "known" ? "/ws/project" : undefined;
    },
    async loadSnapshot(workspace, scope) {
      calls.push({ kind: "snapshot", workspace, scope });
      return SNAPSHOT_OK;
    },
    async loadDiff(workspace, scope, path) {
      calls.push({ kind: "diff", workspace, scope, path });
      return DIFF_OK;
    },
    async loadIndex(workspace, scope) {
      calls.push({ kind: "index", workspace, scope });
      return INDEX_OK;
    },
    ...overrides,
  };
  return { deps: base, calls };
}

/** One request against the given deps. */
function get(url: string, method = "GET") {
  return { method, url };
}

describe("the state route", () => {
  it("answers a worktree review with the snapshot", async () => {
    const { deps: d, calls } = deps();

    const response = await handleReviewRequest(d, get(`${ROUTE_PREFIX}/state?sessionId=known`));

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ ok: true, snapshot: SNAPSHOT_OK.ok ? SNAPSHOT_OK.snapshot : undefined });
    expect(calls).toEqual([{ kind: "snapshot", workspace: "/ws/project", scope: { kind: "worktree" } }]);
  });

  it("defaults the scope to worktree when the query omits it", async () => {
    const { deps: d, calls } = deps();

    await handleReviewRequest(d, get(`${ROUTE_PREFIX}/state?sessionId=known&scope=`));

    expect(calls[0]?.scope).toEqual({ kind: "worktree" });
  });

  it("passes an explicit base ref through to the branch scope", async () => {
    const { deps: d, calls } = deps();

    const response = await handleReviewRequest(d, get(`${ROUTE_PREFIX}/state?sessionId=known&scope=branch&base=origin/main`));

    expect(response.status).toBe(200);
    expect(calls[0]?.scope).toEqual({ kind: "branch", baseRef: "origin/main" });
  });

  it("resolves the baseline when a branch review names no base", async () => {
    const { deps: d, calls } = deps();

    await handleReviewRequest(d, get(`${ROUTE_PREFIX}/state?sessionId=known&scope=branch`));

    // No baseRef key at all: the data layer resolves it, and an explicit
    // `baseRef: undefined` would be a different request shape.
    expect(calls[0]?.scope).toEqual({ kind: "branch" });
  });

  it("rejects a missing session id with 400", async () => {
    const { deps: d } = deps();

    const response = await handleReviewRequest(d, get(`${ROUTE_PREFIX}/state`));

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject({ ok: false, error: { code: "bad-request" } });
  });

  it("rejects an empty session id with 400", async () => {
    const { deps: d } = deps();

    const response = await handleReviewRequest(d, get(`${ROUTE_PREFIX}/state?sessionId=`));

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject({ ok: false, error: { code: "bad-request" } });
  });

  it("answers an unknown session with 404 and the no-session code", async () => {
    const { deps: d } = deps();

    const response = await handleReviewRequest(d, get(`${ROUTE_PREFIX}/state?sessionId=unknown`));

    expect(response.status).toBe(404);
    expect(response.body).toMatchObject({ ok: false, error: { code: "no-session" } });
  });

  it("rejects an unknown scope with 400", async () => {
    const { deps: d } = deps();

    const response = await handleReviewRequest(d, get(`${ROUTE_PREFIX}/state?sessionId=known&scope=everything`));

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject({ ok: false, error: { code: "bad-request" } });
  });

  it("passes a domain failure through with 200 so the client can render it", async () => {
    const { deps: d } = deps({
      async loadSnapshot() {
        return { ok: false, error: { code: "no-base", message: "no remote default branch" } };
      },
    });

    const response = await handleReviewRequest(d, get(`${ROUTE_PREFIX}/state?sessionId=known&scope=branch`));

    // A repository with no baseline is a normal state, not a transport failure:
    // a 4xx here would make the client treat it as a broken request.
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ ok: false, error: { code: "no-base", message: "no remote default branch" } });
  });

  it("takes the first value of a repeated query parameter", async () => {
    const { deps: d, calls } = deps();

    await handleReviewRequest(d, get(`${ROUTE_PREFIX}/state?sessionId=known&scope=branch&scope=worktree`));

    expect(calls[0]?.scope).toEqual({ kind: "branch" });
  });
});

describe("the diff route", () => {
  it("answers one file's diff", async () => {
    const { deps: d, calls } = deps();

    const response = await handleReviewRequest(d, get(`${ROUTE_PREFIX}/diff?sessionId=known&path=a.txt`));

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ ok: true, diff: DIFF_OK.ok ? DIFF_OK.diff : undefined });
    expect(calls).toEqual([{ kind: "diff", workspace: "/ws/project", scope: { kind: "worktree" }, path: "a.txt" }]);
  });

  it("decodes a URL-encoded path with non-ASCII characters", async () => {
    const { deps: d, calls } = deps();

    await handleReviewRequest(d, get(`${ROUTE_PREFIX}/diff?sessionId=known&path=${encodeURIComponent("文档/评审.md")}`));

    expect(calls[0]?.path).toBe("文档/评审.md");
  });

  it("rejects a missing path with 400", async () => {
    const { deps: d } = deps();

    const response = await handleReviewRequest(d, get(`${ROUTE_PREFIX}/diff?sessionId=known`));

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject({ ok: false, error: { code: "bad-request" } });
  });

  it("rejects an empty path with 400", async () => {
    const { deps: d } = deps();

    const response = await handleReviewRequest(d, get(`${ROUTE_PREFIX}/diff?sessionId=known&path=`));

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject({ ok: false, error: { code: "bad-request" } });
  });

  it("rejects a path that climbs out of the workspace", async () => {
    const { deps: d, calls } = deps();

    const response = await handleReviewRequest(d, get(`${ROUTE_PREFIX}/diff?sessionId=known&path=../../etc/passwd`));

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject({ ok: false, error: { code: "bad-request" } });
    // Refused before the workspace is even resolved: no workspace makes an
    // escaping path acceptable.
    expect(calls).toHaveLength(0);
  });

  it("rejects an absolute path", async () => {
    const { deps: d } = deps();

    const response = await handleReviewRequest(d, get(`${ROUTE_PREFIX}/diff?sessionId=known&path=${encodeURIComponent("/etc/passwd")}`));

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject({ ok: false, error: { code: "bad-request" } });
  });

  it("rejects a path that escapes after normalization", async () => {
    const { deps: d } = deps();

    const response = await handleReviewRequest(d, get(`${ROUTE_PREFIX}/diff?sessionId=known&path=a/../../b`));

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject({ ok: false, error: { code: "bad-request" } });
  });

  it("rejects a path containing a NUL byte", async () => {
    const { deps: d } = deps();

    const response = await handleReviewRequest(d, get(`${ROUTE_PREFIX}/diff?sessionId=known&path=a%00b`));

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject({ ok: false, error: { code: "bad-request" } });
  });

  it("passes a conflicted file through with 200", async () => {
    const { deps: d } = deps({
      async loadDiff() {
        return { ok: false, error: { code: "conflicted", message: "a.txt is in conflict" } };
      },
    });

    const response = await handleReviewRequest(d, get(`${ROUTE_PREFIX}/diff?sessionId=known&path=a.txt`));

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({ ok: false, error: { code: "conflicted" } });
  });

  it("answers an unknown session with 404", async () => {
    const { deps: d } = deps();

    const response = await handleReviewRequest(d, get(`${ROUTE_PREFIX}/diff?sessionId=unknown&path=a.txt`));

    expect(response.status).toBe(404);
    expect(response.body).toMatchObject({ ok: false, error: { code: "no-session" } });
  });
});

describe("the index route", () => {
  it("answers a worktree index for the session's workspace", async () => {
    const { deps: d, calls } = deps();

    const response = await handleReviewRequest(d, get(`${ROUTE_PREFIX}/index?sessionId=known`));

    expect(response.status).toBe(200);
    expect(response.body).toEqual(INDEX_OK);
    expect(calls).toEqual([{ kind: "index", workspace: "/ws/project", scope: { kind: "worktree" } }]);
  });

  it("passes a branch scope and its base through", async () => {
    const { deps: d, calls } = deps();

    await handleReviewRequest(d, get(`${ROUTE_PREFIX}/index?sessionId=known&scope=branch&base=origin/main`));

    expect(calls[0]?.scope).toEqual({ kind: "branch", baseRef: "origin/main" });
  });

  it("rejects a missing session id with 400", async () => {
    const { deps: d, calls } = deps();

    const response = await handleReviewRequest(d, get(`${ROUTE_PREFIX}/index`));

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject({ ok: false, error: { code: "bad-request" } });
    expect(calls).toHaveLength(0);
  });

  it("rejects a bad scope with 400", async () => {
    const { deps: d } = deps();

    const response = await handleReviewRequest(d, get(`${ROUTE_PREFIX}/index?sessionId=known&scope=everything`));

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject({ ok: false, error: { code: "bad-request" } });
  });

  it("answers an unknown session with 404 and the no-session code", async () => {
    const { deps: d } = deps();

    const response = await handleReviewRequest(d, get(`${ROUTE_PREFIX}/index?sessionId=unknown`));

    expect(response.status).toBe(404);
    expect(response.body).toMatchObject({ ok: false, error: { code: "no-session" } });
  });

  it("passes a domain failure through with 200", async () => {
    const { deps: d } = deps({
      async loadIndex() {
        return { ok: false, error: { code: "not-a-repo", message: "/ws/project is not a repository" } };
      },
    });

    const response = await handleReviewRequest(d, get(`${ROUTE_PREFIX}/index?sessionId=known`));

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({ ok: false, error: { code: "not-a-repo" } });
  });

  it("ignores a path parameter, which belongs to the diff route", async () => {
    const { deps: d, calls } = deps();

    await handleReviewRequest(d, get(`${ROUTE_PREFIX}/index?sessionId=known&path=a.txt`));

    expect(calls).toEqual([{ kind: "index", workspace: "/ws/project", scope: { kind: "worktree" } }]);
  });
});

describe("route dispatch", () => {
  it("rejects a non-GET method with 405", async () => {
    const { deps: d } = deps();

    for (const method of ["POST", "PUT", "DELETE", "PATCH"]) {
      const response = await handleReviewRequest(d, get(`${ROUTE_PREFIX}/state?sessionId=known`, method));
      expect(response.status).toBe(405);
      expect(response.body).toMatchObject({ ok: false, error: { code: "bad-request" } });
    }
  });

  it("answers 404 for a path under the prefix that is not a route", async () => {
    const { deps: d } = deps();

    const response = await handleReviewRequest(d, get(`${ROUTE_PREFIX}/nonsense?sessionId=known`));

    expect(response.status).toBe(404);
    expect(response.body).toMatchObject({ ok: false, error: { code: "bad-request" } });
  });

  it("answers 500 with the unreadable code when a dependency throws", async () => {
    const { deps: d } = deps({
      async loadSnapshot() {
        throw new Error("disk on fire");
      },
    });

    const response = await handleReviewRequest(d, get(`${ROUTE_PREFIX}/state?sessionId=known`));

    // A dependency that threw is a host bug; answering keeps the rejection out
    // of the gateway's unhandled path, and the message never reaches the body.
    expect(response.status).toBe(500);
    expect(response.body).toMatchObject({ ok: false, error: { code: "unreadable" } });
    expect(JSON.stringify(response.body)).not.toContain("disk on fire");
  });

  it("answers 500 when the workspace resolver throws", async () => {
    const { deps: d } = deps({
      async resolveWorkspaceRoot() {
        throw new Error("sessions store is gone");
      },
    });

    const response = await handleReviewRequest(d, get(`${ROUTE_PREFIX}/state?sessionId=known`));

    expect(response.status).toBe(500);
    expect(response.body).toMatchObject({ ok: false, error: { code: "unreadable" } });
  });
});

describe("safeRelativePath", () => {
  it("accepts a plain relative path", () => {
    expect(safeRelativePath("src/index.ts")).toBe("src/index.ts");
  });

  it("normalizes a path that stays inside", () => {
    expect(safeRelativePath("src/./deep/../index.ts")).toBe("src/index.ts");
  });

  it("accepts non-ASCII names", () => {
    expect(safeRelativePath("文档/评审.md")).toBe("文档/评审.md");
  });

  it("rejects every shape that escapes or is not a path", () => {
    for (const raw of ["", ".", "..", "../x", "../../etc/passwd", "/etc/passwd", "a/../../b", "a\0b"]) {
      expect(safeRelativePath(raw)).toBeUndefined();
    }
  });

  it("treats a backslash as a separator so both platforms agree", () => {
    expect(safeRelativePath("..\\..\\etc\\passwd")).toBeUndefined();
    expect(safeRelativePath("src\\index.ts")).toBe("src/index.ts");
  });
});

describe("prefix registration", () => {
  function fakeServer() {
    const registrations: { kind: string; path: string; handler: unknown }[] = [];
    let disposed = false;
    const webServer: WebServerFace = {
      register(route) {
        registrations.push({ kind: route.kind, path: route.path, handler: route.handler });
        return () => {
          disposed = true;
        };
      },
    };
    return { webServer, registrations, isDisposed: () => disposed };
  }

  it("registers one prefix at the package's route prefix", () => {
    const { webServer, registrations } = fakeServer();
    const { deps: d } = deps();

    registerReviewRoutes(webServer, d);

    expect(registrations).toHaveLength(1);
    expect(registrations[0]?.kind).toBe("prefix");
    expect(registrations[0]?.path).toBe(ROUTE_PREFIX);
    expect(typeof registrations[0]?.handler).toBe("function");
  });

  it("returns the server's own disposer", () => {
    const { webServer, isDisposed } = fakeServer();
    const { deps: d } = deps();

    const unregister = registerReviewRoutes(webServer, d);
    unregister();

    expect(isDisposed()).toBe(true);
  });

  it("writes JSON with the no-store headers", async () => {
    const { webServer, registrations } = fakeServer();
    const { deps: d } = deps();
    registerReviewRoutes(webServer, d);
    const handler = registrations[0]?.handler as (req: unknown, res: unknown) => Promise<void>;

    const written: { status?: number; headers?: Record<string, unknown>; text?: string } = {};
    const res = {
      writeHead(status: number, headers: Record<string, unknown>) {
        written.status = status;
        written.headers = headers;
      },
      end(text: string) {
        written.text = text;
      },
    };

    await handler({ method: "GET", url: `${ROUTE_PREFIX}/state?sessionId=known` }, res);

    expect(written.status).toBe(200);
    expect(written.headers?.["content-type"]).toBe("application/json; charset=utf-8");
    expect(written.headers?.["cache-control"]).toBe("no-store");
    expect(JSON.parse(written.text ?? "{}")).toMatchObject({ ok: true });
  });

  it("normalizes a missing method and url instead of throwing", async () => {
    const { webServer, registrations } = fakeServer();
    const { deps: d } = deps();
    registerReviewRoutes(webServer, d);
    const handler = registrations[0]?.handler as (req: unknown, res: unknown) => Promise<void>;

    const written: { status?: number } = {};
    await handler({}, { writeHead: (status: number) => void (written.status = status), end: () => {} });

    // No method and no url is a GET on "/", which is not a route under the
    // prefix; the adapter must answer rather than crash the server.
    expect(written.status).toBe(404);
  });
});
