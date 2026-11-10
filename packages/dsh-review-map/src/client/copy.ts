/**
 * The client half's strings, keyed by locale.
 *
 * Only chrome lives here. The review map will render change data, and data is
 * never translated; these four keys are the tab label and the sentence that
 * stands in for a map nobody has loaded yet.
 *
 * Both dictionaries must carry the same key set: a key present in one and
 * missing from the other renders as a blank label on that language, which no
 * type check catches. `test/entry-wiring.test.ts` asserts the two sets match.
 */
export const ZH: Record<string, string> = {
  "review-map.tabTitle": "评审",
  "review-map.empty": "选择会话后加载变更",
  "review-map.emptyHint": "评审视图会在这里按变更范围铺开。",
  "review-map.loading": "加载中",
};

export const EN: Record<string, string> = {
  "review-map.tabTitle": "Review",
  "review-map.empty": "Select a session to load its changes",
  "review-map.emptyHint": "The review map will lay the change set out here.",
  "review-map.loading": "Loading",
};
