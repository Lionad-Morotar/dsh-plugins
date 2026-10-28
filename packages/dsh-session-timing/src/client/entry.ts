/**
 * Browser-half entry.
 *
 * Registers one entry in the composer dock: the session statistics pill. It
 * takes the seat the shipped `activity` pill occupies rather than sitting next
 * to it, because the two would print the same turn/step counts twice — and the
 * slot contract has an explicit expression for that. A list slot keeps one live
 * entry per id, ordered by priority then order, and the lowest priority renders,
 * so registering the same id one priority lower replaces the shipped pill
 * without patching ui-chat at all.
 *
 * Everything the platform owns is resolved here, once, through the factory's
 * `require`, and injected as plain props. Nothing below this line imports React
 * or the primitive kit: a bundled second copy of either would render into a
 * detached tree or break hooks outright.
 *
 * cordis calls `apply(ctx, config)` — the context first, this plugin's config
 * second. The context stays a context here; services come through `inject`.
 */
import { createModeStore, type ConfigFormLike, type ModeStore } from "./mode.ts";
import { StatsPill, type PlatformKit } from "./stats-pill.tsx";
import { EN, ZH } from "./copy.ts";
import { CHAT_SETTINGS_NAMESPACE, ENTRY_ID, ENTRY_ORDER, ENTRY_PRIORITY, LOCALE_NAMESPACE, SLOT } from "./registration.ts";

export { ENTRY_ID, ENTRY_ORDER, ENTRY_PRIORITY, LOCALE_NAMESPACE, SLOT } from "./registration.ts";

type ModuleRequire = (specifier: string) => unknown;

/** The factory's require, captured at boot because apply never sees it. */
let loaderRequire: ModuleRequire | null = null;

/** The services the registration reads; declared so Cordis resolves them first. */
export const inject = ["slots", "locale", "configForms"];

/** The slice of the client context this entry uses. */
export interface ClientContextLike {
  readonly slots: {
    inject(slot: string, factory: () => () => void): void;
    register(options: Record<string, unknown>, component: unknown): () => void;
  };
  readonly locale: { register(namespace: string, dictionaries: Record<string, Record<string, string>>): () => void };
  readonly configForms: { get(namespace: string): ConfigFormLike };
}

/**
 * Resolve the platform kit through the loader.
 *
 * Partial availability is a hard no: a pill without its placement hook cannot
 * anchor a dialog, and one without the gauge glyph would render a pill whose
 * height differs from the shipped one. Registering nothing is the honest
 * outcome, because the shipped pill then keeps its seat.
 * @returns the kit, or undefined when any member is missing.
 */
export function resolveKit(require: ModuleRequire | null): PlatformKit | undefined {
  if (require === null) return undefined;
  const primitives = require("@deepseek-ai/dsh-client-ui-primitives") as Record<string, unknown> | undefined;
  const reactDom = require("react-dom") as Record<string, unknown> | undefined;
  const IconGauge = primitives?.IconGaugeOutlineRegular;
  const useAnchoredPosition = primitives?.useAnchoredPosition;
  const useDismissOnOutsidePointer = primitives?.useDismissOnOutsidePointer;
  const createPortal = reactDom?.createPortal;
  if (typeof IconGauge !== "function") return undefined;
  if (typeof useAnchoredPosition !== "function") return undefined;
  if (typeof useDismissOnOutsidePointer !== "function") return undefined;
  if (typeof createPortal !== "function") return undefined;
  return {
    IconGauge: IconGauge as PlatformKit["IconGauge"],
    useAnchoredPosition: useAnchoredPosition as PlatformKit["useAnchoredPosition"],
    useDismissOnOutsidePointer: useDismissOnOutsidePointer as PlatformKit["useDismissOnOutsidePointer"],
    createPortal: createPortal as PlatformKit["createPortal"],
  };
}

/**
 * Mount the statistics pill.
 * @param ctx - client root context.
 * @returns the disposer releasing the dictionary.
 */
export function apply(ctx: ClientContextLike): () => void {
  const kit = resolveKit(loaderRequire);
  if (kit === undefined) return () => {};
  const mode: ModeStore = createModeStore(ctx.configForms.get(CHAT_SETTINGS_NAMESPACE));
  const offLocale = ctx.locale.register(LOCALE_NAMESPACE, { zh: ZH, en: EN });
  ctx.slots.inject(SLOT, () =>
    ctx.slots.register(
      {
        name: SLOT,
        id: ENTRY_ID,
        order: ENTRY_ORDER,
        priority: ENTRY_PRIORITY,
        locale: LOCALE_NAMESPACE,
        inject: () => ({ hooks: { sessionTimingMode: mode }, kit }),
      },
      StatsPill,
    ),
  );
  return () => offLocale();
}

/** Hand the factory's require to the plugin. */
export function boot(require: ModuleRequire): void {
  loaderRequire = require;
}

/** The plugin object the loader mounts. */
export const clientPlugin = { name: "dsh-session-timing", inject, apply };

export default clientPlugin;
