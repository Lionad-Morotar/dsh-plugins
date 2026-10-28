/**
 * `/mcp-timeout` spec: one command that resolves a target, validates a value,
 * and writes the shadow namespace — plus the one action that writes the mcp
 * row directly (reset), because a removal is a decision, not a sync.
 *
 * The contract under test: targets resolve by entry id or unique serverName;
 * unknown or ambiguous targets answer with the candidate list; a set writes the
 * merged shadow map through the settings service (never the mcp row); reset
 * strips the row's override AND the shadow key; values below the floor are
 * refused with the floor named.
 */
import { describe, expect, it } from "vitest";
import { createMcpTimeoutCommand, MIN_TIMEOUT_MS, type McpTimeoutDeps, type SettingsServiceLike } from "../src/command.ts";
import type { ConfigEditorLike, McpEntryLike } from "../src/inventory.ts";

function makeDeps(rows: Array<{ id: string; serverName?: string; override?: Record<string, unknown>; inherited?: Record<string, unknown> }>) {
  const entryOf = new Map(rows.map(row => [row.id, { options: { id: row.id, name: "@deepseek-ai/dsh-mcp-client" } } as McpEntryLike]));
  const edits: Array<{ id: string; change: (current: Record<string, unknown>) => Record<string, unknown> }> = [];
  const updates: Array<{ ns: string; patch: Record<string, unknown> }> = [];
  let shadow: Record<string, number> = {};
  const settings: SettingsServiceLike = {
    describe: () => [{ ns: "more-config", value: { mcpTimeouts: Object.entries(shadow).map(([id, timeoutMs]) => ({ id, timeoutMs })) } }],
    update: async (ns, patch) => {
      updates.push({ ns, patch: patch as Record<string, unknown> });
      shadow = Object.fromEntries((patch as { mcpTimeouts: Array<{ id: string; timeoutMs: number }> }).mcpTimeouts.map(entry => [entry.id, entry.timeoutMs]));
    },
  };
  const configEditor: ConfigEditorLike & McpTimeoutDeps["configEditor"] = {
    entries: () => [...entryOf.values()],
    configuration: () =>
      rows.map(row => ({
        entry: entryOf.get(row.id)!,
        inherited: { serverName: row.serverName, ...(row.inherited ?? {}) },
        override: row.override ?? {},
      })),
    edit: async (entry, change) => {
      const row = rows.find(candidate => candidate.id === entry.options.id)!;
      edits.push({ id: entry.options.id, change: change as (current: Record<string, unknown>) => Record<string, unknown> });
      row.override = change({ ...(row.override ?? {}) }, row.inherited ?? {});
    },
  };
  return { deps: { ns: "more-config", settings, configEditor } as McpTimeoutDeps, updates, edits, entryOf };
}

function run(deps: McpTimeoutDeps, rawInput: string) {
  return createMcpTimeoutCommand(deps).handler({ agent: {}, rawInput });
}

describe("/mcp-timeout", () => {
  it("refuses usage errors with the argument shape", async () => {
    const { deps } = makeDeps([{ id: "mcp-kimi-tools", serverName: "kimi" }]);
    for (const input of ["", "kimi", "kimi abc"]) {
      const result = await run(deps, input);
      expect(result.kind).toBe("error");
      expect(result.text).toContain("mcp-timeout");
    }
  });

  it("resolves the target by entry id or unique serverName", async () => {
    const { deps, updates } = makeDeps([{ id: "mcp-kimi-tools", serverName: "kimi" }]);
    await run(deps, "kimi 660000");
    expect(updates).toHaveLength(1);
    expect(updates).toEqual([{ ns: "more-config", patch: { mcpTimeouts: [{ id: "mcp-kimi-tools", timeoutMs: 660000 }] } }]);

    await run(deps, "mcp-kimi-tools 360000");
    expect(updates[1]).toEqual({ ns: "more-config", patch: { mcpTimeouts: [{ id: "mcp-kimi-tools", timeoutMs: 360000 }] } });
  });

  it("merges into the existing shadow map instead of replacing it", async () => {
    const { deps, updates } = makeDeps([
      { id: "mcp-kimi-tools", serverName: "kimi" },
      { id: "mcp-web", serverName: "websearch" },
    ]);
    await run(deps, "kimi 660000");
    await run(deps, "websearch 120000");
    const second = updates[1];
    if (second === undefined) throw new Error("second update missing");
    expect(second).toEqual({ ns: "more-config", patch: { mcpTimeouts: [{ id: "mcp-kimi-tools", timeoutMs: 660000 }, { id: "mcp-web", timeoutMs: 120000 }] } });
  });

  it("answers an unknown target with the candidate list and current values", async () => {
    const { deps } = makeDeps([{ id: "mcp-kimi-tools", serverName: "kimi", override: { toolCallTimeoutMs: 660000 } }]);
    const result = await run(deps, "ghost 60000");
    expect(result.kind).toBe("error");
    expect(result.text).toContain("mcp-kimi-tools");
    expect(result.text).toContain("kimi");
    expect(result.text).toContain("660000");
  });

  it("refuses ambiguous serverName matches", async () => {
    const { deps } = makeDeps([
      { id: "mcp-a", serverName: "dup" },
      { id: "mcp-b", serverName: "dup" },
    ]);
    const result = await run(deps, "dup 60000");
    expect(result.kind).toBe("error");
    expect(result.text).toContain("mcp-a");
    expect(result.text).toContain("mcp-b");
  });

  it("refuses values below the floor, naming the floor", async () => {
    const { deps } = makeDeps([{ id: "mcp-kimi-tools", serverName: "kimi" }]);
    for (const value of ["0", "500", "60"]) {
      const result = await run(deps, `kimi ${value}`);
      expect(result.kind).toBe("error");
      expect(result.text).toContain(String(MIN_TIMEOUT_MS));
    }
  });

  it("reports already-current values without writing", async () => {
    const { deps, updates } = makeDeps([{ id: "mcp-kimi-tools", serverName: "kimi" }]);
    await run(deps, "kimi 660000");
    const second = await run(deps, "kimi 660000");
    expect(second.kind).toBe("success");
    expect(updates).toHaveLength(1);
  });

  it("reset removes the row override and the shadow key", async () => {
    const { deps, updates, edits } = makeDeps([{ id: "mcp-kimi-tools", serverName: "kimi", override: { toolCallTimeoutMs: 660000 } }]);
    const result = await run(deps, "kimi default");
    expect(result.kind).toBe("success");
    expect(edits).toHaveLength(1);
    const [edit] = edits;
    if (edit === undefined) throw new Error("edit missing");
    expect(edit.id).toBe("mcp-kimi-tools");
    expect(edit.change({ toolCallTimeoutMs: 660000, command: "node" })).toEqual({ command: "node" });
    expect(updates).toHaveLength(1);
    expect(updates).toEqual([{ ns: "more-config", patch: { mcpTimeouts: [] } }]);
  });
});
