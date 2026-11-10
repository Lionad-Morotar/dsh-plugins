/**
 * 设置页的纯逻辑：录入、校验、增删。
 *
 * 组件本身不在这里测（它要 React，而这一片不装渲染器），测的是组件会调用的
 * 那个 store：录两段按键、拒绝裸键、lint 不过不写入、删除按 id 生效。
 */
import { describe, expect, it } from "vitest";

import type { KeyEvent } from "../src/engine.ts";
import { createSequenceStore, describeChord } from "../src/settings.ts";
import type { StorageLike } from "../src/store.ts";

function memoryStorage(): StorageLike {
  const map = new Map<string, string>();
  return {
    getItem: (key) => map.get(key) ?? null,
    setItem: (key, value) => {
      map.set(key, value);
    },
  };
}

function key(code: string, modifiers: KeyEvent["modifiers"] = []): KeyEvent {
  return { code, modifiers, repeat: false, composing: false };
}

describe("录入两段按键", () => {
  it("第一段接受带 control 的单键", () => {
    const store = createSequenceStore(memoryStorage());

    expect(store.captureFirst(key("KeyK", ["control"]))).toBe(true);
    expect(store.getDraft().first).toEqual({ code: "KeyK", modifiers: ["control"] });
  });

  it("第一段拒绝裸键", () => {
    const store = createSequenceStore(memoryStorage());

    expect(store.captureFirst(key("KeyK"))).toBe(false);
    expect(store.getDraft().first).toBeUndefined();
  });

  it("第一段拒绝只有 shift 的键", () => {
    const store = createSequenceStore(memoryStorage());

    expect(store.captureFirst(key("KeyK", ["shift"]))).toBe(false);
  });

  it("第二段拒绝裸键", () => {
    const store = createSequenceStore(memoryStorage());
    store.captureFirst(key("KeyK", ["control"]));

    expect(store.captureSecond(key("KeyS"))).toBe(false);
    expect(store.getDraft().second).toBeUndefined();
  });

  it("两段都录好之后可以添加", () => {
    const store = createSequenceStore(memoryStorage());
    store.captureFirst(key("KeyK", ["control"]));
    store.captureSecond(key("KeyS", ["control"]));
    store.setInsert("/save ");

    expect(store.add()).toBe(true);
    expect(store.list()).toHaveLength(1);
    expect(store.list()[0]?.insert).toBe("/save ");
  });

  it("缺 insert 时不写入", () => {
    const store = createSequenceStore(memoryStorage());
    store.captureFirst(key("KeyK", ["control"]));
    store.captureSecond(key("KeyS", ["control"]));

    expect(store.add()).toBe(false);
    expect(store.list()).toHaveLength(0);
  });

  it("第一段重复时不写入", () => {
    const store = createSequenceStore(memoryStorage());
    store.captureFirst(key("KeyK", ["control"]));
    store.captureSecond(key("KeyS", ["control"]));
    store.setInsert("/save ");
    expect(store.add()).toBe(true);

    store.captureFirst(key("KeyK", ["control"]));
    store.captureSecond(key("KeyJ", ["control"]));
    store.setInsert("/other ");

    expect(store.add()).toBe(false);
    expect(store.list()).toHaveLength(1);
  });

  it("添加之后草稿清空", () => {
    const store = createSequenceStore(memoryStorage());
    store.captureFirst(key("KeyK", ["control"]));
    store.captureSecond(key("KeyS", ["control"]));
    store.setInsert("/save ");
    store.add();

    expect(store.getDraft()).toEqual({});
  });
});

describe("删除", () => {
  it("按 id 删除一条", () => {
    const store = createSequenceStore(memoryStorage());
    store.captureFirst(key("KeyK", ["control"]));
    store.captureSecond(key("KeyS", ["control"]));
    store.setInsert("/save ");
    store.add();
    const id = store.list()[0]?.id ?? "";

    store.remove(id);

    expect(store.list()).toHaveLength(0);
  });

  it("删除会写回存储", () => {
    const storage = memoryStorage();
    const store = createSequenceStore(storage);
    store.captureFirst(key("KeyK", ["control"]));
    store.captureSecond(key("KeyS", ["control"]));
    store.setInsert("/save ");
    store.add();
    const id = store.list()[0]?.id ?? "";

    store.remove(id);

    const reopened = createSequenceStore(storage);
    expect(reopened.list()).toHaveLength(0);
  });

  it("添加会写回存储", () => {
    const storage = memoryStorage();
    const store = createSequenceStore(storage);
    store.captureFirst(key("KeyK", ["control"]));
    store.captureSecond(key("KeyS", ["control"]));
    store.setInsert("/save ");
    store.add();

    const reopened = createSequenceStore(storage);
    expect(reopened.list()).toHaveLength(1);
  });
});

describe("describeChord", () => {
  it("把修饰键与 code 排成可读文本", () => {
    expect(describeChord({ code: "KeyK", modifiers: ["control"] })).toBe("Ctrl+K");
  });

  it("多个修饰键按固定顺序排列", () => {
    expect(describeChord({ code: "KeyK", modifiers: ["shift", "control"] })).toBe("Ctrl+Shift+K");
  });
});
