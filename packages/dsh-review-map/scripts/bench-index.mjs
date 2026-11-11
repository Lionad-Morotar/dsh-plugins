/**
 * Index benchmark: one command, one JSON line, a non-zero exit when it is slow.
 *
 * This exists because the index is the expensive half of the review map and its
 * cost is invisible until someone measures it. `collectIndex` walks the tree,
 * reads every file and extracts imports; on a real repository that is seconds,
 * and a regression that doubles it would ship silently. A benchmark that a
 * person can run, and that a script can gate on, is the only thing that keeps
 * that number honest.
 *
 * Two decisions shape the file:
 *
 * - **It runs on plain Node, with no host.** The git runner is normally a host
 *   service, so this script supplies its own subprocess adapter. Nothing here
 *   imports Cordis or the plugin's `apply`; the benchmark must be runnable in CI
 *   and on a laptop with no DSH installed.
 *
 * - **The measurement logic is a pure function.** `evaluateBench` decides
 *   whether a result is within budget, and it is exported so a unit test can
 *   pin the boundary case (exactly at the budget passes) without spawning git.
 *   The CLI half only runs when this file is the entry point.
 *
 * The four timings are measured, not guessed:
 *
 * - `snapshot_ms` — the change list alone (`collectSnapshot`).
 * - `structure_ms` — the index's listing phase: the same run with the parse
 *   budget at zero, so it lists the tree and reads no content.
 * - `index_ms` — the whole index, content and imports included.
 * - `imports_ms` — the residual, `index_ms - structure_ms`.
 *
 * `structure_ms` therefore overlaps `snapshot_ms` (both read the change list) and
 * `imports_ms` is a difference rather than a phase timed on its own. Both are
 * stated here and in the README because a benchmark whose numbers do not mean
 * what they look like is worse than no benchmark.
 */
import { spawnSync } from "node:child_process";
import { writeFileSync } from "node:fs";
import { basename, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { createGitRunner } from "../src/host/git.ts";
import { collectSnapshot } from "../src/host/snapshot.ts";
import { collectIndex, DEFAULT_INDEX_LIMITS } from "../src/host/structure.ts";

/** Default ceiling for one index run, in milliseconds. */
export const DEFAULT_BUDGET_MS = 12_000;

/**
 * The fields every benchmark result must carry.
 *
 * Named once so `evaluateBench` can report exactly what is missing rather than
 * failing on the first absent key.
 */
export const BENCH_FIELDS = [
  "repo",
  "scope",
  "files",
  "changedFiles",
  "parsedFiles",
  "edges",
  "unresolved",
  "snapshot_ms",
  "structure_ms",
  "imports_ms",
  "index_ms",
  "withinBudget",
  "generatedAt",
];

/**
 * Whether a result is within budget, and what the process should exit with.
 *
 * The boundary is inclusive: a run that takes exactly the budget has not
 * exceeded it. That is the reading a person expects from "budget", and it is the
 * case a naive `<` would get wrong.
 * @param result - the measured result.
 * @param budgetMs - the ceiling for `index_ms`.
 * @returns the verdict, the exit code, and any fields the result is missing.
 */
export function evaluateBench(result, budgetMs) {
  const missing = BENCH_FIELDS.filter(field => !(field in result));
  const indexMs = Number(result.index_ms);
  const withinBudget = Number.isFinite(indexMs) && indexMs <= budgetMs;
  return {
    missing,
    withinBudget,
    // A result missing its own fields cannot be trusted to pass: it exits 1 like
    // an over-budget run rather than 0 with a hole in it.
    exitCode: withinBudget && missing.length === 0 ? 0 : 1,
  };
}

/**
 * A subprocess service backed by `spawnSync`.
 *
 * The host normally provides this; the benchmark supplies its own so it can run
 * without one. The shape is the contract `createGitRunner` consumes: argv, cwd,
 * stdio with optional stdin data, and a handle whose `done` resolves with an
 * exit code.
 *
 * `maxBuffer` is generous because a large repository's `cat-file --batch` output
 * is tens of megabytes, and the runner's own byte budget is enforced above this
 * layer rather than here.
 * @returns the service.
 */
function createSubprocess() {
  return {
    spawn(spec) {
      const stdin = spec.stdio.stdin;
      const input = typeof stdin === "object" ? stdin.data : undefined;
      const result = spawnSync(spec.argv[0], spec.argv.slice(1), {
        cwd: spec.cwd,
        encoding: "utf8",
        maxBuffer: 256 * 1024 * 1024,
        input: input ?? undefined,
        stdio: [input === undefined ? "ignore" : "pipe", "pipe", "pipe"],
        env: { ...process.env, ...spec.env },
      });
      const stdout = result.stdout ?? "";
      const stderr = result.stderr ?? "";
      const exitCode = result.status ?? (result.error === undefined ? 1 : 1);
      return {
        done: Promise.resolve({ exitCode, signal: null }),
        collected: {
          stdout: { readFrom: () => ({ text: stdout, lossy: false }) },
          stderr: { readFrom: () => ({ text: stderr, lossy: false }) },
        },
      };
    },
  };
}

/**
 * Read the repository's top level, for the `repo` field.
 * @param runner - the argv-only runner.
 * @param cwd - where to ask.
 * @returns the basename of the top level, or the cwd's basename when it cannot
 *   be read (a benchmark of a non-repository is still worth a number).
 */
async function repoName(runner, cwd) {
  const result = await runner.run(["rev-parse", "--show-toplevel"], { cwd });
  const root = result.stdout.trim();
  return root === "" ? basename(cwd) : basename(root);
}

/**
 * Time one async step.
 * @param step - the work to run.
 * @returns its result and how long it took, in milliseconds.
 */
async function timed(step) {
  const started = process.hrtime.bigint();
  const value = await step();
  const elapsed = Number(process.hrtime.bigint() - started) / 1e6;
  return { value, ms: Math.round(elapsed) };
}

/**
 * Run the benchmark once.
 *
 * The three index-shaped runs are separate on purpose: a single run cannot say
 * which half was slow, and "the index takes 1.4s" is not actionable when the
 * listing is 100ms of it.
 * @param options - the directory, the scope and the budget.
 * @returns the measured result.
 */
export async function runBench({ cwd, scope, budgetMs }) {
  const runner = createGitRunner({ subprocess: createSubprocess(), cwd });
  const reviewScope = scope === "branch" ? { kind: "branch" } : { kind: "worktree" };

  const repo = await repoName(runner, cwd);

  const snapshot = await timed(() => collectSnapshot({ runner, cwd }, reviewScope));
  // The listing phase: the same index run with no content budget, so it lists
  // the tree and reads nothing. This is what `structure_ms` measures.
  const structure = await timed(() =>
    collectIndex({ runner, cwd }, reviewScope, { ...DEFAULT_INDEX_LIMITS, maxFiles: 0 }),
  );
  const index = await timed(() => collectIndex({ runner, cwd }, reviewScope, DEFAULT_INDEX_LIMITS));

  if (!index.value.ok) {
    throw new Error(`index failed: ${index.value.error.code} ${index.value.error.message}`);
  }
  const measured = index.value.index;
  const snapshotOk = snapshot.value.ok ? snapshot.value.snapshot : undefined;

  const result = {
    repo,
    scope,
    files: measured.files.length,
    changedFiles: measured.changed.length,
    parsedFiles: measured.indexed.parsed,
    edges: measured.edges.length,
    unresolved: measured.unresolved.count,
    snapshot_ms: snapshot.ms,
    structure_ms: structure.ms,
    // A residual, not a phase timed on its own: the import extraction happens
    // inside the same pass as the structure read, so the only honest number is
    // the difference between the two runs.
    imports_ms: Math.max(0, index.ms - structure.ms),
    index_ms: index.ms,
    withinBudget: false,
    generatedAt: new Date().toISOString(),
    // Not part of the contract's required fields, but the reason a run was slow
    // is worth carrying: a partial index and a complete one are different facts.
    indexedComplete: measured.indexed.complete,
    indexedNote: measured.indexed.note,
    snapshotFiles: snapshotOk === undefined ? null : snapshotOk.files.length,
  };
  const verdict = evaluateBench(result, budgetMs);
  return { ...result, withinBudget: verdict.withinBudget, exitCode: verdict.exitCode, missing: verdict.missing };
}

/**
 * Parse the command line.
 *
 * Hand-rolled rather than a parser dependency: four flags do not justify one,
 * and the error messages are better when they are written for this script.
 * @param argv - the arguments after the script path.
 * @returns the options, or an error message.
 */
export function parseArgs(argv) {
  const options = { cwd: process.cwd(), scope: "worktree", budgetMs: DEFAULT_BUDGET_MS, json: false, out: undefined };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--json") {
      options.json = true;
      continue;
    }
    if (arg === "--cwd" || arg === "--scope" || arg === "--budget-ms" || arg === "--out") {
      const value = argv[index + 1];
      if (value === undefined || value.startsWith("--")) return { error: `${arg} needs a value` };
      index += 1;
      if (arg === "--cwd") options.cwd = resolve(value);
      else if (arg === "--out") options.out = resolve(value);
      else if (arg === "--scope") {
        if (value !== "worktree" && value !== "branch") return { error: "--scope must be worktree or branch" };
        options.scope = value;
      } else {
        const parsed = Number.parseInt(value, 10);
        if (!Number.isFinite(parsed) || parsed <= 0) return { error: "--budget-ms must be a positive integer" };
        options.budgetMs = parsed;
      }
      continue;
    }
    return { error: `unknown argument ${arg}` };
  }
  return { options };
}

/**
 * The CLI half.
 *
 * Only runs when this file is the entry point, so importing `evaluateBench` from
 * a test does not spawn git.
 * @param argv - the arguments after the script path.
 * @returns the exit code.
 */
async function main(argv) {
  const parsed = parseArgs(argv);
  if (parsed.error !== undefined) {
    process.stderr.write(`bench-index: ${parsed.error}\n`);
    return 2;
  }
  const { options } = parsed;
  let result;
  try {
    result = await runBench(options);
  } catch (error) {
    process.stderr.write(`bench-index: ${String(error instanceof Error ? error.message : error)}\n`);
    return 1;
  }

  const { exitCode, missing, ...payload } = result;
  const line = JSON.stringify(payload);
  if (missing.length > 0) process.stderr.write(`bench-index: result is missing ${missing.join(", ")}\n`);
  if (options.out !== undefined) writeFileSync(options.out, `${line}\n`, "utf8");
  process.stdout.write(`${line}\n`);
  return exitCode;
}

if (process.argv[1] !== undefined && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  process.exitCode = await main(process.argv.slice(2));
}
