/**
 * One terminal panel in the dock.
 *
 * The panel owns the lifetime of its view: attach on mount (which starts or
 * reconnects the shell), detach on unmount (which leaves the process alive), and
 * let the rack close it when the user closes the panel or the plugin unloads.
 *
 * The renderer is behind `React.lazy`: this file is part of the startup bundle,
 * so the only thing it may know about xterm is that a chunk exports a component.
 */
import { Suspense, lazy, useEffect, useSyncExternalStore, type ComponentType, type CSSProperties } from "react";

import type { TerminalBinding } from "./binding.ts";
import type { Translate } from "./copy.ts";
import { loadTerminalChunk } from "./chunk-loader.ts";
import { describeTerminal, type StatusTone } from "./status.ts";

/**
 * The renderer, fetched on first mount.
 *
 * Rejections are deliberately not caught here: React caches a rejected lazy
 * import for the life of the page, and pretending otherwise would mount an empty
 * screen forever. The dock reports the failure at the page level instead.
 */
const LazyTerminalScreen = lazy(() => loadTerminalChunk().then(chunk => ({ default: chunk.TerminalScreen })));

const TONE_COLOR: Record<StatusTone, string> = {
  info: "currentColor",
  warn: "#c08a2e",
  error: "#c4483c",
};

const panelStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  minWidth: 0,
  minHeight: 0,
  border: "1px solid color-mix(in srgb, currentColor 12%, transparent)",
  borderRadius: 8,
  overflow: "hidden",
  background: "color-mix(in srgb, currentColor 2%, transparent)",
};
const screenStyle: CSSProperties = { flex: 1, minHeight: 0, minWidth: 0 };
const statusStyle: CSSProperties = {
  fontSize: 11,
  lineHeight: 1.5,
  padding: "4px 10px",
  borderTop: "1px solid color-mix(in srgb, currentColor 10%, transparent)",
  background: "color-mix(in srgb, currentColor 4%, transparent)",
};
const loadingStyle: CSSProperties = { padding: "10px 12px", fontSize: 12, opacity: 0.68 };

/** What one panel renders. */
export interface TerminalPanelProps {
  readonly binding: TerminalBinding;
  /** Visible panel title, also the emulator's accessible name. */
  readonly label: string;
}

/**
 * Build the panel component for one dock.
 * @param wiring - the translate seat.
 * @returns the component the dock lays out per panel.
 */
export function createTerminalPanel({ t }: { t: Translate }): ComponentType<TerminalPanelProps> {
  function TerminalPanel({ binding, label }: TerminalPanelProps) {
    const view = useSyncExternalStore(binding.state.subscribe, binding.state.getSnapshot);
    const status = describeTerminal(view, t);

    useEffect(() => binding.attach(), [binding]);

    return (
      <div data-workbench-terminal-panel={label} data-terminal-phase={view.phase} style={panelStyle}>
        <div style={screenStyle}>
          <Suspense fallback={<span style={loadingStyle}>{t("dock.chunkLoading")}</span>}>
            <LazyTerminalScreen binding={binding} label={label} readOnly={status.readOnly} />
          </Suspense>
        </div>
        {status.label === undefined ? null : (
          <div role="status" data-tone={status.tone} style={{ ...statusStyle, color: TONE_COLOR[status.tone] }}>
            {status.label}
          </div>
        )}
      </div>
    );
  }

  return TerminalPanel;
}
