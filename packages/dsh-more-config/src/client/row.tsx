/**
 * One timeout row: an identity cluster, a numeric input, a state badge, and
 * one action.
 *
 * The row is our own markup because the shipped value field can only stack a
 * label above the input and a hint below it — the server name and the entry id
 * would land on opposite sides of the input, and a ghost row's "gone" warning
 * would carry no more visual weight than the id hint. Here the identity sits
 * on one line, the state is a badge, and the whole row dims when the server
 * behind it is gone.
 */
import type { ComponentType, ReactNode } from "react";
import type { Translate } from "./section.tsx";
import type { TimeoutRowView } from "./store.ts";

/** The platform atoms a row renders with, straight from the section kit. */
export interface RowKit {
  readonly Input: ComponentType<{
    value: string;
    onChange: (event: { readonly target: { readonly value: string } }) => void;
    placeholder?: string;
    disabled?: boolean;
  }>;
  readonly Button: ComponentType<{ children: ReactNode; onClick?: () => void; disabled?: boolean }>;
}

/** Derive the row state the stylesheet and the badge render from. */
export function rowState(row: TimeoutRowView): "unset" | "set" | "ghost" {
  if (row.ghost) return "ghost";
  return row.overridden ? "set" : "unset";
}

/**
 * One timeout row.
 * @param props row view plus the editing callbacks and the kit atoms.
 * @returns the row markup.
 */
export function TimeoutRow(props: {
  readonly row: TimeoutRowView;
  readonly disabled: boolean;
  readonly t: Translate;
  readonly kit: RowKit;
  readonly onEdit: (text: string) => void;
  readonly onClear: () => void;
}): ReactNode {
  const { row, disabled, t, kit } = props;
  const state = rowState(row);
  const name = row.serverName === "" ? row.id : row.serverName;
  return (
    <div className="dsh-mc-row" data-state={state}>
      <div className="dsh-mc-row-head">
        <span className="dsh-mc-row-name" title={row.id}>{name}</span>
        {state !== "unset" && <span className="dsh-mc-row-badge">{state === "ghost" ? t("row.ghostBadge") : t("row.overridden")}</span>}
      </div>
      <div className="dsh-mc-row-body">
        <kit.Input
          value={row.text}
          onChange={event => props.onEdit(event.target.value)}
          placeholder={t("row.placeholder")}
          disabled={disabled}
        />
        {state !== "unset" && (
          <kit.Button onClick={props.onClear} disabled={disabled}>
            {state === "ghost" ? t("row.clear") : t("row.reset")}
          </kit.Button>
        )}
      </div>
      {row.invalid && <p className="dsh-mc-row-note" data-kind="invalid">{t("row.invalid")}</p>}
      {state === "ghost" && <p className="dsh-mc-row-note">{t("row.ghost")}</p>}
    </div>
  );
}
