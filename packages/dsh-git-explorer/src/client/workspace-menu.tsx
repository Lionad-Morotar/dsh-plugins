/**
 * The repository name in the Git header, as a switch between registered
 * Workspaces.
 *
 * The panel is a list of Workspaces the host already knows about, so switching
 * is one call to the host's own `startSession`. Nothing here opens a directory
 * picker: a reader who wants a directory that is not on this list registers it
 * in the Workspace sidebar, which is the surface that owns that decision.
 *
 * The panel portals to `document.body` because `.gx-root` clips its overflow,
 * which would otherwise cut the popover off at the header's bottom edge.
 */
import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
  type RefObject,
} from "react";

import type { Translate } from "./copy.ts";
import { resolveBranchKit, type BranchKit } from "./platform.ts";
import { currentWorkspaceId, filterWorkspaces, repoLabel, type WorkspaceChoice, type WorkspaceSwitchWiring } from "./workspace-switch.ts";

/** Popover width, matching the branch popover in the same header. */
const PANEL_WIDTH = 320;

/** Keep the panel inside a phone-width viewport with a gutter on both sides. */
const PANEL_MAX_WIDTH = "min(420px, 100vw - 32px)";

/** Distance kept between the trigger and the panel. */
const PANEL_GAP = 5;

/** Distance kept between the panel and each viewport edge. */
const VIEWPORT_MARGIN = 8;

/** The inventory a host without the Workspace service offers. */
const EMPTY_ITEMS: readonly WorkspaceChoice[] = Object.freeze([]);

/** What one mount closes over. */
export interface WorkspaceMenuWiring extends WorkspaceSwitchWiring {
  readonly t: Translate;
}

/** Owner props: the root the panel is standing in, which moves with the snapshot. */
export interface WorkspaceMenuProps {
  readonly root: string;
}

/**
 * Place the panel under the trigger.
 *
 * The primitive hook owns scroll and resize tracking when the host seeds one.
 * The fallback measures once per open, which is enough for a popover that
 * closes on any outside press. The kit is fixed by the loader for the life of
 * the page, so this branch cannot flip between renders and reorder the hooks.
 */
function usePanelPosition(
  kit: BranchKit,
  open: boolean,
  anchorRef: RefObject<HTMLButtonElement | null>,
  panelRef: RefObject<HTMLDivElement | null>,
): CSSProperties | null | undefined {
  if (kit.useAnchoredPosition !== undefined) {
    return kit.useAnchoredPosition({ open, anchorRef, panelRef, gap: PANEL_GAP, margin: VIEWPORT_MARGIN });
  }
  return useFallbackPosition(open, anchorRef);
}

/** Position for a host without the primitive hook. */
function useFallbackPosition(
  open: boolean,
  anchorRef: RefObject<HTMLButtonElement | null>,
): CSSProperties | undefined {
  const [position, setPosition] = useState<CSSProperties | undefined>(undefined);
  useLayoutEffect(() => {
    if (!open) {
      setPosition(undefined);
      return;
    }
    const anchor = anchorRef.current;
    if (anchor === null) return;
    const rect = anchor.getBoundingClientRect();
    const viewport = typeof window === "undefined" ? undefined : window;
    const width = Math.min(PANEL_WIDTH, (viewport?.innerWidth ?? PANEL_WIDTH) - VIEWPORT_MARGIN * 2);
    const left = Math.max(VIEWPORT_MARGIN, Math.min(rect.left, (viewport?.innerWidth ?? width) - width - VIEWPORT_MARGIN));
    setPosition({ position: "fixed", left, top: rect.bottom + PANEL_GAP, width, maxWidth: PANEL_MAX_WIDTH });
  }, [open, anchorRef]);
  return position;
}

/** Close the panel on an outside pointer press. */
function useDismiss(
  kit: BranchKit,
  rootRef: RefObject<HTMLDivElement | null>,
  panelRef: RefObject<HTMLDivElement | null>,
  portaled: boolean,
  open: boolean,
  close: () => void,
): void {
  if (kit.useDismissOnOutsidePointer !== undefined) {
    kit.useDismissOnOutsidePointer(rootRef, open, close, portaled ? panelRef : undefined);
    return;
  }
  useFallbackDismiss(rootRef, panelRef, open, close);
}

/** Outside-pointer dismissal for a host without the primitive hook. */
function useFallbackDismiss(
  rootRef: RefObject<HTMLDivElement | null>,
  panelRef: RefObject<HTMLDivElement | null>,
  open: boolean,
  close: () => void,
): void {
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent): void => {
      const target = event.target;
      if (!(target instanceof Node)) return;
      if (rootRef.current?.contains(target) === true) return;
      if (panelRef.current?.contains(target) === true) return;
      close();
    };
    document.addEventListener("pointerdown", onPointerDown, true);
    return () => document.removeEventListener("pointerdown", onPointerDown, true);
  }, [rootRef, panelRef, open, close]);
}

/**
 * Step the cursor, stopping at both ends.
 * @param length - number of visible rows.
 * @param index - current cursor, -1 when unset.
 * @param delta - 1 for down, -1 for up.
 * @returns the next index, clamped rather than wrapped.
 */
function moveCursor(length: number, index: number, delta: number): number {
  if (length === 0) return -1;
  if (index < 0) return 0;
  const next = index + delta;
  if (next < 0) return 0;
  if (next > length - 1) return length - 1;
  return next;
}

/**
 * Build the header's Workspace switch.
 * @param wiring - copy, the current root and the host's list and switch.
 * @returns the trigger and its popover, or null when the host cannot switch.
 */
export function createWorkspaceMenu(wiring: WorkspaceMenuWiring) {
  const { t, available, watch, list, startSession } = wiring;

  function WorkspaceMenu({ root }: WorkspaceMenuProps): ReactNode {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [activeIndex, setActiveIndex] = useState(-1);
    const [failure, setFailure] = useState<string | null>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);
    const rootRef = useRef<HTMLDivElement>(null);
    const panelRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const activeRowRef = useRef<HTMLButtonElement>(null);
    const restoreFocusRef = useRef(false);
    const listId = useId();
    const kit = resolveBranchKit();
    const portaled = kit.createPortal !== undefined;

    // Read on every render: the host's list settles after this view mounts, and
    // a snapshot taken at build time would pin the panel to an empty inventory.
    const items = list === undefined ? EMPTY_ITEMS : list();
    // Also per render: the Workspace plugin may mount after this view does, and
    // the name must become a control the moment both services are readable.
    const switchable = startSession !== undefined && (available === undefined || available());

    // While the name is still a label, the services may arrive with nothing
    // else to repaint the view. The watch reports that once; the bump below is
    // all it does, so the next render re-reads `available()` and decides for
    // itself. Subscribing only while unswitchable keeps a host that already has
    // both services from holding a subscription it will never use.
    const [, setBump] = useState(0);
    useEffect(() => {
      if (switchable || watch === undefined) return;
      return watch(() => setBump(bump => bump + 1));
    }, [switchable, watch]);
    const matches = useMemo(() => filterWorkspaces(items, query), [items, query]);
    const currentId = currentWorkspaceId(root, items);

    const close = useCallback((): void => {
      setOpen(false);
      // A reopened popover starts from the full inventory; carrying a filter
      // across would hide the row the trigger now names.
      setQuery("");
      // The failure describes the last attempt, not the next one.
      setFailure(null);
    }, []);

    const closeAndFocus = useCallback((): void => {
      restoreFocusRef.current = true;
      close();
      triggerRef.current?.focus({ preventScroll: true });
    }, [close]);

    /** An outside press closes the panel without stealing focus from the
     * control the press landed on; the effect below only reclaims it when the
     * click gave focus to nothing else. */
    const dismiss = useCallback((): void => {
      restoreFocusRef.current = true;
      close();
    }, [close]);

    // The panel opens as a search field: typing works without a second click.
    // A layout effect beats the browser's click default, which would otherwise
    // leave focus on the trigger.
    useLayoutEffect(() => {
      if (open) inputRef.current?.focus({ preventScroll: true });
    }, [open]);

    // A close originated by Escape, a row pick or an outside press returns the
    // keyboard to the trigger. An outside press that lands on another focusable
    // control keeps focus there, so the panel does not fight the pointer.
    useLayoutEffect(() => {
      if (open || !restoreFocusRef.current) return;
      restoreFocusRef.current = false;
      const active = document.activeElement;
      if (
        active === null ||
        active === document.body ||
        active === triggerRef.current ||
        rootRef.current?.contains(active) === true
      ) {
        triggerRef.current?.focus({ preventScroll: true });
      }
    }, [open]);

    // Filtering changes what the cursor points at. Park it on the current row
    // when it is visible, else on the first one, whenever the set changes.
    useEffect(() => {
      if (matches.length === 0) {
        setActiveIndex(-1);
        return;
      }
      const currentIndex = matches.findIndex(item => item.workspaceId === currentId);
      setActiveIndex(currentIndex === -1 ? 0 : currentIndex);
    }, [matches, currentId]);

    // Keep the cursor row inside the list's scroll viewport.
    useEffect(() => {
      activeRowRef.current?.scrollIntoView?.({ block: "nearest" });
    }, [activeIndex, matches]);

    // Escape is owned at the document level: the search field is focused on
    // open, but a host surface may move focus, and a container-scoped handler
    // would miss the panel entirely in that case.
    useEffect(() => {
      if (!open) return;
      const onKeyDown = (event: KeyboardEvent): void => {
        if (event.key !== "Escape" || event.isComposing) return;
        event.preventDefault();
        closeAndFocus();
      };
      document.addEventListener("keydown", onKeyDown);
      return () => document.removeEventListener("keydown", onKeyDown);
    }, [open, closeAndFocus]);

    const position = usePanelPosition(kit, open, triggerRef, panelRef);
    useDismiss(kit, rootRef, panelRef, portaled, open, dismiss);

    const toggle = (): void => {
      if (open) {
        close();
        return;
      }
      setOpen(true);
    };

    const select = (item: WorkspaceChoice): void => {
      if (item.workspaceId === currentId) {
        closeAndFocus();
        return;
      }
      if (startSession === undefined) return;
      try {
        startSession(item.workspaceId);
      } catch {
        // The host refused the switch; the panel stays open so the reader can
        // pick another row instead of being dropped back with no explanation.
        setFailure(t("workspace.failed"));
        return;
      }
      closeAndFocus();
    };

    const activate = (): void => {
      const item = activeIndex < 0 ? undefined : matches[activeIndex];
      if (item !== undefined) select(item);
    };

    const onSearchKeyDown = (event: ReactKeyboardEvent<HTMLInputElement>): void => {
      // Host shortcuts own modifier combinations; only bare navigation keys
      // belong to the panel.
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      // An IME confirms a composition with Enter; that keystroke is text input,
      // not a switch.
      if (event.nativeEvent.isComposing) return;
      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        event.preventDefault();
        const delta = event.key === "ArrowDown" ? 1 : -1;
        setActiveIndex(index => moveCursor(matches.length, index, delta));
        return;
      }
      if (event.key === "Enter") {
        event.preventDefault();
        activate();
      }
    };

    const panel = (
      <div
        className="gx-workspace-panel"
        data-testid="gx-workspace-panel"
        ref={panelRef}
        style={position ?? undefined}
        role="listbox"
        id={listId}
        aria-label={t("workspace.title")}
      >
        <input
          className="gx-workspace-search"
          data-testid="gx-workspace-search"
          ref={inputRef}
          type="text"
          value={query}
          placeholder={t("workspace.search")}
          aria-label={t("workspace.search")}
          aria-controls={listId}
          onChange={event => setQuery(event.target.value)}
          onKeyDown={onSearchKeyDown}
        />
        {failure === null ? null : (
          <div className="gx-workspace-failure" role="alert">
            {failure}
          </div>
        )}
        <div className="gx-workspace-list">
          {matches.length === 0 ? (
            <div className="gx-workspace-empty" role="note">
              {items.length === 0 ? t("workspace.none") : t("workspace.empty")}
            </div>
          ) : (
            matches.map((item, index) => {
              const isCurrent = item.workspaceId === currentId;
              return (
                <button
                  key={item.workspaceId}
                  type="button"
                  className="gx-workspace-row"
                  data-testid={`gx-workspace-row-${item.workspaceId}`}
                  data-current={isCurrent ? "true" : undefined}
                  data-active={index === activeIndex ? "true" : undefined}
                  ref={index === activeIndex ? activeRowRef : undefined}
                  role="option"
                  aria-selected={isCurrent}
                  title={item.path}
                  onClick={() => select(item)}
                >
                  <span className="gx-workspace-row-title">{item.title}</span>
                  <span className="gx-workspace-row-path">{item.path}</span>
                </button>
              );
            })
          )}
        </div>
      </div>
    );

    // Without both services there is nothing to switch to, so the name stays the
    // plain label it has always been rather than a button that does nothing.
    if (!switchable) return <span className="gx-repo" title={root}>{repoLabel(root)}</span>;

    return (
      <div className="gx-workspace-switch" ref={rootRef}>
        <button
          type="button"
          className="gx-repo gx-repo-switch"
          data-testid="gx-workspace-switch"
          ref={triggerRef}
          title={root}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={open ? listId : undefined}
          onClick={toggle}
        >
          {repoLabel(root)}
        </button>
        {open ? (kit.createPortal === undefined ? panel : kit.createPortal(panel, document.body)) : null}
      </div>
    );
  }

  return WorkspaceMenu;
}
