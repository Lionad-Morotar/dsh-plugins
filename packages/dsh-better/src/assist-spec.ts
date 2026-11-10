/**
 * The `metadata.assist` declaration: which panel a skill asks the composer for.
 *
 * A skill that wants a panel says so in its own frontmatter rather than being
 * special-cased in the client, so the client never has to know which skill it is
 * looking at. The declaration is hand-written and arrives over HTTP, which is why
 * every rule here is a drop rule:
 *
 *   - A panel naming a `kind` or a `source` this package cannot fill has to
 *     disappear. An entry kept but unfillable would render an empty panel, and an
 *     empty panel is indistinguishable from a broken client.
 *   - One slot, one panel. A second declaration for the same slot is a mistake in
 *     the file, and honouring both would put two panels on the same word.
 *   - Nothing here may throw. The host serves this inside a request handler, so a
 *     declaration that fights back must yield no panels rather than a 500.
 *
 * @module dsh-better/assist-spec
 */

/** Panel kinds this package can render. */
const KINDS = ["catalog"] as const;

/** Candidate sources this package can fill. */
const SOURCES = ["workflows"] as const;

/** One declared panel. */
export interface AssistSpec {
  /** The skill argument word that opens the panel, e.g. `run`. */
  readonly slot: string;
  /** Which panel to render. */
  readonly kind: (typeof KINDS)[number];
  /** Where the panel's candidates come from. */
  readonly source: (typeof SOURCES)[number];
  /** Optional heading; the client falls back to the slot when absent. */
  readonly title?: string;
}

/** Read one string field, treating anything else as absent. */
function textField(entry: Record<string, unknown>, key: string): string | undefined {
  const value = entry[key];
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed === "" ? undefined : trimmed;
}

/** Whether a value is one of the known literals. */
function isKnown<T extends string>(known: readonly T[], value: string | undefined): value is T {
  return value !== undefined && (known as readonly string[]).includes(value);
}

/**
 * Normalize a declared assist list for the wire.
 *
 * @param value - the parsed `metadata.assist` value, or anything else.
 * @returns the panels in declaration order, first entry per slot only. Empty for
 *   a non-list, and empty when every entry was dropped.
 */
export function normalizeAssists(value: unknown): AssistSpec[] {
  if (!Array.isArray(value)) return [];
  const specs: AssistSpec[] = [];
  const claimed = new Set<string>();
  for (const entry of value) {
    if (typeof entry !== "object" || entry === null || Array.isArray(entry)) continue;
    let slot: string | undefined;
    let kind: string | undefined;
    let source: string | undefined;
    let title: string | undefined;
    try {
      const record = entry as Record<string, unknown>;
      slot = textField(record, "slot");
      kind = textField(record, "kind");
      source = textField(record, "source");
      title = textField(record, "title");
    } catch {
      // A getter that throws is still just a bad declaration.
      continue;
    }
    if (slot === undefined || !isKnown(KINDS, kind) || !isKnown(SOURCES, source)) continue;
    // The slot is only claimed by an entry that survived, so a dropped entry
    // cannot shadow a valid one written after it.
    if (claimed.has(slot)) continue;
    claimed.add(slot);
    specs.push(title === undefined ? { slot, kind, source } : { slot, kind, source, title });
  }
  return specs;
}
