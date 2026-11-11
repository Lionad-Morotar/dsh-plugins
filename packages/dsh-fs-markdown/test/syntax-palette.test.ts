/**
 * The syntax palette the editor's highlight style resolves through.
 *
 * Every tag in `highlightStyle` names a `--fmd-syn-*` variable. Until these were
 * defined, all ten resolved to `currentColor`, so a `.py` file in the editor was
 * one flat colour while the read-only pane coloured it properly. The values
 * mirror the explorer's `--fx-syn-*` table, which is what makes the two surfaces
 * agree rather than merely both being coloured.
 */
import { describe, expect, it } from "vitest";

import { MARKDOWN_STYLES } from "../src/client/styles.ts";

/** The ten syntax roles the highlight style names, and the token each resolves to. */
const EXPECTED: Readonly<Record<string, string>> = {
  keyword: "var(--dsw-alias-state-business-primary, currentColor)",
  string: "var(--dsw-alias-state-success-primary, currentColor)",
  number: "var(--dsw-alias-state-warn-primary, currentColor)",
  comment: "var(--fmd-caption)",
  function:
    "color-mix(in oklab, var(--fmd-accent) 65%, var(--dsw-alias-state-success-primary, currentColor))",
  type: "var(--dsw-alias-state-error-primary, currentColor)",
  property: "var(--dsw-alias-label-secondary, currentColor)",
  heading: "var(--fmd-text)",
  link: "var(--fmd-accent)",
  invalid: "var(--dsw-alias-state-error-primary, currentColor)",
};

describe("syntax palette", () => {
  it("defines all ten syntax roles", () => {
    for (const role of Object.keys(EXPECTED)) {
      expect(MARKDOWN_STYLES, `--fmd-syn-${role}`).toContain(`--fmd-syn-${role}:`);
    }
  });

  it("resolves each role to the same token the read-only pane uses", () => {
    for (const [role, value] of Object.entries(EXPECTED)) {
      expect(MARKDOWN_STYLES, `--fmd-syn-${role}`).toContain(`--fmd-syn-${role}: ${value};`);
    }
  });

  it("defines exactly the ten roles, so a typo cannot hide as an extra", () => {
    const declared = [...MARKDOWN_STYLES.matchAll(/--fmd-syn-([a-z]+)\s*:/gu)].map(match => match[1]);
    expect(declared.sort()).toEqual(Object.keys(EXPECTED).sort());
  });
});
