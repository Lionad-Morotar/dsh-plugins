/**
 * Caret movement.
 *
 * Two strategies, because the browser exposes two different primitives:
 *
 * - Text fields (input/textarea) are plain strings with a numeric selection
 *   API, so their line boundaries are pure string arithmetic.
 * - Rich text (contenteditable) has no offset API worth trusting — the caret
 *   lives in a node tree of spans, line breaks and zero-width spacers. The one
 *   reliable primitive there is Selection.modify(), which is what Chromium,
 *   WebKit and Gecko all use internally for Home/End. It also handles bidi and
 *   soft-wrapped lines, which any hand-rolled node walk gets wrong.
 *
 * Both strategies are called only after the default action is cancelled: the
 * whole point of the plugin is that the browser does NOT run its own
 * scroll-the-nearest-scroller version of Home/End.
 */
import type { CaretAction } from "./keys.ts";

/** The slice of HTMLInputElement / HTMLTextAreaElement this module needs. */
export interface TextFieldLike {
  value: string;
  selectionStart: number;
  selectionEnd: number;
  selectionDirection?: "forward" | "backward" | "none";
  setSelectionRange(start: number, end: number, direction?: "forward" | "backward" | "none"): void;
}

/**
 * The offset of the given line boundary, measured from the start of the value.
 *
 * `backward` is the index just after the previous newline (so pressing Home
 * twice stays still rather than jumping to the previous line); `forward` is
 * the index of the newline that ends the line, or the value length.
 */
export function lineBoundaryOf(value: string, offset: number, direction: "forward" | "backward"): number {
  const at = Math.min(Math.max(offset, 0), value.length);
  if (direction === "backward") {
    const newline = value.lastIndexOf("\n", at - 1);
    return newline === -1 ? 0 : newline + 1;
  }
  const newline = value.indexOf("\n", at);
  return newline === -1 ? value.length : newline;
}

/** Whether `offset` already sits exactly on the requested boundary. */
function isOnBoundary(value: string, offset: number, action: CaretAction): boolean {
  if (action.granularity === "documentboundary") {
    return action.direction === "backward" ? offset === 0 : offset === value.length;
  }
  return lineBoundaryOf(value, offset, action.direction) === offset;
}

/** Move a text field's selection. Returns whether it moved. */
export function moveTextField(field: TextFieldLike, action: CaretAction): boolean {
  const value = field.value;
  const start = field.selectionStart;
  const end = field.selectionEnd;

  if (action.extend) {
    // Shift keeps the anchor and moves the focus end. selectionDirection is the
    // only way to tell them apart: a backward selection was dragged from its
    // end back to its start, so its focus sits at selectionStart.
    const backward = (field.selectionDirection ?? "none") === "backward";
    const anchor = backward ? end : start;
    const focus = backward ? start : end;
    const target = boundaryFor(value, focus, action);
    if (target === focus) return false;
    const nextStart = Math.min(anchor, target);
    const nextEnd = Math.max(anchor, target);
    field.setSelectionRange(nextStart, nextEnd, target > anchor ? "forward" : "backward");
    return true;
  }

  // Collapsing: browsers take the caret to the far end of the selection in the
  // direction of travel, so a Home on a selection lands on the line start even
  // when the selection was made backwards.
  const from = action.direction === "backward" ? Math.min(start, end) : Math.max(start, end);
  const target = boundaryFor(value, from, action);
  if (target === start && target === end) return false;
  field.setSelectionRange(target, target, "none");
  return true;
}

function boundaryFor(value: string, from: number, action: CaretAction): number {
  if (action.granularity === "documentboundary") return action.direction === "backward" ? 0 : value.length;
  return lineBoundaryOf(value, from, action.direction);
}

/** Raise a caret move beyond the browser's own before it happens. */
export function isNoOpTextField(field: TextFieldLike, action: CaretAction): boolean {
  if (field.selectionStart !== field.selectionEnd) return false;
  return isOnBoundary(field.value, field.selectionStart, action);
}

/** The slice of Selection this module needs; jsdom has no modify(). */
export interface CaretSelection {
  modify(alter: "move" | "extend", direction: "forward" | "backward", granularity: "lineboundary" | "documentboundary"): void;
}

/** Move a rich-text caret through the browser's own boundary logic. */
export function moveRichText(selection: CaretSelection | null, action: CaretAction): boolean {
  if (selection === null || typeof selection.modify !== "function") return false;
  selection.modify(action.extend ? "extend" : "move", action.direction, action.granularity);
  return true;
}