import { describe, expect, it, vi } from "vitest";

import { parseCommitFocus } from "../src/client/model.ts";
import { consumeCommitFocus } from "../src/client/view.tsx";

describe("parseCommitFocus", () => {
  it("parses commit:<hex> and normalizes either case to lowercase", () => {
    expect(parseCommitFocus("commit:1A2b3C4d")).toEqual({ hash: "1a2b3c4d" });
    expect(parseCommitFocus("commit:0f1e2d3c4b5a69788796a5b4c3d2e1f0aabbccdd")).toEqual({
      hash: "0f1e2d3c4b5a69788796a5b4c3d2e1f0aabbccdd",
    });
  });

  it("accepts a 4-character hash and rejects 3", () => {
    expect(parseCommitFocus("commit:abc1")).toEqual({ hash: "abc1" });
    expect(parseCommitFocus("commit:abc")).toBeUndefined();
  });

  it("rejects other focus schemes and non-hex bodies", () => {
    expect(parseCommitFocus(undefined)).toBeUndefined();
    expect(parseCommitFocus("")).toBeUndefined();
    expect(parseCommitFocus("commit:")).toBeUndefined();
    expect(parseCommitFocus("path:src/a.ts:3")).toBeUndefined();
    expect(parseCommitFocus("commit:zzzz")).toBeUndefined();
    expect(parseCommitFocus("commit:abc123xyz")).toBeUndefined();
  });

  it("caps the hash at 64 hex characters", () => {
    expect(parseCommitFocus(`commit:${"a".repeat(64)}`)).toEqual({ hash: "a".repeat(64) });
    expect(parseCommitFocus(`commit:${"a".repeat(65)}`)).toBeUndefined();
  });
});

describe("consumeCommitFocus", () => {
  it("selects the commit and completes the request when a focus arrives", () => {
    const select = vi.fn();
    const complete = vi.fn();
    const consumed = consumeCommitFocus("commit:1A2b3C4d", { select, complete });
    expect(consumed).toBe(true);
    expect(select).toHaveBeenCalledWith("1a2b3c4d");
    expect(complete).toHaveBeenCalledTimes(1);
  });

  it("still completes when the focus does not address a commit", () => {
    const select = vi.fn();
    const complete = vi.fn();
    const consumed = consumeCommitFocus("symbol:foo", { select, complete });
    expect(consumed).toBe(false);
    expect(select).not.toHaveBeenCalled();
    expect(complete).toHaveBeenCalledTimes(1);
  });
});
