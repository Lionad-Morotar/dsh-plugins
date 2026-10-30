/**
 * The scene3d chunk this package ships.
 *
 * The surface lives in `dsh-preview-viewers`; this file exists so the build
 * emits one chunk per family under this package's own name, and so the props
 * this pane can actually provide are adapted to what that surface wants (see
 * `family-view.tsx`). The chunk name is a contract with the loader — the entry
 * fetches `./client.scene3d.js` and the loader keys a chunk as
 * `<package>/<file>` — so the file has to stay in this package even though its
 * contents do not.
 *
 * A re-export would be enough for a consumer that is already a sidebar host;
 * this one is not, hence the adapter. Either way the bundle is one file: esbuild
 * inlines the shared module, and a chunk has no route for a sibling import.
 */
import { Viewer } from "dsh-preview-viewers/chunks/scene3d.tsx";

import { createFamilyView } from "./family-view.tsx";

/** Diagnostic marker: which family this chunk draws. */
export const renderer = "scene3d" as const;

/** The view the preview pane mounts for glb, gltf, obj, stl and 3mf files. */
export const FamilyView = createFamilyView("scene3d", Viewer);
