import { describe, expect, it } from "vitest";

import { buildWorkspaceMap, workspaceTagFor } from "../src/client/workspace-map.ts";

function files(entries: Record<string, string>): Map<string, string> {
  return new Map(Object.entries(entries));
}

describe("buildWorkspaceMap: .gitmodules", () => {
  it("reads the path of every submodule section", () => {
    const map = buildWorkspaceMap(
      files({
        ".gitmodules": [
          '[submodule "refs/deepseek-harness-for-vs-code"]',
          "\tpath = refs/deepseek-harness-for-vs-code",
          "\turl = git@github.com:Lionad-Morotar/Deepseek-Harness-for-VS-Code.git",
          "\tignore = all",
          '[submodule "packages/dsh-jump"]',
          "\tpath = packages/dsh-jump ",
          "\turl = git@github.com:Lionad-Morotar/dsh-jump.git",
        ].join("\n"),
      }),
      new Set(["packages", "refs"]),
    );
    expect(map.get("refs/deepseek-harness-for-vs-code")).toBe("submodule");
    expect(map.get("packages/dsh-jump")).toBe("submodule");
    expect(map.size).toBe(2);
  });

  it("skips comments, blank lines and sections without a path", () => {
    const map = buildWorkspaceMap(
      files({
        ".gitmodules": [
          "# top comment",
          "",
          '[submodule "a"]',
          "; section comment",
          "\turl = https://example.com/a.git",
          "",
          '[submodule "b"]',
          "\tpath = libs/b",
        ].join("\n"),
      }),
      new Set(["libs"]),
    );
    expect(map.size).toBe(1);
    expect(map.get("libs/b")).toBe("submodule");
  });

  it("answers an empty map for an absent or empty file", () => {
    expect(buildWorkspaceMap(new Map(), new Set(["packages"])).size).toBe(0);
    expect(buildWorkspaceMap(files({ ".gitmodules": "" }), new Set()).size).toBe(0);
  });
});

describe("buildWorkspaceMap: pnpm-workspace.yaml", () => {
  it("collects the patterns under the top-level packages key and stops at the next key", () => {
    const map = buildWorkspaceMap(
      files({
        "pnpm-workspace.yaml": [
          "packages:",
          "  - packages/*",
          "  - apps/**",
          "",
          "onlyBuiltDependencies:",
          "  - esbuild",
        ].join("\n"),
      }),
      new Set(["packages", "apps"]),
    );
    expect(map.get("packages/*")).toBe("package");
    expect(map.get("apps/**")).toBe("package");
    expect(map.size).toBe(2);
  });

  it("ignores non-list lines inside the block and survives odd indentation", () => {
    const map = buildWorkspaceMap(
      files({
        "pnpm-workspace.yaml": [
          "packages: # inline comment",
          "    - packages/*",
          "      nestedKey: value",
          "\t-   apps/**",
        ].join("\n"),
      }),
      new Set(["packages", "apps"]),
    );
    expect(map.get("packages/*")).toBe("package");
    expect(map.get("apps/**")).toBe("package");
  });

  it("drops patterns whose prefix directory is not in the root listing", () => {
    const map = buildWorkspaceMap(
      files({ "pnpm-workspace.yaml": "packages:\n  - ghost/*\n  - packages/*" }),
      new Set(["packages"]),
    );
    expect(map.size).toBe(1);
    expect(map.get("packages/*")).toBe("package");
  });
});

describe("buildWorkspaceMap: package.json, turbo.json and lerna.json", () => {
  it("reads the workspaces array form", () => {
    const map = buildWorkspaceMap(
      files({ "package.json": JSON.stringify({ workspaces: ["packages/*"] }) }),
      new Set(["packages"]),
    );
    expect(map.get("packages/*")).toBe("package");
  });

  it("reads the nested workspaces.packages form", () => {
    const map = buildWorkspaceMap(
      files({ "package.json": JSON.stringify({ workspaces: { packages: ["apps/**"] } }) }),
      new Set(["apps"]),
    );
    expect(map.get("apps/**")).toBe("package");
  });

  it("reads turbo.json and lerna.json packages fields and unions with pnpm", () => {
    const map = buildWorkspaceMap(
      files({
        "pnpm-workspace.yaml": "packages:\n  - packages/*",
        "turbo.json": JSON.stringify({ packages: ["tooling/*"] }),
        "lerna.json": JSON.stringify({ packages: ["libs/**"] }),
      }),
      new Set(["packages", "tooling", "libs"]),
    );
    expect([...map.keys()].sort()).toEqual(["libs/**", "packages/*", "tooling/*"]);
  });

  it("answers nothing for broken JSON", () => {
    const map = buildWorkspaceMap(
      files({
        "package.json": "{ not json",
        "turbo.json": "]]]",
        "lerna.json": "nope",
      }),
      new Set(["packages", "apps"]),
    );
    expect(map.size).toBe(0);
  });
});

describe("buildWorkspaceMap: pattern acceptance", () => {
  const patterns = (items: readonly string[]): Map<string, string> =>
    files({ "pnpm-workspace.yaml": `packages:\n${items.map(item => `  - ${item}`).join("\n")}` });

  it("keeps only <dir>/* and <dir>/** with a plain prefix segment", () => {
    const map = buildWorkspaceMap(
      patterns(["packages/*", "apps/**", "{a,b}/*", "packages", "**/any", "packages/*/sub", "../*", "./*"]),
      new Set(["packages", "apps", "{a,b}", "sub"]),
    );
    expect([...map.keys()].sort()).toEqual(["apps/**", "packages/*"]);
  });

  it("keeps nothing when every source is absent or unreadable", () => {
    expect(buildWorkspaceMap(new Map(), new Set(["packages"])).size).toBe(0);
  });
});

describe("workspaceTagFor", () => {
  it("tags a first-level child of a <dir>/* pattern and nothing deeper", () => {
    const map = buildWorkspaceMap(files({ "pnpm-workspace.yaml": "packages:\n  - packages/*" }), new Set(["packages"]));
    expect(workspaceTagFor(map, "packages/dsh-fs-explorer")).toBe("package");
    expect(workspaceTagFor(map, "packages/dsh-fs-explorer/src")).toBeUndefined();
    expect(workspaceTagFor(map, "packages")).toBeUndefined();
  });

  it("tags every depth under a <dir>/** pattern", () => {
    const map = buildWorkspaceMap(files({ "pnpm-workspace.yaml": "packages:\n  - apps/**" }), new Set(["apps"]));
    expect(workspaceTagFor(map, "apps/web")).toBe("package");
    expect(workspaceTagFor(map, "apps/web/ui")).toBe("package");
    expect(workspaceTagFor(map, "apps")).toBeUndefined();
    expect(workspaceTagFor(map, "other/web")).toBeUndefined();
  });

  it("lets the exact submodule identity win over a matching package pattern", () => {
    const map = buildWorkspaceMap(
      files({
        ".gitmodules": '[submodule "jump"]\n\tpath = packages/dsh-jump',
        "pnpm-workspace.yaml": "packages:\n  - packages/*",
      }),
      new Set(["packages"]),
    );
    expect(workspaceTagFor(map, "packages/dsh-jump")).toBe("submodule");
    expect(workspaceTagFor(map, "packages/dsh-git-explorer")).toBe("package");
  });

  it("answers undefined without a map or for an empty path", () => {
    expect(workspaceTagFor(undefined, "packages/a")).toBeUndefined();
    expect(workspaceTagFor(new Map(), "")).toBeUndefined();
  });
});

describe("buildWorkspaceMap: corrupted input combinations", () => {
  it("never throws and keeps the healthy source's contribution", () => {
    const map = buildWorkspaceMap(
      files({
        ".gitmodules": "[submodule broken",
        "package.json": "{",
        "pnpm-workspace.yaml": "packages:\n  - packages/*",
      }),
      new Set(["packages"]),
    );
    expect(map.size).toBe(1);
    expect(map.get("packages/*")).toBe("package");
  });
});
