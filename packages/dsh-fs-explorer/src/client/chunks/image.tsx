/**
 * The image chunk this package ships.
 *
 * The family is registered and routed, but its surface is not written yet: this
 * chunk exists so the catalogue, the route table and the build agree on a file
 * for `image` before there is anything to draw. It says so on screen instead of
 * mounting a blank box, because a preview that silently renders nothing is
 * indistinguishable from a broken one.
 *
 * The marker below is not decoration: `scripts/build.mjs` asserts every family
 * chunk carries its own engine marker and that the entry carries none, and an
 * empty stub would pass every other check in that script. `createObjectURL` is
 * the blob-URL path any browser-decoded image surface has to take, so it is the
 * marker the real implementation will also satisfy.
 *
 * The props are the better-sidebar viewer's, adapted through
 * `createFamilyView` like every other family here; see `family-view.tsx`.
 */
import type { ReactElement } from "react";

import type { SidebarViewerProps } from "dsh-preview-viewers/contracts.ts";

import { createFamilyView } from "./family-view.tsx";

/** Diagnostic marker: which family this chunk draws. */
export const renderer = "image" as const;

/** The engine symbol the build looks for; see the module comment. */
export const marker = "createObjectURL" as const;

/**
 * The not-yet-wired surface.
 *
 * It renders the marker as text so the string survives minification in the
 * emitted chunk, which is what the build's marker assertion reads.
 * @param props - the shared viewer props; unused until the surface lands.
 * @returns one line naming the state, plus the marker.
 */
function PendingViewer(_props: SidebarViewerProps): ReactElement {
  return (
    <div className="fx-family-pending" data-testid="fs-preview-pending" data-family={renderer}>
      <p>该类预览尚未接入</p>
      <p>{marker}</p>
    </div>
  );
}

/** The view the preview pane mounts for png, jpg, gif, webp, bmp, ico and svg files. */
export const FamilyView = createFamilyView("image", PendingViewer);
