import { describe, expect, it } from "vitest";

import type { WebTerminalsFace } from "../src/client/host.ts";
import { createTerminalRack } from "../src/client/rack.ts";
import { createFakeTerminalView } from "./support/fake-terminal-view.ts";

function createHost() {
  const views: Array<{ args: unknown[]; view: ReturnType<typeof createFakeTerminalView> }> = [];
  const terminals: WebTerminalsFace = {
    view(...args: unknown[]) {
      const view = createFakeTerminalView();
      views.push({ args, view });
      return view;
    },
  };
  return { host: { terminals: () => terminals }, views };
}

describe("terminal rack", () => {
  it("opens one host view per panel under the package content namespace", () => {
    const { host, views } = createHost();
    const rack = createTerminalRack({ host });

    rack.open("s1", "terminal-1");
    rack.open("s1", "terminal-1");

    expect(views).toHaveLength(1);
    expect(views[0]?.args).toEqual(["s1", "terminal-1", "dsh-term-dock:terminal-1"]);
    expect(rack.size()).toBe(1);
  });

  it("keeps the same panel id independent between sessions", () => {
    const { host, views } = createHost();
    const rack = createTerminalRack({ host });

    rack.open("s1", "terminal-1");
    rack.open("s2", "terminal-1");

    expect(views).toHaveLength(2);
    expect(views[1]?.args).toEqual(["s2", "terminal-1", "dsh-term-dock:terminal-1"]);
  });

  it("terminates the process when a panel is released", () => {
    const { host, views } = createHost();
    const rack = createTerminalRack({ host });
    rack.open("s1", "terminal-1");

    rack.release("s1", "terminal-1");

    expect(views[0]?.view.calls).toEqual(["close"]);
    expect(rack.size()).toBe(0);
  });

  it("closes every view it owns on unload", () => {
    const { host, views } = createHost();
    const rack = createTerminalRack({ host });
    rack.open("s1", "terminal-1");
    rack.open("s1", "terminal-2");

    rack.closeAll();

    expect(views.map(entry => entry.view.calls)).toEqual([["close"], ["close"]]);
    expect(rack.size()).toBe(0);
  });

  it("answers undefined when the host has no terminal service", () => {
    const rack = createTerminalRack({ host: { terminals: () => undefined } });
    expect(rack.open("s1", "terminal-1")).toBeUndefined();
  });

  it("answers undefined instead of throwing when the host refuses a view", () => {
    const rack = createTerminalRack({
      host: {
        terminals: () => ({
          view() {
            throw new Error("terminal/limit-reached");
          },
        }),
      },
    });
    expect(rack.open("s1", "terminal-1")).toBeUndefined();
  });
});
