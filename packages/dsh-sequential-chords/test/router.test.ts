/**
 * 捕获监听的可注入缝。
 *
 * 这里不开浏览器：handler 收一个按键与一个落点，回答要不要吃掉，命中时把
 * 该序列的 insert 交给注入的插入函数。真实 DOM 接线在 client 半，不在这层。
 */
import { describe, expect, it, vi } from "vitest";

import type { KeyEvent } from "../src/engine.ts";
import { createKeyHandler } from "../src/router.ts";
import type { StoredSequence } from "../src/store.ts";

const saveAll: StoredSequence = {
  id: "save-all",
  first: { code: "KeyK", modifiers: ["control"] },
  second: { code: "KeyS", modifiers: ["control"] },
  insert: "/save ",
};

function key(code: string, modifiers: KeyEvent["modifiers"] = []): KeyEvent {
  return { code, modifiers, repeat: false, composing: false };
}

/** 只实现 regionOf 需要的那个方法。 */
function target(closestResult: unknown): { closest(selector: string): unknown } {
  return { closest: () => closestResult };
}

const page = target(null);
const terminal = target({});

function handler(sequences: StoredSequence[] = [saveAll]) {
  const insert = vi.fn();
  let clock = 1000;
  const onKey = createKeyHandler({
    getSequences: () => sequences,
    nowMs: () => clock,
    insert,
  });
  return {
    onKey,
    insert,
    advance: (ms: number) => {
      clock += ms;
    },
  };
}

describe("页面上的命中", () => {
  it("第二段命中时吃掉该键并插入文本", () => {
    const { onKey, insert, advance } = handler();

    expect(onKey(key("KeyK", ["control"]), page)).toBe(true);
    advance(500);
    expect(onKey(key("KeyS", ["control"]), page)).toBe(true);

    expect(insert).toHaveBeenCalledTimes(1);
    expect(insert).toHaveBeenCalledWith("/save ");
  });

  it("第一击只进等待，不插入", () => {
    const { onKey, insert } = handler();

    expect(onKey(key("KeyK", ["control"]), page)).toBe(true);
    expect(insert).not.toHaveBeenCalled();
  });

  it("没命中也没等待时不吃键", () => {
    const { onKey, insert } = handler();

    expect(onKey(key("KeyZ", ["control"]), page)).toBe(false);
    expect(insert).not.toHaveBeenCalled();
  });
});

describe("终端区域", () => {
  it("终端里不吃键也不插入", () => {
    const { onKey, insert, advance } = handler();

    expect(onKey(key("KeyK", ["control"]), terminal)).toBe(false);
    advance(100);
    expect(onKey(key("KeyS", ["control"]), terminal)).toBe(false);

    expect(insert).not.toHaveBeenCalled();
  });

  it("终端里按过第一段之后，页面上仍能正常触发", () => {
    const { onKey, insert, advance } = handler();

    expect(onKey(key("KeyK", ["control"]), terminal)).toBe(false);
    advance(100);
    expect(onKey(key("KeyK", ["control"]), page)).toBe(true);
    advance(100);
    expect(onKey(key("KeyS", ["control"]), page)).toBe(true);

    expect(insert).toHaveBeenCalledWith("/save ");
  });

  it("等待中落进终端会清掉等待，之后的第二段不再触发", () => {
    const { onKey, insert, advance } = handler();

    expect(onKey(key("KeyK", ["control"]), page)).toBe(true);
    advance(100);
    expect(onKey(key("KeyS", ["control"]), terminal)).toBe(false);
    advance(100);
    expect(onKey(key("KeyS", ["control"]), page)).toBe(false);

    expect(insert).not.toHaveBeenCalled();
  });
});

describe("非法文档", () => {
  it("序列为空时什么都不做", () => {
    const { onKey, insert } = handler([]);

    expect(onKey(key("KeyK", ["control"]), page)).toBe(false);
    expect(insert).not.toHaveBeenCalled();
  });
});
