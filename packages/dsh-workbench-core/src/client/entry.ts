/**
 * Browser-half entry.
 *
 * Installs the `workbench` service, one settings section and the Session
 * header row that carries the host's `openView` capability into the service.
 * The three feature packages declare `inject: ["workbench"]`; the service is
 * the only thing they share with this bundle, so no feature package has to
 * require another package's client module.
 *
 * The service is provided before the section is registered: registration reads
 * the adapter snapshot, and a section that renders before the service exists
 * would report every adapter as missing.
 */
import {
  registerViewDigitCommands,
  registerWorkbenchCommands,
  runWorkbenchCommand,
  type ShortcutRegistryLike,
  type ViewDigitRuntime,
} from "./commands.ts";
import { EN, ZH } from "./copy.ts";
import { installChatTabFocus } from "./chat-tab.ts";
import { createComposerFocus, focusComposerFor, type FocusScheduler } from "./focus.ts";
import {
  LOCALE_NAMESPACE,
  SECTION_ID,
  SECTION_ORDER,
  SECTION_SLOT,
  VIEW_ACTIONS_ID,
  VIEW_ACTIONS_ORDER,
  VIEW_ACTIONS_SLOT,
} from "./registration.ts";
import { createWorkbenchSection, type ShortcutsLike } from "./section.tsx";
import { buildSettingsGroups, checkBindings } from "./settings.ts";
import { createSessionSelection, readCurrentSessionId } from "./session.ts";
import { createWorkbenchService, type WorkbenchService } from "./service.ts";
import { createGlobalKeyRouter, installGlobalKeyRouter } from "./shortcut-router.ts";
import { createReturnToChatRow, resolveMenuItemButton, type LoaderRequire } from "./view-actions.tsx";
import { createViewDigitPreference, installViewDigitKeyRouter, VIEW_LAST_INDEX } from "./view-digits.ts";
import { createViewSwitcher, listViewTabs, switchToLastViewTab, switchToViewTab } from "./view-switcher.ts";
import { createDockVisibility } from "./dock-visibility.ts";
import { createViewSeam } from "./views.ts";
import { WORKBENCH_SERVICE } from "../shared.ts";

/** The loader `require`, handed over by the build's boot call. */
let loaderRequire: LoaderRequire | null = null;

/** Hand the factory's require to this package. */
export function boot(require: LoaderRequire): void {
  loaderRequire = require;
}

/** The slice of the client context this entry uses. */
export interface ClientContextLike {
  readonly slots: {
    inject(slot: string, factory: () => () => void): unknown;
    register(options: Record<string, unknown>, component: unknown): () => void;
  };
  readonly locale: {
    register(namespace: string, dictionaries: Record<string, Record<string, string>>): () => void;
    /** Host translate seat; interpolates `{name}` from the optional params. */
    bind(namespace: string): (key: string, params?: Record<string, string | number>) => string;
  };
  /** Cordis service registration; present on every supported client host. */
  provide?(name: string, value: unknown): () => void;
  /** Cordis service lookup, the safe way to probe a service this plugin may not own. */
  get?(name: string): unknown;
  /** Host shortcut registry; the settings matrix reads its catalog. */
  readonly shortcuts?: ShortcutRegistryLike & ShortcutsLike;
  /** Session service; the composer focus hook reaches a session scope through it. */
  readonly sessions?: { scope?(sessionId: string): unknown };
  readonly logger?: { warn?(message: string): void };
}

/**
 * Read the shortcut service defensively.
 *
 * `shortcuts` is declared in `inject`, so `ctx.shortcuts` is the primary read.
 * The `ctx.get` fallback keeps the settings section mountable in hosts that
 * predate the service or guard the property; a missing service degrades to the
 * "未安装" state instead of taking down the section.
 */
export function readShortcutService(ctx: ClientContextLike): (ShortcutRegistryLike & ShortcutsLike) | undefined {
  try {
    if (ctx.shortcuts !== undefined && ctx.shortcuts !== null) return ctx.shortcuts;
  } catch {
    // Fall through to ctx.get for hosts that guard undeclared properties.
  }
  try {
    const viaGet = typeof ctx.get === "function" ? ctx.get("shortcuts") : undefined;
    if (viaGet !== undefined && viaGet !== null) return viaGet as ShortcutRegistryLike & ShortcutsLike;
  } catch {
    // Absent service: the section still mounts and reports the missing groups.
  }
  return undefined;
}

/** Services this plugin waits for before applying. */
export const inject = ["slots", "locale", "shortcuts"];

/**
 * Open a conversation view from a global chord.
 *
 * The seam is tried first. It only holds a binding while the View More menu is
 * mounted, which is exactly the state a global chord cannot assume, so the
 * switcher falls back to clicking the host's own tab (exact label match). This
 * is the web path only; desktop commands keep the registered resolver.
 * @param service - the workbench service.
 * @param viewId - the feature package's view id.
 * @returns whether a seam binding or a host tab accepted the switch.
 */
function openViewFromWeb(service: WorkbenchService, viewId: string): boolean {
  const sessionId = service.currentSessionId();
  if (sessionId === undefined) return false;
  return createViewSwitcher({
    service: service.views,
    sessionId,
    doc: typeof document === "undefined" ? undefined : document,
  }).open(viewId);
}

/**
 * The browser document, or undefined outside a browser.
 *
 * Read per call rather than captured: the acceptance probe and the unit tests
 * load this bundle without a DOM, and a captured reference would be null there.
 */
function currentDocument(): Document | undefined {
  return typeof document === "undefined" ? undefined : document;
}

/**
 * The tab-strip seam the digit chords and the web digit router share.
 *
 * Position, not identity: the digits follow whatever the host currently renders,
 * so a view a feature package registers later needs no change here. Both calls
 * answer false rather than throwing when the strip is absent (no session, a
 * mount without tabs), which is what keeps a stray chord from being consumed.
 */
function createTabStripRuntime(): ViewDigitRuntime {
  return {
    available(index) {
      const count = listViewTabs(currentDocument()).length;
      // `length >= 0` is true for an empty strip, which would consume ⌘0 as a no-op.
      if (index === VIEW_LAST_INDEX) return count > 0;
      return index >= 1 && count >= index;
    },
    switchTo(index) {
      const doc = currentDocument();
      return index === VIEW_LAST_INDEX ? switchToLastViewTab(doc) : switchToViewTab(doc, index);
    },
  };
}

/**
 * Install the web-only fallback router for the host-refused chords.
 *
 * Desktop keeps the native menu accelerator; a second listener there would run
 * every command twice. Outside a browser (Node tests, SSR) there is no target,
 * so the installer degrades to a no-op.
 */
function installWebShortcutRouter(
  service: WorkbenchService,
  shortcuts: (ShortcutRegistryLike & ShortcutsLike) | undefined,
): () => void {
  return installGlobalKeyRouter({
    runtime: shortcuts?.runtime,
    run: commandId => {
      runWorkbenchCommand(commandId, service, {
        openView: viewId => openViewFromWeb(service, viewId),
      });
    },
    ...(typeof window === "undefined" ? {} : { target: window }),
  });
}

/** Mount the workbench service and its settings section. */
/** Disposer of the dictionary currently sitting in the host's locale table.
* A repeat apply on one host process (the desktop sync pass followed by the
* mount pass) meets the same table, and the table refuses a second
* registration for the same namespace and locale. Dropping ours first turns
* that would-be throw into a plain replacement: the disposer deletes by
* dictionary identity, so the module-singleton dictionaries are always
* removable by the very disposer that registered them. */
let registeredDictionaries: (() => void) | undefined;

export function apply(ctx: ClientContextLike): () => void {
  const service = createWorkbenchService(ctx);
  const offService = ctx.provide?.(WORKBENCH_SERVICE, service);
  if (offService === undefined) {
    // Without the service the three feature packages stay pending, which is a
    // visible "row installed but no tabs" state; a warning is the only report
    // this half can make.
    ctx.logger?.warn?.(`${LOCALE_NAMESPACE}: ctx.provide unavailable, workbench service not registered`);
  }

  const t = ctx.locale.bind(LOCALE_NAMESPACE);
  registeredDictionaries?.();
  const offLocale = ctx.locale.register(LOCALE_NAMESPACE, { zh: ZH, en: EN });
  registeredDictionaries = offLocale;
  const shortcuts = readShortcutService(ctx);
  console.info(
    `[dsh-workbench-core] shortcuts service ${shortcuts === undefined ? "absent" : `present (runtime=${shortcuts.runtime ?? "unknown"})`}`,
  );
  // The global commands are registered before the section renders: the section
  // reads the host catalog, so a command registered after the first paint would
  // appear only on the next catalog push.
  const offCommands = registerWorkbenchCommands(shortcuts, service, t, message => {
    // The host logger sink is invisible in a browser DevTools session; a
    // console twin keeps shortcut registration diagnosable on real machines.
    console.warn(`[dsh-workbench-core] ${message}`);
    ctx.logger?.warn?.(`${LOCALE_NAMESPACE}: ${message}`);
  });
  // Web only: the host refuses these three chords, so the bundle listens for
  // them itself in the capture phase. Registering the host defaults stays
  // desktop-only either way.
  const offKeyRouter = installWebShortcutRouter(service, shortcuts);
  // The digit chords are opt-out: one persisted switch owns both the host
  // registration (desktop) and the local alt+digit route (web), so flipping it
  // in settings takes effect without a remount.
  const viewDigits = createViewDigitPreference();
  const tabStrip = createTabStripRuntime();
  const reportShortcutProblem = (message: string): void => {
    console.warn(`[dsh-workbench-core] ${message}`);
    ctx.logger?.warn?.(`${LOCALE_NAMESPACE}: ${message}`);
  };
  const offDigitCommands = registerViewDigitCommands(
    shortcuts,
    service,
    t,
    viewDigits,
    tabStrip,
    reportShortcutProblem,
  );
  const offDigitRouter = installViewDigitKeyRouter({
    runtime: shortcuts?.runtime,
    isEnabled: () => viewDigits.get(),
    switchTab: index => tabStrip.switchTo(index),
    ...(typeof window === "undefined" ? {} : { target: window }),
  });
  const Section = createWorkbenchSection({
    service,
    t,
    shortcuts,
    viewDigits,
    ...(shortcuts?.runtime === undefined ? {} : { runtime: shortcuts.runtime }),
  });

  ctx.slots.inject(SECTION_SLOT, () =>
    ctx.slots.register(
      {
        name: SECTION_SLOT,
        id: SECTION_ID,
        order: SECTION_ORDER,
        label: () => t("section.title"),
        locale: LOCALE_NAMESPACE,
      },
      Section,
    ),
  );

  // The row exists to hold the session-scoped `onOpen` capability. It is
  // registered after the settings section so the section stays the first
  // registration this package makes on every mount.
  const ReturnToChat = createReturnToChatRow({
    service,
    t,
    session: createSessionSelection(ctx),
    menuItem: () => resolveMenuItemButton(loaderRequire),
  });
  const offViewActions = ctx.slots.inject(VIEW_ACTIONS_SLOT, () =>
    ctx.slots.register(
      {
        name: VIEW_ACTIONS_SLOT,
        id: VIEW_ACTIONS_ID,
        order: VIEW_ACTIONS_ORDER,
        locale: LOCALE_NAMESPACE,
      },
      ReturnToChat,
    ),
  );

  // Every chat return that starts inside plugin code (the terminal dock, the
  // View More menu, `closeView`) ends on the seam, where the host leaves focus on
  // the clicked tab. Subscribing here is what hands the keyboard back to the
  // composer; host tab clicks never cross plugin code, which is why each view
  // claims focus for itself on mount instead.
  const composerFocus = createComposerFocus({
    ctx,
    ...(typeof document === "undefined" ? {} : { doc: document }),
    sessionId: () => readCurrentSessionId(ctx),
    ...(typeof window === "undefined" ? {} : { scheduler: window as FocusScheduler }),
  });
  const offChatShown = service.views.onChatShown(() => composerFocus.request());
  // The host's own 对话 tab click is the one return the seam never sees: the
  // host owns that button and its handler stays on the host side. A
  // capture-phase listener takes the click before the host remounts the view,
  // so the retry schedule can carry the request across the remount.
  const offChatTab = installChatTabFocus({
    onChatTab: () => composerFocus.request(),
    ...(typeof window === "undefined" ? {} : { target: window }),
  });

  return () => {
    if (typeof offViewActions === "function") offViewActions();
    offChatTab();
    offChatShown();
    composerFocus.dispose();
    offDigitRouter();
    offDigitCommands();
    offKeyRouter();
    offCommands();
    offLocale();
    if (registeredDictionaries === offLocale) registeredDictionaries = undefined;
    offService?.();
  };
}

/**
 * Pure surfaces for the acceptance probe and the unit tests.
 *
 * The seam has to be drivable in Node with no browser, no host tree and no
 * React, so it is exported rather than hidden behind the service instance.
 */
export const __test = {
  createComposerFocus,
  installChatTabFocus,
  createViewSeam,
  createViewSwitcher,
  createViewDigitPreference,
  createDockVisibility,
  buildSettingsGroups,
  checkBindings,
  createGlobalKeyRouter,
  switchToViewTab,
  listViewTabs,
  focusComposerFor,
};

/** The plugin object the loader mounts. */
export const clientPlugin = { name: "dsh-workbench-core", inject, apply, __test };

export default clientPlugin;
