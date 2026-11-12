/**
 * Types for `bench-index.mjs`.
 *
 * The script is plain ESM so it runs on bare Node with no build step, which
 * means TypeScript has no declarations for it. This file is those declarations:
 * it covers the pure surface a test imports — the verdict, the field list, the
 * argument parser — and deliberately says nothing about the CLI half, which no
 * caller imports.
 */

/** One benchmark run's measurements. */
export interface BenchResult {
  readonly repo: string;
  readonly scope: "worktree" | "branch";
  readonly files: number;
  readonly changedFiles: number;
  readonly parsedFiles: number;
  readonly edges: number;
  readonly unresolved: number;
  readonly snapshot_ms: number;
  readonly structure_ms: number;
  readonly imports_ms: number;
  readonly index_ms: number;
  readonly withinBudget: boolean;
  readonly generatedAt: string;
  readonly indexedComplete?: boolean;
  readonly indexedNote?: string | null;
  readonly snapshotFiles?: number | null;
}

/** What the verdict says about one result. */
export interface BenchVerdict {
  /** Contract fields the result did not carry. */
  readonly missing: readonly string[];
  readonly withinBudget: boolean;
  /** 0 when the run is within budget and complete, 1 otherwise. */
  readonly exitCode: 0 | 1;
}

/** The parsed command line. */
export interface BenchOptions {
  readonly cwd: string;
  readonly scope: "worktree" | "branch";
  readonly budgetMs: number;
  readonly json: boolean;
  readonly out?: string;
}

/** The field list the contract requires. */
export const BENCH_FIELDS: readonly string[];

/** The default ceiling for one index run, in milliseconds. */
export const DEFAULT_BUDGET_MS: number;

/**
 * Decide whether a result is within budget.
 * @param result - the measured result.
 * @param budgetMs - the ceiling for `index_ms`; the boundary is inclusive.
 * @returns the verdict and the process exit code.
 */
export function evaluateBench(result: Record<string, unknown>, budgetMs: number): BenchVerdict;

/**
 * Parse the command line.
 * @param argv - the arguments after the script path.
 * @returns the options, or an error message.
 */
export function parseArgs(argv: readonly string[]): { options?: BenchOptions; error?: string };

/**
 * Run the benchmark once.
 * @param options - the directory, the scope and the budget.
 * @returns the measured result with its verdict.
 */
export function runBench(options: {
  readonly cwd: string;
  readonly scope: "worktree" | "branch";
  readonly budgetMs: number;
}): Promise<BenchResult & BenchVerdict>;
