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

/** Join one path segment onto a directory without doubling the separator. */
function joinPath(directory: string, ...segments: readonly string[]): string {
  const base = directory.endsWith("/") ? directory.slice(0, -1) : directory;
  return [base, ...segments].join("/");
}

/**
 * The catalogue files to read, in precedence order.
 *
 * A project that pins a workflow means its own copy, so the two project layers
 * come before the global data area. Without a cwd there is no project, and the
 * global layer is the whole catalogue.
 *
 * @param cwd - the session workspace, or undefined when the host has none.
 * @param homeDir - the user's home, injected rather than read from `os` so the
 *   caller owns the only place that touches the real filesystem layout.
 * @returns absolute paths, project layers first.
 */
export function catalogPaths(cwd: string | undefined, homeDir: string): string[] {
  const global = joinPath(homeDir, ".data", "flow-workflow", "index.md");
  if (cwd === undefined || cwd === "") return [global];
  return [
    joinPath(cwd, ".claude", "workflows", "index.md"),
    joinPath(cwd, ".agents", "workflows", "index.md"),
    global,
  ];
}

/**
 * Read every catalogue layer and merge them.
 *
 * A layer that cannot be read is skipped rather than fatal: the three files are
 * owned by different things (a project, an agent config, the global data area),
 * and any one of them being absent is the normal case, not an error. The reader
 * is injected so this stays testable without touching the real home directory.
 *
 * @param input - the workspace, the home directory, and how to read one file.
 * @returns the merged entries, or an empty list when no layer yields one.
 */
export async function collectWorkflowCatalog(input: {
  readonly cwd: string | undefined;
  readonly homeDir: string;
  readonly read: (path: string) => Promise<string | undefined>;
}): Promise<WorkflowEntry[]> {
  const layers: WorkflowEntry[][] = [];
  for (const path of catalogPaths(input.cwd, input.homeDir)) {
    let text: string | undefined;
    try {
      text = await input.read(path);
    } catch {
      // An unreadable layer is the same as an absent one here.
      continue;
    }
    if (text === undefined) continue;
    layers.push(parseWorkflowCatalog(text));
  }
  return mergeWorkflowCatalogs(layers);
}
