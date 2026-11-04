/**
 * Format catalogue for the previews these surfaces own.
 *
 * The catalogue is the workbench's claim list, and the workbench is the file's
 * main surface: a file picked in the tree should be drawn where it was picked,
 * not bounce the reader into a sidebar tab. That is why images and PDF are
 * claimed here even though the built-in preview renders them too. The goal is
 * not to out-render that preview but to keep one surface authoritative for the
 * files a reader opens from the tree.
 *
 * Office documents (docx, pptx, xlsx) and csv stay unclaimed: the built-in
 * preview's renderers for those are richer than anything drawn here would be,
 * so claiming them would only shadow a better implementation.
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

/** One renderer family and the suffixes it owns. */
export interface PreviewFormat {
  /** Renderer family; also names the lazy chunk that carries the engine. */
  readonly family: PreviewFamily;
  /** Suffixes without a leading dot. */
  readonly extensions: readonly string[];
  /** Localized name shown in the preview toolbar. */
  readonly titleKey: string;
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
  },
  {
    // tiff/tif and avif are the two image suffixes the built-in preview refuses:
    // tiff is listed as an unviewable binary, avif is missing from its image
    // list entirely, so neither shadows a working renderer.
    family: "raster",
    extensions: ["tif", "tiff", "avif"],
    titleKey: "raster.title",
  },
  {
    // DXF is 2D CAD, a different renderer rather than another mesh format: it is
    // a drawing of lines, arcs and hatches with layers, not a surface. DWG is
    // deliberately absent, since every DWG decoder is GPL.
    family: "cad",
    extensions: ["dxf"],
    titleKey: "cad.title",
  },
  {
    // The suffixes the built-in preview's image list already covers, claimed
    // anyway: a reader who clicks a png in the tree stays in the tree.
    family: "image",
    extensions: ["png", "jpg", "jpeg", "gif", "webp", "bmp", "ico", "svg"],
    titleKey: "image.title",
  },
  {
    // One suffix, one family: PDF needs its own chunk because it carries a
    // worker-based engine rather than an image decoder.
    family: "pdf",
    extensions: ["pdf"],
    titleKey: "pdf.title",
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
