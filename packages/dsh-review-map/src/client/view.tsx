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
import {
  churnOf,
  churnText,
  diffRows,
  fill,
  formatBytes,
  shortRef,
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
}

/** The two ranges a review can be about. */
type ScopeKind = "worktree" | "branch";

/** What the list is showing right now. */
type Phase =
  | { readonly kind: "idle" }
  | { readonly kind: "loading" }
  | { readonly kind: "ready"; readonly snapshot: ReviewSnapshot }
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
  readonly onSelect: (path: string) => void;
  readonly onOpen: (path: string) => void;
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
function ReviewRow({ file, strings, selected, onSelect, onOpen, onKey }: RowProps): ReactElement {
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
}: ReviewMapViewOptions): (props: ConversationViewProps) => ReactElement {
  return function ReviewMapView({ sessionId }: ConversationViewProps): ReactElement {
    const [scopeKind, setScopeKind] = useState<ScopeKind>("worktree");
    const [phase, setPhase] = useState<Phase>({ kind: "idle" });
    const [selectedPath, setSelectedPath] = useState<string | undefined>(undefined);
    const [openPath, setOpenPath] = useState<string | undefined>(undefined);
    const [detailPhase, setDetailPhase] = useState<DetailPhase | undefined>(undefined);
    // The identity of the newest list request. A response whose id is not this
    // one is an answer to a question the reader has already moved on from.
    const listRequest = useRef(0);
    // The same, for the panel: opening two files quickly must not let the first
    // answer land on the second file's panel.
    const detailRequest = useRef(0);
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

    useEffect(() => {
      if (sessionId === undefined || sessionId === "") {
        // Nothing to ask about. Bumping the counters drops any answer still in
        // flight for the session that just went away.
        listRequest.current += 1;
        detailRequest.current += 1;
        lastSession.current = sessionId;
        setPhase({ kind: "idle" });
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
        return;
      }
      load(sessionId, scopeKind);
    }, [sessionId, scopeKind, load]);

    // A new file starts at its first line. Doing it in an effect rather than in
    // the click handler keeps it tied to the render that actually changed the
    // panel's content.
    useEffect(() => {
      if (detailBody.current !== null) detailBody.current.scrollTop = 0;
    }, [openPath, detailPhase?.kind === "ready" ? detailPhase.diff.path : ""]);

    const selectScope = (kind: ScopeKind): void => {
      if (kind === scopeKind) return;
      // The panel is about a file in the previous comparison; the two ranges can
      // disagree about which files exist at all.
      detailRequest.current += 1;
      setOpenPath(undefined);
      setDetailPhase(undefined);
      setSelectedPath(undefined);
      setScopeKind(kind);
    };

    const refresh = (): void => {
      if (sessionId === undefined || sessionId === "") return;
      load(sessionId, scopeKind);
    };

    const hasSession = sessionId !== undefined && sessionId !== "";
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
        // Escape closes the panel and leaves the row selected, so the reader's
        // place in the list survives.
        if (openPath === undefined) return;
        event.preventDefault();
        setOpenPath(undefined);
        setDetailPhase(undefined);
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
                  <span data-rm="stat-add">+{summary.additions}</span>{" "}
                  <span data-rm="stat-del">−{summary.deletions}</span>
                </span>
              </div>
              <div data-rm="stat" data-stat="files">
                <span data-rm="stat-label">{strings.statFiles}</span>
                <span data-rm="stat-value">{summary.files}</span>
                <span data-rm="uncommitted">{fill(strings.uncommitted, { count: String(snapshot.uncommitted) })}</span>
              </div>
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
                      onSelect={setSelectedPath}
                      onOpen={open}
                      onKey={onKey}
                    />
                  ))
                )}
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
