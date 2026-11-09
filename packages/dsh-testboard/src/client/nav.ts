/**
 * The left column's keyboard model: what is selected, what each key does to it,
 * and the flat order a selection walks.
 *
 * Pure, and deliberately separate from the view. The board's keyboard contract
 * has several rules that only look obvious until they are written down: the
 * first ArrowDown with nothing selected picks the first row, ArrowLeft over a
 * case steps back to its file before it closes anything, and a case whose file
 * was collapsed stops being selectable. Pinning them here means the view's
 * handler is a switch over intents rather than the place those rules live.
 */
import type { TestFileRow } from "./model.ts";

/**
 * What the left column has selected.
 *
 * A file row and a case row are different things to the right pane (one shows a
 * file's code, the other also shows a case's detail), so the selection carries
 * which kind it is rather than being a bare index into a flat list.
 */
export type NavSelection =
  | { readonly kind: "file"; readonly path: string }
  | { readonly kind: "case"; readonly path: string; readonly index: number };

/** One entry of the flat, visible order the selection walks. */
export type NavItem = NavSelection;

/** What one keypress asks the board to do. */
export type NavIntent = "down" | "up" | "expand" | "collapse" | "activate" | "back" | "first" | "last";

/** The board's navigation state. */
export interface NavState {
  readonly selection: NavSelection | undefined;
  readonly expanded: ReadonlySet<string>;
}

/** What one intent produced. */
export interface NavResult extends NavState {
  /** The row the view should scroll into view, when the intent moved the selection. */
  readonly reveal: NavSelection | undefined;
}

/**
 * The visible rows in render order: each file, followed by its cases when that
 * file is open.
 *
 * This is the order the arrow keys walk, so it has to be the same order the DOM
 * renders. Both are derived from the same row list and the same expanded set.
 * @param rows - the file rows currently on screen, already filtered and sorted.
 * @param expanded - the paths whose cases are showing.
 * @returns the flat order.
 */
export function flattenNav(rows: readonly TestFileRow[], expanded: ReadonlySet<string>): NavItem[] {
  const items: NavItem[] = [];
  for (const row of rows) {
    items.push({ kind: "file", path: row.path });
    if (!expanded.has(row.path)) continue;
    row.cases.forEach((_entry, index) => {
      items.push({ kind: "case", path: row.path, index });
    });
  }
  return items;
}

/**
 * Keep the selection pointing at something the reader can actually see.
 *
 * A filter can remove the selected file, and collapsing a file takes its cases
 * off screen. A case selection therefore demotes to its file rather than
 * vanishing: the reader was looking at that file, and losing the selection
 * entirely would also blank the right pane.
 * @param selection - the current selection.
 * @param rows - the file rows currently on screen.
 * @param expanded - the paths whose cases are showing.
 * @returns the selection to keep, or undefined when its file is gone.
 */
export function normalizeSelection(
  selection: NavSelection | undefined,
  rows: readonly TestFileRow[],
  expanded: ReadonlySet<string>,
): NavSelection | undefined {
  if (selection === undefined) return undefined;
  const row = rows.find(candidate => candidate.path === selection.path);
  if (row === undefined) return undefined;
  if (selection.kind === "file") return selection;
  if (!expanded.has(selection.path) || selection.index >= row.cases.length) {
    return { kind: "file", path: selection.path };
  }
  return selection;
}

/**
 * Translate a keypress on the list into an intent.
 *
 * Modified chords are left to the host: those are the shell's accelerators, and
 * swallowing them here would break every shortcut that passes over the list.
 * @param key - the event's `key`.
 * @param modifierHeld - whether any of Alt, Ctrl, Meta or Shift is down.
 * @returns the intent, or null when the key is not the list's.
 */
export function navKeyIntent(key: string, modifierHeld: boolean): NavIntent | null {
  if (modifierHeld) return null;
  switch (key) {
    case "ArrowDown":
      return "down";
    case "ArrowUp":
      return "up";
    case "ArrowRight":
      return "expand";
    case "ArrowLeft":
      return "collapse";
    case "Enter":
    case " ":
      return "activate";
    case "Escape":
      return "back";
    case "Home":
      return "first";
    case "End":
      return "last";
    default:
      return null;
  }
}

/**
 * Compare two items for identity.
 * @param left - first item.
 * @param right - second item.
 * @returns whether they address the same row.
 */
function sameItem(left: NavSelection | undefined, right: NavSelection | undefined): boolean {
  if (left === undefined || right === undefined) return left === right;
  if (left.kind === "file" || right.kind === "file") return left.kind === right.kind && left.path === right.path;
  return left.path === right.path && left.index === right.index;
}

/**
 * Toggle one path in the expanded set.
 * @param expanded - the current set.
 * @param path - the path to toggle.
 * @returns a new set; the input is never mutated.
 */
function toggle(expanded: ReadonlySet<string>, path: string): ReadonlySet<string> {
  const next = new Set(expanded);
  if (next.has(path)) next.delete(path);
  else next.add(path);
  return next;
}

/**
 * Apply one intent to the board's navigation state.
 *
 * `reveal` is the row the view should scroll into view. It is set only when the
 * selection moved, so a key that changed nothing does not yank the list around.
 * @param intent - what the keypress asked for.
 * @param state - the current selection and expanded set.
 * @param rows - the file rows currently on screen.
 * @returns the next state and the row to reveal.
 */
export function applyNavIntent(intent: NavIntent, state: NavState, rows: readonly TestFileRow[]): NavResult {
  const items = flattenNav(rows, state.expanded);
  const selection = normalizeSelection(state.selection, rows, state.expanded);
  const current = items.findIndex(item => sameItem(item, selection));

  /** Move to one index of the flat order, stopping rather than wrapping. */
  const moveTo = (index: number): NavResult => {
    const target = items[Math.min(items.length - 1, Math.max(0, index))];
    if (target === undefined) return { selection, expanded: state.expanded, reveal: undefined };
    return { selection: target, expanded: state.expanded, reveal: target };
  };

  switch (intent) {
    case "down":
      // With nothing selected the first press lands on the first row, which is
      // what a reader pressing Down on a fresh board expects.
      return current === -1 ? moveTo(0) : moveTo(current + 1);
    case "up":
      return current === -1 ? moveTo(items.length - 1) : moveTo(current - 1);
    case "first":
      return moveTo(0);
    case "last":
      return moveTo(items.length - 1);
    case "expand": {
      if (selection === undefined || selection.kind !== "file") {
        return { selection, expanded: state.expanded, reveal: undefined };
      }
      if (state.expanded.has(selection.path)) return { selection, expanded: state.expanded, reveal: undefined };
      return { selection, expanded: toggle(state.expanded, selection.path), reveal: undefined };
    }
    case "collapse": {
      if (selection === undefined) return { selection, expanded: state.expanded, reveal: undefined };
      if (selection.kind === "case") {
        // Back to the file first. Closing it in the same press would hide the
        // row the reader just moved to.
        const file: NavSelection = { kind: "file", path: selection.path };
        return { selection: file, expanded: state.expanded, reveal: file };
      }
      if (!state.expanded.has(selection.path)) return { selection, expanded: state.expanded, reveal: undefined };
      return { selection, expanded: toggle(state.expanded, selection.path), reveal: undefined };
    }
    case "activate": {
      if (selection === undefined) return { selection, expanded: state.expanded, reveal: undefined };
      if (selection.kind === "case") {
        // Selecting a case already shows its detail, so Enter is idempotent
        // rather than a second, different action.
        return { selection, expanded: state.expanded, reveal: undefined };
      }
      return { selection, expanded: toggle(state.expanded, selection.path), reveal: undefined };
    }
    case "back": {
      if (selection === undefined) return { selection, expanded: state.expanded, reveal: undefined };
      if (selection.kind === "case") {
        const file: NavSelection = { kind: "file", path: selection.path };
        return { selection: file, expanded: state.expanded, reveal: file };
      }
      // Escape from a file clears the selection, which returns the right pane to
      // its hint. The file stays open: Escape is about the selection, not layout.
      return { selection: undefined, expanded: state.expanded, reveal: undefined };
    }
  }
}
