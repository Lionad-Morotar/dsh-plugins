/**
 * Host half.
 *
 * The file workbench is a browser surface: discovery, reading and preview all
 * happen in the client half over host services. The row still loads on the host
 * so the package is legal on both surfaces; an empty apply claims nothing.
 */
import { PACKAGE_NAME, VIEW_ID, VIEW_ORDER, VIEW_SLOT } from "./shared.ts";

export { PACKAGE_NAME, VIEW_ID, VIEW_ORDER, VIEW_SLOT };

/** Loader row name; must match the id in `cordis.patch.yml`. */
export const name = PACKAGE_NAME;

/** Services the host half reads; none. */
export const inject: string[] = [];

/** Registration coordinates, useful to host-side diagnostics. */
export function describe(): { name: string; slot: string; id: string; order: number } {
  return { name: PACKAGE_NAME, slot: VIEW_SLOT, id: VIEW_ID, order: VIEW_ORDER };
}

/** No host-side work: see the module note. */
export function apply(): void {}
