/**
 * The client half's strings, keyed by locale.
 *
 * Only chrome lives here. The review map renders change data, and data is never
 * translated; these keys are the labels, the range names, the nine status words,
 * the three churn labels and one sentence per error code.
 *
 * Both dictionaries must carry the same key set: a key present in one and
 * missing from the other renders as a blank label on that language, which no
 * type check catches. `test/entry-wiring.test.ts` asserts the two sets match.
 *
 * Placeholders are `{name}` and are filled by `fill` in `model.ts`. A sentence
 * that needs a value keeps it in the template rather than concatenating in the
 * view, so a language that puts the value first can say so.
 */
export const ZH: Record<string, string> = {
  "review-map.tabTitle": "评审",

  // Header
  "review-map.repoFallback": "未知仓库",
  "review-map.scopeWorktree": "未提交",
  "review-map.scopeBranch": "分支对比",
  "review-map.refresh": "重新读取",

  // Stats
  "review-map.statLines": "源码行",
  "review-map.statFiles": "改动文件",
  "review-map.uncommitted": "未提交 {count}",

  // List
  "review-map.listMetaWorktree": "未提交改动",
  "review-map.listMetaBranch": "对比 {base}",
  "review-map.listSort": "按变更量排序",
  "review-map.listEmpty": "工作区没有变更",
  "review-map.renameHint": "原路径 {path}",

  // Churn labels, shown in place of line counts
  "review-map.markBinary": "二进制",
  "review-map.markUntracked": "未跟踪",
  "review-map.markConflicted": "冲突",

  // Status words, for the row's accessible name
  "review-map.statusAdded": "新增",
  "review-map.statusModified": "修改",
  "review-map.statusDeleted": "删除",
  "review-map.statusRenamed": "重命名",
  "review-map.statusCopied": "复制",
  "review-map.statusTypeChanged": "类型变更",
  "review-map.statusUntracked": "未跟踪",
  "review-map.statusConflicted": "冲突",
  "review-map.statusUnknown": "未知",

  // States
  "review-map.loading": "加载中",
  "review-map.empty": "选择会话后加载变更",
  "review-map.emptyHint": "评审视图会在这里按变更范围铺开。",

  // Detail panel
  "review-map.detailClose": "关闭详情",
  "review-map.detailTruncated": "已截断",
  "review-map.detailBinary": "二进制文件 {size}",
  "review-map.detailUnknownSize": "未知大小",
  "review-map.detailEmpty": "该文件没有可显示的差异",
  "review-map.detailErrorConflicted": "文件有未解决的冲突",
  "review-map.detailErrorTooLarge": "文件过大，已跳过",
  "review-map.detailErrorUnreadable": "读取失败",
  "review-map.detailErrorBadRequest": "无法读取该文件",
  "review-map.detailErrorUnknown": "读取该文件时出错",

  // One sentence per error code
  "review-map.errorNotARepo": "这个目录不是 git 仓库",
  "review-map.errorNoBase": "仓库没有可比基线",
  "review-map.errorNoSession": "会话没有工作区",
  "review-map.errorTooLarge": "变更太大，无法完整读取",
  "review-map.errorConflicted": "该文件处于冲突中",
  "review-map.errorUnreadable": "读取失败",
  "review-map.errorUnknown": "读取变更时出错",
};

export const EN: Record<string, string> = {
  "review-map.tabTitle": "Review",

  // Header
  "review-map.repoFallback": "Unknown repository",
  "review-map.scopeWorktree": "Uncommitted",
  "review-map.scopeBranch": "Branch",
  "review-map.refresh": "Refresh",

  // Stats
  "review-map.statLines": "Source lines",
  "review-map.statFiles": "Files changed",
  "review-map.uncommitted": "{count} uncommitted",

  // List
  "review-map.listMetaWorktree": "Uncommitted changes",
  "review-map.listMetaBranch": "Against {base}",
  "review-map.listSort": "Sorted by churn",
  "review-map.listEmpty": "No changes in this workspace",
  "review-map.renameHint": "was {path}",

  // Churn labels, shown in place of line counts
  "review-map.markBinary": "binary",
  "review-map.markUntracked": "untracked",
  "review-map.markConflicted": "conflict",

  // Status words, for the row's accessible name
  "review-map.statusAdded": "added",
  "review-map.statusModified": "modified",
  "review-map.statusDeleted": "deleted",
  "review-map.statusRenamed": "renamed",
  "review-map.statusCopied": "copied",
  "review-map.statusTypeChanged": "type changed",
  "review-map.statusUntracked": "untracked",
  "review-map.statusConflicted": "conflicted",
  "review-map.statusUnknown": "unknown",

  // States
  "review-map.loading": "Loading",
  "review-map.empty": "Select a session to load its changes",
  "review-map.emptyHint": "The review map will lay the change set out here.",

  // Detail panel
  "review-map.detailClose": "Close the detail",
  "review-map.detailTruncated": "Truncated",
  "review-map.detailBinary": "Binary file, {size}",
  "review-map.detailUnknownSize": "size unknown",
  "review-map.detailEmpty": "This file has no diff to show",
  "review-map.detailErrorConflicted": "This file has an unresolved conflict",
  "review-map.detailErrorTooLarge": "This file is too large and was skipped",
  "review-map.detailErrorUnreadable": "The read failed",
  "review-map.detailErrorBadRequest": "This file cannot be read",
  "review-map.detailErrorUnknown": "Something went wrong reading this file",

  // One sentence per error code
  "review-map.errorNotARepo": "This directory is not a git repository",
  "review-map.errorNoBase": "This repository has no baseline to compare against",
  "review-map.errorNoSession": "This session has no workspace",
  "review-map.errorTooLarge": "The change is too large to read in full",
  "review-map.errorConflicted": "This file is in conflict",
  "review-map.errorUnreadable": "The read failed",
  "review-map.errorUnknown": "Something went wrong reading the changes",
};
