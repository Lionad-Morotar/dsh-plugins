/**
 * The header's Workspace switch: which registered Workspace the panel is
 * standing in, and how the search box narrows that list.
 *
 * Both are pure, so they are asserted directly rather than through a mount. The
 * decisions worth pinning are the ones a reader would otherwise have to infer
 * from the component: a trailing separator is not a different directory, and
 * the filter never reorders the host's list.
 */
import { describe, expect, it } from "vitest";

import { currentWorkspaceId, filterWorkspaces, type WorkspaceChoice } from "../src/client/workspace-switch.ts";

const ITEMS: readonly WorkspaceChoice[] = [
  { workspaceId: "w1", title: "dsh-plugins", path: "/Users/lionad/Github/dsh-plugins" },
  { workspaceId: "w2", title: "Perch Docs", path: "/Users/lionad/Documents/perch-docs" },
  { workspaceId: "w3", title: "scratch", path: "/tmp/scratch" },
];

describe("currentWorkspaceId", () => {
  it("matches the row whose path is the root", () => {
    expect(currentWorkspaceId("/Users/lionad/Github/dsh-plugins", ITEMS)).toBe("w1");
  });

  it("ignores a trailing separator on either side", () => {
    expect(currentWorkspaceId("/Users/lionad/Github/dsh-plugins/", ITEMS)).toBe("w1");
    expect(currentWorkspaceId("/tmp/scratch", [{ workspaceId: "w3", title: "scratch", path: "/tmp/scratch/" }])).toBe("w3");
  });

  it("ignores a trailing backslash, because Windows roots arrive that way", () => {
    const windows: readonly WorkspaceChoice[] = [{ workspaceId: "win", title: "repo", path: "C:\\work\\repo" }];
    expect(currentWorkspaceId("C:\\work\\repo\\", windows)).toBe("win");
  });

  it("reports no current row when the paths differ", () => {
    expect(currentWorkspaceId("/Users/lionad/Github/other", ITEMS)).toBeUndefined();
  });

  it("reports no current row for an empty root", () => {
    expect(currentWorkspaceId("", ITEMS)).toBeUndefined();
  });

  it("does not fold case, because the host path is the identity", () => {
    expect(currentWorkspaceId("/users/lionad/github/dsh-plugins", ITEMS)).toBeUndefined();
  });
});

describe("filterWorkspaces", () => {
  it("returns the host order untouched for an empty query", () => {
    expect(filterWorkspaces(ITEMS, "")).toEqual(ITEMS);
    expect(filterWorkspaces(ITEMS, "   ")).toEqual(ITEMS);
  });

  it("matches the title case-insensitively", () => {
    expect(filterWorkspaces(ITEMS, "PERCH").map(item => item.workspaceId)).toEqual(["w2"]);
  });

  it("matches the path case-insensitively", () => {
    expect(filterWorkspaces(ITEMS, "github").map(item => item.workspaceId)).toEqual(["w1"]);
  });

  it("keeps the host order instead of ranking by match quality", () => {
    expect(filterWorkspaces(ITEMS, "/").map(item => item.workspaceId)).toEqual(["w1", "w2", "w3"]);
  });

  it("returns nothing when no row matches", () => {
    expect(filterWorkspaces(ITEMS, "zzz")).toEqual([]);
  });
});
