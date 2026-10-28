/**
 * One drawn model row.
 *
 * Split out of the picker because a row carries more decisions than it looks:
 * which effort levels to show, which one is pointed at, when the check mark is
 * the right marker instead of the levels, and which of the two click targets a
 * gesture belongs to. Keeping that here leaves the picker to own list-level
 * concerns (search, keyboard cursor, settlement).
 */
import type { ReactNode } from "react";

import type { PopupClasses } from "./classes.ts";
import { badgeLevels, effortLevelsOf, type CatalogGroupLike, type EffortLevel } from "./effort.ts";
import type { PopupOptionLike } from "./popup.ts";
import type { Primitives } from "./primitives.ts";

/** Everything one row needs to draw itself. */
export interface ModelRowProps {
  /** The row being drawn. */
  readonly option: PopupOptionLike;
  /** Whether the keyboard cursor is on this row. */
  readonly active: boolean;
  /** The session's catalog groups, read for effort ladders. */
  readonly catalog: readonly CatalogGroupLike[] | undefined;
  /** The level this row is currently pointing at, if any. */
  readonly pointed: string | undefined;
  /** Resolved shell class names. */
  readonly classes: PopupClasses;
  /** Host primitives, for the check mark. */
  readonly primitives: Primitives;
  /** Row click: settle on the pointed level. */
  readonly onChoose: () => void;
  /** Badge click: settle on that exact level. */
  readonly onPickEffort: (level: string) => void;
  /** Cursor moved onto this row. */
  readonly onHover: () => void;
  /** Translator, for the badge group's label. */
  readonly t: ((key: string) => string) | undefined;
}

/**
 * The provider/model pair a row names.
 *
 * Row ids are `${provider}/${model}` by the shell's convention, but the provider
 * is authoritative on `group`, and a model id may itself contain a slash, so the
 * split keeps everything after the first separator.
 * @param option - the row.
 * @returns the pair, or undefined for a row with no provider (a failure notice).
 */
export function modelRefOf(option: PopupOptionLike): { provider: string; model: string } | undefined {
  const provider = option.group?.name;
  if (provider === undefined) return undefined;
  const prefix = `${provider}/`;
  const model = option.id.startsWith(prefix) ? option.id.slice(prefix.length) : option.id;
  return { provider, model };
}

/**
 * The effort levels a row should show.
 * @param option - the row.
 * @param catalog - the session's catalog groups.
 * @returns the levels worth drawing, empty when there is nothing to choose.
 */
export function rowLevels(
  option: PopupOptionLike,
  catalog: readonly CatalogGroupLike[] | undefined,
): readonly EffortLevel[] {
  const ref = modelRefOf(option);
  return badgeLevels(ref === undefined ? [] : effortLevelsOf(catalog ?? [], ref));
}

/**
 * Draw one row.
 * @param props - row inputs and callbacks.
 * @returns the row element.
 */
export function ModelRow({
  option,
  active,
  catalog,
  pointed,
  classes,
  primitives,
  onChoose,
  onPickEffort,
  onHover,
  t,
}: ModelRowProps): ReactNode {
  const levels = rowLevels(option, catalog);
  const Check = primitives.IconCheckOutlineRegular;
  return (
    <div
      role="option"
      aria-selected={active}
      aria-label={option.badge === undefined ? undefined : `${option.label} ${option.badge}`}
      className={active ? `${classes.row} ${classes.rowActive}` : classes.row}
      onClick={onChoose}
      onMouseEnter={onHover}
    >
      <span className={classes.label}>
        <span className={classes.labelText}>{option.label}</span>
        {option.badge !== undefined && <sup className={classes.badge}>{option.badge}</sup>}
      </span>
      {option.detail !== undefined && <span className={classes.detail}>{option.detail}</span>}
      {levels.length > 0 && (
        // Badges are buttons, not decoration: the row click takes the pointed
        // level, and a badge click takes that specific one. stopPropagation keeps
        // the badge's choice from also firing the row's own submit.
        <span className={classes.badges} role="group" aria-label={t?.("listbox.aria") ?? ""}>
          {levels.map((level) => (
            <button
              type="button"
              key={level.id}
              className={level.id === pointed ? `${classes.badgeChip} ${classes.badgeChipOn}` : classes.badgeChip}
              title={level.description ?? level.name}
              onClick={(event) => {
                event.stopPropagation();
                onPickEffort(level.id);
              }}
            >
              {level.name}
            </button>
          ))}
        </span>
      )}
      {option.active === true && levels.length === 0 && (
        // Only when no badge spoke for the selection: with levels drawn, the
        // highlighted chip is already the marker, and a second one would say the
        // same thing twice.
        <span className={classes.check}>{Check === undefined ? null : <Check />}</span>
      )}
    </div>
  );
}
