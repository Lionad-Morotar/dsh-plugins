/**
 * The workspace channel's three endpoints, minus the Cordis wiring.
 *
 * Everything here is a plain function over an injected filesystem face and an
 * injected platform, so containment and argv are testable without a host and
 * without spawning anything. The service class in `../index.ts` resolves the
 * session's working directory and hands the rest over.
 *
 * Two rules carry the whole feature. Containment is decided by the backend
 * (`fs.contains`), never by string prefixes: a symlink or a `..` segment
 * defeats a prefix test, and the answer has to be the same one the backend uses
 * for every other write. And "reveal" means the file manager selects the entry,
 * so each platform gets the argv that selects rather than the one that opens.
 */
import path from "node:path";

import type {
  FsTargetFace,
  WorkspaceCapabilities,
  WorkspaceCapabilitiesResult,
  WorkspaceFailure,
  WorkspaceFailureCode,
  WorkspaceInfoRequest,
  WorkspaceInfoResult,
  WorkspacePathInfo,
  WorkspaceRevealRequest,
  WorkspaceRevealResult,
} from "./types.ts";

/** Longest backend message that may ride the wire; the client only displays it. */
const MAX_MESSAGE = 600;

/** The slice of a spawned child this module listens to. */
export interface RevealChild {
  on(event: "error", listener: (error: Error) => void): unknown;
  on(event: "exit", listener: (code: number | null) => void): unknown;
  /** Present only when the caller asked for a piped stdout. */
  readonly stdout?: { on(event: "data", listener: (chunk: unknown) => void): unknown } | null;
}

/** The platform spawn, narrowed to the options this module sets. */
export type RevealSpawn = (
  command: string,
  args: readonly string[],
  options: { readonly stdio: readonly ["ignore", "pipe" | "ignore", "ignore"]; readonly windowsHide: true },
) => RevealChild;

/**
 * Everything platform-shaped, injectable so a test never spawns for real.
 *
 * `env` is the process environment the display-server and WSL probes read;
 * `spawn` is the one side effect.
 */
export interface WorkspaceEnv {
  readonly platform: NodeJS.Platform;
  readonly env: Readonly<Record<string, string | undefined>>;
  readonly spawn: RevealSpawn;
  /** Kernel release string; the WSL probe reads it when no WSL variable is set. */
  readonly release?: string;
}

/**
 * Structural slice of `ctx.fs` this channel needs.
 *
 * Narrower than the document channel's slice on purpose: nothing here reads or
 * writes content, so a fake only has to answer the four questions a path raises.
 * `contains` is optional so the absence is a code (`unsupported`) rather than a
 * crash, and `processPath` is optional only for the same reason `stat` is not:
 * every installed backend has both.
 */
export interface WorkspaceFsFace {
  resolve(path: string, opts?: { readonly cwd?: string; readonly signal?: AbortSignal }): Promise<FsTargetFace>; stat(target: FsTargetFace, signal?: AbortSignal): Promise<{ readonly type: "file" | "directory" | "other" } | undefined>; contains?(parent: FsTargetFace, child: FsTargetFace): boolean; processPath?(target: FsTargetFace): string; }

/** What one endpoint call needs beyond the request. */
export interface WorkspaceDeps {
  readonly fs: WorkspaceFsFace; 
  /** Resolved session working directory; relative request paths resolve here. */
  readonly cwd: string;
  readonly env: WorkspaceEnv;
}

function messageOf(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

export function fail(
  code: WorkspaceFailureCode,
  message: string,
): { readonly ok: false; readonly error: WorkspaceFailure } {
  return { ok: false, error: { code, message: message.slice(0, MAX_MESSAGE) } };
}

/**
 * Backend failures that already have a client-facing meaning.
 *
 * `FsError` is identified by its stable `code` field rather than `instanceof`:
 * the backend may be a different copy of the protocol package, and a class
 * check would then miss every real error.
 */
const FS_FAILURES: Readonly<Record<string, WorkspaceFailureCode>> = {
  FS_NOT_FOUND: "not-found",
  FS_NOT_DIRECTORY: "not-found",
  FS_PERMISSION_DENIED: "permission",
};

function codeOf(error: unknown): string | undefined {
  if (typeof error !== "object" || error === null) return undefined;
  const { code } = error as { code?: unknown };
  return typeof code === "string" ? code : undefined;
}

/** Collapse a thrown backend error into the response union. */
function failureOf(error: unknown): { readonly ok: false; readonly error: WorkspaceFailure } {
  const code = codeOf(error);
  return fail((code === undefined ? undefined : FS_FAILURES[code]) ?? "io-error", messageOf(error));
}

/** Whether one environment marker is set to a non-empty value. */
function present(value: string | undefined): boolean {
  return value !== undefined && value !== "";
}

/** A Linux host that is actually WSL, where the Windows shell takes the path. */
function isWsl(env: WorkspaceEnv): boolean {
  if (present(env.env.WSL_DISTRO_NAME) || present(env.env.WSL_INTEROP)) return true;
  return (env.release ?? "").toLowerCase().includes("microsoft");
}

/**
 * The file manager this host can hand a path to.
 *
 * macOS and Windows always carry one. Linux has one when it is WSL (the Windows
 * desktop takes the path) or a display server is announced; a headless or
 * containerised Linux host answers null, which is what lets the menu show the
 * row as unavailable instead of spawning `xdg-open` into nothing.
 * @param env - platform and environment facts.
 * @returns the file manager, or null when this host has none.
 */
export function fileManagerOf(env: WorkspaceEnv): WorkspaceCapabilities["fileManager"] {
  if (env.platform === "darwin") return "finder";
  if (env.platform === "win32") return "explorer";
  if (env.platform !== "linux") return null;
  if (isWsl(env)) return "explorer";
  return present(env.env.DISPLAY) || present(env.env.WAYLAND_DISPLAY) ? "directory" : null;
}

/**
 * What the client needs to label and enable the reveal row.
 * @param env - platform and environment facts.
 * @returns the file manager and whether reveal can run at all.
 */
export function workspaceCapabilities(env: WorkspaceEnv): WorkspaceCapabilities {
  const fileManager = fileManagerOf(env);
  return { fileManager, canReveal: fileManager !== null };
}

/** The path implementation that matches the platform being asked about. */
function pathOf(platform: NodeJS.Platform): typeof path.win32 {
  return platform === "win32" ? path.win32 : path.posix;
}

/** One resolved request: the target, its absolute path and the workspace root. */
interface ResolvedTarget {
  readonly target: FsTargetFace;
  readonly absolutePath: string;
  readonly root: FsTargetFace;
}

/**
 * Resolve one request path and prove it sits inside the session's workspace.
 *
 * The absolute path is `processPath`, the one value a backend documents as an
 * absolute path in its execution world; `displayPath` is UI-facing and may be
 * relative to the session cwd, which is not something to hand a spawn.
 * @param deps - filesystem, working directory and platform.
 * @param requestPath - workspace-relative or absolute path from the client.
 * @param signal - caller lifetime.
 * @returns the resolved target, or the failure to answer with.
 */
async function resolveInside(
  deps: WorkspaceDeps,
  requestPath: unknown,
  signal?: AbortSignal,
): Promise<ResolvedTarget | { readonly ok: false; readonly error: WorkspaceFailure }> {
  if (typeof requestPath !== "string" || requestPath.trim() === "") {
    return fail("not-found", "path must be a non-empty string");
  }
  if (typeof deps.fs.contains !== "function") {
    return fail("unsupported", "this filesystem backend cannot prove workspace containment");
  }
  try {
    const root = await deps.fs.resolve(deps.cwd, { cwd: deps.cwd, signal });
    const target = await deps.fs.resolve(requestPath, { cwd: deps.cwd, signal });
    if (!deps.fs.contains(root, target)) {
      return fail("outside-workspace", `${requestPath} is outside the session workspace`);
    }
    return { target, absolutePath: deps.fs.processPath?.(target) ?? target.displayPath, root };
  } catch (error) {
    return failureOf(error);
  }
}

/**
 * Describe one workspace path: where it is, what it is, whether it exists.
 *
 * An absent path is a successful answer with `exists: false`, not a failure:
 * the client asks this before copying a path and before revealing it, and
 * "there is nothing there" is a fact about the path rather than an error in the
 * request.
 * @param deps - filesystem, working directory and platform.
 * @param request - session and path.
 * @param signal - caller lifetime.
 * @returns the description, or the failure to answer with.
 */
export async function describeWorkspacePath(
  deps: WorkspaceDeps,
  request: WorkspaceInfoRequest,
  signal?: AbortSignal,
): Promise<WorkspaceInfoResult> {
  const resolved = await resolveInside(deps, request?.path, signal);
  if ("ok" in resolved) return resolved;
  try {
    const info = await deps.fs.stat(resolved.target, signal);
    const described: WorkspacePathInfo = {
      absolutePath: resolved.absolutePath,
      type: info?.type ?? "other",
      exists: info !== undefined,
    };
    return { ok: true, info: described };
  } catch (error) {
    return failureOf(error);
  }
}

/** One finished child process, as the reveal path reads it. */
interface RunOutcome {
  readonly code: number | null;
  readonly stdout: string;
}

/**
 * Run one command to completion.
 *
 * The `error` event rethrows inside the emitter when nothing handles it, so the
 * listener both records the failure and stops the throw from escaping the
 * promise as an uncaught exception.
 * @param env - platform facts carrying the spawn.
 * @param command - executable name.
 * @param args - argv, already platform-shaped.
 * @param capture - whether to collect stdout (only `wslpath` needs it).
 * @returns the exit code and the collected stdout.
 */
function run(
  env: WorkspaceEnv,
  command: string,
  args: readonly string[],
  capture = false,
): Promise<RunOutcome> {
  return new Promise((settle, reject) => {
    let child: RevealChild;
    try {
      child = env.spawn(command, args, {
        stdio: ["ignore", capture ? "pipe" : "ignore", "ignore"],
        windowsHide: true,
      });
    } catch (error) {
      reject(error);
      return;
    }
    let stdout = "";
    let settled = false;
    const finish = (outcome: RunOutcome): void => {
      if (settled) return;
      settled = true;
      settle(outcome);
    };
    const abort = (error: Error): void => {
      if (settled) return;
      settled = true;
      reject(error);
    };
    child.on("error", abort);
    if (capture) {
      child.stdout?.on("data", chunk => {
        stdout += typeof chunk === "string" ? chunk : Buffer.isBuffer(chunk) ? chunk.toString("utf8") : String(chunk);
      });
    }
    child.on("exit", code => finish({ code, stdout }));
  });
}

/**
 * Hand one absolute path to the platform's file manager, selecting the entry.
 *
 * Windows is the one platform that reports success as a failure: Explorer exits
 * 1 after delegating the request to the desktop process already running, so
 * exit 1 means the shell took it. Every other non-zero exit is a real failure.
 * @param env - platform facts.
 * @param absolutePath - canonical absolute path inside the workspace.
 * @returns nothing; a refusal is thrown for the caller to map.
 */
async function revealOn(
  env: WorkspaceEnv,
  absolutePath: string,
): Promise<void> {
  const manager = fileManagerOf(env);
  if (manager === "finder") {
    const outcome = await run(env, "open", ["-R", absolutePath]);
    if (outcome.code !== 0) throw new Error(`open -R exited with ${String(outcome.code)}`);
    return;
  }
  if (manager === "explorer") {
    let windowsPath = absolutePath;
    if (env.platform === "linux") {
      const translated = await run(env, "wslpath", ["-w", absolutePath], true);
      if (translated.code !== 0) throw new Error(`wslpath exited with ${String(translated.code)}`);
      windowsPath = translated.stdout.replace(/[\r\n]+$/u, "");
      if (windowsPath === "") throw new Error("wslpath returned no Windows path");
    }
    // Two argv elements on purpose: the selector is its own field, so a comma
    // inside the path cannot be read as part of `/select,`.
    const outcome = await run(env, "explorer.exe", ["/select,", windowsPath]);
    if (outcome.code !== 0 && outcome.code !== 1) {
      throw new Error(`explorer.exe exited with ${String(outcome.code)}`);
    }
    return;
  }
  if (manager === "directory") {
    const outcome = await run(env, "xdg-open", [pathOf(env.platform).dirname(absolutePath)]);
    if (outcome.code !== 0) throw new Error(`xdg-open exited with ${String(outcome.code)}`);
    return;
  }
  throw Object.assign(new Error(`no file manager on ${env.platform}`), { code: "unsupported" });
}

/**
 * Reveal one workspace path in the host's file manager.
 *
 * The path is resolved, proved to exist and proved to sit inside the workspace
 * before anything is spawned: a reveal is a request to the reader's desktop, and
 * a path that escaped the workspace would be exactly the wrong thing to hand it.
 * @param deps - filesystem, working directory and platform.
 * @param request - session and path.
 * @param signal - caller lifetime.
 * @returns a receipt, or the failure to answer with.
 */
export async function revealWorkspacePath(
  deps: WorkspaceDeps,
  request: WorkspaceRevealRequest,
  signal?: AbortSignal,
): Promise<WorkspaceRevealResult> {
  const resolved = await resolveInside(deps, request?.path, signal);
  if ("ok" in resolved) return resolved;
  if (fileManagerOf(deps.env) === null) {
    return fail("unsupported", `no file manager is available on ${deps.env.platform}`);
  }
  try {
    const info = await deps.fs.stat(resolved.target, signal);
    if (info === undefined) return fail("not-found", `${request.path} does not exist`);
    await revealOn(deps.env, resolved.absolutePath);
    return { ok: true };
  } catch (error) {
    if (codeOf(error) === "unsupported") return fail("unsupported", messageOf(error));
    return failureOf(error);
  }
}

/**
 * Answer the capability probe for one session.
 *
 * The client asks this once per mount so the reveal row can carry the platform's
 * own name for its file manager, and so a host without one shows the row as
 * unavailable with a reason instead of a button that does nothing.
 * @param env - platform facts.
 * @returns the capabilities, always successfully.
 */
export function capabilitiesResult(env: WorkspaceEnv): WorkspaceCapabilitiesResult {
  return { ok: true, capabilities: workspaceCapabilities(env) };
}
