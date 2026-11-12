import { describe, expect, it, vi } from "vitest";

import { handleScopeRequest, registerTermDockRoutes, type WebServerFace } from "../src/host/routes.ts";
import type { ResolvedScope, ScopeResolver } from "../src/host/scope.ts";

const scope = { key: "/repo::main", workspace: "/repo", branch: "main", detached: false };

function createScopes(overrides: Partial<ScopeResolver> = {}): ScopeResolver {
  return {
    resolve: async () => ({ scope, anchor: "s1" }),
    knows: async () => true,
    ...overrides,
  };
}

describe("scope route", () => {
  it("answers the scope and its anchor", async () => {
    const response = await handleScopeRequest(
      { scopes: createScopes() },
      { method: "GET", url: "/term-dock/api/scope?sessionId=s1" },
    );

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ ok: true, scope, anchor: "s1" });
  });

  it("requires a session id", async () => {
    const response = await handleScopeRequest({ scopes: createScopes() }, { method: "GET", url: "/term-dock/api/scope" });

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject({ ok: false, code: "bad-request" });
  });

  it("rejects an unknown session", async () => {
    const response = await handleScopeRequest(
      { scopes: createScopes({ knows: async () => false }) },
      { method: "GET", url: "/term-dock/api/scope?sessionId=ghost" },
    );

    expect(response.status).toBe(404);
    expect(response.body).toMatchObject({ ok: false, code: "no-session" });
  });

  it("reports a session without a directory as a domain state, not a broken request", async () => {
    const response = await handleScopeRequest(
      { scopes: createScopes({ resolve: async () => undefined }) },
      { method: "GET", url: "/term-dock/api/scope?sessionId=s1" },
    );

    expect(response.status).toBe(409);
    expect(response.body).toMatchObject({ ok: false, code: "no-cwd" });
  });

  it("only answers GET and only the scope suffix", async () => {
    const post = await handleScopeRequest(
      { scopes: createScopes() },
      { method: "POST", url: "/term-dock/api/scope?sessionId=s1" },
    );
    const other = await handleScopeRequest(
      { scopes: createScopes() },
      { method: "GET", url: "/term-dock/api/other?sessionId=s1" },
    );

    expect(post.status).toBe(405);
    expect(other.status).toBe(404);
  });

  it("survives a trailing slash under the prefix", async () => {
    const response = await handleScopeRequest(
      { scopes: createScopes() },
      { method: "GET", url: "/term-dock/api/scope/?sessionId=s1" },
    );
    expect(response.status).toBe(200);
  });
});

describe("scope route registration", () => {
  it("mounts one prefix and writes the JSON response with no-store", async () => {
    const register = vi.fn<WebServerFace["register"]>(() => () => {});
    const webServer: WebServerFace = { register };
    const dispose = registerTermDockRoutes(webServer, { scopes: createScopes() });

    expect(typeof dispose).toBe("function");
    expect(register).toHaveBeenCalledTimes(1);
    const route = register.mock.calls[0]?.[0];
    expect(route?.kind).toBe("prefix");
    expect(route?.path).toBe("/term-dock/api");

    const written: { status?: number; headers?: Record<string, string>; body?: string } = {};
    const res = {
      writeHead(status: number, headers: Record<string, string>) {
        written.status = status;
        written.headers = headers;
      },
      end(body: string) {
        written.body = body;
      },
    };
    await route?.handler({ method: "GET", url: "/term-dock/api/scope?sessionId=s1" } as never, res as never);

    expect(written.status).toBe(200);
    expect(written.headers?.["cache-control"]).toBe("no-store");
    expect(JSON.parse(written.body ?? "{}")).toMatchObject({ ok: true, anchor: "s1" });
  });

  it("passes the anchor through unchanged", async () => {
    const resolved: ResolvedScope = { scope: { ...scope, branch: null }, anchor: "s9" };
    const response = await handleScopeRequest(
      { scopes: createScopes({ resolve: async () => resolved }) },
      { method: "GET", url: "/term-dock/api/scope?sessionId=other" },
    );

    expect(response.body).toEqual({ ok: true, scope: resolved.scope, anchor: "s9" });
  });
});
