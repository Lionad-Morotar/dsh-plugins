/**
 * The five `/testboard/api` routes.
 *
 * Dispatch is split from transport on purpose: `handleRequest` is the wire
 * contract as a pure function, so every status code and body shape is testable
 * without a live server, and the prefix registration below is a thin adapter
 * over it.
 *
 * Route map (the host registers one prefix, so the suffix is dispatched here):
 *   GET  /testboard/api/state?sessionId=          the workspace's board state
 *   GET  /testboard/api/run?sessionId=            the same state, for polling
 *   POST /testboard/api/run    { sessionId, scope }  start a run
 *   POST /testboard/api/cancel { sessionId }         abort the active run
 *   GET  /testboard/api/source?sessionId=&path=      one test file's text
 *
 * Every path is same-origin relative: the GUI port changes on every host boot,
 * so nothing here may compose an absolute URL.
 */
import type { IncomingMessage, ServerResponse } from "node:http";
import { posix } from "node:path";

import {
  MAX_SOURCE_BYTES,
  ROUTE_PREFIX,
  type RunScope,
  type TestboardError,
  type TestboardState,
  type WireCancelResponse,
  type WireRunStartResponse,
  type WireSourceResponse,
} from "../shared.ts";

/** Structural slice of the webServer service. */
export interface WebServerFace {
  register(route: {
    readonly kind: "exact" | "prefix";
    readonly path: string;
    readonly handler: (req: IncomingMessage, res: ServerResponse) => void | Promise<void>;
  }): () => void;
}

/** Everything the routes need from the host-half assembly. */
export interface TestboardRouteDeps {
  /** Session id → canonical workspace path; undefined when the session is unknown. */
  resolveWorkspaceRoot(sessionId: string): Promise<string | undefined>;
  /** The workspace's board state. */
  readState(workspace: string): TestboardState | Promise<TestboardState>;
  /** Begin a run, or refuse it with the reason the board should show. */
  startRun(workspace: string, scope: RunScope): WireRunStartResponse | Promise<WireRunStartResponse>;
  /** Abort the workspace's active run; false when nothing was running. */
  cancelRun(workspace: string): boolean;
  /** One file's text by workspace-relative path; undefined when unreadable. */
  readSource(workspace: string, path: string): Promise<string | undefined>;
}

/** One request, as the pure handler sees it. */
export interface RouteRequest {
  readonly method: string;
  readonly url: string;
  readonly body?: unknown;
}

/** One response, as the pure handler produces it. */
export interface RouteResponse {
  readonly status: number;
  readonly body: unknown;
}

/** Cap for one request body; both POST bodies are a session id and a scope. */
const MAX_BODY_BYTES = 64 * 1024;

/**
 * Normalize a caller-supplied workspace-relative path, or reject it.
 *
 * The board reads files out of a workspace on request, so this is the boundary
 * that keeps a `../` from turning the route into a filesystem reader. A path is
 * accepted only when it is relative, normalizes to something inside the
 * workspace, and does not climb out of it.
 *
 * @param raw - the path as the client sent it.
 * @returns the normalized relative path, or undefined when it escapes.
 */
export function safeRelativePath(raw: string): string | undefined {
  if (raw === "") return undefined;
  // A backslash is a separator on Windows and a legal filename character on
  // POSIX; treating it as a separator on both sides keeps the two platforms from
  // disagreeing about whether a path escapes.
  const normalized = posix.normalize(raw.split("\\").join("/"));
  if (normalized === "" || normalized === ".") return undefined;
  if (normalized.startsWith("/") || normalized.startsWith("../") || normalized === "..") return undefined;
  return normalized;
}

/**
 * Read one run scope out of a request body, or reject it.
 *
 * @param raw - the `scope` field as sent.
 * @returns the scope, or undefined when it is not a scope this host can run.
 */
function coerceScope(raw: unknown): RunScope | undefined {
  if (typeof raw !== "object" || raw === null) return undefined;
  const candidate = raw as { kind?: unknown; path?: unknown };
  if (candidate.kind === "all") return { kind: "all" };
  if (candidate.kind !== "file") return undefined;
  if (typeof candidate.path !== "string") return undefined;
  const path = safeRelativePath(candidate.path);
  return path === undefined ? undefined : { kind: "file", path };
}

function sessionIdOf(url: URL): string | undefined {
  const raw = url.searchParams.get("sessionId");
  return raw === null || raw === "" ? undefined : raw;
}

function fail(status: number, error: string): RouteResponse {
  return { status, body: { error } };
}

/**
 * Answer one request against the board's dependencies.
 *
 * @param deps - the host-half assembly.
 * @param request - method, url and already-parsed body.
 * @returns the status and body to send.
 */
export async function handleRequest(deps: TestboardRouteDeps, request: RouteRequest): Promise<RouteResponse> {
  const url = new URL(request.url, "http://testboard.local");
  const suffix = url.pathname.slice(ROUTE_PREFIX.length).replace(/^\/+/u, "").replace(/\/+$/u, "");
  const method = request.method.toUpperCase();

  try {
    if (suffix === "state" || suffix === "run") {
      if (method === "GET") {
        const sessionId = sessionIdOf(url);
        if (sessionId === undefined) return fail(400, "sessionId query parameter is required");
        const workspace = await deps.resolveWorkspaceRoot(sessionId);
        // An unknown session is a board state, not a transport error: the client
        // renders "no workspace" from the same shape it renders everything else.
        if (workspace === undefined) return { status: 200, body: { error: "no-session" } satisfies TestboardState };
        return { status: 200, body: await deps.readState(workspace) };
      }
      if (method === "POST" && suffix === "run") {
        const body = (request.body ?? {}) as { sessionId?: unknown; scope?: unknown };
        if (typeof body.sessionId !== "string" || body.sessionId === "") {
          return fail(400, "sessionId is required in the body");
        }
        const workspace = await deps.resolveWorkspaceRoot(body.sessionId);
        if (workspace === undefined) {
          return { status: 200, body: { ok: false, error: "no-session" } satisfies WireRunStartResponse };
        }
        const scope = coerceScope(body.scope);
        if (scope === undefined) return fail(400, "bad-scope");
        // Awaited because the assembly probes for the workspace's own vitest
        // binary before accepting the run.
        return { status: 200, body: await deps.startRun(workspace, scope) };
      }
      return fail(405, `method ${method} is not allowed on ${suffix}`);
    }

    if (suffix === "cancel") {
      if (method !== "POST") return fail(405, `method ${method} is not allowed on cancel`);
      const body = (request.body ?? {}) as { sessionId?: unknown };
      if (typeof body.sessionId !== "string" || body.sessionId === "") {
        return fail(400, "sessionId is required in the body");
      }
      const workspace = await deps.resolveWorkspaceRoot(body.sessionId);
      if (workspace === undefined) return { status: 200, body: { ok: false } satisfies WireCancelResponse };
      return { status: 200, body: { ok: deps.cancelRun(workspace) } satisfies WireCancelResponse };
    }

    if (suffix === "source") {
      if (method !== "GET") return fail(405, `method ${method} is not allowed on source`);
      const sessionId = sessionIdOf(url);
      if (sessionId === undefined) return fail(400, "sessionId query parameter is required");
      const rawPath = url.searchParams.get("path");
      if (rawPath === null || rawPath === "") return fail(400, "path query parameter is required");
      const path = safeRelativePath(rawPath);
      // Rejected before the workspace is even resolved: a path that escapes is a
      // broken client, and no workspace makes it acceptable.
      if (path === undefined) return fail(400, "path escapes the workspace");
      const workspace = await deps.resolveWorkspaceRoot(sessionId);
      if (workspace === undefined) return fail(404, "unknown session");
      const text = await deps.readSource(workspace, path);
      if (text === undefined) return fail(404, `no such file ${path}`);
      if (Buffer.byteLength(text, "utf8") > MAX_SOURCE_BYTES) return fail(413, "file is too large to preview");
      return { status: 200, body: { text } satisfies WireSourceResponse };
    }

    return fail(404, `no testboard route for ${method} ${url.pathname}`);
  } catch (error) {
    // A dependency that threw is a host bug, not a client error; answering 500
    // keeps the rejection out of the gateway's unhandled path.
    return fail(500, error instanceof Error ? error.message : String(error));
  }
}

/**
 * Register `/testboard/api` on one web server.
 *
 * @param webServer - the server to mount on.
 * @param deps - the host-half assembly.
 * @returns the disposer that unregisters the prefix.
 */
export function registerTestboardRoutes(webServer: WebServerFace, deps: TestboardRouteDeps): () => void {
  return webServer.register({
    kind: "prefix",
    path: ROUTE_PREFIX,
    handler: async (req, res) => {
      let body: unknown;
      try {
        body = await readJsonBody(req);
      } catch (error) {
        sendJson(res, 400, { error: error instanceof Error ? error.message : String(error) });
        return;
      }
      const response = await handleRequest(deps, { method: req.method ?? "GET", url: req.url ?? "/", body });
      sendJson(res, response.status, response.body);
    },
  });
}

function sendJson(res: ServerResponse, status: number, body: unknown): void {
  const text = JSON.stringify(body);
  res.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "content-length": Buffer.byteLength(text),
    "cache-control": "no-store",
  });
  res.end(text);
}

async function readJsonBody(req: IncomingMessage): Promise<unknown> {
  if (req.method !== "POST") return undefined;
  const chunks: Buffer[] = [];
  let size = 0;
  for await (const chunk of req) {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk as string);
    size += buffer.byteLength;
    if (size > MAX_BODY_BYTES) throw new Error("request body too large");
    chunks.push(buffer);
  }
  if (chunks.length === 0) return {};
  return JSON.parse(Buffer.concat(chunks).toString("utf8")) as unknown;
}

/** Re-exported so the assembly and its tests spell the error type once. */
export type { TestboardError };
