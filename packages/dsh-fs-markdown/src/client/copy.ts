/**
 * The strings the Markdown body owns.
 *
 * The renderer receives the file explorer's translator, but that one answers
 * the explorer's own namespace: a plugin cannot add keys to it. This module is
 * the plugin's own dictionary, and `translatorFor` is the fallback used before
 * the locale service hands a live binder over.
 */
export type Translate = (key: string) => string;

export const ZH: Record<string, string> = {
  "md.loading": "正在读取文档…",
  "md.retry": "重试",
  "md.unavailable.title": "文档通道不可用",
  "md.unavailable.description": "当前部署没有提供整篇文档通道，无法读取这个文件。",
  "md.error.too-large": "文件超过 2 MiB，请用源码分页阅读",
  "md.error.not-text": "这不是文本文件，无法按文档读取",
  "md.error.no-workspace": "当前会话缺少工作目录，无法定位这个文件",
  "md.error.no-session": "没有会话上下文，无法读取这个文件",
  "md.error.unknown": "无法读取文档",
  "md.image": "图片",
};

export const EN: Record<string, string> = {
  "md.loading": "Reading document…",
  "md.retry": "Retry",
  "md.unavailable.title": "Document channel unavailable",
  "md.unavailable.description": "This deployment does not expose the whole-document channel, so the file cannot be read.",
  "md.error.too-large": "The file exceeds 2 MiB; read it in paged source view instead",
  "md.error.not-text": "This is not a text file, so it cannot be read as a document",
  "md.error.no-workspace": "The current session has no working directory",
  "md.error.no-session": "There is no session context to read this file from",
  "md.error.unknown": "The document could not be read",
  "md.image": "image",
};

/**
 * A translator over one dictionary.
 *
 * Region tags such as `zh-CN` share the Chinese dictionary; anything unknown
 * reads English, the host's fallback locale.
 * @param locale - host locale id, if one is available.
 * @returns a translator that answers its key unchanged when the dictionary has none.
 */
export function translatorFor(locale: string | undefined): Translate {
  const dictionary = typeof locale === "string" && locale.toLowerCase().startsWith("zh") ? ZH : EN;
  return key => dictionary[key] ?? key;
}
