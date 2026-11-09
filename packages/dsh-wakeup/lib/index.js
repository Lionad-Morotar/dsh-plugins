// src/index.ts
import { randomUUID } from "node:crypto";
import { mkdirSync, readdirSync, readFileSync, renameSync, watch } from "node:fs";
import { join } from "node:path";
var name = "wakeup";
var inject = [];
var ROUTE_PREFIX = "/wakeup/api";
var STATUS_PATH = `${ROUTE_PREFIX}/status`;
var BODY_LIMIT = 64 * 1024;
var WATCH_POLL_MS = 15e3;
var WAKE_TIMEOUT_MS = 3e4;
var STATUS_PROBE_TIMEOUT_MS = 1e4;
var DELIVER_SUBAGENT_PROMPT = /* @__PURE__ */ Symbol.for("dsh.subagent.deliverPrompt");
function readService(ctx, serviceName) {
  if (typeof ctx.get !== "function") return void 0;
  const value = ctx.get(serviceName);
  return value === null ? void 0 : value;
}
function requireService(ctx, serviceName) {
  const service = readService(ctx, serviceName);
  if (service === void 0) throw new Error(`${serviceName} service unavailable`);
  return service;
}
function errorMessage(error) {
  return error instanceof Error ? error.message : String(error);
}
function whenWebServer(ctx, register) {
  const found = () => readService(ctx, "webServer");
  const present = found();
  if (present !== void 0) {
    register(ctx, present);
    return;
  }
  const startedAt = Date.now();
  const timer = setInterval(() => {
    const webServer = found();
    if (webServer === void 0) {
      if (Date.now() - startedAt > WATCH_POLL_MS) clearInterval(timer);
      return;
    }
    clearInterval(timer);
    register(ctx, webServer);
  }, 250);
}
function resolveRoute(value) {
  if (typeof value !== "string" || value.length === 0) return null;
  if (!value.startsWith("@file:")) return value;
  try {
    const id = readFileSync(value.slice(6).trim(), "utf8").trim();
    return id.length > 0 ? id : null;
  } catch {
    return null;
  }
}
function buildMessage(text, source, meta) {
  return {
    id: randomUUID(),
    role: "user",
    content: [{ type: "text", text }],
    source: { kind: "wakeup", channel: source, ...meta ? { meta } : {} }
  };
}
function buildSource(source, meta) {
  return { kind: "wakeup", channel: source, ...meta ? { meta } : {} };
}
function findLiveAgent(ctx, sessionId) {
  const agents = readService(ctx, "agents");
  if (agents === void 0) return null;
  if (typeof agents.get === "function") {
    const found = agents.get(sessionId);
    if (found !== void 0 && found !== null) return found;
  }
  return agents.list().find((agent) => agent.id === sessionId) ?? null;
}
function pickRunningAgent(agents) {
  const running = agents.list().filter((agent) => agent?.status === "running");
  const root = running.find((agent) => agent?.session?.header?.origin !== "subagent");
  return root ?? running[0] ?? null;
}
function hasResume(ctx) {
  const agents = readService(ctx, "agents");
  return agents !== void 0 && typeof agents.resume === "function";
}
function hasDeliverPrompt(ctx) {
  const subagents = readService(ctx, "subagents");
  return subagents !== void 0 && typeof subagents[DELIVER_SUBAGENT_PROMPT] === "function";
}
async function readSessionHeader(ctx, sessionId, signal) {
  const query = readService(ctx, "sessionQuery");
  if (query === void 0 || typeof query.observeSession !== "function") {
    return { parentSession: null, readable: false };
  }
  let observation;
  try {
    observation = await query.observeSession(sessionId, { signal });
  } catch {
    return { parentSession: null, readable: false };
  }
  try {
    const parent = observation?.header?.parentSession;
    return {
      parentSession: typeof parent === "string" && parent.length > 0 ? parent : null,
      readable: true
    };
  } finally {
    const release = observation?.[Symbol.dispose];
    if (typeof release === "function") {
      try {
        ;
        release.call(observation);
      } catch {
      }
    }
  }
}
async function readParentSessionId(ctx, sessionId, signal) {
  return (await readSessionHeader(ctx, sessionId, signal)).parentSession;
}
async function resumeAgent(ctx, sessionId, signal) {
  const agents = requireService(ctx, "agents");
  if (typeof agents.resume !== "function") {
    throw new Error(`session ${sessionId} is not running and the host cannot resume it`);
  }
  try {
    await agents.resume({ resumeSessionId: sessionId, signal });
  } catch (error) {
    const raced = findLiveAgent(ctx, sessionId);
    if (raced !== null) return raced;
    throw new Error(`session ${sessionId} is not running and resume failed: ${errorMessage(error)}`);
  }
  const resumed = findLiveAgent(ctx, sessionId);
  if (resumed === null) throw new Error(`session ${sessionId} resumed but is not live in the agents registry`);
  return resumed;
}
async function ensureLiveAgent(ctx, sessionId, signal) {
  return findLiveAgent(ctx, sessionId) ?? await resumeAgent(ctx, sessionId, signal);
}
async function deliver(ctx, request, fallbackSource) {
  const text = String(request.text ?? "").trim();
  if (!text) throw new Error("text is required");
  const source = request.source ?? fallbackSource ?? "external";
  const targetId = request.sessionId ?? resolveRoute(request.routes?.[source]);
  if (targetId === null) {
    const agent = pickRunningAgent(requireService(ctx, "agents"));
    if (agent === null) throw new Error("no running session");
    agent.steer(buildMessage(text, source, request.meta));
    return { sessionId: agent.id, via: "steer" };
  }
  const signal = AbortSignal.timeout(WAKE_TIMEOUT_MS);
  const live = findLiveAgent(ctx, targetId);
  if (live !== null) {
    live.steer(buildMessage(text, source, request.meta));
    return { sessionId: targetId, via: "steer" };
  }
  const parentId = await readParentSessionId(ctx, targetId, signal);
  const subagents = readService(ctx, "subagents");
  const deliverPrompt = subagents?.[DELIVER_SUBAGENT_PROMPT];
  if (parentId !== null && subagents !== void 0 && typeof deliverPrompt === "function") {
    const parent = await ensureLiveAgent(ctx, parentId, signal);
    await deliverPrompt.call(
      subagents,
      parent,
      targetId,
      [{ type: "text", text }],
      buildSource(source, request.meta),
      signal,
      "steer"
    );
    return { sessionId: targetId, via: "cold-resume" };
  }
  const resumed = await resumeAgent(ctx, targetId, signal);
  resumed.steer(buildMessage(text, source, request.meta));
  return { sessionId: targetId, via: "root-resume" };
}
async function probeTarget(ctx, source, configured, signal) {
  const sessionId = resolveRoute(configured);
  if (sessionId === null) {
    return {
      source,
      configured,
      sessionId: null,
      live: false,
      parentSession: null,
      parentLive: false,
      headerReadable: false,
      via: "unreachable",
      deliverable: false,
      error: configured === null ? "route not configured" : "@file route is empty or unreadable"
    };
  }
  if (findLiveAgent(ctx, sessionId) !== null) {
    return {
      source,
      configured,
      sessionId,
      live: true,
      parentSession: null,
      parentLive: false,
      headerReadable: true,
      via: "steer",
      deliverable: true
    };
  }
  const header = await readSessionHeader(ctx, sessionId, signal);
  const parentLive = header.parentSession !== null && findLiveAgent(ctx, header.parentSession) !== null;
  const canColdResume = header.parentSession !== null && hasDeliverPrompt(ctx) && (parentLive || hasResume(ctx));
  const via = canColdResume ? "cold-resume" : hasResume(ctx) ? "root-resume" : "unreachable";
  return {
    source,
    configured,
    sessionId,
    live: false,
    parentSession: header.parentSession,
    parentLive,
    headerReadable: header.readable,
    via,
    deliverable: via !== "unreachable",
    ...via === "unreachable" ? { error: "target is not live and the host can neither cold-resume nor resume it" } : {}
  };
}
async function buildStatus(ctx, routes) {
  const signal = AbortSignal.timeout(STATUS_PROBE_TIMEOUT_MS);
  const targets = {};
  for (const [source, configured] of Object.entries(routes)) {
    const value = typeof configured === "string" ? configured : null;
    try {
      targets[source] = await probeTarget(ctx, source, value, signal);
    } catch (error) {
      targets[source] = {
        source,
        configured: value,
        sessionId: null,
        live: false,
        parentSession: null,
        parentLive: false,
        headerReadable: false,
        via: "unreachable",
        deliverable: false,
        error: errorMessage(error)
      };
    }
  }
  let fallbackId = null;
  try {
    const agents = readService(ctx, "agents");
    fallbackId = agents === void 0 ? null : pickRunningAgent(agents)?.id ?? null;
  } catch {
  }
  return {
    ok: true,
    routes: targets,
    fallback: { sessionId: fallbackId },
    services: {
      agents: readService(ctx, "agents") !== void 0,
      sessionQuery: readService(ctx, "sessionQuery") !== void 0,
      subagents: readService(ctx, "subagents") !== void 0,
      deliverPrompt: hasDeliverPrompt(ctx)
    },
    probedAt: (/* @__PURE__ */ new Date()).toISOString()
  };
}
function requestPath(req) {
  const raw = typeof req?.url === "string" ? req.url : "";
  const queryIndex = raw.indexOf("?");
  const path = queryIndex === -1 ? raw : raw.slice(0, queryIndex);
  return path.length > 1 && path.endsWith("/") ? path.slice(0, -1) : path;
}
function isStatusRequest(req) {
  const path = requestPath(req);
  return path === STATUS_PATH || path === "/status";
}
function apply(ctx, config = {}) {
  const token = typeof config.token === "string" && config.token.length > 0 ? config.token : null;
  const auth = (req) => token === null || req.headers?.authorization === `Bearer ${token}`;
  const routes = config.routes && typeof config.routes === "object" ? config.routes : {};
  function sendJson(res, status, body) {
    res.writeHead(status, { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" });
    res.end(JSON.stringify(body));
  }
  async function readBody(req) {
    const chunks = [];
    let size = 0;
    for await (const chunk of req) {
      size += chunk.length;
      if (size > BODY_LIMIT) throw new Error("body too large");
      chunks.push(chunk);
    }
    return Buffer.concat(chunks).toString("utf8");
  }
  const deliverOnce = (request, source) => deliver(ctx, routes ? { ...request, routes } : request, source);
  whenWebServer(ctx, (_ready, webServer) => {
    webServer.register({
      kind: "prefix",
      path: ROUTE_PREFIX,
      handler: async (req, res) => {
        try {
          if (req.method === "GET" && isStatusRequest(req)) {
            if (!auth(req)) {
              sendJson(res, 401, { ok: false, error: "unauthorized" });
              return;
            }
            sendJson(res, 200, await buildStatus(ctx, routes));
            return;
          }
          if (req.method !== "POST") {
            sendJson(res, 405, { ok: false, error: "only POST is supported" });
            return;
          }
          if (!auth(req)) {
            sendJson(res, 401, { ok: false, error: "unauthorized" });
            return;
          }
          let request;
          try {
            request = JSON.parse(await readBody(req));
          } catch (error) {
            sendJson(res, 400, { ok: false, error: errorMessage(error) });
            return;
          }
          const delivered = await deliverOnce(request, "http");
          sendJson(res, 200, { ok: true, sessionId: delivered.sessionId, via: delivered.via });
        } catch (error) {
          sendJson(res, 500, { ok: false, error: errorMessage(error) });
        }
      }
    });
    console.info(
      `[dsh-wakeup] listening on ${ROUTE_PREFIX}${token === null ? " (no token)" : " (token required)"}; status ${STATUS_PATH}`
    );
  });
  if (typeof config.watchDir === "string" && config.watchDir.length > 0) {
    const dir = config.watchDir;
    const seen = /* @__PURE__ */ new Set();
    let draining = false;
    const drain = async () => {
      if (draining) return;
      draining = true;
      try {
        let entries;
        try {
          entries = readdirSync(dir);
        } catch {
          return;
        }
        for (const entry of entries) {
          if (!entry.endsWith(".json") || seen.has(entry)) continue;
          seen.add(entry);
          const path = join(dir, entry);
          try {
            const request = JSON.parse(readFileSync(path, "utf8"));
            await deliverOnce(request, "watch");
            renameSync(path, join(dir, "processed", entry));
          } catch (error) {
            console.warn(`[dsh-wakeup] failed ${entry}: ${errorMessage(error)}`);
          }
        }
        if (seen.size > 1e3) seen.clear();
      } finally {
        draining = false;
      }
    };
    try {
      mkdirSync(join(dir, "processed"), { recursive: true });
    } catch {
    }
    const watcher = watch(dir, () => setTimeout(() => void drain(), 50));
    const timer = setInterval(() => void drain(), WATCH_POLL_MS);
    ctx.effect?.(() => () => {
      watcher.close();
      clearInterval(timer);
    });
    console.info(`[dsh-wakeup] watching ${dir}`);
  }
}
export {
  apply,
  buildStatus,
  deliver,
  inject,
  name
};
