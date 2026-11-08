/**
 * The address panel behind a link in the conversation.
 *
 * The host renders a markdown link as an anchor whose visible words are often
 * nothing like where it goes: a report is titled "季度报告" and points at a
 * hundred-character query string. There is no slot between the host's markdown
 * pass and the transcript, so the panel is attached from the outside, at the
 * document, and it never touches the anchor itself: a click still opens the link
 * exactly as the host decided, and this surface only reads the address.
 *
 * Three things are pure and live above the DOM on purpose, because each one is a
 * decision worth testing without a browser: which hrefs deserve a panel, where
 * the panel goes, and whether a copy succeeded.
 */
import {
  LINK_HOVER_ADDRESS_CLASS,
  LINK_HOVER_COPY_CLASS,
  LINK_HOVER_PANEL_CLASS,
  installLinkHoverStyles,
} from "./link-hover-styles.ts";

export {
  LINK_HOVER_ADDRESS_CLASS,
  LINK_HOVER_COPY_CLASS,
  LINK_HOVER_PANEL_CLASS,
  LINK_HOVER_SHEET,
  LINK_HOVER_STYLE_ID,
} from "./link-hover-styles.ts";

/** How long the copy button keeps its outcome before offering the copy again. */
export const COPY_FEEDBACK_MS = 1200;

/** Gap between the link and the panel, in pixels. */
const ANCHOR_GAP = 8;

/** Smallest distance the panel keeps from any viewport edge. */
const VIEWPORT_MARGIN = 8;

/**
 * The ancestors that make an anchor part of the conversation.
 *
 * `conversation.chat.flow` is the model's prose; `data-message-bubble` is the
 * user's own message, which carries no anchor today but would be the same
 * surface if the host ever rendered one there. Everything else (the sidebar, the
 * settings page, the composer) is deliberately out of scope.
 */
const CONVERSATION_ANCESTOR = '[data-slot="conversation.chat.flow"], [data-message-bubble]';

/** A link's box, in viewport coordinates. */
export interface LinkRect {
  readonly left: number;
  readonly top: number;
  readonly right: number;
  readonly bottom: number;
}

/** The panel's measured size. */
export interface PanelSize {
  readonly width: number;
  readonly height: number;
}

/** The viewport the panel has to stay inside. */
export interface ViewportSize {
  readonly width: number;
  readonly height: number;
}

/** Where the panel's top-left corner goes. */
export interface PanelPoint {
  readonly left: number;
  readonly top: number;
}

/** What the panel needs from the host to say anything. */
export interface LinkHoverDeps {
  /** Resolve one of this package's message keys. */
  readonly translate: (key: string) => string;
}

/**
 * Whether an address is worth showing.
 *
 * A `#` anchor goes nowhere, and `javascript:` and `data:` are not addresses a
 * reader would ever want to copy or retype. Everything else is shown, including
 * schemes the host will not open externally: the panel describes the link, it
 * does not decide what a click does.
 * @param href - the anchor's `href` attribute, exactly as written.
 * @returns whether the panel should appear.
 */
export function isHoverableHref(href: string): boolean {
  const trimmed = href.trim();
  if (trimmed === "") return false;
  if (trimmed.startsWith("#")) return false;
  // The scheme is compared lower case because the host does not normalise the
  // case of an href it did not write itself.
  const scheme = trimmed.slice(0, 11).toLowerCase();
  if (scheme.startsWith("javascript:")) return false;
  if (scheme.startsWith("data:")) return false;
  return true;
}

/**
 * Place the panel against a link.
 *
 * Below the link when there is room, above it when there is not, and clamped
 * into the viewport on both axes. Horizontal placement follows the link's left
 * edge and is pushed back inside when that would overflow, which is what keeps a
 * link at the right margin from hanging its panel off screen.
 * @param rect - the link's box.
 * @param size - the panel's measured size.
 * @param viewport - the visible area.
 * @returns the panel's top-left corner.
 */
export function placeLinkPanel(rect: LinkRect, size: PanelSize, viewport: ViewportSize): PanelPoint {
  const left = Math.max(VIEWPORT_MARGIN, Math.min(rect.left, viewport.width - VIEWPORT_MARGIN - size.width));

  const below = rect.bottom + ANCHOR_GAP;
  const above = rect.top - ANCHOR_GAP - size.height;
  const tallest = viewport.height - VIEWPORT_MARGIN * 2;
  let top: number;
  if (size.height <= tallest && below + size.height <= viewport.height - VIEWPORT_MARGIN) {
    top = below;
  } else if (size.height <= tallest && above >= VIEWPORT_MARGIN) {
    top = above;
  } else {
    // Neither side fits: a panel taller than the viewport is pinned to the top
    // margin rather than pushed off the bottom, so its first lines stay readable.
    top = Math.max(VIEWPORT_MARGIN, Math.min(below, viewport.height - VIEWPORT_MARGIN - size.height));
  }
  return { left, top };
}

/**
 * Write an address to the clipboard.
 *
 * The async clipboard is the path that works everywhere it is allowed, and it is
 * refused in more places than it is granted: a non-secure origin, a document
 * without focus, a permission the user denied. The selection command is the
 * fallback the browser still honours in those cases, so a refused write is not
 * the end of the attempt.
 * @param href - the address to copy.
 * @param doc - the document that owns the temporary selection.
 * @returns whether the address reached the clipboard.
 */
export async function copyLinkAddress(href: string, doc: Document): Promise<boolean> {
  const clipboard = doc.defaultView?.navigator.clipboard;
  if (clipboard !== undefined) {
    try {
      await clipboard.writeText(href);
      return true;
    } catch {
      // Fall through to the selection command.
    }
  }
  return copyThroughSelection(href, doc);
}

/**
 * Copy by selecting a throwaway text field and running the legacy command.
 *
 * The field has to be in the document and visible enough for the browser to
 * consider it selectable, so it is positioned off screen rather than hidden:
 * `display: none` would make the selection empty and the copy a no-op.
 * @param href - the address to copy.
 * @param doc - the document to borrow.
 * @returns whether the command reported success.
 */
function copyThroughSelection(href: string, doc: Document): boolean {
  if (typeof doc.execCommand !== "function") return false;
  const field = doc.createElement("textarea");
  field.value = href;
  field.setAttribute("readonly", "");
  field.style.position = "fixed";
  field.style.top = "-1000px";
  field.style.opacity = "0";
  doc.body.append(field);
  try {
    field.select();
    return doc.execCommand("copy");
  } catch {
    return false;
  } finally {
    field.remove();
  }
}

/**
 * Watch the conversation for links and show their addresses on hover.
 *
 * Every listener captures, so the panel is decided before any handler lower in
 * the tree restyles the anchor or claims the gesture for text selection. Nothing
 * here writes to the anchor: the panel is a sibling of the transcript, which is
 * also why a click on the copy button cannot reach the link.
 * @param doc - the document the conversation renders into.
 * @param deps - the strings this surface needs.
 * @returns a disposer that removes the listeners, the panel and the sheet.
 */
export function installLinkHover(doc: Document, deps: LinkHoverDeps): () => void {
  const view = doc.defaultView;
  if (view === null) return () => undefined;

  // A device without hover has no pointer to rest on a link, so the panel would
  // only ever appear from a tap that is already opening the link. Checked before
  // the sheet goes in, so a touch device gets neither.
  if (view.matchMedia?.("(hover: none)").matches === true) return () => undefined;

  const removeStyles = installLinkHoverStyles(doc);

  let panel: HTMLElement | null = null;
  let address: HTMLElement | null = null;
  let copy: HTMLButtonElement | null = null;
  let current: { readonly anchor: Element; readonly href: string } | null = null;
  let restore: ReturnType<typeof setTimeout> | null = null;

  /** Build the panel once, on the first link that deserves one. */
  const ensurePanel = (): HTMLElement => {
    if (panel !== null) return panel;
    const created = doc.createElement("div");
    created.className = LINK_HOVER_PANEL_CLASS;
    created.setAttribute("role", "tooltip");
    created.hidden = true;

    const text = doc.createElement("span");
    text.className = LINK_HOVER_ADDRESS_CLASS;

    const button = doc.createElement("button");
    button.className = LINK_HOVER_COPY_CLASS;
    button.type = "button";
    button.setAttribute("aria-label", deps.translate("link.copyAria"));
    button.textContent = deps.translate("link.copy");
    button.addEventListener("click", event => {
      // The panel sits outside the anchor, so this is not what stops the link
      // from opening; it stops the click from reaching whatever the transcript
      // listens for, and keeps the gesture from looking like a navigation.
      event.preventDefault();
      event.stopPropagation();
      const href = current?.href;
      if (href === undefined) return;
      void copyLinkAddress(href, doc).then(copied => {
        button.textContent = deps.translate(copied ? "link.copied" : "link.copyFailed");
        if (restore !== null) clearTimeout(restore);
        restore = setTimeout(() => {
          restore = null;
          button.textContent = deps.translate("link.copy");
        }, COPY_FEEDBACK_MS);
      });
    });

    created.append(text, button);
    doc.body.append(created);
    panel = created;
    address = text;
    copy = button;
    return created;
  };

  /** Put the open panel where the current link leaves room for it. */
  const reposition = (anchor: Element): void => {
    const target = ensurePanel();
    const rect = anchor.getBoundingClientRect();
    const measured = target.getBoundingClientRect();
    const point = placeLinkPanel(
      { left: rect.left, top: rect.top, right: rect.right, bottom: rect.bottom },
      { width: measured.width, height: measured.height },
      { width: view.innerWidth, height: view.innerHeight },
    );
    target.style.left = `${point.left}px`;
    target.style.top = `${point.top}px`;
  };

  /** Close the panel and forget the link it described. */
  const close = (): void => {
    current = null;
    if (restore !== null) {
      clearTimeout(restore);
      restore = null;
    }
    if (copy !== null) copy.textContent = deps.translate("link.copy");
    if (panel !== null) panel.hidden = true;
  };

  /** Show the address of one link. */
  const open = (anchor: Element, href: string): void => {
    const target = ensurePanel();
    current = { anchor, href };
    if (address !== null) address.textContent = href;
    target.hidden = false;
    reposition(anchor);
  };

  /** The anchor an event landed on, if it is a conversation link worth showing. */
  const linkOf = (target: EventTarget | null): { anchor: Element; href: string } | undefined => {
    if (!(target instanceof view.Element)) return undefined;
    const anchor = target.closest("a");
    if (anchor === null) return undefined;
    if (anchor.closest(CONVERSATION_ANCESTOR) === null) return undefined;
    const href = anchor.getAttribute("href");
    if (href === null) return undefined;
    if (!isHoverableHref(href)) return undefined;
    return { anchor, href: href.trim() };
  };

  /** Whether an event target is the panel or lives inside it. */
  const inPanel = (target: EventTarget | null): boolean =>
    panel !== null && target instanceof view.Node && panel.contains(target);

  const onOver = (event: Event): void => {
    const found = linkOf(event.target);
    if (found === undefined) return;
    open(found.anchor, found.href);
  };

  const onOut = (event: Event): void => {
    if (current === null) return;
    const to = (event as MouseEvent).relatedTarget;
    // The pointer crossing from the link into the panel is the gesture that
    // makes the copy button reachable at all, so it must not close anything.
    if (inPanel(to)) return;
    if (to instanceof view.Node && current.anchor.contains(to)) return;
    const from = event.target;
    if (from instanceof view.Node && (current.anchor.contains(from) || inPanel(from))) close();
  };

  const onFocusIn = (event: Event): void => {
    const found = linkOf(event.target);
    if (found === undefined) return;
    open(found.anchor, found.href);
  };

  const onFocusOut = (event: Event): void => {
    if (current === null) return;
    const to = (event as FocusEvent).relatedTarget;
    if (inPanel(to)) return;
    if (to instanceof view.Node && current.anchor.contains(to)) return;
    close();
  };

  const onKeyDown = (event: Event): void => {
    if ((event as KeyboardEvent).key !== "Escape") return;
    if (current === null) return;
    close();
  };

  const onScroll = (event: Event): void => {
    // The panel is fixed, so a scroll never moves it with its link; leaving it
    // where it was would point at a link that has scrolled away. Its own
    // scrolling is the one exception, because that is the reader reading it.
    if (inPanel(event.target)) return;
    close();
  };

  doc.addEventListener("mouseover", onOver, true);
  doc.addEventListener("mouseout", onOut, true);
  doc.addEventListener("focusin", onFocusIn, true);
  doc.addEventListener("focusout", onFocusOut, true);
  doc.addEventListener("keydown", onKeyDown, true);
  doc.addEventListener("scroll", onScroll, true);

  return () => {
    doc.removeEventListener("mouseover", onOver, true);
    doc.removeEventListener("mouseout", onOut, true);
    doc.removeEventListener("focusin", onFocusIn, true);
    doc.removeEventListener("focusout", onFocusOut, true);
    doc.removeEventListener("keydown", onKeyDown, true);
    doc.removeEventListener("scroll", onScroll, true);
    if (restore !== null) {
      clearTimeout(restore);
      restore = null;
    }
    panel?.remove();
    panel = null;
    address = null;
    copy = null;
    current = null;
    removeStyles();
  };
}
