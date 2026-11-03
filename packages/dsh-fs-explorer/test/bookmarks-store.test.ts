/**
 * The client's bookmark store: host storage first, localStorage when there is
 * none.
 *
 * The rule this file protects is that bookmarks never fail loudly. A host with no
 * storage domain, a corrupt record, a browser that refuses localStorage (private
 * mode, a headless test process): each of those has to leave the reader with a
 * working tree, because a bookmark bar that throws on mount is worse than one
 * that forgets.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { BookmarkTree } from "../src/bookmarks.ts";
import { createBookmarkStore } from "../src/client/bookmarks-store.ts";
import type { WorkspaceClient } from "../src/client/workspace-face.ts";

/** One valid tree. */
function tree(): BookmarkTree {
  return {
    version: 1,
    updatedAt: "2026-11-03T00:00:00.000Z",
    roots: [{ id: "f1", kind: "file", name: "a.md", path: "docs/a.md", createdAt: 1 }],
  };
}

/** The key one session's fallback record lives under. */
function keyOf(sessionId: string): string {
  return `dsh-fs-explorer.bookmarks.${sessionId}`;
}

/** A workspace client that answers only the bookmark calls. */
function fakeWorkspace(overrides: Partial<WorkspaceClient> = {}): WorkspaceClient {
  return {
    capabilities: async () => ({ ok: true, capabilities: { fileManager: "finder", canReveal: true } }),
    info: async () => ({ ok: false, error: { code: "io-error", message: "" } }),
    reveal: async () => ({ ok: true }),
    ...overrides,
  };
}

/** A minimal in-memory localStorage. */
function fakeStorage(): Storage {
  const rows = new Map<string, string>();
  return {
    get length() {
      return rows.size;
    },
    clear: () => rows.clear(),
    getItem: (key: string) => rows.get(key) ?? null,
    key: (index: number) => [...rows.keys()][index] ?? null,
    removeItem: (key: string) => void rows.delete(key),
    setItem: (key: string, value: string) => void rows.set(key, value),
  } as Storage;
}

describe("createBookmarkStore", () => {
  let storage: Storage;

  beforeEach(() => {
    storage = fakeStorage();
    vi.stubGlobal("localStorage", storage);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns the host's tree when it has one", async () => {
    const store = createBookmarkStore(
      fakeWorkspace({ loadBookmarks: async () => ({ ok: true, tree: tree() }) }),
    );
    await expect(store.load("s1")).resolves.toEqual(tree());
  });

  it("falls back to localStorage when the host has no storage domain", async () => {
    storage.setItem(keyOf("s1"), JSON.stringify(tree()));
    const store = createBookmarkStore(
      fakeWorkspace({ loadBookmarks: async () => ({ ok: false, error: { code: "no-storage", message: "" } }) }),
    );
    await expect(store.load("s1")).resolves.toEqual(tree());
  });

  it("falls back to localStorage when the host predates the endpoint", async () => {
    storage.setItem(keyOf("s1"), JSON.stringify(tree()));
    // No `loadBookmarks` at all: an older host, not a broken one.
    const store = createBookmarkStore(fakeWorkspace());
    await expect(store.load("s1")).resolves.toEqual(tree());
  });

  it("falls back to localStorage when the host call throws", async () => {
    storage.setItem(keyOf("s1"), JSON.stringify(tree()));
    const store = createBookmarkStore(
      fakeWorkspace({
        loadBookmarks: async () => {
          throw new Error("socket closed");
        },
      }),
    );
    await expect(store.load("s1")).resolves.toEqual(tree());
  });

  it("answers an empty tree when neither side has anything", async () => {
    const store = createBookmarkStore(fakeWorkspace());
    const loaded = await store.load("s1");
    expect(loaded).toMatchObject({ version: 1, roots: [] });
    expect(loaded.updatedAt).toBeTypeOf("string");
  });

  it("answers an empty tree for a corrupt fallback record", async () => {
    storage.setItem(keyOf("s1"), "{not json");
    const store = createBookmarkStore(fakeWorkspace());
    await expect(store.load("s1")).resolves.toMatchObject({ version: 1, roots: [] });
  });

  it("answers an empty tree for a fallback record the parser rejects", async () => {
    storage.setItem(keyOf("s1"), JSON.stringify({ version: 9, roots: [] }));
    const store = createBookmarkStore(fakeWorkspace());
    await expect(store.load("s1")).resolves.toMatchObject({ version: 1, roots: [] });
  });

  it("keeps each session's fallback record apart", async () => {
    storage.setItem(keyOf("s1"), JSON.stringify(tree()));
    const store = createBookmarkStore(fakeWorkspace());
    await expect(store.load("s1")).resolves.toEqual(tree());
    await expect(store.load("s2")).resolves.toMatchObject({ roots: [] });
  });

  it("saves through the host when it can", async () => {
    const saveBookmarks = vi.fn(async () => ({ ok: true as const }));
    const store = createBookmarkStore(fakeWorkspace({ saveBookmarks }));
    await store.save("s1", tree());
    // No signal argument: the store has no caller lifetime to honour.
    expect(saveBookmarks).toHaveBeenCalledWith("s1", tree());
    // Nothing landed in the fallback: the host is the record of truth.
    expect(storage.getItem(keyOf("s1"))).toBeNull();
  });

  it("saves to localStorage when the host has no storage domain", async () => {
    const store = createBookmarkStore(
      fakeWorkspace({ saveBookmarks: async () => ({ ok: false, error: { code: "no-storage", message: "" } }) }),
    );
    await store.save("s1", tree());
    expect(JSON.parse(storage.getItem(keyOf("s1")) ?? "null")).toEqual(tree());
  });

  it("saves to localStorage when the host call throws", async () => {
    const store = createBookmarkStore(
      fakeWorkspace({
        saveBookmarks: async () => {
          throw new Error("socket closed");
        },
      }),
    );
    await store.save("s1", tree());
    expect(JSON.parse(storage.getItem(keyOf("s1")) ?? "null")).toEqual(tree());
  });

  it("keeps a fallback record visible when the host later answers empty", async () => {
    // The failure this protects: a save that fell back, then a host that answers
    // "no record" on the next load. Without the pending marker the empty answer
    // looks like "no bookmarks yet" and shadows the reader's own copy.
    let hostHasRecord = false; const workspace = fakeWorkspace({
      saveBookmarks: async () => ({ ok: false, error: { code: "no-storage", message: "" } }),
      loadBookmarks: async () => ({ ok: true, tree: hostHasRecord ? tree() : null }),
    }); const store = createBookmarkStore(workspace); await store.save("s1", tree()); await expect(store.load("s1")).resolves.toEqual(tree()); }); it("lets a host record win and drops the fallback marker", async () => {
    const workspace = fakeWorkspace({
      saveBookmarks: async () => ({ ok: false, error: { code: "no-storage", message: "" } }),
      loadBookmarks: async () => ({ ok: true, tree: tree() }),
    }); const store = createBookmarkStore(workspace); await store.save("s1", tree()); await expect(store.load("s1")).resolves.toEqual(tree()); // The host now holds it, so the marker is gone and a later empty answer is
    // taken at face value.
    expect(storage.getItem(`${keyOf("s1")}.pending`)).toBeNull(); }); it("clears the marker once the host accepts a save", async () => {
    let hostAccepts = false; const workspace = fakeWorkspace({
      saveBookmarks: async () => (hostAccepts ? { ok: true as const } : { ok: false as const, error: { code: "io-error" as const, message: "" } }),
    }); const store = createBookmarkStore(workspace); await store.save("s1", tree()); expect(storage.getItem(`${keyOf("s1")}.pending`)).toBe("1"); hostAccepts = true; await store.save("s1", tree()); expect(storage.getItem(`${keyOf("s1")}.pending`)).toBeNull(); });   it("round-trips through the fallback", async () => {
    const store = createBookmarkStore(fakeWorkspace());
    await store.save("s1", tree());
    await expect(store.load("s1")).resolves.toEqual(tree());
  });

  it("refuses to save a tree the parser rejects", async () => {
    const saveBookmarks = vi.fn(async () => ({ ok: true as const }));
    const store = createBookmarkStore(fakeWorkspace({ saveBookmarks }));
    const broken = { version: 1, roots: [{ id: "", kind: "file", name: "x", path: "x", createdAt: 1 }], updatedAt: "t" };
    await expect(store.save("s1", broken as unknown as BookmarkTree)).rejects.toThrowError(/id/u);
    expect(saveBookmarks).not.toHaveBeenCalled();
  });

  it("survives a localStorage that throws on read", async () => {
    vi.stubGlobal("localStorage", {
      getItem: () => {
        throw new Error("denied");
      },
      setItem: () => {
        throw new Error("denied");
      },
    });
    const store = createBookmarkStore(fakeWorkspace());
    await expect(store.load("s1")).resolves.toMatchObject({ version: 1, roots: [] });
    await expect(store.save("s1", tree())).resolves.toBeUndefined();
  });

  it("survives a runtime with no localStorage at all", async () => {
    vi.stubGlobal("localStorage", undefined);
    const store = createBookmarkStore(fakeWorkspace());
    await expect(store.load("s1")).resolves.toMatchObject({ version: 1, roots: [] });
    await expect(store.save("s1", tree())).resolves.toBeUndefined();
  });
});
