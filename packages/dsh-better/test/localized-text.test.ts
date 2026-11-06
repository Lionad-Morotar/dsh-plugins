/**
 * Provider-authored display text, resolved without the locale service.
 *
 * The model badge arrives as either one literal or a translation map, and it is
 * resolved on the trigger's render path. The interesting cases are therefore the
 * degraded ones: no resolver at all, and a resolver that throws. Both must still
 * print a usable label rather than take the trigger down.
 */
import { describe, expect, it } from "vitest";

import { fallbackLocalizedText, localizedText } from "../src/client/localized-text.ts";

describe("fallbackLocalizedText", () => {
  it("keeps a literal verbatim", () => {
    expect(fallbackLocalizedText("beta")).toBe("beta");
  });

  it("falls back to the one key the host requires on every map", () => {
    expect(fallbackLocalizedText({ en: "beta", zh: "测试" })).toBe("beta");
  });

  it("answers empty rather than inventing a language", () => {
    expect(fallbackLocalizedText({})).toBe("");
  });
});

describe("localizedText", () => {
  it("prefers the host's resolver", () => {
    expect(localizedText(() => "测试", { en: "beta", zh: "测试" })).toBe("测试");
  });

  it("falls back when the host exposes no resolver", () => {
    expect(localizedText(undefined, { en: "beta" })).toBe("beta");
  });

  it("falls back when the resolver throws", () => {
    // A resolver on a render path must not be able to break the control it
    // decorates.
    expect(localizedText(() => {
      throw new Error("locale gone");
    }, { en: "beta" })).toBe("beta");
  });
});
