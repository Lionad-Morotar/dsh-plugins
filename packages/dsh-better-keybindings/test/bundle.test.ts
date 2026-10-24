/**
 * lib/client.js 的交付形状：ModuleLoader 包装与插件对象字段。lib 是提交在
 * 仓里的构建产物，测试直接读文件断言文本标记，不执行浏览器代码。
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const here = dirname(fileURLToPath(import.meta.url));
const bundle = readFileSync(join(here, "..", "lib", "client.js"), "utf8");
const quote = String.fromCharCode(34);

describe("client bundle", () => {
  it("keeps the ModuleLoader wrapper keyed on the package name", () => {
    expect(bundle).toContain("window.__ModuleLoader__.load");
    expect(bundle).toContain(quote + "dsh-better-keybindings" + quote);
  });

  it("ships the plugin object shape the loader mounts", () => {
    expect(bundle).toContain("factory");
    expect(bundle).toContain("apply");
  });

  it("still carries the two browser primitives the fix depends on", () => {
    // preventDefault is what stops the conversation from scrolling, and
    // Selection.modify is what keeps per-line Home/End correct inside the
    // Lexical tree; a tree-shaken or rewritten build would lose one silently.
    expect(bundle).toContain("preventDefault");
    expect(bundle).toContain("modify");
  });

  it("never ships the host-half import path", () => {
    expect(bundle).not.toContain("node:");
  });
});
