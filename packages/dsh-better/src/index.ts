/**
 * Host half.
 *
 * One contribution: the `sessionCompaction` projection unit. The count of
 * compressions cannot be derived from anything the shell publishes — occupancy
 * says how full the context is, never how often it was rebuilt — so it has to be
 * folded host-side over the session log and shipped to the browser as a wire
 * view. Everything else this package does stays in `dsh.client`.
 *
 * The registry is reached through a soft probe rather than a plugin-level
 * `inject`: on a host without the projection seam the whole browser half (the
 * picker search, the focus chord, the attachment clipboard) must still mount, and
 * a hard dependency would leave the fiber pending instead.
 */
import { sessionCompactionProjection } from "./compaction.ts";

/** Loader row name; must match the id in `cordis.patch.yml`. */
export const name = "dsh-better";

/** Services the host half reads; none directly — the registry is probed. */
export const inject: string[] = [];

/** One registered projection unit, narrowed to what this half calls. */
interface ProjectionRegistryLike {
  register(definition: typeof sessionCompactionProjection): () => void;
}

/** The scope the `sessionProjections` soft probe hands back. */
interface ProjectionScopeLike {
  readonly sessionProjections: ProjectionRegistryLike;
  effect(callback: () => () => void, label?: string): void;
}

/** The host context this half needs. */
interface HostContextLike {
  effect(callback: () => () => void, label?: string): void;
  inject?<T>(dependencies: readonly string[], callback: (scope: T) => void): () => void;
  get?(name: string): unknown;
}

/**
 * Register the `sessionCompaction` unit.
 *
 * The registration rides this plugin's own fiber (through `effect`), so unloading
 * the plugin takes the key back out of every snapshot instead of leaving a value
 * no one maintains.
 * @param scope - scope carrying the registry.
 */
function registerProjection(scope: ProjectionScopeLike): void {
  scope.effect(
    () => scope.sessionProjections.register(sessionCompactionProjection),
    "dsh-better: sessionCompaction projection",
  );
}

/**
 * Register the projection when the host has the seam.
 * @param ctx - host context.
 */
export function apply(ctx: HostContextLike): void {
  if (typeof ctx.inject === "function") {
    ctx.inject<ProjectionScopeLike>(["sessionProjections"], registerProjection);
    return;
  }
  // Hosts whose cordis predates `ctx.inject`: register directly when the service
  // is already mounted, and give up quietly when it is not.
  const registry = ctx.get?.("sessionProjections");
  if (registry !== undefined && registry !== null) {
    registerProjection({
      sessionProjections: registry as ProjectionRegistryLike,
      effect: (callback, label) => ctx.effect(callback, label),
    });
  }
}
