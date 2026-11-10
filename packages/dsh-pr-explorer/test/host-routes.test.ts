/**
 * The three `/pr-explorer/api` routes as a pure request/response function.
 *
 * Every case here goes through `handlePrRequest` with a plain `{method, url}` and
 * asserts the status and body, because that is the whole wire contract: the
 * prefix registration below it is a transport adapter, and a status code only
 * reachable through a live server is a status code nobody tests.
 *
 * The dependency stubs record what they were asked for, so "the route passed the
 * session's workspace and the parsed range down" is asserted rather than assumed.
 */
import { describe, expect, it } from "vitest";

import {
  handlePrRequest,
  registerPrRoutes,
  safeRelativePath,
  type PrRouteDeps,
  type WebServerFace,
} from "../src/host/routes.ts";
import { ROUTE_PREFIX } from "../src/shared.ts";
import type {
  CompareSnapshotResult,
  PrFileDiffResult,
  RefListingResult,
} from "../src/shared.ts";

const LISTING: RefListingResult = {
  ok: true,
  listing: {
    repo: "dsh-plugins",
    head: { kind: "branch", ref: "main", shortHash: "abc1234" },
    refs: [{ name: "main", kind: "branch", isDefault: true }],
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

/** One recorded call into the data layer. */
interface Call {
  readonly kind: "refs" | "compare" | "diff";
  readonly workspace: string;
  readonly range?: { readonly base: string; readonly head: string; readonly path?: string };
}

function deps(overrides: Partial<PrRouteDeps> = {}) {
  const calls: Call[] = [];
  const base: PrRouteDeps = {
    async resolveWorkspaceRoot(sessionId) {
      return sessionId === "known" ? "/ws/project" : undefined;
    },
    async loadRefs(workspace) {
      calls.push({ kind: "refs", workspace });
      return LISTING;
    },
    async loadCompare(workspace, range) {
      calls.push({ kind: "compare", workspace, range });
      return COMPARE;
    },
    async loadDiff(workspace, range) {
      calls.push({ kind: "diff", workspace, range });
      return DIFF;
    },
    ...overrides,
  };
  return { deps: base, calls };
}

/** One request against the given deps. */
function get(url: string, method = "GET") {
  return { method, url };
}

describe("the refs route", () => {
  it("answers with the listing the data layer produced", async () => {
    const { deps: d, calls } = deps();

    const response = await handlePrRequest(d, get(`${ROUTE_PREFIX}/refs?sessionId=known`));

    expect(response.status).toBe(200);
    expect(response.body).toEqual(LISTING);
    expect(calls).toEqual([{ kind: "refs", workspace: "/ws/project" }]);
  });

  it("passes a domain failure through with 200", async () => {
    const { deps: d } = deps({
      async loadRefs() {
        return { ok: false, error: { code: "not-a-repo", message: "not a repository" } };
      },
    });

    const response = await handlePrRequest(d, get(`${ROUTE_PREFIX}/refs?sessionId=known`));

    // A directory that is not a repository is a state the client renders, not a
    // broken request: a 4xx would make it treat the answer as its own mistake.
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ ok: false, error: { code: "not-a-repo", message: "not a repository" } });
  });

  it("rejects a missing session id with 400", async () => {
    const { deps: d } = deps();

    const response = await handlePrRequest(d, get(`${ROUTE_PREFIX}/refs`));

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject({ ok: false, error: { code: "bad-request" } });
  });

  it("rejects an empty session id with 400", async () => {
    const { deps: d } = deps();

    const response = await handlePrRequest(d, get(`${ROUTE_PREFIX}/refs?sessionId=`));

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject({ ok: false, error: { code: "bad-request" } });
  });

  it("answers an unknown session with 404 and the no-session code", async () => {
    const { deps: d } = deps();

    const response = await handlePrRequest(d, get(`${ROUTE_PREFIX}/refs?sessionId=unknown`));

    expect(response.status).toBe(404);
    expect(response.body).toMatchObject({ ok: false, error: { code: "no-session" } });
  });
});

describe("the compare route", () => {
  it("answers with the pinned range, its commits and its files", async () => {
    const { deps: d, calls } = deps();

    const response = await handlePrRequest(d, get(`${ROUTE_PREFIX}/compare?sessionId=known&base=main&head=feature`));

    expect(response.status).toBe(200);
    expect(response.body).toEqual(COMPARE);
    expect(calls).toEqual([
      { kind: "compare", workspace: "/ws/project", range: { base: "main", head: "feature" } },
    ]);
  });

  it("rejects a missing base with 400", async () => {
    const { deps: d } = deps();

    const response = await handlePrRequest(d, get(`${ROUTE_PREFIX}/compare?sessionId=known&head=feature`));

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject({ ok: false, error: { code: "bad-request" } });
  });

  it("rejects a missing head with 400", async () => {
    const { deps: d } = deps();

    const response = await handlePrRequest(d, get(`${ROUTE_PREFIX}/compare?sessionId=known&base=main`));

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject({ ok: false, error: { code: "bad-request" } });
  });

  it("rejects an empty base with 400", async () => {
    const { deps: d } = deps();

    const response = await handlePrRequest(d, get(`${ROUTE_PREFIX}/compare?sessionId=known&base=&head=feature`));

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject({ ok: false, error: { code: "bad-request" } });
  });

  it("passes an invalid-ref failure through with 200", async () => {
    const { deps: d } = deps({
      async loadCompare() {
        return { ok: false, error: { code: "invalid-ref", message: "nope does not name a commit" } };
      },
    });

    const response = await handlePrRequest(d, get(`${ROUTE_PREFIX}/compare?sessionId=known&base=nope&head=feature`));

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({ ok: false, error: { code: "invalid-ref" } });
  });

  it("passes a no-merge-base failure through with 200", async () => {
    const { deps: d } = deps({
      async loadCompare() {
        return { ok: false, error: { code: "no-merge-base", message: "unrelated histories" } };
      },
    });

    const response = await handlePrRequest(d, get(`${ROUTE_PREFIX}/compare?sessionId=known&base=main&head=other`));

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({ ok: false, error: { code: "no-merge-base" } });
  });

  it("takes the first value of a repeated query parameter", async () => {
    const { deps: d, calls } = deps();

    await handlePrRequest(d, get(`${ROUTE_PREFIX}/compare?sessionId=known&base=main&base=other&head=feature`));

    expect(calls[0]?.range).toEqual({ base: "main", head: "feature" });
  });

  it("decodes a URL-encoded ref name", async () => {
    const { deps: d, calls } = deps();

    await handlePrRequest(
      d,
      get(`${ROUTE_PREFIX}/compare?sessionId=known&base=${encodeURIComponent("origin/发布")}&head=feature`),
    );

    expect(calls[0]?.range?.base).toBe("origin/发布");
  });
});

describe("the diff route", () => {
  it("answers one file's detail for the range", async () => {
    const { deps: d, calls } = deps();

    const response = await handlePrRequest(
      d,
      get(`${ROUTE_PREFIX}/diff?sessionId=known&base=main&head=feature&path=a.ts`),
    );

    expect(response.status).toBe(200);
    expect(response.body).toEqual(DIFF);
    expect(calls).toEqual([
      { kind: "diff", workspace: "/ws/project", range: { base: "main", head: "feature", path: "a.ts" } },
    ]);
  });

  it("decodes a URL-encoded path with non-ASCII characters", async () => {
    const { deps: d, calls } = deps();

    await handlePrRequest(
      d,
      get(`${ROUTE_PREFIX}/diff?sessionId=known&base=main&head=feature&path=${encodeURIComponent("文档/评审.md")}`),
    );

    expect(calls[0]?.range?.path).toBe("文档/评审.md");
  });

  it("rejects a missing path with 400", async () => {
    const { deps: d } = deps();

    const response = await handlePrRequest(d, get(`${ROUTE_PREFIX}/diff?sessionId=known&base=main&head=feature`));

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject({ ok: false, error: { code: "bad-request" } });
  });

  it("rejects an empty path with 400", async () => {
    const { deps: d } = deps();

    const response = await handlePrRequest(
      d,
      get(`${ROUTE_PREFIX}/diff?sessionId=known&base=main&head=feature&path=`),
    );

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject({ ok: false, error: { code: "bad-request" } });
  });

  it("rejects a path that climbs out of the workspace", async () => {
    const { deps: d, calls } = deps();

    const response = await handlePrRequest(
      d,
      get(`${ROUTE_PREFIX}/diff?sessionId=known&base=main&head=feature&path=../../etc/passwd`),
    );

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject({ ok: false, error: { code: "bad-request" } });
    // Refused before the workspace is even resolved: no workspace makes an
    // escaping path acceptable.
    expect(calls).toHaveLength(0);
  });

  it("rejects an absolute path", async () => {
    const { deps: d } = deps();

    const response = await handlePrRequest(
      d,
      get(`${ROUTE_PREFIX}/diff?sessionId=known&base=main&head=feature&path=${encodeURIComponent("/etc/passwd")}`),
    );

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject({ ok: false, error: { code: "bad-request" } });
  });

  it("rejects a path that escapes after normalization", async () => {
    const { deps: d } = deps();

    const response = await handlePrRequest(
      d,
      get(`${ROUTE_PREFIX}/diff?sessionId=known&base=main&head=feature&path=a/../../b`),
    );

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject({ ok: false, error: { code: "bad-request" } });
  });

  it("rejects a path containing a NUL byte", async () => {
    const { deps: d } = deps();

    const response = await handlePrRequest(
      d,
      get(`${ROUTE_PREFIX}/diff?sessionId=known&base=main&head=feature&path=a%00b`),
    );

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject({ ok: false, error: { code: "bad-request" } });
  });

  it("passes a too-large failure through with 200", async () => {
    const { deps: d } = deps({
      async loadDiff() {
        return { ok: false, error: { code: "too-large", message: "big.ts is 9000 lines" } };
      },
    });

    const response = await handlePrRequest(
      d,
      get(`${ROUTE_PREFIX}/diff?sessionId=known&base=main&head=feature&path=big.ts`),
    );

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({ ok: false, error: { code: "too-large" } });
  });

  it("answers an unknown session with 404", async () => {
    const { deps: d } = deps();

    const response = await handlePrRequest(
      d,
      get(`${ROUTE_PREFIX}/diff?sessionId=unknown&base=main&head=feature&path=a.ts`),
    );

    expect(response.status).toBe(404);
    expect(response.body).toMatchObject({ ok: false, error: { code: "no-session" } });
  });
});

describe("route dispatch", () => {
  it("rejects a non-GET method with 405", async () => {
    const { deps: d } = deps();

    for (const method of ["POST", "PUT", "DELETE", "PATCH"]) {
      const response = await handlePrRequest(d, get(`${ROUTE_PREFIX}/refs?sessionId=known`, method));
      expect(response.status).toBe(405);
      expect(response.body).toMatchObject({ ok: false, error: { code: "bad-request" } });
    }
  });

  it("answers 404 for a path under the prefix that is not a route", async () => {
    const { deps: d } = deps();

    const response = await handlePrRequest(d, get(`${ROUTE_PREFIX}/nonsense?sessionId=known`));

    expect(response.status).toBe(404);
    expect(response.body).toMatchObject({ ok: false, error: { code: "bad-request" } });
  });

  it("answers 500 with the unreadable code when a dependency throws", async () => {
    const { deps: d } = deps({
      async loadRefs() {
        throw new Error("disk on fire");
      },
    });

    const response = await handlePrRequest(d, get(`${ROUTE_PREFIX}/refs?sessionId=known`));

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

    const response = await handlePrRequest(d, get(`${ROUTE_PREFIX}/refs?sessionId=known`));

    expect(response.status).toBe(500);
    expect(response.body).toMatchObject({ ok: false, error: { code: "unreadable" } });
  });

  it("does not resolve a workspace for a request that fails validation", async () => {
    let resolved = 0;
    const { deps: d } = deps({
      async resolveWorkspaceRoot() {
        resolved += 1;
        return "/ws/project";
      },
    });

    const response = await handlePrRequest(
      d,
      get(`${ROUTE_PREFIX}/diff?sessionId=known&base=main&head=feature&path=../../etc/passwd`),
    );

    expect(response.body).toMatchObject({ ok: false, error: { code: "bad-request" } });
    expect(resolved).toBe(0);
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

    registerPrRoutes(webServer, d);

    expect(registrations).toHaveLength(1);
    expect(registrations[0]?.kind).toBe("prefix");
    expect(registrations[0]?.path).toBe(ROUTE_PREFIX);
    expect(typeof registrations[0]?.handler).toBe("function");
  });

  it("returns the server's own disposer", () => {
    const { webServer, isDisposed } = fakeServer();
    const { deps: d } = deps();

    const unregister = registerPrRoutes(webServer, d);
    unregister();

    expect(isDisposed()).toBe(true);
  });

  it("writes JSON with the no-store headers", async () => {
    const { webServer, registrations } = fakeServer();
    const { deps: d } = deps();
    registerPrRoutes(webServer, d);
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

    await handler({ method: "GET", url: `${ROUTE_PREFIX}/refs?sessionId=known` }, res);

    expect(written.status).toBe(200);
    expect(written.headers?.["content-type"]).toBe("application/json; charset=utf-8");
    expect(written.headers?.["cache-control"]).toBe("no-store");
    expect(JSON.parse(written.text ?? "{}")).toMatchObject({ ok: true });
  });

  it("normalizes a missing method and url instead of throwing", async () => {
    const { webServer, registrations } = fakeServer();
    const { deps: d } = deps();
    registerPrRoutes(webServer, d);
    const handler = registrations[0]?.handler as (req: unknown, res: unknown) => Promise<void>;

    const written: { status?: number } = {};
    await handler({}, { writeHead: (status: number) => void (written.status = status), end: () => {} });

    // No method and no url is a GET on "/", which is not a route under the
    // prefix; the adapter must answer rather than crash the server.
    expect(written.status).toBe(404);
  });
});
