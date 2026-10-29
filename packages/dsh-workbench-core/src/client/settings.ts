/**
 * The settings matrix's pure half.
 *
 * The host `ctx.shortcuts.catalog` snapshot is the only input: ids, labels and
 * effective keycaps come from it, so a command that is not mounted never shows
 * up as a phantom row. The matrices are grouped by the second id segment
 * (`workbench.files.*`, `workbench.git.*`, `workbench.term.*`); panel chords
 * belong to the file panel's tab strip and are grouped with it.
 *
 * Availability is a cross-runtime answer, not the current runtime's one:
 * `webAvailable` says whether a web shell can promise the chord at all. A null
 * web default in `keymap.ts` is a measured decision (browser delivery), not an
 * omission, so it must be visible in the matrix with a reason and an
 * alternative.
 */
import { bindingCaps, WORKBENCH_COMMANDS, type WorkbenchCommandSpec, type WorkbenchGroup } from "./keymap.ts";

/** Binding failure reasons the host catalog uses. */
export type BindingIssueName = "reserved" | "unsupported-browser" | "modifier-required" | "unsupported-key";

/** The catalog fields the matrix reads; the host entry is structurally assignable. */
export interface ShortcutCatalogEntryLike {
  readonly id: string;
  readonly label: string;
  readonly keys: readonly string[];
  /**
   * Whether `keys` is a binding of the current runtime. The section sets this
   * false when it fills desktop caps into an unbound web row, so availability
   * stays an honest cross-runtime answer.
   */
  readonly bound?: boolean;
  readonly issue?: BindingIssueName | string | null;
  readonly conflicts?: readonly string[];
}

/** What the matrix needs to know about the client it renders in. */
export interface BuildSettingsOptions {
  readonly runtime?: "desktop" | "web";
}

/** One settings row. */
export interface SettingsRow {
  readonly id: string;
  readonly label: string;
  /** Effective keycaps for the current runtime; empty when unbound. */
  readonly keys: readonly string[];
  /** Whether a web shell can promise this chord. */
  readonly webAvailable: boolean;
  /** Why the web runtime cannot use it, shown next to a greyed row. */
  readonly note?: string;
  /** What to use instead. */
  readonly alternative?: string;
  /** Whether the desktop shell has a declared binding. */
  readonly desktopAvailable: boolean;
  readonly issue: string | null;
  readonly conflicts: readonly string[];
}

/** One settings group; `installed` is false when no command of that group mounted. */
export interface SettingsGroup {
  readonly id: WorkbenchGroup;
  readonly labelKey: string;
  readonly rows: readonly SettingsRow[];
  readonly installed: boolean;
}

/** A chord the workbench deliberately does not bind; rendered as advice, not a control. */
export interface ReservedBindingNote {
  readonly id: string;
  readonly keys: readonly string[];
  readonly labelKey: string;
  readonly note: string;
  readonly alternative: string;
}

const GROUP_LABEL_KEY: Record<WorkbenchGroup, string> = {
  files: "group.files",
  git: "group.git",
  terminal: "group.terminal",
};

const GROUP_ORDER: readonly WorkbenchGroup[] = ["files", "git", "terminal"];

const GROUP_BY_SEGMENT: Record<string, WorkbenchGroup> = {
  files: "files",
  file: "files",
  panel: "files",
  openFiles: "files",
  git: "git",
  openGit: "git",
  term: "terminal",
  terminal: "terminal",
  toggleTerminal: "terminal",
};

const ISSUE_NOTE: Record<BindingIssueName, string> = {
  "unsupported-browser": "浏览器会先接管该组合（browser reserves it）",
  "unsupported-key": "当前键盘没有这个物理键",
  "modifier-required": "该组合至少需要一个修饰键",
  reserved: "该组合已被系统或宿主保留",
};

const ISSUE_ALTERNATIVE: Record<WorkbenchGroup, string> = {
  files: "改用面板标签切换，或点击关闭按钮",
  git: "改用 Git 面板标签",
  terminal: "改用终端 dock 内的按钮",
};

/** Chords the workbench never binds; the reasons live next to the matrix. */
export const RESERVED_BINDINGS: readonly ReservedBindingNote[] = [
  {
    id: "workspace.add",
    keys: ["⌘O"],
    labelKey: "reserved.open",
    note: "宿主 workspace.add 已占用 ⌘O，工作台不再绑定，避免抢走文件选择器",
    alternative: "用 ⌘⌥↓ / ⌘⌥↑ 切换工作台面板",
  },
  {
    id: "insert",
    keys: ["Cmd+Insert"],
    labelKey: "reserved.insert",
    note: "Mac 键盘没有 Insert 键，任何端都不注册这个组合",
    alternative: "改用 ⌘C / ⌘V",
  },
];

/**
 * Pick the settings group from a command id.
 * @param id - host catalog command id.
 * @returns the group; unknown `workbench.*` segments stay visible under files.
 */
export function settingsGroupOf(id: string): WorkbenchGroup {
  const segment = id.split(".")[1] ?? "";
  return GROUP_BY_SEGMENT[segment] ?? "files";
}

/** Find the declared spec behind a catalog row, when the workbench declared one. */
function specOf(id: string): WorkbenchCommandSpec | undefined {
  return WORKBENCH_COMMANDS.find(command => command.id === id);
}

/**
 * Turn one catalog row into a settings row.
 * @param entry - host catalog entry.
 * @returns display data with cross-runtime availability.
 */
function toSettingsRow(entry: ShortcutCatalogEntryLike, runtime: "desktop" | "web"): SettingsRow {
  const spec = specOf(entry.id);
  const issue = typeof entry.issue === "string" ? entry.issue : null;
  const issueNote = issue !== null ? ISSUE_NOTE[issue as BindingIssueName] : undefined;
  const bound = entry.bound ?? entry.keys.length > 0;
  const webBySpec = spec === undefined ? undefined : spec.web !== null;
  // A web row may show desktop caps as a hint; `bound` tells us whether the
  // current runtime really owns a binding. A user override that differs from
  // the desktop caps is a real web binding even when the default is null.
  const desktopCaps = spec === undefined ? [] : bindingCaps(spec.desktop);
  const customWebBinding =
    runtime === "web" && bound && (entry.keys.length !== desktopCaps.length || entry.keys.some((key, i) => key !== desktopCaps[i]));
  const webAvailable = issue === null && (webBySpec === true || (webBySpec === false ? customWebBinding : bound));
  const note = (webBySpec === false && !customWebBinding ? spec?.webNote : undefined) ?? issueNote;
  const alternative =
    spec?.webAlternative ?? (issue !== null ? ISSUE_ALTERNATIVE[settingsGroupOf(entry.id)] : undefined);

  return {
    id: entry.id,
    label: entry.label,
    keys: [...entry.keys],
    webAvailable,
    ...(note === undefined ? {} : { note }),
    ...(alternative === undefined ? {} : { alternative }),
    desktopAvailable: issue === null || issue === "unsupported-browser",
    issue,
    conflicts: [...(entry.conflicts ?? [])],
  };
}

/**
 * Build the three settings groups from a host catalog snapshot.
 * @param catalog - `ctx.shortcuts.catalog.getSnapshot()` or an equivalent array.
 * @returns files, Git and terminal groups in display order; every group is
 * present even when it has no rows, so the section can say "未安装".
 */
export function buildSettingsGroups(
  catalog: readonly ShortcutCatalogEntryLike[],
  options: BuildSettingsOptions = {},
): SettingsGroup[] {
  const runtime = options.runtime ?? "desktop";
  const buckets = new Map<WorkbenchGroup, SettingsRow[]>(GROUP_ORDER.map(group => [group, []]));
  for (const entry of catalog) {
    if (!entry.id.startsWith("workbench.")) continue;
    buckets.get(settingsGroupOf(entry.id))?.push(toSettingsRow(entry, runtime));
  }
  return GROUP_ORDER.map(group => {
    const rows = buckets.get(group) ?? [];
    return {
      id: group,
      labelKey: GROUP_LABEL_KEY[group],
      rows,
      installed: rows.length > 0,
    };
  });
}

/** The description surface `checkBindings` needs from the host. */
export interface ShortcutDescriberLike {
  describeBinding?(binding: { readonly code: string; readonly modifiers: readonly string[] } | null): {
    readonly issue?: string | null;
    readonly conflicts?: readonly string[] | null;
  } | null;
}

/** A conflict report over the workbench's global chords. */
export interface BindingReport {
  readonly checked: number;
  readonly conflicts: readonly string[];
  /** Non-conflict problems (reserved/unsupported), prefixed with the command id. */
  readonly issues: readonly string[];
}

/**
 * Ask the host to describe the three global workbench chords.
 *
 * The `describeBinding` probe is the same one the host's shortcut editor uses,
 * so this is a real conflict check rather than a local string comparison.
 * A command's own id is dropped from the conflict list: describing its own
 * accepted default naturally points back at itself.
 *
 * @param shortcuts - the host shortcut service or a test double.
 * @returns checked count plus foreign conflicts and per-command issues.
 */
export function checkBindings(shortcuts: ShortcutDescriberLike | undefined | null): BindingReport {
  const conflicts = new Set<string>();
  const issues = new Set<string>();
  let checked = 0;
  for (const command of WORKBENCH_COMMANDS.filter(spec => spec.scope === "global")) {
    checked += 1;
    const describe = shortcuts?.describeBinding;
    if (typeof describe !== "function") {
      issues.add(`${command.id}:no-describer`);
      continue;
    }
    try {
      const described = describe(command.desktop);
      for (const conflict of described?.conflicts ?? []) {
        if (conflict !== command.id) conflicts.add(String(conflict));
      }
      if (described?.issue) issues.add(`${command.id}:${described.issue}`);
    } catch {
      issues.add(`${command.id}:unsupported-key`);
    }
  }
  return { checked, conflicts: [...conflicts], issues: [...issues] };
}
