import { describe, expect, it } from "vitest";

import { formatMessage } from "../src/locale.ts";

describe("formatMessage", () => {
  it("fills placeholders", () => {
    expect(formatMessage("Page {current} of {total}", { current: 2, total: 5 })).toBe("Page 2 of 5");
  });

  it("leaves an unknown placeholder as written", () => {
    // Rendering it empty would silently drop the word, and a missing value is a
    // dictionary bug the reader should be able to see.
    expect(formatMessage("Page {current} of {missing}", { current: 2 })).toBe("Page 2 of {missing}");
  });

  it("stringifies a numeric value", () => {
    expect(formatMessage("{count} layers", { count: 7 })).toBe("7 layers");
  });
});
