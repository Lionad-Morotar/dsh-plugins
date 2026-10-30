import { describe, expect, it } from "vitest";

import { DEFAULT_CONFIG, normalizeConfig } from "../src/merge-steer/config.ts";

describe("normalizeConfig", () => {
  it("returns the 15-second polling defaults", () => {
    expect(normalizeConfig(undefined)).toEqual(DEFAULT_CONFIG);
    expect(DEFAULT_CONFIG.pollMs).toBe(15_000);
    expect(DEFAULT_CONFIG.maxNoticeChars).toBe(420);
  });

  it("clamps the poll interval", () => {
    expect(normalizeConfig({ pollMs: 1 }).pollMs).toBe(1_000);
    expect(normalizeConfig({ pollMs: 999_999 }).pollMs).toBe(60_000);
  });

  it("clamps catch-up and notice budgets", () => {
    expect(normalizeConfig({ maxCatchUpMs: 1 }).maxCatchUpMs).toBe(60_000);
    expect(normalizeConfig({ maxCatchUpMs: 99_999_999 }).maxCatchUpMs).toBe(3_600_000);
    expect(normalizeConfig({ maxNoticeChars: 1 }).maxNoticeChars).toBe(160);
    expect(normalizeConfig({ maxNoticeChars: 99_999 }).maxNoticeChars).toBe(1_200);
  });

  it("keeps the message budget below the notice budget", () => {
    const config = normalizeConfig({ maxNoticeChars: 160, maxMessageChars: 800 });
    expect(config.maxMessageChars).toBeLessThanOrEqual(config.maxNoticeChars - 120);
  });

  it("only accepts literal booleans for switches", () => {
    const config = normalizeConfig({ watch: "false", includePulls: 1, audienceAll: 0 } as never);
    expect(config.watch).toBe(DEFAULT_CONFIG.watch);
    expect(config.includePulls).toBe(false);
    expect(config.audienceAll).toBe(false);
  });
});
