/**
 * How a run becomes a process.
 *
 * The monorepo branch exists because a bare `vitest run` at a pnpm workspace
 * root walks into worktree copies and reference checkouts instead of running
 * the repository's own suite. The tests pin the three shapes: single-workspace,
 * monorepo-wide (one generated projects config) and one file inside a package.
 */
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { discoverProjects, planVitestRun } from "../src/host/run-plan.ts";

let workspace: string;

beforeEach(async () => {
  workspace = await mkdtemp(join(tmpdir(), "dsh-testboard-plan-"));
  await mkdir(join(workspace, "node_modules", ".bin"), { recursive: true });
  await writeFile(join(workspace, "node_modules", ".bin", "vitest"), "", "utf8");
});

afterEach(async () => {
  await rm(workspace, { recursive: true, force: true });
});

/**
 * Create one package directory with a manifest and, optionally, a vitest config.
 * @param name - package name under `packages/`.
 * @param options - whether to give it a config file and a vitest test script.
 */
async function packageDir(name: string, options: { config?: boolean; script?: string } = {}): Promise<string> {
  const directory = join(workspace, "packages", name);
  await mkdir(directory, { recursive: true });
  await writeFile(
    join(directory, "package.json"),
    JSON.stringify({ name, scripts: { test: options.script ?? "vitest run" } }),
    "utf8",
  );
  if (options.config !== false) await writeFile(join(directory, "vitest.config.ts"), "export default {}", "utf8");
  return directory;
}

const OUTPUT = "/tmp/dsh-testboard-report.json";

describe("discoverProjects", () => {
  it("takes packages with a config and packages whose test script names vitest", async () => {
    await packageDir("alpha");
    await packageDir("beta", { config: false, script: "vitest run" });
    await packageDir("gamma", { config: false, script: "node test/run.mjs" });
    await writeFile(join(workspace, "packages", "not-a-package"), "", "utf8");

    const projects = await discoverProjects(workspace);

    expect(projects.map(path => path.split("/").at(-1))).toEqual(["alpha", "beta"]);
  });

  it("answers nothing when the workspace has no packages directory", async () => {
    expect(await discoverProjects(workspace)).toEqual([]);
  });
});

describe("planVitestRun", () => {
  it("keeps a single-package workspace on one root invocation", async () => {
    await writeFile(join(workspace, "vitest.config.ts"), "export default {}", "utf8");

    const plan = await planVitestRun({ workspace, scope: { kind: "all" }, outputFile: OUTPUT });

    expect(plan.cwd).toBe(workspace);
    expect(plan.argv.join(" ")).toContain("--reporter=json");
    expect(plan.argv.join(" ")).not.toContain("--config");
    expect(plan.cleanup).toBeUndefined();
  });

  it("gives a monorepo one generated projects config instead of a bare root run", async () => {
    await packageDir("alpha");
    await packageDir("beta", { config: false, script: "vitest run" });

    const plan = await planVitestRun({ workspace, scope: { kind: "all" }, outputFile: OUTPUT });

    const configIndex = plan.argv.indexOf("--config");
    expect(configIndex).toBeGreaterThan(-1);
    const configPath = plan.argv[configIndex + 1] ?? "";
    const body = await readFile(configPath, "utf8");
    expect(body).toContain(JSON.stringify(join(workspace, "packages", "alpha")));
    expect(body).toContain(JSON.stringify(join(workspace, "packages", "beta")));
    expect(body).toContain(JSON.stringify(workspace));
    expect(plan.cwd).toBe(workspace);
    // The generated file lives in the system temp dir, so the plan owns removing
    // it; a leaked config per run is the alternative.
    await plan.cleanup?.();
    await expect(readFile(configPath, "utf8")).rejects.toThrow();
  });

  it("runs one package's file under that package's own config", async () => {
    await packageDir("alpha");

    const plan = await planVitestRun({
      workspace,
      scope: { kind: "file", path: "packages/alpha/test/one.test.ts" },
      outputFile: OUTPUT,
    });

    expect(plan.cwd).toBe(join(workspace, "packages", "alpha"));
    expect(plan.argv).toContain("packages/alpha/test/one.test.ts");
    expect(plan.argv.join(" ")).not.toContain("--config");
  });

  it("falls back to the root invocation for a file outside a package", async () => {
    await packageDir("alpha");

    const plan = await planVitestRun({ workspace, scope: { kind: "file", path: "test/root.test.ts" }, outputFile: OUTPUT });

    expect(plan.cwd).toBe(workspace);
    expect(plan.argv).toContain("test/root.test.ts");
  });

  it("falls back to the root invocation when the workspace only has projects but the file owns no config", async () => {
    await packageDir("alpha", { config: false, script: "vitest run" });

    const plan = await planVitestRun({
      workspace,
      scope: { kind: "file", path: "packages/alpha/test/one.test.ts" },
      outputFile: OUTPUT,
    });

    expect(plan.cwd).toBe(workspace);
  });
});
