/**
 * Every string the panel says, in one place and in two languages.
 *
 * The host is bilingual, so the panel is too; but the copy is a plain lookup
 * rather than a locale bundle because nothing here is contributed to another
 * surface. A missing translation would be a runtime hole, so the table is typed
 * as a total `Copy` and both languages must fill every field.
 */

import type { PanelMode } from "./panel-state.ts";

export interface FooterHint {
  readonly move: string;
  readonly accept: string;
  readonly back: string;
  readonly close: string;
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
  readonly noticeNoSession: string;
  readonly noticeInsertFailed: string;
  readonly noticeExecuted: (name: string, text: string | undefined) => string;
  readonly noticeExecuteFailed: (name: string, text: string | undefined) => string;
  readonly noticeWorkspaceEmpty: string;
  readonly noticeClaimFailed: (keys: string) => string;
  /** Human age for a session's last update, given the elapsed milliseconds. */
  readonly age: (elapsed: number) => string;
}

const ZH: Copy = {
  title: "命令面板",
  placeholder: {
    navigate: "搜索文件，回车把绝对路径写进输入框",
    command: "搜索已注册的指令，回车执行",
    switch: "搜索工作区",
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
  footer: { move: "↑↓ 移动", accept: "↵ 确认", back: "esc 返回", close: "esc 关闭" },
  noticeNoSession: "当前没有打开的会话，无法写入输入框",
  noticeInsertFailed: "输入框正忙，稍后重试",
  noticeExecuted: (name, text) => (text === undefined || text === "" ? `已执行 /${name}` : `/${name}：${text}`),
  noticeExecuteFailed: (name, text) => `/${name} 执行失败${text === undefined || text === "" ? "" : `：${text}`}`,
  noticeWorkspaceEmpty: "这个工作区还没有会话",
  noticeClaimFailed: keys => `快捷键 ${keys} 已被占用，可在设置 → 快捷键里改绑`,
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
    navigate: "Search files; Enter inserts the absolute path",
    command: "Search registered commands; Enter runs one",
    switch: "Search workspaces",
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
  footer: { move: "↑↓ move", accept: "↵ select", back: "esc back", close: "esc close" },
  noticeNoSession: "No open session, so there is no composer to write to",
  noticeInsertFailed: "The composer is busy; try again",
  noticeExecuted: (name, text) => (text === undefined || text === "" ? `Ran /${name}` : `/${name}: ${text}`),
  noticeExecuteFailed: (name, text) => `/${name} failed${text === undefined || text === "" ? "" : `: ${text}`}`,
  noticeWorkspaceEmpty: "This workspace has no sessions yet",
  noticeClaimFailed: keys => `${keys} is taken; rebind it in Settings → Shortcuts`,
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
