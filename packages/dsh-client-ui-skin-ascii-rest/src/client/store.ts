/**
 * The plugin's persisted settings, and the one place they change.
 *
 * The values live in `localStorage` rather than in a Host settings document on
 * purpose: a skin is per browser window, and a reader who puts the ascii
 * background on their laptop should not find it on a headless profile's other
 * surface. `localStorage` also keeps a write instantaneous, which is what makes
 * the tuning panel feel live.
 *
 * Everything read out of storage goes through `normalizeSettings`, so a document
 * written by an older build (or edited by hand, or left behind by a different
 * plugin) cannot put a scene id or a NaN in front of the renderer.
 */
import type { SceneEntry } from "ascii-rest-scenes";
import { normalizeSettings, settingsEqual, type Settings } from "ascii-rest-scenes";

/** The storage key is namespaced by skin, so uninstalling the skin leaves no orphan. */
export const STORAGE_KEY = "dsh-skin:ascii-rest:settings";

export interface SettingsStore {
  get(): Settings;
  /** Replace the document and notify; a no-op when nothing actually changed. */
  set(next: Settings): void;
  /** Apply a partial change on top of the current document. */
  update(change: (current: Settings) => Settings): void;
  /** Subscribe to changes; returns the unsubscribe. */
  subscribe(listener: (settings: Settings) => void): () => void;
  /** Drop the stored document and go back to the defaults. */
  reset(): void;
}

function readRaw(storage: Storage | undefined): unknown {
  if (storage === undefined) return undefined;
  try {
    const raw = storage.getItem(STORAGE_KEY);
    return raw === null ? undefined : (JSON.parse(raw) as unknown);
  } catch {
    // A corrupt document is not worth a console error on every page load.
    return undefined;
  }
}

/**
 * Build the store over a `Storage`, which is injectable so the tests can drive
 * it with a map instead of a browser.
 */
export function createSettingsStore(catalog: readonly SceneEntry[], storage?: Storage): SettingsStore {
  const backend = storage ?? (typeof localStorage === "undefined" ? undefined : localStorage);
  let current = normalizeSettings(readRaw(backend), catalog);
  const listeners = new Set<(settings: Settings) => void>();

  const persist = (next: Settings): void => {
    if (backend === undefined) return;
    try {
      backend.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // A full or disabled storage must not break the running skin; the value
      // stays live in memory and is simply not remembered.
    }
  };

  const publish = (next: Settings): void => {
    if (settingsEqual(current, next)) return;
    current = next;
    for (const listener of listeners) listener(current);
  };

  return {
    get: () => current,
    set: (next) => {
      const normalized = normalizeSettings(next, catalog);
      if (settingsEqual(current, normalized)) return;
      persist(normalized);
      publish(normalized);
    },
    update: (change) => {
      const normalized = normalizeSettings(change(current), catalog);
      if (settingsEqual(current, normalized)) return;
      persist(normalized);
      publish(normalized);
    },
    subscribe: (listener) => {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    reset: () => {
      try {
        backend?.removeItem(STORAGE_KEY);
      } catch {
        // Same reasoning as `persist`.
      }
      publish(normalizeSettings(undefined, catalog));
    },
  };
}
