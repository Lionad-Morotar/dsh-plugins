/**
 * The bookmark tree's shape and its one validation gate.
 *
 * This module is shared by both halves and imports nothing: no DOM, no Cordis,
 * no schema library. The tree is plain JSON because it crosses the Typert
 * gateway and lands in the host's storage domain, so everything here is a type
 * guard over `unknown` rather than a class.
 *
 * `parseBookmarkTree` is deliberately strict and deliberately total: it either
 * returns a tree the model can operate on without further checks, or it throws
 * with a sentence naming the field that failed. A permissive parser would push
 * the same checks into every model function, and a silent one would let a
 * half-valid record reach the UI as a node with no path.
 */

/** The three things a bookmark can be. */
export type BookmarkKind = "group" | "file" | "folder";

/** What every node carries regardless of kind. */
export interface BookmarkNodeBase {
  readonly id: string;
  readonly kind: BookmarkKind;
  readonly name: string;
  /** Milliseconds since the epoch; the default insert order, not a sort key. */
  readonly createdAt: number;
}

/** A folder of bookmarks. Groups nest; that is the whole point of them. */
export interface BookmarkGroup extends BookmarkNodeBase {
  readonly kind: "group";
  readonly children: readonly BookmarkNode[];
}

/** A bookmarked file, addressed by workspace-relative path. */
export interface BookmarkFile extends BookmarkNodeBase {
  readonly kind: "file";
  readonly path: string;
}

/** A bookmarked directory, addressed by workspace-relative path. */
export interface BookmarkFolder extends BookmarkNodeBase {
  readonly kind: "folder";
  readonly path: string;
}

/** One bookmark, of whichever kind. */
export type BookmarkNode = BookmarkGroup | BookmarkFile | BookmarkFolder;

/**
 * One workspace's bookmarks.
 *
 * `roots` is the display order: the bar renders it as given, and a reorder is a
 * new array rather than a sort at read time. That is what lets a reader drag a
 * bookmark somewhere and have it stay there.
 */
export interface BookmarkTree {
  readonly version: 1;
  readonly roots: readonly BookmarkNode[];
  readonly updatedAt: string;
}

/** Domain name; snake_case because the host's `UNIT_NAME_RE` rejects dashes. */
export const BOOKMARK_DOMAIN_NAME = "dsh_fs_explorer";

/** The one table this domain owns. */
export const BOOKMARK_TABLE_NAME = "bookmarks";

/**
 * Deepest group nesting the parser accepts.
 *
 * A bound rather than a preference: the tree is walked recursively on every
 * render and every operation, and a record with a cycle or a pathological depth
 * would turn one corrupt write into a hung panel.
 */
export const MAX_BOOKMARK_DEPTH = 32;

/** Longest name a bookmark may carry. */
const MAX_NAME = 200;

/** Longest path a bookmark may carry. */
const MAX_PATH = 4096;

function fail(message: string): never {
  throw new Error(`bookmarks: ${message}`);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** A non-empty string after trimming, or the field name that failed. */
function requireText(value: unknown, field: string, max: number): string {
  if (typeof value !== "string") fail(`${field} must be a string`);
  const text = value.trim();
  if (text === "") fail(`${field} must not be empty`);
  if (text.length > max) fail(`${field} must be at most ${String(max)} characters`);
  return text;
}

/**
 * Read one node, rejecting anything the model cannot use.
 *
 * `seen` carries the ids already accepted so a duplicate is caught wherever it
 * appears: two nodes with one id would make every id-addressed operation pick
 * whichever it reached first, which is a bug that only shows up as "renaming one
 * renames the other".
 * @param value - the candidate node.
 * @param where - a human-readable position, for the message.
 * @param depth - nesting depth of this node, 1 for a root.
 * @param seen - ids already accepted in this tree.
 * @returns the normalized node.
 */
function parseNode(value: unknown, where: string, depth: number, seen: Set<string>): BookmarkNode {
  if (depth > MAX_BOOKMARK_DEPTH) {
    fail(`${where} is nested deeper than ${String(MAX_BOOKMARK_DEPTH)} levels`);
  }
  if (!isRecord(value)) fail(`${where} must be an object`);
  const id = requireText(value.id, `${where}.id`, MAX_NAME);
  if (seen.has(id)) fail(`duplicate id "${id}" at ${where}`);
  seen.add(id);
  const name = requireText(value.name, `${where}.name`, MAX_NAME);
  const createdAt = value.createdAt;
  if (typeof createdAt !== "number" || !Number.isFinite(createdAt)) {
    fail(`${where}.createdAt must be a finite number`);
  }

  const kind = value.kind;
  if (kind === "group") {
    const children = value.children;
    if (!Array.isArray(children)) fail(`${where}.children must be an array`);
    return {
      id,
      kind: "group",
      name,
      createdAt,
      children: children.map((child, index) => parseNode(child, `${where}.children[${String(index)}]`, depth + 1, seen)),
    };
  }
  if (kind === "file" || kind === "folder") {
    const path = requireText(value.path, `${where}.path`, MAX_PATH);
    return { id, kind, name, createdAt, path };
  }
  return fail(`${where}.kind must be "group", "file" or "folder"`);
}

/**
 * Validate one stored or received tree and return a normalized copy.
 *
 * The copy matters: callers hand the result to the model, whose operations build
 * new trees from it, and sharing structure with the caller's object would let a
 * later mutation reach back into whatever the caller still holds.
 * @param value - whatever came off the wire or out of storage.
 * @returns the tree, with every field trimmed and every child validated.
 * @throws when the value is not a bookmark tree; the message names the field.
 */
export function parseBookmarkTree(value: unknown): BookmarkTree {
  if (!isRecord(value)) fail("a bookmark tree must be an object");
  if (value.version !== 1) fail(`version must be 1, received ${JSON.stringify(value.version)}`);
  const updatedAt = requireText(value.updatedAt, "updatedAt", MAX_PATH);
  const roots = value.roots;
  if (!Array.isArray(roots)) fail("roots must be an array");
  const seen = new Set<string>();
  return {
    version: 1,
    roots: roots.map((node, index) => parseNode(node, `roots[${String(index)}]`, 1, seen)),
    updatedAt,
  };
}

/**
 * The domain declaration handed to `storageDomain.open()`.
 *
 * `valueSchema` is the wrapper the host reads, not a bare schema: `open()`
 * re-parses every stored record through `tables[name].valueSchema.parse`, and a
 * bare schema leaves that undefined, which stays hidden while the table is empty
 * and turns the first boot after a record lands into a fatal load failure.
 * `invalidRecords: "backup-and-skip"` opts into quarantine, so a schema change
 * degrades to a moved-aside record instead of a host that will not start.
 */
export const BOOKMARK_DOMAIN_SPEC = {
  name: BOOKMARK_DOMAIN_NAME,
  version: 1,
  invalidRecords: "backup-and-skip",
  tables: {
    [BOOKMARK_TABLE_NAME]: {
      valueSchema: { parse: parseBookmarkTree },
    },
  },
} as const;
