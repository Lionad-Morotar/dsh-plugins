/**
 * The x...y comparison contract: which two revisions a range is about, and the
 * only commands this package is allowed to run to find out.
 *
 * Two things live here because they are the same decision seen twice. Resolving
 * a comparison decides which two revisions a range covers; the read-only
 * whitelist decides which git commands may be used to look at them. A PR panel
 * reads a repository it does not own, so "this package cannot write" has to be a
 * property of the code rather than of the callers' discipline.
 *
 * The three-dot range is the whole point of this module. `x...y` is not a diff
 * between two tips: it is a diff between the merge base of the two and `y`, with
 * `x`'s own later commits excluded. That is what a pull request means, and a
 * two-dot diff against a base that has moved on would report the base's own work
 * as the branch's. `ahead` and `behind` come from the same range, so a reader can
 * say "3 ahead, 12 behind" without a second round trip.
 *
 * A detached HEAD is a normal state here: every command below names revisions
 * explicitly, so nothing depends on there being a branch.
 */
import { basename } from "node:path";

import type { GitRunner, GitRunResult } from "./git.ts";
import type {
  CompareReading,
  CompareReadingResult,
  PrError,
  PrErrorCode,
  PrHead,
  RefEntry,
  RefKind,
  RefListing,
  RefListingResult,
  RefReading,
} from "../shared.ts";

/**
 * Subcommands this package may run.
 *
 * Deliberately a whitelist and not a blacklist: a blacklist has to be updated
 * every time git grows a command, and the cost of forgetting is a write. Every
 * entry here is read-only by construction, and `config` is absent on purpose
 * because `git config` writes as easily as it reads.
 */
const READ_ONLY_SUBCOMMANDS: ReadonlySet<string> = new Set([
  "rev-parse",
  "symbolic-ref",
  "merge-base",
  "rev-list",
  "log",
  "diff",
  "for-each-ref",
  "cat-file",
  "show",
]);

/** Flags that turn a read into a write, or make git run a program. */
const FORBIDDEN_FLAGS: readonly string[] = ["--output", "--ext-diff", "--textconv", "--no-index", "--stdin"];

/** A failed read, in the wire shape the client maps to its own copy. */
export function fail(code: PrErrorCode, message: string): { readonly ok: false; readonly error: PrError } {
  return { ok: false, error: { code, message } };
}

/**
 * Whether a command is one this package is allowed to run.
 *
 * @param args - the argv entries after `git`.
 * @returns the reason it is refused, or null when it is allowed.
 */
export function readOnlyViolation(args: readonly string[]): string | null {
  const subcommand = args[0];
  if (subcommand === undefined) return "empty command";
  if (!READ_ONLY_SUBCOMMANDS.has(subcommand)) return `subcommand ${subcommand} is not read-only here`;
  for (const arg of args) {
    for (const flag of FORBIDDEN_FLAGS) {
      if (arg === flag || arg.startsWith(`${flag}=`)) return `flag ${flag} is not allowed`;
    }
  }
  return null;
}

/**
 * Run one command, refusing anything outside the whitelist.
 *
 * The check sits in front of the spawn rather than in each caller, so a new
 * caller cannot forget it.
 * @param runner - the argv-only runner.
 * @param args - the argv entries after `git`.
 * @param options - cwd and signal for this call.
 * @returns the run result, or a refusal when the command is not read-only.
 * @throws TypeError when an argv entry is malformed; that is a programming
 *   error, not a repository state.
 */
export async function runReadOnly(
  runner: GitRunner,
  args: readonly string[],
  options: { readonly cwd?: string; readonly signal?: AbortSignal } = {},
): Promise<GitRunResult | { readonly refused: string }> {
  const violation = readOnlyViolation(args);
  if (violation !== null) return { refused: violation };
  return runner.run(args, options);
}

/** Whether a result is a refusal rather than a run. */
export function isRefused(result: GitRunResult | { readonly refused: string }): result is { readonly refused: string } {
  return "refused" in result;
}

/**
 * Whether a directory is inside a git worktree, and where its top level is.
 *
 * `rev-parse --show-toplevel` fails for a plain directory, for a bare repository
 * and for a directory outside any repository; all three are the same answer to a
 * PR panel.
 * @param runner - the argv-only runner.
 * @param cwd - the directory to probe.
 * @param signal - cancellation for the whole read.
 * @returns the top level path, or null.
 */
export async function repoRoot(runner: GitRunner, cwd: string, signal?: AbortSignal): Promise<string | null> {
  const result = await runReadOnly(runner, ["rev-parse", "--show-toplevel"], { cwd, signal });
  if (isRefused(result)) return null;
  if (result.exitCode !== 0) return null;
  const root = result.stdout.trim();
  return root === "" ? null : root;
}

/** One resolved revision, or the reason there is none. */
export type ResolveRefOutcome =
  | { readonly ok: true; readonly hash: string }
  | { readonly ok: false; readonly error: PrError };

/**
 * Resolve one ref name to the commit it names.
 *
 * `^{commit}` is what makes this a commit lookup rather than an object lookup: a
 * tree or blob hash must not pass as a comparison endpoint, and an annotated tag
 * has to peel to the commit it points at rather than to the tag object.
 * @param runner - the argv-only runner.
 * @param cwd - the repository top level.
 * @param ref - the ref as the caller spelled it.
 * @param signal - cancellation for the whole read.
 * @returns the full hash, or `invalid-ref`.
 */
export async function resolveRef(
  runner: GitRunner,
  cwd: string,
  ref: string,
  signal?: AbortSignal,
): Promise<ResolveRefOutcome> {
  if (ref === "" || ref.includes("\0")) return fail("invalid-ref", "a ref name is required");
  const result = await runReadOnly(runner, ["rev-parse", "--verify", "--quiet", `${ref}^{commit}`], { cwd, signal });
  if (isRefused(result)) return fail("bad-request", "a read-only command was refused");
  const hash = result.stdout.trim();
  if (result.exitCode !== 0 || hash === "") return fail("invalid-ref", `${ref} does not name a commit`);
  return { ok: true, hash };
}

/**
 * Read one ref into the wire shape, keeping the caller's spelling.
 * @param runner - the argv-only runner.
 * @param cwd - the repository top level.
 * @param input - the ref as the caller spelled it.
 * @param signal - cancellation for the whole read.
 * @returns the reading, or `invalid-ref`.
 */
async function readRef(
  runner: GitRunner,
  cwd: string,
  input: string,
  signal?: AbortSignal,
): Promise<{ readonly ok: true; readonly reading: RefReading } | { readonly ok: false; readonly error: PrError }> {
  const resolved = await resolveRef(runner, cwd, input, signal);
  if (!resolved.ok) return resolved;
  return { ok: true, reading: { input, hash: resolved.hash, short: resolved.hash.slice(0, 7) } };
}

/**
 * Pin one x...y comparison.
 *
 * @param runner - the argv-only runner.
 * @param cwd - the repository top level.
 * @param baseInput - the base ref as the caller spelled it.
 * @param headInput - the head ref as the caller spelled it.
 * @param signal - cancellation for the whole read.
 * @returns the pinned reading, or `invalid-ref` / `no-merge-base`.
 */
export async function resolveCompare(
  runner: GitRunner,
  cwd: string,
  baseInput: string,
  headInput: string,
  signal?: AbortSignal,
): Promise<CompareReadingResult> {
  const base = await readRef(runner, cwd, baseInput, signal);
  if (!base.ok) return base;
  const head = await readRef(runner, cwd, headInput, signal);
  if (!head.ok) return head;

  const mergeBaseResult = await runReadOnly(runner, ["merge-base", base.reading.hash, head.reading.hash], { cwd, signal });
  if (isRefused(mergeBaseResult)) return fail("bad-request", "a read-only command was refused");
  const mergeBase = mergeBaseResult.stdout.trim();
  // Exit 1 with no output is git's answer for two histories with no common
  // ancestor, which is a different fact from a ref that does not exist.
  if (mergeBaseResult.exitCode !== 0 || mergeBase === "") {
    return fail("no-merge-base", `${baseInput} and ${headInput} share no commit`);
  }

  const counts = await runReadOnly(
    runner,
    ["rev-list", "--left-right", "--count", `${base.reading.hash}...${head.reading.hash}`],
    { cwd, signal },
  );
  if (isRefused(counts)) return fail("bad-request", "a read-only command was refused");
  if (counts.exitCode !== 0) return fail("unreadable", counts.stderr.trim() || "git rev-list failed");
  // Left is what only the base reaches (behind), right is what only the head
  // reaches (ahead).
  const [behindRaw, aheadRaw] = counts.stdout.trim().split(/\s+/u);
  const behind = Number.parseInt(behindRaw ?? "", 10);
  const ahead = Number.parseInt(aheadRaw ?? "", 10);
  if (!Number.isFinite(behind) || !Number.isFinite(ahead)) {
    return fail("unreadable", "git rev-list did not report both counts");
  }

  const reading: CompareReading = {
    base: base.reading,
    head: head.reading,
    mergeBase: { hash: mergeBase, short: mergeBase.slice(0, 7) },
    ahead,
    behind,
  };
  return { ok: true, reading };
}

/**
 * Whether a ref names a commit that exists.
 * @param runner - the argv-only runner.
 * @param cwd - the repository top level.
 * @param ref - the revision to check.
 * @param signal - cancellation for the whole read.
 * @returns true when `rev-parse --verify` accepts it.
 */
async function refExists(runner: GitRunner, cwd: string, ref: string, signal?: AbortSignal): Promise<boolean> {
  const result = await runReadOnly(runner, ["rev-parse", "--verify", "--quiet", `${ref}^{commit}`], { cwd, signal });
  if (isRefused(result)) return false;
  return result.exitCode === 0 && result.stdout.trim() !== "";
}

/**
 * The ref the repository says it forked from, when a remote names one.
 *
 * `symbolic-ref` on `refs/remotes/origin/HEAD` is the only place git records
 * "the default branch of this remote"; a clone sets it, a repository without a
 * remote does not.
 * @param runner - the argv-only runner.
 * @param cwd - the repository top level.
 * @param signal - cancellation for the whole read.
 * @returns the short ref name, or null.
 */
async function remoteDefaultRef(runner: GitRunner, cwd: string, signal?: AbortSignal): Promise<string | null> {
  const result = await runReadOnly(runner, ["symbolic-ref", "--short", "refs/remotes/origin/HEAD"], { cwd, signal });
  if (isRefused(result)) return null;
  if (result.exitCode !== 0) return null;
  const ref = result.stdout.trim();
  return ref === "" ? null : ref;
}

/**
 * The base a fresh panel starts on.
 *
 * Order: the remote's default branch, then the local `main`, then `master`. The
 * remote comes first because it is the repository's own statement about where
 * work lands; the local names are guesses that happen to be right most of the
 * time. A repository that names none returns null, and the panel asks the reader
 * to pick rather than inventing a base.
 * @param runner - the argv-only runner.
 * @param cwd - the repository top level.
 * @param signal - cancellation for the whole read.
 * @returns the short ref name, or null.
 */
export async function resolveDefaultBase(
  runner: GitRunner,
  cwd: string,
  signal?: AbortSignal,
): Promise<string | null> {
  const candidates = [await remoteDefaultRef(runner, cwd, signal), "main", "master"];
  for (const candidate of candidates) {
    if (candidate === null) continue;
    if (await refExists(runner, cwd, candidate, signal)) return candidate;
  }
  return null;
}

/**
 * The kind of ref a full refname names.
 * @param refname - a full refname such as `refs/heads/main`.
 * @returns the kind, or null for a ref this panel does not list.
 */
function kindOf(refname: string): RefKind | null {
  if (refname.startsWith("refs/heads/")) return "branch";
  if (refname.startsWith("refs/remotes/")) return "remote";
  if (refname.startsWith("refs/tags/")) return "tag";
  return null;
}

/**
 * Read where HEAD sits.
 * @param runner - the argv-only runner.
 * @param cwd - the repository top level.
 * @param signal - cancellation for the whole read.
 * @returns the head, or null when HEAD names no commit.
 */
async function readHead(runner: GitRunner, cwd: string, signal?: AbortSignal): Promise<PrHead | null> {
  const options = { cwd, signal };
  const [short, branch] = await Promise.all([
    runReadOnly(runner, ["rev-parse", "--short", "HEAD"], options),
    runReadOnly(runner, ["symbolic-ref", "--short", "HEAD"], options),
  ]);
  if (isRefused(short) || isRefused(branch)) return null;
  const shortHash = short.stdout.trim();
  if (short.exitCode !== 0 || shortHash === "") return null;
  // `symbolic-ref` exits non-zero on a detached HEAD, which is a normal state
  // here: every other command names its revisions explicitly.
  const ref = branch.exitCode === 0 ? branch.stdout.trim() : "";
  return ref === "" ? { kind: "detached", ref: "HEAD", shortHash } : { kind: "branch", ref, shortHash };
}

/**
 * Parse `git for-each-ref --format=%(refname)%09%(objecttype)` output.
 *
 * A ref name cannot contain a tab or a newline, so one line is one record and
 * the two fields are unambiguous. `origin/HEAD` is skipped: it is a symbolic
 * pointer to another remote ref, not a branch a reader would pick.
 * @param text - raw stdout.
 * @returns one entry per ref, deduplicated by short name.
 */
export function parseRefListing(text: string): { readonly name: string; readonly kind: RefKind }[] {
  const seen = new Set<string>();
  const entries: { readonly name: string; readonly kind: RefKind }[] = [];
  for (const raw of text.split("\n")) {
    const line = raw.endsWith("\r") ? raw.slice(0, -1) : raw;
    if (line === "") continue;
    const tab = line.indexOf("\t");
    if (tab < 0) continue;
    const refname = line.slice(0, tab);
    const kind = kindOf(refname);
    if (kind === null) continue;
    const name =
      kind === "branch"
        ? refname.slice("refs/heads/".length)
        : kind === "remote"
          ? refname.slice("refs/remotes/".length)
          : refname.slice("refs/tags/".length);
    if (name === "" || name.endsWith("/HEAD")) continue;
    if (seen.has(name)) continue;
    seen.add(name);
    entries.push({ name, kind });
  }
  return entries;
}

/** The order refs are listed in: branches, then remotes, then tags. */
const KIND_ORDER: Readonly<Record<RefKind, number>> = { branch: 0, remote: 1, tag: 2 };

/**
 * Read the picker's whole world: the refs that can be compared, HEAD, and the
 * default base.
 *
 * @param runner - the argv-only runner.
 * @param cwd - the directory to read; the repository top level is resolved here.
 * @param signal - cancellation for the whole read.
 * @returns the listing, or `not-a-repo`.
 */
export async function readRefs(runner: GitRunner, cwd: string, signal?: AbortSignal): Promise<RefListingResult> {
  const root = await repoRoot(runner, cwd, signal);
  if (root === null) return fail("not-a-repo", `${cwd} is not inside a git worktree`);

  const [listing, head, defaultBase] = await Promise.all([
    runReadOnly(runner, ["for-each-ref", "--format=%(refname)%09%(objecttype)", "refs/heads", "refs/remotes", "refs/tags"], {
      cwd: root,
      signal,
    }),
    readHead(runner, root, signal),
    resolveDefaultBase(runner, root, signal),
  ]);
  if (isRefused(listing)) return fail("bad-request", "a read-only command was refused");
  if (listing.exitCode !== 0) return fail("unreadable", listing.stderr.trim() || "git for-each-ref failed");
  if (head === null) return fail("invalid-ref", "HEAD does not name a commit");

  const refs: RefEntry[] = parseRefListing(listing.stdout)
    .map(entry => ({ ...entry, isDefault: entry.name === defaultBase }))
    .sort((left, right) => {
      const byKind = KIND_ORDER[left.kind] - KIND_ORDER[right.kind];
      if (byKind !== 0) return byKind;
      return left.name < right.name ? -1 : left.name > right.name ? 1 : 0;
    });

  const value: RefListing = { repo: basename(root), head, refs, defaultBase };
  return { ok: true, listing: value };
}
