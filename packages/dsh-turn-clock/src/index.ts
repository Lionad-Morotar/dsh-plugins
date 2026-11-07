/**
 * Host half of dsh-turn-clock.
 *
 * The whole purpose is one projection unit, so the plugin is its registration:
 * the registry is the only injected service, and unloading the plugin removes
 * the key (the registration is an effect on this fiber).
 *
 * @module dsh-turn-clock
 */
import { turnClockProjectionDefinition } from "./projection.ts";

/** Cordis plugin name. */
export const name = "turn-clock";

/** Without the projection registry the fiber stays pending rather than half-mounting. */
export const inject = ["sessionProjections"];

/**
 * Register the `turnClock` unit.
 * @param ctx - host context carrying the projection registry.
 */
export function apply(ctx: { sessionProjections: { register(definition: typeof turnClockProjectionDefinition): unknown } }): void {
  ctx.sessionProjections.register(turnClockProjectionDefinition);
}
