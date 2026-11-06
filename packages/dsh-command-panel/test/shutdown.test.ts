import { Context } from "@deepseek-ai/cordis";
import { remoteMethods } from "@deepseek-ai/dsh-typert-protocol";
import { afterEach, describe, expect, it, vi } from "vitest";

import { HostShutdownService } from "../src/host/shutdown-remote.ts";
import {
  currentShellChannel,
  requestShutdown,
  shellOwnsProcess,
  shutdownAvailable,
  type ShellChannel,
} from "../src/host/shutdown.ts";
import { SHUTDOWN_SERVICE } from "../src/shared.ts";

/** A launcher-owned process: no parent IPC channel (`dsh` / `dsh web`). */
const TERMINAL: ShellChannel = { send: undefined, connected: false };

/** A shell-owned process: the Desktop spawns the Host with an IPC channel. */
const SHELL: ShellChannel = { send: () => true, connected: true };

/** Mount the service the way `apply` does, with the channel given explicitly. */
function mount(ctx: Context, channel: ShellChannel = TERMINAL): HostShutdownService {
  return new HostShutdownService(ctx, { channel });
}

describe("shellOwnsProcess", () => {
  it("answers true only for an open IPC channel to a parent", () => {
    expect(shellOwnsProcess(SHELL)).toBe(true);
    expect(shellOwnsProcess({ send: () => true, connected: false })).toBe(false);
    expect(shellOwnsProcess({ connected: true })).toBe(false);
    expect(shellOwnsProcess(TERMINAL)).toBe(false);
  });

  it("reads the live process's own channel facts", () => {
    // Whichever pool runs this suite, the answer mirrors the process verbatim:
    // the host half captures exactly this snapshot at mount.
    expect(currentShellChannel()).toEqual({
      send: typeof process.send === "function" ? process.send : undefined,
      connected: process.connected,
    });
  });
});

describe("shutdownAvailable", () => {
  it("answers true only for a callable appExit", () => {
    expect(shutdownAvailable({ get: () => () => undefined }, TERMINAL)).toBe(true);
    expect(shutdownAvailable({ get: () => "quit" }, TERMINAL)).toBe(false);
    expect(shutdownAvailable({ get: () => undefined }, TERMINAL)).toBe(false);
    expect(shutdownAvailable({}, TERMINAL)).toBe(false);
  });

  it("answers false without throwing when the guarded read throws", () => {
    expect(
      shutdownAvailable(
        {
          get: () => {
            throw new Error("guard");
          },
        },
        TERMINAL,
      ),
    ).toBe(false);
  });

  it("probes softly, exactly the way the request path does", () => {
    const get = vi.fn(() => undefined);
    shutdownAvailable({ get }, TERMINAL);
    expect(get).toHaveBeenCalledWith("appExit", false);
  });

  it("answers false for a shell-owned host even though appExit is in hand", () => {
    // The Desktop combination: the profile boot always provides appExit, but a
    // self-initiated exit is read by the shell as a failure, not as a quit.
    const get = vi.fn(() => () => undefined);
    expect(shutdownAvailable({ get }, SHELL)).toBe(false);
    // The shell answer short-circuits: no point poking the tree at all.
    expect(get).not.toHaveBeenCalled();
  });
});

describe("requestShutdown", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("answers requested before it fires appExit with 0", () => {
    vi.useFakeTimers();
    const appExit = vi.fn();
    const get = vi.fn(() => appExit);

    expect(requestShutdown({ get }, TERMINAL)).toBe("requested");
    expect(get).toHaveBeenCalledTimes(1);
    expect(get).toHaveBeenCalledWith("appExit", false);
    // The answer has to be on the wire first: in-line exit disposes the tree
    // (web server included) and drops the RPC response.
    expect(appExit).not.toHaveBeenCalled();
    vi.advanceTimersByTime(0);
    expect(appExit).toHaveBeenCalledTimes(1);
    expect(appExit).toHaveBeenCalledWith(0);
  });

  it("answers unavailable when the context has no get", () => {
    expect(requestShutdown({}, TERMINAL)).toBe("unavailable");
  });

  it("answers unavailable when get finds no appExit", () => {
    expect(requestShutdown({ get: () => undefined }, TERMINAL)).toBe("unavailable");
  });

  it("answers unavailable when appExit is not a function", () => {
    expect(requestShutdown({ get: () => "quit" }, TERMINAL)).toBe("unavailable");
  });

  it("answers unavailable without throwing when get throws", () => {
    const get = () => {
      throw new Error("boom");
    };
    expect(requestShutdown({ get }, TERMINAL)).toBe("unavailable");
  });

  it("answers unavailable and never fires appExit for a shell-owned host", () => {
    vi.useFakeTimers();
    const appExit = vi.fn();
    const get = vi.fn(() => appExit);

    expect(requestShutdown({ get }, SHELL)).toBe("unavailable");
    vi.advanceTimersByTime(0);
    expect(appExit).not.toHaveBeenCalled();
  });

  it("does not dedupe: the same context fires appExit on every call", () => {
    vi.useFakeTimers();
    const appExit = vi.fn();
    const ctx = { get: () => appExit };

    expect(requestShutdown(ctx, TERMINAL)).toBe("requested");
    expect(requestShutdown(ctx, TERMINAL)).toBe("requested");
    vi.advanceTimersByTime(0);
    expect(appExit).toHaveBeenCalledTimes(2);
  });
});

describe("HostShutdownService", () => {
  it("publishes the capability probe and the request endpoint, waiting on no host service", () => {
    expect(HostShutdownService.inject).toEqual([]);
    const markers = remoteMethods(mount(new Context()));
    expect(markers.map(marker => marker.exportName ?? marker.method).sort()).toEqual(["available", "request"]);
    expect(SHUTDOWN_SERVICE).toBe("hostShutdown");
  });

  it("answers the capability probe without touching appExit", async () => {
    const ctx = new Context();
    const appExit = vi.fn();
    ctx.provide("appExit", appExit);
    const service = mount(ctx);

    await expect(service.available()).resolves.toBe(true);
    expect(appExit).not.toHaveBeenCalled();
  });

  it("answers the capability probe false on a host that cannot quit", async () => {
    await expect(mount(new Context()).available()).resolves.toBe(false);
  });

  it("answers the capability probe false when a parent shell owns the process", async () => {
    const ctx = new Context();
    const appExit = vi.fn();
    ctx.provide("appExit", appExit);

    await expect(mount(ctx, SHELL).available()).resolves.toBe(false);
  });

  /**
   * The Gateway does not call a Remote method on the Service instance: it reads
   * the method off a tracked Context proxy and invokes it with that proxy as
   * `this`. A real `#private` field is unreachable there — every remote call
   * died with "Cannot read from private field" while direct calls passed — so
   * this case pins the receiver shape the live host actually uses.
   */
  it("reads its mount-time facts through a proxy receiver, the way the Gateway invokes it", async () => {
    const ctx = new Context();
    const appExit = vi.fn();
    ctx.provide("appExit", appExit);
    const service = mount(ctx);
    const receiver = new Proxy(service, {
      get: (target, prop, inner) => Reflect.get(target, prop, inner),
    });

    await expect(Reflect.apply(receiver.available, receiver, [])).resolves.toBe(true);
    expect(appExit).not.toHaveBeenCalled();
  });

  it("answers requested, then fires the host context's appExit with 0", async () => {
    vi.useFakeTimers();
    const ctx = new Context();
    const appExit = vi.fn();
    ctx.provide("appExit", appExit);
    const service = mount(ctx);

    await expect(service.request()).resolves.toBe("requested");
    expect(appExit).not.toHaveBeenCalled();
    vi.advanceTimersByTime(0);
    expect(appExit).toHaveBeenCalledTimes(1);
    expect(appExit).toHaveBeenCalledWith(0);
    vi.useRealTimers();
  });

  it("refuses to fire a shell-owned host's appExit through the endpoint", async () => {
    vi.useFakeTimers();
    const ctx = new Context();
    const appExit = vi.fn();
    ctx.provide("appExit", appExit);
    const service = mount(ctx, SHELL);

    await expect(service.request()).resolves.toBe("unavailable");
    vi.advanceTimersByTime(0);
    expect(appExit).not.toHaveBeenCalled();
    vi.useRealTimers();
  });

  it("answers unavailable on a host context without appExit, firing nothing", async () => {
    await expect(mount(new Context()).request()).resolves.toBe("unavailable");
  });

  it("keeps answering across calls: no dedup at the endpoint either", async () => {
    vi.useFakeTimers();
    const ctx = new Context();
    const appExit = vi.fn();
    ctx.provide("appExit", appExit);
    const service = mount(ctx);

    await expect(service.request()).resolves.toBe("requested");
    await expect(service.request()).resolves.toBe("requested");
    vi.advanceTimersByTime(0);
    expect(appExit).toHaveBeenCalledTimes(2);
    vi.useRealTimers();
  });
});
