/**
 * The trigger caption: the provider in front of the model name.
 *
 * The shell renders the composer's model name through `conversation.input.model.label`,
 * a single-owner child slot that cannot be declared twice, so this package draws
 * the caption itself. That makes the provider prefix this package's job: a bare
 * model name cannot tell two providers with the same catalog apart, and the
 * trigger is the one surface where nothing else says which provider is in use.
 */
import { describe, expect, it } from "vitest";

import { providerCaption, triggerCaption } from "../src/client/caption.ts";

describe("providerCaption", () => {
  it("uses the display name the catalog carries", () => {
    expect(providerCaption({ id: "deepseek-account", name: "DeepSeek 账号" })).toBe("DeepSeek 账号");
  });

  it("falls back to the provider id when the display name is blank", () => {
    // Hand-written provider entries often set no name; the id keeps the caption
    // readable instead of printing a leading space.
    expect(providerCaption({ id: "dsh-ddodsf", name: "" })).toBe("dsh-ddodsf");
    expect(providerCaption({ id: "dsh-ddodsf", name: "   " })).toBe("dsh-ddodsf");
  });

  it("trims a padded display name", () => {
    expect(providerCaption({ id: "x", name: " DeepSeek 账号 " })).toBe("DeepSeek 账号");
  });
});

describe("triggerCaption", () => {
  it("puts the provider in front of the model name", () => {
    expect(
      triggerCaption(
        { group: { id: "dsh-ddodsf", name: "dsh-ddodsf" }, model: { id: "deepseek-flash", name: "deepseek-v4.1-flash" } },
        "选择模型",
      ),
    ).toBe("dsh-ddodsf deepseek-v4.1-flash");
  });

  it("keeps the fallback when the selection is no longer in the catalog", () => {
    // The catalog can drop an entry the session still points at; inventing a
    // provider there would label the caption with something not selected.
    expect(triggerCaption(undefined, "选择模型")).toBe("选择模型");
  });

  it("separates the two names with exactly one space", () => {
    expect(triggerCaption({ group: { id: "a", name: " A " }, model: { id: "b", name: "B" } }, "x")).toBe("A B");
  });
});
