/**
 * The bookmark store the client half reads and writes through.
 *
 * Two backends, one interface. The host's storage domain is the record of truth
 * when it exists: it survives a restart, it is shared by every session in the
 * same workspace, and it never touches the reader's repository. When it does not
 * exist (a deployment without `storageDomain`, an older host, a host whose call
 * failed) the same tree lives in localStorage instead.
 *
 * The rule that shapes every branch below is that bookmarks never fail loudly.
 * A missing backend, a corrupt record, a browser that refuses localStorage: each
 * leaves the reader with a working, possibly empty, tree. A bookmark bar that
 * throws on mount would take the whole panel with it, and the reader's actual
 * work is in the panel.
 */
import { emptyBookmarkTree } from "./bookmarks-model.ts";
import { parseBookmarkTree, type BookmarkTree } from "../bookmarks.ts";
import type { WorkspaceClient } from "./workspace-face.ts";

/** The store the bookmark surfaces use. */
export interface BookmarkStoreClient {
  /** One session's tree; never rejects, never answers null. */
  load(sessionId: string): Promise<BookmarkTree>;
  /** Replace one session's tree. Rejects only for a tree the parser refuses. */
  save(sessionId: string, tree: BookmarkTree): Promise<void>;
}

/** The localStorage key one session's fallback record lives under. */
function storageKey(sessionId: string): string {
  return `dsh-fs-explorer.bookmarks.${sessionId}`;
}

/**
 * localStorage, or undefined when this runtime has none or refuses access.
 *
 * `globalThis` rather than `window`: the same module runs in a browser, in a
 * test process and inside a Node-side bundle, and only the first of those has a
 * `window`. A private-mode browser throws on the property read itself, which is
 * why the access is inside the try.
 */
function storage(): Storage | undefined {
  try {
    return globalThis.localStorage ?? undefined;
  } catch {
    return undefined;
  }
}

/** Read one fallback record, or undefined when there is none or it is unusable. */
function readFallback(sessionId: string): BookmarkTree | undefined {
  const store = storage();
  if (store === undefined) return undefined;
  let raw: string | null;
  try {
    raw = store.getItem(storageKey(sessionId));
  } catch {
    return undefined;
  }
  if (raw === null) return undefined;
  try {
    return parseBookmarkTree(JSON.parse(raw));
  } catch {
    // A record this build cannot read is absent, not fatal: the reader keeps
    // whatever the host has, or an empty tree.
    return undefined;
  }
}

/** Write one fallback record, silently doing nothing when storage refuses. */
function writeFallback(sessionId: string, tree: BookmarkTree): void {
  const store = storage();
  if (store === undefined) return;
  try {
    store.setItem(storageKey(sessionId), JSON.stringify(tree));
  } catch {
    // A full or forbidden quota costs the fallback, not the session.
  }
}

/**
 * Build the store over one workspace channel.
 *
 * The channel is optional because a deployment can mount this panel without the
 * host half; every call then falls through to localStorage.
 * @param workspace - the workspace client, or undefined when the host has none.
 * @returns the store.
 */
export function createBookmarkStore(workspace: WorkspaceClient | undefined): BookmarkStoreClient {
  return {
    async load(sessionId) {
      const remote = workspace?.loadBookmarks;
      if (remote !== undefined) {
        try {
          const outcome = await remote.call(workspace, sessionId);
          // A null tree is a real answer: this workspace has no bookmarks yet.
          // It is not a reason to consult the fallback, which would resurrect a
          // record the host has deliberately never written.
          if (outcome.ok) return outcome.tree ?? emptyBookmarkTree(new Date().toISOString());
        } catch {
          // A transport failure is the same as no host: fall through.
        }
      }
      return readFallback(sessionId) ?? emptyBookmarkTree(new Date().toISOString());
    },

    async save(sessionId, tree) {
      // Parse before either backend: a tree the model cannot read is a bug in
      // the caller, and writing it would turn that bug into a corrupt record on
      // the next load.
      const parsed = parseBookmarkTree(tree);
      const remote = workspace?.saveBookmarks;
      if (remote !== undefined) {
        try {
          const outcome = await remote.call(workspace, sessionId, parsed);
          if (outcome.ok) return;
        } catch {
          // Fall through to the fallback rather than losing the write.
        }
      }
      writeFallback(sessionId, parsed);
    },
  };
}
