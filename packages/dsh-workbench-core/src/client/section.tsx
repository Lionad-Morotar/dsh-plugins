/**
 * The workbench settings section.
 *
 * A skeleton with an honest job: report which host adapters this deployment
 * actually mounts and show the command table the later slices register. The
 * availability snapshot is sampled when the section renders, which is the right
 * freshness for a diagnostics page and needs no subscription.
 */
import type { ComponentType, CSSProperties } from "react";

import type { KeyBinding, KeyModifier } from "./keymap.ts";
import type { WorkbenchService } from "./service.ts";

/** A translate seat over this package's dictionary. */
export type Translate = (key: string, params?: Record<string, string | number>) => string;

/** What one section mount closes over. */
export interface SectionWiring {
  readonly service: WorkbenchService;
  readonly t: Translate;
}

const headingStyle: CSSProperties = { margin: "0 0 10px", fontSize: 13, fontWeight: 600, opacity: 0.72 };
const listStyle: CSSProperties = { listStyle: "none", margin: 0, padding: 0, display: "grid", gap: 6 };
const rowStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 16,
  padding: "8px 12px",
  borderRadius: 8,
  background: "color-mix(in srgb, currentColor 4%, transparent)",
};
const tableStyle: CSSProperties = { width: "100%", borderCollapse: "collapse", fontSize: 13 };
const cellStyle: CSSProperties = { padding: "8px 12px", textAlign: "left", borderBottom: "1px solid color-mix(in srgb, currentColor 10%, transparent)" };

const MODIFIER_LABEL: Record<KeyModifier, string> = {
  primary: "⌘/Ctrl",
  control: "Ctrl",
  alt: "Alt",
  shift: "Shift",
  meta: "⌘",
};

/**
 * Render a binding as the key caps a user would press.
 * @param binding - declared combination.
 * @returns e.g. `⌘/Ctrl + Shift + E`.
 */
export function formatBinding(binding: KeyBinding): string {
  const key = binding.code.startsWith("Key")
    ? binding.code.slice(3)
    : binding.code.startsWith("Digit")
      ? binding.code.slice(5)
      : binding.code;
  return [...binding.modifiers.map(modifier => MODIFIER_LABEL[modifier]), key].join(" + ");
}

/**
 * Build the section component for one mount.
 * @param wiring - the service and translate seat to close over.
 * @returns the component to register into `settings.section`.
 */
export function createWorkbenchSection({ service, t }: SectionWiring): ComponentType {
  function WorkbenchSection() {
    const adapters = [
      { key: "files", label: t("adapter.files"), available: service.adapters.files.available() },
      { key: "subprocess", label: t("adapter.subprocess"), available: service.adapters.subprocess.available() },
      { key: "terminals", label: t("adapter.terminals"), available: service.adapters.terminals.available() },
      { key: "composerOverlay", label: t("adapter.composerOverlay"), available: service.adapters.composerOverlay.available() },
    ];

    return (
      <section data-workbench-section="workbench" style={{ display: "grid", gap: 24, padding: "4px 0 12px" }}>
        <div>
          <h3 style={headingStyle}>{t("section.adapters")}</h3>
          <ul style={listStyle}>
            {adapters.map(adapter => (
              <li
                key={adapter.key}
                data-adapter={adapter.key}
                data-available={adapter.available ? "true" : "false"}
                style={rowStyle}
              >
                <span>{adapter.label}</span>
                <span style={{ fontSize: 12, opacity: 0.7 }}>
                  {adapter.available ? t("adapter.available") : t("adapter.missing")}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 style={headingStyle}>{t("section.keymap")}</h3>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={cellStyle}>{t("section.keymap")}</th>
                <th style={cellStyle}>{t("keymap.desktop")}</th>
                <th style={cellStyle}>{t("keymap.web")}</th>
              </tr>
            </thead>
            <tbody>
              {service.keymap.map(command => (
                <tr key={command.id} data-command={command.id}>
                  <td style={cellStyle}>{t(command.labelKey)}</td>
                  <td style={cellStyle}>{formatBinding(command.desktop)}</td>
                  <td style={cellStyle} title={command.webNote}>
                    {command.web === null ? t("keymap.unavailable") : formatBinding(command.web)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p style={{ margin: 0, fontSize: 12, opacity: 0.6 }}>
          {t("section.version")} {service.version}
        </p>
      </section>
    );
  }

  return WorkbenchSection;
}
