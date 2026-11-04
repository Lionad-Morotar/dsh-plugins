/**
 * The bookmark tree's wire contract and its storage domain.
 *
 * Two things are load-bearing here. `parseBookmarkTree` is the only gate between
 * a JSON blob and the model, so every field it accepts has to be one the model
 * can actually use, and a record it rejects must be rejected with a sentence a
 * human can act on rather than a stack trace. And the domain spec has to be the
 * shape `storageDomain.open()` reads: a bare schema instead of a `valueSchema`
 * wrapper stays invisible while the table is empty and turns the first boot
 * after a record lands into a fatal load failure.
 */
import { describe, expect, it, vi } from "vitest";

import {
  BOOKMARK_DOMAIN_NAME,
  BOOKMARK_DOMAIN_SPEC,
  BOOKMARK_TABLE_NAME,
  parseBookmarkTree,
  type BookmarkTree,
} from "../src/bookmarks.ts";
import {
  openBookmarkStore,
  type BookmarkStorageDomainFace,
  type BookmarkTableFace,
} from "../src/host/bookmarks.ts";

/** One valid tree, deep enough to exercise the nested branch. */
function validTree(): BookmarkTree {
  return {
    version: 1,
    updatedAt: "2026-11-03T00:00:00.000Z",
    roots: [
      {
        id: "g1",
        kind: "group",
        name: "Work",
        createdAt: 1,
        children: [
          { id: "f1", kind: "file", name: "a.md", path: "docs/a.md", createdAt: 2 },
          { id: "d1", kind: "folder", name: "docs", path: "docs", createdAt: 3 },
        ],
      },
      { id: "f2", kind: "file", name: "README", path: "README.md", createdAt: 4 },
    ],
  };
}

/** A tree with one field replaced, for the rejection cases. */
function withRoots(roots: unknown): unknown {
  return { ...validTree(), roots };
}

describe("parseBookmarkTree", () => {
  it("accepts a valid tree and hands back a copy", () => {
    const input = validTree();
    const parsed = parseBookmarkTree(input);
    expect(parsed).toEqual(input);
    // A copy, not the same object: the store hands the parsed value to the
    // model, and the model's operations must not reach back into the caller's.
    expect(parsed).not.toBe(input);
    expect(parsed.roots[0]).not.toBe(input.roots[0]);
  });

  it("accepts an empty tree", () => {
    expect(parseBookmarkTree({ version: 1, roots: [], updatedAt: "2026-11-03T00:00:00.000Z" })).toEqual({
      version: 1,
      roots: [],
      updatedAt: "2026-11-03T00:00:00.000Z",
    });
  });

  it("rejects a non-object", () => {
    for (const value of [null, undefined, 42, "tree", []]) {
      expect(() => parseBookmarkTree(value), JSON.stringify(value)).toThrowError(/object/u);
    }
  });

  it("rejects a version other than 1", () => {
    expect(() => parseBookmarkTree({ ...validTree(), version: 2 })).toThrowError(/version/u);
    expect(() => parseBookmarkTree({ ...validTree(), version: "1" })).toThrowError(/version/u);
  });

  it("rejects roots that are not an array", () => {
    expect(() => parseBookmarkTree(withRoots({}))).toThrowError(/roots/u);
    expect(() => parseBookmarkTree(withRoots(undefined))).toThrowError(/roots/u);
  });

  it("rejects a missing updatedAt", () => {
    const { updatedAt: _omitted, ...without } = validTree();
    expect(() => parseBookmarkTree(without)).toThrowError(/updatedAt/u);
  });

  it("rejects an unknown kind", () => {
    expect(() =>
      parseBookmarkTree(withRoots([{ id: "x", kind: "symlink", name: "x", path: "x", createdAt: 1 }])),
    ).toThrowError(/kind/u);
  });

  it("rejects a node missing a field", () => {
    expect(() => parseBookmarkTree(withRoots([{ id: "x", kind: "file", name: "x", createdAt: 1 }]))).toThrowError(
      /path/u,
    );
    expect(() => parseBookmarkTree(withRoots([{ kind: "file", name: "x", path: "x", createdAt: 1 }]))).toThrowError(
      /id/u,
    );
    expect(() => parseBookmarkTree(withRoots([{ id: "x", kind: "file", path: "x", createdAt: 1 }]))).toThrowError(
      /name/u,
    );
  });

  it("rejects an empty id, name or path", () => {
    expect(() => parseBookmarkTree(withRoots([{ id: "", kind: "file", name: "x", path: "x", createdAt: 1 }]))).toThrowError(
      /id/u,
    );
    expect(() =>
      parseBookmarkTree(withRoots([{ id: "x", kind: "file", name: "  ", path: "x", createdAt: 1 }])),
    ).toThrowError(/name/u);
    expect(() => parseBookmarkTree(withRoots([{ id: "x", kind: "file", name: "x", path: "", createdAt: 1 }]))).toThrowError(
      /path/u,
    );
  });

  it("rejects a non-numeric createdAt", () => {
    expect(() =>
      parseBookmarkTree(withRoots([{ id: "x", kind: "file", name: "x", path: "x", createdAt: "1" }])),
    ).toThrowError(/createdAt/u);
  });

  it("rejects a group whose children are not an array", () => {
    expect(() =>
      parseBookmarkTree(withRoots([{ id: "g", kind: "group", name: "g", createdAt: 1, children: {} }])),
    ).toThrowError(/children/u);
  });

  it("rejects a group without children", () => {
    expect(() => parseBookmarkTree(withRoots([{ id: "g", kind: "group", name: "g", createdAt: 1 }]))).toThrowError(
      /children/u,
    );
  });

  it("rejects a duplicate id anywhere in the tree", () => {
    const duplicated = withRoots([
      { id: "same", kind: "file", name: "a", path: "a", createdAt: 1 },
      { id: "same", kind: "file", name: "b", path: "b", createdAt: 2 },
    ]);
    expect(() => parseBookmarkTree(duplicated)).toThrowError(/duplicate|already/u);
  });

  it("rejects a duplicate id across nesting levels", () => {
    const duplicated = withRoots([
      {
        id: "g",
        kind: "group",
        name: "g",
        createdAt: 1,
        children: [{ id: "g", kind: "file", name: "a", path: "a", createdAt: 2 }],
      },
    ]);
    expect(() => parseBookmarkTree(duplicated)).toThrowError(/duplicate|already/u);
  });

  it("rejects nesting deeper than 32", () => {
    /**
     * A chain of `groups` nested groups with one leaf at the bottom.
     *
     * Depth counts from 1 at the root, so a leaf under 31 groups sits at depth
     * 32 and one under 32 groups sits at 33.
     */
    const chain = (groups: number): unknown => {
      let node: unknown = { id: "leaf", kind: "file", name: "leaf", path: "leaf", createdAt: 1 };
      for (let index = groups; index >= 1; index -= 1) {
        node = { id: `g${String(index)}`, kind: "group", name: `g${String(index)}`, createdAt: 1, children: [node] };
      }
      return node;
    };
    // Depth 32 is the last accepted level; 33 is refused.
    expect(() => parseBookmarkTree(withRoots([chain(31)]))).not.toThrow();
    expect(() => parseBookmarkTree(withRoots([chain(32)]))).toThrowError(/deep|depth/u);
  });
});

describe("BOOKMARK_DOMAIN_SPEC", () => {
  it("names a snake_case domain and one table", () => {
    expect(BOOKMARK_DOMAIN_NAME).toBe("dsh_fs_explorer");
    expect(BOOKMARK_TABLE_NAME).toBe("bookmarks");
    expect(BOOKMARK_DOMAIN_SPEC.name).toBe(BOOKMARK_DOMAIN_NAME);
    expect(BOOKMARK_DOMAIN_SPEC.version).toBe(1);
    expect(BOOKMARK_DOMAIN_SPEC.invalidRecords).toBe("backup-and-skip");
  });

  it("wraps the parser in the valueSchema the host reads", () => {
    // A bare schema leaves `valueSchema` undefined, which stays hidden while the
    // table is empty and fails the first boot after a record lands.
    const table = BOOKMARK_DOMAIN_SPEC.tables[BOOKMARK_TABLE_NAME];
    expect(typeof table.valueSchema.parse).toBe("function");
  });

  it("accepts a valid record through the domain's own schema", () => {
    const table = BOOKMARK_DOMAIN_SPEC.tables[BOOKMARK_TABLE_NAME];
    expect(table.valueSchema.parse(validTree())).toEqual(validTree());
  });

  it("rejects an invalid record through the domain's own schema", () => {
    const table = BOOKMARK_DOMAIN_SPEC.tables[BOOKMARK_TABLE_NAME];
    expect(() => table.valueSchema.parse({ version: 9 })).toThrowError(/version/u);
  });
});

/** One in-memory table, shaped like the host's. */
function fakeTable(initial: Record<string, unknown> = {}): BookmarkTableFace & { readonly rows: Map<string, unknown> } {
  const rows = new Map<string, unknown>(Object.entries(initial));
  return {
    rows,
    get: (key: string) => rows.get(key),
    put: async (key: string, value: unknown) => {
      rows.set(key, value);
    },
    delete: async (key: string) => {
      rows.delete(key);
    },
    entries: () => rows.entries(),
  };
}

/** A storage domain over one fake table. */
function fakeDomain(table: BookmarkTableFace): BookmarkStorageDomainFace & { readonly closed: () => boolean } {
  let closed = false;
  return {
    closed: () => closed,
    open: async () => ({
      table: () => table,
      close: async () => {
        closed = true;
      },
    }),
  };
}

describe("openBookmarkStore", () => {
  it("answers null without a storage domain", async () => {
    await expect(openBookmarkStore(undefined)).resolves.toBeNull();
  });

  it("loads a stored tree", async () => {
    const table = fakeTable({ "/ws": validTree() });
    const store = await openBookmarkStore(fakeDomain(table));
    await expect(store?.load("/ws")).resolves.toEqual(validTree());
  });

  it("answers null for a key that was never stored", async () => {
    const store = await openBookmarkStore(fakeDomain(fakeTable()));
    await expect(store?.load("/ws")).resolves.toBeNull();
  });

  it("answers null for a corrupt record instead of taking the host down", async () => {
    // `invalidRecords: "backup-and-skip"` is the domain's own defence, but a
    // record can still arrive here already parsed by an older schema.
    const table = fakeTable({ "/ws": { version: 1, roots: "not an array" } });
    const store = await openBookmarkStore(fakeDomain(table));
    await expect(store?.load("/ws")).resolves.toBeNull();
  });

  it("parses before writing", async () => {
    const table = fakeTable();
    const store = await openBookmarkStore(fakeDomain(table));
    await store?.save("/ws", validTree());
    expect(table.rows.get("/ws")).toEqual(validTree());
  });

  it("refuses to write a tree the parser rejects", async () => {
    const table = fakeTable();
    const store = await openBookmarkStore(fakeDomain(table));
    const broken = { version: 1, roots: [{ id: "", kind: "file", name: "x", path: "x", createdAt: 1 }], updatedAt: "t" };
    await expect(store?.save("/ws", broken as unknown as BookmarkTree)).rejects.toThrowError(/id/u);
    // Nothing landed: a rejected write must not leave a record the next load
    // would have to quarantine.
    expect(table.rows.has("/ws")).toBe(false);
  });

  it("closes the domain", async () => {
    const domain = fakeDomain(fakeTable());
    const store = await openBookmarkStore(domain);
    await store?.close();
    expect(domain.closed()).toBe(true);
  });

  it("opens the domain with the bookmark spec", async () => {
    const open = vi.fn(async () => ({ table: () => fakeTable(), close: async () => undefined }));
    await openBookmarkStore({ open });
    expect(open).toHaveBeenCalledWith(BOOKMARK_DOMAIN_SPEC);
  });

  it("asks the domain for the bookmark table by name", async () => {
    const table = fakeTable();
    const tableOf = vi.fn(() => table);
    await openBookmarkStore({ open: async () => ({ table: tableOf, close: async () => undefined }) });
    expect(tableOf).toHaveBeenCalledWith(BOOKMARK_TABLE_NAME);
  });
});
