import { describe, expect, it, vi } from "vitest";

import { createViewFocusQueue } from "../src/client/view-focus.ts";

describe("view focus queue", () => {
  it("hands a request to the view it names", () => {
    const queue = createViewFocusQueue();
    queue.request("fs-explorer", "path:a.ts");
    expect(queue.pending()).toEqual({ view: "fs-explorer", focus: "path:a.ts" });
    expect(queue.take("fs-explorer")).toBe("path:a.ts");
    expect(queue.take("fs-explorer")).toBeUndefined();
    expect(queue.pending()).toBeUndefined();
  });

  it("keeps one request per view, latest wins", () => {
    const queue = createViewFocusQueue();
    queue.request("fs-explorer", "path:a.ts");
    queue.request("fs-explorer", "path:b.ts:12");
    expect(queue.take("fs-explorer")).toBe("path:b.ts:12");
  });

  it("never hands one view's request to another", () => {
    const queue = createViewFocusQueue();
    queue.request("fs-explorer", "path:a.ts");
    expect(queue.take("git-explorer")).toBeUndefined();
    expect(queue.pending()?.view).toBe("fs-explorer");
  });

  it("wakes subscribers so a mounted view reacts at once", () => {
    const queue = createViewFocusQueue();
    const listener = vi.fn();
    const off = queue.subscribe(listener);

    queue.request("fs-explorer", "path:a.ts");
    expect(listener).toHaveBeenCalledTimes(1);

    off();
    queue.request("fs-explorer", "path:b.ts");
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it("does not republish an identical request", () => {
    const queue = createViewFocusQueue();
    const listener = vi.fn();
    queue.subscribe(listener);
    queue.request("fs-explorer", "path:a.ts");
    queue.request("fs-explorer", "path:a.ts");
    expect(listener).toHaveBeenCalledTimes(1);
  });
});
