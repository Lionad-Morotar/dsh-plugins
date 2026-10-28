/**
 * The composer's inline model label.
 *
 * Registered on `conversation.input.model.label`, a `single` slot the composer
 * renders in three places: the trigger caption, the root menu's current value,
 * and each model row. The caption is the one that needs the provider, because a
 * trigger that only says "deepseek-v4.1-flash" cannot tell two providers with
 * the same catalog apart. The menu and the list are grouped by provider already,
 * so they keep the bare catalog name.
 *
 * The official Flash release marker is reproduced here rather than inherited,
 * because a `single` slot has exactly one owner: registering this component
 * shadows the shipped label plugin entirely, badge included.
 */
import type { ComponentType, ReactNode } from "react";
import type { ModelLabelOwner } from "./owner.ts";
import { labelFor, releaseBadge } from "./label.ts";

/** The badge tone the shipped marker used. */
const BADGE_TONE = "info";

/** The badge component, supplied by the platform through the entry's inject. */
export type Badge = ComponentType<{ readonly tone: string; readonly children: ReactNode }>;

/** Everything the slot hands this component. */
export type ModelLabelProps = ModelLabelOwner & {
  /** The primitive kit's Tag, resolved by the entry through the loader. */
  readonly Tag: Badge;
};

/**
 * Render the composer's model label.
 * @param props - owner props plus the platform's Tag primitive.
 * @returns the caption text, with the release marker on official Flash entries.
 */
export function ModelProviderLabel({ provider, model, placement, selected, Tag }: ModelLabelProps) {
  const text = labelFor({ provider, model, placement, selected });
  const badge = releaseBadge(provider, model);
  if (badge === null) return <>{text}</>;
  return (
    <>
      {text} <Tag tone={BADGE_TONE}>{badge}</Tag>
    </>
  );
}

export default ModelProviderLabel;