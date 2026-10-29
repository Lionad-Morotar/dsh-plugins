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
import { WORKBENCH_COMMANDS, type WorkbenchCommandSpec } from "./keymap.ts";
import { createPanelLedger, type PanelDescriptor, type PanelStore } from "./panels.ts";
import { readCurrentSessionId } from "./session.ts";
import { WORKBENCH_VERSION } from "../shared.ts";

/** The host's id for the resident chat view. */
export const CHAT_VIEW_ID = "chat";

/** The `openView(view, focus)` capability a conversation view receives. */
export interface ViewOpener {
  (id: string, focus: string): void;
}

/** Per-session view switching, bound from owner props by whoever has them. */
export interface ViewSwitchSeam {
  /** Bind one session's opener; the latest binding wins. */
  bind(sessionId: string, open: ViewOpener): () => void;
  /** Open a view for one session; false when nothing is bound. */
  open(sessionId: string, id: string, focus?: string): boolean;
  /** Return one session to the resident chat view. */
  showChat(sessionId: string): boolean;
}

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
   * Whether the terminal dock should occupy its host slot.
   *
   * `shell.bottom` is single and first-registrant-wins, so the decision has one
   * owner (blueprint D2): the dock reads this before registering and registers
   * nothing while it answers false.
   */
  dockVisible(): boolean;
  /** Flip the dock switch; the settings section exposes it in a later slice. */
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
  const openers = new Map<string, ViewOpener>();
  // The dock is on by default: a fresh install should show the surface the user
  // installed, and hiding it is the explicit choice.
  let dockVisible = true;

  const openSessionView = (sessionId: string, id: string, focus = ""): boolean => {
    const opener = openers.get(sessionId);
    if (opener === undefined) return false;
    opener(id, focus);
    return true;
  };

  const views: ViewSwitchSeam = {
    bind(sessionId, open) {
      openers.set(sessionId, open);
      return () => {
        if (openers.get(sessionId) === open) openers.delete(sessionId);
      };
    },
    open: openSessionView,
    showChat: sessionId => openSessionView(sessionId, CHAT_VIEW_ID),
  };

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
      return openSessionView(sessionId, id, focus);
    },
    closeView() {
      const sessionId = readCurrentSessionId(ctx);
      if (sessionId === undefined) return false;
      return openSessionView(sessionId, CHAT_VIEW_ID);
    },
    currentSessionId: () => readCurrentSessionId(ctx),
    dockVisible: () => dockVisible,
    setDockVisible: visible => {
      dockVisible = visible;
    },
  };

  return service;
}
