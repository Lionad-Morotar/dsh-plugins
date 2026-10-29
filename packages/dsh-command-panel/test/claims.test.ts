import { describe, expect, it } from "vitest";

import { expandModifiers, planClaim, sameCombination, type ClaimProbe } from "../src/client/claims.ts";
import type { NormalizedBinding } from "../src/client/dsh.ts";

/**
 * The claim pass is the only place the plugin writes a user preference, so these
 * tests are about what it refuses to do: displace a binding, or write twice.
 */

const NAVIGATE = "command-panel.navigate";
const SWITCH = "command-panel.switch";
const MOD_P = { code: "KeyP", modifiers: ["primary"] } as const;
const MOD_O = { code: "KeyO", modifiers: ["primary"] } as const;

function probe(options: {
  current?: NormalizedBinding | null;
  issue?: string | null;
  conflicts?: readonly string[];
  keys?: readonly string[];
}): ClaimProbe {
  return {
    current: () => (options.current === undefined ? null : options.current),
    describe: () => ({
      issue: options.issue ?? null,
      conflicts: options.conflicts ?? [],
      keys: options.keys ?? ["⌘P"],
    }),
  };
}

describe("expandModifiers", () => {
  it("expands primary by platform and canonicalises order", () => {
    expect(expandModifiers(["primary", "shift"], "macos")).toEqual(["meta", "shift"]);
    expect(expandModifiers(["primary", "shift"], "windows")).toEqual(["control", "shift"]);
  });

  it("deduplicates and sorts", () => {
    expect(expandModifiers(["shift", "primary", "meta"], "macos")).toEqual(["meta", "shift"]);
  });
});

describe("sameCombination", () => {
  it("compares expanded modifiers, not their spelling", () => {
    const current: NormalizedBinding = { code: "KeyP", modifiers: ["meta"] };
    expect(sameCombination(current, MOD_P, "macos")).toBe(true);
    expect(sameCombination(current, MOD_P, "windows")).toBe(false);
  });

  it("rejects a different physical key or absent binding", () => {
    expect(sameCombination({ code: "KeyO", modifiers: ["meta"] }, MOD_P, "macos")).toBe(false);
    expect(sameCombination({ code: "KeyP", modifiers: ["meta", "shift"] }, MOD_P, "macos")).toBe(false);
    expect(sameCombination(null, MOD_P, "macos")).toBe(false);
  });
});

describe("planClaim", () => {
  it("does nothing when the command is not registered yet", () => {
    const plan = planClaim(
      { id: NAVIGATE, binding: MOD_P },
      { current: () => undefined, describe: probe({}).describe },
      "macos",
    );
    expect(plan).toEqual({ kind: "skip", id: NAVIGATE, reason: "not-registered" });
  });

  it("does nothing when the key is already ours, so a second run never writes again", () => {
    const plan = planClaim(
      { id: NAVIGATE, binding: MOD_P },
      probe({ current: { code: "KeyP", modifiers: ["meta"] } }),
      "macos",
    );
    expect(plan).toEqual({ kind: "skip", id: NAVIGATE, reason: "already-bound" });
  });

  it("does not displace another command's binding", () => {
    const plan = planClaim(
      { id: SWITCH, binding: MOD_O },
      probe({ current: null, conflicts: ["session.new"] }),
      "macos",
    );
    expect(plan).toEqual({ kind: "blocked", id: SWITCH, keys: "⌘P", reason: "session.new" });
  });

  it("does not fight a combination the platform rejects", () => {
    const plan = planClaim(
      { id: SWITCH, binding: MOD_O },
      probe({ current: null, issue: "unsupported-browser" }),
      "macos",
    );
    expect(plan.kind).toBe("blocked");
    if (plan.kind === "blocked") expect(plan.reason).toBe("unsupported-browser");
  });

  it("claims a free combination", () => {
    const plan = planClaim({ id: NAVIGATE, binding: MOD_P }, probe({ current: null }), "macos");
    expect(plan).toEqual({ kind: "claim", id: NAVIGATE, binding: MOD_P });
  });
});
