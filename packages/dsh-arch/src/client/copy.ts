/**
 * The client half's strings, keyed by locale.
 *
 * Only the chrome's shell strings live here; everything inside a diagram is
 * model data from the wire payload.
 */
export const ZH: Record<string, string> = {
  "arch.tabTitle": "\u67b6\u6784",
  "arch.waitingSession": "等待会话…",
  "arch.empty": "本工作区还没有 C4 模型。用 flow-dx 的 agents-md 流程生成 .planning/c4 模型后，即可在此浏览架构图。",
  "arch.loadFailed": "架构数据加载失败",
  "arch.retry": "重试",
  "arch.errorsTitle": "模型诊断",
};

export const EN: Record<string, string> = {
  "arch.tabTitle": "Arch",
  "arch.waitingSession": "Waiting for a session…",
  "arch.empty":
    "This workspace has no C4 model yet. Generate .planning/c4 with the flow-dx agents-md flow, then browse the diagrams here.",
  "arch.loadFailed": "Failed to load architecture data",
  "arch.retry": "Retry",
  "arch.errorsTitle": "Model diagnostics",
};

/** Locale namespace owned by the client half. */
export const LOCALE_NAMESPACE = "dsh-arch";
