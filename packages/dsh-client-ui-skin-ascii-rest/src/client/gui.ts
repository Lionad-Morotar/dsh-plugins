/**
 * The tuning panel.
 *
 * Two kinds of parameter live here, kept separate on purpose:
 *
 *   - `piece` options go to the scene's own frame factory. Every ascii.rest piece
 *     declares the options it accepts in `meta.options`, so the controls are
 *     generated from that declaration rather than guessed.
 *   - `appearance` is this skin's treatment of the picture: how far the scene is
 *     dimmed, blurred, and washed back under the text.
 *
 * The panel is lil-gui because it is the shortest path to a dozen live numeric
 * ranges, and because it hands its whole state back as one JSON object, which is
 * exactly what "save" needs. It is loaded on demand: a reader who never opens the
 * panel never pays for it.
 *
 * `injectStyles: false` matters. lil-gui's own stylesheet is a flat dark panel
 * with its own palette, so the skin rebinds lil-gui's custom properties to the
 * host's tokens instead, and the panel belongs to the application rather than
 * sitting on top of it as a foreign window. What the skin still needs from
 * lil-gui is its layout: without it every control is an unstyled input. So the
 * stylesheet is shipped with the skin (a string, so nothing is fetched at
 * runtime) and injected once, owned and removed like the rest of the skin's CSS.
 */
import GUI from "lil-gui";

import { ANCHORS, FIT_MODES, REGION_KEYS } from "ascii-rest-scenes";
import type { Anchor, FitMode, RegionKey, SceneEntry, SceneModule, Settings } from "ascii-rest-scenes";

import lilGuiCss from "../../vendor/lil-gui.css";
import { PACKAGE_ID } from "./constants.ts";


export interface GuiCallbacks {
  /** A change to the scene's own frame options. */
  onPiece(change: Record<string, number | boolean>): void;
  /** A change to the page's appearance. */
  onAppearance(change: Partial<Settings["appearance"]>): void;
  /** A change to one region's reveal. */
  onRegions(change: Partial<Settings["regions"]>): void;
  /** A change to how the picture is placed. */
  onPlacement(change: Partial<Settings["options"]>): void;
  /** A scene chosen from inside the panel. */
  onScene(sceneId: string): void;
  /** Persist the current settings as they now are. */
  onSave(): void;
  /** Dismiss the panel. */
  onClose(): void;
}

export interface GuiHandle {
  readonly element: HTMLElement;
  /** Rebuild the per-scene controls after the scene changed. */
  rebuild(scene: SceneEntry, module: SceneModule, pieceOptions: Record<string, number | boolean>): void;
  /** Push a stored state into the controls, so they show what is in effect. */
  load(state: unknown): void;
  /** The panel's state as one JSON-serialisable object. */
  capture(): unknown;
  destroy(): void;
}

/**
 * Derive a control's range from a declared default.
 *
 * A piece declares its defaults, not its bounds, and a degenerate 0–0 slider is
 * worse than no slider at all.
 */
export function rangeAround(base: number): { min: number; max: number; step: number } {
  const magnitude = Math.abs(base);
  const span = magnitude === 0 ? 1 : magnitude * 2;
  return {
    min: Math.min(0, base - span),
    max: Math.max(span, base + span),
    // Three decimals so a 0.001-scale option is still settable, and a large one
    // does not need a thousand drags to cross.
    step: span <= 2 ? 0.001 : span <= 20 ? 0.1 : 1,
  };
}

/** Human labels for the nine anchors and the two fit modes. */
const ANCHOR_LABELS: Record<Anchor, string> = {
  "top-left": "左上",
  top: "上中",
  "top-right": "右上",
  left: "左中",
  center: "居中",
  right: "右中",
  "bottom-left": "左下",
  bottom: "下中",
  "bottom-right": "右下",
};

const FIT_LABELS: Record<FitMode, string> = {
  cover: "填满裁切",
  contain: "完整留白",
};

const REGION_LABELS: Record<RegionKey, string> = {
  sidebar: "侧边栏",
  main: "主面板",
  rightbar: "副侧边栏",
  bottom: "底栏",
};

/**
 * Turn a value-to-label table into the shape lil-gui wants.
 *
 * lil-gui reads an option object as label-to-value: `{ "填满裁切": "cover" }`. The
 * tables above are written the other way round because every other consumer here
 * (the settings page, the tests, a reader of this file) looks a label up by the
 * stored value, not the reverse. Passing them straight through silently shows the
 * raw stored values, which is what a dropdown reading "cover" instead of
 * "填满裁切" looks like.
 */
function lilOptions<V extends string>(labels: Record<V, string>): Record<string, V> {
  const out: Record<string, V> = {};
  for (const [value, label] of Object.entries(labels) as [V, string][]) out[label] = value;
  return out;
}

/**
 * How the picture is placed in the window.
 *
 * This is the folder the research demanded: a reader chooses what happens to the
 * overflow and which edge to keep, rather than being handed a scale and an offset
 * and left to solve for the picture's position themselves. `zoom` stays as the
 * one place a numeric nudge still makes sense.
 */
function addPlacementFolder(gui: GUI, options: Settings["options"], callbacks: GuiCallbacks): void {
  const folder = gui.addFolder("摆放");
  const state = {
    fit: options.fit,
    anchor: options.anchor,
    zoom: options.zoom,
  };
  folder
    .add(state, "fit", lilOptions(FIT_LABELS))
    .name("适应方式")
    .onChange((fit: FitMode) => callbacks.onPlacement({ fit }));
  folder
    .add(state, "anchor", lilOptions(ANCHOR_LABELS))
    .name("对齐位置")
    .onChange((anchor: Anchor) => callbacks.onPlacement({ anchor }));
  folder
    .add(state, "zoom", 0.5, 3, 0.01)
    .name("缩放")
    .onChange((zoom: number) => callbacks.onPlacement({ zoom }));
}

/** The four surfaces, on one slider each. */
function addRegionFolder(gui: GUI, regions: Settings["regions"], callbacks: GuiCallbacks): void {
  const folder = gui.addFolder("分区透出");
  const state = { ...regions };
  for (const key of REGION_KEYS) {
    folder
      .add(state, key, 0, 1, 0.01)
      .name(REGION_LABELS[key])
      .onChange((value: number) => callbacks.onRegions({ [key]: value } as Partial<Settings["regions"]>));
  }
}

function addAppearanceFolder(gui: GUI, appearance: Settings["appearance"], callbacks: GuiCallbacks): void {
  const folder = gui.addFolder("画面");
  const state = { ...appearance };
  const emit = (key: keyof Settings["appearance"]): void => {
    callbacks.onAppearance({ [key]: state[key] } as Partial<Settings["appearance"]>);
  };

  folder.add(state, "surface", 0, 1, 0.01).name("面板不透明度").onChange(() => emit("surface"));
  folder.add(state, "opacity", 0, 1, 0.01).name("画面亮度").onChange(() => emit("opacity"));
  folder.add(state, "blur", 0, 16, 0.5).name("模糊").onChange(() => emit("blur"));
  folder.add(state, "veil", 0, 1, 0.01).name("蒙层").onChange(() => emit("veil"));
  folder.add(state, "fps", 0, 30, 1).name("帧率").onChange(() => emit("fps"));
  folder.add(state, "resolution", 0.5, 2, 0.25).name("分辨率").onChange(() => emit("resolution"));
  folder.add(state, "still").name("静止").onChange(() => emit("still"));
  folder.add(state, "pauseOnBlur").name("失焦暂停").onChange(() => emit("pauseOnBlur"));
}

/**
 * The gradient scrim, as two controls.
 *
 * Kept in its own folder because a scrim is not a wash: a reader reaching for it
 * wants one edge quieter, and mixing it into the flat-veil controls makes the two
 * indistinguishable in the panel.
 */
function addScrimFolder(gui: GUI, appearance: Settings["appearance"], callbacks: GuiCallbacks): void {
  const folder = gui.addFolder("渐变遮罩");
  const state = { scrim: appearance.scrim, scrimAngle: appearance.scrimAngle };
  folder
    .add(state, "scrim", 0, 1, 0.01)
    .name("强度")
    .onChange((scrim: number) => callbacks.onAppearance({ scrim }));
  folder
    .add(state, "scrimAngle", 0, 360, 5)
    .name("方向")
    .onChange((scrimAngle: number) => callbacks.onAppearance({ scrimAngle }));
}

/** The scene's own options, generated from both its declaration and any tuning. */
function addPieceFolder(
  gui: GUI,
  declared: Record<string, unknown>,
  tuned: Record<string, number | boolean>,
  callbacks: GuiCallbacks,
): GUI | null {
  const merged: Record<string, number | boolean> = {};
  for (const [key, value] of Object.entries(declared)) {
    if (typeof value === "number" || typeof value === "boolean") merged[key] = value;
  }
  for (const [key, value] of Object.entries(tuned)) merged[key] = value;

  const numeric = Object.entries(merged).filter(([, value]) => typeof value === "number");
  const booleans = Object.entries(merged).filter(([, value]) => typeof value === "boolean");
  if (numeric.length === 0 && booleans.length === 0) return null;

  const folder = gui.addFolder("场景参数");
  const state: Record<string, number | boolean> = { ...merged };

  for (const [key, value] of numeric) {
    const range = rangeAround(value as number);
    folder.add(state, key, range.min, range.max, range.step).onChange((next: number) => {
      callbacks.onPiece({ [key]: next });
    });
  }
  for (const [key] of booleans) {
    folder.add(state, key).onChange((next: boolean) => {
      callbacks.onPiece({ [key]: next });
    });
  }
  return folder;
}

export interface GuiOptions {
  /** The catalog, so the panel can offer every scene rather than only the current one. */
  catalog: readonly SceneEntry[];
  scene: SceneEntry;
  settings: Settings;
  module: SceneModule;
  callbacks: GuiCallbacks;
  /** The accessible name of the close control. */
  closeLabel: string;
}

/**
 * Put lil-gui's layout stylesheet on the page, once.
 *
 * The tag carries `data-plugin` and `data-plugin-css` for the same reason the
 * skin's own stylesheet does: the module loader claims unowned `<style>`
 * elements for whatever plugin was registering at the time and deletes claimed
 * ones on teardown, so an unmarked tag would be either stolen or left behind.
 */
function injectLilGuiStyles(): void {
  if (typeof document === "undefined") return;
  const tagId = "lil-gui/dist/lil-gui.css";
  if (document.querySelector(`style[data-plugin-css=${JSON.stringify(tagId)}]`) !== null) return;
  const tag = document.createElement("style");
  tag.dataset.plugin = PACKAGE_ID;
  tag.dataset.pluginCss = tagId;
  tag.textContent = lilGuiCss;
  document.head.appendChild(tag);
}

/**
 * Build the panel inside `host`.
 *
 * The host element is supplied rather than created, so the caller decides where
 * the panel lives and lil-gui never has to know.
 */
export function createGui(host: HTMLElement, options: GuiOptions): GuiHandle {
  const { callbacks, settings, scene, module } = options;
  injectLilGuiStyles();
  const gui = new GUI({ container: host, title: "ascii.rest", width: 276, injectStyles: false });

  // lil-gui's title toggles the panel between open and collapsed; it has no
  // dismiss, so a reader who opens the panel has no way back out. This adds one,
  // and Escape as a second route, because a floating panel that cannot be
  // dismissed is a trap.
  const close = document.createElement("button");
  close.type = "button";
  close.className = "ascii-rest-gui__close";
  close.textContent = "\u00d7";
  close.setAttribute("aria-label", options.closeLabel);
  close.title = options.closeLabel;
  close.addEventListener("click", () => callbacks.onClose());
  gui.domElement.classList.add("ascii-rest-gui");
  gui.domElement.appendChild(close);

  const onKeyDown = (event: KeyboardEvent): void => {
    if (event.key === "Escape") callbacks.onClose();
  };
  document.addEventListener("keydown", onKeyDown);

  addPlacementFolder(gui, settings.options, callbacks);
  addAppearanceFolder(gui, settings.appearance, callbacks);
  addScrimFolder(gui, settings.appearance, callbacks);
  addRegionFolder(gui, settings.regions, callbacks);
  let pieceFolder = addPieceFolder(gui, (module.meta.options ?? {}) as Record<string, unknown>, settings.piece[scene.id] ?? {}, callbacks);

  const sceneChoice = { scene: scene.id };
  const labels: Record<string, string> = {};
  for (const entry of options.catalog) labels[entry.name] = entry.id;
  gui
    .add(sceneChoice, "scene", labels)
    .name("场景")
    .onChange((id: string) => callbacks.onScene(id));

  gui.add({ save: callbacks.onSave }, "save").name("保存");

  return {
    element: host,
    rebuild: (nextScene, nextModule, pieceOptions) => {
      pieceFolder?.destroy();
      pieceFolder = addPieceFolder(gui, (nextModule.meta.options ?? {}) as Record<string, unknown>, pieceOptions, callbacks);
      sceneChoice.scene = nextScene.id;
      for (const controller of gui.controllersRecursive()) {
        if (controller.property === "scene") controller.updateDisplay();
      }
    },
    load: (state) => {
      if (typeof state === "object" && state !== null) gui.load(state as Record<string, unknown>);
    },
    capture: () => gui.save(),
    destroy: () => {
      document.removeEventListener("keydown", onKeyDown);
      gui.destroy();
    },
  };
}
