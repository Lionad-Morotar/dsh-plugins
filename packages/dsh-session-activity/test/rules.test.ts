/**
 * The stylesheet one recompute produces.
 *
 * A rule is the only thing that reaches the page, so these cases pin the text
 * itself: which effect each tier is allowed to carry, that a painted workspace
 * reaches its own title, its two icon slots and its member session titles and
 * nothing else, that the light and dark curves are emitted as two rules rather
 * than one, and that the same row set always yields the same text. The last point
 * is what keeps the writer from touching the DOM on every host notification.
 *
 * Specificity is asserted by parsing the emitted selectors rather than by trusting
 * a comment: the interaction invariants only work because they outrank every
 * generated rule, and the dark rule carries a theme gate that must not quietly
 * lift it above them.
 */
import { describe, expect, it } from "vitest";
import { DEFAULT_ACTIVITY_CONFIG } from "../src/client/reading.ts";
import { buildStylesheet, type WorkspaceRule } from "../src/client/rules.ts";

/** The invariants every stylesheet ends with, in emit order. */
const BASE = [
  '[data-row-key^="workspace:"]:hover .JoiKIa_title{opacity:1}',
  '[data-row-key^="workspace:"]:has(.JoiKIa_folderActive) .JoiKIa_title{opacity:1}',
  'div.Kjh-qa_groupSection:has(> [data-row-key^="workspace:"], > * > [data-row-key^="workspace:"]):hover [data-row-key^="session:"] .JoiKIa_title{opacity:1}',
  'div.Kjh-qa_groupSection:has([data-row-key^="workspace:"] .JoiKIa_folderActive) [data-row-key^="session:"] .JoiKIa_title{opacity:1}',
];

/** The accent a hot workspace's title and icon slots carry. */
const ACCENT = "var(--dsw-alias-state-business-primary)";

/** The title emphasis a hot workspace carries. */
const HOT = `color:${ACCENT};font-weight:600`;

/** The colour a hot workspace's icon slots carry, so they match the title. */
const ICON = `color:${ACCENT}`;

/** The theme gate the dark rules carry. */
const DARK = ":where(body[data-ds-dark-theme])";

/**
 * The group whose own header row is one workspace.
 *
 * Two branches because the host wraps a row that carries a hover card in a `span`:
 * a real workspace's row is a grandchild of the group, one without a hover card is
 * a child. A plain descendant would also catch a nested child workspace's group.
 */
function groupOf(workspaceId: string): string {
  const row = `[data-row-key="workspace:${workspaceId}"]`;
  return `div.Kjh-qa_groupSection:has(> ${row}, > * > ${row})`;
}

/**
 * The selectors for one workspace's member titles, one per row depth.
 *
 * The depth is pinned rather than left as a descendant so a nested child
 * workspace's sessions cannot be painted with their parent's tier.
 */
function membersOf(workspaceId: string): string {
  const group = groupOf(workspaceId);
  const sessionRow = '[data-row-key^="session:"]';
  return `${group} > ${sessionRow} .JoiKIa_title,${group} > * > ${sessionRow} .JoiKIa_title`;
}

/** Prefix every selector of a list with the theme gate. */
function darken(list: string): string {
  return splitSelectorList(list)
    .map((one) => `${DARK} ${one}`)
    .join(",");
}

/** One row rule with the fields a case does not care about filled in. */
function row(overrides: Partial<WorkspaceRule> & Pick<WorkspaceRule, "workspaceId" | "tier">): WorkspaceRule {
  return { opacityLight: 1, opacityDark: 1, ...overrides };
}

/** The stylesheet split into lines. */
function lines(rows: readonly WorkspaceRule[]): string[] {
  return buildStylesheet(rows, DEFAULT_ACTIVITY_CONFIG).split("\n");
}

/** The three rules one hot workspace contributes. */
function hotRules(workspaceId: string): string[] {
  const key = `[data-row-key="workspace:${workspaceId}"]`;
  return [
    `${key} .JoiKIa_title{${HOT}}`,
    `${key} > .JoiKIa_slot{${ICON}}`,
    `${membersOf(workspaceId)}{${HOT}}`,
  ];
}

/** The four rules one dim workspace contributes: both surfaces, both themes. */
function dimRules(workspaceId: string, light: number, dark: number): string[] {
  const key = `[data-row-key="workspace:${workspaceId}"]`;
  const title = `${key} .JoiKIa_title`;
  const members = membersOf(workspaceId);
  return [
    `${title}{opacity:${light}}`,
    `${members}{opacity:${light}}`,
    `${DARK} ${title}{opacity:${dark}}`,
    `${darken(members)}{opacity:${dark}}`,
  ];
}

/** A selector's specificity as [ids, classes, types]. */
type Specificity = readonly [number, number, number];

/** Compare two specificities the way the cascade does. */
function compareSpecificity(left: Specificity, right: Specificity): number {
  for (let index = 0; index < 3; index += 1) {
    const difference = (left[index] ?? 0) - (right[index] ?? 0);
    if (difference !== 0) return difference;
  }
  return 0;
}

/** Index just past the identifier starting at `start`. */
function endOfIdent(selector: string, start: number): number {
  let index = start;
  while (index < selector.length && /[A-Za-z0-9_-]/.test(selector[index] ?? "")) index += 1;
  return index;
}

/** Index just past the `]` closing the attribute selector starting at `start`. */
function endOfAttribute(selector: string, start: number): number {
  let index = start + 1;
  let quote = "";
  while (index < selector.length) {
    const char = selector[index];
    if (quote !== "") {
      if (char === "\\") index += 1;
      else if (char === quote) quote = "";
    } else if (char === '"' || char === "'") quote = char;
    else if (char === "]") return index + 1;
    index += 1;
  }
  return selector.length;
}

/** Index just past the `)` closing the parenthesis starting at `start`. */
function endOfParen(selector: string, start: number): number {
  let depth = 0;
  let index = start;
  let quote = "";
  while (index < selector.length) {
    const char = selector[index];
    if (quote !== "") {
      if (char === "\\") index += 1;
      else if (char === quote) quote = "";
    } else if (char === '"' || char === "'") quote = char;
    else if (char === "(") depth += 1;
    else if (char === ")") {
      depth -= 1;
      if (depth === 0) return index + 1;
    }
    index += 1;
  }
  return selector.length;
}

/** Split a selector list at its top level commas. */
function splitSelectorList(list: string): string[] {
  const parts: string[] = [];
  let depth = 0;
  let quote = "";
  let start = 0;
  for (let index = 0; index < list.length; index += 1) {
    const char = list[index];
    if (quote !== "") {
      if (char === "\\") index += 1;
      else if (char === quote) quote = "";
    } else if (char === '"' || char === "'") quote = char;
    else if (char === "(" || char === "[") depth += 1;
    else if (char === ")" || char === "]") depth -= 1;
    else if (char === "," && depth === 0) {
      parts.push(list.slice(start, index));
      start = index + 1;
    }
  }
  parts.push(list.slice(start));
  return parts;
}

/**
 * The rule with every quoted value blanked, so only its structure remains.
 *
 * A hostile id can put a brace inside a quoted attribute value, where CSS treats
 * it as inert text; what must not survive is a brace in structural position, which
 * is what this leaves behind.
 */
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

/** The most specific selector of a list. */
function mostSpecific(list: string): Specificity {
  let best: Specificity = [0, 0, 0];
  for (const one of splitSelectorList(list)) {
    const candidate = specificityOf(one);
    if (compareSpecificity(candidate, best) > 0) best = candidate;
  }
  return best;
}

/**
 * The specificity of one complex selector.
 *
 * `:where()` contributes nothing and `:is()` / `:has()` / `:not()` contribute
 * their most specific argument, which is what makes the dark theme gate a
 * condition rather than a weight.
 */
function specificityOf(selector: string): Specificity {
  let ids = 0;
  let classes = 0;
  let types = 0;
  let index = 0;
  while (index < selector.length) {
    const char = selector[index] ?? "";
    if (char === "#") {
      index = endOfIdent(selector, index + 1);
      ids += 1;
    } else if (char === ".") {
      index = endOfIdent(selector, index + 1);
      classes += 1;
    } else if (char === "[") {
      index = endOfAttribute(selector, index);
      classes += 1;
    } else if (char === ":") {
      const nameStart = index + 1;
      index = endOfIdent(selector, nameStart);
      const name = selector.slice(nameStart, index).toLowerCase();
      if (selector[index] === "(") {
        const end = endOfParen(selector, index);
        const argument = selector.slice(index + 1, end - 1);
        index = end;
        if (name === "where") continue;
        if (name === "has" || name === "is" || name === "not") {
          const inner = mostSpecific(argument);
          ids += inner[0];
          classes += inner[1];
          types += inner[2];
          continue;
        }
        classes += 1;
      } else {
        classes += 1;
      }
    } else if (/[A-Za-z]/.test(char)) {
      index = endOfIdent(selector, index);
      types += 1;
    } else {
      index += 1;
    }
  }
  return [ids, classes, types];
}

/** The selector of one emitted rule, which is everything before its `{`. */
function selectorOf(rule: string): string {
  return rule.slice(0, rule.indexOf("{"));
}

/**
 * The specificity of a rule's selector list.
 *
 * Each part of a list is matched on its own, so a rule is as strong as its
 * strongest part. Collapsing the list to its maximum is what the cascade does.
 */
function specificityOfRule(rule: string): Specificity {
  return mostSpecific(selectorOf(rule));
}

/** Every emitted rule's selector, in emit order. */
function selectors(stylesheet: string): string[] {
  return stylesheet.split("\n").map(selectorOf);
}

describe("buildStylesheet", () => {
  it("marks a hot workspace's title with the accent colour and a heavier weight", () => {
    expect(lines([row({ workspaceId: "w1", tier: "hot" })])).toEqual([...hotRules("w1"), ...BASE]);
  });

  it("recolours a hot title with a token the title does not already use", () => {
    const stylesheet = buildStylesheet([row({ workspaceId: "w1", tier: "hot" })], DEFAULT_ACTIVITY_CONFIG);
    expect(stylesheet).toContain("state-business-primary");
    expect(stylesheet).not.toContain("brand-primary");
  });

  it("colours both icon slots of a hot row, because hover swaps which one shows", () => {
    const stylesheet = buildStylesheet([row({ workspaceId: "w1", tier: "hot" })], DEFAULT_ACTIVITY_CONFIG);
    const slot = '[data-row-key="workspace:w1"] > .JoiKIa_slot{color:var(--dsw-alias-state-business-primary)}';
    expect(stylesheet.split("\n")).toContain(slot);
    // One rule covers the folder and the chevron: both are `.JoiKIa_slot` children
    // of the row, and the host toggles them with `display`, so colouring one and
    // not the other would drop the icon colour on hover.
    expect(selectors(stylesheet).filter((one) => one.includes(".JoiKIa_slot"))).toEqual([
      '[data-row-key="workspace:w1"] > .JoiKIa_slot',
    ]);
  });

  it("uses one accent token for the title, the icons and the member titles", () => {
    const stylesheet = buildStylesheet([row({ workspaceId: "w1", tier: "hot" })], DEFAULT_ACTIVITY_CONFIG);
    const tokens = stylesheet.split("\n").flatMap((line) => [...line.matchAll(/var\(([^)]+)\)/g)].map((match) => match[1]));
    expect(new Set(tokens)).toEqual(new Set(["--dsw-alias-state-business-primary"]));
  });

  it("makes a hot workspace's member session titles follow it", () => {
    const stylesheet = buildStylesheet([row({ workspaceId: "w1", tier: "hot" })], DEFAULT_ACTIVITY_CONFIG);
    expect(stylesheet.split("\n")).toContain(
      `${membersOf("w1")}{${HOT}}`,
    );
  });

  it("dims a dim workspace's title and its members in both themes", () => {
    expect(lines([row({ workspaceId: "w1", tier: "dim", opacityLight: 0.4, opacityDark: 0.55 })])).toEqual([
      ...dimRules("w1", 0.4, 0.55),
      ...BASE,
    ]);
  });

  it("emits two different opacities for the two themes", () => {
    const [lightTitle, , darkTitle] = dimRules("w1", 0.4, 0.55);
    expect(lightTitle).toContain("opacity:0.4");
    expect(darkTitle).toContain("opacity:0.55");
    // The two rules are the same selector with the same declarations apart from
    // the value, so nothing but the opacity tells them apart.
    expect(lightTitle).not.toBe((darkTitle ?? "").replace(`${DARK} `, ""));
  });

  it("gates the dark rules on the host's theme attribute, not on a media query", () => {
    const stylesheet = buildStylesheet([row({ workspaceId: "w1", tier: "dim", opacityLight: 0.4, opacityDark: 0.55 })], DEFAULT_ACTIVITY_CONFIG);
    const dark = stylesheet.split("\n").filter((line) => line.includes("data-ds-dark-theme"));
    expect(dark).toHaveLength(2);
    for (const line of dark) expect(line.startsWith(DARK)).toBe(true);
    expect(stylesheet).not.toContain("prefers-color-scheme");
  });

  it("keeps the theme gate out of the cascade's weight", () => {
    // The gate is a condition, not a lever: `:where()` zeroes its specificity so a
    // dark rule weighs exactly what its light twin does, and the invariants keep
    // their margin in both themes.
    const stylesheet = buildStylesheet([row({ workspaceId: "w1", tier: "dim", opacityLight: 0.4, opacityDark: 0.55 })], DEFAULT_ACTIVITY_CONFIG);
    const [lightTitle, lightMembers, darkTitle, darkMembers] = selectors(stylesheet);
    expect(compareSpecificity(specificityOf(darkTitle ?? ""), specificityOf(lightTitle ?? ""))).toBe(0);
    expect(compareSpecificity(mostSpecific(darkMembers ?? ""), mostSpecific(lightMembers ?? ""))).toBe(0);
  });

  it("leaves a warm workspace exactly as the host renders it", () => {
    expect(lines([row({ workspaceId: "w1", tier: "warm" })])).toEqual(BASE);
  });

  it("targets only a painted workspace's title, icon slots and member titles", () => {
    const stylesheet = buildStylesheet(
      [row({ workspaceId: "w1", tier: "hot" }), row({ workspaceId: "w2", tier: "dim", opacityLight: 0.4, opacityDark: 0.55 })],
      DEFAULT_ACTIVITY_CONFIG,
    );
    for (const selector of selectors(stylesheet).slice(0, 7)) {
      expect(selector).toMatch(/JoiKIa_title|JoiKIa_slot/);
      expect(selector).not.toContain("rowActions");
      expect(selector).not.toContain("projectRow{");
    }
  });

  it("never names a session id, so a member follows through its group and not its identity", () => {
    const stylesheet = buildStylesheet(
      [row({ workspaceId: "w1", tier: "hot" }), row({ workspaceId: "w2", tier: "dim", opacityLight: 0.4, opacityDark: 0.55 })],
      DEFAULT_ACTIVITY_CONFIG,
    );
    expect(stylesheet).not.toMatch(/data-row-key="session:/);
    expect(stylesheet).not.toContain(".JoiKIa_sessionRow");
    for (const selector of selectors(stylesheet).filter((one) => one.includes("session:"))) {
      expect(selector).toContain('[data-row-key^="session:"]');
    }
  });

  it("uses :has() only on the member rules, so a workspace paints without it", () => {
    const stylesheet = buildStylesheet(
      [row({ workspaceId: "w1", tier: "hot" }), row({ workspaceId: "w2", tier: "dim", opacityLight: 0.4, opacityDark: 0.55 })],
      DEFAULT_ACTIVITY_CONFIG,
    );
    const generated = selectors(stylesheet).slice(0, 7);
    for (const selector of generated) {
      if (selector.includes(":has(")) expect(selector).toContain('[data-row-key^="session:"]');
    }
    // The workspace title and icon rules must stay reachable without :has(), which
    // is the degradation boundary: an engine without it still tints the row itself.
    for (const selector of generated.filter((one) => !one.includes("session:"))) {
      expect(selector).not.toContain(":has(");
    }
  });

  it("orders rules by workspace id, not by arrival", () => {
    expect(lines([row({ workspaceId: "w2", tier: "hot" }), row({ workspaceId: "w1", tier: "hot" })])).toEqual([
      ...hotRules("w1"),
      ...hotRules("w2"),
      ...BASE,
    ]);
  });

  it("produces identical text for the same set in another order", () => {
    const one = [row({ workspaceId: "w3", tier: "dim", opacityLight: 0.6, opacityDark: 0.7 }), row({ workspaceId: "w1", tier: "hot" })];
    const other = [row({ workspaceId: "w1", tier: "hot" }), row({ workspaceId: "w3", tier: "dim", opacityLight: 0.6, opacityDark: 0.7 })];
    expect(buildStylesheet(one, DEFAULT_ACTIVITY_CONFIG)).toBe(buildStylesheet(other, DEFAULT_ACTIVITY_CONFIG));
  });

  it("keeps the interaction invariants with no rows at all", () => {
    expect(buildStylesheet([], DEFAULT_ACTIVITY_CONFIG)).toBe(BASE.join("\n"));
  });

  it("keeps them too when the plugin is disabled", () => {
    const disabled = { ...DEFAULT_ACTIVITY_CONFIG, enabled: false };
    expect(buildStylesheet([row({ workspaceId: "w1", tier: "hot" })], disabled)).toBe(BASE.join("\n"));
  });

  it("ends every stylesheet with the invariants, in emit order", () => {
    const stylesheet = buildStylesheet([row({ workspaceId: "w1", tier: "dim", opacityLight: 0.4, opacityDark: 0.55 })], DEFAULT_ACTIVITY_CONFIG);
    expect(stylesheet.endsWith(BASE.join("\n"))).toBe(true);
    expect(selectors(stylesheet).slice(-BASE.length)).toEqual(BASE.map(selectorOf));
  });

  it("outranks every generated rule with each invariant", () => {
    const stylesheet = buildStylesheet(
      [
        row({ workspaceId: "w1", tier: "hot" }),
        row({ workspaceId: "w2", tier: "dim", opacityLight: 0.4, opacityDark: 0.55 }),
      ],
      DEFAULT_ACTIVITY_CONFIG,
    );
    const emitted = selectors(stylesheet);
    const generated = emitted.slice(0, emitted.length - BASE.length);
    const invariants = emitted.slice(-BASE.length);
    for (const invariant of invariants) {
      for (const rule of generated) {
        // Both target the same element only when both name a title; the icon rule
        // carries no opacity, so it is out of the invariants' scope.
        if (!rule.includes("JoiKIa_title") || !invariant.includes("JoiKIa_title")) continue;
        if (rule.includes("session:") !== invariant.includes("session:")) continue;
        expect(
          compareSpecificity(specificityOfRule(invariant), specificityOfRule(rule)),
          `${invariant} must outrank ${rule}`,
        ).toBeGreaterThan(0);
      }
    }
  });

  it("escapes a quote and a backslash in the workspace id", () => {
    expect(lines([row({ workspaceId: 'a"b', tier: "hot" })])).toEqual([...hotRules('a\\"b'), ...BASE]);
    expect(lines([row({ workspaceId: "a\\b", tier: "dim", opacityLight: 0.5, opacityDark: 0.5 })])).toEqual([
      ...dimRules("a\\\\b", 0.5, 0.5),
      ...BASE,
    ]);
  });

  it("drops a line break rather than escaping it, so one row stays one line", () => {
    expect(lines([row({ workspaceId: "a\nb", tier: "dim", opacityLight: 0.5, opacityDark: 0.5 })])).toEqual([
      ...dimRules("ab", 0.5, 0.5),
      ...BASE,
    ]);
  });

  it("keeps every hostile id inside one legal attribute selector", () => {
    const ids = ['a"b', "a\\b", "a\nb", "a\rb", "a\u0000b", "a\u2028b", '"]{opacity:0}[data-row-key="'];
    const stylesheet = buildStylesheet(
      ids.map((workspaceId) => row({ workspaceId, tier: "dim", opacityLight: 0.5, opacityDark: 0.5 })),
      DEFAULT_ACTIVITY_CONFIG,
    );
    const emitted = stylesheet.split("\n");
    // One id never splits a rule and never merges two: four lines per workspace,
    // which is what an unescaped newline or an injected brace would break.
    expect(emitted).toHaveLength(ids.length * 4 + BASE.length);

    for (const line of emitted.slice(0, ids.length * 4)) {
      const structure = unquoted(line);
      // Exactly one declaration block and one closing brace: an injected
      // `"]{opacity:0}[data-row-key="` would open a second block.
      expect(structure.split("{")).toHaveLength(2);
      expect(structure.endsWith("{opacity:0.5}")).toBe(true);
      // A title rule names the row once; a member rule names it twice per branch,
      // because each branch repeats the group's `:has()` argument.
      const keys = line.match(/data-row-key="workspace:/g) ?? [];
      expect([1, 4]).toContain(keys.length);
    }
    expect(emitted.slice(ids.length * 4)).toEqual(BASE);
  });

});
