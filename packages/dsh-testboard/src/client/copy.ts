/**
 * The client half's strings, keyed by locale.
 *
 * Only the shell strings live here; everything a future slice renders inside
 * the board is data, not copy.
 */
export const ZH: Record<string, string> = {
  "testboard.tabTitle": "测试",
  "testboard.placeholderTitle": "测试看板",
  "testboard.placeholderHint": "测试清单与结果将在后续版本接入。",
};

export const EN: Record<string, string> = {
  "testboard.tabTitle": "Tests",
  "testboard.placeholderTitle": "Test board",
  "testboard.placeholderHint": "The test inventory and results land in a later slice.",
};
