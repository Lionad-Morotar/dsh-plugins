/**
 * Host half.
 *
 * The terminal dock is a browser surface over the host's `webTerminals`
 * service; process lifetime belongs to the host. This row exists so the package
 * loads on both surfaces and claims nothing it does not own.
 */
import { DOCK_ID, DOCK_SLOT, PACKAGE_NAME } from "./shared.ts";

export { DOCK_ID, DOCK_SLOT, PACKAGE_NAME };

/** Loader row name; must match the id in `cordis.patch.yml`. */
export const name = PACKAGE_NAME;

/** Services the host half reads; none. */
export const inject: string[] = [];

/** Registration coordinates, useful to host-side diagnostics. */
export function describe(): { name: string; slot: string; id: string } {
  return { name: PACKAGE_NAME, slot: DOCK_SLOT, id: DOCK_ID };
}

/** No host-side work: see the module note. */
export function apply(): void {}
