/**
 * Commit detail: one commit's message, parents and the files it changed.
 *
 * `diff-tree -m --first-parent` is what makes a merge commit answer with the
 * diff against its first parent instead of an empty combined diff, and `--root`
 * makes the initial commit answer with all of its files. Every argument is
 * fixed here except the validated object id.
 */
import { fail, runFailure } from "./failure.ts";
import type { GitRunner } from "./git.ts";
import { parseCommitMeta, parseNameStatusZ, parseNumStatZ } from "./parse.ts";
import type { GitCommitDetail, GitCommitFile, GitCommitRequest, GitCommitResult } from "./types.ts";

export interface CommitOptions {
  readonly runner: GitRunner;
  readonly cwd: string;
}

/** An object id or an unambiguous abbreviation; never a revision expression. */
const SAFE_HASH = /^[0-9a-fA-F]{4,64}$/u;
const META_FORMAT = "--format=%H%x00%P%x00%an%x00%at%x00%s%x00%b";

/**
 * Read one commit's detail.
 *
 * A hash is accepted as hex only: this endpoint is reachable from the view, and
 * `--` or `^` in a revision expression would turn a read into another range.
 */
export async function collectCommit(
  options: CommitOptions,
  request: GitCommitRequest,
  signal?: AbortSignal,
): Promise<GitCommitResult> {
  const hash = typeof request.hash === "string" ? request.hash.trim() : "";
  if (!SAFE_HASH.test(hash)) return fail("invalid-request", "hash must be a hexadecimal object id");
  const cwd = request.cwd ?? options.cwd;

  const metaRun = options.runner.run(["show", "-s", META_FORMAT, "--end-of-options", hash], { cwd, signal });
  const statusRun = options.runner.run(
    ["diff-tree", "--no-commit-id", "--name-status", "-r", "-z", "-M", "--root", "-m", "--first-parent", hash],
    { cwd, signal },
  );
  const statRun = options.runner.run(
    ["diff-tree", "--no-commit-id", "--numstat", "-r", "-z", "-M", "--root", "-m", "--first-parent", hash],
    { cwd, signal },
  );
  const [metaResult, statusResult, statResult] = await Promise.all([metaRun, statusRun, statRun]);
  for (const result of [metaResult, statusResult, statResult]) {
    const failure = runFailure(result);
    if (failure !== null) return { ok: false, error: failure };
    if (result.stdoutLossy) return fail("git-failed", "command output exceeded the collection budget");
  }

  const meta = parseCommitMeta(metaResult.stdout);
  if (meta === null) return fail("git-failed", "the commit record could not be parsed");

  const stats = new Map(parseNumStatZ(statResult.stdout).map(stat => [stat.path, stat]));
  const files: GitCommitFile[] = parseNameStatusZ(statusResult.stdout).map(file => {
    const stat = stats.get(file.path);
    return {
      path: file.path,
      status: file.status,
      additions: stat?.additions ?? null,
      deletions: stat?.deletions ?? null,
      ...(file.origPath === undefined ? {} : { origPath: file.origPath }),
    };
  });

  const detail: GitCommitDetail = { ...meta, files };
  return { ok: true, detail };
}
