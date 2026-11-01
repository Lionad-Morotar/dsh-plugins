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
import { useEffect, useRef, useState, useSyncExternalStore, type ComponentType, type CSSProperties, type KeyboardEvent, type ReactNode, type RefObject } from "react";

import { createTerminalPanel } from "./terminal-panel.tsx";
import { bleedBetween, pickColumn, type Box } from "./bleed.ts";
import { createDockController, type DockVisibilitySource } from "./dock-controller.ts";
import { TERMINAL_PANEL_KIND, type DockPanel, type DockPanelKind, type DockState } from "./dock-state.ts";
import { kindPickerChoices, planPanelBody, type PanelBodyPlan } from "./panel-body.ts";
import type { DockHost } from "./host.ts";
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

/** Rest height of the dock body in normal mode.
 *
 * The composer dock hangs below the composer card inside the conversation
 * column, bottom-flush. Sizing it by measuring `innerHeight - rect.top` feeds
 * the dock's own height back into the next measurement (the ResizeObserver on
 * the seat fires, `rect.top` has moved by the height just applied, the hook
 * applies it again), which ratchets the dock down to its floor a few frames
 * after every open. A viewport fraction has no such loop: it tracks window
 * height directly, and the inspector bottom panel sizes itself the same way.
 */
const DOCK_REST_HEIGHT = "clamp(120px, 32dvh, 300px)";

/** Custom properties the injected rule reads to widen the dock row. */
const BLEED_LEFT = "--dsh-dock-bleed-left";
const BLEED_RIGHT = "--dsh-dock-bleed-right";

/** Read one custom property as a pixel count; unset or garbage reads as zero. */
function readBleed(wrap: HTMLElement, property: string): number {
  const value = Number.parseFloat(wrap.style.getPropertyValue(property));
  return Number.isFinite(value) ? value : 0;
}

/**
 * Widen the dock row out to the conversation column's edges.
 *
 * The row lives inside the composer's centred max-width stack, so it inherits
 * that stack's width and stops short of the column on both sides. CSS cannot
 * reference an ancestor's width, so this measures the gap and publishes it on
 * the row; the injected rule turns it into negative margins.
 *
 * The measurement has to be idempotent: the row it reads already carries the
 * correction it wrote last time, so the applied bleed is added back before
 * comparing (see `bleedBetween`). Without that, a resize observer re-measures
 * the widened row, answers zero, collapses it, and the dock flips between wide
 * and narrow on whatever event happens last.
 * @param ref - the dock root, used to find the row it was placed in.
 * @param visible - whether the dock is on screen; a hidden row has no width.
 */
function useDockBleed(ref: RefObject<HTMLDivElement | null>, visible: boolean): void {
  useEffect(() => {
    if (!visible) return;
    const element = ref.current;
    const wrap = element?.closest("[data-composer-dock]");
    if (!(wrap instanceof HTMLElement)) return;

    const ancestors: Element[] = [];
    let node: Element | null = wrap.parentElement;
    for (let hop = 0; hop < 8 && node !== null; hop += 1) {
      ancestors.push(node);
      node = node.parentElement;
    }

    const measure = (): void => {
      const row = wrap.getBoundingClientRect();
      if (row.width === 0) return;
      const candidates = ancestors.map(ancestor => ({
        box: ancestor.getBoundingClientRect(),
        isDocument: ancestor.tagName === "BODY" || ancestor.tagName === "HTML",
      }));
      const column = pickColumn(candidates);
      if (column === undefined) return;
      const applied = { left: readBleed(wrap, BLEED_LEFT), right: readBleed(wrap, BLEED_RIGHT) };
      const bleed = bleedBetween(row, column, applied);
      const left = `${String(bleed.left)}px`;
      const right = `${String(bleed.right)}px`;
      if (wrap.style.getPropertyValue(BLEED_LEFT) !== left) wrap.style.setProperty(BLEED_LEFT, left);
      if (wrap.style.getPropertyValue(BLEED_RIGHT) !== right) wrap.style.setProperty(BLEED_RIGHT, right);
    };

    // The first frames are worth re-reading: the dock mounts while the session
    // view is still settling, and a single early reading can catch a column that
    // has not finished sizing.
    measure();
    const frames: number[] = [];
    if (typeof requestAnimationFrame === "function") {
      for (let index = 0; index < 3; index += 1) frames.push(requestAnimationFrame(measure));
    }

    const observer = typeof ResizeObserver === "function" ? new ResizeObserver(measure) : undefined;
    observer?.observe(wrap);
    for (const ancestor of ancestors) observer?.observe(ancestor);
    window.addEventListener("resize", measure);
    return () => {
      for (const frame of frames) cancelAnimationFrame(frame);
      observer?.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [ref, visible]);
}

const rootStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  // The dock is a panel, not a chip: no margin of its own, so the terminal reads
  // as part of the column instead of a card floating under the composer. Full
  // block width matters too: the host's composer dock row is a nowrap flex row,
  // so this width only sets a flex basis that the row would shrink; entry.ts
  // lets that row wrap while the dock is mounted, which keeps the dock on a
  // full-width line of its own.
  width: "100%",
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
const actionsStyle: CSSProperties = { display: "flex", alignItems: "center", gap: 2 };
// Mid-section of the single-row header: session tabs with inline close, then
// the new-terminal button. No own border, the header's bottom rule is enough.
const tabStripStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 4,
  minWidth: 0,
  overflow: "hidden",
};
const bodyStyle: CSSProperties = {
  display: "grid",
  gap: 8,
  flex: 1,
  minHeight: 0,
  // No inset: the terminal screen runs to the dock's edges, which is what makes
  // the panel read as docked rather than as a card with a frame around it.
  padding: 0,
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

const menuStyle: CSSProperties = {
  position: "absolute",
  top: "100%",
  left: 0,
  zIndex: 30,
  display: "flex",
  flexDirection: "column",
  minWidth: 120,
  padding: 4,
  borderRadius: 8,
  border: "1px solid color-mix(in srgb, currentColor 18%, transparent)",
  background: "color-mix(in srgb, currentColor 6%, var(--dsh-bg, inherit))",
  // The dock body scrolls its own panels; the picker must escape it, and the
  // dock root clips overflow so the popup also has to sit above it in paint.
  boxShadow: "0 8px 24px rgb(0 0 0 / 0.35)",
};

/**
 * The secondary interaction on `+`: pick a registered kind.
 *
 * The plain `+` click keeps opening a terminal (muscle memory), so the kinds
 * live behind this chevron and only while at least one is registered. The
 * menu is a `role="menu"`, which the dock's Escape routing already treats as
 * "a popup owns Escape", so closing on Escape here is the whole contract.
 */
function PlusPicker({
  choices,
  onPick,
  t,
}: {
  readonly choices: readonly { readonly kind: string; readonly title: string }[];
  readonly onPick: (kind: string) => void;
  readonly t: Translate;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent): void => {
      if (rootRef.current === null) return;
      if (event.target instanceof Node && rootRef.current.contains(event.target)) return;
      setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [open]);

  if (choices.length === 0) return null;
  return (
    <span ref={rootRef} style={{ position: "relative", display: "inline-flex" }}>
      <IconButton label={t("dock.newKind")} onClick={() => setOpen(value => !value)}>
        ▾
      </IconButton>
      {open && (
        <div role="menu" aria-label={t("dock.newKind")} style={menuStyle}
          onKeyDown={event => {
            if (event.key === "Escape") {
              event.stopPropagation();
              setOpen(false);
            }
          }}
        >
          {choices.map(choice => (
            <button
              key={choice.kind}
              type="button"
              role="menuitem"
              data-panel-kind-option={choice.kind}
              style={buttonStyle}
              onClick={() => {
                setOpen(false);
                onPick(choice.kind);
              }}
            >
              {choice.title}
            </button>
          ))}
        </div>
      )}
    </span>
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
  const nextPanelId = (kind: DockPanelKind): string => `${kind}-${(panelSeq += 1)}`;

  /** The tab title for one panel: its kind's title, or the terminal ordinal. */
  const panelLabel = (panel: DockPanel, index: number): string =>
    panel.kind === TERMINAL_PANEL_KIND
      ? `${t("dock.panel")} ${String(index + 1)}`
      : (host.panelKinds().find(entry => entry.kind === panel.kind)?.title ?? panel.kind);

  /** One registered-kind body; the mount owns everything inside its element. */
  function KindPanelBody({ plan, sessionId, label }: {
    readonly plan: Extract<PanelBodyPlan, { readonly plan: "kind" }>;
    readonly sessionId: string;
    readonly label: string;
  }) {
    const hostRef = useRef<HTMLDivElement | null>(null);
    useEffect(() => {
      const element = hostRef.current;
      if (element === null) return;
      const dispose = plan.mount(element, { sessionId });
      return () => {
        if (typeof dispose === "function") dispose();
      };
    }, [plan, sessionId]);
    return (
      <div
        ref={hostRef}
        aria-label={label}
        data-panel-kind={plan.kind}
        style={{ width: "100%", height: "100%", minHeight: 0, overflow: "hidden", boxSizing: "border-box" }}
      />
    );
  }

  /** One panel body; owns the first `rack.open` for a terminal panel. */
  function DockBody({ panel, sessionId, label }: { panel: DockPanel; sessionId: string; label: string }) {
    const plan = planPanelBody(panel.kind, host.panelKinds());
    if (plan.plan === "unknown") {
      return (
        <div style={emptyStyle} role="note">{`${t("dock.unknownKind")} · ${panel.kind}`}</div>
      );
    }
    if (plan.plan === "kind") {
      return <KindPanelBody plan={plan} sessionId={sessionId} label={label} />;
    }
    const [binding] = useState(() => rack.open(sessionId, panel.id));
    if (binding === undefined) {
      return (
        <div style={emptyStyle}>{t("dock.serviceMissing")}</div>
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
      dock.open(nextPanelId(TERMINAL_PANEL_KIND), { sessionId });
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

    const rootRef = useRef<HTMLDivElement | null>(null);
    useDockBleed(rootRef, visible);
    const height = snapshot.mode === "minimized" ? "auto" : snapshot.mode === "fullscreen" ? "min(72vh, 900px)" : DOCK_REST_HEIGHT;
    const activeId = snapshot.activeId;
    const minimized = snapshot.mode === "minimized";

    // Hiding keeps the subtree mounted: display:none releases the height
    // without detaching a terminal or replaying its scrollback, which is what
    // "收起 dock" means for the processes living behind these panels.
    return (
      <section
        aria-label={t("dock.title")}
        data-workbench-dock="term-dock"
        data-dock-mode={snapshot.mode}
        data-dock-visible={visible ? "true" : "false"}
        data-panel-count={panels.length}
        data-dock-session={sessionId ?? ""}
        ref={rootRef}
        style={{ ...rootStyle, height, display: visible ? "flex" : "none" }}
        onKeyDownCapture={handleKeyDown}
      >
        <header style={headerStyle}>
          <div style={tabStripStyle}>
            {panels.map((panel: DockPanel, index: number) => (
              <button
                key={panel.id}
                type="button"
                aria-pressed={panel.id === activeId}
                data-panel-tab={panel.id}
                data-panel-kind={panel.kind}
                data-active={panel.id === activeId ? "true" : "false"}
                onClick={() => dock.activate(panel.id)}
                style={panel.id === activeId ? tabActiveStyle : tabStyle}
              >
                {panelLabel(panel, index)}
                <span
                  role="button"
                  aria-label={t("dock.closePanel")}
                  data-testid={`dock-tab-close-${panel.id}`}
                  onClick={event => {
                    event.stopPropagation();
                    closePanel(panel.id);
                  }}
                  style={{ marginLeft: 4, opacity: 0.55 }}
                >
                  ×
                </span>
              </button>
            ))}
            <IconButton
              label={t("dock.new")}
              onClick={() => dock.open(nextPanelId(TERMINAL_PANEL_KIND), sessionId === undefined ? {} : { sessionId })}
            >
              +
            </IconButton>
            <PlusPicker
              choices={kindPickerChoices(host.panelKinds())}
              t={t}
              onPick={kind =>
                dock.open(nextPanelId(kind), { kind, ...(sessionId === undefined ? {} : { sessionId }) })
              }
            />
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

        {sessionId === undefined ? (
          <div style={emptyStyle} role="note">
            {t("dock.sessionRequired")}
          </div>
        ) : terminals === undefined ? (
          <div style={emptyStyle} role="note">
            {t("dock.serviceMissing")}
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
                panel={panel}
                sessionId={sessionId}
                label={panelLabel(panel, index)}
              />
            ))}
          </div>
        )}
      </section>
    );
  }

  return TermDock;
}
