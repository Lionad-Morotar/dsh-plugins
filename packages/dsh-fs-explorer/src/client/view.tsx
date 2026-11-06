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
import {
  MENU_ACTION,
  TAB_MENU_ACTION,
  buildContextMenu,
  buildTabMenu,
  parentDirectory,
  type ContextMenuAnchor,
  type ContextMenuEntry,
  type ContextMenuRow,
} from "./context-menu.ts";
import { ContextMenu, type MenuAnchor } from "./context-menu-view.tsx";
import {
  fsReferencePayload,
  insertFsReference,
  referenceLabel,
  type FsInsertionResult,
  type FsReferenceInsert,
  type FsReferenceSpan,
  type ReferenceTargetFacts,
} from "./reference.ts";
import { BookmarkBar } from "./bookmark-bar.tsx";
import { BookmarkPicker } from "./bookmark-picker.tsx";
import { createBookmarkStore } from "./bookmarks-store.ts";
import {
  emptyBookmarkTree,
  insertNode,
  makeNode,
  removeNode,
  renameNode,
  reorderChildren,
} from "./bookmarks-model.ts";
import type { BookmarkNode, BookmarkTree } from "../bookmarks.ts";
import { writeClipboard } from "./clipboard.ts";
import { NamePrompt } from "./name-prompt.tsx";
import { KEYMAP, createEscapeHandler, hasOpenModal, isEditableTarget, matchesKeymap, pageCloseIntent } from "./keyboard.ts";
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
  type TreeKind,
  type TreeLevel,
  type TreeRow,
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
import { closeBatch, consumeViewRequest, createPanelStackRegistry, panelTitle } from "./panels.ts";
import { headLabel, joinChangeStats, parseStatusZ, type FsGitHead, type StatusMap } from "./status.ts";
import { PreviewPane, saveFailureReason } from "./preview-pane.tsx";
import type { RendererRegistry } from "./renderer-registry.ts";
import {
  CollapseIcon,
  FolderIcon,
  RefreshIcon,
  SearchIcon,
  TreeBody,
  type TreeCursorRequest,
  type TreeEntryFocus,
} from "./tree.tsx";
import { TreeSearchBox } from "./tree-search-box.tsx";
import {
  createFileReferencesResolver,
  filterListedEntries,
  listedEntries,
  normalizeReferences,
  referenceRows,
  revealChain,
  searchQuery,
  type FileReferencesFace,
  type SearchOrigin,
} from "./tree-search.ts";
import { buildWorkspaceMap, MANIFEST_FILES, type WorkspaceTag } from "./workspace-map.ts";
import { createWorkspaceClient, type WorkspaceClient, type WorkspaceError } from "./workspace-face.ts";
import { indexIgnoredPaths } from "./ignored.ts";
import type { WorkspaceCapabilities } from "../host/types.ts";
import { buildRemoteLinks, type RemoteLink } from "./remote-url.ts";
import {
  describeFailure,
  normalizeListing,
  normalizeStatusSnapshot,
  type FilesResolver,
  type FsGitRemote,
  type GitShowFace,
  type GitShowResolver,
  type StatusResolver,
  type WorkspaceFilesFace,
} from "./wire.ts";
import { PACKAGE_NAME, VIEW_ID } from "../shared.ts";

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
  /**
   * Claim the host's close-page fallback (⌘W) while this view owns the page.
   * Absent on cores older than contract version 3.
   */
  registerPageCloser?(closer: () => boolean): () => void;
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
  /**
   * The composer's standard props. `conversation.view` is a session-scope slot,
   * so the host hands these to every entry; they are optional here because the
   * view also mounts on hosts and in tests that publish neither.
   */
  readonly inputActions?: ReferenceInputActions;
}

/** The slice of the composer face the reference rows read. */
export interface ReferenceInputActions {
  captureInsertion?(): { readonly start: number; readonly end: number; readonly draftRev: number };
  insertText?(text: string, span: { readonly start: number; readonly end: number; readonly draftRev: number }): boolean;
}

/** What the view needs from the entry to make the reference rows work. */
export interface ReferenceWiring {
  /** The session input facade's structured-reference write, or undefined. */
  readonly insertReference?: (insert: FsReferenceInsert, span: FsReferenceSpan) => boolean;
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
  /**
   * The workspace channel behind the tree's context menu.
   *
   * Absent leaves the menu's reveal row disabled with a reason and the absolute
   * copy unavailable, which is what a host without the channel can honestly
   * offer. A test injects a fake here.
   */
  readonly workspace?: (sessionId: string) => WorkspaceClient;
  /**
   * Resolve the host's workspace-wide fuzzy file index, read per search.
   *
   * Absent — or answering undefined — is a legal deployment: the search then
   * filters the entries already listed and labels that narrower scope, rather
   * than failing. It is a resolver and not the face itself because the host may
   * mount the namespace after this view.
   */
  readonly fileReferences?: () => FileReferencesFace | undefined;
  /** The session input facade, probed per click; absent on hosts without one. */
  readonly reference?: ReferenceWiringResolver;
}

/**
 * The header's ignored-entries glyph.
 *
 * Open draws an eye, closed draws the same eye struck through: the toggle states
 * are "these rows are visible" and "these rows are hidden", and a single glyph
 * that only dims would leave the reader guessing which way it points.
 * @param props - whether ignored entries are currently listed.
 */
export function EyeIcon({ open }: { readonly open: boolean }) {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M1.5 8S4 3.8 8 3.8 14.5 8 14.5 8 12 12.2 8 12.2 1.5 8 1.5 8Z" />
      <circle cx="8" cy="8" r="1.9" />
      {open ? null : <path d="M2.6 13.4 13.4 2.6" />}
    </svg>
  );
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

/** One bookmark id nothing else will collide with. */
function newBookmarkId(): string {
  const uuid = globalThis.crypto?.randomUUID;
  if (typeof uuid === "function") return uuid.call(globalThis.crypto);
  return `bm-${String(Date.now())}-${Math.random().toString(36).slice(2)}`;
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

/** Where the header toggle's choice lives. */
const SHOW_IGNORED_KEY = "dsh-fs-explorer.show-ignored";

/**
 * Whether the tree lists git-ignored entries.
 *
 * Showing them is the default and the feature's whole point, so only an
 * explicit `"0"` reads as hidden: an absent key, a value written by an older
 * build, or a store that refuses to answer all mean "show".
 * @param storage - the store to read, or null/undefined when unavailable.
 * @returns true when ignored entries should be listed.
 */
export function readShowIgnored(storage?: PaneWidthStorage | null): boolean {
  if (storage === null || storage === undefined) return true;
  try {
    return storage.getItem(SHOW_IGNORED_KEY) !== "0";
  } catch {
    return true;
  }
}

/**
 * Remember the header toggle's choice.
 *
 * A refusing store (private mode) leaves the choice session-only rather than
 * throwing out of a click handler.
 * @param value - whether ignored entries should be listed.
 * @param storage - the store to write, or null/undefined when unavailable.
 */
export function writeShowIgnored(value: boolean, storage?: PaneWidthStorage | null): void {
  if (storage === null || storage === undefined) return;
  try {
    storage.setItem(SHOW_IGNORED_KEY, value ? "1" : "0");
  } catch {
    // A refusing store keeps the preference in state only.
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
  workspace: resolveWorkspace,
  fileReferences: resolveReferences,
  reference: resolveReference,
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
    // One locator per session, not one per render: the pane treats a changed
    // locator as a different reader, so a fresh closure on an unrelated parent
    // render would rebuild the preview loader and re-read the open file.
    const sessionLocator = useMemo(
      () => (sessionId === undefined || locate === undefined ? undefined : locate(sessionId)),
      [locate, sessionId],
    );

    // The context menu's channel. Resolved once per session, like the locator:
    // a fresh client identity on every render would restart the capability probe.
    const workspace = useMemo<WorkspaceClient | undefined>(
      () => (sessionId === undefined || resolveWorkspace === undefined ? undefined : resolveWorkspace(sessionId)),
      [resolveWorkspace, sessionId],
    );

    // The bookmark store and the tree it serves. The store is rebuilt only when
    // the channel changes; the tree starts empty so the bar renders on the first
    // paint instead of waiting for a round trip.
    const bookmarkStore = useMemo(() => createBookmarkStore(workspace), [workspace]);
    const [bookmarks, setBookmarks] = useState<BookmarkTree>(() =>
      emptyBookmarkTree(new Date().toISOString()),
    );
    // Set by the first edit, read by the load that may still be in flight.
    const bookmarksDirty = useRef(false);

    // The two bookmark editors. One picker for "which group", one name card for
    // "what to call it"; both are transient, and neither owns the tree.
    const [bookmarkPicker, setBookmarkPicker] = useState<
      | {
          readonly mode: "add";
          readonly target: { readonly name: string; readonly path: string; readonly kind: "file" | "directory" };
        }
      | { readonly mode: "move"; readonly node: BookmarkNode }
      | null
    >(null);
    const [bookmarkPrompt, setBookmarkPrompt] = useState<
      | { readonly mode: "group"; readonly parentId: string | null }
      | { readonly mode: "rename"; readonly node: BookmarkNode }
      | null
    >(null);

    // Read by the Escape handler, which is registered once and must not be
    // rebuilt every time the menu opens.
    const contextMenuOpen = useRef(false);
    const tabMenuOpen = useRef(false);

    // The open context menu: which row it addresses (undefined for the blank
    // area), where it opened, and the absolute path `info` answered for it.
    const [contextMenu, setContextMenu] = useState<
      | {
          readonly row: ContextMenuRow | undefined;
          readonly anchor: MenuAnchor;
          readonly absolutePath: string | undefined;
          /** The directory a create lands in; `""` is the workspace root. */
          readonly createParent: string | undefined;
          /** Where the keyboard goes when the menu closes. */
          readonly trigger: HTMLElement | undefined;
        }
      | null
    >(null);
    // The strip's menu: which tab it addressed, where it opened and the chip the
    // keyboard returns to. A second menu beside the tree's rather than a mode of
    // it — the two carry different targets, and closing one must not close the
    // other.
    const [tabMenu, setTabMenu] = useState<
      | { readonly key: string; readonly anchor: MenuAnchor; readonly trigger: HTMLElement }
      | null
    >(null);
    // What the host's desktop can do. Probed once per session, not per menu: the
    // answer is a property of the host, not of the click.
    const [capabilities, setCapabilities] = useState<WorkspaceCapabilities | undefined>(undefined);    // One transient sentence under the header: what the last action did.
    const [notice, setNotice] = useState<{ readonly text: string; readonly tone: "ok" | "error" } | null>(null);
    const noticeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    // The name card, while it is up: what is being created, where, and what the
    // host said about the last attempt. A refusal keeps the card open, so the
    // error lives here rather than in the notice bar.
    const [namePrompt, setNamePrompt] = useState<
      | {
          readonly kind: "file" | "directory";
          readonly parent: string;
          readonly error: string | undefined;
          readonly busy: boolean;
        }
      | null
    >(null);

    const [levels, setLevels] = useState<ReadonlyMap<string, TreeLevel>>(() => new Map());
    const [statuses, setStatuses] = useState<StatusMap | undefined>(undefined);
    const [head, setHead] = useState<FsGitHead | undefined>(undefined);
    const [gitRoot, setGitRoot] = useState<string | undefined>(undefined);
    // Configured remotes, for the remote-address rows. Undefined means the host
    // never reported the field, which is a different answer from a repository
    // that simply has no remote.
    const [remotes, setRemotes] = useState<readonly FsGitRemote[] | undefined>(undefined);
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

    // The paths git ignores, as the host lists them. Kept as raw entries rather
    // than as the index so a reload that returns the same list does not rebuild
    // the set the whole tree is tested against on every render.
    const [ignoredEntries, setIgnoredEntries] = useState<readonly string[]>([]);
    // The header toggle's choice. Read once per mount from the store; a view
    // switch remounts this component, which is exactly when the stored value
    // should win again.
    const [showIgnored, setShowIgnored] = useState(() => readShowIgnored(paneWidthStorage()));

    // Closing a dirty panel is a question, not a gesture: the bar keeps the
    // panel path so every answer still addresses the tab the reader asked to
    // drop, even if another tab became active meanwhile. `rest` is what remains
    // of a batch close (关闭其他 / 关闭右侧): a run stops at its first dirty
    // draft because that draft needs its own answer, and the answer resumes it.
    const [pendingClose, setPendingClose] = useState<
      { readonly path: string; readonly rest: readonly string[] } | null
    >(null);
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
     * Close a run of panels, asking about every dirty draft it meets.
     *
     * Every closing gesture — the tab button, Delete on the strip, Ctrl+W, both
     * batch rows — lands here, so the one place that knows what a dirty draft
     * means also decides when the bar has to appear. Clean panels leave at once;
     * dirty ones queue and are asked one at a time in strip order, because a
     * batch that spans several drafts must not drop one silently. Keys read from
     * the snapshot the gesture saw are re-checked against the live strip, since
     * an earlier close in the run can already have dropped a tab the caller
     * listed.
     */
    const closeSequence = useCallback(
      (keys: readonly string[]): void => {
        const open = new Set(stack.snapshot().panels.map(entry => entry.key));
        const pending: string[] = [];
        for (const key of keys) {
          if (!open.has(key)) continue;
          const draft = sessionId === undefined ? undefined : documents?.peek(sessionId, key);
          if (draft?.dirty === true) {
            pending.push(key);
            continue;
          }
          // Nobody is holding the draft any more, and a closed panel must not
          // resurrect it on the next open of the same path.
          if (sessionId !== undefined) documents?.forget(sessionId, key);
          stack.close(key);
        }
        const head = pending[0];
        setCloseError(null);
        setPendingClose(head === undefined ? null : { path: head, rest: pending.slice(1) });
      },
      [documents, sessionId, stack],
    );

    /**
     * Leave the answered panel and pick up the rest of the run.
     * @param rest - the panels the batch still wants closed, in strip order.
     */
    const advanceClose = useCallback(
      (rest: readonly string[]): void => {
        setPendingClose(null);
        setCloseError(null);
        if (rest.length > 0) closeSequence(rest);
      },
      [closeSequence],
    );

    /**
     * Close one panel, asking first when a draft would be lost.
     * @param path - the panel to close; the active one when omitted.
     */
    const requestClose = useCallback(
      (path?: string): void => {
        const target = path ?? stack.snapshot().active ?? undefined;
        if (target === undefined) return;
        closeSequence([target]);
      },
      [closeSequence, stack],
    );

    // Desktop's File > 关闭页面 (⌘W) reaches the host's `page.close` command,
    // which closes the focused right-sidebar page and otherwise closes the
    // window. The workbench core hands that fallback here, so a file panel is
    // what the chord closes instead of the application. The claim is registered
    // only while this view is mounted, and `pageCloseIntent` refuses the chord
    // for a retained view of another Session.
    useEffect(() => {
      const register = workbench.registerPageCloser;
      if (typeof register !== "function") return;
      return register(() => {
        const intent = pageCloseIntent({
          viewSessionId: sessionId,
          currentSessionId: workbench.currentSessionId(),
          activePanel: stack.snapshot().active,
          confirming: pendingCloseRef.current !== null,
        });
        if (intent === "close") requestClose();
        return intent !== "pass";
      });
    }, [requestClose, sessionId, stack, workbench]);

    /** Answer "save and close": the panel only leaves once the write landed. */
    const confirmSaveAndClose = useCallback((): void => {
      const target = pendingClose;
      if (target === null) return;
      const session = sessionId === undefined ? undefined : documents?.find(sessionId, target.path);
      if (session === undefined) {
        if (sessionId !== undefined) documents?.forget(sessionId, target.path);
        stack.close(target.path);
        advanceClose(target.rest);
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
        // The write landed, so the draft is the disk now; dropping the session
        // keeps a stale copy from shadowing the file the next time it opens.
        if (sessionId !== undefined) documents?.forget(sessionId, target.path);
        stack.close(target.path);
        advanceClose(target.rest);
      });
    }, [advanceClose, documents, pendingClose, sessionId, stack, t]);

    const discardAndClose = useCallback((): void => {
      const target = pendingClose;
      setCloseError(null);
      if (target === null) {
        setPendingClose(null);
        return;
      }
      if (sessionId !== undefined) documents?.forget(sessionId, target.path);
      stack.close(target.path);
      advanceClose(target.rest);
    }, [advanceClose, documents, pendingClose, sessionId, stack]);

    // Cancelling keeps the asked panel and still closes the rest: the reader
    // refused one draft, not the batch they had just asked for.
    const cancelClose = useCallback((): void => {
      const target = pendingClose;
      if (target === null) {
        setCloseError(null);
        return;
      }
      advanceClose(target.rest);
    }, [advanceClose, pendingClose]);

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
        setRemotes(undefined);
        return;
      }
      let alive = true;
      const controller = new AbortController();
      setStatuses(undefined);
      setHead(undefined);
      setGitRoot(undefined);
      setRemotes(undefined);
      Promise.resolve()
        .then(() => statusFace.snapshot({ sessionId, maxCommits: 1 }, controller.signal))
        .then(response => {
          if (!alive) return;
          const normalized = normalizeStatusSnapshot(response);
          if (!normalized.ok) {
            setStatuses(undefined);
            setHead(undefined);
            setGitRoot(undefined);
            setRemotes(undefined);
            return;
          }
          setStatuses(joinChangeStats(parseStatusZ(normalized.status), normalized.stats));
          setHead(normalized.head);
          setGitRoot(normalized.root);
          setRemotes(normalized.remotes);
        })
        .catch(() => {
          if (alive) {
            setStatuses(undefined);
            setHead(undefined);
            setGitRoot(undefined);
            setRemotes(undefined);
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

    const [cursorRequest, setCursorRequest] = useState<TreeCursorRequest | undefined>(undefined);
    const cursorPath = useRef<string | undefined>(undefined);
    const requestNonce = useRef(0);
    // A reveal that arrived before its row existed waits here. The row list is
    // the only thing that knows when the ancestors finished listing, so the
    // held path is served the moment it appears rather than dropped.
    const pendingReveal = useRef<string | undefined>(undefined);
    // Set once a reveal is the reason this view is on screen, so the arrival
    // gesture does not answer it by opening the workspace front page.
    const revealOnly = useRef(false);

    // One gesture, one nonce: the tree serves a request once and a re-render
    // must not replay it.
    const askCursor = useCallback((path: string | undefined, delta: number | undefined, focus: boolean): void => {
      requestNonce.current += 1;
      setCursorRequest({ nonce: requestNonce.current, ...(path === undefined ? {} : { path }), ...(delta === undefined ? {} : { delta }), focus });
    }, []);

    /**
     * Open the ancestors of one path so its row can exist, and list them.
     *
     * A row is only rendered once its parent's listing is in the ledger, so the
     * chain is both expanded and read. A directory named by the path also needs
     * its own listing: a reveal lands the cursor on it, and a search result that
     * is a directory expands it, and both want the children to be there. The
     * caller decides what happens to the row afterwards, which is the whole
     * difference between opening a result and revealing one.
     * @param path - a workspace-relative path.
     * @param kind - the entry's kind when the caller knows it, so a directory's own level is listed.
     */
    const revealAncestors = useCallback(
      (path: string, kind: TreeKind | undefined): void => {
        const chain = revealChain(path);
        setExpanded(previous => {
          const next = new Set(previous);
          for (const directory of chain) next.add(directory);
          return next;
        });
        if (sessionId === undefined || files === undefined) return;
        for (const directory of chain) {
          if (levelsRef.current.get(directory) === undefined) void loadLevel(directory, sessionId, files);
        }
        if (kind === "directory" && levelsRef.current.get(path) === undefined) {
          void loadLevel(path, sessionId, files);
        }
      },
      [files, loadLevel, sessionId],
    );

    /**
     * Move the tree cursor onto one path without opening a panel.
     *
     * A side bar asks for the row, not the file: opening a directory as a panel
     * would replace what the reader is looking at with an empty tab. The cursor
     * is the same state the arrow keys write, so the row highlights and the next
     * key press continues from there. A directory is also expanded, because a
     * selection that hides its contents answers half the question the reader
     * asked.
     */
    const revealRequest = useCallback(
      (path: string): void => {
        const entry = listedEntries(levelsRef.current).find(candidate => candidate.path === path);
        revealAncestors(path, entry?.kind);
        if (entry?.kind === "directory") setExpanded(previous => new Set(previous).add(path));
        // A reveal is the whole request, so the arrival gesture must not answer
        // it by opening the workspace front page: the reader asked for a row.
        revealOnly.current = true;
        if (entry === undefined) {
          // The row does not exist yet: its ancestors are still loading, so the
          // request is held and served once the row list can honour it.
          pendingReveal.current = path;
          return;
        }
        askCursor(path, undefined, true);
      },
      [askCursor, revealAncestors],
    );

    /**
     * Route one focus request to the panel stack or to the tree cursor.
     *
     * Every entry point (the host's view request, the core's focus queue) hands
     * its focus here, so the split between "open this file" and "select this
     * row" is decided once.
     */
    const handleFocus = useCallback(
      (focus: string | undefined): void => {
        consumeViewRequest(focus, {
          open: openRequest,
          reveal: revealRequest,
        });
      },
      [openRequest, revealRequest],
    );

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
      handleFocus(request.focus);
      props.completeViewRequest?.();
    }, [props.viewRequest, props.completeViewRequest, handleFocus]);

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
        handleFocus(focus);
      };
      consume();
      return queue.subscribe(consume);
    }, [workbench, sessionId, handleFocus]);

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
        hasModal: () =>
          pendingCloseRef.current !== null || contextMenuOpen.current || tabMenuOpen.current || hasOpenModal(document),
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

    const ignoredIndex = useMemo(() => indexIgnoredPaths(ignoredEntries), [ignoredEntries]);

    const rows = useMemo(
      () =>
        flattenTree(levels, expanded, statuses, workspaceTags, {
          ignored: ignoredIndex,
          showIgnored,
          hiddenLabel: count => t("state.hiddenDirectory").replace("{count}", String(count)),
        }),
      [levels, expanded, statuses, workspaceTags, ignoredIndex, showIgnored, t],
    );

    // Having a query and having the caret in the bar are two states: a bar with
    // no query is up and waiting, while the tree behind it still shows the tree.
    //
    // The bar is mounted for the pane's whole lifetime, not on demand, because
    // both ways in require it to already be there: jump navigation labels a
    // target that has to exist in the DOM, and a control that only appears after
    // a click cannot be that target. Focusing is therefore an event the reader's
    // gesture asks for, never a side effect of being on screen.
    const [search, setSearch] = useState("");
    const [searchResults, setSearchResults] = useState<readonly TreeRow[]>([]);
    const [searchOrigin, setSearchOrigin] = useState<SearchOrigin | null>(null);
    const [searchBusy, setSearchBusy] = useState(false);
    // One per gesture so two asks in a row are two events, starting at zero so
    // the first render cannot fire: arriving in the pane parks the keyboard on
    // the tree, and the bar taking it back would make the tree's arrows
    // unreachable until the reader clicked elsewhere.
    const [focusSignal, setFocusSignal] = useState(0);
    const askSearchFocus = useCallback((): void => setFocusSignal(previous => previous + 1), []);

    // The search answer. The index answers across the whole workspace, so it is
    // asked first; only its absence falls back to the listed entries, and which
    // one answered is what the bar's scope chip reports.
    useEffect(() => {
      const query = searchQuery(search);
      if (query === undefined) {
        setSearchResults([]);
        setSearchOrigin(null);
        setSearchBusy(false);
        return;
      }
      const local = (): void => {
        const entries = filterListedEntries(listedEntries(levelsRef.current), query);
        setSearchResults(
          referenceRows(
            entries.map(entry => ({ path: entry.path, kind: entry.kind === "directory" ? "directory" as const : "file" as const })),
            statuses,
          ),
        );
        setSearchOrigin("loaded");
        setSearchBusy(false);
      };
      const face = resolveReferences?.();
      if (face === undefined || sessionId === undefined) {
        local();
        return;
      }
      const controller = new AbortController();
      setSearchBusy(true);
      void Promise.resolve(face.list(sessionId, query, controller.signal)).then(
        response => {
          if (controller.signal.aborted) return;
          const candidates = normalizeReferences(response);
          // An answer with no candidates may be a refusal or a genuine empty
          // set; either way the index is what was asked, so the label stays.
          setSearchResults(referenceRows(candidates, statuses));
          setSearchOrigin("index");
          setSearchBusy(false);
        },
        error => {
          if (controller.signal.aborted) return;
          // The index is an enhancement; a transport failure degrades to the
          // rows already listed rather than emptying the panel.
          console.debug(`[${PACKAGE_NAME}] the file index failed, searching listed rows instead`, error);
          local();
        },
      );
      return () => controller.abort();
    }, [search, sessionId, statuses, resolveReferences]);

    // Search replaces where rows come from; it does not add a second list, so
    // the virtual window, the cursor and the follow effect all keep working.
    const searching = searchOrigin !== null;
    const shownRows = searching ? searchResults : rows;

    // Serve a held reveal as soon as its row lands in the tree. The kind is
    // resolved here rather than at request time because the listing that
    // carries the row is also what says whether it is a directory.
    useEffect(() => {
      const path = pendingReveal.current;
      if (path === undefined) return;
      const entry = listedEntries(levelsRef.current).find(candidate => candidate.path === path);
      if (entry === undefined) return;
      pendingReveal.current = undefined;
      if (entry.kind === "directory") {
        revealAncestors(path, entry.kind);
        setExpanded(previous => new Set(previous).add(path));
      }
      askCursor(path, undefined, true);
    }, [rows, askCursor, revealAncestors]);

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
      // A reveal asked for a row, not a file: opening the front page here would
      // put a panel up that the caller deliberately did not ask for.
      if (revealOnly.current) return;
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

    // Load this session's bookmarks. The store never rejects, but the guard and
    // the catch are both here anyway: a bookmark bar that throws on mount would
    // take the tree down with it, and the tree is the reader's actual work.
    //
    // `bookmarksDirty` is what keeps a slow load from overwriting an edit the
    // reader made while it was in flight: the first paint is an empty tree, so
    // "add a bookmark" is available immediately, and a load that lands afterwards
    // would otherwise replace that bookmark with whatever the host had.
    useEffect(() => {
      let alive = true;
      bookmarksDirty.current = false;
      // No session means no workspace to key a record by: ask nobody, show an
      // empty bar.
      if (sessionId === undefined) {
        setBookmarks(emptyBookmarkTree(new Date().toISOString()));
        return;
      }
      void bookmarkStore
        .load(sessionId)
        .then(tree => {
          if (alive && !bookmarksDirty.current) setBookmarks(tree);
        })
        .catch(() => {
          // Keep the empty tree the first paint already rendered.
        });
      return () => {
        alive = false;
      };
    }, [bookmarkStore, sessionId]);

    /**
     * Expand and locate one bookmarked directory.
     *
     * The same two steps the active-panel reveal takes: put the directory and
     * its ancestors in the expanded set, then read every level that is not
     * already loaded. The cursor then lands on the directory itself, which is
     * what makes a bookmark feel like a jump rather than a scroll.
     */
    const openBookmarkFolder = useCallback(
      (path: string): void => {
        const chain = [...ancestorChain(path), path];
        setExpanded(previous => {
          const next = new Set(previous);
          for (const directory of chain) next.add(directory);
          return next;
        });
        if (sessionId !== undefined && files !== undefined) {
          const missing = chain.filter(directory => levelsRef.current.get(directory)?.status !== "ready");
          if (missing.length > 0) {
            void Promise.all(missing.map(directory => loadLevel(directory, sessionId, files)));
          }
        }
        setEntryFocus({ path });
      },
      [sessionId, files, loadLevel],
    );

    /**
     * Open one bookmarked file.
     *
     * Through the panel stack, not a private "temporary" state: `activePath` is
     * the single source of reveal, so the tree expands to the file and the tab
     * strip agrees about what is open.
     */
    const openBookmarkFile = useCallback(
      (path: string): void => {
        stack.open(path);
      },
      [stack],
    );

    /**
     * Show one sentence under the header for a few seconds.
     *
     * One timer for the whole view: a second action replaces the first notice
     * rather than stacking, and the timer is cleared on unmount so a notice
     * cannot land on a view that is gone.
     * @param text - the sentence, already translated.
     * @param tone - whether it reports success or a refusal.
     */
    const announce = useCallback((text: string, tone: "ok" | "error"): void => {
      if (noticeTimer.current !== null) clearTimeout(noticeTimer.current);
      setNotice({ text, tone });
      noticeTimer.current = setTimeout(() => {
        noticeTimer.current = null;
        setNotice(null);
      }, 4000);
    }, []);

    useEffect(
      () => () => {
        if (noticeTimer.current !== null) clearTimeout(noticeTimer.current);
      },
      [],
    );

    /**
     * Publish one bookmark tree and write it through.
     *
     * The in-memory tree moves first: the bar is the reader's feedback, and
     * waiting for a round trip would make every bookmark action feel laggy. A
     * failed write says so and leaves the tree as it is, because the reader's
     * change is still the best copy of their intent until they reload.
     * @param next - the tree to publish.
     */
    const persistBookmarks = useCallback(
      (next: BookmarkTree): void => {
        // An edit outranks a load that has not landed yet.
        bookmarksDirty.current = true;
        setBookmarks(next);
        // No session means no record to key: the tree stays in memory rather
        // than landing under an empty key that no later session would read.
        if (sessionId === undefined) return;
        void bookmarkStore.save(sessionId, next).catch(() => {
          announce(t("bookmarks.saveFailed"), "error");
        });
      },
      [announce, bookmarkStore, sessionId, t],
    );

    /** Remove one bookmark, or one group with everything under it. */
    const removeBookmark = useCallback(
      (node: BookmarkNode): void => {
        try {
          persistBookmarks(removeNode(bookmarks, node.id).tree);
          announce(t("bookmarks.removed"), "ok");
        } catch {
          // A node that vanished under the click is already gone; nothing to say.
        }
      },
      [announce, bookmarks, persistBookmarks, t],
    );

    /** Replace one parent's child order, from a drag or an up/down row. */
    const reorderBookmarks = useCallback(
      (parentId: string | null, orderedIds: readonly string[]): void => {
        try {
          persistBookmarks(reorderChildren(bookmarks, parentId, orderedIds));
        } catch {
          // A stale order (the tree moved under the drag) is dropped rather than
          // applied to the wrong list.
        }
      },
      [bookmarks, persistBookmarks],
    );

    // The capability probe. A host without the channel, or one whose probe
    // failed, leaves the reveal row disabled with a reason: an action that
    // cannot run must say so rather than disappear.
    useEffect(() => {
      if (workspace === undefined) {
        setCapabilities(undefined);
        return;
      }
      let alive = true;
      void workspace.capabilities(sessionId ?? "").then(outcome => {
        if (!alive) return;
        setCapabilities(outcome.ok ? outcome.capabilities : undefined);
      });
      return () => {
        alive = false;
      };
    }, [workspace, sessionId]);

    // The ignored listing. It decorates rows the reader can already see, so
    // every failure path here is silence: an absent channel, a refusal and a
    // thrown transport all read as "nothing is ignored" and the tree renders
    // exactly as it did before the feature existed. A reload re-asks because a
    // refresh is the reader's way of saying the working tree changed.
    useEffect(() => {
      const read = workspace?.ignored;
      if (sessionId === undefined || workspace === undefined || typeof read !== "function") {
        setIgnoredEntries([]);
        return;
      }
      const controller = new AbortController();
      let alive = true;
      void Promise.resolve()
        .then(() => read.call(workspace, sessionId, controller.signal))
        .then(outcome => {
          if (!alive) return;
          setIgnoredEntries(outcome.ok ? outcome.entries : []);
        })
        .catch(() => {
          if (alive) setIgnoredEntries([]);
        });
      return () => {
        alive = false;
        controller.abort();
      };
    }, [sessionId, workspace, reloadToken]);

    const toggleIgnored = useCallback((): void => {
      setShowIgnored(current => {
        const next = !current;
        writeShowIgnored(next, paneWidthStorage());
        return next;
      });
    }, []);

    /**
     * Open the context menu for one row, or for the tree's blank area.
     *
     * The absolute path is asked for here rather than when the row is copied:
     * the menu has to know whether that action can run before it paints, and a
     * menu that offers a row which then fails is worse than one that says why.
     * The answer is allowed to arrive late; the menu opens immediately and the
     * row enables itself when it lands.
     */
    const openContextMenu = useCallback(
      (row: ContextMenuRow | undefined, anchor: ContextMenuAnchor, trigger?: HTMLElement): void => {
        // A create lands beside the row that was right-clicked: a directory row
        // names itself, a file row names its own directory, and the blank area
        // names the workspace root. The root is `""`, which is a real answer.
        const createParent = row === undefined ? "" : row.kind === "directory" ? row.path : parentDirectory(row.path);
        setContextMenu({ row, anchor, absolutePath: undefined, trigger, createParent });
        if (row === undefined || workspace === undefined) return;
        const target = row.path;
        void workspace.info(sessionId ?? "", target).then(outcome => {
          setContextMenu(current => {
            // A menu that closed, or moved to another row, must not adopt this
            // answer: the absolute path belongs to the row that asked.
            if (current === null || current.row?.path !== target) return current;
            return { ...current, absolutePath: outcome.ok ? outcome.info.absolutePath : undefined };
          });
        });
      },
      [sessionId, workspace],
    );

    const closeContextMenu = useCallback((): void => setContextMenu(null), []);

    /**
     * Open the strip's menu for one tab.
     *
     * The tab is named by its key, which the strip hands back verbatim, so the
     * menu addresses the tab the reader pressed rather than whichever one
     * happens to be active. Actions read the strip again when they run: the
     * menu can stay open while another gesture reorders it.
     */
    const openTabMenu = useCallback((key: string, anchor: MenuAnchor, trigger: HTMLElement): void => {
      setTabMenu({ key, anchor, trigger });
    }, []);

    const closeTabMenu = useCallback((): void => setTabMenu(null), []);

    /**
     * What the composer can take right now, read when a menu opens.
     *
     * `undefined` is a real answer: a host without the input plane never hands
     * the view `inputActions`, and the rows then say so instead of offering a
     * click that cannot land.
     */
    const referenceTarget = useCallback((): ReferenceTargetFacts | undefined => {
      const actions = props.inputActions;
      if (sessionId === undefined || actions === undefined) return undefined;
      const facade = resolveReference?.(sessionId);
      return {
        session: true,
        insertReference: typeof facade?.insertReference === "function",
      };
    }, [props.inputActions, resolveReference, sessionId]);

    /**
     * Write one path into the composer as a structured reference.
     *
     * The span comes from the composer's own capture, the chip from the session
     * facade, and plain text is the last resort. The facade is resolved per
     * click rather than per mount because it throws once the session's
     * generation is released, and a stale closure would keep throwing at a
     * composer that no longer exists.
     */
    const insertReferenceFor = useCallback(
      (path: string, name: string, kind: "file" | "directory"): void => {
        const actions = props.inputActions;
        if (sessionId === undefined || actions === undefined) {
          announce(t("notice.referenceFailed"), "error");
          return;
        }
        const facade = resolveReference?.(sessionId);
        const payload = fsReferencePayload(path, name, kind);
        const result: FsInsertionResult = insertFsReference(
          {
            captureSpan: () => {
              const span = actions.captureInsertion?.();
              return span === undefined ? undefined : { start: span.start, end: span.end, draftRev: span.draftRev };
            },
            insertReference: (insert, span) => facade?.insertReference?.(insert, span) ?? false,
            insertText: (text, span) => actions.insertText?.(text, span) ?? false,
          },
          payload,
        );
        if (result === "failed") {
          announce(t("notice.referenceFailed"), "error");
          facade?.notify?.("error", t("notice.referenceFailed"));
          return;
        }
        facade?.focus?.();
        // Only the plain-text channel is worth a notice: the chip is visible in
        // the composer, and a toast for the normal case would be noise.
        if (result === "text") announce(t("notice.referenced").replace("{name}", payload.label), "ok");
      },
      [announce, props.inputActions, resolveReference, sessionId, t],
    );

    /**
     * Run one row of the strip's menu.
     *
     * The menu closes first: closing tabs republishes the strip under it, and a
     * menu anchored to a tab that just left would point at nothing.
     */
    const runTabMenuAction = useCallback(
      (id: string): void => {
        const menu = tabMenu;
        setTabMenu(null);
        if (menu === null) return;
        if (id === TAB_MENU_ACTION.reference) {
          // The strip is re-read: the menu can stay open while another gesture
          // reorders it, and the tab it named may be gone by now.
          const panel = stack.snapshot().panels.find(candidate => candidate.key === menu.key);
          if (panel === undefined) return;
          // A tab is a file unless the tree says otherwise. The lookup is the
          // only place the kind is known, and a tab opened from search may not
          // be in a loaded level at all, which is why the fallback is a file.
          const entry = listedEntries(levelsRef.current).find(candidate => candidate.path === panel.path);
          insertReferenceFor(panel.path, referenceLabel(panel.path), entry?.kind === "directory" ? "directory" : "file");
          return;
        }
        if (id === TAB_MENU_ACTION.close) {
          requestClose(menu.key);
          return;
        }
        const scope = id === TAB_MENU_ACTION.closeOthers ? "others" : id === TAB_MENU_ACTION.closeRight ? "right" : undefined;
        if (scope === undefined) return;
        closeSequence(closeBatch(stack.snapshot().panels, menu.key, scope));
      },
      [closeSequence, insertReferenceFor, requestClose, stack, tabMenu],
    );

    // The Escape handler reads this flag rather than the state, so the menu
    // closing never re-registers the document listener.
    contextMenuOpen.current = contextMenu !== null;
    tabMenuOpen.current = tabMenu !== null;

    // The remote rows, rebuilt whenever the snapshot, the row or the absolute
    // path changes. `absolutePath` arrives asynchronously from `info`, so this
    // is what turns the row from disabled to enabled a beat after the menu
    // opens, without reopening it.
    const remoteLinks: readonly RemoteLink[] = useMemo(
      () =>
        buildRemoteLinks({
          remotes,
          root: gitRoot,
          absolutePath: contextMenu?.absolutePath,
          kind: contextMenu?.row?.kind ?? "file",
          head,
        }),
      [contextMenu?.absolutePath, contextMenu?.row?.kind, gitRoot, head, remotes],
    );

    /** The sentence one reveal failure paints. */
    const revealFailureText = useCallback(
      (error: WorkspaceError): string =>
        t("notice.revealFailed").replace("{reason}", t(`notice.reveal.${error.code}`)),
      [t],
    );

    /**
     * Run one menu action.
     *
     * The menu closes first: every action here is a one-shot, and leaving the
     * card up while a clipboard write or a spawn settles would make the reader
     * wonder whether the click landed.
     */
    const runMenuAction = useCallback(
      (id: string): void => {
        const menu = contextMenu;
        setContextMenu(null);
        if (menu === null) return;

        // The two create rows are the only actions the blank area offers, and
        // the only ones that do not need a row: their target is the directory
        // the menu was built for.
        if (id === MENU_ACTION.createFile || id === MENU_ACTION.createFolder) {
          const parent = menu.createParent;
          if (parent === undefined) return;
          setNamePrompt({
            kind: id === MENU_ACTION.createFolder ? "directory" : "file",
            parent,
            error: undefined,
            busy: false,
          });
          return;
        }

        const row = menu.row;
        if (row === undefined) return;

        // Every remote row shares one prefix; the URL is looked up in the list
        // this menu was built from, so a remote renamed between the open and the
        // click simply finds nothing and does nothing.
        if (id.startsWith(`${MENU_ACTION.copyRemote}.`)) {
          const link = remoteLinks.find(candidate => candidate.id === id);
          if (link === undefined) return;
          void writeClipboard(link.url).then(ok => {
            announce(
              ok ? t("notice.copiedRemote").replace("{remote}", link.label) : t("notice.copyFailed"),
              ok ? "ok" : "error",
            );
          });
          return;
        }

        if (id === MENU_ACTION.copyRelative) {
          void writeClipboard(row.path).then(ok => {
            announce(ok ? t("notice.copiedRelative") : t("notice.copyFailed"), ok ? "ok" : "error");
          });
          return;
        }
        if (id === MENU_ACTION.copyAbsolute) {
          const absolute = menu.absolutePath;
          if (absolute === undefined) return;
          void writeClipboard(absolute).then(ok => {
            announce(ok ? t("notice.copiedAbsolute") : t("notice.copyFailed"), ok ? "ok" : "error");
          });
          return;
        }
        if (id === MENU_ACTION.addBookmark) {
          setBookmarkPicker({
            mode: "add",
            target: { name: row.name, path: row.path, kind: row.kind },
          });
          return;
        }
        if (id === MENU_ACTION.reference) {
          insertReferenceFor(row.path, row.name, row.kind);
          return;
        }
        if (id !== MENU_ACTION.reveal) return;
        if (workspace === undefined) {
          announce(revealFailureText({ code: "unsupported", message: "" }), "error");
          return;
        }
        void workspace.reveal(sessionId ?? "", row.path).then(outcome => {
          if (!outcome.ok) {
            announce(revealFailureText(outcome.error), "error");
            return;
          }
          const manager = t(`menu.manager.${capabilities?.fileManager ?? "directory"}`);
          announce(t("notice.revealed").replace("{manager}", manager), "ok");
        });
      },
      [announce, capabilities, contextMenu, insertReferenceFor, remoteLinks, revealFailureText, sessionId, t, workspace],
    );

    /**
     * Create one entry and show it.
     *
     * The parent is re-read rather than patched into the level ledger: the levels
     * are the host's answer, and a locally spliced row would disagree with the
     * next refresh about order and status. A file then opens, because creating one
     * is a request to write in it; a folder expands and takes the cursor, because
     * the reader's next move is to put something in it.
     * @param name - the validated name from the card.
     */
    const submitCreate = useCallback(
      (name: string): void => {
        const prompt = namePrompt;
        if (prompt === null) return;
        if (workspace === undefined || workspace.create === undefined) {
          setNamePrompt({ ...prompt, error: t("prompt.error.unsupported"), busy: false });
          return;
        }
        const sid = sessionId;
        if (sid === undefined) {
          setNamePrompt({ ...prompt, error: t("prompt.error.no-workspace"), busy: false });
          return;
        }
        setNamePrompt({ ...prompt, busy: true, error: undefined });
        void workspace.create(sid, prompt.parent, name, prompt.kind).then(outcome => {
          if (!outcome.ok) {
            setNamePrompt(current =>
              current === null ? current : { ...current, busy: false, error: t(`prompt.error.${outcome.error.code}`) },
            );
            return;
          }
          setNamePrompt(null);
          const created = outcome.path;
          if (files !== undefined) void loadLevel(prompt.parent, sid, files);
          if (prompt.kind === "file") {
            stack.open(created);
            announce(t("notice.createdFile"), "ok");
            return;
          }
          // A folder is a place to put things: expand it, list it, and leave the
          // cursor on it so the next keystroke acts on what was just made.
          setExpanded(previous => new Set(previous).add(created));
          if (files !== undefined) void loadLevel(created, sid, files);
          setEntryFocus({ path: created });
          announce(t("notice.createdFolder"), "ok");
        });
      },
      [announce, files, loadLevel, namePrompt, sessionId, stack, t, workspace],
    );

    const cancelCreate = useCallback((): void => setNamePrompt(null), []);

    // The menu's rows, rebuilt from the state it opened with. A blank-area menu
    // has no row, so this is also where its create targets come from.
    const menuEntries: readonly ContextMenuEntry[] = useMemo(
      () =>
        contextMenu === null
          ? []
          : buildContextMenu(
              {
                row: contextMenu.row,
                notices: { workspace: workspace !== undefined },
                capabilities,
                absolutePath: contextMenu.absolutePath,
                createParent: contextMenu.createParent,
                // A row is the only thing a remote link can address, so the
                // blank area gets no links at all rather than a stale list.
                remoteLinks: contextMenu.row === undefined ? undefined : remoteLinks,
                bookmarkTarget:
                  contextMenu.row === undefined
                    ? undefined
                    : {
                        name: contextMenu.row.name,
                        path: contextMenu.row.path,
                        kind: contextMenu.row.kind,
                      },
                inputTarget: referenceTarget(),
              },
              t,
            ),
      [capabilities, contextMenu, referenceTarget, remoteLinks, t, workspace],
    );

    // The strip's rows. Rebuilt from the live snapshot so a tab that closed
    // while the menu was up cannot be acted on, and so the batch rows describe
    // the strip the reader is looking at.
    const tabMenuEntries: readonly ContextMenuEntry[] = useMemo(
      () =>
        tabMenu === null
          ? []
          : buildTabMenu({ panels: panels.panels, key: tabMenu.key, inputTarget: referenceTarget() }, t),
      [panels.panels, referenceTarget, t, tabMenu],
    );
    // Opening a result does what opening a row in the tree does, plus the
    // reveal the tree would already have: the ancestors open so the file keeps
    // a row once the search ends.
    const openSearchResult = useCallback(
      (path: string): void => {
        const entry = listedEntries(levelsRef.current).find(candidate => candidate.path === path);
        revealAncestors(path, entry?.kind);
        if (entry?.kind === "directory") {
          setExpanded(previous => new Set(previous).add(path));
          return;
        }
        stack.open(path);
      },
      [revealAncestors, stack],
    );

    const activateSearchRow = useCallback((): void => {
      if (cursorPath.current !== undefined) openSearchResult(cursorPath.current);
    }, [openSearchResult]);

    /**
     * Empty the bar and give the keyboard back to the tree.
     *
     * The bar itself stays: it is part of the pane's furniture now, and a query
     * is what turns on the result list, not the bar's existence.
     */
    const clearSearch = useCallback((): void => {
      setSearch("");
      setSearchResults([]);
      setSearchOrigin(null);
      setSearchBusy(false);
      // The keyboard goes back where the search took it from.
      const scroller = document.querySelector<HTMLElement>('[data-testid="fs-tree-scroll"]');
      scroller?.focus({ preventScroll: true });
    }, []);

    // Escape empties the query before it is read as "return to the composer": a
    // reader backing out of a search wants the tree, not the transcript. It only
    // claims the key while there is something to back out of, or it would eat
    // the composer's own Escape on every visit to the panel.
    useEffect(() => {
      if (search === "" || typeof document === "undefined") return;
      const onKeyDown = (event: KeyboardEvent): void => {
        if (event.key !== "Escape" || event.isComposing || event.defaultPrevented) return;
        if (pendingCloseRef.current !== null || hasOpenModal(document)) return;
        event.preventDefault();
        event.stopPropagation();
        clearSearch();
      };
      document.addEventListener("keydown", onKeyDown, true);
      return () => document.removeEventListener("keydown", onKeyDown, true);
    }, [search, clearSearch]);

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
          <BookmarkBar
            tree={bookmarks}
            t={t}
            onOpenFile={openBookmarkFile}
            onOpenFolder={openBookmarkFolder}
            onCreateGroup={parentId => setBookmarkPrompt({ mode: "group", parentId })}
            onRename={node => setBookmarkPrompt({ mode: "rename", node })}
            onRemove={removeBookmark}
            onMove={node => setBookmarkPicker({ mode: "move", node })}
            onReorder={reorderBookmarks}
          />
          <div className="fx-head-meta">
            {rootLevel?.status === "ready" ? (
              <span>
                <b>{rootLevel.nodes.length}</b> {t("head.entries")}
              </span>
            ) : null}
            {ignoredEntries.length === 0 ? null : (
              <button
                type="button"
                className="fx-btn"
                data-testid="fs-toggle-ignored"
                data-on={showIgnored ? "true" : "false"}
                aria-pressed={showIgnored}
                title={t(showIgnored ? "head.hideIgnored" : "head.showIgnored")}
                aria-label={t(showIgnored ? "head.hideIgnored" : "head.showIgnored")}
                onClick={toggleIgnored}
              >
                <EyeIcon open={showIgnored} />
              </button>
            )}
            <button
              type="button"
              className="fx-btn"
              data-testid="fs-search-open"
              data-open={search === "" ? "false" : "true"}
              title={t("search.open")}
              aria-label={t("search.open")}
              aria-pressed={search !== ""}
              onClick={() => {
                if (search !== "") clearSearch();
                else askSearchFocus();
              }}
            >
              <SearchIcon />
            </button>
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

        {notice === null ? null : (
          <div className="fx-notice" role="status" data-tone={notice.tone} data-testid="fx-notice">
            {notice.text}
          </div>
        )}

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
                <TreeSearchBox
                  t={t}
                  value={search}
                  origin={searchOrigin}
                  count={searchResults.length}
                  busy={searchBusy}
                  onChange={setSearch}
                  onStep={delta => askCursor(undefined, delta, false)}
                  onActivate={activateSearchRow}
                  onClose={clearSearch}
                  focusSignal={focusSignal}
                />
                <TreeBody
                  rows={shownRows}
                  selectedPath={activeRevision === undefined ? activePath : undefined}
                  entryFocus={searching ? undefined : entryFocus}
                  t={t}
                  onToggle={toggleDirectory}
                  onSelect={path => (searching ? openSearchResult(path) : stack.open(path))}
                  onRetry={retryDirectory}
                  onEntryFocusSettled={releaseEntryFocus}
                  onContextMenu={openContextMenu}
                  cursorRequest={cursorRequest}
                  onCursorMove={path => {
                    cursorPath.current = path;
                  }}
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
                  onTabMenu={openTabMenu}
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
                            locate={sessionLocator}
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

        {contextMenu === null ? null : (
          <ContextMenu
            entries={menuEntries}
            anchor={contextMenu.anchor}
            onSelect={runMenuAction}
            onClose={closeContextMenu}
            {...(contextMenu.trigger === undefined
              ? {}
              : { returnFocus: () => contextMenu.trigger ?? null })}
          />
        )}

        {tabMenu === null || tabMenuEntries.length === 0 ? null : (
          <ContextMenu
            entries={tabMenuEntries}
            anchor={tabMenu.anchor}
            onSelect={runTabMenuAction}
            onClose={closeTabMenu}
            returnFocus={() => tabMenu.trigger}
          />
        )}

        {namePrompt === null ? null : (
          <NamePrompt
            kind={namePrompt.kind}
            parent={namePrompt.parent}
            t={t}
            error={namePrompt.error}
            busy={namePrompt.busy}
            onSubmit={submitCreate}
            onCancel={cancelCreate}
          />
        )}

        {bookmarkPicker === null ? null : (
          <BookmarkPicker
            tree={bookmarks}
            target={bookmarkPicker.mode === "add" ? bookmarkPicker.target : undefined}
            t={t}
            mode={bookmarkPicker.mode}
            {...(bookmarkPicker.mode === "move" ? { node: bookmarkPicker.node } : {})}
            onCommit={next => {
              const mode = bookmarkPicker.mode;
              persistBookmarks(next);
              setBookmarkPicker(null);
              announce(t(mode === "move" ? "bookmarks.moved" : "bookmarks.added"), "ok");
            }}
            onClose={() => setBookmarkPicker(null)}
          />
        )}

        {bookmarkPrompt === null ? null : (
          <NamePrompt
            kind="directory"
            parent=""
            t={t}
            initialName={bookmarkPrompt.mode === "rename" ? bookmarkPrompt.node.name : t("bookmarks.newGroup")}
            titleKey={bookmarkPrompt.mode === "rename" ? "bookmarks.rename" : "bookmarks.newGroup"}
            onSubmit={name => {
              const prompt = bookmarkPrompt;
              setBookmarkPrompt(null);
              try {
                if (prompt.mode === "rename") {
                  persistBookmarks(renameNode(bookmarks, prompt.node.id, name));
                  announce(t("bookmarks.renamed"), "ok");
                  return;
                }
                const created = makeNode("group", {
                  id: newBookmarkId(),
                  name,
                  createdAt: Date.now(),
                });
                persistBookmarks(insertNode(bookmarks, prompt.parentId, created));
                announce(t("bookmarks.groupCreated"), "ok");
              } catch {
                announce(t("bookmarks.saveFailed"), "error");
              }
            }}
            onCancel={() => setBookmarkPrompt(null)}
          />
        )}

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
