/**
 * The `/better/api/skill-profile` route.
 *
 * One prefix, one endpoint: `GET ?sessionId=…&name=…` answers the wire profile
 * of one skill. The path is same-origin relative because the GUI port changes on
 * every host boot, so nothing here may compose an absolute URL.
 *
 * The handler is exported apart from the registration so it can be driven
 * directly with stub req/res pairs. Every failure is flattened to a JSON error
 * body: an exception escaping into the web server would take down the whole
 * route table, and the error text may name a path the browser has no business
 * seeing.
 */
import type { IncomingMessage, ServerResponse } from "node:http";

import { skillProfileOf, type SkillProfileWire } from "../skill-profile.ts";

/** The prefix this module registers; the client composes `?name=` onto it. */
export const SKILL_PROFILE_ROUTE_PREFIX = "/better/api/skill-profile";

/** Structural slice of the webServer service. */
export interface WebServerFace {
  register(route: {
    readonly kind: "exact" | "prefix";
    readonly path: string;
    readonly handler: (req: IncomingMessage, res: ServerResponse) => void | Promise<void>;
  }): () => void;
}

/** Everything the route needs from the host-half assembly. */
export interface SkillProfileRouteDeps {
  /**
   * Resolve one skill through the host's registry.
   *
   * Only useful for the bundled skills: a root context has no agent scope, so the
   * scoped registry that holds the user's own skills is not reachable from here.
   * The `path` branch of the handler is the one that covers them.
   */
  readonly loadSkill: (
    name: string,
    cwd: string | undefined,
  ) => Promise<{ name: string; path?: string; argumentHint?: string; metadata?: unknown } | undefined>;
  /** Read one SKILL.md by absolute path, when the client supplies it. */
  readonly readSkillAt?: (
    name: string,
    path: string,
  ) => Promise<{ name: string; path?: string; argumentHint?: string; metadata?: unknown } | undefined>;
  /** Session id → that session's cwd. */
  readonly resolveCwd: (sessionId: string) => Promise<string | undefined>;
}

/** Write one JSON response with the headers every branch shares. */
function sendJson(res: ServerResponse, status: number, body: unknown): void {
  const text = JSON.stringify(body);
  res.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store",
  });
  res.end(text);
}

/** Read one query parameter, treating blank as absent. */
function queryParam(url: URL, key: string): string | undefined {
  const value = url.searchParams.get(key);
  return value === null || value === "" ? undefined : value;
}

/**
 * Build the request handler.
 *
 * @param deps - skill lookup and cwd resolution.
 * @returns a handler that always answers, never throws.
 */
export function createSkillProfileHandler(
  deps: SkillProfileRouteDeps,
): (req: IncomingMessage, res: ServerResponse) => Promise<void> {
  return async (req, res) => {
    try {
      if (req.method !== "GET") {
        sendJson(res, 405, { error: "method-not-allowed" });
        return;
      }
      const url = new URL(req.url ?? "/", "http://better.local");
      const name = queryParam(url, "name");
      if (name === undefined) {
        sendJson(res, 400, { error: "missing-name" });
        return;
      }
      const sessionId = queryParam(url, "sessionId");
      const path = queryParam(url, "path");
      // The client's catalogue already carries the path, and reading that file is
      // the only way to see a skill installed outside the host's bundled roots.
      const byPath = path === undefined ? undefined : await deps.readSkillAt?.(name, path);
      // An unknown session is not an error: the skill lookup then runs against
      // the host's default cwd, which is what a cold panel needs to render.
      const cwd = sessionId === undefined ? undefined : await deps.resolveCwd(sessionId);
      const skill = byPath ?? await deps.loadSkill(name, cwd);
      if (name === "__diag__") {
        sendJson(res, 500, { error: "diag", detail: (skill as unknown as { diag?: string } | undefined)?.diag ?? "no-diag" });
        return;
      }
      if (skill === undefined) {
        sendJson(res, 404, { error: "not-found" });
        return;
      }
      const profile: SkillProfileWire = skillProfileOf(skill);
      sendJson(res, 200, profile);
    } catch {
      sendJson(res, 500, { error: "internal" });
    }
  };
}

/**
 * Register the route on one web server.
 *
 * @returns the disposer that unregisters the prefix.
 */
export function registerSkillProfileRoutes(server: WebServerFace, deps: SkillProfileRouteDeps): () => void {
  return server.register({
    kind: "prefix",
    path: SKILL_PROFILE_ROUTE_PREFIX,
    handler: createSkillProfileHandler(deps),
  });
}
