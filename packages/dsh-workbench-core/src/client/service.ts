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
import type { PageCloser } from "./page-close.ts";
import { createPanelLedger, type PanelDescriptor, type PanelStore } from "./panels.ts";
import { readCurrentSessionId } from "./session.ts";
import { createViewFocusQueue, type ViewFocusQueue } from "./view-focus.ts";
import { createViewSwitcher } from "./view-switcher.ts";
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

/**
 * The mount context a dock hands one panel of a registered kind.
 *
 * The dock owns the chrome; the kind owns everything inside the element it
 * receives. The disposer (when returned) is called exactly once, when the
 * panel body leaves the dock.
 */
export interface DockPanelMountContext {
  /** The session the panel is scoped to; the dock never mounts one without. */
  readonly sessionId: string;
}

/** A panel kind a feature package registers into a dock's chrome. */
export interface DockPanelKindDescriptor {
  /** Kind identity inside the dock; the built-in `"terminal"` is never here. */
  readonly kind: string;
  /** Human-readable label the dock's tab strip and kind picker show. */
  readonly title: string;
  /** Render one panel body into a fresh element; optional disposer unmounts. */
  readonly mount: (host: HTMLElement, context: DockPanelMountContext) => (() => void) | void;
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
  /** Register a panel kind a dock can host; disposer removes it. */
  registerDockPanelKind(descriptor: DockPanelKindDescriptor): () => void;
  /** Registered panel kinds, in registration order. */
  dockPanelKinds(): readonly DockPanelKindDescriptor[];
  /** Open a conversation view for the current session. */
  openView(id: string, focus?: string): boolean;
  /**
   * Open a view, falling back to the host's own tab row when the seam is unbound.
   *
   * The host only hands its `openView` capability to the View More menu, so a
   * caller acting from outside that menu cannot rely on the seam. `focused` says
   * whether the focus string was actually delivered, because the tab fallback
   * switches the view but has no way to pass one.
   */
  openViewOrSwitch(id: string, focus?: string): { readonly opened: boolean; readonly focused: boolean };
  /**
   * Focus hand-off for callers the host gave no capability to.
   *
   * The target view takes the request when it is on screen, which is the only
   * way a view mounted lazily can still receive what to open.
   */
  readonly viewFocus: ViewFocusQueue;
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
  /**
   * Claim the host's close-page gesture for a page this view is showing.
   *
   * Desktop turns ⌘W (Ctrl+W on Windows) into the host's `page.close` command:
   * it closes the focused right-sidebar page and, when there is none, closes the
   * window. A conversation view is not a sidebar page, so a workbench view
   * registers here to take that fallback for its own page — one open file panel.
   * The claim runs only when the host is about to close the window; returning
   * `true` means this view consumed the gesture, `false` leaves the host
   * behaviour untouched.
   *
   * A host without the fallback answers an inert disposer, so callers need no
   * version probe.
   * @param closer - claims the gesture; `true` when it was consumed.
   * @returns disposer releasing the claim.
   */
  registerPageCloser(closer: PageCloser): () => void;
}

/** What a caller may hand the service at construction, beyond the context. */
export interface WorkbenchServiceOptions {
  /** The host page-close seam the entry installed; absent leaves ⌘W with the host. */
  readonly pageClose?: { register(closer: PageCloser): () => void };
}

/**
 * Create the service for one client mount.
 * @param ctx - the client context the row was applied to.
 * @param options - host seams the entry installed outside the context.
 * @returns the service; it captures nothing but `ctx` and those seams.
 */
export function createWorkbenchService(ctx: unknown, options: WorkbenchServiceOptions = {}): WorkbenchService {
  const panels = createPanelLedger();
  const adapters = createHostAdapters(ctx, typeof document === "undefined" ? undefined : document);
  const dockRows: DockDescriptor[] = [];
  // Same ledger shape as dockRows: kind-string identity, registration order,
  // first registration wins a duplicate (the desktop double-apply relies on
  // the caller's dispose-then-register, not on replacement semantics here).
  const panelKindRows: DockPanelKindDescriptor[] = [];
  // The dock is on by default: a fresh install should show the surface the user
  // installed, and hiding it is the explicit choice.
  const dockVisibility = createDockVisibility(true);

  const views = createViewSeam();

  const viewFocus = createViewFocusQueue();

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
    registerDockPanelKind(descriptor) {
      if (panelKindRows.some(entry => entry.kind === descriptor.kind)) return () => {};
      panelKindRows.push(descriptor);
      return () => {
        const index = panelKindRows.findIndex(entry => entry.kind === descriptor.kind);
        if (index >= 0) panelKindRows.splice(index, 1);
      };
    },
    dockPanelKinds: () => [...panelKindRows],
    openView(id, focus) {
      const sessionId = readCurrentSessionId(ctx);
      if (sessionId === undefined) return false;
      return views.open(sessionId, id, focus);
    },
    openViewOrSwitch(id, focus) {
      const sessionId = readCurrentSessionId(ctx);
      if (sessionId === undefined) return { opened: false, focused: false };
      if (views.open(sessionId, id, focus)) return { opened: true, focused: true };
      const switched = createViewSwitcher({
        service: views,
        sessionId,
        doc: typeof document === "undefined" ? undefined : document,
      }).open(id);
      return { opened: switched, focused: false };
    },
    closeView() {
      const sessionId = readCurrentSessionId(ctx);
      if (sessionId === undefined) return false;
      return views.showChat(sessionId);
    },
    currentSessionId: () => readCurrentSessionId(ctx),
    viewFocus,
    dockVisibility,
    dockVisible: () => dockVisibility.get(),
    setDockVisible: visible => dockVisibility.set(visible),
    registerPageCloser: closer => options.pageClose?.register(closer) ?? (() => {}),
  };

  return service;
}
