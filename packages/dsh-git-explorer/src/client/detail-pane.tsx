/** The right column's lower half: parents, message and changed files of one commit. */
import { useEffect, useRef, useState } from "react";

import { basename, formatCommitDetail, groupByDirectory, statusLetter } from "./model.ts";
import type { Translate } from "./copy.ts";
import type { GitCommitDetail, GitCommitResult } from "../host/types.ts";
import { describeFailure, unwrapTransport, type GitRemoteFace } from "./wire.ts";

type DetailState =
  | { readonly kind: "idle" }
  | { readonly kind: "loading" }
  | { readonly kind: "failed"; readonly message: string }
  | { readonly kind: "ready"; readonly detail: GitCommitDetail };

/** Props one detail pane mount reads. */
export interface DetailPaneProps {
  readonly sessionId: string | undefined;
  readonly hash: string | undefined;
  readonly remote: GitRemoteFace | undefined;
  readonly t: Translate;
  readonly onSelect: (hash: string) => void;
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

/**
 * Render the commit detail pane.
 * @param props - session, selected hash, the Remote face and copy.
 * @returns the detail pane element.
 */
export function DetailPane({ sessionId, hash, remote, t, onSelect }: DetailPaneProps) {
  const [state, setState] = useState<DetailState>({ kind: "idle" });
  const [retryToken, setRetryToken] = useState(0);
  const cache = useRef(new Map<string, GitCommitDetail>());

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
      .then(() => remote.commit(sessionId, { hash }))
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

  const head = formatCommitDetail(
    state.kind === "ready"
      ? state.detail
      : { hash: hash ?? "", parents: [], author: "", time: Math.floor(Date.now() / 1000), subject: "" },
  );

  return (
    <section className="gx-detail" data-testid="git-detail">
      <header className="gx-detail-head">
        <span>{t("detail.title")}</span>
        {hash === undefined ? null : <span className="gx-hash">{head.shortHash}</span>}
        <span className="gx-spacer" style={{ flex: 1 }} />
      </header>
      <div className="gx-detail-body">
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
                      <div key={file.path} className="gx-detail-file">
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
                      </div>
                    ))}
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
