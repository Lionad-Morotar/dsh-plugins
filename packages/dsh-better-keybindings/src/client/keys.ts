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