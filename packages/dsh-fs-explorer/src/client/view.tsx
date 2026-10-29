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
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import type { Translate } from "./copy.ts";
import {
  buildTree,
  describeListing,
  flattenTree,
  joinPath,
  listingPath,
  parseFocus,
  type FocusTarget,
  type TreeLevel,
} from "./model.ts";
import { parseStatusZ, type StatusMap } from "./status.ts";
import { CollapseIcon, FolderIcon, RefreshIcon, TreeBody } from "./tree.tsx";
import {
  describeFailure,
  normalizeListing,
  normalizeStatusSnapshot,
  type FilesResolver,
  type StatusResolver,
  type WorkspaceFilesFace,
} from "./wire.ts";
import { VIEW_ID } from "../shared.ts";

/** The slice of the workbench core service this view reads. */
export interface WorkbenchFace {
  readonly version: number;
  currentSessionId(): string | undefined;
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
    const levelsRef = useRef(levels);
    levelsRef.current = levels;
    const [expanded, setExpanded] = useState<ReadonlySet<string>>(() => new Set());
    const [selected, setSelected] = useState<string | undefined>(undefined);
    const [reloadToken, setReloadToken] = useState(0);
    const [reveal, setReveal] = useState<FocusTarget | undefined>(undefined);
    const controllers = useRef<Map<string, AbortController>>(new Map());
    const handledRequest = useRef<string | undefined>(undefined);

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
      setSelected(undefined);
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
    // path.
    useEffect(() => {
      if (sessionId === undefined || statusFace === undefined) {
        setStatuses(undefined);
        return;
      }
      let alive = true;
      const controller = new AbortController();
      setStatuses(undefined);
      Promise.resolve()
        .then(() => statusFace.snapshot(sessionId, { maxCommits: 1 }, controller.signal))
        .then(response => {
          if (!alive) return;
          const normalized = normalizeStatusSnapshot(response);
          setStatuses(normalized.ok ? parseStatusZ(normalized.status) : undefined);
        })
        .catch(() => {
          if (alive) setStatuses(undefined);
        });
      return () => {
        alive = false;
        controller.abort();
      };
    }, [sessionId, statusFace, reloadToken]);

    // The Git panel jumps with `path:<workspace path>:<line>`; consume that
    // request once and remember the target until the root level can honor it.
    useEffect(() => {
      const request = props.viewRequest;
      if (request === null || request === undefined || request.view !== VIEW_ID) return;
      const key = `${request.view}:${request.focus}`;
      if (handledRequest.current === key) return;
      handledRequest.current = key;
      const target = parseFocus(request.focus);
      if (target !== undefined) setReveal(target);
      props.completeViewRequest?.();
    }, [props.viewRequest, props.completeViewRequest]);

    const rootLevel = levels.get("");
    const rootReady = rootLevel?.status === "ready";

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
        setSelected(reveal.path);
        setReveal(undefined);
      };
      void run();
      return () => {
        alive = false;
      };
    }, [reveal, sessionId, files, rootReady, loadLevel]);

    const rows = useMemo(() => flattenTree(levels, expanded, statuses), [levels, expanded, statuses]);
    const changeCount = statuses === undefined ? undefined : Object.keys(statuses).length;
    const summaryTone =
      statuses === undefined
        ? "neutral"
        : Object.values(statuses).some(marker => marker.status === "conflicted")
          ? "conflict"
          : changeCount === 0
            ? "success"
            : "warning";

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
            <TreeBody
              rows={rows}
              selectedPath={selected}
              t={t}
              onToggle={toggleDirectory}
              onSelect={setSelected}
              onRetry={retryDirectory}
            />
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
            <span className="fx-spacer" />
            <span>{t("foot.order")}</span>
          </footer>
        ) : null}
      </section>
    );
  }

  return FsExplorerView;
}
