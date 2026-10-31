/**
 * Browser-half entry.
 *
 * The tint is a stylesheet, not a slot. The sidebar exposes no seat for a
 * workspace title (the seats under `sidebar.workspaces` are the section itself,
 * the directory flow and the session rows), so the only hook that covers every
 * workspace row is the row's `data-row-key` attribute. This half therefore
 * subscribes to the session list and the workspace list, folds each workspace's
 * members into one reading, and rewrites one `<style>` element.
 *
 * The painted object is the workspace title, not the session row: a workspace is
 * the level a human navigates by, and it is the level whose name has no freshness
 * fact of its own. Session rows are read here only as the factor behind that
 * reading.
 *
 * Nothing here renders React and nothing reads the DOM beyond the element it
 * owns. The data path is two snapshots plus two subscriptions; the workspace
 * subscription is what catches membership changes, because a session moving
 * between workspaces does not necessarily touch the session list.
 *
 * cordis calls `apply(ctx, config)` — the context first, this plugin's config
 * second. The context stays a context here; services come through `inject`.
 */
import {
  aggregateWorkspace,
  ageOf,
  opacityFor,
  readableRecord,
  resolveConfig,
  tierOf,
  type ActivityConfig,
  type SessionListWire,
} from "./reading.ts";
import { buildStylesheet, type WorkspaceRule } from "./rules.ts";
import { createWriter, type RowWriter } from "./writer.ts";

/** The services this half reads; declared so Cordis resolves them before mounting. */
export const inject = ["sessions", "workspaces"];

/** How often the clock is allowed to move a level without a host notification. */
const TICK_MS = 60_000;

/** The session list's observable face. */
export interface SessionsLike {
  readonly list: {
    getSnapshot(): SessionListWire;
    subscribe(listener: () => void): () => void;
  };
}

/** One workspace as the workspaces snapshot lists it. */
export interface WorkspaceItemWire {
  /** The workspace's id, which is also its row key; the ungrouped bucket has none. */
  readonly workspaceId?: string;
  /** The workspace's member sessions, already filtered by access on the host. */
  readonly sessionIds?: readonly string[];
}

/** The slice of the workspaces snapshot this half reads. */
export interface WorkspaceSnapshotWire {
  /** The registry's workspaces; absent until the list has loaded. */
  readonly items?: readonly WorkspaceItemWire[];
}

/**
 * The workspaces service face.
 *
 * Its observable nests under `list`, exactly like `sessions.list`: `workspaces` is
 * the controller service and `list` is the snapshot source it publishes. Only
 * `items` is read; the archive set is deliberately ignored, because an archived
 * session still counts as a member when its workspace is folded.
 */
export interface WorkspacesLike {
  readonly list: {
    getSnapshot(): WorkspaceSnapshotWire;
    subscribe(listener: () => void): () => void;
  };
}

/** The slice of the client context this entry uses. */
export interface ClientContextLike {
  readonly sessions: SessionsLike;
  readonly workspaces: WorkspacesLike;
}

/**
 * Read the workspace items out of the workspaces snapshot.
 *
 * A snapshot that has not loaded, or one whose container a host upgrade re-homed,
 * reads as no workspaces rather than as an error: the tint then paints nothing and
 * recovers on the next readable snapshot.
 * @param workspaces - the injected workspaces service.
 * @returns the items, or an empty list when the snapshot carries none.
 */
function workspaceItems(workspaces: WorkspacesLike): readonly unknown[] {
  const items = readableRecord(workspaces.list.getSnapshot())?.items;
  return Array.isArray(items) ? items : [];
}

/**
 * Mount the workspace title tint.
 *
 * The recompute is coalesced through a microtask because one host change can
 * notify several times (a list refresh plus a projection settle), and every write
 * replaces the whole stylesheet. One microtask hop turns a burst into one table.
 * @param ctx - client root context.
 * @param config - the loader row's overrides, if any.
 * @returns the disposer releasing both subscriptions, the tick and the stylesheet.
 */
export function apply(ctx: ClientContextLike, config?: Partial<ActivityConfig>): () => void {
  const resolved = resolveConfig(config);
  if (!resolved.enabled) return () => {};

  const writer: RowWriter = createWriter(document);
  let scheduled = false;
  let disposed = false;

  const recompute = (): void => {
    const list = ctx.sessions.list.getSnapshot();
    const now = Date.now();
    const rows: WorkspaceRule[] = [];
    // A snapshot whose items cannot be read paints nothing rather than throwing:
    // this runs in a microtask, where a throw would become an uncaught error and
    // leave the table frozen for every workspace.
    for (const entry of workspaceItems(ctx.workspaces)) {
      const item = readableRecord(entry);
      const workspaceId = item?.workspaceId;
      // The ungrouped bucket is not a workspace and has no row key of its own.
      if (typeof workspaceId !== "string" || workspaceId === "") continue;
      const reading = aggregateWorkspace(list, item?.sessionIds);
      // An empty or wholly unresolvable workspace is left alone rather than
      // painted from a guess: a freshly created one must not start out dim.
      if (reading === undefined) continue;
      const tier = tierOf({ reading, running: reading.running, updatedAt: undefined, now, config: resolved });
      if (tier === "none") continue;
      const age = ageOf({ reading, updatedAt: undefined, now });
      rows.push({
        workspaceId,
        tier,
        opacity: tier === "dim" && age !== undefined ? opacityFor(age, resolved) : 1,
      });
    }
    writer.update(buildStylesheet(rows, resolved));
  };

  const schedule = (): void => {
    if (scheduled || disposed) return;
    scheduled = true;
    queueMicrotask(() => {
      scheduled = false;
      if (disposed) return;
      recompute();
    });
  };

  const unsubscribeSessions = ctx.sessions.list.subscribe(schedule);
  const unsubscribeWorkspaces = ctx.workspaces.list.subscribe(schedule);
  const timer = setInterval(schedule, TICK_MS);
  schedule();

  return () => {
    if (disposed) return;
    disposed = true;
    unsubscribeSessions();
    unsubscribeWorkspaces();
    clearInterval(timer);
    writer.dispose();
  };
}

/** The plugin object the loader mounts. */
export const clientPlugin = { name: "dsh-session-activity", inject, apply };

export default clientPlugin;
