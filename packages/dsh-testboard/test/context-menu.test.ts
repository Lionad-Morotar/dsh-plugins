/**
 * The menu's rows, decided without rendering.
 *
 * What matters is which rows exist, which are refused and why: a row that
 * disappears looks like a broken feature, while a disabled row says what is
 * missing.
 */
import { describe, expect, it } from "vitest";

import { buildTestboardMenu, menuCopyText, TESTBOARD_MENU_ACTION } from "../src/client/context-menu.ts";

const STRINGS = {
  reference: "引用",
  runFile: "运行此文件",
  copyPath: "复制路径",
  referenceNoSession: "当前没有可写入的会话",
  referenceNoComposer: "当前输入框不支持引用",
  referenceNoSource: "引用通道尚未就绪",
  runInFlight: "正在运行",
};

const FILE = { kind: "file", path: "packages/a/test/b.test.ts" } as const;
const CASE = { kind: "case", path: "packages/a/test/b.test.ts", index: 2, name: "works" } as const;

describe("buildTestboardMenu", () => {
  it("puts the reference row first and keeps every row available", () => {
    const entries = buildTestboardMenu({
      target: FILE,
      running: false,
      composer: { session: true, insertReference: true, source: true },
      strings: STRINGS,
    });
    expect(entries.map(entry => entry.id)).toEqual([
      TESTBOARD_MENU_ACTION.reference,
      TESTBOARD_MENU_ACTION.runFile,
      TESTBOARD_MENU_ACTION.copyPath,
    ]);
    expect(entries.every(entry => entry.disabled !== true)).toBe(true);
  });

  it("carries the reason the composer cannot take a reference", () => {
    const entries = buildTestboardMenu({
      target: FILE,
      running: false,
      composer: { session: true, insertReference: false, source: true },
      strings: STRINGS,
    });
    expect(entries[0]).toMatchObject({
      id: TESTBOARD_MENU_ACTION.reference,
      disabled: true,
      reason: STRINGS.referenceNoComposer,
    });
  });

  it("names a missing source separately from a missing composer", () => {
    const entries = buildTestboardMenu({
      target: FILE,
      running: false,
      composer: { session: true, insertReference: true, source: false },
      strings: STRINGS,
    });
    expect(entries[0]?.reason).toBe(STRINGS.referenceNoSource);
    expect(
      buildTestboardMenu({ target: FILE, running: false, composer: undefined, strings: STRINGS })[0]?.reason,
    ).toBe(STRINGS.referenceNoSession);
  });

  it("disables the run row while a run is in flight", () => {
    const entries = buildTestboardMenu({
      target: FILE,
      running: true,
      composer: { session: true, insertReference: true, source: true },
      strings: STRINGS,
    });
    expect(entries[1]).toMatchObject({
      id: TESTBOARD_MENU_ACTION.runFile,
      disabled: true,
      reason: STRINGS.runInFlight,
    });
  });

  it("copies a case's file and name, a file's path alone", () => {
    expect(menuCopyText(FILE)).toBe("packages/a/test/b.test.ts");
    expect(menuCopyText(CASE)).toBe("packages/a/test/b.test.ts · works");
  });
});
