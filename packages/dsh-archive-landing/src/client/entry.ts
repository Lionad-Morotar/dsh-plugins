/**
 * Browser half of dsh-archive-landing.
 *
 * Archiving the current session is the one moment the host empties the main view
 * on purpose: `uiWorkspace.archiveSession` writes the registry and then calls its
 * private `clearMain()`, which releases the main reference, sets `selection` to
 * `{}` and clears the panel. The `/archive` command reaches the same place
 * through `watchNavigation.reconcile` → `clearArchivedCurrent()` → `clearMain()`.
 * Neither path chooses a successor, so without this half the page is left with no
 * session at all.
 *
 * The host publishes everything needed to choose one. `uiWorkspace.selection` is
 * a snapshot store, `uiWorkspace.workspaces.list` is the workspace controller's
 * snapshot (membership plus the registry-wide archive set), and `openSession` /
 * `startSession` are public navigation. The only fact with no store behind it is
 * the row order the user actually saw, which lives in the sidebar DOM; it is read
 * synchronously from the archive notification, before React repaints the
 * archived row away.
 *
 * @module dsh-archive-landing
 */
import { chooseLanding, type Landing } from "./landing.ts";

/** One snapshot source as the host publishes it. */
interface SnapshotStore<T = unknown> {
  /** The current snapshot; the host returns a cached object. */
  getSnapshot(): T;
  /** Listen for snapshot changes; the base store has no granular selectors. */
  subscribe(listener: () => void): () => void;
}

/**
 * `uiWorkspace` as this package uses it.
 *
 * `selection`, `workspaces` and `sessions` are instance fields on the host's
 * shipped client, not a documented public API: the TypeScript source marks the
 * first two private while the built bundle keeps the names. This package reads
 * that runtime shape deliberately and the README names the risk; the wire stays
 * this narrow so a host rename fails in one place.
 */
export interface UiWorkspaceWire {
  /** The persisted "current session" snapshot, `{}` once the host clears it. */
  readonly selection: SnapshotStore;
  /** The workspace controller whose `list` snapshot carries membership and archives. */
  readonly workspaces: { readonly list: SnapshotStore };
  /** The session registry; its snapshot carries the ids, including ungrouped ones. */
  readonly sessions: { readonly list: SnapshotStore };
  /** Show a session's conversation; cross-workspace needs no extra step. */
  openSession(sessionId: string): void;
  /** Start (or reuse a blank) conversation, in `workspaceId` or the recent one. */
  startSession(workspaceId?: string): void;
}

/** The client context this plugin needs. */
export interface ClientContextWire {
  readonly uiWorkspace: UiWorkspaceWire;
  /** The loader's effect host; the returned disposer releases the subscriptions. */
  effect(callback: () => () => void, label?: string): void;
}

/** The host marks each sidebar session row with `session:<id>`. */
const ROW_SELECTOR = '[data-row-key^="session:"]';
const ROW_PREFIX = "session:";

/** The host's list phase after the baseline has arrived; earlier phases carry no usable set. */
const READY_PHASE = "ready";

/** The session the user was last looking at, and where its workspace lives. */
interface Origin {
  readonly sessionId: string;
  readonly workspaceId?: string;
}

/**
 * Read a plain object without trusting the host's runtime shape.
 * @param value - any snapshot or field value.
 * @returns the object, or undefined for anything else.
 */
function asRecord(value: unknown): Record<string, unknown> | undefined {
  return typeof value === "object" && value !== null ? (value as Record<string, unknown>) : undefined;
}

/**
 * Keep only a non-empty string id.
 * @param value - a candidate id.
 * @returns the id, or undefined.
 */
function asId(value: unknown): string | undefined {
  return typeof value === "string" && value !== "" ? value : undefined;
}

/**
 * Read a string-array field defensively.
 * @param value - the field.
 * @returns its non-empty string entries.
 */
function asIds(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((entry): entry is string => asId(entry) !== undefined) : [];
}

/**
 * Read the workspace items out of the snapshot.
 * @param snapshot - the `workspaces.list` snapshot.
 * @returns the readable items, or an empty list.
 */
function itemsOf(snapshot: unknown): Record<string, unknown>[] {
  const raw = asRecord(snapshot)?.items;
  if (!Array.isArray(raw)) return [];
  return raw.flatMap((entry) => {
    const item = asRecord(entry);
    return item === undefined ? [] : [item];
  });
}

/**
 * Read the session id out of the selection snapshot.
 * @param snapshot - the `selection` snapshot.
 * @returns the id, or undefined when the host cleared the selection.
 */
function selectedId(snapshot: unknown): string | undefined {
  return asId(asRecord(snapshot)?.sessionId);
}

/**
 * Find the workspace that lists a session.
 *
 * Archived sessions stay in their workspace's `sessionIds`, so this still
 * resolves the archived session's workspace after the archive lands.
 * @param snapshot - the `workspaces.list` snapshot.
 * @param sessionId - the session to locate.
 * @returns the workspace id, or undefined for an ungrouped session.
 */
function workspaceIdOf(snapshot: unknown, sessionId: string): string | undefined {
  for (const item of itemsOf(snapshot)) {
    if (asIds(item.sessionIds).includes(sessionId)) return asId(item.workspaceId);
  }
  return undefined;
}


/**
 * Read the registry-wide archive set, but only once the list is ready.
 *
 * A pending snapshot still carries an empty array, and treating it as a baseline
 * would make every session archived before this page loaded look newly archived.
 * @param snapshot - the `workspaces.list` snapshot.
 * @returns the set, or undefined while the snapshot is not usable as a baseline.
 */
function archiveSetOf(snapshot: unknown): ReadonlySet<string> | undefined {
  const root = asRecord(snapshot);
  if (root === undefined || root.phase !== READY_PHASE) return undefined;
  if (!Array.isArray(root.archivedSessionIds)) return undefined;
  return new Set(asIds(root.archivedSessionIds));
}


/**
 * Read the sidebar's painted session rows, top to bottom.
 * @returns the ids in visual order, or an empty list outside a browser.
 */
function paintedOrder(): string[] {
  if (typeof document === "undefined") return [];
  const ids: string[] = [];
  for (const row of document.querySelectorAll(ROW_SELECTOR)) {
    const key = row.getAttribute("data-row-key");
    if (key === null || !key.startsWith(ROW_PREFIX)) continue;
    const id = key.slice(ROW_PREFIX.length);
    if (id !== "") ids.push(id);
  }
  return ids;
}

/**
 * Drop repeated ids while keeping the first position.
 * @param ids - the candidate order.
 * @returns the same order without duplicates.
 */
function unique(ids: readonly string[]): string[] {
  const seen = new Set<string>();
  return ids.filter((id) => {
    if (seen.has(id)) return false;
    seen.add(id);
    return true;
  });
}

/**
 * The ids that belong to no workspace.
 * @param snapshot - the `workspaces.list` snapshot.
 * @param sessions - the `sessions.list` snapshot.
 * @returns the ungrouped ids.
 */
function ungroupedIds(snapshot: unknown, sessions: unknown): string[] {
  const grouped = new Set(itemsOf(snapshot).flatMap((item) => asIds(item.sessionIds)));
  return asIds(asRecord(sessions)?.ids).filter((id) => !grouped.has(id));
}

/**
 * Build the pre-archive order the landing rule reads.
 *
 * The painted rows are the actual visible order, and they are the base: flat
 * and tree groupings interleave the workspace groups in ways the list order
 * cannot reproduce, and reading the visual order is the only way those stay
 * right. What the painted order is missing are the members the host folded
 * behind a group's watermark: those are inserted after the group's last
 * painted row, or before the next painted group's first row when the group
 * itself has no painted row. That keeps the hidden part of every group at the
 * group's own position instead of treating an upper group as "next".
 *
 * The before snapshot decides membership; a workspace that first appears in
 * the after snapshot is used when the current session was not in the before
 * list at all. Already archived sessions are not landing targets; the current
 * one stays so its position resolves.
 * @param before - the list snapshot from before this archive.
 * @param after - the list snapshot that announced the archive.
 * @param current - the session being archived.
 * @param archived - the archive set after this archive.
 * @param sessions - the `sessions.list` snapshot for ungrouped ids.
 * @returns session ids in pre-archive sidebar order.
 */
function landingOrder(
  before: unknown,
  after: unknown,
  current: string,
  archived: ReadonlySet<string>,
  sessions: unknown,
): string[] {
  const painted = unique(paintedOrder()).filter((id) => id === current || !archived.has(id));
  const groupsOf = (snapshot: unknown): string[][] => [
    ...itemsOf(snapshot).map((item) => asIds(item.sessionIds)),
    ungroupedIds(snapshot, sessions),
  ];
  const beforeGroups = groupsOf(before);
  const groups = beforeGroups.some((members) => members.includes(current)) ? beforeGroups : groupsOf(after);

  // Nothing painted (a narrow rail, search, or a headless mount): the group
  // data order is the documented fallback and still has to contain the current
  // session for its neighbour to resolve.
  if (!painted.includes(current)) {
    return unique(groups.flatMap((members) => members)).filter(
      (id) => id === current || !archived.has(id),
    );
  }

  const order = painted.slice();
  const placed = new Set(order);
  for (const members of groups) {
    const hidden = members.filter((id) => !placed.has(id) && !archived.has(id));
    for (const id of members) placed.add(id);
    if (hidden.length === 0) continue;
    const paintedAt = members.map((id) => order.indexOf(id)).filter((index) => index >= 0);
    if (paintedAt.length > 0) {
      order.splice(Math.max(...paintedAt) + 1, 0, ...hidden);
      continue;
    }
    // The group has no painted row: it sits above or below the painted rows
    // as a whole. Put it before the next painted group's first row, or at the
    // end when no later group is painted.
    let insertAt = order.length;
    const groupIndex = groups.indexOf(members);
    for (let later = groupIndex + 1; later < groups.length; later += 1) {
      const group = groups[later];
      if (group === undefined) continue;
      const first = group
        .map((id) => order.indexOf(id))
        .filter((index) => index >= 0)
        .sort((a, b) => a - b)[0];
      if (first !== undefined) {
        insertAt = first;
        break;
      }
    }
    order.splice(insertAt, 0, ...hidden);
  }
  return order;
}

/**
 * Watch archives and move the main view to the archived session's neighbour.
 *
 * The host announces the archive before it clears the view, so the row order is
 * snapped from the DOM inside the notification and the navigation itself is
 * deferred one tick, after `clearMain()` has landed. A selection the user moved
 * in between wins; this half only fills the empty view.
 * @param uiWorkspace - the host client service.
 * @returns the disposer releasing both subscriptions and any pending landing.
 */
export function mountLanding(uiWorkspace: UiWorkspaceWire): () => void {
  const selection = uiWorkspace.selection;
  const list = uiWorkspace.workspaces.list;
  const sessions = uiWorkspace.sessions.list;

  let origin: Origin | undefined;
  /** The archive set of the last usable snapshot; undefined until the baseline. */
  let baseline: ReadonlySet<string> | undefined;
  /** The snapshot the previous notification published, i.e. the pre-archive view. */
  let lastSnapshot: unknown;
  let timer: ReturnType<typeof setTimeout> | undefined;
  let emptyTimer: ReturnType<typeof setTimeout> | undefined;
  let disposed = false;

  const remember = (snapshot: unknown): void => {
    const sessionId = selectedId(snapshot);
    // `clearMain` publishes `{}`; it must not erase the session being archived.
    if (sessionId === undefined) return;
    origin = { sessionId, workspaceId: workspaceIdOf(list.getSnapshot(), sessionId) };
  };

  const settle = (choice: Landing, archivedId: string, workspaceId: string | undefined): void => {
    if (disposed) return;
    try {
      const selected = selectedId(selection.getSnapshot());
      // Anything other than the archived session means the user navigated first.
      if (selected !== undefined && selected !== archivedId) return;
      // The target may have been archived by a second client between planning
      // and this tick; opening it would land on an archived conversation.
      if (choice.kind === "open" && archiveSetOf(list.getSnapshot())?.has(choice.id) === true) return;
      if (choice.kind === "open") uiWorkspace.openSession(choice.id);
      else if (workspaceId === undefined) uiWorkspace.startSession();
      else uiWorkspace.startSession(workspaceId);
    } catch (error) {
      // A failed landing must not take the page down with it.
      console.warn("dsh-archive-landing: landing after archive failed", error);
    }
  };

  const plan = (current: Origin, before: unknown): void => {
    const snapshot = list.getSnapshot();
    const archived = archiveSetOf(snapshot);
    if (archived === undefined) return;
    const order = landingOrder(before, snapshot, current.sessionId, archived, sessions.getSnapshot());
    const choice = chooseLanding(order, current.sessionId);
    const workspaceId =
      workspaceIdOf(before, current.sessionId) ?? workspaceIdOf(snapshot, current.sessionId) ?? current.workspaceId;
    if (timer !== undefined) clearTimeout(timer);
    timer = setTimeout(() => {
      timer = undefined;
      settle(choice, current.sessionId, workspaceId);
    }, 0);
  };

  const onSelection = (): void => {
    const snapshot = selection.getSnapshot();
    if (selectedId(snapshot) !== undefined) {
      if (emptyTimer !== undefined) {
        clearTimeout(emptyTimer);
        emptyTimer = undefined;
      }
      remember(snapshot);
      return;
    }
    // `/archive` clears the selection before the archive notification, and the
    // landing still needs the origin. A clear with no archive behind it (for
    // example startSession() with no workspace) is a real navigation away.
    // One tick tells the two apart without losing either.
    if (emptyTimer !== undefined || timer !== undefined) return;
    emptyTimer = setTimeout(() => {
      emptyTimer = undefined;
      if (selectedId(selection.getSnapshot()) === undefined && timer === undefined) origin = undefined;
    }, 0);
  };

  const onList = (): void => {
    const snapshot = list.getSnapshot();
    const next = archiveSetOf(snapshot);
    if (next === undefined) return;
    const previous = baseline;
    const before = lastSnapshot;
    baseline = next;
    lastSnapshot = snapshot;
    // The first usable snapshot is the baseline, not an archive event: sessions
    // archived before this page loaded must not move the main view.
    if (previous === undefined) return;
    const current = origin;
    if (current === undefined) return;
    if (previous.has(current.sessionId) || !next.has(current.sessionId)) return;
    plan(current, before);
  };

  remember(selection.getSnapshot());
  lastSnapshot = list.getSnapshot();
  baseline = archiveSetOf(list.getSnapshot());
  const offSelection = selection.subscribe(onSelection);
  const offList = list.subscribe(onList);

  return () => {
    if (disposed) return;
    disposed = true;
    offSelection();
    offList();
    if (timer !== undefined) clearTimeout(timer);
    timer = undefined;
    if (emptyTimer !== undefined) clearTimeout(emptyTimer);
    emptyTimer = undefined;
  };
}

/**
 * Guard the mount against a second apply on the same module instance.
 *
 * The loader re-evaluates the bundle on a client-plugin hot reload, so this flag
 * only covers a double mount of one evaluated module; the disposer resets it.
 */
let mounted = false;

/** The plugin object the client ModuleLoader mounts. */
export const clientPlugin = {
  name: "dsh-archive-landing",
  inject: ["uiWorkspace"] as string[],
  /**
   * Subscribe to the host stores through the loader's effect host.
   * @param ctx - client context carrying `uiWorkspace`.
   */
  apply(ctx: ClientContextWire): void {
    if (mounted) return;
    mounted = true;
    ctx.effect(() => {
      let dispose: () => void;
      try {
        dispose = mountLanding(ctx.uiWorkspace);
      } catch (error) {
        // An unreadable host shape disables the landing, not the page.
        mounted = false;
        console.warn("dsh-archive-landing: unable to watch session archives", error);
        return () => {};
      }
      return () => {
        mounted = false;
        dispose();
      };
    }, "dsh-archive-landing: landing after archive");
  },
};

export default clientPlugin;
