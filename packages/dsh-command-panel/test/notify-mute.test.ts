import { afterEach, describe, expect, it, vi } from "vitest";
import { copyFor } from "../src/client/copy.ts";
import { notifyMuteRow, runNotifyMute } from "../src/client/notify-mute.ts";

afterEach(() => vi.unstubAllGlobals());

describe("notification plugin mute fallback", () => {
  it("toggles only the current session and respects the plugin command when present", () => {
    let ids = ["other"];
    const api = {
      get config() { return { mutedSessions: ids }; },
      debug: () => ({ configStored: true }),
      setConfig: ({ mutedSessions }: { mutedSessions: string[] }) => { ids = mutedSessions; return { mutedSessions: ids }; },
    };
    vi.stubGlobal("__dshNotifyMe", api);
    expect(notifyMuteRow(undefined, "current", copyFor("zh"))[0]?.label).toContain("静音");
    runNotifyMute("mute-session", "current");
    expect(ids).toEqual(["other", "current"]);
    expect(notifyMuteRow(undefined, "current", copyFor("zh"))[0]?.label).toContain("取消静音");
    expect(() => runNotifyMute("mute-session", "current")).toThrow();
    runNotifyMute("unmute-session", "current");
    expect(ids).toEqual(["other"]);
    expect(notifyMuteRow({ live: { contributions: new Map([["mute-session", {}]]) } }, "current", copyFor("zh"))).toEqual([]);
  });

  it("does not infer a mute state when storage has failed", () => {
    vi.stubGlobal("__dshNotifyMe", { config: { mutedSessions: [] }, debug: () => ({ configStored: false }), setConfig: vi.fn() });
    expect(notifyMuteRow(undefined, "current", copyFor("zh"))).toEqual([]);
    expect(() => runNotifyMute("mute-session", "current")).toThrow();
  });
});
