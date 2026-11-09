/**
 * Route dispatch over a fake web server.
 *
 * Pins two product decisions: every arch route answers same-origin under the
 * registered prefix (no absolute URL survives), and a degraded store is a 200
 * with a flag, not an error — the client must keep working offline.
 */
import type { IncomingMessage, ServerResponse } from "node:http";

import { describe, expect, it } from "vitest";

import { registerArchRoutes, type ArchRouteDeps, type WebServerFace } from "../src/host/routes.ts";
import { ROUTE_PREFIX, type ArchWorkspaceState } from "../src/shared.ts";

type RouteHandler = Parameters<WebServerFace["register"]>[0]["handler"];

interface CapturedResponse {
  status: number;
  body: unknown;
}

function fakeWebServer(): { webServer: WebServerFace; registered: string[]; handler: () => RouteHandler } {
  const registered: string[] = [];
  let handler: RouteHandler | undefined;
  const webServer: WebServerFace = {
    register(route) {
      registered.push(`${route.kind} ${route.path}`);
      handler = route.handler;
      return () => {
        handler = undefined;
      };
    },
  };
  return { webServer, registered, handler: () => handler! };
}

const deps: ArchRouteDeps = {
  resolveWorkspaceRoot: async sessionId => (sessionId === "known" ? "/w/root" : undefined),
  loadViews: async workspace => ({ workspace, projectId: "p", views: [], hasErrors: false, errors: [] }),
  loadModel: async workspace => ({
    workspace,
    projectId: "p",
    elements: {},
    relations: {},
    specification: null,
  }),
  loadState: async () => undefined,
  saveState: async () => false,
};

async function request(
  handler: RouteHandler,
  method: string,
  url: string,
  body?: string,
): Promise<CapturedResponse> {
  const chunks = body === undefined ? [] : [Buffer.from(body, "utf8")];
  const req = {
    method,
    url,
    async *[Symbol.asyncIterator]() {
      yield* chunks;
    },
  };
  const captured: CapturedResponse = { status: 0, body: null };
  const res = {
    writeHead(status: number) {
      captured.status = status;
    },
    end(text: string) {
      captured.body = JSON.parse(text) as unknown;
    },
  };
  await handler(req as IncomingMessage, res as ServerResponse);
  return captured;
}

describe("registerArchRoutes", () => {
  const { webServer, registered, handler } = fakeWebServer();
  const disposer = registerArchRoutes(webServer, deps);

  it("registers exactly one prefix route at /arch/api", () => {
    expect(registered).toEqual([`prefix ${ROUTE_PREFIX}`]);
  });

  it("answers views for a known session", async () => {
    const captured = await request(handler(), "GET", "/arch/api/views?sessionId=known");
    expect(captured.status).toBe(200);
    expect(captured.body).toMatchObject({ workspace: "/w/root", projectId: "p" });
  });

  it("answers model for a known session", async () => {
    const captured = await request(handler(), "GET", "/arch/api/model?sessionId=known");
    expect(captured.status).toBe(200);
    expect(captured.body).toMatchObject({ workspace: "/w/root" });
  });

  it("rejects a missing sessionId with 400", async () => {
    const captured = await request(handler(), "GET", "/arch/api/views");
    expect(captured.status).toBe(400);
  });

  it("reports unknown sessions with 404", async () => {
    const captured = await request(handler(), "GET", "/arch/api/views?sessionId=nope");
    expect(captured.status).toBe(404);
  });

  it("reports a degraded store as 200 with a flag, not an error", async () => {
    const get = await request(handler(), "GET", "/arch/api/state?sessionId=known");
    expect(get.status).toBe(200);
    expect(get.body).toEqual({ state: null, degraded: true });

    const put = await request(
      handler(),
      "POST",
      "/arch/api/state",
      JSON.stringify({
        sessionId: "known",
        viewId: "index",
        viewports: { index: { scale: 0.8, tx: 0, ty: 0 } },
        offsets: {},
      }),
    );
    expect(put.status).toBe(200);
    expect(put.body).toEqual({ ok: false, degraded: true });
  });

  it("accepts the legacy single-viewport state body and migrates it per view", async () => {
    const saved: ArchWorkspaceState[] = [];
    const { webServer, handler: legacyHandler } = fakeWebServer();
    registerArchRoutes(webServer, {
      ...deps,
      loadState: async () => null,
      saveState: async (_workspace, state) => {
        saved.push(state);
        return true;
      },
    });
    const put = await request(
      legacyHandler(),
      "POST",
      "/arch/api/state",
      JSON.stringify({
        sessionId: "known",
        viewId: "skin",
        viewport: { scale: 0.6, tx: -40, ty: 12 },
        viewHash: "hash-1",
        offsets: { skin: { title: { dx: 4, dy: 0, baseX: 0, baseY: 8 } } },
      }),
    );
    expect(put.status).toBe(200);
    expect(put.body).toEqual({ ok: true, degraded: false });
    expect(saved[0]?.viewId).toBe("skin");
    expect(saved[0]?.viewports).toEqual({ skin: { scale: 0.6, tx: -40, ty: 12 } });
    expect(saved[0]?.offsets.skin?.title).toEqual({ dx: 4, dy: 0, baseX: 0, baseY: 8 });
  });

  it("rejects an array viewport container with 400", async () => {
    const captured = await request(
      handler(),
      "POST",
      "/arch/api/state",
      JSON.stringify({
        sessionId: "known",
        viewId: "index",
        viewports: [{ scale: 1, tx: 0, ty: 0 }],
        offsets: {},
      }),
    );
    expect(captured.status).toBe(400);
  });

  it("rejects a malformed state body with 400", async () => {
    const captured = await request(
      handler(),
      "POST",
      "/arch/api/state",
      JSON.stringify({ sessionId: "known", nonsense: true }),
    );
    expect(captured.status).toBe(400);
  });

  it("returns 404 for an unknown suffix", async () => {
    const captured = await request(handler(), "GET", "/arch/api/other?sessionId=known");
    expect(captured.status).toBe(404);
  });

  it("returns a disposer", () => {
    expect(typeof disposer).toBe("function");
  });
});
