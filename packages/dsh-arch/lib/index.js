// src/host/arch-store.ts
import { z } from "zod";

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
function readArchViewport(raw) {
  if (typeof raw !== "object" || raw === null) return null;
  const candidate = raw;
  const { scale, tx, ty } = candidate;
  if (typeof scale !== "number" || typeof tx !== "number" || typeof ty !== "number") return null;
  if (!Number.isFinite(scale) || !Number.isFinite(tx) || !Number.isFinite(ty)) return null;
  return { scale, tx, ty };
}
var isPlainObject = (value) => typeof value === "object" && value !== null && !Array.isArray(value);
var isFiniteNumber = (value) => typeof value === "number" && Number.isFinite(value);
function readArchNodeOffset(raw) {
  if (!isPlainObject(raw)) return null;
  const { dx, dy, baseX, baseY } = raw;
  if (!isFiniteNumber(dx) || !isFiniteNumber(dy) || !isFiniteNumber(baseX) || !isFiniteNumber(baseY)) return null;
  return { dx, dy, baseX, baseY };
}
function readArchWorkspaceState(raw) {
  if (!isPlainObject(raw)) return null;
  const viewId = typeof raw.viewId === "string" ? raw.viewId : null;
  if (viewId === null || !isPlainObject(raw.offsets)) return null;
  const viewports = {};
  if (isPlainObject(raw.viewports)) {
    for (const [id, candidate] of Object.entries(raw.viewports)) {
      const viewport = readArchViewport(candidate);
      if (viewport !== null) viewports[id] = viewport;
    }
  } else {
    const legacy = readArchViewport(raw.viewport);
    if (legacy !== null && viewId !== "") viewports[viewId] = legacy;
  }
  const offsets = {};
  for (const [id, records] of Object.entries(raw.offsets)) {
    if (!isPlainObject(records)) continue;
    const kept = {};
    for (const [nodeId, candidate] of Object.entries(records)) {
      const offset = readArchNodeOffset(candidate);
      if (offset !== null) kept[nodeId] = offset;
    }
    offsets[id] = kept;
  }
  return {
    viewId,
    viewports,
    viewHash: typeof raw.viewHash === "string" ? raw.viewHash : "",
    offsets,
    updatedAt: typeof raw.updatedAt === "string" ? raw.updatedAt : (/* @__PURE__ */ new Date()).toISOString()
  };
}

// src/host/arch-store.ts
var ARCH_DOMAIN_NAME = "dsh_arch";
var ARCH_TABLE_NAME = "workspaces";
var nodeOffsetSchema = z.object({
  dx: z.number(),
  dy: z.number(),
  baseX: z.number(),
  baseY: z.number()
});
var viewportSchema = z.object({
  scale: z.number(),
  tx: z.number(),
  ty: z.number()
});
var offsetsSchema = z.record(z.string(), z.record(z.string(), nodeOffsetSchema));
var writableStateSchema = z.object({
  viewId: z.string(),
  viewports: z.record(z.string(), viewportSchema),
  viewHash: z.string(),
  offsets: offsetsSchema,
  updatedAt: z.string()
});
var readableStateSchema = z.object({
  viewId: z.string(),
  viewports: z.unknown().optional(),
  viewport: z.unknown().optional(),
  viewHash: z.string(),
  offsets: z.unknown(),
  updatedAt: z.string()
}).transform((raw, ctx) => {
  const state = readArchWorkspaceState(raw);
  if (state === null) {
    ctx.addIssue({ code: "custom", message: "arch workspace state has no usable base" });
    return z.NEVER;
  }
  return state;
});
var ARCH_DOMAIN_SPEC = {
  name: ARCH_DOMAIN_NAME,
  version: 1,
  invalidRecords: "backup-and-skip",
  tables: { [ARCH_TABLE_NAME]: { valueSchema: readableStateSchema } }
};
async function openArchStore(storageDomain) {
  if (storageDomain === void 0) return null;
  const domain = await storageDomain.open(ARCH_DOMAIN_SPEC);
  const table = domain.table(ARCH_TABLE_NAME);
  return {
    async loadWorkspace(key) {
      const stored = table.get(key);
      return stored === void 0 || stored === null ? null : readArchWorkspaceState(stored);
    },
    async saveWorkspace(key, state) {
      await table.put(key, writableStateSchema.parse(state));
    },
    async close() {
      await domain.close();
    }
  };
}

// src/host/discover.ts
import { readdir, stat } from "node:fs/promises";
import { join } from "node:path";
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
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { join as join2, relative, sep } from "node:path";
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
    specification: input.model.specification ?? null,
    // Both maps are optional on the wire: a host that cannot read the sources
    // omits them rather than sending empty objects, so the client can tell
    // "not reported" from "reported and empty".
    ...input.elementSources === void 0 ? {} : { elementSources: input.elementSources },
    ...input.elementCode === void 0 ? {} : { elementCode: input.elementCode }
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
function collectElementSources(instance, workspaceDir, knownIds) {
  const sources = {};
  const documents = instance.LangiumDocuments;
  if (documents?.all === void 0) return sources;
  for (const doc of documents.all) {
    const uri = doc.uri.toString();
    if (!uri.startsWith("file:") || !uri.endsWith(".c4")) continue;
    let file;
    try {
      file = relative(workspaceDir, fileURLToPath(uri)).split(sep).join("/");
    } catch {
      continue;
    }
    for (const model of doc.parseResult?.value?.models ?? []) {
      walkAstElements(model.elements, "", file, knownIds, sources);
    }
  }
  return sources;
}
function walkAstElements(elements, parent, file, knownIds, into) {
  for (const element of elements ?? []) {
    const name2 = element.name;
    if (name2 === void 0 || name2 === "") {
      const target = element.element?.el?.$refText;
      walkAstElements(element.body?.elements, target ?? parent, file, knownIds, into);
      continue;
    }
    const fqn = parent === "" ? name2 : `${parent}.${name2}`;
    const line = element.$cstNode?.range?.start?.line;
    if (line !== void 0 && knownIds.has(fqn) && into[fqn] === void 0) {
      into[fqn] = { file, line: line + 1 };
    }
    walkAstElements(element.body?.elements, fqn, file, knownIds, into);
  }
}
var CODE_SUFFIXES = [".ts", ".tsx", ".js", ".mjs", ".css"];
function resolveElementCode(workspaceDir, elements) {
  const code = {};
  const packages = readPackageDirs(workspaceDir);
  if (packages.length === 0) return code;
  const byName = /* @__PURE__ */ new Map();
  const byDirName = /* @__PURE__ */ new Map();
  for (const pkg of packages) {
    if (pkg.name !== void 0 && !byName.has(pkg.name)) byName.set(pkg.name, pkg);
    if (!byDirName.has(pkg.dirName)) byDirName.set(pkg.dirName, pkg);
  }
  for (const [id, element] of Object.entries(elements)) {
    const title = typeof element.title === "string" ? element.title.trim() : "";
    if (title === "") continue;
    const pkg = packageFor(id, elements, byName, byDirName);
    if (pkg === void 0) continue;
    const file = codeFileFor(workspaceDir, pkg, title);
    if (file !== void 0) code[id] = { file };
  }
  return code;
}
function packageFor(id, elements, byName, byDirName) {
  const segments = id.split(".");
  for (let cut = segments.length - 1; cut > 0; cut -= 1) {
    const ancestor = elements[segments.slice(0, cut).join(".")];
    const title = typeof ancestor?.title === "string" ? ancestor.title.trim() : "";
    if (title === "") continue;
    const named = byName.get(title) ?? byDirName.get(title);
    if (named !== void 0) return named;
  }
  return void 0;
}
function codeFileFor(workspaceDir, pkg, title) {
  const clean = title.replace(/^\/+/u, "").replace(/\/+$/u, "");
  if (clean === "" || clean.includes(" ") || clean.includes("+")) return void 0;
  const bases = [`src/${clean}`, `src/client/${clean}`, clean];
  for (const base of bases) {
    for (const suffix of CODE_SUFFIXES) {
      if (existsSync(join2(workspaceDir, pkg.dir, `${base}${suffix}`))) return `${pkg.dir}/${base}${suffix}`;
    }
    for (const indexSuffix of [".ts", ".tsx"]) {
      if (existsSync(join2(workspaceDir, pkg.dir, base, `index${indexSuffix}`))) {
        return `${pkg.dir}/${base}/index${indexSuffix}`;
      }
    }
  }
  return void 0;
}
function readPackageDirs(workspaceDir) {
  const root = join2(workspaceDir, "packages");
  let names;
  try {
    names = readdirSync(root);
  } catch {
    return [];
  }
  const found = [];
  for (const dirName of names) {
    let manifest;
    try {
      manifest = JSON.parse(readFileSync(join2(root, dirName, "package.json"), "utf8"));
    } catch {
      continue;
    }
    const name2 = manifest?.name;
    found.push({
      ...typeof name2 === "string" && name2 !== "" ? { name: name2 } : {},
      dirName,
      dir: `packages/${dirName}`
    });
  }
  return found;
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
  const { viewports, viewport } = candidate;
  if (viewports !== void 0) {
    if (typeof viewports !== "object" || viewports === null || Array.isArray(viewports)) return void 0;
    for (const raw of Object.values(viewports)) {
      if (readArchViewport(raw) === null) return void 0;
    }
  } else if (readArchViewport(viewport) === null) {
    return void 0;
  }
  const state = readArchWorkspaceState(candidate);
  if (state === null) return void 0;
  return {
    ...state,
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
var WEB_SERVER_POLL_MS = 250;
var WEB_SERVER_WAIT_MS = 15e3;
function readService(ctx, name2) {
  const value = ctx.get?.(name2);
  return value === null ? void 0 : value;
}
function whenWebServer(host, register) {
  const found = () => readService(host, "webServer");
  const present = found();
  if (present !== void 0) {
    register(host, present);
    return;
  }
  const startedAt = Date.now();
  const timer = setInterval(() => {
    const webServer = found();
    if (webServer === void 0) {
      if (Date.now() - startedAt > WEB_SERVER_WAIT_MS) clearInterval(timer);
      return;
    }
    clearInterval(timer);
    register(host, webServer);
  }, WEB_SERVER_POLL_MS);
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
    const elements = data.elements ?? {};
    return toModelPayload({
      workspace,
      projectId: rendered.projectId,
      model: data,
      elementSources: collectElementSources(rendered.instance, workspace, new Set(Object.keys(elements))),
      elementCode: resolveElementCode(workspace, elements)
    });
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
  host.effect?.(() => () => {
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
