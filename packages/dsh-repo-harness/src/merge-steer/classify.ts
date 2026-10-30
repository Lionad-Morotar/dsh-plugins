/**
 * Reflog classification.
 *
 * Git writes one reflog subject per ref action. The classifier only trusts
 * actions that are unambiguous merge evidence: `merge <sources>: <result>`,
 * `commit (merge): <subject>` for a conflict-resolved merge, and optionally
 * `pull ...: <result>`. Everything else is a plain commit, rewrite, fetch or
 * checkout and must not produce a notice.
 */
import type { ReflogEntry } from "../git.ts";
import type { MergeMode } from "../types.ts";

export type { ReflogEntry } from "../git.ts";

/** A parsed reflog action that can become a merge candidate. */
export interface ParsedAction {
  readonly kind: "merge" | "pull";
  readonly sources: readonly string[];
  readonly mode: MergeMode;
}

/** One merge candidate between an old and a new ref value. */
export interface MergeCandidate {
  readonly sha: string;
  readonly sources: readonly string[];
  readonly mode: MergeMode;
  readonly subject: string;
}

const MERGE = /^merge\s+(.+?):\s*(.*)$/u;
const COMMIT_MERGE = /^commit \(merge\):\s*(.*)$/u;
const PULL = /^pull(?:\s+[^:]*)?:\s*(.*)$/u;

function modeOf(result: string): MergeMode {
  return /fast-forward/iu.test(result) ? "fast-forward" : "merge";
}

/**
 * Parse one reflog subject.
 * @param subject - `%gs` text from `git reflog`.
 * @param includePulls - whether pull entries count as merges.
 * @returns the parsed action, or null when the subject is not merge evidence.
 */
export function parseReflogAction(subject: string, includePulls: boolean): ParsedAction | null {
  const merge = MERGE.exec(subject);
  if (merge !== null) {
    const sources = merge[1]?.trim().split(/\s+/u).filter((source) => source.length > 0) ?? [];
    return { kind: "merge", sources, mode: modeOf(merge[2] ?? "") };
  }
  if (COMMIT_MERGE.test(subject)) {
    return { kind: "merge", sources: [], mode: "merge" };
  }
  if (includePulls) {
    const pull = PULL.exec(subject);
    if (pull !== null) return { kind: "pull", sources: [], mode: modeOf(pull[1] ?? "") };
  }
  return null;
}

/**
 * Select the merge candidates that happened between an old and a new ref value.
 *
 * Reflog entries arrive newest first. Entries older than `oldSha` belong to
 * earlier polls and are ignored; when the old value has fallen out of the
 * reflog window, only the newest entry is considered so an old merge is not
 * replayed as if it just happened.
 * @param entries - newest-first reflog entries.
 * @param oldSha - the ref value before this poll.
 * @param includePulls - whether pull entries count.
 * @returns candidates in chronological order.
 */
export function selectMergeEntries(
  entries: readonly ReflogEntry[],
  oldSha: string,
  includePulls = false,
): MergeCandidate[] {
  const window: ReflogEntry[] = [];
  let foundOld = false;
  for (const entry of entries) {
    if (entry.sha === oldSha) {
      foundOld = true;
      break;
    }
    window.push(entry);
  }
  if (!foundOld) window.length = Math.min(window.length, 1);

  const candidates: MergeCandidate[] = [];
  for (const entry of window) {
    const parsed = parseReflogAction(entry.subject, includePulls);
    if (parsed === null) continue;
    candidates.push({ sha: entry.sha, sources: parsed.sources, mode: parsed.mode, subject: entry.subject });
  }
  return candidates.reverse();
}
