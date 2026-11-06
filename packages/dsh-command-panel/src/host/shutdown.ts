/**
 * Ask the host for a graceful exit: `appExit(0)` tears down the whole plugin
 * tree, then leaves the process, so dedup belongs to whoever confirmed.
 *
 * Availability is probed with a soft `get("appExit", false)` instead of a
 * declared `inject`: an entry the host does not define would keep the whole
 * plugin pending forever, silently, while `appExit` is legitimately optional
 * (older hosts, non-DSH embeds).
 *
 * Two answers come out of the same probe, and both are needed. `appExit` is
 * provided by the profile boot in every combination — the CLI and `dsh web`
 * launchers as well as the Desktop shell — so its presence alone does not say
 * "this host may quit on its own". The Desktop shell spawns the Host as an IPC
 * child and reads a self-initiated child exit as a failure: its window drops to
 * "reconnecting" and the application itself lives on. The capability answer
 * therefore also asks whether a parent shell owns this process over that
 * channel, and the client lists the quit row only when the answer is yes to
 * both — otherwise the Desktop quit path stays with the application menu, which
 * asks about running tasks before it ends the whole app.
 */
export interface ShutdownContext {
  get?(name: string, strict?: boolean): unknown;
}

/**
 * The facts that tell whether a launcher owns this process from outside.
 *
 * Node only defines `process.send` when the process was spawned with an IPC
 * channel, which is exactly how the Desktop shell starts the Host. A terminal
 * host (`dsh` / `dsh web`) has no such parent and owns its own exit.
 */
export interface ShellChannel {
  readonly send?: unknown;
  readonly connected?: boolean;
}

/** The live process's channel facts, read once by the host half at mount. */
export function currentShellChannel(): ShellChannel {
  return {
    send: typeof process.send === "function" ? process.send : undefined,
    connected: process.connected,
  };
}

/** Whether a parent shell holds an open IPC channel to this process. */
export function shellOwnsProcess(channel: ShellChannel): boolean {
  return typeof channel.send === "function" && channel.connected === true;
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
 * Whether this host can end the process on request, as a real quit.
 *
 * @param ctx - the host half's Cordis context, where `appExit` actually lives.
 * @param channel - how the process was launched; a shell-owned host answers false.
 * @returns true only when a callable `appExit` is in hand and no shell owns the process.
 */
export function shutdownAvailable(ctx: ShutdownContext, channel: ShellChannel): boolean {
  if (shellOwnsProcess(channel)) return false;
  return appExitOf(ctx) !== undefined;
}

export function requestShutdown(ctx: ShutdownContext, channel: ShellChannel): "requested" | "unavailable" {
  if (shellOwnsProcess(channel)) return "unavailable";
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
