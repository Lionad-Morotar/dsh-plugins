/**
 * The directory map chunk: a vanilla SVG renderer with drill-down, fetched
 * lazily.
 *
 * This file is the whole reason the map is a chunk. It is only needed once a
 * reader actually looks at the map, and the startup bundle is paid for by every
 * page boot whether or not the tab is ever opened — so the renderer lives here
 * and the entry only names it.
 *
 * Two constraints shape the code:
 *
 * - **No React.** The chunk may import its own three files and nothing else. A
 *   React import would drag the framework's reconciler into a second bundle and,
 *   worse, make the chunk depend on the host's module identity for a component
 *   nobody asked for. Plain DOM nodes are enough for rectangles and text, and
 *   they are what a jsdom test can assert without a renderer.
 *
 * - **It owns only what it created.** `destroy()` removes the nodes this call
 *   appended and nothing else: the host element is the view's, may already hold
 *   a loading state or a sibling panel, and a renderer that cleared it would be
 *   a renderer that fights its caller.
 *
 * This file owns the *level*: which directory is drawn, what the breadcrumb says,
 * what a click means, and how a highlight lands. What a card looks like lives in
 * `render.ts`. The split keeps navigation readable in one place and card detail
 * in another, which is the only way either stays reviewable.
 */
import type {
  MapData,
  MapDirInput,
  MapFileInput,
  MapHandle,
  MapHandlers,
  MapLevelInput,
  MapOptions,
  Tile,
} from "./contract.ts";
import { layoutLevel } from "./layout.ts";
import { SVG_NS, capFiles, dirCard, fileCard, overflowMarker } from "./render.ts";

/**
 * The fallback drawing size, in the map's own coordinate space.
 *
 * The `<svg>` scales to whatever the host gives it, so these are proportions
 * rather than pixels. They are only reached when neither the caller nor the host
 * has an opinion — which is exactly the jsdom case, and the first-paint case
 * where the panel has been inserted but not yet laid out.
 */
const FALLBACK_WIDTH = 900;
const FALLBACK_HEIGHT = 520;

/**
 * Room the breadcrumb takes off the top of the drawing area.
 *
 * The breadcrumb is HTML rather than SVG: it is text with its own wrapping and
 * focus behaviour, and re-implementing that inside a viewBox would be work with
 * no payoff. It sits above the `<svg>` in a column, so the drawing area is the
 * host's height minus this strip.
 */
const BREADCRUMB_HEIGHT = 26;

/**
 * Height of the strip the overflow marker occupies.
 *
 * Tall enough for one line of the smallest type the stylesheet allows: the
 * marker exists to be read, and a strip shorter than its own label would drop
 * the text and leave a blank band.
 */
const OVERFLOW_STRIP_HEIGHT = 20;

/**
 * Resolve the drawing size.
 *
 * Explicit options win, then the host's measured box, then the fallback. The
 * order matters: a caller that has already decided the aspect ratio should not
 * have it re-derived from a layout that may not have happened yet.
 * @param host - the element the map is mounted into.
 * @param options - the caller's size, when it gave one.
 * @returns the width and height to lay out in.
 */
function resolveSize(host: HTMLElement, options: MapOptions): { width: number; height: number } {
  const width = options.width ?? (host.clientWidth > 0 ? host.clientWidth : FALLBACK_WIDTH);
  const height = options.height ?? (host.clientHeight > 0 ? host.clientHeight : FALLBACK_HEIGHT);
  return { width, height: Math.max(height - BREADCRUMB_HEIGHT, 0) };
}

/**
 * The directory segments of a path, root first.
 *
 * `"a/b/c"` becomes `["", "a", "a/b", "a/b/c"]`: the root is the empty string so
 * the breadcrumb's first crumb is the repository itself, and every later crumb
 * is a path the map can actually draw.
 * @param path - a repository-relative directory path.
 * @returns the segments, root first.
 */
export function pathSegments(path: string): string[] {
  const segments = [""];
  if (path === "") return segments;
  let cursor = "";
  for (const part of path.split("/")) {
    if (part === "") continue;
    cursor = cursor === "" ? part : `${cursor}/${part}`;
    segments.push(cursor);
  }
  return segments;
}

/**
 * The nearest ancestor of a path that is on the given level.
 *
 * A highlight for a file three directories down has to land somewhere visible.
 * The nearest visible ancestor is the honest answer: it says "the thing you
 * pointed at is in here" without pretending the map has drilled to it.
 * @param path - the target path.
 * @param levelPath - the directory currently drawn.
 * @returns the ancestor on this level, or null when the target is unrelated.
 */
export function nearestVisibleAncestor(path: string, levelPath: string): string | null {
  if (levelPath !== "" && path !== levelPath && !path.startsWith(`${levelPath}/`)) return null;
  const rest = levelPath === "" ? path : path.slice(levelPath.length + 1);
  if (rest === "") return null;
  const slash = rest.indexOf("/");
  const head = slash < 0 ? rest : rest.slice(0, slash);
  return levelPath === "" ? head : `${levelPath}/${head}`;
}

/**
 * Mount a map into a host element.
 *
 * The level drawn starts at `data.rootPath` and changes only through a drill, a
 * breadcrumb click, or `Escape`. Highlighting never changes it: the map is a
 * place the reader navigates, and a highlight that moved them would be the map
 * deciding where they wanted to be.
 * @param host - the element to append the map to; its existing children are left alone.
 * @param data - the levels, keyed by directory path.
 * @param handlers - optional click behaviour per tile kind.
 * @param options - size and root label.
 * @returns the handle: the level, the highlight, and teardown.
 */
export function createMap(
  host: HTMLElement,
  data: MapData,
  handlers: MapHandlers = {},
  options: MapOptions = {},
): MapHandle {
  const document = host.ownerDocument;
  const title = options.title ?? "repo";

  const root = document.createElement("div");
  root.setAttribute("data-rm", "map-root");

  const crumbs = document.createElement("nav");
  crumbs.setAttribute("data-rm", "map-breadcrumb");
  root.append(crumbs);

  const svg = document.createElementNS(SVG_NS, "svg");
  svg.setAttribute("data-review-map", "map");
  svg.setAttribute("preserveAspectRatio", "none");
  root.append(svg);

  host.append(root);

  let current = data.rootPath;
  let highlighted: string | null = null;

  /**
   * The level to draw, with its files capped.
   * @returns the level and how many files the cap left out.
   */
  const levelAt = (path: string): { level: MapLevelInput; hidden: number } => {
    const found = data.levels.get(path);
    if (found === undefined) return { level: { path, dirs: [], files: [] }, hidden: 0 };
    const capped = capFiles(found.files);
    return { level: { path: found.path, dirs: found.dirs, files: capped.files }, hidden: capped.hidden };
  };

  /**
   * Draw the breadcrumb for one level.
   * @param path - the directory being drawn.
   */
  const drawCrumbs = (path: string): void => {
    crumbs.replaceChildren();
    for (const segment of pathSegments(path)) {
      const crumb = document.createElement("button");
      crumb.type = "button";
      crumb.setAttribute("data-rm", "map-crumb");
      crumb.setAttribute("data-path", segment);
      crumb.setAttribute("data-current", segment === path ? "true" : "false");
      crumb.textContent = segment === "" ? title : segment.slice(segment.lastIndexOf("/") + 1);
      crumb.addEventListener("click", () => {
        go(segment);
      });
      crumbs.append(crumb);
    }
  };

  /**
   * Apply the current highlight to whatever is on screen.
   *
   * A target on this level marks its own tile. A target below this level marks
   * the nearest visible ancestor and flags the breadcrumb, which is the map
   * saying "it is in here" without moving the reader.
   */
  const paintHighlight = (): void => {
    for (const node of svg.querySelectorAll("[data-highlighted]")) node.removeAttribute("data-highlighted");
    for (const node of crumbs.querySelectorAll("[data-breadcrumb-target]")) node.removeAttribute("data-breadcrumb-target");
    if (highlighted === null) return;
    const direct = svg.querySelector(`[data-rm="map-tile"][data-path="${cssEscape(highlighted)}"]`);
    if (direct !== null) {
      direct.setAttribute("data-highlighted", "true");
      return;
    }
    const ancestor = nearestVisibleAncestor(highlighted, current);
    if (ancestor === null) return;
    const tile = svg.querySelector(`[data-rm="map-tile"][data-path="${cssEscape(ancestor)}"]`);
    if (tile !== null) tile.setAttribute("data-highlighted", "true");
    const crumb = crumbs.querySelector(`[data-rm="map-crumb"][data-path="${cssEscape(current)}"]`);
    if (crumb !== null) crumb.setAttribute("data-breadcrumb-target", "true");
  };

  /**
   * Change the level, telling the caller when the reader asked for it.
   *
   * Declared before `draw` because `draw`'s card context calls it: a `const`
   * referenced before its initializer runs is a temporal dead zone error, and
   * the first directory click is exactly when that would surface.
   * @param path - the directory to draw.
   * @param notify - whether this was a reader action rather than a redraw.
   */
  const go = (path: string, notify = true): void => {
    if (path === current) return;
    draw(path);
    if (notify) handlers.onDrill?.(path);
  };

  /**
   * Draw one level, replacing whatever was drawn.
   * @param path - the directory to draw.
   */
  const draw = (path: string): void => {
    current = path;
    const { width, height } = resolveSize(host, options);
    svg.setAttribute("viewBox", `0 0 ${String(width)} ${String(height)}`);
    svg.setAttribute("width", "100%");
    svg.setAttribute("height", String(height));
    svg.replaceChildren();

    const { level, hidden } = levelAt(path);
    drawCrumbs(path);

    // Directories and files are laid out together: a level is a shelf, and what
    // sits on it is either a folder or a file. The layout sorts by path, so the
    // order does not depend on which list came first.
    const dirsByPath = new Map<string, MapDirInput>(level.dirs.map(dir => [dir.path, dir]));
    const filesByPath = new Map<string, MapFileInput>(level.files.map(file => [file.path, file]));
    const layout = layoutLevel(
      { path: level.path, dirs: level.dirs, files: level.files },
      { width, height },
    );

    const context = {
      document,
      ...(handlers.onOpenFile === undefined ? {} : { onOpenFile: handlers.onOpenFile }),
      // Drilling is the map's own behaviour: the card always gets a handler, and
      // the caller is notified afterwards rather than asked to drive it.
      onDrill: (path: string) => {
        go(path);
      },
    };

    for (const tile of layout.tiles) {
      const dir = dirsByPath.get(tile.path);
      if (dir !== undefined) {
        svg.append(dirCard(context, tile, dir));
        continue;
      }
      const file = filesByPath.get(tile.path);
      if (file !== undefined) svg.append(fileCard(context, tile, file));
    }

    if (hidden > 0) {
      // The marker takes the bottom strip rather than a tile of its own: the
      // files that survived the cap already fill the level, and shrinking them
      // further to make room for a label would be the label costing the map.
      // The strip is tall enough for its own label: a marker a reader cannot read
      // is a blank area with extra steps, which is what the requirement forbids.
      const stripHeight = Math.min(OVERFLOW_STRIP_HEIGHT, height);
      svg.append(
        overflowMarker(document, hidden, { x: 0, y: Math.max(height - stripHeight, 0), width, height: stripHeight }),
      );
    }

    paintHighlight();
  };

  /**
   * Change the level, telling the caller when the reader asked for it.
   * @param path - the directory to draw.
   * @param notify - whether this was a reader action rather than a redraw.
   */
  /**
   * The keyboard contract: a level up, and nothing at the root.
   * @param event - the key event.
   */
  const onKeyDown = (event: KeyboardEvent): void => {
    if (event.key !== "Escape") return;
    if (current === "") return;
    go(current.slice(0, Math.max(current.lastIndexOf("/"), 0)));
  };

  // The listener is on the host, not the document: the map must not swallow
  // Escape from a panel the reader is actually typing in.
  host.addEventListener("keydown", onKeyDown);
  draw(current);

  return {
    destroy() {
      host.removeEventListener("keydown", onKeyDown);
      root.remove();
    },
    path() {
      return current;
    },
    setHighlight(path) {
      highlighted = path;
      paintHighlight();
    },
    reveal(path) {
      highlighted = path;
      paintHighlight();
    },
  };
}

/**
 * Escape a value for use in an attribute selector.
 *
 * Paths contain slashes, dots and spaces, and a raw interpolation would either
 * throw or silently match nothing — which for a highlight means a reader points
 * at a file and nothing lights up.
 * @param value - the raw attribute value.
 * @returns the value with selector metacharacters escaped.
 */
function cssEscape(value: string): string {
  return value.replace(/["\\]/gu, "\\$&");
}
