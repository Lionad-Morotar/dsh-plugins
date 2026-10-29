/**
 * The file workbench's keyboard table and focus hand-back.
 *
 * The panel chords are deliberately panel-local: the desktop shell may own a
 * native accelerator for the same combination, while the web shell can only
 * promise what a DOM listener sees. `KEYMAP` is the single description both the
 * listener and the settings slice read, so no surface hard-codes a second copy.
 *
 * Escape is separate from the panel chords because its job is not the panel
 * stack: with no dialog open it always returns the caret to the conversation
 * composer, and with a dialog open it must let the dialog win untouched.
 */

/** Logical modifier; `primary` is Command on macOS and Control elsewhere. */
export type KeyModifier = "primary" | "control" | "alt" | "shift" | "meta";

/** One panel action and the physical chord that triggers it. */
export interface KeymapEntry {
  readonly id: string;
  readonly action: "nextPanel" | "previousPanel" | "closePanel";
  /** `KeyboardEvent.code`, not the printed key. */
  readonly code: string;
  readonly modifiers: readonly KeyModifier[];
  readonly labelKey: string;
  /** Whether the desktop shell can promise the chord through its accelerator. */
  readonly desktop: boolean;
  /** Whether the web shell can promise it; false still gets the local fallback. */
  readonly web: boolean;
}

/**
 * Panel chords.
 *
 * `⌘O` is absent on purpose: the host's `workspace.add` owns it, and a plugin
 * that shadows the file picker is worse than a plugin without a shortcut.
 */
export const KEYMAP: readonly KeymapEntry[] = Object.freeze([
  {
    id: "fs.nextPanel",
    action: "nextPanel",
    code: "ArrowDown",
    modifiers: ["primary", "alt"],
    labelKey: "key.nextPanel",
    desktop: true,
    web: true,
  },
  {
    id: "fs.previousPanel",
    action: "previousPanel",
    code: "ArrowUp",
    modifiers: ["primary", "alt"],
    labelKey: "key.previousPanel",
    desktop: true,
    web: true,
  },
  {
    id: "fs.closePanel",
    action: "closePanel",
    code: "KeyW",
    modifiers: ["control"],
    labelKey: "key.closePanel",
    desktop: true,
    web: false,
  },
]);

/** The runtime the chord is being matched on. */
export type KeyPlatform = "mac" | "other";

/** The keyboard fields the matcher reads; a real event satisfies all of them. */
export interface KeyEventLike {
  readonly code?: string;
  readonly metaKey?: boolean;
  readonly ctrlKey?: boolean;
  readonly altKey?: boolean;
  readonly shiftKey?: boolean;
  readonly isComposing?: boolean;
}

/**
 * Detect the platform whose primary modifier the chord should use.
 * @returns `mac` for Apple devices, `other` everywhere else.
 */
export function detectPlatform(): KeyPlatform {
  if (typeof navigator === "undefined") return "other";
  const platform = typeof navigator.platform === "string" ? navigator.platform : "";
  const agent = typeof navigator.userAgent === "string" ? navigator.userAgent : "";
  return /mac|iphone|ipad|ipod/iu.test(platform) || /mac os x|iphone|ipad/iu.test(agent) ? "mac" : "other";
}

/**
 * Whether one event is exactly the chord an entry declares.
 *
 * Exactness matters: the panel owns ⌘⌥↓ but not ⌘⇧⌥↓ or ⌘⌥⌃↓, so a wider
 * match would steal combinations the shell may bind later.
 * @param event - the keyboard event (or a test double).
 * @param entry - the command row.
 * @param platform - primary-modifier platform, detected when omitted.
 * @returns true when every modifier matches and no extra one is held.
 */
export function matchesKeymap(event: KeyEventLike, entry: KeymapEntry, platform: KeyPlatform = detectPlatform()): boolean {
  if (event.isComposing === true) return false;
  if (event.code !== entry.code) return false;
  const wants = entry.modifiers;
  const meta = wants.includes("meta") || (wants.includes("primary") && platform === "mac");
  const control = wants.includes("control") || (wants.includes("primary") && platform !== "mac");
  const alt = wants.includes("alt");
  const shift = wants.includes("shift");
  return (
    (event.metaKey === true) === meta &&
    (event.ctrlKey === true) === control &&
    (event.altKey === true) === alt &&
    (event.shiftKey === true) === shift
  );
}

/** The DOM fields the Escape handler reads. */
export interface EscapeEventLike {
  readonly key?: string;
  readonly defaultPrevented?: boolean;
  readonly isComposing?: boolean;
  preventDefault(): void;
  stopPropagation?(): void;
}

/**
 * Whether a keyboard event originates inside a text field.
 *
 * Panel chords must not shadow the editor's own text gestures: Ctrl+W deletes
 * a word in macOS text fields, and ⌘⌥↓ has caret meanings there. The panel
 * strip is reachable by pointer from the composer, so skipping editable
 * targets costs nothing and keeps typing intact.
 * @param target - `event.target`, possibly not a DOM node.
 * @returns true for inputs, textareas, selects and contenteditable hosts.
 */
export function isEditableTarget(target: unknown): boolean {
  if (target === null || typeof target !== "object") return false;
  const element = target as { tagName?: unknown; isContentEditable?: unknown };
  if (element.isContentEditable === true) return true;
  if (typeof element.tagName !== "string") return false;
  const tag = element.tagName.toLowerCase();
  return tag === "input" || tag === "textarea" || tag === "select";
}

/** A query-only document seam, injectable in tests and absent outside a browser. */
export interface ComposerDocument {
  querySelector(selector: string): unknown;
}

/** The seams one Escape handler closes over. */
export interface EscapeSeams {
  /** Focus the host composer; return true only when it actually took focus. */
  focusComposer(): boolean | void;
  /** Whether a dialog owns the keyboard right now. */
  hasModal(): boolean;
  /** Optional follow-up for a transient surface that Escape dismisses. */
  onClose?(): void;
  /** Document for the composer fallback; the browser document by default. */
  doc?: ComposerDocument | undefined;
}

/** Focus the nearest composer input, used when the host seam cannot. */
export function focusNearestComposer(doc: ComposerDocument | undefined): boolean {
  const found = doc?.querySelector("[data-composer-input]");
  if (found === null || found === undefined || typeof found !== "object") return false;
  const focus = (found as { focus?: unknown }).focus;
  if (typeof focus !== "function") return false;
  focus.call(found);
  return true;
}

/** Whether a dialog layer is open and must keep Escape for itself. */
export function hasOpenModal(doc: ComposerDocument | undefined): boolean {
  const found = doc?.querySelector('[aria-modal="true"], [role="dialog"], dialog[open], [data-dsh-modal]');
  return found !== null && found !== undefined;
}

/**
 * Build the Escape handler for one mount.
 *
 * A dialog wins without even a preventDefault, because the dialog's own
 * handler has to see the event. Otherwise the page consumes Escape and hands
 * focus back to the composer: losing the caret in a keyboard-driven workbench
 * is exactly the dead-end this slice closes.
 * @param seams - composer focus, modal probe and an optional dismiss hook.
 * @returns the handler to register on the document.
 */
export function createEscapeHandler(seams: EscapeSeams): (event: EscapeEventLike) => void {
  const doc = seams.doc ?? (typeof document === "undefined" ? undefined : document);
  return event => {
    if (event.key !== "Escape" || event.defaultPrevented === true || event.isComposing === true) return;
    if (seams.hasModal()) return;
    event.preventDefault();
    const focused = seams.focusComposer();
    if (focused !== true) focusNearestComposer(doc);
    seams.onClose?.();
  };
}
