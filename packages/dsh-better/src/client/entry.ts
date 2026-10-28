/**
 * Browser-half entry: take over the `/model` picker.
 *
 * The shell's picker decides which rows a query can reach inside its own
 * component, with a module-private filter that only looks at a row's own label.
 * No registration, decoration or service can add a second match surface from the
 * outside, so the only seam left is the render itself: this plugin registers into
 * the same list-slot cell as the shell's entry and shadows it by priority.
 *
 * Shadowing is not takeover. The registering component delegates every command it
 * does not improve, and every `/model` state it has no opinion about, back to the
 * shell's own component, which it reads off the shadowed slot entry. That keeps
 * loading, failure, retry, the risk gate and all the other pickers on exactly one
 * implementation: the shipped one.
 *
 * The controller is reached the same way every other command plugin reaches it,
 * through the session scope and `commandUi.popupFor`, so this half holds no
 * reference to the shell's internal state machine.
 */
import type { ReactNode } from "react";

import { createOverlay, type OverlayDeps, type OverlayProps } from "./overlay.tsx";

/** Statically seeded primitives, resolved through the factory `require`. */
import type { Primitives } from "./primitives.ts";

/** The overlay slot the picker lives in. */
const OVERLAY_SLOT = "conversation.input.overlay";

/**
 * The cell id the shell registers its picker under.
 *
 * Reusing the id is the whole mechanism: entries sharing an id are the same cell,
 * and the cell's lowest-priority live entry is the one that renders.
 */
const POPUP_ID = "command-popup";

/**
 * Priority this plugin claims, deliberately below the shipped entry's 0.
 *
 * It is written explicitly rather than left to the dynamic loader's own
 * decreasing allocation, so the shadow holds even if this package is ever loaded
 * by a path that does not assign priorities.
 */
const SHADOW_PRIORITY = -100;

/** Locale namespace of the strings this surface shows. */
const NS = "better";

/**
 * Fallback strings for the keys this surface reads.
 *
 * Deliberately tiny: the shell publishes the model picker's real copy through
 * `searchLabels`, and this surface prefers it whenever it is present. These are
 * what remains legible when it is not.
 */
const DICTIONARIES: Record<string, Record<string, string>> = {
  zh: {
    "overlay.aria": "选择模型",
    "listbox.aria": "模型匹配项",
    "search.aria": "搜索供应商或模型",
    "search.placeholder": "搜索供应商或模型…",
    "status.empty": "没有可用的模型。",
    "status.applying": "正在切换…",
    "retry": "重试",
  },
  en: {
    "overlay.aria": "Select a model",
    "listbox.aria": "Matching models",
    "search.aria": "Search providers or models",
    "search.placeholder": "Search providers or models…",
    "status.empty": "No models available.",
    "status.applying": "Switching…",
    "retry": "Retry",
  },
};

/** The loader `require`, handed over by the build's `boot` call. */
let loaderRequire: LoaderRequire | null = null;

/** The factory `require` the shell seeds static modules under. */
export interface LoaderRequire {
  (specifier: string): unknown;
}

/**
 * The session scope a popup controller is reachable from.
 *
 * Optional on read: a host that moved session scoping would otherwise make the
 * whole entry throw at mount instead of simply not improving the picker.
 */
export interface SessionsLike {
  scope?(sessionId: string): unknown;
}

/** What this entry needs from `ctx.commandUi`. */
export interface CommandUiLike {
  popupFor?(actx: unknown): { state: unknown } | undefined;
}

/** What this entry needs from `ctx.slots`. */
export interface SlotsLike {
  entries(key: string): readonly SlotEntryLike[];
  register(options: SlotRegistration, component: (props: OverlayProps) => ReactNode): () => void;
  inject(key: string, callback: () => () => void): () => void;
}

/** One registered slot entry, narrowed to what the delegation reads. */
export interface SlotEntryLike {
  readonly component?: unknown;
  readonly options: { readonly id?: string; readonly priority?: number };
}

/** The registration options this entry supplies. */
export interface SlotRegistration {
  readonly name: string;
  readonly id: string;
  readonly order?: number;
  readonly priority?: number;
  readonly locale?: string;
  readonly inject?: (sessionId: string) => Record<string, unknown>;
}

/** The client context this plugin reads. */
export interface ClientContextLike {
  readonly slots: SlotsLike;
  readonly sessions: SessionsLike;
  readonly commandUi: CommandUiLike;
  readonly locale: {
    /** Register a namespace's dictionaries, keyed by BCP 47-style locale tag. */
    register(namespace: string, dictionaries: Readonly<Record<string, Readonly<Record<string, string>>>>): () => void;
  };
  effect(callback: () => () => void, label?: string): void;
}

/**
 * Find the shell's own picker among the entries sharing the popup cell.
 *
 * The shadowed entry is still on the ledger, so it can be read back and rendered
 * directly. It is chosen as any other live entry for this cell that is not this
 * plugin's own registration: comparing components would be wrong (the shell's
 * component is a module value that nothing else can reproduce), and comparing
 * priority would tie this plugin's fate to a number the host assigns.
 * @param entries - entries registered for the overlay slot.
 * @param own - this plugin's component, to be excluded.
 * @returns the shell's component, or undefined when nothing else occupies the cell.
 */
export function findShadowed(
  entries: readonly SlotEntryLike[],
  own: ((props: OverlayProps) => ReactNode) | undefined,
): ((props: OverlayProps) => ReactNode) | undefined {
  let candidate: ((props: OverlayProps) => ReactNode) | undefined;
  let candidatePriority = Number.POSITIVE_INFINITY;
  for (const entry of entries) {
    if (entry.options.id !== POPUP_ID) continue;
    const component = entry.component;
    if (typeof component !== "function") continue;
    if (own !== undefined && component === own) continue;
    // Several entries can share the cell during a reload; the one that would
    // have rendered is the lowest priority, so that is the one to delegate to.
    const priority = entry.options.priority ?? 0;
    if (priority < candidatePriority) {
      candidate = component as (props: OverlayProps) => ReactNode;
      candidatePriority = priority;
    }
  }
  return candidate;
}

/** The client plugin object the loader mounts. */
export const clientPlugin = {
  name: "dsh-better",
  inject: ["slots", "sessions", "commandUi", "locale"],

  apply(ctx: ClientContextLike): void {
    const doc = globalThis.document;

    // The picker's own strings. The shell already supplies the search
    // placeholder and empty-state text through `searchLabels`, so only the
    // fallbacks live here; a namespace is still required because the
    // registration declares one and the renderer throws without a dictionary.
    ctx.effect(() => ctx.locale.register(NS, DICTIONARIES), "dsh-better: locale");

    /**
     * Build and register the overlay.
     *
     * Registration is deferred into `inject` so the shell's own entry is already
     * on the ledger when the shadow is looked up: reading it before the shell
     * registers would find nothing to delegate to.
     */
    ctx.effect(
      () =>
        ctx.slots.inject(OVERLAY_SLOT, () => {
          // The overlay has to know its own identity to exclude itself from the
          // delegation lookup, and its own component is only assigned after
          // creation. The box breaks that cycle without reading a binding that is
          // still in its temporal dead zone.
          const self: { component?: (props: OverlayProps) => ReactNode } = {};
          // Resolved per render, not once: when this package applies before the
          // shell registers its entry there is nothing to read yet, and freezing
          // that answer would make every popup render nothing.
          const deps: OverlayDeps = {
            load: loaderRequire,
            native: () => findShadowed(ctx.slots.entries(OVERLAY_SLOT), self.component),
            document: doc,
          };
          const Overlay = createOverlay(deps);
          self.component = Overlay;

          return ctx.slots.register(
            {
              name: OVERLAY_SLOT,
              id: POPUP_ID,
              priority: SHADOW_PRIORITY,
              locale: NS,
              inject: (sessionId) => ({ popup: popupFor(ctx, sessionId) }),
            },
            Overlay,
          );
        }),
      "dsh-better: /model provider search",
    );
  },
};

/**
 * Resolve the session's popup controller.
 *
 * The same reach the shipped wiring uses: the session scope, then `commandUi`.
 * A failure returns nothing so the overlay delegates to the shell instead of
 * breaking the composer's overlay.
 * @param ctx - client context.
 * @param sessionId - session whose popup is being rendered.
 * @returns the controller, or undefined when it cannot be resolved.
 */
function popupFor(ctx: ClientContextLike, sessionId: string): unknown {
  const actx = ctx.sessions.scope?.(sessionId);
  if (actx === undefined) return undefined;
  return ctx.commandUi.popupFor?.(actx);
}

/**
 * Hand the factory `require` to the plugin.
 *
 * Must be a top-level export because the loader keeps only `{name, inject,
 * apply}` off the module, so the build calls this once before mounting.
 * @param require - the loader require.
 */
export function boot(require: LoaderRequire): void {
  loaderRequire = require;
}

export default clientPlugin;
