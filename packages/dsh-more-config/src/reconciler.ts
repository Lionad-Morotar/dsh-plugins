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
import { toTimeoutMap } from "./shadow.ts";
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
        void sync("document-updated");
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
