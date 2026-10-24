import { describe, expect, it } from "vitest";

import { MISSING_TOOL } from "../src/clipboard.ts";
import { runHelper } from "../src/index.ts";

describe("clipboard helpers", () => {
  it("resolves 0 for a helper that consumes stdin and exits cleanly", async () => {
    await expect(runHelper("cat", [], "payload")).resolves.toBe(0);
  });

  it("reports a missing program as missing, not as a failed run", async () => {
    // The distinction matters upstream: an absent tool never had a chance to
    // copy, so its absence must not be reported as a degraded copy.
    await expect(runHelper("definitely-not-a-clipboard-tool-xyz", [], "x")).resolves.toBe(MISSING_TOOL);
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
