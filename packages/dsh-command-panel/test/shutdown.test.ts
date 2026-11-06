import { Context } from "@deepseek-ai/cordis";
import { remoteMethods } from "@deepseek-ai/dsh-typert-protocol";
import { afterEach, describe, expect, it, vi } from "vitest";

import { HostShutdownService } from "../src/host/shutdown-remote.ts";
import { requestShutdown, shutdownAvailable } from "../src/host/shutdown.ts";
import { SHUTDOWN_SERVICE } from "../src/shared.ts";

describe("shutdownAvailable", () => {
  it("answers true only for a callable appExit", () => {
    expect(shutdownAvailable({ get: () => () => undefined })).toBe(true);
    expect(shutdownAvailable({ get: () => "quit" })).toBe(false);
    expect(shutdownAvailable({ get: () => undefined })).toBe(false);
    expect(shutdownAvailable({})).toBe(false);
  });

  it("answers false without throwing when the guarded read throws", () => {
    expect(
      shutdownAvailable({
        get: () => {
          throw new Error("guard");
        },
      }),
    ).toBe(false);
  });

  it("probes softly, exactly the way the request path does", () => {
    const get = vi.fn(() => undefined);
    shutdownAvailable({ get });
    expect(get).toHaveBeenCalledWith("appExit", false);
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

    expect(requestShutdown({ get })).toBe("requested");
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
    expect(requestShutdown({})).toBe("unavailable");
  });

  it("answers unavailable when get finds no appExit", () => {
    expect(requestShutdown({ get: () => undefined })).toBe("unavailable");
  });

  it("answers unavailable when appExit is not a function", () => {
    expect(requestShutdown({ get: () => "quit" })).toBe("unavailable");
  });

  it("answers unavailable without throwing when get throws", () => {
    const get = () => {
      throw new Error("boom");
    };
    expect(requestShutdown({ get })).toBe("unavailable");
  });

  it("does not dedupe: the same context fires appExit on every call", () => {
    vi.useFakeTimers();
    const appExit = vi.fn();
    const ctx = { get: () => appExit };

    expect(requestShutdown(ctx)).toBe("requested");
    expect(requestShutdown(ctx)).toBe("requested");
    vi.advanceTimersByTime(0);
    expect(appExit).toHaveBeenCalledTimes(2);
  });
});

describe("HostShutdownService", () => {
  it("publishes the capability probe and the request endpoint, waiting on no host service", () => {
    expect(HostShutdownService.inject).toEqual([]);
    const markers = remoteMethods(new HostShutdownService(new Context()));
    expect(markers.map(marker => marker.exportName ?? marker.method).sort()).toEqual(["available", "request"]);
    expect(SHUTDOWN_SERVICE).toBe("hostShutdown");
  });

  it("answers the capability probe without touching appExit", async () => {
    const ctx = new Context();
    const appExit = vi.fn();
    ctx.provide("appExit", appExit);
    const service = new HostShutdownService(ctx);

    await expect(service.available()).resolves.toBe(true);
    expect(appExit).not.toHaveBeenCalled();
  });

  it("answers the capability probe false on a host that cannot quit", async () => {
    const service = new HostShutdownService(new Context());

    await expect(service.available()).resolves.toBe(false);
  });

  /**
   * The Gateway does not call a Remote method on the Service instance: it reads
   * the method off a tracked Context proxy and invokes it with that proxy as
   * `this`. A real `#private` field is unreachable there — every remote call
   * died with "Cannot read from private field" while direct calls passed — so
   * this case pins the receiver shape the live host actually uses.
   */
  it("reads its context through a proxy receiver, the way the Gateway invokes it", async () => {
    const ctx = new Context();
    const appExit = vi.fn();
    ctx.provide("appExit", appExit);
    const service = new HostShutdownService(ctx);
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
    const service = new HostShutdownService(ctx);

    await expect(service.request()).resolves.toBe("requested");
    expect(appExit).not.toHaveBeenCalled();
    vi.advanceTimersByTime(0);
    expect(appExit).toHaveBeenCalledTimes(1);
    expect(appExit).toHaveBeenCalledWith(0);
    vi.useRealTimers();
  });

  it("answers unavailable on a host context without appExit, firing nothing", async () => {
    const service = new HostShutdownService(new Context());

    await expect(service.request()).resolves.toBe("unavailable");
  });

  it("keeps answering across calls: no dedup at the endpoint either", async () => {
    vi.useFakeTimers();
    const ctx = new Context();
    const appExit = vi.fn();
    ctx.provide("appExit", appExit);
    const service = new HostShutdownService(ctx);

    await expect(service.request()).resolves.toBe("requested");
    await expect(service.request()).resolves.toBe("requested");
    vi.advanceTimersByTime(0);
    expect(appExit).toHaveBeenCalledTimes(2);
    vi.useRealTimers();
  });
});
