import { describe, expect, it } from "vitest";

import { indexIgnoredPaths } from "../src/client/ignored.ts";
import {
  adoptsOpenFile,
  ancestorChain,
  badgeFor,
  buildTree,
  computeTreeWindow,
  describeListing,
  findFrontPage,
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
  it("puts directories first, sorts by name and filters only the repository itself", () => {
    // `.git` is version-control internals rather than an ignored entry, so no
    // SCM surface lists it. Everything else that used to be hard-filtered is a
    // git-ignored directory, and the tree now dims it instead of hiding it.
    const tree = buildTree([
      { name: "z.ts", kind: "file" },
      { name: "a", kind: "directory" },
      { name: "node_modules", kind: "directory" },
      { name: "b.md", kind: "file" },
      { name: ".git", kind: "directory" },
      { name: "dist", kind: "directory" },
      { name: "__pycache__", kind: "directory" },
    ]);
    expect(tree.map(node => node.name)).toEqual(["__pycache__", "a", "dist", "node_modules", "b.md", "z.ts"]);
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

  it("labels a truncated listing with the shown cap and no fake action", () => {
    const summary = describeListing({ entries, truncated: true, total: 5000 });
    expect(summary.truncated).toBe(true);
    expect(summary.total).toBe(5000);
    expect(summary.label).toContain("2000");
    expect(summary.label).toContain("仅显示前");
    expect(summary.label).not.toContain("继续加载");
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

  it("paints file badges and directory aggregates from the status map", () => {
    const levels = new Map<string, TreeLevel>([
      ["", root],
      [
        "src",
        level([
          { name: "client", kind: "directory" },
          { name: "main.ts", kind: "file" },
        ]),
      ],
    ]);
    const statuses = {
      "README.md": { status: "untracked" as const },
      "src/main.ts": { status: "modified" as const },
      "src/client/view.tsx": { status: "deleted" as const },
      "src/client/tree.tsx": { status: "renamed" as const },
    };
    const rows = flattenTree(levels, new Set(["src"]), statuses);
    const readme = rows.find(row => row.type === "entry" && row.name === "README.md");
    const main = rows.find(row => row.type === "entry" && row.name === "main.ts");
    const client = rows.find(row => row.type === "entry" && row.name === "client");
    expect(readme?.type === "entry" ? readme.status : undefined).toBe("untracked");
    expect(main?.type === "entry" ? main.status : undefined).toBe("modified");
    expect(client?.type === "entry" ? client.statusCount : undefined).toBe(2);
    expect(client?.type === "entry" ? client.statusTone : undefined).toBe("danger");
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

  it("assembles identity tags on directory rows only", () => {
    const levels = new Map<string, TreeLevel>([
      [
        "",
        level([
          { name: "packages", kind: "directory" },
          { name: "README.md", kind: "file" },
        ]),
      ],
      [
        "packages",
        level([
          { name: "dsh-jump", kind: "directory" },
          { name: "dsh-fs-explorer", kind: "directory" },
          { name: "main.ts", kind: "file" },
        ]),
      ],
    ]);
    const tags = new Map([
      ["packages/dsh-jump", "submodule" as const],
      ["packages/*", "package" as const],
    ]);
    const rows = flattenTree(levels, new Set(["packages"]), undefined, tags);
    const tagOf = (name: string) => {
      const row = rows.find(candidate => candidate.type === "entry" && candidate.name === name);
      return row?.type === "entry" ? row.tag : undefined;
    };
    // The exact submodule identity wins over the matching package pattern.
    expect(tagOf("dsh-jump")).toBe("submodule");
    expect(tagOf("dsh-fs-explorer")).toBe("package");
    expect(tagOf("packages")).toBeUndefined();
    expect(tagOf("README.md")).toBeUndefined();
    expect(tagOf("main.ts")).toBeUndefined();
  });

  it("never tags a file row even when the map carries its path", () => {
    const levels = new Map<string, TreeLevel>([
      ["", level([{ name: "a.ts", kind: "file" }])],
    ]);
    const tags = new Map([["a.ts", "submodule" as const]]);
    const rows = flattenTree(levels, new Set(), undefined, tags);
    expect(rows[0]?.type === "entry" ? rows[0].tag : "present").toBeUndefined();
  });

  it("decorates changed file rows with their line counts", () => {
    const levels = new Map<string, TreeLevel>([
      ["", root],
      [
        "src",
        level([
          { name: "main.ts", kind: "file" },
          { name: "logo.png", kind: "file" },
          { name: "scratch.ts", kind: "file" },
        ]),
      ],
    ]);
    const statuses = {
      "src/main.ts": { status: "modified" as const, additions: 12, deletions: 4 },
      "src/logo.png": { status: "modified" as const, additions: null, deletions: null },
      "src/scratch.ts": { status: "untracked" as const },
    };
    const rows = flattenTree(levels, new Set(["src"]), statuses);
    const diffOf = (name: string) => {
      const row = rows.find(candidate => candidate.type === "entry" && candidate.name === name);
      return row?.type === "entry" ? row.diff : undefined;
    };
    expect(diffOf("main.ts")).toEqual({ additions: 12, deletions: 4 });
    expect(diffOf("logo.png")).toEqual({ binary: true });
    expect(diffOf("scratch.ts")).toBeUndefined();
    // Directory rows aggregate; they never carry line counts.
    expect(diffOf("src")).toBeUndefined();
  });

  describe("ignored entries", () => {
    // `logs` is a visible directory whose children are all ignored; that is the
    // only way a directory can lose every child, since an ignored directory is
    // hidden with its whole subtree before anything inside it is visited.
    const levels = (): Map<string, TreeLevel> =>
      new Map<string, TreeLevel>([
        [
          "",
          level(
            buildTree([
              { name: "src", kind: "directory" },
              { name: "logs", kind: "directory" },
              { name: "node_modules", kind: "directory" },
              { name: "README.md", kind: "file" },
              { name: "x.log", kind: "file" },
            ]),
          ),
        ],
        ["logs", level(buildTree([{ name: "a.log", kind: "file" }, { name: "b.log", kind: "file" }]))],
        [
          "node_modules",
          level(buildTree([{ name: ".bin", kind: "directory" }, { name: "left-pad", kind: "directory" }])),
        ],
        ["node_modules/.bin", level(buildTree([{ name: "tsc", kind: "file" }]))],
      ]);

    const index = indexIgnoredPaths(["node_modules", "x.log", "*.log", "logs/a.log", "logs/b.log"]);

    it("marks ignored rows and leaves the rest alone", () => {
      const rows = flattenTree(levels(), new Set(["node_modules"]), undefined, undefined, { ignored: index });
      const ignoredOf = (name: string) => {
        const row = rows.find(candidate => candidate.type === "entry" && candidate.name === name);
        return row?.type === "entry" ? row.ignored : undefined;
      };
      expect(ignoredOf("node_modules")).toBe(true);
      expect(ignoredOf("x.log")).toBe(true);
      expect(ignoredOf("README.md")).toBeUndefined();
      expect(ignoredOf("src")).toBeUndefined();
      expect(ignoredOf("logs")).toBeUndefined();
    });

    it("inherits the mark down an ignored directory's children", () => {
      const rows = flattenTree(levels(), new Set(["node_modules", "node_modules/.bin"]), undefined, undefined, {
        ignored: index,
      });
      const tsc = rows.find(row => row.type === "entry" && row.name === "tsc");
      expect(tsc?.type === "entry" ? tsc.ignored : undefined).toBe(true);
    });

    it("shows ignored entries by default", () => {
      // Only an explicit `false` hides them: the feature's default state is
      // visible and dimmed, so a caller with no opinion sees every row.
      const rows = flattenTree(levels(), new Set(), undefined, undefined, { ignored: index });
      expect(rows.map(row => (row.type === "entry" ? row.name : row.state))).toEqual([
        "logs",
        "node_modules",
        "src",
        "README.md",
        "x.log",
      ]);
    });

    it("drops an ignored row and its whole subtree when hidden", () => {
      const rows = flattenTree(levels(), new Set(["node_modules", "node_modules/.bin"]), undefined, undefined, {
        ignored: index,
        showIgnored: false,
      });
      const names = rows.flatMap(row => (row.type === "entry" ? [row.name] : []));
      expect(names).toEqual(["logs", "src", "README.md"]);
      expect(names).not.toContain("tsc");
      expect(names).not.toContain("x.log");
    });

    it("states how many entries a fully hidden directory lost", () => {
      const rows = flattenTree(levels(), new Set(["logs"]), undefined, undefined, {
        ignored: index,
        showIgnored: false,
      });
      const status = rows.find(row => row.type === "status" && row.path === "logs");
      expect(status?.type === "status" ? status.state : undefined).toBe("empty");
      expect(status?.type === "status" ? status.label : undefined).toContain("2");
    });

    it("uses the caller's label when one is given", () => {
      const rows = flattenTree(levels(), new Set(["logs"]), undefined, undefined, {
        ignored: index,
        showIgnored: false,
        hiddenLabel: count => `hid ${String(count)}`,
      });
      const status = rows.find(row => row.type === "status" && row.path === "logs");
      expect(status?.type === "status" ? status.label : undefined).toBe("hid 2");
    });

    it("keeps the root from going blank when every child is hidden", () => {
      const onlyIgnored = new Map<string, TreeLevel>([
        [
          "",
          level(buildTree([{ name: "node_modules", kind: "directory" }, { name: "x.log", kind: "file" }])),
        ],
      ]);
      const rows = flattenTree(onlyIgnored, new Set(), undefined, undefined, {
        ignored: index,
        showIgnored: false,
      });
      expect(rows).toHaveLength(1);
      const status = rows[0];
      expect(status?.type === "status" ? status.state : undefined).toBe("empty");
      expect(status?.type === "status" ? status.depth : undefined).toBe(0);
      expect(status?.type === "status" ? status.label : undefined).toContain("2");
    });

    it("keeps the old four-argument shape unchanged", () => {
      const rows = flattenTree(levels(), new Set());
      expect(rows.map(row => (row.type === "entry" ? row.name : row.state))).toEqual([
        "logs",
        "node_modules",
        "src",
        "README.md",
        "x.log",
      ]);
      expect(rows.every(row => row.type !== "entry" || row.ignored === undefined)).toBe(true);
    });
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
    expect(parseFocus("path:src/client/view.tsx:42")).toEqual({
      path: "src/client/view.tsx",
      line: 42,
      absolute: false,
    });
    expect(parseFocus("path:./src\\main.ts")).toEqual({ path: "src/main.ts", line: 1, absolute: false });
    // `path:` keeps stripping the leading slash: it addresses the workspace.
    expect(parseFocus("path:/src/main.ts")).toEqual({ path: "src/main.ts", line: 1, absolute: false });
    expect(parseFocus("")).toBeUndefined();
    expect(parseFocus("lines:1")).toBeUndefined();
  });

  it("parses an absolute focus without eating its leading slash", () => {
    expect(parseFocus("abs:/Users/x/project/src/a.ts:12")).toEqual({
      path: "/Users/x/project/src/a.ts",
      line: 12,
      absolute: true,
    });
    expect(parseFocus("abs:/Users/x/project/src/a.ts")).toEqual({
      path: "/Users/x/project/src/a.ts",
      line: 1,
      absolute: true,
    });
    // A Windows absolute path travels with forward slashes after normalization.
    expect(parseFocus("abs:C:\\work\\a.ts:3")).toEqual({ path: "C:/work/a.ts", line: 3, absolute: true });
    expect(parseFocus("abs:")).toBeUndefined();
    expect(parseFocus("  abs:/a/b.ts:9  ")).toEqual({ path: "/a/b.ts", line: 9, absolute: true });
    // A line suffix of zero or a non-numeric tail is not a line.
    expect(parseFocus("abs:/a/b.ts:0")).toEqual({ path: "/a/b.ts", line: 1, absolute: true });
    expect(parseFocus("abs:/a/b.ts:x")).toEqual({ path: "/a/b.ts:x", line: 1, absolute: true });
  });

  it("parses a directory entry, keeping an absolute path as written", () => {
    expect(parseFocus("enter:content/6.maps/analysis")).toEqual({
      path: "content/6.maps/analysis",
      line: 1,
      absolute: false,
      enter: true,
    });
    // A directory written with its trailing slash is the same directory.
    expect(parseFocus("enter:content/6.maps/analysis/")).toEqual({
      path: "content/6.maps/analysis",
      line: 1,
      absolute: false,
      enter: true,
    });
    expect(parseFocus("enter:/Users/x/project/agents/")).toEqual({
      path: "/Users/x/project/agents",
      line: 1,
      absolute: true,
      enter: true,
    });
    expect(parseFocus("  enter:./content\\a  ")).toEqual({
      path: "content/a",
      line: 1,
      absolute: false,
      enter: true,
    });
    expect(parseFocus("enter:")).toBeUndefined();
    expect(parseFocus("enter:/")).toBeUndefined();
  });

  it("parses a git focus with revision, line and the rest as the path", () => {
    expect(parseFocus("git:17b6a55:12:src/client/view.tsx")).toEqual({
      path: "src/client/view.tsx",
      line: 12,
      absolute: false,
      revision: "17b6a55",
    });
    // The line segment is mandatory: a git path may itself end in digits.
    expect(parseFocus("git:26d4fd0:1:docs/notes:2024.md")).toEqual({
      path: "docs/notes:2024.md",
      line: 1,
      absolute: false,
      revision: "26d4fd0",
    });
    // Uppercase hex is normalized; backslashes and leading ./ are not paths.
    expect(parseFocus("git:17B6A55:3:.\\src\\a.ts")).toEqual({
      path: "src/a.ts",
      line: 3,
      absolute: false,
      revision: "17b6a55",
    });
    // A missing line or an illegal revision is not ours.
    expect(parseFocus("git:17b6a55:src/a.ts")).toBeUndefined();
    expect(parseFocus("git:ab:12:src/a.ts")).toBeUndefined();
    expect(parseFocus("git:zzzzzz:12:src/a.ts")).toBeUndefined();
    expect(parseFocus("git:17b6a55:12:")).toBeUndefined();
    expect(parseFocus("git:17b6a55:0:")).toBeUndefined();
  });

  it("reads the badge from the basename, not from a dotted directory", () => {
    expect(badgeFor("notes.txt.d/a.ts")).toBe("TS");
    expect(iconFor("v1.2/Makefile")).toBe("config");
    expect(badgeFor("/Users/x/.config/Makefile")).toBe("MK");
  });

  it("formats sizes for the right-aligned column", () => {
    expect(formatSize(0)).toBe("0 B");
    expect(formatSize(1024)).toBe("1.0 KB");
    expect(formatSize(1536)).toBe("1.5 KB");
    expect(formatSize(10 * 1024 * 1024)).toBe("10 MB");
  });
});

describe("findFrontPage", () => {
  const nodes = (...names: string[]) => names.map(name => ({ name, kind: "file" as const }));

  it("prefers a README over an index, in the order the set declares", () => {
    expect(findFrontPage([...nodes("index.md", "readme.markdown", "readme.md")], "docs")).toBe("docs/readme.md");
    expect(findFrontPage([...nodes("index.md")], "docs")).toBe("docs/index.md");
    expect(findFrontPage([...nodes("readme.txt")], "docs")).toBe("docs/readme.txt");
  });

  it("matches the host's case and keeps the directory's own spelling", () => {
    expect(findFrontPage([...nodes("README.MD")], "packages/x")).toBe("packages/x/README.MD");
  });

  it("refuses a directory with no front page, and a folder named like one", () => {
    expect(findFrontPage([...nodes("notes.md", "src")], "docs")).toBeUndefined();
    expect(
      findFrontPage(
        [
          { name: "readme.md", kind: "directory" },
          { name: "index.md", kind: "directory" },
        ],
        "docs",
      ),
    ).toBeUndefined();
  });
});

describe("ancestorChain", () => {
  it("returns no ancestors for an empty path or a bare file", () => {
    expect(ancestorChain("")).toEqual([]);
    expect(ancestorChain("a.ts")).toEqual([]);
  });

  it("walks every ancestor directory, outermost first, without the file itself", () => {
    expect(ancestorChain("a/b/c.md")).toEqual(["a", "a/b"]);
  });

  it("normalizes `./` prefixes and backslashes the way panel keys are normalized", () => {
    expect(ancestorChain("./a/b/c.md")).toEqual(["a", "a/b"]);
    expect(ancestorChain(".\\./a\\b.ts")).toEqual(["a"]);
  });
});

describe("adoptsOpenFile", () => {
  it("keeps the cursor where the reader left it when only the row list changed", () => {
    // Left arrow on an open folder collapses it. The panel still shows the
    // file opened on arrival, but the cursor was moved on purpose.
    expect(adoptsOpenFile({ cursorPath: "assets", selectionMoved: false })).toBe(false);
  });

  it("follows the open file when the reader opens one", () => {
    expect(adoptsOpenFile({ cursorPath: "assets", selectionMoved: true })).toBe(true);
  });

  it("adopts the open file when the cursor's row is gone", () => {
    // A collapse or a refreshed listing can remove the row the cursor named.
    expect(adoptsOpenFile({ cursorPath: undefined, selectionMoved: false })).toBe(true);
  });
});
