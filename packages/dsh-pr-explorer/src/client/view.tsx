/**
 * The PR view: one x...y range as a two-pane reading.
 *
 * The header answers "what am I comparing" (two pickers, a swap, a refresh) and
 * "how big is it" (ahead, behind, files, lines). Below it the left pane is one
 * list with two tabs, because a range is read two ways: by commit, to follow the
 * story, and by file, to review the result. The right pane is whatever the
 * selected row is about: a file's diff, or a commit's metadata.
 *
 * The view owns only the reading state: which refs are selected, which tab is
 * showing, which row is selected, and the last answer for each. Every decision
 * about what a row or a diff line says is in `model.ts`, so the awkward cases are
 * tested without a DOM.
 *
 * Three behaviours are worth naming here because they look like details and are
 * not:
 *
 * - Request counters, not booleans. Swapping and refreshing in quick succession
 *   produces answers that can arrive in either order; only the newest may be
 *   shown. The comparison and the detail have separate counters because they are
 *   separate questions.
 * - A pair change clears the selection and the detail. The panel was about a file
 *   in the previous range, and the new range may not contain it at all.
 * - Roving tabindex. The list is one tab stop, not one per row: a reader tabbing
 *   past the panel should not walk four hundred commits.
 *
 * The root carries `data-conversation-composer-overlay`, the attribute the host
 * keys on to give the conversation view a definite height and to float the
 * composer over it. Without it the panel collapses to its content height.
 */
import { useCallback, useEffect, useMemo, useRef, useState, type KeyboardEvent, type ReactElement } from "react";

import { createHttpRuntime, type PrRuntime } from "./runtime.ts";
import {
  createViewJump,
  formatCommitFocus,
  formatPathFocus,
  parseCompareFocus,
  type WorkbenchFace,
} from "./interop.ts";
import {
  churnOf,
  churnText,
  defaultPair,
  diffLines,
  diffTitle,
  fill,
  formatBytes,
  rangeLabel,
  refOptions,
  sortCommits,
  sortFiles,
  splitPath,
  statusMark,
  summaryReading,
} from "./model.ts";
import { VIEW_ID } from "../shared.ts";
import type {
  CommitEntry,
  CompareSnapshot,
  PrChangedFile,
  PrErrorCode,
  PrFileDiff,
  PrFileStatus,
  RefListing,
} from "../shared.ts";

/** The request the conversation shell carries when it switches to this tab. */
export interface PrViewRequestLike {
  readonly view: string;
  readonly focus: string;
}

/** Owner props the host passes to a `conversation.view` entry. */
export interface ConversationViewProps {
  readonly sessionId?: string;
  /**
   * What to open, when the switch was made by a caller holding the host's own
   * `openView(id, focus)` capability.
   *
   * The core has two delivery paths and they do not overlap: a caller with the
   * host capability lands here as owner props, a caller without it leaves the
   * focus in `viewFocus`. A view that read only one of them would ignore every
   * jump made from the other side.
   */
  readonly viewRequest?: PrViewRequestLike | null;
  /** Ack the shell once the request was consumed or refused. */
  readonly completeViewRequest?: () => void;
}

/** Strings the view renders, bound through the locale seat by the entry. */
export interface PrExplorerViewStrings {
  readonly title: string;
  readonly repoFallback: string;
  readonly baseLabel: string;
  readonly headLabel: string;
  readonly swap: string;
  readonly refresh: string;
  readonly tabCommits: string;
  readonly tabFiles: string;
  readonly ahead: string;
  readonly behind: string;
  readonly filesCount: string;
  readonly commitsTruncated: string;
  readonly markBinary: string;
  readonly markUnknown: string;
  readonly statusAdded: string;
  readonly statusModified: string;
  readonly statusDeleted: string;
  readonly statusRenamed: string;
  readonly statusCopied: string;
  readonly statusTypeChanged: string;
  readonly statusUnknown: string;
  readonly loading: string;
  readonly empty: string;
  readonly emptyHint: string;
  readonly noDifference: string;
  readonly detailEmpty: string;
  readonly detailTruncated: string;
  readonly detailBinary: string;
  readonly detailUnknownSize: string;
  readonly commitHash: string;
  readonly commitAuthor: string;
  readonly commitDate: string;
  readonly commitSubject: string;
  readonly commitRefs: string;
  readonly openInFiles: string;
  readonly openInGit: string;
  readonly errorNotARepo: string;
  readonly errorInvalidRef: string;
  readonly errorNoMergeBase: string;
  readonly errorNoSession: string;
  readonly errorTooLarge: string;
  readonly errorUnreadable: string;
  readonly errorBadRequest: string;
  readonly errorUnknown: string;
}

/** What the entry hands the view factory. */
export interface PrExplorerViewOptions {
  readonly strings: PrExplorerViewStrings;
  /** The host seam; absent means the real HTTP runtime. */
  readonly runtime?: PrRuntime;
  /**
   * The workbench service, when the host publishes one.
   *
   * Absent means the two jump actions are not drawn: a button that cannot switch
   * a view is a dead end, and the comparison itself does not need the core.
   */
  readonly workbench?: WorkbenchFace;
}

/** Which list the left pane is showing. */
type Tab = "commits" | "files";

/** What the panel is showing right now. */
type Phase =
  | { readonly kind: "idle" }
  | { readonly kind: "loading" }
  | { readonly kind: "ready"; readonly listing: RefListing; readonly compare: CompareSnapshot }
  | { readonly kind: "error"; readonly code: PrErrorCode };

/** What the right pane is showing right now. */
type DetailPhase =
  | { readonly kind: "none" }
  | { readonly kind: "commit"; readonly commit: CommitEntry }
  | { readonly kind: "loading"; readonly path: string }
  | { readonly kind: "file"; readonly diff: PrFileDiff }
  | { readonly kind: "error"; readonly code: PrErrorCode };

/**
 * The status word for one row's accessible name.
 *
 * The letter in the badge is not enough on its own: a screen reader reads "M",
 * and a reader who does not know git's alphabet has nothing to go on.
 * @param status - the change status.
 * @param strings - the bound copy.
 * @returns the word for that status.
 */
function statusWord(status: PrFileStatus, strings: PrExplorerViewStrings): string {
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
function errorText(code: PrErrorCode, strings: PrExplorerViewStrings): string {
  switch (code) {
    case "not-a-repo":
      return strings.errorNotARepo;
    case "invalid-ref":
      return strings.errorInvalidRef;
    case "no-merge-base":
      return strings.errorNoMergeBase;
    case "no-session":
      return strings.errorNoSession;
    case "too-large":
      return strings.errorTooLarge;
    case "unreadable":
      return strings.errorUnreadable;
    case "bad-request":
      return strings.errorBadRequest;
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
function noteText(note: "binary" | "unknown" | null, strings: PrExplorerViewStrings): string | null {
  if (note === "binary") return strings.markBinary;
  if (note === "unknown") return strings.markUnknown;
  return null;
}

/** What one commit row needs from the view. */
interface CommitRowProps {
  readonly commit: CommitEntry;
  readonly selected: boolean;
  readonly onSelect: (hash: string) => void;
  readonly onKey: (event: KeyboardEvent<HTMLElement>, hash: string) => void;
}

/**
 * One row of the commit list.
 * @param props - the commit, its selection and the handlers.
 * @returns the row.
 */
function CommitRow({ commit, selected, onSelect, onKey }: CommitRowProps): ReactElement {
  return (
    <div
      data-testid="commit-row"
      data-hash={commit.hash}
      data-selected={selected ? "true" : "false"}
      role="option"
      aria-selected={selected}
      tabIndex={selected ? 0 : -1}
      onClick={() => onSelect(commit.hash)}
      onKeyDown={event => onKey(event, commit.hash)}
    >
      <span data-rm="commit-short">{commit.short}</span>
      <span data-rm="commit-subject">{commit.subject}</span>
      <span data-rm="commit-meta">
        {commit.author} · {commit.date}
      </span>
    </div>
  );
}

/** What one file row needs from the view. */
interface FileRowProps {
  readonly file: PrChangedFile;
  readonly strings: PrExplorerViewStrings;
  readonly selected: boolean;
  readonly onSelect: (path: string) => void;
  readonly onKey: (event: KeyboardEvent<HTMLElement>, path: string) => void;
  /** Absent when the host publishes no workbench to switch to. */
  readonly onOpenInFiles?: (path: string) => void;
}

/**
 * One row of the file list.
 * @param props - the file, its strings, its selection and the handlers.
 * @returns the row.
 */
function FileRow({ file, strings, selected, onSelect, onKey, onOpenInFiles }: FileRowProps): ReactElement {
  const parts = splitPath(file.path);
  const churn = churnOf(file);
  const note = noteText(churn.note, strings);
  const deleted = file.status === "deleted";
  // The old path has no column of its own, so it goes in the row's accessible
  // name: without it a reader cannot tell what a rename renamed.
  const label = file.oldPath === undefined ? undefined : `${file.oldPath} → ${file.path}`;
  return (
    <div
      data-testid="file-row"
      data-path={file.path}
      data-status={file.status}
      data-deleted={deleted ? "true" : undefined}
      data-selected={selected ? "true" : "false"}
      role="option"
      aria-selected={selected}
      tabIndex={selected ? 0 : -1}
      title={label}
      aria-label={label}
      onClick={() => onSelect(file.path)}
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
      {onOpenInFiles === undefined ? null : (
        <button
          type="button"
          data-rm="open-in-files"
          aria-label={strings.openInFiles}
          title={strings.openInFiles}
          onClick={event => {
            // The row click selects; this click is a different action and must
            // not also change the selection under the reader.
            event.stopPropagation();
            onOpenInFiles(file.path);
          }}
        >
          ↗
        </button>
      )}
    </div>
  );
}

/**
 * The right pane: a file's diff, a commit's metadata, or the empty state.
 * @param props - the phase, the bound copy and the body ref.
 * @returns the pane.
 */
function DetailPane({
  phase,
  strings,
  bodyRef,
  onOpenInFiles,
  onOpenInGit,
}: {
  readonly phase: DetailPhase;
  readonly strings: PrExplorerViewStrings;
  readonly bodyRef: { current: HTMLDivElement | null };
  /** Absent when the host publishes no workbench to switch to. */
  readonly onOpenInFiles?: (path: string) => void;
  readonly onOpenInGit?: (hash: string) => void;
}): ReactElement {
  return (
    <div data-rm="detail">
      <div data-rm="detail-body" ref={bodyRef}>
        {phase.kind === "none" ? <p data-rm="detail-empty">{strings.detailEmpty}</p> : null}
        {phase.kind === "loading" ? <p data-rm="detail-loading">{strings.loading}</p> : null}
        {phase.kind === "error" ? <p data-rm="detail-error">{errorText(phase.code, strings)}</p> : null}
        {phase.kind === "commit" ? (
          <CommitDetail commit={phase.commit} strings={strings} onOpenInGit={onOpenInGit} />
        ) : null}
        {phase.kind === "file" ? (
          <FileDetail diff={phase.diff} strings={strings} onOpenInFiles={onOpenInFiles} />
        ) : null}
      </div>
    </div>
  );
}

/**
 * One commit's metadata.
 * @param props - the commit and the bound copy.
 * @returns the detail.
 */
function CommitDetail({
  commit,
  strings,
  onOpenInGit,
}: {
  readonly commit: CommitEntry;
  readonly strings: PrExplorerViewStrings;
  readonly onOpenInGit?: (hash: string) => void;
}): ReactElement {
  return (
    <div data-testid="commit-detail">
      {onOpenInGit === undefined ? null : (
        <div data-rm="commit-detail-actions">
          <button type="button" data-rm="open-in-git" onClick={() => onOpenInGit(commit.hash)}>
            {strings.openInGit}
          </button>
        </div>
      )}
      <div data-rm="commit-detail-row">
        <span data-rm="commit-detail-label">{strings.commitHash}</span>
        <span data-rm="commit-detail-value">{commit.hash}</span>
      </div>
      <div data-rm="commit-detail-row">
        <span data-rm="commit-detail-label">{strings.commitSubject}</span>
        <span data-rm="commit-detail-value">{commit.subject}</span>
      </div>
      <div data-rm="commit-detail-row">
        <span data-rm="commit-detail-label">{strings.commitAuthor}</span>
        <span data-rm="commit-detail-value">{commit.author}</span>
      </div>
      <div data-rm="commit-detail-row">
        <span data-rm="commit-detail-label">{strings.commitDate}</span>
        <span data-rm="commit-detail-value">{commit.date}</span>
      </div>
      {commit.refs === undefined ? null : (
        <div data-rm="commit-detail-row">
          <span data-rm="commit-detail-label">{strings.commitRefs}</span>
          <span data-rm="commit-detail-value">{commit.refs}</span>
        </div>
      )}
    </div>
  );
}

/**
 * One file's diff, in whichever shape the host answered with.
 * @param props - the diff and the bound copy.
 * @returns the detail.
 */
function FileDetail({
  diff,
  strings,
  onOpenInFiles,
}: {
  readonly diff: PrFileDiff;
  readonly strings: PrExplorerViewStrings;
  readonly onOpenInFiles?: (path: string) => void;
}): ReactElement {
  const title = diffTitle(diff);
  if (diff.kind === "binary") {
    const size = diff.bytes === null ? strings.detailUnknownSize : formatBytes(diff.bytes);
    return (
      <div data-rm="detail-file">
        <div data-rm="detail-file-name">{title}</div>
        {onOpenInFiles === undefined ? null : (
          <button type="button" data-rm="open-in-files" onClick={() => onOpenInFiles(title)}>
            {strings.openInFiles}
          </button>
        )}
        <p data-rm="detail-binary">{fill(strings.detailBinary, { size })}</p>
      </div>
    );
  }
  const rows = diffLines(diff);
  return (
    <div data-rm="detail-file">
      <div data-rm="detail-file-name">{title}</div>
      {onOpenInFiles === undefined ? null : (
        <button type="button" data-rm="open-in-files" onClick={() => onOpenInFiles(title)}>
          {strings.openInFiles}
        </button>
      )}
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
    </div>
  );
}

/**
 * Build the conversation view component.
 *
 * @param options - the strings the entry resolved, and the host seam.
 * @returns a component the slot registry can mount.
 */
export function createPrExplorerView({
  strings,
  runtime = createHttpRuntime(),
  workbench,
}: PrExplorerViewOptions): (props: ConversationViewProps) => ReactElement {
  return function PrExplorerView({ sessionId, viewRequest, completeViewRequest }: ConversationViewProps): ReactElement {
    const [phase, setPhase] = useState<Phase>({ kind: "idle" });
    const [base, setBase] = useState<string | undefined>(undefined);
    const [head, setHead] = useState<string | undefined>(undefined);
    const [tab, setTab] = useState<Tab>("commits");
    const [selectedCommit, setSelectedCommit] = useState<string | undefined>(undefined);
    const [selectedFile, setSelectedFile] = useState<string | undefined>(undefined);
    const [detail, setDetail] = useState<DetailPhase>({ kind: "none" });
    // Bumped by every user action that should re-read the comparison. The effect
    // below keys on this rather than on `base`/`head`, because those are also
    // *set by* a load: keying on them would make the first load schedule a
    // second one the moment it resolved the default pair.
    const [reloadToken, setReloadToken] = useState(0);
    // The identity of the newest comparison request, and of the newest detail
    // request. A response whose id is not the current one is an answer to a
    // question the reader has already moved on from.
    const compareRequest = useRef(0);
    const detailRequest = useRef(0);
    // A session change resets the pair, so the reset and the load have to be one
    // effect: two effects would let the first load run against the old pair.
    const lastSession = useRef<string | undefined>(sessionId);
    const detailBody = useRef<HTMLDivElement | null>(null);
    // The last shell request this mount consumed, so a parent re-render with the
    // same request does not reload the same range again.
    const handledRequest = useRef<string | undefined>(undefined);
    // One jump per target view, built from the seam this mount was given. A host
    // without the core leaves both undefined, and the actions are not drawn.
    const jumpToFiles = useMemo(
      () => (workbench === undefined ? undefined : createViewJump({ seam: workbench, sessionId: sessionId ?? "" })),
      [workbench, sessionId],
    );
    const jumpToGit = jumpToFiles;

    /**
     * Load one comparison and, on the first load, the ref listing.
     * @param session - the conversation to read.
     * @param pair - the two refs; absent means "resolve the default pair".
     */
    const load = useCallback(
      (session: string, pair: { readonly base: string; readonly head: string } | undefined): void => {
        compareRequest.current += 1;
        const mine = compareRequest.current;
        setPhase({ kind: "loading" });
        void (async () => {
          try {
            // The listing is read once per load rather than cached: a branch can
            // appear while the panel is open, and a stale picker is worse than a
            // second round trip.
            const refs = await runtime.loadRefs(session);
            if (compareRequest.current !== mine) return;
            if (!refs.ok) {
              setPhase({ kind: "error", code: refs.error.code });
              return;
            }
            const chosen = pair ?? defaultPair(refs.listing);
            setBase(chosen.base);
            setHead(chosen.head);
            const compared = await runtime.loadCompare(session, chosen.base, chosen.head);
            if (compareRequest.current !== mine) return;
            setPhase(
              compared.ok
                ? { kind: "ready", listing: refs.listing, compare: compared.compare }
                : { kind: "error", code: compared.error.code },
            );
          } catch {
            // A transport failure is not a domain answer: the host did not say
            // "no difference", it failed to answer at all.
            if (compareRequest.current !== mine) return;
            setPhase({ kind: "error", code: "unreadable" });
          }
        })();
      },
      [runtime],
    );

    /**
     * Load one file's diff into the right pane.
     * @param session - the conversation to read.
     * @param pair - the two refs the comparison is pinned to.
     * @param path - the repository-relative path.
     */
    const loadFile = useCallback(
      (session: string, pair: { readonly base: string; readonly head: string }, path: string): void => {
        detailRequest.current += 1;
        const mine = detailRequest.current;
        setDetail({ kind: "loading", path });
        runtime.loadDiff(session, pair.base, pair.head, path).then(
          result => {
            if (detailRequest.current !== mine) return;
            setDetail(result.ok ? { kind: "file", diff: result.diff } : { kind: "error", code: result.error.code });
          },
          () => {
            if (detailRequest.current !== mine) return;
            setDetail({ kind: "error", code: "unreadable" });
          },
        );
      },
      [runtime],
    );

    useEffect(() => {
      if (sessionId === undefined || sessionId === "") {
        // Nothing to ask about. Bumping the counters drops any answer still in
        // flight for the session that just went away.
        compareRequest.current += 1;
        detailRequest.current += 1;
        lastSession.current = sessionId;
        setPhase({ kind: "idle" });
        setBase(undefined);
        setHead(undefined);
        setDetail({ kind: "none" });
        return;
      }
      if (lastSession.current !== sessionId) {
        lastSession.current = sessionId;
        // A new conversation is a new comparison: the tab, the selection and the
        // detail all belong to the old one.
        detailRequest.current += 1;
        setTab("commits");
        setSelectedCommit(undefined);
        setSelectedFile(undefined);
        setDetail({ kind: "none" });
        load(sessionId, undefined);
        return;
      }
      // A reload re-reads the pair the panel is showing; the first load of a
      // session resolves the default pair instead.
      load(sessionId, base === undefined || head === undefined ? undefined : { base, head });
    }, [sessionId, reloadToken, load]);

    /**
     * Show one comparison the reader was sent to.
     *
     * The selection and the range snapshot belong to the range that was on
     * screen, so they are cleared in the same write that moves the pair; the
     * reload token is what actually re-reads, because base/head are also written
     * by a load.
     * @param pair - the two refs.
     */
    const applyFocus = useCallback((pair: { readonly base: string; readonly head: string }): void => {
      detailRequest.current += 1;
      setSelectedCommit(undefined);
      setSelectedFile(undefined);
      setDetail({ kind: "none" });
      setBase(pair.base);
      setHead(pair.head);
      setReloadToken(token => token + 1);
    }, []);

    // Delivery path one: a caller holding the host's own `openView(id, focus)`
    // capability lands the request on the view's owner props. The same request
    // arrives again on parent re-renders, so the key is remembered.
    useEffect(() => {
      const request = viewRequest;
      if (request === null || request === undefined || request.view !== VIEW_ID) return;
      const key = `${request.view}:${request.focus}`;
      if (handledRequest.current === key) return;
      handledRequest.current = key;
      const pair = parseCompareFocus(request.focus);
      if (pair !== undefined) applyFocus(pair);
      completeViewRequest?.();
    }, [viewRequest, completeViewRequest, applyFocus]);

    // Delivery path two: a caller the host gave no capability leaves the focus
    // in the core's queue. Take whatever is waiting at mount and keep listening
    // while the view stays up, so a lazily mounted tab never loses the target. A
    // payload this view cannot read is ignored rather than partially applied.
    useEffect(() => {
      const queue = workbench?.viewFocus;
      if (queue === undefined) return undefined;
      const consume = (): void => {
        const focus = queue.take(VIEW_ID);
        if (focus === undefined) return;
        const pair = parseCompareFocus(focus);
        if (pair === undefined) return;
        applyFocus(pair);
      };
      consume();
      return queue.subscribe?.(consume);
    }, [workbench, applyFocus]);

    // A new file starts at its first line. Doing it in an effect rather than in
    // the click handler keeps it tied to the render that changed the content.
    useEffect(() => {
      if (detailBody.current !== null) detailBody.current.scrollTop = 0;
    }, [detail.kind === "file" ? detail.diff.path : "", detail.kind]);

    const ready = phase.kind === "ready" ? phase.compare : undefined;
    const listing = phase.kind === "ready" ? phase.listing : undefined;
    const summary = ready === undefined ? undefined : summaryReading(ready);
    const commits = ready === undefined ? [] : sortCommits(ready.commits.commits);
    const files = ready === undefined ? [] : sortFiles(ready.files.files);
    const options = listing === undefined ? [] : refOptions(listing, { current: [base ?? "", head ?? ""] });
    const empty = ready !== undefined && commits.length === 0 && files.length === 0;

    /**
     * Change one end of the pair and reload.
     * @param which - the end to change.
     * @param value - the ref it becomes.
     */
    const pick = (which: "base" | "head", value: string): void => {
      // The panel was about a row in the previous range, and the new range may
      // not contain it at all.
      detailRequest.current += 1;
      setSelectedCommit(undefined);
      setSelectedFile(undefined);
      setDetail({ kind: "none" });
      if (which === "base") setBase(value);
      else setHead(value);
      setReloadToken(token => token + 1);
    };

    const swap = (): void => {
      if (base === undefined || head === undefined) return;
      detailRequest.current += 1;
      setSelectedCommit(undefined);
      setSelectedFile(undefined);
      setDetail({ kind: "none" });
      setBase(head);
      setHead(base);
      setReloadToken(token => token + 1);
    };

    const refresh = (): void => {
      if (sessionId === undefined || sessionId === "" || base === undefined || head === undefined) return;
      setReloadToken(token => token + 1);
    };

    /**
     * Select one row and show its detail.
     * @param which - the tab the row belongs to.
     * @param key - the commit hash or the file path.
     */
    const select = (which: Tab, key: string): void => {
      if (which === "commits") {
        setSelectedCommit(key);
        const commit = commits.find(entry => entry.hash === key);
        if (commit !== undefined) {
          // A commit's metadata is already in the list answer, so there is
          // nothing to fetch and nothing to wait for.
          detailRequest.current += 1;
          setDetail({ kind: "commit", commit });
        }
        return;
      }
      setSelectedFile(key);
      if (sessionId === undefined || sessionId === "" || base === undefined || head === undefined) return;
      loadFile(sessionId, { base, head }, key);
    };

    const rows = tab === "commits" ? commits : files;
    // The selection falls back to the first row: a list with no tab stop cannot
    // be reached by keyboard at all, and the first row is where a reader starts
    // anyway.
    const activeCommit = commits.some(entry => entry.hash === selectedCommit) ? selectedCommit : commits[0]?.hash;
    const activeFile = files.some(entry => entry.path === selectedFile) ? selectedFile : files[0]?.path;

    /**
     * Move the selection by one row or by a page.
     * @param delta - how many rows to move.
     */
    const move = (delta: number): void => {
      if (rows.length === 0) return;
      const current =
        tab === "commits"
          ? commits.findIndex(entry => entry.hash === activeCommit)
          : files.findIndex(entry => entry.path === activeFile);
      const next = Math.min(rows.length - 1, Math.max(0, (current < 0 ? 0 : current) + delta));
      const target = rows[next];
      if (target === undefined) return;
      const key = tab === "commits" ? (target as CommitEntry).hash : (target as PrChangedFile).path;
      if (tab === "commits") setSelectedCommit(key);
      else setSelectedFile(key);
      // Moving the cursor is not opening: a reader scanning a list should not
      // trigger a request per keystroke.
      const selector = tab === "commits" ? `[data-testid="commit-row"][data-hash="${CSS.escape(key)}"]` : `[data-testid="file-row"][data-path="${CSS.escape(key)}"]`;
      document.querySelector<HTMLElement>(selector)?.focus();
    };

    const onKey = (event: KeyboardEvent<HTMLElement>, key: string): void => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        select(tab, key);
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
        return;
      }
      if (event.key === "PageDown") {
        event.preventDefault();
        move(10);
        return;
      }
      if (event.key === "PageUp") {
        event.preventDefault();
        move(-10);
      }
    };

    /**
     * Open one path in the file workbench.
     * @param path - the repository-relative path.
     */
    const openInFiles = (path: string): void => {
      jumpToFiles?.("fs-explorer", formatPathFocus(path));
    };

    /**
     * Open one commit in the Git workbench.
     * @param hash - the commit hash.
     */
    const openInGit = (hash: string): void => {
      jumpToGit?.("git-explorer", formatCommitFocus(hash));
    };

    const switchTab = (next: Tab): void => {
      if (next === tab) return;
      setTab(next);
      setDetail({ kind: "none" });
    };

    return (
      <div data-testid="pr-explorer" data-conversation-composer-overlay="">
        <div data-rm="header">
          <h2 data-rm="title">{strings.title}</h2>
          <span data-rm="repo-name">{listing?.repo ?? strings.repoFallback}</span>
          {base === undefined || head === undefined ? null : (
            <span data-rm="range">{rangeLabel(base, head)}</span>
          )}
          <label data-rm="base-field">
            <span data-rm="base-label">{strings.baseLabel}</span>
            <select
              data-rm="base"
              value={base ?? ""}
              onChange={event => pick("base", event.target.value)}
              disabled={options.length === 0}
            >
              {options.map(option => (
                <option key={`base:${option.name}`} value={option.name}>
                  {option.name}
                </option>
              ))}
            </select>
          </label>
          <button type="button" data-rm="swap" onClick={swap} disabled={base === undefined || head === undefined}>
            {strings.swap}
          </button>
          <label data-rm="head-field">
            <span data-rm="head-label">{strings.headLabel}</span>
            <select
              data-rm="head"
              value={head ?? ""}
              onChange={event => pick("head", event.target.value)}
              disabled={options.length === 0}
            >
              {options.map(option => (
                <option key={`head:${option.name}`} value={option.name}>
                  {option.name}
                </option>
              ))}
            </select>
          </label>
          <button type="button" data-rm="refresh" onClick={refresh} disabled={base === undefined || head === undefined}>
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

        {ready !== undefined && summary !== undefined ? (
          <>
            <div data-rm="summary">
              <span data-rm="ahead">{fill(strings.ahead, { count: String(summary.ahead) })}</span>
              <span data-rm="behind">{fill(strings.behind, { count: String(summary.behind) })}</span>
              <span data-rm="files-count">{fill(strings.filesCount, { count: String(summary.files) })}</span>
              <span data-rm="lines">
                <span data-rm="stat-add">+{summary.additions}</span>{" "}
                <span data-rm="stat-del">−{summary.deletions}</span>
              </span>
              {summary.truncatedCommitList ? (
                <span data-rm="commits-truncated">{strings.commitsTruncated}</span>
              ) : null}
            </div>

            {empty ? <p data-rm="no-difference">{strings.noDifference}</p> : null}

            <div data-rm="split" data-open={detail.kind === "none" ? "false" : "true"}>
              <div data-rm="list" role="listbox" aria-label={strings.title} data-page-keys="own">
                <div data-rm="tabs" role="tablist">
                  <button
                    type="button"
                    role="tab"
                    data-rm="tab-commits"
                    aria-selected={tab === "commits"}
                    onClick={() => switchTab("commits")}
                  >
                    {strings.tabCommits}
                  </button>
                  <button
                    type="button"
                    role="tab"
                    data-rm="tab-files"
                    aria-selected={tab === "files"}
                    onClick={() => switchTab("files")}
                  >
                    {strings.tabFiles}
                  </button>
                </div>
                {tab === "commits"
                  ? commits.map(commit => (
                      <CommitRow
                        key={commit.hash}
                        commit={commit}
                        selected={commit.hash === activeCommit}
                        onSelect={hash => select("commits", hash)}
                        onKey={onKey}
                      />
                    ))
                  : files.map(file => (
                      <FileRow
                        key={file.path}
                        file={file}
                        strings={strings}
                        selected={file.path === activeFile}
                        onSelect={path => select("files", path)}
                        onKey={onKey}
                        {...(jumpToFiles === undefined ? {} : { onOpenInFiles: openInFiles })}
                      />
                    ))}
              </div>
              <DetailPane
                phase={detail}
                strings={strings}
                bodyRef={detailBody}
                {...(jumpToFiles === undefined ? {} : { onOpenInFiles: openInFiles })}
                {...(jumpToGit === undefined ? {} : { onOpenInGit: openInGit })}
              />
            </div>
          </>
        ) : null}
      </div>
    );
  };
}
