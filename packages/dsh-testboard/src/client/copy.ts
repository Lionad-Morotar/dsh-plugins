/**
 * The client half's strings, keyed by locale.
 *
 * Only chrome lives here. Everything inside a row, a card or the sparkline is
 * data from the snapshot; the few labels that wrap numbers are here so the
 * board reads as Chinese or English without a second layout.
 */
export const ZH: Record<string, string> = {
  "testboard.tabTitle": "测试",
  "testboard.subtitle": "dsh-plugins · pnpm test",
  "testboard.ago": "2m ago",
  "testboard.passed": "passed",
  "testboard.failed": "failed",
  "testboard.took": "耗时",
  "testboard.filterAll": "全部",
  "testboard.filterFailed": "失败",
  "testboard.searchPlaceholder": "搜索文件名",
  "testboard.sortFailFirst": "失败优先",
  "testboard.sortSlowFirst": "耗时优先",
  "testboard.peak": "peak",
  "testboard.perSecond": "/s",
  "testboard.empty": "没有匹配的测试文件。",
  "testboard.cases": "用例",
  "testboard.detailEmpty": "选择左侧测试文件查看代码与详情",
  "testboard.line": "行",
  "testboard.sourceMissing": "该文件的源码不在快照里。",
  "testboard.paneResize": "调整用例列表宽度",
  "testboard.paneResizeHint": "左右方向键调整，Home/End 到两端，双击恢复默认",
  "testboard.listLabel": "测试文件与用例",
};

export const EN: Record<string, string> = {
  "testboard.tabTitle": "Tests",
  "testboard.subtitle": "dsh-plugins · pnpm test",
  "testboard.ago": "2m ago",
  "testboard.passed": "passed",
  "testboard.failed": "failed",
  "testboard.took": "took",
  "testboard.filterAll": "All",
  "testboard.filterFailed": "Failed",
  "testboard.searchPlaceholder": "Search file name",
  "testboard.sortFailFirst": "Failures first",
  "testboard.sortSlowFirst": "Slowest first",
  "testboard.peak": "peak",
  "testboard.perSecond": "/s",
  "testboard.empty": "No test file matches.",
  "testboard.cases": "cases",
  "testboard.detailEmpty": "Pick a test file on the left to see its code and detail",
  "testboard.line": "line",
  "testboard.sourceMissing": "This file's source is not in the snapshot.",
  "testboard.paneResize": "Resize the case list",
  "testboard.paneResizeHint": "Arrow keys to resize, Home/End for the bounds, double-click to reset",
  "testboard.listLabel": "Test files and cases",
};
