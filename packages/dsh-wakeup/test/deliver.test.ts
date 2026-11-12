import { describe, expect, it, vi } from "vitest"

import { deliver } from "../src/index.ts"

const SIG = Symbol.for("dsh.subagent.deliverPrompt")

interface FakeAgent {
  id: string
  status: string
  steered: unknown[]
  session: { header: { origin?: string; parentSession?: string } }
  steer(message: unknown): void
}

function agent(id: string, patch: Partial<FakeAgent> = {}): FakeAgent {
  const created: FakeAgent = {
    id,
    status: "idle",
    steered: [],
    session: { header: {} },
    steer(message: unknown) {
      created.steered.push(message)
    },
    ...patch,
  }
  return created
}

type SubagentProtocol = "deliverPrompt" | "sendMessage" | "both" | "none"

function harness(options: {
  live?: FakeAgent[]
  parents?: Record<string, string | undefined>
  protocol?: SubagentProtocol
  resumable?: string[]
} = {}) {
  const live = [...(options.live ?? [])]
  const delivered: unknown[][] = []
  const sent: unknown[][] = []
  const resumed: string[] = []
  const protocol = options.protocol ?? "deliverPrompt"
  const subagents = protocol === "none"
    ? undefined
    : {
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
  const ctx = {
    get(name: string) {
      if (name === "agents") {
        return {
          list: () => live,
          get: (id: string) => live.find((candidate) => candidate.id === id),
          resume: async ({ resumeSessionId }: { resumeSessionId: string }) => {
            resumed.push(resumeSessionId)
            if (options.resumable !== undefined && !options.resumable.includes(resumeSessionId)) {
              throw new Error("not found")
            }
            live.push(agent(resumeSessionId))
          },
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
      if (name === "subagents") return subagents
      return undefined
    },
  }
  return { ctx, live, delivered, sent, resumed }
}

describe("deliver", () => {
  it("steers a live target without touching resume", async () => {
    const target = agent("child-1", { status: "running" })
    const h = harness({ live: [target] })
    const result = await deliver(h.ctx, { text: "hi", sessionId: "child-1", source: "wechat" })
    expect(result).toEqual({ sessionId: "child-1", via: "steer" })
    expect(target.steered).toHaveLength(1)
    expect(h.resumed).toEqual([])
  })

  it("cold-resumes a released subagent through its live parent", async () => {
    const parent = agent("root-1", { status: "running" })
    const h = harness({ live: [parent], parents: { "child-1": "root-1" } })
    const result = await deliver(h.ctx, { text: "hi", sessionId: "child-1", source: "wechat" })
    expect(result).toEqual({ sessionId: "child-1", via: "cold-resume" })
    expect(h.delivered).toHaveLength(1)
    const [target, childId, content, source, , delivery] = h.delivered[0] as unknown[]
    expect(target).toBe(parent)
    expect(childId).toBe("child-1")
    expect(content).toEqual([{ type: "text", text: "hi" }])
    expect(source).toMatchObject({ kind: "wakeup", channel: "wechat" })
    expect(delivery).toBe("steer")
    expect(h.resumed).toEqual([])
  })

  it("resumes the parent first when the whole lineage is cold", async () => {
    const h = harness({ parents: { "child-1": "root-1" } })
    const result = await deliver(h.ctx, { text: "hi", sessionId: "child-1" })
    expect(result).toEqual({ sessionId: "child-1", via: "cold-resume" })
    expect(h.resumed).toEqual(["root-1"])
    expect(h.delivered).toHaveLength(1)
  })

  it("cold-resumes through the public sendMessage when the legacy symbol is gone", async () => {
    const parent = agent("root-1", { status: "running" })
    const h = harness({
      live: [parent],
      parents: { "child-1": "root-1" },
      protocol: "sendMessage",
    })
    const result = await deliver(h.ctx, { text: "hi", sessionId: "child-1", source: "wechat" })
    expect(result).toEqual({ sessionId: "child-1", via: "cold-resume" })
    expect(h.delivered).toEqual([])
    expect(h.sent).toHaveLength(1)
    const [sender, childId, content, options] = h.sent[0] as unknown[]
    expect(sender).toBe(parent)
    expect(childId).toBe("child-1")
    expect(content).toEqual([{ type: "text", text: "hi" }])
    expect(options).toEqual({ signal: expect.any(AbortSignal) })
    expect(h.resumed).toEqual([])
  })

  it("resumes the parent before calling sendMessage", async () => {
    const h = harness({ parents: { "child-1": "root-1" }, protocol: "sendMessage" })
    const result = await deliver(h.ctx, { text: "hi", sessionId: "child-1" })
    expect(result).toEqual({ sessionId: "child-1", via: "cold-resume" })
    expect(h.resumed).toEqual(["root-1"])
    expect(h.sent).toHaveLength(1)
    expect(h.sent[0]?.[0]).toMatchObject({ id: "root-1" })
    expect(h.live.map((candidate) => candidate.id)).toContain("root-1")
  })

  it("prefers the legacy symbol when both protocols are available", async () => {
    const parent = agent("root-1", { status: "running" })
    const h = harness({
      live: [parent],
      parents: { "child-1": "root-1" },
      protocol: "both",
    })
    const result = await deliver(h.ctx, { text: "hi", sessionId: "child-1" })
    expect(result).toEqual({ sessionId: "child-1", via: "cold-resume" })
    expect(h.delivered).toHaveLength(1)
    expect(h.sent).toEqual([])
  })

  it("resumes a cold root session and steers it", async () => {
    const h = harness({})
    const result = await deliver(h.ctx, { text: "hi", sessionId: "root-9" })
    expect(result).toEqual({ sessionId: "root-9", via: "root-resume" })
    expect(h.resumed).toEqual(["root-9"])
    expect(h.live[0]?.steered).toHaveLength(1)
  })

  it("refuses root-resume for a subagent when the host has no cold delivery", async () => {
    const h = harness({ protocol: "none", parents: { "child-1": "root-1" } })
    await expect(deliver(h.ctx, { text: "hi", sessionId: "child-1" })).rejects.toThrow(/refusing to root-resume/)
    expect(h.resumed).toEqual([])
    expect(h.live).toEqual([])
  })

  it("picks the most recent running root when no target is routed", async () => {
    const child = agent("child-1", { status: "running", session: { header: { origin: "subagent" } } })
    const root = agent("root-1", { status: "running" })
    const h = harness({ live: [child, root] })
    const result = await deliver(h.ctx, { text: "hi", routes: {} })
    expect(result).toEqual({ sessionId: "root-1", via: "steer" })
    expect(root.steered).toHaveLength(1)
  })

  it("reports a resume failure instead of a bare not-running message", async () => {
    const h = harness({ resumable: [] })
    await expect(deliver(h.ctx, { text: "hi", sessionId: "gone" })).rejects.toThrow(
      /session gone is not running and resume failed: not found/,
    )
  })

  it("keeps a concurrent resume that published first", async () => {
    const h = harness({})
    const agents = (h.ctx.get("agents") ?? {}) as { resume?: unknown }
    agents.resume = async () => {
      h.live.push(agent("child-1"))
      throw new Error("already owned")
    }
    const result = await deliver(h.ctx, { text: "hi", sessionId: "child-1" })
    expect(result).toEqual({ sessionId: "child-1", via: "root-resume" })
    expect(h.live[0]?.steered).toHaveLength(1)
  })
})
