import { describe, expect, it } from "vitest";

import { previewCrumbs } from "../src/client/preview-crumbs-model.ts";

describe("previewCrumbs", () => {
  it("splits a workspace path into one crumb per segment", () => {
    expect(previewCrumbs("packages/dsh-fs-explorer/src/client/preview-pane.tsx")).toEqual({
      absolute: false,
      segments: [
        {
          name: "packages",
          path: "packages",
          kind: "directory",
          parent: "",
        },
        {
          name: "dsh-fs-explorer",
          path: "packages/dsh-fs-explorer",
          kind: "directory",
          parent: "packages",
        },
        {
          name: "src",
          path: "packages/dsh-fs-explorer/src",
          kind: "directory",
          parent: "packages/dsh-fs-explorer",
        },
        {
          name: "client",
          path: "packages/dsh-fs-explorer/src/client",
          kind: "directory",
          parent: "packages/dsh-fs-explorer/src",
        },
        {
          name: "preview-pane.tsx",
          path: "packages/dsh-fs-explorer/src/client/preview-pane.tsx",
          kind: "file",
          parent: "packages/dsh-fs-explorer/src/client",
        },
      ],
    });
  });

  it("keeps a bare file name as a single crumb hanging off the workspace root", () => {
    expect(previewCrumbs("README.md")).toEqual({
      absolute: false,
      segments: [{ name: "README.md", path: "README.md", kind: "file", parent: "" }],
    });
  });

  it("marks only the last crumb as a file", () => {
    const { segments } = previewCrumbs("a/b/c/d.ts");
    expect(segments.map((crumb) => crumb.kind)).toEqual([
      "directory",
      "directory",
      "directory",
      "file",
    ]);
  });

  it("normalizes separators, leading ./ runs, doubled slashes and a trailing slash", () => {
    const expected = previewCrumbs("packages/dsh-fs-explorer/src/client/preview-pane.tsx");
    for (const variant of [
      "packages\\dsh-fs-explorer\\src\\client\\preview-pane.tsx",
      "./packages/dsh-fs-explorer/src/client/preview-pane.tsx",
      "././packages/dsh-fs-explorer/src/client/preview-pane.tsx",
      "packages//dsh-fs-explorer///src/client/preview-pane.tsx",
      "packages/dsh-fs-explorer/src/client/preview-pane.tsx/",
      "./packages\\dsh-fs-explorer/src//client/preview-pane.tsx/",
    ]) {
      expect(previewCrumbs(variant), variant).toEqual(expected);
    }
  });

  it("returns no crumbs for inputs that carry no segment", () => {
    // The flag only gates sibling listing, which is meaningless without a
    // segment, so every empty result reports the same shape.
    for (const variant of ["", ".", "/", "./", "///"]) {
      expect(previewCrumbs(variant), variant).toEqual({ absolute: false, segments: [] });
    }
  });

  it("reads a POSIX absolute path without losing the root", () => {
    expect(previewCrumbs("/Users/lionad/notes.md")).toEqual({
      absolute: true,
      segments: [
        { name: "Users", path: "/Users", kind: "directory", parent: "/" },
        { name: "lionad", path: "/Users/lionad", kind: "directory", parent: "/Users" },
        { name: "notes.md", path: "/Users/lionad/notes.md", kind: "file", parent: "/Users/lionad" },
      ],
    });
  });

  it("reads a Windows drive path without throwing", () => {
    expect(previewCrumbs("C:/Users/lionad/a.ts")).toEqual({
      absolute: true,
      segments: [
        { name: "Users", path: "C:/Users", kind: "directory", parent: "C:" },
        { name: "lionad", path: "C:/Users/lionad", kind: "directory", parent: "C:/Users" },
        { name: "a.ts", path: "C:/Users/lionad/a.ts", kind: "file", parent: "C:/Users/lionad" },
      ],
    });
    expect(previewCrumbs("C:\\Users\\lionad\\a.ts").absolute).toBe(true);
  });

  it("reads a UNC path with the share as the root", () => {
    expect(previewCrumbs("\\\\server\\share\\dir\\a.ts")).toEqual({
      absolute: true,
      segments: [
        { name: "dir", path: "//server/share/dir", kind: "directory", parent: "//server/share" },
        {
          name: "a.ts",
          path: "//server/share/dir/a.ts",
          kind: "file",
          parent: "//server/share/dir",
        },
      ],
    });
  });

  it("chains every crumb onto its own parent", () => {
    for (const path of ["a/b/c.ts", "/a/b/c.ts", "C:/a/b/c.ts"]) {
      for (const crumb of previewCrumbs(path).segments) {
        expect(crumb.path.endsWith(crumb.name), path).toBe(true);
        expect(crumb.parent === "" || crumb.path.startsWith(crumb.parent), path).toBe(true);
      }
    }
  });

  it("is pure: repeated calls agree and share no mutable state", () => {
    const first = previewCrumbs("a/b/c.ts");
    const second = previewCrumbs("a/b/c.ts");
    expect(second).toEqual(first);
    expect(second.segments).not.toBe(first.segments);
  });
});
