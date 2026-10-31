/**
 * The stylesheet one recompute produces.
 *
 * A rule is the only thing that reaches the page, so these cases pin the text
 * itself: which effect each tier is allowed to carry, that archived rows dim
 * only, and that the same row set always yields the same text. The last point is
 * what keeps the writer from touching the DOM on every host notification.
 */
import { describe, expect, it } from "vitest";
import { DEFAULT_ACTIVITY_CONFIG } from "../src/client/reading.ts";
import { buildStylesheet, type RowRule } from "../src/client/rules.ts";

/** The two invariants every stylesheet ends with. */
const BASE = ['[data-row-key^="session:"]:hover{opacity:1}', '[data-row-key^="session:"][aria-selected="true"]{opacity:1}'];

/** One row rule with the fields a case does not care about filled in. */
function row(overrides: Partial<RowRule> & Pick<RowRule, "sessionId" | "tier">): RowRule {
  return { opacity: 1, archived: false, ...overrides };
}

/** The stylesheet split into lines. */
function lines(rows: readonly RowRule[]): string[] {
  return buildStylesheet(rows, DEFAULT_ACTIVITY_CONFIG).split("\n");
}

describe("buildStylesheet", () => {
  it("marks a hot row with the accent colour and a heavier weight", () => {
    expect(lines([row({ sessionId: "s1", tier: "hot" })])).toEqual([
      '[data-row-key="session:s1"]{color:var(--dsw-alias-state-business-primary);font-weight:600}',
      ...BASE,
    ]);
  });

  it("recolours a hot row with a token the row does not already use", () => {
    const stylesheet = buildStylesheet([row({ sessionId: "s1", tier: "hot" })], DEFAULT_ACTIVITY_CONFIG);
    expect(stylesheet).toContain("state-business-primary");
    expect(stylesheet).not.toContain("brand-primary");
  });

  it("dims a dim row by opacity alone", () => {
    expect(lines([row({ sessionId: "s1", tier: "dim", opacity: 0.55 })])).toEqual(['[data-row-key="session:s1"]{opacity:0.55}', ...BASE]);
  });

  it("leaves a warm row exactly as the host renders it", () => {
    expect(lines([row({ sessionId: "s1", tier: "warm" })])).toEqual(BASE);
  });

  it("dims an archived row without recolouring it", () => {
    expect(lines([row({ sessionId: "s1", tier: "hot", archived: true })])).toEqual(['[data-row-key="session:s1"]{opacity:1}', ...BASE]);
    expect(lines([row({ sessionId: "s1", tier: "dim", opacity: 0.55, archived: true })])).toEqual([
      '[data-row-key="session:s1"]{opacity:0.55}',
      ...BASE,
    ]);
  });

  it("orders rules by session id, not by arrival", () => {
    expect(lines([row({ sessionId: "s2", tier: "hot" }), row({ sessionId: "s1", tier: "hot" })])).toEqual([
      '[data-row-key="session:s1"]{color:var(--dsw-alias-state-business-primary);font-weight:600}',
      '[data-row-key="session:s2"]{color:var(--dsw-alias-state-business-primary);font-weight:600}',
      ...BASE,
    ]);
  });

  it("produces identical text for the same set in another order", () => {
    const one = [row({ sessionId: "s3", tier: "dim", opacity: 0.7 }), row({ sessionId: "s1", tier: "hot" })];
    const other = [row({ sessionId: "s1", tier: "hot" }), row({ sessionId: "s3", tier: "dim", opacity: 0.7 })];
    expect(buildStylesheet(one, DEFAULT_ACTIVITY_CONFIG)).toBe(buildStylesheet(other, DEFAULT_ACTIVITY_CONFIG));
  });

  it("keeps the interaction invariants with no rows at all", () => {
    expect(buildStylesheet([], DEFAULT_ACTIVITY_CONFIG)).toBe(BASE.join("\n"));
  });

  it("keeps them too when the plugin is disabled", () => {
    const disabled = { ...DEFAULT_ACTIVITY_CONFIG, enabled: false };
    expect(buildStylesheet([row({ sessionId: "s1", tier: "hot" })], disabled)).toBe(BASE.join("\n"));
  });

  it("ends every stylesheet with the invariants", () => {
    const stylesheet = buildStylesheet([row({ sessionId: "s1", tier: "hot" })], DEFAULT_ACTIVITY_CONFIG);
    expect(stylesheet.endsWith(BASE.join("\n"))).toBe(true);
  });

  it("escapes a quote and a backslash in the session id", () => {
    expect(lines([row({ sessionId: 'a"b', tier: "hot" })])).toEqual([
      '[data-row-key="session:a\\"b"]{color:var(--dsw-alias-state-business-primary);font-weight:600}',
      ...BASE,
    ]);
    expect(lines([row({ sessionId: "a\\b", tier: "dim", opacity: 0.55 })])).toEqual([
      '[data-row-key="session:a\\\\b"]{opacity:0.55}',
      ...BASE,
    ]);
  });

  it("drops a line break rather than escaping it, so one row stays one line", () => {
    expect(lines([row({ sessionId: "a\nb", tier: "dim", opacity: 0.55 })])).toEqual(['[data-row-key="session:ab"]{opacity:0.55}', ...BASE]);
  });

  it("keeps every hostile id inside one legal attribute selector", () => {
    const ids = ['a"b', "a\\b", "a\nb", "a\rb", "a\u0000b", "a\u2028b", '"]{opacity:0}[data-row-key="'];
    const stylesheet = buildStylesheet(
      ids.map((sessionId) => row({ sessionId, tier: "dim", opacity: 0.5 })),
      DEFAULT_ACTIVITY_CONFIG,
    );
    const emitted = stylesheet.split("\n");
    expect(emitted).toHaveLength(ids.length + BASE.length);
    for (const line of emitted.slice(0, ids.length)) {
      expect(line).toMatch(/^\[data-row-key="(?:[^"\\\u0000-\u001f\u007f-\u009f\u2028\u2029]|\\.)*"\]\{opacity:0\.5\}$/);
    }
    expect(emitted.slice(ids.length)).toEqual(BASE);
  });
});
