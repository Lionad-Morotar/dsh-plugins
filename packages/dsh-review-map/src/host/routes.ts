/**
 * The two `/review-map/api` routes.
 *
 * Dispatch is split from transport on purpose: `handleReviewRequest` is the wire
 * contract as a pure function, so every status code and body shape is testable
 * without a live server, and the prefix registration below is a thin adapter
 * over it.
 *
 * Route map (the host registers one prefix, so the suffix is dispatched here):
 *   GET /review-map/api/state?sessionId=&scope=worktree|branch&base=   the change list
 *   GET /review-map/api/diff?sessionId=&path=&scope=&base=             one file's detail
 *
 * Two conventions run through both routes and are worth stating once.
 *
 * A domain failure is a 200. "This workspace is not a repository", "there is no
 * baseline to compare against", "this file is in conflict" are all things the
 * client renders as states, and a 4xx would make it treat them as broken
 * requests. Only a malformed request is a 4xx, and only a dependency that threw
 * is a 500.
 *
 * Every path is same-origin relative. The GUI port changes on every host boot,
 * so nothing here may compose an absolute URL.
 */
import type { IncomingMessage, ServerResponse } from "node:http";
import { posix } from "node:path";

import {
  ROUTE_PREFIX,
  type FileDiffResult,
  type ReviewError,
  type ReviewErrorCode,
  type ReviewScope,
  type ReviewSnapshotResult,
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
export interface ReviewRouteDeps {
  /** Session id → canonical workspace path; undefined when the session is unknown. */
  resolveWorkspaceRoot(sessionId: string): Promise<string | undefined>;
  /** The workspace's change list for one scope. */
  loadSnapshot(workspace: string, scope: ReviewScope, signal?: AbortSignal): Promise<ReviewSnapshotResult>;
  /** One file's detail for one scope. */
  loadDiff(workspace: string, scope: ReviewScope, path: string, signal?: AbortSignal): Promise<FileDiffResult>;
}

/** One request, as the pure handler sees it. */
export interface ReviewRouteRequest {
  readonly method: string;
  readonly url: string;
}

/** One response, as the pure handler produces it. */
export interface ReviewRouteResponse {
  readonly status: number;
  readonly body: unknown;
}

/**
 * Normalize a caller-supplied workspace-relative path, or reject it.
 *
 * This is the boundary that keeps a `../` from turning the diff route into a
 * filesystem reader. A path is accepted only when it is relative, normalizes to
 * something inside the workspace, and does not climb out of it.
 *
 * A backslash is treated as a separator on both platforms: it is a separator on
 * Windows and a legal filename character on POSIX, and letting the two sides
 * disagree about whether a path escapes is how a traversal slips through on one
 * of them.
 *
 * @param raw - the path as the client sent it.
 * @returns the normalized relative path, or undefined when it escapes.
 */
export function safeRelativePath(raw: string): string | undefined {
  if (raw === "" || raw.includes("\0")) return undefined;
  const normalized = posix.normalize(raw.split("\\").join("/"));
  if (normalized === "" || normalized === ".") return undefined;
  if (normalized.startsWith("/") || normalized.startsWith("../") || normalized === "..") return undefined;
  return normalized;
}

/**
 * Build a failure body in the shape both routes share.
 * @param code - the wire error code.
 * @param message - detail for a log; the client renders its own copy from the code.
 * @returns the response.
 */
function fail(code: ReviewErrorCode, message: string, status = 400): ReviewRouteResponse {
  return { status, body: { ok: false, error: { code, message } satisfies ReviewError } };
}

/**
 * Read the scope out of a query, or reject it.
 *
 * An absent or empty `scope` is a worktree review, which is the common request
 * and the one a client that has not implemented the switch yet should get. A
 * `base` with no `scope=branch` is ignored rather than rejected: it is a stale
 * parameter, not a malformed request.
 * @param url - the parsed request url.
 * @returns the scope, or undefined when the value is not one this host serves.
 */
function scopeOf(url: URL): ReviewScope | undefined {
  const raw = url.searchParams.get("scope");
  if (raw === null || raw === "") return { kind: "worktree" };
  if (raw === "worktree") return { kind: "worktree" };
  if (raw !== "branch") return undefined;
  const base = url.searchParams.get("base");
  // No `baseRef` key at all when the query names none: the data layer resolves
  // the baseline, and an explicit `baseRef: undefined` is a different request.
  return base === null || base === "" ? { kind: "branch" } : { kind: "branch", baseRef: base };
}

/** The session id from a query, or undefined when it is absent or empty. */
function sessionIdOf(url: URL): string | undefined {
  const raw = url.searchParams.get("sessionId");
  return raw === null || raw === "" ? undefined : raw;
}

/**
 * The route suffix under the prefix, with the slashes trimmed.
 * @param pathname - the request's path.
 * @returns the suffix, or undefined when the path is not under the prefix.
 */
function suffixOf(pathname: string): string | undefined {
  if (pathname !== ROUTE_PREFIX && !pathname.startsWith(`${ROUTE_PREFIX}/`)) return undefined;
  return pathname.slice(ROUTE_PREFIX.length).replace(/^\/+/u, "").replace(/\/+$/u, "");
}

/**
 * Answer one request against the review data layer.
 *
 * @param deps - the host-half assembly.
 * @param request - method and url, nothing else.
 * @returns the status and body to send.
 */
export async function handleReviewRequest(
  deps: ReviewRouteDeps,
  request: ReviewRouteRequest,
): Promise<ReviewRouteResponse> {
  const method = request.method.toUpperCase();
  const url = new URL(request.url, "http://review-map.local");
  const suffix = suffixOf(url.pathname);

  if (suffix === undefined) return fail("bad-request", `no review-map route for ${url.pathname}`, 404);
  if (method !== "GET") return fail("bad-request", `method ${method} is not allowed on ${suffix}`, 405);
  if (suffix !== "state" && suffix !== "diff") return fail("bad-request", `no review-map route for ${suffix}`, 404);

  const sessionId = sessionIdOf(url);
  if (sessionId === undefined) return fail("bad-request", "sessionId query parameter is required");

  const scope = scopeOf(url);
  if (scope === undefined) return fail("bad-request", "scope must be worktree or branch");

  // The path is validated before the workspace is resolved: a path that escapes
  // is a broken client, and no workspace makes it acceptable.
  let path: string | undefined;
  if (suffix === "diff") {
    const raw = url.searchParams.get("path");
    if (raw === null || raw === "") return fail("bad-request", "path query parameter is required");
    path = safeRelativePath(raw);
    if (path === undefined) return fail("bad-request", "path escapes the workspace");
  }

  try {
    const workspace = await deps.resolveWorkspaceRoot(sessionId);
    if (workspace === undefined) return fail("no-session", `session ${sessionId} has no workspace`, 404);

    if (path === undefined) {
      const result = await deps.loadSnapshot(workspace, scope);
      // A domain failure is passed through verbatim: the client renders the code,
      // and rewriting it here would put a second copy of the vocabulary in play.
      return { status: 200, body: result };
    }
    const result = await deps.loadDiff(workspace, scope, path);
    return { status: 200, body: result };
  } catch {
    // A dependency that threw is a host bug, not a client error. The message is
    // deliberately not forwarded: it can carry a path or a command line, and the
    // client has nothing useful to do with it.
    return fail("unreadable", "the review read failed", 500);
  }
}

/**
 * Register `/review-map/api` on one web server.
 *
 * @param webServer - the server to mount on.
 * @param deps - the host-half assembly.
 * @returns the disposer that unregisters the prefix.
 */
export function registerReviewRoutes(webServer: WebServerFace, deps: ReviewRouteDeps): () => void {
  return webServer.register({
    kind: "prefix",
    path: ROUTE_PREFIX,
    handler: async (req, res) => {
      const response = await handleReviewRequest(deps, {
        method: req.method ?? "GET",
        url: req.url ?? "/",
      });
      sendJson(res, response.status, response.body);
    },
  });
}

/**
 * Write one JSON response.
 *
 * `no-store` because every answer is a live read of a working tree: a cached
 * change list would show the reader a diff that no longer exists.
 * @param res - the response to write to.
 * @param status - the HTTP status.
 * @param body - the JSON-serializable body.
 */
function sendJson(res: ServerResponse, status: number, body: unknown): void {
  const text = JSON.stringify(body);
  res.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "content-length": Buffer.byteLength(text),
    "cache-control": "no-store",
  });
  res.end(text);
}
