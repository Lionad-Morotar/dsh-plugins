/**
 * The image family's MIME mapping: a path in, the type to hand the browser out.
 *
 * The image family exists for the suffixes the browser decodes itself, so unlike
 * raster there is no decoder here. What is left is one decision that has to be
 * right: which `Blob` type the bytes are wrapped in. That decision is a pure
 * function so it can be tested in plain Node, for the same reason `raster.ts`
 * and `cad.ts` keep their engines out of the React surface.
 *
 * The mapping is not derived from the catalogue's extension list. The catalogue
 * answers "who claims this file", and this answers "what is it", and the two
 * disagree on purpose: `jpg` and `jpeg` are two suffixes with one MIME type, and
 * `ico` and `svg` have types no `image/<suffix>` spelling produces.
 */

/**
 * The suffixes this family renders, and the type each is sent as.
 *
 * `svg` is `image/svg+xml` because it is XML: a browser refuses to decode it as
 * a raster image. `ico` is `image/x-icon`, the spelling every browser accepts;
 * it is not in the standard registry under an `image/ico` form.
 */
export const IMAGE_MIME: ReadonlyMap<string, string> = new Map([
  ["png", "image/png"],
  ["jpg", "image/jpeg"],
  ["jpeg", "image/jpeg"],
  ["gif", "image/gif"],
  ["webp", "image/webp"],
  ["bmp", "image/bmp"],
  ["ico", "image/x-icon"],
  ["svg", "image/svg+xml"],
]);

/**
 * The suffix of one path, or null when the name has none.
 *
 * A leading dot is the whole name rather than a suffix, so `.png` is a dotfile
 * called `png`. That is the same rule the format catalogue and the renderer
 * registry apply, and three implementations of it disagreeing would route one
 * file three ways.
 * @param path - decoded file path or bare filename.
 * @returns the lowercased suffix, or null.
 */
function suffixOf(path: string): string | null {
  const name = path.slice(path.lastIndexOf("/") + 1);
  const dot = name.lastIndexOf(".");
  if (dot <= 0) return null;
  return name.slice(dot + 1).toLowerCase();
}

/**
 * The MIME type one file is sent as.
 * @param path - decoded file path or bare filename.
 * @returns the type, or null for a suffix this family does not render.
 */
export function mimeFor(path: string): string | null {
  const suffix = suffixOf(path);
  return suffix === null ? null : (IMAGE_MIME.get(suffix) ?? null);
}

/**
 * Whether one file is an image this family renders.
 * @param path - decoded file path or bare filename.
 * @returns true when `mimeFor` has an answer for it.
 */
export function isImagePath(path: string): boolean {
  return mimeFor(path) !== null;
}
