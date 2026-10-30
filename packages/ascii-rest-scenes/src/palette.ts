/**
 * Colour maths, and nothing about what a colour is used for.
 *
 * Every function here is a pure conversion between representations: hex, RGB,
 * HSL, WCAG luminance, contrast. The decision of how a dark scene becomes a
 * light one lives in `light.ts`, so this file stays the part that is arithmetic
 * and cannot be argued with.
 */

export interface Rgb {
  r: number;
  g: number;
  b: number;
}

/**
 * The lightness band paper and marks occupy in the light scheme.
 *
 * Below `min` a mark is as dark as body text and competes with it; above `max`
 * a mark disappears into the paper behind it. Both ends are used: `paperOf`
 * places the page at the top of the band, so a scene's marks always land on a
 * page light enough to read dark text over.
 */
export const PAPER_BAND = { min: 0.3, max: 0.92 } as const;

/** Parse `#rgb` or `#rrggbb`; null for anything else, so callers can skip a bad palette entry. */
export function parseHex(input: string): Rgb | null {
  const hex = input.trim();
  if (!hex.startsWith("#")) return null;
  const body = hex.slice(1).toLowerCase();

  if (body.length === 3) {
    const digits = body.split("");
    const r = digits[0];
    const g = digits[1];
    const b = digits[2];
    if (r === undefined || g === undefined || b === undefined) return null;
    const expand = (digit: string): number => Number.parseInt(digit + digit, 16);
    const rgb = { r: expand(r), g: expand(g), b: expand(b) };
    return Number.isNaN(rgb.r) || Number.isNaN(rgb.g) || Number.isNaN(rgb.b) ? null : rgb;
  }

  if (body.length === 6) {
    if (!/^[0-9a-f]{6}$/.test(body)) return null;
    const value = Number.parseInt(body, 16);
    return { r: (value >> 16) & 0xff, g: (value >> 8) & 0xff, b: value & 0xff };
  }

  return null;
}

const toHexByte = (value: number): string =>
  Math.max(0, Math.min(255, Math.round(value))).toString(16).padStart(2, "0");

export function formatHex({ r, g, b }: Rgb): string {
  return `#${toHexByte(r)}${toHexByte(g)}${toHexByte(b)}`;
}

/** WCAG 2 relative luminance, 0 for black and 1 for white. Used to judge contrast, not to mix. */
export function relativeLuminance({ r, g, b }: Rgb): number {
  const channel = (raw: number): number => {
    const value = raw / 255;
    return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

/** Contrast ratio between two colours, 1 for identical and 21 for black against white. */
export function contrastRatio(a: Rgb, b: Rgb): number {
  const first = relativeLuminance(a);
  const second = relativeLuminance(b);
  const lighter = Math.max(first, second);
  const darker = Math.min(first, second);
  return (lighter + 0.05) / (darker + 0.05);
}

export interface Hsl {
  /** Hue in degrees, 0 to 360. */
  h: number;
  /** Saturation, 0 to 1. */
  s: number;
  /** Lightness, 0 to 1. */
  l: number;
}

export function toHsl({ r, g, b }: Rgb): Hsl {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const l = (max + min) / 2;
  if (max === min) return { h: 0, s: 0, l };

  const delta = max - min;
  const s = l > 0.5 ? delta / (2 - max - min) : delta / (max + min);
  let h: number;
  if (max === rn) h = ((gn - bn) / delta + (gn < bn ? 6 : 0)) * 60;
  else if (max === gn) h = ((bn - rn) / delta + 2) * 60;
  else h = ((rn - gn) / delta + 4) * 60;
  return { h, s, l };
}

export function fromHsl({ h, s, l }: Hsl): Rgb {
  const hue = ((h % 360) + 360) % 360;
  const saturation = Math.max(0, Math.min(1, s));
  const lightness = Math.max(0, Math.min(1, l));
  if (saturation === 0) {
    const value = lightness * 255;
    return { r: value, g: value, b: value };
  }
  const q = lightness < 0.5 ? lightness * (1 + saturation) : lightness + saturation - lightness * saturation;
  const p = 2 * lightness - q;
  const channel = (offset: number): number => {
    const t = (offset / 360 + 1) % 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };
  return { r: channel(hue + 120) * 255, g: channel(hue) * 255, b: channel(hue - 120) * 255 };
}
