import { describe, expect, it } from "vitest";

import {
  badgeFor,
  buildTree,
  computeTreeWindow,
  describeListing,
  flattenTree,
  formatSize,
  iconFor,
  joinPath,
  listingPath,
  parseFocus,
  type TreeLevel,
} from "../src/client/model.ts";

function level(nodes: TreeLevel["nodes"], extra: Partial<TreeLevel> = {}): TreeLevel {
  return { status: "ready", nodes, truncated: false, total: nodes.length, ...extra };
}

describe("buildTree", () => {
  it("puts directories first, sorts by name and filters noise directories", () => {
    const tree = buildTree([
      { name: "z.ts", kind: "file" },
      { name: "a", kind: "directory" },
      { name: "node_modules", kind: "directory" },
      { name: "b.md", kind: "file" },
      { name: ".git", kind: "directory" },
      { name: "dist", kind: "directory" },
      { name: "__pycache__", kind: "directory" },
    ]);
    expect(tree.map(node => node.name)).toEqual(["a", "b.md", "z.ts"]);
  });

  it("accepts the host's `type` field and keeps file sizes", () => {
    const tree = buildTree([
      { name: "src", type: "directory" },
      { name: "main.ts", type: "file", size: 128 },
      { name: "link", type: "other" },
    ]);
    expect(tree).toEqual([
      { name: "src", kind: "directory" },
      { name: "link", kind: "file" },
      { name: "main.ts", kind: "file", size: 128 },
    ]);
  });

  it("sorts numeric runs as numbers", () => {
    const tree = buildTree([
      { name: "file10.ts", kind: "file" },
      { name: "file2.ts", kind: "file" },
    ]);
    expect(tree.map(node => node.name)).toEqual(["file2.ts", "file10.ts"]);
  });
});

describe("iconFor", () => {
  it("maps common extensions to distinct families", () => {
    expect(iconFor("a.ts")).toBe("code");
    expect(iconFor("a.tsx")).toBe("code");
    expect(iconFor("a.md")).toBe("markdown");
    expect(iconFor("a.json")).toBe("data");
    expect(iconFor("a.png")).toBe("image");
    expect(iconFor("a.css")).toBe("style");
    expect(iconFor("Dockerfile")).toBe("config");
    expect(iconFor("bundle.zip")).toBe("archive");
    expect(iconFor("src", "directory")).toBe("folder");
  });

  it("falls back to a neutral file family", () => {
    expect(iconFor("mystery.qqq")).toBe("file");
    expect(iconFor(".env.local")).toBe("config");
    expect(iconFor("README")).toBe("markdown");
  });
});

describe("badgeFor", () => {
  it("keeps badges short and readable", () => {
    expect(badgeFor("package.json")).toBe("PKG");
    expect(badgeFor("a.tsx")).toBe("TSX");
    expect(badgeFor("pyproject.toml")).toBe("{}");
    expect(badgeFor("mystery.qqq")).toBe("QQQ");
    expect(badgeFor("LICENSE").length).toBeLessThanOrEqual(3);
  });
});

describe("describeListing", () => {
  const entries = Array.from({ length: 2000 }, (_, index) => ({ name: `f${String(index)}.ts` }));

  it("labels a truncated listing with the shown count", () => {
    const summary = describeListing({ entries, truncated: true, total: 5000 });
    expect(summary.truncated).toBe(true);
    expect(summary.total).toBe(5000);
    expect(summary.label).toContain("2000");
    expect(summary.label).toContain("继续加载");
  });

  it("does not mark a complete listing as truncated", () => {
    const summary = describeListing({ entries, truncated: false });
    expect(summary.truncated).toBe(false);
    expect(summary.label).toBe("2000 项");
  });
});

describe("computeTreeWindow", () => {
  it("mounts only the viewport slice of a 5000-row tree", () => {
    const rows = Array.from({ length: 5000 }, (_, index) => ({ id: `n${String(index)}` }));
    const window = computeTreeWindow(rows, { scrollTop: 2000, height: 600, rowHeight: 22 });
    expect(window.rows.length).toBeLessThanOrEqual(60);
    expect(window.rows[0]?.id).not.toBe("n0");
    expect(window.startIndex).toBeGreaterThan(80);
  });

  it("clamps the final page so it fills from the bottom", () => {
    const rows = Array.from({ length: 100 }, (_, index) => index);
    const window = computeTreeWindow(rows, { scrollTop: 10_000, height: 220, rowHeight: 22 });
    expect(window.endIndex).toBe(100);
    expect(window.rows.at(-1)).toBe(99);
  });
});

describe("flattenTree", () => {
  const root = level(
    buildTree([
      { name: "src", kind: "directory" },
      { name: "README.md", kind: "file" },
    ]),
  );

  it("hides children until the directory is expanded", () => {
    const levels = new Map<string, TreeLevel>([["", root]]);
    const collapsed = flattenTree(levels, new Set());
    expect(collapsed.map(row => (row.type === "entry" ? row.name : row.state))).toEqual(["src", "README.md"]);
  });

  it("emits children and status rows under an expanded directory", () => {
    const levels = new Map<string, TreeLevel>([
      ["", root],
      [
        "src",
        level(
          buildTree([
            { name: "client", kind: "directory" },
            { name: "empty", kind: "directory" },
            { name: "broken", kind: "directory" },
            { name: "main.ts", kind: "file" },
          ]),
        ),
      ],
      ["src/client", { status: "loading", nodes: [], truncated: false, total: 0 }],
      ["src/empty", level([])],
      ["src/broken", { status: "failed", nodes: [], truncated: false, total: 0, message: "denied" }],
    ]);
    const expanded = new Set(["src", "src/client", "src/empty", "src/broken"]);
    const rows = flattenTree(levels, expanded);
    const shape = rows.map(row => (row.type === "entry" ? `${String(row.depth)}:${row.name}` : `${String(row.depth)}:${row.state}`));
    expect(shape).toContain("1:main.ts");
    expect(shape).toContain("2:loading");
    expect(shape).toContain("2:empty");
    expect(shape).toContain("2:failed");
  });

  it("adds a truncation row after a cut child listing", () => {
    const levels = new Map<string, TreeLevel>([
      ["", root],
      ["src", level([{ name: "a.ts", kind: "file" }], { truncated: true, total: 2000 })],
    ]);
    const rows = flattenTree(levels, new Set(["src"]));
    const status = rows.find(row => row.type === "status");
    expect(status?.type).toBe("status");
    if (status?.type === "status") {
      expect(status.state).toBe("truncated");
      expect(status.label).toContain("1 项");
    }
  });
});

describe("paths, focus and size", () => {
  it("joins workspace paths without doubling separators", () => {
    expect(joinPath("", "src")).toBe("src");
    expect(joinPath("src", "client")).toBe("src/client");
    expect(joinPath("src/", "client")).toBe("src/client");
    expect(listingPath("")).toBe(".");
    expect(listingPath("src")).toBe("src");
  });

  it("parses the Git panel's focus string", () => {
    expect(parseFocus("path:src/client/view.tsx:42")).toEqual({ path: "src/client/view.tsx", line: 42 });
    expect(parseFocus("path:./src\\main.ts")).toEqual({ path: "src/main.ts", line: 1 });
    expect(parseFocus("")).toBeUndefined();
    expect(parseFocus("lines:1")).toBeUndefined();
  });

  it("formats sizes for the right-aligned column", () => {
    expect(formatSize(0)).toBe("0 B");
    expect(formatSize(1024)).toBe("1.0 KB");
    expect(formatSize(1536)).toBe("1.5 KB");
    expect(formatSize(10 * 1024 * 1024)).toBe("10 MB");
  });
});
