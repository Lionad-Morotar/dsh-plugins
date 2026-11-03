/**
 * The workspace channel's contract, driven through a fake `ctx.fs` and a fake
 * spawn.
 *
 * Two properties are under test and neither is a formatting detail. Containment
 * is the security boundary: a path outside the session's workspace must be
 * refused before anything is spawned, whatever form the client sent it in. And
 * the platform argv is the whole feature: "reveal" means the file manager
 * selects the entry, so an argv that opens the file instead is a wrong answer
 * that still looks like success.
 */
import { Context } from "@deepseek-ai/cordis";
import { posix } from "node:path";
import { remoteMethods } from "@deepseek-ai/dsh-typert-protocol";
import { describe, expect, it, vi } from "vitest";

import {
  createWorkspaceEntry,
  describeWorkspacePath,
  revealWorkspacePath,
  workspaceCapabilities,
  type RevealChild,
  type RevealSpawn,
  type WorkspaceDeps,
  type WorkspaceEnv,
} from "../src/host/workspace.ts";
import type { FsFileInfo, FsTargetFace } from "../src/host/types.ts";
import { FsExplorerDocumentsService, FsExplorerWorkspaceService, apply } from "../src/index.ts";
import { WORKSPACE_SERVICE } from "../src/shared.ts";

const ROOT: FsTargetFace = { targetKey: "tk-root", displayPath: "/workspace" };

/**
 * A target as `resolve` hands it back.
 *
 * The fake keys identity off the display path so `contains` can answer without
 * a real filesystem: a target is inside the root when its path is the root or
 * starts with it.
 */
function targetOf(path: string): FsTargetFace {
  return { targetKey: `tk:${path}`, displayPath: path };
}

interface FakeFs {
  readonly resolve: ReturnType<typeof vi.fn>;
  readonly stat: ReturnType<typeof vi.fn>;
  readonly contains: ReturnType<typeof vi.fn>;
  readonly processPath: ReturnType<typeof vi.fn>;
}

/**
 * A fake filesystem rooted at `/workspace`.
 *
 * `existing` names the paths that stat answers for; everything else is absent,
 * which is what the not-found cases read.
 */
function fakeFs(existing: readonly string[] = ["/workspace/docs/a.md", "/workspace/docs"]): FakeFs {
  const paths = new Set(existing);
  return {
    // Normalized like a real backend: `..` segments are folded before identity,
    // which is what makes the traversal case a containment question rather than
    // a string-prefix accident.
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
  };
}

/** One recorded spawn. */
interface SpawnCall {
  readonly command: string;
  readonly args: readonly string[];
}

/**
 * A spawn that never starts a process.
 *
 * Stdout is delivered as soon as its listener attaches and the exit follows on
 * a macrotask, which is the ordering a real child has: it writes, then exits.
 * A fake that exited first would hide a capture bug behind a passing test.
 */
function fakeSpawn(options: { readonly code?: number | null; readonly stdout?: string } = {}): {
  readonly spawn: RevealSpawn;
  readonly calls: SpawnCall[];
} {
  const calls: SpawnCall[] = [];
  const spawn: RevealSpawn = (command, args) => {
    calls.push({ command, args });
    const listeners: ((value: unknown) => void)[] = [];
    const child: RevealChild = {
      on(event, listener) {
        if (event === "exit") listeners.push(listener as (value: unknown) => void);
        return child;
      },
      stdout: {
        on(_event, listener) {
          (listener as (chunk: string) => void)(options.stdout ?? "");
          return child.stdout;
        },
      },
    };
    setTimeout(() => {
      for (const listener of listeners) listener(options.code ?? 0);
    }, 0);
    return child;
  };
  return { spawn, calls };
}

function env(overrides: Partial<WorkspaceEnv> = {}): WorkspaceEnv {
  return {
    platform: "darwin",
    env: {},
    spawn: fakeSpawn().spawn,
    ...overrides,
  };
}

function deps(fs: FakeFs, overrides: Partial<WorkspaceEnv> = {}): WorkspaceDeps {
  return { fs, cwd: "/workspace", env: env(overrides) };
}

describe("workspaceCapabilities", () => {
  it("names Finder on macOS", () => {
    expect(workspaceCapabilities(env({ platform: "darwin" }))).toEqual({ fileManager: "finder", canReveal: true });
  });

  it("names Explorer on Windows", () => {
    expect(workspaceCapabilities(env({ platform: "win32" }))).toEqual({ fileManager: "explorer", canReveal: true });
  });

  it("names the default file manager on a Linux desktop", () => {
    expect(workspaceCapabilities(env({ platform: "linux", env: { DISPLAY: ":0" } }))).toEqual({
      fileManager: "directory",
      canReveal: true,
    });
    expect(workspaceCapabilities(env({ platform: "linux", env: { WAYLAND_DISPLAY: "wayland-0" } }))).toEqual({
      fileManager: "directory",
      canReveal: true,
    });
  });

  it("names Explorer on WSL, where the Windows desktop takes the path", () => {
    expect(workspaceCapabilities(env({ platform: "linux", env: { WSL_DISTRO_NAME: "Ubuntu" } }))).toEqual({
      fileManager: "explorer",
      canReveal: true,
    });
  });

  it("reports no file manager on a headless Linux host", () => {
    expect(workspaceCapabilities(env({ platform: "linux", env: {} }))).toEqual({
      fileManager: null,
      canReveal: false,
    });
  });

  it("reports no file manager on a platform it does not know", () => {
    expect(workspaceCapabilities(env({ platform: "aix" }))).toEqual({ fileManager: null, canReveal: false });
  });
});

describe("describeWorkspacePath", () => {
  it("answers a file inside the workspace with its absolute path", async () => {
    const fs = fakeFs();
    await expect(describeWorkspacePath(deps(fs), { sessionId: "s1", path: "docs/a.md" })).resolves.toEqual({
      ok: true,
      info: { absolutePath: "/workspace/docs/a.md", type: "file", exists: true },
    });
    expect(fs.resolve).toHaveBeenCalledWith("docs/a.md", { cwd: "/workspace", signal: undefined });
  });

  it("answers a directory", async () => {
    const fs = fakeFs();
    await expect(describeWorkspacePath(deps(fs), { sessionId: "s1", path: "docs" })).resolves.toMatchObject({
      ok: true,
      info: { absolutePath: "/workspace/docs", type: "directory", exists: true },
    });
  });

  it("answers an absent path as not existing rather than as a failure", async () => {
    const fs = fakeFs();
    await expect(describeWorkspacePath(deps(fs), { sessionId: "s1", path: "docs/gone.md" })).resolves.toEqual({
      ok: true,
      info: { absolutePath: "/workspace/docs/gone.md", type: "other", exists: false },
    });
  });

  it("resolves an absolute path against the session cwd, not the process cwd", async () => {
    const fs = fakeFs();
    await describeWorkspacePath(deps(fs), { sessionId: "s1", path: "/workspace/docs/a.md" });
    expect(fs.resolve).toHaveBeenCalledWith("/workspace/docs/a.md", { cwd: "/workspace", signal: undefined });
  });

  it("refuses a path outside the workspace", async () => {
    const fs = fakeFs(["/etc/passwd"]);
    await expect(describeWorkspacePath(deps(fs), { sessionId: "s1", path: "/etc/passwd" })).resolves.toMatchObject({
      ok: false,
      error: { code: "outside-workspace" },
    });
  });

  it("refuses a traversal that escapes the workspace", async () => {
    const fs = fakeFs(["/etc/passwd"]);
    await expect(describeWorkspacePath(deps(fs), { sessionId: "s1", path: "../../etc/passwd" })).resolves.toMatchObject({
      ok: false,
      error: { code: "outside-workspace" },
    });
  });

  it("refuses a blank path before touching the filesystem", async () => {
    const fs = fakeFs();
    await expect(describeWorkspacePath(deps(fs), { sessionId: "s1", path: "  " })).resolves.toMatchObject({
      ok: false,
      error: { code: "not-found" },
    });
    expect(fs.resolve).not.toHaveBeenCalled();
  });

  it("maps a backend refusal to a readable code", async () => {
    const fs = fakeFs();
    fs.resolve.mockRejectedValueOnce(Object.assign(new Error("denied"), { code: "FS_PERMISSION_DENIED" }));
    await expect(describeWorkspacePath(deps(fs), { sessionId: "s1", path: "docs/a.md" })).resolves.toMatchObject({
      ok: false,
      error: { code: "permission" },
    });
  });
});

describe("revealWorkspacePath", () => {
  it("asks Finder to select the entry on macOS", async () => {
    const fs = fakeFs();
    const spawn = fakeSpawn();
    await expect(
      revealWorkspacePath(deps(fs, { platform: "darwin", spawn: spawn.spawn }), { sessionId: "s1", path: "docs/a.md" }),
    ).resolves.toEqual({ ok: true });
    expect(spawn.calls).toEqual([{ command: "open", args: ["-R", "/workspace/docs/a.md"] }]);
  });

  it("asks Explorer to select the entry on Windows", async () => {
    const fs = fakeFs();
    const spawn = fakeSpawn();
    await expect(
      revealWorkspacePath(deps(fs, { platform: "win32", spawn: spawn.spawn }), { sessionId: "s1", path: "docs/a.md" }),
    ).resolves.toEqual({ ok: true });
    // The selector and the path stay separate argv elements, so a comma inside
    // the path cannot be read as part of `/select,`.
    expect(spawn.calls).toEqual([{ command: "explorer.exe", args: ["/select,", "/workspace/docs/a.md"] }]);
  });

  it("accepts Explorer's delegated-handoff exit code 1", async () => {
    const fs = fakeFs();
    const spawn = fakeSpawn({ code: 1 });
    await expect(
      revealWorkspacePath(deps(fs, { platform: "win32", spawn: spawn.spawn }), { sessionId: "s1", path: "docs/a.md" }),
    ).resolves.toEqual({ ok: true });
  });

  it("reports any other Explorer exit as io-error", async () => {
    const fs = fakeFs();
    const spawn = fakeSpawn({ code: 2 });
    await expect(
      revealWorkspacePath(deps(fs, { platform: "win32", spawn: spawn.spawn }), { sessionId: "s1", path: "docs/a.md" }),
    ).resolves.toMatchObject({ ok: false, error: { code: "io-error" } });
  });

  it("opens the parent directory on Linux", async () => {
    const fs = fakeFs();
    const spawn = fakeSpawn();
    await expect(
      revealWorkspacePath(deps(fs, { platform: "linux", env: { DISPLAY: ":0" }, spawn: spawn.spawn }), {
        sessionId: "s1",
        path: "docs/a.md",
      }),
    ).resolves.toEqual({ ok: true });
    expect(spawn.calls).toEqual([{ command: "xdg-open", args: ["/workspace/docs"] }]);
  });

  it("translates the path for the Windows desktop on WSL", async () => {
    const fs = fakeFs();
    const calls: SpawnCall[] = [];
    const spawn: RevealSpawn = (command, args) => {
      calls.push({ command, args });
      const listeners: ((value: unknown) => void)[] = [];
      const child: RevealChild = {
        on(event, listener) {
          if (event === "exit") listeners.push(listener as (value: unknown) => void);
          return child;
        },
        stdout: {
          on(_event, listener) {
            (listener as (chunk: string) => void)("C:\\work\\docs\\a.md\r\n");
            return child.stdout;
          },
        },
      };
      setTimeout(() => {
        for (const listener of listeners) listener(0);
      }, 0);
      return child;
    };
    await expect(
      revealWorkspacePath(deps(fs, { platform: "linux", env: { WSL_DISTRO_NAME: "Ubuntu" }, spawn }), {
        sessionId: "s1",
        path: "docs/a.md",
      }),
    ).resolves.toEqual({ ok: true });
    expect(calls).toEqual([
      { command: "wslpath", args: ["-w", "/workspace/docs/a.md"] },
      { command: "explorer.exe", args: ["/select,", "C:\\work\\docs\\a.md"] },
    ]);
  });

  it("refuses to spawn on a platform with no file manager", async () => {
    const fs = fakeFs();
    const spawn = fakeSpawn();
    await expect(
      revealWorkspacePath(deps(fs, { platform: "linux", env: {}, spawn: spawn.spawn }), {
        sessionId: "s1",
        path: "docs/a.md",
      }),
    ).resolves.toMatchObject({ ok: false, error: { code: "unsupported" } });
    expect(spawn.calls).toEqual([]);
  });

  it("refuses an absent path without spawning", async () => {
    const fs = fakeFs();
    const spawn = fakeSpawn();
    await expect(
      revealWorkspacePath(deps(fs, { spawn: spawn.spawn }), { sessionId: "s1", path: "docs/gone.md" }),
    ).resolves.toMatchObject({ ok: false, error: { code: "not-found" } });
    expect(spawn.calls).toEqual([]);
  });

  it("refuses a path outside the workspace without spawning", async () => {
    const fs = fakeFs(["/etc/passwd"]);
    const spawn = fakeSpawn();
    await expect(
      revealWorkspacePath(deps(fs, { spawn: spawn.spawn }), { sessionId: "s1", path: "/etc/passwd" }),
    ).resolves.toMatchObject({ ok: false, error: { code: "outside-workspace" } });
    expect(spawn.calls).toEqual([]);
  });

  it("reports a spawn that could not start as io-error", async () => {
    const fs = fakeFs();
    const spawn: RevealSpawn = () => {
      throw new Error("spawn ENOENT");
    };
    await expect(
      revealWorkspacePath(deps(fs, { spawn }), { sessionId: "s1", path: "docs/a.md" }),
    ).resolves.toMatchObject({ ok: false, error: { code: "io-error" } });
  });
});

describe("FsExplorerWorkspaceService", () => {
  it("publishes exactly the workspace endpoints", () => {
    const ctx = new Context();
    ctx.provide("fs", fakeFs());
    const service = new FsExplorerWorkspaceService(ctx);
    expect(remoteMethods(service).map(marker => marker.exportName ?? marker.method)).toEqual([
      "capabilities",
      "info",
      "reveal",
      "create",
    ]);
  });

  it("answers no-workspace instead of falling back to the process cwd", async () => {
    const ctx = new Context();
    const fs = fakeFs();
    ctx.provide("fs", fs);
    const service = new FsExplorerWorkspaceService(ctx);
    await expect(service.info({ sessionId: "ghost", path: "docs/a.md" })).resolves.toMatchObject({
      ok: false,
      error: { code: "no-workspace" },
    });
    expect(fs.resolve).not.toHaveBeenCalled();
  });

  it("roots a closed session at its persisted working directory", async () => {
    const ctx = new Context();
    const fs = fakeFs();
    ctx.provide("fs", fs);
    ctx.provide("sessionPersistence", { stat: async () => ({ header: { cwd: "/workspace" } }) });
    const service = new FsExplorerWorkspaceService(ctx);
    await service.info({ sessionId: "s2", path: "docs/a.md" });
    expect(fs.resolve).toHaveBeenCalledWith("docs/a.md", { cwd: "/workspace", signal: undefined });
  });

  it("refuses containment checks a backend cannot answer", async () => {
    const ctx = new Context();
    const { contains: _omitted, ...withoutContains } = fakeFs();
    ctx.provide("fs", withoutContains);
    ctx.provide("sessions", { get: () => ({ header: { cwd: "/workspace" } }) });
    const service = new FsExplorerWorkspaceService(ctx);
    await expect(service.info({ sessionId: "s1", path: "docs/a.md" })).resolves.toMatchObject({
      ok: false,
      error: { code: "unsupported" },
    });
  });
});

describe("apply", () => {
  it("mounts both host namespaces from one row", () => {
    const ctx = new Context();
    ctx.provide("fs", fakeFs());
    apply(ctx, {});
    // Cordis refuses a second registration of one namespace, so a construction
    // that throws "already registered" is the proof the first one landed.
    expect(() => new FsExplorerWorkspaceService(ctx)).toThrowError(/has been registered/u);
    expect(() => new FsExplorerDocumentsService(ctx, {})).toThrowError(/has been registered/u);
  });

  it("publishes the workspace namespace under its own key", () => {
    const ctx = new Context();
    ctx.provide("fs", fakeFs());
    apply(ctx, {});
    expect(WORKSPACE_SERVICE).toBe("fsExplorerWorkspace");
  });

  it("keeps the workspace service's inject list to its one hard dependency", () => {
    // `sessions` and `sessionPersistence` are read through `ctx.get`, not
    // declared: a name the host never provides would keep the row pending
    // forever, silently.
    expect(FsExplorerWorkspaceService.inject).toEqual(["fs"]);
  });
});
