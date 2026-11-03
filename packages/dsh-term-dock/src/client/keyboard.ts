/**
 * The dock's own chords.
 *
 * These stay on the dock element and are not registered with the host. The host's
 * binding grammar rejects `Insert`, and `Cmd+W` is a browser and desktop close
 * chord the host already classifies as reserved, so a settings row would promise
 * a rebind the listener does not read.
 *
 * `primary` is Command on macOS and Control elsewhere, same as the file panel.
 */

/** Logical modifier; `primary` follows the platform. */
export type KeyModifier = "primary" | "control" | "alt" | "shift" | "meta";

/** One dock action and the physical chords that trigger it. */
export interface DockChord {
  readonly action: "split" | "close";
  /** `KeyboardEvent.code`, not the printed character. */
  readonly code: string;
  readonly modifiers: readonly KeyModifier[];
}

/**
 * Split chords.
 *
 * `KeyD` is the one a built-in Mac keyboard can actually press. `Insert` is kept
 * as an alias for full-size keyboards; the host's reserved-binding note records
 * that a Mac keyboard has no Insert key, which is why it is not the only chord.
 */
export const SPLIT_CHORDS: readonly DockChord[] = Object.freeze([
  { action: "split", code: "KeyD", modifiers: ["primary"] },
  { action: "split", code: "Insert", modifiers: ["primary"] },
]);

/**
 * Non-macOS split chord.
 *
 * Bare Control+D is end-of-file to a shell, so the extra Shift keeps the key
 * out of readline. It is not the macOS alias with a swapped modifier.
 */
export const SPLIT_CHORD_OTHER: DockChord = Object.freeze<DockChord>({
  action: "split",
  code: "KeyD",
  modifiers: ["primary", "shift"],
});

/** Close chord. The second press, not this match, is what closes. */
export const CLOSE_CHORD: DockChord = Object.freeze<DockChord>({
  action: "close",
  code: "KeyW",
  modifiers: ["primary"],
});

/** The runtime the primary modifier is resolved against. */
export type KeyPlatform = "mac" | "other";

/** The keyboard fields the matcher reads; a real event satisfies all of them. */
export interface KeyEventLike {
  readonly code?: string;
  readonly metaKey?: boolean;
  readonly ctrlKey?: boolean;
  readonly altKey?: boolean;
  readonly shiftKey?: boolean;
  readonly isComposing?: boolean;
  readonly repeat?: boolean;
}

/**
 * Detect the platform whose primary modifier the chord should use.
 * @returns `mac` for Apple devices, `other` everywhere else.
 */
export function detectPlatform(): KeyPlatform {
  if (typeof navigator === "undefined") return "other";
  const platform = typeof navigator.platform === "string" ? navigator.platform : "";
  const agent = typeof navigator.userAgent === "string" ? navigator.userAgent : "";
  return /mac|iphone|ipad|ipod/iu.test(platform) || /mac os x|iphone|ipad/iu.test(agent) ? "mac" : "other";
}

/**
 * Whether one event is exactly one chord.
 *
 * Exactness matters: the dock owns ⌘D but not ⌘⇧D, and a held key that repeats
 * would otherwise spend the close confirmation by itself.
 * @param event - the keyboard event (or a test double).
 * @param chord - the chord to match.
 * @param platform - primary-modifier platform, detected when omitted.
 * @returns true when the code and every modifier match and the key is not repeating.
 */
export function matchesChord(
  event: KeyEventLike,
  chord: DockChord,
  platform: KeyPlatform = detectPlatform(),
): boolean {
  if (event.isComposing === true || event.repeat === true) return false;
  if (event.code !== chord.code) return false;
  const wants = chord.modifiers;
  const meta = wants.includes("meta") || (wants.includes("primary") && platform === "mac");
  const control = wants.includes("control") || (wants.includes("primary") && platform !== "mac");
  const alt = wants.includes("alt");
  const shift = wants.includes("shift");
  return (
    (event.metaKey === true) === meta &&
    (event.ctrlKey === true) === control &&
    (event.altKey === true) === alt &&
    (event.shiftKey === true) === shift
  );
}

/**
 * Which dock action an event is, if it is one of the dock's chords.
 * @param event - the keyboard event (or a test double).
 * @param platform - primary-modifier platform, detected when omitted.
 * @returns the action, or undefined when the dock should leave the key alone.
 */
export function dockAction(event: KeyEventLike, platform: KeyPlatform = detectPlatform()): DockChord["action"] | undefined {
  const split = platform === "mac" ? SPLIT_CHORDS : [SPLIT_CHORD_OTHER];
  if (split.some(chord => matchesChord(event, chord, platform))) return "split";
  if (matchesChord(event, CLOSE_CHORD, platform)) return "close";
  return undefined;
}
