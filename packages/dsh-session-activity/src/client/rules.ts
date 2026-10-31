/**
 * The stylesheet text for one recompute.
 *
 * A stylesheet, not a component, because the row seats this feature would
 * otherwise use are gated to exactly the rows it must leave alone. The row's
 * `data-row-key` attribute is the only hook that covers every session row, so the
 * effect is expressed as attribute selectors and the whole table is rebuilt from
 * scratch on every pass.
 *
 * Two properties make that rebuild cheap enough to do on every host notification:
 * rows are emitted in id order, so a reorder never changes the text, and opacity
 * is already quantised by the caller, so a clock that moved a second does not
 * either. The writer's text diff then turns most notifications into no DOM work.
 */
import type { ActivityConfig } from "./reading.ts";
import { BASE_RULES } from "./styles.ts";

/** One row's painted state, already decided. */
export interface RowRule {
  readonly sessionId: string;
  readonly tier: "hot" | "warm" | "dim";
  /** The row's opacity; only read for rows that carry an opacity rule. */
  readonly opacity: number;
  readonly archived: boolean;
}

/** The prefix the host puts in `data-row-key` for a session row. */
const ROW_KEY_PREFIX = "session:";

/** The host's brand token, so the tint follows the active theme instead of a hardcoded colour. */
const EMPHASIS = "color:var(--dsw-alias-brand-primary);font-weight:600";

/** The attribute selector for one session row. */
function selectorFor(sessionId: string): string {
  return `[data-row-key="${ROW_KEY_PREFIX}${sessionId}"]`;
}

/**
 * The rule one row contributes, or nothing.
 *
 * An archived row is dimmed but never recoloured: the host paints its title with
 * `.sessionRow.archived .title`, and a `color` on the row cannot override a
 * declaration that targets the title directly. Dimming is the one effect that
 * survives there, and it is also what an archived row should read as.
 * @param row - the decided row.
 * @returns one CSS rule, or undefined for a row that keeps the host's styling.
 */
function ruleFor(row: RowRule): string | undefined {
  const selector = selectorFor(row.sessionId);
  if (row.archived) return `${selector}{opacity:${row.opacity}}`;
  if (row.tier === "hot") return `${selector}{${EMPHASIS}}`;
  if (row.tier === "dim") return `${selector}{opacity:${row.opacity}}`;
  return undefined;
}

/**
 * Build the whole stylesheet.
 * @param rows - every row that has a tier.
 * @param config - the resolved curve; a disabled config emits no row rules.
 * @returns the stylesheet text, ending with the interaction invariants.
 */
export function buildStylesheet(rows: readonly RowRule[], config: ActivityConfig): string {
  if (!config.enabled) return BASE_RULES.join("\n");
  const ordered = [...rows].sort((left, right) => (left.sessionId < right.sessionId ? -1 : left.sessionId > right.sessionId ? 1 : 0));
  const rules = ordered.map(ruleFor).filter((rule): rule is string => rule !== undefined);
  return [...rules, ...BASE_RULES].join("\n");
}
