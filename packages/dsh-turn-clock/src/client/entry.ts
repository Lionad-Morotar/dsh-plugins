/**
 * Browser-half entry.
 *
 * Registers one invisible seat in the composer dock. Nothing about the shipped
 * Turn labels is a slot, so the seat's whole job is to own the patcher's
 * lifetime: while it is mounted, the two labels on screen show the working
 * clock; when the plugin unmounts, the next host render restores the shipped
 * wall span with no residue.
 *
 * Everything the platform owns is resolved here, once, and injected as plain
 * props. Nothing below this line imports React DOM or the primitive kit: a
 * bundled second copy of either would break hooks outright.
 *
 * cordis calls `apply(ctx, config)` — the context first, this plugin's config
 * second. The context stays a context here; services come through `inject`.
 */
import { ENTRY_ID, ENTRY_ORDER, ENTRY_PRIORITY, SLOT } from "./registration.ts";
import { ClockWatch } from "./watch.tsx";

export { ENTRY_ID, ENTRY_ORDER, ENTRY_PRIORITY, SLOT } from "./registration.ts";

type ModuleRequire = (specifier: string) => unknown;

/** The services the registration reads; declared so Cordis resolves them first. */
export const inject = ["slots"];

/** The slice of the client context this entry uses. */
export interface ClientContextLike {
  readonly slots: {
    inject(slot: string, factory: () => () => void): void;
    register(options: Record<string, unknown>, component: unknown): () => void;
  };
}

/**
 * Mount the clock seat.
 * @param ctx - client root context.
 */
export function apply(ctx: ClientContextLike): void {
  ctx.slots.inject(SLOT, () =>
    ctx.slots.register(
      {
        name: SLOT,
        id: ENTRY_ID,
        order: ENTRY_ORDER,
        priority: ENTRY_PRIORITY,
      },
      ClockWatch,
    ),
  );
}

/** The loader hands the factory's `require` to the plugin; nothing here needs it. */
export function boot(_require: ModuleRequire): void {}

/** The plugin object the loader mounts. */
export const clientPlugin = { name: "dsh-turn-clock", inject, apply };

export default clientPlugin;
