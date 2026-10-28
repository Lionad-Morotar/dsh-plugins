/**
 * The reconciler spec: the only writer of mcp rows, driven by the shadow
 * namespace's document-updated events.
 *
 * The contract under test: a sync applies exactly the planned sets, merging the
 * timeout into the row's config without disturbing its other keys; it is
empotent (equal values plan no edits); it never touches unmanaged overrides; it
 * reacts to its own namespace's writes and ignores everyone else's; one row's
 * failed edit neither aborts the batch nor hides the error; concurrent triggers
 * coalesce instead of interleaving writes.
 */
import { describe, expect, it } from "vitest";
import { createReconciler, type ReconcilerDeps } from "../src/reconciler.ts";
import type { McpEntryLike } from "../src/inventory.ts";

interface RowState {
  id: string;
  serverName: string;
  override: Record<string, unknown>;
  inherited: Record<string, unknown>;
}

function makeDeps(rows: RowState[], shadow: Record<string, number>) {
  const entryOf = new Map(rows.map(row => [row.id, { options: { id: row.id, name: "@deepseek-ai/dsh-mcp-client" } } as McpEntryLike]));
  const edits: Array<{ id: string; before: Record<string, unknown>; after: Record<string, unknown> }> = [];
  let failIds = new Set<string>();
  const listeners = new Map<string, Array<(...args: unknown[]) => void>>();
  const deps: ReconcilerDeps = {
    ns: "more-config",
    settings: {
      describe: () => [{ ns: "more-config", value: { mcpTimeouts: Object.entries(shadow).map(([id, timeoutMs]) => ({ id, timeoutMs })) } }],
      update: async () => {},
    },
    configEditor: {
      entries: () => [...entryOf.values()],
      configuration: () => rows.map(row => ({ entry: entryOf.get(row.id)!, inherited: row.inherited, override: row.override })),
      edit: async (entry, change) => {
        const row = rows.find(candidate => candidate.id === entry.options.id)!;
        if (failIds.has(row.id)) throw new Error(`edit rejected for ${row.id}`);
        const before = { ...row.override };
        row.override = change({ ...row.override }, { ...row.inherited });
        edits.push({ id: row.id, before, after: { ...row.override } });
      },
    },
    events: {
      on: (event, handler) => {
        const list = listeners.get(event) ?? [];
        list.push(handler as (...args: unknown[]) => void);
        listeners.set(event, list);
        return () => {
          const current = listeners.get(event) ?? [];
          listeners.set(event, current.filter(item => item !== handler));
        };
      },
    },
    logger: { info: () => {}, warn: () => {}, error: () => {} },
  };
  return { deps, edits, listeners, fail: (ids: string[]) => { failIds = new Set(ids); }, rows };
}

describe("reconciler", () => {
  it("applies planned sets by merging the timeout into the row config", async () => {
    const { deps, edits } = makeDeps(
      [{ id: "mcp-kimi-tools", serverName: "kimi", override: { command: "node" }, inherited: { serverName: "kimi" } }],
      { "mcp-kimi-tools": 660000 },
    );
    const reconciler = createReconciler(deps);
    const report = await reconciler.sync("test");
    expect(report.sets).toEqual([{ id: "mcp-kimi-tools", timeoutMs: 660000 }]);
    expect(edits).toHaveLength(1);
    const [edit] = edits;
    if (edit === undefined) throw new Error("edit missing");
    expect(edit.after).toEqual({ command: "node", toolCallTimeoutMs: 660000 });
    await reconciler.dispose();
  });

  it("is idempotent: a second sync plans no edits", async () => {
    const { deps, edits } = makeDeps([{ id: "mcp-kimi-tools", serverName: "kimi", override: {}, inherited: {} }], { "mcp-kimi-tools": 660000 });
    const reconciler = createReconciler(deps);
    await reconciler.sync("test");
    await reconciler.sync("test");
    expect(edits).toHaveLength(1);
    await reconciler.dispose();
  });

  it("reports unmanaged overrides and unknown keys without writing them", async () => {
    const { deps, edits } = makeDcpWithDrift();
    const reconciler = createReconciler(deps);
    const report = await reconciler.sync("test");
    expect(report.unmanaged.map(item => item.id)).toEqual(["mcp-hand"]);
    expect(report.unknownKeys).toEqual(["ghost"]);
    expect(edits).toHaveLength(0);
    await reconciler.dispose();
  });

  it("reacts to its own namespace's document-updated, ignores others", async () => {
    const { deps, edits, listeners } = makeDeps([{ id: "mcp-kimi-tools", serverName: "kimi", override: {}, inherited: {} }], { "mcp-kimi-tools": 660000 });
    const reconciler = createReconciler(deps);
    reconciler.attach();
    const handlers = listeners.get("settings/document-updated") ?? [];
    expect(handlers).toHaveLength(1);
    const handler = handlers[0];
    if (handler === undefined) throw new Error("listener missing");
    handler("other-ns", 7);
    expect(edits).toHaveLength(0);
    await handler("more-config", 8);
    await new Promise(resolve => setTimeout(resolve, 0));
    expect(edits).toHaveLength(1);
    await reconciler.dispose();
  });

  it("one row's failed edit neither aborts the batch nor hides the error", async () => {
    const { deps, edits, fail } = makeDeps(
      [
        { id: "mcp-a", serverName: "a", override: {}, inherited: {} },
        { id: "mcp-b", serverName: "b", override: {}, inherited: {} },
      ],
      { "mcp-a": 300000, "mcp-b": 600000 },
    );
    fail(["mcp-a"]);
    const reconciler = createReconciler(deps);
    const report = await reconciler.sync("test");
    expect(edits.map(edit => edit.id)).toEqual(["mcp-b"]);
    expect(report.failures.map(failure => failure.id)).toEqual(["mcp-a"]);
    await reconciler.dispose();
  });

  it("coalesces concurrent triggers instead of interleaving", async () => {
    const { deps, edits } = makeDeps([{ id: "mcp-kimi-tools", serverName: "kimi", override: {}, inherited: {} }], { "mcp-kimi-tools": 660000 });
    const reconciler = createReconciler(deps);
    await Promise.all([reconciler.sync("a"), reconciler.sync("b")]);
    expect(edits).toHaveLength(1);
    await reconciler.dispose();
  });
});

function makeDcpWithDrift() {
  return makeDeps(
    [
      { id: "mcp-hand", serverName: "hand", override: { toolCallTimeoutMs: 999999 }, inherited: {} },
      { id: "mcp-fine", serverName: "fine", override: {}, inherited: {} },
    ],
    { ghost: 5000 },
  );
}
