import { describe, expect, it } from "vitest";

import { createRpcRemoteFace, GIT_RPC_METHODS, unwrapTransport } from "../src/client/wire.ts";

describe("unwrapTransport", () => {
  it("unwraps the transport envelope when the business result is nested", () => {
    const business = { ok: true as const, snapshot: { root: "/repo" } };
    expect(unwrapTransport<typeof business>({ ok: true, value: business })).toEqual({ ok: true, result: business });
  });

  it("accepts a flattened success where the envelope already is the business result", () => {
    const business = { ok: true as const, snapshot: { root: "/repo" } };
    expect(unwrapTransport<typeof business>(business)).toEqual({ ok: true, result: business });
  });

  it("folds a flattened business failure to its message", () => {
    expect(unwrapTransport({ ok: false, error: { code: "git-failed", message: "boom" } })).toEqual({ ok: false, message: "boom" });
  });

  it("folds a transport failure into a message", () => {
    expect(unwrapTransport({ ok: false, error: { code: "gateway/internal", message: "offline" } })).toEqual({
      ok: false,
      message: "offline",
    });
    expect(unwrapTransport({ ok: false, error: { code: "gateway/cancelled" } })).toEqual({ ok: false, message: "gateway/cancelled" });
    expect(unwrapTransport(undefined)).toEqual({ ok: false, message: "malformed remote response" });
  });
});

describe("rpc face", () => {
  it("covers show alongside the data endpoints", async () => {
    expect(GIT_RPC_METHODS).toEqual(["snapshot", "query", "commit", "show"]);
    const calls: Array<[string, unknown]> = [];
    const face = createRpcRemoteFace((endpoint, payload) => {
      calls.push([endpoint, payload]);
      return Promise.resolve({ ok: true, value: { ok: true, page: {} } });
    });
    await face.show({ sessionId: "s1", hash: "abcd1234", path: "src/a.ts", offset: 1, limit: 40 });
    expect(calls).toEqual([
      ["show", { args: { request: { sessionId: "s1", hash: "abcd1234", path: "src/a.ts", offset: 1, limit: 40 } } }],
    ]);
  });
});
