/**
 * The host half that opens a path with the OS default application.
 *
 * Every case injects its own spawn and stat, so nothing here touches a real
 * process or a real filesystem. Expected commands are literals: a test that
 * recomputed the command the way the implementation does could never disagree
 * with it.
 */

import type { ChildProcess } from "node:child_process";
import { EventEmitter } from "node:events";
import { describe, expect, it } from "vitest";

import { openWithDefaultApp, type NativeOpenEnv, type NativeSpawn } from "../src/host/native-open.ts";

interface SpawnCall {
  readonly command: string;
  readonly args: readonly string[];
  readonly options: { readonly stdio?: unknown; readonly windowsHide?: unknown; readonly shell?: unknown };
}

interface FakeSpawn {
  readonly spawn: NativeSpawn;
  readonly calls: SpawnCall[];
  /** The child the next spawn returns; a case replaces it to script an outcome. */
  child: ReturnType<typeof childOf>;
}

/**
 * A child that emits nothing until the case says so.
 *
 * The opener stats the path before it subscribes, so an emit that lands in the
 * same turn is lost. Queueing it lets the subscription win the race without the
 * case having to know about that ordering.
 */
function childOf(): ChildProcess & { emit(event: "error", error: Error): boolean; emit(event: "exit", code: number | null): boolean } {
  const child = new EventEmitter() as ChildProcess & {
    emit(event: "error", error: Error): boolean;
    emit(event: "exit", code: number | null): boolean;
  };
  const emit = child.emit.bind(child);
  child.emit = ((event: "error" | "exit", payload: Error | number | null) => {
    queueMicrotask(() => emit(event, payload as never));
    return true;
  }) as typeof child.emit;
  return child;
}

function fakeSpawn(): FakeSpawn {
  const calls: SpawnCall[] = [];
  const child = childOf();
  return {
    calls,
    child,
    spawn: (command, args, options) => {
      calls.push({ command, args, options });
      return child;
    },
  };
}

/** An environment whose platform, display and filesystem the case decides. */
function envOf(
  overrides: Partial<NativeOpenEnv> & Pick<NativeOpenEnv, "platform">,
): { env: NativeOpenEnv; spawn: FakeSpawn } {
  const spawn = fakeSpawn();
  return {
    spawn,
    env: {
      env: {},
      stat: async () => ({ isFile: () => true }),
      spawn: spawn.spawn,
      ...overrides,
    },
  };
}

describe("openWithDefaultApp", () => {
  it("opens a darwin path with the open command", async () => {
    const { env, spawn } = envOf({ platform: "darwin" });
    const pending = openWithDefaultApp("/Users/lionad/notes/todo.md", env);
    spawn.child.emit("exit", 0);
    await expect(pending).resolves.toBe("opened");
    expect(spawn.calls).toEqual([
      {
        command: "open",
        args: ["/Users/lionad/notes/todo.md"],
        options: { stdio: "ignore", windowsHide: true },
      },
    ]);
  });

  it("opens a windows path through cmd start without a console window", async () => {
    const { env, spawn } = envOf({ platform: "win32" });
    const pending = openWithDefaultApp("C:\\Users\\lionad\\notes\\todo.md", env);
    spawn.child.emit("exit", 0);
    await expect(pending).resolves.toBe("opened");
    expect(spawn.calls).toEqual([
      {
        command: "cmd.exe",
        args: ["/d", "/s", "/c", "start", "", "C:\\Users\\lionad\\notes\\todo.md"],
        options: { stdio: "ignore", windowsHide: true },
      },
    ]);
  });

  it("opens a linux path with xdg-open when a display server is present", async () => {
    const { env, spawn } = envOf({ platform: "linux", env: { DISPLAY: ":0" } });
    const pending = openWithDefaultApp("/home/lionad/notes/todo.md", env);
    spawn.child.emit("exit", 0);
    await expect(pending).resolves.toBe("opened");
    expect(spawn.calls).toEqual([
      {
        command: "xdg-open",
        args: ["/home/lionad/notes/todo.md"],
        options: { stdio: "ignore", windowsHide: true },
      },
    ]);
  });

  it("refuses a headless linux host without spawning", async () => {
    const { env, spawn } = envOf({ platform: "linux", env: { DISPLAY: "", WAYLAND_DISPLAY: "" } });
    await expect(openWithDefaultApp("/home/lionad/notes/todo.md", env)).resolves.toBe("unavailable");
    expect(spawn.calls).toEqual([]);
  });

  it("still opens under WSL when no display server is exported", async () => {
    const { env, spawn } = envOf({
      platform: "linux",
      env: { DISPLAY: "", WAYLAND_DISPLAY: "", WSL_DISTRO_NAME: "Ubuntu" },
    });
    const pending = openWithDefaultApp("/home/lionad/notes/todo.md", env);
    spawn.child.emit("exit", 0);
    await expect(pending).resolves.toBe("opened");
    expect(spawn.calls).toEqual([
      {
        command: "xdg-open",
        args: ["/home/lionad/notes/todo.md"],
        options: { stdio: "ignore", windowsHide: true },
      },
    ]);
  });

  it("refuses a path that does not exist without spawning", async () => {
    const { env, spawn } = envOf({
      platform: "darwin",
      stat: async () => {
        throw new Error("ENOENT");
      },
    });
    await expect(openWithDefaultApp("/Users/lionad/missing.md", env)).resolves.toBe("unavailable");
    expect(spawn.calls).toEqual([]);
  });

  it("refuses a relative path instead of resolving it against the host cwd", async () => {
    const { env, spawn } = envOf({ platform: "darwin" });
    // The exit only settles a mistaken spawn. A correct refusal never subscribes,
    // so the default stat succeeding must not be enough to open anything.
    const pending = openWithDefaultApp("todo.md", env);
    spawn.child.emit("exit", 0);
    await expect(pending).resolves.toBe("unavailable");
    expect(spawn.calls).toEqual([]);
  });

  it("reports a spawn error as a failure", async () => {
    const { env, spawn } = envOf({ platform: "darwin" });
    const pending = openWithDefaultApp("/Users/lionad/notes/todo.md", env);
    spawn.child.emit("error", new Error("ENOENT"));
    await expect(pending).resolves.toBe("failed");
  });

  it("reports a non-zero exit as a failure", async () => {
    const { env, spawn } = envOf({ platform: "darwin" });
    const pending = openWithDefaultApp("/Users/lionad/notes/todo.md", env);
    spawn.child.emit("exit", 1);
    await expect(pending).resolves.toBe("failed");
  });
});
