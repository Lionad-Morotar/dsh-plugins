/** The right column's lower half: parents, message and changed files of one commit. */
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import {
  basename,
  createPreviewCache,
  formatCommitDetail,
  groupByDirectory,
  placePreviewCard,
  previewCacheKey,
  statusLetter,
} from "./model.ts";
import type { Translate } from "./copy.ts";
import type { GitBlobPage, GitCommitDetail, GitCommitFile, GitCommitResult, GitShowResult } from "../host/types.ts";
import { describeFailure, unwrapTransport, type GitRemoteFace } from "./wire.ts";
import {
  commitReferencePayload,
  referenceAvailability,
  type CommitReferencePayload,
  type ReferenceInsertionResult,
} from "./reference.ts";

type DetailState =
  | { readonly kind: "idle" }
  | { readonly kind: "loading" }
  | { readonly kind: "failed"; readonly message: string }
  | { readonly kind: "ready"; readonly detail: GitCommitDetail };

/** How long the pointer must rest on a row before the preview is wanted. */
const PREVIEW_DELAY_MS = 200;
/** The card shows a single screenful; the full file opens through the row click. */
const PREVIEW_LINE_LIMIT = 40;
const PREVIEW_CACHE_SIZE = 24;
const SHORT_HASH_LENGTH = 7;

/** The viewport rectangle of the row a preview belongs to. */
interface PreviewAnchor {
  readonly left: number;
  readonly top: number;
  readonly right: number;
  readonly bottom: number;
}

type PreviewState =
  | { readonly kind: "idle" }
  | { readonly kind: "loading"; readonly file: GitCommitFile; readonly anchor: PreviewAnchor }
  | { readonly kind: "ready"; readonly file: GitCommitFile; readonly anchor: PreviewAnchor; readonly page: GitBlobPage }
  | { readonly kind: "unavailable"; readonly file: GitCommitFile; readonly anchor: PreviewAnchor; readonly message: string };

/** Props one detail pane mount reads. */
export interface DetailPaneProps {
  readonly sessionId: string | undefined;
  readonly hash: string | undefined;
  readonly remote: GitRemoteFace | undefined;
  readonly t: Translate;
  readonly onSelect: (hash: string) => void;
  /** Open one changed file of this commit in the file workbench. */
  readonly onOpenFile?: (path: string, line?: number) => void;
  /** Ref names pointing at the selected commit, for the reference payload. */
  readonly refs?: readonly string[];
  /**
   * The composer's write face, or undefined on a host that publishes none.
   * Only `captureInsertion` is read from it: the span is the one coordinate a
   * chip insert may use, and it cannot be reconstructed from the draft text.
   */
  readonly inputActions?: ReferenceInputActions;
  /** The composer's phase, or undefined when the host publishes no input state. */
  readonly phase?: string;
  /** Writes one reference; absent when the entry could not build a writer. */
  readonly onReference?: (payload: CommitReferencePayload) => ReferenceInsertionResult;
}

/** The slice of the composer face the reference button reads. */
export interface ReferenceInputActions {
  captureInsertion?(): { readonly start: number; readonly end: number; readonly draftRev: number };
  insertText?(text: string, span: { readonly start: number; readonly end: number; readonly draftRev: number }): boolean;
}

function FileStat({ additions, deletions }: { readonly additions: number | null; readonly deletions: number | null }) {
  if (additions === null && deletions === null) return <span className="gx-stat-muted">bin</span>;
  return (
    <>
      <span className="gx-add">{`+${String(additions ?? 0)}`}</span>
      <span className="gx-del">{`-${String(deletions ?? 0)}`}</span>
    </>
  );
}

/** Map a host failure code to the short phrase a card can afford. */
function previewFailureText(code: string, message: string, t: Translate): string {
  if (code === "too-large") return t("preview.tooLarge");
  if (code === "not-found") return t("preview.notFound");
  return message === "" ? t("preview.unavailable") : message;
}

function PreviewBody({
  preview,
  t,
  textRef,
}: {
  readonly preview: Exclude<PreviewState, { kind: "idle" }>;
  readonly t: Translate;
  readonly textRef: { readonly current: HTMLPreElement | null };
}) {
  if (preview.kind === "loading") return <span className="gx-preview-note">{t("preview.loading")}</span>;
  if (preview.kind === "unavailable") {
    return (
      <div className="gx-preview-unavailable">
        <strong>{t("preview.unavailable")}</strong>
        <span className="gx-preview-note">{preview.message}</span>
      </div>
    );
  }
  const { page } = preview;
  if (page.kind === "binary" || page.kind === "submodule") {
    return (
      <div className="gx-preview-unavailable">
        <strong>{t("preview.unavailable")}</strong>
        <span className="gx-preview-note">
          {page.kind === "binary" ? t("preview.binary") : `${t("preview.submodule")} · ${page.revision.slice(0, 12)}`}
        </span>
      </div>
    );
  }
  return (
    <>
      {page.text === "" ? (
        <span className="gx-preview-note">{t("preview.empty")}</span>
      ) : (
        <pre ref={textRef} className="gx-preview-text">{page.text}</pre>
      )}
      {page.source === "first-parent" ? <span className="gx-preview-note">{t("preview.deleted")}</span> : null}
      {page.eof ? null : <span className="gx-preview-note">{t("preview.truncated")}</span>}
    </>
  );
}

/**
 * The floating card itself.
 *
 * It portals to the document body so neither `.gx-detail` nor
 * `.gx-detail-body` can clip it; the measured box then decides where the fixed
 * card sits. The card is deliberately unreachable by pointer events so it can
 * never sit between the reader and the row that owns the click.
 */
function PreviewCard({
  preview,
  hash,
  t,
}: {
  readonly preview: Exclude<PreviewState, { kind: "idle" }>;
  readonly hash: string;
  readonly t: Translate;
}) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const textRef = useRef<HTMLPreElement | null>(null);
  const [placement, setPlacement] = useState<{ readonly left: number; readonly top: number } | null>(null);
  const [clipped, setClipped] = useState(false);

  useLayoutEffect(() => {
    const element = cardRef.current;
    if (element === null) return;
    const rect = element.getBoundingClientRect();
    setPlacement(
      placePreviewCard(
        preview.anchor,
        { width: rect.width, height: rect.height },
        { width: window.innerWidth, height: window.innerHeight },
      ),
    );
    const text = textRef.current;
    setClipped(text !== null && text.scrollHeight > text.clientHeight + 1);
  }, [preview]);

  if (typeof document === "undefined") return null;
  return createPortal(
    <div
      ref={cardRef}
      className="gx-preview"
      data-testid="gx-preview-card"
      data-clipped={clipped ? "true" : "false"}
      role="tooltip"
      style={{
        position: "fixed",
        pointerEvents: "none",
        left: placement?.left ?? 0,
        top: placement?.top ?? 0,
        visibility: placement === null ? "hidden" : "visible",
      }}
    >
      <div className="gx-preview-head">
        <span className="gx-badge" data-status={preview.file.status} title={t(`status.${preview.file.status}`)}>
          {statusLetter(preview.file.status)}
        </span>
        <span className="gx-preview-name" title={preview.file.path}>
          {basename(preview.file.path)}
        </span>
        <span className="gx-preview-rev">{`${hash.slice(0, SHORT_HASH_LENGTH)} · ${t("preview.revision")}`}</span>
      </div>
      <div className="gx-preview-body">
        <PreviewBody preview={preview} t={t} textRef={textRef} />
      </div>
    </div>,
    document.body,
  );
}

/**
 * Render the commit detail pane.
 * @param props - session, selected hash, the Remote face and copy.
 * @returns the detail pane element.
 */
export function DetailPane({
  sessionId,
  hash,
  remote,
  t,
  onSelect,
  onOpenFile,
  refs,
  inputActions,
  phase,
  onReference,
}: DetailPaneProps) {
  const [state, setState] = useState<DetailState>({ kind: "idle" });
  const [retryToken, setRetryToken] = useState(0);
  const cache = useRef(new Map<string, GitCommitDetail>());
  // The write is synchronous, so a state flag would never paint between the two
  // clicks of a double click. A ref is the guard that actually holds: it is
  // already set when the second click arrives.
  const referencing = useRef(false);

  const [preview, setPreview] = useState<PreviewState>({ kind: "idle" });
  const previewCache = useRef(createPreviewCache<GitBlobPage>(PREVIEW_CACHE_SIZE));
  const hoverKey = useRef<string | undefined>(undefined);
  const hoverTimer = useRef<number | undefined>(undefined);
  const hoverController = useRef<AbortController | undefined>(undefined);
  const bodyRef = useRef<HTMLDivElement | null>(null);

  const closePreview = useCallback((): void => {
    hoverKey.current = undefined;
    if (hoverTimer.current !== undefined) {
      window.clearTimeout(hoverTimer.current);
      hoverTimer.current = undefined;
    }
    hoverController.current?.abort();
    hoverController.current = undefined;
    setPreview(current => (current.kind === "idle" ? current : { kind: "idle" }));
  }, []);

  const beginPreview = useCallback(
    (file: GitCommitFile, element: HTMLElement): void => {
      closePreview();
      if (hash === undefined) return;
      const rect = element.getBoundingClientRect();
      const anchor: PreviewAnchor = { left: rect.left, top: rect.top, right: rect.right, bottom: rect.bottom };
      const key = previewCacheKey(hash, file.path);
      hoverKey.current = key;
      hoverTimer.current = window.setTimeout(() => {
        hoverTimer.current = undefined;
        if (hoverKey.current !== key) return;
        const cached = previewCache.current.get(key);
        if (cached !== undefined) {
          setPreview({ kind: "ready", file, anchor, page: cached });
          return;
        }
        if (sessionId === undefined || remote === undefined || typeof remote.show !== "function") {
          setPreview({ kind: "unavailable", file, anchor, message: t("preview.noService") });
          return;
        }
        const controller = new AbortController();
        hoverController.current = controller;
        setPreview({ kind: "loading", file, anchor });
        Promise.resolve()
          .then(() => remote.show({ sessionId, hash, path: file.path, offset: 1, limit: PREVIEW_LINE_LIMIT }, controller.signal))
          .then(transport => {
            if (controller.signal.aborted || hoverKey.current !== key) return;
            const unwrapped = unwrapTransport<GitShowResult>(transport);
            if (!unwrapped.ok) {
              setPreview({ kind: "unavailable", file, anchor, message: unwrapped.message });
              return;
            }
            const result = unwrapped.result;
            if (!result.ok) {
              setPreview({
                kind: "unavailable",
                file,
                anchor,
                message: previewFailureText(result.error.code, result.error.message, t),
              });
              return;
            }
            previewCache.current.set(key, result.page);
            setPreview({ kind: "ready", file, anchor, page: result.page });
          })
          .catch((error: unknown) => {
            if (controller.signal.aborted || hoverKey.current !== key) return;
            setPreview({ kind: "unavailable", file, anchor, message: describeFailure(error) });
          })
          .finally(() => {
            if (hoverController.current === controller) hoverController.current = undefined;
          });
      }, PREVIEW_DELAY_MS);
    },
    [closePreview, hash, remote, sessionId, t],
  );

  useEffect(() => {
    if (hash === undefined) {
      setState({ kind: "idle" });
      return;
    }
    const cached = cache.current.get(hash);
    if (cached !== undefined) {
      setState({ kind: "ready", detail: cached });
      return;
    }
    if (remote === undefined || sessionId === undefined) {
      setState({ kind: "failed", message: t("state.noService.description") });
      return;
    }
    let alive = true;
    setState({ kind: "loading" });
    Promise.resolve()
      .then(() => remote.commit({ sessionId, hash }))
      .then(transport => {
        if (!alive) return;
        const unwrapped = unwrapTransport<GitCommitResult>(transport);
        if (!unwrapped.ok) {
          setState({ kind: "failed", message: unwrapped.message });
          return;
        }
        const result = unwrapped.result;
        if (result.ok) {
          cache.current.set(hash, result.detail);
          setState({ kind: "ready", detail: result.detail });
        } else {
          setState({ kind: "failed", message: result.error.message === "" ? result.error.code : result.error.message });
        }
      })
      .catch((error: unknown) => {
        if (alive) setState({ kind: "failed", message: describeFailure(error) });
      });
    return () => {
      alive = false;
    };
  }, [hash, remote, sessionId, retryToken, t]);

  // Every path that invalidates the pointed-at row closes the card: Escape, a
  // scroll of the detail list, a different selected commit, or a reload.
  useEffect(() => {
    if (preview.kind === "idle") return undefined;
    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key === "Escape") closePreview();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [preview.kind, closePreview]);

  useEffect(() => {
    const body = bodyRef.current;
    if (body === null) return undefined;
    const onScroll = (): void => closePreview();
    body.addEventListener("scroll", onScroll, { passive: true });
    return () => body.removeEventListener("scroll", onScroll);
  }, [closePreview]);

  useEffect(() => {
    closePreview();
  }, [hash, retryToken, sessionId, remote, closePreview]);

  useEffect(
    () => () => {
      hoverKey.current = undefined;
      if (hoverTimer.current !== undefined) window.clearTimeout(hoverTimer.current);
      hoverController.current?.abort();
    },
    [],
  );

  const head = formatCommitDetail(
    state.kind === "ready"
      ? state.detail
      : { hash: hash ?? "", parents: [], author: "", time: Math.floor(Date.now() / 1000), subject: "" },
  );

  const availability = referenceAvailability({
    sessionId,
    hasComposer: inputActions !== undefined && typeof inputActions.captureInsertion === "function",
    phase,
  });
  const canReference = availability.enabled && state.kind === "ready" && onReference !== undefined;
  const referenceReason = availability.enabled
    ? state.kind === "ready"
      ? undefined
      : t("detail.empty")
    : t(availability.reasonKey);

  const onReferenceClick = (): void => {
    if (!canReference || referencing.current || state.kind !== "ready" || onReference === undefined) return;
    referencing.current = true;
    try {
      const result = onReference(commitReferencePayload(state.detail, head.shortHash, refs ?? []));
      // A failed write leaves the draft untouched; the reader needs to know the
      // button did nothing rather than assume the chip is somewhere off-screen.
      if (result === "failed") window.console?.warn?.(`[dsh-git-explorer] ${t("reference.failed")}`);
    } finally {
      referencing.current = false;
    }
  };

  return (
    <section className="gx-detail" data-testid="git-detail">
      <header className="gx-detail-head">
        <span>{t("detail.title")}</span>
        {hash === undefined ? null : <span className="gx-hash">{head.shortHash}</span>}
        <span className="gx-spacer" style={{ flex: 1 }} />
        <button
          type="button"
          className="gx-refbtn"
          disabled={!canReference}
          aria-disabled={!canReference}
          title={referenceReason ?? t("reference.hint")}
          data-testid="gx-reference-commit"
          onClick={onReferenceClick}
        >
          {t("reference.action")}
        </button>
      </header>
      <div className="gx-detail-body" ref={bodyRef}>
        {state.kind === "idle" ? (
          <div className="gx-skeleton">{t("detail.empty")}</div>
        ) : state.kind === "loading" ? (
          <div className="gx-skeleton">{t("history.detailLoading")}</div>
        ) : state.kind === "failed" ? (
          <div className="gx-empty gx-empty-inline">
            <strong>{t("detail.failed")}</strong>
            <span>{state.message}</span>
            <button type="button" className="gx-btn" onClick={() => setRetryToken(token => token + 1)}>
              {t("action.retry")}
            </button>
          </div>
        ) : (
          <>
            <div className="gx-detail-subject">{state.detail.subject}</div>
            <div className="gx-detail-meta">
              <span className="gx-author">{state.detail.author}</span>
              <span>{head.relative}</span>
              <span title={new Date(state.detail.time * 1000).toLocaleString()}>
                {new Date(state.detail.time * 1000).toLocaleDateString()}
              </span>
            </div>
            <div className="gx-parents">
              <span className="gx-parents-label">{t("detail.parents")}</span>
              {state.detail.parents.length === 0 ? (
                <span className="gx-parents-label">{t("detail.noParents")}</span>
              ) : (
                state.detail.parents.map(parent => (
                  <button key={parent} type="button" className="gx-parent" title={parent} onClick={() => onSelect(parent)}>
                    {parent.slice(0, 7)}
                  </button>
                ))
              )}
            </div>
            {state.detail.body === "" ? null : <pre className="gx-body-text">{state.detail.body}</pre>}
            <div className="gx-detail-files">
              <div className="gx-detail-files-title">{`${t("detail.files")} · ${String(state.detail.files.length)}`}</div>
              {state.detail.files.length === 0 ? (
                <div className="gx-skeleton">{t("detail.noFiles")}</div>
              ) : (
                groupByDirectory(state.detail.files).map(group => (
                  <div key={group.dir === "" ? "." : group.dir} className="gx-detail-group">
                    <div className="gx-detail-dir">{group.dir === "" ? t("changes.root") : group.dir}</div>
                    {group.files.map(file => (
                      <button
                        key={file.path}
                        type="button"
                        className="gx-detail-file"
                        data-testid="gx-detail-file"
                        title={file.path}
                        onClick={() => onOpenFile?.(file.path)}
                        onMouseEnter={event => beginPreview(file, event.currentTarget)}
                        onMouseLeave={closePreview}
                      >
                        <span className="gx-badge" data-status={file.status}>
                          {statusLetter(file.status)}
                        </span>
                        <span className="gx-file-name">
                          {basename(file.path)}
                          {file.origPath === undefined ? null : <span className="gx-file-orig">{basename(file.origPath)}</span>}
                        </span>
                        <span className="gx-file-stats">
                          <FileStat additions={file.additions} deletions={file.deletions} />
                        </span>
                      </button>
                    ))}
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>
      {preview.kind === "idle" ? null : <PreviewCard preview={preview} hash={hash ?? ""} t={t} />}
    </section>
  );
}
