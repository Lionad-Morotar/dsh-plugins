/**
 * Every string the panel says, in one place and in two languages.
 *
 * The host is bilingual, so the panel is too; but the copy is a plain lookup
 * rather than a locale bundle because nothing here is contributed to another
 * surface. A missing translation would be a runtime hole, so the table is typed
 * as a total `Copy` and both languages must fill every field.
 */

import type { ActionCategory } from "./catalog.ts";
import type { PanelMode } from "./panel-state.ts";

export interface FooterHint {
  readonly move: string;
  readonly accept: string;
  readonly back: string;
  readonly close: string;
  /** Only shown where the arrows move through directories (navigate mode). */
  readonly tree?: string;
  /** Only shown where a file can be handed to the file workbench. */
  readonly reveal?: string;
}

export interface Copy {
  /** Dialog accessible name. */
  readonly title: string;
  readonly placeholder: Record<PanelMode, string>;
  readonly empty: Record<PanelMode, string>;
  readonly loading: string;
  readonly noResults: string;
  readonly failed: string;
  readonly directory: string;
  readonly groupBuiltin: string;
  readonly groupCommands: string;
  readonly groupShortcuts: string;
  readonly groupWorkspaces: string;
  readonly groupSessions: string;
  readonly allSessions: string;
  readonly allSessionsDetail: string;
  readonly ungrouped: string;
  readonly sessionsCount: (count: number) => string;
  readonly running: string;
  readonly needsInput: string;
  readonly modeNames: Record<PanelMode, string>;
  readonly modeDescriptions: Record<PanelMode, string>;
  readonly footer: FooterHint;
  readonly noticeRevealUnavailable: string;
  readonly noticeRevealUnfocused: string;
  readonly noticeNoSession: string;
  readonly noticeInsertFailed: string;
  readonly noticeExecuted: (name: string, text: string | undefined) => string;
  readonly noticeExecuteFailed: (name: string, text: string | undefined) => string;
  readonly noticeWorkspaceEmpty: string;
  readonly noticeClaimFailed: (keys: string) => string;
  /** Human age for a session's last update, given the elapsed milliseconds. */
  readonly age: (elapsed: number) => string;
  /** Category word prefixed to every catalogue row label. */
  readonly categoryNames: Readonly<Record<ActionCategory, string>>;
  /** Action text by catalogue id; the row label is `${category}：${action}`. */
  readonly actionLabels: Readonly<Record<string, string>>;
  /** Notices the catalogue actions surface when they land or fail. */
  readonly actions: {
    readonly needsCwd: string;
    readonly noSessionSurface: string;
    readonly seatUnavailable: string;
    readonly sessionBusy: string;
    readonly forked: (title: string) => string;
    readonly pinned: (pinned: boolean) => string;
    readonly themeSwitched: (dark: boolean) => string;
    readonly failed: (what: string, code: string | undefined) => string;
  };
}

const ZH: Copy = {
  title: "命令面板",
  placeholder: {
    navigate: "搜索文件，回车写入路径（> 切指令）",
    command: "搜索已注册的指令，回车执行",
    switch: "搜索工作区或会话（> 切指令）",
  },
  empty: {
    navigate: "没有可导航的文件",
    command: "没有可用的指令",
    switch: "还没有工作区",
  },
  loading: "读取中",
  noResults: "没有匹配的结果",
  failed: "读取失败",
  directory: "目录",
  groupBuiltin: "面板",
  groupCommands: "指令",
  groupShortcuts: "快捷键",
  groupWorkspaces: "工作区",
  groupSessions: "会话",
  allSessions: "全部会话",
  allSessionsDetail: "跨工作区搜索会话",
  ungrouped: "未分组",
  sessionsCount: count => `${count} 个会话`,
  running: "运行中",
  needsInput: "需要参数",
  modeNames: { navigate: "文件导航", command: "指令", switch: "切换" },
  modeDescriptions: {
    navigate: "把文件的绝对路径写进输入框",
    command: "搜索并执行已注册的指令",
    switch: "先选工作区，再选会话",
  },
  footer: {
    move: "↑↓ 移动",
    accept: "↵ 确认",
    back: "esc 返回",
    close: "esc 关闭",
    tree: "←→ 上下层",
    reveal: "⌘↵ 文件面板",
  },
  noticeRevealUnavailable: "文件面板不可用，宿主里没有注册 fs-explorer 视图",
  noticeRevealUnfocused: "已切到文件面板；这个宿主没把定位能力交给插件，请手动打开该文件",
  noticeNoSession: "当前没有打开的会话，无法写入输入框",
  noticeInsertFailed: "输入框正忙，稍后重试",
  noticeExecuted: (name, text) => (text === undefined || text === "" ? `已执行 /${name}` : `/${name}：${text}`),
  noticeExecuteFailed: (name, text) => `/${name} 执行失败${text === undefined || text === "" ? "" : `：${text}`}`,
  noticeWorkspaceEmpty: "这个工作区还没有会话",
  noticeClaimFailed: keys => `快捷键 ${keys} 已被占用，可在设置 → 快捷键里改绑`,
  categoryNames: { panel: "面板", session: "会话", navigate: "导航", view: "视图" },
  actionLabels: {
    "panel.navigate": "文件导航",
    "panel.commands": "指令",
    "panel.switch": "切换",
    "session.newInWorkspace": "在当前工作区创建新会话",
    "session.newUngrouped": "创建未分组新会话",
    "session.rename": "重命名当前会话",
    "session.archive": "归档当前会话",
    "session.fork": "Fork 当前会话",
    "session.cancel": "中断当前回复",
    "session.pin": "置顶或取消置顶当前会话",
    "navigate.plugins": "打开插件页面",
    "navigate.settings": "打开设置",
    "navigate.shortcuts": "打开快捷键参考",
    "view.sidebar": "显示或隐藏侧栏",
    "view.files": "打开文件树",
    "view.terminal": "新建终端",
    "view.browser": "打开浏览器面板",
    "view.theme": "切换亮暗主题",
  },
  actions: {
    needsCwd: "当前会话没有工作目录，无法创建未分组会话",
    noSessionSurface: "右侧栏需要屏幕上有会话",
    seatUnavailable: "宿主的这个入口当前不可达",
    sessionBusy: "会话还在运行，先中断回复或稍后再归档",
    forked: title => `已 Fork 到新会话「${title}」`,
    pinned: pinned => (pinned ? "已置顶当前会话" : "已取消置顶"),
    themeSwitched: dark => (dark ? "已切到深色主题" : "已切到浅色主题"),
    failed: (what, code) => `${what}失败${code === undefined || code === "" ? "" : `：${code}`}`,
  },
  age: elapsed => {
    const minutes = Math.floor(elapsed / 60_000);
    if (minutes < 1) return "刚刚";
    if (minutes < 60) return `${minutes} 分钟前`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} 小时前`;
    return `${Math.floor(hours / 24)} 天前`;
  },
};

const EN: Copy = {
  title: "Command Panel",
  placeholder: {
    navigate: "Search files; Enter writes the path (> for commands)",
    command: "Search registered commands; Enter runs one",
    switch: "Search workspaces or sessions (> for commands)",
  },
  empty: {
    navigate: "No files to navigate",
    command: "No commands available",
    switch: "No workspaces yet",
  },
  loading: "Loading",
  noResults: "No matching result",
  failed: "Read failed",
  directory: "dir",
  groupBuiltin: "Panel",
  groupCommands: "Commands",
  groupShortcuts: "Shortcuts",
  groupWorkspaces: "Workspaces",
  groupSessions: "Sessions",
  allSessions: "All sessions",
  allSessionsDetail: "Search sessions across workspaces",
  ungrouped: "Ungrouped",
  sessionsCount: count => `${count} session${count === 1 ? "" : "s"}`,
  running: "running",
  needsInput: "takes input",
  modeNames: { navigate: "Files", command: "Commands", switch: "Switch" },
  modeDescriptions: {
    navigate: "Insert a file's absolute path into the composer",
    command: "Search and run a registered command",
    switch: "Pick a workspace, then a session",
  },
  footer: {
    move: "↑↓ move",
    accept: "↵ select",
    back: "esc back",
    close: "esc close",
    tree: "←→ up/down a level",
    reveal: "⌘↵ file panel",
  },
  noticeRevealUnavailable: "No file panel is available; the host has no fs-explorer view",
  noticeRevealUnfocused: "Switched to the file panel; this host hands out no focus capability, so open the file there",
  noticeNoSession: "No open session, so there is no composer to write to",
  noticeInsertFailed: "The composer is busy; try again",
  noticeExecuted: (name, text) => (text === undefined || text === "" ? `Ran /${name}` : `/${name}: ${text}`),
  noticeExecuteFailed: (name, text) => `/${name} failed${text === undefined || text === "" ? "" : `: ${text}`}`,
  noticeWorkspaceEmpty: "This workspace has no sessions yet",
  noticeClaimFailed: keys => `${keys} is taken; rebind it in Settings → Shortcuts`,
  categoryNames: { panel: "Panel", session: "Session", navigate: "Go", view: "View" },
  actionLabels: {
    "panel.navigate": "Files",
    "panel.commands": "Commands",
    "panel.switch": "Switch",
    "session.newInWorkspace": "New session in this workspace",
    "session.newUngrouped": "New ungrouped session",
    "session.rename": "Rename this session",
    "session.archive": "Archive this session",
    "session.fork": "Fork this session",
    "session.cancel": "Stop the current reply",
    "session.pin": "Pin or unpin this session",
    "navigate.plugins": "Open the Plugins page",
    "navigate.settings": "Open Settings",
    "navigate.shortcuts": "Open the keyboard reference",
    "view.sidebar": "Show or hide the sidebar",
    "view.files": "Open the file tree",
    "view.terminal": "New terminal",
    "view.browser": "Open the browser panel",
    "view.theme": "Toggle light and dark theme",
  },
  actions: {
    needsCwd: "This session has no working directory, so an ungrouped session cannot be created",
    noSessionSurface: "The right column needs a session on screen",
    seatUnavailable: "That host surface is not reachable right now",
    sessionBusy: "The session is still running; stop the reply or archive later",
    forked: title => `Forked into “${title}”`,
    pinned: pinned => (pinned ? "Pinned this session" : "Unpinned this session"),
    themeSwitched: dark => (dark ? "Switched to the dark theme" : "Switched to the light theme"),
    failed: (what, code) => `${what} failed${code === undefined || code === "" ? "" : `: ${code}`}`,
  },
  age: elapsed => {
    const minutes = Math.floor(elapsed / 60_000);
    if (minutes < 1) return "just now";
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  },
};

/**
 * The copy table for one active locale.
 *
 * @param active - the host's active locale id (for example `zh-CN`).
 * @returns the Chinese table unless the locale is clearly English.
 */
export function copyFor(active: string): Copy {
  return active.toLowerCase().startsWith("en") ? EN : ZH;
}
