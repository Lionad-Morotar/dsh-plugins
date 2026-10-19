import { describe, expect, it } from "vitest";

import { parseHex, relativeLuminance } from "ascii-rest-scenes";
import { buildTokens, pickAccent, withAlpha } from "../src/client/tokens.ts";

const saltFlatPalette = [
  "#0d0d0e",
  "#ffffff",
  "#50e3c2",
  "#0070f3",
  "#7928ca",
  "#ff0080",
  "#ff4d4d",
  "#f9cb28",
];

const tokens = buildTokens({
  scene: { ground: "#000000", palette: saltFlatPalette },
  surfaceOpacity: 1,
  paper: {},
});

describe("withAlpha", () => {
  it("appends the alpha as a hex pair", () => {
    expect(withAlpha("#000000", 1)).toBe("#000000ff");
    expect(withAlpha("#000000", 0)).toBe("#00000000");
    expect(withAlpha("#0070f3", 0.5)).toBe("#0070f380");
  });

  it("clamps rather than emitting an invalid colour", () => {
    expect(withAlpha("#0070f3", -1)).toBe("#0070f300");
    expect(withAlpha("#0070f3", 9)).toBe("#0070f3ff");
  });
});

describe("buildTokens", () => {
  it("returns a light and a dark value for every token it claims", () => {
    for (const [name, pair] of Object.entries(tokens)) {
      expect(name.startsWith("--dsw-"), `${name} is a theme token`).toBe(true);
      expect(typeof pair.light, `${name} light`).toBe("string");
      expect(typeof pair.dark, `${name} dark`).toBe("string");
      expect(pair.light, `${name} light is usable`).not.toBe("");
      expect(pair.dark, `${name} dark is usable`).not.toBe("");
    }
  });

  it("covers the tokens the theme service requires both schemes for", () => {
    const required = [
      "--dsw-alias-bg-base",
      "--dsw-alias-bg-layer-1",
      "--dsw-alias-bg-layer-2",
      "--dsw-alias-bg-overlay",
      "--dsw-alias-border-l1",
      "--dsw-alias-border-l2",
      "--dsw-alias-brand-primary",
      "--dsw-alias-label-primary",
      "--dsw-alias-label-secondary",
      "--dsw-alias-state-error-primary",
      "--dsw-alias-state-idle-primary",
      "--dsw-alias-state-success-primary",
      "--dsw-alias-state-warn-primary",
      "--dsw-specific-sidebar-fill",
    ];
    for (const token of required) expect(tokens, token).toHaveProperty([token]);
  });

  it("makes the light base light and the dark base dark", () => {
    const light = parseHex(tokens["--dsw-alias-bg-base"]!.light.slice(0, 7));
    const dark = parseHex(tokens["--dsw-alias-bg-base"]!.dark.slice(0, 7));
    expect(light).not.toBeNull();
    expect(dark).not.toBeNull();
    if (light === null || dark === null) return;
    expect(relativeLuminance(light)).toBeGreaterThan(relativeLuminance(dark));
  });

  it("keeps the base translucent, so the picture is visible at all", () => {
    // A fully opaque base hides the whole surface, which makes the skin a no-op.
    for (const scheme of ["light", "dark"] as const) {
      const value = tokens["--dsw-alias-bg-base"]![scheme];
      expect(value, `${scheme} base carries an alpha`).toMatch(/^#[0-9a-f]{6}[0-9a-f]{2}$/i);
      const alpha = Number.parseInt(value.slice(7, 9), 16);
      expect(alpha, `${scheme} base is not opaque`).toBeLessThan(255);
      expect(alpha, `${scheme} base is not clear`).toBeGreaterThan(0);
    }
  });

  it("derives an accent from the picture instead of inventing one", () => {
    // salt-flat's most vivid entry is one of its saturated spectrum colours.
    const accent = tokens["--dsw-alias-brand-primary"]!.dark;
    expect(saltFlatPalette).toContain(accent);
    expect(pickAccent(saltFlatPalette, "dark")).toBe(accent);
  });

  it("keeps labels legible against both bases", () => {
    for (const scheme of ["light", "dark"] as const) {
      const base = parseHex(tokens["--dsw-alias-bg-base"]![scheme].slice(0, 7));
      const label = parseHex(tokens["--dsw-alias-label-primary"]![scheme]);
      expect(base).not.toBeNull();
      expect(label).not.toBeNull();
      if (base === null || label === null) continue;
      const baseL = relativeLuminance(base);
      const labelL = relativeLuminance(label);
      // The label must sit on the far side of the base, not next to it.
      expect(Math.abs(baseL - labelL), `${scheme} label separation`).toBeGreaterThan(0.5);
    }
  });

  it("honours a lower surface opacity by opening the surfaces further", () => {
    const clear = buildTokens({
      scene: { ground: "#000000", palette: saltFlatPalette },
      surfaceOpacity: 0.2,
      paper: {},
    });
    const alphaOf = (value: string): number => Number.parseInt(value.slice(7, 9), 16);
    expect(alphaOf(clear["--dsw-alias-bg-base"]!.dark)).toBeLessThan(
      alphaOf(tokens["--dsw-alias-bg-base"]!.dark),
    );
  });

  it("falls back to a brand colour when the palette has no usable accent", () => {
    const grey = buildTokens({
      scene: { ground: "#000000", palette: ["#000000", "#111111", "#222222"] },
      surfaceOpacity: 1,
      paper: {},
    });
    expect(grey["--dsw-alias-brand-primary"]!.dark).toMatch(/^#[0-9a-f]{6}$/i);
  });
});
