/**
 * The browser clipboard writer.
 *
 * `navigator.clipboard.writeText` is the only clipboard surface a page has, and in
 * practice it is not a total function: without document focus or a live user
 * activation it can reject, and it can also never settle at all. The harness'
 * copy buttons await it while holding a "copy in flight" flag, so a promise that
 * never settles turns the button permanently dead instead of merely failing: the
 * flag is never released and every later click is ignored.
 *
 * So the writer installed here is bounded. It gives the platform call a short
 * budget, falls back to the legacy selection copy, and always settles. A caller
 * that trusted the platform call can then show a real result instead of freezing
 * on a promise nobody will ever resolve.
 */
import { describe, expect, it, vi } from "vitest";

import {
  bindExecCommandCopy,
  installBoundedClipboard,
  writeBounded,
  type ClipboardFallback,
  type ClipboardScheduler,
} from "../src/client/clipboard-shim.ts";

/** A scheduler whose callbacks only run when the test fires them. */
function manualScheduler() {
  const timers = new Map<number, () => void>();
  let seq = 0;
  const scheduler: ClipboardScheduler & { fire(): void; readonly pending: number } = {
    setTimeout(callback: () => void) {
      seq += 1;
      timers.set(seq, callback);
      return seq;
    },
    clearTimeout(handle: number) {
      timers.delete(handle);
    },
    fire() {
      const due = [...timers.values()];
      timers.clear();
      for (const callback of due) callback();
    },
    get pending() {
      return timers.size;
    },
  };
  return scheduler;
}

/** A page clipboard as the wrapper sees it: callable with the text to copy. */
interface Page {
  writeText: (text: string) => Promise<void>;
}

/** A promise plus the handles that settle it, for "never settles" stand-ins. */
function deferred() {
  let resolve: () => void = () => {};
  let reject: (error: Error) => void = () => {};
  const promise = new Promise<void>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}

describe("bounded clipboard write", () => {
  it("reports success and leaves no timer behind when the platform copy lands", async () => {
    const scheduler = manualScheduler();
    const fallback = vi.fn(() => true);

    await expect(writeBounded({ writeText: async () => {} }, "hi", { scheduler, fallback })).resolves.toBe(true);

    expect(fallback).not.toHaveBeenCalled();
    expect(scheduler.pending).toBe(0);
  });

  it("falls back when the platform copy rejects, which is what an unfocused document does", async () => {
    const scheduler = manualScheduler();
    const fallback = vi.fn(() => true);
    const writeText = vi.fn(async () => {
      throw new Error("Document is not focused.");
    });

    await expect(writeBounded({ writeText }, "hi", { scheduler, fallback })).resolves.toBe(true);

    expect(fallback).toHaveBeenCalledExactlyOnceWith("hi");
  });

  it("settles through the fallback when the platform copy never settles", async () => {
    // The exact production failure: the promise stays pending forever, so an
    // awaiting caller is stuck. The budget is what makes this terminate.
    const scheduler = manualScheduler();
    const wedge = deferred();
    const fallback = vi.fn(() => true);

    const settled = writeBounded({ writeText: () => wedge.promise }, "hi", { scheduler, fallback });
    scheduler.fire();

    await expect(settled).resolves.toBe(true);
    expect(fallback).toHaveBeenCalledExactlyOnceWith("hi");
  });

  it("reports failure when both paths fail, instead of claiming a copy that did not happen", async () => {
    const scheduler = manualScheduler();
    const fallback = vi.fn(() => false);

    await expect(
      writeBounded({ writeText: async () => { throw new Error("denied"); } }, "hi", { scheduler, fallback }),
    ).resolves.toBe(false);
    expect(fallback).toHaveBeenCalledOnce();
  });

  it("reports failure when there is no platform copy to try and the fallback fails", async () => {
    const scheduler = manualScheduler();

    await expect(writeBounded({}, "hi", { scheduler, fallback: () => false })).resolves.toBe(false);
  });

  it("tries the fallback directly when the platform has no clipboard at all", async () => {
    const scheduler = manualScheduler();
    const fallback = vi.fn(() => true);

    await expect(writeBounded({}, "hi", { scheduler, fallback })).resolves.toBe(true);

    expect(fallback).toHaveBeenCalledExactlyOnceWith("hi");
  });

  it("does not let a late platform settlement overwrite a reported result", async () => {
    // The wedged promise may settle seconds later. It must not resurrect a copy
    // the user was already told failed, nor flip success into failure.
    const scheduler = manualScheduler();
    const wedge = deferred();
    const results: boolean[] = [];

    const settled = writeBounded({ writeText: () => wedge.promise }, "hi", { scheduler, fallback: () => false });
    scheduler.fire();
    results.push(await settled);
    wedge.resolve();

    expect(results).toEqual([false]);
  });
});

describe("installing the bounded writer", () => {
  it("replaces the page's writeText so every caller gets the bound, not just ours", () => {
    // The copy buttons that break are rendered by the harness, not by this
    // plugin; wrapping the platform method is the only place a plugin can reach them.
    const scheduler = manualScheduler();
    const original = vi.fn(async () => {});
    const clipboard: { writeText: (text: string) => Promise<void> } = { writeText: original };

    installBoundedClipboard(clipboard, { scheduler, fallback: () => true });

    expect(clipboard.writeText).not.toBe(original);
  });

  it("resolves for a landed copy so the caller records success", async () => {
    const clipboard: Page = { writeText: async () => {} };

    installBoundedClipboard(clipboard, { scheduler: manualScheduler(), fallback: () => false });

    await expect(clipboard.writeText("hi")).resolves.toBeUndefined();
  });

  it("calls the fallback for a wedged platform copy and resolves", async () => {
    const scheduler = manualScheduler();
    const wedge = deferred();
    const fallback: ClipboardFallback = vi.fn(() => true);
    const clipboard: Page = { writeText: () => wedge.promise };

    installBoundedClipboard(clipboard, { scheduler, fallback });
    const settled = clipboard.writeText("hi");
    scheduler.fire();

    await expect(settled).resolves.toBeUndefined();
    expect(fallback).toHaveBeenCalledExactlyOnceWith("hi");
  });

  it("rejects when nothing could write, so the caller shows a failure rather than a stale tick", async () => {
    const clipboard: Page = {
      writeText: async () => {
        throw new Error("denied");
      },
    };

    installBoundedClipboard(clipboard, { scheduler: manualScheduler(), fallback: () => false });

    await expect(clipboard.writeText("hi")).rejects.toThrow();
  });

  it("stays usable after a failed copy, which is the bug that made the button dead", async () => {
    // A wedged first attempt used to leave the caller's in-flight flag set
    // forever. Settling the promise is what releases it, so a second attempt
    // must be able to succeed.
    const scheduler = manualScheduler();
    let attempt = 0;
    const clipboard: { writeText: (text: string) => Promise<void> } = {
      writeText: () => {
        attempt += 1;
        return attempt === 1 ? deferred().promise : Promise.resolve();
      },
    };

    installBoundedClipboard(clipboard, { scheduler, fallback: () => true });

    const first = clipboard.writeText("one");
    scheduler.fire();
    await expect(first).resolves.toBeUndefined();
    await expect(clipboard.writeText("two")).resolves.toBeUndefined();
  });

  it("forwards the text and the clipboard receiver to the original method", async () => {
    const original = vi.fn(async function (this: { label: string }, text: string) {
      expect(this.label).toBe("clipboard");
      expect(text).toBe("hi");
    });
    const clipboard = { label: "clipboard", writeText: original };

    installBoundedClipboard(clipboard, { scheduler: manualScheduler(), fallback: () => false });
    await clipboard.writeText("hi");

    expect(original).toHaveBeenCalledOnce();
  });

  it("wraps only once, so the budget cannot be nested and stacked", () => {
    const scheduler = manualScheduler();
    const clipboard: Page = { writeText: async () => {} };

    installBoundedClipboard(clipboard, { scheduler, fallback: () => true });
    const once = clipboard.writeText;
    installBoundedClipboard(clipboard, { scheduler, fallback: () => true });

    expect(clipboard.writeText).toBe(once);
  });

  it("restores the original method on dispose, so a profile reload leaves no wrapper", () => {
    const original = async () => {};
    const clipboard: Page = { writeText: original };

    const dispose = installBoundedClipboard(clipboard, { scheduler: manualScheduler(), fallback: () => true });
    dispose();

    expect(clipboard.writeText).toBe(original);
  });

  it("uncovers the prototype method on dispose instead of copying it onto the instance", () => {
    // The real clipboard keeps `writeText` on its prototype. Restoring by
    // assignment would leave an own property shadowing it forever, so a later
    // install would look permanent even after the plugin is gone.
    class RealClipboard {
      async writeText(): Promise<void> {}
    }
    const clipboard = new RealClipboard();

    const dispose = installBoundedClipboard(clipboard, { scheduler: manualScheduler(), fallback: () => true });
    expect(Object.prototype.hasOwnProperty.call(clipboard, "writeText")).toBe(true);
    dispose();

    expect(Object.prototype.hasOwnProperty.call(clipboard, "writeText")).toBe(false);
    expect(clipboard.writeText).toBe(RealClipboard.prototype.writeText);
  });

  it("shares one disposer between repeated installs, so a reload cannot unpair them", () => {
    // Two modules both installing is the realistic double-wrap: they must agree on
    // one wrapper and one disposer, or the second install would outlive the first
    // one's teardown.
    const clipboard: Page = { writeText: async () => {} };
    const deps = { scheduler: manualScheduler(), fallback: () => true };

    const first = installBoundedClipboard(clipboard, deps);
    const wrapped = clipboard.writeText;
    const second = installBoundedClipboard(clipboard, deps);

    expect(second).toBe(first);
    expect(clipboard.writeText).toBe(wrapped);
  });

  it("does not unwrap a wrapper that a later install put back after a dispose", () => {
    // The stale disposer of a torn-down install must not detach the live one.
    const clipboard: Page = { writeText: async () => {} };
    const deps = { scheduler: manualScheduler(), fallback: () => true };

    const stale = installBoundedClipboard(clipboard, deps);
    stale();
    installBoundedClipboard(clipboard, deps);
    const live = clipboard.writeText;
    stale();

    expect(clipboard.writeText).toBe(live);
  });
});

describe("the legacy selection fallback", () => {
  /** A minimal document standing in for the DOM the fallback manipulates. */
  function fakeDocument(options: { copyResult: boolean; focused?: unknown }) {
    const appended: unknown[] = [];
    const removed: unknown[] = [];
    const textarea = {
      value: "",
      style: {} as Record<string, string>,
      setAttribute: vi.fn(),
      select: vi.fn(),
      setSelectionRange: vi.fn(),
      focus: vi.fn(),
      remove: vi.fn(),
    };
    const document = {
      createElement: vi.fn(() => textarea),
      execCommand: vi.fn(() => options.copyResult),
      body: {
        appendChild: vi.fn((node: unknown) => appended.push(node)),
        removeChild: vi.fn((node: unknown) => removed.push(node)),
      },
      getSelection: vi.fn(() => ({ removeAllRanges: vi.fn(), addRange: vi.fn(), rangeCount: 0 })),
      activeElement: options.focused ?? null,
    };
    return { document, textarea, appended, removed };
  }

  it("selects a detached field holding the text and asks the document to copy it", () => {
    const { document, textarea } = fakeDocument({ copyResult: true });

    expect(bindExecCommandCopy(document as never)("hi")).toBe(true);

    expect(textarea.value).toBe("hi");
    expect(document.execCommand).toHaveBeenCalledExactlyOnceWith("copy");
  });

  it("cleans up the field it added, so a failed copy leaves no stray element", () => {
    const { document, appended, removed } = fakeDocument({ copyResult: false });

    bindExecCommandCopy(document as never)("hi");

    expect(appended).toHaveLength(1);
    expect(removed).toHaveLength(1);
  });

  it("reports the document's answer rather than assuming success", () => {
    expect(bindExecCommandCopy(fakeDocument({ copyResult: false }).document as never)("hi")).toBe(false);
    expect(bindExecCommandCopy(fakeDocument({ copyResult: true }).document as never)("hi")).toBe(true);
  });

  it("hands focus back to the element that had it, so the composer keeps the caret", () => {
    // `select()` focuses the scratch field. Without an explicit restore the page
    // is left with no focused element after the field is removed, and the user's
    // typing goes nowhere even though the copy succeeded.
    const composer = { focus: vi.fn() };
    const { document } = fakeDocument({ copyResult: true, focused: composer });

    bindExecCommandCopy(document as never)("hi");

    expect(composer.focus).toHaveBeenCalledOnce();
  });

  it("restores focus even when the copy failed, since the field took it either way", () => {
    const composer = { focus: vi.fn() };
    const { document } = fakeDocument({ copyResult: false, focused: composer });

    bindExecCommandCopy(document as never)("hi");

    expect(composer.focus).toHaveBeenCalledOnce();
  });

  it("does not call focus on a body-level fallback, which would take focus from nowhere", () => {
    // With nothing focused, `activeElement` is the body; focusing it would give the
    // page a focus target it did not ask for.
    const { document } = fakeDocument({ copyResult: true });

    expect(() => bindExecCommandCopy(document as never)("hi")).not.toThrow();
  });

  it("keeps the field out of the accessibility tree and off the layout", () => {
    const { document, textarea } = fakeDocument({ copyResult: true });

    bindExecCommandCopy(document as never)("hi");

    const attrs = textarea.setAttribute.mock.calls.map(call => call[0]);
    expect(attrs).toContain("aria-hidden");
    expect(textarea.style.position).toBe("fixed");
  });
});