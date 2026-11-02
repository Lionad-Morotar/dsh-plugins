/**
 * The Arch panel chrome: view tabs over `/arch/api/views`, the mounted
 * diagram behind the selected tab, and the waiting/empty/error states.
 *
 * Deliberately React-free like the renderer it hosts: the workbench hands
 * this shell a plain element (the dock panel kind contract), and imperative
 * DOM is the whole surface. The diagram itself never mounts here directly;
 * the entry's mount point (`mountArchDiagram`) is injected so this module
 * stays independent of the composition root.
 *
 * Fetch policy: same-origin relative URLs only (the GUI port changes every
 * host boot), one views fetch plus one state fetch per panel mount. Model
 * changes reach the panel through a throttled refresh poll; user state
 * leaves through the trailing write-back pump below.
 */
import type {
  ArchViewport,
  WireStateGetResponse,
  WireStatePutResponse,
  WireViewsResponse,
  WireModelResponse,
} from "../shared.ts";
import { ROUTE_PREFIX } from "../shared.ts";
import type { DiagramChunkModule } from "./chunk-loader.ts";
import type { DiagramHandle, DiagramInteractions, DiagramView } from "./chunk/diagram.ts";
import { mountArchDetailsPane, readElement } from "./details.tsx";
import { loadLocalState, saveLocalState } from "./local-state.ts";
import { createViewState, defaultViewport, type DiagramBounds, type ViewStateHandle } from "./view-state.ts";

/**
 * Trailing write-back window. Pans and drags arrive as pointer-frequency
 * event streams; one state POST per burst tail keeps the wire quiet while
 * the unmount flush guarantees the last state still lands.
 */
export const WRITE_BACK_DELAY_MS = 500;

/**
 * Model-change poll interval. The host's watch delivers a re-layout in ~69ms
 * after a save; the panel picks it up on the next tick of this throttle, so
 * a save is visible within one interval without any push channel.
 */
export const REFRESH_INTERVAL_MS = 2500;

/** The strings the chrome renders; the entry overrides these from its locale. */
export interface ArchChromeStrings {
  readonly tabTitle: string;
  readonly waitingSession: string;
  readonly empty: string;
  readonly loadFailed: string;
  readonly retry: string;
  readonly errorsTitle: string;
}

/** Default strings (zh); the entry passes the locale-bound set instead. */
export const ARCH_CHROME_STRINGS: ArchChromeStrings = {
  tabTitle: "\u67b6\u6784",
  waitingSession: "等待会话…",
  empty: "本工作区还没有 C4 模型。用 flow-dx 的 agents-md 流程生成 .planning/c4 模型后，即可在此浏览架构图。",
  loadFailed: "架构数据加载失败",
  retry: "重试",
  errorsTitle: "模型诊断",
};

/** How one view gets mounted; the entry's `mountArchDiagram` signature. */
export type MountArchView = (
  host: HTMLElement,
  view: DiagramView,
  state: ViewStateHandle,
  load?: () => Promise<DiagramChunkModule>,
  interactions?: DiagramInteractions,
) => Promise<DiagramHandle>;

/** Everything the chrome needs from its mount site. */
export interface ArchChromeOptions {
  /** The session whose workspace the panel reads; undefined shows waiting. */
  readonly sessionId: string | undefined;
  /** Fetch implementation; tests inject a double, the panel uses the page's. */
  readonly fetchImpl?: typeof fetch;
  /** The mount point from the entry; never defaulted, the entry owns wiring. */
  readonly mountView: MountArchView;
  /** Chunk resolver forwarded to the mount point. */
  readonly load?: () => Promise<DiagramChunkModule>;
  /** Panel view-state; a fresh one per panel when the entry passes none. */
  readonly viewState?: ViewStateHandle;
  /** Locale-bound strings; defaults to the zh set above. */
  readonly strings?: Partial<ArchChromeStrings>;
  /** Write-back trailing window; tests shrink it, production uses the default. */
  readonly writeBackDelayMs?: number;
  /** Refresh poll interval; tests shrink it, production uses the default. */
  readonly refreshIntervalMs?: number;
}

/**
 * Whole-view viewport for the dock's fullscreen mode.
 *
 * The readable default (`defaultViewport`) stays fixed-zoom because a 300px
 * dock fits real views at ~0.13 where labels are unreadable; fullscreen is
 * the one place fitting the whole view is the point. A zero-sized host box
 * still yields a positive finite scale so jsdom and pre-layout mounts are
 * safe.
 *
 * @param bounds - the laid-out view bounds.
 * @param host - the body element the diagram renders into.
 * @returns the fitted viewport.
 */
export function fitViewport(bounds: DiagramBounds, host: { width: number; height: number }): ArchViewport {
  const width = Math.max(host.width, 1);
  const height = Math.max(host.height, 1);
  const scale = Math.min(width / Math.max(bounds.width, 1), height / Math.max(bounds.height, 1));
  return {
    scale,
    tx: width / 2 - (bounds.x + bounds.width / 2) * scale,
    ty: height / 2 - (bounds.y + bounds.height / 2) * scale,
  };
}

const div = (datasetKey?: string): HTMLDivElement => {
  const element = document.createElement("div");
  if (datasetKey !== undefined) element.dataset[datasetKey] = "";
  return element;
};

const noteStyle =
  "flex:1;display:flex;align-items:center;justify-content:center;padding:16px;text-align:center;opacity:0.75;overflow:auto";
const toolbarStyle =
  "display:flex;gap:4px;align-items:center;flex:none;padding:4px 8px;overflow-x:auto;overflow-y:hidden;" +
  "border-bottom:1px solid color-mix(in srgb, currentColor 10%, transparent)";
const tabStyle =
  "flex:none;border:1px solid transparent;background:transparent;color:inherit;cursor:pointer;" +
  "font-size:11px;padding:2px 8px;border-radius:6px;opacity:0.72";
const tabActiveStyle =
  "flex:none;border:1px solid color-mix(in srgb, currentColor 18%, transparent);" +
  "background:color-mix(in srgb, currentColor 8%, transparent);color:inherit;cursor:pointer;" +
  "font-size:11px;padding:2px 8px;border-radius:6px;opacity:1";
const errorBlockStyle =
  "flex:none;padding:4px 8px;font-size:11px;color:#f87171;border-bottom:1px solid color-mix(in srgb, currentColor 10%, transparent);max-height:72px;overflow:auto";
const retryStyle =
  "margin-left:8px;border:1px solid color-mix(in srgb, currentColor 24%, transparent);background:transparent;" +
  "color:inherit;cursor:pointer;font-size:11px;padding:1px 8px;border-radius:6px";

/**
 * Mount the Arch panel chrome into one dock panel body.
 *
 * @param host - the element the dock panel kind handed over.
 * @param options - the seams; see {@link ArchChromeOptions}.
 * @returns the disposer; it stops the fullscreen observer and clears the DOM.
 */
export function mountArchChrome(host: HTMLElement, options: ArchChromeOptions): () => void {
  const strings: ArchChromeStrings = { ...ARCH_CHROME_STRINGS, ...options.strings };
  const fetchImpl: typeof fetch = options.fetchImpl ?? ((input, init) => fetch(input, init));
  const viewState = options.viewState ?? createViewState();

  host.dataset.archChrome = "";
  host.replaceChildren();

  const root = div();
  root.style.cssText = "display:flex;flex-direction:column;width:100%;height:100%;min-height:0;overflow:hidden";
  const toolbar = div("archToolbar");
  toolbar.style.cssText = toolbarStyle;
  const content = div();
  content.style.cssText = "flex:1;min-height:0;display:flex;flex-direction:column";
  root.append(toolbar, content);
  host.append(root);

  let disposed = false;
  let observer: MutationObserver | undefined;
  let handle: DiagramHandle | undefined;
  let view: DiagramView | undefined;
  let body: HTMLDivElement | undefined;
  let diagramHost: HTMLDivElement | undefined;
  let views: readonly DiagramView[] | undefined;
  // Whether the current diagram was last fitted for fullscreen; the exit edge
  // is the only other transition that rewrites the viewport.
  let sawFullscreen = false;
  // Mounts are serialized: a slow chunk load must not land on top of the view
  // the user switched to in the meantime.
  let chain: Promise<void> = Promise.resolve();

  // Arrow keys walk the view tabs while the diagram owns focus. Bound once to
  // the chrome root: the diagram element is rebuilt on some paths (a failed
  // mount retried from a tab pick), and a listener on the old node would die
  // with it. `contains` keeps fields elsewhere in the panel in charge of their
  // own keys.
  root.addEventListener("keydown", event => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    if (diagramHost === undefined || !(event.target instanceof Node) || !diagramHost.contains(event.target)) return;
    const current = views?.findIndex(candidate => candidate.id === view?.id) ?? -1;
    if (views === undefined || current < 0) return;
    const target = views[current + (event.key === "ArrowRight" ? 1 : -1)];
    if (target === undefined) return;
    event.preventDefault();
    select(target.id);
  });

  // The details pane outlives body rebuilds (it is re-parented into each new
  // one) so an open pane survives a view switch's content re-render.
  const detailsHost = document.createElement("div");
  const detailsPane = mountArchDetailsPane(detailsHost, {
    onClose: () => {
      handle?.select(null);
    },
  });
  let elementsPromise: Promise<Record<string, unknown>> | undefined;
  const elementsOf = (): Promise<Record<string, unknown>> => {
    const session = options.sessionId;
    if (session === undefined) return Promise.resolve({});
    elementsPromise ??= fetchImpl(`${ROUTE_PREFIX}/model?sessionId=${encodeURIComponent(session)}`)
      .then(async response => (response.ok ? ((await response.json()) as WireModelResponse).elements : {}))
      .catch(() => {
        // The catalogue is an enhancement: a failed fetch downgrades the pane
        // to the renderer's own node fields, never to an error state.
        return {};
      });
    return elementsPromise;
  };

  // Write-back pump state: dirty marks unsaved corrections, the timer is the
  // trailing window, degradedMode routes saves to localStorage instead of a
  // POST the host already answered "no store" to.
  let currentHash = "";
  let degradedMode = false;
  let dirty = false;
  let saveTimer: ReturnType<typeof setTimeout> | undefined;
  const writeBackDelay = options.writeBackDelayMs ?? WRITE_BACK_DELAY_MS;

  // Refresh poll state: the signature decides whether a poll changes
  // anything; the timer only runs while views are on screen.
  let lastSignature = "";
  let refreshTimer: ReturnType<typeof setInterval> | undefined;
  const stopRefresh = (): void => {
    if (refreshTimer === undefined) return;
    clearInterval(refreshTimer);
    refreshTimer = undefined;
  };

  const scheduleSave = (): void => {
    dirty = true;
    if (saveTimer !== undefined || disposed || options.sessionId === undefined) return;
    saveTimer = setTimeout(() => {
      saveTimer = undefined;
      void flushSave();
    }, writeBackDelay);
  };

  const flushSave = async (): Promise<void> => {
    if (!dirty || options.sessionId === undefined) return;
    dirty = false;
    const session = options.sessionId;
    const state = viewState.serialize(currentHash);
    if (degradedMode) {
      saveLocalState(session, state);
      viewState.flush();
      return;
    }
    try {
      const response = await fetchImpl(`${ROUTE_PREFIX}/state`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ sessionId: session, ...state }),
      });
      if (!response.ok) throw new Error(`state ${String(response.status)}`);
      const payload = (await response.json()) as WireStatePutResponse;
      if (payload.degraded) {
        // The store vanished between mount and this save: keep the state the
        // user already trusts by switching to the local layer from now on.
        degradedMode = true;
        saveLocalState(session, state);
      }
      viewState.flush();
    } catch {
      // Offline or rejected: the corrections stay queued so the next window
      // (or the unmount flush) retries instead of silently dropping them.
      dirty = true;
    }
    if (dirty && !disposed) scheduleSave();
  };

  const setNote = (key: string, text: string): void => {
    const note = div(key);
    note.style.cssText = noteStyle;
    note.textContent = text;
    content.replaceChildren(note);
  };

  /** The loadFailed note with its retry, shared by fetch and mount failures. */
  const failLoad = (error: unknown): void => {
    if (disposed) return;
    const failed = div("archError");
    failed.style.cssText = noteStyle;
    const text = document.createElement("span");
    text.textContent = `${strings.loadFailed}：${error instanceof Error ? error.message : String(error)}`;
    const retry = document.createElement("button");
    retry.type = "button";
    retry.dataset.archRetry = "";
    retry.textContent = strings.retry;
    retry.style.cssText = retryStyle;
    retry.addEventListener("click", () => {
      void load();
    });
    failed.append(text, retry);
    content.replaceChildren(failed);
  };

  const viewTitle = (candidate: DiagramView): string => candidate.title ?? candidate.id;

  const paintTabs = (activeId: string): void => {
    toolbar.replaceChildren();
    for (const candidate of views ?? []) {
      const tab = document.createElement("button");
      tab.type = "button";
      tab.dataset.viewId = candidate.id;
      tab.setAttribute("aria-pressed", candidate.id === activeId ? "true" : "false");
      tab.textContent = viewTitle(candidate);
      tab.style.cssText = candidate.id === activeId ? tabActiveStyle : tabStyle;
      tab.addEventListener("click", () => {
        select(candidate.id);
      });
      toolbar.append(tab);
    }
  };

  const applyDockMode = (): void => {
    if (handle === undefined || view === undefined || body === undefined) return;
    const section = host.closest("[data-workbench-dock]");
    if (section === null) return;
    const mode = section.getAttribute("data-dock-mode");
    const box = body.getBoundingClientRect();
    const size = { width: box.width, height: box.height };
    // Edge-triggered, not level-triggered: entering fullscreen fits the whole
    // view, leaving returns to the readable fixed zoom, and any other docked
    // mount keeps the viewport it restored with (that is the whole point of
    // the state route).
    if (mode === "fullscreen") {
      sawFullscreen = true;
      handle.setViewport(fitViewport(view.bounds, size));
      return;
    }
    if (sawFullscreen) {
      sawFullscreen = false;
      handle.setViewport(defaultViewport(view.bounds, size));
    }
  };

  const interactions: DiagramInteractions = {
    // The pump serializes viewState, so the new viewport lands there first;
    // either a pan tail or a finished drag then arms the write-back window.
    onViewportChange: viewport => {
      viewState.setViewport(viewport);
      scheduleSave();
    },
    onNodeMove: () => scheduleSave(),
    onSelect: id => {
      if (id === null) {
        detailsPane.render(null);
        return;
      }
      void elementsOf().then(elements => {
        const decoded = readElement(elements, id);
        if (decoded !== null) {
          detailsPane.render(decoded);
          return;
        }
        // No catalogue entry (model route failed or the node is absent from
        // $data): the laid-out node still carries presentable fields.
        const node = view?.nodes.find(candidate => candidate.id === id);
        const nodeDescription = node?.description;
        detailsPane.render(
          node === undefined
            ? null
            : {
                id,
                title: node.title,
                description:
                  typeof nodeDescription === "string" ? nodeDescription : (nodeDescription?.txt ?? null),
                technology: node.technology ?? null,
                links: [],
                tags: [],
              },
        );
      });
    },
  };

  const select = (id: string): void => {
    const target = views?.find(candidate => candidate.id === id);
    if (target === undefined) return;
    if (diagramHost?.isConnected !== true) {
      // A failed mount swapped the body for the error note; a tab pick after
      // that must rebuild the body instead of mounting into a detached one.
      body = div("archBody");
      body.style.cssText = "flex:1;min-height:0;overflow:hidden;display:flex";
      diagramHost = div("archDiagram");
      diagramHost.style.cssText = "flex:1;min-width:0;min-height:0";
      body.append(diagramHost, detailsHost);
      content.replaceChildren(body);
    }
    paintTabs(id);
    currentHash = target.hash ?? "";
    detailsPane.render(null);
    const mountBody = diagramHost;
    chain = chain
      .then(async () => {
        if (disposed) return;
        handle = undefined;
        view = target;
        // An empty beat keeps a switched tab from showing the previous view
        // while the chunk resolves; the renderer clears its host anyway.
        mountBody.replaceChildren();
        handle = await options.mountView(mountBody, target, viewState, options.load, interactions);
        if (disposed) return;
        applyDockMode();
      })
      .catch(error => {
        // A rejected link would silence every later tab pick; the chain stays
        // settled and the failure takes the same retry path as a failed fetch.
        handle = undefined;
        failLoad(error);
      });
  };

  const renderViews = (payload: WireViewsResponse): void => {
    views = payload.views as readonly DiagramView[];
    lastSignature = signatureOf(payload);
    stopRefresh();
    toolbar.replaceChildren();
    if (views.length === 0) {
      setNote("archEmpty", strings.empty);
      return;
    }

    if (payload.hasErrors || payload.errors.length > 0) {
      const errors = div("archErrors");
      errors.style.cssText = errorBlockStyle;
      const lines = payload.errors.map(error => `${error.message} (${error.sourcePath})`).join("；");
      errors.textContent = `${strings.errorsTitle}：${lines}`;
      content.replaceChildren(errors);
    } else {
      content.replaceChildren();
    }
    body = div("archBody");
    body.style.cssText = "flex:1;min-height:0;overflow:hidden;display:flex";
    diagramHost = div("archDiagram");
    diagramHost.style.cssText = "flex:1;min-width:0;min-height:0;outline:none";
    // A plain div cannot take focus, so arrow keys would never land here.
    diagramHost.tabIndex = 0;
    body.append(diagramHost, detailsHost);
    content.append(body);

    const restored = viewState.viewId;
    const initial = views.some(candidate => candidate.id === restored) ? (restored as string) : ((views[0]?.id ?? "") as string);
    if (initial !== restored) {
      // The restored view is gone (deleted from the model, or a first mount
      // with nothing saved): the fallback view gets the readable default, not
      // a viewport that belongs to a layout the user is no longer looking at.
      const first = views[0];
      if (first !== undefined) viewState.setViewport(defaultViewport(first.bounds, { width: 0, height: 0 }));
    }
    if (initial !== "") select(initial);

    const section = host.closest("[data-workbench-dock]");
    if (section !== null && observer === undefined && typeof MutationObserver === "function") {
      observer = new MutationObserver(applyDockMode);
      observer.observe(section, { attributes: true, attributeFilter: ["data-dock-mode"] });
    }

    // Views on screen: keep an eye on the model from here on.
    refreshTimer = setInterval(() => {
      void pollRefresh();
    }, options.refreshIntervalMs ?? REFRESH_INTERVAL_MS);
  };

  /** Everything a refresh decision depends on: view ids, hashes, diagnostics. */
  const signatureOf = (payload: WireViewsResponse): string => {
    const viewsPart = (payload.views as readonly DiagramView[])
      .map(candidate => `${candidate.id}@${candidate.hash ?? ""}`)
      .join("|");
    return `${String(payload.hasErrors)}:${String(payload.errors.length)}:${viewsPart}`;
  };

  const pollRefresh = async (): Promise<void> => {
    if (disposed || options.sessionId === undefined || document.hidden) return;
    try {
      const session = encodeURIComponent(options.sessionId);
      const response = await fetchImpl(`${ROUTE_PREFIX}/views?sessionId=${session}`);
      if (!response.ok || disposed) return;
      const payload = (await response.json()) as WireViewsResponse;
      if (signatureOf(payload) === lastSignature) return;
      renderViews(payload);
    } catch {
      // A dropped poll is not an error state; the next tick retries.
    }
  };

  const load = async (): Promise<void> => {
    if (options.sessionId === undefined) {
      setNote("archWaiting", strings.waitingSession);
      return;
    }
    setNote("archWaiting", strings.waitingSession);
    try {
      const session = encodeURIComponent(options.sessionId);
      const viewsResponse = await fetchImpl(`${ROUTE_PREFIX}/views?sessionId=${session}`);
      if (!viewsResponse.ok) throw new Error(`views ${String(viewsResponse.status)}`);
      const payload = (await viewsResponse.json()) as WireViewsResponse;

      try {
        const stateResponse = await fetchImpl(`${ROUTE_PREFIX}/state?sessionId=${session}`);
        if (stateResponse.ok) {
          const saved = (await stateResponse.json()) as WireStateGetResponse;
          if (saved.degraded) {
            // No host store: restores (and every later save) live locally.
            degradedMode = true;
            const local = loadLocalState(options.sessionId);
            if (local !== null) viewState.restore(local);
          } else if (saved.state !== null && saved.state !== undefined) {
            viewState.restore(saved.state);
          }
        }
      } catch {
        // A missing state route must not cost the user the diagrams.
      }

      if (disposed) return;
      renderViews(payload);
    } catch (error) {
      if (disposed) return;
      failLoad(error);
    }
  };

  void load();

  return () => {
    disposed = true;
    observer?.disconnect();
    stopRefresh();
    if (saveTimer !== undefined) clearTimeout(saveTimer);
    // The unmount edge must not swallow the user's last correction: whatever
    // is still dirty goes out now (fire-and-forget; the panel is gone but
    // the fetch survives it).
    if (dirty) void flushSave();
    host.replaceChildren();
  };
}
