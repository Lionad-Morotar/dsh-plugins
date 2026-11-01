/**
 * The three `/arch/api` routes.
 *
 * All paths are same-origin relative under the registered prefix: the GUI port
 * changes on every host boot, so nothing here may compose an absolute URL.
 *
 * Route map (prefix dispatch happens inside the handler because the host
 * registers one prefix):
 *   GET  /arch/api/views?sessionId=…   layouted views of the session workspace
 *   GET  /arch/api/model?sessionId=…   element catalogue for the details pane
 *   GET  /arch/api/state?sessionId=…   persisted UI state, or the degraded flag
 *   POST /arch/api/state               { sessionId, … } body, saves UI state
 */
import type { IncomingMessage, ServerResponse } from "node:http";

import {
  ROUTE_PREFIX,
  type ArchWorkspaceState,
  type WireStateGetResponse,
  type WireStatePutResponse,
  type WireViewsResponse,
  type WireModelResponse,
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
export interface ArchRouteDeps {
  /** Session id → workspace realpath; undefined when the session is unknown. */
  resolveWorkspaceRoot(sessionId: string): Promise<string | undefined>;
  loadViews(workspace: string): Promise<WireViewsResponse>;
  loadModel(workspace: string): Promise<WireModelResponse>;
  /**
   * Read one workspace state: the state, `null` when none is saved, or
   * `undefined` when persistence is degraded (client keeps state locally).
   */
  loadState(workspace: string): Promise<ArchWorkspaceState | null | undefined>;
  /** Persist one state; false means degraded (client keeps it locally). */
  saveState(workspace: string, state: ArchWorkspaceState): Promise<boolean>;
}

/** Cap for one request body; states are small by construction. */
const MAX_BODY_BYTES = 1024 * 1024;

function sendJson(res: ServerResponse, status: number, body: unknown): void {
  const text = JSON.stringify(body);
  res.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "content-length": Buffer.byteLength(text),
    "cache-control": "no-store",
  });
  res.end(text);
}

function sessionIdOf(req: IncomingMessage): string | undefined {
  const raw = new URL(req.url ?? "/", "http://arch.local").searchParams.get("sessionId");
  return raw === null || raw === "" ? undefined : raw;
}

async function readJsonBody(req: IncomingMessage): Promise<unknown> {
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

/** A state is accepted only when its shape can round-trip the arch store. */
function coerceState(input: unknown): ArchWorkspaceState | undefined {
  if (typeof input !== "object" || input === null) return undefined;
  const candidate = input as Record<string, unknown>;
  const { viewId, viewport, viewHash, offsets } = candidate;
  const { scale, tx, ty } =
    typeof viewport === "object" && viewport !== null
      ? viewport as Record<string, unknown>
      : { scale: undefined, tx: undefined, ty: undefined };
  if (
    typeof viewId !== "string" ||
    typeof scale !== "number" ||
    typeof tx !== "number" ||
    typeof ty !== "number" ||
    typeof offsets !== "object" ||
    offsets === null
  ) {
    return undefined;
  }
  return {
    viewId,
    viewport: { scale, tx, ty },
    viewHash: typeof viewHash === "string" ? viewHash : "",
    offsets: offsets as ArchWorkspaceState["offsets"],
    // Server-stamped: the client clock is untrusted and the field exists for
    // humans reading the store file.
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Register the arch routes on one web server.
 *
 * @returns the disposer that unregisters the prefix.
 */
export function registerArchRoutes(webServer: WebServerFace, deps: ArchRouteDeps): () => void {
  return webServer.register({
    kind: "prefix",
    path: ROUTE_PREFIX,
    handler: async (req, res) => {
      try {
        await dispatch(req, res, deps);
      } catch (error) {
        sendJson(res, 500, { error: error instanceof Error ? error.message : String(error) });
      }
    },
  });
}

async function dispatch(req: IncomingMessage, res: ServerResponse, deps: ArchRouteDeps): Promise<void> {
  const pathname = new URL(req.url ?? "/", "http://arch.local").pathname;
  const suffix = pathname.slice(ROUTE_PREFIX.length).replace(/^\//u, "").replace(/\/$/u, "");

  if (req.method === "GET" && (suffix === "views" || suffix === "model")) {
    const sessionId = sessionIdOf(req);
    if (sessionId === undefined) {
      sendJson(res, 400, { error: "sessionId query parameter is required" });
      return;
    }
    const workspace = await deps.resolveWorkspaceRoot(sessionId);
    if (workspace === undefined) {
      sendJson(res, 404, { error: `unknown session ${sessionId}` });
      return;
    }
    sendJson(res, 200, suffix === "views" ? await deps.loadViews(workspace) : await deps.loadModel(workspace));
    return;
  }

  if (req.method === "GET" && suffix === "state") {
    const sessionId = sessionIdOf(req);
    if (sessionId === undefined) {
      sendJson(res, 400, { error: "sessionId query parameter is required" });
      return;
    }
    const workspace = await deps.resolveWorkspaceRoot(sessionId);
    if (workspace === undefined) {
      sendJson(res, 404, { error: `unknown session ${sessionId}` });
      return;
    }
    const state = await deps.loadState(workspace);
    const body: WireStateGetResponse = {
      state: state ?? null,
      degraded: state === undefined,
    };
    sendJson(res, 200, body);
    return;
  }

  if (req.method === "POST" && suffix === "state") {
    const body = await readJsonBody(req);
    const sessionId = (body as Record<string, unknown> | null)?.sessionId;
    if (typeof sessionId !== "string" || sessionId === "") {
      sendJson(res, 400, { error: "sessionId is required in the body" });
      return;
    }
    const workspace = await deps.resolveWorkspaceRoot(sessionId);
    if (workspace === undefined) {
      sendJson(res, 404, { error: `unknown session ${sessionId}` });
      return;
    }
    const state = coerceState(body);
    if (state === undefined) {
      sendJson(res, 400, { error: "malformed arch state" });
      return;
    }
    const ok = await deps.saveState(workspace, state);
    const response: WireStatePutResponse = { ok, degraded: !ok };
    sendJson(res, 200, response);
    return;
  }

  sendJson(res, 404, { error: `no arch route for ${req.method ?? "?"} ${pathname}` });
}
