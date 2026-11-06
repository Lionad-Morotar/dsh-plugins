/**
 * Ask the host for a graceful exit: `appExit(0)` tears down the whole plugin
 * tree, then leaves the process, so dedup belongs to whoever confirmed.
 *
 * Availability is probed with a soft `get("appExit", false)` instead of a
 * declared `inject`: an entry the host does not define would keep the whole
 * plugin pending forever, silently, while `appExit` is legitimately optional
 * (older hosts, non-DSH embeds).
 *
 * Two answers come out of the same probe, and both are needed. `appExit` exists
 * only in hosts whose launcher owns the process — the CLI binary, `dsh web`
 * started from a terminal — and never in the Desktop shell, which spawns the
 * Host as a child and owns quitting itself through the application menu. A quit
 * row listed there could only ever fail, so the client asks this probe before
 * it lists the row at all, and the confirm path keeps the second, stricter
 * answer for the case where the capability went away between listing and firing.
 */
export interface ShutdownContext {
  get?(name: string, strict?: boolean): unknown;
}

function appExitOf(ctx: ShutdownContext): ((code: number) => void) | undefined {
  try {
    const exit = ctx.get?.("appExit", false);
    return typeof exit === "function" ? (exit as (code: number) => void) : undefined;
  } catch {
    return undefined;
  }
}

/**
 * Whether this host can end the process on request.
 *
 * @param ctx - the host half's Cordis context, where `appExit` actually lives.
 * @returns true when a callable `appExit` is in hand.
 */
export function shutdownAvailable(ctx: ShutdownContext): boolean {
  return appExitOf(ctx) !== undefined;
}

export function requestShutdown(ctx: ShutdownContext): "requested" | "unavailable" {
  const exit = appExitOf(ctx);
  if (exit === undefined) return "unavailable";
  try {
    // Answer first, exit on the next macrotask: the launcher's exit disposes
    // this whole tree, the web server included, so firing it in-line drops the
    // RPC response the client is waiting on (live probe: the connection closed
    // with no answer while the process had already exited cleanly).
    setTimeout(() => {
      try {
        exit(0);
      } catch {
        // Nothing left to tell: the process is on its way out regardless.
      }
    }, 0);
    return "requested";
  } catch {
    return "unavailable";
  }
}
