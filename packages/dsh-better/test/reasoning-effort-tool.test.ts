/**
 * The `set_reasoning_effort` host tool, pinned at the decisions it makes rather
 * than at its prose:
 *
 *   - a read is free, so it must never write;
 *   - a switch happens only when the level actually differs, because every
 *     switch throws the provider's prompt cache away and re-bills the whole
 *     context on the next request;
 *   - everything the model cannot do (no session model, no ladder, an id the
 *     model does not advertise) fails loudly instead of quietly doing nothing.
 *
 * The description is asserted as well. The three facts it has to carry (the
 * cache cost, the very narrow use case, the free read) are the reason this tool
 * exists in this shape, so a rewrite that drops one is a regression.
 */
import { describe, expect, it, vi } from "vitest";

import {
  SET_EFFORT_TOOL_NAME,
  createSetEffortTool,
  planEffortChange,
  readEffortSnapshot,
  type EffortAgentLike,
  type EffortLevel,
  type EffortLlmFace,
  type EffortSelection,
  type EffortSnapshot,
} from "../src/host/reasoning-effort.ts";

/** `off/low/high/max`, the most common ladder on this machine. */
const FOUR: EffortLevel[] = [
  { id: "off", name: "Off" },
  { id: "low", name: "Low" },
  { id: "high", name: "High" },
  { id: "max", name: "Max" },
];

/** A model without a ladder, which is normal and must not be an error to read. */
const NO_LADDER: EffortLlmFace = { resolveModelInfo: async () => ({}) };

/** A model advertising {@link FOUR} and defaulting to `high`. */
function ladderLlm(levels: EffortLevel[] = FOUR, defaultEffort: string | undefined = "high"): EffortLlmFace {
  return { resolveModelInfo: async () => ({ reasoning: { efforts: levels, defaultEffort } }) };
}

/** A selection on one provider/model pair, optionally with an explicit effort. */
function selectionOn(reasoningEffort?: string): EffortSelection {
  return reasoningEffort === undefined
    ? { provider: "deepseek-account", model: "deepseek-v4" }
    : { provider: "deepseek-account", model: "deepseek-v4", reasoningEffort };
}

/** An agent whose model face records every `select` call. */
function agentOn(current: EffortSelection | undefined): {
  agent: EffortAgentLike;
  select: ReturnType<typeof vi.fn<(selection: EffortSelection) => void>>;
} {
  const select = vi.fn<(selection: EffortSelection) => void>();
  return { agent: { model: { current: () => current, select } }, select };
}

/** The text a render produced, joined, so assertions read as one sentence. */
function textOf(tool: ReturnType<typeof createSetEffortTool>, args: unknown, value: unknown): string {
  return tool.output
    .render(args, value as never)
    .map((part) => part.text)
    .join("\n");
}

describe("readEffortSnapshot", () => {
  it("takes an explicitly chosen level as the one in effect", async () => {
    const snapshot = await readEffortSnapshot(ladderLlm(), selectionOn("max"));

    expect(snapshot.currentEffort).toBe("max");
    expect(snapshot.explicit).toBe(true);
    expect(snapshot.levels.map((level) => level.id)).toEqual(["off", "low", "high", "max"]);
    expect(snapshot.defaultEffort).toBe("high");
  });

  it("falls back to the model default when the session records no level", async () => {
    const snapshot = await readEffortSnapshot(ladderLlm(), selectionOn());

    expect(snapshot.currentEffort).toBe("high");
    expect(snapshot.explicit).toBe(false);
  });

  it("reports an empty ladder and no level for a model without reasoning", async () => {
    const snapshot = await readEffortSnapshot(NO_LADDER, selectionOn());

    expect(snapshot.levels).toEqual([]);
    expect(snapshot.defaultEffort).toBeUndefined();
    expect(snapshot.currentEffort).toBeUndefined();
    expect(snapshot.explicit).toBe(false);
  });

  it("keeps the provider and model it resolved against", async () => {
    const snapshot = await readEffortSnapshot(ladderLlm(), selectionOn());

    expect(snapshot.provider).toBe("deepseek-account");
    expect(snapshot.model).toBe("deepseek-v4");
  });
});

describe("planEffortChange", () => {
  /** A snapshot with `high` in effect and a four-step ladder behind it. */
  function snapshotWith(currentEffort: string | undefined): EffortSnapshot {
    return {
      provider: "deepseek-account",
      model: "deepseek-v4",
      levels: FOUR,
      defaultEffort: "high",
      currentEffort,
      // No explicit pin: these cases are about the inherited-default path.
      recordedEffort: undefined,
      explicit: false,
    };
  }

  it("plans nothing when the request matches the level in effect", () => {
    expect(planEffortChange(snapshotWith("high"), "high")).toEqual({ kind: "noop" });
  });

  it("plans a change when the request differs", () => {
    expect(planEffortChange(snapshotWith("high"), "max")).toEqual({ kind: "change", reasoningEffort: "max" });
  });

  it("plans a change when no level is in effect yet", () => {
    expect(planEffortChange(snapshotWith(undefined), "low")).toEqual({ kind: "change", reasoningEffort: "low" });
  });
});

describe("createSetEffortTool", () => {
  it("registers under the model-facing name", () => {
    expect(createSetEffortTool({ llm: ladderLlm() }).name).toBe(SET_EFFORT_TOOL_NAME);
    expect(SET_EFFORT_TOOL_NAME).toBe("set_reasoning_effort");
  });

  it("carries the three facts the description exists for", () => {
    const { description } = createSetEffortTool({ llm: ladderLlm() });

    // The cost, because a switch is not free.
    expect(description).toContain("prompt cache");
    expect(description).toContain("re-bills the entire context");
    // The narrow use case, because the model should almost never reach for it.
    expect(description).toContain("Do not call it on your own initiative");
    // The free read, because reading is how the model avoids guessing.
    expect(description).toContain("no arguments");
  });

  it("declares an optional effort parameter", () => {
    const { parameters } = createSetEffortTool({ llm: ladderLlm() });
    const schema = parameters as {
      type: string;
      properties: Record<string, { type: string }>;
      required?: string[];
    };

    expect(schema.type).toBe("object");
    expect(schema.properties.effort?.type).toBe("string");
    expect(schema.required).toBeUndefined();
  });

  it("keeps the output schema inside the subset the host accepts", () => {
    const { output } = createSetEffortTool({ llm: ladderLlm() });
    const allowed = new Set([
      "type",
      "oneOf",
      "properties",
      "required",
      "additionalProperties",
      "items",
      "enum",
      "const",
      "description",
      "title",
      "default",
      "examples",
    ]);

    const offending: string[] = [];
    const walk = (node: unknown): void => {
      if (Array.isArray(node)) {
        node.forEach(walk);
        return;
      }
      if (node === null || typeof node !== "object") return;
      for (const [key, value] of Object.entries(node)) {
        if (key === "properties" && value !== null && typeof value === "object") {
          Object.values(value).forEach(walk);
          continue;
        }
        if (!allowed.has(key)) offending.push(key);
        walk(value);
      }
    };
    walk(output.schema);

    expect(offending).toEqual([]);
  });
});

describe("execute: the session it runs in", () => {
  it("fails when the session has no agent at all", async () => {
    const tool = createSetEffortTool({ llm: ladderLlm() });

    await expect(tool.execute({}, {})).rejects.toThrow(/no model selection/i);
  });

  it("fails when the agent exposes no model face", async () => {
    const tool = createSetEffortTool({ llm: ladderLlm() });

    await expect(tool.execute({}, { agent: {} })).rejects.toThrow(/no model selection/i);
  });

  it("fails when the model face reports no current selection", async () => {
    const tool = createSetEffortTool({ llm: ladderLlm() });
    const { agent, select } = agentOn(undefined);

    await expect(tool.execute({ effort: "max" }, { agent })).rejects.toThrow(/no model selection/i);
    expect(select).not.toHaveBeenCalled();
  });

  it("propagates a model-info failure instead of swallowing it", async () => {
    const llm: EffortLlmFace = {
      resolveModelInfo: async () => {
        throw new Error("catalog offline");
      },
    };
    const tool = createSetEffortTool({ llm });
    const { agent } = agentOn(selectionOn());

    await expect(tool.execute({}, { agent })).rejects.toThrow("catalog offline");
  });
});

describe("execute: reading without an effort id", () => {
  it("never writes when called with no arguments", async () => {
    const tool = createSetEffortTool({ llm: ladderLlm() });
    const { agent, select } = agentOn(selectionOn("max"));

    const value = await tool.execute({}, { agent });

    expect(select).not.toHaveBeenCalled();
    expect(value).toMatchObject({ changed: false, effort: "max", previous: "max", defaultEffort: "high" });
  });

  it("treats a missing argument object as a read too", async () => {
    const tool = createSetEffortTool({ llm: ladderLlm() });
    const { agent, select } = agentOn(selectionOn());

    const value = await tool.execute(undefined, { agent });

    expect(select).not.toHaveBeenCalled();
    expect(value).toMatchObject({ changed: false, effort: "high" });
  });

  it("names the level in effect, the default and the ladder", async () => {
    const tool = createSetEffortTool({ llm: ladderLlm() });
    const { agent } = agentOn(selectionOn("high"));

    const value = await tool.execute({}, { agent });
    const text = textOf(tool, {}, value);

    expect(text).toContain("Reasoning effort in effect: high");
    expect(text).toContain("model default: high");
    expect(text).toContain("off, low, high, max");
    expect(text).toContain("Nothing changed");
  });

  it("says so when the model exposes no ladder", async () => {
    const tool = createSetEffortTool({ llm: NO_LADDER });
    const { agent, select } = agentOn(selectionOn());

    const value = await tool.execute({}, { agent });
    const text = textOf(tool, {}, value);

    expect(select).not.toHaveBeenCalled();
    expect(value).toMatchObject({ changed: false, levels: [], effort: null, defaultEffort: null });
    expect(text).toContain("does not expose reasoning effort levels");
  });
});

/**
 * A session can record a level for a model that no longer advertises one: the
 * model was retired, the provider degraded, or the config drifted. The recorded
 * level is then inert, because nothing downstream consumes it.
 *
 * Reporting it anyway would put `levels: []` and `effort: "high"` in the same
 * value, contradicting the render's own conclusion that there is nothing to
 * switch. The read must therefore answer null, and a switch must fail.
 */
describe("execute: a session pinned to a level its model no longer has", () => {
  it("reads an empty ladder and no level instead of echoing the stale pin", async () => {
    const tool = createSetEffortTool({ llm: NO_LADDER });
    const { agent, select } = agentOn(selectionOn("high"));

    const value = await tool.execute({}, { agent });
    const text = textOf(tool, {}, value);

    expect(select).not.toHaveBeenCalled();
    expect(value).toMatchObject({ changed: false, levels: [], effort: null, defaultEffort: null });
    expect(text).toContain("does not expose reasoning effort levels");
  });

  it("refuses to switch to the very level the session still records", async () => {
    const tool = createSetEffortTool({ llm: NO_LADDER });
    const { agent, select } = agentOn(selectionOn("high"));

    await expect(tool.execute({ effort: "high" }, { agent })).rejects.toThrow(/does not support/);
    expect(select).not.toHaveBeenCalled();
  });
});

/**
 * A narrower stale case: the model still advertises a ladder, but the level the
 * session records is not on it. The host fails the next request with
 * `UNSUPPORTED_REASONING_EFFORT`, so this is not a cosmetic mismatch.
 *
 * Two things follow, and both are asserted here. The read must not name the
 * retired level as the one in effect, because it is not. And a request for any
 * valid level must write, even though the recorded value differs from nothing
 * the model knows: that write is what repairs the session. A no-op there would
 * leave the session permanently broken while reporting success.
 */
describe("execute: a session recording a level the model dropped", () => {
  /** `low/high` with `low` as the default, the ladder the stale session faces. */
  const TWO: EffortLevel[] = [
    { id: "low", name: "Low" },
    { id: "high", name: "High" },
  ];

  /** A session still pinned to a level this ladder no longer carries. */
  function staleAgent(): { agent: EffortAgentLike; select: ReturnType<typeof vi.fn<(selection: EffortSelection) => void>> } {
    return agentOn(selectionOn("retired"));
  }

  it("does not report the retired level as the one in effect", async () => {
    const tool = createSetEffortTool({ llm: ladderLlm(TWO, "low") });
    const { agent, select } = staleAgent();

    const value = await tool.execute({}, { agent });
    const text = textOf(tool, {}, value);

    expect(select).not.toHaveBeenCalled();
    expect(value).toMatchObject({ changed: false, effort: null });
    expect((value as { levels: unknown[] }).levels).toHaveLength(2);
    // The render has to say why there is no level in effect; the model needs to
    // know the session is broken, not merely that nothing is selected.
    expect(text).toMatch(/does not advertise|not in effect/);
  });

  it("repairs the session when a valid level is requested", async () => {
    const tool = createSetEffortTool({ llm: ladderLlm(TWO, "low") });
    const { agent, select } = staleAgent();

    const value = await tool.execute({ effort: "low" }, { agent });

    expect(select).toHaveBeenCalledTimes(1);
    expect(select).toHaveBeenCalledWith({ provider: "deepseek-account", model: "deepseek-v4", reasoningEffort: "low" });
    expect(value).toMatchObject({ changed: true, effort: "low" });
  });

  it("still rejects the retired id as unknown, listing what the model has", async () => {
    const tool = createSetEffortTool({ llm: ladderLlm(TWO, "low") });
    const { agent, select } = staleAgent();

    const failure = tool.execute({ effort: "retired" }, { agent });

    await expect(failure).rejects.toThrow(/Available/);
    expect(select).not.toHaveBeenCalled();
  });

  it("keeps a valid recorded level a no-op on the same request", async () => {
    const tool = createSetEffortTool({ llm: ladderLlm(TWO, "low") });
    const { agent, select } = agentOn(selectionOn("high"));

    const value = await tool.execute({ effort: "high" }, { agent });

    expect(select).not.toHaveBeenCalled();
    expect(value).toMatchObject({ changed: false, effort: "high" });
  });
});

describe("execute: switching", () => {
  it("rejects a non-string effort", async () => {
    const tool = createSetEffortTool({ llm: ladderLlm() });
    const { agent, select } = agentOn(selectionOn());

    await expect(tool.execute({ effort: 3 }, { agent })).rejects.toThrow(/effort/i);
    expect(select).not.toHaveBeenCalled();
  });

  it("rejects an empty effort", async () => {
    const tool = createSetEffortTool({ llm: ladderLlm() });
    const { agent, select } = agentOn(selectionOn());

    await expect(tool.execute({ effort: "   " }, { agent })).rejects.toThrow(/effort/i);
    expect(select).not.toHaveBeenCalled();
  });

  it("rejects a switch on a model with no ladder, naming the model", async () => {
    const tool = createSetEffortTool({ llm: NO_LADDER });
    const { agent, select } = agentOn(selectionOn());

    await expect(tool.execute({ effort: "max" }, { agent })).rejects.toThrow(/deepseek-account\/deepseek-v4/);
    expect(select).not.toHaveBeenCalled();
  });

  it("rejects an id the model does not advertise, listing the ones it does", async () => {
    const tool = createSetEffortTool({ llm: ladderLlm() });
    const { agent, select } = agentOn(selectionOn());

    const failure = tool.execute({ effort: "ultra" }, { agent });

    await expect(failure).rejects.toThrow(/ultra/);
    await expect(failure).rejects.toThrow(/off, low, high, max/);
    expect(select).not.toHaveBeenCalled();
  });

  it("does not write when the request already matches the level in effect", async () => {
    const tool = createSetEffortTool({ llm: ladderLlm() });
    const { agent, select } = agentOn(selectionOn("max"));

    const value = await tool.execute({ effort: "max" }, { agent });

    expect(select).not.toHaveBeenCalled();
    expect(value).toMatchObject({ changed: false, previous: "max", effort: "max" });
    expect(textOf(tool, { effort: "max" }, value)).toContain("prompt cache is untouched");
  });

  it("does not write when the request matches the model default the session inherited", async () => {
    // No explicit level recorded: the effective one is the model default, and
    // asking for exactly that must not pay for a cache flush.
    const tool = createSetEffortTool({ llm: ladderLlm() });
    const { agent, select } = agentOn(selectionOn());

    const value = await tool.execute({ effort: "high" }, { agent });

    expect(select).not.toHaveBeenCalled();
    expect(value).toMatchObject({ changed: false, effort: "high" });
  });

  it("selects the new level exactly once", async () => {
    const tool = createSetEffortTool({ llm: ladderLlm() });
    const { agent, select } = agentOn(selectionOn("high"));

    const value = await tool.execute({ effort: "max" }, { agent });

    expect(select).toHaveBeenCalledTimes(1);
    expect(select).toHaveBeenCalledWith({
      provider: "deepseek-account",
      model: "deepseek-v4",
      reasoningEffort: "max",
    });
    expect(value).toMatchObject({ changed: true, previous: "high", effort: "max" });
  });

  it("tells the model what the switch cost and when it lands", async () => {
    const tool = createSetEffortTool({ llm: ladderLlm() });
    const { agent } = agentOn(selectionOn("high"));

    const value = await tool.execute({ effort: "max" }, { agent });
    const text = textOf(tool, { effort: "max" }, value);

    expect(text).toContain("high");
    expect(text).toContain("max");
    expect(text).toContain("next model step");
    expect(text).toContain("prompt cache");
    expect(text).toContain("re-bills the entire context");
  });

  it("reports the ladder it switched within", async () => {
    const tool = createSetEffortTool({ llm: ladderLlm() });
    const { agent } = agentOn(selectionOn());

    const value = await tool.execute({ effort: "low" }, { agent });

    expect(value).toMatchObject({
      provider: "deepseek-account",
      model: "deepseek-v4",
      levels: [
        { id: "off", name: "Off" },
        { id: "low", name: "Low" },
        { id: "high", name: "High" },
        { id: "max", name: "Max" },
      ],
    });
  });
});

/**
 * The host-half wiring, driven through the exported registration function
 * rather than through `apply`.
 *
 * `apply` also starts the web-server poll and the projection probes, so testing
 * it here would drag a 15s timer and an unrelated seam into cases that are only
 * about one tool. What matters is narrower: the tool is registered exactly once
 * when the host has both services, and a host missing either one is left alone
 * instead of being handed an error it cannot act on.
 */
describe("registerReasoningEffortTool", () => {
  /** One definition as the stub registry recorded it. */
  interface RecordedTool {
    readonly name: string;
    readonly description: string;
    readonly output: { readonly render: unknown };
  }

  /** A tools registry that records what it was asked to register. */
  function stubTools(): { tools: { register: (definition: RecordedTool) => () => void }; registered: RecordedTool[] } {
    const registered: RecordedTool[] = [];
    return {
      tools: {
        register: (definition: RecordedTool) => {
          registered.push(definition);
          return () => undefined;
        },
      },
      registered,
    };
  }

  it("registers the tool once when inject hands back both services", async () => {
    const { registerReasoningEffortTool } = await import("../src/index.ts");
    const { tools, registered } = stubTools();
    const llm = ladderLlm();
    const ctx = {
      effect: () => undefined,
      inject: (_deps: readonly string[], callback: (scope: unknown) => void) => {
        callback({ tools, llm });
        return () => undefined;
      },
    };

    registerReasoningEffortTool(ctx as never);

    expect(registered).toHaveLength(1);
    expect(registered[0]?.name).toBe("set_reasoning_effort");
    expect(typeof registered[0]?.output.render).toBe("function");
    // The cache cost is the one fact the description exists for; a rewrite that
    // drops it would quietly turn a deliberate tool into a convenient one.
    expect(registered[0]?.description).toContain("prompt cache");
  });

  it("stays quiet when the services never arrive", async () => {
    const { registerReasoningEffortTool } = await import("../src/index.ts");
    const { registered } = stubTools();
    const ctx = {
      effect: () => undefined,
      inject: () => () => undefined,
    };

    expect(() => registerReasoningEffortTool(ctx as never)).not.toThrow();
    expect(registered).toHaveLength(0);
  });

  it("registers through get on a host without inject", async () => {
    const { registerReasoningEffortTool } = await import("../src/index.ts");
    const { tools, registered } = stubTools();
    const llm = ladderLlm();
    const ctx = {
      effect: () => undefined,
      get: (name: string) => (name === "tools" ? tools : name === "llm" ? llm : undefined),
    };

    registerReasoningEffortTool(ctx as never);

    expect(registered).toHaveLength(1);
    expect(registered[0]?.name).toBe("set_reasoning_effort");
  });

  it("registers nothing when get is missing one of the two services", async () => {
    const { registerReasoningEffortTool } = await import("../src/index.ts");
    const { tools, registered } = stubTools();
    const ctx = {
      effect: () => undefined,
      // `tools` is present and `llm` is not: the same registry object is handed
      // back so a registration would land in `registered` and fail the assertion.
      get: (name: string) => (name === "tools" ? tools : undefined),
    };

    expect(() => registerReasoningEffortTool(ctx as never)).not.toThrow();
    expect(registered).toHaveLength(0);
  });
});
