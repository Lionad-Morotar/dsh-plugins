/**
 * Arch state persistence behind the host `storageDomain` service.
 *
 * The product decisions under test: a missing storage service degrades to null
 * (the client half falls back to localStorage) instead of failing the plugin;
 * an available one round-trips one workspace state under its realpath key; and
 * the spec handed to `open()` carries the `{ valueSchema }` table wrapper the
 * host re-parses stored records through, so the first persisted record cannot
 * brick the next host boot.
 */
import { describe, expect, it } from "vitest";

import { ARCH_DOMAIN_SPEC, ARCH_TABLE_NAME, openArchStore } from "../src/host/arch-store.ts";
import type { ArchTableFace, StorageDomainFace } from "../src/host/arch-store.ts";
import type { ArchWorkspaceState } from "../src/shared.ts";

interface DomainSpecFace {
  tables: Record<string, { valueSchema: { parse(raw: unknown): ArchWorkspaceState } }>;
}

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
      // Mirrors the host: every stored record is re-parsed through
      // `spec.tables[name].valueSchema` at open. A bare schema instead of the
      // wrapper fails here — the boot-bricking failure this mock exists to
      // catch.
      const tableSpec = (spec as DomainSpecFace).tables[ARCH_TABLE_NAME];
      if (tableSpec === undefined) throw new Error(`no table spec for ${ARCH_TABLE_NAME}`);
      for (const [key, raw] of records) records.set(key, tableSpec.valueSchema.parse(raw));
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

  it("declares the valueSchema table wrapper the host re-parses records through", () => {
    const valueSchema = ARCH_DOMAIN_SPEC.tables[ARCH_TABLE_NAME].valueSchema;
    expect(valueSchema.parse).toBeTypeOf("function");
    // The on-disk shape parses: a record the schema rejects gets quarantined
    // on the next boot, so a persisted-but-unparsable state is a regression.
    expect(() => valueSchema.parse(state)).not.toThrow();
  });

  it("returns null for an unknown workspace instead of throwing", async () => {
    const store = await openArchStore(memoryStorageDomain());
    expect(await store?.loadWorkspace("/w/never-seen")).toBeNull();
    await store?.close();
  });
});
