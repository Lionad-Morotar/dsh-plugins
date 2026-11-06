/**
 * The tab strip and the no-panel state of the editor column.
 *
 * One tab per open file, in stack order. The active tab is the only one in the
 * roving tab index; plain arrow keys move through the strip, Delete closes, and
 * the pointer gestures are the same two the tree already teaches (click to
 * switch, close button to drop). The strip owns no state: the stack is the
 * source of truth and this file only renders a snapshot of it.
 *
 * A tab may also show an unsaved dot. The draft behind it belongs to the
 * document store, not to the strip, so the strip reads the store and subscribes
 * to it rather than acquiring a session just to paint one tab — acquiring would
 * create a draft, and creating a draft to render a tab is the wrong direction.
 */
import { useEffect, useRef, useSyncExternalStore, type KeyboardEvent as ReactKeyboardEvent } from "react";

import type { ContextMenuAnchor } from "./context-menu.ts";
import type { Translate } from "./copy.ts";
import type { DocumentStore } from "./document-session.ts";
import { badgeFor, iconFor } from "./model.ts";
import { panelTitle, type PanelEntry } from "./panels.ts";

/** Copy this strip owns; the entry merges it into the package namespace. */
export const PANEL_COPY = {
  zh: {
    "panel.dirty": "有未保存的修改",
    "panel.confirm.title": "「{name}」有未保存的修改",
    "panel.confirm.save": "保存并关闭",
    "panel.confirm.saving": "正在保存…",
    "panel.confirm.discard": "放弃",
    "panel.confirm.cancel": "取消",
    "panel.confirm.failed": "保存失败，面板保持打开",
  },
  en: {
    "panel.dirty": "Unsaved changes",
    "panel.confirm.title": "\"{name}\" has unsaved changes",
    "panel.confirm.save": "Save and close",
    "panel.confirm.saving": "Saving…",
    "panel.confirm.discard": "Discard",
    "panel.confirm.cancel": "Cancel",
    "panel.confirm.failed": "Save failed; the panel stays open",
  },
} as const;

/** Props for the tab strip. */
export interface PanelTabsProps {
  readonly panels: readonly PanelEntry[];
  readonly active: string | null;
  readonly t: Translate;
  readonly onActivate: (key: string) => void;
  readonly onClose: (key: string) => void;
  readonly onStep: (delta: 1 | -1) => void;
  /**
   * Open the strip's own menu for one tab.
   *
   * The menu itself lives in the view because only it owns the stack and the
   * drafts; the strip only knows which chip was pressed. Absent keeps the
   * browser's menu, which is what a host-inspection context wants.
   */
  readonly onTabMenu?: (key: string, anchor: ContextMenuAnchor, trigger: HTMLElement) => void;
  /** The shared drafts; absent renders the strip without unsaved dots. */
  readonly documents?: DocumentStore;
  readonly sessionId?: string;
}

const NO_SUBSCRIBE = (): (() => void) => () => undefined;
const EMPTY_SIGNATURE = (): string => "";

/**
 * The panels whose draft is dirty, in strip order.
 *
 * Exported because the rule — read, never acquire — is the part worth testing
 * without a renderer.
 * @param store - the shared draft store, when the client service found one.
 * @param sessionId - the conversation the panels belong to.
 * @param panels - the open panels.
 * @returns the paths that need a dot.
 */
export function dirtyPanelPaths(
  store: DocumentStore | undefined,
  sessionId: string | undefined,
  panels: readonly PanelEntry[],
): readonly string[] {
  if (store === undefined || sessionId === undefined) return [];
  return panels.filter(panel => store.peek(sessionId, panel.path)?.dirty === true).map(panel => panel.path);
}

/**
 * Render the open-file strip.
 * @param props - the snapshot, copy and the four panel gestures.
 * @returns the `tablist`, or null while the stack is empty.
 */
export function PanelTabs({
  panels,
  active,
  t,
  onActivate,
  onClose,
  onStep,
  onTabMenu,
  documents,
  sessionId,
}: PanelTabsProps) {
  const activeTab = useRef<HTMLButtonElement | null>(null);

  // A long session can outgrow the strip; keeping the active tab visible is
  // the difference between a switched panel and a tab the reader cannot find.
  useEffect(() => {
    activeTab.current?.scrollIntoView?.({ block: "nearest", inline: "nearest" });
  }, [active]);

  // A joined signature keeps the snapshot a primitive, so React can compare it
  // by value and a publish that changed no draft in this strip costs no render.
  const dirtySignature = useSyncExternalStore(
    documents?.subscribe ?? NO_SUBSCRIBE,
    () => dirtyPanelPaths(documents, sessionId, panels).join("\u0000"),
    EMPTY_SIGNATURE,
  );
  const dirty = new Set(dirtySignature === "" ? [] : dirtySignature.split("\u0000"));

  if (panels.length === 0) return null;

  const onKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>): void => {
    if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
      event.preventDefault();
      event.stopPropagation();
      onStep(event.key === "ArrowRight" ? 1 : -1);
      return;
    }
    if ((event.key === "Delete" || event.key === "Backspace") && active !== null) {
      event.preventDefault();
      event.stopPropagation();
      onClose(active);
    }
  };

  return (
    <div className="fx-tabs" role="tablist" aria-label={t("panel.tabs")} onKeyDown={onKeyDown} data-testid="fs-tabs">
      {panels.map((panel, index) => {
        const selected = panel.key === active;
        const title = panelTitle(panel.path);
        const closeLabel = t("panel.close").replace("{name}", title);
        return (
          <div
            key={panel.key}
            className="fx-tab"
            data-active={selected ? "true" : "false"}
            data-dirty={dirty.has(panel.path) ? "true" : "false"}
            role="presentation"
            onContextMenu={
              onTabMenu === undefined
                ? undefined
                : event => {
                    // The strip has no other secondary gesture, and the browser's
                    // menu would cover the tab the reader is about to close.
                    event.preventDefault();
                    event.stopPropagation();
                    onTabMenu(panel.key, { x: event.clientX, y: event.clientY }, event.currentTarget);
                  }
            }
          >
            <button
              type="button"
              className="fx-tab-main"
              role="tab"
              id={`fx-tab-${index}`}
              aria-controls={`fx-panel-${index}`}
              aria-selected={selected}
              tabIndex={selected ? 0 : -1}
              title={panel.path}
              data-testid="fs-tab"
              data-path={panel.path}
              data-key={panel.key}
              ref={selected ? activeTab : undefined}
              onClick={() => onActivate(panel.key)}
            >
              <span className="fx-badge fx-tab-badge" data-icon={iconFor(panel.path)} aria-hidden="true">
                {badgeFor(panel.path)}
              </span>
              <span className="fx-tab-name">{title}</span>
              {panel.revision === undefined ? null : (
                <span className="fx-tab-rev" data-testid="fs-tab-revision" title={panel.revision}>
                  {panel.revision.slice(0, 7)}
                </span>
              )}
              {dirty.has(panel.path) ? (
                <span
                  className="fx-tab-dirty"
                  data-testid="fs-tab-dirty"
                  data-dirty="true"
                  role="img"
                  aria-label={t("panel.dirty")}
                  title={t("panel.dirty")}
                />
              ) : null}
            </button>
            <button
              type="button"
              className="fx-tab-close"
              tabIndex={selected ? 0 : -1}
              aria-label={closeLabel}
              title={closeLabel}
              data-testid="fs-tab-close"
              onClick={() => onClose(panel.key)}
            >
              ×
            </button>
          </div>
        );
      })}
    </div>
  );
}

/** Props for the inline close confirmation. */
export interface CloseConfirmProps {
  /** The panel's tab caption. */
  readonly name: string;
  readonly t: Translate;
  /** A write is in flight; every answer is held until it settles. */
  readonly saving: boolean;
  /** Human copy for the last refused save, or null. */
  readonly error: string | null;
  readonly onSave: () => void;
  readonly onDiscard: () => void;
  readonly onCancel: () => void;
}

/**
 * The three-way confirmation a dirty panel must clear before it closes.
 *
 * It is an inline bar rather than a dialog because the panel is the context the
 * reader needs to answer the question: a floating layer would hide the draft it
 * is asking about.
 * @param props - the panel name, copy and the three answers.
 * @returns the bar.
 */
export function CloseConfirm({ name, t, saving, error, onSave, onDiscard, onCancel }: CloseConfirmProps) {
  return (
    <div
      className="fx-close-confirm"
      data-testid="fs-close-confirm"
      role="group"
      aria-label={t("panel.confirm.title").replace("{name}", name)}
    >
      <span className="fx-close-confirm-text">{t("panel.confirm.title").replace("{name}", name)}</span>
      {error === null ? null : (
        <span className="fx-close-confirm-error" data-testid="fs-close-error">
          {error}
        </span>
      )}
      <span className="fx-spacer" />
      <button type="button" className="fx-pbtn" data-testid="fs-close-save" disabled={saving} onClick={onSave}>
        {saving ? t("panel.confirm.saving") : t("panel.confirm.save")}
      </button>
      <button type="button" className="fx-pbtn" data-testid="fs-close-discard" disabled={saving} onClick={onDiscard}>
        {t("panel.confirm.discard")}
      </button>
      <button type="button" className="fx-pbtn" data-testid="fs-close-cancel" disabled={saving} onClick={onCancel}>
        {t("panel.confirm.cancel")}
      </button>
    </div>
  );
}

/** The document glyph the empty editor draws. */
function PanelGlyph() {
  return (
    <svg width="34" height="34" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M7.5 4.5h11l6 6v17h-17z" />
      <path d="M18.5 4.5v6h6" />
      <path d="M11 16h10M11 20h10M11 24h6" />
    </svg>
  );
}

/**
 * Render the invitation the editor column shows before the first file opens.
 * @param props - the translate seat.
 * @returns the empty state with the panel chords spelled out.
 */
export function PanelEmpty({ t }: { readonly t: Translate }) {
  return (
    <div className="fx-editor-empty" data-testid="fs-panel-empty">
      <span className="fx-editor-glyph" aria-hidden="true">
        <PanelGlyph />
      </span>
      <strong>{t("panel.empty.title")}</strong>
      <span>{t("panel.empty.description")}</span>
      <span className="fx-empty-keys">
        <kbd className="fx-kbd">⌘⌥↓</kbd>
        <kbd className="fx-kbd">⌘⌥↑</kbd>
        <kbd className="fx-kbd">Ctrl+W</kbd>
        <span>{t("panel.empty.keys")}</span>
      </span>
    </div>
  );
}
