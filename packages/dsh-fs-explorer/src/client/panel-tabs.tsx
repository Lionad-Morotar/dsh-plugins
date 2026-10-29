/**
 * The tab strip and the no-panel state of the editor column.
 *
 * One tab per open file, in stack order. The active tab is the only one in the
 * roving tab index; plain arrow keys move through the strip, Delete closes, and
 * the pointer gestures are the same two the tree already teaches (click to
 * switch, close button to drop). The strip owns no state: the stack is the
 * source of truth and this file only renders a snapshot of it.
 */
import { useEffect, useRef, type KeyboardEvent as ReactKeyboardEvent } from "react";

import type { Translate } from "./copy.ts";
import { badgeFor, iconFor } from "./model.ts";
import { panelTitle, type PanelEntry } from "./panels.ts";

/** Props for the tab strip. */
export interface PanelTabsProps {
  readonly panels: readonly PanelEntry[];
  readonly active: string | null;
  readonly t: Translate;
  readonly onActivate: (path: string) => void;
  readonly onClose: (path: string) => void;
  readonly onStep: (delta: 1 | -1) => void;
}

/**
 * Render the open-file strip.
 * @param props - the snapshot, copy and the four panel gestures.
 * @returns the `tablist`, or null while the stack is empty.
 */
export function PanelTabs({ panels, active, t, onActivate, onClose, onStep }: PanelTabsProps) {
  const activeTab = useRef<HTMLButtonElement | null>(null);

  // A long session can outgrow the strip; keeping the active tab visible is
  // the difference between a switched panel and a tab the reader cannot find.
  useEffect(() => {
    activeTab.current?.scrollIntoView?.({ block: "nearest", inline: "nearest" });
  }, [active]);

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
        const selected = panel.path === active;
        const title = panelTitle(panel.path);
        const closeLabel = t("panel.close").replace("{name}", title);
        return (
          <div key={panel.path} className="fx-tab" data-active={selected ? "true" : "false"} role="presentation">
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
              ref={selected ? activeTab : undefined}
              onClick={() => onActivate(panel.path)}
            >
              <span className="fx-badge fx-tab-badge" data-icon={iconFor(panel.path)} aria-hidden="true">
                {badgeFor(panel.path)}
              </span>
              <span className="fx-tab-name">{title}</span>
            </button>
            <button
              type="button"
              className="fx-tab-close"
              tabIndex={selected ? 0 : -1}
              aria-label={closeLabel}
              title={closeLabel}
              data-testid="fs-tab-close"
              onClick={() => onClose(panel.path)}
            >
              ×
            </button>
          </div>
        );
      })}
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
