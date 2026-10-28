/**
 * The reconciler's decision procedure, as a pure function.
 *
 * Authoritative direction is shadow → mcp row (decision D5): every shadow key
 * whose effective timeout differs becomes a set; nothing else is ever written.
 * Rows the user overrode by hand without a shadow key are reported as
 * unmanaged instead of touched — a hand-made fix in the patch must survive the
 * plugin's first activation untouched. Removing an override is an explicit
 * reset action's job, never the sync's.
 */
import type { McpInventoryRow } from "./inventory.ts";

/** The shadow map: profile entry id → wanted toolCallTimeoutMs. */
export type ShadowTimeouts = Record<string, number>;

/** One planned write of a row's `config.toolCallTimeoutMs`. */
export interface SyncSet {
  readonly id: string;
  readonly timeoutMs: number;
}

/** One row overridden outside the shadow, reported for drift awareness. */
export interface UnmanagedOverride {
  readonly id: string;
  readonly timeoutMs: number;
}

/** What the reconciler should do, and what it should say. */
export interface SyncPlan {
  readonly sets: readonly SyncSet[];
  readonly unmanaged: readonly UnmanagedOverride[];
  readonly unknownKeys: readonly string[];
}

/**
 * Plan the sync of the shadow map onto the live inventory.
 *
 * Idempotent by construction: a row whose effective timeout already equals the
 * shadow value plans no set, whether the value arrives via the user's override
 * or via the inherited default — the latter case deliberately leaves the patch
 * free of a no-op override row.
 */
export function planSync(shadow: ShadowTimeouts, inventory: readonly McpInventoryRow[]): SyncPlan {
  const byId = new Map(inventory.map(row => [row.id, row]));
  const sets: SyncSet[] = [];
  const unknownKeys: string[] = [];
  for (const [id, timeoutMs] of Object.entries(shadow)) {
    const row = byId.get(id);
    if (row === undefined) {
      unknownKeys.push(id);
      continue;
    }
    if (row.effectiveTimeoutMs !== timeoutMs) sets.push({ id, timeoutMs });
  }
  const shadowIds = new Set(Object.keys(shadow));
  const unmanaged = inventory
    .filter(row => row.overrideTimeoutMs !== undefined && !shadowIds.has(row.id))
    .map(row => ({ id: row.id, timeoutMs: row.overrideTimeoutMs as number }));
  return { sets, unmanaged, unknownKeys };
}
