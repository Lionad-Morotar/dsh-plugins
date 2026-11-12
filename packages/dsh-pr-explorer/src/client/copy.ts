/**
 * The client half's strings, keyed by locale.
 *
 * Only chrome lives here. The PR view renders a range comparison, and that data
 * is never translated; these keys are the labels, the two tab names, the reading
 * words, the seven status words and one sentence per error code.
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
  "pr-explorer.tabTitle": "PR",

  // Header
  "pr-explorer.repoFallback": "未知仓库",
  "pr-explorer.baseLabel": "base",
  "pr-explorer.headLabel": "head",
  "pr-explorer.swap": "交换",
  "pr-explorer.refresh": "重新读取",

  // Tabs
  "pr-explorer.tabCommits": "提交",
  "pr-explorer.tabFiles": "文件",

  // Summary
  "pr-explorer.ahead": "领先 {count}",
  "pr-explorer.behind": "落后 {count}",
  "pr-explorer.filesCount": "{count} 文件",
  "pr-explorer.commitsTruncated": "提交列表已截断",

  // Churn labels, shown in place of line counts
  "pr-explorer.markBinary": "二进制",
  "pr-explorer.markUnknown": "未知",

  // Status words, for the row's accessible name
  "pr-explorer.statusAdded": "新增",
  "pr-explorer.statusModified": "修改",
  "pr-explorer.statusDeleted": "删除",
  "pr-explorer.statusRenamed": "重命名",
  "pr-explorer.statusCopied": "复制",
  "pr-explorer.statusTypeChanged": "类型变更",
  "pr-explorer.statusUnknown": "未知",

  // States
  "pr-explorer.loading": "加载中",
  "pr-explorer.empty": "选择会话后加载对比",
  "pr-explorer.emptyHint": "PR 视图会在这里按区间铺开两个端点之间的改动。",
  "pr-explorer.noDifference": "两个 ref 之间没有差异",

  // Detail panel
  "pr-explorer.detailEmpty": "选择左侧一行查看详情",
  "pr-explorer.detailTruncated": "已截断",
  "pr-explorer.detailBinary": "二进制文件 {size}",
  "pr-explorer.detailUnknownSize": "未知大小",
  "pr-explorer.commitHash": "提交",
  "pr-explorer.commitAuthor": "作者",
  "pr-explorer.commitDate": "日期",
  "pr-explorer.commitSubject": "标题",
  "pr-explorer.commitRefs": "引用",
  "pr-explorer.commitFiles": "改动 {count} 个文件",
  "pr-explorer.commitRoot": "初始提交没有父提交，无法显示差异",
  "pr-explorer.commitEmpty": "这个提交没有改动",
  "pr-explorer.openInFiles": "在文件面板打开",
  "pr-explorer.openInGit": "在 Git 面板打开",

  // One sentence per error code
  "pr-explorer.errorNotARepo": "这个目录不是 git 仓库",
  "pr-explorer.errorInvalidRef": "该 ref 不存在",
  "pr-explorer.errorNoMergeBase": "两个 ref 没有共同祖先",
  "pr-explorer.errorNoSession": "会话没有工作区",
  "pr-explorer.errorTooLarge": "内容太大，无法完整读取",
  "pr-explorer.errorUnreadable": "读取失败",
  "pr-explorer.errorBadRequest": "无法读取该区间",
  "pr-explorer.errorUnknown": "读取对比时出错",
};

export const EN: Record<string, string> = {
  "pr-explorer.tabTitle": "PR",

  // Header
  "pr-explorer.repoFallback": "Unknown repository",
  "pr-explorer.baseLabel": "base",
  "pr-explorer.headLabel": "head",
  "pr-explorer.swap": "Swap",
  "pr-explorer.refresh": "Refresh",

  // Tabs
  "pr-explorer.tabCommits": "Commits",
  "pr-explorer.tabFiles": "Files",

  // Summary
  "pr-explorer.ahead": "{count} ahead",
  "pr-explorer.behind": "{count} behind",
  "pr-explorer.filesCount": "{count} files",
  "pr-explorer.commitsTruncated": "The commit list was truncated",

  // Churn labels, shown in place of line counts
  "pr-explorer.markBinary": "binary",
  "pr-explorer.markUnknown": "unknown",

  // Status words, for the row's accessible name
  "pr-explorer.statusAdded": "added",
  "pr-explorer.statusModified": "modified",
  "pr-explorer.statusDeleted": "deleted",
  "pr-explorer.statusRenamed": "renamed",
  "pr-explorer.statusCopied": "copied",
  "pr-explorer.statusTypeChanged": "type changed",
  "pr-explorer.statusUnknown": "unknown",

  // States
  "pr-explorer.loading": "Loading",
  "pr-explorer.empty": "Select a session to load the comparison",
  "pr-explorer.emptyHint": "The PR view will lay the changes between the two ends out here.",
  "pr-explorer.noDifference": "These two refs have no difference",

  // Detail panel
  "pr-explorer.detailEmpty": "Pick a row on the left to see its detail",
  "pr-explorer.detailTruncated": "Truncated",
  "pr-explorer.detailBinary": "Binary file, {size}",
  "pr-explorer.detailUnknownSize": "size unknown",
  "pr-explorer.commitHash": "Commit",
  "pr-explorer.commitAuthor": "Author",
  "pr-explorer.commitDate": "Date",
  "pr-explorer.commitSubject": "Subject",
  "pr-explorer.commitRefs": "Refs",
  "pr-explorer.commitFiles": "{count} changed files",
  "pr-explorer.commitRoot": "This is the root commit; there is no parent to diff against",
  "pr-explorer.commitEmpty": "This commit changed no files",
  "pr-explorer.openInFiles": "Open in the file panel",
  "pr-explorer.openInGit": "Open in the Git panel",

  // One sentence per error code
  "pr-explorer.errorNotARepo": "This directory is not a git repository",
  "pr-explorer.errorInvalidRef": "That ref does not exist",
  "pr-explorer.errorNoMergeBase": "These two refs share no commit",
  "pr-explorer.errorNoSession": "This session has no workspace",
  "pr-explorer.errorTooLarge": "The content is too large to read in full",
  "pr-explorer.errorUnreadable": "The read failed",
  "pr-explorer.errorBadRequest": "That range cannot be read",
  "pr-explorer.errorUnknown": "Something went wrong reading the comparison",
};
