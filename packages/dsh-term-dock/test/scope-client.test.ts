import { describe, expect, it, vi } from "vitest";

import { createHttpScopeSource, readScopeResponse, scopeLabel, sessionScope } from "../src/client/scope-client.ts";

const scope = { key: "/repo::main", workspace: "/repo", branch: "main", detached: false };
const answer = { ok: true, scope, anchor: "s1" };

describe("scope response parsing", () => {
  it("accepts the host's success shape", () => {
    expect(readScopeResponse(answer)).toEqual({ scope, anchor: "s1" });
  });

  it("rejects every failure and every malformed success", () => {
    expect(readScopeResponse({ ok: false, code: "no-cwd", message: "x" })).toBeUndefined();
    expect(readScopeResponse({ ok: true, scope, anchor: "" })).toBeUndefined();
    expect(readScopeResponse({ ok: true, scope: { ...scope, key: "" }, anchor: "s1" })).toBeUndefined();
    expect(readScopeResponse({ ok: true, scope: { ...scope, branch: 3 }, anchor: "s1" })).toBeUndefined();
    expect(readScopeResponse({ ok: true })).toBeUndefined();
    expect(readScopeResponse(null)).toBeUndefined();
    expect(readScopeResponse("nope")).toBeUndefined();
  });
});

describe("http scope source", () => {
  it("asks the same-origin route with the session encoded", async () => {
    const fetchImpl = vi.fn(async (_url: RequestInfo | URL, _init?: RequestInit) => new Response(JSON.stringify(answer), { status: 200 }));
    const source = createHttpScopeSource(fetchImpl as unknown as typeof fetch);

    await expect(source.resolve("session 1")).resolves.toEqual({ scope, anchor: "s1" });
    const url = String(fetchImpl.mock.calls[0]?.[0] ?? "");
    expect(url).toBe("/term-dock/api/scope?sessionId=session+1");
  });

  it("answers undefined on a host without the route", async () => {
    const source = createHttpScopeSource((async () => new Response("nope", { status: 404 })) as typeof fetch);
    await expect(source.resolve("s1")).resolves.toBeUndefined();
  });

  it("answers undefined on a network failure or abort", async () => {
    const failing = createHttpScopeSource((async () => {
      throw new Error("offline");
    }) as typeof fetch);
    await expect(failing.resolve("s1")).resolves.toBeUndefined();

    const controller = new AbortController();
    controller.abort();
    const source = createHttpScopeSource((async (_url: RequestInfo | URL, init?: RequestInit) => {
      if (init?.signal?.aborted === true) throw new DOMException("Aborted", "AbortError");
      return new Response(JSON.stringify(answer));
    }) as typeof fetch);
    await expect(source.resolve("s1", controller.signal)).resolves.toBeUndefined();
  });

  it("answers undefined for an empty session id without a request", async () => {
    const fetchImpl = vi.fn();
    const source = createHttpScopeSource(fetchImpl as unknown as typeof fetch);
    await expect(source.resolve("")).resolves.toBeUndefined();
    expect(fetchImpl).not.toHaveBeenCalled();
  });
});

describe("session fallback", () => {
  it("keys the scope by the session so behaviour degrades to pre-scope terminals", () => {
    const fallback = sessionScope("s7");
    expect(fallback.anchor).toBe("s7");
    expect(fallback.scope.key).toBe("session:s7");
    expect(fallback.scope.branch).toBeNull();
    expect(scopeLabel(fallback.scope)).toBeUndefined();
  });

  it("labels a scope by its branch", () => {
    expect(scopeLabel(scope)).toBe("main");
    expect(scopeLabel({ ...scope, branch: "detached@abc1234", detached: true })).toBe("detached@abc1234");
    expect(scopeLabel({ ...scope, branch: null })).toBeUndefined();
  });
});
