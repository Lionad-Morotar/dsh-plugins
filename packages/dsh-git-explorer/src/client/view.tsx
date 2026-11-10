/**
 * The Git workbench's conversation view.
 *
 * Two permanent columns: the working tree on the left, history and the selected
 * commit on the right. The view owns loading, paging and selection; parsing and
 * graph layout are pure functions in `model.ts`. Every host seam is optional at
 * read time so a deployment without the Git service renders an explicit empty
 * state instead of throwing inside the conversation shell.
 */
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";

import { ChangesPane } from "./changes-pane.tsx";
import { getBranchStore, type BranchStoreFace } from "./branch-store.ts";
import { DetailPane, type ReferenceInputActions } from "./detail-pane.tsx";
import { insertCommitReference, type CommitReferencePayload, type ReferenceInsert, type ReferenceInsertionResult, type ReferenceSpan } from "./reference.ts";
import { WorkingTreePane } from "./working-tree-pane.tsx";
import { HistoryPane, UNCOMMITTED } from "./history-pane.tsx";
import { pageQuery } from "./history-query.ts";
import type { Translate } from "./copy.ts";
import { createCommitJump, createJump, groupChanges, layoutGraph, parseCommitFocus, type CommitJumpSeam, type GraphRow } from "./model.ts";
import {
  LEFT_COLUMN_MAX_WIDTH,
  LEFT_COLUMN_MIN_WIDTH,
  clampLeftColumnWidth,
  dragReturnedToBase,
  paneResizeKeyAction,
  readLeftColumnWidth,
  resetLeftColumnWidth,
  saveLeftColumnWidth,
  type PaneWidthStorage,
} from "./pane-width.ts";
import {
  DEFAULT_DETAIL_PERCENT,
  DETAIL_MAX_PERCENT,
  DETAIL_MIN_HEIGHT,
  DETAIL_MIN_PERCENT,
  FALLBACK_COLUMN_HEIGHT,
  clampDetailPixels,
  detailResizeKeyAction,
  percentFromPixels,
  pixelsFromPercent,
  readDetailHeight,
  resetDetailHeight,
  saveDetailHeight,
} from "./detail-height.ts";
import { describeFailure, unwrapTransport, type GitRemoteFace, type RemoteResolver } from "./wire.ts";
import { createWorkspaceMenu } from "./workspace-menu.tsx";
import { repoLabel, type WorkspaceSwitchWiring } from "./workspace-switch.ts";
import type { GitCommitNode, GitQueryResult, GitSnapshot, GitSnapshotResult } from "../host/types.ts";
import { VIEW_ID } from "../shared.ts";

/**
 * Wait before turning the search box into a `git log` call.
 *
 * The query is a repository-wide grep, which costs a process launch and a walk
 * of the history; typing a phrase one letter at a time would pay that for every
 * letter. Long enough to cover normal typing, short enough that a pause reads as
 * "about to search".
 */
const SEARCH_DEBOUNCE_MS = 250;

/** The `workbench.views` seam this view binds and jumps through. */
export interface ViewSeamFace {
  bind?(sessionId: string, open: (id: string, focus: string) => void): () => void;
  open(sessionId: string, id: string, focus?: string): boolean | void;
}

/** The pending-focus queue the core carries, as this view consumes it. */
export interface ViewFocusFace {
  take(view: string): string | undefined;
  /** Replace the pending request; the command palette leaves one here. */
  request?(view: string, focus: string): void;
  subscribe(listener: () => void): () => void;
}

/** The slice of the workbench core service this view reads. */
export interface WorkbenchFace {
  readonly version: number;
  currentSessionId(): string | undefined;
  readonly views?: ViewSeamFace;
  openView?(id: string, focus?: string): boolean;
  /** Switch and deliver in one gesture where the core supports it. */
  openViewOrSwitch?(id: string, focus?: string): { readonly opened: boolean; readonly focused: boolean };
  /** Absent on cores older than the focus hand-off. */
  readonly viewFocus?: ViewFocusFace;
}

/** The request the conversation shell carries when `openView` targets this tab. */
export interface ViewRequestLike {
  readonly view: string;
  readonly focus: string;
}

/** Owner props the host passes to a `conversation.view` entry. */
export interface ConversationViewProps {
  readonly sessionId?: string;
  readonly openView?: (view: string, focus: string) => void;
  readonly viewRequest?: ViewRequestLike | null;
  readonly completeViewRequest?: () => void;
  /**
   * The composer's standard props. `conversation.view` is a session-scope slot,
   * so the host hands these to every entry; they are optional here because the
   * view also mounts on hosts and in tests that publish neither.
   */
  readonly inputActions?: ReferenceInputActions;
  /** Selector hook over the session input machine; absent on hosts without one. */
  readonly useInput?: <S>(selector: (state: { readonly phase: string }) => S) => S;
}

/** What the view needs from the entry to make the reference button work. */
export interface ReferenceWiring {
  /** The session input facade's structured-reference write, or undefined. */
  readonly insertReference?: (insert: ReferenceInsert, span: ReferenceSpan) => boolean;
  /** Return the keyboard to the composer after a write. */
  readonly focus?: () => void;
  /** Surface a failure where the reader will see it. */
  readonly notify?: (level: "info" | "error", text: string) => void;
}

/** Resolve the reference writer for one session, or undefined when it cannot. */
export type ReferenceWiringResolver = (sessionId: string) => ReferenceWiring | undefined;

/** What one view mount closes over. */
export interface ViewWiring {
  readonly workbench: WorkbenchFace;
  readonly version: number;
  readonly t: Translate;
  readonly remote: RemoteResolver;
  /** The session input facade, probed per click; absent on hosts without one. */
  readonly reference?: ReferenceWiringResolver;
  /**
   * Whether the chip's trigger source is registered right now.
   *
   * A getter because registration can land after this view is built, and a
   * boolean captured here would keep the button disabled on a host that
   * finished wiring the source a moment later.
   */
  readonly referenceSourceAvailable?: () => boolean;
  /**
   * The registered Workspaces the header can switch to.
   *
   * Absent on a host without the Workspace services, and the repository name
   * then stays a plain label rather than a button that cannot do anything.
   */
  readonly workspaces?: WorkspaceSwitchWiring;
}

/** The state a fresh mount paints before the snapshot request settles. */
export type InitialViewState = "idle" | "no-service" | "loading";

/**
 * Decide the first-paint state without waiting for an effect.
 * @param sessionId - the session the view is bound to.
 * @param hasRemote - whether `ctx.remote.gitExplorer` resolved.
 * @returns idle without a session, no-service without the Remote face, else loading.
 */
export function initialViewState(sessionId: string | undefined, hasRemote: boolean): InitialViewState {
  if (sessionId === undefined) return "idle";
  return hasRemote ? "loading" : "no-service";
}

/** What one focus consumption does to the view that accepts it. */
export interface CommitFocusSink {
  /** Select one commit hash; the detail pane loads any hash on its own. */
  select(hash: string): void;
  /** Hand the shell's request back; the host clears it only after this call. */
  complete?(): void;
}

/**
 * Consume one focus hand-off for the Git view.
 *
 * `commit:<hash>` selects the commit: the history list keeps its topo lane
 * order (no row is inserted) and the detail pane loads the hash through the
 * commit endpoint, so a hash outside the loaded pages still renders. A focus
 * that does not address a commit still completes: the host clears its pending
 * request only after this callback, and an uncompleted one would strand the
 * next open.
 * @param focus - the focus payload, or undefined when the tab opened directly.
 * @param sink - receives the selected hash and the completion.
 * @returns whether the focus addressed a commit.
 */
export function consumeCommitFocus(focus: string | undefined, sink: CommitFocusSink): boolean {
  const target = parseCommitFocus(focus);
  if (target !== undefined) sink.select(target.hash);
  sink.complete?.();
  return target !== undefined;
}

/** The store slice this view watches: a revision number and its listeners. */
export interface BranchRevisionFace {
  subscribe(listener: () => void): () => void;
  getSnapshot(): { readonly revision: number };
}

/**
 * Reload the panel whenever a branch switch advances the store's revision.
 *
 * Subscribing alone would also fire on inventory loads and error rows, and the
 * view already fetched its own snapshot on mount. Only a revision change means
 * HEAD, the working tree or the refs moved under the panel; the callback then
 * bumps the same token the header's refresh button uses, so the request stays
 * in the one effect that owns it instead of a second fetch path that could
 * race it.
 * @param source - the shared branch store, or undefined before the host mounts it.
 * @param bump - marks the painted snapshot stale.
 * @returns the unsubscribe, safe to hand to an effect cleanup.
 */
export function watchBranchRevision(source: BranchRevisionFace | undefined, bump: () => void): () => void {
  if (source === undefined) return () => {};
  let revision = source.getSnapshot().revision;
  return source.subscribe(() => {
    const next = source.getSnapshot().revision;
    if (next === revision) return;
    revision = next;
    bump();
  });
}

type LoadState =
  | { readonly kind: "idle" }
  | { readonly kind: "loading" }
  | { readonly kind: "no-service" }
  | { readonly kind: "failed"; readonly message: string }
  | { readonly kind: "ready"; readonly snapshot: GitSnapshot };

const statsStyle: CSSProperties = { display: "flex", alignItems: "center", gap: 8 };

/**
 * localStorage for pane widths; null outside a browser or when access throws.
 */
function paneWidthStorage(): PaneWidthStorage | null {
  if (typeof document === "undefined") return null;
  try {
    return document.defaultView?.localStorage ?? null;
  } catch {
    return null;
  }
}

// Below the 720px breakpoint the stylesheet stacks the two columns and hides
// the handle; this check keeps the drag hook inert there too, not just
// unreachable. The query must stay in sync with the media query in styles.ts.
const stackedLayout = (): boolean =>
  typeof window === "undefined" || window.matchMedia("(max-width: 720px)").matches;

function StateBlock({
  title,
  description,
  actionLabel,
  onAction,
}: {
  readonly title: string;
  readonly description?: string;
  readonly actionLabel?: string;
  readonly onAction?: () => void;
}) {
  return (
    <div className="gx-empty" role="note" data-testid="git-state">
      <strong>{title}</strong>
      {description === undefined ? null : <span>{description}</span>}
      {actionLabel === undefined || onAction === undefined ? null : (
        <button type="button" className="gx-btn" onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  );
}

/**
 * Build the view component for one mount.
 * @param wiring - the core service, contract version, copy and Remote resolver.
 * @returns the component registered into `conversation.view`.
 */
export function createGitExplorerView(wiring: ViewWiring) {
  const {
    workbench,
    version,
    t,
    remote: resolveRemote,
    reference: resolveReference,
    referenceSourceAvailable,
    workspaces,
  } = wiring;

  // Built once per mount, not per render: the component owns its own open state
  // and rebuilding it would remount the popover on every snapshot refresh.
  const WorkspaceMenu = workspaces === undefined ? undefined : createWorkspaceMenu({ t, ...workspaces });

  function GitExplorerView(props: ConversationViewProps) {
    const sessionId = props.sessionId ?? workbench.currentSessionId();
    const sessionRef = useRef(sessionId);
    sessionRef.current = sessionId;
    // The composer's phase, read through the host's own selector hook so a
    // sending composer repaints the button. The hook is a standard prop of this
    // slot, but a host or a test that omits it must not break the mount: the
    // fallback is a constant selector, so the hook is always called and a host
    // without an input machine simply reports no phase.
    const useInput = props.useInput ?? (() => undefined);
    const phase = useInput(state => state.phase);
    // Resolve once per mount: the Remote namespace is a stable service, and a
    // fresh proxy identity on every render would restart the snapshot effect.
    const remote = useMemo(() => resolveRemote(), [resolveRemote]);
    // The header action writes this same store; taking it once per mount keeps
    // the subscription below from re-arming on every render.
    const [branchStore] = useState<BranchStoreFace | undefined>(getBranchStore);
    const [load, setLoad] = useState<LoadState>(() => ({ kind: initialViewState(sessionId, remote !== undefined) }));
    const [reloadToken, setReloadToken] = useState(0);
    const [commits, setCommits] = useState<readonly GitCommitNode[]>([]);
    const [hasMore, setHasMore] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [loadError, setLoadError] = useState<string | undefined>(undefined);
    const [selected, setSelected] = useState<string | undefined>(undefined);
    // The history search. It is a *source* switch, not a filter: the host greps
    // the whole repository, because filtering the loaded page would report an
    // empty list whenever the only match sits on a page not fetched yet.
    const [search, setSearch] = useState("");
    const [searching, setSearching] = useState(false);
    // What the loaded `commits` are actually a page of. `loadMore` must repeat
    // this query and not the input box's current text, or a page in flight while
    // the reader keeps typing appends commits from a different search.
    const loadedQuery = useRef("");
    // Each query bump supersedes the previous one; a slower earlier response
    // must not overwrite a newer one's rows.
    const queryToken = useRef(0);
    // A focus consumed while the snapshot is still in flight must survive the
    // snapshot's default selection, so it parks here until the page arrives.
    const pendingFocus = useRef<string | undefined>(undefined);
    const handledRequest = useRef<string | undefined>(undefined);
    // Entering the view owes the left column one focus claim, served the moment
    // the first snapshot paints it. The claim lives here rather than in the pane
    // because a reload unmounts the pane, and a claim that survived that would
    // fire on data the reader had already moved past.
    const [claimFocus, setClaimFocus] = useState(true);

    // The left column's width: null keeps the stylesheet's fluid track, a
    // pixel count from a past drag pins it. Moves only touch state; the store
    // is written once at drag rest.
    const paneStorage = useMemo(() => paneWidthStorage(), []);
    const [leftWidth, setLeftWidth] = useState<number | null>(() => readLeftColumnWidth(paneStorage));
    const handleRef = useRef<HTMLDivElement | null>(null);
    // `restWidth` is the width state at drag start: what a drag that lands
    // back where it began must restore, so a persisted pixel count survives
    // its own no-op drag and an unpinned session stays fluid.
    const dragRef = useRef<{ pointerId: number; startX: number; baseWidth: number; restWidth: number | null } | null>(
      null,
    );

    // The detail pane's height, as a percentage of the right column: null keeps
    // the stylesheet's shipped share, a number from a past drag pins it. The
    // share (not pixels) is what gets stored, so the split survives a window
    // resize instead of turning a tall screen's drag into a short one's fate.
    const [detailHeight, setDetailHeight] = useState<number | null>(() => readDetailHeight(paneStorage));
    const rowHandleRef = useRef<HTMLDivElement | null>(null);
    const rowDragRef = useRef<{
      pointerId: number;
      startY: number;
      baseHeight: number;
      columnHeight: number;
      restHeight: number | null;
    } | null>(null);

    const selectFromFocus = useCallback((hash: string): void => {
      pendingFocus.current = hash;
      setSelected(hash);
      // An explicit jump outranks the entry claim: the caller asked for one
      // commit, so the pane must not also move focus to the changes list.
      setClaimFocus(false);
    }, []);

    // Stable identity, or the pane's effect would see a fresh callback on every
    // render and re-run its claim path after the claim was already spent.
    const releaseFocusClaim = useCallback((): void => {
      setClaimFocus(false);
    }, []);

    // The left column's divider. The pane left of the handle is the baseline:
    // the fluid default has no number in state, so a drag measures the
    // rendered box and works in pixel deltas from there.
    const beginPaneDrag = useCallback(
      (event: ReactPointerEvent<HTMLDivElement>): void => {
        if (event.button !== 0 || dragRef.current !== null || stackedLayout()) return;
        const pane = handleRef.current?.previousElementSibling;
        if (!(pane instanceof HTMLElement)) return;
        try {
          event.currentTarget.setPointerCapture(event.pointerId);
        } catch {
          return; // Without capture a pointer leaving the window strands the drag.
        }
        dragRef.current = {
          pointerId: event.pointerId,
          startX: event.clientX,
          baseWidth: pane.getBoundingClientRect().width,
          restWidth: leftWidth,
        };
        document.body.classList.add("gx-pane-resizing");
      },
      [leftWidth],
    );

    const movePaneDrag = useCallback((event: ReactPointerEvent<HTMLDivElement>): void => {
      const drag = dragRef.current;
      if (drag === null || drag.pointerId !== event.pointerId) return;
      setLeftWidth(clampLeftColumnWidth(drag.baseWidth + event.clientX - drag.startX));
    }, []);

    const endPaneDrag = useCallback(
      (event: ReactPointerEvent<HTMLDivElement>): void => {
        const drag = dragRef.current;
        if (drag === null || drag.pointerId !== event.pointerId) return;
        dragRef.current = null;
        document.body.classList.remove("gx-pane-resizing");
        try {
          event.currentTarget.releasePointerCapture(event.pointerId);
        } catch {
          // Capture is already gone; pointercancel beats this handler here.
        }
        const width = drag.baseWidth + event.clientX - drag.startX;
        // The moves already pinned transient pixels into state; a drag that
        // lands back where it began must undo that, or the fluid default
        // stays lost for the rest of the session.
        if (dragReturnedToBase(width, drag.baseWidth)) {
          setLeftWidth(drag.restWidth);
          return;
        }
        setLeftWidth(saveLeftColumnWidth(paneStorage, width));
      },
      [paneStorage],
    );

    const resetPaneWidth = useCallback((): void => {
      resetLeftColumnWidth(paneStorage);
      setLeftWidth(null);
    }, [paneStorage]);

    // Keyboard parity for the separator. A fluid pane has no number in
    // state, so a nudge measures the rendered box and steps from what is on
    // screen; preventDefault keeps the arrows from scrolling the list.
    const onPaneHandleKeyDown = useCallback(
      (event: ReactKeyboardEvent<HTMLDivElement>): void => {
        if (event.nativeEvent.isComposing) return;
        const action = paneResizeKeyAction(
          event.key,
          event.altKey || event.ctrlKey || event.metaKey || event.shiftKey,
        );
        if (action === null) return;
        event.preventDefault();
        event.stopPropagation();
        if (action.kind === "reset") {
          resetPaneWidth();
          return;
        }
        if (action.kind === "min" || action.kind === "max") {
          const bound = action.kind === "min" ? LEFT_COLUMN_MIN_WIDTH : LEFT_COLUMN_MAX_WIDTH;
          setLeftWidth(saveLeftColumnWidth(paneStorage, bound));
          return;
        }
        const pane = handleRef.current?.previousElementSibling;
        const current =
          pane instanceof HTMLElement ? pane.getBoundingClientRect().width : (leftWidth ?? LEFT_COLUMN_MIN_WIDTH);
        setLeftWidth(saveLeftColumnWidth(paneStorage, current + action.delta));
      },
      [paneStorage, resetPaneWidth, leftWidth],
    );

    /** Measure the column the row separator divides; 0 when it is not laid out. */
    const measureColumn = useCallback((): number => {
      const column = rowHandleRef.current?.parentElement;
      return column instanceof HTMLElement ? column.getBoundingClientRect().height : 0;
    }, []);

    /**
     * The column height to reason about: its rendered box, or a plausible one
     * when nothing was laid out (a hidden mount, jsdom). The clamps need a
     * height, and refusing to nudge because the box measures zero would make
     * the keyboard silently dead rather than merely approximate.
     */
    const columnHeight = useCallback((): number => measureColumn() || FALLBACK_COLUMN_HEIGHT, [measureColumn]);

    /** The detail pane's height right now, measured rather than assumed. */
    const currentDetailHeight = useCallback((): number => {
      const height = columnHeight();
      const stored = detailHeight === null ? DEFAULT_DETAIL_PERCENT : detailHeight;
      return clampDetailPixels(pixelsFromPercent(stored, height), height);
    }, [columnHeight, detailHeight]);

    // The row divider between history and detail. Height is the axis here, so
    // the drag reads clientY and the pane above the handle is the baseline: a
    // downward move shrinks the detail pane sitting under the handle.
    const beginRowDrag = useCallback(
      (event: ReactPointerEvent<HTMLDivElement>): void => {
        if (event.button !== 0 || rowDragRef.current !== null) return;
        const column = rowHandleRef.current?.parentElement;
        if (!(column instanceof HTMLElement)) return;
        const detail = rowHandleRef.current?.nextElementSibling;
        if (!(detail instanceof HTMLElement)) return;
        try {
          event.currentTarget.setPointerCapture(event.pointerId);
        } catch {
          return; // Without capture a pointer leaving the window strands the drag.
        }
        rowDragRef.current = {
          pointerId: event.pointerId,
          startY: event.clientY,
          baseHeight: detail.getBoundingClientRect().height,
          // A column that measures zero has no shared axis to divide; the drag
          // then works against the same fallback the keyboard uses, so the
          // gesture stays proportional instead of pinning every share to 0.
          columnHeight: column.getBoundingClientRect().height || FALLBACK_COLUMN_HEIGHT,
          restHeight: detailHeight,
        };
        document.body.classList.add("gx-row-resizing");
      },
      [detailHeight],
    );

    const moveRowDrag = useCallback((event: ReactPointerEvent<HTMLDivElement>): void => {
      const drag = rowDragRef.current;
      if (drag === null || drag.pointerId !== event.pointerId) return;
      const height = clampDetailPixels(drag.baseHeight - (event.clientY - drag.startY), drag.columnHeight);
      setDetailHeight(percentFromPixels(height, drag.columnHeight));
    }, []);

    const endRowDrag = useCallback(
      (event: ReactPointerEvent<HTMLDivElement>): void => {
        const drag = rowDragRef.current;
        if (drag === null || drag.pointerId !== event.pointerId) return;
        rowDragRef.current = null;
        document.body.classList.remove("gx-row-resizing");
        try {
          event.currentTarget.releasePointerCapture(event.pointerId);
        } catch {
          // Capture is already gone; pointercancel beats this handler here.
        }
        const height = clampDetailPixels(drag.baseHeight - (event.clientY - drag.startY), drag.columnHeight);
        // A drag that lands back where it began expresses no new intent: the
        // transient percentages the moves pinned into state are undone and the
        // stylesheet default stays for the rest of the session.
        if (dragReturnedToBase(height, drag.baseHeight)) {
          setDetailHeight(drag.restHeight);
          return;
        }
        setDetailHeight(saveDetailHeight(paneStorage, percentFromPixels(height, drag.columnHeight)));
      },
      [paneStorage],
    );

    const resetDetailPane = useCallback((): void => {
      resetDetailHeight(paneStorage);
      setDetailHeight(null);
    }, [paneStorage]);

    // Keyboard parity for the row separator. The pane is stored as a share of
    // the column, so a nudge converts through the measured height, steps in
    // pixels and converts back; preventDefault keeps the arrows from scrolling
    // the list under the focus ring.
    const onRowHandleKeyDown = useCallback(
      (event: ReactKeyboardEvent<HTMLDivElement>): void => {
        if (event.nativeEvent.isComposing) return;
        const action = detailResizeKeyAction(
          event.key,
          event.altKey || event.ctrlKey || event.metaKey || event.shiftKey,
        );
        if (action === null) return;
        event.preventDefault();
        event.stopPropagation();
        if (action.kind === "reset") {
          resetDetailPane();
          return;
        }
        const height = columnHeight();
        if (action.kind === "min" || action.kind === "max") {
          // The bounds are the same pixel clamp the drag obeys, converted to
          // shares: a stored 6% would render at the pane's 180px floor, so
          // publishing the raw storage bound would promise a height the box
          // never takes.
          const target = action.kind === "min" ? clampDetailPixels(DETAIL_MIN_HEIGHT, height) : clampDetailPixels(height, height);
          setDetailHeight(saveDetailHeight(paneStorage, percentFromPixels(target, height)));
          return;
        }
        const next = clampDetailPixels(currentDetailHeight() + action.delta, height);
        setDetailHeight(saveDetailHeight(paneStorage, percentFromPixels(next, height)));
      },
      [columnHeight, currentDetailHeight, paneStorage, resetDetailPane],
    );

    // A drag that outlives this mount (view switched mid-gesture) must not
    // leave the document-level resizing class behind.
    useEffect(
      () => () => {
        if (dragRef.current !== null) document.body.classList.remove("gx-pane-resizing");
        if (rowDragRef.current !== null) document.body.classList.remove("gx-row-resizing");
      },
      [],
    );

    // The shell hands the selected-view opener to the entry. Binding it here is
    // what lets a jump from the changes pane land in fs-explorer for this very
    // session; the core's View More row binds the same capability elsewhere.
    useEffect(() => {
      if (sessionId === undefined || props.openView === undefined) return;
      const views = workbench.views;
      if (views?.bind === undefined) return;
      return views.bind(sessionId, props.openView);
    }, [sessionId, props.openView, workbench]);

    useEffect(() => {
      if (sessionId === undefined) {
        setLoad({ kind: "idle" });
        return;
      }
      if (remote === undefined) {
        setLoad({ kind: "no-service" });
        return;
      }
      let alive = true;
      setLoad({ kind: "loading" });
      setLoadError(undefined);
      // A refresh returns the list to the snapshot's page, so any search the
      // reader had typed is dropped with it: leaving the box filled while the
      // rows underneath are unfiltered would describe a list that is not there.
      queryToken.current += 1;
      loadedQuery.current = "";
      setSearch("");
      setSearching(false);
      Promise.resolve()
        .then(() => remote.snapshot({ sessionId }))
        .then(transport => {
          if (!alive) return;
          const unwrapped = unwrapTransport<GitSnapshotResult>(transport);
          if (!unwrapped.ok) {
            setLoad({ kind: "failed", message: unwrapped.message });
            return;
          }
          const result = unwrapped.result;
          if (!result.ok) {
            setLoad({ kind: "failed", message: result.error.message === "" ? result.error.code : result.error.message });
            return;
          }
          const snapshot = result.snapshot;
          setLoad({ kind: "ready", snapshot });
          setCommits(snapshot.commits);
          setHasMore(snapshot.commits.length < snapshot.counts.commits);
          // Read the parked focus at resolution time: a request consumed after
          // this effect ran (or while the request was in flight) is honoured by
          // this page instead of being reset to the newest commit.
          const focusHash = pendingFocus.current;
          pendingFocus.current = undefined;
          setSelected(previous => {
            if (focusHash !== undefined) return focusHash;
            // The sentinel names the working tree, which this snapshot may have
            // just found clean. It cannot survive that: the row it pointed at is
            // gone, so the detail column falls back to a commit instead of
            // summarising an empty tree. The test is the same one the row is
            // built from, so the two cannot disagree about whether it exists.
            const dirty = groupChanges(snapshot.status).length > 0;
            if (previous === UNCOMMITTED) return dirty ? previous : snapshot.commits[0]?.hash;
            return previous !== undefined && snapshot.commits.some(commit => commit.hash === previous)
              ? previous
              : snapshot.commits[0]?.hash;
          });
        })
        .catch((error: unknown) => {
          if (alive) setLoad({ kind: "failed", message: describeFailure(error) });
        });
      return () => {
        alive = false;
      };
    }, [sessionId, remote, reloadToken]);

    // The command panel jumps with `commit:<hash>`: consume the shell's request
    // once and select the commit. The host clears its request only after the
    // callback, so a focus this view cannot parse still completes the hand-over.
    useEffect(() => {
      const request = props.viewRequest;
      if (request === null || request === undefined || request.view !== VIEW_ID) return;
      const key = `${request.view}:${request.focus}`;
      if (handledRequest.current === key) return;
      handledRequest.current = key;
      consumeCommitFocus(request.focus, {
        select: selectFromFocus,
        complete: () => props.completeViewRequest?.(),
      });
    }, [props.viewRequest, props.completeViewRequest, selectFromFocus]);

    // A caller that cannot hand the host's focus to this view (the command
    // panel when the tab is already on screen) leaves one in the core's queue
    // instead: take whatever is waiting at mount and keep listening while it
    // stays up, so a lazy mount never loses the target.
    useEffect(() => {
      const queue = workbench.viewFocus;
      if (queue === undefined || sessionId === undefined) return undefined;
      const consume = (): void => {
        const focus = queue.take(VIEW_ID);
        if (focus === undefined) return;
        consumeCommitFocus(focus, { select: selectFromFocus });
      };
      consume();
      return queue.subscribe(consume);
    }, [workbench, sessionId, selectFromFocus]);

    const graph = useMemo<readonly GraphRow[]>(() => layoutGraph(commits), [commits]);

    const snapshot = load.kind === "ready" ? load.snapshot : undefined;
    const groups = useMemo(() => (snapshot === undefined ? [] : groupChanges(snapshot.status)), [snapshot]);
    const stats = useMemo(() => {
      const map = new Map<string, { additions: number | null; deletions: number | null }>();
      for (const stat of snapshot?.stats ?? []) map.set(stat.path, { additions: stat.additions, deletions: stat.deletions });
      return map;
    }, [snapshot]);
    const refsByHash = useMemo(() => {
      const map = new Map<string, GitCommitNode["refs"][number][]>();
      for (const branch of snapshot?.branches ?? []) {
        const list = map.get(branch.hash);
        if (list === undefined) map.set(branch.hash, [{ kind: branch.kind, name: branch.name, head: branch.head }]);
        else list.push({ kind: branch.kind, name: branch.name, head: branch.head });
      }
      return map;
    }, [snapshot]);

    // The history search swaps the list's source: one host query with `--grep`,
    // replacing both rows and graph, so lanes are laid out from the filtered page
    // exactly as they are from the snapshot page. Clearing the box restores the
    // snapshot page the view already holds, which is why that page is kept: going
    // back to the repository for it would re-fetch a page this view already paid
    // for, and would come back thinner (one page) than what was on screen before
    // the search started.
    useEffect(() => {
      if (sessionId === undefined || remote === undefined) return;
      if (load.kind !== "ready") return;
      const query = search.trim();
      if (query === loadedQuery.current) return;
      const requested = sessionId;
      // Each keystroke supersedes the previous one, so the token is bumped at
      // once; the query itself waits out the typing because every search is a
      // `git log` process, and typing a phrase would otherwise spawn one per
      // letter.
      const token = queryToken.current + 1;
      queryToken.current = token;
      setLoadError(undefined);
      setLoadingMore(false);
      // Clearing the box is not a query: the page the view already holds *is*
      // the snapshot list, so restoring it is a state change rather than a round
      // trip that would come back with one page instead of what was there before
      // the search started.
      if (query === "") {
        loadedQuery.current = "";
        setSearching(false);
        const first = load.snapshot.commits;
        setCommits(first);
        setHasMore(first.length < load.snapshot.counts.commits);
        setSelected(previous => {
          if (previous === UNCOMMITTED) return previous;
          return previous !== undefined && first.some(commit => commit.hash === previous) ? previous : first[0]?.hash;
        });
        return;
      }
      setSearching(true);
      const timer = setTimeout(() => {
        loadedQuery.current = query;
        Promise.resolve()
          .then(() => remote.query(pageQuery(sessionId, query, 0)))
          .then(transport => {
            // A newer query (or a session switch) owns the list by now; letting
            // this page land would replace newer results with older ones.
            if (queryToken.current !== token || sessionRef.current !== requested) return;
            const unwrapped = unwrapTransport<GitQueryResult>(transport);
            if (!unwrapped.ok) {
              setLoadError(unwrapped.message);
              return;
            }
            const result = unwrapped.result;
            if (!result.ok) {
              setLoadError(result.error.message === "" ? result.error.code : result.error.message);
              return;
            }
            const page = result.page;
            const refs = refsByHash;
            setCommits(page.commits.map(commit => ({ ...commit, refs: refs.get(commit.hash) ?? [] })));
            setHasMore(page.hasMore);
            setSelected(previous => {
              if (previous === UNCOMMITTED) return previous;
              if (previous !== undefined && page.commits.some(commit => commit.hash === previous)) return previous;
              return page.commits[0]?.hash;
            });
          })
          .catch((error: unknown) => {
            if (queryToken.current === token) setLoadError(describeFailure(error));
          })
          .finally(() => {
            if (queryToken.current === token) setSearching(false);
          });
      }, SEARCH_DEBOUNCE_MS);
      return () => {
        clearTimeout(timer);
      };
    }, [search, sessionId, remote, load.kind, refsByHash]);

    const loadMore = useCallback((): void => {
      if (sessionId === undefined || remote === undefined || !hasMore || loadingMore) return;
      const requested = sessionId;
      // The page being extended is the one on screen, so it repeats the query
      // that produced it. Reading the input box here instead would append
      // unfiltered commits under a filtered list whenever the reader edits the
      // box while a page is loading.
      const query = loadedQuery.current;
      const token = queryToken.current;
      setLoadingMore(true);
      setLoadError(undefined);
      Promise.resolve()
        .then(() => remote.query(pageQuery(sessionId, query, commits.length)))
        .then(transport => {
          // The user may have switched conversations while this page was in
          // flight; appending it would mix two repositories in one list. A new
          // search is the same kind of replacement: its page starts over.
          if (sessionRef.current !== requested || queryToken.current !== token) return;
          const unwrapped = unwrapTransport<GitQueryResult>(transport);
          if (!unwrapped.ok) {
            setLoadError(unwrapped.message);
            return;
          }
          const result = unwrapped.result;
          if (!result.ok) {
            setLoadError(result.error.message === "" ? result.error.code : result.error.message);
            return;
          }
          const page = result.page;
          setCommits(previous => {
            const known = new Set(previous.map(commit => commit.hash));
            const appended = page.commits
              .filter(commit => !known.has(commit.hash))
              .map(commit => ({ ...commit, refs: refsByHash.get(commit.hash) ?? [] }));
            return appended.length === 0 ? previous : [...previous, ...appended];
          });
          setHasMore(page.hasMore);
        })
        .catch((error: unknown) => setLoadError(describeFailure(error)))
        .finally(() => setLoadingMore(false));
    }, [sessionId, remote, hasMore, loadingMore, commits.length, refsByHash]);

    const jump = useMemo(() => {
      const views: ViewSeamFace = workbench.views ?? {
        open: (id: string, focus?: string) => workbench.openView?.(id, focus) ?? false,
      };
      return createJump({ views, sessionId: sessionId ?? "" });
    }, [workbench, sessionId]);

    const onOpenFile = (path: string, line = 1): void => {
      if (sessionId !== undefined) jump(path, line);
    };

    const commitJump = useMemo(() => {
      const seam: CommitJumpSeam = {
        ...(workbench.views === undefined ? {} : { views: workbench.views }),
        ...(workbench.openView === undefined ? {} : { openView: workbench.openView }),
        ...(workbench.viewFocus === undefined ? {} : { viewFocus: workbench.viewFocus }),
        ...(workbench.openViewOrSwitch === undefined
          ? {}
          : {
              openViewOrSwitch: (id: string, focus?: string) =>
                workbench.openViewOrSwitch?.(id, focus) ?? { opened: false, focused: false },
            }),
      };
      return createCommitJump({ seam, sessionId: sessionId ?? "" });
    }, [workbench, sessionId]);

    const onOpenCommitFile = (path: string, line = 1): void => {
      if (sessionId !== undefined && selected !== undefined) commitJump(selected, path, line);
    };

    /**
     * Open the PR view on `this commit...HEAD`.
     *
     * The request goes into the core's queue before the switch, because the PR
     * view may not be mounted yet. A switch that delivered the focus directly
     * takes the request back out; the tab fallback leaves it for the target to
     * take. Undefined when the core cannot switch views at all, and the button
     * is then not drawn.
     */
    const onCompareToHead = useMemo((): ((hash: string) => void) | undefined => {
      const canSwitch =
        workbench.openViewOrSwitch !== undefined ||
        workbench.openView !== undefined ||
        workbench.views !== undefined;
      if (!canSwitch) return undefined;
      const seam: CommitJumpSeam = {
        ...(workbench.views === undefined ? {} : { views: workbench.views }),
        ...(workbench.openView === undefined ? {} : { openView: workbench.openView }),
        ...(workbench.openViewOrSwitch === undefined ? {} : { openViewOrSwitch: workbench.openViewOrSwitch }),
        ...(workbench.viewFocus === undefined ? {} : { viewFocus: workbench.viewFocus }),
      };
      const jump = createCommitJump({ seam, sessionId: sessionId ?? "" });
      return (hash: string): void => {
        const clean = hash.trim().toLowerCase();
        if (clean === "") return;
        // `HEAD` is the head end: the reader is asking what this commit adds on
        // top of the branch tip, which is the range a pull request would show.
        jump(clean, "HEAD");
      };
    }, [workbench, sessionId]);

    // One reference write: the span comes from the composer's own capture, the
    // chip from the session facade, and plain text is the last resort. The
    // facade is resolved per click rather than per mount because it throws once
    // the session's generation is released, and a stale closure would keep
    // throwing at a composer that no longer exists.
    const onReference = (payload: CommitReferencePayload): ReferenceInsertionResult => {
      const actions = props.inputActions;
      if (sessionId === undefined || actions === undefined) return "failed";
      const facade = resolveReference?.(sessionId);
      const result = insertCommitReference(
        {
          captureSpan: () => {
            const span = actions.captureInsertion?.();
            return span === undefined ? undefined : { start: span.start, end: span.end, draftRev: span.draftRev };
          },
          insertReference: (insert, span) => facade?.insertReference?.(insert, span) ?? false,
          insertText: (text, span) => actions.insertText?.(text, span) ?? false,
          // Read per write: the source can be disposed between the render that
          // enabled the button and this click.
          canInsertReference: referenceSourceAvailable?.() === true,
        },
        payload,
      );
      if (result !== "failed") facade?.focus?.();
      else facade?.notify?.("error", t("reference.failed"));
      return result;
    };

    const refresh = useCallback((): void => setReloadToken(token => token + 1), []);
    const retry = (): void => setReloadToken(token => token + 1);

    // A switch made in the header moves HEAD, the refs on the first history row
    // and the working tree; bumping the token is enough because the snapshot
    // effect above already owns the request and would otherwise double-fetch.
    useEffect(() => watchBranchRevision(branchStore, refresh), [branchStore, refresh]);

    const head = snapshot?.head;
    const changedCount = groups.reduce((sum, group) => sum + group.files.length, 0);
    // The working tree as the history list and the detail column both need it:
    // the list draws it as a row, the column summarises it when selected. Built
    // once so the two cannot disagree about the file count.
    const workingTree = useMemo(
      () => (changedCount === 0 ? undefined : { groups, stats, fileCount: changedCount }),
      [changedCount, groups, stats],
    );

    // The refs a commit carries are only on the history row, not on the detail
    // payload, so the reference reads them from the loaded page. A commit
    // selected through a jump may sit outside that page: the reference then
    // simply has no refs, which the payload spells by leaving the segment out.
    const selectedRefs = useMemo(() => {
      if (selected === undefined) return undefined;
      const row = commits.find(commit => commit.hash === selected);
      return row === undefined ? undefined : row.refs.map(ref => ref.name);
    }, [commits, selected]);

    return (
      <section
        className="gx-root"
        data-workbench-view="git-explorer"
        data-core-version={version}
        data-conversation-composer-overlay
        data-state={load.kind}
        data-session={sessionId ?? ""}
        data-testid="git-explorer-view"
      >
        <header className="gx-head">
          <div className="gx-head-main">
            <span className="gx-head-icon" aria-hidden="true">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4">
                <circle cx="4.5" cy="3.5" r="1.7" />
                <circle cx="4.5" cy="12.5" r="1.7" />
                <circle cx="11.5" cy="7" r="1.7" />
                <path d="M4.5 5.2v5.6M6.2 3.9h2.3a3 3 0 0 1 3 3v.1" strokeLinecap="round" />
              </svg>
            </span>
            {snapshot === undefined ? (
              <span className="gx-repo" title={t("view.title")}>
                {t("view.title")}
              </span>
            ) : WorkspaceMenu === undefined ? (
              <span className="gx-repo" title={snapshot.root}>
                {repoLabel(snapshot.root)}
              </span>
            ) : (
              <WorkspaceMenu root={snapshot.root} />
            )}
            {head?.branch === null || head?.branch === undefined ? null : <span className="gx-branch">{head.branch}</span>}
            {head?.detached === true ? <span className="gx-chip">{t("head.detached")}</span> : null}
            {head?.ahead !== undefined && head.ahead > 0 ? <span className="gx-chip">{`${t("head.ahead")} ${String(head.ahead)}`}</span> : null}
            {head?.behind !== undefined && head.behind > 0 ? <span className="gx-chip">{`${t("head.behind")} ${String(head.behind)}`}</span> : null}
          </div>
          <div className="gx-head-meta" style={statsStyle}>
            {snapshot === undefined ? null : (
              <>
                <span>
                  {t("head.changes")} <b>{changedCount}</b>
                </span>
                <span>
                  {t("head.commits")} <b>{snapshot.counts.commits}</b>
                </span>
                <span>
                  {t("head.branches")} <b>{snapshot.counts.branches}</b>
                </span>
              </>
            )}
            <button
              type="button"
              className="gx-btn"
              title={t("head.refresh")}
              aria-label={t("head.refresh")}
              disabled={load.kind === "loading"}
              onClick={refresh}
            >
              ↻
            </button>
          </div>
        </header>

        {sessionId === undefined ? (
          <StateBlock title={t("state.noSession.title")} description={t("state.noSession.description")} />
        ) : load.kind === "no-service" ? (
          <StateBlock title={t("state.noService.title")} description={t("state.noService.description")} />
        ) : load.kind === "loading" ? (
          <div className="gx-skeleton" data-testid="git-loading">
            {t("state.loading")}
          </div>
        ) : load.kind === "failed" ? (
          <StateBlock title={t("state.failed.title")} description={load.message} actionLabel={t("action.retry")} onAction={refresh} />
        ) : load.kind === "ready" && !load.snapshot.isRepository ? (
          <StateBlock
            title={t("state.notRepository.title")}
            description={t("state.notRepository.description")}
            actionLabel={t("action.retry")}
            onAction={refresh}
          />
        ) : load.kind === "ready" ? (
          <div
            className="gx-body"
            style={leftWidth === null ? undefined : ({ "--gx-left-col": `${leftWidth}px` } as CSSProperties)}
          >
            <ChangesPane
              groups={groups}
              stats={stats}
              t={t}
              onOpen={onOpenFile}
              claimFocus={claimFocus}
              onFocusClaimed={releaseFocusClaim}
            />
            <div
              ref={handleRef}
              className="gx-pane-handle"
              role="separator"
              aria-orientation="vertical"
              aria-label={t("pane.resize")}
              aria-valuemin={LEFT_COLUMN_MIN_WIDTH}
              aria-valuemax={LEFT_COLUMN_MAX_WIDTH}
              aria-valuenow={leftWidth ?? undefined}
              title={t("pane.resizeHint")}
              tabIndex={0}
              data-testid="gx-pane-handle"
              onPointerDown={beginPaneDrag}
              onPointerMove={movePaneDrag}
              onPointerUp={endPaneDrag}
              onPointerCancel={endPaneDrag}
              onLostPointerCapture={endPaneDrag}
              onKeyDown={onPaneHandleKeyDown}
              onDoubleClick={resetPaneWidth}
            />
            <div
              className="gx-col"
              style={
                detailHeight === null
                  ? undefined
                  : ({ "--gx-detail-h": `${String(detailHeight)}%` } as CSSProperties)
              }
            >
              <HistoryPane
                commits={commits}
                graph={graph}
                selectedHash={selected}
                headHash={load.snapshot.head?.hash ?? null}
                total={load.snapshot.counts.commits}
                hasMore={hasMore}
                loadingMore={loadingMore}
                loadError={loadError}
                searching={searching}
                search={search}
                t={t}
                onSelect={setSelected}
                onLoadMore={loadMore}
                onSearch={setSearch}
                workingTree={workingTree}
                onSelectUncommitted={() => setSelected(UNCOMMITTED)}
                {...(load.snapshot.counts.commits === 0
                  ? {
                      emptyTitle: t("state.emptyRepository.title"),
                      emptyDescription: t("state.emptyRepository.description"),
                      onRetry: refresh,
                      retryLabel: t("action.retry"),
                    }
                  : {})}
              />
              <div
                ref={rowHandleRef}
                className="gx-row-handle"
                role="separator"
                aria-orientation="horizontal"
                aria-label={t("detail.resize")}
                aria-valuemin={DETAIL_MIN_PERCENT}
                aria-valuemax={DETAIL_MAX_PERCENT}
                aria-valuenow={detailHeight ?? undefined}
                title={t("detail.resizeHint")}
                tabIndex={0}
                data-testid="gx-row-handle"
                onPointerDown={beginRowDrag}
                onPointerMove={moveRowDrag}
                onPointerUp={endRowDrag}
                onPointerCancel={endRowDrag}
                onLostPointerCapture={endRowDrag}
                onKeyDown={onRowHandleKeyDown}
                onDoubleClick={resetDetailPane}
              />
              {selected === UNCOMMITTED && workingTree !== undefined ? (
                <WorkingTreePane groups={workingTree.groups} stats={workingTree.stats} t={t} onOpen={onOpenFile} />
              ) : (
                <DetailPane
                  sessionId={sessionId}
                  hash={selected}
                  remote={remote}
                  t={t}
                  onSelect={setSelected}
                  onOpenFile={onOpenCommitFile}
                  {...(onCompareToHead === undefined ? {} : { onCompareToHead })}
                  refs={selectedRefs}
                  {...(props.inputActions === undefined ? {} : { inputActions: props.inputActions })}
                  {...(phase === undefined ? {} : { phase })}
                  sourceAvailable={referenceSourceAvailable?.() === true}
                  onReference={onReference}
                />
              )}
            </div>
          </div>
        ) : null}
      </section>
    );
  }

  return GitExplorerView;
}
