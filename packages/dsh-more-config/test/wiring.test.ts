/**
 * The apply() wiring spec: mount behavior only — every real decision lives in
 * the command and reconciler tests.
 *
 * The contract under test: apply registers the command, suppresses the
 * auto-generated settings page for its namespace, wires the reconciler's
 * document-updated listener globally, and runs the initial sync; a composition
 * without the settings services mounts the plugin inert instead of throwing.
 */
import { describe, expect, it } from "vitest";
import { apply, type PluginContextLike } from "../src/index.ts";
import type { McpEntryLike } from "../src/inventory.ts";

interface Mount {
  ctx: PluginContextLike;
  registered: unknown[];
  configured: Array<{ options: { auto: boolean }; fiber?: unknown }>;
  listeners: Map<string, Array<{ handler: (...args: unknown[]) => void; options?: { global?: boolean } }>>;
  edits: string[];
  effects: Array<() => (() => void) | void>;
}

function mount(shadow: Record<string, number>, rows: Array<{ id: string }>, withServices = true): Mount {
  const registered: unknown[] = [];
  const configured: Array<{ options: { auto: boolean }; fiber?: unknown }> = [];
  const listeners = new Map<string, Array<{ handler: (...args: unknown[]) => void; options?: { global?: boolean } }>>();
  const edits: string[] = [];
  const effects: Array<() => (() => void) | void> = [];
  const entryOf = new Map(rows.map(row => [row.id, { options: { id: row.id, name: "@deepseek-ai/dsh-mcp-client" } } as McpEntryLike]));
  const settings = {
    describe: () => [{ ns: "more-config", value: { mcpTimeouts: Object.entries(shadow).map(([id, timeoutMs]) => ({ id, timeoutMs })) } }],
    update: async () => {},
    configure: (options: { auto: boolean }, fiber?: unknown) => configured.push({ options, fiber }),
  };
  const configEditor = {
    entries: () => [...entryOf.values()],
    configuration: () => rows.map(row => ({ entry: entryOf.get(row.id)!, inherited: {}, override: {} })),
    edit: async (entry: McpEntryLike) => {
      edits.push(entry.options.id);
    },
  };
  const ctx: PluginContextLike = {
    commands: { register: definition => { registered.push(definition); return () => {}; } },
    settings: withServices ? settings : undefined,
    configEditor: withServices ? configEditor : undefined,
    logger: { info: () => {}, warn: () => {} },
    fiber: { marker: "fiber" },
    on: (event, handler, options) => {
      const list = listeners.get(event) ?? [];
      list.push({ handler, options });
      listeners.set(event, list);
      return () => {};
    },
    effect: setup => {
      effects.push(setup);
      return () => {};
    },
  };
  return { ctx, registered, configured, listeners, edits, effects } as Mount;
}

describe("apply wiring", () => {
  it("registers the command, suppresses the auto page, and runs the initial sync", async () => {
    const mountState = mount({ "mcp-kimi-tools": 660000 }, [{ id: "mcp-kimi-tools" }]);
    apply(mountState.ctx);
    expect(mountState.effects).toHaveLength(2);
    for (const effect of mountState.effects) effect();
    expect(mountState.registered).toHaveLength(1);
    expect(mountState.registered.map(definition => (definition as { name: string }).name)).toEqual(["mcp-timeout"]);
    expect(mountState.configured).toEqual([{ options: { auto: false }, fiber: { marker: "fiber" } }]);
    await new Promise(resolve => setTimeout(resolve, 0));
    expect(mountState.edits).toEqual(["mcp-kimi-tools"]);
    const wired = mountState.listeners.get("settings/document-updated") ?? [];
    expect(wired).toHaveLength(1);
    const listener = wired[0];
    if (listener === undefined) throw new Error("listener missing");
    expect(listener.options).toEqual({ global: true });
  });

  it("mounts inert without the settings services, warning instead of throwing", () => {
    const mountState = mount({}, [{ id: "mcp-kimi-tools" }], false);
    expect(() => apply(mountState.ctx)).not.toThrow();
    expect(mountState.registered).toHaveLength(0);
    expect(mountState.effects).toHaveLength(0);
  });
});
