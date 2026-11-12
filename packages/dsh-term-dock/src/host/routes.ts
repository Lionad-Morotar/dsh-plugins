/**
 * The dock's one host route: `GET /term-dock/api/scope`.
 *
 * Dispatch is split from transport, like the workbench's other host halves: the
 * pure handler answers a request descriptor with a status and a body, so every
 * branch is testable without a live server, and the prefix registration below is
 * a thin adapter.
 *
 * The route is read-only by construction. It resolves a session's working
 * directory, asks Git for its branch, and answers a workspace-branch identity
 * plus the session whose terminal processes own that identity. Nothing here can
 * write, and no query parameter reaches a shell.
 */
import type { IncomingMessage, ServerResponse } from "node:http";

import { ROUTE_PREFIX, type ScopeResponse } from "../shared.ts";
import type { ScopeResolver } from "./scope.ts";

/** Structural slice of the webServer service. */
export interface WebServerFace {
  register(route: {
    readonly kind: "exact" | "prefix";
    readonly path: string;
    readonly handler: (req: IncomingMessage, res: ServerResponse) => void | Promise<void>;
  }): () => void;
}

/** Everything the route needs from the host-half assembly. */
export interface ScopeRouteDeps {
  readonly scopes: ScopeResolver;
}

/** One request, as the pure handler sees it. */
export interface ScopeRouteRequest {
  readonly method: string;
  readonly url: string;
}

/** One response, as the pure handler produces it. */
export interface ScopeRouteResponse {
  readonly status: number;
  readonly body: ScopeResponse;
}

/** Build one failure body. */
function fail(code: Extract<ScopeResponse, { ok: false }>["code"], message: string, status: number): ScopeRouteResponse {
  return { status, body: { ok: false, code, message } };
}

/**
 * The route suffix under the prefix, with slashes trimmed.
 * @param pathname - the request path.
 * @returns the suffix, or undefined when the path is not ours.
 */
function suffixOf(pathname: string): string | undefined {
  if (pathname !== ROUTE_PREFIX && !pathname.startsWith(`${ROUTE_PREFIX}/`)) return undefined;
  return pathname.slice(ROUTE_PREFIX.length).replace(/^\/+/u, "").replace(/\/+$/u, "");
}

/**
 * Answer one scope request.
 * @param deps - the resolver.
 * @param request - method and url, nothing else.
 * @returns the status and body to send.
 */
export async function handleScopeRequest(deps: ScopeRouteDeps, request: ScopeRouteRequest): Promise<ScopeRouteResponse> {
  const method = request.method.toUpperCase();
  const url = new URL(request.url, "http://term-dock.local");
  const suffix = suffixOf(url.pathname);
  if (suffix === undefined) return fail("bad-request", `no term-dock route for ${url.pathname}`, 404);
  if (method !== "GET") return fail("bad-request", `method ${method} is not allowed on ${suffix}`, 405);
  if (suffix !== "scope") return fail("bad-request", `no term-dock route for ${suffix}`, 404);

  const sessionId = url.searchParams.get("sessionId");
  if (sessionId === null || sessionId.trim() === "") {
    return fail("bad-request", "sessionId query parameter is required", 400);
  }
  if (sessionId.length > 256) return fail("bad-request", "sessionId is too long", 400);
  if (!(await deps.scopes.knows(sessionId))) {
    return fail("no-session", `session ${sessionId} does not exist`, 404);
  }

  const resolved = await deps.scopes.resolve(sessionId);
  if (resolved === undefined) return fail("no-cwd", `session ${sessionId} has no working directory`, 409);
  return { status: 200, body: { ok: true, scope: resolved.scope, anchor: resolved.anchor } };
}

/**
 * Register the prefix on one web server.
 * @param webServer - the server to mount on.
 * @param deps - the resolver.
 * @returns the disposer that unregisters the prefix.
 */
export function registerTermDockRoutes(webServer: WebServerFace, deps: ScopeRouteDeps): () => void {
  return webServer.register({
    kind: "prefix",
    path: ROUTE_PREFIX,
    handler: async (req, res) => {
      const response = await handleScopeRequest(deps, { method: req.method ?? "GET", url: req.url ?? "/" });
      const text = JSON.stringify(response.body);
      res.writeHead(response.status, {
        "content-type": "application/json; charset=utf-8",
        "content-length": Buffer.byteLength(text),
        "cache-control": "no-store",
      });
      res.end(text);
    },
  });
}
