import { describe, expect, it } from "vitest";

import { createTerminalBinding } from "../src/client/binding.ts";
import { createFakeTerminalView } from "./support/fake-terminal-view.ts";

describe("terminal binding", () => {
  it("mounts, writes, fits and closes in the host's order", () => {
    const view = createFakeTerminalView({ phase: "ready", environment: { maxCols: 120, maxRows: 40 } });
    const binding = createTerminalBinding({ view: () => view, key: "dock-1" });

    binding.attach();
    binding.input("ls\n");
    const grid = binding.fit(200, 100);
    binding.close();

    expect(grid).toEqual({ cols: 120, rows: 40 });
    expect(view.calls).toEqual(["mount", "write:ls\n", "resize:120x40", "close", "detach"]);
  });

  it("mounts once even when the panel re-renders", () => {
    const view = createFakeTerminalView();
    const binding = createTerminalBinding({ view: () => view, key: "k" });
    binding.attach();
    binding.attach();
    expect(view.calls.filter(call => call === "mount")).toHaveLength(1);
  });

  it("mounts again after its detacher ran", () => {
    const view = createFakeTerminalView();
    const binding = createTerminalBinding({ view: () => view, key: "k" });

    binding.attach()();
    binding.attach();

    expect(view.calls).toEqual(["mount", "detach", "mount"]);
  });

  it("clamps to the host grid and refuses sizes without an environment", () => {
    const view = createFakeTerminalView({ phase: "ready", environment: { maxCols: 120, maxRows: 40 } });
    const binding = createTerminalBinding({ view: () => view, key: "k" });
    expect(binding.fit(1, 0)).toEqual({ cols: 2, rows: 1 });

    const waiting = createFakeTerminalView({ phase: "creating" });
    const pending = createTerminalBinding({ view: () => waiting, key: "k" });
    expect(pending.fit(80, 24)).toBeUndefined();
    expect(waiting.calls).toEqual([]);
  });

  it("drops input while the view is read-only", () => {
    const view = createFakeTerminalView({ phase: "connected", writable: false, environment: { maxCols: 120, maxRows: 40 } });
    const binding = createTerminalBinding({ view: () => view, key: "k" });
    binding.input("rm -rf /\n");
    expect(view.calls).toEqual([]);
  });

  it("acknowledges a snapshot only after the emulator has parsed it", () => {
    const view = createFakeTerminalView();
    const binding = createTerminalBinding({ view: () => view, key: "k" });
    const painted: string[] = [];
    const resets: string[] = [];
    const dones: Array<() => void> = [];
    const off = binding.attachEmulator({
      write(data, done) {
        painted.push(data);
        dones.push(done);
      },
      reset(cols, rows) {
        resets.push(`${cols}x${rows}`);
      },
    });

    view.emitRender(1, { type: "snapshot", info: { cols: 80, rows: 24 }, screen: "hello" });
    expect(resets).toEqual(["80x24"]);
    expect(painted).toEqual(["hello"]);
    // The host must not learn the frame is done while xterm is still parsing it.
    expect(view.calls).toEqual([]);
    dones.at(-1)?.();
    expect(view.calls).toEqual(["ack:1"]);

    view.emitRender(2, { type: "output", data: "world" });
    expect(painted).toEqual(["hello", "world"]);
    expect(view.calls).toEqual(["ack:1"]);
    dones.at(-1)?.();
    expect(view.calls).toEqual(["ack:1", "ack:2"]);

    // Replaying an old revision would duplicate output on screen.
    view.emitRender(2, { type: "output", data: "world" });
    expect(painted).toHaveLength(2);
    off();
  });
});
