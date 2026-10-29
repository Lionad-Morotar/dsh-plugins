/**
 * The terminal dock's layout state machine.
 *
 * Deliberately React-free: every transition the chrome offers (minimize,
 * restore, full screen, horizontal split, close) is decided here, so a panel that
 * disappears from the DOM can only do so because this file said so. The React
 * surface subscribes through `snapshot`/`subscribe`, which is also what the
 * acceptance probe drives directly.
 *
 * `snapshot()` returns the live object rather than a copy: React's
 * `useSyncExternalStore` compares snapshots by identity, and a fresh object per
 * call would re-render forever.
 */

/** How much room the dock takes. */
export type DockMode = "docked" | "minimized" | "fullscreen";

/** One terminal panel the dock lays out. */
export interface DockPanel {
  /** Panel identity inside this dock; unique across the dock's life. */
  readonly id: string;
  /** Session the panel's process belongs to; absent until a session exists. */
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
  readonly sessionId?: string;
}

/** Read/subscribe face handed to the React surface. */
export interface DockState {
  /** Add a panel, or activate it when it already exists. */
  open(id: string, options?: DockOpenOptions): void;
  minimize(): void;
  /** Return to the docked layout from minimized or full screen. */
  restore(): void;
  toggleFullscreen(): void;
  /**
   * Promote the dock to its two-pane layout.
   *
   * A horizontal split is capped at two panes: with no panel there is nothing to
   * split, with one the active panel gets a sibling, and with two the layout is
   * already split.
   */
  split(): void;
  /** Drop one panel; its neighbours take over the selection. */
  close(id: string): void;
  activate(id: string): void;
  snapshot(): DockSnapshot;
  subscribe(listener: () => void): () => void;
}

/** The split layout's ceiling; see {@link DockState.split}. */
export const DOCK_MAX_PANES = 2;

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
    open(id, options = {}) {
      const existing = panelOf(id);
      if (existing !== undefined) {
        if (state.activeId === id && state.mode !== "minimized") return;
        publish({ ...state, mode: awake(state.mode), activeId: id });
        return;
      }
      const panel: DockPanel = options.sessionId === undefined ? { id } : { id, sessionId: options.sessionId };
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
    split() {
      if (state.panels.length === 0 || state.panels.length >= DOCK_MAX_PANES) return;
      const active = (state.activeId === null ? undefined : panelOf(state.activeId)) ?? state.panels[0];
      if (active === undefined) return;
      const taken = new Set(state.panels.map(panel => panel.id));
      const sibling: DockPanel =
        active.sessionId === undefined
          ? { id: siblingId(active.id, taken) }
          : { id: siblingId(active.id, taken), sessionId: active.sessionId };
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
