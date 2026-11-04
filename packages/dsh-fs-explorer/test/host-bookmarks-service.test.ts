/**
 * The bookmark endpoints on the host workspace service.
 *
 * Two promises are under test. A host with a storage domain round-trips a tree
 * through `save` and `load`, keyed by the workspace's canonical path so two
 * sessions in one workspace share it. And a host without one answers `no-storage`
 * rather than failing: that code is what tells the client to keep its own copy in
 * localStorage instead of showing the reader an error they cannot act on.
 */
import { Context } from "@deepseek-ai/cordis";
import { remoteMethods } from "@deepseek-ai/dsh-typert-protocol";
import { describe, expect, it, vi } from "vitest";

import type { BookmarkTree } from "../src/bookmarks.ts";
import type { BookmarkStorageDomainFace, BookmarkTableFace } from "../src/host/bookmarks.ts";
import type { FsTargetFace } from "../src/host/types.ts";
import { FsExplorerWorkspaceService } from "../src/index.ts";

/** One valid tree, small enough to read in a failure message. */
function tree(): BookmarkTree {
  return {
    version: 1,
    updatedAt: "2026-11-03T00:00:00.000Z",
    roots: [
      {
        id: "g1",
        kind: "group",
        name: "Work",
        createdAt: 1,
        children: [{ id: "f1", kind: "file", name: "a.md", path: "docs/a.md", createdAt: 2 }],
      },
    ],
  };
}

/** A target as `resolve` hands it back. */
function targetOf(path: string): FsTargetFace {
  return { targetKey: `tk:${path}`, displayPath: path };
}

/** The filesystem slice the bookmark endpoints touch: resolve and processPath. */
function fakeFs(): {
  readonly resolve: ReturnType<typeof vi.fn>;
  readonly stat: ReturnType<typeof vi.fn>;
  readonly contains: ReturnType<typeof vi.fn>;
  readonly processPath: ReturnType<typeof vi.fn>;
} {
  return {
    resolve: vi.fn(async (path: string) => targetOf(path)),
    stat: vi.fn(async () => ({ type: "directory" as const })),
    contains: vi.fn(() => true),
    processPath: vi.fn((target: FsTargetFace) => target.displayPath),
  };
}

/** One in-memory table, shaped like the host's. */
function fakeTable(initial: Record<string, unknown> = {}): BookmarkTableFace & {
  readonly rows: Map<string, unknown>;
} {
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
function fakeDomain(table: BookmarkTableFace): BookmarkStorageDomainFace {
  return {
    open: async () => ({ table: () => table, close: async () => undefined }),
  };
}

/** A context with a filesystem, one session rooted at `/workspace`, and an optional domain. */
function contextWith(options: { readonly domain?: BookmarkStorageDomainFace } = {}): Context {
  const ctx = new Context();
  ctx.provide("fs", fakeFs());
  ctx.provide("sessions", { get: () => ({ header: { cwd: "/workspace" } }) });
  if (options.domain !== undefined) ctx.provide("storageDomain", options.domain);
  return ctx;
}

describe("bookmark endpoints", () => {
  it("publishes both endpoints beside the workspace ones", () => {
    const service = new FsExplorerWorkspaceService(contextWith());
    expect(remoteMethods(service).map(marker => marker.exportName ?? marker.method)).toEqual([
      "capabilities",
      "info",
      "reveal",
      "create",
      "loadBookmarks",
      "saveBookmarks",
    ]);
  });

  it("answers a null tree for a workspace with no stored bookmarks", async () => {
    const service = new FsExplorerWorkspaceService(contextWith({ domain: fakeDomain(fakeTable()) }));
    await expect(service.loadBookmarks({ sessionId: "s1" })).resolves.toEqual({ ok: true, tree: null });
  });

  it("round-trips a tree through save and load", async () => {
    const table = fakeTable();
    const service = new FsExplorerWorkspaceService(contextWith({ domain: fakeDomain(table) }));
    await expect(service.saveBookmarks({ sessionId: "s1", tree: tree() })).resolves.toEqual({ ok: true });
    await expect(service.loadBookmarks({ sessionId: "s1" })).resolves.toEqual({ ok: true, tree: tree() });
  });

  it("keys the record by the workspace's canonical path", async () => {
    // Two sessions in one workspace must share one record, which is what makes
    // the bookmark bar the same in both.
    const table = fakeTable();
    const ctx = contextWith({ domain: fakeDomain(table) });
    const service = new FsExplorerWorkspaceService(ctx);
    await service.saveBookmarks({ sessionId: "s1", tree: tree() });
    expect([...table.rows.keys()]).toEqual(["/workspace"]);
    await expect(service.loadBookmarks({ sessionId: "s2" })).resolves.toEqual({ ok: true, tree: tree() });
  });

  it("answers no-storage when the host has no storage domain", async () => {
    const service = new FsExplorerWorkspaceService(contextWith());
    await expect(service.loadBookmarks({ sessionId: "s1" })).resolves.toMatchObject({
      ok: false,
      error: { code: "no-storage" },
    });
    await expect(service.saveBookmarks({ sessionId: "s1", tree: tree() })).resolves.toMatchObject({
      ok: false,
      error: { code: "no-storage" },
    });
  });

  it("answers no-workspace before touching storage", async () => {
    const table = fakeTable();
    const ctx = new Context();
    ctx.provide("fs", fakeFs());
    ctx.provide("storageDomain", fakeDomain(table));
    const service = new FsExplorerWorkspaceService(ctx);
    await expect(service.loadBookmarks({ sessionId: "ghost" })).resolves.toMatchObject({
      ok: false,
      error: { code: "no-workspace" },
    });
    expect(table.rows.size).toBe(0);
  });

  it("reads a corrupt record as a null tree instead of failing", async () => {
    const table = fakeTable({ "/workspace": { version: 1, roots: "not an array" } });
    const service = new FsExplorerWorkspaceService(contextWith({ domain: fakeDomain(table) }));
    await expect(service.loadBookmarks({ sessionId: "s1" })).resolves.toEqual({ ok: true, tree: null });
  });

  it("refuses to save a tree the parser rejects", async () => {
    const table = fakeTable();
    const service = new FsExplorerWorkspaceService(contextWith({ domain: fakeDomain(table) }));
    const broken = { version: 1, roots: [{ id: "", kind: "file", name: "x", path: "x", createdAt: 1 }], updatedAt: "t" };
    await expect(
      service.saveBookmarks({ sessionId: "s1", tree: broken as unknown as BookmarkTree }),
    ).resolves.toMatchObject({ ok: false, error: { code: "io-error" } });
    expect(table.rows.size).toBe(0);
  });

  it("reports a storage failure as io-error", async () => {
    const domain: BookmarkStorageDomainFace = {
      open: async () => ({
        table: () => ({
          get: () => undefined,
          put: async () => {
            throw new Error("disk full");
          },
          delete: async () => undefined,
          entries: () => new Map<string, unknown>().entries(),
        }),
        close: async () => undefined,
      }),
    };
    const service = new FsExplorerWorkspaceService(contextWith({ domain }));
    await expect(service.saveBookmarks({ sessionId: "s1", tree: tree() })).resolves.toMatchObject({
      ok: false,
      error: { code: "io-error" },
    });
  });
});
