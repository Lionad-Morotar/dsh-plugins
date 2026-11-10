/**
 * The workflow catalogue: a domain's `index.md` read into slugs.
 *
 * The lines are hand-written Chinese prose, so the parser trusts only the shape
 * it can prove: a kebab token at the head of a list item, then a colon, then the
 * one-line goal. Everything else in the file is prose and is skipped rather than
 * guessed at, because a wrong slug is worse than a missing one: the user would
 * insert a workflow that does not exist.
 *
 * Two shapes are in the wild and both are real:
 *
 *   - dev（261005）：一句话
 *   - audio-transcribe（260930，261025 重构）：一句话
 *
 * The parenthesised date marker is not parsed, only skipped. Its contents are a
 * date and free-form notes, and nothing downstream reads them.
 *
 * @module dsh-better/workflow-catalog
 */

/** One workflow as the catalogue lists it. */
export interface WorkflowEntry {
  /** The kebab slug the user types, e.g. `dev`. */
  readonly slug: string;
  /** The one-line goal after the colon; empty is never produced. */
  readonly summary: string;
}

/**
 * A list item whose head is a kebab slug and whose body follows a colon.
 *
 * The slug is anchored to the head of the item so an indented continuation line
 * (`  串行 merge 收口`) cannot match, and it is required to hold a letter so a
 * bare `- 1：x` is not read as a workflow. The colon may be full-width, which is
 * what the real files use.
 */
const ENTRY = /^[-*][ \t]+([a-z0-9]+(?:-[a-z0-9]+)*)[ \t]*(?:（[^）]*）)?[ \t]*[:：][ \t]*(.*)$/u;

/**
 * Parse one catalogue file.
 *
 * @param source - the whole `index.md`, or anything else.
 * @returns the entries in file order, first line per slug only. Empty for
 *   non-string input and for a file with no list items.
 */
export function parseWorkflowCatalog(source: unknown): WorkflowEntry[] {
  if (typeof source !== "string") return [];
  const entries: WorkflowEntry[] = [];
  const seen = new Set<string>();
  for (const line of source.split(/\r?\n/u)) {
    const match = ENTRY.exec(line);
    if (match === null) continue;
    const slug = match[1] ?? "";
    const summary = (match[2] ?? "").trim();
    // A slug is a name, so it has to hold a letter: `- 1：说明` is a numbered
    // point in prose, not a workflow anyone can run.
    if (!/[a-z]/u.test(slug)) continue;
    // A repeated slug inside one file is a stale line; the first one is the one
    // the author kept current.
    if (summary === "" || seen.has(slug)) continue;
    seen.add(slug);
    entries.push({ slug, summary });
  }
  return entries;
}

/**
 * Merge catalogue layers into one list.
 *
 * @param layers - catalogues in precedence order: project `.claude`, project
 *   `.agents`, then global.
 * @returns one entry per slug, first layer wins, each layer keeping its own file
 *   order. The project layer winning is the whole point: a project that pinned a
 *   workflow means its own copy, not the global one of the same name.
 */
export function mergeWorkflowCatalogs(layers: readonly (readonly WorkflowEntry[])[]): WorkflowEntry[] {
  const merged: WorkflowEntry[] = [];
  const seen = new Set<string>();
  for (const layer of layers) {
    for (const entry of layer) {
      if (seen.has(entry.slug)) continue;
      seen.add(entry.slug);
      merged.push(entry);
    }
  }
  return merged;
}
