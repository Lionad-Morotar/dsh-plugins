/**
 * The cad chunk this package ships.
 *
 * The surface lives in `dsh-preview-viewers`; this file exists so the build
 * emits one chunk per family under this package's own name, and so the props
 * this pane can actually provide are adapted to what that surface wants (see
 * `family-view.tsx`). The chunk name is a contract with the loader — the entry
 * fetches `./client.cad.js` and the loader keys a chunk as `<package>/<file>` —
 * so the file has to stay in this package even though its contents do not.
 */
import { Viewer } from "dsh-preview-viewers/chunks/cad.tsx";

import { createFamilyView } from "./family-view.tsx";

/** Diagnostic marker: which family this chunk draws. */
export const renderer = "cad" as const;

/** The view the preview pane mounts for dxf files. */
export const FamilyView = createFamilyView("cad", Viewer);
