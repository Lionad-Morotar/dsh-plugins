/**
 * The stylesheet text for one recompute.
 *
 * A stylesheet, not a component, because the sidebar exposes no seat for a
 * workspace title. The workspace row's `data-row-key` attribute is the only hook
 * that covers every workspace row, so the effect is expressed as attribute
 * selectors and the whole table is rebuilt from scratch on every pass.
 *
 * A painted workspace reaches three surfaces and no more:
 * - its own title, which is the row's label;
 * - its two icon slots, folder and chevron, because the host swaps them on hover
 *   and an icon left at the label's tertiary colour would drop out of the accent
 *   the moment the pointer arrives;
 * - the titles of the sessions under it, so a workspace reads as one level rather
 *   than as a bright header above a column of unrelated labels.
 *
 * The third surface is reached through the group container the host wraps around
 * a workspace row and its members, and that is a deliberate trade: `:has()` is the
 * only way to say "the group whose own header is this workspace". The workspace
 * row itself is still selected by `[data-row-key="workspace:<id>"]` directly, so
 * an engine without `:has()` still tints the title and the icons and only loses
 * the member follow-through.
 *
 * Two properties make the rebuild cheap enough to do on every host notification:
 * rows are emitted in id order, so a reorder never changes the text, and opacity
 * is already quantised by the caller, so a clock that moved a second does not
 * either. The writer's text diff then turns most notifications into no DOM work.
 */
import type { ActivityConfig } from "./reading.ts";
import { BASE_RULES } from "./styles.ts";

/** One workspace's painted state, already decided. */
export interface WorkspaceRule {
  readonly workspaceId: string;
  readonly tier: "hot" | "warm" | "dim";
  /** The title's opacity in the light theme; only read for workspaces that dim. */
  readonly opacityLight: number;
  /** The title's opacity in the dark theme; only read for workspaces that dim. */
  readonly opacityDark: number;
}

/** The prefix the host puts in `data-row-key` for a workspace row. */
const ROW_KEY_PREFIX = "workspace:";

/** The prefix the host puts in `data-row-key` for a session row. */
const SESSION_KEY_PREFIX = "session:";

/** The host's title span; the label of a workspace row or of a session row. */
const TITLE = ".JoiKIa_title";

/** The host's icon slot; a workspace row carries one for the folder and one for the chevron. */
const SLOT = ".JoiKIa_slot";

/** The host's container around one workspace row and the session rows under it. */
const GROUP_SECTION = "div.Kjh-qa_groupSection";

/**
 * The theme gate for the dark rules.
 *
 * `:where()` is what keeps the gate a condition rather than a weight: the host's
 * dark theme is an attribute on `body`, and a bare `body[data-ds-dark-theme]`
 * prefix would outrank the interaction invariants by a type selector, so a dimmed
 * title would stay dim under the pointer in the dark theme only. Zeroing the gate's
 * specificity leaves both theme rules exactly as strong as each other.
 */
const DARK = ":where(body[data-ds-dark-theme])";

/**
 * The tint a hot title carries, written as a token so it follows the active theme.
 *
 * The state token, not `--dsw-alias-brand-primary`: in this theme the brand token
 * resolves to the same value as `--dsw-alias-label-primary` — the colour a title
 * already inherits — in both the light and the dark theme, so recolouring with it
 * changes nothing and only the weight would read as activity. This one is the real
 * accent (`#4176e6` light, `#7aaaff` dark) and differs between themes.
 */
const EMPHASIS = "color:var(--dsw-alias-state-business-primary);font-weight:600";

/**
 * The colour a hot row's icon slots carry.
 *
 * The host colours its icons with `currentColor` on the slot, so setting `color`
 * here is the whole effect; the folder and the chevron are two slots of the same
 * class, which is why one rule covers both and hover cannot drop the accent.
 */
const ICON = "color:var(--dsw-alias-state-business-primary)";

/** Characters that would end the CSS string or split the rule across lines. */
function isUnsafeInString(code: number): boolean {
  return code < 0x20 || (code >= 0x7f && code <= 0x9f) || code === 0x2028 || code === 0x2029;
}

/**
 * Escape one host value for a double-quoted CSS string.
 *
 * The workspace id is host data and this is the only place an untrusted value is
 * written into generated text: an unescaped quote or backslash would end the
 * string early, letting the rest of the id act as selectors or declarations, and a
 * newline would split one rule into two. Control characters cannot name a row, so
 * they are dropped rather than escaped.
 * @param value - the host's raw value.
 * @returns the value, safe inside `"…"`.
 */
function escapeStringValue(value: string): string {
  let escaped = "";
  for (const char of value) {
    const code = char.codePointAt(0) ?? 0;
    if (isUnsafeInString(code)) continue;
    if (char === "\\") escaped += "\\\\";
    else if (char === '"') escaped += '\\"';
    else escaped += char;
  }
  return escaped;
}

/** The attribute selector for one workspace row. */
function rowSelector(workspaceId: string): string {
  return `[data-row-key="${ROW_KEY_PREFIX}${escapeStringValue(workspaceId)}"]`;
}

/** The selector for the title of one workspace row. */
function titleSelector(rowKey: string): string {
  return `${rowKey} ${TITLE}`;
}

/** The selector for the two icon slots of one workspace row. */
function iconSelector(rowKey: string): string {
  return `${rowKey} > ${SLOT}`;
}

/**
 * The group container whose own header row is one workspace.
 *
 * The row is not reliably a direct child: the host wraps a row that carries a
 * hover card in a `span`, and every real workspace carries one (the ungrouped
 * bucket, which is never painted, is the case that does not). So the argument
 * accepts the row as a child or as a grandchild.
 *
 * It must not reach further. A nested child workspace is its own group section
 * three levels down, and a plain descendant argument would let a parent match it,
 * painting the child's sessions with the parent's tier.
 * @param rowKey - the workspace row's attribute selector.
 * @returns the scoping selector.
 */
function groupOf(rowKey: string): string {
  return `${GROUP_SECTION}:has(> ${rowKey}, > * > ${rowKey})`;
}

/**
 * The selector for the session titles under one workspace.
 *
 * Scoped to the group whose own header is this workspace, so a nested workspace's
 * sessions follow their own header rather than their parent's. Every session row is
 * matched by its key prefix: a rule per session id would go stale the moment a
 * session moves, and the id is not what makes it a member.
 * @param rowKey - the workspace row's attribute selector.
 * @returns the member title selector.
 */
function memberSelector(rowKey: string): string {
  return `${groupOf(rowKey)} [data-row-key^="${SESSION_KEY_PREFIX}"] ${TITLE}`;
}

/**
 * The rules one workspace contributes, or nothing.
 *
 * A warm workspace emits nothing: the rest of the first day is left exactly as the
 * host renders it, and an explicit `opacity:1` would only give the writer text to
 * diff against.
 * @param row - the decided workspace.
 * @returns the CSS rules, in emit order.
 */
function rulesFor(row: WorkspaceRule): string[] {
  const rowKey = rowSelector(row.workspaceId);
  if (row.tier === "hot") {
    return [
      `${titleSelector(rowKey)}{${EMPHASIS}}`,
      `${iconSelector(rowKey)}{${ICON}}`,
      `${memberSelector(rowKey)}{${EMPHASIS}}`,
    ];
  }
  if (row.tier === "dim") {
    // Both themes are written out rather than one being a fallback for the other:
    // the two curves have different slopes and floors, so neither value can be
    // derived from the other at paint time.
    const title = titleSelector(rowKey);
    const members = memberSelector(rowKey);
    return [
      `${title}{opacity:${row.opacityLight}}`,
      `${members}{opacity:${row.opacityLight}}`,
      `${DARK} ${title}{opacity:${row.opacityDark}}`,
      `${DARK} ${members}{opacity:${row.opacityDark}}`,
    ];
  }
  return [];
}

/**
 * Build the whole stylesheet.
 * @param rows - every workspace that has a tier.
 * @param config - the resolved curves; a disabled config emits no row rules.
 * @returns the stylesheet text, ending with the interaction invariants.
 */
export function buildStylesheet(rows: readonly WorkspaceRule[], config: ActivityConfig): string {
  if (!config.enabled) return BASE_RULES.join("\n");
  const ordered = [...rows].sort((left, right) =>
    left.workspaceId < right.workspaceId ? -1 : left.workspaceId > right.workspaceId ? 1 : 0,
  );
  const rules = ordered.flatMap(rulesFor);
  return [...rules, ...BASE_RULES].join("\n");
}
