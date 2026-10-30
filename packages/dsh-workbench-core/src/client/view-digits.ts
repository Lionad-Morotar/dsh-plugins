/**
 * Optional digit shortcuts for the conversation view row.
 *
 * The host binds no digit chord: `⌘1 … ⌘9` is free on desktop, and the browser
 * takes it on web (tab switching), which is why the web shell gets `⌥1 … ⌥9`
 * delivered by this bundle's own capture-phase router instead.
 *
 * Three decisions live here:
 * - the preference: a persisted on/off switch, so the nine chords are opt-out
 *   rather than silently installed global bindings;
 * - the command table: nine identical rows generated once, so registration,
 *   labels and the settings explanation cannot drift apart;
 * - the web router: alt+digit, matched exactly (no extra modifier, no digit 0)
 *   and consumed only after a tab actually accepted the switch.
 *
 * Position, not identity: the digits follow the visible tab order, so a view a
 * feature package registers later needs no change here, and an overflow entry
 * parked in the "更多会话视图" menu is simply not addressable by digit.
 */
import type { BindingPlatform, KeyBinding } from "./keymap.ts";
import { isWebShortcutRuntime, type GlobalKeyTarget } from "./shortcut-router.ts";

/** localStorage key holding the toggle; the document is `{"enabled": boolean}`. */
export const VIEW_DIGIT_STORAGE_KEY = "dsh-workbench:view-digits:v1";

/** How many digits the workbench binds: `⌘1` through `⌘9`. */
export const VIEW_DIGIT_COUNT = 9;

/**
 * The toggle ships on: the chord is what the user asked this package for, and
 * the switch is the way out. Turning it off disposes the registrations, so a
 * disabled workbench holds no digit binding at all.
 */
const DEFAULT_ENABLED = true;

/** Command id for one 1-based digit. */
export function viewDigitCommandId(index: number): string {
  return `workbench.view.digit${index}`;
}

/** One digit row: identity, label key and the desktop default. */
export interface ViewDigitSpec {
  /** 1-based position in the tab strip this digit addresses. */
  readonly index: number;
  readonly id: string;
  readonly labelKey: string;
  /** Desktop default; web has no host binding and routes locally instead. */
  readonly desktop: KeyBinding;
}

/** The nine digits, in order. */
export const VIEW_DIGIT_COMMANDS: readonly ViewDigitSpec[] = Array.from(
  { length: VIEW_DIGIT_COUNT },
  (_, offset): ViewDigitSpec => {
    const index = offset + 1;
    return {
      index,
      id: viewDigitCommandId(index),
      labelKey: "keymap.viewDigit",
      desktop: { code: `Digit${index}`, modifiers: ["primary"] },
    };
  },
);

/** The storage face the preference reads; `localStorage` satisfies it. */
export interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem?(key: string): void;
}

/** Read/subscribe face the section and the registrar share. */
export interface ViewDigitPreference {
  /** Whether the digit chords are currently installed. */
  get(): boolean;
  /** Publish one value; setting the current value is a no-op. */
  set(enabled: boolean): void;
  /** Invert the current value. */
  toggle(): void;
  /** Subscribe to transitions; returns the unsubscribe function. */
  subscribe(listener: (enabled: boolean) => void): () => void;
}

/** What one preference mount closes over. */
export interface ViewDigitPreferenceOptions {
  /** Storage to use; omit for `localStorage`, pass null for none (tests, SSR). */
  readonly storage?: StorageLike | null;
  /** Answer when storage holds nothing readable. */
  readonly initial?: boolean;
}

/**
 * Resolve the storage once per mount.
 *
 * Reading `globalThis.localStorage` throws in a sandboxed iframe and in some
 * locked-down pages, so the probe is guarded rather than assumed.
 * @param storage - explicit storage, undefined for the ambient one, null for none.
 * @returns a usable storage, or null.
 */
function resolveStorage(storage?: StorageLike | null): StorageLike | null {
  if (storage !== undefined) return storage;
  try {
    return globalThis.localStorage ?? null;
  } catch {
    return null;
  }
}

/**
 * Read the persisted toggle, tolerating every kind of junk.
 * @param storage - backing storage, or null.
 * @param fallback - answer when the document is absent or unreadable.
 * @returns the enabled flag.
 */
function readPreference(storage: StorageLike | null, fallback: boolean): boolean {
  if (storage === null) return fallback;
  try {
    const raw = storage.getItem(VIEW_DIGIT_STORAGE_KEY);
    if (raw === null) return fallback;
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null) return fallback;
    const enabled = (parsed as { enabled?: unknown }).enabled;
    return typeof enabled === "boolean" ? enabled : fallback;
  } catch {
    return fallback;
  }
}

/**
 * Create the persisted toggle for one client mount.
 * @param options - storage override and the answer to use before anything is stored.
 * @returns the store; listeners live only in this closure.
 */
export function createViewDigitPreference(options: ViewDigitPreferenceOptions = {}): ViewDigitPreference {
  const storage = resolveStorage(options.storage);
  const fallback = options.initial ?? DEFAULT_ENABLED;
  let enabled = readPreference(storage, fallback);
  const listeners = new Set<(enabled: boolean) => void>();

  const persist = (next: boolean): void => {
    if (storage === null) return;
    try {
      storage.setItem(VIEW_DIGIT_STORAGE_KEY, JSON.stringify({ enabled: next }));
    } catch {
      // A full or denied store costs persistence, never the current answer.
    }
  };

  const set = (next: boolean): void => {
    if (next === enabled) return;
    enabled = next;
    persist(next);
    // Copy before iterating: a listener may unsubscribe itself while notified.
    for (const listener of [...listeners]) listener(enabled);
  };

  return {
    get: () => enabled,
    set,
    toggle: () => set(!enabled),
    subscribe(listener) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
  };
}

/**
 * Print the chord the current runtime actually delivers.
 *
 * Desktop keeps the primary modifier (⌘ / Ctrl); web drops to alt because the
 * browser reserves primary+digit for its own tab strip.
 * @param runtime - receiving shell.
 * @param platform - receiving device.
 * @returns one modifier label, ready to concatenate with a digit.
 */
export function viewDigitChord(runtime: "desktop" | "web", platform: BindingPlatform): string {
  if (runtime === "web") return platform === "macos" ? "⌥" : "Alt";
  return platform === "macos" ? "⌘" : "Ctrl";
}

/** Physical digit codes the workbench binds; `Digit0` is deliberately absent. */
const DIGIT_CODE = /^Digit([1-9])$/u;

/**
 * Read a 1-based position out of a physical digit code.
 * @param code - `KeyboardEvent.code`, or undefined.
 * @returns 1 through 9, or null for anything else.
 */
export function viewDigitIndexFromCode(code: string | undefined): number | null {
  if (code === undefined) return null;
  const match = DIGIT_CODE.exec(code);
  return match === null ? null : Number(match[1]);
}

/** The keyboard fields the router reads; a real `KeyboardEvent` satisfies all of them. */
export interface ViewDigitKeyEvent {
  readonly code?: string;
  readonly altKey?: boolean;
  readonly ctrlKey?: boolean;
  readonly metaKey?: boolean;
  readonly shiftKey?: boolean;
  readonly defaultPrevented?: boolean;
  preventDefault?(): void;
}

/** What the router does with a matched chord. */
export interface ViewDigitKeyRouterOptions {
  /** Whether the toggle is on right now; read per event, never captured. */
  readonly isEnabled: () => boolean;
  /** Switch to the 1-based tab; false when the strip cannot satisfy it. */
  readonly switchTab: (index: number) => boolean;
  /** Attach immediately when provided. Node tests omit it and call `handle`. */
  readonly target?: GlobalKeyTarget;
}

/** The node-drivable seam the unit tests exercise. */
export interface ViewDigitKeyRouter {
  /** @returns true only when a digit matched and the tab accepted the switch. */
  handle(event: ViewDigitKeyEvent): boolean;
  /** Detach the window listener and stop handling further events. */
  dispose(): void;
}

/**
 * Build the alt+digit router for the web shell.
 * @param options - toggle reader, tab sink and an optional window-like target.
 * @returns the `{ handle, dispose }` seam; no DOM is required when `target` is omitted.
 */
export function createViewDigitKeyRouter({ isEnabled, switchTab, target }: ViewDigitKeyRouterOptions): ViewDigitKeyRouter {
  let disposed = false;

  const handle = (event: ViewDigitKeyEvent): boolean => {
    if (disposed) return false;
    if (event.defaultPrevented === true) return false;
    // Alt alone: every extra modifier means the user meant something else, and
    // a browser gesture that already claimed the event stays claimed.
    if (event.altKey !== true) return false;
    if (event.ctrlKey === true || event.metaKey === true || event.shiftKey === true) return false;
    const index = viewDigitIndexFromCode(event.code);
    if (index === null) return false;
    if (!isEnabled()) return false;
    // Consume only after the switch landed: a digit the strip cannot satisfy
    // must stay with the page rather than vanish into a no-op.
    if (!switchTab(index)) return false;
    event.preventDefault?.();
    return true;
  };

  const onKeyDown = (event: KeyboardEvent): void => {
    handle(event);
  };
  target?.addEventListener("keydown", onKeyDown, true);

  return {
    handle,
    dispose(): void {
      if (disposed) return;
      disposed = true;
      target?.removeEventListener("keydown", onKeyDown, true);
    },
  };
}

/**
 * Install the router only where it is needed.
 *
 * Desktop keeps the host binding, so a second listener there would switch twice.
 * Outside a browser (Node tests, SSR) there is no target and the installer
 * degrades to a no-op.
 * @param options - runtime, toggle reader, tab sink and window-like target.
 * @returns a disposer; a no-op on desktop or without a target.
 */
export function installViewDigitKeyRouter(options: {
  readonly runtime?: string;
  readonly isEnabled: () => boolean;
  readonly switchTab: (index: number) => boolean;
  readonly target?: GlobalKeyTarget;
}): () => void {
  if (!isWebShortcutRuntime({ runtime: options.runtime })) return () => {};
  if (options.target === undefined) return () => {};
  const router = createViewDigitKeyRouter({
    isEnabled: options.isEnabled,
    switchTab: options.switchTab,
    target: options.target,
  });
  return () => router.dispose();
}
