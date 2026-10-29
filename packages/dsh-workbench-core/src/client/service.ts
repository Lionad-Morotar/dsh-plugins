/**
 * The `workbench` client service.
 *
 * Feature packages never import this module at runtime: they declare
 * `inject: ["workbench"]` and read the service off their own context. That is
 * what keeps the thin packages independent of this bundle's module graph.
 *
 * The service owns three seams:
 * - panels: the workbench's own tab ledger, not the host's view roster;
 * - views: a per-session binding to the `openView` capability the host hands to
 *   `conversation.view` entries, so root-scoped surfaces (the terminal dock) can
 *   return to chat without reaching into the shell;
 * - adapters: the structural host faces described in `adapters.ts`.
 */
import { createHostAdapters, type WorkbenchAdapters } from "./adapters.ts";
import { createDockVisibility, type DockVisibility } from "./dock-visibility.ts";
import { WORKBENCH_COMMANDS, type WorkbenchCommandSpec } from "./keymap.ts";
import { createPanelLedger, type PanelDescriptor, type PanelStore } from "./panels.ts";
import { readCurrentSessionId } from "./session.ts";
import { createViewSeam, type ViewSwitchSeam } from "./views.ts";
import { WORKBENCH_VERSION } from "../shared.ts";

export { CHAT_VIEW_ID } from "./views.ts";
export type { ViewOpener, ViewSwitchSeam } from "./views.ts";
export type { DockVisibility, DockVisibilityListener } from "./dock-visibility.ts";

/** A dock surface the workbench owns (the terminal dock for now). */
export interface DockDescriptor {
  readonly id: string;
  readonly title: string;
  readonly order?: number;
}

/** The service shape the feature packages consume. */
export interface WorkbenchService {
  /** Contract version; features read it before trusting optional members. */
  readonly version: number;
  /** The workbench's own panel ledger. */
  readonly panelStore: PanelStore;
  /** Structural host faces, resolved on every call. */
  readonly adapters: WorkbenchAdapters;
  /** The command/keymap table shared by settings and shortcut registration. */
  readonly keymap: readonly WorkbenchCommandSpec[];
  /** Snapshot face over `keymap`, matching the host's catalog idiom. */
  readonly shortcuts: { catalog(): readonly WorkbenchCommandSpec[] };
  /** The view-switching seam. */
  readonly views: ViewSwitchSeam;
  /** Register a workbench-owned panel; disposer removes it. */
  registerPanel(panel: PanelDescriptor): () => void;
  /** Make one registered panel active, or clear the selection with null. */
  activatePanel(id: string | null): void;
  /** Register a dock surface; disposer removes it. */
  registerDock(dock: DockDescriptor): () => void;
  /** Registered docks, in registration order. */
  docks(): readonly DockDescriptor[];
  /** Open a conversation view for the current session. */
  openView(id: string, focus?: string): boolean;
  /** Return the current session to chat. */
  closeView(): boolean;
  /** The session the user is looking at, or undefined. */
  currentSessionId(): string | undefined;
  /**
   * The terminal dock switch as an observable store.
   *
   * `shell.bottom` is single and first-registrant-wins, so the decision has one
   * owner (blueprint D2): the dock reads this before registering and registers
   * nothing while it answers false. The store is the responsive face; a
   * runtime toggle from the `⌘⇧M` command must reach the mounted dock without a
   * remount.
   */
  readonly dockVisibility: DockVisibility;
  /**
   * Compatibility read of {@link dockVisibility}.
   * @returns the current answer.
   */
  dockVisible(): boolean;
  /**
   * Compatibility write of {@link dockVisibility}.
   * @param visible - whether the dock should occupy its slot.
   */
  setDockVisible(visible: boolean): void;
}

/**
 * Create the service for one client mount.
 * @param ctx - the client context the row was applied to.
 * @returns the service; it captures nothing but `ctx` itself.
 */
export function createWorkbenchService(ctx: unknown): WorkbenchService {
  const panels = createPanelLedger();
  const adapters = createHostAdapters(ctx, typeof document === "undefined" ? undefined : document);
  const dockRows: DockDescriptor[] = [];
  // The dock is on by default: a fresh install should show the surface the user
  // installed, and hiding it is the explicit choice.
  const dockVisibility = createDockVisibility(true);

  const views = createViewSeam();

  const service: WorkbenchService = {
    version: WORKBENCH_VERSION,
    panelStore: panels,
    adapters,
    keymap: WORKBENCH_COMMANDS,
    shortcuts: { catalog: () => WORKBENCH_COMMANDS },
    views,
    registerPanel: panel => panels.register(panel),
    activatePanel: id => panels.activate(id),
    registerDock(dock) {
      if (dockRows.some(entry => entry.id === dock.id)) return () => {};
      dockRows.push(dock);
      return () => {
        const index = dockRows.findIndex(entry => entry.id === dock.id);
        if (index >= 0) dockRows.splice(index, 1);
      };
    },
    docks: () => [...dockRows],
    openView(id, focus) {
      const sessionId = readCurrentSessionId(ctx);
      if (sessionId === undefined) return false;
      return views.open(sessionId, id, focus);
    },
    closeView() {
      const sessionId = readCurrentSessionId(ctx);
      if (sessionId === undefined) return false;
      return views.showChat(sessionId);
    },
    currentSessionId: () => readCurrentSessionId(ctx),
    dockVisibility,
    dockVisible: () => dockVisibility.get(),
    setDockVisible: visible => dockVisibility.set(visible),
  };

  return service;
}
