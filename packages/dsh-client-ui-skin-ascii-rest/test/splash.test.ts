/**
 * The splash layer: what it puts on the page, when it leaves, and what it does
 * when the scene will not mount.
 *
 * The layer is the first thing a reader sees on a cold start, so the timing is
 * the feature. These tests drive the clock by hand and assert the boundaries
 * (ready plus the minimum, the maximum wait, the fade itself) instead of
 * sleeping through them, which is the only way to catch an off-by-one on a
 * deadline that a reader would feel but never report.
 *
 * jsdom has no canvas context, so the renderer degrades to its detached handle:
 * the layer and its canvas still exist in the DOM, which is exactly what the
 * layer's own behaviour is about.
 */
import { JSDOM } from "jsdom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { sceneColors } from "ascii-rest-scenes";
import type { SceneModule } from "ascii-rest-scenes";

import { DEFAULT_SPLASH_TIMING, playSplash, type SplashOptions } from "../src/client/splash.ts";

let dom: JSDOM;
let doc: Document;

const SCENE = {
  id: "salt-flat",
  name: "salt flat",
  note: "the vercel triangle over a mirror of salt",
  cols: 20,
  rows: 10,
  cell: 1,
  fps: 15,
  ground: "#000000",
  palette: ["#ffffff", "#888888"],
  still: 0,
};

/** A scene module the renderer accepts: a factory returning one static frame. */
const MODULE = {
  meta: SCENE,
  default: () => () => " ".repeat(SCENE.cols),
};

/** A module whose factory throws, standing in for a chunk that will not play. */
const BROKEN_MODULE = {
  meta: SCENE,
  default: () => {
    throw new Error("ascii.rest: salt-flat has no piece");
  },
};

function splashOptions(overrides: Partial<SplashOptions> = {}): SplashOptions {
  return {
    doc,
    scene: SCENE as unknown as SplashOptions["scene"],
    module: MODULE as unknown as SplashOptions["module"],
    pieceOptions: {},
    lightMode: "ink",
    still: false,
    fps: 15,
    resolution: 1,
    ...overrides,
  };
}

/** The layer as it is on the page right now, or null once it is gone. */
function layer(): HTMLElement | null {
  return doc.querySelector("[data-ascii-rest-splash]");
}

/**
 * The colour a browser would report for a hex value.
 *
 * jsdom normalises `backgroundColor` to `rgb(...)`, so comparing against the
 * hex directly would assert jsdom's serialiser rather than the layer's colour.
 */
function rgbOf(hex: string): string {
  const probe = doc.createElement("div");
  probe.style.backgroundColor = hex;
  return probe.style.backgroundColor;
}

function stubMatchMedia(reducedMotion: boolean): void {
  const stub = ((query: string) => ({
    matches: reducedMotion && query.includes("prefers-reduced-motion"),
    media: query,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    onchange: null,
    dispatchEvent: () => false,
  })) as unknown as typeof matchMedia;
  (globalThis as unknown as { matchMedia: unknown }).matchMedia = stub;
  (dom.window as unknown as { matchMedia: unknown }).matchMedia = stub;
}

beforeEach(() => {
  vi.useFakeTimers();
  dom = new JSDOM("<!doctype html><html><body></body></html>", {
    url: "http://127.0.0.1/",
    pretendToBeVisual: true,
  });
  doc = dom.window.document;
  const { window } = dom;
  window.ResizeObserver = class {
    observe(): void {}
    disconnect(): void {}
  } as unknown as typeof ResizeObserver;
  window.IntersectionObserver = class {
    observe(): void {}
    disconnect(): void {}
  } as unknown as typeof IntersectionObserver;
  stubMatchMedia(false);
  // `splash.ts` reads the ambient `window` and `document`, the way `surface.ts`
  // does: in the browser they are the same realm as the page it paints into.
  (globalThis as unknown as { window: unknown }).window = window;
  (globalThis as unknown as { document: unknown }).document = doc;
  // The renderer also tests `el instanceof HTMLCanvasElement` against the bare
  // global, so the constructor has to be reachable without `window.`.
  (globalThis as unknown as { HTMLCanvasElement: unknown }).HTMLCanvasElement = window.HTMLCanvasElement;
  (globalThis as unknown as { devicePixelRatio: unknown }).devicePixelRatio = 1;

  Object.defineProperty(window.HTMLCanvasElement.prototype, "getContext", {
    configurable: true,
    value: () => null,
  });
});

afterEach(() => {
  vi.useRealTimers();
  dom.window.close();
});

describe("playSplash", () => {
  it("puts a full-screen layer on the page before it returns", () => {
    const splash = playSplash(splashOptions());
    const element = layer();

    expect(element).not.toBeNull();
    expect(splash.element).toBe(element);
    expect(element?.getAttribute("aria-hidden")).toBe("true");
    expect(element?.style.position).toBe("fixed");
    expect(element?.style.inset).toMatch(/^0(px)?$/);
    expect(element?.style.zIndex).toBe("2147483500");
    expect(element?.style.overflow).toBe("hidden");
    expect(element?.style.contain).toBe("strict");
    expect(element?.style.pointerEvents).toBe("auto");
    expect(element?.style.opacity).toBe("1");
    // The layer is opaque from the first frame: the boot page underneath is the
    // thing it exists to cover, so a transparent start would show both.
    expect(element?.style.backgroundColor).toBe(rgbOf(sceneColors(SCENE, "light", "ink").ground));
  });

  it("mounts the scene inside the layer, above the layer's own ground", () => {
    playSplash(splashOptions());
    const element = layer();
    const canvas = element?.querySelector("canvas");

    expect(canvas).not.toBeNull();
    // The scene layer is `presentScene`'s, which defaults to -1 so it can sit
    // behind the shell. Inside the splash there is nothing behind it to sit
    // behind, and a negative index would put it under the ground colour.
    expect((canvas?.parentElement as HTMLElement | null)?.style.zIndex).toBe("0");
  });

  it("stays put while the host is still showing its boot page", () => {
    doc.body.innerHTML = '<div data-dsh-boot></div>';
    playSplash(splashOptions());

    vi.advanceTimersByTime(3000);

    expect(layer()?.style.opacity).toBe("1");
  });

  it("stays put when the boot page is gone but the shell has not rendered", () => {
    playSplash(splashOptions());

    vi.advanceTimersByTime(3000);

    expect(layer()?.style.opacity).toBe("1");
  });

  it("fades once the shell is ready and the minimum has passed", () => {
    doc.body.innerHTML = '<div data-shell-bottom></div>';
    const onEnd = vi.fn();
    playSplash(splashOptions({ onEnd }));

    vi.advanceTimersByTime(DEFAULT_SPLASH_TIMING.minVisibleMs - DEFAULT_SPLASH_TIMING.pollMs);
    expect(layer()?.style.opacity).toBe("1");

    vi.advanceTimersByTime(DEFAULT_SPLASH_TIMING.pollMs);
    expect(layer()?.style.opacity).toBe("0");
    expect(layer()?.style.transition).toBe(`opacity ${String(DEFAULT_SPLASH_TIMING.fadeMs)}ms ease-out`);
    expect(onEnd).not.toHaveBeenCalled();

    vi.advanceTimersByTime(DEFAULT_SPLASH_TIMING.fadeMs);
    expect(layer()).toBeNull();
    expect(onEnd).toHaveBeenCalledTimes(1);
  });

  it("fades at the deadline even if the host never says it is ready", () => {
    doc.body.innerHTML = '<div data-dsh-boot></div>';
    const onEnd = vi.fn();
    playSplash(splashOptions({ onEnd }));

    vi.advanceTimersByTime(DEFAULT_SPLASH_TIMING.maxWaitMs);
    expect(layer()?.style.opacity).toBe("0");

    vi.advanceTimersByTime(DEFAULT_SPLASH_TIMING.fadeMs);
    expect(layer()).toBeNull();
    expect(onEnd).toHaveBeenCalledTimes(1);
  });

  it("disposes once, stops the clock, and never reports an end", () => {
    const onEnd = vi.fn();
    const splash = playSplash(splashOptions({ onEnd }));

    splash.dispose();
    splash.dispose();

    expect(layer()).toBeNull();
    expect(vi.getTimerCount()).toBe(0);

    vi.advanceTimersByTime(10_000);
    expect(onEnd).not.toHaveBeenCalled();
  });

  it("fades without a transition when the reader asked for less motion", () => {
    stubMatchMedia(true);
    doc.body.innerHTML = '<div data-shell-bottom></div>';
    const onEnd = vi.fn();
    playSplash(splashOptions({ onEnd }));

    vi.advanceTimersByTime(DEFAULT_SPLASH_TIMING.minVisibleMs);
    expect(layer()?.style.transition).toBe("opacity 0ms ease-out");
    expect(layer()?.style.opacity).toBe("0");

    vi.advanceTimersByTime(1);
    expect(layer()).toBeNull();
    expect(onEnd).toHaveBeenCalledTimes(1);
  });

  it("covers the page before the scene has even arrived", async () => {
    // The boot page is already painted when this runs, so the layer and its
    // ground cannot wait for a chunk fetch: only the canvas may.
    let deliver: (module: SceneModule) => void = () => {};
    const pending = new Promise<SceneModule>((resolve) => {
      deliver = resolve;
    });
    playSplash(splashOptions({ module: pending }));

    expect(layer()).not.toBeNull();
    expect(layer()?.style.backgroundColor).toBe(rgbOf(sceneColors(SCENE, "light", "ink").ground));
    expect(layer()?.querySelector("canvas")).toBeNull();

    deliver(MODULE as unknown as SceneModule);
    await Promise.resolve();

    expect(layer()?.querySelector("canvas")).not.toBeNull();
  });

  it("reports a scene promise that never delivers and leaves nothing behind", async () => {
    const onError = vi.fn();
    playSplash(splashOptions({ module: Promise.reject(new Error("chunk 404")), onError }));

    await Promise.resolve();
    await Promise.resolve();

    expect(onError).toHaveBeenCalledTimes(1);
    expect(layer()).toBeNull();
  });

  it("does not mount a scene that arrives after the layer was disposed", async () => {
    let deliver: (module: SceneModule) => void = () => {};
    const pending = new Promise<SceneModule>((resolve) => {
      deliver = resolve;
    });
    const splash = playSplash(splashOptions({ module: pending }));
    splash.dispose();

    deliver(MODULE as unknown as SceneModule);
    await Promise.resolve();

    expect(layer()).toBeNull();
  });

  it("honours a shorter minimum when the caller asks for one", () => {
    // A new conversation reuses this engine with the reader's own duration, so
    // the minimum has to be the caller's, not the cold start's.
    doc.body.innerHTML = '<div data-shell-bottom></div>';
    const onEnd = vi.fn();
    playSplash(splashOptions({ timing: { minVisibleMs: 600 }, onEnd }));

    vi.advanceTimersByTime(600 - DEFAULT_SPLASH_TIMING.pollMs);
    expect(layer()?.style.opacity).toBe("1");

    vi.advanceTimersByTime(DEFAULT_SPLASH_TIMING.pollMs);
    expect(layer()?.style.opacity).toBe("0");
    expect(onEnd).not.toHaveBeenCalled();

    vi.advanceTimersByTime(DEFAULT_SPLASH_TIMING.fadeMs);
    expect(layer()).toBeNull();
    expect(onEnd).toHaveBeenCalledTimes(1);
  });

  it("reports a scene that will not mount and leaves nothing behind", () => {
    const onError = vi.fn();
    const onEnd = vi.fn();
    playSplash(
      splashOptions({ module: BROKEN_MODULE as unknown as SplashOptions["module"], onError, onEnd }),
    );

    expect(onError).toHaveBeenCalledTimes(1);
    expect(layer()).toBeNull();

    // A failed splash is not a slow one: nothing is left polling behind it.
    vi.advanceTimersByTime(10_000);
    expect(onError).toHaveBeenCalledTimes(1);
    expect(onEnd).not.toHaveBeenCalled();
  });
});
