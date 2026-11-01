/**
 * Client half entry: plugin shell plus the renderer mount point.
 *
 * The workbench panel kind registration is S3; what exists here is the
 * assembly seam that slice will call — load the lazy diagram chunk, resolve
 * render positions against the view-state offsets, and hand the finished
 * drags back as baselined offsets so they survive model edits.
 *
 * The renderer itself is deliberately never imported statically: pulling it
 * into this file would drag it into the startup bundle client.js, which the
 * build asserts stays renderer-free.
 */
import type { DiagramHandle, DiagramView } from "./chunk/diagram.ts";
import type { DiagramChunkModule, LoaderRequire } from "./chunk-loader.ts";
import { PACKAGE_NAME } from "../shared.ts";
import { loadDiagramChunk } from "./chunk-loader.ts";
import { applyViewOffsets, defaultViewport, offsetFromDrag } from "./view-state.ts";
import type { ViewStateHandle } from "./view-state.ts";

export { boot } from "./chunk-loader.ts";

export default {
  name: PACKAGE_NAME,
  inject: ["dsh-workbench-core"],
  apply(): void {},
};

/**
 * Mount one laid-out view into a host element.
 *
 * Offsets recorded for the view are applied to the render positions (invalid
 * ones drop out host-side of the renderer, per the half-a-node rule), the
 * initial viewport comes from the state or the readable default, and every
 * finished drag is queued back as a correction offset.
 *
 * @param host - element the SVG renders into.
 * @param view - one laid-out view from the wire payload; never mutated.
 * @param state - panel view-state to read offsets/viewport from and queue
 *   drags into.
 * @param load - chunk resolver, injectable so tests can wire the real
 *   renderer without the ModuleLoader.
 * @returns the diagram handle with the viewport applied.
 */
export async function mountArchDiagram(
  host: HTMLElement,
  view: DiagramView,
  state: ViewStateHandle,
  load: () => Promise<DiagramChunkModule> = loadDiagramChunk,
): Promise<DiagramHandle> {
  const chunk = await load();
  const offsets = state.offsetsFor(view.id);
  const positions = applyViewOffsets(view.nodes, offsets);

  const box = host.getBoundingClientRect();
  const viewport = state.viewport ?? defaultViewport(view.bounds, { width: box.width, height: box.height });

  const diagram = chunk.createDiagram(host, view, {
    viewport,
    positions,
    onMove: (id, x, y) => {
      const base = view.nodes.find(node => node.id === id);
      if (base !== undefined) state.queueOffset(view.id, id, offsetFromDrag(base, x, y));
    },
  });

  state.setView(view.id);
  state.setViewport(diagram.viewport());
  return diagram;
}
