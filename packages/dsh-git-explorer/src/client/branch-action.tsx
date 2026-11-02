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
import type { GitBranch, GitSwitchStashOutcome, GitWorktreeDirty } from "../host/types.ts";

/** Popover width, matching the host's own header dropdowns. */
const PANEL_WIDTH = 320;

/** Keep the panel inside a phone-width viewport with a gutter on both sides. */
const PANEL_MAX_WIDTH = "min(420px, 100vw - 32px)";

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
 * Split a worktree root into the parent chain and the last path segment.
 *
 * The popover names the scope of the switch: the root can be a linked worktree
 * (`.claude/worktrees/<name>`), so the trailing segment is the part that tells
 * two checkouts of the same repository apart. Splitting on the string lets the
 * parent clip with CSS while that segment stays whole, and needs no width math.
 * @param root - absolute worktree root as the host reported it.
 * @returns the parent chain including its trailing separator, and the name.
 */
function splitRoot(root: string): { readonly parent: string; readonly name: string } {
  const index = Math.max(root.lastIndexOf("/"), root.lastIndexOf("\\"));
  if (index < 0) return { parent: "", name: root };
  return { parent: root.slice(0, index + 1), name: root.slice(index + 1) };
}

/** What the trigger shows between the branch name and the chevron. */
interface WorktreeReading {
  readonly additions: number;
  readonly deletions: number;
  /** Neither side has a line count, so a dot stands in for the dirtiness. */
  readonly dot: boolean;
  /** Full description for the trigger title and its accessible name. */
  readonly description: string;
}

/**
 * Turn the worktree counters into the trigger's reading.
 *
 * Line counts cover tracked paths only, so a tree can be dirty with both sides
 * at zero (an untracked file, a rename). That case becomes a dot instead of a
 * misleading `+0 −0`. Zero sides are dropped because a lone `+128` or `−34`
 * reads better than padding it with a zero.
 * @param worktree - the counters the host reported with the inventory.
 * @param t - locale-bound translator.
 * @returns the visible numbers plus the sentence used by title and aria.
 */
function readWorktree(worktree: GitWorktreeDirty, t: Translate): WorktreeReading {
  if (!worktree.dirty) {
    return { additions: 0, deletions: 0, dot: false, description: t("branch.worktreeClean") };
  }
  const numbers: string[] = [];
  if (worktree.additions > 0) numbers.push(`+${worktree.additions}`);
  if (worktree.deletions > 0) numbers.push(`−${worktree.deletions}`);
  const facts: string[] = [];
  if (worktree.trackedFiles > 0) {
    const files = worktree.trackedFiles === 1 ? t("branch.worktreeFile") : t("branch.worktreeFiles");
    facts.push(`${worktree.trackedFiles} ${files}`);
  }
  if (worktree.untrackedFiles > 0) {
    const untracked =
      worktree.untrackedFiles === 1 ? t("branch.worktreeUntracked") : t("branch.worktreeUntrackedFiles");
    facts.push(`${worktree.untrackedFiles} ${untracked}`);
  }
  const lead =
    numbers.length === 0 ? t("branch.worktreeDirty") : `${t("branch.worktreePrefix")} ${numbers.join(" ")}`;
  return {
    additions: worktree.additions,
    deletions: worktree.deletions,
    dot: numbers.length === 0,
    description: [lead, ...facts].join(t("branch.worktreeSep")),
  };
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
    const [stashWarning, setStashWarning] = useState<GitSwitchStashOutcome | null>(null);
    const sessionRef = useRef(sessionId);
    sessionRef.current = sessionId;
    const rootRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);
    const panelRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const activeRowRef = useRef<HTMLButtonElement>(null);
    const restoreFocusRef = useRef(false);
    const listId = useId();
    const panelId = useId();
    const kit = resolveBranchKit();
    const portaled = kit.createPortal !== undefined;
    const IconBranch: IconLike = kit.IconBranch ?? FallbackBranchIcon;
    const IconChevron: IconLike = kit.IconChevron ?? FallbackChevronIcon;
    const list = state.list;
    const scope = list === undefined ? undefined : splitRoot(list.root);
    const matches = useMemo(() => filterBranches(list?.branches ?? [], query), [list, query]);

    const close = useCallback((): void => {
      setOpen(false);
      // A reopened popover starts from the full inventory; carrying a filter
      // across would hide the row the trigger now names.
      setQuery("");
      // The stash notice describes the last switch, not the next one.
      setStashWarning(null);
    }, []);

    const closeAndFocus = useCallback((): void => {
      restoreFocusRef.current = true;
      close();
      triggerRef.current?.focus({ preventScroll: true });
    }, [close]);

    /** An outside press closes the popover without stealing focus from the
     * control the press landed on; the effect below only reclaims it when the
     * click gave focus to nothing else. */
    const dismiss = useCallback((): void => {
      restoreFocusRef.current = true;
      close();
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
    // A layout effect beats the browser's click default, which would otherwise
    // leave focus on the trigger (and on BODY after a keyboard-only open).
    useLayoutEffect(() => {
      if (open) inputRef.current?.focus({ preventScroll: true });
    }, [open]);

    // A close originated by Escape, a row pick or an outside press returns the
    // keyboard to the trigger. An outside press that lands on another focusable
    // control keeps focus there, so the popover does not fight the pointer.
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

    // Filtering changes what the cursor points at. Park it on the first usable
    // row whenever the visible set changes, including the initial load.
    useEffect(() => {
      setActiveIndex(firstAvailableIndex(matches));
    }, [matches]);

    // Keep the cursor row inside the list's scroll viewport.
    useEffect(() => {
      activeRowRef.current?.scrollIntoView?.({ block: "nearest" });
    }, [activeIndex, matches]);

    // Escape is owned at the document level: the search field is focused on
    // open, but a host surface may move focus, and a container-scoped handler
    // would miss the popover entirely in that case.
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
      const outcome = await store.switchTo(sessionId, branch.name);
      // A session switch already reset this popover; the reply describes the
      // previous worktree, so it must not close or warn on the new one.
      if (sessionRef.current !== sessionId) return;
      setPending(null);
      if (!outcome.switched) return;
      // The host's inventory is the only source of the new counters: reload it
      // so the reading follows the worktree instead of being cleared locally.
      void store.load(sessionId);
      if (outcome.stash?.conflict === true) {
        // The changes are parked in a conflicted stash; the popover stays open
        // so the notice cannot be missed and another branch stays reachable.
        setStashWarning(outcome.stash);
        return;
      }
      closeAndFocus();
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
    const shownLabel = list?.detached === true ? detachedTitle : label;
    const worktree = list?.isRepository === true ? list.worktree : undefined;
    const reading = worktree === undefined ? undefined : readWorktree(worktree, t);
    const sep = t("branch.worktreeSep");
    // Each part explains itself: the name span keeps the full branch name (it is
    // the part that ellipsizes), the trigger title is the worktree sentence.
    const triggerTitle = reading === undefined ? shownLabel : reading.description;
    // Only dirtiness enters the accessible name: repeating "working tree clean"
    // on every pass would make the counter row noisier for screen readers.
    const triggerAriaLabel =
      reading === undefined || worktree?.dirty !== true
        ? `${t("branch.title")}: ${shownLabel}`
        : `${t("branch.title")}: ${shownLabel}${sep}${reading.description}`;
    const message = state.error === SERVICE_UNAVAILABLE ? t("state.noService.title") : state.error;

    const panel = (
      <div
        ref={panelRef}
        id={panelId}
        className="gx-branch-panel"
        data-testid="gx-branch-panel"
        role="dialog"
        aria-label={t("branch.title")}
        style={{ width: PANEL_WIDTH, maxWidth: PANEL_MAX_WIDTH, ...position }}
      >
        {stashWarning?.conflict === true ? (
          <div className="gx-branch-warning" data-testid="gx-branch-stash-warning" role="alert">
            <span className="gx-branch-warning-text">{t("branch.stashConflict")}</span>
            {stashWarning.message === undefined || stashWarning.message === "" ? null : (
              <span className="gx-branch-warning-detail">{stashWarning.message}</span>
            )}
          </div>
        ) : null}
        {list === undefined || scope === undefined ? null : (
          <div className="gx-branch-scope" data-testid="gx-branch-scope" title={list.root}>
            <span className="gx-branch-scope-label">{t("branch.scope")}</span>
            <span className="gx-branch-scope-path">
              <span className="gx-branch-scope-parent">{scope.parent}</span>
              <span className="gx-branch-scope-name">{scope.name}</span>
            </span>
          </div>
        )}
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
          autoFocus
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
                      ? branch.name
                      : `${branch.name} ${t("branch.worktree")}: ${branch.worktreePath}`
                  }
                  disabled={pending !== null || branch.worktreePath !== undefined}
                  onClick={() => {
                    void select(branch);
                  }}
                >
                  <span className="gx-branch-row-name">{highlightName(branch.name, match.ranges)}</span>
                  {branch.worktreePath === undefined ? null : (
                    <span className="gx-branch-taken" data-testid="gx-branch-row-taken">
                      {t("branch.taken")}
                    </span>
                  )}
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
          aria-label={triggerAriaLabel}
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-controls={open ? panelId : undefined}
          title={triggerTitle}
          onClick={toggle}
        >
          <IconBranch className="gx-branch-icon" />
          <span className="gx-branch-name" title={shownLabel}>
            {label}
          </span>
          {reading === undefined || worktree?.dirty !== true ? null : (
            <span
              className="gx-branch-dirty"
              data-testid="gx-branch-dirty"
              aria-hidden="true"
              title={reading.dot ? t("branch.worktreeDirty") : undefined}
            >
              {reading.additions > 0 ? <span className="gx-branch-add">+{reading.additions}</span> : null}
              {reading.deletions > 0 ? <span className="gx-branch-del">−{reading.deletions}</span> : null}
              {reading.dot ? <span className="gx-branch-dot">•</span> : null}
            </span>
          )}
          <IconChevron className="gx-branch-chevron" />
        </button>
        {open ? (kit.createPortal === undefined ? panel : kit.createPortal(panel, document.body)) : null}
      </div>
    );
  }

  return BranchAction;
}
