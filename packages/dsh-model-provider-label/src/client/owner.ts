/**
 * The slot's owner props, declared structurally.
 *
 * The slot declaration lives in ui-model-selection's types and is not a runtime
 * dependency of this package, so the two identities the label reads are restated
 * here. That is also a guard: a widened slice would silently accept a provider
 * shape the composer never sends.
 */

/** Provider identity plus the display name the composer localizes. */
export interface ProviderIdentity {
  /** Stable provider id, e.g. `dsh-ddodsf`. */
  readonly id: string;
  /** Display name the catalog carries; equals `id` when the provider sets none. */
  readonly name: string;
}

/** The model identity the label prints. */
export interface ModelIdentity {
  readonly id: string;
  readonly name: string;
}

/** Where the label is being rendered. */
export type LabelPlacement = "trigger" | "menu" | "option";

/** The owner props the slot hands the component. */
export interface ModelLabelOwner {
  readonly provider: ProviderIdentity;
  readonly model: ModelIdentity;
  readonly placement: LabelPlacement;
  readonly selected: boolean;
}
