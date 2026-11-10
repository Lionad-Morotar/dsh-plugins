/**
 * 设置页内的按键放行判定。
 *
 * 捕获监听挂在 window 上，先于页面里任何元素拿到 keydown。设置页的录制按钮要
 * 自己收按键，所以落在设置页里的击键必须整条放行：不进判定，也不 preventDefault。
 * 判定放在这里，entry.ts 只负责问一句。
 */
import { describe, expect, it } from "vitest";

import { PAGE_TESTID, shouldPassThrough } from "../src/passthrough.ts";

/** 只实现 closest，返回给定的命中结果。 */
function target(closestResult: unknown): { closest(selector: string): unknown } {
  return { closest: () => closestResult };
}

describe("shouldPassThrough", () => {
  it("落在设置页里时放行", () => {
    expect(shouldPassThrough(target({}))).toBe(true);
  });

  it("不在设置页里时不放行", () => {
    expect(shouldPassThrough(target(null))).toBe(false);
  });

  it("目标为 null 时不放行", () => {
    expect(shouldPassThrough(null)).toBe(false);
  });

  it("按设置页容器的 data-testid 找祖先", () => {
    const seen: string[] = [];
    const node = {
      closest(selector: string) {
        seen.push(selector);
        return null;
      },
    };

    shouldPassThrough(node);

    expect(seen).toEqual([`[data-testid="${PAGE_TESTID}"]`]);
  });

  it("页面容器的 testid 与 page.ts 用的一致", () => {
    expect(PAGE_TESTID).toBe("sequential-chords-page");
  });
});
