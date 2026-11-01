/**
 * Arch state persistence behind the host `storageDomain` service.
 *
 * The product decision under test: a missing storage service degrades to null
 * (the client half falls back to localStorage) instead of failing the plugin,
 * and an available one round-trips one workspace state under its realpath key.
 */
import { describe, expect, it } from "vitest";

import { ARCH_TABLE_NAME, openArchStore } from "../src/host/arch-store.ts";
import type { ArchTableFace, StorageDomainFace } from "../src/host/arch-store.ts";
import type { ArchWorkspaceState } from "../src/shared.ts";

function memoryStorageDomain(): StorageDomainFace & { records: Map<string, unknown> } {
  const records = new Map<string, unknown>();
  const table: ArchTableFace = {
    get: key => records.get(key),
    put: async (key, value) => {
      records.set(key, value);
    },
    delete: async key => {
      records.delete(key);
    },
    entries: () => records.entries() as IterableIterator<[string, unknown]>,
  };
  return {
    records,
    open: async spec => {
      void spec;
      return {
        table: name => {
          if (name !== ARCH_TABLE_NAME) throw new Error(`unknown table ${name}`);
          return table;
        },
        close: async () => {},
      };
    },
  };
}

const state: ArchWorkspaceState = {
  viewId: "index",
  viewport: { scale: 0.8, tx: 330, ty: 438 },
  viewHash: "QB5RYAt",
  offsets: {
    index: { user: { dx: 500, dy: 0, baseX: 0, baseY: 1160 } },
  },
  updatedAt: "2026-11-01T00:00:00.000Z",
};

describe("openArchStore", () => {
  it("degrades to null when the storage service is missing", async () => {
    expect(await openArchStore(undefined)).toBeNull();
  });

  it("round-trips a workspace state under its realpath key", async () => {
    const store = await openArchStore(memoryStorageDomain());
    expect(store).not.toBeNull();
    await store?.saveWorkspace("/w/dsh-plugins", state);
    expect(await store?.loadWorkspace("/w/dsh-plugins")).toEqual(state);
    await store?.close();
  });

  it("returns null for an unknown workspace instead of throwing", async () => {
    const store = await openArchStore(memoryStorageDomain());
    expect(await store?.loadWorkspace("/w/never-seen")).toBeNull();
    await store?.close();
  });
});
