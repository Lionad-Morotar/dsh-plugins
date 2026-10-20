/**
 * The four surfaces the shell paints, and how much of the picture each lets through.
 *
 * The shell draws a sidebar, a centre column, a right column and a bottom row, and
 * it paints all four from theme tokens rather than from anything a skin can
 * address: two of them have no attribute of their own, and the class names that
 * would identify them carry a build hash (`_6Qf49G_centerCol`), which changes
 * between releases. Naming those classes would be a skin that breaks on the next
 * Harness update.
 *
 * So this module finds the surfaces the way a reader would: from the two stable
 * anchors the shell does publish, `[data-rightbar-col]` and `[data-shell-bottom]`.
 * The right column's parent is the frame, the element before the right column is
 * the centre column, and the frame's first child is the sidebar. That is structure,
 * not naming, and it survives a rename.
 *
 * Once found, each element is stamped with `data-ascii-rest-region="<key>"`. The
 * skin's own stylesheet targets those stamps, and a local override of the surface
 * token on each element makes the region's own value win inside that subtree —
 * including the descendants that repaint themselves from the same token.
 */
import { REGION_KEYS, type RegionKey } from "ascii-rest-scenes";

export { REGION_KEYS, type RegionKey };

/**
 * Whether a value is an element this code can style.
 *
 * `instanceof HTMLElement` cannot be used: the constructor is per-realm, so an
 * element from a document created by another window (a test's jsdom, or an
 * iframe) fails the check even though it is a perfectly good element. What
 * matters here is only that it has a style object and children.
 */
function isElement(value: unknown): value is HTMLElement {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (value as HTMLElement).style === "object" &&
    (value as HTMLElement).style !== null &&
    typeof (value as HTMLElement).getAttribute === "function"
  );
}

/** The attribute this skin stamps on each surface it found. */
export const REGION_ATTRIBUTE = "data-ascii-rest-region";

/** The surface elements, keyed by region. */
export type RegionSurfaces = Record<RegionKey, HTMLElement>;

/** The two tokens the shell's own surface rules repaint from. */
const SURFACE_TOKENS = ["--dsw-alias-bg-base", "--dsw-specific-sidebar-fill"] as const;

/**
 * Find the four surfaces, or null when the shell is not in a shape this build
 * recognises.
 *
 * Returning null rather than throwing matters: the shell mounts after the skin
 * starts and can be absent during a boot failure, and a background that cannot
 * find its surfaces should still show the picture full-bleed.
 */
export function locateRegions(doc: Document): RegionSurfaces | null {
  const rightbar = doc.querySelector("[data-rightbar-col]");
  const bottom = doc.querySelector("[data-shell-bottom]");
  if (!isElement(rightbar) || !isElement(bottom)) return null;

  const frame = rightbar.parentElement;
  if (frame === null) return null;

  const main = rightbar.previousElementSibling;
  const sidebar = frame.firstElementChild;
  if (!isElement(main) || !isElement(sidebar)) return null;
  // The frame's first child is the sidebar only when the sidebar is showing; a
  // collapsed or re-ordered frame would make it the centre column, and painting
  // that as a sidebar is worse than not finding it at all.
  if (sidebar === main || sidebar === bottom || sidebar === rightbar) return null;

  return { sidebar, main, rightbar, bottom };
}

/** Mark the surfaces so the stylesheet can address them. */
export function stampRegions(regions: RegionSurfaces): void {
  for (const key of REGION_KEYS) regions[key].setAttribute(REGION_ATTRIBUTE, key);
}

/**
 * Remove the inline paint, leaving the host's own surface values in charge.
 *
 * The stamps stay. They are inert on their own — the stylesheet uses them only to
 * place the region paint — and removing them here would make the surface look
 * unclaimed to `regionsAreCurrent`, which would send the shell observer back to
 * re-locating and re-stamping on every mutation of a frame it had already found.
 */
export function clearRegionPaint(regions: RegionSurfaces): void {
  for (const key of REGION_KEYS) {
    const element = regions[key];
    element.style.removeProperty("background-color");
    for (const token of SURFACE_TOKENS) element.style.removeProperty(token);
  }
}

/** Remove the stamps and the inline paint, for when the skin is going away. */
export function clearRegions(regions: RegionSurfaces): void {
  clearRegionPaint(regions);
  for (const key of REGION_KEYS) regions[key].removeAttribute(REGION_ATTRIBUTE);
}

/**
 * Paint each surface with its own degree of translucency.
 *
 * The local token override is what makes a region's *descendants* agree with it:
 * the shell repaints panels and cards from `--dsw-alias-bg-base`, so setting that
 * property on the region element gives the whole subtree one answer. Without it,
 * the column would be translucent and the panel inside it opaque again, which
 * reads as a rectangle of background floating in the picture.
 *
 * The colour is written as a bare CSS colour per region, so the caller owns the
 * scheme decision and this stays a dumb painter.
 */
export function paintRegions(regions: RegionSurfaces, colors: Record<RegionKey, string>): void {
  for (const key of REGION_KEYS) {
    const element = regions[key];
    const color = colors[key];
    element.style.backgroundColor = color;
    for (const token of SURFACE_TOKENS) element.style.setProperty(token, color);
  }
}

/** Whether the stamped surfaces are still the ones the shell is showing. */
export function regionsAreCurrent(regions: RegionSurfaces): boolean {
  return REGION_KEYS.every((key) => {
    const element = regions[key];
    return element.isConnected && element.getAttribute(REGION_ATTRIBUTE) === key;
  });
}
