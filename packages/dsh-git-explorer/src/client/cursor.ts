/**
 * The row cursor both list panes share: which key means which move, where a move
 * lands, and where the viewport has to go to show it.
 *
 * A cursor is an index into the rows currently on screen. Both panes replace that
 * row set underneath (a filter narrows the changes list, a search replaces the
 * history page), so each pane translates its own stable identity (a path, a
 * commit hash) into an index at that boundary rather than here. Nothing in this
 * module touches the DOM or React, which is what lets the keyboard table be
 * asserted directly instead of through a mounted component.
 */

/** One keyboard move a list understands. */
export type CursorAction = "up" | "down" | "first" | "last" | "activate";

/** Where one row sits in the scroll port, in the port's own coordinates. */
export interface RevealSpan {
  readonly scrollTop: number;
  readonly viewport: number;
  /** Distance from the top of the scrollable content to the row. */
  readonly top: number;
  /** Row height; the reveal keeps the whole row visible, not just its top. */
  readonly height: number;
}

/**
 * The scroll offset that shows one span with the least movement.
 *
 * The span is measured in the scroll port's own content coordinates, so callers
 * that know a row's geometry hand numbers over instead of reusing a formula. The
 * history list is the caller today, through {@link revealRowIndex}: its rows are
 * uniform and virtual, so their geometry is arithmetic. Centering is
 * deliberately not used; the reader is arriving at a row, and the rows above it
 * are the context that says where they arrived.
 * @param span - current offset, viewport height and the row's box.
 * @returns the offset to apply; the current one when the row already fits.
 */
export function revealSpan(span: RevealSpan): number {
  const scrollTop = Math.max(0, span.scrollTop);
  const viewport = Math.max(0, span.viewport);
  const height = Math.max(0, span.height);
  const top = Math.max(0, span.top);
  if (top < scrollTop) return top;
  if (top + height > scrollTop + viewport) return Math.max(0, top + height - viewport);
  return scrollTop;
}

/** The modifier state a keydown carries, narrowed to what the cursor reads. */
export interface CursorKeyState {
  readonly key: string;
  /** An input method is composing; the key belongs to the composition. */
  readonly composing: boolean;
  readonly alt: boolean;
  readonly ctrl: boolean;
  readonly meta: boolean;
  readonly shift: boolean;
}

/**
 * Translate one keydown into a cursor move.
 *
 * Modifier combinations belong to the host's shortcut catalogue and a composing
 * keystroke belongs to the input method, so both are refused rather than
 * claimed: a bare arrow is the only thing a list may take. `Enter` maps to
 * activation here even though what it activates differs per pane.
 * @param state - key and modifier state of the event.
 * @returns the move, or null when this key is not the list's to handle.
 */
export function cursorActionOf(state: CursorKeyState): CursorAction | null {
  if (state.composing || state.alt || state.ctrl || state.meta || state.shift) return null;
  switch (state.key) {
    case "ArrowDown":
      return "down";
    case "ArrowUp":
      return "up";
    case "Home":
      return "first";
    case "End":
      return "last";
    case "Enter":
      return "activate";
    default:
      return null;
  }
}

/**
 * Resolve one move against a list of a known length.
 *
 * No wrapping: a list is a place, so holding a direction at the end stops rather
 * than teleporting to the other edge. An unset cursor resolves to the edge the
 * move is heading away from, which makes the first arrow press after a reload
 * read as a starting point instead of a jump.
 * @param index - current cursor, undefined when unset.
 * @param action - the move to apply; `activate` does not move.
 * @param count - rows currently on screen.
 * @returns the new index, or undefined when there is no row to point at.
 */
export function stepCursor(index: number | undefined, action: CursorAction, count: number): number | undefined {
  if (count <= 0) return undefined;
  const last = count - 1;
  switch (action) {
    case "down":
      return index === undefined ? 0 : Math.min(index + 1, last);
    case "up":
      return index === undefined ? last : Math.max(index - 1, 0);
    case "first":
      return 0;
    case "last":
      return last;
    default:
      return index === undefined ? 0 : Math.min(Math.max(index, 0), last);
  }
}

/**
 * Whether the cursor is close enough to the tail that the list should fetch.
 *
 * Proximity rather than equality: the reader is walking down, so waiting until
 * the last loaded row is the cursor itself would fetch after they already
 * stopped moving. The window is a small multiple of the page's scroll distance
 * so one fetch stays ahead of the keyboard.
 * @param index - current cursor, undefined when unset.
 * @param count - rows currently loaded.
 * @param lookahead - how many rows from the end count as "close".
 * @returns whether a fetch should be requested.
 */
export function nearTail(index: number | undefined, count: number, lookahead: number): boolean {
  if (index === undefined || count <= 0) return false;
  return index >= count - Math.max(1, Math.trunc(lookahead));
}
