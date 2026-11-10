/**
 * The review map: a change set as a triage list, largest change first.
 *
 * Three bands, top to bottom: the repository's identity and the range being
 * compared, two readings (source lines, files), then the list itself. The
 * readings are above the list because they answer "is this review big" before
 * the reader has to scroll, and the list is sorted by churn for the same reason.
 *
 * The view owns only the reading state: which range is selected, whether a load
 * is in flight, and the last answer. Every decision about what a row says is in
 * `model.ts`, so the awkward cases are tested without a DOM.
 *
 * Two behaviours are worth naming here because they look like details and are
 * not:
 *
 * - A request counter, not a boolean. Switching range twice quickly produces two
 *   answers that can arrive in either order; only the newest one may be shown,
 *   and a late answer for a superseded request is dropped rather than rendered.
 * - A session change resets the range. A new conversation is a new review, and
 *   keeping the previous range would show one session's branch comparison under
 *   another session's name.
 *
 * The root carries `data-conversation-composer-overlay`, the attribute the host
 * keys on to give the conversation view a definite height and to float the
 * composer over it. Without it the panel collapses to its content height.
 */
import { useCallback, useEffect, useRef, useState, type ReactElement } from "react";

import { createHttpRuntime, type ReviewRuntime } from "./runtime.ts";
import { churnOf, churnText, fill, shortRef, sortFiles, splitPath, statusMark, summaryOf } from "./model.ts";
import type { ChangedFile, ChangedFileStatus, ReviewErrorCode, ReviewScope, ReviewSnapshot } from "../shared.ts";

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
}

/** What the entry hands the view factory. */
export interface ReviewMapViewOptions {
  readonly strings: ReviewMapViewStrings;
  /** The host seam; absent means the real HTTP runtime. */
  readonly runtime?: ReviewRuntime;
}

/** The two ranges a review can be about. */
type ScopeKind = "worktree" | "branch";

/** What the panel is showing right now. */
type Phase =
  | { readonly kind: "idle" }
  | { readonly kind: "loading" }
  | { readonly kind: "ready"; readonly snapshot: ReviewSnapshot }
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
 * The sentence for one error code.
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

/**
 * One row of the change list.
 * @param props - the file, its strings and nothing else.
 * @returns the row.
 */
function ReviewRow({ file, strings }: { readonly file: ChangedFile; readonly strings: ReviewMapViewStrings }): ReactElement {
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
      title={label}
      aria-label={label}
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
    // The identity of the newest request. A response whose id is not this one is
    // an answer to a question the reader has already moved on from.
    const requestId = useRef(0);
    // A session change resets the range, so the reset and the load have to be
    // one effect: two effects would let the first load run against the old range.
    const lastSession = useRef<string | undefined>(sessionId);

    const load = useCallback(
      (session: string, kind: ScopeKind): void => {
        requestId.current += 1;
        const mine = requestId.current;
        setPhase({ kind: "loading" });
        const scope: ReviewScope = kind === "branch" ? { kind: "branch" } : { kind: "worktree" };
        runtime.loadSnapshot(session, scope).then(
          result => {
            if (requestId.current !== mine) return;
            setPhase(result.ok ? { kind: "ready", snapshot: result.snapshot } : { kind: "error", code: result.error.code });
          },
          () => {
            // A transport failure is not a domain answer: the host did not say
            // "no changes", it failed to answer at all.
            if (requestId.current !== mine) return;
            setPhase({ kind: "error", code: "unreadable" });
          },
        );
      },
      [runtime],
    );

    useEffect(() => {
      if (sessionId === undefined || sessionId === "") {
        // Nothing to ask about. Bumping the counter drops any answer still in
        // flight for the session that just went away.
        requestId.current += 1;
        lastSession.current = sessionId;
        setPhase({ kind: "idle" });
        return;
      }
      if (lastSession.current !== sessionId) {
        lastSession.current = sessionId;
        setScopeKind("worktree");
        load(sessionId, "worktree");
        return;
      }
      load(sessionId, scopeKind);
    }, [sessionId, scopeKind, load]);

    const selectScope = (kind: ScopeKind): void => {
      if (kind === scopeKind) return;
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

            <div data-rm="list">
              <div data-rm="list-meta">
                <span data-rm="list-scope">{meta}</span>
                <span data-rm="list-sort">{strings.listSort}</span>
              </div>
              {files.length === 0 ? (
                <p data-rm="list-empty">{strings.listEmpty}</p>
              ) : (
                files.map(file => <ReviewRow key={file.path} file={file} strings={strings} />)
              )}
            </div>
          </>
        ) : null}
      </div>
    );
  };
}
