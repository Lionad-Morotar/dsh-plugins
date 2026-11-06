/**
 * The write half of the workspace channel.
 *
 * What these tests protect is the product promise behind "new file / new
 * folder": the entry lands inside the directory the reader right-clicked, a name
 * that already exists is refused instead of overwritten, and a refusal describes
 * itself with a code the client can paint. A create that silently truncated an
 * existing file, or that answered success while leaving a sentinel behind, would
 * pass a smoke test and still be wrong.
 */
import { Context } from "@deepseek-ai/cordis";
import { posix } from "node:path";
import { remoteMethods } from "@deepseek-ai/dsh-typert-protocol";
import { describe, expect, it, vi } from "vitest";

import {
  createWorkspaceEntry,
  revealWorkspacePath,
  type RevealChild,
  type RevealSpawn,
  type WorkspaceDeps,
  type WorkspaceEnv,
} from "../src/host/workspace.ts";
import type { FsFileInfo, FsTargetFace, WorkspaceFailure } from "../src/host/types.ts";
import { FsExplorerWorkspaceService } from "../src/index.ts";

/** A target as `resolve` hands it back. */
function targetOf(path: string): FsTargetFace {
  return { targetKey: `tk:${path}`, displayPath: path };
}

/** One `FsError`-shaped rejection, identified by its stable `code` field. */
function fsCode(code: string, message: string): Error {
  return Object.assign(new Error(message), { code });
}

/** A fake filesystem that remembers what a write and a delete touched. */
interface FakeWriteFs {
  readonly resolve: ReturnType<typeof vi.fn>;
  readonly stat: ReturnType<typeof vi.fn>;
  readonly contains: ReturnType<typeof vi.fn>;
  readonly processPath: ReturnType<typeof vi.fn>;
  readonly writeText: ReturnType<typeof vi.fn>;
  readonly deleteFile: ReturnType<typeof vi.fn>;
  /** The paths a write actually created, in order. */
  readonly created: string[];
  /** The paths a delete actually removed, in order. */
  readonly deleted: string[];
}

/**
 * A fake filesystem rooted at `/workspace` whose writes create real entries.
 *
 * `writeText` honours `createIfAbsent` the way the installed backend does: an
 * existing path is refused with `FS_NOT_OBSERVED`, so a test can tell a guarded
 * create from an unconditional overwrite. A write also creates the missing
 * parents, because `fs-local`'s atomic write does, and the directory path
 * depends on that.
 */
function fakeWriteFs(
  options: {
    readonly existing?: readonly string[];
    readonly writeError?: string;
    readonly deleteError?: string;
  } = {},
): FakeWriteFs {
  const paths = new Set(options.existing ?? ["/workspace", "/workspace/docs", "/workspace/docs/a.md"]);
  const created: string[] = [];
  const deleted: string[] = [];
  return {
    created,
    deleted,
    resolve: vi.fn(async (path: string) => targetOf(posix.resolve("/workspace", path))),
    stat: vi.fn(async (target: FsTargetFace): Promise<FsFileInfo | undefined> => {
      const path = target.displayPath;
      if (!paths.has(path)) return undefined;
      return { version: "v1", type: path.endsWith(".md") ? "file" : "directory" };
    }),
    contains: vi.fn((parent: FsTargetFace, child: FsTargetFace) => {
      const root = parent.displayPath.replace(/\/+$/u, "");
      return child.displayPath === root || child.displayPath.startsWith(`${root}/`);
    }),
    processPath: vi.fn((target: FsTargetFace) => target.displayPath),
    writeText: vi.fn(async (target: FsTargetFace, _content: string, expected?: { readonly kind: string }) => {
      if (options.writeError !== undefined) throw fsCode(options.writeError, "write refused");
      if (expected?.kind === "createIfAbsent" && paths.has(target.displayPath)) {
        throw fsCode("FS_NOT_OBSERVED", "cannot overwrite an existing path without reading it first");
      }
      // `fs-local`'s atomic write creates the missing parents recursively, so a
      // sentinel inside a not-yet-existing directory brings that directory with
      // it. A fake that only recorded the file would make the directory create
      // look like it produced nothing.
      const segments = target.displayPath.split("/").filter(segment => segment !== "");
      for (let depth = 1; depth <= segments.length; depth += 1) {
        paths.add(`/${segments.slice(0, depth).join("/")}`);
      }
      created.push(target.displayPath);
      return { version: "v1" };
    }),
    deleteFile: vi.fn(async (target: FsTargetFace) => {
      if (options.deleteError !== undefined) throw fsCode(options.deleteError, "delete refused");
      paths.delete(target.displayPath);
      deleted.push(target.displayPath);
      return { version: "v1" };
    }),
  };
}

/** Platform facts that never spawn: nothing in the write path needs one. */
function env(): WorkspaceEnv {
  const spawn: RevealSpawn = () => {
    throw new Error("the write path must not spawn");
  };
  return { platform: "darwin", env: {}, spawn };
}

function deps(fs: FakeWriteFs): WorkspaceDeps {
  return { fs, cwd: "/workspace", env: env() };
}

describe("createWorkspaceEntry", () => {
  it("creates an empty file inside the directory that was right-clicked", async () => {
    const fs = fakeWriteFs();
    await expect(
      createWorkspaceEntry(deps(fs), { sessionId: "s1", parent: "docs", name: "b.md", kind: "file" }),
    ).resolves.toEqual({ ok: true, path: "docs/b.md" });
    expect(fs.created).toEqual(["/workspace/docs/b.md"]);
    // Empty content on purpose: the reader creates a file to write in it, and
    // seeding it with anything would be this plugin deciding what it is.
    expect(fs.writeText).toHaveBeenCalledWith(
      expect.objectContaining({ displayPath: "/workspace/docs/b.md" }),
      "",
      { kind: "createIfAbsent" },
      undefined,
    );
  });

  it("creates a file at the workspace root when the parent is empty", async () => {
    const fs = fakeWriteFs();
    await expect(
      createWorkspaceEntry(deps(fs), { sessionId: "s1", parent: "", name: "top.md", kind: "file" }),
    ).resolves.toEqual({ ok: true, path: "top.md" });
    expect(fs.created).toEqual(["/workspace/top.md"]);
  });

  it("refuses a file whose name already exists instead of truncating it", async () => {
    const fs = fakeWriteFs();
    await expect(
      createWorkspaceEntry(deps(fs), { sessionId: "s1", parent: "docs", name: "a.md", kind: "file" }),
    ).resolves.toMatchObject({ ok: false, error: { code: "exists" } });
    expect(fs.created).toEqual([]);
  });

  it("creates a directory through a sentinel that is removed again", async () => {
    const fs = fakeWriteFs();
    const result = await createWorkspaceEntry(deps(fs), {
      sessionId: "s1",
      parent: "docs",
      name: "nested",
      kind: "directory",
    });
    expect(result).toEqual({ ok: true, path: "docs/nested" });

    // The sentinel is the only write: the backend's atomic write creates the
    // missing parents, so the directory exists once the sentinel lands.
    expect(fs.created).toHaveLength(1);
    const sentinel = fs.created[0] ?? "";
    expect(sentinel.startsWith("/workspace/docs/nested/.dsh-mkdir-")).toBe(true);
    // And it is gone: a leftover sentinel would surface in the tree as a file.
    expect(fs.deleted).toEqual([sentinel]);
    await expect(fs.stat(targetOf("/workspace/docs/nested"))).resolves.toMatchObject({ type: "directory" });
  });

  it("refuses to write a sentinel that resolves outside the workspace", async () => {
    // The target was proved inside the workspace before the stat; the sentinel
    // is a second resolution, and a directory swapped for a symlink in between
    // would land the write somewhere else. Nothing may be written in that case.
    const fs = fakeWriteFs();
    fs.resolve.mockImplementation(async (path: string) => {
      // Only the sentinel escapes; the parent and the target stay put.
      if (path.includes(".dsh-mkdir-")) return targetOf("/etc/escaped");
      return targetOf(posix.resolve("/workspace", path));
    });
    await expect(
      createWorkspaceEntry(deps(fs), { sessionId: "s1", parent: "docs", name: "nested", kind: "directory" }),
    ).resolves.toMatchObject({ ok: false, error: { code: "outside-workspace" } });
    expect(fs.created).toEqual([]);
  });

  it("refuses a directory whose name already exists", async () => {
    const fs = fakeWriteFs({ existing: ["/workspace", "/workspace/docs", "/workspace/docs/nested"] });
    await expect(
      createWorkspaceEntry(deps(fs), { sessionId: "s1", parent: "docs", name: "nested", kind: "directory" }),
    ).resolves.toMatchObject({ ok: false, error: { code: "exists" } });
    expect(fs.created).toEqual([]);
  });

  it("reports the sentinel path when it cannot be removed", async () => {
    const fs = fakeWriteFs({ deleteError: "FS_IO_ERROR" });
    const result = await createWorkspaceEntry(deps(fs), {
      sessionId: "s1",
      parent: "docs",
      name: "half-made",
      kind: "directory",
    });
    expect(result).toMatchObject({ ok: false, error: { code: "io-error" } });
    // The reader can only act on this if they can find the leftover.
    const failure: WorkspaceFailure | undefined = result.ok ? undefined : result.error;
    expect(failure?.message).toContain("/workspace/docs/half-made/.dsh-mkdir-");
  });

  it("refuses a parent that is not a directory", async () => {
    const fs = fakeWriteFs();
    await expect(
      createWorkspaceEntry(deps(fs), { sessionId: "s1", parent: "docs/a.md", name: "b.md", kind: "file" }),
    ).resolves.toMatchObject({ ok: false, error: { code: "not-directory" } });
    expect(fs.created).toEqual([]);
  });

  it("refuses a parent that does not exist", async () => {
    const fs = fakeWriteFs();
    await expect(
      createWorkspaceEntry(deps(fs), { sessionId: "s1", parent: "ghost", name: "b.md", kind: "file" }),
    ).resolves.toMatchObject({ ok: false, error: { code: "not-found" } });
    expect(fs.created).toEqual([]);
  });

  it("refuses a parent outside the workspace", async () => {
    const fs = fakeWriteFs({ existing: ["/workspace", "/etc"] });
    await expect(
      createWorkspaceEntry(deps(fs), { sessionId: "s1", parent: "/etc", name: "x.md", kind: "file" }),
    ).resolves.toMatchObject({ ok: false, error: { code: "outside-workspace" } });
    expect(fs.created).toEqual([]);
  });

  it("refuses a name that would escape the parent directory", async () => {
    const fs = fakeWriteFs();
    for (const name of ["..", ".", "a/b", "a\\b", "  ", "x\u0000y"]) {
      await expect(
        createWorkspaceEntry(deps(fs), { sessionId: "s1", parent: "docs", name, kind: "file" }),
        JSON.stringify(name),
      ).resolves.toMatchObject({ ok: false, error: { code: "invalid-name" } });
    }
    expect(fs.created).toEqual([]);
  });

  it("refuses a name longer than the limit", async () => {
    const fs = fakeWriteFs();
    await expect(
      createWorkspaceEntry(deps(fs), { sessionId: "s1", parent: "docs", name: "x".repeat(201), kind: "file" }),
    ).resolves.toMatchObject({ ok: false, error: { code: "invalid-name" } });
    // 200 is still a legal name: the limit is a bound, not a style rule.
    await expect(
      createWorkspaceEntry(deps(fs), { sessionId: "s1", parent: "docs", name: "y".repeat(200), kind: "file" }),
    ).resolves.toMatchObject({ ok: true });
  });

  it("trims the name it creates", async () => {
    const fs = fakeWriteFs();
    await expect(
      createWorkspaceEntry(deps(fs), { sessionId: "s1", parent: "docs", name: "  b.md  ", kind: "file" }),
    ).resolves.toEqual({ ok: true, path: "docs/b.md" });
  });

  it("maps a permission refusal onto its own code", async () => {
    const fs = fakeWriteFs({ writeError: "FS_PERMISSION_DENIED" });
    await expect(
      createWorkspaceEntry(deps(fs), { sessionId: "s1", parent: "docs", name: "b.md", kind: "file" }),
    ).resolves.toMatchObject({ ok: false, error: { code: "permission" } });
  });

  it("refuses a directory create when the backend cannot delete", async () => {
    // A directory create leaves a sentinel behind if nothing can remove it, so
    // a backend without `deleteFile` answers before it writes anything.
    const fs = fakeWriteFs();
    const withoutDelete = {
      resolve: fs.resolve,
      stat: fs.stat,
      contains: fs.contains,
      processPath: fs.processPath,
      writeText: fs.writeText,
    };
    await expect(
      createWorkspaceEntry({ fs: withoutDelete, cwd: "/workspace", env: env() }, {
        sessionId: "s1",
        parent: "docs",
        name: "nested",
        kind: "directory",
      }),
    ).resolves.toMatchObject({ ok: false, error: { code: "unsupported" } });
    expect(fs.created).toEqual([]);
  });
});

describe("FsExplorerWorkspaceService create endpoint", () => {
  it("publishes the workspace endpoints", () => {
    const ctx = new Context();
    ctx.provide("fs", fakeWriteFs());
    const service = new FsExplorerWorkspaceService(ctx);
    expect(remoteMethods(service).map(marker => marker.exportName ?? marker.method)).toEqual([
      "capabilities",
      "info",
      "reveal",
      "create",
      "ignored",
      "loadBookmarks",
      "saveBookmarks",
    ]);
  });

  it("answers no-workspace before touching the filesystem", async () => {
    const ctx = new Context();
    const fs = fakeWriteFs();
    ctx.provide("fs", fs);
    const service = new FsExplorerWorkspaceService(ctx);
    await expect(
      service.create({ sessionId: "ghost", parent: "", name: "a.md", kind: "file" }),
    ).resolves.toMatchObject({ ok: false, error: { code: "no-workspace" } });
    expect(fs.writeText).not.toHaveBeenCalled();
  });

  it("creates through the endpoint once the session has a workspace", async () => {
    const ctx = new Context();
    const fs = fakeWriteFs();
    ctx.provide("fs", fs);
    ctx.provide("sessions", { get: () => ({ header: { cwd: "/workspace" } }) });
    const service = new FsExplorerWorkspaceService(ctx);
    await expect(service.create({ sessionId: "s1", parent: "docs", name: "b.md", kind: "file" })).resolves.toEqual({
      ok: true,
      path: "docs/b.md",
    });
  });
});
