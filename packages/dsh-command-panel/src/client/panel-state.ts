/**
 * The panel's own state, as plain data.
 *
 * Everything a reader can do to the panel is one total function over this model:
 * open, retype, move, drill into a workspace, go back. Keeping it out of the
 * React tree is what makes "Esc goes back a level before it closes" and "typing
 * resets the highlight to the first row" assertable in a unit test instead of
 * manually verifiable in a screenshot.
 *
 * The model carries no rows, no loading flag and no error text: those belong to
 * the store, which owns the async lifecycle. The model is only where the reader
 * is.
 */

/** The three ways the panel can be opened. */
export type PanelMode = "navigate" | "command" | "switch";

/** The switch mode's two levels; the other modes are always `root`. */
export type PanelLevel = "root" | "sessions";

export const PANEL_MODES: readonly PanelMode[] = ["navigate", "command", "switch"];

/** Which sessions the switch mode's second level lists. */
export type SessionScope =
  | { readonly kind: "workspace"; readonly workspaceId: string }
  | { readonly kind: "all" }
  | { readonly kind: "ungrouped" };

export interface PanelModel {
  readonly mode: PanelMode;
  /** `root` is the workspace list; `sessions` is one scope's session list. */
  readonly level: PanelLevel;
  /** Set only while `level` is `sessions`. */
  readonly scope: SessionScope | null;
  readonly query: string;
  /** Index of the highlighted row; always kept inside the visible rows. */
  readonly highlight: number;
}

/** What a back gesture leads to. */
export type BackResult =
  | { readonly kind: "model"; readonly model: PanelModel }
  | { readonly kind: "close" };

/** The model for a freshly opened mode: no query, first row highlighted. */
export function modelFor(mode: PanelMode): PanelModel {
  return { mode, level: "root", scope: null, query: "", highlight: 0 };
}

/** A retyped query always moves the highlight to the strongest row. */
export function withQuery(model: PanelModel, query: string): PanelModel {
  return { ...model, query, highlight: 0 };
}

/** Clamp an index into a row count; an empty list has no highlight. */
export function clampHighlight(index: number, count: number): number {
  if (count <= 0) return 0;
  if (index < 0) return 0;
  return index >= count ? count - 1 : index;
}

/** Move the highlight by a delta, wrapping at both ends. */
export function moveHighlight(model: PanelModel, delta: number, count: number): PanelModel {
  if (count <= 0) return { ...model, highlight: 0 };
  const next = (model.highlight + delta) % count;
  return { ...model, highlight: next < 0 ? next + count : next };
}

/** Point the highlight at an absolute index, clamped to the current rows. */
export function highlightAt(model: PanelModel, index: number, count: number): PanelModel {
  return { ...model, highlight: clampHighlight(index, count) };
}

/**
 * Keep the highlight inside the rows after a reload changed their number.
 *
 * @param model - current model.
 * @param count - number of rows now visible.
 * @returns the model, unchanged when the highlight still fits.
 */
export function reconciled(model: PanelModel, count: number): PanelModel {
  const highlight = clampHighlight(model.highlight, count);
  return highlight === model.highlight ? model : { ...model, highlight };
}

/**
 * Enter one scope's session level.
 *
 * The query is cleared: the row that was picked was the search, and carrying its
 * text into the session level would filter sessions by a string nobody typed
 * there.
 */
export function drill(model: PanelModel, scope: SessionScope): PanelModel {
  return { ...model, level: "sessions", scope, query: "", highlight: 0 };
}

/**
 * One level up, or out.
 *
 * @param model - current model.
 * @returns the parent model, or `close` when the reader is already at the top.
 */
export function back(model: PanelModel): BackResult {
  if (model.mode === "switch" && model.level === "sessions") {
    return {
      kind: "model",
      model: { ...model, level: "root", scope: null, query: "", highlight: 0 },
    };
  }
  return { kind: "close" };
}

/** The highlighted row index, clamped for callers that only need a number. */
export function highlightOf(model: PanelModel, count: number): number {
  return clampHighlight(model.highlight, count);
}
