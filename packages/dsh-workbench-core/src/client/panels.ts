/**
 * Panel ledger for workbench-owned surfaces.
 *
 * The conversation view roster is the host's; this ledger is only for panels
 * the workbench itself lays out (the multi-panel editor of the file explorer,
 * Git tabs, terminal tabs). It is a plain snapshot store so React surfaces can
 * subscribe with `useSyncExternalStore` and non-React code can read it without
 * a renderer.
 */

/** One panel the workbench owns. */
export interface PanelDescriptor {
  /** Stable identity across re-registrations. */
  readonly id: string;
  /** Localized tab title. */
  readonly title: string;
  /** Lower order renders first; ties break on id so the ledger is deterministic. */
  readonly order?: number;
}

/** The ledger's observable state. */
export interface WorkbenchPanels {
  readonly panels: readonly PanelDescriptor[];
  readonly activeId: string | null;
}

/** Read/subscribe face handed to consumers. */
export interface PanelStore {
  getSnapshot(): WorkbenchPanels;
  subscribe(listener: () => void): () => void;
}

/** The service-owned ledger, with the mutations the workbench keeps private. */
export interface PanelLedger extends PanelStore {
  register(panel: PanelDescriptor): () => void;
  activate(id: string | null): void;
}

const orderOf = (panel: PanelDescriptor): number => panel.order ?? 0;

function compare(left: PanelDescriptor, right: PanelDescriptor): number {
  return orderOf(left) - orderOf(right) || left.id.localeCompare(right.id);
}

/**
 * Create an empty ledger.
 * @returns the ledger; `register` is idempotent per id.
 */
export function createPanelLedger(): PanelLedger {
  let state: WorkbenchPanels = { panels: [], activeId: null };
  const listeners = new Set<() => void>();

  const publish = (next: WorkbenchPanels): void => {
    state = next;
    for (const listener of listeners) listener();
  };

  return {
    getSnapshot: () => state,
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    register(panel) {
      if (state.panels.some(entry => entry.id === panel.id)) return () => {};
      const panels = [...state.panels, panel].sort(compare);
      publish({ ...state, panels });
      return () => {
        if (!state.panels.some(entry => entry.id === panel.id)) return;
        const next = state.panels.filter(entry => entry.id !== panel.id);
        publish({ panels: next, activeId: state.activeId === panel.id ? null : state.activeId });
      };
    },
    activate(id) {
      if (id === state.activeId) return;
      if (id !== null && !state.panels.some(entry => entry.id === id)) return;
      publish({ ...state, activeId: id });
    },
  };
}
