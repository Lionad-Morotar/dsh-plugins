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

export { NativeOpenService, PathExplorerService, HostShutdownService };
export { requestShutdown } from "./host/shutdown.ts";
export { OPEN_SERVICE, PATH_SERVICE, SHUTDOWN_SERVICE } from "./shared.ts";
export type {
  NativeOpenResult,
  PathEntry,
  PathResolveRequest,
  PathResolveResult,
  ShutdownRequestResult,
} from "./shared.ts";

export const name = "dsh-command-panel";
export const inject: string[] = [];

/**
 * Register both host halves.
 *
 * Constructed rather than handed to `ctx.plugin`: a Service class has no
 * `apply`, and Cordis resolves a class plugin to that method, so the plugin
 * call rejects it and neither namespace is ever published.
 */
export default function apply(ctx: Context): void {
  new PathExplorerService(ctx);
  new HostShutdownService(ctx);
  new NativeOpenService(ctx);
}
