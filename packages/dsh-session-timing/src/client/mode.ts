/**
 * The compact/detailed preference, read from the chat settings form.
 *
 * The shipped statistics pill reads this preference through a hook that belongs
 * to ui-chat's own registration, so a third-party pill cannot reach it. The
 * preference itself is ordinary settings data (`ui-chat`'s `performanceUsage`
 * field), so this module mirrors it into a tiny observable the pill subscribes
 * to — one code path, and a widget that keeps following the user's choice
 * instead of silently hard-coding "detailed".
 */

/** The two shapes the statistics reads in. */
export type UsageMode = "compact" | "detailed";

/** The default when the settings document carries no preference. */
export const DEFAULT_USAGE_MODE: UsageMode = "detailed";

/** The minimal read face of a configuration form (the settings service's shape). */
export interface ConfigFormLike {
  getSnapshot(): { readonly value?: { readonly performanceUsage?: unknown } | undefined };
  subscribe(listener: () => void): () => void;
}

/** The observable slice the component subscribes to. */
export interface ModeStore {
  getSnapshot(): UsageMode;
  subscribe(listener: () => void): () => void;
}

/**
 * Normalize one settings reading into a mode.
 * @param value - the raw preference field.
 * @returns the mode, or the default when absent or unrecognized.
 */
export function normalizeUsageMode(value: unknown): UsageMode {
  return value === "compact" || value === "detailed" ? value : DEFAULT_USAGE_MODE;
}

/**
 * Mirror one configuration form's `performanceUsage` into an observable.
 * @param form - the chat settings form, or undefined where the service is absent.
 * @returns the store the pill subscribes to.
 */
export function createModeStore(form: ConfigFormLike | undefined): ModeStore {
  const listeners = new Set<() => void>();
  let current = normalizeUsageMode(form?.getSnapshot().value?.performanceUsage);
  if (form !== undefined) {
    form.subscribe(() => {
      const next = normalizeUsageMode(form.getSnapshot().value?.performanceUsage);
      if (next === current) return;
      current = next;
      for (const listener of listeners) listener();
    });
  }
  return {
    getSnapshot: () => current,
    subscribe: (listener) => {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
  };
}
