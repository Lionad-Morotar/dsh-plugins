/**
 * The directory map chunk: a vanilla SVG renderer, fetched lazily.
 *
 * This file is the whole reason the map is a chunk. It is only needed once a
 * reader actually looks at the map, and the startup bundle is paid for by every
 * page boot whether or not the tab is ever opened — so the renderer lives here
 * and the entry only names it.
 *
 * Two constraints shape the code:
 *
 * - **No React.** The chunk may import `./contract.ts` and `./layout.ts` and
 *   nothing else. A React import would drag the framework's reconciler into a
 *   second bundle and, worse, make the chunk depend on the host's module
 *   identity for a component nobody asked for. Plain DOM nodes are enough for
 *   rectangles, and they are what a jsdom test can assert without a renderer.
 *
 * - **It owns only what it created.** `destroy()` removes the `<svg>` this call
 *   appended and nothing else: the host element is the view's, may already hold
 *   a loading state or a sibling panel, and a renderer that cleared it would be
 *   a renderer that fights its caller.
 *
 * This slice draws structure only — rectangles with their identity on
 * `data-*` attributes. Cards, labels, status colours and interaction are the
 * next slice's work, and keeping them out is what makes this one reviewable.
 */
import type { MapData, MapHandle, MapHandlers, MapLevelInput, Tile } from "./contract.ts";
import { layoutLevel } from "./layout.ts";

/** The SVG namespace; a plain `createElement` would produce an inert element. */
const SVG_NS = "http://www.w3.org/2000/svg";

/**
 * The default drawing size, in the map's own coordinate space.
 *
 * The `<svg>` scales to whatever the host gives it, so these are proportions
 * rather than pixels: the layout needs *a* box to divide, and a fixed one keeps
 * the picture identical between a 300px panel and a 1200px one. Measuring the
 * host instead would make the output depend on layout, which jsdom does not do
 * and a first paint has not finished doing.
 */
const DEFAULT_WIDTH = 1000;
const DEFAULT_HEIGHT = 600;

/**
 * Build one rectangle for a tile.
 * @param document - the document to create in.
 * @param tile - the laid-out tile.
 * @returns the `<rect>`, carrying the tile's identity for a test or a handler.
 */
function rectFor(document: Document, tile: Tile): SVGRectElement {
  const rect = document.createElementNS(SVG_NS, "rect");
  rect.setAttribute("x", String(tile.x));
  rect.setAttribute("y", String(tile.y));
  rect.setAttribute("width", String(tile.width));
  rect.setAttribute("height", String(tile.height));
  rect.setAttribute("data-kind", tile.kind);
  rect.setAttribute("data-path", tile.path);
  rect.setAttribute("data-lines", String(tile.lines));
  return rect;
}

/**
 * Mount a map into a host element.
 *
 * The level drawn is the one `data.rootPath` names. Drilling is the next
 * slice's job; this one draws one level so the geometry can be verified on its
 * own, and a caller that wants a deeper level passes that level as the root.
 * @param host - the element to append the map to; its existing children are left alone.
 * @param data - the levels, keyed by directory path.
 * @param handlers - optional click behaviour per tile kind.
 * @returns a handle whose `destroy` removes what this call added.
 */
export function createMap(host: HTMLElement, data: MapData, handlers: MapHandlers = {}): MapHandle {
  const document = host.ownerDocument;
  const svg = document.createElementNS(SVG_NS, "svg");
  svg.setAttribute("viewBox", `0 0 ${DEFAULT_WIDTH} ${DEFAULT_HEIGHT}`);
  svg.setAttribute("preserveAspectRatio", "none");
  svg.setAttribute("data-review-map", "map");

  const level: MapLevelInput = data.levels.get(data.rootPath) ?? { path: data.rootPath, dirs: [], files: [] };
  const layout = layoutLevel(level, { width: DEFAULT_WIDTH, height: DEFAULT_HEIGHT });

  for (const tile of layout.tiles) {
    const rect = rectFor(document, tile);
    const handler = tile.kind === "dir" ? handlers.onDrill : handlers.onOpenFile;
    if (handler !== undefined) {
      rect.addEventListener("click", () => {
        handler(tile.path);
      });
    }
    svg.append(rect);
  }

  host.append(svg);
  return {
    destroy() {
      // Removing only our own node: the host may hold a loading state or another
      // panel, and clearing it would be this renderer overreaching.
      svg.remove();
    },
  };
}
