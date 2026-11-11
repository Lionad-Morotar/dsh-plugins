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

/**
 * The change status a card encodes.
 *
 * Declared here rather than imported from `shared.ts` so the chunk depends on
 * nothing but its own two files. It is the same vocabulary the host reports;
 * the view is what converts one into the other, and a drift between them is a
 * type error at that conversion rather than a silent mismatch.
 */
export type MapStatus =
  | "added"
  | "modified"
  | "deleted"
  | "renamed"
  | "copied"
  | "type-changed"
  | "untracked"
  | "conflicted"
  | "unknown";

/**
 * One hunk's position on the new side, for the distribution bar.
 *
 * Only the new side is carried: the bar answers "where in the file did this
 * land", and a reader who wants the old side's line numbers opens the diff.
 */
export interface MapHunk {
  readonly newStart: number;
  readonly newLines: number;
  readonly oldLines: number;
}

/** One file in a map level. */
export interface MapFileInput {
  /** Repository-relative path. */
  readonly path: string;
  /** Newline count, or null for a binary file whose size is not a line count. */
  readonly lines: number | null;
  readonly changed: boolean;
  /** The change status, when this file is in the change set. */
  readonly status?: MapStatus;
  readonly additions?: number | null;
  readonly deletions?: number | null;
  readonly binary?: boolean;
  /** Hunk positions for the distribution bar; absent means no bar. */
  readonly hunks?: readonly MapHunk[];
}

/** One directory in a map level, already carrying its subtree's line total. */
export interface MapDirInput {
  readonly path: string;
  readonly lines: number;
  readonly changed: boolean;
  /** Files in the subtree, for the folder header's reading. */
  readonly files?: number;
  /** Files in the subtree that changed. */
  readonly changedFiles?: number;
  readonly additions?: number;
  readonly deletions?: number;
  /**
   * The index has not finished for this subtree.
   *
   * A separate flag rather than a sentinel count, because "we have not counted"
   * and "we counted zero" must render differently: the requirement is explicit
   * that an unfinished index shows as pending rather than as a definite zero.
   */
  readonly pending?: boolean;
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

/**
 * One child of a directory, drawn as a small block inside the directory's tile.
 *
 * A crumb is a preview, not a card: it carries identity and change state so the
 * reader can see *where* the changes are inside a folder without drilling, and
 * it deliberately carries no text of its own. One level only — a crumb never
 * contains crumbs, because at that size the picture stops being a map and
 * becomes noise.
 */
export interface MapCrumb {
  readonly path: string;
  readonly kind: "dir" | "file";
  readonly lines: number;
  readonly changed: boolean;
  /** Present for a changed file: the same vocabulary the cards use. */
  readonly status?: MapStatus;
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
 * One import edge between two files, as the map draws it.
 *
 * `state` is the three-way comparison from the host: an edge that appeared, one
 * that went away, one present on both sides. The map draws all three when a file
 * is highlighted — a removed edge is exactly what a reviewer wants to see when
 * judging whether a change broke a dependency.
 */
export interface MapEdgeInput {
  readonly from: string;
  readonly to: string;
  readonly state: "added" | "removed" | "kept";
}

/**
 * Every level of the map, keyed by directory path.
 *
 * A map rather than a tree because drilling down is a lookup, not a walk: the
 * view knows the path it is showing and asks for that one level. The root level
 * is always present under `rootPath`, so a caller never has to special-case an
 * empty map.
 *
 * `edges` and `unresolvedFiles` are carried whole rather than pre-filtered per
 * level: the map decides what it can draw from the level it is showing, and a
 * per-level pre-split would have to be redone on every drill.
 */
export interface MapData {
  readonly levels: ReadonlyMap<string, MapLevelInput>;
  readonly rootPath: string;
  /**
   * Import edges whose either end is in the change set.
   *
   * Optional, and absent means "the caller supplied no edge data" rather than
   * "there are no dependencies": the map draws edges only while a file is
   * highlighted, so a caller that omits them gets a map that makes no claim
   * about dependencies at all. That is the honest reading, and it is what lets a
   * preview harness mount the map with levels alone.
   */
  readonly edges?: readonly MapEdgeInput[];
  /**
   * How many references failed to resolve, per file.
   *
   * A file with a count above zero has dependencies the map cannot draw. It is
   * reported per file so the card can say so, and it is never rendered as an
   * edge: an unresolved reference has no target to point at. Absent is the same
   * as an empty record — no file is claimed to have unresolved references.
   */
  readonly unresolvedFiles?: Readonly<Record<string, number>>;
  /**
   * How much of the tree the index covered.
   *
   * Absent means the caller did not say, which is not the same as "complete":
   * the map shows the partial marker only when it is told the index stopped
   * early, and never claims a definite zero for a range it did not read.
   */
  readonly indexed?: {
    readonly parsed: number;
    readonly total: number;
    readonly complete: boolean;
    readonly note: string | null;
  };
}

/** What a click on a tile does; both are optional so a preview can pass none. */
export interface MapHandlers {
  readonly onOpenFile?: (path: string) => void;
  readonly onDrill?: (path: string) => void;
  /**
   * The pointer entered or left a file card.
   *
   * `null` means it left. Reported synchronously from `pointerenter` /
   * `pointerleave` rather than through a timer: the requirement puts the
   * linkage's latency at 100ms, and a debounce would spend most of that budget
   * on a delay nobody asked for.
   *
   * Only file cards report: a directory is a place to go, not a file to look at,
   * and highlighting a list row for a folder would point at nothing.
   */
  readonly onHover?: (path: string | null) => void;
}

/**
 * How the map is sized and titled.
 *
 * The size is in the map's own coordinate space, not pixels: the `<svg>` scales
 * to its box, so these numbers are proportions. An explicit size wins over the
 * host's measured one because a caller that has already decided the aspect
 * ratio should not have it re-derived from a layout that may not have happened
 * yet — which is exactly the state a first paint is in.
 */
export interface MapOptions {
  readonly width?: number;
  readonly height?: number;
  /** The root breadcrumb's label; the repository name, when the caller knows it. */
  readonly title?: string;
  /**
   * The legend's three labels and the two marker sentences.
   *
   * Passed in rather than baked into the chunk because the chunk has no locale
   * seat: it is fetched at runtime, long after the entry resolved its strings,
   * and a second dictionary inside it would be a second thing to translate.
   * Defaults are the English words, so a preview that passes none still renders.
   */
  readonly strings?: MapStrings;
}

/** The copy the map itself renders. */
export interface MapStrings {
  readonly imports: string;
  readonly importedBy: string;
  readonly unresolved: string;
  /** Sentence for a file's unresolved count; `{count}` is substituted. */
  readonly unresolvedTemplate: string;
  /** Sentence for the partial-index marker; `{parsed}` and `{total}`. */
  readonly partialTemplate: string;
}

/** The handle a mounted map returns. */
export interface MapHandle {
  destroy(): void;
  /** The directory currently drawn; the repository root is `""`. */
  path(): string;
  /**
   * Mark one file or directory as highlighted, without changing the level.
   *
   * A target that is not on the current level highlights the nearest visible
   * ancestor and marks it as the breadcrumb target instead of drilling to it:
   * the map is a place the reader navigates, and a highlight that moved them
   * would be the map deciding where they wanted to be.
   */
  setHighlight(path: string | null): void;
  /**
   * Point at a path without following it.
   *
   * Same restraint as `setHighlight`, stated separately because the two have
   * different callers: `reveal` is what a list row does when the reader hovers
   * it, and it must never change the level either.
   */
  reveal(path: string): void;
  /**
   * Go up one level.
   *
   * Returns whether it actually moved: at the root there is nothing above, and
   * the caller needs to know that so `Escape` can fall through to whatever else
   * it might mean instead of being silently swallowed.
   */
  up(): boolean;
}
