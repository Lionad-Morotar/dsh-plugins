import { describe, expect, it } from "vitest";

import type { PanelRow } from "../src/client/rows.ts";
import { directoryQuery, focusPath, parentQuery } from "../src/client/tree.ts";

function row(label: string, kind?: "file" | "directory"): PanelRow {
  return { key: label, label, kind, action: { kind: "insert-path", absolutePath: `/root/${label}` } };
}

describe("directoryQuery", () => {
  it("drills into a directory by its own path", () => {
    expect(directoryQuery(row("src/client/", "directory"))).toBe("src/client/");
  });

  it("keeps the trailing separator the host needs for a directory read", () => {
    expect(directoryQuery(row("src", "directory"))).toBe("src/");
  });

  it("normalizes Windows separators", () => {
    expect(directoryQuery(row("src\\client", "directory"))).toBe("src/client/");
  });

  it("refuses files and missing rows", () => {
    expect(directoryQuery(row("package.json", "file"))).toBeUndefined();
    expect(directoryQuery(row("package.json"))).toBeUndefined();
    expect(directoryQuery(undefined)).toBeUndefined();
  });
});

describe("parentQuery", () => {
  it("climbs out of the directory it names", () => {
    expect(parentQuery("src/client/")).toBe("src/");
    expect(parentQuery("src/")).toBe("");
  });

  it("drops an unfinished fragment but stays in its directory", () => {
    expect(parentQuery("src/client/pa")).toBe("src/client/");
    expect(parentQuery("src/pa")).toBe("src/");
  });

  it("does nothing for a bare search word", () => {
    expect(parentQuery("package")).toBeUndefined();
    expect(parentQuery("")).toBeUndefined();
  });

  it("keeps Windows paths intact", () => {
    expect(parentQuery("src\\client\\")).toBe("src\\");
    expect(parentQuery("C:\\work\\src\\main")).toBe("C:\\work\\src\\");
  });
});

describe("focusPath", () => {
  it("uses the workspace-relative label the workbench expects", () => {
    expect(focusPath(row("src/client/panel.ts", "file"))).toBe("src/client/panel.ts");
  });

  it("strips the prefixes the workbench normalizes anyway", () => {
    expect(focusPath(row("./src/a.ts", "file"))).toBe("src/a.ts");
    expect(focusPath(row("/src/a.ts", "file"))).toBe("src/a.ts");
    expect(focusPath(row("src\\a.ts", "file"))).toBe("src/a.ts");
  });

  it("has no file panel for a directory or an empty path", () => {
    expect(focusPath(row("src/", "directory"))).toBeUndefined();
    expect(focusPath(row("", "file"))).toBeUndefined();
    expect(focusPath(undefined)).toBeUndefined();
  });
});
