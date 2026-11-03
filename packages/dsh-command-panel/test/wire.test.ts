/**
 * Wire tests: the raw-RPC faces that reach host services the typed namespace
 * table never mounted for a third-party package.
 *
 * The transport folding is the decision surface here: an envelope the gateway
 * already validated still has to become the RemoteResult union the callers
 * read, without ever throwing into a reveal path.
 */

import { describe, expect, it } from "vitest";

import type { GatewayRpc } from "../src/client/wire.ts";
import {
  createGitExplorerFace,
  createNativeOpenFace,
  createPathExplorerFace,
  createSessionOpenFace,
  foldTransport,
  gatewayRpcOf,
} from "../src/client/wire.ts";

function rpcOf(respond: (endpoint: string, payload: unknown) => unknown): GatewayRpc {
  return {
    call: async (_scope, endpoint, payload) => respond(endpoint, payload),
  };
}

describe("gatewayRpcOf", () => {
  it("reads the connection service's unary caller without throwing", () => {
    expect(gatewayRpcOf({ get: () => ({ rpc: { call: () => undefined } }) })).toBeDefined();
    expect(gatewayRpcOf({ get: () => undefined })).toBeUndefined();
    expect(gatewayRpcOf({ get: () => { throw new Error("guard"); } })).toBeUndefined();
    expect(gatewayRpcOf({})).toBeUndefined();
  });
});

describe("foldTransport", () => {
  it("keeps a successful envelope's value", () => {
    expect(foldTransport({ ok: true, value: 7 })).toEqual({ ok: true, value: 7 });
  });

  it("carries an error envelope's code and message", () => {
    expect(foldTransport({ ok: false, error: { code: "gateway/not-found", message: "no route" } })).toEqual({
      ok: false,
      error: { code: "gateway/not-found", message: "no route" },
    });
  });

  it("folds anything else into a malformed failure", () => {
    expect(foldTransport(undefined)).toMatchObject({ ok: false, error: { code: "malformed-response" } });
    expect(foldTransport("nope")).toMatchObject({ ok: false, error: { code: "malformed-response" } });
  });
});

describe("createPathExplorerFace", () => {
  it("routes resolve onto the pathExplorer namespace with the request envelope", async () => {
    const calls: Array<{ endpoint: string; payload: unknown }> = [];
    const face = createPathExplorerFace(
      rpcOf((endpoint, payload) => {
        calls.push({ endpoint, payload });
        return { ok: true, value: { ok: true, home: "/h", entries: [] } };
      }),
    );

    const result = await face.resolve({ query: "/h/x", limit: 5 });

    expect(calls).toEqual([
      { endpoint: "pathExplorer/resolve", payload: { args: { request: { query: "/h/x", limit: 5 } } } },
    ]);
    expect(result).toEqual({ ok: true, value: { ok: true, home: "/h", entries: [] } });
  });

  it("returns a transport failure instead of throwing when the rpc rejects", async () => {
    const face = createPathExplorerFace({
      call: async () => {
        throw new Error("socket closed");
      },
    });
    await expect(face.resolve({ query: "/h" })).resolves.toMatchObject({
      ok: false,
      error: { message: "socket closed" },
    });
  });
});

describe("createGitExplorerFace", () => {
  it("routes query onto the gitExplorer namespace with the request envelope", async () => {
    const calls: Array<{ endpoint: string; payload: unknown }> = [];
    const face = createGitExplorerFace(
      rpcOf((endpoint, payload) => {
        calls.push({ endpoint, payload });
        return { ok: true, value: { ok: true, page: { commits: [] } } };
      }),
    );

    const result = await face.query({ sessionId: "sess-a", ref: "9393130", limit: 5 });

    expect(calls).toEqual([
      {
        endpoint: "gitExplorer/query",
        payload: { args: { request: { sessionId: "sess-a", ref: "9393130", limit: 5 } } },
      },
    ]);
    expect(result).toEqual({ ok: true, value: { ok: true, page: { commits: [] } } });
  });

  it("keeps a gateway rejection in the result union", async () => {
    const face = createGitExplorerFace(rpcOf(() => ({ ok: false, error: { code: "gateway/not-found" } })));
    await expect(face.query({ sessionId: "sess-a", ref: "9393130" })).resolves.toMatchObject({
      ok: false,
      error: { code: "gateway/not-found" },
    });
  });
});

describe("createNativeOpenFace", () => {
  it("routes open onto the nativeOpen namespace with the request envelope", async () => {
    const calls: Array<{ scope: string; endpoint: string; payload: unknown }> = [];
    const rpc: GatewayRpc = {
      call: async (scope, endpoint, payload) => {
        calls.push({ scope, endpoint, payload });
        return { ok: true, value: "opened" };
      },
    };

    await expect(createNativeOpenFace(rpc).open({ path: "/h/x.md" })).resolves.toEqual({
      ok: true,
      value: "opened",
    });
    expect(calls).toEqual([
      { scope: "/api", endpoint: "nativeOpen/open", payload: { args: { request: { path: "/h/x.md" } } } },
    ]);
  });
});

describe("createSessionOpenFace", () => {
  it("probes availability with an empty argument envelope", async () => {
    const calls: Array<{ endpoint: string; payload: unknown }> = [];
    const face = createSessionOpenFace(
      rpcOf((endpoint, payload) => {
        calls.push({ endpoint, payload });
        return endpoint === "session/canOpenWorkspacePath" ? { ok: true, value: true } : { ok: true, value: { opened: true } };
      }),
    );

    await expect(face.canOpenWorkspacePath()).resolves.toEqual({ ok: true, value: true });
    await expect(face.openWorkspacePath({ path: "/h/x.md" })).resolves.toEqual({
      ok: true,
      value: { opened: true },
    });
    expect(calls[0]).toEqual({ endpoint: "session/canOpenWorkspacePath", payload: { args: {} } });
    expect(calls[1]).toEqual({
      endpoint: "session/openWorkspacePath",
      payload: { args: { request: { path: "/h/x.md" } } },
    });
  });

  it("reports a desktop-less host as plain unavailability", async () => {
    const face = createSessionOpenFace(rpcOf(() => ({ ok: true, value: false })));
    await expect(face.canOpenWorkspacePath()).resolves.toEqual({ ok: true, value: false });
  });

  it("keeps an open failure in the result union", async () => {
    const face = createSessionOpenFace(rpcOf(() => ({ ok: false, error: { code: "session/no-desktop" } })));
    await expect(face.openWorkspacePath({ path: "/h" })).resolves.toMatchObject({
      ok: false,
      error: { code: "session/no-desktop" },
    });
  });
});

describe("gateway scope", () => {
  it("addresses the host api scope", async () => {
    const scopes: string[] = [];
    const rpc: GatewayRpc = { call: async scope => (scopes.push(scope), { ok: true, value: true }) };
    await createSessionOpenFace(rpc).canOpenWorkspacePath();
    expect(scopes).toEqual(["/api"]);
  });
});
