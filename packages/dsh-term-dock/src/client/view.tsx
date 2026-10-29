/**
 * The terminal dock's bottom surface.
 *
 * The slot is root-scoped and carries no session id, so the dock asks the core
 * service which conversation is on screen and renders only that session's
 * panels. Process lifetime stays with the host's `webTerminals` service: this file
 * decides layout, focus and which panel the keyboard acts on, nothing else.
 *
 * Keyboard discipline (blueprint D5): the dock binds exactly two keys locally and
 * both are scoped to the dock element. `Ctrl+W` closes the current terminal and
 * `Esc` returns to chat through the core's view seam. Everything else — including
 * the workbench's `Cmd/Ctrl+Shift+*` family — belongs to the core's shortcut
 * registration and is deliberately not read here.
 */
import { useEffect, useState, useSyncExternalStore, type ComponentType, type CSSProperties, type KeyboardEvent, type ReactNode } from "react";

import { createTerminalPanel } from "./terminal-panel.tsx";
import { createDockController, type DockVisibilitySource } from "./dock-controller.ts";
import type { DockHost } from "./host.ts";
import type { DockPanel, DockState } from "./dock-state.ts";
import type { TerminalRack } from "./rack.ts";
import type { Translate } from "./copy.ts";

/** Popup surfaces that own Escape while they are open. */
const POPUP_SELECTOR = '[role="menu"],[role="listbox"],[aria-modal="true"],[data-popup-open="true"]';

/**
 * Whether an open popup inside the dock should keep Escape.
 * @param root - the dock element.
 * @returns true when a menu, listbox or modal is open inside.
 */
export function hasOpenPopup(root: Element): boolean {
  return root.querySelector(POPUP_SELECTOR) !== null;
}

/** What one dock mount closes over. */
export interface DockWiring {
  readonly dock: DockState;
  readonly rack: TerminalRack;
  readonly host: DockHost;
  readonly t: Translate;
  /** The core's observable switch; the dock follows it for its whole life. */
  readonly visibility: DockVisibilitySource;
}

/**
 * Follow the core's dock switch for one mounted dock.
 *
 * The controller is the subscription point; React only projects the latest
 * value. Reading the source once here would reintroduce the defect this hook
 * exists to remove.
 * @param visibility - the core's read/subscribe face.
 * @returns whether the dock should currently occupy height.
 */
function useDockVisible(visibility: DockVisibilitySource): boolean {
  const [visible, setVisible] = useState(() => visibility.get());
  useEffect(() => {
    const controller = createDockController({ visibility, onChange: setVisible });
    return () => controller.dispose();
  }, [visibility]);
  return visible;
}

const rootStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  // The dock sits above the composer card inside the conversation column, and
  // the spec keeps it 1.5em clear of that input box.
  marginBottom: "1.5em",
  borderTop: "1px solid color-mix(in srgb, currentColor 14%, transparent)",
  background: "color-mix(in srgb, currentColor 3%, transparent)",
  boxSizing: "border-box",
  overflow: "hidden",
};
const headerStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 8,
  padding: "6px 12px",
  borderBottom: "1px solid color-mix(in srgb, currentColor 10%, transparent)",
};
const titleRowStyle: CSSProperties = { display: "flex", alignItems: "baseline", gap: 10, minWidth: 0 };
const titleStyle: CSSProperties = { fontSize: 12, fontWeight: 600, letterSpacing: 0.2 };
const hintStyle: CSSProperties = { fontSize: 11, opacity: 0.5, whiteSpace: "nowrap" };
const actionsStyle: CSSProperties = { display: "flex", alignItems: "center", gap: 2 };
const tabStripStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 4,
  padding: "4px 10px",
  borderBottom: "1px solid color-mix(in srgb, currentColor 8%, transparent)",
};
const bodyStyle: CSSProperties = {
  display: "grid",
  gap: 8,
  flex: 1,
  minHeight: 0,
  padding: 8,
  boxSizing: "border-box",
};
const emptyStyle: CSSProperties = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: 6,
  padding: 24,
  textAlign: "center",
  fontSize: 12,
};
const buttonStyle: CSSProperties = {
  border: "none",
  background: "transparent",
  color: "inherit",
  cursor: "pointer",
  fontSize: 12,
  opacity: 0.72,
  padding: "2px 6px",
  borderRadius: 6,
};
const tabStyle: CSSProperties = {
  ...buttonStyle,
  fontSize: 11,
  padding: "2px 8px",
  border: "1px solid transparent",
};
const tabActiveStyle: CSSProperties = {
  ...tabStyle,
  opacity: 1,
  border: "1px solid color-mix(in srgb, currentColor 18%, transparent)",
  background: "color-mix(in srgb, currentColor 8%, transparent)",
};

/** One header control. */
function IconButton({
  label,
  onClick,
  title,
  children,
}: {
  readonly label: string;
  readonly onClick: () => void;
  readonly title?: string;
  readonly children: ReactNode;
}) {
  return (
    <button type="button" aria-label={label} title={title ?? label} onClick={onClick} style={buttonStyle}>
      {children}
    </button>
  );
}

/**
 * Build the dock component for one mount.
 * @param wiring - dock state, view rack, host seams and the translate seat.
 * @returns the component registered into the conversation dock slot.
 */
export function createTermDockView({ dock, rack, host, t, visibility }: DockWiring): ComponentType {
  const TerminalPanel = createTerminalPanel({ t });
  let panelSeq = 0;
  const nextPanelId = (): string => `terminal-${(panelSeq += 1)}`;

  /** One panel body; owns the first `rack.open` for its panel. */
  function DockBody({ sessionId, panelId, label }: { sessionId: string; panelId: string; label: string }) {
    const [binding] = useState(() => rack.open(sessionId, panelId));
    if (binding === undefined) {
      return (
        <div style={emptyStyle}>
          <strong>{t("dock.serviceMissing")}</strong>
          <span style={{ opacity: 0.7 }}>{t("dock.serviceMissingHint")}</span>
        </div>
      );
    }
    return <TerminalPanel binding={binding} label={label} />;
  }

  function TermDock() {
    const visible = useDockVisible(visibility);
    const snapshot = useSyncExternalStore(dock.subscribe, dock.snapshot);
    const sessionId = host.currentSessionId();
    const terminals = host.terminals();
    const panels = snapshot.panels.filter(panel => panel.sessionId === undefined || panel.sessionId === sessionId);

    // A dock with no panel has nothing to show; opening one for the session the
    // user just switched to is the dock's own responsibility (there is no session
    // props to carry it).
    useEffect(() => {
      if (sessionId === undefined) return;
      if (dock.snapshot().panels.some(panel => panel.sessionId === sessionId)) return;
      dock.open(nextPanelId(), { sessionId });
    }, [dock, sessionId]);

    const closePanel = (id: string): void => {
      const panel = dock.snapshot().panels.find(entry => entry.id === id);
      const owner = panel?.sessionId ?? host.currentSessionId();
      if (owner !== undefined) rack.release(owner, id);
      dock.close(id);
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLElement>): void => {
      if (event.key === "Escape") {
        if (hasOpenPopup(event.currentTarget)) return;
        const current = host.currentSessionId();
        if (current === undefined) return;
        if (host.showChat(current)) {
          event.preventDefault();
          event.stopPropagation();
        }
        return;
      }
      if (event.ctrlKey && !event.metaKey && !event.altKey && !event.shiftKey && event.key.toLowerCase() === "w") {
        const target = snapshot.activeId ?? panels[0]?.id;
        if (target === undefined) return;
        event.preventDefault();
        event.stopPropagation();
        closePanel(target);
      }
    };

    const height = snapshot.mode === "minimized" ? "auto" : snapshot.mode === "fullscreen" ? "min(72vh, 900px)" : 260;
    const activeId = snapshot.activeId;
    const minimized = snapshot.mode === "minimized";

    // Hiding keeps the subtree mounted: display:none releases the height
    // without detaching a terminal or replaying its scrollback, which is what
    // "收起 dock" means for the processes living behind these panels.
    return (
      <section
        data-workbench-dock="term-dock"
        data-dock-mode={snapshot.mode}
        data-dock-visible={visible ? "true" : "false"}
        data-panel-count={panels.length}
        data-dock-session={sessionId ?? ""}
        style={{ ...rootStyle, height, display: visible ? "flex" : "none" }}
        onKeyDownCapture={handleKeyDown}
      >
        <header style={headerStyle}>
          <div style={titleRowStyle}>
            <span style={titleStyle}>{t("dock.title")}</span>
            <span style={hintStyle}>{t("dock.hint")}</span>
          </div>
          <div style={actionsStyle}>
            <IconButton label={minimized ? t("dock.restore") : t("dock.minimize")} onClick={() => (minimized ? dock.restore() : dock.minimize())}>
              {minimized ? "▢" : "—"}
            </IconButton>
            <IconButton
              label={snapshot.mode === "fullscreen" ? t("dock.exitFullscreen") : t("dock.fullscreen")}
              onClick={() => dock.toggleFullscreen()}
            >
              {snapshot.mode === "fullscreen" ? "⤡" : "⤢"}
            </IconButton>
            <IconButton label={t("dock.split")} onClick={() => dock.split()}>
              ◫
            </IconButton>
            <IconButton label={t("dock.new")} onClick={() => dock.open(nextPanelId(), sessionId === undefined ? {} : { sessionId })}>
              +
            </IconButton>
            <IconButton
              label={t("dock.closePanel")}
              onClick={() => {
                const target = activeId ?? panels[0]?.id;
                if (target !== undefined) closePanel(target);
              }}
            >
              ×
            </IconButton>
          </div>
        </header>

        <div style={tabStripStyle}>
          {panels.map((panel: DockPanel, index: number) => (
            <button
              key={panel.id}
              type="button"
              aria-pressed={panel.id === activeId}
              data-panel-tab={panel.id}
              data-active={panel.id === activeId ? "true" : "false"}
              onClick={() => dock.activate(panel.id)}
              style={panel.id === activeId ? tabActiveStyle : tabStyle}
            >
              {`${t("dock.panel")} ${String(index + 1)}`}
            </button>
          ))}
        </div>

        {sessionId === undefined ? (
          <div style={emptyStyle} role="note">
            <strong>{t("dock.sessionRequired")}</strong>
            <span style={{ opacity: 0.7 }}>{t("dock.sessionRequiredHint")}</span>
          </div>
        ) : terminals === undefined ? (
          <div style={emptyStyle} role="note">
            <strong>{t("dock.serviceMissing")}</strong>
            <span style={{ opacity: 0.7 }}>{t("dock.serviceMissingHint")}</span>
          </div>
        ) : (
          // Minimizing hides the body but keeps it mounted: unmounting would
          // detach every emulator and replay the session on restore, which costs
          // the scrollback the user is looking at.
          <div
            style={{
              ...bodyStyle,
              display: minimized ? "none" : "grid",
              gridTemplateColumns: panels.length > 1 ? "1fr 1fr" : "1fr",
            }}
          >
            {panels.map((panel: DockPanel, index: number) => (
              <DockBody
                key={`${sessionId}:${panel.id}`}
                sessionId={sessionId}
                panelId={panel.id}
                label={`${t("dock.panel")} ${String(index + 1)}`}
              />
            ))}
          </div>
        )}
      </section>
    );
  }

  return TermDock;
}
