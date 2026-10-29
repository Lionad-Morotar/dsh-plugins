/**
 * The terminal dock's bottom surface.
 *
 * The slot is root-scoped and gives no session id; the component keeps only its
 * own collapsed state and leaves process lifetime to the host's `webTerminals`
 * service (blueprint D7). The minimize button is the one interaction s0 ships,
 * so the dock's height and visibility stay client-owned from the start.
 */
import { useState, type ComponentType, type CSSProperties } from "react";

/** A translate seat over this package's dictionary. */
export type Translate = (key: string) => string;

/** What one dock mount closes over. */
export interface DockWiring {
  /** Core contract version, rendered for real-host probes. */
  readonly version: number;
  readonly t: Translate;
}

const dockStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  height: 220,
  borderTop: "1px solid color-mix(in srgb, currentColor 14%, transparent)",
  background: "color-mix(in srgb, currentColor 3%, transparent)",
  boxSizing: "border-box",
};
const barStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 8,
  padding: "6px 12px",
  borderTop: "1px solid color-mix(in srgb, currentColor 14%, transparent)",
  background: "color-mix(in srgb, currentColor 3%, transparent)",
};
const headerStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 8,
  padding: "6px 12px",
  borderBottom: "1px solid color-mix(in srgb, currentColor 10%, transparent)",
};
const titleStyle: CSSProperties = { fontSize: 12, fontWeight: 600, letterSpacing: 0.2 };
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
const bodyStyle: CSSProperties = {
  display: "grid",
  placeContent: "center",
  justifyItems: "center",
  gap: 6,
  flex: 1,
  textAlign: "center",
};

/**
 * Build the dock component for one mount.
 * @param wiring - contract version and translate seat.
 * @returns the component registered into `shell.bottom`.
 */
export function createTermDockView({ version, t }: DockWiring): ComponentType {
  function TermDock() {
    const [collapsed, setCollapsed] = useState(false);

    if (collapsed) {
      return (
        <div data-workbench-dock="term-dock" data-collapsed="true" data-core-version={version} style={barStyle}>
          <span style={titleStyle}>{t("dock.title")}</span>
          <button type="button" aria-label={t("dock.expandLabel")} onClick={() => setCollapsed(false)} style={buttonStyle}>
            {t("dock.expand")}
          </button>
        </div>
      );
    }

    return (
      <section data-workbench-dock="term-dock" data-collapsed="false" data-core-version={version} style={dockStyle}>
        <header style={headerStyle}>
          <span style={titleStyle}>{t("dock.title")}</span>
          <button type="button" aria-label={t("dock.minimize")} onClick={() => setCollapsed(true)} style={buttonStyle}>
            —
          </button>
        </header>
        <div style={bodyStyle}>
          <strong>{t("placeholder.title")}</strong>
          <span style={{ fontSize: 12, opacity: 0.7 }}>{t("placeholder.description")}</span>
        </div>
      </section>
    );
  }

  return TermDock;
}
