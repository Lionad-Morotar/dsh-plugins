/**
 * `planSync` spec: the reconciler's whole decision procedure as a pure
 * function of the shadow map and the live inventory.
 *
 * The contract under test: a shadow row becomes a set only when the effective
 * timeout differs (idempotence when equal, including the inherited-default
 * case); rows the user overrode by hand without a shadow key are reported,
 * never written; shadow keys without a matching row are reported as unknown so
 * callers can surface an actionable error.
 */
import { describe, expect, it } from "vitest";
import { planSync } from "../src/plan.ts";
import type { McpInventoryRow } from "../src/inventory.ts";

function row(overrides: Partial<McpInventoryRow> & { id: string }): McpInventoryRow {
  return {
    serverName: overrides.id,
    effectiveTimeoutMs: 60000,
    entry: { options: { id: overrides.id } },
    ...overrides,
  } as McpInventoryRow;
}

describe("planSync", () => {
  it("sets the override when the effective timeout differs", () => {
    const plan = planSync({ "mcp-kimi-tools": 660000 }, [row({ id: "mcp-kimi-tools", effectiveTimeoutMs: 60000 })]);
    expect(plan.sets).toEqual([{ id: "mcp-kimi-tools", timeoutMs: 660000 }]);
    expect(plan.unknownKeys).toEqual([]);
  });

  it("skips writes when the effective timeout already equals the target", () => {
    const viaOverride = planSync({ "mcp-kimi-tools": 660000 }, [row({ id: "mcp-kimi-tools", effectiveTimeoutMs: 660000, overrideTimeoutMs: 660000 })]);
    expect(viaOverride.sets).toEqual([]);

    // Effective from the inherited default, target equal: no override row is
    // created, keeping the patch free of no-op config.
    const viaDefault = planSync({ "mcp-kimi-tools": 60000 }, [row({ id: "mcp-kimi-tools", effectiveTimeoutMs: 60000 })]);
    expect(viaDefault.sets).toEqual([]);
  });

  it("reports overridden rows that no shadow key owns, without writing them", () => {
    const plan = planSync({}, [row({ id: "mcp-kimi-tools", effectiveTimeoutMs: 660000, overrideTimeoutMs: 660000 })]);
    expect(plan.sets).toEqual([]);
    expect(plan.unmanaged).toEqual([{ id: "mcp-kimi-tools", timeoutMs: 660000 }]);
  });

  it("a shadow key whose value differs from its own override still plans a set", () => {
    const plan = planSync({ "mcp-kimi-tools": 360000 }, [row({ id: "mcp-kimi-tools", effectiveTimeoutMs: 660000, overrideTimeoutMs: 660000 })]);
    expect(plan.sets).toEqual([{ id: "mcp-kimi-tools", timeoutMs: 360000 }]);
    expect(plan.unmanaged).toEqual([]);
  });

  it("collects shadow keys that match no row as unknown, in stable order", () => {
    const plan = planSync({ "ghost-a": 5000, "mcp-kimi-tools": 660000 }, [row({ id: "mcp-kimi-tools" })]);
    expect(plan.unknownKeys).toEqual(["ghost-a"]);
    expect(plan.sets).toEqual([{ id: "mcp-kimi-tools", timeoutMs: 660000 }]);
  });
});
