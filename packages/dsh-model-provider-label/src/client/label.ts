/**
 * What the composer's model label says.
 *
 * `conversation.input.model.label` is a `single` slot, so one component renders
 * the model name in three places: the trigger caption, the root menu's current
 * value, and each row of the model list. The provider prefix only helps on the
 * caption — the menu and the list sit directly under a provider heading, so
 * repeating "dsh-ddodsf" on every row is noise the layout already resolves.
 *
 * The trigger also appends the reasoning effort and the caret outside this slot,
 * so nothing here may add a separator: the caption reads
 * `<provider> <model> Max v`, and `Max`/`v` belong to the composer.
 */
import type { LabelPlacement, ModelLabelOwner, ModelIdentity, ProviderIdentity } from "./owner.ts";

/**
 * The provider's display name.
 *
 * The composer localizes the official account provider ("DeepSeek 账号") and
 * leaves every other provider with whatever the catalog carries, which for a
 * hand-written provider entry is its own id. Falling back to the id keeps a
 * provider without a display name readable instead of printing an empty string.
 * @param provider - the provider identity from the slot.
 * @returns the display name, or the id when the name is blank.
 */
export function providerLabel(provider: ProviderIdentity): string {
  const name = provider.name.trim();
  return name === "" ? provider.id : name;
}

/**
 * Whether a placement should carry the provider prefix.
 * @param placement - where the label is being rendered.
 * @returns true only for the trigger caption.
 */
export function placementWantsProvider(placement: LabelPlacement): boolean {
  return placement === "trigger";
}

/**
 * The full label text for one placement.
 * @param owner - the slot's owner props.
 * @returns the text to render.
 */
export function labelFor(owner: ModelLabelOwner): string {
  const name = owner.model.name;
  if (!placementWantsProvider(owner.placement)) return name;
  return `${providerLabel(owner.provider)} ${name}`;
}

/**
 * The fixed release marker the shipped label printed for official Flash builds.
 *
 * Shadowing that entry would otherwise drop a visible badge, and a badge is not
 * something a provider prefix should cost the reader. The identity is the same
 * three-way match the shipped plugin used: official providers only, the `flash`
 * catalog id, and the exact `DeepSeek-V4.1-Flash` display name.
 * @param provider - the provider identity from the slot.
 * @param model - the model identity from the slot.
 * @returns the marker text, or null when this entry is not the official release.
 */
export function releaseBadge(provider: ProviderIdentity, model: ModelIdentity): string | null {
  const official = provider.id === "deepseek-account" || provider.id === "deepseek-official";
  if (!official) return null;
  if (model.id !== "deepseek-flash") return null;
  return model.name === "DeepSeek-V4.1-Flash" ? "1017" : null;
}
