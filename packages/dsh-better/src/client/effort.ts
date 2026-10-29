/**
 * Reasoning-effort levels for one model.
 *
 * The `model` catalog advertises, per model, the effort levels its adapter
 * accepts plus the one it uses when none is named. The set is not uniform: on
 * this machine there are five distinct shapes (`off,low,high,max` down to
 * `low,high,max`), and 24 of 75 models advertise none at all. So nothing here
 * may assume a fixed ladder, and "no levels" is a normal answer rather than an
 * error.
 *
 * Levels belong to the model, not to the provider: two models under one
 * provider routinely disagree, which is why this is keyed by the pair.
 */

/** One selectable effort level, as the catalog advertises it. */
export interface EffortLevel {
  /** Stable id submitted with the selection (`low`, `high`, `max`, …). */
  readonly id: string;
  /** Localized display name. */
  readonly name: string;
  /** Optional one-line explanation; shown as a title rather than as a row. */
  readonly description?: string | undefined;
}

/** The reasoning metadata a model advertises, or nothing when it has no levels. */
export interface ReasoningLike {
  readonly efforts?: readonly EffortLevel[] | undefined;
  readonly defaultEffort?: string | undefined;
}

/** One model paired with its provider, which together identify it. */
export interface ModelRef {
  readonly provider: string;
  readonly model: string;
}

/**
 * A value that is still settling: the model the user just picked, and the effort
 * the adapter defaulted to.
 *
 * The default is what makes the interaction one click in the common case: a
 * model with levels lands on the level its adapter already treats as standard,
 * and the user only moves if they disagree.
 */
export interface EffortDraft {
  readonly selection: ModelRef;
  readonly levels: readonly EffortLevel[];
  readonly chosen: string | undefined;
}

/** Shape read off one catalog model entry. */
export interface CatalogModelLike {
  readonly id: string;
  readonly name: string;
  readonly reasoning?: ReasoningLike | undefined;
}

/** Shape read off one catalog provider group. */
export interface CatalogGroupLike {
  readonly id: string;
  readonly models: readonly CatalogModelLike[];
}

/**
 * The reasoning metadata of one catalog model, or nothing.
 *
 * @param groups - catalog groups in display order.
 * @param selection - the model to ask about.
 * @returns the model's `reasoning` block, undefined when the model is unknown
 * or advertises no reasoning at all.
 */
export function reasoningMetaOf(groups: readonly CatalogGroupLike[], selection: ModelRef): ReasoningLike | undefined {
  for (const group of groups) {
    if (group.id !== selection.provider) continue;
    for (const model of group.models) {
      if (model.id !== selection.model) continue;
      return model.reasoning;
    }
  }
  return undefined;
}

/**
 * The effort levels for one model.
 *
 * Absent, empty and malformed all collapse to the empty list: a model whose
 * adapter advertises no ladder is picked in one gesture, exactly like a model
 * without reasoning support.
 * @param groups - catalog groups in display order.
 * @param selection - the model to ask about.
 * @returns the advertised levels, in catalog order.
 */
export function effortLevelsOf(groups: readonly CatalogGroupLike[], selection: ModelRef): readonly EffortLevel[] {
  const efforts = reasoningMetaOf(groups, selection)?.efforts;
  if (efforts === undefined) return [];
  // Copy so a caller can index it without aliasing catalog state.
  return [...efforts];
}

/** The signals a row's pointed effort is resolved from. */
export interface PointedInput {
  /** A level explicitly picked inside this popup open, if any. */
  readonly remembered?: string | undefined;
  /** Whether this row is the session's current model. */
  readonly isCurrent: boolean;
  /** The effort currently in effect for the current model, if any. */
  readonly currentEffort?: string | undefined;
  /** The adapter's default for the row's model. */
  readonly defaultEffort?: string | undefined;
}

/**
 * The effort a row points at: the level a plain click applies and the chip the
 * highlight marks.
 *
 * Priority mirrors the shell's own `selectionOf`: the effort already in effect
 * survives on the current model's row, every other row starts from the adapter's
 * default, and both yield to a value the ladder no longer advertises. The
 * remembered slot sits above both so an explicit in-popup choice wins even
 * before the directory reflects it. Falling back to the top of the ladder
 * rather than to `undefined` keeps the invariant that the highlighted level is
 * the one that takes effect: submitting no effort would let the adapter choose
 * silently.
 * @param levels - the row model's levels.
 * @param input - the signals above.
 * @returns the level to point at, or undefined when there are no levels.
 */
export function rowPointedEffort(levels: readonly EffortLevel[], input: PointedInput): string | undefined {
  if (levels.length === 0) return undefined;
  const has = (id: string | undefined): id is string => id !== undefined && levels.some((level) => level.id === id);
  if (has(input.remembered)) return input.remembered;
  if (input.isCurrent && has(input.currentEffort)) return input.currentEffort;
  if (has(input.defaultEffort)) return input.defaultEffort;
  return levels[0]?.id;
}

/**
 * Whether picking this model needs an effort decision at all.
 * @param levels - the model's levels.
 * @returns true when the user must (or may) choose one.
 */
export function needsEffort(levels: readonly EffortLevel[]): boolean {
  // One level is not a choice: there is nothing to disambiguate, so the click
  // that picked the model is the whole interaction.
  return levels.length > 1;
}

/**
 * The selection to submit for a draft.
 *
 * Omitting the field entirely is how the wire says "adapter decides", so a draft
 * without levels must not send `reasoningEffort: undefined` as a present key on
 * older adapters.
 * @param draft - the pending choice.
 * @returns the provider/model pair plus effort when one is set.
 */
export function selectionOfDraft(draft: EffortDraft): ModelRef & { reasoningEffort?: string } {
  if (draft.chosen === undefined) return { provider: draft.selection.provider, model: draft.selection.model };
  return { provider: draft.selection.provider, model: draft.selection.model, reasoningEffort: draft.chosen };
}

/**
 * The effort levels a row shows as badges.
 *
 * Only models with a real ladder get badges: a model with one level would wear a
 * badge that can neither change nor be chosen, which reads as noise beside the
 * many models that genuinely have no levels.
 * @param levels - the model's levels.
 * @returns the levels to render, empty when there is nothing to choose.
 */
export function badgeLevels(levels: readonly EffortLevel[]): readonly EffortLevel[] {
  return needsEffort(levels) ? levels : [];
}
