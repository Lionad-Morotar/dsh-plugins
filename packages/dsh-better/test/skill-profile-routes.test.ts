/**
 * The `/better/api/skill-profile` handler, driven through stub req/res pairs.
 *
 * The handler is exported separately from the registration so these cases can
 * call it directly: building real `IncomingMessage`/`ServerResponse` objects
 * would test node's http module rather than this dispatch, and the only things
 * that matter here are the status, the JSON body and the two headers.
 *
 * The 500 case is the one worth keeping honest. A skill whose file vanished
 * between discovery and the request must not take the web server down with it,
 * so every failure is caught and flattened to `{error:"internal"}` — the error
 * text never reaches the browser.
 */
import type { IncomingMessage, ServerResponse } from "node:http";
import { describe, expect, it, vi } from "vitest";

import {
  SKILL_PROFILE_ROUTE_PREFIX,
  createSkillProfileHandler,
  registerSkillProfileRoutes,
  type SkillProfileRouteDeps,
  type WebServerFace,
} from "../src/host/skill-profile-routes.ts";

/** What one stubbed response recorded. */
interface Recorded {
  readonly status: number;
  readonly headers: Record<string, string>;
  readonly body: unknown;
}

/** A response stub that records the status, headers and parsed JSON body. */
function stubResponse(): { res: ServerResponse; read: () => Recorded } {
  const state: { status: number; headers: Record<string, string>; text: string } = {
    status: 0,
    headers: {},
    text: "",
  };
  const res = {
    writeHead(status: number, headers?: Record<string, string>) {
      state.status = status;
      state.headers = headers ?? {};
      return res;
    },
    end(chunk?: string) {
      state.text = chunk ?? "";
      return res;
    },
  } as unknown as ServerResponse;
  return {
    res,
    read: () => ({
      status: state.status,
      headers: state.headers,
      body: state.text === "" ? undefined : (JSON.parse(state.text) as unknown),
    }),
  };
}

/** A request stub: only the url and method are read by the handler. */
function stubRequest(url: string, method = "GET"): IncomingMessage {
  return { url, method } as unknown as IncomingMessage;
}

/** Deps that resolve one known skill and no cwd. */
function deps(overrides: Partial<SkillProfileRouteDeps> = {}): SkillProfileRouteDeps {
  return {
    loadSkill: async name =>
      name === "flow-workflow"
        ? { name, path: "/skills/flow-workflow/SKILL.md", argumentHint: "[--dynamic]", metadata: { owner: "lionad" } }
        : undefined,
    resolveCwd: async () => "/workspace",
    ...overrides,
  };
}

/** Drive the handler once and return what the response recorded. */
async function call(
  url: string,
  options: { method?: string; deps?: SkillProfileRouteDeps } = {},
): Promise<Recorded> {
  const handler = createSkillProfileHandler(options.deps ?? deps());
  const { res, read } = stubResponse();
  await handler(stubRequest(url, options.method ?? "GET"), res);
  return read();
}

describe("createSkillProfileHandler", () => {
  it("answers 200 with the skill profile", async () => {
    const recorded = await call(`${SKILL_PROFILE_ROUTE_PREFIX}?sessionId=s1&name=flow-workflow`);

    expect(recorded.status).toBe(200);
    expect(recorded.body).toEqual({
      name: "flow-workflow",
      path: "/skills/flow-workflow/SKILL.md",
      argumentHint: "[--dynamic]",
      metadata: { owner: "lionad" },
      params: [{ flag: "--dynamic", detail: "" }],
    });
  });

  it("always sends the JSON content type and no-store cache control", async () => {
    const recorded = await call(`${SKILL_PROFILE_ROUTE_PREFIX}?name=flow-workflow`);

    expect(recorded.headers["content-type"]).toBe("application/json; charset=utf-8");
    expect(recorded.headers["cache-control"]).toBe("no-store");
  });

  it("answers 400 when the name is missing", async () => {
    const recorded = await call(`${SKILL_PROFILE_ROUTE_PREFIX}?sessionId=s1`);

    expect(recorded.status).toBe(400);
    expect(recorded.body).toEqual({ error: "missing-name" });
  });

  it("answers 400 when the name is empty", async () => {
    const recorded = await call(`${SKILL_PROFILE_ROUTE_PREFIX}?name=`);

    expect(recorded.status).toBe(400);
    expect(recorded.body).toEqual({ error: "missing-name" });
  });

  it("answers 404 when the skill is unknown", async () => {
    const recorded = await call(`${SKILL_PROFILE_ROUTE_PREFIX}?name=absent`);

    expect(recorded.status).toBe(404);
    expect(recorded.body).toEqual({ error: "not-found" });
  });

  it("answers 405 for a non-GET method", async () => {
    const recorded = await call(`${SKILL_PROFILE_ROUTE_PREFIX}?name=flow-workflow`, { method: "POST" });

    expect(recorded.status).toBe(405);
    expect(recorded.body).toEqual({ error: "method-not-allowed" });
  });

  it("answers 500 without leaking the error when a dependency throws", async () => {
    const recorded = await call(`${SKILL_PROFILE_ROUTE_PREFIX}?name=flow-workflow`, {
      deps: deps({
        loadSkill: async () => {
          throw new Error("disk on fire at /secret/path");
        },
      }),
    });

    expect(recorded.status).toBe(500);
    expect(recorded.body).toEqual({ error: "internal" });
  });

  it("passes the resolved cwd to the loader", async () => {
    const loadSkill = vi.fn(async () => undefined);
    await call(`${SKILL_PROFILE_ROUTE_PREFIX}?sessionId=s1&name=flow-workflow`, {
      deps: deps({ loadSkill, resolveCwd: async () => "/workspace/project" }),
    });

    expect(loadSkill).toHaveBeenCalledWith("flow-workflow", "/workspace/project");
  });

  it("passes an undefined cwd when the session is unknown", async () => {
    const loadSkill = vi.fn(async () => undefined);
    await call(`${SKILL_PROFILE_ROUTE_PREFIX}?name=flow-workflow`, {
      deps: deps({ loadSkill, resolveCwd: async () => undefined }),
    });

    expect(loadSkill).toHaveBeenCalledWith("flow-workflow", undefined);
  });
});

describe("registerSkillProfileRoutes", () => {
  it("registers one prefix route and returns its disposer", () => {
    const unregister = vi.fn();
    const register = vi.fn<WebServerFace["register"]>(() => unregister);
    const server: WebServerFace = { register };

    const dispose = registerSkillProfileRoutes(server, deps());

    expect(register).toHaveBeenCalledTimes(1);
    const route = register.mock.calls[0]?.[0];
    expect(route?.kind).toBe("prefix");
    expect(route?.path).toBe(SKILL_PROFILE_ROUTE_PREFIX);
    expect(typeof route?.handler).toBe("function");

    dispose();
    expect(unregister).toHaveBeenCalledTimes(1);
  });
});
