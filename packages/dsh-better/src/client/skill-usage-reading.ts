/**
 * The workspace-wide skill usage reading.
 *
 * The panel shows two numbers: how often this skill ran in this session, and how
 * often it ran anywhere in the same workspace. The session figure is one
 * projection read; the workspace figure is a sum over every session sharing the
 * current working directory, and the judgement calls all live in this module
 * rather than in the DOM code that consumes it:
 *
 *   - `cwd` is compared as an exact string. `\/a\/b` and `\/a\/b\/` are different
 *     keys here. Normalizing would make this reading disagree with the host's own
 *     workspace identity, and a disagreement silently merges two real workspaces.
 *   - "no sessions" and "no cwd" answer `undefined`, which the panel renders as no
 *     line at all. Claiming zero would assert the skill never ran in a workspace
 *     this code could not even identify.
 *   - "the workspace is known and nobody invoked it" answers 0. That is a real
 *     fact and worth showing.
 *
 * Kept free of any host type so it can be tested without a client context: the
 * caller assembles the rows, this module only does the arithmetic.
 *
 * @module dsh-better/skill-usage-reading
 */

/** One session's contribution to a workspace tally. */
export interface SessionUsageRow {
  /** The session's working directory, exactly as the host reports it. */
  readonly cwd?: string;
  /** Skill name → invocations in that session; absent when the projection is not loaded. */
  readonly usage?: Readonly<Record<string, number>>;
}

/**
 * Sum one skill's invocations across the sessions of one workspace.
 *
 * @param rows - one row per known session.
 * @param cwd - the current session's working directory, or undefined when unknown.
 * @param name - skill name.
 * @returns the workspace total, or undefined when the workspace cannot be identified.
 */
export function workspaceUsageOf(
  rows: readonly SessionUsageRow[],
  cwd: string | undefined,
  name: string,
): number | undefined {
  if (cwd === undefined || cwd === "") return undefined;
  if (rows.length === 0) return undefined;
  let total = 0;
  for (const row of rows) {
    // Exact comparison on purpose; see the module note.
    if (row.cwd !== cwd) continue;
    const count = row.usage?.[name];
    // A non-numeric tally is a malformed projection, not a count of NaN.
    if (typeof count === "number" && Number.isFinite(count)) total += count;
  }
  return total;
}
