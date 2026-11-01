/**
 * Client half entry: plugin shell, the renderer mount point, and the Arch
 * panel kind registration on the workbench core.
 *
 * Three assembly rules:
 * - The heavy half is never imported here. The SVG renderer lives in
 *   `client.diagram.js` behind `require.async`; this bundle only knows the
 *   chunk's file name (the build asserts the startup bundle stays
 *   renderer-free).
 * - The panel chrome (`chrome.tsx`) receives every seam as an option — the
 *   mount point, the chunk loader, the strings — so this file is the single
 *   composition root and nothing below it imports back up.
 * - The desktop applies a client plugin twice on one process (the sync pass
 *   followed by the mount pass). Both the locale table and the core's kind
 *   ledger refuse or stack on a repeat registration, so the module holds the
 *   previous disposers and drops them before registering again.
 */
import type { DiagramHandle, DiagramView } from "./chunk/diagram.ts";
import type { DiagramChunkModule, LoaderRequire } from "./chunk-loader.ts";
import { PACKAGE_NAME } from "../shared.ts";
import { loadDiagramChunk } from "./chunk-loader.ts";
import { EN, LOCALE_NAMESPACE, ZH } from "./copy.ts";
import { mountArchChrome, type ArchChromeStrings } from "./chrome.tsx";
import { applyViewOffsets, defaultViewport, offsetFromDrag } from "./view-state.ts";
import type { ViewStateHandle } from "./view-state.ts";

export { boot } from "./chunk-loader.ts";

/** The dock panel kind this package registers on the workbench core. */
export const ARCH_PANEL_KIND = "arch";

/** The slice of the client context this entry uses. */
export interface ArchClientContext {
  readonly locale: {
    register(namespace: string, dictionaries: Record<string, Record<string, string>>): () => void;
    bind(namespace: string): (key: string) => string;
  };
  readonly workbench?: WorkbenchFace;
  get?(name: string): unknown;
}

/** The core service members this package reads. */
export interface WorkbenchFace {
  readonly registerDockPanelKind?: (descriptor: {
    readonly kind: string;
    readonly title: string;
    readonly mount: (host: HTMLElement, context: { readonly sessionId: string }) => (() => void) | void;
  }) => () => void;
}

/** Services this plugin waits for before applying. */
export const inject = ["locale", "workbench"];

/** Disposer of the dictionary currently sitting in the host's locale table.
* A repeat apply on one host process meets the same table, and the table
* refuses a second registration for the same namespace and locale; dropping
* ours first turns that into a plain replacement. */
let registeredDictionaries: (() => void) | undefined;

/** Disposer of the kind registration currently held on the core's ledger. */
let registeredKind: (() => void) | undefined;

/**
 * Read the workbench service, injected property first, Cordis `get` second.
 *
 * @param ctx - the client context `apply` received.
 * @returns the service face, or undefined when the core is absent.
 */
function readWorkbench(ctx: ArchClientContext): WorkbenchFace | undefined {
  const direct = ctx.workbench;
  if (direct !== undefined && direct !== null) return direct;
  const viaGet = typeof ctx.get === "function" ? ctx.get("workbench") : undefined;
  return viaGet !== undefined && viaGet !== null && typeof viaGet === "object" ? (viaGet as WorkbenchFace) : undefined;
}

/**
 * Bind the chrome's strings through the locale seat.
 *
 * @param t - the bound translate seat.
 * @returns the strings the chrome renders.
 */
function chromeStrings(t: (key: string) => string): ArchChromeStrings {
  return {
    tabTitle: t("arch.tabTitle"),
    waitingSession: t("arch.waitingSession"),
    empty: t("arch.empty"),
    loadFailed: t("arch.loadFailed"),
    retry: t("arch.retry"),
    errorsTitle: t("arch.errorsTitle"),
  };
}

/**
 * Register the Arch panel kind.
 *
 * @param ctx - the client context, with the core service already injected.
 * @returns a disposer that unregisters the kind and the dictionary.
 */
export function apply(ctx: ArchClientContext): () => void {
  const workbench = readWorkbench(ctx);
  if (workbench === undefined || typeof workbench.registerDockPanelKind !== "function") return () => {};

  const t = ctx.locale.bind(LOCALE_NAMESPACE);
  registeredDictionaries?.();
  const offLocale = ctx.locale.register(LOCALE_NAMESPACE, { zh: ZH, en: EN });
  registeredDictionaries = offLocale;

  // Drop the previous registration before taking a new one: the double apply
  // meets a fresh core service, and the old ledger entry must not outlive
  // the service instance that owns it.
  registeredKind?.();
  const offKind = workbench.registerDockPanelKind({
    kind: ARCH_PANEL_KIND,
    title: t("arch.tabTitle"),
    mount: (host, context) =>
      mountArchChrome(host, {
        sessionId: context.sessionId,
        mountView: mountArchDiagram,
        load: loadDiagramChunk,
        strings: chromeStrings(t),
      }),
  });
  registeredKind = offKind;

  return () => {
    offKind();
    offLocale();
    if (registeredDictionaries === offLocale) registeredDictionaries = undefined;
    if (registeredKind === offKind) registeredKind = undefined;
  };
}

/**
 * Mount one laid-out view into a host element.
 *
 * Offsets recorded for the view are applied to the render positions (invalid
 * ones drop out host-side of the renderer, per the half-a-node rule), the
 * initial viewport comes from the state or the readable default, and every
 * finished drag is queued back as a correction offset.
 *
 * @param host - element the SVG renders into.
 * @param view - one laid-out view from the wire payload; never mutated.
 * @param state - panel view-state to read offsets/viewport from and queue
 *   drags into.
 * @param load - chunk resolver, injectable so tests can wire the real
 *   renderer without the ModuleLoader.
 * @returns the diagram handle with the viewport applied.
 */
export async function mountArchDiagram(
  host: HTMLElement,
  view: DiagramView,
  state: ViewStateHandle,
  load: () => Promise<DiagramChunkModule> = loadDiagramChunk,
): Promise<DiagramHandle> {
  const chunk = await load();
  const offsets = state.offsetsFor(view.id);
  const positions = applyViewOffsets(view.nodes, offsets);

  const box = host.getBoundingClientRect();
  const viewport = state.viewport ?? defaultViewport(view.bounds, { width: box.width, height: box.height });

  const diagram = chunk.createDiagram(host, view, {
    viewport,
    positions,
    onMove: (id, x, y) => {
      const base = view.nodes.find(node => node.id === id);
      if (base !== undefined) state.queueOffset(view.id, id, offsetFromDrag(base, x, y));
    },
  });

  state.setView(view.id);
  state.setViewport(diagram.viewport());
  return diagram;
}

/** The plugin object the loader mounts. */
export const clientPlugin = { name: PACKAGE_NAME, inject, apply };

export default clientPlugin;
