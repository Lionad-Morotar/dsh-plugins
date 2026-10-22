import { describe, expect, it } from "vitest";

import { parseCopyInput, USAGE } from "../src/arguments.ts";

describe("/copy argument parsing", () => {
  it("defaults to the last single reply when no argument is given", () => {
    expect(parseCopyInput("")).toEqual({ ok: true, count: 1, includeUser: false });
    expect(parseCopyInput("   ")).toEqual({ ok: true, count: 1, includeUser: false });
  });

  it("takes a bare number as the turn count", () => {
    expect(parseCopyInput(" 3")).toEqual({ ok: true, count: 3, includeUser: false });
    expect(parseCopyInput("12 ")).toEqual({ ok: true, count: 12, includeUser: false });
  });

  it("accepts --all in either position and with the short alias", () => {
    expect(parseCopyInput(" --all")).toEqual({ ok: true, count: 1, includeUser: true });
    expect(parseCopyInput(" 2 --all")).toEqual({ ok: true, count: 2, includeUser: true });
    expect(parseCopyInput(" --all 2")).toEqual({ ok: true, count: 2, includeUser: true });
    expect(parseCopyInput(" -a")).toEqual({ ok: true, count: 1, includeUser: true });
  });

  it("caps runaway counts instead of letting one command scan the whole log", () => {
    expect(parseCopyInput(" 100000")).toEqual({ ok: true, count: 50, includeUser: false });
  });

  it("rejects counts that cannot name a turn", () => {
    for (const raw of [" 0", " -1", " 1.5", " abc", " 2x"]) {
      const result = parseCopyInput(raw);
      expect(result.ok).toBe(false);
      if (!result.ok) expect(result.message).toBe(USAGE);
    }
  });

  it("rejects unknown flags rather than silently copying the wrong scope", () => {
    for (const raw of [" --json", " --al", " 2 --all --quiet"]) {
      const result = parseCopyInput(raw);
      expect(result.ok).toBe(false);
      if (!result.ok) expect(result.message).toBe(USAGE);
    }
  });

  it("rejects a repeated count so the scope is never guessed", () => {
    const result = parseCopyInput(" 2 3");
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.message).toBe(USAGE);
  });
});
