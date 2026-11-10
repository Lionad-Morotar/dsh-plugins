/**
 * The interop seam: the focus grammar this package speaks, and the jump that
 * hands one to another view.
 *
 * Two things are worth testing here rather than through a mounted view. The
 * grammar is a wire format shared with other packages, so it has to be pinned on
 * its own: a parser that accepts `compare:a:b:c` would silently compare the wrong
 * pair. And the jump's cleanup order is the whole reason it exists: the focus
 * queue holds one request per view, so a request that is delivered must be taken
 * back out or the next mount replays a stale target.
 */
import { describe, expect, it, vi } from "vitest";

import {
  createViewJump,
  formatCompareFocus,
  parseCompareFocus,
  type ViewJumpSeam,
} from "../src/client/interop.ts";

/** A seam that records every call, in order. */
function fakeSeam(result: { readonly opened: boolean; readonly focused: boolean } = { opened: true, focused: true }) {
  const calls: string[] = [];
  const seam: ViewJumpSeam = {
    openViewOrSwitch(id, focus) {
      calls.push(`switch:${id}:${focus ?? ""}`);
      return result;
    },
    viewFocus: {
      request(view, focus) {
        calls.push(`request:${view}:${focus}`);
      },
      take(view) {
        calls.push(`take:${view}`);
        return undefined;
      },
    },
  };
  return { seam, calls };
}

describe("the compare focus grammar", () => {
  it("round-trips a pair", () => {
    const focus = formatCompareFocus("main", "feature");

    expect(focus).toBe("compare:main:feature");
    expect(parseCompareFocus(focus)).toEqual({ base: "main", head: "feature" });
  });

  it("accepts a hash on either side", () => {
    expect(parseCompareFocus("compare:17b6a55:HEAD")).toEqual({ base: "17b6a55", head: "HEAD" });
  });

  it("accepts a remote-tracking ref, which holds a slash not a colon", () => {
    // A ref name cannot contain a colon, which is what makes the first-colon
    // split unambiguous for everything git can name.
    expect(parseCompareFocus("compare:origin/main:origin/release/2.0")).toEqual({
      base: "origin/main",
      head: "origin/release/2.0",
    });
  });

  it("rejects a payload with no head", () => {
    expect(parseCompareFocus("compare:main")).toBeUndefined();
  });

  it("rejects a payload with more than two segments", () => {
    // `compare:a:b:c` is not a pair. Accepting it would compare `a` to `b` and
    // silently drop `c`, which is worse than ignoring the request.
    expect(parseCompareFocus("compare:a:b:c")).toBeUndefined();
  });

  it("rejects an empty segment", () => {
    expect(parseCompareFocus("compare::feature")).toBeUndefined();
    expect(parseCompareFocus("compare:main:")).toBeUndefined();
    expect(parseCompareFocus("compare::")).toBeUndefined();
  });

  it("rejects another view's focus", () => {
    expect(parseCompareFocus("commit:17b6a55")).toBeUndefined();
    expect(parseCompareFocus("path:src/a.ts")).toBeUndefined();
  });

  it("rejects an absent focus", () => {
    expect(parseCompareFocus(undefined)).toBeUndefined();
    expect(parseCompareFocus("")).toBeUndefined();
  });

  it("formats a pair that the parser reads back", () => {
    const round = parseCompareFocus(formatCompareFocus("origin/main", "17b6a55"));

    expect(round).toEqual({ base: "origin/main", head: "17b6a55" });
  });
});

describe("the view jump", () => {
  it("requests the focus, then switches", () => {
    // The tab fallback: the switch changed tabs but could not carry the focus,
    // so the queue entry is left for the target to take.
    const { seam, calls } = fakeSeam({ opened: true, focused: false });
    const jump = createViewJump({ seam, sessionId: "s1" });

    jump("fs-explorer", "path:src/a.ts");

    // Request first, switch second: the target view may not exist yet, and the
    // queue is what survives that gap.
    expect(calls).toEqual(["request:fs-explorer:path:src/a.ts", "switch:fs-explorer:path:src/a.ts"]);
  });

  it("takes the request back when the switch delivered it", () => {
    const { seam, calls } = fakeSeam({ opened: true, focused: true });
    const jump = createViewJump({ seam, sessionId: "s1" });

    jump("fs-explorer", "path:src/a.ts");

    // A delivered focus must not be left in the queue: the next mount of that
    // view would replay a target the reader has already seen.
    expect(calls).toEqual([
      "request:fs-explorer:path:src/a.ts",
      "switch:fs-explorer:path:src/a.ts",
      "take:fs-explorer",
    ]);
  });

  it("leaves the request queued when the switch only changed tabs", () => {
    const { seam, calls } = fakeSeam({ opened: true, focused: false });
    const jump = createViewJump({ seam, sessionId: "s1" });

    jump("fs-explorer", "path:src/a.ts");

    // The tab fallback switches the view but cannot pass a focus, so the queue
    // entry is the only way the target ever learns what to open.
    expect(calls).toEqual(["request:fs-explorer:path:src/a.ts", "switch:fs-explorer:path:src/a.ts"]);
  });

  it("does nothing for an empty focus", () => {
    const { seam, calls } = fakeSeam();
    const jump = createViewJump({ seam, sessionId: "s1" });

    jump("fs-explorer", "");

    expect(calls).toEqual([]);
  });

  it("works on a core with no focus queue", () => {
    const calls: string[] = [];
    const seam: ViewJumpSeam = {
      openViewOrSwitch(id, focus) {
        calls.push(`switch:${id}:${focus ?? ""}`);
        return { opened: true, focused: false };
      },
    };
    const jump = createViewJump({ seam, sessionId: "s1" });

    expect(() => jump("git-explorer", "commit:17b6a55")).not.toThrow();
    expect(calls).toEqual(["switch:git-explorer:commit:17b6a55"]);
  });

  it("works on a core that only has the older openView", () => {
    const calls: string[] = [];
    const seam: ViewJumpSeam = {
      openView(id, focus) {
        calls.push(`open:${id}:${focus ?? ""}`);
        return true;
      },
    };
    const jump = createViewJump({ seam, sessionId: "s1" });

    jump("git-explorer", "commit:17b6a55");

    expect(calls).toEqual(["open:git-explorer:commit:17b6a55"]);
  });

  it("queues the request when neither switch path exists", () => {
    const requested: string[] = [];
    const seam: ViewJumpSeam = {
      viewFocus: {
        request(view, focus) {
          requested.push(`${view}:${focus}`);
        },
        take: () => undefined,
      },
    };
    const jump = createViewJump({ seam, sessionId: "s1" });

    jump("fs-explorer", "path:a.ts");

    // Nothing could switch, but the request is still worth leaving: a view that
    // mounts later takes it.
    expect(requested).toEqual(["fs-explorer:path:a.ts"]);
  });

  it("falls back to the session-scoped view seam", () => {
    const calls: string[] = [];
    const seam: ViewJumpSeam = {
      views: {
        open(sessionId, id, focus) {
          calls.push(`views:${sessionId}:${id}:${focus ?? ""}`);
          return true;
        },
      },
    };
    const jump = createViewJump({ seam, sessionId: "s1" });

    jump("fs-explorer", "path:a.ts");

    expect(calls).toEqual(["views:s1:fs-explorer:path:a.ts"]);
  });

  it("does not call a seam it was not given", () => {
    const take = vi.fn(() => undefined);
    const seam: ViewJumpSeam = { viewFocus: { request: () => undefined, take } };
    const jump = createViewJump({ seam, sessionId: "s1" });

    jump("fs-explorer", "path:a.ts");

    // Nothing was delivered, so nothing may be taken back.
    expect(take).not.toHaveBeenCalled();
  });
});
