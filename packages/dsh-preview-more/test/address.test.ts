import { describe, expect, it } from "vitest";

import { baseName, parseSessionFileAddress } from "../src/client/address.ts";

describe("session file address", () => {
  it("decodes the session and the absolute path", () => {
    const parsed = parseSessionFileAddress("dsh-resource://file/session/abc-123//Users/lionad/model.glb");
    expect(parsed).toEqual({ sessionId: "abc-123", path: "/Users/lionad/model.glb" });
  });

  it("keeps a workspace-relative path relative", () => {
    const parsed = parseSessionFileAddress("dsh-resource://file/session/s1/assets/a.glb");
    expect(parsed).toEqual({ sessionId: "s1", path: "assets/a.glb" });
  });

  it("refuses an address from another scope", () => {
    expect(parseSessionFileAddress("dsh-resource://file/absolute/Users/lionad/a.glb")).toBeNull();
    expect(parseSessionFileAddress("file:///Users/lionad/a.glb")).toBeNull();
  });

  it("refuses a session address with no path", () => {
    expect(parseSessionFileAddress("dsh-resource://file/session/s1/")).toBeNull();
    expect(parseSessionFileAddress("dsh-resource://file/session/s1")).toBeNull();
  });
});

describe("baseName", () => {
  it("takes everything after the last slash", () => {
    expect(baseName("/a/b/c.glb")).toBe("c.glb");
    expect(baseName("c.glb")).toBe("c.glb");
  });
});
