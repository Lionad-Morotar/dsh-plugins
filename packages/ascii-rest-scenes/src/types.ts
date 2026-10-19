/** One scene's identity and geometry, lifted from the piece module's `meta` at build time. */
export interface SceneEntry {
  /** The piece file name, which is also its chunk name: "salt-flat". */
  id: string;
  /** Lowercase display name, as the piece declares it: "salt flat". */
  name: string;
  /** One lowercase line saying what you see. */
  note: string;
  cols: number;
  rows: number;
  /** Cell height in cell widths: 2 is the shape of a character, 1 is square. */
  cell: 1 | 2;
  fps: number;
  /** The colour behind the piece. */
  ground: string;
  /** Up to 64 colours as `#rrggbb`, indexed by a frame's `env.color`. */
  palette: readonly string[];
  /** The frame to hold on when the reader prefers reduced motion. */
  still: number;
  /** Repeating period in seconds, when the piece declares one. */
  loop?: number;
}

/** A piece module, in the shape ascii.rest's own `mount` accepts. */
export interface SceneModule {
  meta: {
    name: string;
    /** "scenes" for the pieces the catalog lists; other categories are not scenes. */
    category?: string;
    /** One lowercase line saying what you see. */
    note?: string;
    cols: number;
    rows: number;
    cell?: 1 | 2;
    fps: number;
    ground?: string;
    palette?: readonly string[];
    still?: number;
    loop?: number;
    options?: Record<string, unknown>;
  };
  default: (options?: Record<string, unknown>) => SceneFrame;
}

/** One frame: the picture at `t` seconds of play time. */
export type SceneFrame = (t: number, env?: SceneEnv) => string;

export interface SceneEnv {
  /** True when the text is dark on a light ground, so shaded pieces can flip their ramp. */
  paper?: boolean;
  /** For coloured pieces: one palette index a cell, row by row. */
  color?: Uint8Array;
}

/** The provenance baked into a generated catalog, so a stale build is diagnosable. */
export interface CatalogSource {
  repository: string;
  commit: string;
  packageVersion: string;
}
