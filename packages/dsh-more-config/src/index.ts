/**
 * Host half of dsh-more-config.
 *
 * Wiring, and only wiring: the command and the reconciler own all behavior and
 * carry their own tests. `inject` names every service touched, because each is
 * mounted by a different Loader row — without the declaration `apply` can run
 * before a service exists and the plugin installs inert (the lesson
 * dsh-slash-commands learned on its first real launch).
 *
 * `settings` arrives first among equals: the auto-generated Plugins-page form
 * for our namespace is suppressed (the settings section slice is this package's
 * one surface), and its `document-updated` event is the reconciler's trigger.
 * The listener is registered global so it hears the settings service's emit
 * from outside this fiber.
 */
import { createMcpTimeoutCommand, type EditingConfigEditorLike, type SettingsServiceLike } from "./command.ts";
import { createReconciler } from "./reconciler.ts";
import { Config, NS } from "./shadow.ts";

export { Config, NS };

export const name = "dsh-more-config";

/** Every service this package touches; see the header for why it is exhaustive. */
export const inject = ["commands", "settings", "configEditor"];

/** The command registry's surface, spelled structurally. */
interface CommandsServiceLike {
  register(definition: unknown): () => void;
}

/** The Cordis surface apply receives, spelled structurally so the package keeps
 *  no runtime dependency on the harness' internal type packages. */
export interface PluginContextLike {
  readonly commands?: CommandsServiceLike;
  readonly settings?: SettingsServiceLike & {
    /** Presentation policy for this fiber's auto-generated settings page. */
    configure?(options: { auto: boolean }, fiber?: unknown): unknown;
  };
  readonly configEditor?: EditingConfigEditorLike;
  readonly logger?: { info?(message: string): void; warn?(message: string): void; error?(message: string): void };
  /** This fiber, the configure() target. */
  readonly fiber?: unknown;
  /** Register an event listener; `global: true` hears emits from other fibers. */
  on(event: string, handler: (...args: unknown[]) => void, options?: { global?: boolean }): () => void;
  /** Tie a disposer to this fiber's lifetime. */
  effect(setup: () => (() => void) | void, label?: string): unknown;
}

/**
 * Mount: suppress the duplicate auto form, register `/mcp-timeout`, and start
 * the reconciler with its initial sync. Missing services leave the plugin
 * inert with a warning rather than half-registered.
 */
export function apply(ctx: PluginContextLike): void {
  const { settings, configEditor } = ctx;
  if (settings === undefined || configEditor === undefined) {
    ctx.logger?.warn?.(`${NS}: settings or configEditor absent in this composition; plugin mounted inert`);
    return;
  }

  settings.configure?.({ auto: false }, ctx.fiber);

  const command = createMcpTimeoutCommand({ ns: NS, settings, configEditor });
  if (ctx.commands !== undefined) {
    const commands = ctx.commands;
    ctx.effect(() => commands.register(command), `${NS}: /mcp-timeout`);
  }

  const reconciler = createReconciler({
    ns: NS,
    settings,
    configEditor,
    events: {
      on: (event, handler) => ctx.on(event, handler, { global: true }),
    },
    logger: ctx.logger,
  });
  ctx.effect(() => {
    void reconciler.attach();
    return () => reconciler.dispose();
  }, `${NS}: reconciler`);
}
