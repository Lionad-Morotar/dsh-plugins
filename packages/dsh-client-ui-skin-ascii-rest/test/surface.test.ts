/**
 * Repainting an already-mounted surface.
 *
 * The settings page and the tuning panel both reach the picture through
 * `restyle`, and every field it accepts has to reach `paintChrome`: a field that
 * is read in the type but never assigned leaves a live control that does nothing,
 * which is worse than having no control at all.
 *
 * The renderer needs a canvas and observers that jsdom lacks, so mounting here
 * fails by design (`onError` is called, the layer is torn down). These tests call
 * `restyle` on a surface built with no canvas context by asserting on the layer's
 * inline style instead, through a small fake element tree.
 */
import { JSDOM } from "jsdom";
import { beforeEach, describe, expect, it } from "vitest";

import { presentScene, type Presentation } from "../src/client/surface.ts";

let dom: JSDOM;
let doc: Document;

const SALT_FLAT = {
  id: "salt-flat",
  name: "salt flat",
  cols: 20,
  rows: 10,
  cell: 1,
  fps: 15,
  resolution: 1,
  ground: "#000000",
  palette: ["#ffffff", "#888888", "#333333"],
  options: {},
};

/** A scene module the renderer accepts: a factory returning one static frame. */
const module = {
  meta: SALT_FLAT,
  default: () => () => " ".repeat(SALT_FLAT.cols),
};

function presentation(overrides: Partial<Presentation> = {}): Presentation {
  return {
    scene: SALT_FLAT as unknown as Presentation["scene"],
    module: module as unknown as Presentation["module"],
    pieceOptions: {},
    opacity: 1,
    blur: 0,
    veil: 0.1,
    scrim: 0,
    scrimAngle: 180,
    still: false,
    fps: 0,
    resolution: 1,
    paper: { softness: 0.55, saturation: 0.5 },
    pauseOnBlur: true,
    geometry: { fit: "cover", anchor: "center", zoom: 1 },
    ...overrides,
  };
}

/** The layer's scrim element, which is the last child by construction. */
function scrimOf(surface: { element: HTMLElement }): HTMLElement {
  const kids = [...surface.element.children];
  return kids[kids.length - 1] as HTMLElement;
}

beforeEach(() => {
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
  window.matchMedia = ((query: string) => ({
    matches: false,
    media: query,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    onchange: null,
    dispatchEvent: () => false,
  })) as unknown as typeof matchMedia;
  // `surface.ts` reads the ambient `window` (it runs in the browser, where the
  // document and the window are the same realm), so the test has to offer the
  // jsdom window as the global one before mounting.
  (globalThis as unknown as { window: unknown }).window = window;
  (globalThis as unknown as { document: unknown }).document = doc;

  // jsdom has no canvas context; the renderer reports the failure and tears the
  // layer down, so the tests below run against the layer while it exists.
  Object.defineProperty(window.HTMLCanvasElement.prototype, "getContext", {
    configurable: true,
    value: () => null,
  });
});

describe("restyle", () => {
  it("applies the scrim and its angle instead of leaving the mount-time value", () => {
    const surface = presentScene(presentation(), doc);
    const scrim = scrimOf(surface);
    expect(scrim.style.opacity).toBe("0");

    surface.restyle({
      opacity: 1,
      blur: 0,
      veil: 0.1,
      scrim: 0.8,
      scrimAngle: 90,
      still: false,
      fps: 0,
      resolution: 1,
      pauseOnBlur: true,
    });

    expect(scrim.style.opacity).toBe("0.8");
    expect(scrim.style.background).toContain("90deg");
    // The gradient has to be spelled in the ground's own colour, so the fade does
    // not pass through transparent black and grey the pale light scheme.
    expect(scrim.style.background).toContain("rgba");
    surface.dispose();
  });

  it("clears the gradient when the strength returns to zero", () => {
    const surface = presentScene(presentation({ scrim: 0.6 }), doc);
    expect(scrimOf(surface).style.background).not.toBe("");

    surface.restyle({
      opacity: 1,
      blur: 0,
      veil: 0.1,
      scrim: 0,
      scrimAngle: 180,
      still: false,
      fps: 0,
      resolution: 1,
      pauseOnBlur: true,
    });
    expect(scrimOf(surface).style.background).toBe("");
    surface.dispose();
  });

  it("binds and unbinds the focus listeners as the switch changes", () => {
    // Count the listeners by intercepting registration: jsdom offers no way to
    // read them back, and "the switch did nothing" is exactly the bug this
    // guards against.
    const bound = new Map<string, number>();
    const add = dom.window.addEventListener.bind(dom.window);
    const remove = dom.window.removeEventListener.bind(dom.window);
    dom.window.addEventListener = ((type: string, ...rest: unknown[]) => {
      bound.set(type, (bound.get(type) ?? 0) + 1);
      return (add as (...args: unknown[]) => void)(type, ...rest);
    }) as typeof dom.window.addEventListener;
    dom.window.removeEventListener = ((type: string, ...rest: unknown[]) => {
      bound.set(type, (bound.get(type) ?? 0) - 1);
      return (remove as (...args: unknown[]) => void)(type, ...rest);
    }) as typeof dom.window.removeEventListener;

    const surface = presentScene(presentation({ pauseOnBlur: true }), doc);
    expect(bound.get("blur")).toBe(1);
    expect(bound.get("focus")).toBe(1);

    const restyle = (pauseOnBlur: boolean): void =>
      surface.restyle({
        opacity: 1,
        blur: 0,
        veil: 0.1,
        scrim: 0,
        scrimAngle: 180,
        still: false,
        fps: 0,
        resolution: 1,
        pauseOnBlur,
      });

    restyle(false);
    expect(bound.get("blur")).toBe(0);
    expect(bound.get("focus")).toBe(0);

    // Turning it off twice must not go negative: `bindBlur` is idempotent.
    restyle(false);
    expect(bound.get("blur")).toBe(0);

    restyle(true);
    expect(bound.get("blur")).toBe(1);
    surface.dispose();
    // Disposal unbinds whatever is still bound.
    expect(bound.get("blur")).toBe(0);
  });
});
