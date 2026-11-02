// src/host/arch-store.ts
import Schema from "@deepseek-ai/schemastery";
var ARCH_DOMAIN_NAME = "dsh_arch";
var ARCH_TABLE_NAME = "workspaces";
var nodeOffsetSchema = Schema.object({
  dx: Schema.number(),
  dy: Schema.number(),
  baseX: Schema.number(),
  baseY: Schema.number()
});
var workspaceStateSchema = Schema.object({
  viewId: Schema.string(),
  viewport: Schema.object({
    scale: Schema.number(),
    tx: Schema.number(),
    ty: Schema.number()
  }),
  viewHash: Schema.string(),
  offsets: Schema.dict(Schema.dict(nodeOffsetSchema)),
  updatedAt: Schema.string()
});
var ARCH_DOMAIN_SPEC = {
  name: ARCH_DOMAIN_NAME,
  version: 1,
  tables: { [ARCH_TABLE_NAME]: workspaceStateSchema }
};
async function openArchStore(storageDomain) {
  if (storageDomain === void 0) return null;
  const domain = await storageDomain.open(ARCH_DOMAIN_SPEC);
  const table = domain.table(ARCH_TABLE_NAME);
  return {
    async loadWorkspace(key) {
      const stored = table.get(key);
      return stored === void 0 || stored === null ? null : stored;
    },
    async saveWorkspace(key, state) {
      await table.put(key, workspaceStateSchema(state));
    },
    async close() {
      await domain.close();
    }
  };
}

// src/host/discover.ts
import { readdir, stat } from "node:fs/promises";
import { join } from "node:path";

// src/shared.ts
var PACKAGE_NAME = "dsh-arch";
var ROUTE_PREFIX = "/arch/api";
var CANONICAL_C4_DIR_SEGMENTS = [".planning", "c4"];
var CONFIG_BASENAME = "likec4.config.json";
var DISCOVER_MAX_DEPTH = 4;
var DISCOVER_MAX_HITS = 8;
var DISCOVER_SKIP_DIRS = [
  "node_modules",
  "dist",
  ".git",
  "refs",
  "zRefs",
  "temp"
];

// src/host/discover.ts
async function isDirectory(path) {
  try {
    return (await stat(path)).isDirectory();
  } catch {
    return false;
  }
}
async function discoverC4ProjectDirs(root) {
  const canonical = join(root, ...CANONICAL_C4_DIR_SEGMENTS);
  if (await isDirectory(canonical)) return [canonical];
  const skip = new Set(DISCOVER_SKIP_DIRS);
  const hits = [];
  const pending = [{ dir: root, depth: 0 }];
  while (pending.length > 0 && hits.length < DISCOVER_MAX_HITS) {
    const { dir, depth } = pending.shift();
    let entries;
    try {
      entries = await readdir(dir);
    } catch {
      continue;
    }
    for (const entry of entries) {
      const path = join(dir, entry);
      if (entry === CONFIG_BASENAME) {
        hits.push(dir);
        if (hits.length >= DISCOVER_MAX_HITS) break;
        continue;
      }
      if (depth >= DISCOVER_MAX_DEPTH || skip.has(entry)) continue;
      if (await isDirectory(path)) pending.push({ dir: path, depth: depth + 1 });
    }
  }
  return hits;
}

// src/host/render.ts
var WATCH_BASELINE_WINDOW_MS = 1200;
var delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
var languageServices;
async function loadLanguageServices() {
  languageServices ??= await import("@likec4/language-services/node");
  return languageServices;
}
async function renderWorkspace(dir) {
  const { fromWorkspace } = await loadLanguageServices();
  const instance = await fromWorkspace(dir, { graphviz: "wasm", watch: true, printErrors: false });
  const projects = instance.projects();
  const projectId = projects[0];
  if (projectId === void 0) throw new Error(`likec4 workspace ${dir} has no project`);
  const views = await instance.diagrams(projectId);
  const errors = instance.hasErrors() ? instance.getErrors() : [];
  return {
    projectId,
    views,
    hasErrors: instance.hasErrors(),
    errors: errors.map((error) => ({ message: error.message, sourcePath: error.sourceFsPath })),
    instance
  };
}
function toViewsPayload(input) {
  return {
    workspace: input.workspace,
    projectId: input.projectId,
    // Views pass through untouched: the layout is authoritative from the host
    // and the client renderer must not re-derive (or truncate) any of it.
    views: [...input.views],
    hasErrors: input.hasErrors,
    errors: [...input.errors]
  };
}
function toModelPayload(input) {
  return {
    workspace: input.workspace,
    projectId: input.projectId,
    elements: input.model.elements ?? {},
    relations: input.model.relations ?? {},
    specification: input.model.specification ?? null
  };
}
function createRenderer(maxWorkspaces = 3, boot = renderWorkspace) {
  const cache = /* @__PURE__ */ new Map();
  return {
    async get(dir) {
      const hit = cache.get(dir);
      if (hit !== void 0) {
        hit.at = Date.now();
        return await renderFromInstance(dir, hit);
      }
      const rendered = await boot(dir);
      const now = Date.now();
      cache.set(dir, { dir, instance: rendered.instance, bootAt: now, at: now });
      while (cache.size > maxWorkspaces) {
        const oldest = [...cache.values()].sort((a, b) => a.at - b.at)[0];
        if (oldest === void 0) break;
        cache.delete(oldest.dir);
        await oldest.instance.dispose().catch(() => {
        });
      }
      return rendered;
    },
    async dispose() {
      const entries = [...cache.values()];
      cache.clear();
      await Promise.all(entries.map((entry) => entry.instance.dispose().catch(() => {
      })));
    }
  };
}
async function renderFromInstance(dir, entry) {
  const remaining = entry.bootAt + WATCH_BASELINE_WINDOW_MS - Date.now();
  if (remaining > 0) await delay(remaining);
  const projects = entry.instance.projects();
  const projectId = projects[0];
  if (projectId === void 0) throw new Error(`likec4 workspace ${dir} has no project`);
  const views = await entry.instance.diagrams(projectId);
  return {
    projectId,
    views,
    hasErrors: entry.instance.hasErrors(),
    errors: entry.instance.hasErrors() ? entry.instance.getErrors().map((error) => ({ message: error.message, sourcePath: error.sourceFsPath })) : [],
    instance: entry.instance
  };
}

// src/host/routes.ts
var MAX_BODY_BYTES = 1024 * 1024;
function sendJson(res, status, body) {
  const text = JSON.stringify(body);
  res.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "content-length": Buffer.byteLength(text),
    "cache-control": "no-store"
  });
  res.end(text);
}
function sessionIdOf(req) {
  const raw = new URL(req.url ?? "/", "http://arch.local").searchParams.get("sessionId");
  return raw === null || raw === "" ? void 0 : raw;
}
async function readJsonBody(req) {
  const chunks = [];
  let size = 0;
  for await (const chunk of req) {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    size += buffer.byteLength;
    if (size > MAX_BODY_BYTES) throw new Error("request body too large");
    chunks.push(buffer);
  }
  if (chunks.length === 0) return {};
  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}
function coerceState(input) {
  if (typeof input !== "object" || input === null) return void 0;
  const candidate = input;
  const { viewId, viewport, viewHash, offsets } = candidate;
  const { scale, tx, ty } = typeof viewport === "object" && viewport !== null ? viewport : { scale: void 0, tx: void 0, ty: void 0 };
  if (typeof viewId !== "string" || typeof scale !== "number" || typeof tx !== "number" || typeof ty !== "number" || typeof offsets !== "object" || offsets === null) {
    return void 0;
  }
  return {
    viewId,
    viewport: { scale, tx, ty },
    viewHash: typeof viewHash === "string" ? viewHash : "",
    offsets,
    // Server-stamped: the client clock is untrusted and the field exists for
    // humans reading the store file.
    updatedAt: (/* @__PURE__ */ new Date()).toISOString()
  };
}
function registerArchRoutes(webServer, deps) {
  return webServer.register({
    kind: "prefix",
    path: ROUTE_PREFIX,
    handler: async (req, res) => {
      try {
        await dispatch(req, res, deps);
      } catch (error) {
        sendJson(res, 500, { error: error instanceof Error ? error.message : String(error) });
      }
    }
  });
}
async function dispatch(req, res, deps) {
  const pathname = new URL(req.url ?? "/", "http://arch.local").pathname;
  const suffix = pathname.slice(ROUTE_PREFIX.length).replace(/^\//u, "").replace(/\/$/u, "");
  if (req.method === "GET" && (suffix === "views" || suffix === "model")) {
    const sessionId = sessionIdOf(req);
    if (sessionId === void 0) {
      sendJson(res, 400, { error: "sessionId query parameter is required" });
      return;
    }
    const workspace = await deps.resolveWorkspaceRoot(sessionId);
    if (workspace === void 0) {
      sendJson(res, 404, { error: `unknown session ${sessionId}` });
      return;
    }
    sendJson(res, 200, suffix === "views" ? await deps.loadViews(workspace) : await deps.loadModel(workspace));
    return;
  }
  if (req.method === "GET" && suffix === "state") {
    const sessionId = sessionIdOf(req);
    if (sessionId === void 0) {
      sendJson(res, 400, { error: "sessionId query parameter is required" });
      return;
    }
    const workspace = await deps.resolveWorkspaceRoot(sessionId);
    if (workspace === void 0) {
      sendJson(res, 404, { error: `unknown session ${sessionId}` });
      return;
    }
    const state = await deps.loadState(workspace);
    const body = {
      state: state ?? null,
      degraded: state === void 0
    };
    sendJson(res, 200, body);
    return;
  }
  if (req.method === "POST" && suffix === "state") {
    const body = await readJsonBody(req);
    const sessionId = body?.sessionId;
    if (typeof sessionId !== "string" || sessionId === "") {
      sendJson(res, 400, { error: "sessionId is required in the body" });
      return;
    }
    const workspace = await deps.resolveWorkspaceRoot(sessionId);
    if (workspace === void 0) {
      sendJson(res, 404, { error: `unknown session ${sessionId}` });
      return;
    }
    const state = coerceState(body);
    if (state === void 0) {
      sendJson(res, 400, { error: "malformed arch state" });
      return;
    }
    const ok = await deps.saveState(workspace, state);
    const response = { ok, degraded: !ok };
    sendJson(res, 200, response);
    return;
  }
  sendJson(res, 404, { error: `no arch route for ${req.method ?? "?"} ${pathname}` });
}

// src/host/workspace.ts
import { realpath } from "node:fs/promises";
async function canonicalPath(dir) {
  try {
    return await realpath(dir);
  } catch {
    return dir;
  }
}
async function resolveSessionRoot(sessionId, sessions, sessionPersistence) {
  const live = sessions?.get(sessionId)?.header?.cwd;
  if (typeof live === "string" && live !== "") return canonicalPath(live);
  try {
    const persisted = (await sessionPersistence?.stat(sessionId))?.header?.cwd;
    if (typeof persisted === "string" && persisted !== "") return canonicalPath(persisted);
  } catch {
  }
  return void 0;
}

// src/index.ts
var name = PACKAGE_NAME;
var inject = [];
function readService(ctx, name2) {
  const value = ctx.get?.(name2);
  return value === null ? void 0 : value;
}
function whenWebServer(host, register) {
  const present = readService(host, "webServer");
  if (present !== void 0) {
    register(host, present);
    return;
  }
  host.inject?.(["webServer"], (ctx) => {
    const webServer = readService(ctx, "webServer");
    if (webServer !== void 0) register(ctx, webServer);
  });
}
function apply(ctx) {
  const host = ctx;
  whenWebServer(host, (ready, webServer) => {
    mountRoutes(ready, webServer);
  });
}
function mountRoutes(host, webServer) {
  const sessions = readService(host, "sessions");
  const sessionPersistence = readService(host, "sessionPersistence");
  const storageDomain = readService(host, "storageDomain");
  console.info(
    `[dsh-arch] activating; services=${JSON.stringify({
      webServer: true,
      sessions: sessions !== void 0,
      sessionPersistence: sessionPersistence !== void 0,
      storageDomain: storageDomain !== void 0
    })}`
  );
  const renderer = createRenderer();
  const storePromise = openArchStore(storageDomain);
  async function resolveWorkspaceRoot(sessionId) {
    const root = await resolveSessionRoot(sessionId, sessions, sessionPersistence);
    return root === void 0 ? await canonicalPath(process.cwd()) : root;
  }
  async function loadViews(workspace) {
    const [dir] = await discoverC4ProjectDirs(workspace);
    if (dir === void 0) {
      return { workspace, projectId: "", views: [], hasErrors: false, errors: [] };
    }
    const rendered = await renderer.get(dir);
    return toViewsPayload({
      workspace,
      projectId: rendered.projectId,
      views: rendered.views,
      hasErrors: rendered.hasErrors,
      errors: rendered.errors
    });
  }
  async function loadModel(workspace) {
    const [dir] = await discoverC4ProjectDirs(workspace);
    if (dir === void 0) {
      return { workspace, projectId: "", elements: {}, relations: {}, specification: null };
    }
    const rendered = await renderer.get(dir);
    const model = await rendered.instance.layoutedModel(rendered.projectId);
    const data = model.$data;
    return toModelPayload({ workspace, projectId: rendered.projectId, model: data });
  }
  async function loadState(workspace) {
    const store = await storePromise;
    return store === null ? void 0 : await store.loadWorkspace(workspace);
  }
  async function saveState(workspace, state) {
    const store = await storePromise;
    if (store === null) return false;
    await store.saveWorkspace(workspace, state);
    return true;
  }
  const unregister = registerArchRoutes(webServer, {
    resolveWorkspaceRoot,
    loadViews,
    loadModel,
    loadState,
    saveState
  });
  host.effect?.(() => {
    unregister();
    void renderer.dispose();
    void storePromise.then((store) => store?.close());
  });
}
export {
  PACKAGE_NAME,
  apply,
  inject,
  name
};
