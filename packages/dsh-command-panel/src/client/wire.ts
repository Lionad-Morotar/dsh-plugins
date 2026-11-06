/**
 * The raw-RPC faces: how this package reaches host services the typed
 * namespace table never mounted for it.
 *
 * The host half publishes its Typert routes at runtime, but the typed
 * `remote.<namespace>` face only exists where a *generated* client
 * contribution was mounted with `ctx.remote.$mount()`, which a third-party
 * package ships none of. The connection service's unary RPC caller reaches the
 * same `/api/<namespace>/<method>` routes, so these adapters are the reliable
 * tier under the injected faces (dsh-git-explorer's client entry is the
 * precedent this follows).
 */

import type {
  GitExplorerRemote,
  GitQueryOutcome,
  HostShutdownRemote,
  NativeOpenFace,
  PathExplorerRemote,
  RemoteResult,
  SessionOpenFace,
  WorkspaceFilesFace,
} from "./dsh.ts";
import type { NativeOpenResult, PathInspectAnswer, PathResolveResult, ShutdownRequestResult } from "../shared.ts";
import { OPEN_SERVICE, PATH_SERVICE, SHUTDOWN_SERVICE } from "../shared.ts";

/** The gateway's unary caller, as the connection service exposes it. */
export interface GatewayRpc {
  call(scope: string, endpoint: string, payload: unknown, signal?: AbortSignal): Promise<unknown>;
}

/** The slice of the connection service this transport reads. */
interface ConnectionFace {
  readonly rpc?: GatewayRpc;
}

/** A context that can resolve client services without throwing. */
export interface RpcContextLike {
  get?(name: string): unknown;
}

/**
 * The connection service's unary caller, or undefined without one.
 *
 * `get` is the non-throwing resolver: a guarded read here degrades to "no raw
 * channel" instead of taking the reveal path down.
 */
export function gatewayRpcOf(ctx: RpcContextLike): GatewayRpc | undefined {
  let connection: unknown;
  try {
    connection = ctx.get?.("connection");
  } catch {
    return undefined;
  }
  const rpc = (connection as ConnectionFace | undefined | null)?.rpc;
  return rpc !== undefined && typeof rpc.call === "function" ? rpc : undefined;
}

/**
 * Fold a raw gateway answer into the RemoteResult union.
 *
 * The gateway validates the envelope, so anything that is still not one is a
 * malformed response rather than a caller-visible exception.
 */
export function foldTransport<T>(raw: unknown): RemoteResult<T> {
  if (raw === null || typeof raw !== "object") {
    return { ok: false, error: { code: "malformed-response", message: "malformed remote response" } };
  }
  const record = raw as { readonly ok?: unknown; readonly value?: unknown; readonly error?: unknown };
  if (record.ok === true) return { ok: true, value: record.value as T };
  if (record.ok === false) {
    const error = record.error as { readonly code?: unknown; readonly message?: unknown } | undefined;
    return {
      ok: false,
      error: {
        code: typeof error?.code === "string" ? error.code : "rpc-failed",
        message: typeof error?.message === "string" ? error.message : undefined,
      },
    };
  }
  return { ok: false, error: { code: "malformed-response", message: "malformed remote response" } };
}

/** One unary call that never rejects into the caller. */
async function invoke(
  rpc: GatewayRpc,
  namespace: string,
  method: string,
  args: Record<string, unknown>,
  signal?: AbortSignal,
): Promise<RemoteResult<unknown>> {
  try {
    return foldTransport(await rpc.call("/api", `${namespace}/${method}`, { args }, signal));
  } catch (error) {
    return {
      ok: false,
      error: { code: "rpc-error", message: error instanceof Error ? error.message : String(error) },
    };
  }
}

/** The hostShutdown face over the raw channel. */
export function createHostShutdownFace(rpc: GatewayRpc): HostShutdownRemote {
  return {
    available: signal =>
      invoke(rpc, SHUTDOWN_SERVICE, "available", {}, signal) as Promise<RemoteResult<boolean>>,
    request: signal =>
      invoke(rpc, SHUTDOWN_SERVICE, "request", {}, signal) as Promise<RemoteResult<ShutdownRequestResult>>,
  };
}

/** The nativeOpen face over the raw channel. */
export function createNativeOpenFace(rpc: GatewayRpc): NativeOpenFace {
  return {
    open: (request, signal) =>
      invoke(rpc, OPEN_SERVICE, "open", { request }, signal) as Promise<RemoteResult<NativeOpenResult>>,
  };
}

/** The pathExplorer face over the raw channel. */
export function createPathExplorerFace(rpc: GatewayRpc): PathExplorerRemote {
  return {
    resolve: (request, signal) =>
      invoke(rpc, PATH_SERVICE, "resolve", { request }, signal) as Promise<RemoteResult<PathResolveResult>>,
    // Same shape as the injected namespace: the sidebar branch must be able to
    // ask what a path is even when only the raw channel answered.
    inspect: (request, signal) =>
      invoke(rpc, PATH_SERVICE, "inspect", { request }, signal) as Promise<RemoteResult<PathInspectAnswer>>,
  };
}

/** The gitExplorer query face over the raw channel (dsh-git-explorer's half). */
export function createGitExplorerFace(rpc: GatewayRpc): GitExplorerRemote {
  return {
    query: (request, signal) =>
      invoke(rpc, "gitExplorer", "query", { request }, signal) as Promise<RemoteResult<GitQueryOutcome>>,
  };
}

/** The session open pair over the raw channel. */
export function createSessionOpenFace(rpc: GatewayRpc): SessionOpenFace {
  return {
    canOpenWorkspacePath: async signal => {
      const result = await invoke(rpc, "session", "canOpenWorkspacePath", {}, signal);
      // A probe that cannot answer is plain "not available here", never a
      // transport failure the reveal path would have to report.
      return { ok: true, value: result.ok && result.value === true };
    },
    openWorkspacePath: (request, signal) =>
      invoke(rpc, "session", "openWorkspacePath", { request }, signal) as Promise<
        RemoteResult<{ readonly opened: true }>
      >,
  };
}

/**
 * The `workspaceFiles` pair over the raw channel.
 *
 * The namespace belongs to the host's own file service, not to this package,
 * so it is reached through the gateway rather than declared in `inject`: a
 * profile without the file workbench then answers "no such path" instead of
 * keeping the whole plugin waiting for a service that will never arrive.
 */
export function createWorkspaceFilesFace(rpc: GatewayRpc): WorkspaceFilesFace {
  return {
    stat: (request, signal) =>
      invoke(rpc, "workspaceFiles", "stat", { request }, signal) as Promise<
        RemoteResult<{ readonly absolutePath: string }>
      >,
    list: (request, signal) =>
      invoke(rpc, "workspaceFiles", "list", { request }, signal) as Promise<RemoteResult<{ readonly path: string }>>,
  };
}
