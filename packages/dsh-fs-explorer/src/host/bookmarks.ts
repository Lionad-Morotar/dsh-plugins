/**
 * Bookmark persistence behind the host `storageDomain` service.
 *
 * Storage lands in the host's own store under `~/.dsh/storages/` rather than in
 * the user's repository: the product promise is that bookmarking a file never
 * dirties `git status`. A missing service degrades to null, and the client half
 * falls back to localStorage, so a deployment without host storage still has
 * working bookmarks for the session.
 *
 * The structural slices below are the same shape `dsh-arch` uses for the same
 * service, kept local so this package does not depend on that one.
 */
import { BOOKMARK_DOMAIN_SPEC, BOOKMARK_TABLE_NAME, parseBookmarkTree, type BookmarkTree } from "../bookmarks.ts";

/** Structural slice of one storage-domain table. */
export interface BookmarkTableFace {
  get(key: string): unknown;
  put(key: string, value: unknown): Promise<void>;
  delete(key: string): Promise<void>;
  entries(): IterableIterator<[string, unknown]>;
}

/** Structural slice of the `storageDomain` service. */
export interface BookmarkStorageDomainFace {
  open(spec: unknown): Promise<{
    table(name: string): BookmarkTableFace;
    close(): Promise<void>;
  }>;
}

/** What the rest of the host half uses. */
export interface BookmarkStore {
  /** One workspace's tree, or null when there is none or it cannot be read. */
  load(key: string): Promise<BookmarkTree | null>;
  save(key: string, tree: BookmarkTree): Promise<void>;
  close(): Promise<void>;
}

/**
 * Open the bookmark store, or degrade to null.
 *
 * `load` answers null for a record the parser rejects instead of throwing: a
 * corrupt record is one workspace's bookmarks, and taking the host down over it
 * would cost the reader every other panel too. The domain's own
 * `invalidRecords: "backup-and-skip"` catches most of this at open time; this is
 * the second line, for a record that parsed when it was written and does not
 * parse now.
 *
 * `save` parses before writing for the same reason `dsh-arch` does: the write
 * path does not validate, so a tree the load-time schema would reject becomes a
 * record that has to be quarantined on the next boot.
 * @param storageDomain - the host service if present; absence is a supported composition.
 * @returns the store, or null when this host has no storage domain.
 */
export async function openBookmarkStore(
  storageDomain?: BookmarkStorageDomainFace,
): Promise<BookmarkStore | null> {
  if (storageDomain === undefined) return null;
  const domain = await storageDomain.open(BOOKMARK_DOMAIN_SPEC);
  const table = domain.table(BOOKMARK_TABLE_NAME);
  return {
    async load(key) {
      const stored = table.get(key);
      if (stored === undefined || stored === null) return null;
      try {
        return parseBookmarkTree(stored);
      } catch {
        // A record this build cannot read is absent, not fatal.
        return null;
      }
    },
    async save(key, tree) {
      await table.put(key, parseBookmarkTree(tree));
    },
    async close() {
      await domain.close();
    },
  };
}
