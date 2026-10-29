/**
 * The Git workbench's conversation view.
 *
 * Two permanent columns: the working tree on the left, history and the selected
 * commit on the right. The view owns loading, paging and selection; parsing and
 * graph layout are pure functions in `model.ts`. Every host seam is optional at
 * read time so a deployment without the Git service renders an explicit empty
 * state instead of throwing inside the conversation shell.
 */
import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";

import { ChangesPane } from "./changes-pane.tsx";
import { DetailPane } from "./detail-pane.tsx";
import { HistoryPane, HISTORY_PAGE_SIZE } from "./history-pane.tsx";
import type { Translate } from "./copy.ts";
import { createJump, groupChanges, layoutGraph, type GraphRow } from "./model.ts";
import { describeFailure, unwrapTransport, type GitRemoteFace, type RemoteResolver } from "./wire.ts";
import type { GitCommitNode, GitQueryResult, GitSnapshot, GitSnapshotResult } from "../host/types.ts";

/** The `workbench.views` seam this view binds and jumps through. */
export interface ViewSeamFace {
  bind?(sessionId: string, open: (id: string, focus: string) => void): () => void;
  open(sessionId: string, id: string, focus?: string): boolean | void;
}

/** The slice of the workbench core service this view reads. */
export interface WorkbenchFace {
  readonly version: number;
  currentSessionId(): string | undefined;
  readonly views?: ViewSeamFace;
  openView?(id: string, focus?: string): boolean;
}

/** Owner props the host passes to a `conversation.view` entry. */
export interface ConversationViewProps {
  readonly sessionId?: string;
  readonly openView?: (view: string, focus: string) => void;
}

/** What one view mount closes over. */
export interface ViewWiring {
  readonly workbench: WorkbenchFace;
  readonly version: number;
  readonly t: Translate;
  readonly remote: RemoteResolver;
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

type LoadState =
  | { readonly kind: "idle" }
  | { readonly kind: "loading" }
  | { readonly kind: "no-service" }
  | { readonly kind: "failed"; readonly message: string }
  | { readonly kind: "ready"; readonly snapshot: GitSnapshot };

const statsStyle: CSSProperties = { display: "flex", alignItems: "center", gap: 8 };

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

function repoName(root: string): string {
  const parts = root.split(/[\\/]/u).filter(Boolean);
  return parts.at(-1) ?? root;
}

/**
 * Build the view component for one mount.
 * @param wiring - the core service, contract version, copy and Remote resolver.
 * @returns the component registered into `conversation.view`.
 */
export function createGitExplorerView(wiring: ViewWiring) {
  const { workbench, version, t, remote: resolveRemote } = wiring;

  function GitExplorerView(props: ConversationViewProps) {
    const sessionId = props.sessionId ?? workbench.currentSessionId();
    const sessionRef = useRef(sessionId);
    sessionRef.current = sessionId;
    // Resolve once per mount: the Remote namespace is a stable service, and a
    // fresh proxy identity on every render would restart the snapshot effect.
    const remote = useMemo(() => resolveRemote(), [resolveRemote]);
    const [load, setLoad] = useState<LoadState>(() => ({ kind: initialViewState(sessionId, remote !== undefined) }));
    const [reloadToken, setReloadToken] = useState(0);
    const [commits, setCommits] = useState<readonly GitCommitNode[]>([]);
    const [hasMore, setHasMore] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [loadError, setLoadError] = useState<string | undefined>(undefined);
    const [selected, setSelected] = useState<string | undefined>(undefined);

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
          setSelected(previous =>
            previous !== undefined && snapshot.commits.some(commit => commit.hash === previous)
              ? previous
              : snapshot.commits[0]?.hash,
          );
        })
        .catch((error: unknown) => {
          if (alive) setLoad({ kind: "failed", message: describeFailure(error) });
        });
      return () => {
        alive = false;
      };
    }, [sessionId, remote, reloadToken]);

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

    const loadMore = useCallback((): void => {
      if (sessionId === undefined || remote === undefined || !hasMore || loadingMore) return;
      const requested = sessionId;
      setLoadingMore(true);
      setLoadError(undefined);
      Promise.resolve()
        .then(() => remote.query({ sessionId, skip: commits.length, limit: HISTORY_PAGE_SIZE }))
        .then(transport => {
          // The user may have switched conversations while this page was in
          // flight; appending it would mix two repositories in one list.
          if (sessionRef.current !== requested) return;
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

    const refresh = (): void => setReloadToken(token => token + 1);
    const retry = (): void => setReloadToken(token => token + 1);

    const head = snapshot?.head;
    const changedCount = groups.reduce((sum, group) => sum + group.files.length, 0);

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
            <span className="gx-repo" title={snapshot?.root ?? t("view.title")}>
              {snapshot === undefined ? t("view.title") : repoName(snapshot.root)}
            </span>
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
          <StateBlock title={t("state.failed.title")} description={load.message} actionLabel={t("action.retry")} onAction={retry} />
        ) : load.kind === "ready" && !load.snapshot.isRepository ? (
          <StateBlock
            title={t("state.notRepository.title")}
            description={t("state.notRepository.description")}
            actionLabel={t("action.retry")}
            onAction={retry}
          />
        ) : load.kind === "ready" ? (
          <div className="gx-body">
            <ChangesPane groups={groups} stats={stats} t={t} onOpen={onOpenFile} />
            <div className="gx-col">
              <HistoryPane
                commits={commits}
                graph={graph}
                selectedHash={selected}
                headHash={load.snapshot.head?.hash ?? null}
                total={load.snapshot.counts.commits}
                hasMore={hasMore}
                loadingMore={loadingMore}
                loadError={loadError}
                t={t}
                onSelect={setSelected}
                onLoadMore={loadMore}
                {...(load.snapshot.counts.commits === 0
                  ? {
                      emptyTitle: t("state.emptyRepository.title"),
                      emptyDescription: t("state.emptyRepository.description"),
                      onRetry: retry,
                      retryLabel: t("action.retry"),
                    }
                  : {})}
              />
              <DetailPane sessionId={sessionId} hash={selected} remote={remote} t={t} onSelect={setSelected} />
            </div>
          </div>
        ) : null}
      </section>
    );
  }

  return GitExplorerView;
}
