/**
 * How one run is turned into a process.
 *
 * A single-package workspace has one vitest config at its root, so running the
 * binary there is the honest thing. A pnpm monorepo does not: its root has no
 * vitest config, and a bare `vitest run` at the root walks into every directory
 * it can see, including `.claude/worktrees` copies and reference checkouts, each
 * with its own environment. That is not the repository's suite, and on a big
 * monorepo it does not finish.
 *
 * The monorepo case therefore runs the same binary with a generated root config
 * whose `projects` are the packages that actually declare vitest. Vitest then
 * runs each package under its own config and writes one combined JSON report,
 * which is exactly the shape the rest of the host already parses.
 */
import { access, mkdtemp, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

import type { RunScope } from "../shared.ts";
import { buildVitestArgv } from "./vitest.ts";

/** One process plan: what to spawn, where, and what to clean up afterwards. */
export interface PlannedRun {
  readonly argv: readonly string[];
  readonly cwd: string;
  /** Files this plan created outside the workspace; removed when the run ends. */
  readonly cleanup?: () => Promise<void>;
}

/** What the planner is told about one run. */
export interface PlanInput {
  /** The canonical workspace root. */
  readonly workspace: string;
  readonly scope: RunScope;
  /** The temp report path the child must write. */
  readonly outputFile: string;
}

/** Config file names vitest reads from a directory, in the order it checks them. */
const CONFIG_NAMES = ["vitest.config.ts", "vitest.config.mts", "vitest.config.js", "vitest.config.mjs", "vitest.config.cts", "vitest.config.cjs"] as const;

/**
 * Whether one directory carries a vitest config.
 * @param directory - absolute directory.
 * @returns true when a config file exists.
 */
async function hasConfig(directory: string): Promise<boolean> {
  for (const name of CONFIG_NAMES) {
    try {
      await access(join(directory, name));
      return true;
    } catch {
      continue;
    }
  }
  return false;
}

/**
 * The package directories that declare vitest, newest layout first.
 *
 * A package counts when it ships a vitest config or when its own `test` script
 * names vitest; the second case covers packages that rely on vitest's default
 * config. Non-package directories (`node_modules`, dot-dirs, directories without
 * a `package.json`) are ignored.
 * @param workspace - the canonical workspace root.
 * @returns absolute package directories, sorted.
 */
export async function discoverProjects(workspace: string): Promise<string[]> {
  const packages = join(workspace, "packages");
  let names: string[];
  try {
    names = (await readdir(packages, { withFileTypes: true }))
      .filter(entry => entry.isDirectory() && !entry.name.startsWith(".") && entry.name !== "node_modules")
      .map(entry => entry.name);
  } catch {
    return [];
  }
  names.sort();
  const projects: string[] = [];
  for (const name of names) {
    const directory = join(packages, name);
    try {
      await access(join(directory, "package.json"));
    } catch {
      continue;
    }
    if (await hasConfig(directory)) {
      projects.push(directory);
      continue;
    }
    try {
      const manifest = JSON.parse(await readFile(join(directory, "package.json"), "utf8")) as {
        readonly scripts?: { readonly test?: unknown };
      };
      const script = manifest.scripts?.test;
      if (typeof script === "string" && script.includes("vitest")) projects.push(directory);
    } catch {
      continue;
    }
  }
  return projects;
}

/**
 * The package that owns one test file, when the workspace is a monorepo.
 *
 * Only direct `packages/<name>/` paths are considered: the board groups rows by
 * that shape, and a deeper nesting would mean a layout this planner does not
 * know how to run.
 * @param scope - the run scope.
 * @returns the package directory, or undefined for the root group.
 */
function packageOf(workspace: string, scope: RunScope): string | undefined {
  if (scope.kind !== "file") return undefined;
  const match = /^packages\/([^/]+)\//u.exec(scope.path);
  return match?.[1] === undefined ? undefined : join(workspace, "packages", match[1]);
}

/**
 * Write the temporary root config that turns the packages into one run.
 *
 * A plain object rather than `defineConfig`: the file lives in the system temp
 * directory, where the workspace's `vitest/config` is not resolvable, and a
 * config object needs no import to be valid.
 * @param workspace - the canonical workspace root.
 * @param projects - absolute package directories.
 * @returns the config path and its directory, for cleanup.
 */
async function writeProjectsConfig(workspace: string, projects: readonly string[]): Promise<{ file: string; directory: string }> {
  const directory = await mkdtemp(join(tmpdir(), "dsh-testboard-plan-"));
  const file = join(directory, "vitest.config.mjs");
  const body = [
    "export default {",
    `  root: ${JSON.stringify(workspace)},`,
    "  test: {",
    "    projects: [",
    ...projects.map(project => `      ${JSON.stringify(project)},`),
    "    ],",
    "  },",
    "};",
    "",
  ].join("\n");
  await writeFile(file, body, "utf8");
  return { file, directory };
}

/**
 * Plan one run.
 *
 * Order matters: a file scope inside a monorepo package runs that package's own
 * config, because the file's imports and environment belong to the package. A
 * monorepo-wide scope runs every declaring package through the generated config.
 * Anything else falls back to the single-workspace command.
 * @param input - the workspace, scope and report path.
 * @returns the process to spawn.
 */
export async function planVitestRun(input: PlanInput): Promise<PlannedRun> {
  const { workspace, scope, outputFile } = input;
  const binary = join(workspace, "node_modules", ".bin", "vitest");
  const rootConfig = await hasConfig(workspace);

  if (scope.kind === "file" && !rootConfig) {
    const directory = packageOf(workspace, scope);
    if (directory !== undefined && (await hasConfig(directory))) {
      // cwd is the package so vitest picks its config up itself; the positional
      // filter stays in workspace vocabulary, which is what the reporter will
      // print, so the row still groups under the right package.
      return {
        argv: [binary, "run", scope.path, "--reporter=verbose", "--reporter=json", "--outputFile", outputFile],
        cwd: directory,
      };
    }
  }

  if (scope.kind === "all" && !rootConfig) {
    const projects = await discoverProjects(workspace);
    if (projects.length > 0) {
      const generated = await writeProjectsConfig(workspace, projects);
      return {
        argv: [
          binary,
          "run",
          "--config",
          generated.file,
          "--reporter=verbose",
          "--reporter=json",
          "--outputFile",
          outputFile,
        ],
        cwd: workspace,
        cleanup: async () => {
          await rm(generated.directory, { recursive: true, force: true });
        },
      };
    }
  }

  return { argv: buildVitestArgv({ workspace, scope, outputFile }), cwd: workspace };
}
