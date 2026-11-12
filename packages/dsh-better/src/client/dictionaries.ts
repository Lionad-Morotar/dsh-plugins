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
    // The host freezes the composer while a message waits for acceptance, so a
    // paste in that window cannot land and must say so rather than do nothing.
    "attach.pasteBusy": "消息正在发送，稍后再粘贴",
    // The compression count beside the context meter. The row stays silent at
    // zero, so every string here describes at least one compression.
    "compaction.reading": "压缩 {count} 次",
    "compaction.readingOne": "压缩 1 次",
    "compaction.tooltip": "本会话上下文已压缩 {count} 次",
    "compaction.tooltipWithFailures": "本会话上下文已压缩 {count} 次，另有 {failures} 次压缩失败",
    // The settings nav entry and the page it opens. The nav reads `tabs.nav`
    // as a thunk, so a locale change re-labels the entry without re-registering.
    "tabs.nav": "Tab 管理",
    "tabs.heading": "Tab 管理",
    "tabs.chat": "对话",
    "tabs.empty": "还没有插件注册会话标签。",
    "tabs.show": "在标签栏显示{label}",
    "tabs.hide": "从标签栏隐藏{label}",
    // The settings page for skill/slash aliases, and the menu group those
    // aliases contribute to the shipped slash popup.
    "alias.nav": "技能别名",
    "alias.heading": "技能别名",
    "alias.prefix.title": "需要斜杠前缀",
    "alias.prefix.on": "打开则需要输入 “/” 进行匹配",
    "alias.prefix.off": "打开则无需输入 “/” 进行匹配",
    "alias.table.keyword": "关键词",
    "alias.table.target": "技能或命令",
    "alias.table.params": "参数",
    "alias.table.paramsPlaceholder": "可选，如 run",
    "alias.table.actions": "操作",
    "alias.add": "添加别名",
    "alias.remove": "删除别名 {keyword}",
    "alias.unnamed": "（未命名）",
    "alias.empty": "还没有别名。例如：wf → /flow-workflow run",
    "alias.footnote": "输入关键词后从面板选择即可插入完整调用；改完立即生效。",
    "alias.menu.section": "技能别名",
    "alias.menu.params": "参数：{value}",
    // The skill hover panel. Every label names a block the panel may omit, so a
    // skill without metadata or without a path shows no empty heading.
    "skill.metadata": "元数据",
    "skill.path": "地址",
    "skill.usage.session": "本会话调用",
    "skill.usage.workspace": "本工作区调用",
    "skill.params": "参数",
    "skill.hint.insert": "点击插入",
    // The continue offer under a stopped turn. `sending` is the pressed state,
    // so the button never looks inert while the message is in flight.
    "continue.label": "继续",
    "continue.sending": "继续中…",
    // The link address panel. The button's own label doubles as its accessible
    // name, so a copy that fails is announced rather than silent.
    "link.copy": "复制",
    "link.copied": "已复制",
    "link.copyFailed": "复制失败",
    "link.copyAria": "复制链接地址",
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
    "attach.pasteBusy": "A message is being sent; paste again in a moment",
    "compaction.reading": "{count} compactions",
    "compaction.readingOne": "1 compaction",
    "compaction.tooltip": "This session's context was compressed {count} time(s)",
    "compaction.tooltipWithFailures": "This session's context was compressed {count} time(s), with {failures} failed attempt(s)",
    "tabs.nav": "Tabs",
    "tabs.heading": "Tabs",
    "tabs.chat": "Chat",
    "tabs.empty": "No plugin has registered a conversation tab yet.",
    "tabs.show": "Show {label} in the tab bar",
    "tabs.hide": "Hide {label} from the tab bar",
    "alias.nav": "Skill aliases",
    "alias.heading": "Skill aliases",
    "alias.prefix.title": "Require a slash prefix",
    "alias.prefix.on": "To open, type “/” to match",
    "alias.prefix.off": "To open, type the keyword without “/” to match",
    "alias.table.keyword": "Keyword",
    "alias.table.target": "Skill or command",
    "alias.table.params": "Arguments",
    "alias.table.paramsPlaceholder": "Optional, e.g. run",
    "alias.table.actions": "Actions",
    "alias.add": "Add alias",
    "alias.remove": "Delete alias {keyword}",
    "alias.unnamed": "(unnamed)",
    "alias.empty": "No aliases yet. For example: wf → /flow-workflow run",
    "alias.footnote": "Type a keyword and pick from the panel to insert the full invocation; changes apply immediately.",
    "alias.menu.section": "Skill aliases",
    "alias.menu.params": "args: {value}",
    "skill.metadata": "Metadata",
    "skill.path": "Path",
    "skill.usage.session": "This session",
    "skill.usage.workspace": "This workspace",
    "skill.params": "Arguments",
    "skill.hint.insert": "Click to insert",
    "continue.label": "Continue",
    "continue.sending": "Continuing…",
    "link.copy": "Copy",
    "link.copied": "Copied",
    "link.copyFailed": "Copy failed",
    "link.copyAria": "Copy link address",
  },
});
