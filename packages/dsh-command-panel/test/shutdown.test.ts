import { Context } from "@deepseek-ai/cordis";
import { remoteMethods } from "@deepseek-ai/dsh-typert-protocol";
import { describe, expect, it, vi } from "vitest";

import { HostShutdownService } from "../src/host/shutdown-remote.ts";
import { requestShutdown } from "../src/host/shutdown.ts";
import { SHUTDOWN_SERVICE } from "../src/shared.ts";

describe("requestShutdown", () => {
  it("calls appExit once with 0 and answers requested", () => {
    const appExit = vi.fn();
    const get = vi.fn(() => appExit);

    expect(requestShutdown({ get })).toBe("requested");
    expect(get).toHaveBeenCalledTimes(1);
    expect(get).toHaveBeenCalledWith("appExit", false);
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
    const appExit = vi.fn();
    const ctx = { get: () => appExit };

    expect(requestShutdown(ctx)).toBe("requested");
    expect(requestShutdown(ctx)).toBe("requested");
    expect(appExit).toHaveBeenCalledTimes(2);
  });
});

describe("HostShutdownService", () => {
  it("publishes one request endpoint and waits on no host service", () => {
    expect(HostShutdownService.inject).toEqual([]);
    const markers = remoteMethods(new HostShutdownService(new Context()));
    expect(markers.map(marker => marker.exportName ?? marker.method)).toEqual(["request"]);
    expect(SHUTDOWN_SERVICE).toBe("hostShutdown");
  });

  it("answers requested by firing the host context's appExit with 0", async () => {
    const ctx = new Context();
    const appExit = vi.fn();
    ctx.provide("appExit", appExit);
    const service = new HostShutdownService(ctx);

    await expect(service.request()).resolves.toBe("requested");
    expect(appExit).toHaveBeenCalledTimes(1);
    expect(appExit).toHaveBeenCalledWith(0);
  });

  it("answers unavailable on a host context without appExit, firing nothing", async () => {
    const service = new HostShutdownService(new Context());

    await expect(service.request()).resolves.toBe("unavailable");
  });

  it("keeps answering across calls: no dedup at the endpoint either", async () => {
    const ctx = new Context();
    const appExit = vi.fn();
    ctx.provide("appExit", appExit);
    const service = new HostShutdownService(ctx);

    await expect(service.request()).resolves.toBe("requested");
    await expect(service.request()).resolves.toBe("requested");
    expect(appExit).toHaveBeenCalledTimes(2);
  });
});
