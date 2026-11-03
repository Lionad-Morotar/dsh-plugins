/**
 * Host half: open one absolute path with the operating system's default
 * application, from the host process itself.
 *
 * The session namespace's `openWorkspacePath` is deliberately off on a web
 * deployment (a remote browser must not make the server open local files),
 * but this package's host half already runs on the reader's own machine in
 * both deployments. So the reveal fallback asks here first, and only a host
 * that cannot answer falls through to the session pair.
 *
 * The command follows the file association and nothing else: html and svg go
 * to whatever the reader associated, never to a browser special case.
 */
import { spawn as nodeSpawn } from "node:child_process";
import type { ChildProcess, SpawnOptions } from "node:child_process";
import { stat as nodeStat } from "node:fs/promises";
import { release } from "node:os";
import path from "node:path";

import type { Context } from "@deepseek-ai/cordis";
import { Remote, TypertRemoteService } from "@deepseek-ai/dsh-typert-protocol";

import { OPEN_SERVICE, type NativeOpenResult } from "../shared.ts";

export { OPEN_SERVICE };
export type { NativeOpenResult };

/** The slice of a spawned child this opener listens to. */
export interface NativeChild {
  on(event: "error", listener: (error: Error) => void): unknown;
  on(event: "exit", listener: (code: number | null) => void): unknown;
}

/** The platform spawn, narrowed to the options this opener actually sets. */
export type NativeSpawn = (
  command: string,
  args: readonly string[],
  options: { readonly stdio: "ignore"; readonly windowsHide: true },
) => NativeChild;

/**
 * Everything platform-shaped, injectable so a test never spawns for real.
 *
 * `env` is the process environment the display-server and WSL probes read;
 * `stat` and `spawn` are the two side effects.
 */
export interface NativeOpenEnv {
  readonly platform: NodeJS.Platform;
  readonly env: Readonly<Record<string, string | undefined>>;
  readonly stat: (target: string) => Promise<unknown>;
  readonly spawn: NativeSpawn;
  /** Kernel release string; the WSL probe reads it when no WSL variable is set. */
  readonly release?: string;
}

/** The real platform, used when a caller passes no environment. */
const REAL_ENV: NativeOpenEnv = {
  platform: process.platform,
  env: process.env,
  stat: target => nodeStat(target),
  spawn: (command, args, options) => nodeSpawn(command, [...args], options as SpawnOptions) as ChildProcess,
  release: release(),
};

/**
 * The path implementation that matches the platform being asked about.
 *
 * `node:path` follows the host process, so a darwin test process would
 * otherwise treat a Windows path as relative and prepend its own cwd.
 */
function pathOf(platform: NodeJS.Platform): typeof path.win32 {
  return platform === "win32" ? path.win32 : path.posix;
}

/** A Linux host that is actually WSL, where xdg-open reaches the Windows shell. */
function isWsl(env: NativeOpenEnv): boolean {
  if (env.env.WSL_DISTRO_NAME !== undefined && env.env.WSL_DISTRO_NAME !== "") return true;
  if (env.env.WSL_INTEROP !== undefined && env.env.WSL_INTEROP !== "") return true;
  return (env.release ?? "").toLowerCase().includes("microsoft");
}

/** Whether this platform can hand a path to a default application at all. */
function commandFor(
  target: string,
  env: NativeOpenEnv,
): { readonly command: string; readonly args: readonly string[] } | undefined {
  if (env.platform === "darwin") return { command: "open", args: [target] };
  if (env.platform === "win32") {
    // `start` treats its first quoted argument as a window title, so the empty
    // string keeps a path that contains spaces from being swallowed as one.
    return { command: "cmd.exe", args: ["/d", "/s", "/c", "start", "", target] };
  }
  if (env.platform === "linux") {
    const display = env.env.DISPLAY !== undefined && env.env.DISPLAY !== "";
    const wayland = env.env.WAYLAND_DISPLAY !== undefined && env.env.WAYLAND_DISPLAY !== "";
    if (!display && !wayland && !isWsl(env)) return undefined;
    return { command: "xdg-open", args: [target] };
  }
  return undefined;
}

/**
 * Open one path with the default application, answering instead of throwing.
 *
 * A path that is empty, not already absolute, or absent on disk is
 * `"unavailable"`: there is nothing a default application could open.
 * `path.resolve` always yields an absolute path, so absoluteness is judged on
 * the input. A relative path is not anchored to this process's cwd, where a
 * same-named file would be the wrong one. Resolution only folds `.` and `..`
 * inside a path that was already absolute. A platform without a display
 * server answers the same way, and never spawns. `"failed"` is reserved for
 * a spawn that errored or exited non-zero.
 */
export async function openWithDefaultApp(
  target: string,
  env: NativeOpenEnv = REAL_ENV,
): Promise<NativeOpenResult> {
  if (target === "") return "unavailable";
  const paths = pathOf(env.platform);
  if (!paths.isAbsolute(target)) return "unavailable";
  const absolute = paths.resolve(target);
  try {
    await env.stat(absolute);
  } catch {
    return "unavailable";
  }
  const command = commandFor(absolute, env);
  if (command === undefined) return "unavailable";
  return new Promise(settle => {
    let child: NativeChild;
    try {
      child = env.spawn(command.command, command.args, { stdio: "ignore", windowsHide: true });
    } catch {
      settle("failed");
      return;
    }
    let settled = false;
    const finish = (result: NativeOpenResult): void => {
      if (settled) return;
      settled = true;
      settle(result);
    };
    // An `error` event rethrows inside the emitter when nothing handles it, so
    // the listener both records the failure and stops the throw from escaping
    // the promise as an uncaught exception.
    child.on("error", () => {
      finish("failed");
    });
    child.on("exit", code => finish(code === 0 ? "opened" : "failed"));
  });
}

/**
 * The one endpoint the panel's reveal fallback calls.
 *
 * No host service is required, so `inject` stays empty: an entry the host does
 * not define would keep the whole plugin waiting forever, silently.
 *
 * Wire shape: the request object is the first parameter and an optional
 * trailing `AbortSignal` the last, both under their literal names. The gateway
 * reads those names back from the running function's source, so a renamed or
 * minified parameter turns every call into `gateway/arguments-invalid`.
 */
export class NativeOpenService extends TypertRemoteService {
  static inject: string[] = [];

  constructor(ctx: Context) {
    super(ctx, OPEN_SERVICE);
  }

  @Remote("open")
  async open(request: { path: string }, signal?: AbortSignal): Promise<NativeOpenResult> {
    void signal;
    const path = request?.path;
    if (typeof path !== "string") return "unavailable";
    return openWithDefaultApp(path);
  }
}
