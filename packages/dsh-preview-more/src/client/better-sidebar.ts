/**
 * The dsh-better-sidebar face of the same renderers.
 *
 * dsh-better-sidebar registers an `editor` tab type that claims every
 * `dsh-resource://file/**` address at the extension band, outranking the
 * built-in document preview (a fallback-band `text` type). It hands a suffix
 * back to the host only when the host renders that format better; glb and tiff
 * are not on that list, so without this adapter the file lands in its binary
 * download pane and the native body never mounts.
 *
 * The adapter registers one file viewer per family in the shape that plugin
 * documents: `fetchStrategy: 'custom'` plus `load(path, scope, signal)`, whose
 * return value reaches the component as `customData`.
 */
import type { ComponentType } from "react";

import type { ChunkModule, ReactFace, ReadFile } from "./entry.ts";
import { extensionsOf, type PreviewFamily } from "./formats.ts";
import type { InjectionScope, PreviewContext } from "./runtime.ts";

/** What one better-sidebar viewer component is handed. */
interface ViewerProps {
  /** Absolute path of the file being previewed. */
  readonly path: string;
  /** Session scope the file address belongs to. */
  readonly scope: { readonly sessionId: string };
  /** Value the descriptor's `load` returned. */
  readonly customData?: { readonly bytes?: Uint8Array; readonly path?: string };
  /** False while the tab is parked behind another one. */
  readonly visible?: boolean;
}

/** The subset of the better-sidebar service this adapter calls. */
interface BetterSidebarService {
  registerFileViewer(descriptor: {
    id: string;
    title: () => string;
    exts: readonly string[];
    priority: number;
    fetchStrategy: "custom";
    load: (path: string, scope: { sessionId: string }, signal?: AbortSignal) => Promise<unknown>;
    component: ComponentType<never>;
  }): () => void;
}

/** What the entry hands the adapter. */
export interface AdapterDeps {
  /** React namespace: the wrapper is built here, not in the chunk. */
  readonly React: ReactFace;
  /** Bound translator for this plugin's namespace. */
  readonly t: (key: string) => string;
  /** Read one file's bytes through the host workspace service. */
  readonly readFile: ReadFile;
  /** Renderer family this registration serves. */
  readonly family: PreviewFamily;
  /** Resolve the family's lazy chunk. */
  readonly loadChunk: (family: PreviewFamily) => Promise<ChunkModule>;
}

/** The plugin name used as the viewer-id namespace. */
const PLUGIN = "dsh-preview-more";

/**
 * Register this family's viewer once the better-sidebar service exists.
 *
 * The service is optional, so the registration hangs off `ctx.inject` rather
 * than a snapshot read: on a host where that plugin loads later, sampling once
 * would see undefined and the renderer would never be reachable. A host without
 * it simply never runs the callback, and the native registry keeps rendering.
 * @param ctx - client plugin context.
 * @param deps - translator, reader, chunk resolver and React namespace.
 */
export function registerBetterSidebarViewers(ctx: PreviewContext, deps: AdapterDeps): void {
  if (typeof ctx.inject !== "function") return;
  const { React, t, family } = deps;
  const id = PLUGIN + ":" + family;

  // The viewer component is built here rather than in the chunk so the chunk
  // stays a plain module: it exports what it draws, the adapter decides how it
  // mounts. The chunk is resolved lazily, so three.js still arrives only for a
  // reader who opens a model.
  const Lazy = React.lazy(async () => ({ default: (await deps.loadChunk(family)).Viewer as ComponentType<never> }));

  const Viewer = function BetterSidebarViewer(props: ViewerProps): unknown {
    return React.createElement(
      React.Suspense,
      { fallback: null },
      React.createElement(Lazy, { ...props, t }),
    );
  } as ComponentType<never>;

  ctx.inject(["betterSidebar"], (scope: InjectionScope) => {
    const service = scope.get<BetterSidebarService>("betterSidebar");
    if (service === undefined || typeof service.registerFileViewer !== "function") return;

    return service.registerFileViewer({
      id,
      title: () => t(family + ".title"),
      exts: extensionsOf(family),
      priority: 10,
      fetchStrategy: "custom",
      load: async (path, scope_, signal) => {
        const bytes = await deps.readFile(scope_.sessionId, path, signal ?? new AbortController().signal);
        return { bytes, path };
      },
      component: Viewer,
    });
  });
}
