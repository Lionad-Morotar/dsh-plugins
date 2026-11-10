/**
 * The three `/pr-explorer/api` routes.
 *
 * Dispatch is split from transport on purpose: `handlePrRequest` is the wire
 * contract as a pure function, so every status code and body shape is testable
 * without a live server, and the prefix registration below is a thin adapter
 * over it.
 *
 * Route map (the host registers one prefix, so the suffix is dispatched here):
 *   GET /pr-explorer/api/refs?sessionId=                       the ref picker's world
 *   GET /pr-explorer/api/compare?sessionId=&base=&head=         the pinned range, its commits and files
 *   GET /pr-explorer/api/diff?sessionId=&base=&head=&path=      one file's detail
 *
 * Two conventions run through all three and are worth stating once.
 *
 * A domain failure is a 200. "This workspace is not a repository", "that ref does
 * not exist", "the two histories share no commit" are all things the client
 * renders as states, and a 4xx would make it treat them as broken requests. Only
 * a malformed request is a 4xx, and only a dependency that threw is a 500.
 *
 * Every path is same-origin relative. The GUI port changes on every host boot, so
 * nothing here may compose an absolute URL.
 */
import type { IncomingMessage, ServerResponse } from "node:http";
import { posix } from "node:path";

import {
  ROUTE_PREFIX,
  type CompareSnapshotResult,
  type PrError,
  type PrErrorCode,
  type PrFileDiffResult,
  type RefListingResult,
} from "../shared.ts";

/** Structural slice of the webServer service. */
export interface WebServerFace {
  register(route: {
    readonly kind: "exact" | "prefix";
    readonly path: string;
    readonly handler: (req: IncomingMessage, res: ServerResponse) => void | Promise<void>;
  }): () => void;
}

/** One end of a comparison, as the caller spelled it. */
export interface PrRange {
  readonly base: string;
  readonly head: string;
}

/** Everything the routes need from the host-half assembly. */
export interface PrRouteDeps {
  /** Session id → canonical workspace path; undefined when the session is unknown. */
  resolveWorkspaceRoot(sessionId: string): Promise<string | undefined>;
  /** The workspace's ref listing. */
  loadRefs(workspace: string, signal?: AbortSignal): Promise<RefListingResult>;
  /** The workspace's pinned comparison: reading, commits and files. */
  loadCompare(workspace: string, range: PrRange, signal?: AbortSignal): Promise<CompareSnapshotResult>;
  /** One file's detail for the same range. */
  loadDiff(
    workspace: string,
    range: PrRange & { readonly path: string },
    signal?: AbortSignal,
  ): Promise<PrFileDiffResult>;
}

/** One request, as the pure handler sees it. */
export interface PrRouteRequest {
  readonly method: string;
  readonly url: string;
}

/** One response, as the pure handler produces it. */
export interface PrRouteResponse {
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
 * Build a failure body in the shape all three routes share.
 * @param code - the wire error code.
 * @param message - detail for a log; the client renders its own copy from the code.
 * @param status - the HTTP status.
 * @returns the response.
 */
function fail(code: PrErrorCode, message: string, status = 400): PrRouteResponse {
  return { status, body: { ok: false, error: { code, message } satisfies PrError } };
}

/** The session id from a query, or undefined when it is absent or empty. */
function sessionIdOf(url: URL): string | undefined {
  const raw = url.searchParams.get("sessionId");
  return raw === null || raw === "" ? undefined : raw;
}

/**
 * One required ref from a query.
 *
 * `URLSearchParams.get` returns the first value of a repeated parameter, which is
 * the behaviour a browser form and a hand-written client both expect.
 * @param url - the parsed request url.
 * @param name - the parameter to read.
 * @returns the value, or undefined when it is absent or empty.
 */
function refOf(url: URL, name: string): string | undefined {
  const raw = url.searchParams.get(name);
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

/** The routes this prefix serves. */
const ROUTES: ReadonlySet<string> = new Set(["refs", "compare", "diff"]);

/**
 * Answer one request against the PR data layer.
 *
 * @param deps - the host-half assembly.
 * @param request - method and url, nothing else.
 * @returns the status and body to send.
 */
export async function handlePrRequest(deps: PrRouteDeps, request: PrRouteRequest): Promise<PrRouteResponse> {
  const method = request.method.toUpperCase();
  const url = new URL(request.url, "http://pr-explorer.local");
  const suffix = suffixOf(url.pathname);

  if (suffix === undefined) return fail("bad-request", `no pr-explorer route for ${url.pathname}`, 404);
  if (method !== "GET") return fail("bad-request", `method ${method} is not allowed on ${suffix}`, 405);
  if (!ROUTES.has(suffix)) return fail("bad-request", `no pr-explorer route for ${suffix}`, 404);

  const sessionId = sessionIdOf(url);
  if (sessionId === undefined) return fail("bad-request", "sessionId query parameter is required");

  // A range is two refs. Both are required for compare and diff, and neither is
  // defaulted here: the panel picks a base from the listing, and a route that
  // invented one would hide a client that forgot to send it.
  let range: PrRange | undefined;
  if (suffix !== "refs") {
    const base = refOf(url, "base");
    const head = refOf(url, "head");
    if (base === undefined) return fail("bad-request", "base query parameter is required");
    if (head === undefined) return fail("bad-request", "head query parameter is required");
    range = { base, head };
  }

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

    if (range === undefined) {
      const result = await deps.loadRefs(workspace);
      // A domain failure is passed through verbatim: the client renders the code,
      // and rewriting it here would put a second copy of the vocabulary in play.
      return { status: 200, body: result };
    }
    if (path === undefined) {
      const result = await deps.loadCompare(workspace, range);
      return { status: 200, body: result };
    }
    const result = await deps.loadDiff(workspace, { base: range.base, head: range.head, path });
    return { status: 200, body: result };
  } catch {
    // A dependency that threw is a host bug, not a client error. The message is
    // deliberately not forwarded: it can carry a path or a command line, and the
    // client has nothing useful to do with it.
    return fail("unreadable", "the pr read failed", 500);
  }
}

/**
 * Register `/pr-explorer/api` on one web server.
 *
 * @param webServer - the server to mount on.
 * @param deps - the host-half assembly.
 * @returns the disposer that unregisters the prefix.
 */
export function registerPrRoutes(webServer: WebServerFace, deps: PrRouteDeps): () => void {
  return webServer.register({
    kind: "prefix",
    path: ROUTE_PREFIX,
    handler: async (req, res) => {
      const response = await handlePrRequest(deps, {
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
 * `no-store` because every answer is a live read of a repository: a cached
 * comparison would show the reader a range that has since moved.
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
