/**
 * The tuning panel's contract with its caller.
 *
 * The panel is built by `createGui` inside a host element the caller supplies,
 * and the close control added here is the only way out: lil-gui's own title
 * toggles between expanded and collapsed, so without this a reader who opens the
 * panel has no way to dismiss it. That is what these tests pin.
 */
import { JSDOM } from "jsdom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { SceneEntry, SceneModule } from "ascii-rest-scenes";
import { createGui } from "../src/client/gui.ts";

const scene: SceneEntry = {
  id: "salt-flat",
  name: "salt flat",
  note: "the vercel triangle over a mirror of salt",
  cols: 200,
  rows: 100,
  cell: 1,
  fps: 15,
  ground: "#000000",
  palette: ["#ffffff", "#000000"],
  still: 0,
};

const module: SceneModule = {
  meta: {
    name: "salt flat",
    cols: 200,
    rows: 100,
    fps: 15,
    options: { softness: 0.55, mirror: true },
  },
  default: () => () => "",
};

let dom: JSDOM;

beforeEach(() => {
  dom = new JSDOM("<!doctype html><html><body></body></html>", { url: "http://127.0.0.1/" });
  // lil-gui asks matchMedia whether to enable its touch layer.
  dom.window.matchMedia = ((query: string) => ({
    matches: false,
    media: query,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    onchange: null,
    dispatchEvent: () => false,
  })) as unknown as typeof matchMedia;
  vi.stubGlobal("document", dom.window.document);
  vi.stubGlobal("window", dom.window);
});

function build() {
  const onClose = vi.fn();
  const host = dom.window.document.createElement("div");
  dom.window.document.body.append(host);
  const handle = createGui(host, {
    catalog: [scene],
    scene,
    settings: {
      scene: "salt-flat",
      options: { softness: 0.55, saturation: 0.5, zoom: 1, offsetX: 0, offsetY: 0 },
      appearance: { opacity: 1, surface: 1, blur: 0, veil: 0.12, still: false, fps: 15 },
      piece: {},
    },
    module,
    callbacks: {
      onPiece: () => {},
      onAppearance: () => {},
      onScene: () => {},
      onSave: () => {},
      onClose,
    },
    closeLabel: "关闭调参面板",
  });
  return { handle, host, onClose };
}

describe("the tuning panel", () => {
  it("offers a labelled close control that dismisses the panel", () => {
    const { host, onClose } = build();
    const close = host.querySelector<HTMLButtonElement>("button.ascii-rest-gui__close");
    expect(close).not.toBeNull();
    expect(close?.getAttribute("aria-label")).toBe("关闭调参面板");

    close?.click();
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("closes on Escape", () => {
    const { onClose } = build();
    dom.window.document.dispatchEvent(new dom.window.KeyboardEvent("keydown", { key: "Escape" }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("stops listening for Escape once destroyed", () => {
    const { handle, onClose } = build();
    handle.destroy();
    dom.window.document.dispatchEvent(new dom.window.KeyboardEvent("keydown", { key: "Escape" }));
    expect(onClose).not.toHaveBeenCalled();
  });
});
