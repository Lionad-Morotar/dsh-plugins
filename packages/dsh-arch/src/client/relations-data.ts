/**
 * Relationship decoding for the relations pane.
 *
 * `/arch/api/model` ships `relations` as the dump's Record shape. A relation
 * record is not guaranteed to carry more than its identity: the real repo model
 * writes only `{ id, source: { model }, target: { model }, title }` and leaves
 * `technology`, `description` and `links` out entirely when the DSL never set
 * them. Every field here is therefore a soft probe, and an absent field decodes
 * to null rather than to a placeholder that would render as an empty row.
 *
 * Kept free of DOM access so the grouping and decoding rules can be tested
 * without a document.
 */

/** One decoded relationship, ready to render. */
export interface ArchRelation {
  readonly id: string;
  /** Fully qualified source element id, as the model records it. */
  readonly source: string;
  /** Fully qualified target element id. */
  readonly target: string;
  readonly title: string | null;
  readonly technology: string | null;
  readonly description: string | null;
}

/** One row of the pane: a relationship plus the two endpoint labels it shows. */
export interface ArchRelationRow {
  readonly id: string;
  readonly title: string | null;
  readonly technology: string | null;
  readonly description: string | null;
  readonly source: { readonly id: string; readonly short: string; readonly full: string };
  readonly target: { readonly id: string; readonly short: string; readonly full: string };
}

/** The two groups the pane renders, in the order it renders them. */
export interface ArchRelationGroups {
  readonly direct: readonly ArchRelationRow[];
  readonly nested: readonly ArchRelationRow[];
}

const text = (value: unknown): string | null => (typeof value === "string" && value !== "" ? value : null);

/** `$data` carries description as `{ txt }`; export dumps use plain strings. */
const descriptionOf = (value: unknown): string | null => {
  if (typeof value === "string") return text(value);
  if (typeof value === "object" && value !== null && "txt" in value) {
    return text((value as { txt?: unknown }).txt);
  }
  return null;
};

/** An endpoint is `{ model: "a.b.c" }` in the dump; tolerate a bare string too. */
const endpointOf = (value: unknown): string | null => {
  if (typeof value === "string") return text(value);
  if (typeof value === "object" && value !== null && "model" in value) {
    return text((value as { model?: unknown }).model);
  }
  return null;
};

/**
 * The short name of a fully qualified id: its last dot-separated segment.
 *
 * @param id - a fully qualified element id such as `dshPlugins.skin.entry`.
 * @returns the trailing segment, or the id itself when it has no dots.
 */
export const shortNameOf = (id: string): string => {
  const at = id.lastIndexOf(".");
  return at < 0 ? id : id.slice(at + 1);
};

/**
 * Decode one relationship record.
 *
 * @param raw - the record from the `relations` map.
 * @param id - the key it was stored under; used when the record omits its id.
 * @returns the decoded relation, or null when the record is unusable (not an
 *   object, or missing either endpoint, since a half relation cannot be drawn).
 */
export function readRelation(raw: unknown, id: string): ArchRelation | null {
  if (typeof raw !== "object" || raw === null) return null;
  const record = raw as Record<string, unknown>;
  const source = endpointOf(record.source);
  const target = endpointOf(record.target);
  if (source === null || target === null) return null;
  return {
    id: text(record.id) ?? id,
    source,
    target,
    title: text(record.title),
    technology: text(record.technology),
    description: descriptionOf(record.description ?? record.summary),
  };
}

/**
 * Decode the given relation ids out of the catalogue.
 *
 * Unknown ids are dropped rather than rendered as blanks: a cached view can
 * name a relation the current model no longer has, and an empty row would look
 * like a rendering bug instead of a stale reference.
 *
 * @param relations - the `relations` Record of `GET /arch/api/model`.
 * @param ids - the relation ids to decode, in the order the edge lists them.
 * @returns the decoded relations, order preserved, unusable entries removed.
 */
export function readRelations(
  relations: Readonly<Record<string, unknown>> | undefined,
  ids: readonly string[],
): ArchRelation[] {
  if (relations === undefined) return [];
  const decoded: ArchRelation[] = [];
  for (const id of ids) {
    const relation = readRelation(relations[id], id);
    if (relation !== null) decoded.push(relation);
  }
  return decoded;
}

const rowOf = (relation: ArchRelation): ArchRelationRow => ({
  id: relation.id,
  title: relation.title,
  technology: relation.technology,
  description: relation.description,
  source: { id: relation.source, short: shortNameOf(relation.source), full: relation.source },
  target: { id: relation.target, short: shortNameOf(relation.target), full: relation.target },
});

/**
 * Split an edge's relations into the pane's two groups.
 *
 * `direct` are the relationships whose own endpoints are exactly the edge's
 * endpoints; everything else was resolved up from a nested element, which is
 * what the official popover labels `RESOLVED FROM NESTED`. The split is by
 * endpoint identity, not by count, so a single-relation edge lands in `direct`
 * and an aggregated one can put rows in both groups.
 *
 * @param relations - decoded relations for one edge.
 * @param source - the edge's source node id.
 * @param target - the edge's target node id.
 * @returns the two groups, each in the edge's own relation order.
 */
export function groupRelations(
  relations: readonly ArchRelation[],
  source: string,
  target: string,
): ArchRelationGroups {
  const direct: ArchRelationRow[] = [];
  const nested: ArchRelationRow[] = [];
  for (const relation of relations) {
    const isDirect = relation.source === source && relation.target === target;
    (isDirect ? direct : nested).push(rowOf(relation));
  }
  return { direct, nested };
}

/**
 * Every relationship touching one element, for the action bar's browse button.
 *
 * An element's pane is its in and out relationships together, split by the same
 * direct/nested rule against the element itself. A relation is direct when it
 * starts or ends at the element; one that merely passes through a nested child
 * is not.
 *
 * @param relations - the whole decoded catalogue.
 * @param elementId - the element whose relationships to collect.
 * @returns the two groups; `nested` holds the relations that touch only its
 *   descendants.
 */
export function relationsOfElement(
  relations: readonly ArchRelation[],
  elementId: string,
): ArchRelationGroups {
  const direct: ArchRelationRow[] = [];
  const nested: ArchRelationRow[] = [];
  for (const relation of relations) {
    const touches = relation.source === elementId || relation.target === elementId;
    const nestedTouch =
      relation.source.startsWith(`${elementId}.`) || relation.target.startsWith(`${elementId}.`);
    if (touches) direct.push(rowOf(relation));
    else if (nestedTouch) nested.push(rowOf(relation));
  }
  return { direct, nested };
}

/**
 * Decode the whole catalogue, for callers that need to search it.
 *
 * @param relations - the `relations` Record of `GET /arch/api/model`.
 * @returns every usable relation, in the record's own key order.
 */
export function readAllRelations(relations: Readonly<Record<string, unknown>> | undefined): ArchRelation[] {
  if (relations === undefined) return [];
  const decoded: ArchRelation[] = [];
  for (const [id, raw] of Object.entries(relations)) {
    const relation = readRelation(raw, id);
    if (relation !== null) decoded.push(relation);
  }
  return decoded;
}
