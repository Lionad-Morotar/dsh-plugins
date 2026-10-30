/**
 * Message formatting for the shared surfaces.
 *
 * The surfaces render translated text but do not own it: the plugin that
 * registers a preview also registers the dictionary its namespace resolves, so
 * the copy stays with the plugin that ships it. What has to be shared is the
 * formatting rule — every surface fills `{name}` placeholders the same way, and
 * two implementations of that would drift on the one detail that matters (an
 * unknown placeholder is left as written rather than rendered empty).
 */

/** Dictionary rows, keyed by message id, per language. */
export type PreviewDictionaries = Record<string, Record<string, string>>;

/**
 * Substitute `{name}` placeholders in one message.
 * @param template - message text carrying placeholders.
 * @param values - replacement values by name.
 * @returns the filled message, with unknown placeholders left untouched.
 */
export function formatMessage(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/gu, (match, name: string) => (name in values ? String(values[name]) : match));
}
