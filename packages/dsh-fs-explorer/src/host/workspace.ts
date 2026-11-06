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
import { randomUUID } from "node:crypto";

import type { IgnoredRunner } from "./ignored.ts";
import type {
  FsTargetFace,
  WorkspaceCapabilities,
  WorkspaceCapabilitiesResult,
  WorkspaceCreateRequest,
  WorkspaceCreateResult,
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
 * `spawn` is the one side effect. `git` is optional so a composition that only
 * reveals paths can leave it out; the ignored listing answers `io-error` when it
 * is absent rather than crashing the row.
 */
export interface WorkspaceEnv {
  readonly platform: NodeJS.Platform;
  readonly env: Readonly<Record<string, string | undefined>>;
  readonly spawn: RevealSpawn;
  /** Kernel release string; the WSL probe reads it when no WSL variable is set. */
  readonly release?: string;
  /** Argv-only git, used by the ignored listing. */
  readonly git?: IgnoredRunner;
}

/**
 * Structural slice of `ctx.fs` this channel needs.
 *
 * Narrower than the document channel's slice on purpose: nothing here reads
 * content, so a fake only has to answer the questions a path raises. `contains`
 * is optional so the absence is a code (`unsupported`) rather than a crash, and
 * `deleteFile` is optional for the same reason: a directory create leaves a
 * sentinel behind without it, so the endpoint refuses instead of writing one.
 */
export interface WorkspaceFsFace {
  resolve(path: string, opts?: { readonly cwd?: string; readonly signal?: AbortSignal }): Promise<FsTargetFace>;
  stat(
    target: FsTargetFace,
    signal?: AbortSignal,
  ): Promise<{ readonly type: "file" | "directory" | "other" } | undefined>;
  contains?(parent: FsTargetFace, child: FsTargetFace): boolean;
  writeText?(
    target: FsTargetFace,
    content: string,
    expected?: { readonly kind: "createIfAbsent" },
    signal?: AbortSignal,
  ): Promise<unknown>;
  deleteFile?(target: FsTargetFace, expected?: { readonly version: string }, signal?: AbortSignal): Promise<unknown>;
  processPath?(target: FsTargetFace): string;
}

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
  FS_NOT_DIRECTORY: "not-directory",
  FS_PERMISSION_DENIED: "permission",
  // The backend's own refusal of a guarded create onto an occupied path. It is
  // the only race-free way to answer "this name is taken".
  FS_NOT_OBSERVED: "exists",
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

/** Longest entry name this channel will create. */
const MAX_NAME = 200;

/** The prefix of the temporary file a directory create writes and removes. */
const SENTINEL_PREFIX = ".dsh-mkdir-";

/**
 * Why one typed name cannot become an entry, or the name to create.
 *
 * The check runs on the host, not only in the card: the card is a convenience,
 * and a client that skipped it would otherwise be able to address a different
 * directory than the one it named. `""` is not a legal name here — the caller
 * sends the parent separately, so an empty name has nowhere to land.
 * @param raw - the name as the reader typed it.
 * @returns the trimmed name, or the refusal.
 */
export function checkEntryName(
  raw: unknown,
):
  | { readonly ok: true; readonly name: string }
  | { readonly ok: false; readonly reason: "empty" | "dot" | "separator" | "too-long" } {
  if (typeof raw !== "string") return { ok: false, reason: "empty" };
  const name = raw.trim();
  if (name === "") return { ok: false, reason: "empty" };
  if (name === "." || name === "..") return { ok: false, reason: "dot" };
  // NUL is grouped with the separators because it truncates a path in the C
  // layer the backend eventually calls; the reader's intent is the same.
  if (name.includes("/") || name.includes("\\") || name.includes("\u0000")) {
    return { ok: false, reason: "separator" };
  }
  if (name.length > MAX_NAME) return { ok: false, reason: "too-long" };
  return { ok: true, name };
}

/** The workspace-relative path one created entry will have. */
function joinRelative(parent: string, name: string): string {
  const base = parent.replace(/^\/+|\/+$/gu, "");
  return base === "" ? name : `${base}/${name}`;
}

/**
 * Create one empty file or one empty directory inside the workspace.
 *
 * The parent is resolved, proved to exist, proved to be a directory and proved to
 * sit inside the workspace before anything is written: a create is the one
 * endpoint here that changes the reader's disk, so its boundary is the whole
 * point.
 *
 * A file is one guarded write with empty content, and the backend's own refusal
 * of an occupied target is what makes "this name is taken" race-free. A
 * directory has no `mkdir` in the filesystem abstraction, so it is a sentinel
 * file whose atomic write creates the missing parents, removed immediately: the
 * directory survives the removal because it is the parent of the file, not the
 * file. A backend that cannot delete answers `unsupported` before writing,
 * because a sentinel nobody can remove would surface in the tree as a file.
 * @param deps - filesystem, working directory and platform.
 * @param request - session, parent directory, name and kind.
 * @param signal - caller lifetime.
 * @returns the new entry's workspace-relative path, or the failure to answer with.
 */
export async function createWorkspaceEntry(
  deps: WorkspaceDeps,
  request: WorkspaceCreateRequest,
  signal?: AbortSignal,
): Promise<WorkspaceCreateResult> {
  const checked = checkEntryName(request?.name);
  if (!checked.ok) {
    return fail("invalid-name", `"${String(request?.name)}" is not a usable name (${checked.reason})`);
  }
  const name = checked.name;
  const kind = request?.kind === "directory" ? "directory" : "file";

  if (typeof deps.fs.writeText !== "function") {
    return fail("unsupported", "this filesystem backend cannot create entries");
  }
  if (kind === "directory" && typeof deps.fs.deleteFile !== "function") {
    return fail("unsupported", "this filesystem backend cannot remove the directory sentinel");
  }

  // The root is a legal parent, and `resolveInside` refuses an empty path by
  // design (nothing can be revealed or described without one), so the root is
  // resolved explicitly here.
  const parentPath = typeof request.parent === "string" ? request.parent : "";
  const resolved = await resolveInside(deps, parentPath === "" ? "." : parentPath, signal);
  if ("ok" in resolved) return resolved;

  try {
    const parentInfo = await deps.fs.stat(resolved.target, signal);
    if (parentInfo === undefined) return fail("not-found", `${parentPath} does not exist`);
    if (parentInfo.type !== "directory") return fail("not-directory", `${parentPath} is not a directory`);

    const target = await deps.fs.resolve(joinRelative(parentPath, name), { cwd: deps.cwd, signal });
    if (typeof deps.fs.contains === "function" && !deps.fs.contains(resolved.root, target)) {
      return fail("outside-workspace", `${name} would land outside the session workspace`);
    }

    if (kind === "file") {
      await deps.fs.writeText(target, "", { kind: "createIfAbsent" }, signal);
      return { ok: true, path: joinRelative(parentPath, name) };
    }

    // A directory that already exists is a refusal, not a no-op: the reader
    // asked to make one and there is nothing to make.
    if ((await deps.fs.stat(target, signal)) !== undefined) {
      return fail("exists", `${joinRelative(parentPath, name)} already exists`);
    }
    const sentinelPath = `${joinRelative(parentPath, name)}/${SENTINEL_PREFIX}${randomUUID()}`;
    const sentinel = await deps.fs.resolve(sentinelPath, { cwd: deps.cwd, signal });
    // The target was proved inside the workspace before the stat, but the
    // sentinel is a second resolution of a path that may now pass through a
    // directory swapped for a symlink in between. Checking the resolved sentinel
    // is what closes that window: a write is the one thing here that changes the
    // reader's disk.
    if (typeof deps.fs.contains === "function" && !deps.fs.contains(resolved.root, sentinel)) {
      return fail("outside-workspace", `${name} would land outside the session workspace`);
    }
    await deps.fs.writeText(sentinel, "", { kind: "createIfAbsent" }, signal);
    try {
      await deps.fs.deleteFile?.(sentinel, undefined, signal);
    } catch (error) {
      // The directory exists but carries a file nobody asked for; naming the
      // leftover is the only way the reader can clean it up.
      const absolute = deps.fs.processPath?.(sentinel) ?? sentinel.displayPath;
      return fail("io-error", `created the directory but could not remove ${absolute}: ${messageOf(error)}`);
    }
    return { ok: true, path: joinRelative(parentPath, name) };
  } catch (error) {
    return failureOf(error);
  }
}
