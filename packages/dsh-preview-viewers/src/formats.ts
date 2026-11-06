/**
 * Format catalogue for the previews these surfaces own.
 *
 * The catalogue answers two questions per family, and they are not the same
 * question: which suffixes it owns, and which surface should claim them. The
 * second one is why `claims` exists. The workbench is the file's main surface,
 * so a file picked in the tree should be drawn where it was picked rather than
 * bounce the reader into a sidebar tab; that is why images and PDF are claimed
 * for the workbench at all, even though the built-in preview renders them too.
 * The sidebar is a second opinion on the same files, and for those two it
 * declines: the host's own image preview has a shared zoom viewport and its PDF
 * preview a selectable text layer, so an `extension`-band claim there would win
 * the file and lose the reader both.
 *
 * Office documents (docx, pptx, xlsx) and csv stay unclaimed by either surface:
 * the built-in preview's renderers for those are richer than anything drawn
 * here would be, so claiming them would only shadow a better implementation.
 *
 * The catalogue is data, not behaviour, so it is the one place a new format is
 * added: every consuming plugin derives its registry from it and its sidebar
 * adapter derives its viewers from it, and a family declared here without a
 * chunk built for it fails the consuming build instead of 404ing at runtime.
 * That is why it lives in the shared package rather than in one plugin: two
 * consumers keeping two catalogues would disagree about who claims what.
 */

/** Which renderer draws one family. */
export type PreviewFamily = "scene3d" | "raster" | "cad" | "image" | "pdf";

/**
 * A surface that can claim a family.
 *
 * The catalogue used to answer only "who claims this suffix", which was enough
 * while one consumer read it. Two consumers read it now, and they disagree about
 * two families: the workbench wants images and PDF because it is the file's main
 * surface, and the sidebar does not because the host's own previews for those
 * carry a zoom viewport and a selectable text layer. That disagreement belongs
 * here, as data, rather than as a second suffix list inside one consumer.
 */
export type PreviewSurface = "workbench" | "sidebar";

/** One renderer family and the suffixes it owns. */
export interface PreviewFormat {
  /** Renderer family; also names the lazy chunk that carries the engine. */
  readonly family: PreviewFamily;
  /** Suffixes without a leading dot. */
  readonly extensions: readonly string[];
  /** Localized name shown in the preview toolbar. */
  readonly titleKey: string;
  /**
   * Which surfaces should claim this family.
   *
   * A consumer registers a family only when it is listed here, so a family the
   * catalogue gains does not silently appear in a surface that has a better
   * answer for it. Both consumers still build a chunk for every family: the
   * chunk table describes what the package can draw, and the claim describes
   * where it should.
   */
  readonly claims: readonly PreviewSurface[];
}

/**
 * The catalogue, one entry per family.
 *
 * `stl` is included even though two community plugins already preview it: the
 * mesh formats share one viewport here, and a user who installs this plugin for
 * glb should not then have to install a second plugin for stl. The README says
 * so explicitly.
 */
export const PREVIEW_FORMATS: readonly PreviewFormat[] = [
  {
    family: "scene3d",
    extensions: ["glb", "gltf", "obj", "stl", "3mf"],
    titleKey: "scene3d.title",
    claims: ["workbench", "sidebar"],
  },
  {
    // tiff/tif and avif are the two image suffixes the built-in preview refuses:
    // tiff is listed as an unviewable binary, avif is missing from its image
    // list entirely, so neither shadows a working renderer.
    family: "raster",
    extensions: ["tif", "tiff", "avif"],
    titleKey: "raster.title",
    claims: ["workbench", "sidebar"],
  },
  {
    // DXF is 2D CAD, a different renderer rather than another mesh format: it is
    // a drawing of lines, arcs and hatches with layers, not a surface. DWG is
    // deliberately absent, since every DWG decoder is GPL.
    family: "cad",
    extensions: ["dxf"],
    titleKey: "cad.title",
    claims: ["workbench", "sidebar"],
  },
  {
    // The suffixes the built-in preview's image list already covers, claimed
    // anyway: a reader who clicks a png in the tree stays in the tree. The
    // sidebar is deliberately absent: the host draws images in a shared zoom
    // viewport, which is more than this family's plain `<img>` does, and an
    // `extension`-band claim would win the file and lose the reader the zoom.
    family: "image",
    extensions: ["png", "jpg", "jpeg", "gif", "webp", "bmp", "ico", "svg"],
    titleKey: "image.title",
    claims: ["workbench"],
  },
  {
    // One suffix, one family: PDF needs its own chunk because it carries a
    // worker-based engine rather than an image decoder. Workbench only, for the
    // same reason as image: the host's PDF preview has a selectable text layer
    // and lazy per-page rendering, and this one draws a canvas without text.
    family: "pdf",
    extensions: ["pdf"],
    titleKey: "pdf.title",
    claims: ["workbench"],
  },
];

/** Every suffix the plugin claims, in catalogue order. */
export function claimedExtensions(): string[] {
  return PREVIEW_FORMATS.flatMap((format) => [...format.extensions]);
}

/** The renderer families present in the catalogue, in catalogue order. */
export function families(): PreviewFamily[] {
  return PREVIEW_FORMATS.map((format) => format.family);
}

/**
 * The families one surface should claim, in catalogue order.
 *
 * A consumer registers from this rather than from {@link families}: the chunk
 * table still covers every family, because a chunk describes what the package
 * can draw, while this answers what the surface should offer.
 * @param surface - the surface asking.
 * @returns the families that surface claims.
 */
export function familiesFor(surface: PreviewSurface): PreviewFamily[] {
  return PREVIEW_FORMATS.filter((format) => format.claims.includes(surface)).map((format) => format.family);
}

/**
 * The suffixes one family owns.
 * @param family - renderer family.
 * @returns every suffix in that family, empty for a family the catalogue omits.
 */
export function extensionsOf(family: PreviewFamily): readonly string[] {
  return PREVIEW_FORMATS.find((format) => format.family === family)?.extensions ?? [];
}

/**
 * The family owning one filename.
 * @param path - decoded filename or full path.
 * @returns the owning family, or null for a name this plugin does not claim.
 */
export function familyOf(path: string): PreviewFamily | null {
  const name = path.slice(path.lastIndexOf("/") + 1);
  const dot = name.lastIndexOf(".");
  if (dot <= 0) return null;
  const suffix = name.slice(dot + 1).toLowerCase();
  return PREVIEW_FORMATS.find((format) => format.extensions.includes(suffix))?.family ?? null;
}

/**
 * The lazy chunk file name carrying one family's engine.
 * @param family - renderer family.
 * @returns the chunk name relative to the package, `./client.<family>.js`.
 */
export function chunkOf(family: PreviewFamily): string {
  return `./client.${family}.js`;
}
