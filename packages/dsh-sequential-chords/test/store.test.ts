/**
 * 存储文档的读写契约。
 *
 * 存储里的每条序列比 engine 的 Sequence 多一个 insert，所以解析不能复用
 * listen.ts 的 parseDocument（它按 Sequence 校验，会把 insert 丢掉）。这里
 * 自己校验形状，非法文档一律当空数组。
 */
import { describe, expect, it } from "vitest";

import { STORAGE_KEY } from "../src/listen.ts";
import {
  parseStoredDocument,
  readSequences,
  writeSequences,
  type StorageLike,
  type StoredSequence,
} from "../src/store.ts";

function memoryStorage(seed?: string): StorageLike & { raw(): string | null } {
  let value: string | null = seed ?? null;
  return {
    getItem: (key) => (key === STORAGE_KEY ? value : null),
    setItem: (key, next) => {
      if (key === STORAGE_KEY) value = next;
    },
    raw: () => value,
  };
}

const saveAll: StoredSequence = {
  id: "save-all",
  first: { code: "KeyK", modifiers: ["control"] },
  second: { code: "KeyS", modifiers: ["control"] },
  insert: "/save ",
};

const closeAll: StoredSequence = {
  id: "close-all",
  first: { code: "KeyW", modifiers: ["control"] },
  second: { code: "KeyQ", modifiers: ["control"] },
  insert: "/close ",
};

describe("存储读写往返", () => {
  it("写进去再读出来是同一份", () => {
    const storage = memoryStorage();
    writeSequences(storage, [saveAll, closeAll]);

    expect(readSequences(storage)).toEqual([saveAll, closeAll]);
  });

  it("insert 字段在往返里保留下来", () => {
    const storage = memoryStorage();
    writeSequences(storage, [saveAll]);

    expect(readSequences(storage)[0]?.insert).toBe("/save ");
  });

  it("写出的文档带 version 1", () => {
    const storage = memoryStorage();
    writeSequences(storage, [saveAll]);

    expect(JSON.parse(storage.raw() ?? "{}")).toMatchObject({ version: 1 });
  });

  it("空存储读出来是空数组", () => {
    expect(readSequences(memoryStorage())).toEqual([]);
  });
});

describe("非法文档", () => {
  it("坏 JSON 读出来是空数组", () => {
    expect(parseStoredDocument("{")).toEqual([]);
  });

  it("null 读出来是空数组", () => {
    expect(parseStoredDocument(null)).toEqual([]);
  });

  it("版本不是 1 读出来是空数组", () => {
    expect(parseStoredDocument(JSON.stringify({ version: 2, sequences: [saveAll] }))).toEqual([]);
  });

  it("缺 insert 的条目读出来是空数组", () => {
    const broken = {
      version: 1,
      sequences: [{ id: "x", first: saveAll.first, second: saveAll.second }],
    };

    expect(parseStoredDocument(JSON.stringify(broken))).toEqual([]);
  });

  it("两段都相同的文档读出来是空数组", () => {
    const dup = { ...saveAll, id: "dup" };

    expect(parseStoredDocument(JSON.stringify({ version: 1, sequences: [saveAll, dup] }))).toEqual(
      [],
    );
  });

  it("第二段只有 shift 的文档读出来是空数组", () => {
    const bad = { ...saveAll, second: { code: "KeyS", modifiers: ["shift"] } };

    expect(parseStoredDocument(JSON.stringify({ version: 1, sequences: [bad] }))).toEqual([]);
  });
});
