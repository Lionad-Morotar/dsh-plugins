/**
 * The file workbench's conversation view.
 *
 * One full-height tree over the host's `workspaceFiles.list`. The view owns the
 * lazy level ledger, the expansion set, selection and the active-panel reveal
 * that keeps the tree aligned with the open file; sorting, flattening and the
 * virtual window stay pure in `model.ts`. Every host seam is optional at read
 * time, so a deployment without the file service renders an explicit empty
 * state instead of throwing inside the conversation shell.
 */
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";

import type { Translate } from "./copy.ts";
import { KEYMAP, createEscapeHandler, hasOpenModal, isEditableTarget, matchesKeymap } from "./keyboard.ts";
import type { DocumentStore } from "./document-session.ts";
import type { SymlinkLocator } from "./preview.ts";
import {
  ancestorChain,
  buildTree,
  describeListing,
  entryIntent,
  flattenTree,
  isAbsolutePath,
  listingPath,
  type TreeLevel,
} from "./model.ts";
import {
  TREE_PANE_MAX_WIDTH,
  TREE_PANE_MIN_WIDTH,
  clampTreePaneWidth,
  dragReturnedToBase,
  paneResizeKeyAction,
  readTreePaneWidth,
  resetTreePaneWidth,
  saveTreePaneWidth,
  type PaneWidthStorage,
} from "./pane-width.ts";
import { CloseConfirm, PanelEmpty, PanelTabs } from "./panel-tabs.tsx";
import { consumeViewRequest, createPanelStackRegistry, panelTitle } from "./panels.ts";
import { headLabel, joinChangeStats, parseStatusZ, type FsGitHead, type StatusMap } from "./status.ts";
import { PreviewPane, saveFailureReason } from "./preview-pane.tsx";
import type { RendererRegistry } from "./renderer-registry.ts";
import { CollapseIcon, FolderIcon, RefreshIcon, TreeBody, type TreeEntryFocus } from "./tree.tsx";
import { buildWorkspaceMap, MANIFEST_FILES, type WorkspaceTag } from "./workspace-map.ts";
import {
  describeFailure,
  normalizeListing,
  normalizeStatusSnapshot,
  type FilesResolver,
  type GitShowFace,
  type GitShowResolver,
  type StatusResolver,
  type WorkspaceFilesFace,
} from "./wire.ts";
import { VIEW_ID } from "../shared.ts";

/** The pending-focus queue the core carries, as this view consumes it. */
export interface ViewFocusFace {
  take(view: string): string | undefined;
  /** Replace the pending request; the bridge and the command palette leave one here. */
  request?(view: string, focus: string): void;
  subscribe(listener: () => void): () => void;
}

/** The slice of the workbench core service this view reads. */
export interface WorkbenchFace {
  readonly version: number;
  currentSessionId(): string | undefined;
  /** Switch to a view and deliver `focus` when the host's seam allows it. */
  openViewOrSwitch(id: string, focus?: string): { readonly opened: boolean; readonly focused: boolean };
  /** The older seam, kept because a host may expose only this one. */
  openView?(id: string, focus?: string): boolean;
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
  readonly viewRequest?: ViewRequestLike | null;
  readonly completeViewRequest?: () => void;
}

/** What one view mount closes over. */
export interface ViewWiring {
  readonly workbench: WorkbenchFace;
  readonly version: number;
  readonly t: Translate;
  readonly files: FilesResolver;
  /** Resolves the Git namespace whose snapshot carries the raw status text. */
  readonly status: StatusResolver;
  /** Resolves the Git `show` reader used by commit-version panels. */
  readonly git?: GitShowResolver;
  /** The renderer registry the client service exposes; absent mounts the built-ins alone. */
  readonly renderers?: RendererRegistry;
  /** The shared drafts; absent hides the save affordance and the close confirmation. */
  readonly documents?: DocumentStore;
  /**
   * Follow a symbolic link the workspace service refused.
   *
   * Absent leaves the refusal visible, which is what a host without the locator
   * can do and nothing more.
   */
  readonly locate?: (sessionId: string) => SymlinkLocator;
}

/** The first-paint state without waiting for an effect. */
export type InitialViewState = "idle" | "no-service" | "loading";

/**
 * Decide the first-paint state from the session and the service probe.
 * @param sessionId - the session the view is bound to.
 * @param hasFiles - whether the workspace file face resolved.
 * @returns idle without a session, no-service without the face, else loading.
 */
export function initialViewState(sessionId: string | undefined, hasFiles: boolean): InitialViewState {
  if (sessionId === undefined) return "idle";
  return hasFiles ? "loading" : "no-service";
}

const loadingLevel = (): TreeLevel => ({ status: "loading", nodes: [], truncated: false, total: 0 });

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

// Below the 760px breakpoint the stylesheet stacks the two panes and hides the
// handle; this check keeps the drag hook inert there too, not just unreachable.
// The query must stay in sync with the media query in styles.ts.
const stackedLayout = (): boolean =>
  typeof window === "undefined" || window.matchMedia("(max-width: 760px)").matches;

/** The identity map's empty singleton, so a reset never re-renders the tree. */
const EMPTY_TAGS: ReadonlyMap<string, WorkspaceTag> = new Map();

/**
 * Fold one `read` answer down to its text.
 *
 * The generated Remote wraps the page in `{ok, value}`; a direct service
 * answers the page itself. Every other shape — a refusal envelope, a page
 * without `text` — reads as absent, because identity badges are an
 * enhancement and never an error surface.
 * @param response - whatever `workspaceFiles.read` resolved to.
 * @returns the text, or undefined when the answer carries none.
 */
function readText(response: unknown): string | undefined {
  if (response === null || typeof response !== "object") return undefined;
  const record = response as { readonly ok?: unknown; readonly value?: unknown };
  if (record.ok === false) return undefined;
  const page = record.ok === true ? record.value : response;
  if (page === null || typeof page !== "object") return undefined;
  const text = (page as { readonly text?: unknown }).text;
  return typeof text === "string" ? text : undefined;
}

function StateBlock({
  title,
  description,
  actionLabel,
  onAction,
  testId,
}: {
  readonly title: string;
  readonly description?: string;
  readonly actionLabel?: string;
  readonly onAction?: () => void;
  readonly testId?: string;
}) {
  return (
    <div className="fx-empty" role="note" data-testid={testId ?? "fs-state"}>
      <strong>{title}</strong>
      {description === undefined ? null : <span>{description}</span>}
      {actionLabel === undefined || onAction === undefined ? null : (
        <button type="button" className="fx-btn" onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  );
}

/** The keyboard fields the save chord reads; a real event satisfies all of them. */
export interface SaveChordLike {
  readonly code?: string;
  readonly metaKey?: boolean;
  readonly ctrlKey?: boolean;
  readonly altKey?: boolean;
  readonly shiftKey?: boolean;
  readonly isComposing?: boolean;
}

/**
 * Whether one event is the save chord (⌘S on macOS, Ctrl+S elsewhere).
 *
 * It is deliberately outside {@link KEYMAP}: the panel chords are offered to the
 * host's shortcut settings, while save belongs to the document and must not be
 * remappable to a combination the editor also owns.
 * @param event - the keyboard event, or a test double.
 * @returns true for the exact chord with no extra modifier held.
 */
export function isSaveChord(event: SaveChordLike): boolean {
  if (event.isComposing === true) return false;
  if (event.code !== "KeyS") return false;
  const primary = event.metaKey === true || event.ctrlKey === true;
  return primary && event.altKey !== true && event.shiftKey !== true;
}

/**
 * Build the view component for one mount.
 * @param wiring - the core service, contract version, copy and file resolver.
 * @returns the component registered into `conversation.view`.
 */
export function createFsExplorerView({
  workbench,
  version,
  t,
  files: resolveFiles,
  status: resolveStatus,
  git: resolveGit = () => undefined,
  renderers,
  documents,
  locate,
}: ViewWiring) {
  // One registry per registered view: the host mounts and unmounts this
  // component on every view switch, while the factory itself lives on.
  const stacks = createPanelStackRegistry();

  function FsExplorerView(props: ConversationViewProps) {
    const sessionId = props.sessionId ?? workbench.currentSessionId();
    const sessionRef = useRef(sessionId);
    sessionRef.current = sessionId;

    // Resolve once per mount: the host service is stable, and a fresh face
    // identity on every render would restart the root listing.
    const files = useMemo<WorkspaceFilesFace | undefined>(() => resolveFiles(), [resolveFiles]);
    const statusFace = useMemo(() => resolveStatus(), [resolveStatus]);
    const gitFace = useMemo<GitShowFace | undefined>(() => resolveGit(), [resolveGit]);

    const [levels, setLevels] = useState<ReadonlyMap<string, TreeLevel>>(() => new Map());
    const [statuses, setStatuses] = useState<StatusMap | undefined>(undefined);
    const [head, setHead] = useState<FsGitHead | undefined>(undefined);
    const [gitRoot, setGitRoot] = useState<string | undefined>(undefined);
    const [workspaceTags, setWorkspaceTags] = useState<ReadonlyMap<string, WorkspaceTag>>(EMPTY_TAGS);
    const levelsRef = useRef(levels);
    levelsRef.current = levels;
    const [expanded, setExpanded] = useState<ReadonlySet<string>>(() => new Set());
    const stack = useMemo(() => stacks.forSession(sessionId), [stacks, sessionId]);
    const panels = useSyncExternalStore(stack.subscribe, stack.snapshot, stack.snapshot);
    const activeEntry = panels.panels.find(panel => panel.key === panels.active);
    const activePath = activeEntry?.path;
    const activeRevision = activeEntry?.revision;
    const [reloadToken, setReloadToken] = useState(0);
    const controllers = useRef<Map<string, AbortController>>(new Map());
    const handledRequest = useRef<string | undefined>(undefined);

    // Closing a dirty panel is a question, not a gesture: the bar keeps the
    // panel path so every answer still addresses the tab the reader asked to
    // drop, even if another tab became active meanwhile.
    const [pendingClose, setPendingClose] = useState<{ readonly path: string } | null>(null);
    const [closeSaving, setCloseSaving] = useState(false);
    const [closeError, setCloseError] = useState<string | null>(null);
    // The Escape handler is registered once; the flag tells it a bar is open.
    const pendingCloseRef = useRef<string | null>(null);
    pendingCloseRef.current = pendingClose?.path ?? null;

    // The tree column's width: null keeps the stylesheet's fluid clamp, a
    // pixel count from a past drag pins it. Moves only touch state; the store
    // is written once at drag rest.
    const paneStorage = useMemo(() => paneWidthStorage(), []);
    const [treeWidth, setTreeWidth] = useState<number | null>(() => readTreePaneWidth(paneStorage));
    const handleRef = useRef<HTMLDivElement | null>(null);
    // `restWidth` is the width state at drag start: what a drag that lands
    // back where it began must restore, so a persisted pixel count survives
    // its own no-op drag and an unpinned session stays fluid.
    const dragRef = useRef<{ pointerId: number; startX: number; baseWidth: number; restWidth: number | null } | null>(
      null,
    );

    const rootLevel = levels.get("");
    const rootReady = rootLevel?.status === "ready";

    /**
     * Open one focus request's target.
     *
     * Opening only changes the stack's active panel; the reveal effect below
     * watches that change, so no reveal state needs to travel with the
     * request.
     */
    const openRequest = useCallback(
      (path: string, line: number, absolute: boolean, revision?: string): void => {
        stack.open(path, line, absolute, revision);
      },
      [stack],
    );

    /**
     * Close one panel, asking first when a draft would be lost.
     *
     * Every closing gesture — the tab button, Delete on the strip, Ctrl+W —
     * lands here, so the one place that knows what a dirty draft means also
     * decides when the bar has to appear.
     */
    const requestClose = useCallback(
      (path?: string): void => {
        const target = path ?? stack.snapshot().active ?? undefined;
        if (target === undefined) return;
        const draft = sessionId === undefined ? undefined : documents?.peek(sessionId, target);
        if (draft?.dirty === true) {
          setCloseError(null);
          setPendingClose({ path: target });
          return;
        }
        setPendingClose(null);
        setCloseError(null);
        // Nobody is holding the draft any more, and a closed panel must not
        // resurrect it on the next open of the same path.
        if (sessionId !== undefined) documents?.forget(sessionId, target);
        stack.close(target);
      },
      [documents, sessionId, stack],
    );

    /** Answer "save and close": the panel only leaves once the write landed. */
    const confirmSaveAndClose = useCallback((): void => {
      const target = pendingClose;
      if (target === null) return;
      const session = sessionId === undefined ? undefined : documents?.find(sessionId, target.path);
      if (session === undefined) {
        setPendingClose(null);
        if (sessionId !== undefined) documents?.forget(sessionId, target.path);
        stack.close(target.path);
        return;
      }
      setCloseSaving(true);
      setCloseError(null);
      void session.save().then(outcome => {
        setCloseSaving(false);
        if (!outcome.ok) {
          const failure = session.getSnapshot().error;
          setCloseError(
            t("panel.confirm.failed").replace(
              "{message}",
              saveFailureReason(outcome.code, failure?.message ?? "", t),
            ),
          );
          return;
        }
        setPendingClose(null);
        // The write landed, so the draft is the disk now; dropping the session
        // keeps a stale copy from shadowing the file the next time it opens.
        if (sessionId !== undefined) documents?.forget(sessionId, target.path);
        stack.close(target.path);
      });
    }, [documents, pendingClose, sessionId, stack, t]);

    const discardAndClose = useCallback((): void => {
      const target = pendingClose;
      setPendingClose(null);
      setCloseError(null);
      if (target === null) return;
      if (sessionId !== undefined) documents?.forget(sessionId, target.path);
      stack.close(target.path);
    }, [documents, pendingClose, sessionId, stack]);

    const cancelClose = useCallback((): void => {
      setPendingClose(null);
      setCloseError(null);
    }, []);

    /**
     * Read one directory level and write it into the ledger.
     *
     * A second request for the same path retires the first, whose settlement
     * then writes nothing. The session captured by the caller is compared with
     * the live one before any state is written, so a late response from a
     * previous conversation never leaks into this tree.
     */
    const loadLevel = useCallback(async (path: string, sid: string, face: WorkspaceFilesFace): Promise<boolean> => {
      controllers.current.get(path)?.abort();
      const controller = new AbortController();
      controllers.current.set(path, controller);
      setLevels(previous => new Map(previous).set(path, loadingLevel()));
      try {
        // The host refuses an empty path; `listingPath` maps the ledger's root
        // key to the `"."` the endpoint resolves against the workspace root.
        const response = await face.list(sid, listingPath(path), controller.signal);
        if (controller.signal.aborted || sessionRef.current !== sid) return false;
        const normalized = normalizeListing(response);
        if (!normalized.ok) {
          setLevels(previous =>
            new Map(previous).set(path, {
              status: "failed",
              nodes: [],
              truncated: false,
              total: 0,
              message: normalized.message,
            }),
          );
          return false;
        }
        const nodes = buildTree(normalized.listing.entries);
        setLevels(previous =>
          new Map(previous).set(path, {
            status: "ready",
            nodes,
            truncated: normalized.listing.truncated === true,
            total: normalized.listing.entries.length,
          }),
        );
        return true;
      } catch (error) {
        if (controller.signal.aborted) return false;
        setLevels(previous =>
          new Map(previous).set(path, {
            status: "failed",
            nodes: [],
            truncated: false,
            total: 0,
            message: describeFailure(error),
          }),
        );
        return false;
      } finally {
        if (controllers.current.get(path) === controller) controllers.current.delete(path);
      }
    }, []);

    // Reset every piece of session state and list the new root. A reload token
    // is the refresh gesture: it drops cached levels and starts from the root.
    useEffect(() => {
      for (const controller of controllers.current.values()) controller.abort();
      controllers.current.clear();
      setLevels(new Map());
      setExpanded(new Set());
      handledRequest.current = undefined;
      if (sessionId !== undefined && files !== undefined) void loadLevel("", sessionId, files);
      return () => {
        for (const controller of controllers.current.values()) controller.abort();
        controllers.current.clear();
      };
    }, [sessionId, files, reloadToken, loadLevel]);

    // Working-tree colours are an enhancement, never a failure: a missing Git
    // namespace, a plain directory or a broken snapshot all read as "no status"
    // and leave the tree fully usable. Only status text is requested, so the
    // snapshot is capped at one commit to keep the history read off the mount
    // path. The same response also carries the line counts and HEAD summary;
    // both are optional members, so a host that predates them decorates nothing.
    useEffect(() => {
      if (sessionId === undefined || statusFace === undefined) {
        setStatuses(undefined);
        setHead(undefined);
        setGitRoot(undefined);
        return;
      }
      let alive = true;
      const controller = new AbortController();
      setStatuses(undefined);
      setHead(undefined);
      setGitRoot(undefined);
      Promise.resolve()
        .then(() => statusFace.snapshot({ sessionId, maxCommits: 1 }, controller.signal))
        .then(response => {
          if (!alive) return;
          const normalized = normalizeStatusSnapshot(response);
          if (!normalized.ok) {
            setStatuses(undefined);
            setHead(undefined);
            setGitRoot(undefined);
            return;
          }
          setStatuses(joinChangeStats(parseStatusZ(normalized.status), normalized.stats));
          setHead(normalized.head);
          setGitRoot(normalized.root);
        })
        .catch(() => {
          if (alive) {
            setStatuses(undefined);
            setHead(undefined);
            setGitRoot(undefined);
          }
        });
      return () => {
        alive = false;
        controller.abort();
      };
    }, [sessionId, statusFace, reloadToken]);

    // Directory identity is an enhancement over the plain tree: an unreadable,
    // absent or unparseable manifest reads as "no badge" and never fails the
    // panel. The manifests are read once the root listing is known (the pattern
    // gate needs its directory names); `.gitmodules` joins by absolute path as
    // soon as the snapshot's repository root arrives, and a late root reruns
    // the whole computation under a fresh abort.
    useEffect(() => {
      const read = files?.read;
      if (sessionId === undefined || files === undefined || typeof read !== "function" || !rootReady) {
        setWorkspaceTags(EMPTY_TAGS);
        return;
      }
      const sid = sessionId;
      const controller = new AbortController();
      const readCandidate = async (key: string, path: string): Promise<[string, string] | undefined> => {
        try {
          const text = readText(await read.call(files, sid, path, {}, controller.signal));
          return text === undefined ? undefined : [key, text];
        } catch {
          // A refusal — absolute path rejected, session mismatched — is absent.
          return undefined;
        }
      };
      const reads = MANIFEST_FILES.filter(name => name !== ".gitmodules").map(name => readCandidate(name, name));
      if (gitRoot !== undefined) {
        reads.push(readCandidate(".gitmodules", `${gitRoot.replace(/\/+$/u, "")}/.gitmodules`));
      }
      void Promise.all(reads).then(results => {
        if (controller.signal.aborted || sessionRef.current !== sid) return;
        const texts = new Map<string, string>();
        for (const result of results) if (result !== undefined) texts.set(result[0], result[1]);
        const root = levelsRef.current.get("");
        const names = new Set(
          root?.status === "ready" ? root.nodes.filter(node => node.kind === "directory").map(node => node.name) : [],
        );
        setWorkspaceTags(buildWorkspaceMap(texts, names));
      });
      return () => controller.abort();
    }, [sessionId, files, rootReady, gitRoot, reloadToken]);

    // The Git panel jumps with `path:<workspace path>:<line>` and the address
    // bridge with `abs:<filesystem path>:<line>`; consume that request once,
    // open the panel, and remember a relative target until the root level can
    // expand its ancestors. The host clears its request only after this
    // callback, so a failed parse still completes the hand-over.
    useEffect(() => {
      const request = props.viewRequest;
      if (request === null || request === undefined || request.view !== VIEW_ID) return;
      const key = `${request.view}:${request.focus}`;
      if (handledRequest.current === key) return;
      handledRequest.current = key;
      consumeViewRequest(request.focus, { open: openRequest });
      props.completeViewRequest?.();
    }, [props.viewRequest, props.completeViewRequest, openRequest]);

    // A caller outside the View More menu cannot hand the host's focus to this
    // view, so it leaves one in the core's queue instead. Take whatever is
    // waiting now (this view mounted with a request) and keep listening while it
    // is on screen (the reader asked again with the view already up).
    useEffect(() => {
      const queue = workbench.viewFocus;
      if (queue === undefined || sessionId === undefined) return undefined;
      const consume = (): void => {
        const focus = queue.take(VIEW_ID);
        if (focus === undefined) return;
        consumeViewRequest(focus, { open: openRequest });
      };
      consume();
      return queue.subscribe(consume);
    }, [workbench, sessionId, openRequest]);

    // The active panel is the single source of reveal: every entry point — a
    // focus request, a tab click, the ⌘⌥ arrows, a close fallback or a remount
    // restore — lands on `panels.active`, and this effect aligns the tree with
    // it. Absolute paths sit outside the workspace, so they have no row to
    // align, and the tree keeps whatever state the reader left. A commit
    // version is deliberately skipped too: its row belongs to the working tree
    // and highlighting it would claim the old file is the one on disk.
    useEffect(() => {
      if (activePath === undefined || activeRevision !== undefined || !rootReady || isAbsolutePath(activePath)) return;
      const chain = ancestorChain(activePath);
      if (chain.length === 0) return;
      // The same reference on no change keeps a click on an already-visible row render-free.
      setExpanded(previous =>
        chain.every(directory => previous.has(directory)) ? previous : new Set([...previous, ...chain]),
      );
      if (sessionId === undefined || files === undefined) return;
      const missing = chain.filter(directory => levelsRef.current.get(directory)?.status !== "ready");
      if (missing.length === 0) return;
      void Promise.all(missing.map(directory => loadLevel(directory, sessionId, files)));
    }, [activePath, activeRevision, rootReady, sessionId, files, loadLevel]);

    /** Focus the host's conversation composer, the Esc destination. */
    const focusComposer = useCallback((): boolean => {
      if (typeof document === "undefined") return false;
      const input = document.querySelector<HTMLElement>("[data-composer-input]");
      if (input === null) return false;
      input.focus();
      return true;
    }, []);

    // The tree column's divider. The pane left of the handle is the baseline:
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
          restWidth: treeWidth,
        };
        document.body.classList.add("fx-pane-resizing");
      },
      [treeWidth],
    );

    const movePaneDrag = useCallback((event: ReactPointerEvent<HTMLDivElement>): void => {
      const drag = dragRef.current;
      if (drag === null || drag.pointerId !== event.pointerId) return;
      setTreeWidth(clampTreePaneWidth(drag.baseWidth + event.clientX - drag.startX));
    }, []);

    const endPaneDrag = useCallback(
      (event: ReactPointerEvent<HTMLDivElement>): void => {
        const drag = dragRef.current;
        if (drag === null || drag.pointerId !== event.pointerId) return;
        dragRef.current = null;
        document.body.classList.remove("fx-pane-resizing");
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
          setTreeWidth(drag.restWidth);
          return;
        }
        setTreeWidth(saveTreePaneWidth(paneStorage, width));
      },
      [paneStorage],
    );

    const resetPaneWidth = useCallback((): void => {
      resetTreePaneWidth(paneStorage);
      setTreeWidth(null);
    }, [paneStorage]);

    // Keyboard parity for the separator. A fluid pane has no number in
    // state, so a nudge measures the rendered box and steps from what is on
    // screen; preventDefault keeps the arrows from scrolling the tree.
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
          const bound = action.kind === "min" ? TREE_PANE_MIN_WIDTH : TREE_PANE_MAX_WIDTH;
          setTreeWidth(saveTreePaneWidth(paneStorage, bound));
          return;
        }
        const pane = handleRef.current?.previousElementSibling;
        const current =
          pane instanceof HTMLElement ? pane.getBoundingClientRect().width : (treeWidth ?? TREE_PANE_MIN_WIDTH);
        setTreeWidth(saveTreePaneWidth(paneStorage, current + action.delta));
      },
      [paneStorage, resetPaneWidth, treeWidth],
    );

    // A drag that outlives this mount (view switched mid-gesture) must not
    // leave the document-level resizing class behind.
    useEffect(
      () => () => {
        if (dragRef.current !== null) document.body.classList.remove("fx-pane-resizing");
      },
      [],
    );

    // Panel chords are captured before the conversation's own handlers: ⌘⌥↓
    // turns the editor column, not the transcript, and Ctrl+W must win over
    // the browser tab when a panel is open. Ctrl+W is still only a best-effort
    // on the web; the desktop shell owns the promised accelerator.
    useEffect(() => {
      if (typeof document === "undefined") return;
      const onKeyDown = (event: KeyboardEvent): void => {
        if (event.isComposing || isEditableTarget(event.target)) return;
        // The editor owns the chord while it has focus: its own keymap saves the
        // document it shows and prevents the default itself. Everywhere else in
        // the panel this handler answers, which is what keeps ⌘S away from the
        // host's save dialog while a draft is open.
        if (isSaveChord(event)) {
          const target = stack.snapshot().active;
          const session =
            target === null || documents === undefined || sessionId === undefined
              ? undefined
              : documents.find(sessionId, target);
          if (session === undefined) return;
          event.preventDefault();
          event.stopPropagation();
          void session.save();
          return;
        }
        for (const entry of KEYMAP) {
          if (!matchesKeymap(event, entry)) continue;
          if (entry.action === "closePanel" && stack.snapshot().active === null) return;
          event.preventDefault();
          event.stopPropagation();
          if (entry.action === "nextPanel") stack.next();
          else if (entry.action === "previousPanel") stack.previous();
          else requestClose();
          return;
        }
      };
      document.addEventListener("keydown", onKeyDown, true);
      return () => document.removeEventListener("keydown", onKeyDown, true);
    }, [documents, requestClose, sessionId, stack]);

    // Escape returns the caret to the composer unless a dialog is open. The
    // DOM probe is broader than a class check because the shell, the command
    // palette and the settings sheet all use different dialog markers.
    useEffect(() => {
      if (typeof document === "undefined") return;
      const handler = createEscapeHandler({
        focusComposer,
        hasModal: () => pendingCloseRef.current !== null || hasOpenModal(document),
      });
      const listener = (event: KeyboardEvent): void => handler(event);
      document.addEventListener("keydown", listener, true);
      return () => document.removeEventListener("keydown", listener, true);
    }, [focusComposer]);

    // Escape belongs to the bar while it is up: dismissing the question must
    // not double as "return to the composer" and drop the reader's context.
    useEffect(() => {
      if (pendingClose === null || typeof document === "undefined") return;
      const onKeyDown = (event: KeyboardEvent): void => {
        if (event.key !== "Escape" || event.isComposing) return;
        event.preventDefault();
        event.stopPropagation();
        cancelClose();
      };
      document.addEventListener("keydown", onKeyDown, true);
      return () => document.removeEventListener("keydown", onKeyDown, true);
    }, [pendingClose, cancelClose]);

    const rows = useMemo(
      () => flattenTree(levels, expanded, statuses, workspaceTags),
      [levels, expanded, statuses, workspaceTags],
    );

    // The arrival gesture. The stack outlives the mount, so a first arrival
    // with nothing open opens the workspace front page and hands the keyboard
    // to the tree, while a return visit only takes the second half of that.
    // One claim per mount: a listing refresh must not yank the cursor back.
    const [entryFocus, setEntryFocus] = useState<TreeEntryFocus | undefined>(undefined);
    const entryClaimed = useRef(false);
    useEffect(() => {
      if (entryClaimed.current || typeof document === "undefined") return;
      // Read the live stack, not this render's snapshot: a request handed to
      // the mount above (the Git panel, the address bridge, the focus queue)
      // has already published a panel by the time this effect runs, and that
      // target is what the reader asked to see, not the workspace front page.
      const intent = entryIntent({
        rows,
        panelCount: stack.snapshot().panels.length,
        hasModal: hasOpenModal(document),
      });
      // A skip leaves the claim unspent: the rows may simply not have listed
      // yet, and the effect runs again when they do.
      if (intent.kind === "skip") return;
      entryClaimed.current = true;
      if (intent.open !== undefined) stack.open(intent.open);
      setEntryFocus({ path: intent.focus });
    }, [rows, stack]);
    const releaseEntryFocus = useCallback((): void => setEntryFocus(undefined), []);
    const changeCount = statuses === undefined ? undefined : Object.keys(statuses).length;
    const summaryTone =
      statuses === undefined
        ? "neutral"
        : Object.values(statuses).some(marker => marker.status === "conflicted")
          ? "conflict"
          : changeCount === 0
            ? "success"
            : "warning";
    // The branch segment names HEAD when the snapshot folded one; without an
    // upstream the ahead/behind arrows have nothing to count against.
    const branchLabel = headLabel(head);

    const toggleDirectory = useCallback(
      (path: string): void => {
        if (sessionId === undefined || files === undefined) return;
        if (expanded.has(path)) {
          setExpanded(previous => {
            const next = new Set(previous);
            next.delete(path);
            return next;
          });
          return;
        }
        setExpanded(previous => new Set(previous).add(path));
        const level = levels.get(path);
        if (level === undefined || level.status === "failed") void loadLevel(path, sessionId, files);
      },
      [expanded, levels, sessionId, files, loadLevel],
    );

    const retryDirectory = useCallback(
      (path: string): void => {
        if (sessionId === undefined || files === undefined) return;
        void loadLevel(path, sessionId, files);
      },
      [sessionId, files, loadLevel],
    );

    const collapseAll = (): void => setExpanded(new Set());
    const refresh = (): void => setReloadToken(token => token + 1);

    const viewState =
      sessionId === undefined
        ? "no-session"
        : files === undefined
          ? "no-service"
          : rootLevel === undefined || rootLevel.status === "loading"
            ? "loading"
            : rootLevel.status === "failed"
              ? "failed"
              : rootLevel.nodes.length === 0
                ? "empty"
                : "tree";

    return (
      <section
        className="fx-root"
        data-workbench-view="fs-explorer"
        data-core-version={version}
        data-conversation-composer-overlay
        data-state={viewState}
        data-session={sessionId ?? ""}
        data-testid="fs-explorer-view"
      >
        <header className="fx-head">
          <span className="fx-head-icon" aria-hidden="true">
            <FolderIcon open />
          </span>
          <h2 className="fx-title">{t("view.title")}</h2>
          <span className="fx-scope">{t("view.scope")}</span>
          <div className="fx-head-meta">
            {rootLevel?.status === "ready" ? (
              <span>
                <b>{rootLevel.nodes.length}</b> {t("head.entries")}
              </span>
            ) : null}
            <button
              type="button"
              className="fx-btn"
              title={t("head.collapseAll")}
              aria-label={t("head.collapseAll")}
              disabled={expanded.size === 0}
              onClick={collapseAll}
            >
              <CollapseIcon />
            </button>
            <button
              type="button"
              className="fx-btn"
              title={t("head.refresh")}
              aria-label={t("head.refresh")}
              disabled={sessionId === undefined || files === undefined || rootLevel?.status === "loading"}
              onClick={refresh}
            >
              <RefreshIcon />
            </button>
          </div>
        </header>

        <div className="fx-main">
          {sessionId === undefined ? (
            <StateBlock
              title={t("state.noSession.title")}
              description={t("state.noSession.description")}
              testId="fs-no-session"
            />
          ) : files === undefined ? (
            <StateBlock
              title={t("state.noService.title")}
              description={t("state.noService.description")}
              testId="fs-no-service"
            />
          ) : rootLevel === undefined || rootLevel.status === "loading" ? (
            <div className="fx-loading" data-testid="fs-loading">
              <span className="fx-spinner" aria-hidden="true" />
              {t("state.loading")}
            </div>
          ) : rootLevel.status === "failed" ? (
            <StateBlock
              title={t("state.failed.title")}
              description={rootLevel.message ?? t("state.failed.description")}
              actionLabel={t("action.retry")}
              onAction={() => retryDirectory("")}
              testId="fs-failed"
            />
          ) : rootLevel.nodes.length === 0 ? (
            <StateBlock
              title={t("state.emptyWorkspace.title")}
              description={t("state.emptyWorkspace.description")}
              testId="fs-empty"
            />
          ) : (
            <>
              <div
                className="fx-tree-pane"
                style={treeWidth === null ? undefined : ({ "--fx-tree-width": `${treeWidth}px` } as CSSProperties)}
              >
                <TreeBody
                  rows={rows}
                  selectedPath={activeRevision === undefined ? activePath : undefined}
                  entryFocus={entryFocus}
                  t={t}
                  onToggle={toggleDirectory}
                  onSelect={path => stack.open(path)}
                  onRetry={retryDirectory}
                  onEntryFocusSettled={releaseEntryFocus}
                />
              </div>
              <div
                ref={handleRef}
                className="fx-pane-handle"
                role="separator"
                aria-orientation="vertical"
                aria-label={t("pane.resize")}
                aria-valuemin={TREE_PANE_MIN_WIDTH}
                aria-valuemax={TREE_PANE_MAX_WIDTH}
                aria-valuenow={treeWidth ?? undefined}
                title={t("pane.resizeHint")}
                tabIndex={0}
                data-testid="fs-pane-handle"
                onPointerDown={beginPaneDrag}
                onPointerMove={movePaneDrag}
                onPointerUp={endPaneDrag}
                onPointerCancel={endPaneDrag}
                onLostPointerCapture={endPaneDrag}
                onKeyDown={onPaneHandleKeyDown}
                onDoubleClick={resetPaneWidth}
              />
              <div className="fx-editor">
                <PanelTabs
                  panels={panels.panels}
                  active={panels.active}
                  t={t}
                  onActivate={key => stack.activate(key)}
                  onClose={requestClose}
                  onStep={delta => (delta === 1 ? stack.next() : stack.previous())}
                  documents={documents}
                  sessionId={sessionId}
                />
                {pendingClose === null ? null : (
                  <CloseConfirm
                    name={panelTitle(pendingClose.path)}
                    t={t}
                    saving={closeSaving}
                    error={closeError}
                    onSave={confirmSaveAndClose}
                    onDiscard={discardAndClose}
                    onCancel={cancelClose}
                  />
                )}
                <div className="fx-editor-body">
                  {panels.panels.length === 0 ? (
                    <PanelEmpty t={t} />
                  ) : (
                    panels.panels.map((panel, index) => {
                      // One pane stays mounted per open file; the inactive ones
                      // are hidden, not unmounted, so the renderer needs to be
                      // told which panel is actually on screen.
                      const isActive = panel.key === panels.active;
                      return (
                        <div
                          key={panel.key}
                          className="fx-panel"
                          id={`fx-panel-${index}`}
                          role="tabpanel"
                          aria-labelledby={`fx-tab-${index}`}
                          hidden={!isActive}
                          data-line={panel.line}
                          data-testid="fs-panel"
                        >
                          <PreviewPane
                            sessionId={sessionId}
                            files={files}
                            path={panel.path}
                            revision={panel.revision}
                            git={gitFace}
                            t={t}
                            visible={isActive}
                            renderers={renderers}
                            documents={documents}
                            locate={sessionId === undefined ? undefined : locate?.(sessionId)}
                          />
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {rootLevel?.status === "ready" ? (
          <footer className="fx-foot" data-testid="fs-foot">
            <span>
              {t("view.scope")} <b>{rootLevel.nodes.length}</b> {t("head.entries")}
            </span>
            {rootLevel.truncated ? (
              <span className="fx-foot-warn">
                {describeListing({ entries: rootLevel.nodes, truncated: true, total: rootLevel.total }).label}
              </span>
            ) : null}
            <span className="fx-foot-git" data-state={changeCount === undefined ? "none" : "ready"} data-testid="fs-git-status">
              <span className="fx-foot-dot fx-tone" data-tone={summaryTone} aria-hidden="true" />
              {changeCount === undefined
                ? t("status.unavailable")
                : changeCount === 0
                  ? t("status.clean")
                  : t("status.summary").replace("{count}", String(changeCount))}
            </span>
            {branchLabel === null ? null : (
              <span className="fx-foot-branch" data-testid="fs-branch" title={t("foot.branch")}>
                {branchLabel}
                {head?.upstream !== undefined && (head.ahead ?? 0) > 0 ? (
                  <span className="fx-foot-ahead">{`↑${String(head.ahead)}`}</span>
                ) : null}
                {head?.upstream !== undefined && (head.behind ?? 0) > 0 ? (
                  <span className="fx-foot-behind">{`↓${String(head.behind)}`}</span>
                ) : null}
              </span>
            )}
            <span className="fx-spacer" />
            <span>{t("foot.order")}</span>
          </footer>
        ) : null}
      </section>
    );
  }

  return FsExplorerView;
}
