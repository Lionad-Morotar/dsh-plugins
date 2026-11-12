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
 *
 * Every project in that config is named after its workspace-relative directory
 * (`packages/dsh-arch`). The name is not decoration: the verbose reporter prints
 * each case's file relative to its own project's root and prefixes the line with
 * the project's name, so a name that also describes where the project sits is
 * what lets the live board rebuild the workspace-relative path the report will
 * use later. See {@link PlannedLivePaths}.
 */
import { access, mkdtemp, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, relative } from "node:path";

import type { RunScope } from "../shared.ts";
import { buildVitestArgv } from "./vitest.ts";

/**
 * How to read a run's live output, path-wise.
 *
 * The verbose reporter reports a file relative to the root of the project it ran
 * in, and names the project on the line when that project has a name. The plan is
 * what generated those names, so it is also the only place that knows how to turn
 * `|name| test/x.test.ts` back into `packages/<name>/test/x.test.ts`.
 */
export interface PlannedLivePaths {
  /** Workspace-relative directory a printed path is relative to, for an unnamed project. */
  readonly root: string;
  /** The generated project names and the workspace-relative directory each prints from. */
  readonly projects: readonly { readonly name: string; readonly directory: string }[];
}

/** One process plan: what to spawn, where, and what to clean up afterwards. */
export interface PlannedRun {
  readonly argv: readonly string[];
  readonly cwd: string;
  /** Files this plan created outside the workspace; removed when the run ends. */
  readonly cleanup?: () => Promise<void>;
  /** Where the live reporter's paths sit in the workspace. */
  readonly livePaths: PlannedLivePaths;
}

/** One package directory the plan can run, with the config it owns. */
export interface ProjectDirectory {
  /** Absolute package directory. */
  readonly directory: string;
  /** Absolute path of the vitest config inside it, when it has one. */
  readonly configFile?: string;
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
 * The vitest config one directory carries, if any.
 *
 * The first name vitest itself would check wins: a directory with both a `.ts`
 * and a `.js` config is a directory where the two tools could disagree, and this
 * planner follows the runner rather than picking its own favourite.
 * @param directory - absolute directory.
 * @returns the absolute config path, or undefined when there is none.
 */
async function configOf(directory: string): Promise<string | undefined> {
  for (const name of CONFIG_NAMES) {
    const candidate = join(directory, name);
    try {
      await access(candidate);
      return candidate;
    } catch {
      continue;
    }
  }
  return undefined;
}

/**
 * The package directories that declare vitest, by name.
 *
 * A package counts when it ships a vitest config or when its own `test` script
 * names vitest; the second case covers packages that rely on vitest's default
 * config. Non-package directories (`node_modules`, dot-dirs, directories without
 * a `package.json`) are ignored.
 *
 * The config file is returned with the directory because the generated projects
 * config has to name it: a project entry that loads the package's own config is
 * the only way to give the project a name of our choosing, and the name is what
 * the live rows are rebuilt from.
 * @param workspace - the canonical workspace root.
 * @returns absolute package directories, sorted, with the config each one owns.
 */
export async function discoverProjects(workspace: string): Promise<ProjectDirectory[]> {
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
  const projects: ProjectDirectory[] = [];
  for (const name of names) {
    const directory = join(packages, name);
    try {
      await access(join(directory, "package.json"));
    } catch {
      continue;
    }
    const configFile = await configOf(directory);
    if (configFile !== undefined) {
      projects.push({ directory, configFile });
      continue;
    }
    try {
      const manifest = JSON.parse(await readFile(join(directory, "package.json"), "utf8")) as {
        readonly scripts?: { readonly test?: unknown };
      };
      const script = manifest.scripts?.test;
      if (typeof script === "string" && script.includes("vitest")) projects.push({ directory });
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
 * The workspace-relative directory a project's files are printed from.
 *
 * Repo-relative with forward slashes on every platform, because that is the
 * vocabulary the board, its routes and its snapshot all speak.
 * @param workspace - the canonical workspace root.
 * @param directory - the project's absolute directory.
 * @returns the relative path, e.g. `packages/dsh-arch`.
 */
function projectDirectoryOf(workspace: string, directory: string): string {
  return relative(workspace, directory).split("\\").join("/");
}

/**
 * Write the temporary root config that turns the packages into one run.
 *
 * A plain object rather than `defineConfig`: the file lives in the system temp
 * directory, where the workspace's `vitest/config` is not resolvable, and a
 * config object needs no import to be valid.
 *
 * Each entry is an inline project rather than a directory string, for one
 * reason: a directory entry takes its name from whatever the package's own
 * config or manifest says, and the board needs to know the name to rebuild the
 * live paths. An inline project that extends the package's config keeps that
 * config (environment, setup files, aliases) while letting the planner name the
 * project after its directory.
 * @param workspace - the canonical workspace root.
 * @param projects - the packages to run.
 * @returns the config path and its directory, for cleanup.
 */
async function writeProjectsConfig(
  workspace: string,
  projects: readonly ProjectDirectory[],
): Promise<{ file: string; directory: string }> {
  const directory = await mkdtemp(join(tmpdir(), "dsh-testboard-plan-"));
  const file = join(directory, "vitest.config.mjs");
  const entries = projects.map(project => ({
    ...(project.configFile === undefined ? {} : { extends: project.configFile }),
    root: project.directory,
    test: { name: projectDirectoryOf(workspace, project.directory) },
  }));
  const body = [
    "export default {",
    `  root: ${JSON.stringify(workspace)},`,
    "  test: {",
    "    projects: [",
    ...entries.map(entry => `      ${JSON.stringify(entry)},`),
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
  const rootConfig = await configOf(workspace);

  if (scope.kind === "file" && rootConfig === undefined) {
    const directory = packageOf(workspace, scope);
    if (directory !== undefined && (await configOf(directory)) !== undefined) {
      // cwd is the package so vitest picks its config up itself. The reporter is
      // back to printing paths relative to the package, so the live paths say
      // where that root sits in the workspace.
      return {
        argv: [binary, "run", scope.path, "--reporter=verbose", "--reporter=json", "--outputFile", outputFile],
        cwd: directory,
        livePaths: { root: projectDirectoryOf(workspace, directory), projects: [] },
      };
    }
  }

  if (scope.kind === "all" && rootConfig === undefined) {
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
        livePaths: {
          root: "",
          projects: projects.map(project => {
            const directory = projectDirectoryOf(workspace, project.directory);
            return { name: directory, directory };
          }),
        },
      };
    }
  }

  // One config at the workspace root: the reporter already prints paths relative
  // to the workspace, which is the board's own vocabulary.
  return { argv: buildVitestArgv({ workspace, scope, outputFile }), cwd: workspace, livePaths: { root: "", projects: [] } };
}
