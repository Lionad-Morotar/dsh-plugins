/**
 * What the composer's trigger says.
 *
 * The shell draws the composer's model name through
 * `conversation.input.model.label`, a `single` child slot that only the entry
 * declaring it may render. This package shadows the seat instead, so the caption
 * is drawn here, and so is the provider prefix: a bare model name cannot tell
 * two providers carrying the same catalog apart, and the trigger is the one
 * place where nothing else names the provider in use.
 *
 * Only the trigger takes the prefix. Picker rows already sit under a provider
 * heading, so repeating it on every row would be noise the layout resolves.
 */
export interface ProviderIdentity {
  /** Stable provider id, e.g. `dsh-ddodsf`. */
  readonly id: string;
  /** Display name the catalog carries; equals the id when the provider sets none. */
  readonly name: string;
}

export interface ModelIdentity {
  readonly id: string;
  readonly name: string;
}

/** One catalog entry: the provider group a model was listed under. */
export interface CatalogEntryLike {
  readonly group: ProviderIdentity;
  readonly model: ModelIdentity;
}

/**
 * The provider's display name.
 *
 * A hand-written provider entry often carries no name, and the composer leaves
 * everything but the official account with whatever the catalog has. Falling
 * back to the id keeps the caption readable instead of printing an empty string
 * and a leading space.
 * @param provider - the identity from the catalog group.
 * @returns the display name, or the id when the name is blank.
 */
export function providerCaption(provider: ProviderIdentity): string {
  const name = provider.name.trim();
  return name === "" ? provider.id : name;
}

/**
 * The trigger caption for one catalog entry.
 *
 * Reason and effort live outside this string: the trigger appends them itself,
 * separated by `·`, so nothing here may add a separator of its own.
 * @param found - the catalog entry the selection names, or undefined when the
 *   catalog no longer lists it.
 * @param fallback - what to say when there is no entry to name, e.g. the
 *   untranslated key's already-resolved string.
 * @returns the caption text.
 */
export function triggerCaption(found: CatalogEntryLike | undefined, fallback: string): string {
  if (found === undefined) return fallback;
  const provider = providerCaption(found.group);
  const model = found.model.name.trim();
  return model === "" ? provider : `${provider} ${model}`;
}
