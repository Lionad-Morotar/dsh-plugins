/**
 * Per-workspace Arch state behind the host `storageDomain` service.
 *
 * Storage lands in the host's human-readable store under `~/.dsh/storages/`
 * (cross-restart, cross-profile) rather than in the user's repository — the
 * product promise is "dragging a node never dirties `git status`". A missing
 * service degrades to null here and the client half falls back to localStorage.
 */
import { z } from "zod";

import type { ArchWorkspaceState } from "../shared.ts";

/** Domain name; snake_case because the host's UNIT_NAME_RE rejects dashes. */
export const ARCH_DOMAIN_NAME = "dsh_arch";

export const ARCH_TABLE_NAME = "workspaces";

const nodeOffsetSchema = z.object({
  dx: z.number(),
  dy: z.number(),
  baseX: z.number(),
  baseY: z.number(),
});

const workspaceStateSchema = z.object({
  viewId: z.string(),
  viewport: z.object({
    scale: z.number(),
    tx: z.number(),
    ty: z.number(),
  }),
  viewHash: z.string(),
  offsets: z.record(z.string(), z.record(z.string(), nodeOffsetSchema)),
  updatedAt: z.string(),
});

/** Both directions assignable, so the zod schema and `ArchWorkspaceState` cannot drift apart silently. */
type MirrorOf<T, U> = [T] extends [U] ? ([U] extends [T] ? unknown : never) : never;
const _stateSchemaMirrorsSharedType: MirrorOf<z.infer<typeof workspaceStateSchema>, ArchWorkspaceState> = undefined;
void _stateSchemaMirrorsSharedType;

/**
 * Domain declaration handed to `storageDomain.open()`.
 *
 * Keyed by workspace realpath (the same join key the renderer caches under),
 * so a symlinked session cwd and the registry's canonical path converge on one
 * record.
 *
 * Record schemas are zod, not schemastery: `open()` re-parses every stored
 * record through `tables[name].valueSchema.parse`, and a classic schemastery
 * schema has no `parse` method at all. The `{ valueSchema }` wrapper is the
 * host's `domainTable()` shape — a bare schema leaves `valueSchema` undefined,
 * which stays hidden while the table is empty and turns the first boot after a
 * record lands into a fatal load failure. `invalidRecords: "backup-and-skip"`
 * opts into quarantine, so a future schema change degrades to a moved-aside
 * record instead of a host boot failure.
 */
export const ARCH_DOMAIN_SPEC = {
  name: ARCH_DOMAIN_NAME,
  version: 1,
  invalidRecords: "backup-and-skip",
  tables: { [ARCH_TABLE_NAME]: { valueSchema: workspaceStateSchema } },
} as const;

/** Structural slice of one storage-domain table. */
export interface ArchTableFace {
  get(key: string): unknown;
  put(key: string, value: unknown): Promise<void>;
  delete(key: string): Promise<void>;
  entries(): IterableIterator<[string, unknown]>;
}

/** Structural slice of the storageDomain service. */
export interface StorageDomainFace {
  open(spec: unknown): Promise<{
    table(name: string): ArchTableFace;
    close(): Promise<void>;
  }>;
}

export interface ArchStore {
  loadWorkspace(key: string): Promise<ArchWorkspaceState | null>;
  saveWorkspace(key: string, state: ArchWorkspaceState): Promise<void>;
  close(): Promise<void>;
}

/**
 * Open the arch storage domain, or degrade to null.
 *
 * @param storageDomain - the host service if present; absence is a supported
 *   composition, not an error.
 */
export async function openArchStore(storageDomain?: StorageDomainFace): Promise<ArchStore | null> {
  if (storageDomain === undefined) return null;
  const domain = await storageDomain.open(ARCH_DOMAIN_SPEC);
  const table = domain.table(ARCH_TABLE_NAME);
  return {
    async loadWorkspace(key) {
      const stored = table.get(key);
      return stored === undefined || stored === null ? null : (stored as ArchWorkspaceState);
    },
    async saveWorkspace(key, state) {
      // Parse before persisting: the write path does not validate, and a
      // record the load-time schema rejects gets quarantined (moved aside,
      // treated as absent) on the next boot.
      await table.put(key, workspaceStateSchema.parse(state));
    },
    async close() {
      await domain.close();
    },
  };
}
