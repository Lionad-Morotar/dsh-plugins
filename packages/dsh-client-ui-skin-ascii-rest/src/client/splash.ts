/**
 * The splash: the scene, full screen, for the moment before the shell exists.
 *
 * A cold start shows the host's own boot page for as long as the client takes
 * to mount, and then the shell appears. This layer covers that gap with the
 * scene the reader picked, so the first thing they see is the picture rather
 * than a loading screen, and the handover is a fade instead of a swap.
 *
 * Three things make it a layer rather than a page of its own:
 *
 *   1. It is opaque and on top from the first frame, because the boot page it
 *      exists to hide is already painted underneath.
 *   2. It leaves on a condition, not a duration: the host says it is ready
 *      (its boot page is gone and its shell has rendered), and the layer then
 *      waits out a minimum so a fast start does not flash.
 *   3. It always leaves. A deadline fades it whatever the host is doing, since
 *      a splash that outlives a broken start is worse than no splash.
 */
import { sceneColors } from "ascii-rest-scenes";
import type { LightMode, SceneEntry, SceneModule } from "ascii-rest-scenes";

import { currentScheme, presentScene, type Surface } from "./surface.ts";

/** Marks the layer this plugin owns, so a second instance leaves it alone. */
export const SPLASH_ATTRIBUTE = "data-ascii-rest-splash";

/**
 * The host's two structural anchors for "the shell is up".
 *
 * `[data-dsh-boot]` is the boot page, which the host removes on its first React
 * commit; `[data-shell-bottom]` is a row of the shell frame, which only exists
 * once that frame has rendered. Either one alone is a half-truth: the boot page
 * can be gone while the frame is still empty, and the frame can render before
 * the boot page is cleaned up.
 */
const BOOT_ANCHOR = "[data-dsh-boot]";
const SHELL_ANCHOR = "[data-shell-bottom]";

export interface SplashTiming {
  /** How long the layer stays up even when the shell is ready sooner. */
  minVisibleMs: number;
  /** How long the layer may stay up at all, ready or not. */
  maxWaitMs: number;
  /** How long the fade out takes. */
  fadeMs: number;
  /**
   * How long the fade in takes.
   *
   * Zero means the layer is opaque from the first frame, which is what the cold
   * start needs: it covers the host's boot page from the moment it exists.
   */
  fadeInMs: number;
  /** How often the readiness anchors are re-read. */
  pollMs: number;
}

/**
 * The timing a reader actually gets.
 *
 * The minimum is long enough to read as a deliberate opening rather than a
 * flicker, and short enough that a warm start does not feel held back. The
 * deadline is the point where waiting stops being worth it: past five seconds
 * the reader is looking at a stuck app, and a splash on top of that only hides
 * the problem.
 */
export const DEFAULT_SPLASH_TIMING: SplashTiming = {
  minVisibleMs: 1200,
  maxWaitMs: 5000,
  fadeMs: 650,
  fadeInMs: 0,
  pollMs: 50,
};

export interface SplashOptions {
  /** The document to paint into; the tests pass jsdom's. */
  doc: Document;
  /** The scene to play, as the catalog describes it. */
  scene: SceneEntry;
  /**
   * The scene's module, or the promise of it.
   *
   * A scene that is not built into the entry arrives as a chunk fetch, and the
   * layer cannot wait for that: the boot page it covers is already painted. So
   * the layer and its ground go up synchronously either way, and only the canvas
   * waits.
   */
  module: SceneModule | Promise<SceneModule>;
  /** The scene's own frame options. */
  pieceOptions: Record<string, number | boolean>;
  /** Which colour treatment the light scheme uses. */
  lightMode: LightMode;
  /** Hold one frame instead of playing. */
  still: boolean;
  /** Frames per second for the splash's own copy of the scene. */
  fps: number;
  /** Device pixels per CSS pixel for the canvas backing store. */
  resolution: number;
  /** Overrides for the timing, so a test can drive the clock by hand. */
  timing?: Partial<SplashTiming>;
  /** Called once, after the layer is gone. */
  onEnd?: () => void;
  /** Called once with the first failure; the layer is gone by then. */
  onError?: (error: unknown) => void;
}

export interface Splash {
  readonly element: HTMLElement;
  /** Remove the layer and stop everything. Idempotent, and never reports an end. */
  dispose(): void;
}

/** Whether the reader asked the system for less motion. */
function prefersReducedMotion(): boolean {
  return typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Cover the page with the scene until the host is ready, then fade away.
 *
 * The layer is on the page when this returns: the boot page is already painted
 * by then, so anything asynchronous here would show it.
 */
export function playSplash(options: SplashOptions): Splash {
  const { doc, scene } = options;
  const timing: SplashTiming = { ...DEFAULT_SPLASH_TIMING, ...options.timing };
  const started = Date.now();

  const element = doc.createElement("div");
  element.setAttribute(SPLASH_ATTRIBUTE, "");
  element.setAttribute("aria-hidden", "true");
  element.style.position = "fixed";
  element.style.inset = "0";
  // Above the skin's own tuning panel (2147483000): the splash covers every
  // part of the host, including anything the skin itself has put on top.
  element.style.zIndex = "2147483500";
  element.style.overflow = "hidden";
  // `contain` keeps the scene's repaints from invalidating the boot page and
  // the shell underneath, which are still being laid out while this is up.
  element.style.contain = "strict";
  element.style.pointerEvents = "auto";
  // The cold start must be opaque from the first frame: the boot page it covers
  // is already painted underneath. A splash over a live page (the new-chat
  // splash) may fade in instead; that is the caller's `fadeInMs`.
  const fadeIn = timing.fadeInMs > 0 && !prefersReducedMotion();
  // Spelled out rather than left to the default: the fade writes this same
  // property, and a transition needs a starting value it was given.
  element.style.opacity = fadeIn ? "0" : "1";
  element.style.backgroundColor = sceneColors(scene, currentScheme(doc), options.lightMode).ground;
  doc.body.append(element);
  if (fadeIn) {
    // Reading a layout value commits the transparent first frame before the
    // transition starts; without it both writes collapse into one paint and the
    // layer appears at full opacity with no fade at all.
    element.getBoundingClientRect();
    element.style.transition = `opacity ${String(timing.fadeInMs)}ms linear`;
    element.style.opacity = "1";
  }

  let surface: Surface | null = null;
  let pollTimer: ReturnType<typeof setTimeout> | null = null;
  let deadlineTimer: ReturnType<typeof setTimeout> | null = null;
  let fadeTimer: ReturnType<typeof setTimeout> | null = null;
  let endTimer: ReturnType<typeof setTimeout> | null = null;
  let fading = false;
  let disposed = false;

  const clearTimers = (): void => {
    for (const timer of [pollTimer, deadlineTimer, fadeTimer, endTimer]) {
      if (timer !== null) clearTimeout(timer);
    }
    pollTimer = null;
    deadlineTimer = null;
    fadeTimer = null;
    endTimer = null;
  };

  const dispose = (): void => {
    if (disposed) return;
    disposed = true;
    clearTimers();
    surface?.dispose();
    surface = null;
    element.remove();
  };

  /**
   * A scene that will not mount is not a reason to hold the reader up: the
   * boot page is still there to show, and the shell will arrive regardless.
   */
  const fail = (error: unknown): void => {
    if (disposed) return;
    dispose();
    options.onError?.(error);
  };

  const finish = (): void => {
    if (disposed) return;
    dispose();
    options.onEnd?.();
  };

  const fade = (): void => {
    if (fading || disposed) return;
    fading = true;
    clearTimers();
    // Reduced motion turns the fade into a cut: the point of the layer is the
    // scene, and a reader who asked for less motion did not ask for a dissolve.
    const duration = prefersReducedMotion() ? 0 : timing.fadeMs;
    element.style.transition = `opacity ${String(duration)}ms ease-out`;
    element.style.opacity = "0";
    endTimer = setTimeout(finish, duration);
  };

  const scheduleFade = (delay: number): void => {
    if (fading || disposed || fadeTimer !== null) return;
    fadeTimer = setTimeout(() => {
      fadeTimer = null;
      fade();
    }, delay);
  };

  const ready = (): boolean => doc.querySelector(BOOT_ANCHOR) === null && doc.querySelector(SHELL_ANCHOR) !== null;

  /**
   * Watch for the shell, and hold the layer for whatever is left of the minimum.
   *
   * The minimum is measured from the call, not from readiness, so a slow start
   * does not get the full minimum on top of its own delay.
   */
  const poll = (): void => {
    pollTimer = null;
    if (fading || disposed) return;
    if (ready()) {
      scheduleFade(Math.max(0, timing.minVisibleMs - (Date.now() - started)));
      return;
    }
    pollTimer = setTimeout(poll, timing.pollMs);
  };

  /**
   * Put the scene's canvas inside the layer.
   *
   * Split out because it may run later than the layer: a scene that is not built
   * into the entry arrives as a chunk, and by then the reader may already be
   * looking at the shell.
   */
  const attach = (module: SceneModule): void => {
    if (disposed) return;
    let next: Surface;
    try {
      next = presentScene(
        {
          scene,
          module,
          pieceOptions: options.pieceOptions,
          opacity: 1,
          blur: 0,
          veil: 0,
          scrim: 0,
          scrimAngle: 180,
          still: options.still,
          // The splash is the only thing on screen, so a lost focus is not a
          // reason to stop: the reader is looking at it while the app starts.
          pauseOnBlur: false,
          fps: options.fps,
          resolution: options.resolution,
          lightMode: options.lightMode,
          geometry: { fit: "cover", anchor: "center", zoom: 1 },
          onError: fail,
        },
        doc,
      );
    } catch (error) {
      fail(error);
      return;
    }

    // `presentScene` reports through `onError` before it returns, so the layer
    // may already be gone; the surface it handed back is still live.
    if (disposed) {
      next.dispose();
      return;
    }

    // `presentScene` puts its layer behind the shell, which is right for the
    // background and wrong inside the splash: a negative index would drop the
    // scene under the layer's own ground colour.
    next.element.style.zIndex = "0";
    surface = next;
    element.append(next.element);
  };

  if (typeof (options.module as Promise<SceneModule>).then === "function") {
    void (options.module as Promise<SceneModule>).then(attach, fail);
  } else {
    attach(options.module as SceneModule);
  }

  // A scene that failed on the spot has already taken the layer down, and a
  // splash that is gone has nothing left to wait for.
  if (disposed) return { element, dispose };

  pollTimer = setTimeout(poll, timing.pollMs);
  deadlineTimer = setTimeout(fade, timing.maxWaitMs);

  return { element, dispose };
}
