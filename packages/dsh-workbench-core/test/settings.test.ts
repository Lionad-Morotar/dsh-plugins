import { describe, expect, it, vi } from "vitest";

import { buildSettingsGroups, checkBindings } from "../src/client/settings.ts";
import type { ShortcutCatalogEntryLike } from "../src/client/settings.ts";

const CATALOG: ShortcutCatalogEntryLike[] = [
  { id: "workbench.files.toggle", label: "打开文件面板", keys: ["⌘⇧E"], issue: null, conflicts: [] },
  { id: "workbench.git.toggle", label: "打开 Git 面板", keys: ["⌘⇧G"], issue: null, conflicts: [] },
  { id: "workbench.term.toggle", label: "切换终端", keys: ["⌘⇧M"], issue: null, conflicts: [] },
  { id: "workbench.panel.next", label: "下一个面板", keys: ["⌘⌥↓"], issue: null, conflicts: [] },
  { id: "workbench.panel.close", label: "关闭面板", keys: ["Ctrl+W"], issue: "unsupported-browser", conflicts: [] },
  { id: "workspace.files", label: "宿主：文件", keys: ["⌘P"], issue: null, conflicts: [] },
];

describe("buildSettingsGroups", () => {
  it("returns the three workbench groups and never admits host commands", () => {
    const groups = buildSettingsGroups(CATALOG);
    expect(groups.map(group => group.id)).toEqual(["files", "git", "terminal"]);
    const rows = groups.flatMap(group => group.rows);
    expect(rows.map(row => row.id)).not.toContain("workspace.files");
    expect(rows.every(row => row.id.startsWith("workbench."))).toBe(true);
  });

  it("derives the row set from the catalog instead of a static list", () => {
    const fewer = buildSettingsGroups(CATALOG.slice(0, 3));
    expect(fewer.flatMap(group => group.rows)).toHaveLength(3);

    const more = buildSettingsGroups([
      ...CATALOG,
      { id: "workbench.term.split", label: "分割终端", keys: ["⌘⇧5"], issue: null, conflicts: [] },
    ]);
    expect(more.flatMap(group => group.rows)).toHaveLength(6);
  });

  it("marks a browser-reserved web chord unavailable with reason and alternative", () => {
    const close = buildSettingsGroups(CATALOG)
      .flatMap(group => group.rows)
      .find(row => row.id === "workbench.panel.close");
    expect(close).toBeDefined();
    expect(close?.webAvailable).toBe(false);
    expect(close?.note).toMatch(/浏览器|browser/u);
    expect(close?.alternative).toBeTruthy();
  });

  it("marks empty groups as not installed instead of rendering a shell", () => {
    const groups = buildSettingsGroups([]);
    expect(groups).toHaveLength(3);
    expect(groups.every(group => group.rows.length === 0 && group.installed === false)).toBe(true);
  });

  it("keeps a declared-null web chord unavailable even when desktop caps are shown", () => {
    const groups = buildSettingsGroups(
      [{ id: "workbench.panel.close", label: "关闭面板", keys: ["Ctrl", "W"], bound: true, issue: null, conflicts: [] }],
      { runtime: "web" },
    );
    const close = groups.flatMap(group => group.rows).find(row => row.id === "workbench.panel.close");
    expect(close?.webAvailable).toBe(false);
    expect(close?.note).toMatch(/浏览器|browser/u);
  });

  it("accepts a real web binding that differs from the desktop default", () => {
    const groups = buildSettingsGroups(
      [{ id: "workbench.files.toggle", label: "打开文件面板", keys: ["Ctrl", "Alt", "E"], bound: true, issue: null, conflicts: [] }],
      { runtime: "web" },
    );
    const files = groups.flatMap(group => group.rows).find(row => row.id === "workbench.files.toggle");
    expect(files?.webAvailable).toBe(true);
  });

  it("keeps a host-refused global chord available through the local router", () => {
    const groups = buildSettingsGroups(
      [{ id: "workbench.files.toggle", label: "打开文件面板", keys: ["⌘", "⇧", "E"], bound: false, issue: null, conflicts: [] }],
      { runtime: "web" },
    );
    const files = groups.flatMap(group => group.rows).find(row => row.id === "workbench.files.toggle");
    expect(files?.webAvailable).toBe(true);
    expect(files?.note).toMatch(/本地路由/u);
    expect(files?.alternative).toBe("⌘⇧E");
  });

  it("keeps panel commands in the files group", () => {
    const groups = buildSettingsGroups(CATALOG);
    const files = groups.find(group => group.id === "files");
    expect(files?.rows.map(row => row.id)).toContain("workbench.panel.close");
    expect(files?.rows.map(row => row.id)).toContain("workbench.panel.next");
  });
});

describe("checkBindings", () => {
  it("describes the three global workbench chords", () => {
    const describeBinding = vi.fn(() => ({ binding: null, keys: [], issue: null, conflicts: [] }));
    const report = checkBindings({ describeBinding });
    expect(describeBinding).toHaveBeenCalledTimes(3);
    expect(report.checked).toBe(3);
    expect(report.conflicts).toEqual([]);
  });

  it("drops the command's own id from conflicts and keeps foreign ones", () => {
    const describeBinding = vi.fn((binding: { readonly code: string } | null) => ({
      binding: null,
      keys: [],
      issue: null,
      conflicts: binding?.code === "KeyE" ? ["workbench.files.toggle", "workspace.add"] : [],
    }));
    const report = checkBindings({ describeBinding });
    expect(report.conflicts).toEqual(["workspace.add"]);
  });

  it("survives a missing describer by reporting it as unchecked evidence", () => {
    const report = checkBindings({});
    expect(report.checked).toBe(3);
    expect(report.conflicts).toEqual([]);
    expect(report.issues.length).toBeGreaterThan(0);
  });
});
