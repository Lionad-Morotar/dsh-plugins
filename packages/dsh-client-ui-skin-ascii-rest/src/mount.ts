/*
 * Playing an ascii.rest piece on a canvas.
 *
 * Vendored from ascii.rest by @bas3line (https://github.com/bas3line), MIT
 * licensed, at commit c556be4284a97599f78197c09ba744ad11c0145e.
 *
 * Why a copy rather than `import { mount } from "ascii.rest"`: that entry point
 * also re-exports the whole 240-piece lazy library, so importing it would put a
 * dynamic-import table for every piece into this skin's bundle, and the bundler
 * would have to decide what to do with 240 specifiers that are not there. The
 * renderer itself is self-contained and has no dependency beyond the DOM.
 *
 * The only change from upstream is the removal of the `<pre>` path: this skin
 * always draws to a canvas, because a coloured scene is the whole point. That
 * drops the single-colour fallback and the `getComputedStyle` ink probe with it.
 */

/** A piece module in the shape the catalog and the frame loop both read. */
export interface PieceMeta {
  name: string;
  cols: number;
  rows: number;
  cell?: 1 | 2;
  fps: number;
  ground?: string;
  palette?: readonly string[];
  still?: number;
  loop?: number;
  options?: Record<string, unknown>;
}

/** One frame: the picture at `t` seconds of play time. */
export type Frame = (t: number, env: Env) => string;

export interface Env {
  /** True when the ground is light, so a shaded piece can flip its ramp. */
  paper?: boolean;
  /** For coloured pieces: one palette index a cell, row by row. */
  color?: Uint8Array;
}

export interface Piece {
  meta: PieceMeta;
  default: (options?: Record<string, unknown>) => Frame;
}

export interface MountOptions {
  /** Override the piece's declared frame rate; 0 draws one frame and stops. */
  fps?: number;
  /** Play even when the reader prefers reduced motion. */
  motion?: boolean;
  /** Piece-specific options, merged over `meta.options`. */
  [option: string]: unknown;
}

/**
 * What playing a piece returns: a stop function, plus the two controls the host
 * needs to hold the picture still without tearing it down.
 *
 * `pause` is not the same as `fps: 0`. A zero frame rate still draws, then never
 * advances; a paused loop keeps its canvas exactly as it is and spends nothing.
 * The skin uses it when the window loses focus, which is a frequent, temporary
 * state that must not cost a re-mount.
 */
export type MountHandle = (() => void) & {
  /** Hold the frame loop without losing the current frame. Idempotent. */
  pause(): void;
  /** Resume the frame loop where it left off. Idempotent. */
  resume(): void;
  /** Play time, in seconds, of the frame currently on screen. */
  now(): number;
};

/** A piece as the loader hands it over: either the object or its default export. */
export type PieceLike = Piece | Piece["default"];

const isPiece = (value: unknown): value is Piece =>
  !!value &&
  typeof value === "object" &&
  !!(value as Piece).meta &&
  typeof (value as Piece).meta === "object" &&
  typeof (value as Piece).default === "function";

/** The piece in a module: its default export when that is a piece, else the module. */
export function pieceIn(module: unknown, from: string): Piece {
  const given = (module as { default?: unknown } | null)?.default;
  if (isPiece(given)) return given;
  if (isPiece(module)) return module;
  throw new Error(`ascii.rest: ${from} has no piece`);
}

/**
 * Play a piece on a canvas, filling its width with cells `meta.cell` widths
 * tall, and return a stop function.
 *
 * Play time advances only while the canvas is on screen and the tab is open, and
 * `prefers-reduced-motion` holds it still on the frame the piece names, unless
 * `motion` is set. Each `(character, colour)` pair is drawn once into an atlas
 * and copied from there, and a frame redraws only the cells that changed: a
 * 20,000-cell scene redrawn cell by cell is most of its cost per frame.
 */
export function mount(el: HTMLElement, piece: PieceLike, options: MountOptions = {}): MountHandle {
  const make = typeof piece === "function" ? piece : piece.default;
  const meta: Partial<PieceMeta> = typeof piece === "function" ? {} : piece.meta;
  const { fps = meta.fps ?? 30, motion = false, ...rest }: MountOptions = { ...meta.options, ...options };
  const frame: Frame = make(rest);
  const { cols = 80, rows = 24, palette, ground, cell = 2 } = meta;
  const canvas = el instanceof HTMLCanvasElement ? el : null;
  const color = palette && canvas ? new Uint8Array(cols * rows) : undefined;

  const rgb = (css: string): number[] =>
    css[0] === "#" ? [1, 3, 5].map((i) => Number.parseInt(css.slice(i, i + 2), 16)) : (css.match(/[\d.]+/g) ?? []).map(Number);
  const dark = (css: string): boolean => {
    const c = rgb(css);
    return 0.2126 * (c[0] ?? 0) + 0.7152 * (c[1] ?? 0) + 0.0722 * (c[2] ?? 0) < 128;
  };
  // A light ground means the picture is ink on paper, which shaded pieces read
  // from `env.paper` to pick their ramp direction.
  const env = (): Env => ({ paper: canvas && ground ? !dark(ground) : false, color });

  const reduced = !motion && typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;
  let t = reduced ? (meta.still ?? 0) : 0;
  let draw = (): void => {};

  let observer: ResizeObserver | undefined;
  if (canvas) {
    const font = (px: number): string => `${px}px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`;
    const ctx = canvas.getContext("2d");
    const atlas = document.createElement("canvas");
    const actx = atlas.getContext("2d");
    if (ctx === null || actx === null) return detachedNoop();

    const slots = new Map<number, number>();
    let w = 0;
    let h = 0;
    let sw = 0;
    let sh = 0;
    let pw = 0;
    let ph = 0;
    let width = -1;
    let ink = "";
    let xs = new Int32Array(0);
    let ys = new Int32Array(0);
    let gx = new Int32Array(0);
    let gy = new Int32Array(0);
    let last = "";
    let full = true;
    const lastColor = color ? new Uint8Array(cols * rows) : undefined;

    canvas.style.display ||= "block";
    canvas.style.aspectRatio = `${String(cols)} / ${String(rows * cell)}`;

    const size = (): void => {
      width = canvas.clientWidth;
      w = (width * (devicePixelRatio || 1)) / cols;
      h = w * cell;
      sw = Math.ceil(w);
      sh = Math.ceil(h);
      pw = sw + 2;
      ph = sh + 2;
      canvas.width = Math.round(w * cols);
      canvas.height = Math.round(h * rows);
      atlas.width = pw * 32;
      atlas.height = ph * 32;
      xs = Int32Array.from({ length: cols + 1 }, (_, x) => Math.round(x * w));
      ys = Int32Array.from({ length: rows + 1 }, (_, y) => Math.round(y * h));
      gx = Int32Array.from({ length: cols }, (_, x) => Math.round(x * w + (w - sw) / 2));
      gy = Int32Array.from({ length: rows }, (_, y) => Math.round(y * h + (h - sh) / 2));
      slots.clear();
      full = true;
    };

    const glyph = (code: number, index: number): number => {
      const key = code * 256 + index;
      const cached = slots.get(key);
      if (cached !== undefined) return cached;
      if (slots.size === 1024) {
        actx.clearRect(0, 0, atlas.width, atlas.height);
        slots.clear();
      }
      const slot = slots.size;
      const x = (slot % 32) * pw + 1;
      const y = Math.floor(slot / 32) * ph + 1;
      actx.font = font(w / 0.6);
      actx.textAlign = "center";
      actx.textBaseline = "middle";
      actx.fillStyle = palette?.[index] ?? palette?.[0] ?? ink;
      // Kept to its slot: a box-drawing glyph stands taller than its box and
      // would reach into the slot below, which that slot's cells would show.
      actx.save();
      actx.beginPath();
      actx.rect(x - 1, y - 1, pw, ph);
      actx.clip();
      actx.fillText(String.fromCharCode(code), x + sw / 2, y + sh / 2);
      actx.restore();
      slots.set(key, slot);
      return slot;
    };

    draw = (): void => {
      if (!palette && getComputedStyle(canvas).color !== ink) {
        ink = getComputedStyle(canvas).color;
        slots.clear();
        actx.clearRect(0, 0, atlas.width, atlas.height);
        full = true;
      }
      const text = frame(t, env());
      if (ground) ctx.fillStyle = ground;
      if (full) {
        if (ground) ctx.fillRect(0, 0, canvas.width, canvas.height);
        else ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
      for (let k = 0, x = 0, y = 0; k < text.length; k++) {
        const code = text.charCodeAt(k);
        if (code === 10) {
          x = 0;
          y++;
          continue;
        }
        const index = y * cols + x;
        if (full || code !== last.charCodeAt(k) || (color !== undefined && lastColor !== undefined && color[index] !== lastColor[index])) {
          const x0 = xs[x] ?? 0;
          const y0 = ys[y] ?? 0;
          const cw = (xs[x + 1] ?? 0) - x0;
          const ch = (ys[y + 1] ?? 0) - y0;
          if (!full) {
            if (ground) ctx.fillRect(x0, y0, cw, ch);
            else ctx.clearRect(x0, y0, cw, ch);
          }
          if (code !== 32) {
            const slot = glyph(code, color?.[index] ?? 0);
            ctx.drawImage(
              atlas,
              (slot % 32) * pw + 1 + x0 - (gx[x] ?? 0),
              Math.floor(slot / 32) * ph + 1 + y0 - (gy[y] ?? 0),
              cw,
              ch,
              x0,
              y0,
              cw,
              ch,
            );
          }
        }
        x++;
      }
      last = text;
      if (color !== undefined) lastColor?.set(color);
      full = false;
    };

    size();
    observer = new ResizeObserver(() => {
      if (canvas.clientWidth !== width) {
        size();
        draw();
      }
    });
    observer.observe(canvas);
  }

  draw();
  if (!fps) {
    const stopped = (): void => {
      observer?.disconnect();
    };
    return attach(stopped, () => {}, () => {}, () => t);
  }

  const still = matchMedia("(prefers-reduced-motion: reduce)");
  let raf = 0;
  let previous = 0;
  let seen = false;
  // Held while the page is inactive. Kept separate from `seen` because the two
  // answer different questions: one is "is this canvas on screen", the other is
  // "does the reader want the application working at all right now".
  let held = false;

  const tick = (now: number): void => {
    raf = requestAnimationFrame(tick);
    const dt = now - previous;
    if (dt < 1000 / fps - 2) return;
    previous = now;
    t += Math.min(dt, 100) / 1000;
    draw();
  };

  const run = (): void => {
    const go = !held && seen && !document.hidden && (motion || !still.matches);
    if (go && !raf) {
      previous = performance.now();
      raf = requestAnimationFrame(tick);
    } else if (!go && raf) {
      cancelAnimationFrame(raf);
      raf = 0;
    }
  };

  const io = new IntersectionObserver((entries) => {
    seen = entries[entries.length - 1]?.isIntersecting ?? false;
    run();
  });
  io.observe(el);
  document.addEventListener("visibilitychange", run);
  still.addEventListener("change", run);

  return attach(
    () => {
      io.disconnect();
      observer?.disconnect();
      cancelAnimationFrame(raf);
      raf = 0;
      document.removeEventListener("visibilitychange", run);
      still.removeEventListener("change", run);
    },
    () => {
      held = true;
      run();
    },
    () => {
      held = false;
      run();
    },
    () => t,
  );
}

/** A handle that does nothing, for the paths that bail before the loop exists. */
function detachedNoop(): MountHandle {
  return attach(
    () => {},
    () => {},
    () => {},
    () => 0,
  );
}

/**
 * Glue a stop function and the play-time getter onto one object.
 *
 * The stop function stays callable (`stop()`) so existing callers and upstream's
 * own contract keep working; `pause`/`resume`/`now` are additions, not a new shape.
 */
function attach(stop: () => void, pause: () => void, resume: () => void, now: () => number): MountHandle {
  const handle = stop as MountHandle;
  handle.pause = pause;
  handle.resume = resume;
  handle.now = now;
  return handle;
}
