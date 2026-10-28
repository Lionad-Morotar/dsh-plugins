/**
 * The label's copy and its placement rules.
 *
 * `conversation.input.model.label` is a `single` slot: one component renders the
 * model name everywhere the composer shows it — the trigger caption, the root
 * menu's current value, and every row of the model list. The provider prefix is
 * only wanted on the caption, so the placement decision is the interesting part
 * and is asserted here rather than inferred from markup.
 */
import { describe, expect, it } from "vitest";
import { labelFor, placementWantsProvider, providerLabel, releaseBadge } from "../src/client/label.ts";
import type { ModelLabelOwner } from "../src/client/owner.ts";

/** An owner with the two identities the label reads. */
function owner(overrides: Partial<ModelLabelOwner> = {}): ModelLabelOwner {
  return {
    provider: { id: "dsh-ddodsf", name: "dsh-ddodsf" },
    model: { id: "deepseek-v4.1-flash", name: "deepseek-v4.1-flash" },
    placement: "trigger",
    selected: true,
    ...overrides,
  };
}

describe("provider label", () => {
  it("prints the provider's display name", () => {
    expect(providerLabel({ id: "deepseek-account", name: "DeepSeek 账号" })).toBe("DeepSeek 账号");
  });

  it("falls back to the provider id when no display name was given", () => {
    expect(providerLabel({ id: "dsh-ddodsf", name: "dsh-ddodsf" })).toBe("dsh-ddodsf");
    expect(providerLabel({ id: "custom", name: "  " })).toBe("custom");
  });
});

describe("placement", () => {
  it("prefixes only the trigger caption", () => {
    expect(placementWantsProvider("trigger")).toBe(true);
    expect(placementWantsProvider("menu")).toBe(false);
    expect(placementWantsProvider("option")).toBe(false);
  });
});

describe("labelFor", () => {
  it("leads with the provider on the trigger", () => {
    expect(labelFor(owner())).toBe("dsh-ddodsf deepseek-v4.1-flash");
  });

  it("keeps the catalog name alone in the menu and the list", () => {
    expect(labelFor(owner({ placement: "menu" }))).toBe("deepseek-v4.1-flash");
    expect(labelFor(owner({ placement: "option" }))).toBe("deepseek-v4.1-flash");
  });

  it("keeps the official release marker on the official Flash entry", () => {
    const official = owner({
      provider: { id: "deepseek-account", name: "DeepSeek 账号" },
      model: { id: "deepseek-flash", name: "DeepSeek-V4.1-Flash" },
    });
    expect(labelFor(official)).toBe("DeepSeek 账号 DeepSeek-V4.1-Flash");
  });

  it("does not repeat a provider whose name is the model's own prefix", () => {
    const same = owner({ provider: { id: "deepseek", name: "deepseek" }, model: { id: "deepseek-v4", name: "deepseek-v4" } });
    expect(labelFor(same)).toBe("deepseek deepseek-v4");
  });
});

describe("release marker", () => {
  it("keeps the official Flash marker the shadowed label printed", () => {
    const official = { id: "deepseek-account", name: "DeepSeek 账号" };
    expect(releaseBadge(official, { id: "deepseek-flash", name: "DeepSeek-V4.1-Flash" })).toBe("1017");
  });

  it("marks neither a third-party provider nor a different official model", () => {
    const flash = { id: "deepseek-flash", name: "DeepSeek-V4.1-Flash" };
    expect(releaseBadge({ id: "dsh-ddodsf", name: "dsh-ddodsf" }, { id: "deepseek-v4.1-flash", name: "deepseek-v4.1-flash" })).toBeNull();
    expect(releaseBadge({ id: "deepseek-account", name: "DeepSeek 账号" }, { id: "deepseek-pro", name: "DeepSeek-V4.1-Pro" })).toBeNull();
    expect(releaseBadge({ id: "deepseek-account", name: "DeepSeek 账号" }, flash)).not.toBeNull();
  });
});