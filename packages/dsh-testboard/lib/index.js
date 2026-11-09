// src/index.ts
import { access, readFile as readFile2, stat } from "node:fs/promises";
import { readFileSync } from "node:fs";
import { basename, join as join2 } from "node:path";

// src/host/run-engine.ts
import { readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

// src/host/vitest.ts
import { posix } from "node:path";
var SNAPSHOT_VERSION = 2;
function buildVitestArgv(options) {
  const argv = [
    posix.join(options.workspace, "node_modules", ".bin", "vitest"),
    "run"
  ];
  if (options.scope.kind === "file") argv.push(options.scope.path);
  argv.push("--reporter=verbose", "--reporter=json", "--outputFile", options.outputFile);
  return argv;
}
function packageNameOf(path) {
  const match = /^packages\/([^/]+)\//u.exec(path);
  return match?.[1] ?? ".";
}
function lineOfCase(text, title) {
  if (title === "") return 0;
  const needles = [`it("${title}"`, `test("${title}"`, `it('${title}'`, `test('${title}'`];
  let offset = -1;
  for (const needle of needles) {
    const found = text.indexOf(needle);
    if (found !== -1 && (offset === -1 || found < offset)) offset = found;
  }
  if (offset === -1) return 0;
  let line = 1;
  for (let index = 0; index < offset; index += 1) {
    if (text[index] === "\n") line += 1;
  }
  return line;
}
function toStatus(raw) {
  if (raw === "passed") return "passed";
  if (raw === "failed") return "failed";
  return "skipped";
}
function toRelativePath(raw, workspace) {
  const normalized = raw.split("\\").join("/");
  const root = workspace.split("\\").join("/").replace(/\/+$/u, "");
  if (normalized === root) return "";
  if (normalized.startsWith(`${root}/`)) return normalized.slice(root.length + 1);
  return normalized;
}
function parseVitestJson(raw, options) {
  const payload = typeof raw === "string" ? JSON.parse(raw) : raw;
  const results = payload?.testResults;
  const files = Array.isArray(results) ? results : [];
  const byPackage = /* @__PURE__ */ new Map();
  for (const file of files) {
    if (typeof file !== "object" || file === null) continue;
    if (typeof file.name !== "string" || file.name === "") continue;
    const path = toRelativePath(file.name, options.workspace);
    if (path === "") continue;
    const text = options.fileTextOf?.(path);
    const assertions = Array.isArray(file.assertionResults) ? file.assertionResults : [];
    const cases = [];
    for (const assertion of assertions) {
      if (typeof assertion !== "object" || assertion === null) continue;
      const title = typeof assertion.title === "string" ? assertion.title : void 0;
      if (title === void 0 || title === "") continue;
      const durationMs = typeof assertion.duration === "number" && Number.isFinite(assertion.duration) ? assertion.duration : 0;
      const message = Array.isArray(assertion.failureMessages) ? assertion.failureMessages.filter((entry) => typeof entry === "string").join("\n") : "";
      cases.push({
        path,
        name: title,
        line: text === void 0 ? 0 : lineOfCase(text, title),
        status: toStatus(assertion.status),
        durationMs,
        ...message === "" ? {} : { message }
      });
    }
    const packageName = packageNameOf(path);
    const bucket = byPackage.get(packageName);
    if (bucket === void 0) byPackage.set(packageName, [{ path, cases }]);
    else bucket.push({ path, cases });
  }
  const packages = [...byPackage.entries()].sort(([left], [right]) => left < right ? -1 : left > right ? 1 : 0).map(([name2, packageFiles]) => ({
    name: name2,
    files: packageFiles.sort((left, right) => left.path < right.path ? -1 : left.path > right.path ? 1 : 0)
  }));
  return {
    version: SNAPSHOT_VERSION,
    statusSource: "vitest",
    packages,
    workspace: options.workspace,
    ...options.generatedAt === void 0 ? {} : { generatedAt: options.generatedAt },
    ...options.wallClockMs === void 0 ? {} : { wallClockMs: options.wallClockMs }
  };
}
function runFailed(snapshot, exitCode) {
  if (exitCode !== null && exitCode !== 0) return true;
  if (snapshot === void 0) return true;
  return snapshot.packages.some((pkg) => pkg.files.some((file) => file.cases.some((entry) => entry.status === "failed")));
}
function stripAnsi(line) {
  return line.replace(/\u001B\[[0-9;]*[A-Za-z]/gu, "");
}
function parseDuration(raw) {
  if (raw === void 0) return 0;
  const match = /^([0-9]+(?:\.[0-9]+)?)(ms|s)$/u.exec(raw);
  if (match === null) return 0;
  const value = Number.parseFloat(match[1] ?? "0");
  return match[2] === "s" ? value * 1e3 : value;
}
function splitLocation(location) {
  const segments = location.split(" > ");
  if (segments.length < 2) return void 0;
  const path = segments[0]?.trim() ?? "";
  const name2 = segments[segments.length - 1]?.trim() ?? "";
  if (path === "" || name2 === "") return void 0;
  return { path, name: name2 };
}
function parseVerboseLine(line) {
  const cleaned = stripAnsi(line);
  const match = /^\s*([✓×↓])\s+(.+)$/u.exec(cleaned);
  if (match !== null) {
    const marker = match[1];
    const rest = match[2] ?? "";
    const withDuration = /^(.*?)\s+([0-9]+(?:\.[0-9]+)?(?:ms|s))$/u.exec(rest);
    const location = withDuration === null ? rest : withDuration[1] ?? "";
    const durationMs = withDuration === null ? 0 : parseDuration(withDuration[2]);
    const split = splitLocation(location);
    if (split === void 0) return void 0;
    const status = marker === "\u2713" ? "passed" : marker === "\xD7" ? "failed" : "skipped";
    return { kind: "case", path: split.path, name: split.name, status, durationMs };
  }
  const failure = /^\s*FAIL\s+(.+)$/u.exec(cleaned);
  if (failure !== null) {
    const split = splitLocation(failure[1] ?? "");
    if (split === void 0) return void 0;
    return { kind: "failure", path: split.path, name: split.name };
  }
  return void 0;
}
function parseVerboseOutput(text) {
  const events = [];
  for (const line of text.split("\n")) {
    const event = parseVerboseLine(line);
    if (event !== void 0) events.push(event);
  }
  return events;
}

// src/host/run-engine.ts
var MAX_STREAM_BYTES = 4 * 1024 * 1024;
var GRACE_MS = 500;
var STREAM_POLL_MS = 200;
var SERIES_BUCKET_MS = 1e3;
function createRunEngine(options) {
  const now = options.now ?? Date.now;
  const entries = /* @__PURE__ */ new Map();
  function entryOf(workspace) {
    const existing = entries.get(workspace);
    if (existing !== void 0) return existing;
    const created = { runCount: 0 };
    entries.set(workspace, created);
    return created;
  }
  function readStream(reader) {
    if (reader === void 0) return "";
    return reader.readFrom(0).text;
  }
  function readNew(reader, cursor) {
    if (reader === void 0) return { text: "", next: cursor };
    const read = reader.readFrom(cursor);
    return { text: read.text, next: cursor + read.text.length };
  }
  function countsOf(cases) {
    let passed = 0;
    let failed = 0;
    let skipped = 0;
    for (const entry of cases) {
      if (entry.status === "failed") failed += 1;
      else if (entry.status === "skipped") skipped += 1;
      else passed += 1;
    }
    return { passed, failed, skipped, total: cases.length };
  }
  function seriesOf(cases, elapsedMs) {
    if (cases.length === 0) return [];
    const spanMs = Math.max(elapsedMs, cases[cases.length - 1]?.atMs ?? 0);
    const buckets = Math.floor(spanMs / SERIES_BUCKET_MS) + 1;
    const points = [];
    let cursor = 0;
    let passed = 0;
    let failed = 0;
    for (let index = 0; index < buckets; index += 1) {
      const until = (index + 1) * SERIES_BUCKET_MS;
      while (cursor < cases.length && (cases[cursor]?.atMs ?? 0) < until) {
        const entry = cases[cursor];
        if (entry !== void 0) {
          if (entry.status === "failed") failed += 1;
          else if (entry.status === "passed") passed += 1;
        }
        cursor += 1;
      }
      points.push({ tMs: index * SERIES_BUCKET_MS, finished: cursor, passed, failed });
    }
    return points;
  }
  function progressOf(base, live, elapsedMs) {
    return {
      runId: base.runId,
      scope: base.scope,
      status: "running",
      phase: "running",
      runNumber: base.runNumber,
      startedAt: base.startedAt,
      elapsedMs,
      completedFiles: live.completedFiles,
      totalFiles: base.totalFiles,
      counts: countsOf(live.cases),
      series: seriesOf(live.cases, elapsedMs),
      failures: [...live.failures],
      cases: [...live.cases]
    };
  }
  function mergeScoped(previous, incoming, scopePath) {
    if (previous === void 0) return incoming;
    const replacement = incoming.packages.flatMap((pkg) => pkg.files).find((file) => file.path === scopePath);
    if (replacement === void 0) return previous;
    const byPackage = /* @__PURE__ */ new Map();
    for (const pkg of previous.packages) {
      for (const file of pkg.files) {
        if (file.path === scopePath) continue;
        const bucket2 = byPackage.get(pkg.name);
        if (bucket2 === void 0) byPackage.set(pkg.name, [file]);
        else bucket2.push(file);
      }
    }
    const packageName = incoming.packages.find((pkg) => pkg.files.some((file) => file.path === scopePath))?.name ?? ".";
    const bucket = byPackage.get(packageName);
    if (bucket === void 0) byPackage.set(packageName, [replacement]);
    else bucket.push(replacement);
    const packages = [...byPackage.entries()].sort(([left], [right]) => left < right ? -1 : left > right ? 1 : 0).map(([name2, files]) => ({
      name: name2,
      files: [...files].sort((left, right) => left.path < right.path ? -1 : left.path > right.path ? 1 : 0)
    }));
    return { ...incoming, packages };
  }
  async function execute(workspace, scope, runId, entry) {
    const controller = new AbortController();
    entry.controller = controller;
    const startedAtMs = now();
    const outputFile = join(tmpdir(), `dsh-testboard-${runId}.json`);
    const startedAt = new Date(startedAtMs).toISOString();
    entry.runCount += 1;
    const base = {
      runId,
      scope,
      runNumber: entry.runCount,
      startedAt,
      totalFiles: scope.kind === "file" ? 1 : null
    };
    const live = { cases: [], failures: [], completedFiles: 0 };
    let pending = "";
    const finishedFiles = /* @__PURE__ */ new Set();
    entry.run = progressOf(base, live, 0);
    const absorb = (chunk) => {
      const combined = pending + chunk;
      const lastBreak = combined.lastIndexOf("\n");
      if (lastBreak === -1) {
        pending = combined;
        return;
      }
      pending = combined.slice(lastBreak + 1);
      const complete = combined.slice(0, lastBreak);
      for (const event of parseVerboseOutput(complete)) {
        const atMs = Math.max(0, now() - startedAtMs);
        if (event.kind === "case") {
          live.cases.push({
            path: event.path,
            name: event.name,
            status: event.status,
            durationMs: event.durationMs,
            atMs
          });
          finishedFiles.add(event.path);
        } else {
          live.failures.push({ tMs: atMs, path: event.path, name: event.name });
        }
      }
      live.completedFiles = finishedFiles.size;
    };
    const flush = () => {
      if (pending === "") return;
      const tail = pending;
      pending = "";
      absorb(`${tail}
`);
    };
    const settle = (phase, status, message) => {
      const elapsedMs = Math.max(0, now() - startedAtMs);
      entry.run = {
        ...progressOf(base, live, elapsedMs),
        status,
        phase,
        elapsedMs,
        series: seriesOf(live.cases, elapsedMs),
        ...phase === "running" ? {} : { finishedAt: new Date(now()).toISOString() },
        ...message === void 0 ? {} : { message }
      };
      entry.controller = void 0;
    };
    try {
      const handle = options.subprocess.spawn({
        argv: buildVitestArgv({ workspace, scope, outputFile }),
        cwd: workspace,
        stdio: {
          // A test run must never wait on input: a prompt with no stdin is a
          // hang, and a hang is indistinguishable from a slow suite.
          stdin: "ignore",
          stdout: { collect: { maxBytes: MAX_STREAM_BYTES } },
          stderr: { collect: { maxBytes: MAX_STREAM_BYTES } }
        },
        graceMs: GRACE_MS,
        signal: controller.signal
      });
      let cursor = 0;
      const stdoutReader = handle.collected.stdout;
      const drain = () => {
        const { text, next } = readNew(stdoutReader, cursor);
        cursor = next;
        if (text === "") return;
        absorb(text);
        entry.run = progressOf(base, live, Math.max(0, now() - startedAtMs));
      };
      const poll = setInterval(drain, STREAM_POLL_MS);
      let exitCode = null;
      try {
        ({ exitCode } = await handle.done);
      } catch (error) {
        clearInterval(poll);
        if (controller.signal.aborted) {
          settle("cancelled", "cancelled");
          return;
        }
        throw error;
      }
      clearInterval(poll);
      drain();
      flush();
      entry.run = progressOf(base, live, Math.max(0, now() - startedAtMs));
      if (controller.signal.aborted) {
        settle("cancelled", "cancelled");
        return;
      }
      let raw;
      try {
        raw = await readFile(outputFile, "utf8");
      } catch {
        const stderr = readStream(handle.collected.stderr).trim();
        settle("error", "error", stderr === "" ? "vitest produced no report" : stderr.split("\n").slice(-8).join("\n"));
        return;
      }
      const parsed = parseVitestJson(raw, {
        workspace,
        ...options.fileTextOf === void 0 ? {} : { fileTextOf: (path) => options.fileTextOf?.(workspace, path) },
        generatedAt: new Date(now()).toISOString(),
        wallClockMs: Math.max(0, now() - startedAtMs)
      });
      entry.snapshot = scope.kind === "file" ? mergeScoped(entry.snapshot, parsed, scope.path) : parsed;
      settle("finished", runFailed(parsed, exitCode) ? "failed" : "passed");
    } catch (error) {
      settle("error", "error", error instanceof Error ? error.message : String(error));
    } finally {
      await rm(outputFile, { force: true });
    }
  }
  return {
    getState(workspace) {
      const entry = entries.get(workspace);
      if (entry === void 0) return {};
      return {
        ...entry.snapshot === void 0 ? {} : { snapshot: entry.snapshot },
        ...entry.run === void 0 ? {} : { run: entry.run }
      };
    },
    start(workspace, scope) {
      const entry = entryOf(workspace);
      if (entry.run?.phase === "running") return { ok: false, error: "busy" };
      const runId = `run-${now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
      const done = execute(workspace, scope, runId, entry);
      return { ok: true, runId, done };
    },
    cancel(workspace) {
      const entry = entries.get(workspace);
      const controller = entry?.controller;
      if (controller === void 0) return false;
      controller.abort();
      return true;
    }
  };
}

// src/host/routes.ts
import { posix as posix2 } from "node:path";

// src/shared.ts
var PACKAGE_NAME = "dsh-testboard";
var ROUTE_PREFIX = "/testboard/api";
var MAX_SOURCE_BYTES = 2 * 1024 * 1024;

// src/host/routes.ts
var MAX_BODY_BYTES = 64 * 1024;
function safeRelativePath(raw) {
  if (raw === "") return void 0;
  const normalized = posix2.normalize(raw.split("\\").join("/"));
  if (normalized === "" || normalized === ".") return void 0;
  if (normalized.startsWith("/") || normalized.startsWith("../") || normalized === "..") return void 0;
  return normalized;
}
function coerceScope(raw) {
  if (typeof raw !== "object" || raw === null) return void 0;
  const candidate = raw;
  if (candidate.kind === "all") return { kind: "all" };
  if (candidate.kind !== "file") return void 0;
  if (typeof candidate.path !== "string") return void 0;
  const path = safeRelativePath(candidate.path);
  return path === void 0 ? void 0 : { kind: "file", path };
}
function sessionIdOf(url) {
  const raw = url.searchParams.get("sessionId");
  return raw === null || raw === "" ? void 0 : raw;
}
function fail(status, error) {
  return { status, body: { error } };
}
async function handleRequest(deps, request) {
  const url = new URL(request.url, "http://testboard.local");
  const suffix = url.pathname.slice(ROUTE_PREFIX.length).replace(/^\/+/u, "").replace(/\/+$/u, "");
  const method = request.method.toUpperCase();
  try {
    if (suffix === "state" || suffix === "run") {
      if (method === "GET") {
        const sessionId = sessionIdOf(url);
        if (sessionId === void 0) return fail(400, "sessionId query parameter is required");
        const workspace = await deps.resolveWorkspaceRoot(sessionId);
        if (workspace === void 0) return { status: 200, body: { error: "no-session" } };
        return { status: 200, body: await deps.readState(workspace) };
      }
      if (method === "POST" && suffix === "run") {
        const body = request.body ?? {};
        if (typeof body.sessionId !== "string" || body.sessionId === "") {
          return fail(400, "sessionId is required in the body");
        }
        const workspace = await deps.resolveWorkspaceRoot(body.sessionId);
        if (workspace === void 0) {
          return { status: 200, body: { ok: false, error: "no-session" } };
        }
        const scope = coerceScope(body.scope);
        if (scope === void 0) return fail(400, "bad-scope");
        return { status: 200, body: await deps.startRun(workspace, scope) };
      }
      return fail(405, `method ${method} is not allowed on ${suffix}`);
    }
    if (suffix === "cancel") {
      if (method !== "POST") return fail(405, `method ${method} is not allowed on cancel`);
      const body = request.body ?? {};
      if (typeof body.sessionId !== "string" || body.sessionId === "") {
        return fail(400, "sessionId is required in the body");
      }
      const workspace = await deps.resolveWorkspaceRoot(body.sessionId);
      if (workspace === void 0) return { status: 200, body: { ok: false } };
      return { status: 200, body: { ok: deps.cancelRun(workspace) } };
    }
    if (suffix === "source") {
      if (method !== "GET") return fail(405, `method ${method} is not allowed on source`);
      const sessionId = sessionIdOf(url);
      if (sessionId === void 0) return fail(400, "sessionId query parameter is required");
      const rawPath = url.searchParams.get("path");
      if (rawPath === null || rawPath === "") return fail(400, "path query parameter is required");
      const path = safeRelativePath(rawPath);
      if (path === void 0) return fail(400, "path escapes the workspace");
      const workspace = await deps.resolveWorkspaceRoot(sessionId);
      if (workspace === void 0) return fail(404, "unknown session");
      const text = await deps.readSource(workspace, path);
      if (text === void 0) return fail(404, `no such file ${path}`);
      if (Buffer.byteLength(text, "utf8") > MAX_SOURCE_BYTES) return fail(413, "file is too large to preview");
      return { status: 200, body: { text } };
    }
    return fail(404, `no testboard route for ${method} ${url.pathname}`);
  } catch (error) {
    return fail(500, error instanceof Error ? error.message : String(error));
  }
}
function registerTestboardRoutes(webServer, deps) {
  return webServer.register({
    kind: "prefix",
    path: ROUTE_PREFIX,
    handler: async (req, res) => {
      let body;
      try {
        body = await readJsonBody(req);
      } catch (error) {
        sendJson(res, 400, { error: error instanceof Error ? error.message : String(error) });
        return;
      }
      const response = await handleRequest(deps, { method: req.method ?? "GET", url: req.url ?? "/", body });
      sendJson(res, response.status, response.body);
    }
  });
}
function sendJson(res, status, body) {
  const text = JSON.stringify(body);
  res.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "content-length": Buffer.byteLength(text),
    "cache-control": "no-store"
  });
  res.end(text);
}
async function readJsonBody(req) {
  if (req.method !== "POST") return void 0;
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

// src/host/workspace.ts
import { realpath } from "node:fs/promises";
async function canonicalPath(dir) {
  try {
    return await realpath(dir);
  } catch {
    return dir;
  }
}
async function resolveSessionRoot(sessionId, sessions, persistence) {
  const live = sessions?.get(sessionId)?.header?.cwd;
  if (typeof live === "string" && live !== "") return canonicalPath(live);
  try {
    const persisted = (await persistence?.stat(sessionId))?.header?.cwd;
    if (typeof persisted === "string" && persisted !== "") return canonicalPath(persisted);
  } catch {
  }
  return void 0;
}

// src/index.ts
var name = PACKAGE_NAME;
var inject = ["subprocess", "sessions", "sessionPersistence"];
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
    register(present);
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
    register(webServer);
  }, WEB_SERVER_POLL_MS);
}
async function hasVitest(workspace) {
  try {
    await access(join2(workspace, "node_modules", ".bin", "vitest"));
    return true;
  } catch {
    return false;
  }
}
async function isDirectory(path) {
  try {
    return (await stat(path)).isDirectory();
  } catch {
    return false;
  }
}
function readWorkspaceFileSync(workspace, path) {
  try {
    return readFileSync(join2(workspace, path), "utf8");
  } catch {
    return void 0;
  }
}
async function readWorkspaceFile(workspace, path) {
  try {
    const info = await stat(join2(workspace, path));
    if (!info.isFile()) return void 0;
    return await readFile2(join2(workspace, path), "utf8");
  } catch {
    return void 0;
  }
}
function apply(ctx) {
  const host = ctx;
  whenWebServer(host, (webServer) => {
    const sessions = readService(host, "sessions");
    const sessionPersistence = readService(host, "sessionPersistence");
    const subprocess = readService(host, "subprocess");
    const engine = createRunEngine({
      subprocess: subprocess ?? {
        // A host without a subprocess service cannot run anything. The engine is
        // still built so state reads work; `startRun` refuses before reaching it.
        spawn: () => ({ done: Promise.reject(new Error("no subprocess service")), collected: {} })
      },
      fileTextOf: (workspace, path) => readWorkspaceFileSync(workspace, path)
    });
    async function resolveWorkspaceRoot(sessionId) {
      return resolveSessionRoot(sessionId, sessions, sessionPersistence);
    }
    async function readState(workspace) {
      if (!await isDirectory(workspace)) return { workspace, error: "unknown-workspace" };
      const state = engine.getState(workspace);
      return {
        workspace,
        workspaceName: basename(workspace),
        ...state,
        // The last run's error is also the board's: a reader who reloads after a
        // crashed run must still see why the numbers are stale.
        ...state.run?.status === "error" ? { error: "run-failed" } : {}
      };
    }
    async function startRun(workspace, scope) {
      if (subprocess === void 0) return { ok: false, error: "no-subprocess" };
      if (!await hasVitest(workspace)) return { ok: false, error: "no-vitest" };
      const started = engine.start(workspace, scope);
      return started.ok ? { ok: true, runId: started.runId } : started;
    }
    const deps = {
      resolveWorkspaceRoot,
      readState,
      startRun,
      cancelRun: (workspace) => engine.cancel(workspace),
      readSource: (workspace, path) => readWorkspaceFile(workspace, path)
    };
    const unregister = registerTestboardRoutes(webServer, deps);
    host.effect?.(() => () => {
      unregister();
    });
  });
}
var index_default = { name, inject, apply };
export {
  PACKAGE_NAME,
  apply,
  index_default as default,
  inject,
  name
};
