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

import { createAliasSettingsPage } from "./alias-page.tsx";
import { createAliasSource } from "./alias-source.ts";
import { createAliasStore } from "./alias-store.ts";
import { insertAliasPageStyles } from "./alias-styles.ts";
import { createAliasWatcher, type AliasTriggerController } from "./alias-watcher.tsx";
import { createOverlay, type OverlayDeps, type OverlayProps } from "./overlay.tsx";
import {
  createComposerAttachments,
  type ComposerAttachmentsDeps,
  type ComposerAttachmentsProps,
  type WorkspaceReaderLike,
} from "./composer-attachments.tsx";
import { DICTIONARIES } from "./dictionaries.ts";
import {
  composerMounted,
  focusComposerFor,
  FOCUS_LABEL_KEY,
  readCurrentSessionId,
  registerFocusCommand,
  type ShortcutRegistryLike,
} from "./focus.ts";
import { insertStyles } from "./styles.ts";
import { createWidthWatcher, restoreLayoutWidths, type LayoutScopeLike } from "./layout-adapter.ts";
import { readLayoutWidths } from "./layout-widths.ts";
import { CompactionStat } from "./compaction-stat.tsx";
import { COMPACTION_ID, COMPACTION_ORDER, COMPACTION_SLOT } from "./compaction-registration.ts";
import { installCompactionStyles } from "./compaction-styles.ts";
import { createSeat, type SeatDeps, type SeatProps } from "./seat.tsx";
import { modelPopupSpec, openContext, openSegment, type PopupOpenerLike } from "./trigger.ts";
import { TabSettingsPage, insertTabPageStyles, type PageReact } from "./tabs-page.tsx";
import {
  createTabController,
  TABS_SECTION_ID,
  TABS_SECTION_ORDER,
  TABS_SECTION_SLOT,
  type StripHostDocument,
  type ViewLedger,
} from "./tabs.ts";

/** Statically seeded primitives, resolved through the factory `require`. */
import type { Primitives } from "./primitives.ts";

/** The overlay slot the picker lives in. */
const OVERLAY_SLOT = "conversation.input.overlay";

/** The settings nav slot this package contributes its alias page to. */
const ALIAS_SECTION_SLOT = "settings.section";

/** A fresh section id, so the alias page is its own nav entry. */
const ALIAS_SECTION_ID = "aliases";

/** Sits just after the tab page (55) and before the workbench page (60). */
const ALIAS_SECTION_ORDER = 56;

/** The invisible overlay entry that opens the alias menu for bare keywords. */
const ALIAS_WATCHER_ID = "alias-watcher";

/** A floating-entry order after the visible menus; the watcher renders null. */
const ALIAS_WATCHER_ORDER = 50;

/** The composer seat whose trigger opens the picker instead of its own menu. */
const SEAT_SLOT = "conversation.input.model";

/**
 * The draft-attachment rail.
 *
 * A `single` slot holding the shell's own rail, so it is shadowed exactly the way
 * the seat is: this entry wins the cell, draws the shipped component as its child,
 * and adds the selection and clipboard behaviour around it.
 */
const ATTACHMENTS_SLOT = "conversation.input.attachments";

/**
 * Priority for the seat shadow.
 *
 * The seat is a `single` slot, so its occupant is a single cell: any lower
 * priority than the shell's 0 wins it. Kept distinct from the popup's value so
 * the two shadows are independently identifiable in an entry listing.
 */
const SEAT_PRIORITY = -50;

/**
 * Priority for the attachment rail shadow.
 *
 * Also below the shell's 0, and distinct from the seat's value so the two shadows
 * are independently identifiable in an entry listing.
 */
const ATTACHMENTS_PRIORITY = -60;

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
  /**
   * Shadowing winners for a slot: one entry per cell.
   *
   * Optional on the type because the surfaces above were written against hosts
   * that only expose `entries`. The tab page requires it and checks at runtime.
   */
  entriesOfSlot?(key: string): readonly SlotEntryLike[];
  register(options: SlotRegistration, component: (props: OverlayProps) => ReactNode): () => void;
  /**
   * Register into a slot whose component is not the overlay.
   *
   * The settings page and the header seam render nothing the overlay knows
   * about, and the registry accepts any function. Keeping that path off the
   * overlay's signature is what stops the page from having to pretend it
   * receives overlay props.
   */
  registerUntyped?(options: SlotRegistration, component: unknown): () => void;
  inject(key: string, callback: () => () => void): () => void;
  subscribe?(key: string, listener: () => void): () => void;
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
  /** Nav label. A thunk is re-read on every projection, so it follows the locale. */
  readonly label?: string | (() => string);
  readonly inject?: (sessionId: string, ...rest: unknown[]) => Record<string, unknown>;
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
  /** The session's current selection, when one has been settled. */
  readonly current?: { readonly provider: string; readonly model: string; readonly reasoningEffort?: string } | null;
  readonly groups: readonly { readonly id: string; readonly models: readonly unknown[] }[];
}

/** The input-trigger service surface used by the alias source and watcher. */
export interface InputTriggersLike {
  /** Register one `/` or `@` source; the disposer removes it. */
  registerSource(source: unknown): () => void;
  /** Resolve a session's controller for programmatic menu opening. */
  sessionOf(actx: unknown): AliasTriggerController;
}

/** The scope the `inputTriggers` soft probe hands back. */
export interface InputTriggersScopeLike {
  readonly inputTriggers: InputTriggersLike;
  effect(callback: () => () => void, label?: string): void;
}

/** One session's published composer state, narrowed to what the watcher reads. */
export interface AliasInputStoreLike {
  getSnapshot(): { readonly draft: string; readonly draftRev: number; readonly phase: "plain" | "adjudicating" | "claimed" | "submitting" };
  subscribe(listener: () => void): () => void;
}

/** The slice of `ctx.conversation` the watcher reaches the draft through. */
export interface ConversationLike {
  readonly input?: { for?(scope: unknown): { readonly state: AliasInputStoreLike } | undefined };
}

/** The client context this plugin reads. */
export interface ClientContextLike {
  readonly slots: SlotsLike;
  readonly sessions: SessionsLike;
  readonly commandUi: CommandUiLike;
  readonly conversation?: ConversationLike;
  readonly locale: {
    /** Register a namespace's dictionaries, keyed by BCP 47-style locale tag. */
    register(namespace: string, dictionaries: Readonly<Record<string, Readonly<Record<string, string>>>>): () => void;
    /**
     * The namespace's translator.
     *
     * Read lazily on every call rather than captured: the command label is
     * re-resolved by the shortcut catalog whenever the locale or the bindings
     * change, so a captured translator would freeze the language of a row that
     * outlives the setting.
     */
    bind?(namespace: string): (key: string) => string;
  };
  /**
   * The shared per-session model directory service.
   *
   * Also read by the shell's composer seat and `/model` contribution, so the
   * effort ladders shown here are the same ones a selection is resolved against.
   */
  readonly modelDirectories?: ModelDirectoriesLike | undefined;
  /**
   * The client's Remote namespaces.
   *
   * Only `remote` itself is read here; `remote.workspaceFiles` is a separate
   * service name in this host and is reached through the soft probe below, not
   * through this object — Cordis refuses a nested lookup that was not declared.
   */
  readonly remote?: unknown;
  get?(name: string): unknown;
  effect(callback: () => () => void, label?: string): void;
  /**
   * Run a callback once the named services are mounted.
   *
   * A soft probe rather than an `inject` declaration on the plugin object: the
   * shortcut service is the only thing this adds, and a host that never mounts
   * it must still get the provider-search picker this package exists for.
   */
  inject?<T>(dependencies: readonly string[], callback: (scope: T) => void): () => void;
}

/** The scope the `shortcuts` soft probe hands back. */
export interface ShortcutsScopeLike {
  readonly shortcuts: ShortcutRegistryLike;
  effect(callback: () => () => void, label?: string): void;
}

/**
 * The scope the `remote.workspaceFiles` soft probe hands back.
 *
 * A dotted service name is its own entry in this host's registry, so the probe is
 * read by that full name; `remote` itself is a separate service and reading the
 * reader off it is refused without a declaration this package deliberately does
 * not make.
 */
export interface WorkspaceFilesScopeLike {
  readonly "remote.workspaceFiles"?: WorkspaceReaderLike | undefined;
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
  inject: ["slots", "sessions", "commandUi", "conversation", "locale", "modelDirectories", "remote", "remote.session"],

  apply(ctx: ClientContextLike): void {
    const doc = globalThis.document;

    // The picker's own strings. The shell already supplies the search
    // placeholder and empty-state text through `searchLabels`, so only the
    // fallbacks live here; a namespace is still required because the
    // registration declares one and the renderer throws without a dictionary.
    ctx.effect(() => ctx.locale.register(NS, DICTIONARIES), "dsh-better: locale");
    // The effort badges are the only element here the shell does not style.
    ctx.effect(() => insertStyles(doc), "dsh-better: effort badge stylesheet");
    // The compression count carries its own sheet: it is installed by the dock
    // entry rather than the picker, so the two surfaces stay independent.
    ctx.effect(() => installCompactionStyles(doc), "dsh-better: compaction count stylesheet");

    // Skill aliases. One document is shared by three surfaces: the settings page
    // that edits it, the `/` source that lists it in the shipped slash menu, and
    // the watcher that opens that same menu for bare keywords.
    const aliases = createAliasStore(deviceStorage());
    const aliasText = aliasTranslator(ctx);
    // Shared one-shot flag: the watcher opens a synthetic menu for a bare
    // keyword, and the source must serve rows even though prefix mode is off.
    const aliasBareMenu = { open: false };

    // The two panel widths. The layout store is memory-only: every load rebuilds
    // it from the contract literals (left sidebar 280px, right panel null → 45%
    // of the frame), so a dragged width is gone on restart. This seeds the store
    // from the remembered geometry before the frame's first render, then keeps
    // the memory current after each drag. The service is a soft probe rather than
    // an `inject` declaration so a host that moved it still gets every other
    // feature in this package.
    ctx.effect(() => {
      const storage = deviceStorage();
      const remembered = readLayoutWidths(storage);
      ctx.inject?.<LayoutScopeLike>(["layout"], scope => {
        restoreLayoutWidths(scope, remembered);
      });
      const watcher = doc === undefined ? undefined : createWidthWatcher({ document: doc, storage });
      const detach = watcher?.attach();
      return () => {
        detach?.();
      };
    }, "dsh-better: panel width memory");

    // The compression count beside the context meter. Nothing is injected: the
    // slot hands every entry `useProjection` and a namespace-bound `t`, which is
    // the whole contract this reading needs.
    ctx.effect(
      () =>
        ctx.slots.inject(COMPACTION_SLOT, () =>
          ctx.slots.register(
            {
              name: COMPACTION_SLOT,
              id: COMPACTION_ID,
              order: COMPACTION_ORDER,
              locale: NS,
            },
            CompactionStat,
          ),
        ),
      "dsh-better: compaction count",
    );

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
              inject: (sessionId) => {
                // One snapshot read feeds both faces: the ladder list and the
                // effort currently in effect.
                const snapshot = directorySnapshot(ctx, sessionId);
                return {
                  popup: popupFor(ctx, sessionId),
                  // Resolved here because this is the one place that knows the
                  // session; the overlay only formats what it is handed.
                  catalog: snapshot?.groups,
                  // The picker keeps the active effort on its row and lands a
                  // plain click on it, which needs to know what is in effect.
                  current: snapshot?.current ?? null,
                  // Selecting a level is this surface's own gesture: the popup's
                  // onSelect rebuilds the choice from the row id and would drop
                  // the level, so the directory takes the settled selection
                  // directly.
                  selectModel: (selection: { provider: string; model: string; reasoningEffort?: string }) =>
                    ctx.modelDirectories?.directoryFor?.(sessionId)?.select?.(selection),
                };
              },
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
            document: doc,
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

    // The attachment rail: the shipped rail as a child, plus the selection the
    // shell does not have and the clipboard round-trip that makes it useful.
    //
    // The workspace-file reader is a soft probe, not a plugin dependency: without
    // it a paste still restores the text and leaves the paths as text, and a host
    // that never mounts that bundle still gets every other feature here.
    let workspaceFiles: WorkspaceReaderLike | undefined;
    ctx.inject?.<WorkspaceFilesScopeLike>(["remote.workspaceFiles"], scope => {
      workspaceFiles = scope["remote.workspaceFiles"];
      scope.effect(
        () => () => {
          workspaceFiles = undefined;
        },
        "dsh-better: workspace file reader",
      );
    });

    ctx.effect(
      () =>
        ctx.slots.inject(ATTACHMENTS_SLOT, () => {
          const self: { component?: (props: ComposerAttachmentsProps) => ReactNode } = {};
          const deps: ComposerAttachmentsDeps = {
            native: () => findShadowedSingle<ComposerAttachmentsProps>(ctx.slots.entries(ATTACHMENTS_SLOT), self.component),
            pathOf: pathOfFile,
            // Read per paste rather than captured: the reader arrives with its own
            // service, which may mount after this registration.
            reader: () => workspaceFiles,
            translate: () => ctx.locale.bind?.(NS),
          };
          const ComposerAttachments = createComposerAttachments(deps);
          self.component = ComposerAttachments;
          return ctx.slots.register(
            {
              name: ATTACHMENTS_SLOT,
              priority: ATTACHMENTS_PRIORITY,
              locale: NS,
              // The rail itself is handed everything it needs by the shell; the
              // Session id is the one thing this wrapper adds, and it is what makes
              // a pasted path readable through the Session's filesystem.
              inject: (sessionId) => ({ sessionId }),
            },
            ComposerAttachments,
          );
        }),
      "dsh-better: composer attachment selection",
    );

    // The alias source, registered into the shipped trigger pipeline as one more
    // `/` group. A soft probe because a host without the input-trigger bundle
    // must still get every other feature in this package.
    let inputTriggers: InputTriggersLike | undefined;
    ctx.inject?.<InputTriggersScopeLike>(["inputTriggers"], scope => {
      inputTriggers = scope.inputTriggers;
      scope.effect(
        () => () => {
          inputTriggers = undefined;
        },
        "dsh-better: alias trigger service",
      );
      scope.effect(
        () =>
          scope.inputTriggers.registerSource(
            createAliasSource({
              config: () => aliases.getSnapshot(),
              translate: aliasText,
              bareMenuOpen: () => aliasBareMenu.open,
            }),
          ),
        "dsh-better: alias slash source",
      );
    });

    // The alias menu watcher. With the prefix on it reopens the shipped menu after
    // the native one closes on a trailing space; with the switch off it opens the
    // same menu programmatically for a bare keyword.
    ctx.effect(
      () =>
        ctx.slots.inject(OVERLAY_SLOT, () => {
          const AliasWatcher = createAliasWatcher({
            store: aliases,
            bareMenuOpen: aliasBareMenu,
            inputStoreFor: sessionId => {
              const actx = ctx.sessions.scope?.(sessionId);
              if (actx === undefined || ctx.conversation === undefined) return undefined;
              try {
                return ctx.conversation.input?.for?.(actx)?.state;
              } catch {
                return undefined;
              }
            },
            controllerFor: sessionId => {
              const actx = ctx.sessions.scope?.(sessionId);
              if (actx === undefined) return undefined;
              const triggers = (readHostService(ctx, "inputTriggers") ?? inputTriggers) as
                | InputTriggersLike
                | undefined;
              if (triggers === undefined) return undefined;
              try {
                return triggers.sessionOf(actx);
              } catch {
                return undefined;
              }
            },
          });
          return registerComponent(
            ctx.slots,
            {
              name: OVERLAY_SLOT,
              id: ALIAS_WATCHER_ID,
              order: ALIAS_WATCHER_ORDER,
              inject: (sessionId) => ({ sessionId }),
            },
            AliasWatcher,
          );
        }),
      "dsh-better: alias selector watcher",
    );

    // The alias settings page. A page of its own rather than a General row: the
    // table is the editor, and it needs room to show the keyword → target →
    // params relationship.
    ctx.effect(
      () =>
        ctx.slots.inject(ALIAS_SECTION_SLOT, () => {
          const removeStyles = doc === undefined ? undefined : insertAliasPageStyles(doc);
          const Page = createAliasSettingsPage({ store: aliases, translate: aliasText });
          const removeSection = registerPlain(
            ctx.slots,
            {
              name: ALIAS_SECTION_SLOT,
              id: ALIAS_SECTION_ID,
              order: ALIAS_SECTION_ORDER,
              label: () => ctx.locale.bind?.(NS)?.("alias.nav") ?? "Skill aliases",
              locale: NS,
            },
            Page as unknown as () => unknown,
          );
          return () => {
            removeSection();
            removeStyles?.();
          };
        }),
      "dsh-better: alias settings page",
    );

    // The tab page. It occupies a settings section of its own because the thing
    // it configures is the header strip, which no existing section owns. The
    // controller is built once and shared with the header: the page renders the
    // choice, and the header is where the host's pin seam actually lives.
    const tabs = createTabController({
      ledger: viewLedger(ctx.slots),
      storage: deviceStorage(),
    });
    ctx.effect(
      () =>
        ctx.slots.inject(TABS_SECTION_SLOT, () => {
          const doc = globalThis.document;
          const removeStyles = doc === undefined ? undefined : insertTabPageStyles(doc);
          const removeSection = registerPlain(ctx.slots, {
            name: TABS_SECTION_SLOT,
            id: TABS_SECTION_ID,
            order: TABS_SECTION_ORDER,
            label: () => ctx.locale.bind?.(NS)?.("tabs.nav") ?? "Tabs",
          }, () => {
            const React = reactOf(loaderRequire);
            if (React === null) return null;
            return TabSettingsPage({
              React,
              controller: tabs,
              copy: tabCopy(ctx),
            });
          });
          return () => {
            removeSection();
            removeStyles?.();
          };
        }),
      "dsh-better: tab management",
    );

    // The strip rules. The controller owns one stylesheet per document and
    // re-plans on every ledger move; `attach` is the whole lifecycle, so the
    // effect's disposer is the teardown. The host's pin seam is deliberately
    // not involved — see tabs.ts for why it cannot be reached.
    ctx.effect(() => tabs.attach(doc as unknown as StripHostDocument), "dsh-better: tab visibility");

    // The focus chord: one host-registered command, so it appears in 设置 →
    // 快捷键 next to the built-in bindings and is rebound there. `inject` is the
    // soft probe, not a plugin-level dependency — see ClientContextLike.inject.
    ctx.inject?.<ShortcutsScopeLike>(["shortcuts"], scope => {
      scope.effect(
        () =>
          registerFocusCommand(
            scope.shortcuts,
            {
              currentSessionId: () => readCurrentSessionId(ctx),
              composerMounted: () => composerMounted(doc),
              focusComposer: sessionId => focusComposerFor(ctx, sessionId),
            },
            // A missing translator would otherwise surface the raw key in the
            // settings dialog, which reads worse than English.
            () => ctx.locale.bind?.(NS)?.(FOCUS_LABEL_KEY) ?? "Focus message input",
            // Silence here would be indistinguishable from a working chord: the
            // settings dialog only lists what the host accepted.
            message => console.warn(`dsh-better: focus command not registered (${message})`),
          ),
        "dsh-better: focus composer shortcut",
      );
    });
  },
};

/**
 * Find the shell's component for a `single` slot.
 *
 * A single slot has one cell, so "the other entry" is unambiguous: every live
 * entry that is not this one is a candidate, and the lowest priority would render.
 *
 * Generic over the props because this package shadows two single cells with
 * unrelated contracts; the search itself only ever touches entry identity and
 * priority, so it has no reason to know either shape.
 * @param entries - entries registered for the slot.
 * @param own - this plugin's component, excluded from the search.
 * @returns the shell's component, or undefined when the cell is otherwise empty.
 */
export function findShadowedSingle<Props>(
  entries: readonly SlotEntryLike[],
  own: ((props: Props) => ReactNode) | undefined,
): ((props: Props) => ReactNode) | undefined {
  let best: ((props: Props) => ReactNode) | undefined;
  let bestPriority = Number.POSITIVE_INFINITY;
  for (const entry of entries) {
    const component = entry.component;
    if (typeof component !== "function") continue;
    if (own !== undefined && component === own) continue;
    const priority = entry.options.priority ?? 0;
    if (priority < bestPriority) {
      best = component as (props: Props) => ReactNode;
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
 * The session's directory snapshot: the catalog groups, which carry each
 * model's effort ladder, and the current selection, which carries the effort in
 * effect.
 *
 * Undefined rather than empty when unavailable: the picker treats "no catalog"
 * as "do not claim to know any effort levels", which is different from "this
 * session genuinely has no models".
 * @param ctx - client context.
 * @param sessionId - session whose catalog is wanted.
 * @returns the snapshot, or undefined when the session has no directory.
 */
function directorySnapshot(
  ctx: ClientContextLike,
  sessionId: string,
): DirectorySnapshotLike | undefined {
  return ctx.modelDirectories?.directoryFor?.(sessionId)?.store.getSnapshot();
}

/**
 * Resolve one attachment's absolute path, when this document has one.
 *
 * The Desktop application installs a bridge that maps a browser `File` back to
 * the path Chromium read it from; nothing else does. That is the whole reason a
 * copied attachment can carry a path instead of its bytes: the composer's own
 * attachments are `File` objects with no path of their own, and only the bridge
 * can say where they came from.
 *
 * Every failure mode here is "no path": the bridge is absent in the web shell, a
 * clipboard image was never a file on disk, and `getPathForFile` throws for a
 * `File` it does not recognise. The caller treats all three the same way.
 * @param file - the browser file of a draft attachment.
 * @returns the absolute path, or the empty string when this file has none.
 */
function pathOfFile(file: File): string {
  const bridge = (globalThis as { __DSH_HOST_PATHS__?: { pathFor?(file: File): unknown } }).__DSH_HOST_PATHS__;
  if (bridge?.pathFor === undefined) return "";
  try {
    const path = bridge.pathFor(file);
    return typeof path === "string" ? path : "";
  } catch {
    return "";
  }
}

/**
 * Register a component the overlay's signature does not describe.
 *
 * The slot registry takes any function. The typed `register` on this context is
 * narrowed to the overlay because that is what the rest of this file renders, so
 * the two surfaces that are not the overlay go through the widened view.
 */
function registerPlain(
  slots: SlotsLike,
  options: SlotRegistration,
  component: () => unknown,
): () => void {
  const register = slots.registerUntyped ?? (slots.register as (options: SlotRegistration, component: () => unknown) => () => void);
  return register.call(slots, options, component);
}

/**
 * Register a component whose props the overlay signature does not describe.
 *
 * The alias watcher receives a `sessionId` inject rather than the overlay's
 * popup props, so it goes through the widened view.
 */
function registerComponent(
  slots: SlotsLike,
  options: SlotRegistration,
  component: unknown,
): () => void {
  const register = slots.registerUntyped ?? (slots.register as unknown as (options: SlotRegistration, component: unknown) => () => void);
  return register.call(slots, options, component);
}

/**
 * The ledger the tab controller reads.
 *
 * `entriesOfSlot` is the shadowing projection, so a cell another plugin has
 * shadowed contributes one row. A host that predates the method degrades to the
 * raw ledger, which is the same list when no cell is shadowed.
 */
function viewLedger(slots: SlotsLike): ViewLedger {
  return {
    entriesOfSlot: key => (slots.entriesOfSlot ?? slots.entries).call(slots, key),
    subscribe: (key, listener) => slots.subscribe?.(key, listener) ?? (() => {}),
  };
}

/** Device storage. Absent under a runtime without `localStorage`, which its consumers treat as memory only. */
function deviceStorage(): Storage | undefined {
  try {
    return globalThis.localStorage;
  } catch {
    return undefined;
  }
}

/**
 * Read a host service without assuming a property read is legal.
 *
 * Cordis refuses property access for undeclared services; `get` is the
 * non-throwing resolver. Watcher callbacks run on the keystroke path, where a
 * missing service should degrade to "no alias menu", never throw.
 * @param ctx - client context.
 * @param name - service key.
 * @returns the service, or undefined when it is not mounted.
 */
function readHostService(ctx: ClientContextLike, name: string): unknown {
  try {
    if (typeof ctx.get === "function") return ctx.get(name);
    return (ctx as unknown as Record<string, unknown>)[name];
  } catch {
    return undefined;
  }
}

/**
 * The `better` translator in the shape the alias surfaces call.
 *
 * Read lazily on every call so a locale switch relabels the next menu open and
 * the next page paint without re-registering anything. The raw key is the last
 * resort, never a crash: these strings decorate an optional feature.
 */
function aliasTranslator(ctx: ClientContextLike): (key: string, params?: Record<string, string | number>) => string {
  return (key, params) => {
    try {
      const bound = ctx.locale.bind?.(NS) as
        | ((key: string, params?: Record<string, string | number>) => string)
        | undefined;
      return bound?.(key, params) ?? key;
    } catch {
      return key;
    }
  };
}

/**
 * The React the loader seeded.
 *
 * Read per render rather than captured: the settings page can open before the
 * shell has finished seeding static modules, and a captured null would make the
 * section permanently blank.
 */
function reactOf(require: LoaderRequire | null): PageReact | null {
  if (require === null) return null;
  try {
    const loaded = require("react");
    if (typeof loaded !== "object" || loaded === null) return null;
    const candidate = loaded as Partial<PageReact>;
    return typeof candidate.createElement === "function" ? (candidate as PageReact) : null;
  } catch {
    return null;
  }
}

/** The page's strings for the locale that is active right now. */
function tabCopy(ctx: ClientContextLike): {
  heading: string;
  empty: string;
  checkboxLabel(label: string, enabled: boolean): string;
} {
  const translate = ctx.locale.bind?.(NS);
  const text = (key: string, fallback: string): string => translate?.(key) ?? fallback;
  return {
    heading: text("tabs.heading", "Tabs"),
    empty: text("tabs.empty", "No plugin has registered a conversation tab yet."),
    checkboxLabel: (label, enabled) => {
      const pattern = text(enabled ? "tabs.hide" : "tabs.show", "{label}");
      return pattern.replace("{label}", label);
    },
  };
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
