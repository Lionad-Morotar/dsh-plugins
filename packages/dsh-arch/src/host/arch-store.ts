/**
 * Per-workspace Arch state behind the host `storageDomain` service.
 *
 * Storage lands in the host's human-readable store under `~/.dsh/storages/`
 * (cross-restart, cross-profile) rather than in the user's repository — the
 * product promise is "dragging a node never dirties `git status`". A missing
 * service degrades to null here and the client half falls back to localStorage.
 */
import Schema from "@deepseek-ai/schemastery";

import type { ArchWorkspaceState } from "../shared.ts";

/** Domain name; snake_case because the host's UNIT_NAME_RE rejects dashes. */
export const ARCH_DOMAIN_NAME = "dsh_arch";

export const ARCH_TABLE_NAME = "workspaces";

const nodeOffsetSchema = Schema.object({
  dx: Schema.number(),
  dy: Schema.number(),
  baseX: Schema.number(),
  baseY: Schema.number(),
});

const workspaceStateSchema = Schema.object({
  viewId: Schema.string(),
  viewport: Schema.object({
    scale: Schema.number(),
    tx: Schema.number(),
    ty: Schema.number(),
  }),
  viewHash: Schema.string(),
  offsets: Schema.dict(Schema.dict(nodeOffsetSchema)),
  updatedAt: Schema.string(),
});

/**
 * Domain declaration handed to `storageDomain.open()`.
 *
 * Keyed by workspace realpath (the same join key the renderer caches under),
 * so a symlinked session cwd and the registry's canonical path converge on one
 * record.
 */
export const ARCH_DOMAIN_SPEC = {
  name: ARCH_DOMAIN_NAME,
  version: 1,
  tables: { [ARCH_TABLE_NAME]: workspaceStateSchema },
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
      // Parse before persisting: the domain validates on load and quarantines
      // bad records, so writing an invalid shape would silently drop the
      // whole workspace state on the next boot.
      await table.put(key, workspaceStateSchema(state));
    },
    async close() {
      await domain.close();
    },
  };
}
