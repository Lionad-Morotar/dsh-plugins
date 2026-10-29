/**
 * The workbench settings section.
 *
 * Three groups (files, Git, terminal) built from the host shortcut catalog
 * snapshot. The section owns no command list of its own: if a command is not
 * mounted, its group says "未安装" instead of rendering a shell. Rows are real
 * host catalog entries, so the keycaps are the host's effective ones and the
 * edit control writes through `ctx.shortcuts.edit()`.
 *
 * Panel-local chords are merged from the core keymap because they are not host
 * commands. They render read-only: the file panel's DOM listener owns them, and
 * a "修改" button that does not change what the listener reads would be a lie.
 */
import { useCallback, useEffect, useMemo, useState, useSyncExternalStore, type ComponentType, type CSSProperties } from "react";

import { bindingCaps, detectPlatform, type BindingPlatform, type KeyBinding } from "./keymap.ts";
import { buildSettingsGroups, checkBindings, RESERVED_BINDINGS, type ShortcutCatalogEntryLike, type SettingsRow } from "./settings.ts";
import type { WorkbenchService } from "./service.ts";

/** A translate seat over this package's dictionary. */
export type Translate = (key: string, params?: Record<string, string | number>) => string;

/** The host shortcut service slice this section reads. */
export interface ShortcutsLike {
  readonly runtime?: "desktop" | "web";
  readonly catalog: {
    getSnapshot(): readonly ShortcutCatalogEntryLike[];
    subscribe(listener: () => void): () => void;
  };
  readonly config?: {
    getSnapshot(): { readonly revision: unknown; readonly status?: string };
  };
  describeBinding?(binding: KeyBinding | null): {
    readonly issue?: string | null;
    readonly conflicts?: readonly string[] | null;
  } | null;
  edit?(
    edit: { readonly type: "set"; readonly id: string; readonly binding: KeyBinding | null },
    revision: unknown,
  ): Promise<{ readonly status: string }>;
}

/** What one section mount closes over. */
export interface SectionWiring {
  readonly service: WorkbenchService;
  readonly t: Translate;
  readonly shortcuts?: ShortcutsLike;
}

const EMPTY_CATALOG: readonly ShortcutCatalogEntryLike[] = [];

const sectionStyle: CSSProperties = { display: "grid", gap: 22, padding: "4px 0 12px" };
const groupStyle: CSSProperties = {
  display: "grid",
  gap: 8,
  paddingTop: 16,
  borderTop: "1px solid color-mix(in srgb, currentColor 10%, transparent)",
};
const groupTitleStyle: CSSProperties = { margin: 0, fontSize: 13, fontWeight: 600, letterSpacing: "0.01em" };
const listStyle: CSSProperties = { listStyle: "none", margin: 0, padding: 0, display: "grid", gap: 6 };
const rowStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 16,
  padding: "9px 12px",
  borderRadius: 8,
  background: "color-mix(in srgb, currentColor 4%, transparent)",
};
const rowUnavailableStyle: CSSProperties = { ...rowStyle, opacity: 0.68 };
const rowTextStyle: CSSProperties = { display: "grid", gap: 2, minWidth: 0 };
const labelStyle: CSSProperties = { fontSize: 13 };
const detailStyle: CSSProperties = { fontSize: 11, opacity: 0.72, lineHeight: 1.5 };
const emptyStyle: CSSProperties = { margin: 0, fontSize: 12, opacity: 0.55 };
const keycapsStyle: CSSProperties = { display: "inline-flex", gap: 4, alignItems: "center", flexWrap: "wrap" };
const kbdStyle: CSSProperties = {
  fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
  fontSize: 11,
  lineHeight: "18px",
  minWidth: 18,
  padding: "0 5px",
  textAlign: "center",
  border: "1px solid color-mix(in srgb, currentColor 24%, transparent)",
  borderBottomWidth: 2,
  borderRadius: 5,
  background: "color-mix(in srgb, currentColor 7%, transparent)",
};
const editButtonStyle: CSSProperties = {
  font: "inherit",
  fontSize: 12,
  padding: "3px 10px",
  borderRadius: 6,
  border: "1px solid color-mix(in srgb, currentColor 22%, transparent)",
  background: "transparent",
  color: "inherit",
  cursor: "pointer",
};

const MODIFIER_CODES = new Set([
  "ShiftLeft",
  "ShiftRight",
  "ControlLeft",
  "ControlRight",
  "AltLeft",
  "AltRight",
  "MetaLeft",
  "MetaRight",
  "CapsLock",
]);

/** Keycap pills; combined host strings such as `Ctrl+W` are split into caps. */
function Keycaps({ keys }: { keys: readonly string[] }) {
  if (keys.length === 0) return <span style={{ ...detailStyle, opacity: 0.5 }}>—</span>;
  return (
    <span style={keycapsStyle} data-keycaps="true">
      {keys.flatMap((key, keyIndex) => {
        const parts = key.includes("+") ? key.split("+").map(part => part.trim()).filter(Boolean) : [key];
        return parts.map((part, partIndex) => (
          <kbd key={`${keyIndex}-${partIndex}`} style={kbdStyle}>
            {part}
          </kbd>
        ));
      })}
    </span>
  );
}

/** Local panel commands the host catalog cannot carry. */
function localCatalog(
  service: WorkbenchService,
  t: Translate,
  platform: BindingPlatform,
): ShortcutCatalogEntryLike[] {
  return service.keymap
    .filter(command => command.scope === "panel")
    .map(command => ({
      id: command.id,
      label: t(command.labelKey),
      keys: bindingCaps(command.desktop, platform),
      bound: true,
      issue: null,
      conflicts: [],
    }));
}

/**
 * Merge host catalog entries with panel-local commands, preserving host order.
 * @param host - host catalog snapshot.
 * @param local - panel commands from the core keymap.
 * @returns one array for `buildSettingsGroups`.
 */
function mergeCatalog(
  host: readonly ShortcutCatalogEntryLike[],
  local: readonly ShortcutCatalogEntryLike[],
  service: WorkbenchService,
  platform: BindingPlatform,
): ShortcutCatalogEntryLike[] {
  const seen = new Set(host.map(entry => entry.id));
  const filledHost = host.map(entry => {
    if (entry.keys.length > 0) return entry;
    const spec = service.keymap.find(command => command.id === entry.id);
    if (spec === undefined) return entry;
    return { ...entry, keys: bindingCaps(spec.desktop, platform), bound: false };
  });
  return [...filledHost, ...local.filter(entry => !seen.has(entry.id))];
}

/**
 * Build the section component for one mount.
 * @param wiring - service, translate seat and optional host shortcut service.
 * @returns the component to register into `settings.section`.
 */
export function createWorkbenchSection({ service, t, shortcuts }: SectionWiring): ComponentType {
  function WorkbenchSection() {
    const [editing, setEditing] = useState<string | null>(null);
    const [notice, setNotice] = useState<string | null>(null);

    const subscribe = useCallback(
      (listener: () => void) => (shortcuts === undefined ? () => {} : shortcuts.catalog.subscribe(listener)),
      [],
    );
    const getHostSnapshot = useCallback(
      () => (shortcuts === undefined ? EMPTY_CATALOG : shortcuts.catalog.getSnapshot()),
      [],
    );
    const hostCatalog = useSyncExternalStore(subscribe, getHostSnapshot, getHostSnapshot);
    const platform = useMemo(() => detectPlatform(), []);
    const local = useMemo(() => localCatalog(service, t, platform), [service, t, platform]);
    const catalog = useMemo(
      () => mergeCatalog(hostCatalog, local, service, platform),
      [hostCatalog, local, service, platform],
    );
    const groups = useMemo(
      () => buildSettingsGroups(catalog, { runtime: shortcuts?.runtime ?? "desktop" }),
      [catalog, shortcuts],
    );
    const report = useMemo(() => checkBindings(shortcuts), [shortcuts, hostCatalog]);
    const hostIds = useMemo(() => new Set(hostCatalog.map(entry => entry.id)), [hostCatalog]);
    const canEdit = shortcuts?.edit !== undefined && shortcuts.describeBinding !== undefined;

    useEffect(() => {
      if (editing === null || shortcuts?.edit === undefined) return;
      const onKeyDown = (event: KeyboardEvent) => {
        if (event.key === "Escape") {
          event.preventDefault();
          event.stopPropagation();
          setEditing(null);
          setNotice(null);
          return;
        }
        if (event.code === "" || MODIFIER_CODES.has(event.code)) return;
        event.preventDefault();
        event.stopPropagation();
        const binding: KeyBinding = {
          code: event.code,
          modifiers: [
            ...(event.ctrlKey ? (["control"] as const) : []),
            ...(event.altKey ? (["alt"] as const) : []),
            ...(event.shiftKey ? (["shift"] as const) : []),
            ...(event.metaKey ? (["meta"] as const) : []),
          ],
        };
        const described = shortcuts.describeBinding?.(binding);
        const conflicts = (described?.conflicts ?? []).filter(id => id !== editing);
        if (described?.issue || conflicts.length > 0) {
          const reason = described?.issue === null || described?.issue === undefined
            ? conflicts.join(", ")
            : t(`issue.${described.issue}`);
          setNotice(`${t("edit.rejected")}：${reason}`);
          return;
        }
        const snapshot = shortcuts.config?.getSnapshot();
        if (snapshot === undefined) {
          setNotice(t("edit.unavailable"));
          return;
        }
        void shortcuts
          .edit?.({ type: "set", id: editing, binding }, snapshot.revision)
          .then(result => {
            setNotice(result.status === "saved" ? t("edit.saved") : `${t("edit.failed")} ${result.status}`);
            if (result.status === "saved") setEditing(null);
          })
          .catch(error => {
            setNotice(`${t("edit.failed")} ${error instanceof Error ? error.message : String(error)}`);
          });
      };
      window.addEventListener("keydown", onKeyDown, true);
      return () => window.removeEventListener("keydown", onKeyDown, true);
    }, [editing, shortcuts, t]);

    const renderRow = (row: SettingsRow) => (
      <li
        key={row.id}
        data-command={row.id}
        data-web-available={row.webAvailable ? "true" : "false"}
        style={row.webAvailable ? rowStyle : rowUnavailableStyle}
      >
        <div style={rowTextStyle}>
          <span style={labelStyle}>{row.label}</span>
          <span style={detailStyle}>
            {t("row.desktop")} {row.desktopAvailable ? t("state.available") : t("state.unavailable")}
            {" · "}
            {t("row.web")} {row.webAvailable ? t("state.available") : t("state.unavailable")}
          </span>
          {row.note === undefined ? null : (
            <span style={detailStyle}>
              {row.note}
              {!row.webAvailable && row.alternative !== undefined
                ? ` · ${t("row.alternative")}：${row.alternative}`
                : ""}
            </span>
          )}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
          <Keycaps keys={row.keys} />
          {canEdit && hostIds.has(row.id) ? (
            <button
              type="button"
              style={editButtonStyle}
              data-edit-command={row.id}
              onClick={() => {
                setNotice(null);
                setEditing(row.id);
              }}
            >
              {editing === row.id ? t("row.recording") : t("row.edit")}
            </button>
          ) : null}
        </div>
      </li>
    );

    return (
      <section data-workbench-section="workbench" style={sectionStyle}>
        <p style={{ ...detailStyle, margin: 0 }}>{t("section.description")}</p>

        {groups.map(group => (
          <div key={group.id} data-settings-group={group.id} style={groupStyle}>
            <h3 style={groupTitleStyle}>{t(group.labelKey)}</h3>
            {group.installed ? (
              <ul style={listStyle}>{group.rows.map(renderRow)}</ul>
            ) : (
              <p style={emptyStyle} data-empty="true">
                {t("group.empty")}
              </p>
            )}
          </div>
        ))}

        <div data-reserved-bindings="true" style={groupStyle}>
          <h3 style={groupTitleStyle}>{t("reserved.title")}</h3>
          <ul style={listStyle}>
            {RESERVED_BINDINGS.map(note => (
              <li key={note.id} style={rowUnavailableStyle} data-reserved={note.id}>
                <div style={rowTextStyle}>
                  <span style={labelStyle}>{t(note.labelKey)}</span>
                  <span style={detailStyle}>{note.note}</span>
                  <span style={detailStyle}>
                    {t("row.alternative")}：{note.alternative}
                  </span>
                </div>
                <Keycaps keys={note.keys} />
              </li>
            ))}
          </ul>
        </div>

        {notice === null ? null : (
          <p role="status" data-edit-notice="true" style={{ ...detailStyle, margin: 0 }}>
            {notice}
          </p>
        )}

        <p style={{ ...detailStyle, margin: 0, opacity: 0.55 }}>
          {t("section.checked")} {report.checked}
          {report.conflicts.length === 0 ? "" : ` · ${t("section.conflicts")} ${report.conflicts.join(", ")}`}
          {` · ${t("section.version")} ${service.version}`}
        </p>
      </section>
    );
  }

  return WorkbenchSection;
}
