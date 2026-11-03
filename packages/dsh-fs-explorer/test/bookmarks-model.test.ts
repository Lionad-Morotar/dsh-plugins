/**
 * The bookmark tree's pure operations.
 *
 * What these tests protect is the promise the bookmark bar will rest on: the
 * array order *is* the display order, a group can nest arbitrarily but never
 * inside itself, and every operation hands back a new tree rather than editing
 * the one it was given. A model that mutated in place would make the store's
 * optimistic update and its rollback the same object, which is the one bug that
 * is impossible to see in a UI test.
 */
import { describe, expect, it } from "vitest";

import {
  emptyBookmarkTree,
  findNode,
  findParentId,
  flattenGroups,
  insertNode,
  makeNode,
  moveNode,
  removeNode,
  renameNode,
  reorderChildren,
  sortByCreatedAt,
} from "../src/client/bookmarks-model.ts";
import type { BookmarkGroup, BookmarkNode, BookmarkTree } from "../src/bookmarks.ts";

const NOW = "2026-11-03T00:00:00.000Z";

/** One node with a predictable id and creation time. */
function node(kind: "group" | "file" | "folder", id: string, createdAt = 1): BookmarkNode {
  return makeNode(kind, {
    id,
    name: id,
    createdAt,
    ...(kind === "group" ? {} : { path: `docs/${id}` }),
  });
}

/** A tree with the given nodes at the root. */
function treeOf(...nodes: BookmarkNode[]): BookmarkTree {
  let tree = emptyBookmarkTree(NOW);
  for (const entry of nodes) tree = insertNode(tree, null, entry);
  return tree;
}

/** The ids at the root, in display order. */
function rootIds(tree: BookmarkTree): string[] {
  return tree.roots.map(entry => entry.id);
}

/** The children of one group, by id. */
function childIds(tree: BookmarkTree, groupId: string): string[] {
  const group = findNode(tree, groupId);
  if (group === undefined || group.kind !== "group") throw new Error(`${groupId} is not a group`);
  return group.children.map(entry => entry.id);
}

describe("emptyBookmarkTree", () => {
  it("starts at version 1 with no roots", () => {
    expect(emptyBookmarkTree(NOW)).toEqual({ version: 1, roots: [], updatedAt: NOW });
  });
});

describe("makeNode", () => {
  it("gives a group an empty child list", () => {
    expect(node("group", "g1")).toEqual({ id: "g1", kind: "group", name: "g1", createdAt: 1, children: [] });
  });

  it("gives a file and a folder their path", () => {
    expect(node("file", "f1")).toMatchObject({ kind: "file", path: "docs/f1" });
    expect(node("folder", "d1")).toMatchObject({ kind: "folder", path: "docs/d1" });
  });

  it("refuses a file without a path", () => {
    expect(() => makeNode("file", { id: "f1", name: "f1", createdAt: 1 })).toThrowError(/path/u);
  });

  it("refuses a folder without a path", () => {
    expect(() => makeNode("folder", { id: "d1", name: "d1", createdAt: 1 })).toThrowError(/path/u);
  });
});

describe("insertNode", () => {
  it("appends to the root", () => {
    const tree = treeOf(node("file", "a"), node("file", "b"));
    expect(rootIds(tree)).toEqual(["a", "b"]);
  });

  it("appends to a group", () => {
    let tree = treeOf(node("group", "g1"));
    tree = insertNode(tree, "g1", node("file", "a"));
    expect(childIds(tree, "g1")).toEqual(["a"]);
  });

  it("nests three levels deep", () => {
    let tree = treeOf(node("group", "g1"));
    tree = insertNode(tree, "g1", node("group", "g2"));
    tree = insertNode(tree, "g2", node("group", "g3"));
    tree = insertNode(tree, "g3", node("file", "deep"));
    expect(childIds(tree, "g3")).toEqual(["deep"]);
    expect(findParentId(tree, "deep")).toBe("g3");
  });

  it("inserts at an index", () => {
    let tree = treeOf(node("file", "a"), node("file", "c"));
    tree = insertNode(tree, null, node("file", "b"), 1);
    expect(rootIds(tree)).toEqual(["a", "b", "c"]);
  });

  it("clamps an out-of-range index to the end", () => {
    let tree = treeOf(node("file", "a"));
    tree = insertNode(tree, null, node("file", "b"), 99);
    expect(rootIds(tree)).toEqual(["a", "b"]);
    tree = insertNode(tree, null, node("file", "c"), -5);
    expect(rootIds(tree)).toEqual(["c", "a", "b"]);
  });

  it("refuses a parent that is not a group", () => {
    const tree = treeOf(node("file", "a"));
    expect(() => insertNode(tree, "a", node("file", "b"))).toThrowError(/group/u);
  });

  it("refuses a parent that does not exist", () => {
    expect(() => insertNode(emptyBookmarkTree(NOW), "ghost", node("file", "a"))).toThrowError(/ghost/u);
  });

  it("refuses a duplicate id", () => {
    const tree = treeOf(node("file", "a"));
    expect(() => insertNode(tree, null, node("file", "a"))).toThrowError(/already/u);
  });

  it("leaves the input tree untouched", () => {
    const before = treeOf(node("file", "a"));
    const snapshot = JSON.stringify(before);
    insertNode(before, null, node("file", "b"));
    expect(JSON.stringify(before)).toBe(snapshot);
  });

  it("moves updatedAt forward", () => {
    const before = emptyBookmarkTree("2020-01-01T00:00:00.000Z");
    const after = insertNode(before, null, node("file", "a"));
    expect(after.updatedAt).not.toBe(before.updatedAt);
  });
});

describe("findNode and findParentId", () => {
  it("finds a nested node and names its parent", () => {
    let tree = treeOf(node("group", "g1"));
    tree = insertNode(tree, "g1", node("file", "a"));
    expect(findNode(tree, "a")).toMatchObject({ id: "a" });
    expect(findParentId(tree, "a")).toBe("g1");
  });

  it("answers null for a root node", () => {
    const tree = treeOf(node("file", "a"));
    expect(findParentId(tree, "a")).toBeNull();
  });

  it("answers undefined for an unknown id", () => {
    expect(findNode(emptyBookmarkTree(NOW), "ghost")).toBeUndefined();
    expect(findParentId(emptyBookmarkTree(NOW), "ghost")).toBeUndefined();
  });
});

describe("removeNode", () => {
  it("removes a leaf and hands it back", () => {
    const tree = treeOf(node("file", "a"), node("file", "b"));
    const { tree: after, removed } = removeNode(tree, "a");
    expect(rootIds(after)).toEqual(["b"]);
    expect(removed).toMatchObject({ id: "a" });
  });

  it("removes a group with everything under it", () => {
    let tree = treeOf(node("group", "g1"), node("file", "keep"));
    tree = insertNode(tree, "g1", node("file", "a"));
    const { tree: after, removed } = removeNode(tree, "g1");
    expect(rootIds(after)).toEqual(["keep"]);
    expect(removed.kind).toBe("group");
    expect(findNode(after, "a")).toBeUndefined();
  });

  it("refuses an unknown id", () => {
    expect(() => removeNode(emptyBookmarkTree(NOW), "ghost")).toThrowError(/ghost/u);
  });
});

describe("renameNode", () => {
  it("renames in place, keeping the id and the position", () => {
    const tree = treeOf(node("file", "a"), node("file", "b"));
    const after = renameNode(tree, "a", "renamed");
    expect(rootIds(after)).toEqual(["a", "b"]);
    expect(findNode(after, "a")).toMatchObject({ name: "renamed" });
  });

  it("trims the new name", () => {
    const after = renameNode(treeOf(node("file", "a")), "a", "  spaced  ");
    expect(findNode(after, "a")).toMatchObject({ name: "spaced" });
  });

  it("refuses an empty name", () => {
    expect(() => renameNode(treeOf(node("file", "a")), "a", "   ")).toThrowError(/name/u);
  });

  it("refuses an unknown id", () => {
    expect(() => renameNode(emptyBookmarkTree(NOW), "ghost", "x")).toThrowError(/ghost/u);
  });
});

describe("moveNode", () => {
  it("moves a node into a group", () => {
    let tree = treeOf(node("group", "g1"), node("file", "a"));
    tree = moveNode(tree, "a", "g1");
    expect(rootIds(tree)).toEqual(["g1"]);
    expect(childIds(tree, "g1")).toEqual(["a"]);
  });

  it("moves a node back out to the root", () => {
    let tree = treeOf(node("group", "g1"));
    tree = insertNode(tree, "g1", node("file", "a"));
    tree = moveNode(tree, "a", null);
    expect(rootIds(tree)).toEqual(["g1", "a"]);
    expect(childIds(tree, "g1")).toEqual([]);
  });

  it("moves a group into another group", () => {
    let tree = treeOf(node("group", "g1"), node("group", "g2"));
    tree = moveNode(tree, "g2", "g1");
    expect(rootIds(tree)).toEqual(["g1"]);
    expect(childIds(tree, "g1")).toEqual(["g2"]);
  });

  it("refuses to move a group into itself", () => {
    const tree = treeOf(node("group", "g1"));
    expect(() => moveNode(tree, "g1", "g1")).toThrowError(/itself|descendant/u);
  });

  it("refuses to move a group into its own descendant", () => {
    let tree = treeOf(node("group", "g1"));
    tree = insertNode(tree, "g1", node("group", "g2"));
    expect(() => moveNode(tree, "g1", "g2")).toThrowError(/itself|descendant/u);
  });

  it("refuses a target that is not a group", () => {
    const tree = treeOf(node("file", "a"), node("file", "b"));
    expect(() => moveNode(tree, "a", "b")).toThrowError(/group/u);
  });

  it("refuses an unknown node", () => {
    expect(() => moveNode(treeOf(node("group", "g1")), "ghost", "g1")).toThrowError(/ghost/u);
  });

  it("honours an index inside the new parent", () => {
    let tree = treeOf(node("group", "g1"), node("file", "a"), node("file", "b"));
    tree = moveNode(tree, "b", "g1", 0);
    tree = moveNode(tree, "a", "g1", 0);
    expect(childIds(tree, "g1")).toEqual(["a", "b"]);
  });
});

describe("sortByCreatedAt", () => {
  it("sorts ascending without touching the input array", () => {
    const nodes = [node("file", "late", 30), node("file", "early", 10), node("file", "mid", 20)];
    const original = [...nodes];
    expect(sortByCreatedAt(nodes).map(entry => entry.id)).toEqual(["early", "mid", "late"]);
    expect(nodes).toEqual(original);
  });

  it("is stable for equal timestamps", () => {
    const nodes = [node("file", "a", 10), node("file", "b", 10), node("file", "c", 10)];
    expect(sortByCreatedAt(nodes).map(entry => entry.id)).toEqual(["a", "b", "c"]);
  });
});

describe("reorderChildren", () => {
  it("reorders the root", () => {
    const tree = treeOf(node("file", "a"), node("file", "b"), node("file", "c"));
    expect(rootIds(reorderChildren(tree, null, ["c", "a", "b"]))).toEqual(["c", "a", "b"]);
  });

  it("reorders inside a group", () => {
    let tree = treeOf(node("group", "g1"));
    tree = insertNode(tree, "g1", node("file", "a"));
    tree = insertNode(tree, "g1", node("file", "b"));
    expect(childIds(reorderChildren(tree, "g1", ["b", "a"]), "g1")).toEqual(["b", "a"]);
  });

  it("refuses an id set that does not match the children", () => {
    const tree = treeOf(node("file", "a"), node("file", "b"));
    expect(() => reorderChildren(tree, null, ["a"])).toThrowError(/exactly once/u);
    expect(() => reorderChildren(tree, null, ["a", "b", "ghost"])).toThrowError(/exactly once/u);
    // A repeated id is the same failure: the list must be a permutation.
    expect(() => reorderChildren(tree, null, ["a", "a"])).toThrowError(/exactly once/u);
  });

  it("refuses a parent that is not a group", () => {
    const tree = treeOf(node("file", "a"));
    expect(() => reorderChildren(tree, "a", ["a"])).toThrowError(/group/u);
  });
});

describe("flattenGroups", () => {
  it("walks groups depth first", () => {
    let tree = treeOf(node("group", "g1"), node("group", "g3"), node("file", "a"));
    tree = insertNode(tree, "g1", node("group", "g2"));
    tree = insertNode(tree, "g2", node("group", "g4"));
    expect(flattenGroups(tree).map((group: BookmarkGroup) => group.id)).toEqual(["g1", "g2", "g4", "g3"]);
  });

  it("answers no groups for a flat tree", () => {
    expect(flattenGroups(treeOf(node("file", "a")))).toEqual([]);
  });
});
