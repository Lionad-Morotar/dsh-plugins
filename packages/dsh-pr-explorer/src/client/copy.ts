/**
 * The client half's strings, keyed by locale.
 *
 * Only chrome lives here. The PR view will render a range comparison, and that
 * data is never translated; these keys are the tab label and the sentence that
 * stands in for a comparison nobody has loaded yet.
 *
 * Both dictionaries must carry the same key set: a key present in one and
 * missing from the other renders as a blank label on that language, which no
 * type check catches. `test/entry-wiring.test.ts` asserts the two sets match.
 */
export const ZH: Record<string, string> = {
  "pr-explorer.tabTitle": "PR",
  "pr-explorer.empty": "选择 base 与 head 后加载 x...y 对比",
  "pr-explorer.emptyHint": "PR 视图会在这里按区间铺开两个端点之间的改动。",
  "pr-explorer.loading": "加载中",
};

export const EN: Record<string, string> = {
  "pr-explorer.tabTitle": "PR",
  "pr-explorer.empty": "Pick a base and a head to load the x...y comparison",
  "pr-explorer.emptyHint": "The PR view will lay the changes between the two ends out here.",
  "pr-explorer.loading": "Loading",
};
