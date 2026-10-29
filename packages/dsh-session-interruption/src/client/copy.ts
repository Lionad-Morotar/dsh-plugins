/**
 * The plugin's dictionaries.
 *
 * Keys are flat and parameters use the shipped `{name}` syntax; both halves of
 * every user-facing string live here so a renderer-free test can pin the whole
 * copy surface.
 */

/** Chinese copy. */
export const ZH: Record<string, string> = {
  "badge.aria": "会话已中断，可继续",
  "hover.title": "上次中断",
  "hover.pending": "{n} 个工具调用未返回",
  "menu.dismiss": "忽略本次中断",
  "time.seconds": "{n}秒",
  "time.minutes": "{n}分钟",
  "time.hours": "{n}小时",
  "time.days": "{n}天",
  "time.ago": "{text}前",
};

/** English copy. */
export const EN: Record<string, string> = {
  "badge.aria": "Session interrupted, resume to continue",
  "hover.title": "Interrupted",
  "hover.pending": "{n} tool call pending",
  "menu.dismiss": "Dismiss this interruption",
  "time.seconds": "{n}s",
  "time.minutes": "{n}m",
  "time.hours": "{n}h",
  "time.days": "{n}d",
  "time.ago": "{text} ago",
};
