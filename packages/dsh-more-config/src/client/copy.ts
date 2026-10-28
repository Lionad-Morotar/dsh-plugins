/**
 * The panel's dictionaries.
 *
 * Both bundles carry the same keys; the form-frame labels (save, saving,
 * readOnly, unavailable, saveFailed) feed the shared SettingsForm frame, the
 * rest belongs to this section. The hints carry the two facts a user cannot
 * guess: where entry ids come from, and why the client timeout must exceed the
 * server's internal one.
 */

/** Simplified Chinese copy. */
export const ZH = {
  "nav.title": "MCP",
  "title": "MCP 配置",
  "description": "为每个 MCP 服务器设置工具调用超时。保存后由主机同步到对应的 mcp 行，该服务器连接重启生效。",
  "row.label": "服务器条目",
  "row.hint": "profile 里的 entryId，例如 mcp-kimi-tools；不确定时运行 /mcp-timeout abc 1，报错会列出全部候选。",
  "row.overridden": "已覆盖",
  "row.reset": "移除覆盖",
  "row.invalid": "请填不小于 1000 的毫秒数，或清空表示移除。",
  "add.id": "entryId",
  "add.placeholder": "mcp-kimi-tools",
  "add.timeout": "超时（毫秒）",
  "add.timeoutPlaceholder": "660000",
  "add.submit": "添加",
  "empty": "还没有超时覆盖。用下面的预设或添加一行，也可以直接用 /mcp-timeout 命令。",
  "preset.title": "预设",
  "preset.kimiVideo": "kimi 视频 11 分钟",
  "preset.kimiImage": "kimi 图片 6 分钟",
  "preset.hint": "预设写入的 entryId 以 /mcp-timeout 的报错清单为准。",
  "race.hint": "客户端超时要大于服务器内部超时再加余量，否则长调用会在服务端先被掐断。",
  "unavailable": "该插件当前未加载，暂时无法配置。",
  "readOnly": "本部署的设置为只读。",
  "save": "保存",
  "saving": "保存中…",
  "saveFailed": "本部署没有接受这些值，已保留供你修改。",
} as const;

/** English copy. */
export const EN = {
  "nav.title": "MCP",
  "title": "MCP",
  "description": "Set per-server tool-call timeouts. Saving syncs each one to its mcp row on the host, and that server's connection restarts.",
  "row.label": "Server entry",
  "row.hint": "The profile entryId, e.g. mcp-kimi-tools; run /mcp-timeout abc 1 to list the live candidates in the error.",
  "row.overridden": "Overridden",
  "row.reset": "Remove override",
  "row.invalid": "Enter milliseconds ≥ 1000, or clear the field to remove.",
  "add.id": "entryId",
  "add.placeholder": "mcp-kimi-tools",
  "add.timeout": "Timeout (ms)",
  "add.timeoutPlaceholder": "660000",
  "add.submit": "Add",
  "empty": "No timeout overrides yet. Use a preset below, add a row, or just run /mcp-timeout.",
  "preset.title": "Presets",
  "preset.kimiVideo": "kimi video 11 min",
  "preset.kimiImage": "kimi image 6 min",
  "preset.hint": "Preset entryIds follow the candidate list /mcp-timeout prints.",
  "race.hint": "Keep the client timeout above the server's own limit plus headroom, or long calls get cut server-side first.",
  "unavailable": "This plugin is not loaded, so it cannot be configured right now.",
  "readOnly": "This deployment stores settings read-only.",
  "save": "Save",
  "saving": "Saving…",
  "saveFailed": "The deployment did not accept these values; they were left for you to correct.",
} as const;
