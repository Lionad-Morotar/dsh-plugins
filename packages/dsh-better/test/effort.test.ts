/**
 * Effort levels, pinned at the properties the picker depends on:
 *
 *   - the ladder is per model, and "no ladder" is normal;
 *   - a fresh selection always lands on a level the catalog actually has;
 *   - a model with nothing to choose is one click, not two.
 */
import { describe, expect, it } from "vitest";

import {
  badgeLevels,
  effortLevelsOf,
  initialEffort,
  needsEffort,
  selectionOfDraft,
  type CatalogGroupLike,
  type EffortLevel,
} from "../src/client/effort.ts";

/** `off/low/high/max`, the most common shape on this machine. */
const FOUR: EffortLevel[] = [
  { id: "off", name: "Off" },
  { id: "low", name: "Low" },
  { id: "high", name: "High" },
  { id: "max", name: "Max" },
];

/** A different shape, because the set is not uniform across models. */
const THREE: EffortLevel[] = [
  { id: "low", name: "Low" },
  { id: "high", name: "High" },
  { id: "max", name: "Max" },
];

/** The catalog as two providers whose models disagree about their ladders. */
const GROUPS: CatalogGroupLike[] = [
  {
    id: "deepseek-account",
    models: [
      { id: "deepseek-flash", name: "DeepSeek-V4.1-Flash", reasoning: { efforts: FOUR, defaultEffort: "high" } },
      { id: "deepseek-v4-pro", name: "DeepSeek-V4-Pro", reasoning: { efforts: THREE, defaultEffort: "max" } },
    ],
  },
  {
    id: "dsh-dk",
    models: [{ id: "glm-5.3-flash", name: "glm-5.3-flash" }],
  },
];

describe("effortLevelsOf", () => {
  it("returns the ladder the model itself advertises", () => {
    expect(effortLevelsOf(GROUPS, { provider: "deepseek-account", model: "deepseek-flash" }).map((l) => l.id)).toEqual([
      "off",
      "low",
      "high",
      "max",
    ]);
  });

  it("keys by provider and model together, so siblings do not share a ladder", () => {
    expect(effortLevelsOf(GROUPS, { provider: "deepseek-account", model: "deepseek-v4-pro" }).map((l) => l.id)).toEqual([
      "low",
      "high",
      "max",
    ]);
  });

  it("reports no levels for a model that advertises none", () => {
    expect(effortLevelsOf(GROUPS, { provider: "dsh-dk", model: "glm-5.3-flash" })).toEqual([]);
  });

  it("reports no levels for a model that is no longer in the catalog", () => {
    expect(effortLevelsOf(GROUPS, { provider: "gone", model: "gone" })).toEqual([]);
  });

  it("does not hand back the catalog's own array", () => {
    const levels = effortLevelsOf(GROUPS, { provider: "deepseek-account", model: "deepseek-flash" });
    expect(levels).not.toBe(FOUR);
  });
});

describe("initialEffort", () => {
  it("prefers the adapter's own default", () => {
    expect(initialEffort(FOUR, "low", "high")).toBe("high");
  });

  it("keeps the value already in effect when the new model has it too", () => {
    expect(initialEffort(FOUR, "max", undefined)).toBe("max");
  });

  it("ignores a default the catalog does not actually advertise", () => {
    // Otherwise the visible choice would name a level the adapter cannot take.
    expect(initialEffort(THREE, undefined, "off")).toBe("low");
  });

  it("falls back to the top of the ladder rather than to no choice", () => {
    // Submitting no effort would let the adapter decide silently, and then the
    // highlighted level would disagree with what took effect.
    expect(initialEffort(FOUR, undefined, undefined)).toBe("off");
  });

  it("has nothing to choose when the model advertises no levels", () => {
    expect(initialEffort([], "high", "high")).toBeUndefined();
  });
});

describe("needsEffort", () => {
  it("asks for a choice when there is more than one level", () => {
    expect(needsEffort(FOUR)).toBe(true);
  });

  it("treats a single level as no choice at all", () => {
    expect(needsEffort([{ id: "high", name: "High" }])).toBe(false);
  });

  it("treats no levels as no choice at all", () => {
    expect(needsEffort([])).toBe(false);
  });
});

describe("selectionOfDraft", () => {
  it("carries the chosen effort", () => {
    expect(selectionOfDraft({ selection: { provider: "p", model: "m" }, levels: FOUR, chosen: "max" })).toEqual({
      provider: "p",
      model: "m",
      reasoningEffort: "max",
    });
  });

  it("omits the field entirely when nothing was chosen", () => {
    // A present-but-undefined key is not the same shot as an absent one.
    const sent = selectionOfDraft({ selection: { provider: "p", model: "m" }, levels: [], chosen: undefined });
    expect("reasoningEffort" in sent).toBe(false);
  });
});

describe("badgeLevels", () => {
  it("shows every level of a model that has a real ladder", () => {
    expect(badgeLevels(FOUR).map((level) => level.id)).toEqual(["off", "low", "high", "max"]);
  });

  it("shows nothing for a single-level model, because a one-item choice is not a choice", () => {
    expect(badgeLevels([{ id: "high", name: "High" }])).toEqual([]);
  });

  it("shows nothing for a model with no levels", () => {
    expect(badgeLevels([])).toEqual([]);
  });
});
