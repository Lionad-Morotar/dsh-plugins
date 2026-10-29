/**
 * The reconciler: the single writer of mcp rows.
 *
 * Every mutation of an mcp row's `toolCallTimeoutMs` flows through here — sets
 * planned from the shadow namespace's current value, applied through the
 * configEditor's locked, format-preserving, hot-reloading edit path. Removals
 * never happen here (decision D5): an explicit reset owns that decision.
 *
 * Triggering rides the settings service's own `settings/document-updated`
 * event, filtered to this namespace, plus an initial sync at attach: the
 * panel, the command and a hand-edited-then-reloaded profile all converge on
 * the same one pass. Syncs are serialized and coalesced — the second trigger
 * while one pass is in flight waits, then plans against fresh state.
 */
import { planSync, type ShadowTimeouts, type SyncPlan } from "./plan.ts";
import { readMcpInventory } from "./inventory.ts";
import { toServerList, toTimeoutMap, type ServerEntry } from "./shadow.ts";
import type { EditingConfigEditorLike, SettingsServiceLike } from "./command.ts";

/** The settings event this reconciler rides. */
export const DOCUMENT_UPDATED_EVENT = "settings/document-updated";

/** The events surface a host context provides; injected so tests drive it. */
export interface EventsLike {
  on(event: string, handler: (...args: unknown[]) => void): () => void;
}

/** Minimal logger slice. */
export interface LoggerLike {
  info?(message: string): void;
  warn?(message: string): void;
  error?(message: string): void;
}

/** Everything the reconciler needs, injected. */
export interface ReconcilerDeps {
  readonly ns: string;
  readonly settings: SettingsServiceLike;
  readonly configEditor: EditingConfigEditorLike;
  readonly events: EventsLike;
  readonly logger?: LoggerLike;
}

/** One row the batch could not write, with the reason in words. */
export interface SyncFailure {
  readonly id: string;
  readonly error: string;
}

/** What one sync pass did. */
export interface SyncReport extends SyncPlan {
  readonly failures: readonly SyncFailure[];
}

/** Read the shadow map from fresh descriptors. */
async function readShadow(deps: ReconcilerDeps): Promise<ShadowTimeouts> {
  const descriptors = await deps.settings.describe();
  const own = Array.isArray(descriptors) ? descriptors.find(descriptor => descriptor.ns === deps.ns) : undefined;
  return toTimeoutMap((own?.value as { mcpTimeouts?: unknown } | undefined)?.mcpTimeouts);
}

/** Read the server list currently projected for the panel. */
async function readServerList(deps: ReconcilerDeps): Promise<ServerEntry[]> {
  const descriptors = await deps.settings.describe();
  const own = Array.isArray(descriptors) ? descriptors.find(descriptor => descriptor.ns === deps.ns) : undefined;
  return toServerList((own?.value as { mcpServers?: unknown } | undefined)?.mcpServers);
}

/** The live inventory, in the stored projection shape. */
function projectServers(inventory: ReturnType<typeof readMcpInventory>): ServerEntry[] {
  return inventory.map(row => ({ id: row.id, serverName: row.serverName, timeoutMs: row.effectiveTimeoutMs }));
}

/** Order-stable equality: the projection is written only when it actually moved. */
function sameServers(a: readonly ServerEntry[], b: readonly ServerEntry[]): boolean {
  return a.length === b.length && a.every((row, index) => {
    const other = b[index];
    return other !== undefined && row.id === other.id && row.serverName === other.serverName && row.timeoutMs === other.timeoutMs;
  });
}

/** Project the live server list into settings; skipped when the guard refuses (seeded profiles). */
async function projectServerList(deps: ReconcilerDeps, inventory: ReturnType<typeof readMcpInventory>, trigger: string): Promise<void> {
  const projected = projectServers(inventory);
  try {
    const stored = await readServerList(deps);
    if (sameServers(projected, stored)) return;
    await deps.settings.update(deps.ns, { mcpServers: projected });
  } catch (error) {
    // A seeded profile (this row's config comes from a home patch) refuses
    // every settings write by the combined-override guard — the same refusal
    // the shadow writes meet, so the panel degrades consistently.
    deps.logger?.info?.(`more-config: server list projection skipped (${trigger}): ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Build the reconciler. `attach()` wires the event listener and runs the
 * initial sync; `sync(trigger)` runs one pass on demand; `dispose()` unwires.
 */
export function createReconciler(deps: ReconcilerDeps) {
  let queue: Promise<unknown> = Promise.resolve();
  let off: (() => void) | undefined;

  const runPass = async (trigger: string): Promise<SyncReport> => {
    const shadow = await readShadow(deps);
    const inventory = readMcpInventory(deps.configEditor);
    const plan = planSync(shadow, inventory);
    const failures: SyncFailure[] = [];
    for (const set of plan.sets) {
      const row = inventory.find(candidate => candidate.id === set.id);
      if (row === undefined) continue;
      try {
        await deps.configEditor.edit(row.entry, current => ({ ...current, toolCallTimeoutMs: set.timeoutMs }));
      } catch (error) {
        failures.push({ id: set.id, error: error instanceof Error ? error.message : String(error) });
      }
    }
    if (plan.unknownKeys.length > 0) deps.logger?.warn?.(`more-config: shadow keys without mcp rows: ${plan.unknownKeys.join(", ")}`);
    if (plan.unmanaged.length > 0) {
      deps.logger?.info?.(`more-config: overrides not owned by the shadow (left untouched): ${plan.unmanaged.map(item => `${item.id}=${item.timeoutMs}ms`).join(", ")}`);
    }
    for (const failure of failures) deps.logger?.error?.(`more-config: sync failed for ${failure.id} (trigger: ${trigger}): ${failure.error}`);

    // Project the live server list for the panel. Diffed before writing, so a
    // pass that changed nothing writes nothing and the document-updated echo
    // of a real write settles in one hop instead of looping.
    await projectServerList(deps, inventory, trigger);
    return { ...plan, failures };
  };

  // The emitter invokes handlers detached from any receiver, so the listener
  // must close over the serializer instead of reaching through `this`.
  const sync = (trigger: string): Promise<SyncReport> => {
    const next = queue.then(() => runPass(trigger), () => runPass(trigger));
    queue = next.catch(() => {});
    return next;
  };

  return {
    /** Run one serialized pass; concurrent callers coalesce by chaining. */
    sync,
    /** Wire the document-updated listener and sync once for the current state. */
    attach(): Promise<SyncReport> {
      off?.();
      off = deps.events.on(DOCUMENT_UPDATED_EVENT, (...args) => {
        if (args[0] !== deps.ns) return;
        // The emitter never awaits its listeners; a rejected sync must reach
        // the logger instead of the process-level unhandled-rejection report.
        sync("document-updated").catch(error => {
          deps.logger?.error?.(`more-config: document-updated sync failed: ${error instanceof Error ? error.message : String(error)}`);
        });
      });
      return sync("startup");
    },
    /** Unwire the listener; in-flight passes settle on their own. */
    dispose(): void {
      off?.();
      off = undefined;
    },
  };
}
