/**
 * The bounded wait for `webServer`.
 *
 * The route this guards is the whole data plane of the skill panel: without it
 * the panel can only show a name and a path. And the service it needs is
 * provided by the desktop web app *after* this plugin's row activates, so a
 * one-shot `ctx.get` during `apply` reads undefined and the route would never be
 * registered at all. `dsh-arch` hit exactly this and settled on polling its own
 * scope; these cases pin the same shape, plus the two properties that keep a
 * poll from becoming a leak: it stops when the server appears, and it stops on
 * its own when the host never grows one (headless).
 *
 * Timers are faked rather than injected so the tests exercise the same
 * `setInterval`/`Date.now` the host will.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  WEB_SERVER_POLL_MS,
  WEB_SERVER_WAIT_MS,
  whenWebServer,
  type WebServerProbeRead,
} from "../src/index.ts";

/** A stand-in for the host's web server; only its identity matters here. */
const SERVER = { register: () => () => {} };

/** A reader that answers from a script, one entry per call. */
function scripted(values: readonly (WebServerProbeRead | Error)[]): {
  read: () => WebServerProbeRead | undefined;
  calls: () => number;
} {
  let index = 0;
  return {
    read: () => {
      const value = values[Math.min(index, values.length - 1)];
      index += 1;
      if (value instanceof Error) throw value;
      return value;
    },
    calls: () => index,
  };
}

describe("whenWebServer", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("mounts immediately and never schedules a poll when the server is already there", () => {
    const reader = scripted([SERVER]);
    const mounted: unknown[] = [];

    whenWebServer(reader.read, server => mounted.push(server));

    expect(mounted).toEqual([SERVER]);
    expect(reader.calls()).toBe(1);
    // Nothing was scheduled, so time passing cannot produce a second read.
    vi.advanceTimersByTime(WEB_SERVER_POLL_MS * 10);
    expect(reader.calls()).toBe(1);
  });

  it("keeps polling until the server appears, then stops", () => {
    const reader = scripted([undefined, undefined, SERVER]);
    const mounted: unknown[] = [];

    whenWebServer(reader.read, server => mounted.push(server));

    // First read happened synchronously and missed.
    expect(mounted).toEqual([]);
    expect(reader.calls()).toBe(1);

    vi.advanceTimersByTime(WEB_SERVER_POLL_MS);
    expect(mounted).toEqual([]);
    expect(reader.calls()).toBe(2);

    vi.advanceTimersByTime(WEB_SERVER_POLL_MS);
    expect(mounted).toEqual([SERVER]);
    expect(reader.calls()).toBe(3);

    // The interval is gone: no further reads, and no second mount.
    vi.advanceTimersByTime(WEB_SERVER_POLL_MS * 20);
    expect(reader.calls()).toBe(3);
    expect(mounted).toEqual([SERVER]);
  });

  it("gives up after the wait limit and stops reading", () => {
    const reader = scripted([undefined]);
    const mounted: unknown[] = [];

    whenWebServer(reader.read, server => mounted.push(server));

    // Past the limit: the poll has cleared itself.
    vi.advanceTimersByTime(WEB_SERVER_WAIT_MS + WEB_SERVER_POLL_MS);
    const callsAtLimit = reader.calls();
    expect(callsAtLimit).toBeGreaterThan(1);
    expect(mounted).toEqual([]);

    // A headless host never grows a server; the poll must not keep ticking.
    vi.advanceTimersByTime(WEB_SERVER_WAIT_MS * 4);
    expect(reader.calls()).toBe(callsAtLimit);
  });

  it("survives a throwing read and keeps looking", () => {
    const reader = scripted([new Error("scope not ready"), undefined, SERVER]);
    const mounted: unknown[] = [];

    expect(() => whenWebServer(reader.read, server => mounted.push(server))).not.toThrow();
    expect(mounted).toEqual([]);

    vi.advanceTimersByTime(WEB_SERVER_POLL_MS * 2);
    expect(mounted).toEqual([SERVER]);
  });

  it("stops polling when the returned disposer runs", () => {
    const reader = scripted([undefined]);
    const mounted: unknown[] = [];

    const dispose = whenWebServer(reader.read, server => mounted.push(server));
    const callsBeforeDispose = reader.calls();

    dispose();
    vi.advanceTimersByTime(WEB_SERVER_POLL_MS * 20);

    expect(reader.calls()).toBe(callsBeforeDispose);
    expect(mounted).toEqual([]);
  });

  it("does not mount twice when the disposer runs after a successful mount", () => {
    const reader = scripted([undefined, SERVER]);
    const mounted: unknown[] = [];

    const dispose = whenWebServer(reader.read, server => mounted.push(server));
    vi.advanceTimersByTime(WEB_SERVER_POLL_MS);
    expect(mounted).toEqual([SERVER]);

    dispose();
    vi.advanceTimersByTime(WEB_SERVER_POLL_MS * 20);
    expect(mounted).toEqual([SERVER]);
  });
});
