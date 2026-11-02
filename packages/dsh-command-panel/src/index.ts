// Host half of dsh-command-panel. The Loader mounts both halves by package
// name; until this slice the host entry was an empty apply. The panel's
// absolute-path branch needs one host capability the official surfaces refuse
// to provide (workspace-bound by design), so the entry now publishes the
// PathExplorerService: no other host service is required, `inject` stays empty
// and a missing entry there would keep the plugin pending forever.
import { PathExplorerService } from "./host/path-explorer.ts";

export { PathExplorerService };
export { requestShutdown } from "./host/shutdown.ts";
export { PATH_SERVICE } from "./shared.ts";
export type { PathEntry, PathResolveRequest, PathResolveResult } from "./shared.ts";

export const name = "dsh-command-panel";
export const inject: string[] = [];

export default PathExplorerService;
