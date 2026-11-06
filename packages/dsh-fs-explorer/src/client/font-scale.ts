/**
 * The panel's type scale, read from the host.
 *
 * The stylesheet expresses every size as a ratio of the host's conversation
 * body size (`--dsh-content-font-size`, written on `body` by the host's theme
 * presenter), so CSS follows ⌘+/⌘- on its own. This module is the one consumer
 * that needs the size in JavaScript too: the tree's virtual window positions
 * rows by a row height, and a row height that disagreed with the CSS would
 * clip the last row and drift the cursor off by a fraction per row.
 *
 * The host writes the variables before any plugin loads, so the DOM read below
 * is a correct first guess on every host, including one that provides no
 * `theme` service. Subscribing to `theme/change` is what makes a shortcut press
 * land without remounting the panel.
 */
import { useSyncExternalStore } from "react";

/**
 * Conversation body size the panel's stylesheet ratios are designed against.
 * Kept as a plain number: it is the denominator of every ratio in `styles.ts`.
 */
export const DESIGN_TEXT_SIZE = 14;

/** Body variable carrying the host's conversation body size. */
const TEXT_SIZE_VARIABLE = "--dsh-content-font-size";

/** Size assumed when the host exposes none. */
const DEFAULT_TEXT_SIZE = DESIGN_TEXT_SIZE;

/**
 * A row height for the current type scale.
 *
 * Rounded to whole pixels so absolute offsets do not accumulate a fraction per
 * row, and floored at the design height: below the design baseline the host's
 * own minimum is still 10px, and letting rows shrink under the stylesheet's
 * floor would open dead bands between clickable rows.
 * @param base - the row height at the design baseline.
 * @param textSize - the host's conversation body size in px.
 * @returns the row height in px.
 */
export function scaledRowHeight(base: number, textSize: number): number {
  return Math.max(base, Math.round((base * textSize) / DESIGN_TEXT_SIZE));
}

/**
 * Parse one px value the host presenter wrote, keeping only usable numbers.
 * @param value - the raw inline variable value, e.g. `"16px"`.
 * @param fallback - the design-baseline value when the input is missing or bad.
 * @returns a healthy font size in px.
 */
function parseFontSize(value: string | undefined, fallback: number): number {
  if (value === undefined) return fallback;
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

/**
 * Read the size the host presenter wrote on `body`; the design baseline outside
 * a browser or when the variable is absent.
 * @returns the conversation body size in px.
 */
function readDomTextSize(): number {
  if (typeof document === "undefined" || document.body === null) return DEFAULT_TEXT_SIZE;
  return parseFontSize(document.body.style.getPropertyValue(TEXT_SIZE_VARIABLE), DEFAULT_TEXT_SIZE);
}

/** Latest known size; module state because the panel mounts and remounts. */
let textSize = readDomTextSize();

/** Subscribers are notified only when the rounded size actually changes. */
const listeners = new Set<() => void>();

/**
 * The host's current conversation body size.
 * @returns the size in px.
 */
export function getTextSize(): number {
  return textSize;
}

/**
 * Subscribe to type-scale changes.
 * @param listener - called whenever the host's size changes.
 * @returns a disposer removing the subscription.
 */
export function subscribeTextSize(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/**
 * Adopt one size and notify subscribers when it is news.
 * @param next - the size in px.
 */
function setTextSize(next: number): void {
  if (next === textSize) return;
  textSize = next;
  for (const listener of [...listeners]) listener();
}

/** The host `theme` service, read structurally: its client package exports no type for third parties. */
interface ThemeFace {
  getTheme(): unknown;
}

/** The scope Cordis hands an injection callback. */
export interface FontScaleScopeLike {
  readonly theme?: unknown;
  get?(name: string): unknown;
  on?(event: string, listener: () => void): unknown;
}

/** The slice of the client context this module needs. */
export interface FontScaleContextLike {
  inject?(services: string[], callback: (scope: FontScaleScopeLike) => void | (() => void)): unknown;
}

/**
 * Whether a value is the host's theme service.
 * @param value - a probed service, or nothing.
 * @returns true when it can answer `getTheme`.
 */
function isThemeFace(value: unknown): value is ThemeFace {
  return value !== null && typeof value === "object" && typeof (value as { getTheme?: unknown }).getTheme === "function";
}

/**
 * Pull the conversation body size out of a theme snapshot.
 * @param snapshot - whatever `getTheme()` returned.
 * @returns the size in px, or undefined when the snapshot has no usable size.
 */
function textSizeOf(snapshot: unknown): number | undefined {
  if (snapshot === null || typeof snapshot !== "object") return undefined;
  const sizes = (snapshot as { fontSizes?: unknown }).fontSizes;
  if (sizes === null || typeof sizes !== "object") return undefined;
  const value = (sizes as { text?: unknown }).text;
  return typeof value === "number" && Number.isFinite(value) && value > 0 ? value : undefined;
}

/**
 * Read the theme service off an injected scope, tolerating both access spellings.
 * @param scope - the scope Cordis handed the callback.
 * @returns the service, or undefined when the host has none.
 */
function themeOf(scope: FontScaleScopeLike): ThemeFace | undefined {
  try {
    const viaGet = scope.get?.("theme");
    if (isThemeFace(viaGet)) return viaGet;
  } catch {
    // An unknown service name is the same as an absent one.
  }
  try {
    const direct = scope.theme;
    if (isThemeFace(direct)) return direct;
  } catch {
    // A scope that refuses the property has no theme service to offer.
  }
  return undefined;
}

/**
 * Follow the host's font-size preference.
 *
 * `theme` is requested through the callback form of `ctx.inject` rather than
 * declared in the plugin's `inject` list: a host that never provides the
 * service must still mount the panel, and waiting for it would hide the tab on
 * exactly that host.
 * @param ctx - the client context this plugin was applied to.
 * @returns a disposer releasing the injection.
 */
export function attachFontScale(ctx: FontScaleContextLike): () => void {
  const inject = ctx.inject;
  if (typeof inject !== "function") return () => {};
  let detach: (() => void) | undefined;
  let dispose: (() => void) | undefined;
  try {
    const fiber = inject.call(ctx, ["theme"], (scope: FontScaleScopeLike) => {
      const theme = themeOf(scope);
      if (theme === undefined) return;
      const sync = (): void => {
        try {
          const fromTheme = textSizeOf(theme.getTheme());
          setTextSize(fromTheme ?? readDomTextSize());
        } catch {
          // The host emits `theme/change` while the service is still alive, but a
          // service mid-unload must not turn a font-size read into a host error.
        }
      };
      sync();
      // `theme/change` is the service's only notification; the body variables
      // the presenter writes alongside it are not observable through CSS.
      const off = scope.on?.("theme/change", sync);
      if (typeof off !== "function") return;
      const listenerOff = off as () => void;
      // Disposal through the fiber is asynchronous, so the listener is also
      // unregistered here: a theme change landing mid-unload must not reach a
      // store whose panel is going away.
      detach = listenerOff;
      return listenerOff;
    }) as { dispose?: () => unknown } | undefined;
    if (fiber !== undefined && typeof fiber.dispose === "function") {
      const fiberDispose = fiber.dispose.bind(fiber);
      dispose = () => {
        void fiberDispose();
      };
    }
  } catch {
    // A host that refuses the injection keeps the DOM-read fallback above.
  }
  return () => {
    detach?.();
    dispose?.();
  };
}

/**
 * Subscribe a component to the host's type scale and size one row.
 * @param base - the row height at the design baseline.
 * @returns the row height for the current type scale, in px.
 */
export function useRowHeight(base: number): number {
  const currentTextSize = useSyncExternalStore(subscribeTextSize, getTextSize, getTextSize);
  return scaledRowHeight(base, currentTextSize);
}
