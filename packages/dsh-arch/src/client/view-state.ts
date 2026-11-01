/**
 * Client-side Arch tab state: which view is open, its viewport, and the drag
 * offsets waiting to be written back to the host store.
 *
 * The viewport default is a fixed readable scale centered on the view bounds,
 * deliberately not a fit-to-view: a 300px dock fits the repo's real views at
 * ~0.13, where 12px labels render at 1.5px (measured in the research note).
 *
 * Offsets are correction intent, not layout snapshots, so they survive model
 * edits only while the node stayed near the coordinates the correction was
 * recorded against; past half a node of drift the correction belongs to a
 * different layout generation and is dropped on the floor.
 */
import type { ArchNodeOffset, ArchViewport, ArchWorkspaceState } from "../shared.ts";

/** Readable default zoom for a dock-height panel; see the file header. */
export const DEFAULT_VIEW_SCALE = 0.75;

export interface DiagramBounds {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
}

/** The node fields the offset logic needs from a laid-out view. */
export interface OffsetNode {
  readonly id: string;
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
}

/**
 * Fixed-scale viewport centered on the view bounds.
 *
 * @param bounds - the laid-out view bounds (already in view coordinates).
 * @param host - host element size; zero sizes still produce a meaningful
 *   centering (the center lands at the host origin), which is what jsdom's
 *   empty layout reports.
 */
export function defaultViewport(bounds: DiagramBounds, host: { width: number; height: number }): ArchViewport {
  return {
    scale: DEFAULT_VIEW_SCALE,
    tx: host.width / 2 - (bounds.x + bounds.width / 2) * DEFAULT_VIEW_SCALE,
    ty: host.height / 2 - (bounds.y + bounds.height / 2) * DEFAULT_VIEW_SCALE,
  };
}

/**
 * Invalidation rule (decision D9): a correction applies while the node's
 * current laid-out position drifted less than half a node from the baseline
 * recorded with it. The comparison is exclusive at exactly half a node.
 */
export function offsetApplies(node: OffsetNode, offset: ArchNodeOffset): boolean {
  const dx = Math.abs(node.x - offset.baseX);
  const dy = Math.abs(node.y - offset.baseY);
  return dx <= node.width / 2 && dy <= node.height / 2;
}

/**
 * Resolve every node's render position for one view: stacked valid offsets,
 * laid-out positions for everything else. Orphan offsets (node deleted from
 * the model) never match a node and are ignored by construction.
 */
export function applyViewOffsets(
  nodes: readonly OffsetNode[],
  offsets: Readonly<Record<string, ArchNodeOffset>>,
): ReadonlyMap<string, { x: number; y: number }> {
  const positions = new Map<string, { x: number; y: number }>();
  for (const node of nodes) {
    const offset = offsets[node.id];
    if (offset !== undefined && offsetApplies(node, offset)) {
      positions.set(node.id, { x: node.x + offset.dx, y: node.y + offset.dy });
    } else {
      positions.set(node.id, { x: node.x, y: node.y });
    }
  }
  return positions;
}

/**
 * Turn a finished drag into a persisted offset, baselined against the node's
 * laid-out coordinates (pre-correction), which is what invalidation compares
 * against on the next load.
 */
export function offsetFromDrag(node: { x: number; y: number }, displayX: number, displayY: number): ArchNodeOffset {
  return {
    dx: displayX - node.x,
    dy: displayY - node.y,
    baseX: node.x,
    baseY: node.y,
  };
}

export interface ViewStateHandle {
  readonly viewId: string | null;
  readonly viewport: ArchViewport | null;
  setView(id: string): void;
  setViewport(viewport: ArchViewport): void;
  /** Committed plus queued offsets for one view, queued wins. */
  offsetsFor(viewId: string): Readonly<Record<string, ArchNodeOffset>>;
  queueOffset(viewId: string, nodeId: string, offset: ArchNodeOffset): void;
  /** Drop queued corrections after a successful write-back. */
  flush(): void;
  serialize(viewHash: string): ArchWorkspaceState;
  restore(state: ArchWorkspaceState): void;
}

/**
 * Per-panel state holder. Kept as a closure instead of a class so the shape
 * the tests drive is exactly the shape the Arch panel consumes.
 */
export function createViewState(): ViewStateHandle {
  let viewId: string | null = null;
  let viewport: ArchViewport | null = null;
  let committed: Record<string, Record<string, ArchNodeOffset>> = {};
  const queued = new Map<string, ArchNodeOffset>();
  let queuedView: string | null = null;

  const mergeQueued = (): Record<string, Record<string, ArchNodeOffset>> => {
    if (queued.size === 0 || queuedView === null) return committed;
    const merged: Record<string, Record<string, ArchNodeOffset>> = {};
    for (const [id, offsets] of Object.entries(committed)) merged[id] = { ...offsets };
    const view = merged[queuedView] ?? {};
    for (const [nodeId, offset] of queued) view[nodeId] = offset;
    merged[queuedView] = view;
    return merged;
  };

  const handle: ViewStateHandle = {
    get viewId(): string | null {
      return viewId;
    },
    get viewport(): ArchViewport | null {
      return viewport;
    },
    setView(id: string): void {
      viewId = id;
    },
    setViewport(next: ArchViewport): void {
      viewport = next;
    },
    offsetsFor(id: string): Readonly<Record<string, ArchNodeOffset>> {
      const source = id === queuedView ? mergeQueued()[id] : committed[id];
      return source ?? {};
    },
    queueOffset(forView: string, nodeId: string, offset: ArchNodeOffset): void {
      // Offsets group per view; the queue holds one view's drags at a time,
      // so switching views must fold the queued view into the committed map
      // first or its corrections would vanish on the next queueing.
      if (queuedView !== null && queuedView !== forView) {
        committed = mergeQueued();
        queued.clear();
      }
      queuedView = forView;
      queued.set(nodeId, offset);
    },
    flush(): void {
      queued.clear();
      queuedView = null;
    },
    serialize(hash: string): ArchWorkspaceState {
      const offsets = mergeQueued();
      return {
        viewId: viewId ?? "",
        viewport: viewport ?? defaultViewport({ x: 0, y: 0, width: 0, height: 0 }, { width: 0, height: 0 }),
        viewHash: hash,
        offsets,
        updatedAt: new Date().toISOString(),
      };
    },
    restore(state: ArchWorkspaceState): void {
      viewId = state.viewId;
      viewport = state.viewport;
      committed = {};
      for (const [id, offsets] of Object.entries(state.offsets)) committed[id] = { ...offsets };
      queued.clear();
      queuedView = null;
    },
  };
  return handle;
}
