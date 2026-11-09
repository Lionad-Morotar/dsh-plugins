/**
 * The five `/testboard/api` routes, driven through the pure handler.
 *
 * `handleRequest` exists so the wire contract is testable without a live server:
 * the prefix registration is a thin adapter over it. Every case here is a
 * decision the client half will hit — a missing session, a workspace that is not
 * a workspace, a path that escapes it — so the error codes are pinned rather
 * than discovered from a browser.
 */
import { mkdtemp, mkdir, rm, symlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { afterEach, describe, expect, it } from "vitest";

import type { RunScope, TestboardState } from "../src/shared.ts";
import { handleRequest, type TestboardRouteDeps } from "../src/host/routes.ts";
import { readWorkspaceFile, readWorkspaceFileSync } from "../src/index.ts";

const WORKSPACE = "/ws";

/** A source map standing in for one workspace's files. */
const SOURCES: Record<string, string> = {
  "test/a.test.ts": 'it("a", () => {});',
  "packages/alpha/test/b.test.ts": 'it("b", () => {});',
};

interface Harness {
  readonly deps: TestboardRouteDeps;
  readonly calls: string[];
}

function makeDeps(overrides: Partial<TestboardRouteDeps> = {}): Harness {
  const calls: string[] = [];
  const deps: TestboardRouteDeps = {
    resolveWorkspaceRoot: async sessionId => {
      calls.push(`resolve:${sessionId}`);
      return sessionId === "known" ? WORKSPACE : undefined;
    },
    readState: workspace => {
      calls.push(`state:${workspace}`);
      return {};
    },
    startRun: (workspace, scope) => {
      calls.push(`start:${workspace}:${scope.kind}`);
      return { ok: true, runId: "run-1" };
    },
    cancelRun: workspace => {
      calls.push(`cancel:${workspace}`);
      return true;
    },
    readSource: async (workspace, path) => {
      calls.push(`source:${workspace}:${path}`);
      return SOURCES[path];
    },
    ...overrides,
  };
  return { deps, calls };
}

function get(deps: TestboardRouteDeps, url: string) {
  return handleRequest(deps, { method: "GET", url });
}

function post(deps: TestboardRouteDeps, url: string, body: unknown) {
  return handleRequest(deps, { method: "POST", url, body });
}

describe("GET /testboard/api/state", () => {
  it("answers the workspace state for a known session", async () => {
    const { deps } = makeDeps();
    const response = await get(deps, "/testboard/api/state?sessionId=known");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({});
  });

  it("rejects a request with no sessionId", async () => {
    const { deps } = makeDeps();
    const response = await get(deps, "/testboard/api/state");

    expect(response.status).toBe(400);
  });

  it("reports an unknown session as no-session rather than a 404", async () => {
    const { deps } = makeDeps();
    const response = await get(deps, "/testboard/api/state?sessionId=ghost");

    expect(response.status).toBe(200);
    expect((response.body as TestboardState).error).toBe("no-session");
  });

  it("passes through a workspace-level error such as unknown-workspace", async () => {
    const { deps } = makeDeps({ readState: () => ({ error: "unknown-workspace" }) });
    const response = await get(deps, "/testboard/api/state?sessionId=known");

    expect(response.status).toBe(200);
    expect((response.body as TestboardState).error).toBe("unknown-workspace");
  });

  it("awaits a state that the assembly has to stat for", async () => {
    const { deps } = makeDeps({ readState: async () => ({ workspace: WORKSPACE }) });
    const response = await get(deps, "/testboard/api/state?sessionId=known");

    expect(response.body).toEqual({ workspace: WORKSPACE });
  });
});

describe("GET /testboard/api/run", () => {
  it("is the polling entry and answers the same state", async () => {
    const { deps } = makeDeps();
    const response = await get(deps, "/testboard/api/run?sessionId=known");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({});
  });
});

describe("POST /testboard/api/run", () => {
  it("starts a run and returns its id", async () => {
    const { deps, calls } = makeDeps();
    const response = await post(deps, "/testboard/api/run", { sessionId: "known", scope: { kind: "all" } });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ ok: true, runId: "run-1" });
    expect(calls).toContain(`start:${WORKSPACE}:all`);
  });

  it("passes a file scope through", async () => {
    const { deps, calls } = makeDeps();
    await post(deps, "/testboard/api/run", { sessionId: "known", scope: { kind: "file", path: "test/a.test.ts" } });

    expect(calls).toContain(`start:${WORKSPACE}:file`);
  });

  it("rejects a body with no sessionId", async () => {
    const { deps } = makeDeps();
    const response = await post(deps, "/testboard/api/run", { scope: { kind: "all" } });

    expect(response.status).toBe(400);
  });

  it("rejects a malformed scope", async () => {
    const { deps } = makeDeps();
    const response = await post(deps, "/testboard/api/run", { sessionId: "known", scope: { kind: "weird" } });

    expect(response.status).toBe(400);
    expect((response.body as { error: string }).error).toBe("bad-scope");
  });

  it("rejects a file scope whose path escapes the workspace", async () => {
    const { deps } = makeDeps();
    const response = await post(deps, "/testboard/api/run", {
      sessionId: "known",
      scope: { kind: "file", path: "../../etc/passwd" },
    });

    expect(response.status).toBe(400);
    expect((response.body as { error: string }).error).toBe("bad-scope");
  });

  it("reports busy when the workspace already has an active run", async () => {
    const { deps } = makeDeps({ startRun: () => ({ ok: false, error: "busy" }) });
    const response = await post(deps, "/testboard/api/run", { sessionId: "known", scope: { kind: "all" } });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ ok: false, error: "busy" });
  });

  it("reports no-vitest when the workspace has no runner", async () => {
    const { deps } = makeDeps({ startRun: () => ({ ok: false, error: "no-vitest" }) });
    const response = await post(deps, "/testboard/api/run", { sessionId: "known", scope: { kind: "all" } });

    expect((response.body as { error: string }).error).toBe("no-vitest");
  });

  it("reports no-session for an unknown session", async () => {
    const { deps } = makeDeps();
    const response = await post(deps, "/testboard/api/run", { sessionId: "ghost", scope: { kind: "all" } });

    expect((response.body as { error: string }).error).toBe("no-session");
  });

  it("reports no-subprocess when the host has no subprocess service", async () => {
    const { deps } = makeDeps({ startRun: () => ({ ok: false, error: "no-subprocess" }) });
    const response = await post(deps, "/testboard/api/run", { sessionId: "known", scope: { kind: "all" } });

    expect((response.body as { error: string }).error).toBe("no-subprocess");
  });
});

describe("POST /testboard/api/cancel", () => {
  it("cancels the workspace's active run", async () => {
    const { deps, calls } = makeDeps();
    const response = await post(deps, "/testboard/api/cancel", { sessionId: "known" });

    expect(response.body).toEqual({ ok: true });
    expect(calls).toContain(`cancel:${WORKSPACE}`);
  });

  it("answers ok:false when there was nothing to cancel", async () => {
    const { deps } = makeDeps({ cancelRun: () => false });
    const response = await post(deps, "/testboard/api/cancel", { sessionId: "known" });

    expect(response.body).toEqual({ ok: false });
  });

  it("rejects a body with no sessionId", async () => {
    const { deps } = makeDeps();
    const response = await post(deps, "/testboard/api/cancel", {});

    expect(response.status).toBe(400);
  });
});

describe("GET /testboard/api/source", () => {
  it("returns the text of a file inside the workspace", async () => {
    const { deps } = makeDeps();
    const response = await get(deps, "/testboard/api/source?sessionId=known&path=test/a.test.ts");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ text: SOURCES["test/a.test.ts"] });
  });

  it("rejects a path that escapes the workspace", async () => {
    const { deps, calls } = makeDeps();
    const response = await get(deps, "/testboard/api/source?sessionId=known&path=../../etc/passwd");

    expect(response.status).toBe(400);
    expect(calls.some(call => call.startsWith("source:"))).toBe(false);
  });

  it("rejects an absolute path outside the workspace", async () => {
    const { deps } = makeDeps();
    const response = await get(deps, "/testboard/api/source?sessionId=known&path=/etc/passwd");

    expect(response.status).toBe(400);
  });

  it("reports a missing file as an empty body rather than a crash", async () => {
    const { deps } = makeDeps();
    const response = await get(deps, "/testboard/api/source?sessionId=known&path=test/missing.test.ts");

    expect(response.status).toBe(404);
  });

  it("rejects a request with no path", async () => {
    const { deps } = makeDeps();
    const response = await get(deps, "/testboard/api/source?sessionId=known");

    expect(response.status).toBe(400);
  });

  it("refuses a file over the 2MB cap", async () => {
    const { deps } = makeDeps({ readSource: async () => "x".repeat(2 * 1024 * 1024 + 1) });
    const response = await get(deps, "/testboard/api/source?sessionId=known&path=test/a.test.ts");

    expect(response.status).toBe(413);
  });
});

describe("dispatch", () => {
  it("answers 404 for a route nobody registered", async () => {
    const { deps } = makeDeps();
    const response = await get(deps, "/testboard/api/nope?sessionId=known");

    expect(response.status).toBe(404);
  });

  it("answers 405 for a method the route does not take", async () => {
    const { deps } = makeDeps();
    const response = await post(deps, "/testboard/api/state", { sessionId: "known" });

    expect(response.status).toBe(405);
  });

  it("turns a thrown dependency into a 500 instead of an unhandled rejection", async () => {
    const { deps } = makeDeps({
      readState: () => {
        throw new Error("engine exploded");
      },
    });
    const response = await get(deps, "/testboard/api/state?sessionId=known");

    expect(response.status).toBe(500);
  });
});

describe("scope validation", () => {
  it("accepts a file scope written with a workspace-relative path", async () => {
    const { deps } = makeDeps();
    const scope: RunScope = { kind: "file", path: "packages/alpha/test/b.test.ts" };
    const response = await post(deps, "/testboard/api/run", { sessionId: "known", scope });

    expect(response.body).toEqual({ ok: true, runId: "run-1" });
  });

  it("rejects a file scope with an empty path", async () => {
    const { deps } = makeDeps();
    const response = await post(deps, "/testboard/api/run", { sessionId: "known", scope: { kind: "file", path: "" } });

    expect(response.status).toBe(400);
  });
});

/**
 * The source route's real boundary: the workspace, not the string.
 *
 * `safeRelativePath` rejects `..`, which stops a caller from walking out with a
 * path. It does not stop a symlink inside the workspace from pointing out, and a
 * workspace is exactly the kind of tree that holds symlinks: a linked package, a
 * vendored checkout, a fixture that links to `/etc`. So the reader resolves the
 * target and checks where it actually landed.
 */
describe("readWorkspaceFile: symlink escape", () => {
  const created: string[] = [];

  afterEach(async () => {
    await Promise.all(created.splice(0).map(dir => rm(dir, { recursive: true, force: true })));
  });

  /** A workspace with one real file and one symlink pointing outside it. */
  async function makeWorkspace(): Promise<{ workspace: string; outside: string }> {
    const root = await mkdtemp(join(tmpdir(), "dsh-testboard-src-"));
    created.push(root);
    const workspace = join(root, "ws");
    const outside = join(root, "outside");
    await mkdir(workspace, { recursive: true });
    await mkdir(outside, { recursive: true });
    await writeFile(join(workspace, "inside.test.ts"), 'it("inside", () => {});', "utf8");
    await writeFile(join(outside, "secret.test.ts"), 'it("secret", () => {});', "utf8");
    await symlink(join(outside, "secret.test.ts"), join(workspace, "escape.test.ts"));
    return { workspace, outside };
  }

  it("reads a file that really lives in the workspace", async () => {
    const { workspace } = await makeWorkspace();

    expect(await readWorkspaceFile(workspace, "inside.test.ts")).toBe('it("inside", () => {});');
    expect(readWorkspaceFileSync(workspace, "inside.test.ts")).toBe('it("inside", () => {});');
  });

  it("refuses a symlink that points outside the workspace", async () => {
    const { workspace } = await makeWorkspace();

    // The path is workspace-relative and contains no `..`, so the string check
    // passes; only resolving the target catches it.
    expect(await readWorkspaceFile(workspace, "escape.test.ts")).toBeUndefined();
    expect(readWorkspaceFileSync(workspace, "escape.test.ts")).toBeUndefined();
  });

  it("refuses a path that climbs out even when the target exists", async () => {
    const { workspace } = await makeWorkspace();

    expect(await readWorkspaceFile(workspace, "../outside/secret.test.ts")).toBeUndefined();
    expect(readWorkspaceFileSync(workspace, "../outside/secret.test.ts")).toBeUndefined();
  });

  it("refuses a directory", async () => {
    const { workspace } = await makeWorkspace();

    expect(await readWorkspaceFile(workspace, ".")).toBeUndefined();
  });
});
