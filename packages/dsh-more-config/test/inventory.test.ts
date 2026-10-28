/**
 * `readMcpInventory` spec: project the profile's mcp-client rows into the flat
 * view the command, the reconciler and later the panel all read.
 *
 * The contract under test: only rows whose package is the mcp client appear;
 * each row's serverName and timeout come from the override layer first, then
 * the inherited layer, then the client's own 60s default; the entry handle is
 * passed through untouched for a later `configEditor.edit`.
 */
import { describe, expect, it } from "vitest";
import { DEFAULT_TOOL_CALL_TIMEOUT_MS, readMcpInventory, type ConfigEditorLike } from "../src/inventory.ts";

function editorWith(rows: Array<{ id: string; name: string; inherited?: Record<string, unknown>; override?: Record<string, unknown> }>): ConfigEditorLike {
  const entryOf = new Map(rows.map(row => [row.id, { options: { id: row.id, name: row.name } }]));
  return {
    entries: () => [...entryOf.values()],
    configuration: () =>
      rows
        .filter(row => entryOf.has(row.id))
        .map(row => ({ entry: entryOf.get(row.id)!, inherited: row.inherited ?? {}, override: row.override ?? {} })),
  };
}

const KIMI = { id: "mcp-kimi-tools", name: "@deepseek-ai/dsh-mcp-client" };

describe("readMcpInventory", () => {
  it("lists only mcp-client rows", () => {
    const editor = editorWith([
      KIMI,
      { id: "ui-chat", name: "@deepseek-ai/dsh-client-ui-chat" },
    ]);
    const rows = readMcpInventory(editor);
    expect(rows.map(row => row.id)).toEqual(["mcp-kimi-tools"]);
  });

  it("resolves serverName and timeout from the override layer first", () => {
    const editor = editorWith([{
      ...KIMI,
      inherited: { serverName: "kimi", toolCallTimeoutMs: 60000 },
      override: { serverName: "kimi2", toolCallTimeoutMs: 660000 },
    }]);
    const [first] = readMcpInventory(editor);
    if (first === undefined) throw new Error("inventory row missing");
    expect(first.serverName).toBe("kimi2");
    expect(first.effectiveTimeoutMs).toBe(660000);
    expect(first.overrideTimeoutMs).toBe(660000);
  });

  it("falls back to the inherited layer, then the 60s default", () => {
    const inheritedOnly = editorWith([{ ...KIMI, inherited: { serverName: "kimi", toolCallTimeoutMs: 120000 } }]);
    const [inheritedRow] = readMcpInventory(inheritedOnly);
    if (inheritedRow === undefined) throw new Error("inventory row missing");
    expect(inheritedRow.effectiveTimeoutMs).toBe(120000);

    const bare = editorWith([{ ...KIMI, inherited: { serverName: "kimi" } }]);
    const [bareRow] = readMcpInventory(bare);
    if (bareRow === undefined) throw new Error("inventory row missing");
    expect(bareRow.effectiveTimeoutMs).toBe(DEFAULT_TOOL_CALL_TIMEOUT_MS);
    expect(bareRow.overrideTimeoutMs).toBeUndefined();
  });

  it("carries the entry handle through for configEditor.edit", () => {
    const editor = editorWith([KIMI]);
    const [row] = readMcpInventory(editor);
    if (row === undefined) throw new Error("inventory row missing");
    expect(row.entry).toBe(editor.entries()[0]);
  });
});
