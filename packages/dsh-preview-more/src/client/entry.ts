/**
 * Browser-half entry: register the preview renderers, then get out of the way.
 *
 * Everything heavy lives in a lazy chunk. The entry is parsed on every page boot
 * whether or not a 3D model is ever opened, so it carries only registry
 * metadata, locale dictionaries and a lazy pointer at each chunk. A chunk is
 * fetched through the loader's `require.async`, which is the only way a plugin
 * may pull a sibling file: a chunk has no synchronous access to its siblings and
 * the entry has no other handle on the loader.
 *
 * Registration has two faces because the host has two:
 *
 *   - native: `ctx.documentPreviews` plus a keyed
 *     `sidebar.right.tab.document` body, what an unmodified Harness renders;
 *   - better-sidebar: when dsh-better-sidebar is installed it claims every file
 *     address at the extension band, so the native body never mounts and the
 *     same renderer is offered as one of its file viewers instead.
 *
 * Both faces share one chunk; see `better-sidebar.ts` for the second adapter.
 */
import type { ComponentType, ReactElement } from "react";

import { registerBetterSidebarViewers } from "./better-sidebar.ts";
import { claimedExtensions, familyOf, type PreviewFamily } from "./formats.ts";
import { dictionaries, LOCALE_NAMESPACE } from "./locale.ts";
import type { PreviewContext } from "./runtime.ts";
import { insertStyles } from "./styles.ts";

/** The factory's `require`; the only handle on `require.async` and platform modules. */
interface LoaderRequire {
  (specifier: string): unknown;
  async(specifier: string): Promise<unknown>;
}

/** The React surface this entry and the adapter use. */
export interface ReactFace {
  readonly createElement: (type: unknown, props?: unknown, ...children: unknown[]) => ReactElement;
  readonly lazy: (factory: () => Promise<{ default: ComponentType<never> }>) => ComponentType<never>;
  readonly Suspense: ComponentType<{ children?: unknown }>;
  readonly useState: <State>(initial: State) => [State, (next: State) => void];
  readonly useEffect: (effect: () => void | (() => void), deps?: readonly unknown[]) => void;
  readonly useMemo: <Value>(factory: () => Value, deps: readonly unknown[]) => Value;
}

/** Captured at boot because `apply` never receives it. */
let loaderRequire: LoaderRequire | null = null;

/** One resolved chunk module. */
export interface ChunkModule {
  /** The document body, fed by the host's renderer-mode props. */
  readonly Body: ComponentType<never>;
  /** The better-sidebar viewer, fed by that plugin's `customData`. */
  readonly Viewer: ComponentType<never>;
}

/** A lazily resolved chunk component, cached per family. */
const chunkCache = new Map<PreviewFamily, Promise<ChunkModule>>();

/**
 * Resolve one family's chunk.
 * @param family - renderer family, which is also the chunk file name.
 * @returns the chunk module.
 */
export function loadChunk(family: PreviewFamily): Promise<ChunkModule> {
  const cached = chunkCache.get(family);
  if (cached !== undefined) return cached;
  if (loaderRequire === null) return Promise.reject(new Error("dsh-preview-more: the loader require was not handed over"));
  const pending = loaderRequire.async("./client." + family + ".js").then((module) => {
    const chunk = module as Partial<ChunkModule>;
    if (typeof chunk.Body !== "function" || typeof chunk.Viewer !== "function") {
      throw new Error("dsh-preview-more: chunk " + family + " is missing Body or Viewer");
    }
    return chunk as ChunkModule;
  });
  chunkCache.set(family, pending);
  return pending;
}

/**
 * Resolve React through the loader.
 *
 * React is a platform module the shell seeds, not a dependency of this package:
 * bundling it would ship a second React and break every hook in the bodies.
 * @returns the React namespace.
 */
function resolveReact(): ReactFace {
  if (loaderRequire === null) throw new Error("dsh-preview-more: the loader require was not handed over");
  return loaderRequire("react") as ReactFace;
}

/** Definition id prefix, so a duplicate registration names the offending family. */
const ID_PREFIX = "dsh-preview-more/";

/** Read a file's complete bytes through the host workspace service. */
export type ReadFile = (sessionId: string, path: string, signal: AbortSignal) => Promise<Uint8Array>;

/**
 * Build the reader the bodies receive.
 *
 * The service refuses a complete read past its cap rather than truncating, so an
 * oversized model surfaces as the body's failure state instead of a half-parsed
 * mesh.
 * @param ctx - client plugin context carrying the workspace reader.
 * @returns the reader.
 */
function createReader(ctx: PreviewContext): ReadFile {
  return async (sessionId, path, signal) => {
    const result = await ctx.remote.workspaceFiles.readBytes(sessionId, path, {}, signal);
    if (!result.ok) throw new Error("read failed: " + describe(result.error), { cause: result.error });
    return result.value.data;
  };
}

/**
 * One-line description of a wire failure.
 * @param error - the error payload the service returned.
 * @returns a message safe to render.
 */
function describe(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  if (error !== null && typeof error === "object") {
    const code = (error as { code?: unknown }).code;
    if (typeof code === "string") return code;
  }
  return "unknown error";
}

/**
 * Wrap a chunk component so mounting it suspends until the chunk arrives.
 *
 * React.lazy without a Suspense boundary throws, and the host's tab body is
 * rendered inside its own tree, so the boundary has to live here.
 * @param React - React namespace.
 * @param resolve - chunk resolver.
 * @returns a component safe to hand the slot registry.
 */
function lazyComponent(React: ReactFace, resolve: () => Promise<ChunkModule>, pick: (module: ChunkModule) => ComponentType<never>): ComponentType<never> {
  const Lazy = React.lazy(async () => ({ default: pick(await resolve()) }));
  return function LazyChunk(props: never): ReactElement {
    return React.createElement(React.Suspense, { fallback: null }, React.createElement(Lazy, props));
  } as ComponentType<never>;
}

/**
 * The client plugin object the loader mounts.
 *
 * `inject` is a service whitelist: touching a service absent from it throws at
 * registration time, so it names exactly what the entry reads.
 */
export const clientPlugin = {
  name: "dsh-preview-more",
  inject: ["documentPreviews", "slots", "locale", "remote", "remote.workspaceFiles"],

  apply(ctx: PreviewContext): () => void {
    const React = resolveReact();
    const t = ctx.locale.bind(LOCALE_NAMESPACE);
    const readFile = createReader(ctx);
    const disposers: Array<() => void> = [];
    const register = (run: () => () => void): void => {
      if (typeof ctx.effect === "function") ctx.effect(run, "dsh-preview-more: registration");
      else disposers.push(run());
    };

    register(() => ctx.locale.register(LOCALE_NAMESPACE, dictionaries()));

    // The host does not style plugin markup, and an unstyled canvas has no box:
    // the surface would mount, decode, and paint nothing. One stylesheet covers
    // both hosts, and it is inserted once per document rather than per mount.
    register(() => {
      const doc = globalThis.document;
      return doc === undefined ? (() => undefined) : insertStyles(doc);
    });

    for (const family of ["scene3d", "raster"] as const) {
      const extensions = claimedExtensions().filter((suffix) => familyOf("x." + suffix) === family);
      if (extensions.length === 0) continue;
      const id = ID_PREFIX + family;

      register(() =>
        ctx.documentPreviews.register({
          id,
          extensions,
          binaryExtensions: extensions,
          priority: "extension",
          title: () => t(family + ".title"),
          loading: "renderer",
          wrap: false,
        }),
      );

      const Body = lazyComponent(React, () => loadChunk(family), (module) => module.Body);
      register(() =>
        ctx.slots.inject("sidebar.right.tab.document", () =>
          ctx.slots.register({ name: "sidebar.right.tab.document", key: id, locale: LOCALE_NAMESPACE, inject: () => ({ readFile }) }, Body),
        ),
      );

      // The adapter hangs its registration off ctx.inject, which owns the
      // disposer; there is nothing for this entry to tear down here.
      registerBetterSidebarViewers(ctx, { React, t, readFile, family, loadChunk });
    }

    return () => {
      for (const dispose of disposers) dispose();
    };
  },
};

/**
 * Hand the factory's require to the plugin.
 *
 * The build calls `module.exports.boot(require)` inside the factory; this must
 * be a top-level export because the loader keeps only {name, inject, apply}.
 * @param require - the loader require.
 */
export function boot(require: LoaderRequire): void {
  loaderRequire = require;
}

export default clientPlugin;
