import { describe, expect, it, vi } from "vitest";

import { requestShutdown } from "../src/host/shutdown.ts";

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
