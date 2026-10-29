/**
 * Claiming the two keys the host's *default table* already names.
 *
 * The host refuses a registration whose declared defaults overlap another
 * command's declared defaults — checked across all six runtime/platform
 * profiles, before any user preference is read. So `⌘P` (declared by
 * `workspace.files`) and `⌘O` (declared by `workspace.add`) cannot be claimed by
 * registering with a default: the plugin would throw at load.
 *
 * The supported way is the other direction. Register the command with no
 * default, then write one explicit preference — exactly what the reader would do
 * in the shortcut settings — after asking the service whether that combination is
 * actually free on this device. This module decides; the runtime writes.
 *
 * Nothing here steals a key that is in use: a conflicting combination is left
 * unbound and reported, because silently displacing a binding the reader chose
 * is the plugin deciding for them.
 */

import type { NormalizedBinding, ShortcutBinding } from "./dsh.ts";

/** One attempt: the command id whose name should end up on this combination. */
export interface ClaimTarget {
  readonly id: string;
  readonly binding: ShortcutBinding;
}

/** What the runtime should do for one target. */
export type ClaimPlan =
  | { readonly kind: "skip"; readonly id: string; readonly reason: "already-bound" | "not-registered" }
  | { readonly kind: "blocked"; readonly id: string; readonly keys: string; readonly reason: string }
  | { readonly kind: "claim"; readonly id: string; readonly binding: ShortcutBinding };

/** The service answers this plugin needs, narrowed for testing. */
export interface ClaimProbe {
  /** Effective binding of one command, or undefined when it is not registered. */
  current(id: string): NormalizedBinding | null | undefined;
  describe(binding: ShortcutBinding): {
    readonly issue: string | null;
    readonly conflicts: readonly string[];
    readonly keys: readonly string[];
  };
}

/** Expand the logical `primary` modifier for a device platform. */
export function expandModifiers(modifiers: readonly string[], platform: string): string[] {
  const primary = platform === "macos" ? "meta" : "control";
  const expanded = modifiers.map(modifier => (modifier === "primary" ? primary : modifier));
  // Canonical order is what the host compares; the set is what matters here.
  return [...new Set(expanded)].sort();
}

/**
 * Whether an effective binding already equals a requested combination.
 *
 * @param current - the normalized binding the service reports, if any.
 * @param target - the combination this plugin wants.
 * @param platform - receiving device.
 * @returns true when both name the same physical chord.
 */
export function sameCombination(
  current: NormalizedBinding | null | undefined,
  target: ShortcutBinding,
  platform: string,
): boolean {
  if (current === null || current === undefined) return false;
  if (current.code !== target.code) return false;
  if ((current.secondCode ?? "") !== (target.secondCode ?? "")) return false;
  const left = [...current.modifiers].sort();
  const right = expandModifiers(target.modifiers, platform);
  return left.length === right.length && left.every((modifier, index) => modifier === right[index]);
}

/**
 * Decide one target.
 *
 * The order matters: "already bound" is checked first so a second run of the
 * claim pass is a no-op rather than a redundant preference write, and the free
 * check comes before the write so a taken key never gets displaced.
 *
 * @param target - command id and combination.
 * @param probe - live catalogue reads.
 * @param platform - receiving device.
 * @returns what the runtime should do.
 */
export function planClaim(target: ClaimTarget, probe: ClaimProbe, platform: string): ClaimPlan {
  const current = probe.current(target.id);
  if (current === undefined) return { kind: "skip", id: target.id, reason: "not-registered" };
  if (sameCombination(current, target.binding, platform)) {
    return { kind: "skip", id: target.id, reason: "already-bound" };
  }

  const described = probe.describe(target.binding);
  const keys = described.keys.join("+");
  if (described.issue !== null) return { kind: "blocked", id: target.id, keys, reason: described.issue };
  if (described.conflicts.length > 0) {
    return { kind: "blocked", id: target.id, keys, reason: described.conflicts.join(", ") };
  }
  return { kind: "claim", id: target.id, binding: target.binding };
}
