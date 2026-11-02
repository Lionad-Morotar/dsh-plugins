// Host half of dsh-command-panel. The Loader mounts both halves by package
// name. The panel needs two host capabilities no official surface provides:
// the absolute-path branch needs filesystem exploration (workspace surfaces
// are workspace-bound by design), and the quit row needs a shutdown relay,
// because `appExit` lives on the host process's Cordis tree where no client
// context read can reach it. Both services publish one Typert remote namespace
// (`remote.pathExplorer`, `remote.hostShutdown`) and neither declares an
// inject: an entry the host does not define would keep the whole plugin
// pending forever, silently.
import type { Context } from "@deepseek-ai/cordis";

import { PathExplorerService } from "./host/path-explorer.ts";
import { HostShutdownService } from "./host/shutdown-remote.ts";

export { PathExplorerService, HostShutdownService };
export { requestShutdown } from "./host/shutdown.ts";
export { PATH_SERVICE, SHUTDOWN_SERVICE } from "./shared.ts";
export type { PathEntry, PathResolveRequest, PathResolveResult, ShutdownRequestResult } from "./shared.ts";

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
}
