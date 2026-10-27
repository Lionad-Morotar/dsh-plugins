import { describe, expect, it, vi } from "vitest";

import { registerBetterSidebarViewers } from "../src/client/better-sidebar.ts";
import { reactStub } from "./support/react-stub.ts";

/** What the adapter records about a viewer registration. */
interface Registered {
  readonly id: string;
  readonly exts: readonly string[];
  readonly fetchStrategy: string;
  readonly priority: number;
}

/**
 * Build a context whose `inject` resolves the given service.
 * @param service - the better-sidebar service, or undefined for a host without it.
 * @returns the context and the registration log.
 */
function contextWith(service: unknown): { ctx: never; registered: Registered[] } {
  const registered: Registered[] = [];
  const ctx = {
    inject: (_deps: readonly string[], callback: (scope: { get: () => unknown }) => void) =>
      callback({ get: () => service }),
  };
  if (service !== undefined) {
    (service as { registerFileViewer: (descriptor: Registered) => () => void }).registerFileViewer = (descriptor) => {
      registered.push(descriptor);
      return () => {};
    };
  }
  return { ctx: ctx as never, registered };
}

const deps = {
  React: reactStub(),
  t: (key: string) => "translated:" + key,
  readFile: vi.fn(async () => new Uint8Array([1, 2, 3])),
  family: "scene3d" as const,
  loadChunk: vi.fn(async () => ({ Body: () => null, Viewer: () => null })),
};

describe("better-sidebar adapter", () => {
  it("registers one custom-fetch viewer for the family", () => {
    const { ctx, registered } = contextWith({});
    registerBetterSidebarViewers(ctx, deps);

    expect(registered).toHaveLength(1);
    expect(registered[0]?.id).toBe("dsh-preview-more:scene3d");
    expect(registered[0]?.exts).toEqual(["glb", "gltf", "obj", "stl", "3mf"]);
    expect(registered[0]?.fetchStrategy).toBe("custom");
    expect(registered[0]?.priority).toBeGreaterThan(0);
  });

  it("registers nothing on a host without the service", () => {
    const { ctx, registered } = contextWith(undefined);
    expect(() => registerBetterSidebarViewers(ctx, deps)).not.toThrow();
    expect(registered).toHaveLength(0);
  });

  it("loads the bytes through the shared reader, not through fetch", async () => {
    const { ctx, registered } = contextWith({});
    registerBetterSidebarViewers(ctx, deps);
    const load = (registered[0] as unknown as { load: (path: string, scope: { sessionId: string }, signal: AbortSignal) => Promise<unknown> }).load;
    const value = await load("/tmp/a.glb", { sessionId: "s1" }, new AbortController().signal);

    expect(deps.readFile).toHaveBeenCalledWith("s1", "/tmp/a.glb", expect.anything());
    expect(value).toEqual({ bytes: new Uint8Array([1, 2, 3]), path: "/tmp/a.glb" });
  });
});
