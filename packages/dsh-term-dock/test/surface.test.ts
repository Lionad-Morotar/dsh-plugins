import { describe, expect, it } from "vitest";

import { parseOpaque, solidColor } from "../src/client/surface.ts";

describe("opaque colour parsing", () => {
  it("strips the alpha a skin puts in its hex token", () => {
    expect(solidColor("#ebebeba8")).toBe("rgb(235, 235, 235)");
    expect(solidColor("#EBEBEBC2")).toBe("rgb(235, 235, 235)");
  });

  it("expands the short forms", () => {
    expect(solidColor("#fff")).toBe("rgb(255, 255, 255)");
    expect(solidColor("#fa0c")).toBe("rgb(255, 170, 0)");
  });

  it("reads the two functional syntaxes", () => {
    expect(solidColor("rgb(21, 21, 23)")).toBe("rgb(21, 21, 23)");
    expect(solidColor("rgba(21, 21, 23, 0.58)")).toBe("rgb(21, 21, 23)");
    expect(solidColor("rgb(21 21 23 / 58%)")).toBe("rgb(21, 21, 23)");
    expect(solidColor("rgb(100% 50% 0%)")).toBe("rgb(255, 128, 0)");
  });

  it("reads the `color(srgb …)` form Chrome computes color-mix into", () => {
    expect(solidColor("color(srgb 0.0588235 0.0666667 0.0823529 / 0.03)")).toBe("rgb(15, 17, 21)");
    expect(solidColor("color(srgb 1 0.5 0 / 0.2)")).toBe("rgb(255, 128, 0)");
  });

  it("leaves anything it does not understand untouched", () => {
    expect(solidColor("var(--dsw-alias-bg-base)")).toBe("var(--dsw-alias-bg-base)");
    expect(solidColor("oklch(0.4 0.1 240)")).toBe("oklch(0.4 0.1 240)");
    expect(solidColor("transparent")).toBe("transparent");
    expect(solidColor("  #123456  ")).toBe("rgb(18, 52, 86)");
  });

  it("answers null when no channels can be read", () => {
    expect(parseOpaque("")).toBeNull();
    expect(parseOpaque("not-a-colour")).toBeNull();
    expect(parseOpaque("#12345")).toBeNull();
    expect(parseOpaque("rgb(1, 2)")).toBeNull();
  });

  it("clamps out-of-range channels instead of wrapping them", () => {
    expect(parseOpaque("rgb(300, -5, 128)")).toEqual({ r: 255, g: 0, b: 128 });
  });
});
