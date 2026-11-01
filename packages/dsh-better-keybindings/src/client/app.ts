/**
 * Client wiring: one capture-phase keydown listener on the window, and every
 * DOM decision lives here.
 *
 * Capture phase matters twice. It runs before the browser's default action,
 * which is what scrolls the conversation: Chromium treats Home/End inside an
 * editable as "move the caret AND scroll every scrollable ancestor into view",
 * and on the Harness composer the nearest such ancestor is the conversation
 * scrollport. It also runs before dsh-client-ui-chat reading-intent handling,
 * so the stroke never reaches the machinery that attributes a keydown to "the
 * user wants to read instead of following the stream".
 *
 * The listener is narrow on purpose: only Home/End, only with an editable
 * target, only without Alt. Everything else falls through untouched, so the
 * chat area keeps its own Home/End whenever no text field is focused.
 */
import {
  classifyTarget,
  isBody,
  landsInScrollport,
  matchCaretKey,
  matchScrollKey,
  type CaretKeyEvent,
} from "./keys.ts";
import { moveRichText, moveTextField, type CaretSelection, type TextFieldLike } from "./caret.ts";
import { isScrollable, pageTarget, pickScrollContainer, revealDelta, textFieldScroll, type Rect, type ScrollBox, type ScrollCandidate } from "./reveal.ts";

/** The window events this plugin wires, keyed like the DOM's own event maps. */
interface KeysWindowEventMap {
  keydown: KeyboardEvent;
  mousemove: MouseEvent;
}

export interface KeysWindow {
  document: Document;
  getSelection(): CaretSelection | null;
  addEventListener<K extends keyof KeysWindowEventMap>(
    type: K,
    listener: (event: KeysWindowEventMap[K]) => void,
    options?: { capture?: boolean; passive?: boolean },
  ): void;
  removeEventListener<K extends keyof KeysWindowEventMap>(
    type: K,
    listener: (event: KeysWindowEventMap[K]) => void,
    options?: { capture?: boolean },
  ): void;
  dispatchEvent(event: Event): boolean;
  getComputedStyle?(element: Element): { overflowY: string; overflowX: string };
}

export interface AppDeps {
  /** Host window; defaults to the browser global, injected under jsdom. */
  window?: KeysWindow;
  /** Caret rect oracle for rich text, injected by tests (no layout in jsdom). */
  caretRect?: () => Rect | null;
  /**
   * Scroll containers this plugin must never move.
   *
   * The conversation scrollport is the host's: it owns follow-the-tail,
   * reading-intent attribution and scroll restoration, and moving it is the
   * exact side effect this plugin exists to remove. If the composer sits
   * outside the viewport the user is not typing in it, so the caret never needs
   * that container to reveal it.
   */
  excludeSelector?: string;
  /** The transcript scrollport a page key scrolls; defaults to the host's. */
  scrollportSelector?: string;
  /**
   * Viewport hit-test for the pointer branch, injected by tests because jsdom
   * never implemented document.elementFromPoint. Defaults to the real one.
   */
  pointerElementAt?: (x: number, y: number) => Element | null;
}

const DEFAULT_EXCLUDE_SELECTOR = "[data-conversation-scroll]";

/**
 * The transcript scrollport, which owns the keys this plugin repurposes.
 *
 * Separate from {@link AppDeps.excludeSelector} even though the default value
 * is the same selector, because the two mean different things: exclusion says
 * "never move this container", while this says "this is the container a page
 * key is about".
 */
const DEFAULT_SCROLLPORT_SELECTOR = "[data-conversation-scroll]";

export interface KeysApp {
  /** Mount the window listener. Returns the symmetric teardown. */
  apply(): () => void;
}

/**
 * Move the caret and put it back on screen.
 *
 * The default action is cancelled for every stroke this plugin claims,
 * including the "caret is already on the boundary" case: that second Home
 * would otherwise still scroll the conversation even though the caret cannot
 * move, which is the exact bug being fixed. Because cancelling also suppresses
 * the browser's scroll-into-view, the reveal below replaces it.
 */
export function createApp(deps: AppDeps = {}): KeysApp {
  const win = deps.window ?? (globalThis as unknown as KeysWindow);
  const excludeSelector = deps.excludeSelector ?? DEFAULT_EXCLUDE_SELECTOR;
  const scrollportSelector = deps.scrollportSelector ?? DEFAULT_SCROLLPORT_SELECTOR;
  const pointerElementAt = deps.pointerElementAt ?? ((x: number, y: number) => win.document.elementFromPoint(x, y) ?? null);

  // Where the pointer was last seen, viewport coordinates. mousemove only ever
  // writes these two numbers — no layout reads on a hot path — and the initial
  // off-screen value makes the first hit test miss, which falls the key back
  // to the transcript exactly as if the pointer had never entered the window.
  const lastPointer = { x: -1, y: -1 };

  function richCaretRect(): Rect | null {
    if (deps.caretRect !== undefined) return deps.caretRect();
    const selection = win.document.getSelection?.() ?? null;
    if (selection === null || selection.rangeCount === 0) return null;
    const range = selection.getRangeAt(0).cloneRange();
    // A collapsed range has no box of its own, so it is widened by a pixel and
    // read: the resulting rect is the caret's own line box.
    const collapsed = range.collapsed;
    if (collapsed) {
      range.setEnd(range.endContainer, Math.min(range.endOffset + 1, range.endContainer.textContent?.length ?? 0));
      const rect = range.getBoundingClientRect();
      if (rect.width === 0 && rect.height === 0) return null;
      return rect;
    }
    return range.getBoundingClientRect();
  }

  function scrollableAncestors(from: Element | null): HTMLElement[] {
    const found: HTMLElement[] = [];
    let node = from;
    while (node !== null) {
      if (node.parentElement !== null && node.matches(excludeSelector)) break;
      const style = win.getComputedStyle?.(node);
      const scrolls = style === undefined || style.overflowY === "auto" || style.overflowY === "scroll" || style.overflowX === "auto" || style.overflowX === "scroll";
      if (scrolls) {
        const box = node as HTMLElement;
        const dimensions: ScrollBox = {
          top: box.getBoundingClientRect().top,
          bottom: box.getBoundingClientRect().bottom,
          left: box.getBoundingClientRect().left,
          right: box.getBoundingClientRect().right,
          scrollTop: box.scrollTop,
          scrollHeight: box.scrollHeight,
          clientHeight: box.clientHeight,
          scrollLeft: box.scrollLeft,
          scrollWidth: box.scrollWidth,
          clientWidth: box.clientWidth,
        };
        if (isScrollable(dimensions)) found.push(box);
      }
      node = node.parentElement;
    }
    return found;
  }

  /**
   * The container a pointer-driven page step should move, or null when
   * nothing scrollable sits under the pointer.
   *
   * Every DOM read (hit test, computed overflow, scroll metrics) stays in this
   * layer; the choice itself is the pure {@link pickScrollContainer}, so the
   * selection policy is testable without a layout engine.
   */
  function scrollableUnderPointer(): HTMLElement | null {
    const hit = pointerElementAt(lastPointer.x, lastPointer.y);
    if (hit === null) return null;
    const candidates: ScrollCandidate[] = [];
    const nodes: Element[] = [];
    let node: Element | null = hit;
    while (node !== null) {
      // A window without getComputedStyle reports no overflow at all; reading
      // that as scrollable leaves the decision to the metrics, the same
      // contract the caret reveal uses.
      const style = win.getComputedStyle?.(node);
      const box = node as HTMLElement;
      candidates.push({
        overflowY: style === undefined ? "auto" : style.overflowY,
        overflowX: style === undefined ? "auto" : style.overflowX,
        scrollHeight: box.scrollHeight,
        clientHeight: box.clientHeight,
        scrollWidth: box.scrollWidth,
        clientWidth: box.clientWidth,
      });
      nodes.push(node);
      node = node.parentElement;
    }
    const picked = pickScrollContainer(candidates);
    return picked === null ? null : (nodes[picked] as HTMLElement);
  }

  function revealRichText(target: Element): void {
    const rect = richCaretRect();
    if (rect === null) return;
    for (const box of scrollableAncestors(target)) {
      const bounds = box.getBoundingClientRect();
      const delta = revealDelta(
        {
          top: bounds.top,
          bottom: bounds.bottom,
          left: bounds.left,
          right: bounds.right,
          scrollTop: box.scrollTop,
          scrollHeight: box.scrollHeight,
          clientHeight: box.clientHeight,
          scrollLeft: box.scrollLeft,
          scrollWidth: box.scrollWidth,
          clientWidth: box.clientWidth,
        },
        rect,
      );
      if (delta.top !== undefined) box.scrollTop = delta.top;
      if (delta.left !== undefined) box.scrollLeft = delta.left;
    }
  }

  function revealTextField(field: TextFieldLike & HTMLElement, value: string): void {
    const style = win.getComputedStyle?.(field);
    const lineHeight = style === undefined ? 0 : Number.parseFloat((style as unknown as { lineHeight: string }).lineHeight);
    const delta = textFieldScroll(
      {
        scrollTop: field.scrollTop,
        scrollHeight: field.scrollHeight,
        clientHeight: field.clientHeight,
        scrollLeft: field.scrollLeft,
        scrollWidth: field.scrollWidth,
        clientWidth: field.clientWidth,
        lineHeight: Number.isFinite(lineHeight) ? lineHeight : 0,
        paddingTop: Number.parseFloat((style as unknown as { paddingTop?: string } | undefined)?.paddingTop ?? "0") || 0,
      },
      value,
      field.selectionEnd,
    );
    if (delta.top !== undefined) field.scrollTop = delta.top;
    if (delta.left !== undefined) field.scrollLeft = delta.left;
  }

  /**
   * Scroll one page step inside any container.
   *
   * Half a viewport, not a full one: a full page leaves no shared row between
   * before and after, so the reader loses their anchor and has to re-find the
   * line they were on. Half a page always keeps half the previous content in
   * view, which is what makes paging readable at speed.
   *
   * The destination is computed and clamped here rather than handed to
   * `scrollBy`, so a no-op at either end never emits a scroll event the host
   * would attribute to a reading intent.
   */
  function pageContainer(box: HTMLElement, direction: -1 | 1, fraction: number): void {
    const landing = pageTarget(
      { scrollTop: box.scrollTop, scrollHeight: box.scrollHeight, clientHeight: box.clientHeight },
      direction,
      fraction,
    );
    if (!landing.moved) return;
    box.scrollTop = landing.top;
  }

  /** Resolve the stroke's scrollport — the composer's own first, else the page's. */
  function pageTranscript(target: Element, direction: -1 | 1, fraction: number): void {
    const box = (target.closest(scrollportSelector) ?? win.document.querySelector(scrollportSelector)) as HTMLElement | null;
    if (box === null) return;
    pageContainer(box, direction, fraction);
  }

  return {
    apply(): () => void {
      const onKeyDown = (event: KeyboardEvent): void => {
        const like: CaretKeyEvent = {
          key: event.key,
          altKey: event.altKey,
          ctrlKey: event.ctrlKey,
          metaKey: event.metaKey,
          shiftKey: event.shiftKey,
          isComposing: event.isComposing,
        };

        // The key match runs before any DOM probe: matchScrollKey is a pure
        // map lookup, and the no-focus reading state sees every keydown
        // (arrows, letters, Escape), so running the pointer chain per stroke
        // would pay an elementFromPoint plus a layout read for keys this
        // plugin never claims.
        const scroll = matchScrollKey(like, true);
        if (scroll !== null) {
          // Page keys are the only stroke this plugin claims on a
          // non-editable target, and the caret branch below takes over when
          // the stroke lands somewhere the paging contract does not reach.
          //
          // Three priority levels decide where a page step lands, in order:
          // 1. An editable has focus — the stroke's ancestors include the
          //    scrollport, and paging must never yank the surface the user is
          //    typing into.
          // 2. The pointer sits inside a scrollable area — that is the surface
          //    the user is looking at, so it is what gets paged ("page where
          //    the pointer is"). This branch deliberately ignores
          //    excludeSelector: that list protects the caret reveal from
          //    moving the transcript, while a pointer parked on the
          //    transcript is an explicit request to page it.
          // 3. Otherwise the transcript fallback decides, unchanged from
          //    before the pointer branch existed: BODY (the no-focus reading
          //    state) or a target inside the scrollport pages the transcript,
          //    and any other target (a sidebar list, a picker, a menu) keeps
          //    its native full-page behaviour — the fall-through hands the
          //    stroke to the caret branch, which rejects it untouched.
          const editableFocused = event.target !== null && classifyTarget(event.target) !== "none";
          const pointerBox = editableFocused ? null : scrollableUnderPointer();
          const aimedAtTranscript = pointerBox === null && (isBody(event.target) || landsInScrollport(event.target, scrollportSelector));
          if (editableFocused || pointerBox !== null || aimedAtTranscript) {
            event.preventDefault();
            if (pointerBox !== null) pageContainer(pointerBox, scroll.direction, scroll.fraction);
            else pageTranscript(event.target as Element, scroll.direction, scroll.fraction);
            return;
          }
        }

        const target = classifyTarget(event.target);
        if (target === "none") return;
        const action = matchCaretKey(like, target);
        if (action === null) return;

        event.preventDefault();

        if (target === "text-field") {
          const field = event.target as unknown as TextFieldLike & HTMLElement;
          moveTextField(field, action);
          revealTextField(field, field.value);
          return;
        }

        moveRichText(win.getSelection(), action);
        revealRichText(event.target as Element);
      };

      const onMouseMove = (event: MouseEvent): void => {
        lastPointer.x = event.clientX;
        lastPointer.y = event.clientY;
      };

      win.addEventListener("keydown", onKeyDown, { capture: true });
      // Passive: the handler only records coordinates, so there is nothing it
      // would ever need preventDefault for.
      win.addEventListener("mousemove", onMouseMove, { passive: true });
      return () => {
        win.removeEventListener("keydown", onKeyDown, { capture: true });
        win.removeEventListener("mousemove", onMouseMove);
      };
    },
  };
}