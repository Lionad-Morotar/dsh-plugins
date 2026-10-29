/**
 * The panel's dictionaries.
 *
 * Both bundles carry the same keys. This is a personal-use package whose only
 * reader is Chinese, and the host's language setting is English, so both
 * dictionaries carry the Chinese copy directly — the dsh-jump precedent — and
 * the English voice returns when the package ever faces the market.
 *
 * The copy names what the row is and what saving does. Command syntax and
 * shadow/override vocabulary stay out of the panel: the /mcp-timeout error
 * already teaches ids better than a placeholder can.
 */

/** Simplified Chinese copy (serves as both languages for now). */
const ZH_COPY = {
  "nav.title": "MCP",
  "title": "MCP 超时",
  "description": "按服务器设置工具调用超时；保存后写入对应配置，该服务器的连接会重启生效。",
  "row.hint": "毫秒数；清空并保存即恢复默认。",
  "row.overridden": "已设置",
  "row.reset": "还原",
  "row.invalid": "请填不小于 1000 的毫秒数。",
  "row.ghost": "该行在配置中已不存在；清空并保存即移除。",
  "row.ghostSuffix": "（已失效）",
  "add.placeholder": "行 id，如 mcp-glm-search",
  "add.timeoutPlaceholder": "毫秒，如 120000",
  "add.submit": "添加",
  "empty.servers": "当前配置里没有 MCP 服务器行；在 profile 里添加后这里会出现。",
  "preset.title": "常用值",
  "preset.kimiVideo": "kimi 视频 11 分钟",
  "preset.kimiImage": "kimi 图片 6 分钟",
  "race.hint": "超时需大于服务器自身的限制，否则长调用会先在服务端被掐断。",
  "unavailable": "该插件当前未加载，暂时无法配置。",
  "readOnly": "本部署的设置为只读。",
  "save": "保存",
  "saving": "保存中…",
  "saveFailed": "没有保存成功，已保留你填的值。",
} as const;

/** English copy (currently mirrors the Chinese; kept for a future market face). */
export const EN: typeof ZH_COPY = { ...ZH_COPY };

/** Simplified Chinese export kept as the named dictionary. */
export const ZH: typeof ZH_COPY = ZH_COPY;

