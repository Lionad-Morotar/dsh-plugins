/**
 * The watch baseline window: a LikeC4 watch instance swallows the first file
 * change issued right after boot (research: nothing happens for 2.5s; after
 * ~1.2s the same change is visible in 69ms), so a cache-hit render inside
 * the window must be withheld until the window passes — otherwise a save
 * during panel open would serve a stale view as "ready".
 *
 * The renderer's boot factory is injected, so the window logic runs against
 * a fake instance whose diagrams() answers with the stale view while the
 * watcher is still in its baseline pass — exactly the trap being guarded.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { fromWorkspace } from "@likec4/language-services/node";

import { WATCH_BASELINE_WINDOW_MS, createRenderer, renderWorkspace, type LikeC4Instance } from "../src/host/render.ts";

vi.mock("@likec4/language-services/node", () => ({
  fromWorkspace: vi.fn(),
}));

let seq = 0;
const dir = (): string => {
  seq += 1;
  return `/w/fake-${String(seq)}`;
};

const staleView = { id: "index", nodes: [{ id: "user" }, { id: "sys" }] };
const freshView = { id: "index", nodes: [{ id: "user" }, { id: "sys" }, { id: "new" }] };

interface FakeInstance extends LikeC4Instance {}

/**
 * An instance whose diagrams() replays the baseline trap: while the wall
 * clock is inside [bootAt, bootAt + window) it still reports the stale view
 * (the change was swallowed); afterwards it reports the fresh one.
 */
function baselineTrapInstance(bootAt: number, clock: () => number): FakeInstance {
  return {
    projects: () => ["p"],
    // eslint-disable-next-line require-await -- LikeC4 shapes are async
    diagrams: async () => (clock() - bootAt < WATCH_BASELINE_WINDOW_MS ? [staleView] : [freshView]),
    hasErrors: () => false,
    getErrors: () => [],
    dispose: async () => {},
  } as unknown as FakeInstance;
}

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe("watch baseline window", () => {
  it("withholds a cache-hit render inside the window so the swallowed change is not served as ready", async () => {
    const bootAt = Date.now();
    const instance = baselineTrapInstance(bootAt, () => Date.now());
    const workspace = dir();
    const renderer = createRenderer(3, async target => ({
      projectId: "p",
      views: [staleView],
      hasErrors: false,
      errors: [],
      instance,
      ...(target === "" ? {} : {}),
    }));

    const first = await renderer.get(workspace);
    expect(first.views).toEqual([staleView]);

    const secondPromise = renderer.get(workspace);
    // Without the window the trap would answer the stale view immediately.
    await vi.advanceTimersByTimeAsync(WATCH_BASELINE_WINDOW_MS + 10);
    const second = await secondPromise;
    expect(second.views).toEqual([freshView]);
    await renderer.dispose();
  });

  it("does not wait once the window has passed", async () => {
    const bootAt = Date.now();
    const instance = baselineTrapInstance(bootAt, () => Date.now());
    const workspace = dir();
    const renderer = createRenderer(3, async () => ({
      projectId: "p",
      views: [staleView],
      hasErrors: false,
      errors: [],
      instance,
    }));

    await renderer.get(workspace);
    await vi.advanceTimersByTimeAsync(WATCH_BASELINE_WINDOW_MS + 50);

    const before = Date.now();
    const second = await renderer.get(workspace);
    // No timer advance between the two clock reads: the render was immediate.
    expect(Date.now() - before).toBe(0);
    expect(second.views).toEqual([freshView]);
    await renderer.dispose();
  });

  it("boots the workspace with watch enabled so later changes reach the instance", async () => {
    const mocked = vi.mocked(fromWorkspace);
    mocked.mockResolvedValue(
      baselineTrapInstance(Date.now(), () => Date.now()) as Awaited<ReturnType<typeof fromWorkspace>>,
    );
    await renderWorkspace("/w/anywhere");
    expect(mocked).toHaveBeenCalledWith("/w/anywhere", expect.objectContaining({ watch: true }));
  });
});
