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
import type { DiagramHandle, DiagramInteractions, DiagramView } from "./chunk/diagram.ts";
import type { DiagramChunkModule, LoaderRequire } from "./chunk-loader.ts";
import { PACKAGE_NAME, VIEW_ID, VIEW_ORDER, VIEW_SLOT } from "../shared.ts";
import { loadDiagramChunk } from "./chunk-loader.ts";
import { EN, LOCALE_NAMESPACE, ZH } from "./copy.ts";
import { mountArchChrome, type ArchChromeStrings } from "./chrome.tsx";
import { createArchView, type InsertReferenceSeam } from "./view.tsx";
import {
  archReferenceSeam,
  insertArchReference,
  registerArchReferenceSource,
  type ArchReferenceInsert,
  type ArchReferencePayload,
  type ArchReferenceSeam,
  type ArchReferenceSpan,
  type ReferenceContextLike,
} from "./reference.ts";
import { applyViewOffsets, defaultViewport, offsetFromDrag } from "./view-state.ts";
import type { ViewStateHandle } from "./view-state.ts";

export { boot } from "./chunk-loader.ts";

/** The dock panel kind this package registers on the workbench core. */
export const ARCH_PANEL_KIND = "arch";

export type { DiagramInteractions } from "./chunk/diagram.ts";

/** The slice of the client context this entry uses. */
export interface ArchClientContext {
  readonly slots: {
    inject(slot: string, factory: () => () => void): unknown;
    register(options: Record<string, unknown>, component: unknown): () => void;
  };
  readonly locale: {
    register(namespace: string, dictionaries: Record<string, Record<string, string>>): () => void;
    bind(namespace: string): (key: string) => string;
    /** Locale snapshot; absent on hosts that only expose the binder. */
    getSnapshot?(): { readonly active?: string };
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
  /** The session on screen; absent on cores older than the session read. */
  readonly currentSessionId?: () => string | undefined;
}

/** Services this plugin waits for before applying.
 *
 * `slots` and `locale` are what the conversation tab needs to register.
 * `workbench` used to be required too, and that is what dropped the tab: a hot
 * reload tears the plugin down and brings it back while its services are still
 * settling, and one required service that is briefly absent keeps the whole
 * plugin inactive, so the tab registration never runs and the strip loses it
 * until the next full boot. The dock kind still registers when the service is
 * present; `apply` reads it and skips the kind when it is not.
 *
 * Reading an undeclared service is not free: Cordis throws from the property
 * read ("cannot get property \"workbench\" without inject") rather than
 * returning undefined, so `readWorkbench` wraps both probes. Keep the guards
 * when touching this list — dropping `workbench` here without them makes
 * `apply` throw and the plugin fail to activate.
 *
 * An array, not `{ required, optional }`: the loader treats every key of an
 * object inject as a service name, so a `required` key would wait forever for
 * a service that does not exist.
 */
export const inject = ["slots", "locale"];

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
  // Both reads are guarded. Cordis throws on a property read for a service the
  // plugin did not declare in `inject` ("cannot get property \"workbench\"
  // without inject") instead of yielding undefined, and `workbench` is
  // deliberately optional here — so a miss is a supported composition, not an
  // error. Without the guards the whole `apply` throws and the plugin never
  // activates, which is exactly what dropping `workbench` from `inject` did.
  try {
    const direct = ctx.workbench;
    if (direct !== undefined && direct !== null) return direct;
  } catch {
    // Not injected: fall through to the `get` probe.
  }
  if (typeof ctx.get !== "function") return undefined;
  try {
    const viaGet = ctx.get("workbench");
    return viaGet !== undefined && viaGet !== null && typeof viaGet === "object" ? (viaGet as WorkbenchFace) : undefined;
  } catch {
    return undefined;
  }
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
 * The host's active locale id.
 *
 * The slot label is re-resolved by the shell on every locale revision, so the
 * thunk reads this at call time instead of freezing the boot language.
 * @param ctx - the client context carrying the locale service.
 * @returns the active id, or `zh` when the host exposes no snapshot.
 */
function activeLocale(ctx: ArchClientContext): string {
  const snapshot = ctx.locale.getSnapshot?.();
  return typeof snapshot?.active === "string" ? snapshot.active : "zh";
}

/**
 * Hide the conversation column's width handle while the architecture view is
 * on screen.
 *
 * The host renders the two `[data-width-handle]` nodes as direct children of
 * `[data-conversation-content]`, beside the scrollport, whenever the session
 * is active. It does not know which view tab is open. The architecture view
 * fills that column, so dragging the chat width does nothing there. The host
 * mounts exactly one conversation view, so `[data-arch-view]` inside the
 * content is the "Arch tab is open" signal, and leaving the tab removes it.
 */
const ARCH_VIEW_CSS =
  "[data-conversation-content]:has([data-arch-view]) > [data-width-handle] { display: none; }";

/** Install the view stylesheet once per document; a repeat apply meets the same page. */
function ensureViewStyles(): void {
  if (typeof document === "undefined") return;
  if (document.querySelector("style[data-arch-view-style]") !== null) return;
  const style = document.createElement("style");
  style.dataset.archViewStyle = "";
  style.textContent = ARCH_VIEW_CSS;
  document.head.append(style);
}

/** Chrome seams shared by the conversation view and the dock kind. */
function chromeSeams(t: (key: string) => string) {
  return {
    mountView: mountArchDiagram,
    load: loadDiagramChunk,
    strings: chromeStrings(t),
  };
}

/**
 * Build the seam a chip click drives, reading the host per click.
 *
 * The session is read from the workbench core, which is optional here: the tab
 * row is the part that actually switches the view, so a host without the core
 * still gets a working click and only loses the cross-session guard. That guard
 * is worth keeping where it exists (a chip from another session names an
 * element in a model this tab is not showing), but it is not worth losing the
 * whole gesture over, and the tab row it would have protected is the same one
 * the click is about to press.
 * @param ctx - the client context, read through the non-throwing resolver.
 * @returns the seam; empty outside a browser.
 */
export function createArchReferenceSeam(ctx: ArchClientContext): ArchReferenceSeam {
  const titles = [ZH["arch.tabTitle"] ?? "", EN["arch.tabTitle"] ?? ""];
  return {
    ...archReferenceSeam(typeof document === "undefined" ? undefined : document, titles),
    currentSessionId: () => readWorkbench(ctx)?.currentSessionId?.(),
  };
}

/**
 * Build the writer that turns one element payload into a composer chip.
 *
 * Every service is read on each call. Two reasons: the facade is per session
 * generation and throws once that generation is released, so caching one would
 * hand a stale composer to the next click; and this seam is built during
 * `apply`, which can run before `sessions` and `conversation` are up, so
 * capturing them there would freeze a legitimate absence into a permanent one.
 * @param ctx - the client context, read through the non-throwing resolver.
 * @returns a writer that reports `failed` rather than throwing.
 */
export function createInsertReference(ctx: ArchClientContext): InsertReferenceSeam {
  return (sessionId, payload, actions, sourceAvailable) => {
    let facade: SessionInputFace | undefined;
    try {
      const sessions = ctx.get?.("sessions") as { scope?(id: string): unknown } | undefined;
      const conversation = ctx.get?.("conversation") as
        | { input?: { for(actx: unknown): SessionInputFace } }
        | undefined;
      const actx = sessions?.scope?.(sessionId);
      if (actx === undefined || conversation?.input?.for === undefined) return "failed";
      facade = conversation.input.for(actx);
    } catch {
      // The controller refuses a Context whose generation was released: the
      // session was switched away from between the render and this click.
      return "failed";
    }
    if (facade === undefined || facade === null) return "failed";
    const result = insertArchReference(
      {
        captureSpan: () => {
          const span = actions.captureInsertion?.();
          return span === undefined ? undefined : { start: span.start, end: span.end, draftRev: span.draftRev };
        },
        insertReference: (insert, span) => facade?.insertReference?.(insert, span) ?? false,
        insertText: (text, span) => actions.insertText?.(text, span) ?? false,
        canInsertReference: sourceAvailable,
      },
      payload,
    );
    if (result === "failed") return result;
    try {
      facade.focus?.();
    } catch {
      // Focus is a courtesy; a released composer must not undo a landed write.
    }
    return result;
  };
}

/** The slice of the session input facade the reference writer calls. */
interface SessionInputFace {
  insertReference(insert: ArchReferenceInsert, span: ArchReferenceSpan): boolean;
  focus?(): void;
}

/**
 * Register the Arch panel kind.
 *
 * @param ctx - the client context, with the core service already injected.
 * @returns a disposer that unregisters the kind and the dictionary.
 */
export function apply(ctx: ArchClientContext): () => void {
  ensureViewStyles();
  const t = ctx.locale.bind(LOCALE_NAMESPACE);
  registeredDictionaries?.();
  const offLocale = ctx.locale.register(LOCALE_NAMESPACE, { zh: ZH, en: EN });
  registeredDictionaries = offLocale;

  // The chip's send-time identity and its click target. Registered before the
  // view so a draft that already holds a chip can be sent the moment the tab
  // paints. The seam is resolved per click: the tab row is rebuilt by the host
  // on every view switch, and the session on screen changes with it.
  const referenceSource = registerArchReferenceSource(ctx as ReferenceContextLike, () =>
    createArchReferenceSeam(ctx),
  );
  const View = createArchView({
    chrome: chromeSeams(t),
    insertReference: createInsertReference(ctx),
    // A getter, not a snapshot: the inject path may register the source after
    // this view is built.
    referenceSourceAvailable: () => referenceSource.available,
  });
  ctx.slots.inject(VIEW_SLOT, () =>
    ctx.slots.register(
      {
        name: VIEW_SLOT,
        id: VIEW_ID,
        order: VIEW_ORDER,
        label: () => (activeLocale(ctx).startsWith("zh") ? ZH["arch.tabTitle"] : EN["arch.tabTitle"]),
        locale: LOCALE_NAMESPACE,
      },
      View,
    ),
  );

  const workbench = readWorkbench(ctx);
  let offKind = (): void => {};
  if (workbench !== undefined && typeof workbench.registerDockPanelKind === "function") {
    // Drop the previous registration before taking a new one: the double apply
    // meets a fresh core service, and the old ledger entry must not outlive
    // the service instance that owns it.
    registeredKind?.();
    offKind = workbench.registerDockPanelKind({
      kind: ARCH_PANEL_KIND,
      title: t("arch.tabTitle"),
      mount: (host, context) =>
        mountArchChrome(host, {
          sessionId: context.sessionId,
          ...chromeSeams(t),
        }),
    });
    registeredKind = offKind;
  }

  return () => {
    referenceSource.dispose();
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
 * initial viewport is that view's saved framing or the readable default, and
 * every viewport change and finished drag is written back against the view it
 * belongs to — never against whichever tab happens to be selected later.
 *
 * @param host - element the SVG renders into.
 * @param view - one laid-out view from the wire payload; never mutated.
 * @param state - panel view-state to read offsets/viewport from and queue
 *   drags into.
 * @param load - chunk resolver, injectable so tests can wire the real
 *   renderer without the ModuleLoader.
 * @param interactions - renderer callbacks forwarded to the diagram; the
 *   chrome subscribes here without ever touching the renderer module.
 * @returns the diagram handle with the viewport applied.
 */
export async function mountArchDiagram(
  host: HTMLElement,
  view: DiagramView,
  state: ViewStateHandle,
  load: () => Promise<DiagramChunkModule> = loadDiagramChunk,
  interactions: DiagramInteractions = {},
): Promise<DiagramHandle> {
  const chunk = await load();
  const offsets = state.offsetsFor(view.id);
  const positions = applyViewOffsets(view.nodes, offsets);

  // Select before reading: the viewport must be looked up for the incoming
  // view, not for the tab that was selected when the switch started.
  state.setView(view.id);
  const box = host.getBoundingClientRect();
  const viewport = state.viewportFor(view.id) ?? defaultViewport(view.bounds, { width: box.width, height: box.height });

  const diagram = chunk.createDiagram(host, view, {
    viewport,
    positions,
    onSelect: interactions.onSelect,
    // Bound to the mounted view id: the renderer reports against the view it
    // was created for, and a stale report must not overwrite another tab.
    onViewportChange: next => {
      state.setViewportFor(view.id, next);
      interactions.onViewportChange?.(next);
    },
    onEdgeClick: interactions.onEdgeClick,
    onNodeAction: interactions.onNodeAction,
    onBackgroundClick: interactions.onBackgroundClick,
    ...(interactions.nodeReference === undefined ? {} : { nodeReference: interactions.nodeReference }),
    onMove: (id, x, y) => {
      const base = view.nodes.find(node => node.id === id);
      if (base !== undefined) state.queueOffset(view.id, id, offsetFromDrag(base, x, y));
      interactions.onNodeMove?.(id, x, y);
    },
  });

  // The initial viewport reaches the state without a renderer notification
  // (there is no change to report), so persist it here; a later pan reports
  // through the bound callback above.
  state.setViewportFor(view.id, diagram.viewport());
  return diagram;
}

/** The plugin object the loader mounts. */
export const clientPlugin = { name: PACKAGE_NAME, inject, apply };

export default clientPlugin;
