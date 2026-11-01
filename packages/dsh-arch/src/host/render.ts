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
}): WireModelResponse {
  return {
    workspace: input.workspace,
    projectId: input.projectId,
    elements: input.model.elements ?? {},
    relations: input.model.relations ?? {},
    specification: input.model.specification ?? null,
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
