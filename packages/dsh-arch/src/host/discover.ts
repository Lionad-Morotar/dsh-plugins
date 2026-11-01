/**
 * Bounded likec4.config.json discovery for one workspace root.
 *
 * Order matters for correctness, not speed: the canonical `.planning/c4`
 * location (what flow-dx's c4-mapper always writes) is probed first so this
 * repository answers without a walk — the workspace root itself holds ten
 * `likec4.config.json` copies under `.claude/worktrees/*`, and pointing the
 * renderer anywhere but one explicit directory makes `fromWorkspace` throw
 * `Specify exact project`.
 *
 * A missing config is a legal state (the mapper is not required to write one),
 * so the canonical miss falls through to the walk instead of erroring.
 */
import { readdir, stat } from "node:fs/promises";
import { join } from "node:path";

import {
  CANONICAL_C4_DIR_SEGMENTS,
  CONFIG_BASENAME,
  DISCOVER_MAX_DEPTH,
  DISCOVER_MAX_HITS,
  DISCOVER_SKIP_DIRS,
} from "../shared.ts";

async function isDirectory(path: string): Promise<boolean> {
  try {
    return (await stat(path)).isDirectory();
  } catch {
    return false;
  }
}

/**
 * Resolve the C4 project directories of a workspace, canonical first.
 *
 * @param root - Absolute workspace root (already realpath-normalized).
 * @returns config-bearing directories, most relevant first, at most
 *   {@link DISCOVER_MAX_HITS}; empty when the workspace has no C4 model.
 */
export async function discoverC4ProjectDirs(root: string): Promise<string[]> {
  const canonical = join(root, ...CANONICAL_C4_DIR_SEGMENTS);
  if (await isDirectory(canonical)) return [canonical];

  const skip = new Set(DISCOVER_SKIP_DIRS);
  const hits: string[] = [];
  // Breadth-first so shallower (workspace-owned) configs outrank nested ones.
  const pending: Array<{ dir: string; depth: number }> = [{ dir: root, depth: 0 }];

  while (pending.length > 0 && hits.length < DISCOVER_MAX_HITS) {
    const { dir, depth } = pending.shift()!;
    let entries: string[];
    try {
      entries = await readdir(dir);
    } catch {
      continue;
    }
    for (const entry of entries) {
      const path = join(dir, entry);
      if (entry === CONFIG_BASENAME) {
        hits.push(dir);
        if (hits.length >= DISCOVER_MAX_HITS) break;
        continue;
      }
      if (depth >= DISCOVER_MAX_DEPTH || skip.has(entry)) continue;
      if (await isDirectory(path)) pending.push({ dir: path, depth: depth + 1 });
    }
  }
  return hits;
}
