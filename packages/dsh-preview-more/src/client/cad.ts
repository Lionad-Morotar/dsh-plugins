/**
 * DXF rendering: drawing bytes in, a mounted viewer out.
 *
 * DXF is 2D CAD, so it does not share the mesh viewport: a drawing is lines,
 * arcs, hatches and text grouped into layers, and `dxf-viewer` renders exactly
 * that with its own three scene.
 *
 * The library takes a URL rather than bytes, so a blob URL bridges the two. That
 * keeps the "zero external network" property: the only fetch it makes is to a
 * URL this module created from bytes the host already read.
 */
import { Color } from "three";


/** One axis-aligned rectangle in drawing coordinates. */
export interface DrawingBounds {
  readonly minX: number;
  readonly maxX: number;
  readonly minY: number;
  readonly maxY: number;
}

/** The viewer face this module drives, narrowed to what it calls. */
export interface DxfViewerFace {
  Load(params: { url: string; fonts?: readonly string[] | null }): Promise<unknown>;
  FitView(minX: number, maxX: number, minY: number, maxY: number, padding?: number): void;
  Destroy(): void;
  GetCanvas(): HTMLCanvasElement;
  GetBounds(): DrawingBounds | null;
  GetOrigin(): { x: number; y: number };
}

/** The DxfViewer constructor, as this module calls it. */
export type DxfViewerConstructor = new (container: HTMLElement, options?: Record<string, unknown> | null) => DxfViewerFace;

/**
 * The background the drawing is rendered on.
 *
 * DXF layer colours are authored for a dark background, so the default light
 * clear colour would hide the black and dark-yellow strokes most drawings use.
 */
const CLEAR_COLOR = 0x18181b;

/**
 * Build the viewer options.
 *
 * `clearColor` is read as a three.Color (`getHex` is called on it in the
 * constructor), not as a CSS string, so the value has to be constructed rather
 * than written inline.
 * @returns the options object for a new viewer.
 */
function viewerOptions(): Record<string, unknown> {
  return {
    // The surface owns sizing: the canvas fills the panel, and the panel is what
    // a resize changes.
    autoResize: true,
    clearColor: new Color(CLEAR_COLOR),
  };
}

/** What one mounted drawing exposes to its host component. */
export interface DxfHandle {
  /** How many layers the drawing carries; 0 when it declares none. */
  readonly layers: number;
  /** Re-fit the drawing after the panel changed size. */
  fit(): void;
  /** Tear the viewer down and release its WebGL context. */
  dispose(): void;
}

/**
 * Read the layer count off a loaded viewer.
 *
 * The viewer keeps its layer table in a private Map that exists for rendering;
 * asking the library to retain the whole parsed document instead would hold a
 * second copy of the file just to count rows.
 * @param viewer - a viewer whose `Load` has resolved.
 * @returns the number of layers, or 0 when the field is unavailable.
 */
function countLayers(viewer: DxfViewerFace): number {
  const layers = (viewer as unknown as { layers?: { size?: unknown } }).layers;
  return typeof layers?.size === "number" ? layers.size : 0;
}

/**
 * Mount one drawing.
 * @param container - element the canvas is appended to.
 * @param bytes - the DXF file content.
 * @param Viewer - the DxfViewer constructor, imported by the chunk.
 * @returns the mounted drawing.
 */
export async function mountDrawing(container: HTMLElement, bytes: Uint8Array, Viewer: DxfViewerConstructor): Promise<DxfHandle> {
  const viewer = new Viewer(container, viewerOptions());
  // The library fetches the file itself, so the bytes travel as a URL. A blob
  // URL pins the whole file in memory, so it is revoked as soon as the load
  // settles, on both paths.
  const url = URL.createObjectURL(new Blob([bytes as unknown as BlobPart], { type: "application/dxf" }));
  try {
    await viewer.Load({ url });
  } catch (error) {
    viewer.Destroy();
    throw error;
  } finally {
    URL.revokeObjectURL(url);
  }

  // Bounds and origin are what Load's own fit used, and they are also what a
  // re-fit needs: the viewer is given scene coordinates, which are the drawing's
  // own coordinates shifted by its origin.
  const bounds = viewer.GetBounds();
  const origin = viewer.GetOrigin();

  return {
    layers: countLayers(viewer),
    fit: () => {
      if (bounds === null) return;
      viewer.FitView(bounds.minX - origin.x, bounds.maxX - origin.x, bounds.minY - origin.y, bounds.maxY - origin.y);
    },
    dispose: () => viewer.Destroy(),
  };
}
