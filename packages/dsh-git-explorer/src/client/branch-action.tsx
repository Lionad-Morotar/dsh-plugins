/**
 * The Session header's branch trigger and its popover.
 *
 * The trigger sits in the same action row as the subagent and job counters, so
 * it repeats their metrics instead of borrowing a host class name: those carry
 * a content hash that changes on every host build. The popover lists the local
 * branches of the session working directory and checks one out through the host
 * write endpoint; a session outside a repository renders nothing at all, which
 * is the only quiet answer when the panel is not part of that session's story.
 */
import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
  type RefObject,
} from "react";

import { filterBranches, firstAvailableIndex, moveActive, pickActive } from "./branch-search.ts";
import { SERVICE_UNAVAILABLE, type BranchStoreFace } from "./branch-store.ts";
import type { Translate } from "./copy.ts";
import {
  FallbackBranchIcon,
  FallbackChevronIcon,
  resolveBranchKit,
  type BranchKit,
  type IconLike,
} from "./platform.ts";
import type { GitBranch } from "../host/types.ts";

/** Popover width, matching the host's own header dropdowns. */
const PANEL_WIDTH = 320;

/** Distance kept between the trigger and the panel. */
const PANEL_GAP = 5;

/** Distance kept between the panel and each viewport edge. */
const VIEWPORT_MARGIN = 8;

/** Owner props the session-scoped header action row passes in. */
export interface BranchActionProps {
  /** Session whose working directory backs the inventory. */
  readonly sessionId?: string;
}

/** What one component mount closes over. */
export interface BranchActionWiring {
  readonly store: BranchStoreFace;
  readonly t: Translate;
}

/**
 * Place the panel under the trigger.
 *
 * The primitive hook owns scroll, resize and own-size tracking when the host
 * seeds one. The fallback repeats only what the popover needs to land under the
 * trigger. The kit is fixed by the loader for the life of the page, so this
 * branch cannot flip between renders and reorder the hooks.
 */
function usePanelPosition(
  kit: BranchKit,
  open: boolean,
  anchorRef: RefObject<HTMLButtonElement | null>,
  panelRef: RefObject<HTMLDivElement | null>,
): CSSProperties | undefined {
  if (kit.useAnchoredPosition !== undefined) {
    const position = kit.useAnchoredPosition({
      open,
      anchorRef,
      panelRef,
      side: "bottom",
      align: "end",
      gap: PANEL_GAP,
      margin: VIEWPORT_MARGIN,
    });
    return position ?? undefined;
  }
  return useMeasuredPosition(open, anchorRef);
}

/** Measure the trigger directly; used when the anchor hook is unavailable. */
function useMeasuredPosition(
  open: boolean,
  anchorRef: RefObject<HTMLButtonElement | null>,
): CSSProperties | undefined {
  const [position, setPosition] = useState<CSSProperties | undefined>(undefined);
  useLayoutEffect(() => {
    if (!open) {
      setPosition(undefined);
      return;
    }
    const place = (): void => {
      const anchor = anchorRef.current;
      if (anchor === null) return;
      const rect = anchor.getBoundingClientRect();
      const width = Math.min(PANEL_WIDTH, Math.max(160, window.innerWidth - VIEWPORT_MARGIN * 2));
      const left = Math.min(
        Math.max(rect.right - width, VIEWPORT_MARGIN),
        window.innerWidth - width - VIEWPORT_MARGIN,
      );
      setPosition({ left, top: rect.bottom + PANEL_GAP, width });
    };
    place();
    window.addEventListener("scroll", place, true);
    window.addEventListener("resize", place);
    return () => {
      window.removeEventListener("scroll", place, true);
      window.removeEventListener("resize", place);
    };
  }, [open, anchorRef]);
  return position;
}

/** Close the popover on an outside pointer press. */
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
  }, [open, close, rootRef, panelRef]);
}

/**
 * Split a branch name into plain and highlighted spans.
 *
 * Ranges arrive sorted and merged, so this only emits the gaps between them; an
 * empty range list yields the whole name as one plain span, which is what an
 * unfiltered list shows.
 */
function highlightName(name: string, ranges: readonly (readonly [number, number])[]): ReactNode[] {
  const nodes: ReactNode[] = [];
  let cursor = 0;
  ranges.forEach((range, index) => {
    const [start, end] = range;
    if (start > cursor) nodes.push(<span key={`plain-${index}`}>{name.slice(cursor, start)}</span>);
    nodes.push(
      <span key={`hit-${index}`} className="gx-branch-match">
        {name.slice(start, end)}
      </span>,
    );
    cursor = end;
  });
  if (cursor < name.length) nodes.push(<span key="tail">{name.slice(cursor)}</span>);
  return nodes;
}

/**
 * Build the header action for one client mount.
 * @param wiring - the shared branch store and the locale-bound translator.
 * @returns the component registered into the header action row.
 */
export function createBranchAction({ store, t }: BranchActionWiring): (props: BranchActionProps) => ReactNode {
  function BranchAction({ sessionId }: BranchActionProps): ReactNode {
    const state = useSyncExternalStore(store.subscribe, store.getSnapshot);
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [activeIndex, setActiveIndex] = useState(-1);
    const [pending, setPending] = useState<string | null>(null);
    const rootRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);
    const panelRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const activeRowRef = useRef<HTMLButtonElement>(null);
    const listId = useId();
    const kit = resolveBranchKit();
    const portaled = kit.createPortal !== undefined;
    const IconBranch: IconLike = kit.IconBranch ?? FallbackBranchIcon;
    const IconChevron: IconLike = kit.IconChevron ?? FallbackChevronIcon;
    const list = state.list;
    const matches = useMemo(() => filterBranches(list?.branches ?? [], query), [list, query]);

    const close = useCallback((): void => {
      setOpen(false);
      // A reopened popover starts from the full inventory; carrying a filter
      // across would hide the row the trigger now names.
      setQuery("");
    }, []);

    const closeAndFocus = useCallback((): void => {
      close();
      triggerRef.current?.focus();
    }, [close]);

    // A session switch replaces the branch inventory wholesale; carrying the
    // previous session's open state or pending row across would point at the
    // wrong worktree.
    useEffect(() => {
      close();
      setPending(null);
      if (sessionId !== undefined) void store.load(sessionId);
    }, [store, sessionId, close]);

    // The popover opens as a search field: typing works without a second click.
    useEffect(() => {
      if (open) inputRef.current?.focus();
    }, [open]);

    // Filtering changes what the cursor points at. Park it on the first usable
    // row whenever the visible set changes, including the initial load.
    useEffect(() => {
      setActiveIndex(firstAvailableIndex(matches));
    }, [matches]);

    // Keep the cursor row inside the list's scroll viewport.
    useEffect(() => {
      activeRowRef.current?.scrollIntoView?.({ block: "nearest" });
    }, [activeIndex, matches]);

    useEffect(() => {
      if (!open) return;
      const onKeyDown = (event: KeyboardEvent): void => {
        if (event.key !== "Escape") return;
        closeAndFocus();
      };
      document.addEventListener("keydown", onKeyDown);
      return () => document.removeEventListener("keydown", onKeyDown);
    }, [open, closeAndFocus]);

    const position = usePanelPosition(kit, open, triggerRef, panelRef);
    useDismiss(kit, rootRef, panelRef, portaled, open, close);

    const toggle = (): void => {
      if (open) {
        close();
        return;
      }
      setOpen(true);
      if (sessionId !== undefined) void store.load(sessionId);
    };

    const retry = (): void => {
      if (sessionId !== undefined) void store.load(sessionId);
    };

    const select = async (branch: GitBranch): Promise<void> => {
      if (pending !== null) return;
      if (branch.worktreePath !== undefined) return;
      if (branch.current) {
        closeAndFocus();
        return;
      }
      if (sessionId === undefined) return;
      setPending(branch.name);
      const switched = await store.switchTo(sessionId, branch.name);
      setPending(null);
      // A refused switch keeps the popover open so the host message stays in
      // view; the store owns that message, this only reacts to the outcome.
      if (switched) closeAndFocus();
    };

    const activate = (): void => {
      const branch = pickActive(matches, activeIndex);
      if (branch !== undefined) void select(branch);
    };

    const onSearchKeyDown = (event: ReactKeyboardEvent<HTMLInputElement>): void => {
      // Host shortcuts own modifier combinations; only bare navigation keys
      // belong to the popover.
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      // An IME confirms a composition with Enter; that keystroke is text input,
      // not a switch.
      if (event.nativeEvent.isComposing) return;
      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        event.preventDefault();
        const delta = event.key === "ArrowDown" ? 1 : -1;
        setActiveIndex(index => moveActive(matches, index, delta));
        return;
      }
      if (event.key === "Enter") {
        event.preventDefault();
        activate();
      }
    };

    if (sessionId === undefined) return null;

    const current = list?.branches.find(branch => branch.current)?.name;
    const label =
      list === undefined
        ? t("branch.loading")
        : list.detached
          ? (list.headHash ?? t("head.detached"))
          : (current ?? t("branch.unborn"));
    // Outside a repository there is no trigger to press, so an unreadable or
    // non-repository inventory stays silent instead of showing a dead control.
    if (!open && list?.isRepository !== true) return null;

    const detachedTitle = `${t("head.detached")} ${list?.headHash ?? ""}`.trim();
    const message = state.error === SERVICE_UNAVAILABLE ? t("state.noService.title") : state.error;

    const panel = (
      <div
        ref={panelRef}
        className="gx-branch-panel"
        data-testid="gx-branch-panel"
        role="dialog"
        aria-label={t("branch.title")}
        style={position}
      >
        <input
          ref={inputRef}
          type="text"
          className="gx-branch-search"
          data-testid="gx-branch-search"
          value={query}
          placeholder={t("branch.search")}
          aria-label={t("branch.search")}
          role="combobox"
          aria-haspopup="listbox"
          aria-expanded="true"
          aria-autocomplete="list"
          aria-controls={list === undefined ? undefined : listId}
          aria-activedescendant={
            activeIndex >= 0 && list !== undefined ? `${listId}-option-${activeIndex}` : undefined
          }
          autoComplete="off"
          spellCheck={false}
          onChange={event => setQuery(event.target.value)}
          onKeyDown={onSearchKeyDown}
        />
        {message !== undefined ? (
          <div className="gx-branch-error" data-testid="gx-branch-error" role="alert">
            <span className="gx-branch-error-text">{message}</span>
            <button type="button" className="gx-branch-retry" onClick={retry}>
              {t("action.retry")}
            </button>
          </div>
        ) : null}
        {state.status === "loading" && list === undefined ? (
          <div className="gx-branch-hint">{t("branch.loading")}</div>
        ) : null}
        {list !== undefined ? (
          <div className="gx-branch-list" id={listId} role="listbox" aria-label={t("branch.title")}>
            {list.branches.length === 0 ? <div className="gx-branch-hint">{t("branch.empty")}</div> : null}
            {list.branches.length > 0 && matches.length === 0 ? (
              <div className="gx-branch-nomatch" data-testid="gx-branch-no-match">
                {t("branch.noMatch")}
              </div>
            ) : null}
            {matches.map((match, index) => {
              const branch = match.branch;
              const active = index === activeIndex;
              return (
                <button
                  key={branch.name}
                  ref={active ? activeRowRef : undefined}
                  type="button"
                  role="option"
                  id={`${listId}-option-${index}`}
                  aria-selected={active}
                  data-active={active ? "true" : undefined}
                  className="gx-branch-row"
                  data-testid={`gx-branch-row-${branch.name}`}
                  data-current={branch.current ? "true" : undefined}
                  aria-current={branch.current ? "true" : undefined}
                  title={
                    branch.worktreePath === undefined
                      ? undefined
                      : `${t("branch.worktree")}: ${branch.worktreePath}`
                  }
                  disabled={pending !== null || branch.worktreePath !== undefined}
                  onClick={() => {
                    void select(branch);
                  }}
                >
                  <span className="gx-branch-row-name">{highlightName(branch.name, match.ranges)}</span>
                  {branch.current ? <span className="gx-branch-tag">{t("branch.current")}</span> : null}
                </button>
              );
            })}
          </div>
        ) : null}
      </div>
    );

    return (
      <div className="gx-branch-action" ref={rootRef}>
        <button
          ref={triggerRef}
          type="button"
          className="gx-branch-trigger"
          data-testid="gx-branch-trigger"
          aria-haspopup="dialog"
          aria-expanded={open}
          title={list?.detached === true ? detachedTitle : label}
          onClick={toggle}
        >
          <IconBranch className="gx-branch-icon" />
          <span className="gx-branch-name">{label}</span>
          <IconChevron className="gx-branch-chevron" />
        </button>
        {open ? (kit.createPortal === undefined ? panel : kit.createPortal(panel, document.body)) : null}
      </div>
    );
  }

  return BranchAction;
}
