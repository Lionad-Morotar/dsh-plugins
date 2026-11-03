/**
 * The bookmark tree's operations, as pure functions over immutable trees.
 *
 * Every function here returns a new tree and leaves its input untouched. That is
 * not stylistic: the store keeps an optimistic copy and a last-saved copy, and
 * an operation that edited in place would make those two the same object, so a
 * failed save could not be rolled back and a re-render could not tell whether
 * anything changed.
 *
 * The array order is the display order. `sortByCreatedAt` exists for the "sort
 * by date added" gesture, not as a read-time rule: a reader who drags a bookmark
 * somewhere expects it to stay there.
 */
import type { BookmarkGroup, BookmarkKind, BookmarkNode, BookmarkTree } from "../bookmarks.ts";

/** Where a new node goes: a group id, or null for the root. */
export type BookmarkParentId = string | null;

/** What one node needs to be created. */
export interface NewNodeInput {
  readonly id: string;
  readonly name: string;
  /** Required for `file` and `folder`, ignored for `group`. */
  readonly path?: string;
  readonly createdAt: number;
}

function fail(message: string): never {
  throw new Error(`bookmarks: ${message}`);
}

/** A fresh, empty tree stamped with the caller's clock. */
export function emptyBookmarkTree(now: string): BookmarkTree {
  return { version: 1, roots: [], updatedAt: now };
}

/**
 * Build one node.
 *
 * A group starts with no children; a file or folder without a path is refused
 * here rather than at render time, because a pathless bookmark is a row that
 * cannot be clicked and there is nothing useful to show for it.
 * @param kind - which of the three things this is.
 * @param input - identity, name, creation time and (for leaves) the path.
 * @returns the node.
 */
export function makeNode(kind: BookmarkKind, input: NewNodeInput): BookmarkNode {
  const name = input.name.trim();
  if (name === "") fail("a node needs a non-empty name");
  if (kind === "group") {
    return { id: input.id, kind: "group", name, createdAt: input.createdAt, children: [] };
  }
  const path = typeof input.path === "string" ? input.path.trim() : "";
  if (path === "") fail(`a ${kind} bookmark needs a non-empty path`);
  return { id: input.id, kind, name, createdAt: input.createdAt, path };
}

/** Depth-first walk over every node, parents before children. */
function walk(nodes: readonly BookmarkNode[], visit: (node: BookmarkNode, parent: BookmarkParentId) => void, parent: BookmarkParentId = null): void {
  for (const node of nodes) {
    visit(node, parent);
    if (node.kind === "group") walk(node.children, visit, node.id);
  }
}

/** Find one node anywhere in the tree. */
export function findNode(tree: BookmarkTree, id: string): BookmarkNode | undefined {
  let found: BookmarkNode | undefined;
  walk(tree.roots, node => {
    if (node.id === id) found = node;
  });
  return found;
}

/**
 * The id of the group holding one node.
 * @returns the parent id, null for a root node, undefined when the id is unknown.
 */
export function findParentId(tree: BookmarkTree, id: string): BookmarkParentId | undefined {
  let found: BookmarkParentId | undefined;
  walk(tree.roots, (node, parent) => {
    if (node.id === id) found = parent;
  });
  return found;
}

/** Whether one group is `candidate` or sits anywhere under it. */
function contains(group: BookmarkGroup, candidate: string): boolean {
  if (group.id === candidate) return true;
  return group.children.some(child => child.kind === "group" && contains(child, candidate));
}

/** The children list of one parent, or a refusal. */
function childrenOf(tree: BookmarkTree, parentId: BookmarkParentId): readonly BookmarkNode[] {
  if (parentId === null) return tree.roots;
  const parent = findNode(tree, parentId);
  if (parent === undefined) fail(`no group with id "${parentId}"`);
  if (parent.kind !== "group") fail(`"${parentId}" is not a group`);
  return parent.children;
}

/** Clamp one insertion index into `[0, length]`. */
function clampIndex(index: number | undefined, length: number): number {
  if (index === undefined || !Number.isFinite(index)) return length;
  return Math.min(Math.max(0, Math.trunc(index)), length);
}

/**
 * Rebuild the tree with one parent's children replaced.
 *
 * A rebuild rather than a mutation: every ancestor of the changed group is
 * copied, so the returned tree shares nothing mutable with the input.
 * @param nodes - the list being rewritten.
 * @param parentId - which group owns it, null for the root.
 * @param replace - produces the new children of that list.
 * @returns the new roots.
 */
function rewrite(
  nodes: readonly BookmarkNode[],
  parentId: BookmarkParentId,
  replace: (children: readonly BookmarkNode[]) => readonly BookmarkNode[],
): readonly BookmarkNode[] {
  if (parentId === null) return replace(nodes);
  return nodes.map(node => {
    if (node.kind !== "group") return node;
    if (node.id === parentId) return { ...node, children: replace(node.children) };
    return { ...node, children: rewrite(node.children, parentId, replace) };
  });
}

/** Stamp a changed tree with a fresh `updatedAt`. */
function touched(tree: BookmarkTree, roots: readonly BookmarkNode[], now: string): BookmarkTree {
  return { version: 1, roots, updatedAt: now };
}

/** The clock the model stamps writes with; injectable so a test can pin it. */
export type Clock = () => string;

const realClock: Clock = () => new Date().toISOString();

/**
 * Insert one node under a parent.
 * @param tree - the tree to copy.
 * @param parentId - the owning group, or null for the root.
 * @param node - the node to insert; its id must be unused.
 * @param index - where among the siblings; out-of-range values clamp to the end.
 * @param now - the timestamp to stamp; defaults to the wall clock.
 * @returns the new tree.
 */
export function insertNode(
  tree: BookmarkTree,
  parentId: BookmarkParentId,
  node: BookmarkNode,
  index?: number,
  now: Clock = realClock,
): BookmarkTree {
  const siblings = childrenOf(tree, parentId);
  if (findNode(tree, node.id) !== undefined) fail(`a node with id "${node.id}" already exists`);
  const at = clampIndex(index, siblings.length);
  const roots = rewrite(tree.roots, parentId, children => [
    ...children.slice(0, at),
    node,
    ...children.slice(at),
  ]);
  return touched(tree, roots, now());
}

/**
 * Remove one node, subtree and all.
 * @returns the new tree and the node that left it.
 */
export function removeNode(
  tree: BookmarkTree,
  id: string,
  now: Clock = realClock,
): { readonly tree: BookmarkTree; readonly removed: BookmarkNode } {
  const removed = findNode(tree, id);
  if (removed === undefined) fail(`no node with id "${id}"`);
  const parentId = findParentId(tree, id);
  if (parentId === undefined) fail(`no node with id "${id}"`);
  const roots = rewrite(tree.roots, parentId, children => children.filter(child => child.id !== id));
  return { tree: touched(tree, roots, now()), removed };
}

/**
 * Rename one node.
 * @param name - the new name; surrounding space is trimmed and an empty result is refused.
 */
export function renameNode(tree: BookmarkTree, id: string, name: string, now: Clock = realClock): BookmarkTree {
  const trimmed = name.trim();
  if (trimmed === "") fail("a node needs a non-empty name");
  if (findNode(tree, id) === undefined) fail(`no node with id "${id}"`);
  const rename = (nodes: readonly BookmarkNode[]): readonly BookmarkNode[] =>
    nodes.map(node => {
      const next = node.id === id ? { ...node, name: trimmed } : node;
      return next.kind === "group" ? { ...next, children: rename(next.children) } : next;
    });
  return touched(tree, rename(tree.roots), now());
}

/**
 * Move one node to another parent.
 *
 * A group cannot land inside itself or its own descendant: the tree would then
 * contain a cycle, and every walk in this module would either loop forever or
 * silently drop the moved subtree.
 * @param targetParentId - the destination group, or null for the root.
 * @param index - where among the new siblings; out-of-range values clamp to the end.
 */
export function moveNode(
  tree: BookmarkTree,
  id: string,
  targetParentId: BookmarkParentId,
  index?: number,
  now: Clock = realClock,
): BookmarkTree {
  const node = findNode(tree, id);
  if (node === undefined) fail(`no node with id "${id}"`);
  const from = findParentId(tree, id);
  if (from === undefined) fail(`no node with id "${id}"`);

  if (targetParentId !== null) {
    const target = findNode(tree, targetParentId);
    if (target === undefined) fail(`no group with id "${targetParentId}"`);
    if (target.kind !== "group") fail(`"${targetParentId}" is not a group`);
    if (node.kind === "group" && contains(node, targetParentId)) {
      fail(`cannot move "${id}" into itself or its own descendant`);
    }
  }

  // Detach first, then insert: the destination index is measured against the
  // list the node is not in yet, which is what a reader dragging a row expects.
  const detached = rewrite(tree.roots, from, children => children.filter(child => child.id !== id));
  const target = childrenOf({ version: 1, roots: detached, updatedAt: tree.updatedAt }, targetParentId);
  const at = clampIndex(index, target.length);
  const roots = rewrite(detached, targetParentId, children => [
    ...children.slice(0, at),
    node,
    ...children.slice(at),
  ]);
  return touched(tree, roots, now());
}

/**
 * Sort one list by creation time, oldest first.
 *
 * Stable on purpose: two bookmarks added in the same millisecond keep the order
 * they were inserted in, which is the order the reader saw them appear in.
 * @param nodes - the list to copy.
 * @returns a new array; the input is untouched.
 */
export function sortByCreatedAt(nodes: readonly BookmarkNode[]): BookmarkNode[] {
  return nodes
    .map((node, index) => ({ node, index }))
    .sort((left, right) => left.node.createdAt - right.node.createdAt || left.index - right.index)
    .map(entry => entry.node);
}

/**
 * Replace one parent's child order.
 *
 * The id set must match the current children exactly. A partial list would
 * silently drop the ids it left out, and an extra id would name a node that is
 * not there; both are drag-and-drop bugs that only show up as "a bookmark
 * vanished after I moved another one".
 * @param orderedIds - every current child id, in the new order.
 */
export function reorderChildren(
  tree: BookmarkTree,
  parentId: BookmarkParentId,
  orderedIds: readonly string[],
  now: Clock = realClock,
): BookmarkTree {
  const children = childrenOf(tree, parentId);
  const current = new Set(children.map(child => child.id));
  const next = new Set(orderedIds);
  if (orderedIds.length !== children.length || next.size !== orderedIds.length) {
    fail(`the new order must name each of the ${String(children.length)} children exactly once`);
  }
  for (const id of orderedIds) {
    if (!current.has(id)) fail(`"${id}" is not a child of ${parentId ?? "the root"}`);
  }
  const byId = new Map(children.map(child => [child.id, child]));
  const roots = rewrite(tree.roots, parentId, () =>
    orderedIds.map(id => {
      const child = byId.get(id);
      if (child === undefined) fail(`"${id}" is not a child of ${parentId ?? "the root"}`);
      return child;
    }),
  );
  return touched(tree, roots, now());
}

/**
 * Every group, depth first, in display order.
 *
 * The bookmark picker renders this as a flat list of destinations, so the walk
 * order is the order the reader sees, not an alphabetical one.
 */
export function flattenGroups(tree: BookmarkTree): BookmarkGroup[] {
  const groups: BookmarkGroup[] = [];
  walk(tree.roots, node => {
    if (node.kind === "group") groups.push(node);
  });
  return groups;
}
