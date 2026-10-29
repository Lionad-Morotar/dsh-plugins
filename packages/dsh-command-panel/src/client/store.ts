/**
 * One observable snapshot for the whole panel.
 *
 * The React tree is a projection of this object and nothing else, so there is
 * exactly one place where "the reader typed while a request was in flight" can
 * go wrong. The store is deliberately dumb: it holds state and notifies. Every
 * decision about *what* the next state is lives in `panel-state.ts` (model) or
 * in the runtime (async lifecycle).
 */

import type { PanelMode, PanelModel } from "./panel-state.ts";
import { modelFor } from "./panel-state.ts";
import type { PanelRow } from "./rows.ts";

/** Where the visible rows came from. */
export type PanelStatus = "idle" | "loading" | "ready" | "error";

export interface PanelSnapshot {
  readonly open: boolean;
  readonly model: PanelModel;
  readonly rows: readonly PanelRow[];
  readonly status: PanelStatus;
  /** Error text for `status: "error"`. */
  readonly message: string | null;
  /** Transient one-line feedback under the list (executed command, claim failure). */
  readonly notice: string | null;
  readonly noticeTone?: "info" | "error";
}

export interface PanelStore {
  getSnapshot(): PanelSnapshot;
  subscribe(listener: () => void): () => void;
  set(patch: Partial<PanelSnapshot>): void;
  update(next: (snapshot: PanelSnapshot) => PanelSnapshot): void;
}

/** Build a store in the closed state, ready for the first open. */
export function createPanelStore(mode: PanelMode = "navigate"): PanelStore {
  let snapshot: PanelSnapshot = {
    open: false,
    model: modelFor(mode),
    rows: [],
    status: "idle",
    message: null,
    notice: null,
  };
  const listeners = new Set<() => void>();

  const publish = (): void => {
    for (const listener of [...listeners]) listener();
  };

  return {
    getSnapshot: () => snapshot,
    subscribe(listener) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    set(patch) {
      snapshot = { ...snapshot, ...patch };
      publish();
    },
    update(next) {
      snapshot = next(snapshot);
      publish();
    },
  };
}
