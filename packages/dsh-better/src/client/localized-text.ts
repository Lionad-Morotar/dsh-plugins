/**
 * Provider-authored display text, resolved without importing the host.
 *
 * A model badge carries either one literal or a map of translations with a
 * required English entry. The host resolves it through `locale.resolveText`;
 * this module is the structural copy of that contract plus the fallback used
 * when the service is missing, so display decoration can never take a working
 * control down with it.
 */

/** A literal, or translations keyed by lowercase language id with an English entry. */
export type LocalizedTextLike = string | Readonly<Record<string, string>>;

/** The host's resolver, when this context exposes one. */
export type LocalizedTextResolver = (text: LocalizedTextLike) => string;

/**
 * Resolve one localized text without the locale service.
 *
 * English is the one key the host requires on every map, so it is the honest
 * fallback: picking an arbitrary language would show a string the active locale
 * did not choose.
 * @param text - literal or translation map.
 * @returns the text to display; empty when the map carries nothing.
 */
export function fallbackLocalizedText(text: LocalizedTextLike): string {
  if (typeof text === "string") return text;
  return text.en ?? "";
}

/**
 * Resolve one localized text through the host's translator.
 *
 * A resolver that throws is treated as absent: the caller is a render path, and
 * the text is decoration next to an otherwise working control.
 * @param resolve - the host's resolver, or undefined.
 * @param text - literal or translation map.
 * @returns the text to display.
 */
export function localizedText(resolve: LocalizedTextResolver | undefined, text: LocalizedTextLike): string {
  if (resolve !== undefined) {
    try {
      return resolve(text);
    } catch {
      // Fall through to the literal/English fallback.
    }
  }
  return fallbackLocalizedText(text);
}
