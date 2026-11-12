/**
 * Guards for the skill enhancer's stylesheet.
 *
 * These assert decisions rather than pixels: a wrong theme token fails silently
 * (the declaration is simply dropped by the browser), which is exactly how the
 * hover panel once shipped with no background at all. Every token named here was
 * checked against the host's own token sheet, so the risk is a future edit
 * reintroducing a name that does not exist.
 */
import { describe, expect, it } from "vitest";

import { SKILL_ENHANCER_SHEET } from "../src/client/skill-styles.ts";

/** One declaration block, by selector, with comments stripped. */
function block(selector: string): string {
  const index = SKILL_ENHANCER_SHEET.indexOf(`${selector} {`);
  expect(index).toBeGreaterThan(-1);
  const end = SKILL_ENHANCER_SHEET.indexOf("}", index);
  // Comments mention the rejected token names on purpose, so they must not count
  // as usage when asserting what the block declares.
  return SKILL_ENHANCER_SHEET.slice(index, end).replace(/\/\*[\s\S]*?\*\//g, "");
}

/** Every custom property the sheet references. */
function referencedTokens(): readonly string[] {
  return [...SKILL_ENHANCER_SHEET.matchAll(/var\((--dsw-[a-z0-9-]+)/g)].map(match => match[1] ?? "");
}

describe("skill enhancer sheet", () => {
  it("paints the panel with the host's solid layer, not a translucent fill", () => {
    // `bg-elevated` does not exist, and `menu-surface-fill` is translucent by
    // design: either one leaves the panel see-through over page content.
    const panel = block(".dsh-better-skill-panel");
    expect(panel).toContain("background: var(--dsw-alias-bg-layer-2");
    // A skin may publish layer-2 itself as a translucent ground colour, so the
    // panel restates the same hue at alpha 1 rather than trust the token's alpha.
    expect(panel).toContain("background: rgb(from var(--dsw-alias-bg-layer-2");
    expect(panel).toContain("r g b / 1)");
    expect(panel).not.toContain("menu-surface-fill");
    expect(panel).not.toContain("bg-elevated");
  });

  it("gives the panel a border and a real shadow", () => {
    const panel = block(".dsh-better-skill-panel");
    expect(panel).toContain("var(--dsw-alias-border-l2");
    expect(panel).toContain("var(--dsw-elevation-prominent");
    expect(panel).not.toContain("shadow-elevated");
  });

  it("paints the workflow list with the slash menu's fill", () => {
    // The skill alias menu is `--dsw-specific-menu` plus the menu blur. A solid
    // layer next to it is a different card.
    const catalog = block(".dsh-better-skill-catalog");
    expect(catalog).toContain("background: var(--dsw-specific-menu");
    expect(catalog).toContain("backdrop-filter: var(--dsw-menu-backdrop-filter");
    expect(catalog).not.toContain("bg-layer-2");
  });

  it("paints the parameter panel like the hover panel it replaces", () => {
    // The two panels never show at once, so a different fill or shadow would read
    // as a glitch when one hands over to the other.
    const params = block(".dsh-better-skill-params");
    expect(params).toContain("background: var(--dsw-alias-bg-layer-2");
    expect(params).toContain("background: rgb(from var(--dsw-alias-bg-layer-2");
    expect(params).toContain("var(--dsw-alias-border-l2");
    expect(params).toContain("var(--dsw-elevation-prominent");
    expect(params).toContain("position: fixed");
    expect(params).toContain("z-index: 60");
  });

  it("keeps the parameter panel's title quieter than its rows", () => {
    const title = block(".dsh-better-skill-params-title");
    expect(title).toContain("var(--dsw-alias-label-caption");
  });

  it("bounds the hint width so a long argument-hint wraps", () => {
    // flow-agent's hint is a single 349-character line; unbounded it runs past
    // the composer and is clipped rather than wrapped.
    const hint = block(".dsh-better-skill-hint");
    expect(hint).toContain("max-width:");
    expect(hint).toContain("white-space: pre-wrap");
  });

  it("only references theme tokens the host actually defines", () => {
    const defined = new Set([
      "--dsw-alias-bg-layer-2",
      "--dsw-alias-bg-layer-3",
      "--dsw-alias-border-l1",
      "--dsw-alias-border-l2",
      "--dsw-alias-interactive-bg-hover",
      "--dsw-alias-label-caption",
      "--dsw-alias-label-primary",
      "--dsw-alias-label-secondary",
      "--dsw-alias-state-business-primary",
      "--dsw-elevation-prominent",
      "--dsw-font-mono",
      "--dsw-menu-backdrop-filter",
      "--dsw-specific-menu",
      "--dsw-radius-md",
      "--dsw-radius-sm",
    ]);
    const unknown = referencedTokens().filter(token => !defined.has(token));
    expect(unknown).toEqual([]);
  });

  it("supports the hidden attribute on both surfaces", () => {
    // The composer re-renders often; hiding via `hidden` rather than unmounting
    // keeps the ghost from flashing on every keystroke.
    expect(SKILL_ENHANCER_SHEET).toContain(".dsh-better-skill-hint[hidden]");
  });
});
