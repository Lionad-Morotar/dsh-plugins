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

/**
 * Which surface a page stroke addresses.
 *
 * `pointer` keeps the existing three-level decision (focused field, the
 * scrollable area under the pointer, else the transcript). `sidebar` is the
 * Shift chord: it pages the session list and nothing else, wherever the
 * pointer happens to sit.
 */
export type ScrollTarget = "pointer" | "sidebar";

/** One page-scroll request: which way, over how much of the viewport, and where. */
export interface ScrollAction {
  /** Negative walks toward the start, positive toward the end. */
  direction: -1 | 1;
  /** Fraction of the viewport height to move. */
  fraction: number;
  /** Which surface the stroke addresses. */
  target: ScrollTarget;
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
 * terminals and desktop shells deliver them with a modifier attached. Shift is
 * the one modifier that changes the target: held, the stroke pages the session
 * list instead of following the pointer.
 */
export function matchScrollKey(event: CaretKeyEvent, fromInput: boolean): ScrollAction | null {
  if (!fromInput) return null;
  if (event.isComposing) return null;
  if (event.altKey) return null;
  const direction = SCROLL_KEY_DIRECTION.get(event.key);
  if (direction === undefined) return null;
  return { direction, fraction: HALF_PAGE, target: event.shiftKey ? "sidebar" : "pointer" };
}

/** Which surface one page stroke is about, once the DOM has been described. */
export type PageRoute =
  /** Move the scrollable container under the pointer. */
  | "pointer"
  /** Move the conversation scrollport. */
  | "transcript"
  /** Leave the stroke to the focused editor's own keymap. */
  | "editor"
  /** Move the scroll container the focused text field lives in. */
  | "field"
  /** No surface applies; leave the stroke to the browser. */
  | "native";

/** The DOM facts a page stroke's destination is decided from. */
export interface PageRouteInput {
  /** The focused element is a rich text editor outside the conversation. */
  readonly editorFocused: boolean;
  /** The focused element is a text field (input or textarea). */
  readonly fieldFocused: boolean;
  /** A vertically scrollable container sits under the pointer. */
  readonly pointerScrolls: boolean;
  /** The container under the pointer is the conversation scrollport itself. */
  readonly pointerIsTranscript: boolean;
  /** The focused surface lives inside the conversation scrollport. */
  readonly focusInTranscript: boolean;
  /** The stroke was reported by BODY, or by a target inside the scrollport. */
  readonly bodyTarget: boolean;
}

/**
 * Decide what one PageUp/PageDown stroke pages.
 *
 * An editor owns the page keys outright. Its keymap moves the caret half a
 * viewport and scrolls after it, which is the shape the change asked for:
 * the caret leads, the view follows. No `scrollTop` write here can imitate
 * that, and fighting the keymap for the same keystroke is how an earlier
 * attempt produced either two movements out of one stroke or none at all.
 * The conversation scrollport is never mistaken for an editor surface, even
 * though the composer is editable and lives inside it.
 *
 * Everything else follows the pointer, in the same shape the chat area has
 * always had: the container under the pointer pages by half a viewport,
 * whatever holds focus. Demoting the pointer behind the focus target is what
 * made paging dead in every view whose transcript is not on screen.
 *
 * With no scrollable container under the pointer, an editable target pages
 * the panel it belongs to: the transcript for the composer, the field's own
 * scroll container otherwise. A text field that lives in no scrollable
 * container is still claimed, so the browser cannot spend the stroke on a
 * full-page scroll of some ancestor.
 */
export function routePage(input: PageRouteInput): PageRoute {
  if (input.editorFocused) return "editor";
  if (input.pointerScrolls) return "pointer";
  if (input.focusInTranscript) return "transcript";
  if (input.fieldFocused) return "field";
  if (input.bodyTarget) return "transcript";
  return "native";
}

/**
 * Whether the owner of the event declared itself the authority on page keys.
 *
 * A list pane moves its own row cursor half a viewport and scrolls after it; a
 * terminal forwards the keys to the program it runs. Neither wants a global
 * scroll written underneath it, and neither can be recognized by shape, so the
 * surface says so: an ancestor carrying `data-page-keys="own"` keeps the stroke.
 * Claiming it would either scroll a pane whose cursor stayed behind, or swallow
 * a keystroke the terminal program was waiting for.
 */
export function claimsPageKeys(target: EventTarget | null, selector: string): boolean {
  const element = target as Element | null;
  if (element === null || typeof element !== "object" || typeof element.closest !== "function") return false;
  return element.closest(selector) !== null;
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