/**
 * Which catalogue entry a row may show as a keycap, and whether a key event is it.
 *
 * A row that declares a host shortcut is asking for the *effective* chord, not
 * the declared default: the reader may have rebound it, another command may hold
 * it, or the combination may not parse on this platform. The catalogue already
 * answers all three, so the only work here is deciding when the answer is worth
 * showing. Showing a keycap that does not press the row is worse than showing
 * none, which is why every unusable state collapses to the same `undefined`.
 *
 * The second half is the same question asked of a live key event. It exists
 * because the panel owns a window-capture listener: a chord a row declares is
 * otherwise eaten by the host's modal gate before the command behind it runs.
 */

import type { NormalizedBinding, ShortcutCatalogEntry } from "./dsh.ts";

/** A shortcut whose keycaps can be shown and whose chord is really bound. */
export interface UsableShortcut {
  /** The keycaps as the platform spells them, ready to join for display. */
  readonly keys: readonly string[];
  readonly binding: NormalizedBinding;
}

/**
 * The entry's keycaps, when pressing them would actually reach the command.
 *
 * @param entries - the shortcuts catalogue snapshot.
 * @param id - the host command id a row declares.
 * @returns the keycaps and binding, or `undefined` when the row must stay bare.
 */
export function usableShortcut(
  entries: readonly ShortcutCatalogEntry[],
  id: string,
): UsableShortcut | undefined {
  const entry = entries.find(candidate => candidate.id === id);
  if (entry === undefined) return undefined;
  // An unbound command, an unparsable one and a contested one all read the same
  // to a reader: there is no key to press. `keys` is checked separately because
  // a binding can normalize and still render no keycaps.
  if (entry.binding === null || entry.issue !== null || entry.conflicts.length > 0) return undefined;
  if (entry.keys.length === 0) return undefined;
  return { keys: entry.keys, binding: entry.binding };
}

/** The parts of a keydown a chord is compared against. */
export interface KeyFacts {
  readonly code: string;
  readonly key: string;
  readonly repeat: boolean;
  readonly ctrlKey: boolean;
  readonly metaKey: boolean;
  readonly altKey: boolean;
  readonly shiftKey: boolean;
  /** Set by layouts where Alt is a character modifier, not a chord modifier. */
  readonly altGraph?: boolean;
  /** Set while an IME owns the keystrokes. */
  readonly composing?: boolean;
}

/** Where the panel is running, for the two host behaviours that differ by host. */
export interface MatchEnvironment {
  readonly runtime?: "desktop" | "web";
  readonly platform?: "macos" | "windows" | "linux";
}

/**
 * Whether one keydown is the chord a binding names.
 *
 * Modifiers are compared as a set, so a chord with an extra one held is a
 * different chord rather than a looser match: `⌘⌥N` must not fire on `⌘⌥⇧N`,
 * which is a separate command's key on most tables.
 *
 * @param facts - the event, read for its code, its key and its modifiers.
 * @param binding - the effective binding to compare against.
 * @param env - the host runtime and platform, which decide the Dead-key case.
 * @returns true when the panel may consume the key on this binding's behalf.
 */
export function matchesShortcut(
  facts: KeyFacts,
  binding: NormalizedBinding,
  env: MatchEnvironment,
): boolean {
  // A second stroke is a sequence, and sequences are the host's to run: on the
  // web it refuses them outright, and on the desktop the native layer sees the
  // chord before any DOM listener does.
  if (binding.secondCode !== undefined) return false;
  if (facts.code !== binding.code) return false;

  const modifiers = new Set(binding.modifiers);
  if (facts.ctrlKey !== modifiers.has("control")) return false;
  if (facts.metaKey !== modifiers.has("meta")) return false;
  if (facts.altKey !== modifiers.has("alt")) return false;
  if (facts.shiftKey !== modifiers.has("shift")) return false;

  if (facts.altGraph === true) return false;

  // macOS web delivers `⌘⌥N` as a Dead key: the chord opens a character accent
  // instead of producing `n`. The host lets exactly this one through at the DOM
  // layer so the command still runs, and mirroring it here is the difference
  // between the panel answering the key and the host swallowing it.
  const deadSpecial =
    facts.key === "Dead" &&
    env.runtime === "web" &&
    env.platform === "macos" &&
    binding.code === "KeyN" &&
    modifiers.has("meta") &&
    modifiers.has("alt") &&
    modifiers.size === 2;

  // A composing key belongs to the IME; a Dead key is a character gesture unless
  // it is the one exception above.
  if (facts.composing === true && !deadSpecial) return false;
  if (facts.key === "Dead" && !deadSpecial) return false;

  return true;
}
