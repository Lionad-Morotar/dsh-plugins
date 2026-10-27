import { describe, expect, it } from "vitest";

import { dictionaries, formatMessage } from "../src/client/locale.ts";

describe("locale", () => {
  it("carries both languages for every key", () => {
    const { zh, en } = dictionaries();
    const keys = Object.keys(zh).sort();
    expect(Object.keys(en).sort()).toEqual(keys);
    for (const key of keys) {
      expect(zh[key]?.length ?? 0).toBeGreaterThan(0);
      expect(en[key]?.length ?? 0).toBeGreaterThan(0);
    }
  });

  it("fills placeholders and leaves unknown ones alone", () => {
    expect(formatMessage("Page {current} of {total}", { current: 2, total: 5 })).toBe("Page 2 of 5");
    expect(formatMessage("Page {current} of {missing}", { current: 2 })).toBe("Page 2 of {missing}");
  });
});
