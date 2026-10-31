/**
 * The stylesheet one recompute produces.
 *
 * A rule is the only thing that reaches the page, so these cases pin the text
 * itself: the four-tier ladder's colours, that bold belongs to a workspace title
 * and never to a session title, that a session row is selected by its own key
 * rather than through its workspace, and that the same row set always yields the
 * same text. The last point is what keeps the writer from touching the DOM on
 * every host notification.
 *
 * Three mechanisms were removed on purpose — `:has()` group lookup, member
 * follow-through and the opacity curve — and the guards near the end assert their
 * absence rather than trusting the comments above the code.
 */
import { describe, expect, it } from "vitest";
import { DEFAULT_ACTIVITY_CONFIG, resolveConfig, type PaintedTier } from "../src/client/reading.ts";
import { buildStylesheet, type RuleSet, type SessionRule, type WorkspaceRule } from "../src/client/rules.ts";

/** The emphasis token; the strong tier is this colour undiluted. */
const ACCENT = "var(--dsw-alias-state-business-primary)";

/** The body colour the faint mix is pulled towards. */
const BODY = "var(--dsw-alias-label-primary)";

/** The host's class on an archived session row. */
const ARCHIVED = ".JoiKIa_archived";

/** The faint colour at one mix percentage. */
function faint(percent = 55): string {
  return `color-mix(in srgb, ${ACCENT} ${percent}%, ${BODY})`;
}

/** The colour one painted tier carries. */
function colorOf(tier: PaintedTier, percent = 55): string {
  return tier === "strong" ? ACCENT : faint(percent);
}

/** The title and icon rules one workspace contributes. */
function workspaceRules(id: string, tier: PaintedTier, percent = 55): string[] {
  const key = `[data-row-key="workspace:${id}"]`;
  const weight = tier === "strong" || tier === "mid" ? ";font-weight:600" : "";
  return [`${key} .JoiKIa_title{color:${colorOf(tier, percent)}${weight}}`, `${key} > .JoiKIa_slot{color:${colorOf(tier, percent)}}`];
}

/** The title rule one session contributes, always unbolded. */
function sessionRules(id: string, tier: PaintedTier, percent = 55): string[] {
  return [`[data-row-key="session:${id}"]:where(:not(${ARCHIVED})) .JoiKIa_title{color:${colorOf(tier, percent)}}`];
}

/** One workspace's decided row. */
function workspace(workspaceId: string, tier: PaintedTier): WorkspaceRule {
  return { workspaceId, tier };
}

/** One session's decided row. */
function session(sessionId: string, tier: PaintedTier): SessionRule {
  return { sessionId, tier };
}

/** The stylesheet over one row set. */
function sheet(input: Partial<RuleSet>, config = DEFAULT_ACTIVITY_CONFIG): string {
  return buildStylesheet({ workspaces: input.workspaces ?? [], sessions: input.sessions ?? [] }, config);
}

/** The stylesheet split into lines. */
function lines(input: Partial<RuleSet>, config = DEFAULT_ACTIVITY_CONFIG): string[] {
  const text = sheet(input, config);
  return text === "" ? [] : text.split("\n");
}

/** Every quoted value blanked, so only the structure of a rule remains. */
function unquoted(rule: string): string {
  let out = "";
  let inQuote = false;
  for (let index = 0; index < rule.length; index += 1) {
    const char = rule[index];
    if (char === "\\") {
      index += 1;
      continue;
    }
    if (char === '"') {
      inQuote = !inQuote;
      continue;
    }
    if (!inQuote) out += char;
  }
  return out;
}

describe("buildStylesheet", () => {
  it("paints a strong workspace's title with the accent and a heavier weight", () => {
    expect(lines({ workspaces: [workspace("w1", "strong")] })).toEqual(workspaceRules("w1", "strong"));
  });

  it("paints a mid workspace with the faint colour and keeps the weight", () => {
    expect(lines({ workspaces: [workspace("w1", "mid")] })).toEqual(workspaceRules("w1", "mid"));
  });

  it("paints a faint workspace with the faint colour and drops the weight", () => {
    expect(lines({ workspaces: [workspace("w1", "faint")] })).toEqual(workspaceRules("w1", "faint"));
  });

  it("gives every painted tier a different declaration set", () => {
    const strong = workspaceRules("w1", "strong")[0] ?? "";
    const mid = workspaceRules("w1", "mid")[0] ?? "";
    const faintRule = workspaceRules("w1", "faint")[0] ?? "";
    expect(new Set([strong, mid, faintRule]).size).toBe(3);
    // Mid and faint share one colour on purpose: the fifth-hour step is the weight,
    // not the hue, so the ladder has three steps over two colours.
    expect(mid).toContain(faint());
    expect(faintRule).toContain(faint());
    expect(mid).toContain("font-weight:600");
    expect(faintRule).not.toContain("font-weight");
  });

  it("recolours a title with a token the title does not already use", () => {
    const stylesheet = sheet({ workspaces: [workspace("w1", "strong")] });
    expect(stylesheet).toContain("state-business-primary");
    expect(stylesheet).not.toContain("brand-primary");
  });

  it("colours both icon slots of a workspace, because hover swaps which one shows", () => {
    const stylesheet = sheet({ workspaces: [workspace("w1", "strong")] });
    const slot = `[data-row-key="workspace:w1"] > .JoiKIa_slot{color:${ACCENT}}`;
    expect(stylesheet.split("\n")).toContain(slot);
    // One rule covers the folder and the chevron: both are `.JoiKIa_slot` children
    // of the row, and the host toggles them with `display`, so colouring one and
    // not the other would drop the icon colour on hover.
    expect(stylesheet.split("\n").filter((line) => line.includes(".JoiKIa_slot"))).toHaveLength(1);
  });

  it("keeps the icon one tier behind the title, since only the title is weighted", () => {
    for (const tier of ["strong", "mid", "faint"] as const) {
      const [title = "", icon = ""] = workspaceRules("w1", tier);
      expect(icon).toBe(`[data-row-key="workspace:w1"] > .JoiKIa_slot{color:${colorOf(tier)}}`);
      expect(title.replace(";font-weight:600", "")).toBe(icon.replace(" > .JoiKIa_slot", " .JoiKIa_title"));
    }
  });

  it("selects a session row by its own key, with no group lookup", () => {
    const emitted = lines({ sessions: [session("s1", "strong")] });
    expect(emitted).toEqual(sessionRules("s1", "strong"));
    expect(emitted[0]).toContain('[data-row-key="session:s1"]');
  });

  it("never bolds a session title, in any tier", () => {
    const emitted = lines({
      sessions: [session("s1", "strong"), session("s2", "mid"), session("s3", "faint")],
    });
    expect(emitted).toHaveLength(3);
    for (const line of emitted) expect(line).not.toContain("font-weight");
  });

  it("excludes an archived row as a zero-weight condition, not as a weight", () => {
    // The host paints an archived session's title with `--dsw-alias-label-caption`
    // through `.JoiKIa_sessionRow.JoiKIa_archived .JoiKIa_title`, and that caption
    // grey is how the sidebar says "archived". `:where()` adds no specificity, so
    // the exclusion is a condition and the plugin still does not compete with the
    // host's own rule on weight.
    for (const tier of ["strong", "mid", "faint"] as const) {
      for (const line of lines({ sessions: [session("s1", tier)] })) {
        expect(line).toContain(`:where(:not(${ARCHIVED}))`);
        expect(line).not.toContain(":not(.JoiKIa_archived) .");
      }
    }
  });

  it("keeps the workspace and session surfaces apart", () => {
    const emitted = lines({ workspaces: [workspace("w1", "strong")], sessions: [session("s1", "strong")] });
    for (const line of emitted.filter((one) => one.includes("workspace:"))) {
      expect(line).toMatch(/JoiKIa_title|JoiKIa_slot/);
      expect(line).not.toContain("session:");
    }
    for (const line of emitted.filter((one) => one.includes("session:"))) {
      expect(line).toContain("JoiKIa_title");
      expect(line).not.toContain("workspace:");
      expect(line).not.toContain(".JoiKIa_slot");
    }
  });

  it("never touches the row's action area", () => {
    const stylesheet = sheet({ workspaces: [workspace("w1", "strong")], sessions: [session("s1", "strong")] });
    expect(stylesheet).not.toContain("rowActions");
    expect(stylesheet).not.toContain("JoiKIa_time");
  });

  it("reads the faint percentage out of the config", () => {
    const config = resolveConfig({ faintMixPercent: 40 });
    expect(sheet({ workspaces: [workspace("w1", "faint")] }, config)).toContain(
      `color-mix(in srgb, ${ACCENT} 40%, ${BODY})`,
    );
    expect(sheet({ sessions: [session("s1", "mid")] }, config)).toContain(
      `color-mix(in srgb, ${ACCENT} 40%, ${BODY})`,
    );
    expect(sheet({ workspaces: [workspace("w1", "strong")] }, config)).not.toContain("color-mix");
  });

  it("orders workspaces then sessions, each by id rather than by arrival", () => {
    expect(
      lines({
        workspaces: [workspace("w2", "faint"), workspace("w1", "strong")],
        sessions: [session("s2", "faint"), session("s1", "mid")],
      }),
    ).toEqual([
      ...workspaceRules("w1", "strong"),
      ...workspaceRules("w2", "faint"),
      ...sessionRules("s1", "mid"),
      ...sessionRules("s2", "faint"),
    ]);
  });

  it("produces identical text for the same set in another order", () => {
    const one: RuleSet = { workspaces: [workspace("w2", "mid"), workspace("w1", "strong")], sessions: [session("s2", "faint"), session("s1", "faint")] };
    const other: RuleSet = { workspaces: [workspace("w1", "strong"), workspace("w2", "mid")], sessions: [session("s1", "faint"), session("s2", "faint")] };
    expect(buildStylesheet(one, DEFAULT_ACTIVITY_CONFIG)).toBe(buildStylesheet(other, DEFAULT_ACTIVITY_CONFIG));
  });

  it("emits nothing at all when no row is painted", () => {
    expect(buildStylesheet({ workspaces: [], sessions: [] }, DEFAULT_ACTIVITY_CONFIG)).toBe("");
  });

  it("emits nothing when the plugin is disabled", () => {
    const disabled = { ...DEFAULT_ACTIVITY_CONFIG, enabled: false };
    expect(buildStylesheet({ workspaces: [workspace("w1", "strong")], sessions: [session("s1", "strong")] }, disabled)).toBe("");
  });

  it("never reaches for !important, which would outlive the plugin's own unmount", () => {
    const stylesheet = sheet({ workspaces: [workspace("w1", "strong")], sessions: [session("s1", "strong")] });
    expect(stylesheet).not.toContain("!important");
  });

  it("carries no theme gate, because both colours are tokens that follow the theme", () => {
    const stylesheet = sheet({ workspaces: [workspace("w1", "mid")], sessions: [session("s1", "faint")] });
    expect(stylesheet).not.toContain("data-ds-dark-theme");
    expect(stylesheet).not.toContain("prefers-color-scheme");
  });
});

describe("removed mechanisms", () => {
  it("has no :has() group selector", () => {
    expect(sheet({ workspaces: [workspace("w1", "strong")], sessions: [session("s1", "strong")] })).not.toContain(":has(");
  });

  it("has no opacity rule", () => {
    const stylesheet = sheet({
      workspaces: [workspace("w1", "strong"), workspace("w2", "mid"), workspace("w3", "faint")],
      sessions: [session("s1", "strong"), session("s2", "mid"), session("s3", "faint")],
    });
    expect(stylesheet).not.toContain("opacity");
  });

  it("has no group-section depth logic", () => {
    expect(sheet({ workspaces: [workspace("w1", "strong")], sessions: [session("s1", "strong")] })).not.toContain(
      "Kjh-qa_groupSection",
    );
  });
});

describe("hostile ids", () => {
  it("escapes a quote and a backslash", () => {
    expect(lines({ workspaces: [workspace('a"b', "strong")] })).toEqual(workspaceRules('a\\"b', "strong"));
    expect(lines({ sessions: [session("a\\b", "faint")] })).toEqual(sessionRules("a\\\\b", "faint"));
  });

  it("drops a line break rather than escaping it, so one row stays one line", () => {
    expect(lines({ sessions: [session("a\nb", "mid")] })).toEqual(sessionRules("ab", "mid"));
  });

  it("keeps every hostile id inside one legal attribute selector", () => {
    const ids = ['a"b', "a\\b", "a\nb", "a\rb", "a\u0000b", "a\u2028b", '"]{color:red}[data-row-key="'];
    const emitted = lines({ sessions: ids.map((id) => session(id, "faint")) });
    expect(emitted).toHaveLength(ids.length);

    for (const line of emitted) {
      const structure = unquoted(line);
      // Exactly one declaration block: an injected `"]{color:red}[data-row-key="`
      // would open a second one.
      expect(structure.split("{")).toHaveLength(2);
      expect(structure.endsWith(`{color:${faint()}}`)).toBe(true);
      expect(line.match(/data-row-key="session:/g) ?? []).toHaveLength(1);
    }
  });
});
