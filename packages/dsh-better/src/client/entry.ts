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
import { insertStyles } from "./styles.ts";
import { createSeat, type SeatDeps, type SeatProps } from "./seat.tsx";
import { modelPopupSpec, openContext, openSegment, type PopupOpenerLike } from "./trigger.ts";

/** Statically seeded primitives, resolved through the factory `require`. */
import type { Primitives } from "./primitives.ts";

/** The overlay slot the picker lives in. */
const OVERLAY_SLOT = "conversation.input.overlay";

/** The composer seat whose trigger opens the picker instead of its own menu. */
const SEAT_SLOT = "conversation.input.model";

/**
 * Priority for the seat shadow.
 *
 * The seat is a `single` slot, so its occupant is a single cell: any lower
 * priority than the shell's 0 wins it. Kept distinct from the popup's value so
 * the two shadows are independently identifiable in an entry listing.
 */
const SEAT_PRIORITY = -50;

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
    "trigger.selectAria": "选择模型",
    "trigger.aria": "当前模型 {model}，点击切换",
    "trigger.ariaEffort": "当前模型 {model}，推理等级 {effort}，点击切换",
    "trigger.fallback": "选择模型",
    "trigger.loading": "加载模型…",
  },
  en: {
    "overlay.aria": "Select a model",
    "listbox.aria": "Matching models",
    "search.aria": "Search providers or models",
    "search.placeholder": "Search providers or models…",
    "status.empty": "No models available.",
    "status.applying": "Switching…",
    "retry": "Retry",
    "trigger.selectAria": "Select model",
    "trigger.aria": "Current model {model}, click to change",
    "trigger.ariaEffort": "Current model {model}, reasoning effort {effort}, click to change",
    "trigger.fallback": "Select model",
    "trigger.loading": "Loading models…",
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
  /** Cell id, required by `list` slots and absent for `single` ones. */
  readonly id?: string;
  readonly order?: number;
  readonly priority?: number;
  readonly locale?: string;
  readonly inject?: (sessionId: string) => Record<string, unknown>;
}

/** The slice of `modelDirectories` this package reads. */
export interface ModelDirectoriesLike {
  /**
   * The session's directory handle.
   * @param sessionId - session whose catalog is wanted.
   * @returns a handle exposing the store, or undefined when the session is gone.
   */
  directoryFor?(sessionId: string):
    | {
        readonly store: { getSnapshot(): DirectorySnapshotLike };
        /**
         * Submit a complete provider/model/effort selection.
         *
         * This is the authoritative path for a selection that names a level: the
         * popup's own onSelect derives its choice from the row id and would
         * silently keep whatever level was already in effect.
         */
        select?(selection: { provider: string; model: string; reasoningEffort?: string }): Promise<unknown>;
      }
    | undefined;
}

/** The part of a directory snapshot the effort lookup needs. */
export interface DirectorySnapshotLike {
  readonly groups: readonly { readonly id: string; readonly models: readonly unknown[] }[];
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
  /**
   * The shared per-session model directory service.
   *
   * Also read by the shell's composer seat and `/model` contribution, so the
   * effort ladders shown here are the same ones a selection is resolved against.
   */
  readonly modelDirectories?: ModelDirectoriesLike | undefined;
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
  // `modelDirectories` needs `remote.session` in scope, so both are declared:
  // the service builds its directories from that remote namespace.
  inject: ["slots", "sessions", "commandUi", "locale", "modelDirectories", "remote", "remote.session"],

  apply(ctx: ClientContextLike): void {
    const doc = globalThis.document;

    // The picker's own strings. The shell already supplies the search
    // placeholder and empty-state text through `searchLabels`, so only the
    // fallbacks live here; a namespace is still required because the
    // registration declares one and the renderer throws without a dictionary.
    ctx.effect(() => ctx.locale.register(NS, DICTIONARIES), "dsh-better: locale");
    // The effort badges are the only element here the shell does not style.
    ctx.effect(() => insertStyles(doc), "dsh-better: effort badge stylesheet");

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
              inject: (sessionId) => ({
                popup: popupFor(ctx, sessionId),
                // Resolved here because this is the one place that knows the
                // session; the overlay only formats what it is handed.
                catalog: directorySnapshot(ctx, sessionId)?.groups,
                // Selecting a level is this surface's own gesture: the popup's
                // onSelect rebuilds the choice from the row id and would drop the
                // level, so the directory takes the settled selection directly.
                selectModel: (selection: { provider: string; model: string; reasoningEffort?: string }) =>
                  ctx.modelDirectories?.directoryFor?.(sessionId)?.select?.(selection),
              }),
            },
            Overlay,
          );
        }),
      "dsh-better: /model provider search",
    );

    // The composer seat: same trigger, but opening it opens the picker above
    // rather than a second model list that cannot search providers.
    ctx.effect(
      () =>
        ctx.slots.inject(SEAT_SLOT, () => {
          const self: { component?: (props: SeatProps) => ReactNode } = {};
          const deps: SeatDeps = {
            load: loaderRequire,
            native: () => findShadowedSingle(ctx.slots.entries(SEAT_SLOT), self.component),
            openPicker: (sessionId) => openModelPicker(ctx, sessionId),
            translate: () => modelTranslator(ctx),
          };
          const Seat = createSeat(deps);
          self.component = Seat;
          return ctx.slots.register(
            {
              name: SEAT_SLOT,
              priority: SEAT_PRIORITY,
              locale: NS,
              // The trigger draws the current selection, so it needs the same
              // directory store the shell's seat reads.
              inject: (sessionId) => ({
                sessionId,
                available: true,
                directory: ctx.modelDirectories?.directoryFor?.(sessionId)?.store,
              }),
            },
            Seat,
          );
        }),
      "dsh-better: composer model trigger",
    );
  },
};

/**
 * Find the shell's component for a `single` slot.
 *
 * A single slot has one cell, so "the other entry" is unambiguous: every live
 * entry that is not this one is a candidate, and the lowest priority would render.
 * @param entries - entries registered for the slot.
 * @param own - this plugin's component, excluded from the search.
 * @returns the shell's component, or undefined when the cell is otherwise empty.
 */
export function findShadowedSingle(
  entries: readonly SlotEntryLike[],
  own: ((props: SeatProps) => ReactNode) | undefined,
): ((props: SeatProps) => ReactNode) | undefined {
  let best: ((props: SeatProps) => ReactNode) | undefined;
  let bestPriority = Number.POSITIVE_INFINITY;
  for (const entry of entries) {
    const component = entry.component;
    if (typeof component !== "function") continue;
    if (own !== undefined && component === own) continue;
    const priority = entry.options.priority ?? 0;
    if (priority < bestPriority) {
      best = component as (props: SeatProps) => ReactNode;
      bestPriority = priority;
    }
  }
  return best;
}

/**
 * Open the `/model` picker for one session.
 *
 * The contribution's popup spec is read off the commands runtime (there is no
 * public getter for one contribution), then opened through the same controller
 * method the shell's own dispatcher uses. Failure is silent and reported as
 * "could not open", which the seat turns into the shell's own behaviour.
 * @param ctx - client context.
 * @param sessionId - session whose picker should open.
 * @returns whether an open was attempted.
 */
function openModelPicker(ctx: ClientContextLike, sessionId: string | undefined): boolean {
  if (sessionId === undefined) return false;
  const spec = modelPopupSpec(ctx.commandUi);
  if (spec === undefined) return false;
  const actx = ctx.sessions.scope?.(sessionId);
  if (actx === undefined) return false;
  const popup = ctx.commandUi.popupFor?.(actx) as PopupOpenerLike | undefined;
  if (popup === undefined || typeof popup.open !== "function") return false;
  popup.open("model", spec, openContext(sessionId), openSegment());
  return true;
}

/**
 * The `model`-namespace translator, which the picker's own strings live in.
 * @param ctx - client context.
 * @returns the translator, or undefined when the namespace is unavailable.
 */
function modelTranslator(ctx: ClientContextLike): ((key: string) => string) | undefined {
  const locale = (ctx as { locale?: { bind?(ns: string): (key: string) => string } }).locale;
  return locale?.bind?.(NS);
}

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
 * The session's catalog groups, which carry each model's effort ladder.
 *
 * Undefined rather than empty when unavailable: the picker treats "no catalog"
 * as "do not claim to know any effort levels", which is different from "this
 * session genuinely has no models".
 * @param ctx - client context.
 * @param sessionId - session whose catalog is wanted.
 * @returns the catalog groups, or undefined when the session has no directory.
 */
function directorySnapshot(
  ctx: ClientContextLike,
  sessionId: string,
): { readonly groups: readonly { readonly id: string; readonly models: readonly unknown[] }[] } | undefined {
  return ctx.modelDirectories?.directoryFor?.(sessionId)?.store.getSnapshot();
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
