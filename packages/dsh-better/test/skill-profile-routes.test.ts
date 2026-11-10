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
import { mkdir, mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
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
    // Stubbed so no case in this file can reach the real home directory: the
    // catalogue paths are composed from `homeDir`, and a test that read the
    // developer's own index.md would pass or fail by machine.
    homeDir: () => "/home/tester",
    readCatalogText: async () => undefined,
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

describe("path branch", () => {
  it("prefers the client-supplied path over the host registry", async () => {
    // The registry path only ever sees bundled skills, so a user skill must be
    // served by reading the file the client already pointed at.
    const calls: string[] = [];
    const handler = createSkillProfileHandler(deps({
      readSkillAt: async (name, path) => {
        calls.push(`path:${name}:${path}`);
        return { name, path, argumentHint: "[--create]", metadata: { version: "1" } };
      },
      loadSkill: async name => {
        calls.push(`registry:${name}`);
        return undefined;
      },
    }));

    const { res, read } = stubResponse();
    await handler(stubRequest("/better/api/skill-profile?name=flow-agent&path=%2Fhome%2Fme%2FSKILL.md"), res);

    const recorded = read();
    expect(recorded.status).toBe(200);
    expect((recorded.body as { params: unknown[] }).params).toHaveLength(1);
    expect(calls).toEqual(["path:flow-agent:/home/me/SKILL.md"]);
  });

  it("falls back to the registry when the path read yields nothing", async () => {
    const handler = createSkillProfileHandler(deps({
      readSkillAt: async () => undefined,
      loadSkill: async name => ({ name, path: "/bundled/SKILL.md", argumentHint: "[--x]" }),
    }));

    const { res, read } = stubResponse();
    await handler(stubRequest("/better/api/skill-profile?name=flow-workflow&path=%2Fgone%2FSKILL.md"), res);

    const recorded = read();
    expect(recorded.status).toBe(200);
    expect((recorded.body as { name: string }).name).toBe("flow-workflow");
  });

  it("uses the registry when no path is supplied", async () => {
    const handler = createSkillProfileHandler(deps());
    const { res, read } = stubResponse();
    await handler(stubRequest("/better/api/skill-profile?name=flow-workflow"), res);
    expect(read().status).toBe(200);
  });
});

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
      assists: [],
      catalogs: {},
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

describe("catalogs", () => {
  /** A skill that declares the workflows source on its `run` slot. */
  const DECLARING = {
    name: "flow-workflow",
    path: "/skills/flow-workflow/SKILL.md",
    assists: [{ slot: "run", kind: "catalog", source: "workflows" }],
  };

  /** A file reader that answers from a path-keyed table and records what it was asked for. */
  function reader(files: Record<string, string>): { read: (path: string) => Promise<string | undefined>; asked: string[] } {
    const asked: string[] = [];
    return {
      asked,
      read: async path => {
        asked.push(path);
        return files[path];
      },
    };
  }

  it("fills the workflows catalogue from the three layers in order", async () => {
    const { read, asked } = reader({
      "/workspace/.claude/workflows/index.md": "- dev（261005）：项目内 dev",
      "/workspace/.agents/workflows/index.md": "- review（261006）：项目内 review",
      "/home/tester/.data/flow-workflow/index.md": "- dev（261005）：全局 dev\n- impeccable（261022）：全局 impeccable",
    });

    const recorded = await call(`${SKILL_PROFILE_ROUTE_PREFIX}?sessionId=s1&name=flow-workflow`, {
      deps: deps({ loadSkill: async () => DECLARING, readCatalogText: read }),
    });

    expect(recorded.status).toBe(200);
    expect(asked).toEqual([
      "/workspace/.claude/workflows/index.md",
      "/workspace/.agents/workflows/index.md",
      "/home/tester/.data/flow-workflow/index.md",
    ]);
    // The project layer wins the repeated slug, and the global one keeps its own
    // order behind it.
    expect((recorded.body as { catalogs: unknown }).catalogs).toEqual({
      workflows: [
        { slug: "dev", summary: "项目内 dev" },
        { slug: "review", summary: "项目内 review" },
        { slug: "impeccable", summary: "全局 impeccable" },
      ],
    });
  });

  it("skips a layer whose file is missing", async () => {
    const { read } = reader({ "/home/tester/.data/flow-workflow/index.md": "- dev（261005）：全局" });

    const recorded = await call(`${SKILL_PROFILE_ROUTE_PREFIX}?sessionId=s1&name=flow-workflow`, {
      deps: deps({ loadSkill: async () => DECLARING, readCatalogText: read }),
    });

    expect((recorded.body as { catalogs: unknown }).catalogs).toEqual({
      workflows: [{ slug: "dev", summary: "全局" }],
    });
  });

  it("does not read the disk when no declaration names the workflows source", async () => {
    const { read, asked } = reader({
      "/home/tester/.data/flow-workflow/index.md": "- dev（261005）：全局",
    });

    const recorded = await call(`${SKILL_PROFILE_ROUTE_PREFIX}?sessionId=s1&name=flow-workflow`, {
      deps: deps({ readCatalogText: read }),
    });

    expect(asked).toEqual([]);
    expect((recorded.body as { catalogs: unknown }).catalogs).toEqual({});
  });

  it("does not read the disk when the declaration names another source", async () => {
    const { read, asked } = reader({});

    const recorded = await call(`${SKILL_PROFILE_ROUTE_PREFIX}?sessionId=s1&name=flow-workflow`, {
      deps: deps({
        loadSkill: async () => ({ name: "flow-workflow", assists: [{ slot: "run", kind: "catalog", source: "skills" }] }),
        readCatalogText: read,
      }),
    });

    expect(asked).toEqual([]);
    expect((recorded.body as { catalogs: unknown }).catalogs).toEqual({});
  });

  it("omits workflows when every layer is empty", async () => {
    const { read } = reader({
      "/workspace/.claude/workflows/index.md": "# 工作流清单\n\n没有条目\n",
      "/home/tester/.data/flow-workflow/index.md": "",
    });

    const recorded = await call(`${SKILL_PROFILE_ROUTE_PREFIX}?sessionId=s1&name=flow-workflow`, {
      deps: deps({ loadSkill: async () => DECLARING, readCatalogText: read }),
    });

    expect((recorded.body as { catalogs: unknown }).catalogs).toEqual({});
  });

  it("reads only the global layer when the session has no cwd", async () => {
    const { read, asked } = reader({ "/home/tester/.data/flow-workflow/index.md": "- dev（261005）：全局" });

    const recorded = await call(`${SKILL_PROFILE_ROUTE_PREFIX}?name=flow-workflow`, {
      deps: deps({ loadSkill: async () => DECLARING, readCatalogText: read, resolveCwd: async () => undefined }),
    });

    expect(asked).toEqual(["/home/tester/.data/flow-workflow/index.md"]);
    expect((recorded.body as { catalogs: unknown }).catalogs).toEqual({
      workflows: [{ slug: "dev", summary: "全局" }],
    });
  });

  it("serves the catalogue on the path branch too", async () => {
    const { read } = reader({ "/home/tester/.data/flow-workflow/index.md": "- dev（261005）：全局" });

    const recorded = await call(`${SKILL_PROFILE_ROUTE_PREFIX}?sessionId=s1&name=flow-workflow&path=%2Fhome%2Fme%2FSKILL.md`, {
      deps: deps({
        readSkillAt: async (name, path) => ({ ...DECLARING, name, path }),
        loadSkill: async () => undefined,
        readCatalogText: read,
      }),
    });

    expect(recorded.status).toBe(200);
    expect((recorded.body as { catalogs: unknown }).catalogs).toEqual({
      workflows: [{ slug: "dev", summary: "全局" }],
    });
  });

  it("still answers 404 when the path branch cannot confirm the skill", async () => {
    const { read } = reader({ "/home/tester/.data/flow-workflow/index.md": "- dev（261005）：全局" });

    const recorded = await call(`${SKILL_PROFILE_ROUTE_PREFIX}?sessionId=s1&name=flow-workflow&path=%2Fhome%2Fme%2FSKILL.md`, {
      deps: deps({
        readSkillAt: async () => undefined,
        loadSkill: async () => undefined,
        readCatalogText: read,
      }),
    });

    expect(recorded.status).toBe(404);
  });

  it("answers 200 with an empty catalogue when the file reads throw", async () => {
    const recorded = await call(`${SKILL_PROFILE_ROUTE_PREFIX}?sessionId=s1&name=flow-workflow`, {
      deps: deps({
        loadSkill: async () => DECLARING,
        readCatalogText: async () => {
          throw new Error("EACCES at /secret/path");
        },
      }),
    });

    expect(recorded.status).toBe(200);
    expect((recorded.body as { catalogs: unknown }).catalogs).toEqual({});
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

/**
 * The declaration has to survive the host half's own wiring.
 *
 * These cases drive `apply` with a fake context and take the handler the route
 * actually registers, rather than calling the handler with stub deps. The stub
 * path cannot see this defect: `loadSkillProfile` and `readSkillProfileAt` are
 * private to `src/index.ts`, and the bug was that they read `frontmatter.assists`
 * and then dropped it on the way out, so `skillProfileOf` never saw a declaration
 * and the catalogue was never read.
 *
 * Everything the route reads lives under a temporary root, including the global
 * catalogue: `homedir()` follows `$HOME`, so pointing that at the fixture keeps
 * the case deterministic and off the developer's own files.
 */
describe("host wiring", () => {
  /** A SKILL.md declaring one catalogue panel on its `run` word. */
  const DECLARING_SKILL = [
    "---",
    "name: flow-workflow",
    "metadata:",
    "  version: 0.0.1",
    "  assist:",
    "    - slot: run",
    "      kind: catalog",
    "      source: workflows",
    "---",
    "",
    "# Body",
  ].join("\n");

  /** The project catalogue the route should find under the session's cwd. */
  const PROJECT_CATALOG = "- dev（261005）：把单个任务描述按拆解交付";

  /** A fixture root: a skill file, a project catalogue, and a global catalogue. */
  async function fixture(): Promise<{ root: string; skillPath: string; cwd: string }> {
    const root = await mkdtemp(join(tmpdir(), "dsh-better-assist-"));
    const skillPath = join(root, "SKILL.md");
    await writeFile(skillPath, DECLARING_SKILL, "utf8");
    const cwd = join(root, "project");
    await mkdir(join(cwd, ".claude", "workflows"), { recursive: true });
    await writeFile(join(cwd, ".claude", "workflows", "index.md"), PROJECT_CATALOG, "utf8");
    await mkdir(join(root, ".data", "flow-workflow"), { recursive: true });
    await writeFile(join(root, ".data", "flow-workflow", "index.md"), "- global-only（261006）：全局条目", "utf8");
    return { root, skillPath, cwd };
  }

  /**
   * Drive `apply` and return the handler the route registered.
   *
   * `whenWebServer` mounts synchronously when the service is already present, so a
   * context whose `get` answers a web server needs no timer.
   */
  async function registeredHandler(options: {
    readonly skillPath: string;
    readonly cwd: string;
  }): Promise<(req: IncomingMessage, res: ServerResponse) => void | Promise<void>> {
    const { apply } = await import("../src/index.ts");
    let handler: ((req: IncomingMessage, res: ServerResponse) => void | Promise<void>) | undefined;
    const webServer: WebServerFace = {
      register(route) {
        handler = route.handler;
        return () => undefined;
      },
    };
    const ctx = {
      effect: (callback: () => () => void) => callback(),
      get: (name: string) => {
        if (name === "webServer") return webServer;
        if (name === "skills") {
          return {
            list: async () => [{ name: "flow-workflow", path: options.skillPath }],
            get: async () => undefined,
          };
        }
        if (name === "sessions") return { get: () => ({ header: { cwd: options.cwd } }) };
        if (name === "sessionPersistence") return { stat: async () => undefined };
        return undefined;
      },
    };
    apply(ctx as never);
    if (handler === undefined) throw new Error("the route was not registered");
    return handler;
  }

  /** Run one request with `$HOME` pointed at the fixture root. */
  async function callWithHome(
    root: string,
    handler: (req: IncomingMessage, res: ServerResponse) => void | Promise<void>,
    url: string,
  ): Promise<Recorded> {
    const previous = process.env.HOME;
    process.env.HOME = root;
    try {
      const { res, read } = stubResponse();
      await handler(stubRequest(url), res);
      return read();
    } finally {
      if (previous === undefined) delete process.env.HOME;
      else process.env.HOME = previous;
    }
  }

  it("keeps the declared assist through the registry branch", async () => {
    const { root, skillPath, cwd } = await fixture();
    const handler = await registeredHandler({ skillPath, cwd });

    const recorded = await callWithHome(root, handler, `${SKILL_PROFILE_ROUTE_PREFIX}?sessionId=s1&name=flow-workflow`);

    expect(recorded.status).toBe(200);
    expect((recorded.body as { assists: unknown }).assists).toEqual([
      { slot: "run", kind: "catalog", source: "workflows" },
    ]);
  });

  it("fills the catalogue the declaration asked for", async () => {
    const { root, skillPath, cwd } = await fixture();
    const handler = await registeredHandler({ skillPath, cwd });

    const recorded = await callWithHome(root, handler, `${SKILL_PROFILE_ROUTE_PREFIX}?sessionId=s1&name=flow-workflow`);

    // The project layer wins its own slug and the global layer follows it.
    expect((recorded.body as { catalogs: unknown }).catalogs).toEqual({
      workflows: [
        { slug: "dev", summary: "把单个任务描述按拆解交付" },
        { slug: "global-only", summary: "全局条目" },
      ],
    });
  });

  it("keeps the declared assist through the client-supplied path branch", async () => {
    const { root, skillPath, cwd } = await fixture();
    const handler = await registeredHandler({ skillPath, cwd });

    const recorded = await callWithHome(
      root,
      handler,
      `${SKILL_PROFILE_ROUTE_PREFIX}?sessionId=s1&name=flow-workflow&path=${encodeURIComponent(skillPath)}`,
    );

    expect(recorded.status).toBe(200);
    expect((recorded.body as { assists: unknown }).assists).toEqual([
      { slot: "run", kind: "catalog", source: "workflows" },
    ]);
  });
});
