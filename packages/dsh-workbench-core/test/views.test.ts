import { describe, expect, it, vi } from "vitest";

import { CHAT_VIEW_ID, createViewSeam } from "../src/client/views.ts";

describe("view switch seam", () => {
  it("binds an opener and routes showChat through it with an empty focus", () => {
    const seam = createViewSeam();
    const calls: Array<[string, string]> = [];
    const off = seam.bind("s1", (id, focus) => calls.push([id, focus]));

    expect(seam.showChat("s1")).toBe(true);
    expect(calls).toEqual([[CHAT_VIEW_ID, ""]]);

    off();
    expect(seam.showChat("s1")).toBe(false);
  });

  it("answers false for an unbound session instead of throwing", () => {
    const seam = createViewSeam();
    expect(seam.open("missing", "fs-explorer")).toBe(false);
    expect(seam.showChat("missing")).toBe(false);
  });

  it("keeps the latest binding when an old disposer runs", () => {
    const seam = createViewSeam();
    const calls: string[] = [];
    const offFirst = seam.bind("s1", id => calls.push(`first:${id}`));
    const offSecond = seam.bind("s1", id => calls.push(`second:${id}`));

    offFirst();
    seam.showChat("s1");
    expect(calls).toEqual(["second:chat"]);

    offSecond();
    expect(seam.showChat("s1")).toBe(false);
  });
});

describe("view switch seam onChatShown", () => {
  it("fires once per successful return to chat", () => {
    const seam = createViewSeam();
    const seen: string[] = [];
    seam.bind("s1", () => {});
    seam.onChatShown(() => seen.push("shown"));

    seam.showChat("s1");
    seam.showChat("s1");
    expect(seen).toEqual(["shown", "shown"]);
  });

  it("stays silent when the return could not be made", () => {
    const seam = createViewSeam();
    const listener = vi.fn();
    seam.onChatShown(listener);

    expect(seam.showChat("unbound")).toBe(false);
    expect(listener).not.toHaveBeenCalled();
  });

  it("stops after the disposer runs and tolerates one that runs twice", () => {
    const seam = createViewSeam();
    const listener = vi.fn();
    const off = seam.onChatShown(listener);
    seam.bind("s1", () => {});

    off();
    off();
    seam.showChat("s1");
    expect(listener).not.toHaveBeenCalled();
  });

  it("lets one listener unsubscribe while another stays subscribed", () => {
    const seam = createViewSeam();
    const first = vi.fn();
    const second = vi.fn();
    const offFirst = seam.onChatShown(first);
    seam.onChatShown(second);
    seam.bind("s1", () => {});

    offFirst();
    seam.showChat("s1");
    expect(first).not.toHaveBeenCalled();
    expect(second).toHaveBeenCalledTimes(1);
  });
});
