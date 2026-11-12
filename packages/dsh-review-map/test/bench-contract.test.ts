/**
 * The benchmark's verdict logic, as arithmetic.
 *
 * `evaluateBench` is the only part of the benchmark that decides anything, and
 * it decides the one thing a CI gate depends on: whether a run is within budget.
 * Testing it here rather than through the CLI keeps the boundary case honest —
 * "exactly at the budget" is the case a naive `<` gets wrong, and it is the case
 * a person will argue about when their run lands on 12000ms.
 *
 * Nothing here spawns git or touches a repository: the script's CLI half is
 * guarded behind an entry-point check, so importing it is free.
 */
import { describe, expect, it } from "vitest";

import { BENCH_FIELDS, DEFAULT_BUDGET_MS, evaluateBench, parseArgs } from "../scripts/bench-index.mjs";

/** A complete result at the given index time. */
function result(indexMs: number): Record<string, unknown> {
  return {
    repo: "dsh-plugins",
    scope: "worktree",
    files: 1342,
    changedFiles: 1,
    parsedFiles: 1115,
    edges: 1793,
    unresolved: 1518,
    snapshot_ms: 71,
    structure_ms: 71,
    imports_ms: 1126,
    index_ms: indexMs,
    withinBudget: true,
    generatedAt: "2026-11-12T00:00:00.000Z",
  };
}

describe("the benchmark result contract", () => {
  it("names every field the contract requires", () => {
    // The list is the contract; a field added to the script but not here would
    // be a number nobody asserts on.
    expect(BENCH_FIELDS).toEqual([
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
    ]);
  });

  it("reports a complete result as having nothing missing", () => {
    const verdict = evaluateBench(result(1000), DEFAULT_BUDGET_MS);

    expect(verdict.missing).toEqual([]);
    expect(verdict.withinBudget).toBe(true);
    expect(verdict.exitCode).toBe(0);
  });

  it("names the fields a result is missing", () => {
    const partial = result(1000);
    delete partial.edges;
    delete partial.generatedAt;

    const verdict = evaluateBench(partial, DEFAULT_BUDGET_MS);

    expect(verdict.missing).toEqual(["edges", "generatedAt"]);
    // A result with a hole in it cannot be trusted to pass.
    expect(verdict.exitCode).toBe(1);
  });
});

describe("the budget verdict", () => {
  it("passes a run under the budget", () => {
    expect(evaluateBench(result(1199), 1200).withinBudget).toBe(true);
  });

  it("fails a run over the budget", () => {
    const verdict = evaluateBench(result(1201), 1200);

    expect(verdict.withinBudget).toBe(false);
    expect(verdict.exitCode).toBe(1);
  });

  it("passes a run that lands exactly on the budget", () => {
    // The boundary is inclusive: a run that takes exactly the budget has not
    // exceeded it, which is what a person reading "budget" expects.
    expect(evaluateBench(result(1200), 1200).withinBudget).toBe(true);
    expect(evaluateBench(result(1200), 1200).exitCode).toBe(0);
  });

  it("fails a run whose index time is not a number", () => {
    const broken = { ...result(0), index_ms: "slow" };

    expect(evaluateBench(broken, 1200).withinBudget).toBe(false);
    expect(evaluateBench(broken, 1200).exitCode).toBe(1);
  });

  it("treats a zero budget as a real ceiling", () => {
    // Nothing can be faster than zero, so this fails — but it must fail through
    // the comparison rather than by accident.
    expect(evaluateBench(result(0), 0).withinBudget).toBe(true);
    expect(evaluateBench(result(1), 0).withinBudget).toBe(false);
  });
});

describe("the command line", () => {
  it("defaults to the current directory, a worktree review and twelve seconds", () => {
    const parsed = parseArgs([]);

    expect(parsed.error).toBeUndefined();
    expect(parsed.options?.scope).toBe("worktree");
    expect(parsed.options?.budgetMs).toBe(DEFAULT_BUDGET_MS);
    expect(parsed.options?.json).toBe(false);
  });

  it("reads every flag it documents", () => {
    const parsed = parseArgs(["--json", "--cwd", "/tmp", "--scope", "branch", "--budget-ms", "500", "--out", "/tmp/r.json"]);

    expect(parsed.error).toBeUndefined();
    expect(parsed.options?.json).toBe(true);
    expect(parsed.options?.cwd).toBe("/tmp");
    expect(parsed.options?.scope).toBe("branch");
    expect(parsed.options?.budgetMs).toBe(500);
    expect(parsed.options?.out).toBe("/tmp/r.json");
  });

  it("rejects an unknown scope", () => {
    expect(parseArgs(["--scope", "everything"]).error).toContain("worktree or branch");
  });

  it("rejects a budget that is not a positive integer", () => {
    expect(parseArgs(["--budget-ms", "0"]).error).toContain("positive integer");
    expect(parseArgs(["--budget-ms", "abc"]).error).toContain("positive integer");
  });

  it("rejects a flag with no value", () => {
    expect(parseArgs(["--cwd"]).error).toContain("needs a value");
    expect(parseArgs(["--cwd", "--json"]).error).toContain("needs a value");
  });

  it("rejects an unknown argument", () => {
    expect(parseArgs(["--nonsense"]).error).toContain("unknown argument");
  });
});
