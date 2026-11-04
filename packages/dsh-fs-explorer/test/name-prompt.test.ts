/**
 * The name card's rules, decided without React.
 *
 * The validation is the part that has to be right before anything touches the
 * filesystem: a name that reaches the host and comes back as `invalid-name` is a
 * round trip the reader waited for, and a name that slips through can escape the
 * directory it was typed in. The four refusals here are the four ways that
 * happens.
 */
import { describe, expect, it } from "vitest";

import { defaultEntryName, validateEntryName } from "../src/client/name-prompt.tsx";

describe("validateEntryName", () => {
  it("accepts an ordinary name and hands back the trimmed form", () => {
    expect(validateEntryName("notes.md", "file")).toEqual({ ok: true, name: "notes.md" });
    expect(validateEntryName("  笔记.md  ", "file")).toEqual({ ok: true, name: "笔记.md" });
  });

  it("accepts a name with dots inside it", () => {
    expect(validateEntryName("a.b.c.txt", "file")).toEqual({ ok: true, name: "a.b.c.txt" });
  });

  it("refuses an empty or whitespace-only name", () => {
    expect(validateEntryName("", "file")).toEqual({ ok: false, reason: "empty" });
    expect(validateEntryName("   ", "directory")).toEqual({ ok: false, reason: "empty" });
  });

  it("refuses the two directory aliases", () => {
    expect(validateEntryName(".", "file")).toEqual({ ok: false, reason: "dot" });
    expect(validateEntryName("..", "directory")).toEqual({ ok: false, reason: "dot" });
    // Surrounding space is trimmed first, so these are the same refusal.
    expect(validateEntryName(" .. ", "file")).toEqual({ ok: false, reason: "dot" });
  });

  it("refuses a name carrying a path separator", () => {
    expect(validateEntryName("a/b", "file")).toEqual({ ok: false, reason: "separator" });
    expect(validateEntryName("a\\b", "file")).toEqual({ ok: false, reason: "separator" });
    expect(validateEntryName("a\u0000b", "file")).toEqual({ ok: false, reason: "separator" });
  });

  it("refuses a name past the length limit", () => {
    expect(validateEntryName("x".repeat(201), "file")).toEqual({ ok: false, reason: "too-long" });
    expect(validateEntryName("x".repeat(200), "file")).toEqual({ ok: true, name: "x".repeat(200) });
  });

  it("measures the trimmed name, not the typed one", () => {
    expect(validateEntryName(`  ${"x".repeat(200)}  `, "file")).toEqual({ ok: true, name: "x".repeat(200) });
  });

  it("leaves the extension to the reader", () => {
    // No name is appended and none is stripped: `Makefile` and `a.md` are both
    // exactly what the reader typed.
    expect(validateEntryName("Makefile", "file")).toEqual({ ok: true, name: "Makefile" });
  });
});

describe("defaultEntryName", () => {
  it("suggests a markdown file for a new file", () => {
    expect(defaultEntryName("file")).toBe("untitled.md");
  });

  it("suggests a folder name for a new folder", () => {
    expect(defaultEntryName("directory")).toBe("新建文件夹");
  });

  it("suggests a name its own validator accepts", () => {
    expect(validateEntryName(defaultEntryName("file"), "file").ok).toBe(true);
    expect(validateEntryName(defaultEntryName("directory"), "directory").ok).toBe(true);
  });
});
