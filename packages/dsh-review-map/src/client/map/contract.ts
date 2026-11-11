/**
 * The shapes the directory map agrees on.
 *
 * Two consumers share this file and nothing else: the lazy chunk that draws the
 * map, and the view that will hand it data. Keeping the shapes here rather than
 * in the chunk means the view can type its input without importing the chunk,
 * which is the whole point of the chunk being lazy — a type import that pulled
 * the renderer into the startup bundle would defeat it.
 *
 * The input is deliberately *not* the host's `ReviewIndex`. That type describes
 * a whole repository with import edges and completeness flags; a map level only
 * needs what is on one shelf. Converting between them belongs to the view, which
 * is the layer that knows which level the reader is looking at.
 */

/** One file in a map level. */
export interface MapFileInput {
  /** Repository-relative path. */
  readonly path: string;
  /** Newline count, or null for a binary file whose size is not a line count. */
  readonly lines: number | null;
  readonly changed: boolean;
}

/** One directory in a map level, already carrying its subtree's line total. */
export interface MapDirInput {
  readonly path: string;
  readonly lines: number;
  readonly changed: boolean;
}

/**
 * One shelf of the map: the direct children of one directory.
 *
 * `dirs` and `files` are the *direct* children only. A level that also carried
 * grandchildren would make the area of a directory ambiguous — its own files or
 * everything below it — and the two readings disagree by an order of magnitude
 * in a real repository.
 */
export interface MapLevelInput {
  /** The directory this level shows; the repository root is `""`. */
  readonly path: string;
  /** Direct subdirectories, each with the line total of its whole subtree. */
  readonly dirs: readonly MapDirInput[];
  /** Direct files. */
  readonly files: readonly MapFileInput[];
}

/** An axis-aligned rectangle in the map's coordinate space. */
export interface Rect {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
}

/**
 * One drawn rectangle.
 *
 * `lines` is the weight the tile was laid out with, not a re-derived number:
 * a binary file has no line count, so it carries the minimum unit the layout
 * gave it. A client that needs to say "binary" reads the input, not this.
 */
export interface Tile extends Rect {
  readonly path: string;
  readonly kind: "dir" | "file";
  readonly lines: number;
}

/** One level's laid-out tiles. */
export interface LevelLayout {
  readonly tiles: readonly Tile[];
}

/** How much room the layout has, and how small a tile may get. */
export interface LayoutOptions {
  readonly width: number;
  readonly height: number;
  /** Shortest side a tile may have, in pixels; defaults to 4. */
  readonly minSide?: number;
}

/**
 * Every level of the map, keyed by directory path.
 *
 * A map rather than a tree because drilling down is a lookup, not a walk: the
 * view knows the path it is showing and asks for that one level. The root level
 * is always present under `rootPath`, so a caller never has to special-case an
 * empty map.
 */
export interface MapData {
  readonly levels: ReadonlyMap<string, MapLevelInput>;
  readonly rootPath: string;
}

/** What a click on a tile does; both are optional so a preview can pass none. */
export interface MapHandlers {
  readonly onOpenFile?: (path: string) => void;
  readonly onDrill?: (path: string) => void;
}

/** The handle a mounted map returns. */
export interface MapHandle {
  destroy(): void;
}
