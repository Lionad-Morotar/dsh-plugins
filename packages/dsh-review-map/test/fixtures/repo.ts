/**
 * A real git repository in a temporary directory, for tests that need git's own
 * answers rather than a hand-written fixture.
 *
 * Every assertion in this package's host tests is against what git actually
 * reports, so the fixture has to be a real repository: a stub would let a parser
 * bug and a fixture bug cancel out. `node:child_process` is used here and only
 * here, because the tests drive git directly instead of going through the host
 * subprocess service they are testing.
 *
 * Each builder returns a handle with the paths and the git entry points a test
 * needs, and `dispose()` removes the tree. Tests must call it in `afterEach`:
 * a leaked temporary repository is invisible until the machine fills up.
 */
import { execFileSync } from "node:child_process";
import { mkdtemp, mkdir, realpath, rm, writeFile, chmod } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";

import { createGitRunner, type GitRunner, type SubprocessLike } from "../../src/host/git.ts";

/** What a test does with a fixture repository. */
export interface RepoHandle {
  /** The repository's top level, which is also the worktree root. */
  readonly root: string;
  /** Run git in the repository and return stdout; throws on a non-zero exit. */
  git(args: readonly string[]): string;
  /** Run git and return its exit code and streams instead of throwing. */
  tryGit(args: readonly string[]): { readonly code: number; readonly stdout: string; readonly stderr: string };
  /** Write a file, creating parent directories. */
  write(path: string, content: string): Promise<void>;
  /** Read a file as text. */
  read(path: string): Promise<string>;
  /** Remove the whole tree. */
  dispose(): Promise<void>;
}

/** One command's outcome, whatever produced it. */
interface CommandOutcome {
  readonly exitCode: number;
  readonly stdout: string;
  readonly stderr: string;
}

/**
 * Run git synchronously in a directory.
 * @param cwd - the directory to run in.
 * @param args - the argv entries after `git`.
 * @param env - extra environment for this call.
 * @returns the exit code and both streams.
 */
function runGit(cwd: string, args: readonly string[], env: Record<string, string> = {}): CommandOutcome {
  try {
    const stdout = execFileSync("git", args, {
      cwd,
      encoding: "utf8",
      maxBuffer: 64 * 1024 * 1024,
      // Both streams are captured, not inherited: git writes expected failures
      // (a missing ref, a merge conflict) to stderr, and letting those through
      // would put noise in a passing run.
      stdio: ["ignore", "pipe", "pipe"],
      env: { ...process.env, GIT_TERMINAL_PROMPT: "0", GIT_AUTHOR_DATE: "2026-01-01T00:00:00Z", GIT_COMMITTER_DATE: "2026-01-01T00:00:00Z", ...env },
    });
    return { exitCode: 0, stdout, stderr: "" };
  } catch (error) {
    const failed = error as { status?: number; stdout?: string; stderr?: string };
    return { exitCode: failed.status ?? 1, stdout: failed.stdout ?? "", stderr: failed.stderr ?? String(error) };
  }
}

/**
 * Create an empty repository with a commit identity configured.
 *
 * The branch is forced to `main` so the baseline-resolution tests do not depend
 * on the machine's `init.defaultBranch`, which is a user setting this package
 * has no business reading.
 * @param prefix - a prefix for the temporary directory's name.
 * @returns the handle.
 */
export async function createRepo(prefix = "review-map"): Promise<RepoHandle> {
  // Resolved through `realpath` because git reports the canonical top level: on
  // macOS the temporary directory is a symlink (`/var` to `/private/var`), and
  // an unresolved root would make every path comparison fail for a reason that
  // has nothing to do with the code under test.
  const root = await realpath(await mkdtemp(join(tmpdir(), `${prefix}-`)));
  const git = (args: readonly string[]): string => {
    const result = runGit(root, args);
    if (result.exitCode !== 0) throw new Error(`git ${args.join(" ")} failed: ${result.stderr}`);
    return result.stdout;
  };
  git(["init", "-q", "-b", "main"]);
  git(["config", "user.name", "Review Map"]);
  git(["config", "user.email", "review-map@example.com"]);
  git(["config", "commit.gpgsign", "false"]);
  return {
    root,
    git,
    tryGit: args => {
      const outcome = runGit(root, args);
      return { code: outcome.exitCode, stdout: outcome.stdout, stderr: outcome.stderr };
    },
    async write(path, content) {
      const target = join(root, path);
      await mkdir(dirname(target), { recursive: true });
      await writeFile(target, content, "utf8");
    },
    async read(path) {
      return execFileSync("cat", [join(root, path)], { encoding: "utf8" });
    },
    async dispose() {
      await rm(root, { recursive: true, force: true });
    },
  };
}

/**
 * Create a repository with one commit holding the given files.
 * @param files - path to content.
 * @param prefix - a prefix for the temporary directory's name.
 * @returns the handle, with the initial commit in place.
 */
export async function createRepoWithCommit(
  files: Readonly<Record<string, string>>,
  prefix = "review-map",
): Promise<RepoHandle> {
  const repo = await createRepo(prefix);
  for (const [path, content] of Object.entries(files)) await repo.write(path, content);
  repo.git(["add", "-A"]);
  repo.git(["commit", "-qm", "initial"]);
  return repo;
}

/**
 * Commit whatever is in the working tree.
 * @param repo - the fixture repository.
 * @param message - the commit subject.
 */
export function commitAll(repo: RepoHandle, message: string): void {
  repo.git(["add", "-A"]);
  repo.git(["commit", "-qm", message]);
}

/**
 * The subprocess service, backed by real git.
 *
 * The host service is a spawn contract; this adapter satisfies it with
 * `execFileSync` so the runner under test meets the same bytes a real host would
 * hand it, including exit codes and stderr. `spawn` is declared synchronous
 * because the real service starts the child synchronously and returns handles,
 * and a test that only sees the collected streams cannot tell the difference.
 * @param options - a per-call hook to observe or override a spawn.
 * @returns the service and the argv of every call it saw.
 */
export function realSubprocess(options: {
  readonly onSpawn?: (spec: { readonly argv: readonly string[]; readonly cwd: string; readonly env?: Readonly<Record<string, string | undefined>> }) => void;
  readonly override?: (spec: { readonly argv: readonly string[]; readonly cwd: string }) => CommandOutcome | null;
} = {}): { readonly subprocess: SubprocessLike; readonly calls: { argv: readonly string[]; cwd: string; env: Readonly<Record<string, string | undefined>> | undefined }[] } {
  const calls: { argv: readonly string[]; cwd: string; env: Readonly<Record<string, string | undefined>> | undefined }[] = [];
  const subprocess: SubprocessLike = {
    spawn(spec) {
      calls.push({ argv: spec.argv, cwd: spec.cwd, env: spec.env });
      options.onSpawn?.(spec);
      const overridden = options.override?.({ argv: spec.argv, cwd: spec.cwd });
      const result = overridden ?? runGit(spec.cwd, spec.argv.slice(1));
      return {
        done: Promise.resolve({ exitCode: result.exitCode, signal: null }),
        collected: {
          stdout: { readFrom: () => ({ text: result.stdout, lossy: false }) },
          stderr: { readFrom: () => ({ text: result.stderr, lossy: false }) },
        },
      };
    },
  };
  return { subprocess, calls };
}

/**
 * A runner over real git in one directory.
 * @param cwd - the directory every command runs in.
 * @returns the runner and the spawn log.
 */
export function realRunner(cwd: string): { readonly runner: GitRunner; readonly calls: { argv: readonly string[]; cwd: string; env: Readonly<Record<string, string | undefined>> | undefined }[] } {
  const { subprocess, calls } = realSubprocess();
  return { runner: createGitRunner({ subprocess, cwd }), calls };
}

/**
 * Make a path executable, for the external-diff falsification test.
 * @param path - the file to chmod.
 */
export async function makeExecutable(path: string): Promise<void> {
  await chmod(path, 0o755);
}
