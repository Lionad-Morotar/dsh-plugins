/**
 * Directory paths for workspace rows.
 *
 * The host renders a workspace id on the row and keeps the directory only on
 * the workspaces snapshot, which a slot occupant receives as `useWorkspaces`.
 * No workspace-row slot exists, so a null-rendering occupant of the session-row
 * action slot publishes that snapshot here for the menu anchor to read.
 */
import { useEffect, type ReactElement } from "react";

/** One workspace the probe is willing to publish: an id paired with a directory. */
export interface WorkspacePathItem {
  readonly workspaceId: string;
  readonly path: string;
}

/** The slice of the host snapshot this probe understands. Everything else is ignored. */
interface WorkspaceSnapshot {
  readonly items: readonly unknown[];
}

/**
 * The host hook, narrowed to what the probe calls.
 *
 * The real hook is `useSyncExternalStore` over the workspaces list; only the
 * selector call matters here, and the snapshot it reads is guarded at runtime
 * because the host's shape is not a dependency of this package.
 */
export type UseWorkspaces = (selector: (snapshot: unknown) => unknown) => unknown;

export interface WorkspacePathStore {
  /** The directory recorded for this workspace, or null when the snapshot has none. */
  resolve(workspaceId: string): string | null;
  /** Replace the recorded directories. Listeners hear about it only when a pair changed. */
  publish(items: readonly WorkspacePathItem[]): void;
  /** Hear about a publish that changed the recorded directories. */
  subscribe(listener: () => void): () => void;
  /** Whether a snapshot has been published. False means the probe has not seen the hook yet. */
  readonly ready: boolean;
}

/** Compare by id, not by array position: the host reorders workspaces freely. */
function sameItems(left: readonly WorkspacePathItem[], right: readonly WorkspacePathItem[]): boolean {
  if (left.length !== right.length) return false;
  const byId = new Map(left.map((item) => [item.workspaceId, item.path]));
  return right.every((item) => byId.get(item.workspaceId) === item.path);
}

export function createWorkspacePathStore(): WorkspacePathStore {
  let items: readonly WorkspacePathItem[] = [];
  let ready = false;
  const listeners = new Set<() => void>();

  return {
    resolve(workspaceId) {
      return items.find((item) => item.workspaceId === workspaceId)?.path ?? null;
    },
    publish(next) {
      if (ready && sameItems(items, next)) return;
      items = next;
      ready = true;
      for (const listener of listeners) listener();
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    get ready() {
      return ready;
    },
  };
}

/** A snapshot the probe can read: an object whose `items` is an array. */
function snapshotItems(snapshot: unknown): readonly unknown[] | null {
  if (typeof snapshot !== "object" || snapshot === null || !("items" in snapshot)) return null;
  const { items } = snapshot as WorkspaceSnapshot;
  return Array.isArray(items) ? items : null;
}

/** Keep entries that name a workspace and its directory; drop the rest quietly. */
function readableItems(entries: readonly unknown[]): WorkspacePathItem[] {
  const items: WorkspacePathItem[] = [];
  for (const entry of entries) {
    if (typeof entry !== "object" || entry === null) continue;
    if (!("workspaceId" in entry) || !("path" in entry)) continue;
    const { workspaceId, path } = entry as { workspaceId: unknown; path: unknown };
    if (typeof workspaceId !== "string" || typeof path !== "string") continue;
    items.push({ workspaceId, path });
  }
  return items;
}

/**
 * A slot occupant that renders nothing and mirrors the workspaces snapshot.
 *
 * It occupies `sidebar.workspaces.session.row.action`, a list slot mounted on
 * every session row. Rendering null keeps the row's layout exactly as the host
 * laid it out; the snapshot is what the occupant is there for.
 */
export function createProbeComponent(store: WorkspacePathStore, useWorkspaces: UseWorkspaces): () => ReactElement | null {
  return function WorkspacePathProbe(): ReactElement | null {
    const snapshot = useWorkspaces((value) => value);
    useEffect(() => {
      const items = snapshotItems(snapshot);
      // No items yet is "not ready", which is distinct from an empty workspace list:
      // the anchor refuses to open a directory it cannot name.
      if (items === null) return;
      store.publish(readableItems(items));
    }, [snapshot]);
    return null;
  };
}
