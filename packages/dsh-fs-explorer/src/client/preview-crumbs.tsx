/**
 * The preview toolbar's breadcrumb and its sibling flyout.
 *
 * The toolbar used to show one opaque path string. Walking up from the open
 * file means two separate questions: where am I (the crumb row) and what else
 * sits beside me (the flyout). They share one component because the flyout is
 * always anchored to, and owned by, the crumb that opened it.
 */
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactElement,
} from "react";

import type { Translate } from "./copy.ts";
import { badgeFor, buildTree, iconFor, joinPath, type TreeNode } from "./model.ts";
import { previewCrumbs } from "./preview-crumbs-model.ts";
import { FolderIcon } from "./tree.tsx";
import { describeFailure, normalizeListing, type WorkspaceFilesFace } from "./wire.ts";

export interface PreviewCrumbsProps {
  readonly path: string;
  readonly sessionId?: string;
  readonly files?: WorkspaceFilesFace;
  readonly t: Translate;
  /** 由调用方判定：提交版本、工作区外绝对路径、缺文件服务时传 false。 */
  readonly interactive: boolean;
  /** 不可交互时挂在容器 title 上说明原因。 */
  readonly unavailableReason?: string;
  /** 选中同级条目：文件开同级面板，目录也按目录语义交给调用方。 */
  readonly onOpenPeer: (path: string, kind: "file" | "directory") => void;
}

/** 本组件自己的文案，下一步并进 PREVIEW_COPY。 */
export const PREVIEW_CRUMBS_COPY: { zh: Record<string, string>; en: Record<string, string> } = {
  zh: {
    "preview.crumbs.open": "打开同级面板",
    "preview.crumbs.loading": "载入中…",
    "preview.crumbs.empty": "空目录",
    "preview.crumbs.failed": "读取目录失败",
    "preview.crumbs.truncated": "仅显示前 {count} 项",
  },
  en: {
    "preview.crumbs.open": "Open the sibling panel",
    "preview.crumbs.loading": "Loading…",
    "preview.crumbs.empty": "Empty directory",
    "preview.crumbs.failed": "Could not read the directory",
    "preview.crumbs.truncated": "Showing the first {count} items",
  },
};

/** One directory the flyout is showing, with the state of its listing. */
interface PeersState {
  /** The directory that was asked for; the head line shows it verbatim. */
  readonly dir: string;
  readonly status: "loading" | "ready" | "failed";
  readonly nodes: readonly TreeNode[];
  /** Prefix for a peer's own path: the host's normalized dir when it sent one. */
  readonly prefix: string;
  readonly truncated: boolean;
  /** Failure detail, kept for the status row's tooltip only. */
  readonly message: string;
}

/** Gap between the crumb button and the flyout, and the viewport margin. */
const FLYOUT_GAP = 4;
const VIEWPORT_MARGIN = 8;
/** The flyout's narrowest width; clamping uses it so the card never leaves the viewport. */
const FLYOUT_MIN_WIDTH = 220;

function failedPeers(dir: string, message: string): PeersState {
  return { dir, status: "failed", nodes: [], prefix: dir, truncated: false, message };
}

/**
 * The preview path as breadcrumbs, each opening its own directory's siblings.
 *
 * `interactive` is the caller's call, not this component's: a commit-version
 * preview and a path outside the workspace have no listing to ask for, so they
 * get the same visual with the reason on the container instead of dead buttons.
 */
export function PreviewCrumbs(props: PreviewCrumbsProps): ReactElement {
  const { path, sessionId, files, t, interactive, unavailableReason, onOpenPeer } = props;
  const model = previewCrumbs(path);

  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [peers, setPeers] = useState<PeersState | null>(null);
  const [anchor, setAnchor] = useState<{ readonly left: number; readonly top: number } | null>(null);

  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const popoverRef = useRef<HTMLDivElement | null>(null);
  const rowRefs = useRef<(HTMLButtonElement | null)[]>([]);
  // Guards every async settle: a closed flyout or an unmounted component must
  // not write state, and a stale listing must not overwrite a newer one.
  const aliveRef = useRef(true);
  const ticketRef = useRef(0);

  useEffect(() => {
    aliveRef.current = true;
    return () => {
      aliveRef.current = false;
    };
  }, []);

  const load = useCallback(
    async (dir: string): Promise<void> => {
      const ticket = ++ticketRef.current;
      const settle = (next: PeersState): void => {
        if (!aliveRef.current || ticket !== ticketRef.current) return;
        setPeers(next);
      };
      setPeers({ dir, status: "loading", nodes: [], prefix: dir, truncated: false, message: "" });
      if (files === undefined || sessionId === undefined) {
        settle(failedPeers(dir, ""));
        return;
      }
      let response: unknown;
      try {
        response = await files.list(sessionId, dir);
      } catch (error) {
        settle(failedPeers(dir, describeFailure(error)));
        return;
      }
      const normalized = normalizeListing(response);
      if (!normalized.ok) {
        settle(failedPeers(dir, normalized.message));
        return;
      }
      const { listing } = normalized;
      settle({
        dir,
        status: "ready",
        nodes: buildTree(listing.entries),
        // The host answers with the directory it actually read, which may be
        // normalized differently from what was asked for; peer paths follow it.
        prefix: typeof listing.path === "string" ? listing.path : dir,
        truncated: listing.truncated === true,
        message: "",
      });
    },
    [files, sessionId],
  );

  const close = useCallback((restoreFocus: boolean): void => {
    const trigger = triggerRef.current;
    ticketRef.current += 1;
    setOpenIndex(null);
    setPeers(null);
    setAnchor(null);
    if (restoreFocus) trigger?.focus();
  }, []);

  const openAt = useCallback(
    (index: number, button: HTMLButtonElement): void => {
      if (openIndex === index) {
        close(false);
        return;
      }
      triggerRef.current = button;
      const rect = button.getBoundingClientRect();
      const width = typeof window === "undefined" ? 0 : window.innerWidth;
      const left =
        width > 0
          ? Math.max(VIEWPORT_MARGIN, Math.min(rect.left, width - FLYOUT_MIN_WIDTH - VIEWPORT_MARGIN))
          : Math.max(VIEWPORT_MARGIN, rect.left);
      setAnchor({ left, top: rect.bottom + FLYOUT_GAP });
      setOpenIndex(index);
      void load(model.segments[index]?.parent ?? "");
    },
    [close, load, model.segments, openIndex],
  );

  // Focus lands on the highlighted row so the flyout is usable from the
  // keyboard the moment it opens, and again after a drill-down.
  useEffect(() => {
    if (openIndex === null || peers === null || peers.status !== "ready") return;
    const current = peers.nodes.findIndex(node => node.name === model.segments[openIndex]?.name);
    rowRefs.current[current >= 0 ? current : 0]?.focus();
  }, [model.segments, openIndex, peers]);

  useEffect(() => {
    if (openIndex === null) return;
    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      close(true);
    };
    const onPointerDown = (event: Event): void => {
      const target = event.target;
      if (!(target instanceof Node)) return;
      if (popoverRef.current?.contains(target) === true) return;
      // The crumb row's own buttons toggle themselves; treating them as
      // "outside" here would close and immediately reopen on the same click.
      if (triggerRef.current?.parentElement?.contains(target) === true) return;
      close(false);
    };
    document.addEventListener("keydown", onKeyDown, true);
    document.addEventListener("pointerdown", onPointerDown, true);
    return () => {
      document.removeEventListener("keydown", onKeyDown, true);
      document.removeEventListener("pointerdown", onPointerDown, true);
    };
  }, [close, openIndex]);

  const moveRowFocus = (event: ReactKeyboardEvent<HTMLDivElement>): void => {
    const rows = rowRefs.current.filter((row): row is HTMLButtonElement => row !== null);
    if (rows.length === 0) return;
    const at = rows.indexOf(document.activeElement as HTMLButtonElement);
    const from = at >= 0 ? at : 0;
    let next: number;
    switch (event.key) {
      case "ArrowDown":
        next = Math.min(rows.length - 1, from + 1);
        break;
      case "ArrowUp":
        next = Math.max(0, from - 1);
        break;
      case "Home":
        next = 0;
        break;
      case "End":
        next = rows.length - 1;
        break;
      default:
        return;
    }
    event.preventDefault();
    rows[next]?.focus();
  };

  const onCrumbKeyDown = (event: ReactKeyboardEvent<HTMLButtonElement>, index: number): void => {
    if (event.key !== "ArrowDown") return;
    event.preventDefault();
    openAt(index, event.currentTarget);
  };

  const currentName = openIndex === null ? "" : (model.segments[openIndex]?.name ?? "");
  const lastIndex = model.segments.length - 1;

  const head = peers === null ? "" : peers.dir === "" ? "./" : peers.dir;
  const statusText =
    peers === null
      ? ""
      : peers.status === "loading"
        ? t("preview.crumbs.loading")
        : peers.status === "failed"
          ? t("preview.crumbs.failed")
          : peers.nodes.length === 0
            ? t("preview.crumbs.empty")
            : "";

  return (
    <div
      className="fx-preview-crumbs"
      title={interactive ? undefined : unavailableReason}
      data-interactive={interactive ? "true" : "false"}
    >
      {model.segments.map((crumb, index) => {
        const expanded = openIndex === index;
        const label = `${t("preview.crumbs.open")}: ${crumb.name}`;
        return (
          <span className="fx-crumb-slot" key={`${crumb.path}:${index}`}>
            {index > 0 ? (
              <span className="fx-crumb-sep" aria-hidden="true">
                &gt;
              </span>
            ) : null}
            {interactive ? (
              <button
                type="button"
                className="fx-crumb"
                data-testid="fs-preview-crumb"
                data-crumb-name={crumb.name}
                data-file={index === lastIndex ? "true" : undefined}
                aria-haspopup="dialog"
                aria-expanded={expanded}
                aria-label={label}
                title={crumb.path}
                onClick={event => openAt(index, event.currentTarget)}
                onKeyDown={event => onCrumbKeyDown(event, index)}
              >
                {crumb.name}
              </button>
            ) : (
              <span
                className="fx-crumb"
                data-testid="fs-preview-crumb"
                data-crumb-name={crumb.name}
                data-file={index === lastIndex ? "true" : undefined}
                title={crumb.path}
              >
                {crumb.name}
              </span>
            )}
          </span>
        );
      })}

      {interactive && peers !== null && anchor !== null ? (
        <div
          className="fx-peers"
          data-testid="fs-preview-crumbs"
          role="dialog"
          aria-label={t("preview.crumbs.open")}
          ref={popoverRef}
          style={{ left: `${anchor.left}px`, top: `${anchor.top}px` } as CSSProperties}
          onKeyDown={moveRowFocus}
        >
          <div className="fx-peers-head" data-testid="fs-preview-crumb-head" title={head}>
            {head}
          </div>
          {peers.nodes.map((node, index) => {
            const current = node.name === currentName;
            return (
              <button
                type="button"
                className="fx-peers-row"
                key={`${node.kind}:${node.name}`}
                data-testid="fs-preview-crumb-peer"
                data-kind={node.kind}
                data-current={current ? "true" : undefined}
                ref={node => {
                  rowRefs.current[index] = node;
                }}
                onClick={() => {
                  if (node.kind === "directory") {
                    void load(joinPath(peers.prefix, node.name));
                    return;
                  }
                  onOpenPeer(joinPath(peers.prefix, node.name), "file");
                  close(false);
                }}
              >
                {node.kind === "directory" ? (
                  <FolderIcon open={false} size={13} />
                ) : (
                  <span className="fx-badge" data-icon={iconFor(node.name)} aria-hidden="true">
                    {badgeFor(node.name)}
                  </span>
                )}
                <span className="fx-peers-name">{node.name}</span>
                {node.kind === "directory" ? (
                  <span className="fx-crumb-chevron" aria-hidden="true">
                    ›
                  </span>
                ) : null}
              </button>
            );
          })}
          {statusText === "" ? null : (
            <div
              className="fx-peers-status"
              data-testid="fs-preview-crumb-status"
              title={peers.message === "" ? undefined : peers.message}
            >
              {statusText}
            </div>
          )}
          {peers.status === "ready" && peers.truncated ? (
            <div className="fx-peers-status">
              {t("preview.crumbs.truncated").replace("{count}", String(peers.nodes.length))}
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
