// Host half of dsh-command-panel. The Loader mounts both halves by package
// name. The panel needs three host capabilities no official surface provides:
// the absolute-path branch needs filesystem exploration (workspace surfaces
// are workspace-bound by design), the quit row needs a shutdown relay, because
// `appExit` lives on the host process's Cordis tree where no client context
// read can reach it, and the reveal fallback needs a system-open relay that
// works on a web deployment, where the session namespace refuses the same
// request on purpose. Each service publishes one Typert remote namespace
// (`remote.pathExplorer`, `remote.hostShutdown`, `remote.nativeOpen`) and none
// declares an inject: an entry the host does not define would keep the whole
// plugin pending forever, silently.
import type { Context } from "@deepseek-ai/cordis";

import { NativeOpenService } from "./host/native-open.ts";
import { PathExplorerService } from "./host/path-explorer.ts";
import { HostShutdownService } from "./host/shutdown-remote.ts";
import { currentShellChannel } from "./host/shutdown.ts";

export { NativeOpenService, PathExplorerService, HostShutdownService };
export { currentShellChannel, requestShutdown, shellOwnsProcess } from "./host/shutdown.ts";
export { OPEN_SERVICE, PATH_SERVICE, SHUTDOWN_SERVICE } from "./shared.ts";
export type {
  NativeOpenResult,
  PathEntry,
  PathResolveRequest,
  PathResolveResult,
  ShutdownRequestResult,
} from "./shared.ts";

export const name = "dsh-command-panel";

/**
 * Services this row needs before it can be applied.
 *
 * Empty today, so the module binding and the default export's copy agree by
 * accident. It is still copied onto `apply` below: the Loader reads
 * `module.default.inject`, and a module-level binding alone is invisible to it.
 * The day this list grows, that copy is what keeps the row from activating
 * before its dependency exists.
 */
export const inject: string[] = [];

/**
 * Register both host halves.
 *
 * Constructed rather than handed to `ctx.plugin`: a Service class has no
 * `apply`, and Cordis resolves a class plugin to that method, so the plugin
 * call rejects it and neither namespace is ever published.
 */
export function apply(ctx: Context): void {
  new PathExplorerService(ctx);
  // The quit half is told how this process was launched at mount: a host whose
  // IPC channel belongs to a shell must not offer to exit itself (the shell
  // reads that exit as a failure), so the capability answer depends on it.
  new HostShutdownService(ctx, { channel: currentShellChannel() });
  new NativeOpenService(ctx);
}

/** The dependency list the Loader actually reads; see {@link inject}. */
apply.inject = inject;

export default apply;
