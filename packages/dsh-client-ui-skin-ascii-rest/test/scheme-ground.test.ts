/**
 * The colours the background canvas paints.
 *
 * The renderer fills the whole canvas with the piece's `ground` before it draws a
 * single glyph, so the ground is not a hint passed down for decoration: it is the
 * colour the reader sees wherever no character is. A piece mounted with the dark
 * ground on a light page paints a black slab over the paper surface the token
 * layer just made translucent, which is the bug this file exists to prevent.
 *
 * These tests mock the renderer because jsdom has no canvas context, and because
 * the piece handed to `mount` is the contract under test.
 */
import { JSDOM } from "jsdom";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { mountSpy } = vi.hoisted(() => ({
  // Typed as a variadic so `mock.calls` keeps the arguments: the piece is the
  // second one, and reading it back is the whole point of this file.
  mountSpy: vi.fn((..._args: unknown[]) =>
    Object.assign(() => {}, {
      pause: () => {},
      resume: () => {},
      now: () => 0,
    }),
  ),
}));

vi.mock("../src/mount.ts", () => ({ mount: mountSpy }));

import { DUOTONE_PAPER, sceneColors, type LightMode } from "ascii-rest-scenes";

import { DARK_ATTRIBUTE, presentScene, type Presentation } from "../src/client/surface.ts";

/** A scene the renderer accepts: one static frame, one colour per cell. */
const SCENE = {
  id: "salt-flat",
  name: "salt flat",
  note: "a triangle over a mirror of salt",
  cols: 20,
  rows: 10,
  cell: 1,
  fps: 15,
  ground: "#000000",
  palette: ["#ffffff", "#888888", "#333333"],
  still: 0,
};

const module = {
  meta: SCENE,
  default: () => () => " ".repeat(SCENE.cols),
};

function presentation(overrides: Partial<Presentation> = {}): Presentation {
  return {
    scene: SCENE as unknown as Presentation["scene"],
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
    lightMode: "ink",
    pauseOnBlur: true,
    geometry: { fit: "cover", anchor: "center", zoom: 1 },
    ...overrides,
  };
}

let dom: JSDOM;
let doc: Document;

/** The piece the renderer was last handed, which is where the colours live. */
function mountedPiece(): { meta: { ground?: string; palette?: readonly string[] } } {
  const call = mountSpy.mock.calls[mountSpy.mock.calls.length - 1];
  if (call === undefined) throw new Error("the renderer was never mounted");
  return call[1] as unknown as { meta: { ground?: string; palette?: readonly string[] } };
}

const expected = (mode: LightMode) => sceneColors(SCENE, "light", mode);

beforeEach(() => {
  mountSpy.mockClear();
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
  (globalThis as unknown as { window: unknown }).window = window;
  (globalThis as unknown as { document: unknown }).document = doc;
});

describe("the canvas colours", () => {
  it("keeps the piece's own ground and palette in the dark scheme", () => {
    doc.body.setAttribute(DARK_ATTRIBUTE, "");
    const surface = presentScene(presentation(), doc);

    expect(mountedPiece().meta.ground).toBe(SCENE.ground);
    expect(mountedPiece().meta.palette).toEqual(SCENE.palette);
    surface.dispose();
  });

  it("turns the picture into ink on paper in the light scheme", () => {
    const surface = presentScene(presentation({ lightMode: "ink" }), doc);

    expect(mountedPiece().meta.ground).toBe(expected("ink").ground);
    expect(mountedPiece().meta.palette).toEqual(expected("ink").palette);
    surface.dispose();
  });

  it("paints the duotone plate's paper in the light scheme when that mode is chosen", () => {
    const surface = presentScene(presentation({ lightMode: "duotone" }), doc);

    expect(mountedPiece().meta.ground).toBe(DUOTONE_PAPER);
    expect(mountedPiece().meta.palette).toEqual(expected("duotone").palette);
    surface.dispose();
  });

  it("never hands the renderer the scene's dark ground on a light page", () => {
    for (const mode of ["ink", "duotone"] as const) {
      const surface = presentScene(presentation({ lightMode: mode }), doc);
      expect(mountedPiece().meta.ground).not.toBe(SCENE.ground);
      surface.dispose();
    }
  });

  it("re-mounts with the other scheme's colours when the host flips the theme", () => {
    const surface = presentScene(presentation(), doc);
    expect(mountedPiece().meta.ground).toBe(expected("ink").ground);

    doc.body.setAttribute(DARK_ATTRIBUTE, "");
    surface.rescheme();

    expect(mountedPiece().meta.ground).toBe(SCENE.ground);
    surface.dispose();
  });
});
