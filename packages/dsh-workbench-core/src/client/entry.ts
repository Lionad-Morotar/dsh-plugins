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
import { registerWorkbenchCommands, runWorkbenchCommand, type ShortcutRegistryLike } from "./commands.ts";
import { EN, ZH } from "./copy.ts";
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
import { createSessionSelection } from "./session.ts";
import { createWorkbenchService, type WorkbenchService } from "./service.ts";
import { createGlobalKeyRouter, installGlobalKeyRouter } from "./shortcut-router.ts";
import { createReturnToChatRow, resolveMenuItemButton, type LoaderRequire } from "./view-actions.tsx";
import { createViewSwitcher } from "./view-switcher.ts";
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
    bind(namespace: string): (key: string) => string;
  };
  /** Cordis service registration; present on every supported client host. */
  provide?(name: string, value: unknown): () => void;
  /** Cordis service lookup, the safe way to probe a service this plugin may not own. */
  get?(name: string): unknown;
  /** Host shortcut registry; the settings matrix reads its catalog. */
  readonly shortcuts?: ShortcutRegistryLike & ShortcutsLike;
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
  const offLocale = ctx.locale.register(LOCALE_NAMESPACE, { zh: ZH, en: EN });
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
  const Section = createWorkbenchSection({ service, t, shortcuts });

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

  return () => {
    if (typeof offViewActions === "function") offViewActions();
    offKeyRouter();
    offCommands();
    offLocale();
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
  createViewSeam,
  createViewSwitcher,
  createDockVisibility,
  buildSettingsGroups,
  checkBindings,
  createGlobalKeyRouter,
};

/** The plugin object the loader mounts. */
export const clientPlugin = { name: "dsh-workbench-core", inject, apply, __test };

export default clientPlugin;
