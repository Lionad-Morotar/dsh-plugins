/**
 * The stylesheet text for one recompute.
 *
 * A stylesheet, not a component, because the sidebar exposes no seat for a
 * workspace title. The workspace row's `data-row-key` attribute is the only hook
 * that covers every workspace row, so the effect is expressed as attribute
 * selectors and the whole table is rebuilt from scratch on every pass.
 *
 * The tint lands on the row's title span and nowhere else. The label text stays
 * the host's, and the folder icon and the row actions carry their own states, so
 * an opacity on the row itself would fade all three. Session rows are not touched
 * at all: this feature reads them as the factor behind a workspace, never as a
 * thing to paint.
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
  /** The title's opacity; only read for workspaces that carry an opacity rule. */
  readonly opacity: number;
}

/** The prefix the host puts in `data-row-key` for a workspace row. */
const ROW_KEY_PREFIX = "workspace:";

/** The host's title span; the only element the tint is allowed to restyle. */
const TITLE = ".JoiKIa_title";

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

/** The selector for one workspace row's title. */
function selectorFor(workspaceId: string): string {
  return `[data-row-key="${ROW_KEY_PREFIX}${escapeStringValue(workspaceId)}"] ${TITLE}`;
}

/**
 * The rule one workspace contributes, or nothing.
 *
 * A warm workspace emits nothing: the rest of the first day is left exactly as the
 * host renders it, and an explicit `opacity:1` would only give the writer text to
 * diff against.
 * @param row - the decided workspace.
 * @returns one CSS rule, or undefined for a workspace that keeps the host's styling.
 */
function ruleFor(row: WorkspaceRule): string | undefined {
  const selector = selectorFor(row.workspaceId);
  if (row.tier === "hot") return `${selector}{${EMPHASIS}}`;
  if (row.tier === "dim") return `${selector}{opacity:${row.opacity}}`;
  return undefined;
}

/**
 * Build the whole stylesheet.
 * @param rows - every workspace that has a tier.
 * @param config - the resolved curve; a disabled config emits no row rules.
 * @returns the stylesheet text, ending with the interaction invariants.
 */
export function buildStylesheet(rows: readonly WorkspaceRule[], config: ActivityConfig): string {
  if (!config.enabled) return BASE_RULES.join("\n");
  const ordered = [...rows].sort((left, right) =>
    left.workspaceId < right.workspaceId ? -1 : left.workspaceId > right.workspaceId ? 1 : 0,
  );
  const rules = ordered.map(ruleFor).filter((rule): rule is string => rule !== undefined);
  return [...rules, ...BASE_RULES].join("\n");
}
