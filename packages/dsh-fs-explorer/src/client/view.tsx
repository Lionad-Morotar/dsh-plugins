/**
 * The file workbench's conversation view.
 *
 * s0 ships the seat and its two honest states: no session (ask the user to pick
 * one) and a selected session (the tree is not wired yet). The core version is
 * rendered as a data attribute so a real-host probe can tell which contract the
 * mounted bundle was built against.
 */
import type { ComponentType, CSSProperties } from "react";

/** The slice of the core service this view reads. */
export interface WorkbenchFace {
  readonly version: number;
  currentSessionId(): string | undefined;
}

/** A translate seat over this package's dictionary. */
export type Translate = (key: string) => string;

/** The two states this skeleton can render. */
export type ViewState = "empty" | "placeholder";

/**
 * Decide which state the view renders.
 * @param sessionId - the active session id, or undefined when none is selected.
 * @returns `empty` without a session, `placeholder` with one.
 */
export function viewState(sessionId: string | undefined): ViewState {
  return sessionId === undefined ? "empty" : "placeholder";
}

/** What one view mount closes over. */
export interface ViewWiring {
  readonly workbench: WorkbenchFace;
  readonly version: number;
  readonly t: Translate;
}

const surfaceStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  height: "100%",
  minHeight: 240,
  padding: 20,
  gap: 16,
  boxSizing: "border-box",
};
const headerStyle: CSSProperties = { display: "flex", alignItems: "center", gap: 8 };
const titleStyle: CSSProperties = { margin: 0, fontSize: 15, fontWeight: 600 };
const stateStyle: CSSProperties = {
  display: "grid",
  placeContent: "center",
  justifyItems: "center",
  gap: 6,
  flex: 1,
  minHeight: 160,
  borderRadius: 10,
  border: "1px dashed color-mix(in srgb, currentColor 18%, transparent)",
  textAlign: "center",
};

/**
 * Build the view component for one mount.
 * @param wiring - the core service, contract version and translate seat.
 * @returns the component registered into `conversation.view`.
 */
export function createFsExplorerView({ workbench, version, t }: ViewWiring): ComponentType {
  function FsExplorerView() {
    const state = viewState(workbench.currentSessionId());
    return (
      <section data-workbench-view="fs-explorer" data-core-version={version} style={surfaceStyle}>
        <header style={headerStyle}>
          <h2 style={titleStyle}>{t("view.title")}</h2>
        </header>
        {state === "empty" ? (
          <div data-state="empty" style={stateStyle}>
            <strong>{t("empty.title")}</strong>
            <span style={{ fontSize: 12, opacity: 0.7 }}>{t("empty.description")}</span>
          </div>
        ) : (
          <div data-state="placeholder" style={stateStyle}>
            <strong>{t("placeholder.title")}</strong>
            <span style={{ fontSize: 12, opacity: 0.7 }}>{t("placeholder.description")}</span>
          </div>
        )}
      </section>
    );
  }

  return FsExplorerView;
}
