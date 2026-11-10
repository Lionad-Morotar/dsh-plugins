/**
 * 插入落点的判定与执行。
 *
 * 三种落点：input/textarea 改 value 并派 input 事件，contenteditable 走
 * execCommand("insertText")，其余什么都不插。这里用最小替身而不是 jsdom：
 * 判定只读 tagName / type / isContentEditable，执行只调 value 与 execCommand。
 */
import { describe, expect, it, vi } from "vitest";

import { insertInto, resolveInsertTarget } from "../src/insert.ts";

function inputLike(tagName: string, type?: string) {
  return {
    tagName,
    type,
    isContentEditable: false,
    value: "",
    dispatchEvent: vi.fn(),
  };
}

function editableLike() {
  return {
    tagName: "DIV",
    isContentEditable: true,
    value: undefined,
    dispatchEvent: vi.fn(),
  };
}

describe("resolveInsertTarget", () => {
  it("input 认成 value 落点", () => {
    expect(resolveInsertTarget(inputLike("INPUT", "text"))).toBe("value");
  });

  it("textarea 认成 value 落点", () => {
    expect(resolveInsertTarget(inputLike("TEXTAREA"))).toBe("value");
  });

  it("contenteditable 认成 editable 落点", () => {
    expect(resolveInsertTarget(editableLike())).toBe("editable");
  });

  it("普通元素没有落点", () => {
    expect(resolveInsertTarget(inputLike("DIV"))).toBe("none");
  });

  it("null 没有落点", () => {
    expect(resolveInsertTarget(null)).toBe("none");
  });
});

describe("insertInto", () => {
  it("input 上追加文本并派 input 事件", () => {
    const element = inputLike("INPUT", "text");
    element.value = "前缀";
    const dispatchInput = vi.fn();

    expect(insertInto(element, "/save ", { dispatchInput })).toBe(true);
    expect(element.value).toBe("前缀/save ");
    expect(dispatchInput).toHaveBeenCalledTimes(1);
  });

  it("textarea 上同样追加", () => {
    const element = inputLike("TEXTAREA");

    expect(insertInto(element, "abc", { dispatchInput: () => {} })).toBe(true);
    expect(element.value).toBe("abc");
  });

  it("contenteditable 走 execCommand insertText", () => {
    const element = editableLike();
    const execCommand = vi.fn(() => true);

    expect(insertInto(element, "/save ", { execCommand })).toBe(true);
    expect(execCommand).toHaveBeenCalledWith("insertText", false, "/save ");
  });

  it("没有落点时什么都不做", () => {
    const execCommand = vi.fn();

    expect(insertInto(inputLike("DIV"), "abc", { execCommand })).toBe(false);
    expect(execCommand).not.toHaveBeenCalled();
  });
});
