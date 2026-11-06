/**
 * In-process LikeC4 rendering: workspace directory → layouted views → wire.
 *
 * The heavy import stays behind `loadLanguageServices()` on purpose: a cold
 * `@likec4/language-services/node` import costs ~232ms and +78MB RSS, and the
 * product property "no Arch tab open, zero cost" forbids paying either at
 * plugin activation.
 *
 * Instances run with `watch: true` so model edits reach an already-booted
 * workspace. A watcher fresh out of boot first performs a baseline pass and
 * swallows changes issued during it (verified twice in the research: nothing
 * happens for 2.5s; waiting ~1.2s makes the same change visible in 69ms), so
 * cache-hit renders are withheld until the baseline window below has passed —
 * otherwise a save right after opening the panel would serve the stale view
 * as if it were ready.
 */
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { join, relative, sep } from "node:path";

import type { WireDiagnostic, WireModelResponse, WireViewsResponse } from "../shared.ts";

/** The node entry of `@likec4/language-services`, lazily imported. */
export type LikeC4Module = typeof import("@likec4/language-services/node");

export type LikeC4Instance = Awaited<ReturnType<LikeC4Module["fromWorkspace"]>>;

/**
 * How long after instance boot a cache-hit render waits before trusting
 * `diagrams()`. Measured as the point where the watcher stops swallowing
 * changes (see the file header); not a timeout to tune, a trap to respect.
 */
export const WATCH_BASELINE_WINDOW_MS = 1200;

const delay = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms));

let languageServices: LikeC4Module | undefined;

/** First call pays the import; every later caller shares the module. */
export async function loadLanguageServices(): Promise<LikeC4Module> {
  languageServices ??= await import("@likec4/language-services/node");
  return languageServices;
}

/** Everything the wire routes need from one rendered workspace. */
export interface RenderedWorkspace {
  readonly projectId: string;
  readonly views: readonly unknown[];
  readonly hasErrors: boolean;
  readonly errors: readonly WireDiagnostic[];
  readonly instance: LikeC4Instance;
}

/**
 * Render one C4 project directory in-process.
 *
 * `projects()` is resolved before `diagrams()`: calling `diagrams()` without a
 * project id throws `Specify exact project` whenever the directory tree holds
 * more than one config — this repository's own root is such a tree.
 */
export async function renderWorkspace(dir: string): Promise<RenderedWorkspace> {
  const { fromWorkspace } = await loadLanguageServices();
  const instance = await fromWorkspace(dir, { graphviz: "wasm", watch: true, printErrors: false });
  const projects = instance.projects();
  const projectId = projects[0];
  if (projectId === undefined) throw new Error(`likec4 workspace ${dir} has no project`);
  const views = await instance.diagrams(projectId);
  const errors = instance.hasErrors() ? instance.getErrors() : [];
  return {
    projectId,
    views,
    hasErrors: instance.hasErrors(),
    errors: errors.map(error => ({ message: error.message, sourcePath: error.sourceFsPath })),
    instance,
  };
}

/** Shape the layouted views of one workspace for `GET /arch/api/views`. */
export function toViewsPayload(input: {
  readonly workspace: string;
  readonly projectId: string;
  readonly views: readonly unknown[];
  readonly hasErrors: boolean;
  readonly errors: readonly WireDiagnostic[];
}): WireViewsResponse {
  return {
    workspace: input.workspace,
    projectId: input.projectId,
    // Views pass through untouched: the layout is authoritative from the host
    // and the client renderer must not re-derive (or truncate) any of it.
    views: [...input.views],
    hasErrors: input.hasErrors,
    errors: [...input.errors],
  };
}

/** Shape the element catalogue for `GET /arch/api/model`. */
export function toModelPayload(input: {
  readonly workspace: string;
  readonly projectId: string;
  readonly model: {
    readonly elements?: Record<string, unknown>;
    readonly relations?: Record<string, unknown>;
    readonly specification?: unknown;
  };
  /** Where each element is defined in the `.c4` sources; absent when unread. */
  readonly elementSources?: Readonly<Record<string, ElementSource>>;
  /** The code file each element maps to; absent when the walk did not run. */
  readonly elementCode?: Readonly<Record<string, ElementCode>>;
}): WireModelResponse {
  return {
    workspace: input.workspace,
    projectId: input.projectId,
    elements: input.model.elements ?? {},
    relations: input.model.relations ?? {},
    specification: input.model.specification ?? null,
    // Both maps are optional on the wire: a host that cannot read the sources
    // omits them rather than sending empty objects, so the client can tell
    // "not reported" from "reported and empty".
    ...(input.elementSources === undefined ? {} : { elementSources: input.elementSources }),
    ...(input.elementCode === undefined ? {} : { elementCode: input.elementCode }),
  };
}

interface CacheEntry {
  readonly dir: string;
  readonly instance: LikeC4Instance;
  readonly bootAt: number;
  at: number;
}

/** Boots one workspace directory; injected so the baseline window is testable. */
export type WorkspaceBoot = (dir: string) => Promise<RenderedWorkspace>;

export interface WorkspaceRenderer {
  /** Render `dir`, reusing a live instance when one is cached. */
  get(dir: string): Promise<RenderedWorkspace>;
  /** Release every cached instance (module-level state stays; see below). */
  dispose(): Promise<void>;
}

/**
 * Instance cache, bounded per the research: each additional workspace costs
 * ~30–65MB RSS and `dispose()` never returns it (module-level state stays in
 * the process), so an unbounded map is a slow leak. LRU beyond `maxWorkspaces`.
 */
export function createRenderer(maxWorkspaces = 3, boot: WorkspaceBoot = renderWorkspace): WorkspaceRenderer {
  const cache = new Map<string, CacheEntry>();
  return {
    async get(dir: string) {
      const hit = cache.get(dir);
      if (hit !== undefined) {
        hit.at = Date.now();
        return await renderFromInstance(dir, hit);
      }
      const rendered = await boot(dir);
      const now = Date.now();
      cache.set(dir, { dir, instance: rendered.instance, bootAt: now, at: now });
      while (cache.size > maxWorkspaces) {
        const oldest = [...cache.values()].sort((a, b) => a.at - b.at)[0];
        if (oldest === undefined) break;
        cache.delete(oldest.dir);
        await oldest.instance.dispose().catch(() => {});
      }
      return rendered;
    },
    async dispose() {
      const entries = [...cache.values()];
      cache.clear();
      await Promise.all(entries.map(entry => entry.instance.dispose().catch(() => {})));
    },
  };
}

/**
 * Re-derive the wire inputs from a cached instance without re-booting it.
 *
 * Inside the watch baseline window the wait comes first: `diagrams()` there
 * may still reflect the pre-change model, and the whole point of a re-render
 * is to serve what changed.
 */
async function renderFromInstance(dir: string, entry: CacheEntry): Promise<RenderedWorkspace> {
  const remaining = entry.bootAt + WATCH_BASELINE_WINDOW_MS - Date.now();
  if (remaining > 0) await delay(remaining);
  const projects = entry.instance.projects();
  const projectId = projects[0];
  if (projectId === undefined) throw new Error(`likec4 workspace ${dir} has no project`);
  const views = await entry.instance.diagrams(projectId);
  return {
    projectId,
    views,
    hasErrors: entry.instance.hasErrors(),
    errors: entry.instance.hasErrors()
      ? entry.instance.getErrors().map(error => ({ message: error.message, sourcePath: error.sourceFsPath }))
      : [],
    instance: entry.instance,
  };
}

/** Where one element is defined in the model sources. */
export interface ElementSource {
  /** Workspace-relative path of the `.c4` file, `/`-separated. */
  readonly file: string;
  /** 1-based line of the element's declaration. */
  readonly line: number;
}

/** The code file one element maps to. */
export interface ElementCode {
  /** Workspace-relative path, `/`-separated. */
  readonly file: string;
}

/** The AST slice the source collector walks; the rest of the node is noise. */
interface AstElement {
  readonly name?: string;
  readonly body?: { readonly elements?: readonly AstElement[] };
  /**
   * The element an `ExtendElement` reopens. Its children are declared inside
   * the extend block but belong to the target's id, so the walk has to continue
   * under the target rather than under the block.
   */
  readonly element?: { readonly el?: { readonly $refText?: string } };
  readonly $cstNode?: { readonly range?: { readonly start?: { readonly line?: number } } };
}

/** The parse result of one Langium document, narrowed to what is walked. */
interface AstDocument {
  readonly uri: { toString(): string };
  readonly parseResult?: {
    readonly value?: { readonly models?: readonly { readonly elements?: readonly AstElement[] }[] };
  };
}

/**
 * Collect the definition site of every element the model knows.
 *
 * The AST and the computed model disagree in both directions: the AST carries
 * anonymous nodes (references, specification entries) and the model carries
 * ids that only exist after resolution. Intersecting with `knownIds` is what
 * keeps the map to elements a reader can actually select.
 *
 * `likec4builtin:` documents are skipped: the bundled icon library parses as a
 * `.c4` file and would otherwise contribute ids that are not in this
 * workspace, and a `file:` check is also what keeps `fileURLToPath` honest.
 * @param instance - the booted workspace.
 * @param workspaceDir - absolute workspace root the paths are made relative to.
 * @param knownIds - ids present in the computed model.
 * @returns one entry per resolvable element; unresolvable ones are absent.
 */
export function collectElementSources(
  instance: LikeC4Instance,
  workspaceDir: string,
  knownIds: ReadonlySet<string>,
): Record<string, ElementSource> {
  const sources: Record<string, ElementSource> = {};
  const documents = (instance as unknown as { LangiumDocuments?: { all?: Iterable<AstDocument> } })
    .LangiumDocuments;
  if (documents?.all === undefined) return sources;
  for (const doc of documents.all) {
    const uri = doc.uri.toString();
    if (!uri.startsWith("file:") || !uri.endsWith(".c4")) continue;
    let file: string;
    try {
      file = relative(workspaceDir, fileURLToPath(uri)).split(sep).join("/");
    } catch {
      // A URI that is not a filesystem path is not a source this map can name.
      continue;
    }
    for (const model of doc.parseResult?.value?.models ?? []) {
      walkAstElements(model.elements, "", file, knownIds, sources);
    }
  }
  return sources;
}

/**
 * Walk one model's element tree, recording each known element's line.
 *
 * The first definition wins: a model that declares the same id twice (legal
 * while editing) should point at the one a reader would find first.
 */
function walkAstElements(
  elements: readonly AstElement[] | undefined,
  parent: string,
  file: string,
  knownIds: ReadonlySet<string>,
  into: Record<string, ElementSource>,
): void {
  for (const element of elements ?? []) {
    const name = element.name;
    if (name === undefined || name === "") {
      // An `ExtendElement` reopens an existing element: its children belong to
      // that element's id, so the walk continues under the target. Any other
      // anonymous node still nests real children, so the walk continues under
      // the current parent without inventing an id for this level.
      const target = element.element?.el?.$refText;
      walkAstElements(element.body?.elements, target ?? parent, file, knownIds, into);
      continue;
    }
    const fqn = parent === "" ? name : `${parent}.${name}`;
    const line = element.$cstNode?.range?.start?.line;
    if (line !== undefined && knownIds.has(fqn) && into[fqn] === undefined) {
      into[fqn] = { file, line: line + 1 };
    }
    walkAstElements(element.body?.elements, fqn, file, knownIds, into);
  }
}

/** One package directory the code resolver can attribute a file to. */
interface PackageDir {
  /** Package name from `package.json`, when it declares one. */
  readonly name?: string;
  /** Directory name, e.g. `dsh-jump`. */
  readonly dirName: string;
  /** Workspace-relative directory, `/`-separated. */
  readonly dir: string;
}

/** Suffixes tried for a title that names a file. */
const CODE_SUFFIXES = [".ts", ".tsx", ".js", ".mjs", ".css"] as const;

/**
 * Map elements onto the code files their titles name.
 *
 * This repository's C4 model uses an element's `title` as a path inside its
 * package (`title "client/app"` on a component of the `dsh-jump` package), and
 * the package is named by an ancestor's title. That is a convention of the
 * model, not a LikeC4 capability, so every step here is a heuristic allowed to
 * find nothing: a miss costs the reference its `code` segment, never its
 * existence.
 *
 * No line number is reported: the title names a file, and there is no symbol
 * in it to resolve one against.
 * @param workspaceDir - absolute workspace root.
 * @param elements - the model's element record, keyed by id.
 * @returns one entry per element whose code file was found on disk.
 */
export function resolveElementCode(
  workspaceDir: string,
  elements: Readonly<Record<string, { title?: unknown }>>,
): Record<string, ElementCode> {
  const code: Record<string, ElementCode> = {};
  const packages = readPackageDirs(workspaceDir);
  if (packages.length === 0) return code;
  const byName = new Map<string, PackageDir>();
  const byDirName = new Map<string, PackageDir>();
  for (const pkg of packages) {
    if (pkg.name !== undefined && !byName.has(pkg.name)) byName.set(pkg.name, pkg);
    if (!byDirName.has(pkg.dirName)) byDirName.set(pkg.dirName, pkg);
  }
  for (const [id, element] of Object.entries(elements)) {
    const title = typeof element.title === "string" ? element.title.trim() : "";
    if (title === "") continue;
    const pkg = packageFor(id, elements, byName, byDirName);
    if (pkg === undefined) continue;
    const file = codeFileFor(workspaceDir, pkg, title);
    if (file !== undefined) code[id] = { file };
  }
  return code;
}

/**
 * Find the package an element belongs to, by the deepest ancestor whose title
 * names one.
 *
 * Deepest, not nearest-to-root: a nested component may sit inside a container
 * whose title is a path fragment, and the more specific ancestor is the one
 * that actually names the package.
 */
function packageFor(
  id: string,
  elements: Readonly<Record<string, { title?: unknown }>>,
  byName: ReadonlyMap<string, PackageDir>,
  byDirName: ReadonlyMap<string, PackageDir>,
): PackageDir | undefined {
  const segments = id.split(".");
  for (let cut = segments.length - 1; cut > 0; cut -= 1) {
    const ancestor = elements[segments.slice(0, cut).join(".")];
    const title = typeof ancestor?.title === "string" ? ancestor.title.trim() : "";
    if (title === "") continue;
    const named = byName.get(title) ?? byDirName.get(title);
    if (named !== undefined) return named;
  }
  return undefined;
}

/**
 * Resolve one title to a file inside its package.
 *
 * Titles that name more than one thing (`client/bindings + client/recorder`)
 * are skipped rather than guessed at: picking one half would attribute the
 * element to a file that only implements part of it.
 */
function codeFileFor(workspaceDir: string, pkg: PackageDir, title: string): string | undefined {
  const clean = title.replace(/^\/+/u, "").replace(/\/+$/u, "");
  if (clean === "" || clean.includes(" ") || clean.includes("+")) return undefined;
  const bases = [`src/${clean}`, `src/client/${clean}`, clean];
  for (const base of bases) {
    for (const suffix of CODE_SUFFIXES) {
      if (existsSync(join(workspaceDir, pkg.dir, `${base}${suffix}`))) return `${pkg.dir}/${base}${suffix}`;
    }
    for (const indexSuffix of [".ts", ".tsx"] as const) {
      if (existsSync(join(workspaceDir, pkg.dir, base, `index${indexSuffix}`))) {
        return `${pkg.dir}/${base}/index${indexSuffix}`;
      }
    }
  }
  return undefined;
}

/**
 * Read the workspace's packages, tolerating every failure.
 *
 * A workspace without `packages/` is the normal case for most models; a
 * package with an unreadable manifest is skipped rather than aborting the walk,
 * because one broken package should not cost every other element its code path.
 */
function readPackageDirs(workspaceDir: string): PackageDir[] {
  const root = join(workspaceDir, "packages");
  let names: string[];
  try {
    names = readdirSync(root);
  } catch {
    return [];
  }
  const found: PackageDir[] = [];
  for (const dirName of names) {
    let manifest: unknown;
    try {
      manifest = JSON.parse(readFileSync(join(root, dirName, "package.json"), "utf8"));
    } catch {
      continue;
    }
    const name = (manifest as { name?: unknown } | null)?.name;
    found.push({
      ...(typeof name === "string" && name !== "" ? { name } : {}),
      dirName,
      dir: `packages/${dirName}`,
    });
  }
  return found;
}
