// src/host/git.ts
var DEFAULT_TIMEOUT_MS = 5e3;
var DEFAULT_MAX_BYTES = 64 * 1024;
var READ_ONLY_ENV = {
  GIT_TERMINAL_PROMPT: "0",
  GIT_PAGER: "cat",
  GIT_EXTERNAL_DIFF: ""
};
function createGitRunner(input) {
  const timeoutMs = input.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const maxBytes = input.maxBytes ?? DEFAULT_MAX_BYTES;
  return {
    async run(args, cwd) {
      const subprocess = input.subprocess;
      if (subprocess === void 0) return { argv: args, exitCode: null, stdout: "", timedOut: false };
      for (const arg of args) {
        if (typeof arg !== "string" || arg.includes("\0")) {
          throw new TypeError("term-dock git runner: argv entries must be NUL-free strings");
        }
      }
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), timeoutMs);
      try {
        const handle = subprocess.spawn({
          argv: ["git", ...args],
          cwd,
          env: READ_ONLY_ENV,
          graceMs: 500,
          signal: controller.signal,
          stdio: {
            stdin: "ignore",
            stdout: { collect: { maxBytes } },
            stderr: { collect: { maxBytes } }
          }
        });
        const { exitCode } = await handle.done;
        const stdout = handle.collected.stdout?.readFrom(0).text ?? "";
        return {
          argv: args,
          exitCode: controller.signal.aborted ? null : exitCode,
          stdout,
          timedOut: controller.signal.aborted
        };
      } catch {
        return { argv: args, exitCode: null, stdout: "", timedOut: false };
      } finally {
        clearTimeout(timer);
      }
    }
  };
}

// src/shared.ts
var PACKAGE_NAME = "dsh-term-dock";
var DOCK_SLOT = "conversation.composer.dock";
var DOCK_ID = "term-dock";
var ROUTE_PREFIX = "/term-dock/api";

// src/host/routes.ts
function fail(code, message, status) {
  return { status, body: { ok: false, code, message } };
}
function suffixOf(pathname) {
  if (pathname !== ROUTE_PREFIX && !pathname.startsWith(`${ROUTE_PREFIX}/`)) return void 0;
  return pathname.slice(ROUTE_PREFIX.length).replace(/^\/+/u, "").replace(/\/+$/u, "");
}
async function handleScopeRequest(deps, request) {
  const method = request.method.toUpperCase();
  const url = new URL(request.url, "http://term-dock.local");
  const suffix = suffixOf(url.pathname);
  if (suffix === void 0) return fail("bad-request", `no term-dock route for ${url.pathname}`, 404);
  if (method !== "GET") return fail("bad-request", `method ${method} is not allowed on ${suffix}`, 405);
  if (suffix !== "scope") return fail("bad-request", `no term-dock route for ${suffix}`, 404);
  const sessionId = url.searchParams.get("sessionId");
  if (sessionId === null || sessionId.trim() === "") {
    return fail("bad-request", "sessionId query parameter is required", 400);
  }
  if (sessionId.length > 256) return fail("bad-request", "sessionId is too long", 400);
  if (!await deps.scopes.knows(sessionId)) {
    return fail("no-session", `session ${sessionId} does not exist`, 404);
  }
  const resolved = await deps.scopes.resolve(sessionId);
  if (resolved === void 0) return fail("no-cwd", `session ${sessionId} has no working directory`, 409);
  return { status: 200, body: { ok: true, scope: resolved.scope, anchor: resolved.anchor } };
}
function registerTermDockRoutes(webServer, deps) {
  return webServer.register({
    kind: "prefix",
    path: ROUTE_PREFIX,
    handler: async (req, res) => {
      const response = await handleScopeRequest(deps, { method: req.method ?? "GET", url: req.url ?? "/" });
      const text = JSON.stringify(response.body);
      res.writeHead(response.status, {
        "content-type": "application/json; charset=utf-8",
        "content-length": Buffer.byteLength(text),
        "cache-control": "no-store"
      });
      res.end(text);
    }
  });
}

// src/host/scope.ts
import { realpath } from "node:fs/promises";
var ANCHOR_LIMIT = 256;
function createAnchorLedger() {
  const entries = /* @__PURE__ */ new Map();
  return {
    get: (key) => entries.get(key),
    set(key, sessionId) {
      if (entries.has(key)) {
        entries.set(key, sessionId);
        return;
      }
      entries.set(key, sessionId);
      while (entries.size > ANCHOR_LIMIT) {
        const oldest = entries.keys().next().value;
        if (oldest === void 0) return;
        entries.delete(oldest);
      }
    }
  };
}
async function canonical(dir) {
  try {
    return await realpath(dir);
  } catch {
    return dir;
  }
}
function firstLine(text) {
  const line = text.trim().split("\n")[0] ?? "";
  return line.trim();
}
async function readBranch(git, cwd) {
  const symbolic = await git.run(["symbolic-ref", "--quiet", "--short", "HEAD"], cwd);
  if (symbolic.exitCode === 0 && !symbolic.timedOut) {
    const branch = firstLine(symbolic.stdout);
    if (branch !== "") return { branch, detached: false };
  }
  const head = await git.run(["rev-parse", "--short=7", "HEAD"], cwd);
  if (head.exitCode === 0 && !head.timedOut) {
    const sha = firstLine(head.stdout);
    if (sha !== "") return { branch: `detached@${sha}`, detached: true };
  }
  return { branch: null, detached: false };
}
function scopeKey(workspace, branch) {
  return `${workspace}::${branch ?? "(no-branch)"}`;
}
async function resolveScope(sessionId, input) {
  const directory = await sessionDirectory(sessionId, input);
  if (directory === void 0) return void 0;
  const workspace = await canonical(directory);
  const { branch, detached } = await readBranch(input.git, workspace);
  const scope = { key: scopeKey(workspace, branch), workspace, branch, detached };
  const remembered = input.anchors.get(scope.key);
  const anchor = remembered !== void 0 && await sessionExists(remembered, input) ? remembered : sessionId;
  input.anchors.set(scope.key, anchor);
  return { scope, anchor };
}
async function sessionDirectory(sessionId, input) {
  const live = input.sessions?.get(sessionId)?.header?.cwd;
  if (typeof live === "string" && live !== "") return live;
  try {
    const persisted = (await input.persistence?.stat(sessionId))?.header?.cwd;
    if (typeof persisted === "string" && persisted !== "") return persisted;
  } catch {
  }
  return void 0;
}
async function sessionExists(sessionId, input) {
  if (sessionId === "") return false;
  if (input.sessions?.get(sessionId) !== void 0) return true;
  try {
    return await input.persistence?.stat(sessionId) !== void 0;
  } catch {
    return false;
  }
}
function createScopeResolver(input) {
  return {
    resolve: (sessionId) => resolveScope(sessionId, input),
    knows: (sessionId) => sessionExists(sessionId, input)
  };
}

// src/index.ts
var name = PACKAGE_NAME;
var inject = ["subprocess", "sessions", "sessionPersistence"];
var WEB_SERVER_POLL_MS = 250;
var WEB_SERVER_WAIT_MS = 15e3;
function readService(ctx, serviceName) {
  const value = ctx.get?.(serviceName);
  return value === null ? void 0 : value;
}
function asSubprocess(value) {
  if (value === null || typeof value !== "object") return void 0;
  return typeof value.spawn === "function" ? value : void 0;
}
function whenWebServer(ctx, register) {
  const found = () => {
    const service = readService(ctx, "webServer");
    if (service === null || typeof service !== "object") return void 0;
    return typeof service.register === "function" ? service : void 0;
  };
  const immediate = found();
  if (immediate !== void 0) {
    register(immediate);
    return () => {
    };
  }
  let stopped = false;
  const started = Date.now();
  const timer = setInterval(() => {
    if (stopped) return;
    const webServer = found();
    if (webServer !== void 0) {
      stopped = true;
      clearInterval(timer);
      register(webServer);
      return;
    }
    if (Date.now() - started > WEB_SERVER_WAIT_MS) {
      stopped = true;
      clearInterval(timer);
    }
  }, WEB_SERVER_POLL_MS);
  timer.unref?.();
  return () => {
    stopped = true;
    clearInterval(timer);
  };
}
function apply(ctx) {
  const scopes = createScopeResolver({
    git: createGitRunner({ subprocess: asSubprocess(readService(ctx, "subprocess")) }),
    sessions: readService(ctx, "sessions"),
    persistence: readService(ctx, "sessionPersistence"),
    anchors: createAnchorLedger()
  });
  const cancelWait = whenWebServer(ctx, (webServer) => {
    const unregister = registerTermDockRoutes(webServer, { scopes });
    ctx.effect?.(() => unregister);
  });
  ctx.effect?.(() => () => cancelWait());
}
function describe() {
  return { name: PACKAGE_NAME, slot: DOCK_SLOT, id: DOCK_ID };
}
export {
  DOCK_ID,
  DOCK_SLOT,
  PACKAGE_NAME,
  apply,
  describe,
  inject,
  name
};
