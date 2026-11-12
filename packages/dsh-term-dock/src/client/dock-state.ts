/**
 * The terminal dock's layout state machine.
 *
 * Deliberately React-free: every transition the chrome offers (minimize,
 * restore, full screen, horizontal split, close) is decided here, so a panel that
 * disappears from the DOM can only do so because this file said so. The React
 * surface subscribes through `snapshot`/`subscribe`, which is also what the
 * acceptance probe drives directly.
 *
 * Panels are owned by a workspace-branch scope, not by a conversation. The dock
 * keeps every scope's panels in one list and the surface renders the ones whose
 * `scopeKey` matches the session on screen, which is what makes switching
 * conversations inside one checkout keep the same shells. `sessionId` stays on
 * the panel as the *anchor*: the host's terminal service is session-owned, so
 * each scope's processes are allocated under one session even though every
 * session in that scope sees them.
 *
 * `snapshot()` returns the live object rather than a copy: React's
 * `useSyncExternalStore` compares snapshots by identity, and a fresh object per
 * call would re-render forever.
 */

/** How much room the dock takes. */
export type DockMode = "docked" | "minimized" | "fullscreen";

/**
 * Panel kinds the dock hosts. `"terminal"` is built in; every other kind is
 * registered on the workbench core by the package that owns it, so the union
 * stays open on purpose (the string literal only keeps the default spellable).
 */
export type DockPanelKind = "terminal" | (string & Record<never, never>);

/** The built-in kind; `open()` without a kind means exactly this one. */
export const TERMINAL_PANEL_KIND = "terminal";

/** One terminal panel the dock lays out. */
export interface DockPanel {
  /** Panel identity inside this dock; unique across the dock's life. */
  readonly id: string;
  /** Which chrome renders this panel; terminal is the default. */
  readonly kind: DockPanelKind;
  /** Workspace-branch identity the panel belongs to. */
  readonly scopeKey: string;
  /** Session that owns the panel's host terminal; absent until a session exists. */
  readonly sessionId?: string;
}

/** The observable dock state. */
export interface DockSnapshot {
  readonly mode: DockMode;
  readonly panels: readonly DockPanel[];
  readonly activeId: string | null;
}

/** Extra identity an opener can attach to a panel. */
export interface DockOpenOptions {
  /** Workspace-branch scope the panel belongs to. */
  readonly scopeKey: string;
  /** Session owning the panel's host terminal (the scope's anchor). */
  readonly sessionId?: string;
  /** Panel kind; omitted means the built-in terminal. */
  readonly kind?: DockPanelKind;
}

/** Read/subscribe face handed to the React surface. */
export interface DockState {
  /** Add a panel, or activate it when it already exists. */
  open(id: string, options: DockOpenOptions): void;
  minimize(): void;
  /** Return to the docked layout from minimized or full screen. */
  restore(): void;
  toggleFullscreen(): void;
  /**
   * Promote the dock to its two-pane layout.
   *
   * A horizontal split is capped at two panes: with no panel there is nothing to
   * split, with one the visible panel gets a sibling, and with two the layout is
   * already split. `id` names the panel to split (the surface passes the active
   * panel *of the current scope*, because the dock's global selection may point
   * into another scope during a switch).
   */
  split(id?: string): void;
  /** Drop one panel; its neighbours take over the selection. */
  close(id: string): void;
  activate(id: string): void;
  snapshot(): DockSnapshot;
  subscribe(listener: () => void): () => void;
}

/** The split layout's ceiling; see {@link DockState.split}. */
export const DOCK_MAX_PANES = 2;

/**
 * Whether the dock must open its default panel for the scope on screen.
 *
 * The dock only creates panels while it is actually open. A hidden dock that
 * kept following sessions would spawn one shell per conversation the reader
 * browses, which is exactly the resource cost a lazily opened terminal is not
 * allowed to pay. `⌘⇧M` is the only thing that makes this true, so a reader who
 * never presses it never gets a process.
 * @param input - current visibility, the panels the dock already owns, and the
 *   scope currently on screen.
 * @returns true when a terminal panel must be opened for this scope.
 */
export function shouldOpenForScope(input: {
  readonly visible: boolean;
  readonly panels: readonly DockPanel[];
  readonly scopeKey: string | undefined;
}): boolean {
  if (!input.visible || input.scopeKey === undefined) return false;
  return !input.panels.some(panel => panel.scopeKey === input.scopeKey);
}

/**
 * The panels one scope owns, in dock order.
 * @param panels - every panel the dock holds.
 * @param scopeKey - the scope on screen.
 * @returns the subset the surface renders.
 */
export function panelsForScope(panels: readonly DockPanel[], scopeKey: string | undefined): readonly DockPanel[] {
  if (scopeKey === undefined) return [];
  return panels.filter(panel => panel.scopeKey === scopeKey);
}

/**
 * The panel a keyboard action should act on inside one scope.
 *
 * The dock's selection is global while the surface is scoped, so a switch can
 * leave `activeId` pointing at another scope's panel for a frame. Falling back to
 * the scope's first panel keeps a split or a close from touching the wrong
 * terminal.
 * @param panels - every panel the dock holds.
 * @param activeId - the dock's current selection.
 * @param scopeKey - the scope on screen.
 * @returns the panel id, or undefined when the scope has none.
 */
export function activePanelOfScope(
  panels: readonly DockPanel[],
  activeId: string | null,
  scopeKey: string | undefined,
): string | undefined {
  const scoped = panelsForScope(panels, scopeKey);
  if (scoped.length === 0) return undefined;
  return scoped.find(panel => panel.id === activeId)?.id ?? scoped[0]?.id;
}

/**
 * Derive a panel id that is not taken yet.
 * @param base - the id the sibling is modelled on.
 * @param taken - ids already in the dock.
 * @returns `base~2`, `base~3`, … whichever is free.
 */
function siblingId(base: string, taken: ReadonlySet<string>): string {
  let index = 2;
  while (taken.has(`${base}~${index}`)) index += 1;
  return `${base}~${index}`;
}

/**
 * Create an empty, docked state machine.
 * @param initial - optional overrides, used by tests and by a restored layout.
 * @returns the state; every mutation publishes one new snapshot.
 */
export function createDockState(initial: Partial<DockSnapshot> = {}): DockState {
  let state: DockSnapshot = {
    mode: initial.mode ?? "docked",
    panels: [...(initial.panels ?? [])],
    activeId: initial.activeId ?? null,
  };
  const listeners = new Set<() => void>();

  const publish = (next: DockSnapshot): void => {
    state = next;
    for (const listener of listeners) listener();
  };

  const panelOf = (id: string): DockPanel | undefined => state.panels.find(panel => panel.id === id);

  /** Bring a minimized dock back when a panel is opened or restored. */
  const awake = (mode: DockMode): DockMode => (mode === "minimized" ? "docked" : mode);

  return {
    snapshot: () => state,
    subscribe(listener) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    open(id, options) {
      const existing = panelOf(id);
      if (existing !== undefined) {
        if (state.activeId === id && state.mode !== "minimized") return;
        publish({ ...state, mode: awake(state.mode), activeId: id });
        return;
      }
      const kind = options.kind ?? TERMINAL_PANEL_KIND;
      const panel: DockPanel =
        options.sessionId === undefined
          ? { id, kind, scopeKey: options.scopeKey }
          : { id, kind, scopeKey: options.scopeKey, sessionId: options.sessionId };
      publish({ ...state, mode: awake(state.mode), panels: [...state.panels, panel], activeId: id });
    },
    minimize() {
      if (state.mode === "minimized") return;
      publish({ ...state, mode: "minimized" });
    },
    restore() {
      if (state.mode === "docked") return;
      publish({ ...state, mode: "docked" });
    },
    toggleFullscreen() {
      publish({ ...state, mode: state.mode === "fullscreen" ? "docked" : "fullscreen" });
    },
    split(id) {
      if (state.panels.length === 0) return;
      const named = id === undefined ? undefined : panelOf(id);
      const active = named ?? (state.activeId === null ? undefined : panelOf(state.activeId)) ?? state.panels[0];
      if (active === undefined) return;
      // The ceiling is per scope: another workspace-branch's panes are not
      // laid out beside this one, so they must not consume this scope's slots.
      if (state.panels.filter(panel => panel.scopeKey === active.scopeKey).length >= DOCK_MAX_PANES) return;
      const taken = new Set(state.panels.map(panel => panel.id));
      // The sibling inherits the active panel's kind and scope: splitting an Arch
      // pane reads as "two diagrams side by side", splitting a terminal as today,
      // and both halves stay in the same working tree.
      const sibling: DockPanel =
        active.sessionId === undefined
          ? { id: siblingId(active.id, taken), kind: active.kind, scopeKey: active.scopeKey }
          : { id: siblingId(active.id, taken), kind: active.kind, scopeKey: active.scopeKey, sessionId: active.sessionId };
      publish({ ...state, panels: [...state.panels, sibling], activeId: sibling.id });
    },
    close(id) {
      const index = state.panels.findIndex(panel => panel.id === id);
      if (index < 0) return;
      const panels = state.panels.filter(panel => panel.id !== id);
      const nextActive =
        state.activeId === id ? (panels[index]?.id ?? panels[index - 1]?.id ?? null) : state.activeId;
      publish({ ...state, panels, activeId: nextActive });
    },
    activate(id) {
      if (state.activeId === id || panelOf(id) === undefined) return;
      publish({ ...state, activeId: id, mode: awake(state.mode) });
    },
  };
}
