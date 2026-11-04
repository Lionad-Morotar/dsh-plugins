/**
 * The continue offer's decision, pinned where a wrong answer is invisible.
 *
 * The button's whole value is that it appears exactly when the turn was cut
 * short and the user is looking at it. Every failure mode here is silent: an
 * offer on a finished turn is noise, an offer on a background turn sends a
 * message the user cannot see the result of, and a missing offer after a stop
 * leaves the user retyping "continue" by hand. So the table below is the
 * contract, and the constants are asserted rather than trusted, because the
 * registration slice wires them into a slot without re-checking them.
 */
import { describe, expect, it } from "vitest";

import {
  CONTINUE_ID,
  CONTINUE_MESSAGE,
  CONTINUE_ORDER,
  CONTINUE_SLOT,
  shouldOfferContinue,
  type ContinueOfferInput,
} from "../src/client/continue-turn.ts";
import { DICTIONARIES } from "../src/client/dictionaries.ts";

/** A turn that was interrupted, is the last one, and has nothing in flight. */
const OFFER: ContinueOfferInput = {
  end: { reason: { kind: "interrupted" } },
  latest: true,
  pending: false,
};

/** One row of the decision table: the input and the answer it must produce. */
function caseOf(name: string, input: ContinueOfferInput, expected: boolean) {
  return { name, input, expected };
}

describe("continue identity", () => {
  it("sends the bare word the model reads as a resume instruction", () => {
    expect(CONTINUE_MESSAGE).toBe("continue");
  });

  it("targets the turn tail slot, after the cost meter", () => {
    expect(CONTINUE_SLOT).toBe("conversation.chat.turnTail");
    // The cost meter registers at 10; a lower number here would put the button
    // on the wrong side of a row the user already reads left to right.
    expect(CONTINUE_ORDER).toBeGreaterThan(10);
    expect(CONTINUE_ORDER).toBe(20);
  });

  it("uses its own slot entry id, so it cannot displace the cost meter", () => {
    expect(CONTINUE_ID).toBe("better-continue");
    expect(CONTINUE_ID).not.toBe("cost-meter-turn");
  });
});

describe("shouldOfferContinue", () => {
  it("offers on an interrupted last turn with nothing in flight", () => {
    expect(shouldOfferContinue(OFFER)).toBe(true);
  });

  it.each([
    caseOf("the turn has not ended yet", { ...OFFER, end: undefined }, false),
    caseOf("the end carries no reason", { ...OFFER, end: {} }, false),
    caseOf("the reason carries no kind", { ...OFFER, end: { reason: {} } }, false),
    caseOf("the turn stopped normally", { ...OFFER, end: { reason: { kind: "stop" } } }, false),
    caseOf("the turn ended in an error", { ...OFFER, end: { reason: { kind: "error" } } }, false),
    caseOf("the turn was aborted", { ...OFFER, end: { reason: { kind: "aborted" } } }, false),
    caseOf("the turn is not the last one", { ...OFFER, latest: false }, false),
    caseOf("a submission is still in flight", { ...OFFER, pending: true }, false),
    caseOf(
      "the turn was interrupted but the user moved on",
      { end: { reason: { kind: "interrupted" } }, latest: false, pending: false },
      false,
    ),
    caseOf(
      "the turn was interrupted and a submission is queued",
      { end: { reason: { kind: "interrupted" } }, latest: true, pending: true },
      false,
    ),
  ])("stays silent when $name", ({ input, expected }) => {
    expect(shouldOfferContinue(input)).toBe(expected);
  });

  it("matches the host's own interrupted test, so the red dot and the button agree", () => {
    // The host renders 任务已停止 for `reason.kind === "interrupted"` and for
    // nothing else. Any other kind must therefore produce neither.
    const kinds = ["interrupted", "stop", "error", "aborted", "unknown"];
    const offered = kinds.filter(kind => shouldOfferContinue({ ...OFFER, end: { reason: { kind } } }));
    expect(offered).toEqual(["interrupted"]);
  });
});

describe("continue copy", () => {
  const KEYS = ["continue.label", "continue.sending"] as const;

  it("exists in every dictionary, so the button never prints a raw key", () => {
    for (const [locale, dictionary] of Object.entries(DICTIONARIES)) {
      for (const key of KEYS) {
        const text = dictionary[key];
        expect(text, `${locale} is missing ${key}`).toBeTypeOf("string");
        expect(text?.trim()).not.toBe("");
      }
    }
  });

  it("is translated rather than copied between locales", () => {
    for (const key of KEYS) {
      expect(DICTIONARIES.zh?.[key]).not.toBe(DICTIONARIES.en?.[key]);
    }
  });

  it("says what the two states are", () => {
    expect(DICTIONARIES.zh?.["continue.label"]).toBe("继续");
    expect(DICTIONARIES.en?.["continue.label"]).toBe("Continue");
    expect(DICTIONARIES.zh?.["continue.sending"]).toBe("继续中…");
    expect(DICTIONARIES.en?.["continue.sending"]).toBe("Continuing…");
  });
});
