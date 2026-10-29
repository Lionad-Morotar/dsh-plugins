/** Shared mapping from runner outcomes to the failure vocabulary the panel shows. */
import type { GitRunResult } from "./git.ts";
import type { GitFailure, GitFailureCode } from "./types.ts";

const MAX_MESSAGE = 600;

export function fail(code: GitFailureCode, message: string): { readonly ok: false; readonly error: GitFailure } {
  return { ok: false, error: { code, message: message.slice(0, MAX_MESSAGE) } };
}

/** Turn a timed-out or non-zero run into a failure; null means usable output. */
export function runFailure(result: GitRunResult): GitFailure | null {
  if (result.timedOut) return { code: "timeout", message: "the command exceeded its deadline" };
  if (result.cancelled) return { code: "internal", message: "the command was cancelled" };
  if (result.exitCode !== 0) {
    const fallback = result.exitCode === null ? "the command was terminated by a signal" : `the command exited with code ${String(result.exitCode)}`;
    const detail = result.stderr.trim() === "" ? fallback : result.stderr.trim();
    return { code: "git-failed", message: detail };
  }
  return null;
}
