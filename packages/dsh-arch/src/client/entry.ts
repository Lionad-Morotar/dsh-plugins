/**
 * Client half placeholder.
 *
 * S2/S3 will register the Arch dock panel kind through the workbench service
 * and load the SVG renderer chunk; until then this shell exists so the Loader
 * row and the built `lib/client.js` entry stay valid.
 */
import { PACKAGE_NAME } from "../shared.ts";

export default {
  name: PACKAGE_NAME,
  inject: ["dsh-workbench-core"],
  apply(): void {},
};
