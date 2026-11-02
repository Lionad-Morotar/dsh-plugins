/**
 * Ask the host for a graceful exit: `appExit(0)` tears down the whole plugin
 * tree, then leaves the process, so dedup belongs to whoever confirmed.
 *
 * Availability is probed with a soft `get("appExit", false)` instead of a
 * declared `inject`: an entry the host does not define would keep the whole
 * plugin pending forever, silently, while `appExit` is legitimately optional
 * (older hosts, non-DSH embeds).
 */
export interface ShutdownContext {
  get?(name: string, strict?: boolean): unknown;
}

export function requestShutdown(ctx: ShutdownContext): "requested" | "unavailable" {
  try {
    const exit = ctx.get?.("appExit", false);
    if (typeof exit !== "function") return "unavailable";
    (exit as (code: number) => void)(0);
    return "requested";
  } catch {
    return "unavailable";
  }
}
