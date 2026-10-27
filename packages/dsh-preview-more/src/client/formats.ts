/**
 * Format catalogue for the previews this plugin owns.
 *
 * Every suffix here is one the built-in preview package either does not claim
 * at all (glb/gltf/obj/stl/3mf/dxf) or claims only as an unviewable binary
 * (tiff/tif/avif). Suffixes the built-in renders well — docx, pdf, png, svg,
 * xlsx — are deliberately absent: claiming them again would only shadow a
 * better implementation.
 *
 * The catalogue is data, not behaviour, so it is the one place a new format is
 * added: the registry, the better-sidebar adapter and the docs all read it.
 */

/** Which renderer draws one family. */
export type PreviewFamily = "scene3d" | "raster";

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