/**
 * 插入落点的判定与执行。
 *
 * 三种落点：input/textarea 改 value 并派 input 事件，contenteditable 走
 * execCommand("insertText")，其余什么都不插。这里用最小替身而不是 jsdom：
 * 判定只读 tagName / type / isContentEditable，执行读 value、selectionStart /
 * selectionEnd 与 execCommand。
 *
 * 插入落在光标处而不是末尾：光标在中间时拼到末尾等于把文本扔到用户没看的地方，
 * 有选区时更该替换掉选区。没有 selectionStart / selectionEnd 的元素（替身、
 * 老宿主）才退回拼到末尾。
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

/** 带选区的 input / textarea 替身。 */
function selectableLike(tagName: string, value: string, start: number, end: number) {
  return {
    tagName,
    type: undefined,
    isContentEditable: false,
    value,
    selectionStart: start,
    selectionEnd: end,
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

describe("insertInto 在光标处插入", () => {
  it("光标在中间时插在光标处，不拼到末尾", () => {
    const element = selectableLike("INPUT", "abcd", 2, 2);

    expect(insertInto(element, "XY", { dispatchInput: () => {} })).toBe(true);
    expect(element.value).toBe("abXYcd");
  });

  it("插入后光标落在插入文本之后", () => {
    const element = selectableLike("INPUT", "abcd", 2, 2);

    insertInto(element, "XY", { dispatchInput: () => {} });

    expect(element.selectionStart).toBe(4);
    expect(element.selectionEnd).toBe(4);
  });

  it("有选区时替换选区", () => {
    const element = selectableLike("INPUT", "abcdef", 1, 4);

    expect(insertInto(element, "Z", { dispatchInput: () => {} })).toBe(true);
    expect(element.value).toBe("aZef");
  });

  it("替换选区后光标落在插入文本之后", () => {
    const element = selectableLike("INPUT", "abcdef", 1, 4);

    insertInto(element, "Z", { dispatchInput: () => {} });

    expect(element.selectionStart).toBe(2);
    expect(element.selectionEnd).toBe(2);
  });

  it("textarea 上同样落在光标处", () => {
    const element = selectableLike("TEXTAREA", "ab", 1, 1);

    expect(insertInto(element, "X", { dispatchInput: () => {} })).toBe(true);
    expect(element.value).toBe("aXb");
  });

  it("光标在末尾时与追加等价", () => {
    const element = selectableLike("INPUT", "前缀", 2, 2);

    insertInto(element, "/save ", { dispatchInput: () => {} });

    expect(element.value).toBe("前缀/save ");
  });

  it("插入后派 input 事件", () => {
    const element = selectableLike("INPUT", "ab", 1, 1);
    const dispatchInput = vi.fn();

    insertInto(element, "X", { dispatchInput });

    expect(dispatchInput).toHaveBeenCalledTimes(1);
  });

  it("没有 selectionStart 与 selectionEnd 时退回拼到末尾", () => {
    const element = inputLike("INPUT", "text");
    element.value = "前缀";
    const dispatchInput = vi.fn();

    expect(insertInto(element, "/save ", { dispatchInput })).toBe(true);
    expect(element.value).toBe("前缀/save ");
    expect(dispatchInput).toHaveBeenCalledTimes(1);
  });

  it("textarea 上没有选区字段时同样拼到末尾", () => {
    const element = inputLike("TEXTAREA");

    expect(insertInto(element, "abc", { dispatchInput: () => {} })).toBe(true);
    expect(element.value).toBe("abc");
  });

  it("选区字段越界时夹进 value 长度", () => {
    const element = selectableLike("INPUT", "ab", 99, 99);

    insertInto(element, "X", { dispatchInput: () => {} });

    expect(element.value).toBe("abX");
  });
});

describe("insertInto 的 contenteditable 分支", () => {
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
