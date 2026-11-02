/**
 * The renderer registry: which component draws a file's body.
 *
 * The selection used to be a chain of conditions inside the preview pane. A
 * package outside this one cannot extend a condition chain, so the decision
 * becomes data instead: a contribution declares the suffixes or families it
 * claims plus a lazy `load()`, and resolution is a synchronous pure match over
 * that metadata. That is what lets the pane answer "who draws this file" before
 * anyone downloads an engine.
 *
 * Two rules keep the answer stable regardless of registration order:
 * - a larger `priority` wins, and a tie breaks on the id's lexicographic order;
 * - a contribution that declares neither dimension is the catch-all, so the
 *   shipped source viewer can claim everything the catalogue does not.
 *
 * The registry never calls `load()` itself: {@link loadRenderer} is the single
 * place that turns a winner into a module, which is what guarantees a losing
 * contribution is never fetched.
 */
import type { ComponentType } from "react";

import type { Translate } from "./copy.ts";
import { familyOf } from "./preview.ts";
import type { WorkspaceFilesFace } from "./wire.ts";

/** The two body modes a renderer answers for. */
export type RendererMode = "reading" | "source";

/**
 * The text page the pane already holds.
 *
 * The pane pages text once and hands the page to whichever renderer draws it,
 * so a renderer does not have to re-read what the reader is looking at. A
 * renderer that needs the whole document reads it through `files` instead.
 */
export interface RendererPage {
  readonly text: string;
  /** First line of the page, 1-based. */
  readonly offset: number;
}

/** What one renderer's body is handed. */
export interface RendererBodyProps {
  readonly path: string;
  readonly sessionId?: string;
  /** The file face, for renderers that read the file themselves. */
  readonly files?: WorkspaceFilesFace;
  readonly t: Translate;
  /**
   * Whether this panel is the active one.
   *
   * The workbench keeps every open panel mounted and hides the inactive ones,
   * so a renderer cannot tell from its own box that nobody is looking at it.
   * Absent means visible.
   */
  readonly visible?: boolean;
  readonly mode: RendererMode;
  /** Present on the text path; absent when the pane reads bytes instead. */
  readonly page?: RendererPage;
}

/** What a contribution's `load()` resolves to. */
export interface RendererModule {
  readonly Body: ComponentType<RendererBodyProps>;
  /**
   * Which engine draws this body, for the pane's `data-renderer` marker and
   * acceptance probes. A module that omits it is reported by its contribution
   * id instead; the string belongs to the chunk, never to the entry bundle.
   */
  readonly renderer?: string;
}

/**
 * The metadata a renderer declares so selection stays synchronous.
 *
 * The declared dimensions are alternatives: a file matches when any dimension
 * claims it. Declaring neither makes the contribution the catch-all.
 */
export interface RendererMatch {
  /** Suffixes, with or without the leading dot, compared lowercased and dotted. */
  readonly extensions?: readonly string[];
  /** Families from the shared format catalogue (`preview.ts#familyOf`). */
  readonly families?: readonly string[];
}

/** One renderer a plugin has registered. */
export interface RendererContribution {
  /** Stable identity; a second registration of the same id is refused. */
  readonly id: string;
  /** Human-readable name for diagnostics; the pane shows no renderer picker. */
  readonly label: string;
  readonly match: RendererMatch;
  /** Larger wins; ties break on id. Defaults to 0. */
  readonly priority?: number;
  /** Fetch this renderer's module; only ever called for the winner. */
  load(): Promise<RendererModule>;
}

/** What the pane asks the registry about one file. */
export interface RendererQuery {
  readonly path: string;
}

/** The registry the client service exposes. */
export interface RendererRegistry {
  /** Add one renderer; the disposer removes it. */
  register(contribution: RendererContribution): () => void;
  /** The renderer that draws `query.path`, or undefined when none claims it. */
  resolve(query: RendererQuery): RendererContribution | undefined;
  /** Registered renderers in registration order. */
  snapshot(): readonly RendererContribution[];
  /** Observe registrations and disposals. */
  subscribe(listener: () => void): () => void;
}

/** How a rejected contribution is reported; the entry wires the host logger. */
export interface RendererRegistryOptions {
  warn?(message: string): void;
}

/** A winner together with its pending module. */
export interface RendererLoad {
  readonly contribution: RendererContribution;
  readonly module: Promise<RendererModule>;
}

/** The Cordis service name the client half provides for renderer plugins. */
export const FS_EXPLORER_SERVICE = "fsExplorer";

/** The service shape a renderer plugin consumes. */
export interface FsExplorerService {
  /** Contract version; bump when a member changes shape. */
  readonly version: number;
  /** The registry itself, for callers that also read the snapshot. */
  readonly renderers: RendererRegistry;
  /** Register a renderer on the shared registry; the disposer removes it. */
  registerRenderer(contribution: RendererContribution): () => void;
}

/** Version of the service contract in {@link FsExplorerService}. */
export const FS_EXPLORER_SERVICE_VERSION = 1;

/** One registration after its match metadata was normalized. */
interface Entry {
  readonly contribution: RendererContribution;
  readonly extensions: readonly string[];
  readonly families: readonly string[];
}

/**
 * The suffix of one path, dot included.
 *
 * Mirrors `familyOf` and `languageFor`: a leading dot names a dotfile rather
 * than a suffix, so all three agree that `.gitignore` has neither.
 * @param path - workspace path or bare file name.
 * @returns the lowercased suffix with its dot, or an empty string.
 */
function suffixOf(path: string): string {
  const base = path.slice(path.lastIndexOf("/") + 1).toLowerCase();
  const dot = base.lastIndexOf(".");
  return dot <= 0 ? "" : base.slice(dot);
}

/**
 * Normalize a declared suffix so `md`, `.md` and `MD` are one claim.
 * @param value - one entry of `match.extensions`.
 * @returns the dotted, lowercased suffix.
 */
function normalizeExtension(value: string): string {
  const lower = value.toLowerCase();
  return lower.startsWith(".") ? lower : `.${lower}`;
}

/**
 * Whether one registration claims a file.
 *
 * Any declared dimension matching is enough, which is what lets a contribution
 * name both a suffix and a family without having to satisfy both.
 */
function claims(entry: Entry, suffix: string, family: string | null): boolean {
  if (entry.extensions.length === 0 && entry.families.length === 0) return true;
  if (suffix !== "" && entry.extensions.includes(suffix)) return true;
  return family !== null && entry.families.includes(family);
}

/**
 * Whether `candidate` outranks `current`: larger priority first, then the
 * smaller id. The id order is plain code-unit comparison, not a locale
 * collation, so the answer cannot change with the host's language.
 */
function outranks(candidate: RendererContribution, current: RendererContribution): boolean {
  const delta = (candidate.priority ?? 0) - (current.priority ?? 0);
  if (delta !== 0) return delta > 0;
  return candidate.id < current.id;
}

/**
 * Create an empty registry.
 * @param options - warning sink for contributions the registry refuses.
 * @returns the registry.
 */
export function createRendererRegistry(options: RendererRegistryOptions = {}): RendererRegistry {
  const report = options.warn ?? (() => {});
  const entries = new Map<string, Entry>();
  const listeners = new Set<() => void>();

  const notify = (): void => {
    for (const listener of [...listeners]) listener();
  };

  return {
    register(contribution) {
      const id = contribution?.id;
      if (typeof id !== "string" || id === "") {
        report("renderer registry: a contribution without an id was refused");
        return () => {};
      }
      if (typeof contribution.load !== "function") {
        report(`renderer registry: "${id}" has no load(); it was refused`);
        return () => {};
      }
      if (entries.has(id)) {
        // The first registration is the one an already-mounted pane resolved;
        // replacing it would swap the body under a reader for no visible gain.
        report(`renderer registry: "${id}" is already registered; the first registration stays`);
        return () => {};
      }
      entries.set(id, {
        contribution,
        extensions: (contribution.match?.extensions ?? []).map(normalizeExtension),
        families: [...(contribution.match?.families ?? [])],
      });
      notify();
      let live = true;
      return () => {
        if (!live) return;
        live = false;
        entries.delete(id);
        notify();
      };
    },

    resolve(query) {
      const suffix = suffixOf(query.path);
      const family = familyOf(query.path);
      let winner: Entry | undefined;
      for (const entry of entries.values()) {
        if (!claims(entry, suffix, family)) continue;
        if (winner === undefined || outranks(entry.contribution, winner.contribution)) winner = entry;
      }
      return winner?.contribution;
    },

    snapshot() {
      return Object.freeze([...entries.values()].map(entry => entry.contribution));
    },

    subscribe(listener) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
  };
}

/**
 * Resolve one query and start loading the winner.
 *
 * The only caller is the pane, and this is deliberately the only place in the
 * package that calls a contribution's `load()`: a losing renderer stays
 * unloaded no matter how many contributions are registered.
 * @param registry - the registry to query.
 * @param query - the file to draw.
 * @returns the winner and its pending module, or undefined when nothing claims
 * the file.
 */
export function loadRenderer(registry: RendererRegistry, query: RendererQuery): RendererLoad | undefined {
  const contribution = registry.resolve(query);
  if (contribution === undefined) return undefined;
  // The executor runs synchronously, so a renderer that throws before it
  // returns a promise still becomes a rejection the pane can fall back from.
  const module = new Promise<RendererModule>(resolve => resolve(contribution.load()));
  return { contribution, module };
}
