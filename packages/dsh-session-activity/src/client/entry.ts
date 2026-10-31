/**
 * Browser-half entry.
 *
 * A mountable stub. The host loads this half for every installed plugin, so the
 * package has to hand the loader a plugin object even while the row tinting it
 * exists for is still unwritten. It declares the one service that tinting will
 * read and touches nothing else, so an install today changes nothing on screen.
 *
 * cordis calls `apply(ctx, config)` — the context first, this plugin's config
 * second. The context stays a context here; services come through `inject`.
 */

/** The services this half reads; declared so Cordis resolves them before mounting. */
export const inject = ["sessions"];

/**
 * Mount the row tinting.
 * @param _ctx - client root context; unread until the tinting lands.
 */
export function apply(_ctx: unknown): void {}

/** The plugin object the loader mounts. */
export const clientPlugin = { name: "dsh-session-activity", inject, apply };

export default clientPlugin;
