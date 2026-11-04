/**
 * The image chunk this package ships.
 *
 * Every other chunk here re-exports a surface from `dsh-preview-viewers`; this
 * one cannot, because the shared package has no image surface yet. It stays a
 * real chunk anyway so the catalogue, the entry's registration loop and the
 * build agree on a file for `image` before there is anything to draw, and it
 * says so on screen rather than mounting a blank box.
 *
 * `Body` and `Viewer` are both exported because the entry refuses a chunk that
 * lacks either: the native document tab and dsh-better-sidebar are two hosts
 * for one renderer, and a family that answers only one of them would fail to
 * load in the other.
 *
 * `createObjectURL` is the blob-URL path any browser-decoded image surface has
 * to take, so it is the marker the real implementation will also satisfy.
 */
import type { ReactElement } from "react";

/** Diagnostic marker: which family this chunk draws. */
export const marker = "createObjectURL" as const;

/**
 * The not-yet-wired surface, shared by both hosts.
 * @returns one line naming the state, plus the marker.
 */
function Pending(): ReactElement {
  return (
    <div className="preview-more-status" data-testid="preview-more-pending" data-family="image">
      <p>该类预览尚未接入</p>
      <p>{marker}</p>
    </div>
  );
}

/** The native document body. */
export function Body(): ReactElement {
  return <Pending />;
}

/** The dsh-better-sidebar viewer. */
export function Viewer(): ReactElement {
  return <Pending />;
}
