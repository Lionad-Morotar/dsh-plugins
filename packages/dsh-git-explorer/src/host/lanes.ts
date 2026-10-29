/**
 * Lane layout for the commit graph.
 *
 * The input is newest-first and topologically ordered, which is what
 * `git log --topo-order` guarantees. One pass is enough: every commit either
 * lands on a lane already waiting for it (the normal linear case) or opens the
 * lowest free lane (a branch tip). Parents reserve lanes for later rows.
 *
 * Parents outside the page do not reserve a lane. A filtered history page has
 * most of its parents missing; keeping a lane for each one would grow the graph
 * to one lane per row and make every edge a vertical line to nowhere. The edge
 * is still reported, so the renderer can draw a dangling stub.
 */

/** The minimal commit shape the layout needs. */
export interface LaneInput {
  readonly hash: string;
  readonly parents: readonly string[];
}

export interface LaneEdge {
  readonly from: string;
  readonly to: string;
}

export interface LaneRow {
  readonly hash: string;
  /** Zero-based index in the input order. */
  readonly row: number;
  readonly lane: number;
  /** One edge per parent; `from` is the child and `to` the parent. */
  readonly edges: readonly LaneEdge[];
}

/** Binary min-heap of reusable lane indices; keeps the leftmost lane preferred. */
class LaneHeap {
  private readonly items: number[] = [];

  push(value: number): void {
    const items = this.items;
    items.push(value);
    let index = items.length - 1;
    while (index > 0) {
      const parent = (index - 1) >> 1;
      const parentValue = items[parent];
      if (parentValue === undefined || parentValue <= value) break;
      items[index] = parentValue;
      index = parent;
    }
    items[index] = value;
  }

  pop(): number | undefined {
    const items = this.items;
    const top = items[0];
    const last = items.pop();
    if (items.length === 0 || last === undefined) return top;
    let index = 0;
    for (;;) {
      const left = index * 2 + 1;
      const right = left + 1;
      let smallest = index;
      let smallestValue = last;
      const leftValue = items[left];
      if (leftValue !== undefined && leftValue < smallestValue) {
        smallest = left;
        smallestValue = leftValue;
      }
      const rightValue = items[right];
      if (rightValue !== undefined && rightValue < smallestValue) {
        smallest = right;
        smallestValue = rightValue;
      }
      if (smallest === index) break;
      items[index] = smallestValue;
      index = smallest;
    }
    items[index] = last;
    return top;
  }
}

/**
 * Assign a lane to each commit and emit one edge per parent.
 *
 * Invariants:
 * - a linear run keeps one lane;
 * - two children of the same merge occupy different lanes;
 * - a row never carries two lanes (one row, one commit);
 * - the edge set is exactly `{from: hash, to: parent}` for every parent.
 */
export function assignLanes(commits: readonly LaneInput[]): LaneRow[] {
  const present = new Set<string>();
  for (const commit of commits) present.add(commit.hash);

  /** Lane index to the hash that lane is currently waiting for. */
  const occupants: Array<string | null> = [];
  /** Hash to the lanes waiting for it; a merge target can be awaited twice. */
  const waiting = new Map<string, number[]>();
  const free = new LaneHeap();

  const removeWaiter = (hash: string, lane: number): void => {
    const lanes = waiting.get(hash);
    if (lanes === undefined) return;
    const at = lanes.indexOf(lane);
    if (at >= 0) lanes.splice(at, 1);
    if (lanes.length === 0) waiting.delete(hash);
  };

  const occupy = (lane: number, hash: string): void => {
    occupants[lane] = hash;
    const lanes = waiting.get(hash);
    if (lanes === undefined) waiting.set(hash, [lane]);
    else lanes.push(lane);
  };

  /** Give a lane back. The caller guarantees one release per held lane per row. */
  const release = (lane: number): void => {
    const hash = occupants[lane] ?? null;
    if (hash !== null) {
      occupants[lane] = null;
      removeWaiter(hash, lane);
    }
    free.push(lane);
  };

  const acquire = (): number => {
    const reused = free.pop();
    if (reused !== undefined) return reused;
    occupants.push(null);
    return occupants.length - 1;
  };

  const rows: LaneRow[] = [];
  for (let row = 0; row < commits.length; row += 1) {
    const commit = commits[row];
    if (commit === undefined) continue;
    const incoming = waiting.get(commit.hash);
    let lane: number;
    let held: number | null;
    if (incoming !== undefined && incoming.length > 0) {
      lane = incoming[0] ?? 0;
      for (let index = 1; index < incoming.length; index += 1) {
        const candidate = incoming[index];
        if (candidate !== undefined && candidate < lane) lane = candidate;
      }
      for (let index = incoming.length - 1; index >= 0; index -= 1) {
        const candidate = incoming[index];
        if (candidate !== undefined && candidate !== lane) release(candidate);
      }
      // The chosen lane belongs to this commit now; detach it without freeing so
      // the first parent can inherit the same visual line.
      occupants[lane] = null;
      removeWaiter(commit.hash, lane);
      held = lane;
    } else {
      lane = acquire();
      held = lane;
    }

    const edges: LaneEdge[] = [];
    let releaseHeld = false;
    for (let index = 0; index < commit.parents.length; index += 1) {
      const parent = commit.parents[index];
      if (parent === undefined) continue;
      edges.push({ from: commit.hash, to: parent });
      if (!present.has(parent)) continue;
      const parentWaiters = waiting.get(parent);
      const parentHasLane = parentWaiters !== undefined && parentWaiters.length > 0;
      if (held !== null && index === 0) {
        // Defer the release so an extra parent cannot immediately reuse the
        // lane the merge commit itself is drawn on.
        if (parentHasLane) releaseHeld = true;
        else occupy(held, parent);
        held = null;
        continue;
      }
      if (!parentHasLane) occupy(acquire(), parent);
    }
    if (held !== null) release(held);
    else if (releaseHeld) release(lane);
    rows.push({ hash: commit.hash, row, lane, edges });
  }
  return rows;
}
