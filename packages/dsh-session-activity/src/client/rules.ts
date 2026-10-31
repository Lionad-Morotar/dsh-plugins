/**
 * The stylesheet text for one recompute.
 *
 * A stylesheet, not a component, because the sidebar exposes no seat for a
 * workspace title. The rows' `data-row-key` attributes are the only hook that
 * covers every workspace and session row, so the effect is expressed as attribute
 * selectors and the whole table is rebuilt from scratch on every pass.
 *
 * Every row is selected by its own key. That is the whole addressing model: no
 * group container, no `:has()`, no member follow-through. A session's title is
 * painted from the session's own clock, so a workspace header and the rows under it
 * are three independent decisions rather than one.
 *
 * A painted workspace reaches two surfaces: its own title, and its two icon slots,
 * because the host swaps folder and chevron on hover and an icon left at the
 * label's tertiary colour would drop out of the accent the moment the pointer
 * arrives. A painted session reaches one surface: its title, and never its weight —
 * bold is reserved for the workspace level, which is the level a human navigates by.
 *
 * Two properties make the rebuild cheap enough to do on every host notification:
 * rows are emitted in id order, so a reorder never changes the text, and the
 * declarations are a pure function of the tier, so a clock that moved a second does
 * not either. The writer's text diff then turns most notifications into no DOM work.
 */
import type { ActivityConfig, PaintedTier } from "./reading.ts";

/** One workspace's painted state, already decided. */
export interface WorkspaceRule {
  readonly workspaceId: string;
  readonly tier: PaintedTier;
}

/** One session's painted state, already decided from that session's own clock. */
export interface SessionRule {
  readonly sessionId: string;
  readonly tier: PaintedTier;
}

/** Everything one recompute decided, in the two levels the sidebar has. */
export interface RuleSet {
  readonly workspaces: readonly WorkspaceRule[];
  readonly sessions: readonly SessionRule[];
}

/** The prefix the host puts in `data-row-key` for a workspace row. */
const WORKSPACE_KEY_PREFIX = "workspace:";

/** The prefix the host puts in `data-row-key` for a session row. */
const SESSION_KEY_PREFIX = "session:";

/** The host's title span; the label of a workspace row or of a session row. */
const TITLE = ".JoiKIa_title";

/** The host's icon slot; a workspace row carries one for the folder and one for the chevron. */
const SLOT = ".JoiKIa_slot";

/**
 * The host's class on a session row whose session is archived.
 *
 * The same element carries it as `data-row-key`, so the exclusion can be written on
 * the row itself.
 */
const ARCHIVED = ".JoiKIa_archived";

/**
 * The exclusion the session rules carry, written as a condition rather than a weight.
 *
 * The host paints an archived session's title with `--dsw-alias-label-caption`
 * through `.JoiKIa_sessionRow.JoiKIa_archived .JoiKIa_title`, and that caption grey
 * is how the sidebar says "archived". An accent rule reaching the same span would
 * read the row as active, so archived rows are left out of the paint.
 *
 * `:where()` is what keeps the exclusion from becoming a lever: a bare `:not()`
 * would add a class unit and lift these rules above the host's own title rule,
 * which is exactly the competition this plugin avoids. Zeroing it leaves the
 * cascade where the host put it.
 */
const NOT_ARCHIVED = `:where(:not(${ARCHIVED}))`;

/**
 * The accent the strong tier carries, written as a token so it follows the theme.
 *
 * The state token, not `--dsw-alias-brand-primary`: in this theme the brand token
 * resolves to the same value as `--dsw-alias-label-primary` — the colour a title
 * already inherits — in both the light and the dark theme, so recolouring with it
 * changes nothing. This one is the real accent (`#4176e6` light, `#7aaaff` dark).
 */
const ACCENT = "var(--dsw-alias-state-business-primary)";

/** The body colour the faint tiers are pulled towards. */
const BODY = "var(--dsw-alias-label-primary)";

/** Whether this tier's workspace title carries the weight; a session title never does. */
function isBold(tier: PaintedTier): boolean {
  return tier === "strong" || tier === "mid";
}

/** Characters that would end the CSS string or split the rule across lines. */
function isUnsafeInString(code: number): boolean {
  return code < 0x20 || (code >= 0x7f && code <= 0x9f) || code === 0x2028 || code === 0x2029;
}

/**
 * Escape one host value for a double-quoted CSS string.
 *
 * The row id is host data and this is the only place an untrusted value is written
 * into generated text: an unescaped quote or backslash would end the string early,
 * letting the rest of the id act as selectors or declarations, and a newline would
 * split one rule into two. Control characters cannot name a row, so they are
 * dropped rather than escaped.
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
function workspaceRow(workspaceId: string): string {
  return `[data-row-key="${WORKSPACE_KEY_PREFIX}${escapeStringValue(workspaceId)}"]`;
}

/** The attribute selector for one session row, carrying the archive condition. */
function sessionRow(sessionId: string): string {
  return `[data-row-key="${SESSION_KEY_PREFIX}${escapeStringValue(sessionId)}"]${NOT_ARCHIVED}`;
}

/**
 * The colour one tier carries.
 *
 * Strong is the accent undiluted; mid and faint are the same dilution, because the
 * fifth-hour step is the weight rather than the hue. Mixing towards the body colour
 * rather than towards the panel is deliberate: towards the background would cost
 * contrast, towards the label only desaturates, so the faint step still reads.
 * @param tier - the decided tier.
 * @param config - the resolved mix percentage.
 * @returns a `color` token or a `color-mix()` expression.
 */
function colorOf(tier: PaintedTier, config: ActivityConfig): string {
  if (tier === "strong") return ACCENT;
  return `color-mix(in srgb, ${ACCENT} ${config.faintMixPercent}%, ${BODY})`;
}

/** One declaration block over one or more selectors. */
function rule(selectors: readonly string[], declarations: string): string {
  return `${selectors.join(",")}{${declarations}}`;
}

/**
 * The rules one workspace contributes.
 *
 * The title carries the weight when the tier is strong or mid; the icons only carry
 * the colour, so the accent reads as one surface rather than as a bolded glyph.
 * @param row - the decided workspace.
 * @param config - the resolved mix percentage.
 * @returns the CSS rules, in emit order.
 */
function rulesForWorkspace(row: WorkspaceRule, config: ActivityConfig): string[] {
  const rowKey = workspaceRow(row.workspaceId);
  const color = `color:${colorOf(row.tier, config)}`;
  const title = isBold(row.tier) ? `${color};font-weight:600` : color;
  return [rule([`${rowKey} ${TITLE}`], title), rule([`${rowKey} > ${SLOT}`], color)];
}

/**
 * The rules one session contributes.
 *
 * One surface and no weight: a session title is never bold, which is a product
 * decision rather than a styling gap — the header is the level that carries
 * emphasis, and bolding every recent session row would make the sidebar shout.
 * @param row - the decided session.
 * @param config - the resolved mix percentage.
 * @returns the CSS rules, in emit order.
 */
function rulesForSession(row: SessionRule, config: ActivityConfig): string[] {
  return [rule([`${sessionRow(row.sessionId)} ${TITLE}`], `color:${colorOf(row.tier, config)}`)];
}

/** Order workspaces by id, so a reorder in the host never rewrites the sheet. */
function byWorkspaceId(left: WorkspaceRule, right: WorkspaceRule): number {
  return left.workspaceId < right.workspaceId ? -1 : left.workspaceId > right.workspaceId ? 1 : 0;
}

/** Order sessions by id, for the same reason. */
function bySessionId(left: SessionRule, right: SessionRule): number {
  return left.sessionId < right.sessionId ? -1 : left.sessionId > right.sessionId ? 1 : 0;
}

/**
 * Build the whole stylesheet.
 * @param rules - every row that has a tier, in the two levels the sidebar has.
 * @param config - the resolved ladder and mix; a disabled config emits nothing.
 * @returns the stylesheet text, empty when no row is painted.
 */
export function buildStylesheet(rules: RuleSet, config: ActivityConfig): string {
  if (!config.enabled) return "";
  const workspaces = [...rules.workspaces].sort(byWorkspaceId).flatMap((row) => rulesForWorkspace(row, config));
  const sessions = [...rules.sessions].sort(bySessionId).flatMap((row) => rulesForSession(row, config));
  return [...workspaces, ...sessions].join("\n");
}
