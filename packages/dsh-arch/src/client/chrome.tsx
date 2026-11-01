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
 * host boot), one views fetch plus one state fetch per panel mount, no
 * polling. Model-change refresh is the watch slice's concern, not this one.
 */
import type { ArchViewport, WireStateGetResponse, WireViewsResponse } from "../shared.ts";
import { ROUTE_PREFIX } from "../shared.ts";
import type { DiagramChunkModule } from "./chunk-loader.ts";
import type { DiagramHandle, DiagramView } from "./chunk/diagram.ts";
import { createViewState, defaultViewport, type DiagramBounds, type ViewStateHandle } from "./view-state.ts";

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
  tabTitle: "Arch",
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
  let views: readonly DiagramView[] | undefined;
  // Whether the current diagram was last fitted for fullscreen; the exit edge
  // is the only other transition that rewrites the viewport.
  let sawFullscreen = false;
  // Mounts are serialized: a slow chunk load must not land on top of the view
  // the user switched to in the meantime.
  let chain: Promise<void> = Promise.resolve();

  const setNote = (key: string, text: string): void => {
    const note = div(key);
    note.style.cssText = noteStyle;
    note.textContent = text;
    content.replaceChildren(note);
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

  const select = (id: string): void => {
    const target = views?.find(candidate => candidate.id === id);
    if (target === undefined || body === undefined) return;
    paintTabs(id);
    const mountBody = body;
    chain = chain.then(async () => {
      if (disposed) return;
      handle = undefined;
      view = target;
      // An empty beat keeps a switched tab from showing the previous view
      // while the chunk resolves; the renderer clears its host anyway.
      mountBody.replaceChildren();
      handle = await options.mountView(mountBody, target, viewState, options.load);
      if (disposed) return;
      applyDockMode();
    });
  };

  const renderViews = (payload: WireViewsResponse): void => {
    views = payload.views as readonly DiagramView[];
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
    body.style.cssText = "flex:1;min-height:0;overflow:hidden";
    content.append(body);

    const restored = viewState.viewId;
    const initial = views.some(candidate => candidate.id === restored) ? (restored as string) : ((views[0]?.id ?? "") as string);
    if (initial !== "") select(initial);

    const section = host.closest("[data-workbench-dock]");
    if (section !== null && observer === undefined && typeof MutationObserver === "function") {
      observer = new MutationObserver(applyDockMode);
      observer.observe(section, { attributes: true, attributeFilter: ["data-dock-mode"] });
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
          if (saved.state !== null && saved.state !== undefined) viewState.restore(saved.state);
        }
      } catch {
        // A missing state route must not cost the user the diagrams.
      }

      if (disposed) return;
      renderViews(payload);
    } catch (error) {
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
    }
  };

  void load();

  return () => {
    disposed = true;
    observer?.disconnect();
    host.replaceChildren();
  };
}
