/**
 * dsh-wakeup — 外部事件注入正在运行的会话。
 *
 * 两个接入面（HTTP 路由 / watch 目录）最终都走同一条投递：
 * `agent.steer({role:"user", content:[text], source:{kind:"wakeup"}})`
 *
 * 目标会话不在 agents 注册表里时（DSH 会在 continuable subagent 空闲结算后释放它的
 * agent，这是按设计的驻留策略，不是故障），改走宿主 subagent 的冷恢复：用持久化
 * 会话头里的 `parentSession` 找到仍活着的父 agent，再由 subagent 服务把消息投给冷态
 * 子会话，子会话被重新物化、消息进 inbox。直接 `agents.resume` 会抢走该会话的写入权，
 * 让 subagent 运行时的后续冷恢复失败，所以只在没有父会话的普通根会话上用它。
 */
import { randomUUID } from "node:crypto"
import { mkdirSync, readdirSync, readFileSync, renameSync, watch } from "node:fs"
import { join } from "node:path"

export const name = "wakeup"
export const inject = []

export interface Config {
  token?: string
  watchDir?: string
  /** source → sessionId（可用 `@file:<path>` 间接寻址）；缺省投递到最近活跃根会话 */
  routes?: Record<string, string>
}

export interface WakeupRequest {
  text: string
  sessionId?: string
  source?: string
  meta?: Record<string, unknown>
  /** source → sessionId，由插件配置注入，调用方可省略 */
  routes?: Record<string, string>
}

/** 一次投递实际走通的路径：直接插话、subagent 冷恢复、或按 id 恢复根会话。 */
export type DeliveryVia = "steer" | "cold-resume" | "root-resume"

export interface DeliveryResult {
  sessionId: string
  via: DeliveryVia
}

/**
 * `GET /wakeup/api/status` 的单个路由目标。只读探测：查 agents 注册表与持久化
 * 会话头，不投递、不 steer，因此不会触发目标会话跑模型。
 */
export interface TargetStatus {
  source: string
  /** 配置原文（`@file:` 未展开） */
  configured: string | null
  /** 展开后要投递的会话 id；读不到为 null */
  sessionId: string | null
  live: boolean
  parentSession: string | null
  parentLive: boolean
  /** 持久化会话头是否读得到（读不到时 parentSession 为 null 不代表根会话） */
  headerReadable: boolean
  /** 此刻投递会走通的档位；都不可用时为 unreachable */
  via: DeliveryVia | "unreachable"
  deliverable: boolean
  error?: string
}

/** 自检接口的响应体；`ok` 只表示探测本身跑通，逐目标看 `deliverable`。 */
export interface WakeupStatus {
  ok: true
  routes: Record<string, TargetStatus>
  /** source 未命中路由时的兜底目标（最近活跃根会话），null 表示没有可投递的活会话 */
  fallback: { sessionId: string | null }
  services: { agents: boolean; sessionQuery: boolean; subagents: boolean; deliverPrompt: boolean }
  probedAt: string
}

interface AgentLike {
  id: string
  status: string
  session?: { header?: { origin?: string; parentSession?: string } }
  steer(message: unknown): void
}

interface AgentsLike {
  list(): AgentLike[]
  get?(id: string): AgentLike | undefined
  resume?(options: { resumeSessionId: string; signal?: AbortSignal }): Promise<unknown>
}

interface SessionObservation {
  header?: { parentSession?: string }
  [key: symbol]: unknown
}

interface SessionQueryLike {
  observeSession?(sessionId: string, options?: { signal?: AbortSignal }): Promise<SessionObservation>
}

interface SubagentsLike {
  [key: symbol]: unknown
}

interface WebServerLike {
  register(route: { kind: "prefix"; path: string; handler: (req: any, res: any) => Promise<void> }): unknown
}

interface ContextLike {
  get?: (name: string) => unknown
  effect?: (fn: () => () => void) => void
  [key: string]: unknown
}

const ROUTE_PREFIX = "/wakeup/api"
/** 只读自检接口，挂在同一 prefix 下；POST 路由不变。 */
const STATUS_PATH = `${ROUTE_PREFIX}/status`
const BODY_LIMIT = 64 * 1024
const WATCH_POLL_MS = 15_000
const WAKE_TIMEOUT_MS = 30_000
const STATUS_PROBE_TIMEOUT_MS = 10_000

/**
 * 宿主协议投递的进程级符号键（`@deepseek-ai/dsh-subagent/internal` 冻结的契约）。
 * 插件与宿主各自打包，只能靠 `Symbol.for` 认出同一个键。
 */
const DELIVER_SUBAGENT_PROMPT = Symbol.for("dsh.subagent.deliverPrompt")

function readService<T>(ctx: ContextLike, serviceName: string): T | undefined {
  // 只走 ctx.get：cordis 的属性代理要求 inject 声明，未声明的服务会抛错。
  // 服务尚未就绪时 ctx.get 返回 undefined/null，调用方负责等待或降级。
  if (typeof ctx.get !== "function") return undefined
  const value = ctx.get(serviceName)
  return value === null ? undefined : (value as T | undefined)
}

function requireService<T>(ctx: ContextLike, serviceName: string): T {
  const service = readService<T>(ctx, serviceName)
  if (service === undefined) throw new Error(`${serviceName} service unavailable`)
  return service
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error)
}

function whenWebServer(ctx: ContextLike, register: (ctx: ContextLike, webServer: WebServerLike) => void): void {
  const found = () => readService<WebServerLike>(ctx, "webServer")
  const present = found()
  if (present !== undefined) {
    register(ctx, present)
    return
  }
  const startedAt = Date.now()
  const timer = setInterval(() => {
    const webServer = found()
    if (webServer === undefined) {
      if (Date.now() - startedAt > WATCH_POLL_MS) clearInterval(timer)
      return
    }
    clearInterval(timer)
    register(ctx, webServer)
  }, 250)
}

/**
 * 解析路由值。普通字符串即 sessionId；`@file:<path>` 每次投递时读文件，
 * 让常驻会话重建后只改文件即可，不必重启宿主。
 */
function resolveRoute(value: unknown): string | null {
  if (typeof value !== "string" || value.length === 0) return null
  if (!value.startsWith("@file:")) return value
  try {
    const id = readFileSync(value.slice(6).trim(), "utf8").trim()
    return id.length > 0 ? id : null
  } catch {
    return null
  }
}

function buildMessage(text: string, source: string, meta?: Record<string, unknown>): unknown {
  return {
    id: randomUUID(),
    role: "user",
    content: [{ type: "text", text }],
    source: { kind: "wakeup", channel: source, ...(meta ? { meta } : {}) },
  }
}

function buildSource(source: string, meta?: Record<string, unknown>): Record<string, unknown> {
  return { kind: "wakeup", channel: source, ...(meta ? { meta } : {}) }
}

/** 查注册表里的活 agent；没有 `get` 的老宿主退回线性扫描。 */
function findLiveAgent(ctx: ContextLike, sessionId: string): AgentLike | null {
  const agents = readService<AgentsLike>(ctx, "agents")
  if (agents === undefined) return null
  if (typeof agents.get === "function") {
    const found = agents.get(sessionId)
    if (found !== undefined && found !== null) return found
  }
  return agents.list().find((agent) => agent.id === sessionId) ?? null
}

/** 取最近活跃的非 subagent 根会话；都没有就取第一个 running。 */
function pickRunningAgent(agents: AgentsLike): AgentLike | null {
  const running = agents.list().filter((agent) => agent?.status === "running")
  const root = running.find((agent) => agent?.session?.header?.origin !== "subagent")
  return root ?? running[0] ?? null
}

function hasResume(ctx: ContextLike): boolean {
  const agents = readService<AgentsLike>(ctx, "agents")
  return agents !== undefined && typeof agents.resume === "function"
}

function hasDeliverPrompt(ctx: ContextLike): boolean {
  const subagents = readService<SubagentsLike>(ctx, "subagents")
  return subagents !== undefined && typeof subagents[DELIVER_SUBAGENT_PROMPT] === "function"
}

interface SessionHeaderInfo {
  parentSession: string | null
  readable: boolean
}

/** 读持久化会话头里的父会话 id；读不到（不存在、格式不符、无 query 服务）就当没有。 */
async function readSessionHeader(
  ctx: ContextLike,
  sessionId: string,
  signal: AbortSignal,
): Promise<SessionHeaderInfo> {
  const query = readService<SessionQueryLike>(ctx, "sessionQuery")
  if (query === undefined || typeof query.observeSession !== "function") {
    return { parentSession: null, readable: false }
  }
  let observation: SessionObservation | undefined
  try {
    observation = await query.observeSession(sessionId, { signal })
  } catch {
    return { parentSession: null, readable: false }
  }
  try {
    const parent = observation?.header?.parentSession
    return {
      parentSession: typeof parent === "string" && parent.length > 0 ? parent : null,
      readable: true,
    }
  } finally {
    const release = (observation as { [key: symbol]: unknown } | undefined)?.[Symbol.dispose]
    if (typeof release === "function") {
      try {
        ;(release as () => void).call(observation)
      } catch {}
    }
  }
}

async function readParentSessionId(
  ctx: ContextLike,
  sessionId: string,
  signal: AbortSignal,
): Promise<string | null> {
  return (await readSessionHeader(ctx, sessionId, signal)).parentSession
}

/** 按 id 恢复一个会话为活 agent（普通根会话走这条；subagent 会话不该走）。 */
async function resumeAgent(ctx: ContextLike, sessionId: string, signal: AbortSignal): Promise<AgentLike> {
  const agents = requireService<AgentsLike>(ctx, "agents")
  if (typeof agents.resume !== "function") {
    throw new Error(`session ${sessionId} is not running and the host cannot resume it`)
  }
  try {
    await agents.resume({ resumeSessionId: sessionId, signal })
  } catch (error) {
    // 并发恢复时另一条路径可能已经发布成功，以注册表为准
    const raced = findLiveAgent(ctx, sessionId)
    if (raced !== null) return raced
    throw new Error(`session ${sessionId} is not running and resume failed: ${errorMessage(error)}`)
  }
  const resumed = findLiveAgent(ctx, sessionId)
  if (resumed === null) throw new Error(`session ${sessionId} resumed but is not live in the agents registry`)
  return resumed
}

async function ensureLiveAgent(ctx: ContextLike, sessionId: string, signal: AbortSignal): Promise<AgentLike> {
  return findLiveAgent(ctx, sessionId) ?? (await resumeAgent(ctx, sessionId, signal))
}

/**
 * 构造一条用户消息并投递给目标会话，返回实际送达的会话 id 与路径。
 *
 * 目标解析顺序：显式 request.sessionId → 按 source 的路由表 → 最近活跃根会话。
 * 冷态目标按「subagent 冷恢复优先、根会话按 id 恢复兜底」处理。
 */
export async function deliver(
  ctx: ContextLike,
  request: WakeupRequest,
  fallbackSource?: string,
): Promise<DeliveryResult> {
  const text = String(request.text ?? "").trim()
  if (!text) throw new Error("text is required")
  const source = request.source ?? fallbackSource ?? "external"
  const targetId = request.sessionId ?? resolveRoute(request.routes?.[source])

  if (targetId === null) {
    const agent = pickRunningAgent(requireService<AgentsLike>(ctx, "agents"))
    if (agent === null) throw new Error("no running session")
    agent.steer(buildMessage(text, source, request.meta))
    return { sessionId: agent.id, via: "steer" }
  }

  const signal = AbortSignal.timeout(WAKE_TIMEOUT_MS)

  // 活着的目标直接插话：idle 的 agent 自带 wakeDriver，不需要额外唤醒
  const live = findLiveAgent(ctx, targetId)
  if (live !== null) {
    live.steer(buildMessage(text, source, request.meta))
    return { sessionId: targetId, via: "steer" }
  }

  // 冷态目标：continuable subagent 空闲后会被 subagent 运行时释放，
  // 正规唤醒路径是「父 agent 授权 → subagent 冷恢复 → 消息进 inbox」
  const parentId = await readParentSessionId(ctx, targetId, signal)
  const subagents = readService<SubagentsLike>(ctx, "subagents")
  const deliverPrompt = subagents?.[DELIVER_SUBAGENT_PROMPT]
  if (parentId !== null && subagents !== undefined && typeof deliverPrompt === "function") {
    const parent = await ensureLiveAgent(ctx, parentId, signal)
    await (deliverPrompt as (...args: unknown[]) => Promise<unknown>).call(
      subagents,
      parent,
      targetId,
      [{ type: "text", text }],
      buildSource(source, request.meta),
      signal,
      "steer",
    )
    return { sessionId: targetId, via: "cold-resume" }
  }

  // 没有父会话（普通根会话冷态），或宿主没有 subagent 服务：按 id 恢复再插话
  const resumed = await resumeAgent(ctx, targetId, signal)
  resumed.steer(buildMessage(text, source, request.meta))
  return { sessionId: targetId, via: "root-resume" }
}

/**
 * 只读探测一个路由目标：查 agents 注册表与持久化会话头，判断此刻投递会走哪一档。
 * 不投递、不 steer、不 resume，所以不会让目标会话跑模型。
 */
async function probeTarget(
  ctx: ContextLike,
  source: string,
  configured: string | null,
  signal: AbortSignal,
): Promise<TargetStatus> {
  const sessionId = resolveRoute(configured)
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
      error: configured === null ? "route not configured" : "@file route is empty or unreadable",
    }
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
      deliverable: true,
    }
  }
  const header = await readSessionHeader(ctx, sessionId, signal)
  const parentLive = header.parentSession !== null && findLiveAgent(ctx, header.parentSession) !== null
  const canColdResume = header.parentSession !== null && hasDeliverPrompt(ctx) && (parentLive || hasResume(ctx))
  const via: DeliveryVia | "unreachable" = canColdResume ? "cold-resume" : hasResume(ctx) ? "root-resume" : "unreachable"
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
    ...(via === "unreachable"
      ? { error: "target is not live and the host can neither cold-resume nor resume it" }
      : {}),
  }
}

/** `GET ${STATUS_PATH}` 的响应体：每个路由目标的可得性，不发消息。 */
export async function buildStatus(ctx: ContextLike, routes: Record<string, string>): Promise<WakeupStatus> {
  const signal = AbortSignal.timeout(STATUS_PROBE_TIMEOUT_MS)
  const targets: Record<string, TargetStatus> = {}
  for (const [source, configured] of Object.entries(routes)) {
    const value = typeof configured === "string" ? configured : null
    try {
      targets[source] = await probeTarget(ctx, source, value, signal)
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
        error: errorMessage(error),
      }
    }
  }
  let fallbackId: string | null = null
  try {
    const agents = readService<AgentsLike>(ctx, "agents")
    fallbackId = agents === undefined ? null : (pickRunningAgent(agents)?.id ?? null)
  } catch {}
  return {
    ok: true,
    routes: targets,
    fallback: { sessionId: fallbackId },
    services: {
      agents: readService<AgentsLike>(ctx, "agents") !== undefined,
      sessionQuery: readService<SessionQueryLike>(ctx, "sessionQuery") !== undefined,
      subagents: readService<SubagentsLike>(ctx, "subagents") !== undefined,
      deliverPrompt: hasDeliverPrompt(ctx),
    },
    probedAt: new Date().toISOString(),
  }
}

/** prefix 路由下的请求路径；宿主可能原样传 `/wakeup/api/status`，也可能剥掉前缀传 `/status`。 */
function requestPath(req: any): string {
  const raw = typeof req?.url === "string" ? req.url : ""
  const queryIndex = raw.indexOf("?")
  const path = queryIndex === -1 ? raw : raw.slice(0, queryIndex)
  return path.length > 1 && path.endsWith("/") ? path.slice(0, -1) : path
}

function isStatusRequest(req: any): boolean {
  const path = requestPath(req)
  return path === STATUS_PATH || path === "/status"
}

export function apply(ctx: ContextLike, config: Config = {}): void {
  const token = typeof config.token === "string" && config.token.length > 0 ? config.token : null
  const auth = (req: any) => token === null || req.headers?.authorization === `Bearer ${token}`
  const routes: Record<string, string> = config.routes && typeof config.routes === "object" ? config.routes : {}

  function sendJson(res: any, status: number, body: unknown): void {
    res.writeHead(status, { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" })
    res.end(JSON.stringify(body))
  }

  async function readBody(req: any): Promise<string> {
    const chunks: Buffer[] = []
    let size = 0
    for await (const chunk of req) {
      size += chunk.length
      if (size > BODY_LIMIT) throw new Error("body too large")
      chunks.push(chunk as Buffer)
    }
    return Buffer.concat(chunks).toString("utf8")
  }

  const deliverOnce = (request: WakeupRequest, source: string) =>
    deliver(ctx, routes ? { ...request, routes } : request, source)

  // ── 接入面 1：HTTP ────────────────────────────────────────────────
  whenWebServer(ctx, (_ready, webServer) => {
    webServer.register({
      kind: "prefix",
      path: ROUTE_PREFIX,
      handler: async (req, res) => {
        try {
          // 只读自检：探路由与目标可得性，不投递
          if (req.method === "GET" && isStatusRequest(req)) {
            if (!auth(req)) {
              sendJson(res, 401, { ok: false, error: "unauthorized" })
              return
            }
            sendJson(res, 200, await buildStatus(ctx, routes))
            return
          }
          if (req.method !== "POST") {
            sendJson(res, 405, { ok: false, error: "only POST is supported" })
            return
          }
          if (!auth(req)) {
            sendJson(res, 401, { ok: false, error: "unauthorized" })
            return
          }
          let request: WakeupRequest
          try {
            request = JSON.parse(await readBody(req)) as WakeupRequest
          } catch (error) {
            sendJson(res, 400, { ok: false, error: errorMessage(error) })
            return
          }
          const delivered = await deliverOnce(request, "http")
          sendJson(res, 200, { ok: true, sessionId: delivered.sessionId, via: delivered.via })
        } catch (error) {
          sendJson(res, 500, { ok: false, error: errorMessage(error) })
        }
      },
    })
    console.info(
      `[dsh-wakeup] listening on ${ROUTE_PREFIX}${token === null ? " (no token)" : " (token required)"}` +
        `; status ${STATUS_PATH}`,
    )
  })

  // ── 接入面 2：watch 目录（可选）──────────────────────────────────
  if (typeof config.watchDir === "string" && config.watchDir.length > 0) {
    const dir = config.watchDir
    const seen = new Set<string>()
    let draining = false
    const drain = async (): Promise<void> => {
      if (draining) return
      draining = true
      try {
        let entries: string[]
        try {
          entries = readdirSync(dir)
        } catch {
          return
        }
        for (const entry of entries) {
          if (!entry.endsWith(".json") || seen.has(entry)) continue
          seen.add(entry)
          const path = join(dir, entry)
          try {
            const request = JSON.parse(readFileSync(path, "utf8")) as WakeupRequest
            await deliverOnce(request, "watch")
            renameSync(path, join(dir, "processed", entry))
          } catch (error) {
            console.warn(`[dsh-wakeup] failed ${entry}: ${errorMessage(error)}`)
          }
        }
        if (seen.size > 1000) seen.clear()
      } finally {
        draining = false
      }
    }
    try {
      mkdirSync(join(dir, "processed"), { recursive: true })
    } catch {}
    const watcher = watch(dir, () => setTimeout(() => void drain(), 50))
    const timer = setInterval(() => void drain(), WATCH_POLL_MS)
    ctx.effect?.(() => () => {
      watcher.close()
      clearInterval(timer)
    })
    console.info(`[dsh-wakeup] watching ${dir}`)
  }
}
