/**
 * Solid surfaces for the dock.
 *
 * The dock sits inside a page a skin may have made translucent: the ascii-rest
 * skin rewrites `--dsw-alias-bg-base` to an eight-digit hex with an alpha, so
 * every surface painted with the token lets the background picture through. A
 * terminal is not a card on that picture — a translucent emulator makes text
 * illegible against moving scenery — so the dock paints an opaque version of the
 * same token. Stripping the alpha keeps the skin's hue and reads as a solid panel
 * of it; on a stock theme (already opaque) the value is returned unchanged.
 *
 * Parsing happens in the browser because custom properties compute to their
 * specified text, not to a resolved colour: `getComputedStyle` hands back
 * `#ebebeba8` or `rgb(21 21 23 / 0.58)` and nothing in CSS turns that opaque.
 */

/** The channel triple worth keeping from a colour; alpha is what this module removes. */
export interface OpaqueColor {
  readonly r: number;
  readonly g: number;
  readonly b: number;
}

/** One functional-colour component before it is scaled to a channel. */
interface Component {
  readonly value: number;
  readonly percent: boolean;
}

/** Parse `#rgb`, `#rgba`, `#rrggbb`, `#rrggbbaa`; null for anything else. */
function parseHex(value: string): OpaqueColor | null {
  const digits = value.slice(1);
  if (!/^[0-9a-f]+$/iu.test(digits)) return null;
  const expanded = digits.length === 3 || digits.length === 4
    ? [...digits].map(digit => `${digit}${digit}`).join("")
    : digits;
  if (!/^[0-9a-f]{6}([0-9a-f]{2})?$/iu.test(expanded)) return null;
  return {
    r: Number.parseInt(expanded.slice(0, 2), 16),
    g: Number.parseInt(expanded.slice(2, 4), 16),
    b: Number.parseInt(expanded.slice(4, 6), 16),
  };
}

/**
 * Split a functional colour body into components.
 *
 * Handles the comma syntax (`rgb(1, 2, 3)`), the space-plus-slash syntax
 * (`rgb(1 2 3 / 40%)`) and the `color(srgb …)` form Chrome computes `color-mix`
 * into. Keeping the percentage flag is what lets the caller scale channels
 * correctly: `100%` is 255 in `rgb()` but 1 in `color(srgb …)`.
 */
function parseComponents(body: string): Component[] | null {
  const parts = body.split(/[\s,/]+/u).filter(part => part !== "");
  const components: Component[] = [];
  for (const part of parts) {
    if (part.endsWith("%")) {
      const value = Number(part.slice(0, -1));
      if (!Number.isFinite(value)) return null;
      components.push({ value, percent: true });
      continue;
    }
    const value = Number(part);
    if (!Number.isFinite(value)) return null;
    components.push({ value, percent: false });
  }
  return components;
}

/** Clamp one channel into 0–255. */
function channel(component: Component | undefined, scale: "byte" | "unit"): number {
  if (component === undefined) return 0;
  const raw = component.percent
    ? (component.value / 100) * (scale === "byte" ? 255 : 1)
    : component.value;
  const final = scale === "unit" ? raw * 255 : raw;
  return Math.round(final < 0 ? 0 : final > 255 ? 255 : final);
}

/**
 * Read one CSS colour as an opaque RGB triple.
 *
 * Unparseable input answers null rather than a guess: the caller then keeps the
 * host's own token, which is exactly the behaviour the dock had before this
 * module existed.
 * @param value - a computed custom-property value.
 * @returns the channels, or null when this parser does not know the syntax.
 */
export function parseOpaque(value: string): OpaqueColor | null {
  const text = value.trim();
  if (text === "") return null;
  if (text.startsWith("#")) return parseHex(text);
  const functional = /^(rgba?|color)\((.*)\)$/iu.exec(text);
  if (functional === null) return null;
  const name = (functional[1] ?? "").toLowerCase();
  const body = functional[2] ?? "";
  if (name === "color") {
    const components = parseComponents(body.replace(/^[a-z-]+[\s,]+/iu, ""));
    if (components === null || components.length < 3) return null;
    return {
      r: channel(components[0], "unit"),
      g: channel(components[1], "unit"),
      b: channel(components[2], "unit"),
    };
  }
  const components = parseComponents(body);
  if (components === null || components.length < 3) return null;
  // `rgb(0.5 0.5 0.5)` is the modern byte syntax, not a unit triple: this
  // branch always scales percentages and leaves plain numbers on the 0–255 axis.
  return {
    r: channel(components[0], "byte"),
    g: channel(components[1], "byte"),
    b: channel(components[2], "byte"),
  };
}

/**
 * Turn one CSS colour into an opaque one.
 *
 * A value this parser does not understand is returned trimmed and unchanged;
 * the dock then behaves exactly as it did before the solid-surface rule.
 * @param value - any CSS colour.
 * @returns an `rgb(…)` string whenever the channels could be read.
 */
export function solidColor(value: string): string {
  const parsed = parseOpaque(value);
  if (parsed === null) return value.trim();
  return `rgb(${String(parsed.r)}, ${String(parsed.g)}, ${String(parsed.b)})`;
}

/**
 * Read one theme token from an element as an opaque colour.
 * @param node - the element whose computed style owns the token.
 * @param property - the custom property, e.g. `--dsw-alias-bg-base`.
 * @param fallback - returned when the token is absent or unreadable.
 * @returns the opaque colour, or the fallback.
 */
export function readSolidToken(node: Element | null, property: string, fallback: string): string {
  if (node === null || typeof getComputedStyle !== "function") return fallback;
  const raw = getComputedStyle(node).getPropertyValue(property).trim();
  if (raw === "") return fallback;
  return solidColor(raw);
}

/**
 * Run `read` whenever the page's colour tokens could have changed.
 *
 * Three mechanisms can move a token under the dock, and each needs its own
 * observation: the host flips the palette by toggling `body[data-ds-dark-theme]`,
 * the theme presenter writes inline variables on `body`, and a skin rewrites a
 * stylesheet in `head`. The head observer is subtree-wide but scoped to `<head>`,
 * which holds a few dozen nodes; that is cheaper and far more robust than
 * polling computed styles.
 * @param read - re-read the tokens; must be idempotent.
 * @returns a disposer.
 */
export function watchSurfaceColors(read: () => void): () => void {
  if (typeof window === "undefined" || typeof document === "undefined") return () => {};
  const observer = typeof MutationObserver === "function" ? new MutationObserver(() => read()) : undefined;
  if (observer !== undefined) {
    observer.observe(document.documentElement, { attributes: true });
    if (document.body !== null) observer.observe(document.body, { attributes: true });
    observer.observe(document.head, { childList: true, characterData: true, subtree: true });
  }
  window.addEventListener("resize", read);
  return () => {
    observer?.disconnect();
    window.removeEventListener("resize", read);
  };
}
