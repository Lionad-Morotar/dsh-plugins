/**
 * The image chunk this package ships.
 *
 * The surface lives in `dsh-preview-viewers`; this file exists so the build emits
 * one chunk per family under this package's own name, and so the props this pane
 * can actually provide are adapted to what that surface wants (see
 * `family-view.tsx`). The chunk name is a contract with the loader: the entry
 * fetches `./client.image.js` and the loader keys a chunk as `<package>/<file>`,
 * so the file has to stay in this package even though its contents do not.
 *
 * The shared surface renders from `customData.bytes`, which is exactly what the
 * adapter hands it after its own read, so no wrapper is needed here.
 */
import { Viewer } from "dsh-preview-viewers/chunks/image.tsx";

import { createFamilyView } from "./family-view.tsx";

/** Diagnostic marker: which family this chunk draws. */
export const renderer = "image" as const;

/** The view the preview pane mounts for png, jpg, gif, webp, bmp, ico and svg files. */
export const FamilyView = createFamilyView("image", Viewer);
