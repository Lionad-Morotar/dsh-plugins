import { describe, expect, it } from "vitest"

import { buildStatus } from "../src/index.ts"

const SIG = Symbol.for("dsh.subagent.deliverPrompt")

interface FakeAgent {
  id: string
  status: string
  session: { header: { origin?: string; parentSession?: string } }
}

function agent(id: string, patch: Partial<FakeAgent> = {}): FakeAgent {
  return { id, status: "idle", session: { header: {} }, ...patch }
}

type SubagentProtocol = "deliverPrompt" | "sendMessage" | "both" | "none"

function harness(options: {
  live?: FakeAgent[]
  parents?: Record<string, string | undefined>
  protocol?: SubagentProtocol
  resumable?: boolean
} = {}) {
  const live = [...(options.live ?? [])]
  const steered: unknown[] = []
  const resumed: string[] = []
  const delivered: unknown[] = []
  const sent: unknown[] = []
  const protocol = options.protocol ?? "deliverPrompt"
  const resume = options.resumable === false
    ? undefined
    : async ({ resumeSessionId }: { resumeSessionId: string }) => {
        resumed.push(resumeSessionId)
        live.push(agent(resumeSessionId, { status: "running" }))
      }
  const ctx = {
    get(name: string) {
      if (name === "agents") {
        return {
          list: () =>
            live.map((candidate) => ({
              ...candidate,
              steer: (message: unknown) => steered.push(message),
            })),
          get: (id: string) => live.find((candidate) => candidate.id === id),
          ...(resume === undefined ? {} : { resume }),
        }
      }
      if (name === "sessionQuery") {
        return {
          observeSession: async (id: string) => ({
            header: { parentSession: options.parents?.[id] },
            [Symbol.dispose]: () => {},
          }),
        }
      }
      if (name === "subagents") {
        if (protocol === "none") return undefined
        return {
          ...(protocol === "deliverPrompt" || protocol === "both"
            ? {
                [SIG]: (...args: unknown[]) => {
                  delivered.push(args)
                  return Promise.resolve("message-id")
                },
              }
            : {}),
          ...(protocol === "sendMessage" || protocol === "both"
            ? {
                sendMessage: (...args: unknown[]) => {
                  sent.push(args)
                  return Promise.resolve("message-id")
                },
              }
            : {}),
        }
      }
      return undefined
    },
  }
  return { ctx, live, steered, resumed, delivered, sent }
}

describe("buildStatus", () => {
  it("reports a live target as steerable without touching it", async () => {
    const h = harness({ live: [agent("router-1", { status: "running" })] })
    const status = await buildStatus(h.ctx, { wechat: "router-1" })

    expect(status.ok).toBe(true)
    expect(status.routes.wechat).toMatchObject({
      sessionId: "router-1",
      live: true,
      via: "steer",
      deliverable: true,
    })
    expect(h.steered).toEqual([])
    expect(h.resumed).toEqual([])
    expect(h.delivered).toEqual([])
  })

  it("predicts cold-resume for a released subagent with a live parent", async () => {
    const h = harness({ live: [agent("parent-1")], parents: { "router-1": "parent-1" } })
    const status = await buildStatus(h.ctx, { wechat: "router-1" })

    expect(status.routes.wechat).toMatchObject({
      sessionId: "router-1",
      live: false,
      parentSession: "parent-1",
      parentLive: true,
      headerReadable: true,
      via: "cold-resume",
      deliverable: true,
    })
    expect(h.delivered).toEqual([])
  })

  it("predicts cold-resume through sendMessage on a new host", async () => {
    const h = harness({
      live: [agent("parent-1")],
      parents: { "router-1": "parent-1" },
      protocol: "sendMessage",
    })
    const status = await buildStatus(h.ctx, { wechat: "router-1" })

    expect(status.routes.wechat).toMatchObject({
      sessionId: "router-1",
      live: false,
      parentSession: "parent-1",
      parentLive: true,
      via: "cold-resume",
      deliverable: true,
    })
    expect(status.services).toEqual({
      agents: true,
      sessionQuery: true,
      subagents: true,
      deliverPrompt: false,
      sendMessage: true,
    })
    expect(h.sent).toEqual([])
  })

  it("reports both delivery capabilities independently", async () => {
    const h = harness({ protocol: "both" })
    const legacy = await buildStatus(h.ctx, {})
    expect(legacy.services).toMatchObject({ deliverPrompt: true, sendMessage: true })

    const rc1 = harness({ protocol: "deliverPrompt" })
    expect((await buildStatus(rc1.ctx, {})).services).toMatchObject({
      deliverPrompt: true,
      sendMessage: false,
    })

    const rc2 = harness({ protocol: "sendMessage" })
    expect((await buildStatus(rc2.ctx, {})).services).toMatchObject({
      deliverPrompt: false,
      sendMessage: true,
    })
  })

  it("marks a subagent unreachable when neither cold delivery protocol exists", async () => {
    const h = harness({ parents: { "router-1": "parent-1" }, protocol: "none" })
    const status = await buildStatus(h.ctx, { wechat: "router-1" })

    expect(status.routes.wechat).toMatchObject({
      parentSession: "parent-1",
      via: "unreachable",
      deliverable: false,
    })
    expect(status.routes.wechat.error).toMatch(/deliverPrompt.*sendMessage|sendMessage.*deliverPrompt/)
    expect(h.resumed).toEqual([])
  })

  it("marks cold-resume unreachable when the parent is neither live nor resumable", async () => {
    const h = harness({
      parents: { "router-1": "parent-1" },
      protocol: "sendMessage",
      resumable: false,
    })
    const status = await buildStatus(h.ctx, { wechat: "router-1" })

    expect(status.routes.wechat).toMatchObject({
      parentSession: "parent-1",
      parentLive: false,
      via: "unreachable",
      deliverable: false,
    })
    expect(h.resumed).toEqual([])
  })

  it("falls back to root-resume when the target has no parent", async () => {
    const h = harness({ parents: {}, protocol: "none", resumable: true })
    const status = await buildStatus(h.ctx, { wechat: "root-1" })

    expect(status.routes.wechat).toMatchObject({ via: "root-resume", deliverable: true })
    expect(h.resumed).toEqual([])
  })

  it("flags an unreadable @file route as unreachable", async () => {
    const h = harness()
    const status = await buildStatus(h.ctx, { wechat: "@file:/nonexistent/router-session.txt" })

    expect(status.routes.wechat).toMatchObject({ sessionId: null, via: "unreachable", deliverable: false })
    expect(status.routes.wechat.error).toContain("@file")
  })

  it("reports the running root as the default fallback target", async () => {
    const h = harness({ live: [agent("lead", { status: "running" })] })
    const status = await buildStatus(h.ctx, {})

    expect(status.routes).toEqual({})
    expect(status.fallback.sessionId).toBe("lead")
  })
})
