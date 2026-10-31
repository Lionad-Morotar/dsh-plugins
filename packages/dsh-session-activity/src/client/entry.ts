/**
 * Browser-half entry.
 *
 * The tint is a stylesheet, not a slot. The sidebar's row seats are gated to
 * exactly the rows this feature must leave alone (archived rows, and rows the
 * host is already showing live status for), so the only hook that covers every
 * session row is its `data-row-key` attribute. This half therefore subscribes to
 * the session list, decides each row's tier, and rewrites one `<style>` element.
 *
 * Nothing here renders React and nothing reads the DOM beyond the element it
 * owns. The data path is one snapshot plus one subscription; the workspaces
 * service is read for its archive set only, because archiving moves that set
 * without touching the session list.
 *
 * cordis calls `apply(ctx, config)` — the context first, this plugin's config
 * second. The context stays a context here; services come through `inject`.
 */
import {
  ageOf,
  opacityFor,
  resolveConfig,
  selectActivity,
  tierOf,
  type ActivityConfig,
  type SessionListWire,
} from "./reading.ts";
import { buildStylesheet, type RowRule } from "./rules.ts";
import { createWriter, type RowWriter } from "./writer.ts";

/** The services this half reads; declared so Cordis resolves them before mounting. */
export const inject = ["sessions", "workspaces"];

/** How often the clock is allowed to move a row without a host notification. */
const TICK_MS = 60_000;

/** The session list's observable face. */
export interface SessionsLike {
  readonly list: {
    getSnapshot(): SessionListWire;
    subscribe(listener: () => void): () => void;
  };
}

/** The slice of the workspaces snapshot this half reads. */
export interface WorkspaceSnapshotWire {
  /** The registry-global archive set; absent until the list has loaded. */
  readonly archivedSessionIds?: readonly string[];
}

/**
 * The workspaces service face.
 *
 * Its observable nests under `list`, exactly like `sessions.list`: `workspaces` is
 * the controller service and `list` is the snapshot source it publishes. The
 * archive set is the only field this half reads.
 */
export interface WorkspacesLike {
  readonly list: {
    getSnapshot(): WorkspaceSnapshotWire;
  };
}

/** The slice of the client context this entry uses. */
export interface ClientContextLike {
  readonly sessions: SessionsLike;
  readonly workspaces: WorkspacesLike;
}

/**
 * Read the archive set out of the workspaces snapshot.
 *
 * Read on every recompute rather than cached: archiving changes this set without
 * changing the session list, and this slice deliberately does not subscribe to
 * the workspaces service. The 60 second tick is therefore also the bound on how
 * long a freshly archived row can keep its colour. A snapshot that has not loaded
 * reads as nothing archived, which matches the host's own default rendering.
 * @param workspaces - the injected workspaces service.
 * @returns the archived session ids.
 */
function archivedSessionIds(workspaces: WorkspacesLike): ReadonlySet<string> {
  const ids = workspaces.list.getSnapshot().archivedSessionIds;
  if (!Array.isArray(ids)) return new Set();
  return new Set(ids);
}

/**
 * Mount the row tint.
 *
 * The recompute is coalesced through a microtask because one host change can
 * notify several times (a list refresh plus a projection settle), and every write
 * replaces the whole stylesheet. One microtask hop turns a burst into one table.
 * @param ctx - client root context.
 * @param config - the loader row's overrides, if any.
 * @returns the disposer releasing the subscription, the tick and the stylesheet.
 */
export function apply(ctx: ClientContextLike, config?: Partial<ActivityConfig>): () => void {
  const resolved = resolveConfig(config);
  if (!resolved.enabled) return () => {};

  const writer: RowWriter = createWriter(document);
  let scheduled = false;
  let disposed = false;

  const recompute = (): void => {
    const list = ctx.sessions.list.getSnapshot();
    const archived = archivedSessionIds(ctx.workspaces);
    const now = Date.now();
    const rows: RowRule[] = [];
    for (const sessionId of Object.keys(list.byId)) {
      const summary = list.byId[sessionId];
      if (summary === undefined) continue;
      const reading = selectActivity(list, sessionId);
      const updatedAt = summary.updatedAt;
      const tier = tierOf({ reading, running: summary.running === true, updatedAt, now, config: resolved });
      if (tier === "none") continue;
      const age = ageOf({ reading, updatedAt, now });
      rows.push({
        sessionId,
        tier,
        opacity: tier === "dim" && age !== undefined ? opacityFor(age, resolved) : 1,
        archived: archived.has(sessionId),
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

  const unsubscribe = ctx.sessions.list.subscribe(schedule);
  const timer = setInterval(schedule, TICK_MS);
  schedule();

  return () => {
    if (disposed) return;
    disposed = true;
    unsubscribe();
    clearInterval(timer);
    writer.dispose();
  };
}

/** The plugin object the loader mounts. */
export const clientPlugin = { name: "dsh-session-activity", inject, apply };

export default clientPlugin;
