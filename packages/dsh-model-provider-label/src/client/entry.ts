/**
 * Browser-half entry.
 *
 * One registration on a `single` slot. That slot's contract is what makes this
 * plugin possible at all: it accepts exactly one owner per priority, and the
 * lowest priority renders, so a negative priority replaces the shipped label
 * without patching it. The `Tag` primitive the release marker needs is resolved
 * through the factory's `require` and injected as a prop, because React and the
 * primitive kit are platform modules here, not dependencies of this package.
 *
 * cordis calls `apply(ctx, config)` — the context first, this plugin's config
 * second. The context stays a context here.
 */
import { ModelProviderLabel } from "./model-provider-label.tsx";
import type { Badge } from "./model-provider-label.tsx";

/** The slot this plugin owns. */
export const SLOT = "conversation.input.model.label";
/**
 * One below the shipped entries' priority (0).
 *
 * A single slot refuses a second registration at the same priority and renders
 * the lowest one, so this is the contract's replacement mechanism rather than a
 * collision: the 1017 badge plugin, this slot's only other registrant, never
 * mounts.
 */
export const ENTRY_PRIORITY = -1;

type ModuleRequire = (specifier: string) => unknown;

/** The factory's require, captured at boot because apply never sees it. */
let loaderRequire: ModuleRequire | null = null;

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
 * Resolve the primitive kit's badge through the loader.
 * @returns the Tag component, or undefined when the platform seeds no kit.
 */
export function resolveTag(require: ModuleRequire | null): Badge | undefined {
  if (require === null) return undefined;
  const primitives = require("@deepseek-ai/dsh-client-ui-primitives") as { Tag?: unknown } | undefined;
  return typeof primitives?.Tag === "function" ? (primitives.Tag as Badge) : undefined;
}

/**
 * Mount the label.
 * @param ctx - client root context.
 * @returns the disposer releasing the registration.
 */
export function apply(ctx: ClientContextLike): () => void {
  const Tag = resolveTag(loaderRequire);
  if (Tag === undefined) return () => {};
  let off: (() => void) | undefined;
  ctx.slots.inject(SLOT, () => {
    off = ctx.slots.register(
      { name: SLOT, priority: ENTRY_PRIORITY, inject: () => ({ Tag }) },
      ModelProviderLabel,
    );
    return off;
  });
  return () => off?.();
}

/** Hand the factory's require to the plugin. */
export function boot(require: ModuleRequire): void {
  loaderRequire = require;
}

/** The plugin object the loader mounts. */
export const clientPlugin = { name: "dsh-model-provider-label", inject, apply };

export default clientPlugin;
