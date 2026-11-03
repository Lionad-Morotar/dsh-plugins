import { describe, expect, it } from "vitest";

import { parsePlaceholderInput, PLACEHOLDER_USAGE } from "../src/placeholder.ts";

describe("/placeholder grammar", () => {
  it("trims outer whitespace without rewriting the message body", () => {
    expect(parsePlaceholderInput("  first  line\nsecond line  ")).toEqual({
      ok: true,
      text: "first  line\nsecond line",
    });
  });

  it("rejects whitespace-only input with the usage line", () => {
    expect(parsePlaceholderInput(" \n\t ")).toEqual({ ok: false, message: PLACEHOLDER_USAGE });
  });
});
