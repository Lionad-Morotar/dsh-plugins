import { describe, expect, it, vi } from "vitest";

import {
  COMPOSER_SELECTOR,
  FOCUS_RETRY_DELAYS,
  composerMounted,
  createComposerFocus,
  focusComposerFor,
  type ComposerFocusOptions,
  type FocusScheduler,
} from "../src/client/focus.ts";

/** A document that answers for a selector with a mounted node or nothing. */
function fakeDocument(present: boolean) {
  const queries: string[] = [];
  return {
    queries,
    querySelector(selector: string) {
      queries.push(selector);
      return present ? { selector } : null;
    },
  };
}

/** A scheduler that records the pending timer instead of running it. */
function fakeScheduler() {
  const timers: Array<{ handle: number; delay: number; run: () => void }> = [];
  let next = 1;
  const scheduler: FocusScheduler = {
    setTimeout(handler, delay) {
      const handle = next;
      next += 1;
      timers.push({ handle, delay, run: handler });
      return handle;
    },
    clearTimeout(handle) {
      const index = timers.findIndex(timer => timer.handle === handle);
      if (index >= 0) timers.splice(index, 1);
    },
  };
  /** Run the timer the driver scheduled most recently, as a browser would. */
  const fire = (): void => {
    const timer = timers.shift();
    if (timer === undefined) throw new Error("no timer was pending");
    timer.run();
  };
  return { timers, scheduler, fire };
}

/** A context whose one session delivers the focus into a recorded spy. */
function focusContext(spy: { focus: () => void }) {
  return {
    sessions: {
      scope: () => ({
        get: (name: string) => (name === "conversation" ? { input: { for: () => spy } } : undefined),
      }),
    },
  };
}

describe("composerMounted", () => {
  it("answers false outside a browser", () => {
    expect(composerMounted(undefined)).toBe(false);
  });

  it("reads the composer through the marker or the structural pair", () => {
    const doc = fakeDocument(true);
    expect(composerMounted(doc)).toBe(true);
    expect(doc.queries).toEqual([COMPOSER_SELECTOR]);
    expect(COMPOSER_SELECTOR).toContain("data-composer-input");
    expect(COMPOSER_SELECTOR).toContain("aria-multiline");
  });

  it("answers false while the view is unmounted", () => {
    expect(composerMounted(fakeDocument(false))).toBe(false);
  });
});

describe("focusComposerFor", () => {
  it("delivers the focus through the conversation input face", () => {
    const input = { focus: vi.fn() };
    expect(focusComposerFor(focusContext(input), "s1")).toBe(true);
    expect(input.focus).toHaveBeenCalledTimes(1);
  });

  it("answers false when the session scope or the service is gone", () => {
    const noScope = { sessions: { scope: () => undefined } };
    const noService = { sessions: { scope: () => ({ get: () => undefined }) } };
    expect(focusComposerFor(noScope, "s1")).toBe(false);
    expect(focusComposerFor(noService, "s1")).toBe(false);
    expect(focusComposerFor({}, "s1")).toBe(false);
  });

  it("answers false instead of throwing when the host refuses the scope", () => {
    const refusing = {
      sessions: {
        scope: () => ({
          get: () => ({
            input: {
              for: () => {
                throw new Error("conversation.input.for requires a retained Session scope");
              },
            },
          }),
        }),
      },
    };
    expect(focusComposerFor(refusing, "s1")).toBe(false);
  });

  it("probes sessions through get on a real context, where the property throws", () => {
    // `sessions` is not in this plugin's inject, so Cordis makes the property
    // read throw; only the resolver may be used.
    const input = { focus: vi.fn() };
    const actx = { get: () => ({ input: { for: () => input } }) };
    const ctx = {
      get: (name: string) => (name === "sessions" ? { scope: () => actx } : undefined),
      get sessions(): never {
        throw new Error("cannot read service sessions: it is not injected");
      },
    };
    expect(focusComposerFor(ctx, "s1")).toBe(true);
    expect(input.focus).toHaveBeenCalledTimes(1);
  });
});

describe("createComposerFocus", () => {
  it("focuses immediately when the composer is already mounted", () => {
    const input = { focus: vi.fn() };
    const { scheduler, timers } = fakeScheduler();
    const driver = createComposerFocus({
      ctx: focusContext(input),
      doc: fakeDocument(true),
      sessionId: () => "s1",
      scheduler,
    });

    driver.request();
    expect(input.focus).toHaveBeenCalledTimes(1);
    expect(timers).toHaveLength(0);
  });

  it("waits for the mounting composer instead of focusing nothing", () => {
    const input = { focus: vi.fn() };
    const { scheduler, fire, timers } = fakeScheduler();
    // The probe answers "not mounted" until the second attempt.
    let mounted = false;
    const doc = { querySelector: () => (mounted ? {} : null) };
    const driver = createComposerFocus({
      ctx: focusContext(input),
      doc,
      sessionId: () => "s1",
      scheduler,
    });

    driver.request();
    expect(input.focus).not.toHaveBeenCalled();
    expect(timers).toHaveLength(1);

    mounted = true;
    fire();
    expect(input.focus).toHaveBeenCalledTimes(1);
  });

  it("retries through the scheduled steps and gives up at the end", () => {
    const input = { focus: vi.fn() };
    const { scheduler, fire, timers } = fakeScheduler();
    const driver = createComposerFocus({
      ctx: { sessions: { scope: () => undefined } },
      doc: fakeDocument(true),
      sessionId: () => "s1",
      scheduler,
    });

    driver.request();
    for (let step = 1; step < FOCUS_RETRY_DELAYS.length; step += 1) {
      expect(timers).toHaveLength(1);
      fire();
    }
    // The last attempt fails and there is no step left to schedule.
    expect(timers).toHaveLength(0);
    expect(input.focus).not.toHaveBeenCalled();
  });

  it("reads the active session on every attempt, not once at request time", () => {
    const first = { focus: vi.fn() };
    const second = { focus: vi.fn() };
    let active = "s1";
    let mounted = false;
    const { scheduler, fire } = fakeScheduler();
    const driver = createComposerFocus({
      ctx: {
        sessions: {
          scope: (id: string) => ({
            get: (name: string) =>
              name === "conversation" ? { input: { for: () => (id === active ? second : first) } } : undefined,
          }),
        },
      },
      doc: { querySelector: () => (mounted ? {} : null) },
      sessionId: () => active,
      scheduler,
    });

    driver.request();
    active = "s2";
    mounted = true;
    fire();
    expect(second.focus).toHaveBeenCalledTimes(1);
    expect(first.focus).not.toHaveBeenCalled();
  });

  it("keeps one pending retry when requests arrive back to back", () => {
    const { scheduler, timers } = fakeScheduler();
    const driver = createComposerFocus({
      ctx: focusContext({ focus: vi.fn() }),
      doc: fakeDocument(false),
      sessionId: () => "s1",
      scheduler,
    });

    driver.request();
    driver.request();
    driver.request();
    // Otherwise two timers would fight over the caret.
    expect(timers).toHaveLength(1);
  });

  it("stays quiet after dispose, including for a pending retry", () => {
    const input = { focus: vi.fn() };
    const { scheduler, timers } = fakeScheduler();
    const driver = createComposerFocus({
      ctx: focusContext(input),
      doc: fakeDocument(false),
      sessionId: () => "s1",
      scheduler,
    });

    driver.request();
    driver.dispose();
    expect(timers).toHaveLength(0);
    driver.request();
    expect(timers).toHaveLength(0);
    expect(input.focus).not.toHaveBeenCalled();
  });

  it("leaves a delivered focus alone when disposed afterwards", () => {
    const input = { focus: vi.fn() };
    const driver = createComposerFocus({
      ctx: focusContext(input),
      sessionId: () => "s1",
    });

    driver.request();
    driver.dispose();
    expect(input.focus).toHaveBeenCalledTimes(1);
  });

  it("does nothing without a document and a scheduler", () => {
    const input = { focus: vi.fn() };
    const driver = createComposerFocus({
      ctx: focusContext(input),
      sessionId: () => "s1",
    });

    driver.request();
    expect(input.focus).toHaveBeenCalledTimes(1);
  });

  it("answers without a session id instead of focusing the wrong composer", () => {
    const input = { focus: vi.fn() };
    const driver = createComposerFocus({
      ctx: focusContext(input),
      doc: fakeDocument(true),
      sessionId: () => undefined,
    });

    driver.request();
    expect(input.focus).not.toHaveBeenCalled();
  });

  it("accepts a full options object, so the entry can spread the browser guards", () => {
    const options: ComposerFocusOptions = {
      ctx: focusContext({ focus: vi.fn() }),
      sessionId: () => "s1",
    };
    expect(typeof createComposerFocus(options).request).toBe("function");
  });
});
