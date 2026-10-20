/**
 * The background surface: a canvas that covers the window and plays one scene.
 *
 * This is the DOM half. It owns three things the pure modules cannot:
 *
 *   1. Where the surface sits. The host shell paints an opaque
 *      `--dsw-alias-bg-base` on its own frame element, so the picture goes into
 *      a layer behind everything — `position: fixed` with `z-index: -1` as the
 *      first child of `body` — and the theme override makes that token
 *      translucent so the layer shows through. The skin never names one of the
 *      shell's generated class names.
 *   2. Playing frames. ascii.rest's own renderer is reused (vendored in
 *      `../mount.ts`) rather than reimplemented: it already owns the glyph
 *      atlas, the per-cell dirty check, the IntersectionObserver, tab visibility
 *      and reduced motion.
 *   3. Turning the piece's palette into the active scheme's palette. The
 *      renderer reads the palette off the piece at mount time, so a scheme
 *      change re-mounts with a themed piece instead of mutating one.
 */
import { fitCover } from "ascii-rest-scenes";
import { sceneGround, scenePalette, type PaperifyOptions } from "ascii-rest-scenes";
import type { Anchor, FitMode, SceneEntry, SceneModule } from "ascii-rest-scenes";

import { mount, type MountHandle, type Piece } from "../mount.ts";

/** The same colour at zero alpha, spelled as `#rrggbb00` so a gradient fades to it. */
function withAlphaf(hex: string, alpha: number): string {
  return `${hex}${Math.round(Math.max(0, Math.min(1, alpha)) * 255)
    .toString(16)
    .padStart(2, "0")}`;
}

/** The attribute the host shell sets on `body` for the dark palette. */
export const DARK_ATTRIBUTE = "data-ds-dark-theme";

/** Marks the layer this plugin owns, so a second instance leaves it alone. */
export const LAYER_ATTRIBUTE = "data-ascii-rest-layer";

export type Scheme = "light" | "dark";

/** Read the scheme the host shell is currently showing. */
export function currentScheme(doc: Document = document): Scheme {
  return doc.body.hasAttribute(DARK_ATTRIBUTE) ? "dark" : "light";
}

export interface Geometry {
  /** `cover` crops the overflow, `contain` shows the whole picture. */
  fit: FitMode;
  /** Which edge of the picture survives the crop. */
  anchor: Anchor;
  /** Fine adjustment on top of the fit mode; 1 is none. */
  zoom: number;
}

export interface Presentation {
  /** The scene to play, as the catalog describes it. */
  scene: SceneEntry;
  /** The scene's module, already imported. */
  module: SceneModule;
  /** The scene's own frame options. */
  pieceOptions: Record<string, number | boolean>;
  /** 1 is fully opaque, 0 hides the surface. */
  opacity: number;
  /** A blur in CSS px. */
  blur: number;
  /** How strongly the ground is washed back over the picture. */
  veil: number;
  /** How strong the directional gradient scrim is, 0 for none. */
  scrim: number;
  /** The direction the scrim darkens towards, in degrees clockwise from up. */
  scrimAngle: number;
  /** Hold the picture still regardless of the reader's motion setting. */
  still: boolean;
  /** Stop playing while the window is not focused. */
  pauseOnBlur: boolean;
  /** Frames per second; 0 holds a single frame. */
  fps: number;
  /** The colour treatment for the light scheme. */
  paper: PaperifyOptions;
  geometry: Geometry;
  /** Called once with the first failure; the layer is gone by then. */
  onError?: (error: unknown) => void;
}

export interface Surface {
  readonly element: HTMLDivElement;
  /** Re-solve size and offset, for a window resize or changed geometry. */
  relayout(geometry?: Geometry): void;
  /** Re-read the scheme and repaint. Cheap when the scheme did not change. */
  rescheme(): void;
  /** Repaint the wash and the filter stack without touching the frame loop. */
  restyle(
    next: Pick<
      Presentation,
      "opacity" | "blur" | "veil" | "scrim" | "scrimAngle" | "still" | "fps" | "pauseOnBlur"
    >,
  ): void;
  /** Remove the layer and stop the frame loop. Idempotent. */
  dispose(): void;
}

/**
 * Mount one scene as the page background.
 *
 * The canvas fills the box the cover maths solves for, so the picture is scaled
 * uniformly and cropped, never stretched.
 */
export function presentScene(presentation: Presentation, doc: Document = document): Surface {
  const { scene } = presentation;

  let geometry = presentation.geometry;
  let scheme = currentScheme(doc);
  let stop: MountHandle | null = null;
  let disposed = false;
  let currentFps = presentation.still ? 0 : presentation.fps;

  const layer = doc.createElement("div");
  layer.setAttribute(LAYER_ATTRIBUTE, "");
  layer.setAttribute("aria-hidden", "true");
  layer.style.position = "fixed";
  layer.style.inset = "0";
  layer.style.zIndex = "-1";
  layer.style.overflow = "hidden";
  layer.style.pointerEvents = "none";
  // `contain` keeps the canvas' repaints from invalidating the shell above it.
  layer.style.contain = "strict";

  const canvas = doc.createElement("canvas");
  canvas.style.position = "absolute";
  canvas.style.display = "block";
  canvas.style.left = "0";
  canvas.style.top = "0";

  const veil = doc.createElement("div");
  veil.setAttribute("aria-hidden", "true");
  veil.style.position = "absolute";
  veil.style.inset = "0";
  veil.style.pointerEvents = "none";

  // The scrim is a separate element from the veil because the two answer
  // different problems. The veil is flat: it holds the picture back everywhere,
  // which is what a dense scene needs under body text. The scrim is directional:
  // it fades one edge towards the ground, so the composer at the bottom and the
  // sidebar at the side have somewhere quiet to sit while the rest of the picture
  // stays bright. One element cannot do both without a gradient on the same node
  // as a flat fill.
  //
  // "The ground" is the scheme's own ground, not black: in the dark scheme the
  // fade darkens, and in the light scheme the same fade goes towards paper. Using
  // black in both would put a soot smudge across a pale background.
  const scrim = doc.createElement("div");
  scrim.setAttribute("aria-hidden", "true");
  scrim.style.position = "absolute";
  scrim.style.inset = "0";
  scrim.style.pointerEvents = "none";

  layer.append(canvas, veil, scrim);

  const ground = (): string => sceneGround(scene.ground, scheme, presentation.paper);

  const paintChrome = (): void => {
    layer.style.backgroundColor = ground();
    layer.style.opacity = String(presentation.opacity);
    layer.style.filter = presentation.blur > 0 ? `blur(${String(presentation.blur)}px)` : "";
    // The wash is the ground laid back over the picture, which is what makes a
    // dense scene readable under text without dimming the whole shell.
    veil.style.backgroundColor = ground();
    veil.style.opacity = String(presentation.veil);

    // A scrim angle of 0 fades downwards from the top edge; the gradient runs
    // the other way, so the dark stop is at 100% of the axis the angle names.
    // `transparent` is deliberately spelled out as the ground at zero alpha: a
    // plain `transparent` keyword interpolates through transparent black in some
    // engines, which greys the pale light-mode ground as it fades.
    const strength = presentation.scrim;
    scrim.style.opacity = String(strength);
    scrim.style.background =
      strength > 0
        ? `linear-gradient(${String(presentation.scrimAngle)}deg, ${ground()} 0%, ${withAlphaf(ground(), 0)} 62%)`
        : "";
  };

  const startFrames = (): void => {
    stop?.();
    stop = null;
    currentFps = presentation.still ? 0 : presentation.fps;
    // The renderer reads the palette from the piece once, so the themed piece
    // carries the scheme's palette rather than the module's own.
    const themed: Piece = {
      meta: {
        ...presentation.module.meta,
        palette: scenePalette(scene.palette, scheme, presentation.paper),
        ground: scene.ground,
      },
      default: presentation.module.default,
    };
    try {
      stop = mount(canvas, themed, {
        ...presentation.pieceOptions,
        fps: currentFps,
        // `motion` here means "the page has its own motion control", not "ignore
        // the reader": the host is a desktop application and the skin exposes a
        // still switch in its own settings, so the toggle is the reader's say.
        motion: true,
      });
    } catch (error) {
      teardown();
      presentation.onError?.(error);
    }
  };

  const relayout = (next?: Geometry): void => {
    if (disposed) return;
    if (next !== undefined) geometry = next;
    const box = fitCover(scene, window.innerWidth, window.innerHeight, geometry);
    canvas.style.width = `${String(box.width)}px`;
    canvas.style.height = `${String(box.height)}px`;
    canvas.style.left = `${String(box.left)}px`;
    canvas.style.top = `${String(box.top)}px`;
  };

  const teardown = (): void => {
    stop?.();
    stop = null;
    layer.remove();
  };

  const onResize = (): void => relayout();

  // The application window losing focus is the case requirement 3 names. The
  // renderer already stops for a hidden tab, but a background window is still
  // "visible" to the document, so it kept painting at full rate behind whatever
  // the reader switched to. Pausing here costs one boolean and saves the frames.
  const onBlur = (): void => stop?.pause();
  const onFocus = (): void => stop?.resume();

  /**
   * Bind or unbind the focus listeners.
   *
   * The switch is live: turning it off in the settings page has to stop the
   * listeners, not merely be ignored until the next reload. `blurWhileHidden`
   * tracks the binding so the same state is never bound twice.
   */
  let blurBound = false;
  const bindBlur = (wanted: boolean): void => {
    if (wanted === blurBound) return;
    blurBound = wanted;
    if (wanted) {
      window.addEventListener("blur", onBlur);
      window.addEventListener("focus", onFocus);
    } else {
      window.removeEventListener("blur", onBlur);
      window.removeEventListener("focus", onFocus);
    }
  };

  try {
    doc.body.prepend(layer);
    paintChrome();
    startFrames();
    relayout();
  } catch (error) {
    teardown();
    presentation.onError?.(error);
  }

  window.addEventListener("resize", onResize);
  bindBlur(presentation.pauseOnBlur);

  return {
    element: layer,
    relayout,
    rescheme: (): void => {
      if (disposed) return;
      const next = currentScheme(doc);
      if (next === scheme) return;
      scheme = next;
      paintChrome();
      startFrames();
      relayout();
    },
    restyle: (next): void => {
      if (disposed) return;
      presentation.opacity = next.opacity;
      presentation.blur = next.blur;
      presentation.veil = next.veil;
      presentation.scrim = next.scrim;
      presentation.scrimAngle = next.scrimAngle;
      presentation.pauseOnBlur = next.pauseOnBlur;
      bindBlur(next.pauseOnBlur);
      paintChrome();
      const wantedFps = next.still ? 0 : next.fps;
      if (wantedFps !== currentFps) {
        presentation.still = next.still;
        presentation.fps = next.fps;
        startFrames();
      }
    },
    dispose: (): void => {
      if (disposed) return;
      disposed = true;
      window.removeEventListener("resize", onResize);
      bindBlur(false);
      teardown();
    },
  };
}
