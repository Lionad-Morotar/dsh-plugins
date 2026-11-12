/**
 * The landing rule itself.
 *
 * The rule is user-visible behaviour and is worth asserting without a store or a
 * DOM in front of it: where the main view goes after the current session is
 * archived. Expected values are literal positions in the pre-archive sidebar
 * order, not recomputed from the implementation.
 */
import { describe, expect, it } from "vitest";

import { chooseLanding } from "../src/client/landing.ts";

describe("chooseLanding", () => {
  it("lands on the row directly below the archived one", () => {
    expect(chooseLanding(["a", "b", "c"], "b")).toEqual({ kind: "open", id: "c" });
  });

  it("lands on the row directly above when the archived one is last", () => {
    expect(chooseLanding(["a", "b", "c"], "c")).toEqual({ kind: "open", id: "b" });
  });

  it("asks for a new conversation when the archived row is the only one", () => {
    expect(chooseLanding(["a"], "a")).toEqual({ kind: "start" });
  });

  it("asks for a new conversation when the archived row is not in the order", () => {
    expect(chooseLanding(["a", "b"], "c")).toEqual({ kind: "start" });
  });

  it("asks for a new conversation when the order is empty", () => {
    expect(chooseLanding([], "a")).toEqual({ kind: "start" });
  });
});
