/**
 * Pure key mapping: an event shape plus the kind of thing focused comes in, a
 * caret action comes out.
 *
 * Deliberately no DOM and no decision about *whether* the move can execute —
 * the app layer owns that. Keeping the mapping pure is what lets the whole
 * rule table be tested without a browser.
 */

/** What the stroke landed on, as far as this plugin cares. */
export type caretTarget = "none" | "text-field" | "contenteditable";

/** The two boundary scales a Home/End stroke can ask for. */
export type CaretGranularity = "lineboundary" | "documentboundary";

export interface CaretAction {
  /** Which way the caret walks. */
  direction: "forward" | "backward";
  /** Whole document (modifier held) or the current soft line. */
  granularity: CaretGranularity;
  /** Shift grows the selection instead of collapsing it. */
  extend: boolean;
}

export interface CaretKeyEvent {
  key: string;
  altKey: boolean;
  ctrlKey: boolean;
  metaKey: boolean;
  shiftKey: boolean;
  isComposing: boolean;
}

/**
 * Map Home/End onto a caret move, or null when the stroke is not ours.
 *
 * Alt is excluded because browsers bind Alt+Home/End to history navigation
 * (and hosts may bind their own chords); IME composition is excluded because
 * the input method owns the caret while it is composing.
 */
export function matchCaretKey(event: CaretKeyEvent, target: caretTarget): CaretAction | null {
  if (target === "none") return null;
  if (event.isComposing) return null;
  if (event.altKey) return null;
  const direction = event.key === "Home" ? "backward" : event.key === "End" ? "forward" : null;
  if (direction === null) return null;
  return {
    direction,
    granularity: event.ctrlKey || event.metaKey ? "documentboundary" : "lineboundary",
    extend: event.shiftKey,
  };
}

/** Classify an event target. Everything unmatched is "none". */
export function classifyTarget(node: EventTarget | null): caretTarget {
  // Only element nodes can be editable; a text node target (rare, but legal)
  // carries no tagName and no editable flag.
  const element = node as HTMLElement | null;
  if (element === null || typeof element !== "object" || typeof element.tagName !== "string") return "none";

  if (element.tagName === "TEXTAREA") return "text-field";
  if (element.tagName === "INPUT") {
    // The type of an input decides whether it has a caret at all: a checkbox
    // or a range input has a selectionStart of null and would silently eat the
    // key if we claimed it.
    const type = (element as HTMLInputElement).type?.toLowerCase() ?? "text";
    return TEXT_INPUT_TYPES.has(type) ? "text-field" : "none";
  }

  // isContentEditable is the authority in a browser; the attribute covers
  // engines (and jsdom) that do not derive the property.
  if (element.isContentEditable === true) return "contenteditable";
  if (typeof element.getAttribute === "function" && element.getAttribute("contenteditable") === "true") {
    return "contenteditable";
  }
  return "none";
}

/** Input types that carry a text caret and honour setSelectionRange. */
const TEXT_INPUT_TYPES = new Set(["text", "search", "url", "tel", "email", "password", "number", ""]);

/** The one scroll fraction this plugin implements; see {@link matchScrollKey}. */
export const HALF_PAGE = 0.5;

/** One page-scroll request: which way, and over how much of the viewport. */
export interface ScrollAction {
  /** Negative walks toward the start, positive toward the end. */
  direction: -1 | 1;
  /** Fraction of the viewport height to move. */
  fraction: number;
}

const SCROLL_KEY_DIRECTION = new Map<string, -1 | 1>([
  ["PageUp", -1],
  ["PageDown", 1],
]);

/**
 * Map PageUp/PageDown onto a half-viewport scroll, or null when the stroke is
 * not ours.
 *
 * `fromInput` is the whole point: the browser's own PageUp/PageDown inside a
 * text field means "scroll my ancestors", and on the Harness composer those
 * ancestors include the conversation scrollport. That is the same defect the
 * Home/End path fixes, and it makes paging lose the user's place while they are
 * typing. With no input focused the stroke stays native, because there the user
 * is asking to page the transcript.
 *
 * Alt is excluded like the caret keys (history navigation, host chords); IME
 * composition is excluded because the input method owns the surface. Ctrl/Meta
 * are NOT excluded: PageUp/PageDown have no modifier meaning here, and some
 * terminals and desktop shells deliver them with a modifier attached.
 */
export function matchScrollKey(event: CaretKeyEvent, fromInput: boolean): ScrollAction | null {
  if (!fromInput) return null;
  if (event.isComposing) return null;
  if (event.altKey) return null;
  const direction = SCROLL_KEY_DIRECTION.get(event.key);
  if (direction === undefined) return null;
  return { direction, fraction: HALF_PAGE };
}

/**
 * Whether the stroke was reported against the document body.
 *
 * With no element owning focus the browser dispatches key events at BODY (or
 * at `document`). Reading the transcript is exactly that state: clicking it
 * focuses nothing, and the user still means to page the transcript.
 */
export function isBody(target: EventTarget | null): boolean {
  if (target === null || typeof target !== "object") return false;
  const element = target as { tagName?: unknown; nodeType?: unknown };
  return element.tagName === "BODY" || element.nodeType === 9;
}

/**
 * Whether a PageUp/PageDown stroke should be claimed even with no editable
 * focus, given where the event landed.
 *
 * The chat area keeps its native paging when nothing is focused, so this is
 * only true for a target inside the conversation scrollport's own subtree
 * (a non-editable element inside the transcript, or the scrollport itself) —
 * exactly the case where the browser would scroll the transcript by a full
 * viewport and the user asked for half.
 */
export function landsInScrollport(target: EventTarget | null, scrollportSelector: string): boolean {
  const element = target as Element | null;
  if (element === null || typeof element !== "object" || typeof element.closest !== "function") return false;
  return element.closest(scrollportSelector) !== null;
}