/**
 * The document channel's contract, driven through a fake `ctx.fs`.
 *
 * Nothing here touches the disk: the point of these tests is the wire shape
 * and the error vocabulary the client half branches on, not the backend's own
 * behaviour. The fake also fixes the installed `readText(target, signal)`
 * signature, which is the one the host composition actually provides — a
 * signature that only exists in our heads would pass here and fail on install.
 */
import { Context } from "@deepseek-ai/cordis";
import { remoteMethods } from "@deepseek-ai/dsh-typert-protocol";
import { describe, expect, it, vi } from "vitest";

import {
  DEFAULT_DOCUMENTS_CONFIG,
  normalizeConfig,
  openDocument,
  saveDocument,
  type DocumentDeps,
} from "../src/host/documents.ts";
import type { FsFileInfo, FsTargetFace, FsWriteOutcome } from "../src/host/types.ts";
import FsExplorerDocumentsService from "../src/index.ts";

/** A target as `resolve` hands it back: the display path is not necessarily absolute. */
const FILE_TARGET: FsTargetFace = { targetKey: "tk-a", displayPath: "notes/a.md" };

/**
 * One `FsError`-shaped rejection.
 *
 * The host's error class is not imported: the mapper reads the stable `code`
 * field structurally, exactly as it must for an error raised by another copy
 * of the protocol package.
 */
function fsError(code: string, message = code): Error {
  return Object.assign(new Error(message), { code });
}

interface FakeFs {
  readonly resolve: ReturnType<typeof vi.fn>;
  readonly stat: ReturnType<typeof vi.fn>;
  readonly readText: ReturnType<typeof vi.fn>;
  readonly writeText: ReturnType<typeof vi.fn>;
  readonly processPath: ReturnType<typeof vi.fn>;
}

/** A fake filesystem: every call is a spy, defaults describe one stable text file. */
function fakeFs(overrides: Partial<FakeFs> = {}): FakeFs {
  const fs: FakeFs = {
    resolve: vi.fn(async () => FILE_TARGET),
    stat: vi.fn(async (): Promise<FsFileInfo | undefined> => ({ version: "v1", type: "file", size: 3 })),
    readText: vi.fn(async () => "abc"),
    writeText: vi.fn(async (): Promise<FsWriteOutcome> => ({ version: "v2" })),
    processPath: vi.fn((target: FsTargetFace) => `/workspace/${target.displayPath}`),
    ...overrides,
  };
  return fs;
}

function deps(fs: FakeFs, maxBytes = DEFAULT_DOCUMENTS_CONFIG.maxBytes): DocumentDeps {
  return { fs, cwd: "/workspace", maxBytes };
}

describe("normalizeConfig", () => {
  it("defaults the document budget to 2 MiB", () => {
    expect(normalizeConfig()).toEqual({ maxBytes: 2 * 1024 * 1024 });
  });

  it("clamps a hostile budget into the 64 KiB..16 MiB window", () => {
    expect(normalizeConfig({ maxBytes: 1 }).maxBytes).toBe(64 * 1024);
    expect(normalizeConfig({ maxBytes: 64 * 1024 * 1024 }).maxBytes).toBe(16 * 1024 * 1024);
    expect(normalizeConfig({ maxBytes: 300_000.9 }).maxBytes).toBe(300_000);
  });

  it("falls back to the default when the value is not a finite number", () => {
    expect(normalizeConfig({ maxBytes: Number.NaN }).maxBytes).toBe(2 * 1024 * 1024);
  });
});

describe("openDocument", () => {
  it("returns the whole text with the observation it was read under", async () => {
    const fs = fakeFs({ readText: vi.fn(async () => "你好") });
    await expect(
      openDocument(deps(fs), { sessionId: "s1", path: "notes/a.md" }),
    ).resolves.toEqual({
      ok: true,
      document: {
        absolutePath: "/workspace/notes/a.md",
        version: "v1",
        text: "你好",
        bytes: 6,
      },
    });
    expect(fs.resolve).toHaveBeenCalledWith("notes/a.md", { cwd: "/workspace", signal: undefined });
  });

  it("rejects a file over the budget without reading it", async () => {
    const fs = fakeFs({
      stat: vi.fn(async () => ({ version: "v1", type: "file", size: 5 })),
    });
    await expect(openDocument(deps(fs, 4), { sessionId: "s1", path: "notes/a.md" })).resolves.toMatchObject({
      ok: false,
      error: { code: "too-large" },
    });
    expect(fs.readText).not.toHaveBeenCalled();
  });

  it("maps a binary rejection to not-text", async () => {
    const fs = fakeFs({ readText: vi.fn(async () => { throw fsError("FS_NOT_TEXT", "binary file"); }) });
    await expect(openDocument(deps(fs), { sessionId: "s1", path: "notes/a.md" })).resolves.toEqual({
      ok: false,
      error: { code: "not-text", message: "binary file" },
    });
  });

  it("reports a vanished target as io-error instead of inventing a version", async () => {
    const fs = fakeFs({ stat: vi.fn(async () => undefined) });
    await expect(openDocument(deps(fs), { sessionId: "s1", path: "notes/a.md" })).resolves.toMatchObject({
      ok: false,
      error: { code: "io-error" },
    });
    expect(fs.readText).not.toHaveBeenCalled();
  });

  it("re-reads once when the version moves under the read", async () => {
    const versions = ["v1", "v2", "v2", "v2"];
    const fs = fakeFs({
      stat: vi.fn(async () => ({ version: versions.shift() ?? "v2", type: "file", size: 3 })),
    });
    const result = await openDocument(deps(fs), { sessionId: "s1", path: "notes/a.md" });
    expect(result).toMatchObject({ ok: true, document: { version: "v2" } });
    expect(fs.readText).toHaveBeenCalledTimes(2);
  });

  it("gives up after the retry instead of returning a torn observation", async () => {
    let version = 0;
    const fs = fakeFs({ stat: vi.fn(async () => ({ version: `v${String((version += 1))}`, type: "file", size: 3 })) });
    await expect(openDocument(deps(fs), { sessionId: "s1", path: "notes/a.md" })).resolves.toMatchObject({
      ok: false,
      error: { code: "io-error" },
    });
  });
});

describe("saveDocument", () => {
  it("passes the opaque version straight into the guarded write", async () => {
    const fs = fakeFs();
    await expect(
      saveDocument(deps(fs), { sessionId: "s1", path: "notes/a.md", text: "hello", expectedVersion: "v1" }),
    ).resolves.toEqual({
      ok: true,
      document: { absolutePath: "/workspace/notes/a.md", version: "v2", bytes: 5 },
    });
    expect(fs.writeText).toHaveBeenCalledWith(
      FILE_TARGET,
      "hello",
      { kind: "replaceIfVersion", version: "v1" },
      undefined,
    );
  });

  it("maps a version mismatch to stale-version", async () => {
    const fs = fakeFs({ writeText: vi.fn(async () => { throw fsError("FS_STALE_VERSION", "file changed since it was read"); }) });
    await expect(
      saveDocument(deps(fs), { sessionId: "s1", path: "notes/a.md", text: "hello", expectedVersion: "v1" }),
    ).resolves.toEqual({
      ok: false,
      error: { code: "stale-version", message: "file changed since it was read" },
    });
  });

  it("maps a non-regular target to not-regular-file", async () => {
    const fs = fakeFs({ writeText: vi.fn(async () => { throw fsError("FS_NOT_REGULAR_FILE"); }) });
    await expect(
      saveDocument(deps(fs), { sessionId: "s1", path: "notes/a.md", text: "hello", expectedVersion: "v1" }),
    ).resolves.toMatchObject({ ok: false, error: { code: "not-regular-file" } });
  });

  it("keeps every other backend failure in io-error", async () => {
    const fs = fakeFs({ writeText: vi.fn(async () => { throw fsError("FS_IO_ERROR", "EACCES"); }) });
    await expect(
      saveDocument(deps(fs), { sessionId: "s1", path: "notes/a.md", text: "hello", expectedVersion: "v1" }),
    ).resolves.toEqual({ ok: false, error: { code: "io-error", message: "EACCES" } });
  });

  it("refuses text over the budget before touching the filesystem", async () => {
    const fs = fakeFs();
    await expect(
      saveDocument(deps(fs, 4), { sessionId: "s1", path: "notes/a.md", text: "hello", expectedVersion: "v1" }),
    ).resolves.toMatchObject({ ok: false, error: { code: "too-large" } });
    expect(fs.resolve).not.toHaveBeenCalled();
  });
});

describe("FsExplorerDocumentsService", () => {
  it("declares the services the app host guarantees", () => {
    expect(FsExplorerDocumentsService.inject).toEqual(["fs", "sessions", "sessionPersistence"]);
  });

  it("exposes exactly the open and save endpoints", () => {
    const ctx = new Context();
    ctx.provide("fs", fakeFs());
    const service = new FsExplorerDocumentsService(ctx, {});
    expect(remoteMethods(service).map(marker => marker.exportName ?? marker.method)).toEqual(["open", "save"]);
  });

  it("refuses to activate without the filesystem service", () => {
    expect(() => new FsExplorerDocumentsService(new Context(), {})).toThrow(/fs service is unavailable/u);
  });

  it("answers no-workspace instead of falling back to the process cwd", async () => {
    const ctx = new Context();
    const fs = fakeFs();
    ctx.provide("fs", fs);
    const service = new FsExplorerDocumentsService(ctx, {});
    await expect(service.open({ sessionId: "ghost", path: "notes/a.md" })).resolves.toMatchObject({
      ok: false,
      error: { code: "no-workspace" },
    });
    expect(fs.resolve).not.toHaveBeenCalled();
  });

  it("roots a closed session at its persisted working directory", async () => {
    const ctx = new Context();
    const fs = fakeFs();
    ctx.provide("fs", fs);
    ctx.provide("sessionPersistence", {
      stat: async (id: string) => (id === "s2" ? { header: { cwd: "/persisted" } } : undefined),
    });
    const service = new FsExplorerDocumentsService(ctx, {});
    await service.open({ sessionId: "s2", path: "notes/a.md" });
    expect(fs.resolve).toHaveBeenCalledWith("notes/a.md", { cwd: "/persisted", signal: undefined });
  });

  it("prefers the live session header over the persisted one", async () => {
    const ctx = new Context();
    const fs = fakeFs();
    ctx.provide("fs", fs);
    ctx.provide("sessions", { get: (id: string) => (id === "s1" ? { header: { cwd: "/live" } } : undefined) });
    ctx.provide("sessionPersistence", { stat: async () => ({ header: { cwd: "/persisted" } }) });
    const service = new FsExplorerDocumentsService(ctx, {});
    await service.open({ sessionId: "s1", path: "notes/a.md" });
    expect(fs.resolve).toHaveBeenCalledWith("notes/a.md", { cwd: "/live", signal: undefined });
  });

  it("applies the clamped budget to the endpoint", async () => {
    const ctx = new Context();
    const fs = fakeFs({ stat: vi.fn(async () => ({ version: "v1", type: "file", size: 70_000 })) });
    ctx.provide("fs", fs);
    ctx.provide("sessions", { get: () => ({ header: { cwd: "/live" } }) });
    // A config below the floor clamps to 64 KiB, so 70 KB is over budget.
    const service = new FsExplorerDocumentsService(ctx, { maxBytes: 1 });
    await expect(
      service.save({ sessionId: "s1", path: "notes/a.md", text: "x".repeat(70_000), expectedVersion: "v1" }),
    ).resolves.toMatchObject({ ok: false, error: { code: "too-large" } });
    expect(fs.resolve).not.toHaveBeenCalled();
  });
});
