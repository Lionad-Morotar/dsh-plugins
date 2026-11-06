/**
 * The composer's submit phase, pinned where a wrong answer is invisible.
 *
 * 0.2.2 publishes a message's local echo only after the host accepts it, and it
 * freezes the composer while that acceptance is pending. Both facts make the
 * phase the only face that shows the send itself: a surface that treats the
 * window as idle offers a second submit (the continue button) or silently drops
 * input (the paste path). The cases below are that decision, plus the one string
 * a refused paste shows.
 */
import { describe, expect, it } from "vitest";

import { composerBusy } from "../src/client/composer-phase.ts";
import { DICTIONARIES } from "../src/client/dictionaries.ts";

describe("composerBusy", () => {
  it("treats only plain as writable", () => {
    expect(composerBusy("plain")).toBe(false);
  });

  it.each(["adjudicating", "claimed", "submitting", "sending"])(
    "treats %s as mid-submit",
    phase => {
      // Every one of these freezes the editor and the attachment intake; a
      // writer that assumed otherwise would fail without a trace.
      expect(composerBusy(phase)).toBe(true);
    },
  );

  it("treats an unpublished phase as writable", () => {
    // A host older than 0.2.2 freezes nothing this package writes, and a missing
    // store must degrade to the previous behaviour rather than to a permanent
    // lock.
    expect(composerBusy(undefined)).toBe(false);
  });

  it("treats an unknown future phase as mid-submit", () => {
    // The safe direction: a new frozen phase must not be mistaken for idle.
    expect(composerBusy("recovering")).toBe(true);
  });
});

describe("paste notice copy", () => {
  const KEY = "attach.pasteBusy";

  it("exists in every dictionary, so a refused paste never prints a raw key", () => {
    for (const [locale, dictionary] of Object.entries(DICTIONARIES)) {
      const text = dictionary[KEY];
      expect(text, `${locale} is missing ${KEY}`).toBeTypeOf("string");
      expect(text?.trim()).not.toBe("");
    }
  });

  it("says what happened rather than naming the internal phase", () => {
    expect(DICTIONARIES.zh?.[KEY]).not.toContain("sending");
    expect(DICTIONARIES.en?.[KEY]).not.toContain("sending");
  });
});
