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
  "testboard.filterAll": "全部",
  "testboard.filterFailed": "失败",
  "testboard.searchPlaceholder": "搜索文件名",
  "testboard.sortFailFirst": "失败优先",
  "testboard.sortSlowFirst": "耗时优先",
  "testboard.peak": "peak",
  "testboard.perSecond": "/s",
  "testboard.empty": "没有匹配的测试文件。",
  "testboard.cases": "用例",
  "testboard.detailHint": "点击行展开用例",
};

export const EN: Record<string, string> = {
  "testboard.tabTitle": "Tests",
  "testboard.subtitle": "dsh-plugins · pnpm test",
  "testboard.ago": "2m ago",
  "testboard.passed": "passed",
  "testboard.failed": "failed",
  "testboard.filterAll": "All",
  "testboard.filterFailed": "Failed",
  "testboard.searchPlaceholder": "Search file name",
  "testboard.sortFailFirst": "Failures first",
  "testboard.sortSlowFirst": "Slowest first",
  "testboard.peak": "peak",
  "testboard.perSecond": "/s",
  "testboard.empty": "No test file matches.",
  "testboard.cases": "cases",
  "testboard.detailHint": "Click a row to expand its cases",
};
