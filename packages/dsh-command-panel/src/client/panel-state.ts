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
  /**
   * Whether the session level lists the scope's archived sessions instead of
   * the live ones. The archive is a filter state, not a third level: back
   * returns to the same scope's ordinary list before it returns to the root.
   */
  readonly archivedOnly: boolean;
  /**
   * Whether the quit row is armed: the first accept sets it, the second one
   * asks the host to exit. It only ever arms in command mode, where the quit
   * row exists, and `modelFor`, `withQuery` and `back` clear it, so the mark
   * never outlives the exact list it was armed on.
   */
  readonly confirmQuit: boolean;
}

/** What a back gesture leads to. */
export type BackResult =
  | { readonly kind: "model"; readonly model: PanelModel }
  | { readonly kind: "close" };

/** The model for a freshly opened mode: no query, first row highlighted. */
export function modelFor(mode: PanelMode): PanelModel {
  return { mode, level: "root", scope: null, query: "", highlight: 0, archivedOnly: false, confirmQuit: false };
}

/** A retyped query always moves the highlight to the strongest row. */
export function withQuery(model: PanelModel, query: string): PanelModel {
  return { ...model, query, highlight: 0, confirmQuit: false };
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
  return { ...model, level: "sessions", scope, query: "", highlight: 0, archivedOnly: false };
}

/**
 * Enter one scope's archive view, the all scope by default.
 *
 * The root-level row lands on the registry-global archive set; a workspace's
 * session list reuses the same filter state to open that workspace's own
 * archive, so `back` returns to the list the row came from. The query is
 * cleared for the same reason `drill` clears it: the row that was picked was
 * the search.
 */
export function drillArchived(model: PanelModel, scope: SessionScope = { kind: "all" }): PanelModel {
  return { ...model, level: "sessions", scope, query: "", highlight: 0, archivedOnly: true };
}

/**
 * One level up, or out.
 *
 * The archive filter is a state inside the session level, so back from an
 * archived view lands on the same scope's ordinary list; only a second back
 * goes up to the root.
 *
 * @param model - current model.
 * @returns the parent model, or `close` when the reader is already at the top.
 */
export function back(model: PanelModel): BackResult {
  if (model.mode === "switch" && model.level === "sessions") {
    if (model.archivedOnly) {
      return {
        kind: "model",
        model: { ...model, archivedOnly: false, query: "", highlight: 0, confirmQuit: false },
      };
    }
    return {
      kind: "model",
      model: { ...model, level: "root", scope: null, query: "", highlight: 0, confirmQuit: false },
    };
  }
  return { kind: "close" };
}

/** The highlighted row index, clamped for callers that only need a number. */
export function highlightOf(model: PanelModel, count: number): number {
  return clampHighlight(model.highlight, count);
}

/** What one query keystroke means for the mode, before any side effect. */
export interface PrefixReading {
  /** The text that should reach the filter. */
  readonly query: string;
  /** Whether this keystroke asks for command mode. */
  readonly enterCommand: boolean;
}

/**
 * Read the VS Code quick-open mark: a leading `>` moves the palette to command
 * mode without a second keystroke, and the mark never reaches the filter.
 *
 * The mark is stripped inside command mode too, so a paste or a stray `>` cannot
 * turn into a filter that matches nothing. Emptying the query does not leave by
 * itself: going back is a deliberate Backspace on an empty field, handled by the
 * runtime, because clearing a query and asking for another mode are different
 * intentions.
 *
 * @param text - the raw field value.
 * @param mode - the mode before this keystroke.
 * @returns the text to filter by and whether command mode is requested.
 */
export function readPrefix(text: string, mode: PanelMode): PrefixReading {
  if (!text.startsWith(">")) return { query: text, enterCommand: false };
  return { query: text.slice(1), enterCommand: mode !== "command" };
}

/** What accepting the quit row means, before any side effect. */
export type QuitAccept =
  /** Arm the row: the model carries the mark, nothing is asked of the host. */
  | { readonly kind: "arm"; readonly model: PanelModel }
  /** The mark was already set: the caller may now request the shutdown. */
  | { readonly kind: "fire" };

/**
 * Read the quit row's two-step confirmation.
 *
 * The first accept only arms: quitting the host must survive one fat-fingered
 * Enter, so the row turns into its own confirmation and a second accept is
 * what fires. Arming is data, which is why this lives beside the other pure
 * readings and the runtime only executes what `fire` tells it to.
 */
export function readQuitAccept(model: PanelModel): QuitAccept {
  if (!model.confirmQuit) return { kind: "arm", model: { ...model, confirmQuit: true } };
  return { kind: "fire" };
}

/**
 * Whether a screen-session change should take the open panel down with it.
 *
 * The panel is a surface for one session's surroundings, so once the screen
 * moves elsewhere it is answering a question nobody asked any more. A native
 * `⌘N` on the desktop creates a session without going through the panel, and
 * leaving the palette on top of the new session would read as if the key had
 * done nothing.
 *
 * `previous === null` is the exception, and it is not a switch: the bridge
 * mounts after the panel can already be open, so its first publish reports the
 * session that was there all along. Closing on that would make the panel vanish
 * on hosts where the bridge arrives late.
 *
 * @param open - whether the panel is on screen right now.
 * @param previous - the session the bridge last reported, null before its first publish.
 * @param next - the session it reports now.
 * @returns true when the runtime should close the panel.
 */
export function dismissOnSessionSwitch(
  open: boolean,
  previous: string | null,
  next: string | null,
): boolean {
  return open && previous !== null && previous !== next;
}
