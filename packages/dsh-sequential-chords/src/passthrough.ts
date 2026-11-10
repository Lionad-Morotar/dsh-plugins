/**
 * 设置页里的按键放行判定。
 *
 * 捕获监听挂在 window 上，先于页面里任何元素拿到 keydown。设置页的录制按钮要
 * 自己收按键，所以落在设置页里的击键必须整条放行：不进判定，也不 preventDefault。
 *
 * 判定放在这里而不是 entry.ts 里，是因为它是这条修复的全部逻辑，值得单测；
 * entry.ts 只负责问一句然后照做。
 */

/** 设置页容器的 data-testid，与 page.ts 里那个容器一致。 */
export const PAGE_TESTID = "sequential-chords-page";

/** 只用到 closest，所以测试不必造真的 DOM 节点。 */
export interface ClosestLike {
  closest(selector: string): unknown;
}

/**
 * 这一击该不该整条放行。
 * @param target - 事件落点，通常是 event.target。
 * @returns 落在设置页里时为 true。
 */
export function shouldPassThrough(target: ClosestLike | null): boolean {
  if (target === null) {
    return false;
  }
  return Boolean(target.closest(`[data-testid="${PAGE_TESTID}"]`));
}
