import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

import { badgeFor, iconFor } from "dsh-fs-explorer/src/client/model.ts";
import { copyFor } from "../src/client/copy.ts";
import { entryDirectory, fileMarkOf, isWorkspaceRow } from "../src/client/entry-mark.ts";
import { fileRows, filesystemRows, workspaceRows } from "../src/client/rows.ts";
import { sessionList, workspaceSnapshot } from "./fixtures.ts";

const copy = copyFor("zh");

describe("file rows borrow the file tree's mark", () => {
  it("names a file the way the tree's badge does", () => {
    const row = fileRows({ cwd: "/repo", candidates: [{ path: "packages/dsh-command-panel/package.json", kind: "file" }] }, copy)[0]!;
    expect(fileMarkOf(row)).toEqual({ name: "package.json", kind: "file" });
    expect(iconFor(row.name!)).toBe("config");
    expect(badgeFor(row.name!)).toBe("PKG");
    expect(entryDirectory(row)).toBe("packages/dsh-command-panel");
  });

  it("names a directory after stripping the trailing slash the label keeps", () => {
    const row = fileRows({ cwd: "/repo", candidates: [{ path: "src/client/", kind: "directory" }] }, copy)[0]!;
    expect(row.label.endsWith("/")).toBe(true);
    expect(fileMarkOf(row)).toEqual({ name: "client", kind: "directory" });
    expect(entryDirectory(row)).toBe("src");
  });

  it("has no parent to show for a workspace-root file", () => {
    const row = filesystemRows(
      { home: "/Users/lionad", entries: [{ path: "/Users/lionad/notes.md", kind: "file", exists: true }] },
      copy,
    )[0]!;
    expect(entryDirectory(row)).toBe("/Users/lionad");
    const root = fileRows({ cwd: "/repo", candidates: [{ path: "README.md", kind: "file" }] }, copy)[0]!;
    expect(entryDirectory(root)).toBeUndefined();
  });

  it("does not draw its own folder glyph", () => {
    const panel = readFileSync(new URL("../src/client/panel.ts", import.meta.url), "utf8");
    expect(panel).toContain('from "dsh-fs-explorer/src/client/entry-mark.tsx"');
    expect(panel).not.toContain("M1.9 12.4");
  });
});

describe("workspace rows follow the sidebar header", () => {
  it("is a workspace drill with the path kept for matching only", () => {
    const row = workspaceRows(workspaceSnapshot(), sessionList([]), copy, 0)[0]!;
    expect(isWorkspaceRow(row)).toBe(true);
    expect(fileMarkOf(row)).toBeUndefined();
    expect(row.detail).toBeUndefined();
    expect(row.alias).toContain("dsh-plugins");
  });

  it("asks the sidebar for its folder icon", () => {
    const panel = readFileSync(new URL("../src/client/panel.ts", import.meta.url), "utf8");
    expect(panel).toContain("IconFolderCloseRegular");
  });
});
