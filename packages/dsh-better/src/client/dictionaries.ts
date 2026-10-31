/**
 * The `better` namespace's strings.
 *
 * Separate from `entry.ts` for one reason: the command label is resolved by the
 * host's shortcut catalog, which reads it outside any React tree, and a key that
 * does not exist here degrades to the raw key in the settings dialog. Living in a
 * DOM-free module lets a test assert the label key against the dictionary instead
 * of trusting that the two spellings match.
 *
 * Deliberately tiny otherwise: the shell publishes the model picker's real copy
 * through `searchLabels`, and this surface prefers it whenever it is present.
 * These are what remains legible when it is not.
 */
import { FOCUS_LABEL_KEY } from "./focus.ts";

/** Every string this package owns, keyed by locale tag then message key. */
export const DICTIONARIES: Readonly<Record<string, Readonly<Record<string, string>>>> = Object.freeze({
  zh: {
    "overlay.aria": "选择模型",
    "listbox.aria": "模型匹配项",
    "search.aria": "搜索供应商或模型",
    "search.placeholder": "搜索供应商或模型…",
    "status.empty": "没有可用的模型。",
    "status.applying": "正在切换…",
    "retry": "重试",
    "trigger.selectAria": "选择模型",
    "trigger.aria": "当前模型 {model}，点击切换",
    "trigger.ariaEffort": "当前模型 {model}，推理等级 {effort}，点击切换",
    "trigger.fallback": "选择模型",
    "trigger.loading": "加载模型…",
    // Keyed through the constant so the catalog's label and this dictionary
    // cannot drift apart.
    [FOCUS_LABEL_KEY]: "聚焦输入框",
    // Attachment clipboard notices. Each names what did not survive the trip, so a
    // partial copy or paste is never silent.
    "attach.copySkipped": "{count} 个附件来自剪贴板、没有本地路径，未复制",
    "attach.pasteMissing": "{count} 个附件对应的文件已不存在，未粘贴",
    "attach.pasteReferenced": "{count} 个附件超出单次读取上限，已改为路径引用",
    "attach.copyFailed": "浏览器拒绝了这次剪贴板写入",
  },
  en: {
    "overlay.aria": "Select a model",
    "listbox.aria": "Matching models",
    "search.aria": "Search providers or models",
    "search.placeholder": "Search providers or models…",
    "status.empty": "No models available.",
    "status.applying": "Switching…",
    "retry": "Retry",
    "trigger.selectAria": "Select model",
    "trigger.aria": "Current model {model}, click to change",
    "trigger.ariaEffort": "Current model {model}, reasoning effort {effort}, click to change",
    "trigger.fallback": "Select model",
    "trigger.loading": "Loading models…",
    [FOCUS_LABEL_KEY]: "Focus message input",
    "attach.copySkipped": "{count} attachment(s) came from the clipboard with no local path and were not copied",
    "attach.pasteMissing": "{count} attachment(s) no longer exist and were not pasted",
    "attach.pasteReferenced": "{count} attachment(s) exceed the read limit and became path references",
    "attach.copyFailed": "The browser refused this clipboard write",
  },
});
