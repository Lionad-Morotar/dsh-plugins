/**
 * The stylesheet one recompute produces.
 *
 * A rule is the only thing that reaches the page, so these cases pin the text
 * itself: which effect each tier is allowed to carry, that the tint lands on the
 * workspace title and nowhere else, that session rows are left entirely to the
 * host, and that the same row set always yields the same text. The last point is
 * what keeps the writer from touching the DOM on every host notification.
 */
import { describe, expect, it } from "vitest";
import { DEFAULT_ACTIVITY_CONFIG } from "../src/client/reading.ts";
import { buildStylesheet, type WorkspaceRule } from "../src/client/rules.ts";

/** The two invariants every stylesheet ends with. */
const BASE = [
  '[data-row-key^="workspace:"]:hover .JoiKIa_title{opacity:1}',
  '[data-row-key^="workspace:"]:has(.JoiKIa_folderActive) .JoiKIa_title{opacity:1}',
];

/** The accent a hot workspace's title carries. */
const HOT = "color:var(--dsw-alias-state-business-primary);font-weight:600";

/** One row rule with the fields a case does not care about filled in. */
function row(overrides: Partial<WorkspaceRule> & Pick<WorkspaceRule, "workspaceId" | "tier">): WorkspaceRule {
  return { opacity: 1, ...overrides };
}

/** The stylesheet split into lines. */
function lines(rows: readonly WorkspaceRule[]): string[] {
  return buildStylesheet(rows, DEFAULT_ACTIVITY_CONFIG).split("\n");
}

describe("buildStylesheet", () => {
  it("marks a hot workspace's title with the accent colour and a heavier weight", () => {
    expect(lines([row({ workspaceId: "w1", tier: "hot" })])).toEqual([`[data-row-key="workspace:w1"] .JoiKIa_title{${HOT}}`, ...BASE]);
  });

  it("recolours a hot title with a token the title does not already use", () => {
    const stylesheet = buildStylesheet([row({ workspaceId: "w1", tier: "hot" })], DEFAULT_ACTIVITY_CONFIG);
    expect(stylesheet).toContain("state-business-primary");
    expect(stylesheet).not.toContain("brand-primary");
  });

  it("dims a dim title by opacity alone", () => {
    expect(lines([row({ workspaceId: "w1", tier: "dim", opacity: 0.55 })])).toEqual([
      '[data-row-key="workspace:w1"] .JoiKIa_title{opacity:0.55}',
      ...BASE,
    ]);
  });

  it("leaves a warm workspace exactly as the host renders it", () => {
    expect(lines([row({ workspaceId: "w1", tier: "warm" })])).toEqual(BASE);
  });

  it("never targets anything but the title, so the icon and row actions keep their states", () => {
    const stylesheet = buildStylesheet(
      [row({ workspaceId: "w1", tier: "hot" }), row({ workspaceId: "w2", tier: "dim", opacity: 0.55 })],
      DEFAULT_ACTIVITY_CONFIG,
    );
    for (const line of stylesheet.split("\n").slice(0, 2)) {
      expect(line).toMatch(/^\[data-row-key="workspace:[^"]*"\] \.JoiKIa_title\{[^}]*\}$/);
    }
  });

  it("produces no rule for a session row, which the host keeps exactly as it renders it", () => {
    const stylesheet = buildStylesheet(
      [row({ workspaceId: "w1", tier: "hot" }), row({ workspaceId: "w2", tier: "dim", opacity: 0.55 })],
      DEFAULT_ACTIVITY_CONFIG,
    );
    expect(stylesheet).not.toContain('data-row-key="session:');
    expect(stylesheet).not.toContain("[data-row-key^=\"session:\"]");
    expect(stylesheet).not.toContain(".JoiKIa_sessionRow");
  });

  it("orders rules by workspace id, not by arrival", () => {
    expect(lines([row({ workspaceId: "w2", tier: "hot" }), row({ workspaceId: "w1", tier: "hot" })])).toEqual([
      `[data-row-key="workspace:w1"] .JoiKIa_title{${HOT}}`,
      `[data-row-key="workspace:w2"] .JoiKIa_title{${HOT}}`,
      ...BASE,
    ]);
  });

  it("produces identical text for the same set in another order", () => {
    const one = [row({ workspaceId: "w3", tier: "dim", opacity: 0.7 }), row({ workspaceId: "w1", tier: "hot" })];
    const other = [row({ workspaceId: "w1", tier: "hot" }), row({ workspaceId: "w3", tier: "dim", opacity: 0.7 })];
    expect(buildStylesheet(one, DEFAULT_ACTIVITY_CONFIG)).toBe(buildStylesheet(other, DEFAULT_ACTIVITY_CONFIG));
  });

  it("keeps the interaction invariants with no rows at all", () => {
    expect(buildStylesheet([], DEFAULT_ACTIVITY_CONFIG)).toBe(BASE.join("\n"));
  });

  it("keeps them too when the plugin is disabled", () => {
    const disabled = { ...DEFAULT_ACTIVITY_CONFIG, enabled: false };
    expect(buildStylesheet([row({ workspaceId: "w1", tier: "hot" })], disabled)).toBe(BASE.join("\n"));
  });

  it("ends every stylesheet with the invariants", () => {
    const stylesheet = buildStylesheet([row({ workspaceId: "w1", tier: "dim", opacity: 0.55 })], DEFAULT_ACTIVITY_CONFIG);
    expect(stylesheet.endsWith(BASE.join("\n"))).toBe(true);
  });

  it("escapes a quote and a backslash in the workspace id", () => {
    expect(lines([row({ workspaceId: 'a"b', tier: "hot" })])).toEqual([`[data-row-key="workspace:a\\"b"] .JoiKIa_title{${HOT}}`, ...BASE]);
    expect(lines([row({ workspaceId: "a\\b", tier: "dim", opacity: 0.55 })])).toEqual([
      '[data-row-key="workspace:a\\\\b"] .JoiKIa_title{opacity:0.55}',
      ...BASE,
    ]);
  });

  it("drops a line break rather than escaping it, so one row stays one line", () => {
    expect(lines([row({ workspaceId: "a\nb", tier: "dim", opacity: 0.55 })])).toEqual([
      '[data-row-key="workspace:ab"] .JoiKIa_title{opacity:0.55}',
      ...BASE,
    ]);
  });

  it("keeps every hostile id inside one legal attribute selector", () => {
    const ids = ['a"b', "a\\b", "a\nb", "a\rb", "a\u0000b", "a\u2028b", '"]{opacity:0}[data-row-key="'];
    const stylesheet = buildStylesheet(
      ids.map((workspaceId) => row({ workspaceId, tier: "dim", opacity: 0.5 })),
      DEFAULT_ACTIVITY_CONFIG,
    );
    const emitted = stylesheet.split("\n");
    expect(emitted).toHaveLength(ids.length + BASE.length);
    for (const line of emitted.slice(0, ids.length)) {
      expect(line).toMatch(/^\[data-row-key="workspace:(?:[^"\\\u0000-\u001f\u007f-\u009f\u2028\u2029]|\\.)*"\] \.JoiKIa_title\{opacity:0\.5\}$/);
    }
    expect(emitted.slice(ids.length)).toEqual(BASE);
  });
});
