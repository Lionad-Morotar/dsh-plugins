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
  routePage,
  type CaretKeyEvent,
} from "./keys.ts";
import { moveRichText, moveTextField, type CaretSelection, type TextFieldLike } from "./caret.ts";
import {
  isScrollable,
  pageTarget,
  pickScrollContainer,
  pickSidebarScroller,
  revealDelta,
  textFieldScroll,
  type Rect,
  type ScrollBox,
  type ScrollCandidate,
  type SidebarCandidate,
} from "./reveal.ts";

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

/**
 * A row of the session list, the only stable mark the host gives that surface.
 *
 * The list's own scroller is a `role="tree"` whose class name carries a build
 * hash and whose accessible name follows the locale, so neither is safe to
 * select on. The browser's own rows (workspace, session, empty, overflow) carry
 * `data-row-key`; a search replaces that tree with one whose rows are bare
 * `treeitem`s inside the same scroller. The scroller is that row's tree, or the
 * first scrollbar above it when the tree itself does not scroll.
 */
const SIDEBAR_ROW_SELECTOR = "[data-row-key], [role=tree] > [role=treeitem]";

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
   * The first scrollable container in the chain starting at `start`, or null.
   *
   * Every DOM read (computed overflow, scroll metrics) stays in this layer;
   * the choice itself is the pure {@link pickScrollContainer}, so the
   * selection policy is testable without a layout engine. The chain is walked
   * on every page stroke, so both callers share this one implementation.
   */
  function nearestScrollable(start: Element | null): HTMLElement | null {
    if (start === null) return null;
    const candidates: ScrollCandidate[] = [];
    const nodes: Element[] = [];
    let node: Element | null = start;
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

  /**
   * The container a pointer-driven page step should move, or null when
   * nothing scrollable sits under the pointer.
   */
  function scrollableUnderPointer(): HTMLElement | null {
    return nearestScrollable(pointerElementAt(lastPointer.x, lastPointer.y));
  }

  /** The first session-list row that is not part of the transcript. */
  function sidebarAnchor(): Element | null {
    for (const candidate of win.document.querySelectorAll(SIDEBAR_ROW_SELECTOR)) {
      if (candidate.closest(scrollportSelector) !== null) continue;
      return candidate;
    }
    return null;
  }

  /**
   * The session list's scroller, or null when the sidebar is not mounted.
   *
   * Resolved from a row rather than a selector: the host gives the scroller no
   * data attribute, and the search-results tree shares `role="tree"` with the
   * list while being nested inside the same scroller. The first row anchors the
   * walk; which link of that walk actually scrolls is {@link pickSidebarScroller}.
   *
   * Rows inside the transcript are skipped. The host's JSON viewer is also a
   * `role="tree"` of `treeitem`s, and it lives in the conversation, so without
   * this filter a collapsed sidebar would page that viewer.
   */
  function sidebarScroller(): HTMLElement | null {
    const row = sidebarAnchor();
    if (row === null) return null;
    const candidates: SidebarCandidate[] = [];
    const nodes: Element[] = [];
    let node: Element | null = row;
    while (node !== null) {
      const style = win.getComputedStyle?.(node);
      const box = node as HTMLElement;
      candidates.push({
        tree: node.getAttribute("role") === "tree",
        overflowY: style === undefined ? "auto" : style.overflowY,
        scrollHeight: box.scrollHeight,
        clientHeight: box.clientHeight,
      });
      nodes.push(node);
      node = node.parentElement;
    }
    const picked = pickSidebarScroller(candidates);
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

  /**
   * Resolve the stroke's scrollport — the composer's own first, else the page's.
   *
   * `target` is an event target, not an element: a stroke reported at
   * `document` (the no-focus reading state) has no `closest` at all.
   */
  function pageTranscript(target: EventTarget | null, direction: -1 | 1, fraction: number): void {
    const element = target as Element | null;
    const anchor =
      element !== null && typeof element === "object" && typeof element.closest === "function" ? element : null;
    const box = (anchor?.closest(scrollportSelector) ?? win.document.querySelector(scrollportSelector)) as HTMLElement | null;
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
        // Every stroke this plugin claims is kept away from the focused
        // editable surface's own keymap. Lexical (the composer) and CodeMirror
        // both bind PageUp/PageDown: they would move the caret, or page a
        // whole viewport and drag the caret with it, behind the half-page
        // write. Stopping at the window's capture phase means no keymap
        // downstream — the editor's, or any host handler — sees the stroke.
        const focusTarget = classifyTarget(event.target);
        if (scroll !== null && focusTarget !== "none") event.stopPropagation();
        if (scroll !== null && scroll.target === "sidebar") {
          // Shift names the session list outright, so none of the three
          // levels below run: a focused composer, the pointer and the
          // transcript fallback must not steal a stroke the user aimed at
          // the sidebar. With no list mounted the stroke is still swallowed,
          // because letting it through would page whatever the pointer sits
          // on — the opposite of what Shift asks for.
          event.preventDefault();
          const box = sidebarScroller();
          if (box !== null) pageContainer(box, scroll.direction, scroll.fraction);
          return;
        }
        if (scroll !== null) {
          // Where a page step lands is {@link routePage}'s decision; this
          // layer only turns that decision into DOM reads and writes.
          //
          // The pointer is described first, and it leads. Paging follows the
          // surface the reader is looking at, including while a search box,
          // a find field or the composer holds focus: ranking the focus
          // target first is what left the file workbench's preview dead,
          // because the stroke was spent on a transcript that was not even
          // on screen.
          const editableFocused = focusTarget !== "none";
          const focusElement = editableFocused ? (event.target as Element) : null;
          const pointerBox = scrollableUnderPointer();
          const route = routePage({
            pointerScrolls: pointerBox !== null,
            pointerIsTranscript: pointerBox !== null && pointerBox.matches(scrollportSelector),
            editableFocused,
            editableInsidePointer: pointerBox !== null && focusElement !== null && pointerBox.contains(focusElement),
            editableInTranscript: focusElement !== null && focusElement.closest(scrollportSelector) !== null,
            bodyTarget: isBody(event.target) || landsInScrollport(event.target, scrollportSelector),
          });

          if (route === "pointer" && pointerBox !== null) {
            event.preventDefault();
            pageContainer(pointerBox, scroll.direction, scroll.fraction);
            return;
          }
          if (route === "transcript") {
            event.preventDefault();
            pageTranscript(event.target, scroll.direction, scroll.fraction);
            return;
          }
          if (route === "editor") {
            // Every editable surface pages the container it lives in, by the
            // same half viewport as the transcript: the step is the reading
            // habit, not a property of the chat. The stroke is claimed even
            // when no container answers, because a dead key beats a full
            // native page of some ancestor.
            event.preventDefault();
            const box = nearestScrollable(focusElement);
            if (box !== null) pageContainer(box, scroll.direction, scroll.fraction);
            return;
          }
          // "native": the stroke keeps its default behaviour, exactly as if
          // this plugin had never seen it.
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