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

function harness(options: {
  live?: FakeAgent[]
  parents?: Record<string, string | undefined>
  subagents?: boolean
  resumable?: string[]
} = {}) {
  const live = [...(options.live ?? [])]
  const delivered: unknown[][] = []
  const resumed: string[] = []
  const subagents = options.subagents === false
    ? undefined
    : {
        [SIG]: (...args: unknown[]) => {
          delivered.push(args)
          return Promise.resolve("message-id")
        },
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
  return { ctx, live, delivered, resumed }
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

  it("resumes a cold root session and steers it", async () => {
    const h = harness({})
    const result = await deliver(h.ctx, { text: "hi", sessionId: "root-9" })
    expect(result).toEqual({ sessionId: "root-9", via: "root-resume" })
    expect(h.resumed).toEqual(["root-9"])
    expect(h.live[0]?.steered).toHaveLength(1)
  })

  it("falls back to resume when the host has no subagent service", async () => {
    const h = harness({ subagents: false, parents: { "child-1": "root-1" } })
    const result = await deliver(h.ctx, { text: "hi", sessionId: "child-1" })
    expect(result.via).toBe("root-resume")
    expect(h.resumed).toEqual(["child-1"])
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
