/**
 * The page-close fallback is the one place the workbench patches a host
 * service, so the contract is pinned at both ends: a claim must win over the
 * host window close, and releasing must leave the service exactly as it was.
 */
import { describe, expect, it, vi } from "vitest";

import {
  acquirePageCloseFallback,
  isPageCloseFallbackInstalled,
  unwrapHostService,
  type CloseWindowHost,
} from "../src/client/page-close.ts";

/** A host shortcut service whose close counts the calls that reached it. */
function createHost(): CloseWindowHost & { closes: number } {
  return {
    closes: 0,
    closeWindow() {
      this.closes += 1;
      return Promise.resolve();
    },
  };
}

describe("the page-close fallback", () => {
  it("lets a claim take the gesture without reaching the host", async () => {
    const host = createHost();
    const fallback = acquirePageCloseFallback(host, () => {});
    const off = fallback.register(() => true);

    await host.closeWindow?.();

    expect(host.closes).toBe(0);
    off();
    fallback.release();
  });

  it("closes the window when every claim passes", async () => {
    const host = createHost();
    const fallback = acquirePageCloseFallback(host, () => {});
    const off = fallback.register(() => false);

    await host.closeWindow?.();

    expect(host.closes).toBe(1);
    off();
    fallback.release();
  });

  it("asks claims in registration order and stops at the first claim", async () => {
    const host = createHost();
    const fallback = acquirePageCloseFallback(host, () => {});
    const first = vi.fn(() => false);
    const second = vi.fn(() => true);
    const third = vi.fn(() => true);
    fallback.register(first);
    fallback.register(second);
    fallback.register(third);

    await host.closeWindow?.();

    expect(first).toHaveBeenCalledTimes(1);
    expect(second).toHaveBeenCalledTimes(1);
    expect(third).not.toHaveBeenCalled();
    expect(host.closes).toBe(0);
    fallback.release();
  });

  it("reports a throwing claim and still lets the next one answer", async () => {
    const host = createHost();
    const warn = vi.fn();
    const fallback = acquirePageCloseFallback(host, warn);
    fallback.register(() => {
      throw new Error("boom");
    });
    fallback.register(() => true);

    await host.closeWindow?.();

    expect(warn).toHaveBeenCalledWith("page close claim failed: boom");
    expect(host.closes).toBe(0);
    fallback.release();
  });

  it("falls through to the host when a throwing claim was the only one", async () => {
    const host = createHost();
    const fallback = acquirePageCloseFallback(host, () => {});
    fallback.register(() => {
      throw new Error("boom");
    });

    await host.closeWindow?.();

    expect(host.closes).toBe(1);
    fallback.release();
  });

  it("drops one claim without touching the others", async () => {
    const host = createHost();
    const fallback = acquirePageCloseFallback(host, () => {});
    const off = fallback.register(() => true);
    const keep = fallback.register(() => true);

    off();
    await host.closeWindow?.();
    expect(host.closes).toBe(0);

    keep();
    await host.closeWindow?.();
    expect(host.closes).toBe(1);
    fallback.release();
  });

  it("restores an own host method on release and stops installing claims afterwards", async () => {
    const host = createHost();
    const original = host.closeWindow;
    const fallback = acquirePageCloseFallback(host, () => {});
    const off = fallback.register(() => true);

    expect(isPageCloseFallbackInstalled(host)).toBe(true);
    fallback.release();
    expect(isPageCloseFallbackInstalled(host)).toBe(false);
    expect(Object.hasOwn(host, "closeWindow")).toBe(true);
    expect(host.closeWindow).toBe(original);

    off();
    fallback.register(() => true)();
    await host.closeWindow?.();
    expect(host.closes).toBe(1);
  });

  it("deletes the wrapper from a host whose method lives on the prototype", async () => {
    class ClassHost {
      closes = 0;
      closeWindow(): Promise<void> {
        this.closes += 1;
        return Promise.resolve();
      }
    }
    const host = new ClassHost();
    const fallback = acquirePageCloseFallback(host, () => {});
    fallback.register(() => true);

    expect(Object.hasOwn(host, "closeWindow")).toBe(true);
    await host.closeWindow();
    expect(host.closes).toBe(0);
    fallback.release();
    expect(Object.hasOwn(host, "closeWindow")).toBe(false);
    await host.closeWindow();
    expect(host.closes).toBe(1);
  });

  it("shares one wrapper across two acquisitions and restores after the last release", async () => {
    const host = createHost();
    const first = acquirePageCloseFallback(host, () => {});
    const second = acquirePageCloseFallback(host, () => {});
    const wrapper = host.closeWindow;
    first.register(() => true);

    expect(second).not.toBe(first);
    first.release();
    expect(isPageCloseFallbackInstalled(host)).toBe(true);
    await host.closeWindow?.();
    expect(host.closes).toBe(0);

    second.release();
    expect(isPageCloseFallbackInstalled(host)).toBe(false);
    expect(host.closeWindow).not.toBe(wrapper);
    await host.closeWindow?.();
    expect(host.closes).toBe(1);
  });

  it("patches the raw service behind a Cordis traceable proxy", async () => {
    const raw = createHost();
    const proxy: CloseWindowHost = new Proxy(raw, {
      get(target, property, receiver) {
        if (property === Symbol.for("cordis.original")) return target;
        return Reflect.get(target, property, receiver) as unknown;
      },
    });
    expect(unwrapHostService(proxy)).toBe(raw);

    const original = raw.closeWindow;
    const fallback = acquirePageCloseFallback(proxy, () => {});
    fallback.register(() => true);

    expect(raw.closeWindow).not.toBe(original);
    await proxy.closeWindow?.();
    expect(raw.closes).toBe(0);
    fallback.release();
    expect(raw.closeWindow).toBe(original);
  });

  it("stays inert on a host without the close fallback", async () => {
    const host: CloseWindowHost = {};
    const fallback = acquirePageCloseFallback(host, () => {});
    const off = fallback.register(() => true);

    expect(Object.hasOwn(host, "closeWindow")).toBe(false);
    off();
    fallback.release();
    expect(isPageCloseFallbackInstalled(host)).toBe(false);
  });
});
