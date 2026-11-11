/**
 * Card rendering for one map level: the DOM the map is actually made of.
 *
 * The split from `index.ts` is deliberate. `index.ts` owns the mount lifecycle —
 * one `<svg>`, one level at a time, the handle's methods — while this file owns
 * what a tile looks like. A renderer that also owned navigation would have to be
 * re-read in full to change a card, and this slice changes cards a lot.
 *
 * Three rules run through everything here, and each one is a requirement rather
 * than a taste:
 *
 * - **Status is encoded twice, in colour and in shape.** Colour alone fails in
 *   greyscale, in a colour-blind reader's view, and in a screenshot printed for a
 *   review. Every status therefore also carries a distinct glyph and a distinct
 *   `data-shape`, so the two channels degrade independently.
 *
 * - **A card that is too small drops its text, never its rectangle.** A tile
 *   below the readable threshold keeps its `<rect>` and its `data-*` identity and
 *   loses only the `<text>`; the map still knows the file is there, and a reader
 *   who zooms or drills finds it. Dropping the rect instead would make a small
 *   file invisible, which is the failure the requirement calls out.
 *
 * - **Nothing here navigates.** Cards report clicks through the handlers they
 *   were given; the level is `index.ts`'s business. A renderer that called back
 *   into navigation would make the two files mutually dependent.
 */
import type { MapDirInput, MapFileInput, MapHunk, MapStatus, Tile } from "./contract.ts";

/** The SVG namespace; a plain `createElement` would produce an inert element. */
export const SVG_NS = "http://www.w3.org/2000/svg";

/**
 * Below this width or height a card drops its text.
 *
 * Measured against the smallest type the stylesheet allows (9px): a card needs
 * room for a glyph plus a couple of characters before a label reads as a label
 * rather than as a smudge.
 */
export const TEXT_MIN_WIDTH = 34;
export const TEXT_MIN_HEIGHT = 18;

/**
 * Below this width the distribution bar is dropped.
 *
 * A bar is a position readout; under a few dozen pixels every segment collapses
 * into the same pixel and the bar claims a precision it does not have.
 */
export const BAR_MIN_WIDTH = 48;

/**
 * How many files one level will draw.
 *
 * A directory with thousands of direct files would otherwise build thousands of
 * nodes synchronously, which is the one thing that can make the map slower than
 * the `git diff` it is meant to beat. Past this cap the level draws its largest
 * files and says how many it left out — an aggregate marker, not a blank area.
 */
export const MAX_FILES_PER_LEVEL = 400;

/**
 * The glyph each status is drawn with.
 *
 * Shape is the second channel: `+` and `−` differ in both form and colour, `×`
 * is unlike either, and the conflict marker is a warning triangle rather than a
 * letter so it cannot be confused with a status letter at small sizes.
 */
const STATUS_GLYPH: Readonly<Record<MapStatus, string>> = {
  added: "+",
  modified: "~",
  deleted: "×",
  renamed: "→",
  copied: "⧉",
  "type-changed": "⇄",
  untracked: "?",
  conflicted: "!",
  unknown: "·",
};

/**
 * The shape channel, as a value a stylesheet and a test can both read.
 *
 * `data-shape` is what makes the encoding assertable without a screenshot: a
 * greyscale check is a check that these values differ, and a stylesheet can key
 * a border style or a dash pattern off them.
 *
 * Every status gets its own token, including the ones that are not among the
 * five the requirement names. Two statuses sharing a shape would mean the shape
 * channel carries no information for that pair, and the pair would then be
 * distinguishable by colour alone — which is the failure the second channel
 * exists to prevent.
 */
const STATUS_SHAPE: Readonly<Record<MapStatus, string>> = {
  added: "solid",
  modified: "dash-dot",
  deleted: "dashed",
  renamed: "double",
  copied: "double-dot",
  "type-changed": "dotted",
  untracked: "sparse",
  conflicted: "hatched",
  unknown: "none",
};

/**
 * The status a file card should encode.
 *
 * An unchanged file has no status, and the map must not invent one: `unknown`
 * would render as a status mark on a file nothing happened to.
 * @param file - the file input.
 * @returns the status, or null for an unchanged file.
 */
export function statusOf(file: MapFileInput): MapStatus | null {
  if (!file.changed) return null;
  return file.status ?? "modified";
}

/** The glyph for a status. */
export function glyphOf(status: MapStatus): string {
  return STATUS_GLYPH[status];
}

/** The shape token for a status. */
export function shapeOf(status: MapStatus): string {
  return STATUS_SHAPE[status];
}

/**
 * The churn reading a card shows.
 *
 * A deletion has no additions to report, a binary file has no line counts at
 * all, and a conflicted file's numbers would be a guess — all three say what
 * they are instead of showing `+0 −0`, which reads as "nothing changed".
 * @param file - the file input.
 * @returns the label, or null when the card should show no churn.
 */
export function churnOf(file: MapFileInput): string | null {
  if (!file.changed) return null;
  if (file.binary === true) return "bin";
  if (file.status === "conflicted") return "conflict";
  if (file.status === "untracked") return "new";
  const additions = file.additions ?? null;
  const deletions = file.deletions ?? null;
  if (additions === null && deletions === null) return null;
  const parts: string[] = [];
  if (additions !== null) parts.push(`+${String(additions)}`);
  if (deletions !== null) parts.push(`−${String(deletions)}`);
  return parts.join(" ");
}

/**
 * The base name of a path, which is what a card is labelled with.
 * @param path - a repository-relative path.
 * @returns everything after the last slash.
 */
export function baseName(path: string): string {
  const slash = path.lastIndexOf("/");
  return slash < 0 ? path : path.slice(slash + 1);
}

/** One bar segment, positioned in the card's own 0..1 space. */
export interface BarSegment {
  readonly kind: "add" | "del";
  /** Left edge, 0..1. */
  readonly start: number;
  /** Width, 0..1. */
  readonly width: number;
}

/**
 * Turn a file's hunks into bar segments.
 *
 * Positions are normalized against the file's new-side length, so the bar reads
 * as "this edit is a third of the way down the file" regardless of how tall the
 * card is. Two decisions are worth naming:
 *
 * - A hunk with no new lines is a pure deletion, so it is drawn in the deletion
 *   colour at the position it was removed from. A zero-width segment would be
 *   invisible, so it gets a minimum width — the bar says "something was removed
 *   here", which is the fact, without pretending to a precision it lacks.
 *
 * - A file whose whole content is new (an addition, an untracked file) is one
 *   full-width addition segment rather than a segment per hunk: there is no
 *   distribution to show when everything is new.
 * @param file - the file input.
 * @param totalLines - the file's line count, used to normalize.
 * @returns the segments, in file order.
 */
export function barSegments(file: MapFileInput, totalLines: number | null): BarSegment[] {
  const hunks: readonly MapHunk[] = file.hunks ?? [];
  if (hunks.length === 0) return [];
  const span = totalLines !== null && totalLines > 0 ? totalLines : null;
  if (span === null) {
    // No line count to normalize against: the whole card is one segment, which
    // is the honest reading of "the change is somewhere in this file".
    return [{ kind: "add", start: 0, width: 1 }];
  }
  const segments: BarSegment[] = [];
  for (const hunk of hunks) {
    const start = Math.min(Math.max((hunk.newStart - 1) / span, 0), 1);
    const rawWidth = hunk.newLines > 0 ? hunk.newLines / span : 0;
    const width = Math.min(Math.max(rawWidth, hunk.newLines > 0 ? 0.01 : 0.02), 1 - start);
    segments.push({ kind: hunk.newLines > 0 ? "add" : "del", start, width: Math.max(width, 0.01) });
  }
  return segments;
}

/**
 * Create one SVG element with attributes.
 * @param document - the document to create in.
 * @param name - the SVG tag.
 * @param attributes - the attributes to set.
 * @returns the element.
 */
function svgEl(document: Document, name: string, attributes: Readonly<Record<string, string>>): SVGElement {
  const element = document.createElementNS(SVG_NS, name);
  for (const [key, value] of Object.entries(attributes)) element.setAttribute(key, value);
  return element;
}

/**
 * Create one SVG text node.
 * @param document - the document to create in.
 * @param attributes - the attributes to set.
 * @param text - the text content.
 * @returns the element.
 */
function svgText(document: Document, attributes: Readonly<Record<string, string>>, text: string): SVGTextElement {
  const element = svgEl(document, "text", attributes) as SVGTextElement;
  element.textContent = text;
  return element;
}

/** What a card needs from the level it sits in. */
export interface CardContext {
  readonly document: Document;
  /** Clicks on a file card. */
  readonly onOpenFile?: (path: string) => void;
  /**
   * Clicks on a directory card.
   *
   * Always supplied by the mount: drilling is the map's own behaviour, not a
   * caller's. The caller is *told* the level changed; it does not drive it, or a
   * map mounted without handlers would be a map that cannot be navigated.
   */
  readonly onDrill?: (path: string) => void;
  /** The pointer entered or left a file card; `null` means it left. */
  readonly onHover?: (path: string | null) => void;
}

/**
 * Build a directory card: the block, its header reading, and its status.
 *
 * A directory shows its name, its subtree's line count, how many files below it
 * changed, and the aggregate `+A −D`. A directory with nothing changed shows the
 * first two and no churn: `+0 −0` on an untouched folder is noise that makes the
 * changed ones harder to find.
 * @param context - the document and the click handlers.
 * @param tile - the laid-out tile.
 * @param dir - the directory input.
 * @returns the group holding the card.
 */
export function dirCard(context: CardContext, tile: Tile, dir: MapDirInput): SVGGElement {
  const { document } = context;
  const group = svgEl(document, "g", {
    "data-rm": "map-tile",
    "data-kind": "dir",
    "data-path": tile.path,
    "data-lines": String(tile.lines),
    "data-changed": dir.changed ? "true" : "false",
  }) as SVGGElement;

  group.append(
    svgEl(document, "rect", {
      x: String(tile.x),
      y: String(tile.y),
      width: String(tile.width),
      height: String(tile.height),
      "data-rm": "map-tile-rect",
      "data-changed": dir.changed ? "true" : "false",
    }),
  );

  if (tile.width >= TEXT_MIN_WIDTH && tile.height >= TEXT_MIN_HEIGHT) {
    const label = baseName(tile.path) === "" ? tile.path : baseName(tile.path);
    group.append(
      svgText(
        document,
        { x: String(tile.x + 4), y: String(tile.y + 12), "data-rm": "map-dir-name" },
        label,
      ),
    );
    // The reading is the folder header's whole point: lines, changed files, and
    // the aggregate churn, all from the same numbers the list shows.
    const changedFiles = dir.changedFiles ?? 0;
    const pending = dir.pending === true;
    const reading = pending
      ? `${String(tile.lines)} lines · pending`
      : dir.changed
        ? `${String(tile.lines)} lines · ${String(changedFiles)} changed · +${String(dir.additions ?? 0)} −${String(dir.deletions ?? 0)}`
        : `${String(tile.lines)} lines`;
    if (tile.height >= TEXT_MIN_HEIGHT * 2) {
      group.append(
        svgText(
          document,
          { x: String(tile.x + 4), y: String(tile.y + 24), "data-rm": "map-dir-reading", "data-pending": pending ? "true" : "false" },
          reading,
        ),
      );
    }
  }

  if (context.onDrill !== undefined) {
    const drill = context.onDrill;
    group.addEventListener("click", () => {
      drill(tile.path);
    });
  }
  return group;
}

/**
 * Build a file card: the block, its name, its churn, its status mark and its
 * distribution bar.
 * @param context - the document and the click handlers.
 * @param tile - the laid-out tile.
 * @param file - the file input.
 * @returns the group holding the card.
 */
export function fileCard(context: CardContext, tile: Tile, file: MapFileInput): SVGGElement {
  const { document } = context;
  const status = statusOf(file);
  const deleted = status === "deleted";
  const attributes: Record<string, string> = {
    "data-rm": "map-tile",
    "data-kind": "file",
    "data-path": tile.path,
    "data-lines": String(tile.lines),
    "data-changed": file.changed ? "true" : "false",
  };
  if (status !== null) {
    attributes["data-status"] = status;
    attributes["data-shape"] = shapeOf(status);
  }
  if (file.additions !== undefined && file.additions !== null) attributes["data-additions"] = String(file.additions);
  if (file.deletions !== undefined && file.deletions !== null) attributes["data-deletions"] = String(file.deletions);
  if (deleted) attributes["data-deleted"] = "true";
  if (file.binary === true) attributes["data-binary"] = "true";

  const group = svgEl(document, "g", attributes) as SVGGElement;

  const rectAttributes: Record<string, string> = {
    x: String(tile.x),
    y: String(tile.y),
    width: String(tile.width),
    height: String(tile.height),
    "data-rm": "map-tile-rect",
    "data-changed": file.changed ? "true" : "false",
  };
  if (status !== null) {
    rectAttributes["data-status"] = status;
    rectAttributes["data-shape"] = shapeOf(status);
  }
  if (deleted) rectAttributes["data-deleted"] = "true";
  group.append(svgEl(document, "rect", rectAttributes));

  const roomy = tile.width >= TEXT_MIN_WIDTH && tile.height >= TEXT_MIN_HEIGHT;
  if (roomy) {
    // Unchanged files get no label: the requirement is explicit that the map
    // must not annotate what did not change, or the changed cards stop standing
    // out from the texture around them.
    if (file.changed) {
      group.append(
        svgText(
          document,
          { x: String(tile.x + 4), y: String(tile.y + 12), "data-rm": "map-file-name" },
          baseName(tile.path),
        ),
      );
      const churn = churnOf(file);
      if (churn !== null && tile.height >= TEXT_MIN_HEIGHT * 2) {
        group.append(
          svgText(
            document,
            { x: String(tile.x + 4), y: String(tile.y + 24), "data-rm": "map-file-churn" },
            churn,
          ),
        );
      }
      if (status !== null && tile.width >= TEXT_MIN_WIDTH * 1.6) {
        group.append(
          svgText(
            document,
            {
              x: String(tile.x + tile.width - 4),
              y: String(tile.y + 12),
              "text-anchor": "end",
              "data-rm": "map-file-mark",
              "data-status": status,
              "data-shape": shapeOf(status),
            },
            glyphOf(status),
          ),
        );
      }
    }
  }

  // The bar sits at the card's bottom edge, inset so it reads as part of the
  // card rather than as a border. No hunks means no bar: an empty <g> would be
  // a bar that claims a distribution of nothing.
  const segments = file.changed ? barSegments(file, file.lines) : [];
  if (segments.length > 0 && tile.width >= BAR_MIN_WIDTH && tile.height >= TEXT_MIN_HEIGHT) {
    const barHeight = Math.min(3, Math.max(2, tile.height / 12));
    const barY = tile.y + tile.height - barHeight - 1;
    const barWidth = tile.width - 4;
    const bar = svgEl(document, "g", {
      "data-rm": "map-bar",
      "data-path": tile.path,
    });
    for (const segment of segments) {
      bar.append(
        svgEl(document, "rect", {
          x: String(tile.x + 2 + segment.start * barWidth),
          y: String(barY),
          width: String(Math.max(segment.width * barWidth, 0.5)),
          height: String(barHeight),
          "data-rm": "map-bar-seg",
          "data-kind": segment.kind,
          "data-start": segment.start.toFixed(4),
          "data-width": segment.width.toFixed(4),
        }),
      );
    }
    group.append(bar);
  }

  if (context.onOpenFile !== undefined) {
    const open = context.onOpenFile;
    group.addEventListener("click", () => {
      open(tile.path);
    });
  }

  if (context.onHover !== undefined) {
    const hover = context.onHover;
    // `pointerenter`/`pointerleave` rather than `pointerover`/`pointerout`: the
    // latter fire again for every child the pointer crosses, so a card with a
    // label and a bar would report four entries for one visit.
    group.addEventListener("pointerenter", () => {
      hover(tile.path);
    });
    group.addEventListener("pointerleave", () => {
      hover(null);
    });
  }
  return group;
}

/**
 * The aggregate marker a capped level shows.
 *
 * It is a statement, not a blank: the requirement forbids silently dropping the
 * files a cap left out, and a reader who sees "396 more files" knows the map is
 * a summary rather than the whole story.
 * @param document - the document to create in.
 * @param hidden - how many files were left out.
 * @param area - the rectangle the marker is drawn in.
 * @returns the marker group.
 */
export function overflowMarker(document: Document, hidden: number, area: { x: number; y: number; width: number; height: number }): SVGGElement {
  const group = svgEl(document, "g", { "data-rm": "map-overflow", "data-hidden": String(hidden) }) as SVGGElement;
  group.append(
    svgEl(document, "rect", {
      x: String(area.x),
      y: String(area.y),
      width: String(area.width),
      height: String(area.height),
      "data-rm": "map-overflow-rect",
    }),
  );
  if (area.width >= TEXT_MIN_WIDTH && area.height >= TEXT_MIN_HEIGHT) {
    group.append(
      svgText(
        document,
        { x: String(area.x + 4), y: String(area.y + 12), "data-rm": "map-overflow-text" },
        `${String(hidden)} more files`,
      ),
    );
  }
  return group;
}

/**
 * Cap a level's file list to the largest files it will draw.
 *
 * Largest first, then back into path order: the cap has to pick *which* files
 * survive, and the honest choice is the ones that carry the most lines, because
 * those are the ones whose area the reader is being shown. Sorting back into
 * path order afterwards keeps the layout deterministic.
 * @param files - the level's files.
 * @returns the files to draw and how many were left out.
 */
export function capFiles(files: readonly MapFileInput[]): { files: MapFileInput[]; hidden: number } {
  if (files.length <= MAX_FILES_PER_LEVEL) return { files: [...files], hidden: 0 };
  const ranked = [...files].sort((left, right) => {
    const leftLines = left.lines ?? 0;
    const rightLines = right.lines ?? 0;
    if (leftLines !== rightLines) return rightLines - leftLines;
    return left.path < right.path ? -1 : left.path > right.path ? 1 : 0;
  });
  const kept = ranked.slice(0, MAX_FILES_PER_LEVEL).sort((left, right) => (left.path < right.path ? -1 : left.path > right.path ? 1 : 0));
  return { files: kept, hidden: files.length - kept.length };
}
