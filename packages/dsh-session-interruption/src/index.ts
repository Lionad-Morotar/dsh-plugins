/**
 * Host half of dsh-session-interruption.
 *
 * The whole purpose is one projection unit, so the plugin is its registration:
 * the registry is the only injected service, and unloading the plugin removes
 * the key (the registration is an effect on this fiber).
 *
 * @module dsh-session-interruption
 */
import { sessionInterruptionProjectionDefinition } from "./projection.ts";

/** Cordis plugin name. */
export const name = "session-interruption";

/** Without the projection registry the fiber stays pending rather than half-mounting. */
export const inject = ["sessionProjections"];

/**
 * Register the `sessionInterruption` unit.
 * @param ctx - host context carrying the projection registry.
 */
export function apply(ctx: { sessionProjections: { register(definition: typeof sessionInterruptionProjectionDefinition): unknown } }): void {
  ctx.sessionProjections.register(sessionInterruptionProjectionDefinition);
}
