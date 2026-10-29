/**
 * The MCP settings section.
 *
 * A factory, not a module-level component: the store, the translate seat and
 * the platform kit all belong to one browser mount, and closing over them
 * keeps the component independent of how the settings page passes props — the
 * section slot's prop plumbing is the host's to evolve, the closure is ours.
 *
 * Rows are our own markup (see row.tsx and styles.ts) inside the shipped form
 * frame, so the save bar, the read-only and unavailable banners, and the
 * failure copy all behave exactly like the settings pages the host ships.
 * Presets fill the add row rather than writing directly: no value lands
 * anywhere until the user saves.
 */
import { useState, useSyncExternalStore, type ComponentType, type ReactNode } from "react";
import type { TimeoutsSnapshot, TimeoutsStore } from "./store.ts";
import { PRESETS } from "./registration.ts";
import { insertStyles } from "./styles.ts";
import { TimeoutRow } from "./row.tsx";

/** A translate seat over this plugin's dictionary. */
export type Translate = (key: string, params?: Record<string, string | number>) => string;

/** The platform kit, resolved through the loader and injected as props. */
export interface SectionKit {
  readonly SettingsForm: ComponentType<{
    labels: Record<string, string>;
    state: { available: boolean; writable: boolean; dirty: boolean; invalid: boolean; saving: boolean; failed: boolean };
    onSave: () => void;
    onDiscard: () => void;
    children: ReactNode;
  }>;
  readonly Button: ComponentType<{ children: ReactNode; onClick?: () => void; disabled?: boolean }>;
  readonly Input: ComponentType<{ value: string; onChange: (event: { readonly target: { readonly value: string } }) => void; placeholder?: string; disabled?: boolean }>;
}

/** The mount bundle one section instance closes over. */
export interface SectionWiring {
  readonly store: TimeoutsStore;
  readonly t: Translate;
  readonly kit: SectionKit;
}

/** Label set the shared form frame renders. */
function formLabels(t: Translate): Record<string, string> {
  return {
    unavailable: t("unavailable"),
    readOnly: t("readOnly"),
    saveFailed: t("saveFailed"),
    save: t("save"),
    saving: t("saving"),
  };
}

/** The frame state the shared form frame decides its banners from. */
function frameState(snapshot: TimeoutsSnapshot) {
  return {
    available: snapshot.status === "ready",
    writable: snapshot.writable,
    dirty: snapshot.dirty,
    invalid: snapshot.invalid,
    saving: snapshot.saving,
    failed: snapshot.failed,
  };
}

/**
 * Build the section component for one mount.
 * @param wiring the store, translate seat, and platform kit to close over.
 * @returns the component to register into the section slot.
 */
export function createSection(wiring: SectionWiring): ComponentType {
  const { store, t, kit } = wiring;
  function McpTimeoutsSection() {
    const snapshot = useSyncExternalStore(store.subscribe, store.getSnapshot, store.getSnapshot);
    const [addId, setAddId] = useState("");
    const [addMs, setAddMs] = useState("");
    const disabled = !snapshot.writable;
    const stageAdded = (id: string, ms: string) => {
      store.addRow(id);
      store.editRow(id, ms);
    };
    const submitAdded = () => {
      stageAdded(addId, addMs);
      setAddId("");
      setAddMs("");
    };
    insertStyles(document);
    return (
      <kit.SettingsForm labels={formLabels(t)} state={frameState(snapshot)} onSave={() => void store.save()} onDiscard={() => store.discard()}>
        <p style={{ margin: "0 0 4px", color: "var(--dsw-alias-label-secondary)" }}>{t("description")}</p>
        {snapshot.rows.length === 0 ? <p style={{ margin: "0 0 8px" }}>{t("empty.servers")}</p> : undefined}
        {snapshot.rows.map(row => (
          <TimeoutRow
            key={row.id}
            row={row}
            disabled={disabled}
            t={t}
            kit={kit}
            onEdit={text => store.editRow(row.id, text)}
            onClear={() => store.resetRow(row.id)}
          />
        ))}
        <div style={{ display: "flex", gap: 8, alignItems: "center", margin: "8px 0", flexWrap: "wrap" }}>
          <kit.Input value={addId} onChange={event => setAddId(event.target.value)} placeholder={t("add.placeholder")} disabled={disabled} />
          <kit.Input value={addMs} onChange={event => setAddMs(event.target.value)} placeholder={t("add.timeoutPlaceholder")} disabled={disabled} />
          <kit.Button onClick={submitAdded} disabled={disabled || addId.trim() === ""}>{t("add.submit")}</kit.Button>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          <span>{t("preset.title")}</span>
          {PRESETS.map(preset => (
            <kit.Button key={preset.key} onClick={() => stageAdded(preset.entryId, String(preset.timeoutMs))} disabled={disabled}>
              {t(preset.labelKey)}
            </kit.Button>
          ))}
        </div>
        <p style={{ margin: "8px 0 0", color: "var(--dsw-alias-label-tertiary)" }}>{t("race.hint")}</p>
      </kit.SettingsForm>
    );
  }
  return McpTimeoutsSection;
}
