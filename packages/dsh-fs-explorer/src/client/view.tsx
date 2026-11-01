/**
 * The file workbench's conversation view.
 *
 * One full-height tree over the host's `workspaceFiles.list`. The view owns the
 * lazy level ledger, the expansion set, selection and the reveal request the
 * Git panel hands over; sorting, flattening and the virtual window stay pure in
 * `model.ts`. Every host seam is optional at read time, so a deployment without
 * the file service renders an explicit empty state instead of throwing inside
 * the conversation shell.
 */
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
} from "react";

import type { Translate } from "./copy.ts";
import { KEYMAP, createEscapeHandler, hasOpenModal, isEditableTarget, matchesKeymap } from "./keyboard.ts";
import {
  buildTree,
  describeListing,
  flattenTree,
  joinPath,
  listingPath,
  type FocusTarget,
  type TreeLevel,
} from "./model.ts";
import {
  clampTreePaneWidth,
  readTreePaneWidth,
  resetTreePaneWidth,
  saveTreePaneWidth,
  type PaneWidthStorage,
} from "./pane-width.ts";
import { PanelEmpty, PanelTabs } from "./panel-tabs.tsx";
import { consumeViewRequest, createPanelStackRegistry } from "./panels.ts";
import { headLabel, joinChangeStats, parseStatusZ, type FsGitHead, type StatusMap } from "./status.ts";
import { PreviewPane } from "./preview-pane.tsx";
import { CollapseIcon, FolderIcon, RefreshIcon, TreeBody } from "./tree.tsx";
import { buildWorkspaceMap, MANIFEST_FILES, type WorkspaceTag } from "./workspace-map.ts";
import {
  describeFailure,
  normalizeListing,
  normalizeStatusSnapshot,
  type FilesResolver,
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

/**
 * Build the view component for one mount.
 * @param wiring - the core service, contract version, copy and file resolver.
 * @returns the component registered into `conversation.view`.
 */
export function createFsExplorerView({ workbench, version, t, files: resolveFiles, status: resolveStatus }: ViewWiring) {
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
    const activePath = panels.active ?? undefined;
    const [reloadToken, setReloadToken] = useState(0);
    const [reveal, setReveal] = useState<FocusTarget | undefined>(undefined);
    const controllers = useRef<Map<string, AbortController>>(new Map());
    const handledRequest = useRef<string | undefined>(undefined);

    // The tree column's width: null keeps the stylesheet's fluid clamp, a
    // pixel count from a past drag pins it. Moves only touch state; the store
    // is written once at drag rest.
    const paneStorage = useMemo(() => paneWidthStorage(), []);
    const [treeWidth, setTreeWidth] = useState<number | null>(() => readTreePaneWidth(paneStorage));
    const handleRef = useRef<HTMLDivElement | null>(null);
    const dragRef = useRef<{ pointerId: number; startX: number; baseWidth: number } | null>(null);

    const rootLevel = levels.get("");
    const rootReady = rootLevel?.status === "ready";

    /**
     * Open one focus request's target.
     *
     * A workspace-relative target also asks the tree to reveal it, which expands
     * its ancestors on the way. An absolute one has no row to reveal — the tree
     * only lists the workspace — so it opens the panel and nothing else.
     */
    const openRequest = useCallback(
      (path: string, line: number, absolute: boolean): void => {
        stack.open(path, line, absolute);
        if (!absolute) setReveal({ path, line, absolute });
      },
      [stack],
    );

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
      setReveal(undefined);
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

    // Reveal runs after the root arrives: expand every ancestor in order,
    // listing each level that is not cached yet, then select the file.
    useEffect(() => {
      if (reveal === undefined || sessionId === undefined || files === undefined || !rootReady) return;
      let alive = true;
      const parts = reveal.path.split("/").filter(Boolean);
      const chain: string[] = [];
      let prefix = "";
      for (const part of parts.slice(0, -1)) {
        prefix = joinPath(prefix, part);
        chain.push(prefix);
      }
      if (chain.length > 0) {
        setExpanded(previous => new Set([...previous, ...chain]));
      }
      const run = async (): Promise<void> => {
        for (const directory of chain) {
          if (levelsRef.current.get(directory)?.status === "ready") continue;
          const ok = await loadLevel(directory, sessionId, files);
          if (!alive || !ok) return;
        }
        if (!alive) return;
        stack.open(reveal.path, reveal.line, reveal.absolute);
        setReveal(undefined);
      };
      void run();
      return () => {
        alive = false;
      };
    }, [reveal, sessionId, files, rootReady, loadLevel, stack]);

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
    const beginPaneDrag = useCallback((event: ReactPointerEvent<HTMLDivElement>): void => {
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
      };
      document.body.classList.add("fx-pane-resizing");
    }, []);

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
        // A click without movement must not pin the fluid default into pixels.
        if (Math.round(width) === Math.round(drag.baseWidth)) return;
        setTreeWidth(saveTreePaneWidth(paneStorage, width));
      },
      [paneStorage],
    );

    const resetPaneWidth = useCallback((): void => {
      resetTreePaneWidth(paneStorage);
      setTreeWidth(null);
    }, [paneStorage]);

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
        for (const entry of KEYMAP) {
          if (!matchesKeymap(event, entry)) continue;
          if (entry.action === "closePanel" && stack.snapshot().active === null) return;
          event.preventDefault();
          event.stopPropagation();
          if (entry.action === "nextPanel") stack.next();
          else if (entry.action === "previousPanel") stack.previous();
          else stack.close();
          return;
        }
      };
      document.addEventListener("keydown", onKeyDown, true);
      return () => document.removeEventListener("keydown", onKeyDown, true);
    }, [stack]);

    // Escape returns the caret to the composer unless a dialog is open. The
    // DOM probe is broader than a class check because the shell, the command
    // palette and the settings sheet all use different dialog markers.
    useEffect(() => {
      if (typeof document === "undefined") return;
      const handler = createEscapeHandler({
        focusComposer,
        hasModal: () => hasOpenModal(document),
      });
      const listener = (event: KeyboardEvent): void => handler(event);
      document.addEventListener("keydown", listener, true);
      return () => document.removeEventListener("keydown", listener, true);
    }, [focusComposer]);

    const rows = useMemo(
      () => flattenTree(levels, expanded, statuses, workspaceTags),
      [levels, expanded, statuses, workspaceTags],
    );
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
                  selectedPath={activePath}
                  t={t}
                  onToggle={toggleDirectory}
                  onSelect={path => stack.open(path)}
                  onRetry={retryDirectory}
                />
              </div>
              <div
                ref={handleRef}
                className="fx-pane-handle"
                role="separator"
                aria-orientation="vertical"
                aria-label={t("pane.resize")}
                title={t("pane.resizeHint")}
                data-testid="fs-pane-handle"
                onPointerDown={beginPaneDrag}
                onPointerMove={movePaneDrag}
                onPointerUp={endPaneDrag}
                onPointerCancel={endPaneDrag}
                onLostPointerCapture={endPaneDrag}
                onDoubleClick={resetPaneWidth}
              />
              <div className="fx-editor">
                <PanelTabs
                  panels={panels.panels}
                  active={panels.active}
                  t={t}
                  onActivate={path => stack.activate(path)}
                  onClose={path => stack.close(path)}
                  onStep={delta => (delta === 1 ? stack.next() : stack.previous())}
                />
                <div className="fx-editor-body">
                  {panels.panels.length === 0 ? (
                    <PanelEmpty t={t} />
                  ) : (
                    panels.panels.map((panel, index) => {
                      // One pane stays mounted per open file; the inactive ones
                      // are hidden, not unmounted, so the renderer needs to be
                      // told which panel is actually on screen.
                      const isActive = panel.path === panels.active;
                      return (
                        <div
                          key={panel.path}
                          className="fx-panel"
                          id={`fx-panel-${index}`}
                          role="tabpanel"
                          aria-labelledby={`fx-tab-${index}`}
                          hidden={!isActive}
                          data-line={panel.line}
                          data-testid="fs-panel"
                        >
                          <PreviewPane sessionId={sessionId} files={files} path={panel.path} t={t} visible={isActive} />
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
