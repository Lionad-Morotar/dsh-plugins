import { describe, expect, it, vi } from "vitest";

import { copyToClipboard, nativeHelpers, osc52Sequence, tmuxSequence } from "../src/clipboard.ts";

/** A recorder standing in for the shell-outs and the raw stdout write. */
function harness(options: { platform?: string; env?: Record<string, string>; code?: number } = {}) {
  const calls: { command: string; args: readonly string[]; text: string }[] = [];
  const exec = vi.fn(async (command: string, args: readonly string[], text: string) => {
    calls.push({ command, args, text });
    return options.code ?? 0;
  });
  const write = vi.fn();
  return { exec, write, calls, deps: { platform: options.platform ?? "linux", env: options.env ?? {}, exec, write } };
}

describe("clipboard sequences", () => {
  it("wraps the payload in an OSC 52 clipboard write", () => {
    expect(osc52Sequence("hi")).toBe("\u001b]52;c;aGk=\u0007");
  });

  it("round-trips non-ASCII text through base64", () => {
    const sequence = osc52Sequence("你好");
    expect(Buffer.from(sequence.slice("\u001b]52;c;".length, -1), "base64").toString("utf8")).toBe("你好");
  });

  it("wraps OSC 52 in a tmux DCS passthrough and doubles every inner escape", () => {
    // The inner OSC's own leading ESC is doubled too: tmux reads an undoubled
    // ESC as the end of the passthrough body.
    expect(tmuxSequence("hi")).toBe("\u001bPtmux;\u001b\u001b]52;c;aGk=\u0007\u001b\\");
  });
});

describe("native helpers", () => {
  it("uses pbcopy on macOS and clip on Windows", () => {
    expect(nativeHelpers("darwin")).toEqual([["pbcopy", []]]);
    expect(nativeHelpers("win32")).toEqual([["clip", []]]);
  });

  it("tries the three Linux tools because no single one is always present", () => {
    expect(nativeHelpers("linux").map(([command]) => command)).toEqual(["wl-copy", "xclip", "xsel"]);
  });

  it("has nothing to try on a platform it does not know", () => {
    expect(nativeHelpers("aix")).toEqual([]);
  });
});

describe("copying outside tmux", () => {
  it("pipes through the native tool and reports it as landed", async () => {
    const test = harness({ platform: "darwin" });
    const outcome = await copyToClipboard("hello", test.deps);
    expect(test.exec).toHaveBeenCalledWith("pbcopy", [], "hello");
    expect(outcome).toEqual({ attempted: ["native", "osc52"], landed: ["native"], bytes: 5, degraded: false });
    expect(test.write).toHaveBeenCalledWith("\u001b]52;c;aGVsbG8=\u0007");
  });

  it("falls through the Linux helpers until one succeeds", async () => {
    const calls: string[] = [];
    const exec = async (command: string) => {
      calls.push(command);
      return command === "xclip" ? 0 : 1;
    };
    const outcome = await copyToClipboard("hello", { platform: "linux", env: {}, exec, write: vi.fn() });
    expect(calls).toEqual(["wl-copy", "xclip"]);
    expect(outcome.landed).toEqual(["native"]);
  });

  it("reports degraded when every native helper failed, since only the escape went out", async () => {
    const test = harness({ platform: "darwin", code: 127 });
    const outcome = await copyToClipboard("hello", test.deps);
    expect(outcome).toMatchObject({ attempted: ["native", "osc52"], landed: [], degraded: true });
    expect(test.write).toHaveBeenCalledWith("\u001b]52;c;aGVsbG8=\u0007");
  });

  it("treats a throwing helper as a failed helper rather than a crash", async () => {
    const exec = async () => {
      throw new Error("spawn pbcopy ENOENT");
    };
    const outcome = await copyToClipboard("hello", { platform: "darwin", env: {}, exec, write: vi.fn() });
    expect(outcome).toEqual({ attempted: ["native", "osc52"], landed: [], bytes: 5, degraded: true });
  });

  it("never shells out over SSH, where the helper would write the wrong machine", async () => {
    const test = harness({ platform: "darwin", env: { SSH_CONNECTION: "10.0.0.1 1 10.0.0.2 2" } });
    const outcome = await copyToClipboard("hello", test.deps);
    expect(test.exec).not.toHaveBeenCalled();
    // Nothing local ran, so nothing confirmed the copy: the escape is all there
    // is, and it stays unverifiable.
    expect(outcome).toEqual({ attempted: ["osc52"], landed: [], bytes: 5, degraded: true });
  });
});

describe("copying inside tmux", () => {
  it("loads the buffer and emits the passthrough, because a buffer alone misses the system clipboard", async () => {
    const test = harness({ platform: "darwin", env: { TMUX: "/tmp/tmux-501/default,1,0" } });
    const outcome = await copyToClipboard("hello", test.deps);
    expect(test.calls.map(call => call.command)).toEqual(["pbcopy", "tmux"]);
    expect(test.exec).toHaveBeenCalledWith("tmux", ["load-buffer", "-w", "-"], "hello");
    expect(test.write).toHaveBeenCalledWith("\u001bPtmux;\u001b\u001b]52;c;aGVsbG8=\u0007\u001b\\");
    expect(outcome).toEqual({
      attempted: ["native", "tmux-buffer", "osc52"],
      landed: ["native", "tmux-buffer"],
      bytes: 5,
      degraded: false,
    });
  });

  it("drops the -w flag on iTerm2, where tmux\\'s own OSC 52 emission crashes the session", async () => {
    const test = harness({ env: { TMUX: "/tmp/x", LC_TERMINAL: "iTerm2" } });
    await copyToClipboard("hello", test.deps);
    expect(test.exec).toHaveBeenCalledWith("tmux", ["load-buffer", "-"], "hello");
  });

  it("falls back to the raw escape when the buffer load fails", async () => {
    const test = harness({ env: { TMUX: "/tmp/x" }, code: 1 });
    const outcome = await copyToClipboard("hello", test.deps);
    expect(outcome).toMatchObject({ attempted: ["native", "tmux-buffer", "osc52"], landed: [], degraded: true });
    expect(test.write).toHaveBeenCalledWith("\u001b]52;c;aGVsbG8=\u0007");
  });
});

describe("reporting", () => {
  it("measures bytes, not characters, because terminals limit the escape by size", async () => {
    const test = harness({ platform: "darwin" });
    const outcome = await copyToClipboard("你好", test.deps);
    expect(outcome.bytes).toBe(Buffer.byteLength("你好", "utf8"));
  });
});
