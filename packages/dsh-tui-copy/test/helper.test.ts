import { describe, expect, it } from "vitest";

import { runHelper } from "../src/index.ts";

describe("clipboard helpers", () => {
  it("resolves 0 for a helper that consumes stdin and exits cleanly", async () => {
    await expect(runHelper("cat", [], "payload")).resolves.toBe(0);
  });

  it("resolves 1 instead of throwing when the program does not exist", async () => {
    await expect(runHelper("definitely-not-a-clipboard-tool-xyz", [], "x")).resolves.toBe(1);
  });

  it("passes the helper's own non-zero status through, since callers only test for 0", async () => {
    await expect(runHelper("sh", ["-c", "exit 3"], "x")).resolves.toBe(3);
  });

  it("bounds a wedged helper instead of awaiting it forever", async () => {
    // A helper that never exits would otherwise leave `/copy` silent forever.
    const started = Date.now();
    await expect(runHelper("sleep", ["30"], "x")).resolves.toBe(1);
    expect(Date.now() - started).toBeLessThan(6000);
  }, 10_000);
});
