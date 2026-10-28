/**
 * The rendered label, asserted without a renderer.
 *
 * The component is a plain function returning a JSX element tree, so calling it
 * directly is enough: the interesting question is exactly which text ends up in
 * which placement, and whether shadowing the shipped label costs the reader the
 * release marker.
 */
import { createElement } from "react";
import { describe, expect, it } from "vitest";
import { ModelProviderLabel, type Badge } from "../src/client/model-provider-label.tsx";

/** A Tag stand-in that keeps its text visible in the tree. */
const Tag: Badge = (props) => createElement("span", { "data-testid": "tag" }, props.children);

/** The owner props for a third-party provider's Flash model. */
const thirdParty = {
  provider: { id: "dsh-ddodsf", name: "dsh-ddodsf" },
  model: { id: "deepseek-v4.1-flash", name: "deepseek-v4.1-flash" },
};

/** Flatten a rendered tree into its text, in order. */
function textOf(node: unknown): string {
  if (node === null || node === undefined || node === false) return "";
  if (typeof node === "string") return node;
  if (Array.isArray(node)) return node.map(textOf).join("");
  const element = node as { type?: unknown; props?: { children?: unknown } };
  if (element.props === undefined) return "";
  return textOf(element.props.children);
}

describe("rendered label", () => {
  it("reads provider-then-model on the trigger, with no separator of its own", () => {
    const tree = ModelProviderLabel({ ...thirdParty, placement: "trigger", selected: true, Tag });
    // The composer appends the effort label and the caret outside this slot, so
    // the caption must end at the model name.
    expect(textOf(tree)).toBe("dsh-ddodsf deepseek-v4.1-flash");
  });

  it("keeps the catalog name alone in the menu and the list", () => {
    expect(textOf(ModelProviderLabel({ ...thirdParty, placement: "menu", selected: true, Tag }))).toBe("deepseek-v4.1-flash");
    expect(textOf(ModelProviderLabel({ ...thirdParty, placement: "option", selected: false, Tag }))).toBe("deepseek-v4.1-flash");
  });

  it("keeps the release marker on the official Flash entry", () => {
    const official = {
      provider: { id: "deepseek-account", name: "DeepSeek 账号" },
      model: { id: "deepseek-flash", name: "DeepSeek-V4.1-Flash" },
    };
    expect(textOf(ModelProviderLabel({ ...official, placement: "trigger", selected: true, Tag }))).toBe("DeepSeek 账号 DeepSeek-V4.1-Flash 1017");
  });

  it("renders no badge element at all for an unmarked entry", () => {
    const tree = ModelProviderLabel({ ...thirdParty, placement: "trigger", selected: true, Tag });
    const children = (tree as { props: { children: unknown } }).props.children;
    expect(Array.isArray(children)).toBe(false);
    expect(textOf(tree)).not.toContain("1017");
  });
});