/**
 * Which catalogue entry a row may show as a keycap.
 *
 * A row that declares a host shortcut is asking for the *effective* chord, not
 * the declared default: the reader may have rebound it, another command may hold
 * it, or the combination may not parse on this platform. The catalogue already
 * answers all three, so the only work here is deciding when the answer is worth
 * showing. Showing a keycap that does not press the row is worse than showing
 * none, which is why every unusable state collapses to the same `undefined`.
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
