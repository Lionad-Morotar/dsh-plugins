/**
 * Host half.
 *
 * Every capability of this package lives in the browser: the service, the host
 * adapters, the settings section and the keymap table are all client-side. The
 * row still exists because every Loader row in this repo is loaded on both
 * surfaces, and an empty apply is what makes the row legal on the host without
 * claiming a capability it does not have.
 */
import { PACKAGE_NAME, WORKBENCH_SERVICE, WORKBENCH_VERSION } from "./shared.ts";

export { PACKAGE_NAME, WORKBENCH_SERVICE, WORKBENCH_VERSION };

/** Loader row name; must match the id in `cordis.patch.yml`. */
export const name = PACKAGE_NAME;

/** Services the host half reads; none, which is why the list is empty. */
export const inject: string[] = [];

/** One-line description of what the client half installs. */
export interface WorkbenchHostInfo {
  readonly name: string;
  readonly service: string;
  readonly version: number;
}

/** Describe the client contract for diagnostics and host-side settings. */
export function describe(): WorkbenchHostInfo {
  return { name: PACKAGE_NAME, service: WORKBENCH_SERVICE, version: WORKBENCH_VERSION };
}

/** No host-side work: see the module note. */
export function apply(): void {}
