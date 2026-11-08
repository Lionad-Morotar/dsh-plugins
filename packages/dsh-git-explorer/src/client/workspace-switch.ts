/**
 * Which registered Workspace the Git panel is standing in, and how the header's
 * search box narrows that list.
 *
 * The panel reads a repository root off `git`, but the host registers Workspaces
 * by their own path, and the two strings are not guaranteed to be spelled the
 * same way: a root captured from a shell carries the trailing separator the user
 * typed, while the registered path does not. Comparison therefore trims
 * separators and nothing else. It deliberately does not resolve symlinks or fold
 * case: two different strings are two different Workspaces here, and guessing
 * otherwise would mark the wrong row current.
 */

/** One registered Workspace, as the header needs to render and switch to it. */
export interface WorkspaceChoice {
  readonly workspaceId: string;
  readonly title: string;
  readonly path: string;
}

/**
 * What the header needs from the host to offer a switch.
 *
 * `list` is a getter rather than an array because the host's inventory settles
 * after the view mounts: a snapshot taken at build time would pin the panel to
 * whatever was registered at that instant. `startSession` is absent on a host
 * that has no Workspace navigation, and the trigger then stays a plain label
 * instead of becoming a button that does nothing.
 */
export interface WorkspaceSwitchWiring {
  /**
   * Whether both Workspace services are readable right now.
   *
   * A getter, not a boolean: the Workspace plugin may mount after this one, and
   * a value captured once would leave the repository name inert on exactly that
   * host. Absent means the caller already knows the services are there.
   */
  readonly available?: () => boolean;
  readonly list?: () => readonly WorkspaceChoice[];
  readonly startSession?: (workspaceId: string) => void;
}

/**
 * The last path segment, which is what the header shows for a repository.
 * @param root - the repository root.
 * @returns the segment, or the whole root when it has none.
 */
export function repoLabel(root: string): string {
  const parts = root.split(/[\\/]/u).filter(Boolean);
  return parts.at(-1) ?? root;
}

/** Drop trailing path separators, leaving a bare `/` or `C:\` alone. */
function trimSeparators(path: string): string {
  let end = path.length;
  while (end > 0) {
    const char = path.charAt(end - 1);
    if (char !== "/" && char !== "\\") break;
    end -= 1;
  }
  return path.slice(0, end);
}

/**
 * Find the registered Workspace whose directory is the repository root.
 * @param root - the repository root as the Git snapshot reports it.
 * @param items - the host's registered Workspaces, in its own order.
 * @returns the matching id, or undefined when the root belongs to none of them.
 */
export function currentWorkspaceId(
  root: string,
  items: readonly WorkspaceChoice[],
): string | undefined {
  const target = trimSeparators(root);
  if (target === "") return undefined;
  for (const item of items) {
    if (trimSeparators(item.path) === target) return item.workspaceId;
  }
  return undefined;
}

/**
 * Narrow the list to the rows whose title or path contains the query.
 * @param items - the host's registered Workspaces, in its own order.
 * @param query - raw input; surrounding whitespace is ignored.
 * @returns matches in the host's order, or the original sequence for an empty
 * query. Ranking by match quality is not done on purpose: the list is short and
 * a row that moves while the reader is aiming at it is worse than a row that is
 * merely second.
 */
export function filterWorkspaces(
  items: readonly WorkspaceChoice[],
  query: string,
): readonly WorkspaceChoice[] {
  const needle = query.trim().toLowerCase();
  if (needle === "") return items;
  return items.filter(
    item => item.title.toLowerCase().includes(needle) || item.path.toLowerCase().includes(needle),
  );
}
