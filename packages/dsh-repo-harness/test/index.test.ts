import { describe, expect, it } from "vitest";

import { Config, apply, inject, name } from "../src/index.ts";

describe("repo-harness plugin", () => {
  it("declares its host identity and injects the two services it needs", () => {
    expect(name).toBe("repo-harness");
    expect(inject).toEqual(["agents", "subprocess"]);
  });

  it("exposes mergeSteer defaults through the Config schema", () => {
    const parsed = Config({}) as { mergeSteer: { pollMs: number; watch: boolean; maxNoticeChars: number } };
    expect(parsed.mergeSteer.pollMs).toBe(15_000);
    expect(parsed.mergeSteer.watch).toBe(true);
    expect(parsed.mergeSteer.maxNoticeChars).toBe(420);
  });

  it("starts and disposes the feature through ctx.effect", () => {
    let dispose: (() => void) | undefined;
    const ctx = {
      agents: { list: () => [] },
      subprocess: { spawn: () => { throw new Error("not used"); } },
      logger: { info: () => {}, warn: () => {} },
      effect: (setup: () => (() => void) | void) => {
        const returned = setup();
        if (typeof returned === "function") dispose = returned;
        return undefined;
      },
    };

    apply(ctx, {});
    expect(typeof dispose).toBe("function");
    expect(() => dispose?.()).not.toThrow();
  });
});
