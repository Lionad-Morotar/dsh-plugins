/**
 * The client's face on the workspace channel.
 *
 * Two things are worth asserting here and neither is a formatting detail. The
 * resolver has to find the namespace through the raw connection RPC, because a
 * third-party package never gets a generated client table, and it has to answer
 * "absent" instead of throwing when the host has no connection at all. And every
 * answer has to fold down to the closed code union, because the view paints one
 * sentence per code and an unmapped code would paint nothing.
 */
import { describe, expect, it, vi } from "vitest";

import {
  createRpcWorkspaceFace,
  createWorkspaceClient,
  createWorkspaceResolver,
  createWorkspaceRpc,
  normalizeCapabilities,
  normalizeIgnored,
  normalizeInfo,
  normalizeReveal,
} from "../src/client/workspace-face.ts";
import { WORKSPACE_SERVICE } from "../src/shared.ts";

/** A connection service whose `rpc.call` records the endpoint it reached. */
function connection(answer: unknown): {
  readonly ctx: { get(name: string): unknown };
  readonly calls: { scope: string; endpoint: string; payload: unknown }[];
} {
  const calls: { scope: string; endpoint: string; payload: unknown }[] = [];
  return {
    calls,
    ctx: {
      get: (name: string) =>
        name === "connection"
          ? {
              rpc: {
                call: async (scope: string, endpoint: string, payload: unknown) => {
                  calls.push({ scope, endpoint, payload });
                  return answer;
                },
              },
            }
          : undefined,
    },
  };
}

describe("createWorkspaceRpc", () => {
  it("reaches the hand-published namespace under /api", async () => {
    const { ctx, calls } = connection({ ok: true, value: { ok: true } });
    const call = createWorkspaceRpc(ctx);
    expect(call).toBeDefined();
    await call?.("info", { args: { request: { sessionId: "s1", path: "a.md" } } });
    expect(calls).toEqual([
      {
        scope: "/api",
        endpoint: `${WORKSPACE_SERVICE}/info`,
        payload: { args: { request: { sessionId: "s1", path: "a.md" } } },
      },
    ]);
  });

  it("answers undefined on a host with no connection service", () => {
    expect(createWorkspaceRpc({ get: () => undefined })).toBeUndefined();
    expect(createWorkspaceRpc({ get: () => ({}) })).toBeUndefined();
    expect(
      createWorkspaceRpc({
        get: () => {
          throw new Error("unknown service");
        },
      }),
    ).toBeUndefined();
  });
});

describe("createWorkspaceResolver", () => {
  it("prefers an injected service over the transport", () => {
    const face = { capabilities: async () => ({}), info: async () => ({}), reveal: async () => ({}) };
    const resolve = createWorkspaceResolver({ fsExplorerWorkspace: face, get: () => undefined });
    expect(resolve()).toBe(face);
  });

  it("falls through to the raw RPC when nothing else answers", () => {
    const { ctx } = connection({ ok: true, value: { ok: true } });
    const resolve = createWorkspaceResolver(ctx);
    expect(typeof resolve()?.info).toBe("function");
  });

  it("skips a stale typed stub that cannot answer capabilities", async () => {
    const { ctx, calls } = connection({
      ok: true,
      value: { ok: true, capabilities: { fileManager: "finder", canReveal: true } },
    });
    const stale = { info: async () => ({}), reveal: async () => ({}) };
    const face = createWorkspaceResolver({ ...ctx, fsExplorerWorkspace: stale })();
    expect(typeof face?.capabilities).toBe("function");
    await face?.capabilities({ sessionId: "s1" });
    expect(calls[0]?.endpoint).toBe(`${WORKSPACE_SERVICE}/capabilities`);
  });

  it("answers undefined when the host exposes no channel at all", () => {
    expect(createWorkspaceResolver({ get: () => undefined })()).toBeUndefined();
  });
});

describe("normalizeCapabilities", () => {
  it("unwraps the generated Remote envelope", () => {
    expect(
      normalizeCapabilities({ ok: true, value: { ok: true, capabilities: { fileManager: "explorer", canReveal: true } } }),
    ).toEqual({ ok: true, capabilities: { fileManager: "explorer", canReveal: true } });
  });

  it("reads a flat answer the same way", () => {
    expect(normalizeCapabilities({ ok: true, capabilities: { fileManager: "directory", canReveal: true } })).toEqual({
      ok: true,
      capabilities: { fileManager: "directory", canReveal: true },
    });
  });

  it("collapses an unknown file manager to null", () => {
    expect(normalizeCapabilities({ ok: true, capabilities: { fileManager: "nautilus", canReveal: true } })).toEqual({
      ok: true,
      capabilities: { fileManager: null, canReveal: true },
    });
  });

  it("carries a failure code through", () => {
    expect(normalizeCapabilities({ ok: false, error: { code: "unsupported", message: "no" } })).toEqual({
      ok: false,
      error: { code: "unsupported", message: "no" },
    });
  });
});

describe("normalizeInfo", () => {
  it("unwraps the envelope and keeps the three facts", () => {
    expect(
      normalizeInfo({
        ok: true,
        value: { ok: true, info: { absolutePath: "/w/a.md", type: "file", exists: true } },
      }),
    ).toEqual({ ok: true, info: { absolutePath: "/w/a.md", type: "file", exists: true } });
  });

  it("refuses an answer without an absolute path", () => {
    expect(normalizeInfo({ ok: true, info: { type: "file", exists: true } })).toMatchObject({
      ok: false,
      error: { code: "io-error" },
    });
  });

  it("maps an unknown code onto io-error", () => {
    expect(normalizeInfo({ ok: false, error: { code: "gateway/internal", message: "boom" } })).toEqual({
      ok: false,
      error: { code: "io-error", message: "boom" },
    });
  });
});

describe("normalizeReveal", () => {
  it("accepts a receipt", () => {
    expect(normalizeReveal({ ok: true, value: { ok: true } })).toEqual({ ok: true });
  });

  it("keeps the failure code the host named", () => {
    expect(normalizeReveal({ ok: false, error: { code: "outside-workspace", message: "no" } })).toEqual({
      ok: false,
      error: { code: "outside-workspace", message: "no" },
    });
  });
});

describe("normalizeIgnored", () => {
  it("unwraps the generated Remote envelope", () => {
    expect(
      normalizeIgnored({
        ok: true,
        value: { ok: true, ignored: { root: "/w", entries: ["node_modules", "x.log"], truncated: false } },
      }),
    ).toEqual({ ok: true, entries: ["node_modules", "x.log"], truncated: false });
  });

  it("reads a flat answer the same way", () => {
    expect(
      normalizeIgnored({ ok: true, ignored: { root: null, entries: ["dist"], truncated: true } }),
    ).toEqual({ ok: true, entries: ["dist"], truncated: true });
  });

  it("reads a missing truncated flag as false", () => {
    expect(normalizeIgnored({ ok: true, ignored: { root: "/w", entries: ["a"] } })).toEqual({
      ok: true,
      entries: ["a"],
      truncated: false,
    });
  });

  it("treats the host's degraded empty answer as an ordinary empty list", () => {
    // `root: null` is what a working directory outside a repository answers; it
    // is a fact, not a failure, and the tree simply dims nothing.
    expect(normalizeIgnored({ ok: true, ignored: { root: null, entries: [], truncated: false } })).toEqual({
      ok: true,
      entries: [],
      truncated: false,
    });
  });

  it("drops entries that are not usable paths", () => {
    expect(
      normalizeIgnored({ ok: true, ignored: { root: "/w", entries: ["a", 7, null, "", "b"], truncated: false } }),
    ).toEqual({ ok: true, entries: ["a", "b"], truncated: false });
  });

  it("carries a failure code through", () => {
    expect(normalizeIgnored({ ok: false, error: { code: "no-workspace", message: "no session" } })).toEqual({
      ok: false,
      error: { code: "no-workspace", message: "no session" },
    });
  });

  it("refuses an answer without an ignored block", () => {
    expect(normalizeIgnored({ ok: true })).toEqual({ ok: false, error: { code: "io-error", message: "" } });
    expect(normalizeIgnored({ ok: true, ignored: "nope" })).toEqual({
      ok: false,
      error: { code: "io-error", message: "" },
    });
    expect(normalizeIgnored(undefined)).toEqual({ ok: false, error: { code: "io-error", message: "" } });
  });
});

describe("createWorkspaceClient", () => {
  it("answers a failure instead of throwing when the channel is missing", async () => {
    const client = createWorkspaceClient({ get: () => undefined });
    await expect(client.reveal("s1", "a.md")).resolves.toMatchObject({
      ok: false,
      error: { code: "unsupported" },
    });
  });

  it("folds a thrown transport error into io-error", async () => {
    const client = createWorkspaceClient({
      fsExplorerWorkspace: {
        capabilities: async () => ({}),
        info: async () => ({}),
        reveal: async () => {
          throw new Error("socket closed");
        },
      },
    });
    await expect(client.reveal("s1", "a.md")).resolves.toEqual({
      ok: false,
      error: { code: "io-error", message: "socket closed" },
    });
  });

  it("sends the request shape the gateway reads back", async () => {
    const { ctx, calls } = connection({ ok: true, value: { ok: true, info: { absolutePath: "/w/a.md", type: "file", exists: true } } });
    const client = createWorkspaceClient(ctx);
    await client.info("s1", "a.md");
    expect(calls[0]?.payload).toEqual({ args: { request: { sessionId: "s1", path: "a.md" } } });
  });

  it("builds a face over the RPC caller", async () => {
    const call = vi.fn(async () => ({ ok: true, value: { ok: true } }));
    const face = createRpcWorkspaceFace(call);
    await face.reveal({ sessionId: "s1", path: "a.md" });
    expect(call).toHaveBeenCalledWith("reveal", { args: { request: { sessionId: "s1", path: "a.md" } } }, undefined);
  });

  it("reaches the ignored endpoint through the RPC caller", async () => {
    const call = vi.fn(async () => ({ ok: true, value: { ok: true, ignored: { root: null, entries: [] } } }));
    const face = createRpcWorkspaceFace(call);
    await face.ignored?.({ sessionId: "s1" });
    expect(call).toHaveBeenCalledWith("ignored", { args: { request: { sessionId: "s1" } } }, undefined);
  });

  it("answers unsupported for ignored when the host has no such method", async () => {
    // A host older than the endpoint exposes the face without `ignored`; the
    // view reads that as "no ignore information" rather than as a crash.
    const client = createWorkspaceClient({
      fsExplorerWorkspace: {
        capabilities: async () => ({}),
        info: async () => ({}),
        reveal: async () => ({}),
      },
    });
    await expect(client.ignored?.("s1")).resolves.toMatchObject({
      ok: false,
      error: { code: "unsupported" },
    });
  });

  it("folds the ignored answer for the caller", async () => {
    const { ctx } = connection({
      ok: true,
      value: { ok: true, ignored: { root: "/w", entries: ["node_modules"], truncated: false } },
    });
    const client = createWorkspaceClient(ctx);
    await expect(client.ignored?.("s1")).resolves.toEqual({
      ok: true,
      entries: ["node_modules"],
      truncated: false,
    });
  });
});
