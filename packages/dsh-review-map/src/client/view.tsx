/**
 * The review map: a change set as a triage list, with one file's detail beside it.
 *
 * Three bands, top to bottom: the repository's identity and the range being
 * compared, two readings (source lines, files), then the split region. The
 * readings are above the list because they answer "is this review big" before
 * the reader has to scroll, and the list is sorted by churn for the same reason.
 *
 * The split region is one grid that changes its column count rather than two
 * layouts: with the panel closed the list takes the whole width, and with it open
 * the list keeps a readable minimum and the panel takes the rest. The list is
 * never unmounted, so a reader comparing two files does not lose their place.
 *
 * The view owns only the reading state: which range is selected, which row is
 * selected, which file's detail is open, and the last answer for each. Every
 * decision about what a row or a diff line says is in `model.ts`, so the awkward
 * cases are tested without a DOM.
 *
 * Three behaviours are worth naming here because they look like details and are
 * not:
 *
 * - Request counters, not booleans. Switching range or file twice quickly
 *   produces answers that can arrive in either order; only the newest may be
 *   shown, and a late answer for a superseded request is dropped rather than
 *   rendered. The list and the panel have separate counters because they are
 *   separate questions.
 * - A session change resets the range and closes the panel. A new conversation
 *   is a new review: keeping the previous range would show one session's branch
 *   comparison under another session's name, and keeping the panel open would
 *   show a file that is not in the new list.
 * - Roving tabindex. The list is one tab stop, not one per row: a reader tabbing
 *   past the panel should not walk three hundred files.
 *
 * The root carries `data-conversation-composer-overlay`, the attribute the host
 * keys on to give the conversation view a definite height and to float the
 * composer over it. Without it the panel collapses to its content height.
 */
import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type ReactElement } from "react";

import { createHttpRuntime, type ReviewRuntime } from "./runtime.ts";
import { loadMapChunk, type MapChunkModule } from "./chunk-loader.ts";
import type { MapHandle } from "./map/contract.ts";
import {
  buildMapData,
  churnOf,
  churnText,
  diffRows,
  fill,
  formatBytes,
  indexReadings,
  shortRef,
  signedCount,
  sortFiles,
  splitPath,
  statusMark,
  summaryOf,
} from "./model.ts";
import type {
  ChangedFile,
  ChangedFileStatus,
  FileDiff,
  ReviewErrorCode,
  ReviewIndex,
  ReviewScope,
  ReviewSnapshot,
} from "../shared.ts";

/** Owner props the host passes to a `conversation.view` entry. */
export interface ConversationViewProps {
  readonly sessionId?: string;
}

/** Strings the view renders, bound through the locale seat by the entry. */
export interface ReviewMapViewStrings {
  readonly title: string;
  readonly repoFallback: string;
  readonly scopeWorktree: string;
  readonly scopeBranch: string;
  readonly refresh: string;
  readonly statLines: string;
  readonly statFiles: string;
  /**
   * The map's copy.
   *
   * Optional because the map is an addition to a view that already worked, and a
   * harness written before it should not have to grow eight keys to keep
   * compiling. The entry always supplies them; the fallbacks below are the
   * English words, which is the same thing the dictionaries say.
   */
  readonly statNewImports?: string;
  readonly statDroppedImports?: string;
  readonly indexPartial?: string;
  readonly unresolved?: string;
  readonly unresolvedHint?: string;
  readonly mapTitle?: string;
  readonly mapLoading?: string;
  readonly mapEmpty?: string;
  readonly mapError?: string;
  readonly uncommitted: string;
  readonly listMetaWorktree: string;
  readonly listMetaBranch: string;
  readonly listSort: string;
  readonly listEmpty: string;
  readonly markBinary: string;
  readonly markUntracked: string;
  readonly markConflicted: string;
  readonly renameHint: string;
  readonly statusAdded: string;
  readonly statusModified: string;
  readonly statusDeleted: string;
  readonly statusRenamed: string;
  readonly statusCopied: string;
  readonly statusTypeChanged: string;
  readonly statusUntracked: string;
  readonly statusConflicted: string;
  readonly statusUnknown: string;
  readonly errorNotARepo: string;
  readonly errorNoBase: string;
  readonly errorNoSession: string;
  readonly errorTooLarge: string;
  readonly errorConflicted: string;
  readonly errorUnreadable: string;
  readonly errorUnknown: string;
  readonly loading: string;
  readonly empty: string;
  readonly emptyHint: string;
  readonly detailClose: string;
  readonly detailTruncated: string;
  readonly detailBinary: string;
  readonly detailUnknownSize: string;
  readonly detailEmpty: string;
  readonly detailErrorConflicted: string;
  readonly detailErrorTooLarge: string;
  readonly detailErrorUnreadable: string;
  readonly detailErrorBadRequest: string;
  readonly detailErrorUnknown: string;
}

/** What the entry hands the view factory. */
export interface ReviewMapViewOptions {
  readonly strings: ReviewMapViewStrings;
  /** The host seam; absent means the real HTTP runtime. */
  readonly runtime?: ReviewRuntime;
  /**
   * How the map chunk is fetched.
   *
   * Injected rather than imported directly so a test can hand over a fake
   * renderer: the real one goes through the loader's `require.async`, which only
   * exists inside the host's module factory, and a test that needed it would be
   * testing the loader rather than the view.
   */
  readonly mapLoader?: () => Promise<MapChunkModule>;
}

/** The two ranges a review can be about. */
type ScopeKind = "worktree" | "branch";

/** What the list is showing right now. */
type Phase =
  | { readonly kind: "idle" }
  | { readonly kind: "loading" }
  | { readonly kind: "ready"; readonly snapshot: ReviewSnapshot }
  | { readonly kind: "error"; readonly code: ReviewErrorCode };

/**
 * What the map's index is doing right now.
 *
 * A phase of its own rather than a field on the list's: the index is the slow
 * half and the list must not wait for it. `error` is separate from `idle` for
 * the same reason the list's is — a failed index and a session with no index are
 * different sentences.
 */
type IndexPhase =
  | { readonly kind: "idle" }
  | { readonly kind: "loading" }
  | { readonly kind: "ready"; readonly index: ReviewIndex }
  | { readonly kind: "error"; readonly code: ReviewErrorCode };

/** What the detail panel is showing right now. */
type DetailPhase =
  | { readonly kind: "loading"; readonly path: string }
  | { readonly kind: "ready"; readonly diff: FileDiff }
  | { readonly kind: "error"; readonly code: ReviewErrorCode };

/**
 * The status word for one row's accessible name.
 *
 * The letter in the badge is not enough on its own: a screen reader reads "M",
 * and a reader who does not know git's alphabet has nothing to go on.
 * @param status - the change status.
 * @param strings - the bound copy.
 * @returns the word for that status.
 */
function statusWord(status: ChangedFileStatus, strings: ReviewMapViewStrings): string {
  switch (status) {
    case "added":
      return strings.statusAdded;
    case "modified":
      return strings.statusModified;
    case "deleted":
      return strings.statusDeleted;
    case "renamed":
      return strings.statusRenamed;
    case "copied":
      return strings.statusCopied;
    case "type-changed":
      return strings.statusTypeChanged;
    case "untracked":
      return strings.statusUntracked;
    case "conflicted":
      return strings.statusConflicted;
    default:
      return strings.statusUnknown;
  }
}

/**
 * The sentence for one list error code.
 *
 * A code this build does not know falls back to a generic sentence rather than
 * rendering nothing: a blank panel reads as "no changes", which is the one thing
 * an error must not look like.
 * @param code - the wire error code.
 * @param strings - the bound copy.
 * @returns the sentence to show.
 */
function errorText(code: ReviewErrorCode, strings: ReviewMapViewStrings): string {
  switch (code) {
    case "not-a-repo":
      return strings.errorNotARepo;
    case "no-base":
      return strings.errorNoBase;
    case "no-session":
      return strings.errorNoSession;
    case "too-large":
      return strings.errorTooLarge;
    case "conflicted":
      return strings.errorConflicted;
    case "unreadable":
      return strings.errorUnreadable;
    default:
      return strings.errorUnknown;
  }
}

/**
 * The sentence for one detail error code.
 *
 * Separate from the list's vocabulary on purpose: "this file is in conflict" and
 * "this workspace is not a repository" are different answers to different
 * questions, and one dictionary entry for both would have to be vague enough to
 * cover neither.
 * @param code - the wire error code.
 * @param strings - the bound copy.
 * @returns the sentence to show.
 */
function detailErrorText(code: ReviewErrorCode, strings: ReviewMapViewStrings): string {
  switch (code) {
    case "conflicted":
      return strings.detailErrorConflicted;
    case "too-large":
      return strings.detailErrorTooLarge;
    case "unreadable":
      return strings.detailErrorUnreadable;
    case "bad-request":
      return strings.detailErrorBadRequest;
    default:
      return strings.detailErrorUnknown;
  }
}

/**
 * The label that replaces a row's line counts, when there are none to show.
 * @param note - the churn note.
 * @param strings - the bound copy.
 * @returns the label, or null when the row prints numbers instead.
 */
function noteText(note: "binary" | "untracked" | "conflicted" | null, strings: ReviewMapViewStrings): string | null {
  if (note === "binary") return strings.markBinary;
  if (note === "untracked") return strings.markUntracked;
  if (note === "conflicted") return strings.markConflicted;
  return null;
}

/** What one list row needs from the view. */
interface RowProps {
  readonly file: ChangedFile;
  readonly strings: ReviewMapViewStrings;
  readonly selected: boolean;
  readonly hovered: boolean;
  readonly onSelect: (path: string) => void;
  readonly onOpen: (path: string) => void;
  readonly onHover: (path: string | null) => void;
  readonly onKey: (event: KeyboardEvent<HTMLElement>, path: string) => void;
}

/**
 * One row of the change list.
 *
 * The row is a `div` with a button role rather than a `button`, because it holds
 * three columns of its own and a button would put them all in one accessible
 * name. The keyboard contract is spelled out in `onKey` on the container.
 * @param props - the file, its strings, its selection and the handlers.
 * @returns the row.
 */
function ReviewRow({ file, strings, selected, hovered, onSelect, onOpen, onHover, onKey }: RowProps): ReactElement {
  const parts = splitPath(file.path);
  const churn = churnOf(file);
  const note = noteText(churn.note, strings);
  const deleted = file.status === "deleted";
  // The old path has no column of its own, so it goes in the row's accessible
  // name: without it a reader cannot tell what a rename renamed.
  const label = file.oldPath === undefined ? undefined : fill(strings.renameHint, { path: file.oldPath });
  return (
    <div
      data-testid="review-row"
      data-path={file.path}
      data-status={file.status}
      data-deleted={deleted ? "true" : undefined}
      data-selected={selected ? "true" : "false"}
      data-hovered={hovered ? "true" : undefined}
      role="option"
      aria-selected={selected}
      // Roving tabindex: the list is one tab stop, and the arrow keys move
      // within it. A tab stop per row would make tabbing past the panel walk
      // every file in the workspace.
      tabIndex={selected ? 0 : -1}
      title={label}
      aria-label={label}
      onClick={() => {
        onSelect(file.path);
        onOpen(file.path);
      }}
      onKeyDown={event => onKey(event, file.path)}
      // `pointerenter`/`pointerleave` rather than `mouseover`/`mouseout`: the
      // latter bubble again for every child the pointer crosses, so a row with
      // three spans would report four entries for one visit.
      onPointerEnter={() => onHover(file.path)}
      onPointerLeave={() => onHover(null)}
    >
      <span data-rm="mark" data-status={file.status} title={statusWord(file.status, strings)}>
        {statusMark(file.status)}
      </span>
      <span data-rm="path">
        {parts.dir === "" ? null : <span data-rm="path-dir">{parts.dir}</span>}
        <span data-rm="path-name" className={deleted ? "rm-struck" : undefined}>
          {parts.name}
        </span>
      </span>
      <span data-rm="churn" data-note={churn.note ?? undefined}>
        {note ?? churnText(churn)}
      </span>
    </div>
  );
}

/** What the detail panel needs from the view. */
interface DetailProps {
  readonly path: string;
  readonly file: ChangedFile | undefined;
  readonly phase: DetailPhase;
  readonly strings: ReviewMapViewStrings;
  readonly onClose: () => void;
  readonly bodyRef: { current: HTMLDivElement | null };
}

/**
 * The detail panel: one file's header and its diff.
 * @param props - the file, its state, its strings and the close handler.
 * @returns the panel.
 */
function DetailPanel({ path, file, phase, strings, onClose, bodyRef }: DetailProps): ReactElement {
  const churn = file === undefined ? undefined : churnOf(file);
  const note = churn === undefined ? null : noteText(churn.note, strings);
  return (
    <div data-testid="review-detail" data-rm="detail">
      <div data-rm="detail-header">
        <span data-rm="detail-path">{path}</span>
        {file === undefined ? null : <span data-rm="detail-status">{statusWord(file.status, strings)}</span>}
        {churn === undefined || note !== null ? null : <span data-rm="detail-churn">{churnText(churn)}</span>}
        <button type="button" data-rm="detail-close" aria-label={strings.detailClose} onClick={onClose}>
          ×
        </button>
      </div>
      <div data-rm="detail-body" ref={bodyRef}>
        {phase.kind === "loading" ? <p data-rm="detail-loading">{strings.loading}</p> : null}
        {phase.kind === "error" ? <p data-rm="detail-error">{detailErrorText(phase.code, strings)}</p> : null}
        {phase.kind === "ready" ? (
          <DetailBody diff={phase.diff} strings={strings} />
        ) : null}
      </div>
    </div>
  );
}

/**
 * One file's diff, in whichever shape the host answered with.
 * @param props - the diff and the bound copy.
 * @returns the body.
 */
function DetailBody({ diff, strings }: { readonly diff: FileDiff; readonly strings: ReviewMapViewStrings }): ReactElement {
  if (diff.kind === "binary") {
    const size = diff.bytes === null ? strings.detailUnknownSize : formatBytes(diff.bytes);
    return <p data-rm="detail-binary">{fill(strings.detailBinary, { size })}</p>;
  }
  const rows = diffRows(diff);
  if (rows.length === 0) return <p data-rm="detail-empty">{strings.detailEmpty}</p>;
  return (
    <>
      {diff.kind === "text" && diff.truncated ? <p data-rm="detail-truncated">{strings.detailTruncated}</p> : null}
      <div data-rm="diff">
        {rows.map(row =>
          row.kind === "hunk" ? (
            <div key={`hunk:${row.header}`} data-rm="diff-hunk">
              {row.header}
            </div>
          ) : (
            <div key={row.key} data-rm="diff-line" data-kind={row.lineKind}>
              <span data-rm="diff-old">{row.oldLine ?? ""}</span>
              <span data-rm="diff-new">{row.newLine ?? ""}</span>
              <span data-rm="diff-sign">{row.sign}</span>
              <span data-rm="diff-text">{row.text}</span>
            </div>
          ),
        )}
      </div>
    </>
  );
}

/**
 * Build the conversation view component.
 *
 * @param options - the strings the entry resolved, and the host seam.
 * @returns a component the slot registry can mount.
 */
export function createReviewMapView({
  strings,
  runtime = createHttpRuntime(),
  mapLoader = loadMapChunk,
}: ReviewMapViewOptions): (props: ConversationViewProps) => ReactElement {
  return function ReviewMapView({ sessionId }: ConversationViewProps): ReactElement {
    const [scopeKind, setScopeKind] = useState<ScopeKind>("worktree");
    const [phase, setPhase] = useState<Phase>({ kind: "idle" });
    const [selectedPath, setSelectedPath] = useState<string | undefined>(undefined);
    const [openPath, setOpenPath] = useState<string | undefined>(undefined);
    const [detailPhase, setDetailPhase] = useState<DetailPhase | undefined>(undefined);
    const [indexPhase, setIndexPhase] = useState<IndexPhase>({ kind: "idle" });
    // The path the pointer is over, from either side of the linkage. One state
    // for both directions: a row hovered in the list and a card hovered on the
    // map are the same fact, and two states would let them disagree.
    const [hoveredPath, setHoveredPath] = useState<string | null>(null);
    // The identity of the newest list request. A response whose id is not this
    // one is an answer to a question the reader has already moved on from.
    const listRequest = useRef(0);
    // The same, for the panel: opening two files quickly must not let the first
    // answer land on the second file's panel.
    const detailRequest = useRef(0);
    // The same, for the index: it is the slowest of the three, so it is the one
    // most likely to answer after the reader has moved on.
    const indexRequest = useRef(0);
    // The element the map chunk draws into, and the handle it handed back.
    const mapHost = useRef<HTMLDivElement | null>(null);
    const mapHandle = useRef<MapHandle | null>(null);
    // A session change resets the range, so the reset and the load have to be
    // one effect: two effects would let the first load run against the old range.
    const lastSession = useRef<string | undefined>(sessionId);
    const detailBody = useRef<HTMLDivElement | null>(null);

    const load = useCallback(
      (session: string, kind: ScopeKind): void => {
        listRequest.current += 1;
        const mine = listRequest.current;
        setPhase({ kind: "loading" });
        const scope: ReviewScope = kind === "branch" ? { kind: "branch" } : { kind: "worktree" };
        runtime.loadSnapshot(session, scope).then(
          result => {
            if (listRequest.current !== mine) return;
            setPhase(result.ok ? { kind: "ready", snapshot: result.snapshot } : { kind: "error", code: result.error.code });
          },
          () => {
            // A transport failure is not a domain answer: the host did not say
            // "no changes", it failed to answer at all.
            if (listRequest.current !== mine) return;
            setPhase({ kind: "error", code: "unreadable" });
          },
        );
      },
      [runtime],
    );

    const openDetail = useCallback(
      (session: string, kind: ScopeKind, path: string): void => {
        detailRequest.current += 1;
        const mine = detailRequest.current;
        setOpenPath(path);
        setDetailPhase({ kind: "loading", path });
        const scope: ReviewScope = kind === "branch" ? { kind: "branch" } : { kind: "worktree" };
        runtime.loadDiff(session, scope, path).then(
          result => {
            if (detailRequest.current !== mine) return;
            setDetailPhase(result.ok ? { kind: "ready", diff: result.diff } : { kind: "error", code: result.error.code });
          },
          () => {
            if (detailRequest.current !== mine) return;
            setDetailPhase({ kind: "error", code: "unreadable" });
          },
        );
      },
      [runtime],
    );

    /**
     * Ask for the structure index.
     *
     * Separate from `load` because it answers a different question and is
     * allowed to fail on its own: a review whose map cannot be drawn is still a
     * usable review, so an index failure never touches the list's phase.
     * @param session - the session whose workspace to index.
     * @param kind - which comparison to index.
     */
    const loadIndex = useCallback(
      (session: string, kind: ScopeKind): void => {
        const ask = runtime.loadIndex;
        if (ask === undefined) {
          // A runtime without an index route serves the list and nothing else.
          setIndexPhase({ kind: "idle" });
          return;
        }
        indexRequest.current += 1;
        const mine = indexRequest.current;
        setIndexPhase({ kind: "loading" });
        const scope: ReviewScope = kind === "branch" ? { kind: "branch" } : { kind: "worktree" };
        ask.call(runtime, session, scope).then(
          result => {
            // The generational check: an answer for a range the reader has left
            // is dropped rather than painted over the new map.
            if (indexRequest.current !== mine) return;
            setIndexPhase(result.ok ? { kind: "ready", index: result.index } : { kind: "error", code: result.error.code });
          },
          () => {
            if (indexRequest.current !== mine) return;
            setIndexPhase({ kind: "error", code: "unreadable" });
          },
        );
      },
      [runtime],
    );

    useEffect(() => {
      if (sessionId === undefined || sessionId === "") {
        // Nothing to ask about. Bumping the counters drops any answer still in
        // flight for the session that just went away.
        listRequest.current += 1;
        detailRequest.current += 1;
        indexRequest.current += 1;
        lastSession.current = sessionId;
        setPhase({ kind: "idle" });
        setIndexPhase({ kind: "idle" });
        setSelectedPath(undefined);
        setOpenPath(undefined);
        setDetailPhase(undefined);
        return;
      }
      if (lastSession.current !== sessionId) {
        lastSession.current = sessionId;
        setScopeKind("worktree");
        // The panel is about a file in the previous list; keeping it open would
        // show a path the new session may not have.
        detailRequest.current += 1;
        setOpenPath(undefined);
        setDetailPhase(undefined);
        setSelectedPath(undefined);
        load(sessionId, "worktree");
        loadIndex(sessionId, "worktree");
        return;
      }
      load(sessionId, scopeKind);
      loadIndex(sessionId, scopeKind);
    }, [sessionId, scopeKind, load, loadIndex]);

    // A new file starts at its first line. Doing it in an effect rather than in
    // the click handler keeps it tied to the render that actually changed the
    // panel's content.
    useEffect(() => {
      if (detailBody.current !== null) detailBody.current.scrollTop = 0;
    }, [openPath, detailPhase?.kind === "ready" ? detailPhase.diff.path : ""]);

    // The map is mounted once per ready index and torn down when that index is
    // replaced. It is deliberately NOT re-mounted on selection or on opening a
    // detail: the map is a place, and rebuilding it would throw away the level
    // the reader had drilled into every time they clicked a card.
    const readyIndex = indexPhase.kind === "ready" ? indexPhase.index : undefined;
    // Read from the phase rather than from `snapshot`: that binding is derived
    // further down, and a hook dependency may not reach forward past its own
    // declaration.
    const repoName = (phase.kind === "ready" ? phase.snapshot.repo : undefined) ?? strings.repoFallback;
    const openFromMap = useCallback(
      (path: string): void => {
        if (sessionId === undefined || sessionId === "") return;
        setSelectedPath(path);
        openDetail(sessionId, scopeKind, path);
      },
      [sessionId, scopeKind, openDetail],
    );

    /**
     * The pointer entered or left a card on the map.
     *
     * Only the hover state moves: no level change, no re-layout, no scroll. The
     * list row is lit by a render, and the scroll is handled separately below so
     * a hover over a visible row costs nothing.
     */
    const hoverFromMap = useCallback((path: string | null): void => {
      setHoveredPath(path);
    }, []);

    useEffect(() => {
      const host = mapHost.current;
      if (host === null || readyIndex === undefined) return;
      // Nothing to draw: fetching the renderer to paint an empty box would be a
      // request spent on a state the pane already says in words.
      if (readyIndex.files.length === 0) return;
      let cancelled = false;
      let handle: MapHandle | null = null;
      mapLoader().then(
        chunk => {
          // A chunk that arrives after the index was replaced (or after the
          // component unmounted) must not paint: the host may already hold a
          // newer map.
          if (cancelled) return;
          handle = chunk.createMap(host, buildMapData(readyIndex, repoName), {
            onOpenFile: openFromMap,
            onHover: hoverFromMap,
          });
          mapHandle.current = handle;
        },
        () => {
          if (cancelled) return;
          setIndexPhase({ kind: "error", code: "unreadable" });
        },
      );
      return () => {
        cancelled = true;
        handle?.destroy();
        if (mapHandle.current === handle) mapHandle.current = null;
      };
    }, [readyIndex, repoName, mapLoader, openFromMap, hoverFromMap]);

    /**
     * The pointer entered or left a list row.
     *
     * Synchronous: the handle is called in the event, not from an effect, so the
     * map lights up in the same frame as the row. The handle's own contract
     * decides what a target outside the current level means — it highlights the
     * nearest visible ancestor and flags the breadcrumb rather than drilling.
     */
    const hoverRow = useCallback((path: string | null): void => {
      setHoveredPath(path);
      mapHandle.current?.setHighlight(path);
    }, []);

    // A map hover can point at a row that is scrolled out of the list. Only then
    // does the list move, and only as far as it must: `block: "nearest"` leaves a
    // row that is already visible exactly where it is, which is what keeps the
    // reader's place while they sweep the map.
    useEffect(() => {
      if (hoveredPath === null) return;
      const row = document.querySelector<HTMLElement>(
        `[data-testid="review-row"][data-path="${CSS.escape(hoveredPath)}"]`,
      );
      if (row === null) return;
      const list = row.closest<HTMLElement>('[data-rm="list"]');
      if (list === null) return;
      const rowBox = row.getBoundingClientRect();
      const listBox = list.getBoundingClientRect();
      const visible = rowBox.top >= listBox.top && rowBox.bottom <= listBox.bottom;
      if (visible) return;
      row.scrollIntoView({ block: "nearest" });
    }, [hoveredPath]);

    const selectScope = (kind: ScopeKind): void => {
      if (kind === scopeKind) return;
      // The panel is about a file in the previous comparison; the two ranges can
      // disagree about which files exist at all.
      detailRequest.current += 1;
      // The index is about the same two revisions, so a range switch makes the
      // answer in flight stale for exactly the same reason the list's does.
      indexRequest.current += 1;
      setIndexPhase({ kind: "loading" });
      setOpenPath(undefined);
      setDetailPhase(undefined);
      setSelectedPath(undefined);
      setScopeKind(kind);
    };

    const refresh = (): void => {
      if (sessionId === undefined || sessionId === "") return;
      load(sessionId, scopeKind);
      loadIndex(sessionId, scopeKind);
    };

    const hasSession = sessionId !== undefined && sessionId !== "";
    const readings = readyIndex === undefined ? undefined : indexReadings(readyIndex);
    // The map's copy, with the dictionary's own wording as the fallback.
    const mapCopy = {
      statNewImports: strings.statNewImports ?? "New imports",
      statDroppedImports: strings.statDroppedImports ?? "Dropped imports",
      indexPartial: strings.indexPartial ?? "indexed {parsed}/{total}",
      unresolved: strings.unresolved ?? "≥{count} unresolved (incl. external)",
      unresolvedHint:
        strings.unresolvedHint ??
        "External packages and dynamic imports are counted here and are not drawn as edges.",
      mapTitle: strings.mapTitle ?? "Directory map",
      mapLoading: strings.mapLoading ?? "Indexing the map",
      mapEmpty: strings.mapEmpty ?? "No structure to lay out",
      mapError: strings.mapError ?? "The map index failed",
    };
    const snapshot = phase.kind === "ready" ? phase.snapshot : undefined;
    const summary = snapshot === undefined ? undefined : summaryOf(snapshot);
    const files = snapshot === undefined ? [] : sortFiles(snapshot.files);
    const meta =
      snapshot === undefined
        ? undefined
        : snapshot.scope === "branch" && snapshot.baseRef !== null
          ? fill(strings.listMetaBranch, { base: shortRef(snapshot.baseRef) })
          : strings.listMetaWorktree;

    // The selection follows the list: a path that is no longer in it (a refresh
    // that dropped the file) falls back to the first row rather than leaving the
    // list with no tab stop at all.
    const selected = files.some(file => file.path === selectedPath) ? selectedPath : files[0]?.path;
    const openFile = openPath === undefined ? undefined : files.find(file => file.path === openPath);
    // The panel is open only while its file is still in the list. A refresh can
    // drop the file the panel is showing (the change was committed, or reverted),
    // and a panel left standing would name a path the reader can no longer find
    // in the list beside it, with no status and no churn to explain it. Deriving
    // this rather than clearing it in an effect also covers the scope and session
    // switches, which change the list for the same reason.
    const panelPath = openFile === undefined ? undefined : openPath;

    const open = (path: string): void => {
      if (sessionId === undefined || sessionId === "") return;
      // A second click on the open row is a no-op: the panel already shows that
      // file, and re-fetching would flash the loading state for nothing.
      if (path === openPath) return;
      openDetail(sessionId, scopeKind, path);
    };

    const move = (delta: number): void => {
      if (files.length === 0) return;
      const current = files.findIndex(file => file.path === selected);
      const next = Math.min(files.length - 1, Math.max(0, (current < 0 ? 0 : current) + delta));
      const target = files[next];
      if (target === undefined) return;
      setSelectedPath(target.path);
      // Moving the cursor is not opening: a reader scanning a list should not
      // trigger a request per keystroke.
      const element = document.querySelector<HTMLElement>(`[data-testid="review-row"][data-path="${CSS.escape(target.path)}"]`);
      element?.focus();
    };

    const onKey = (event: KeyboardEvent<HTMLElement>, path: string): void => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        setSelectedPath(path);
        open(path);
        return;
      }
      if (event.key === "Escape") {
        // Escape is layered, and the layers are in the order a reader would undo
        // them: the panel first, then the map's level. Closing the panel leaves
        // the row selected, so the reader's place in the list survives.
        if (openPath !== undefined) {
          event.preventDefault();
          setOpenPath(undefined);
          setDetailPhase(undefined);
          return;
        }
        // No panel: the map goes up one level, and only if it actually moved is
        // the key consumed. At the root `up()` returns false and Escape is left
        // alone for whatever else might want it.
        if (mapHandle.current?.up() === true) event.preventDefault();
        return;
      }
      if (event.key === "ArrowDown") {
        event.preventDefault();
        move(1);
        return;
      }
      if (event.key === "ArrowUp") {
        event.preventDefault();
        move(-1);
      }
    };

    return (
      <div data-testid="review-map" data-conversation-composer-overlay="">
        <div data-rm="header">
          <h2 data-rm="title">{strings.title}</h2>
          <span data-rm="repo-name">{snapshot?.repo ?? strings.repoFallback}</span>
          {snapshot === undefined ? null : (
            <span data-rm="head" data-head-kind={snapshot.head.kind}>
              {snapshot.head.kind === "branch" ? snapshot.head.ref : "HEAD"} {snapshot.head.shortHash}
            </span>
          )}
          <span data-rm="scope" role="group">
            <button
              type="button"
              data-rm="scope-worktree"
              aria-pressed={scopeKind === "worktree"}
              onClick={() => selectScope("worktree")}
            >
              {strings.scopeWorktree}
            </button>
            <button
              type="button"
              data-rm="scope-branch"
              aria-pressed={scopeKind === "branch"}
              onClick={() => selectScope("branch")}
            >
              {strings.scopeBranch}
            </button>
          </span>
          <button type="button" data-rm="refresh" onClick={refresh} disabled={!hasSession}>
            {strings.refresh}
          </button>
        </div>

        {phase.kind === "idle" ? (
          <div data-rm="empty">
            <p data-rm="empty-title">{strings.empty}</p>
            <p data-rm="empty-hint">{strings.emptyHint}</p>
          </div>
        ) : null}

        {phase.kind === "loading" ? <p data-rm="loading">{strings.loading}</p> : null}

        {phase.kind === "error" ? <p data-rm="error">{errorText(phase.code, strings)}</p> : null}

        {snapshot !== undefined && summary !== undefined ? (
          <>
            <div data-rm="stats">
              <div data-rm="stat" data-stat="lines">
                <span data-rm="stat-label">{strings.statLines}</span>
                <span data-rm="stat-value">
                  {/* Once the index is ready its change entries are the source
                      for every reading on this row, so the four cards cannot
                      disagree with each other. Before that the snapshot's own
                      summary is the only answer there is. */}
                  <span data-rm="stat-add">{signedCount("+", readings?.additions ?? summary.additions)}</span>{" "}
                  <span data-rm="stat-del">{signedCount("-", readings?.deletions ?? summary.deletions)}</span>
                </span>
              </div>
              <div data-rm="stat" data-stat="files">
                <span data-rm="stat-label">{strings.statFiles}</span>
                <span data-rm="stat-value">{readings?.files ?? summary.files}</span>
                <span data-rm="uncommitted">{fill(strings.uncommitted, { count: String(snapshot.uncommitted) })}</span>
              </div>
              {/* The import readings come from the index, so they are absent
                  until it answers: a card showing a definite 0 before the
                  index has run would be the "unknown drawn as zero" failure. */}
              {readings === undefined ? null : (
                <>
                  <div data-rm="stat" data-stat="new-imports">
                    <span data-rm="stat-label">{mapCopy.statNewImports}</span>
                    <span data-rm="stat-value" data-rm-value="new-imports">
                      {signedCount("+", readings.newImports)}
                    </span>
                  </div>
                  <div data-rm="stat" data-stat="dropped-imports">
                    <span data-rm="stat-label">{mapCopy.statDroppedImports}</span>
                    <span data-rm="stat-value" data-rm-value="dropped-imports">
                      {signedCount("-", readings.droppedImports)}
                    </span>
                    {readings.unresolved > 0 ? (
                      <span
                        data-rm="unresolved"
                        data-count={readings.unresolved}
                        // The count is a lower bound and includes external
                        // packages, so the tooltip states the rule rather than
                        // leaving the reader to guess what was counted.
                        title={mapCopy.unresolvedHint}
                      >
                        {fill(mapCopy.unresolved, { count: String(readings.unresolved) })}
                      </span>
                    ) : null}
                    {readings.partial === null ? null : (
                      <span
                        data-rm="index-partial"
                        data-parsed={readings.partial.parsed}
                        data-total={readings.partial.total}
                        title={readings.note ?? undefined}
                      >
                        {fill(mapCopy.indexPartial, {
                          parsed: String(readings.partial.parsed),
                          total: String(readings.partial.total),
                        })}
                      </span>
                    )}
                  </div>
                </>
              )}
            </div>

            <div data-rm="split" data-open={panelPath === undefined ? "false" : "true"}>
              <div data-rm="list" role="listbox" aria-label={strings.title}>
                <div data-rm="list-meta">
                  <span data-rm="list-scope">{meta}</span>
                  <span data-rm="list-sort">{strings.listSort}</span>
                </div>
                {files.length === 0 ? (
                  <p data-rm="list-empty">{strings.listEmpty}</p>
                ) : (
                  files.map(file => (
                    <ReviewRow
                      key={file.path}
                      file={file}
                      strings={strings}
                      selected={file.path === selected}
                      hovered={file.path === hoveredPath}
                      onSelect={setSelectedPath}
                      onOpen={open}
                      onHover={hoverRow}
                      onKey={onKey}
                    />
                  ))
                )}
              </div>
              <div
                data-rm="map-pane"
                data-state={indexPhase.kind}
                aria-label={mapCopy.mapTitle}
                role="group"
              >
                {/* The title names the repository, not the word "repo": the map
                    is a picture of one tree, and the reader needs to know which
                    one without looking back at the header. */}
                <p data-rm="map-title">
                  <span data-rm="map-title-label">{mapCopy.mapTitle}</span>{" "}
                  <span data-rm="map-title-repo">{repoName}</span>
                </p>
                {indexPhase.kind === "loading" ? (
                  <p data-rm="map-loading">{mapCopy.mapLoading}</p>
                ) : null}
                {indexPhase.kind === "error" ? <p data-rm="map-error">{mapCopy.mapError}</p> : null}
                {indexPhase.kind === "ready" && (readyIndex?.files.length ?? 0) === 0 ? (
                  <p data-rm="map-empty">{mapCopy.mapEmpty}</p>
                ) : null}
                {/* The chunk draws here. The element stays mounted across index
                    changes so the effect can tear one map down and mount the
                    next into the same box. */}
                <div data-rm="map-host" ref={mapHost} />
              </div>
              {panelPath === undefined || detailPhase === undefined ? null : (
                <DetailPanel
                  path={panelPath}
                  file={openFile}
                  phase={detailPhase}
                  strings={strings}
                  bodyRef={detailBody}
                  onClose={() => {
                    setOpenPath(undefined);
                    setDetailPhase(undefined);
                  }}
                />
              )}
            </div>
          </>
        ) : null}
      </div>
    );
  };
}
