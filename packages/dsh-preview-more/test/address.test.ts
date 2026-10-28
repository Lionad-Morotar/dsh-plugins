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

describe("parseSessionFileAddress encoding", () => {
  it("decodes percent-escaped path segments", () => {
    // The host escapes each segment on the way out, so a file named with a
    // space or CJK characters arrives escaped and the reader needs the real
    // name.
    const parsed = parseSessionFileAddress("dsh-resource://file/session/abc/temp/my%20model.glb");
    expect(parsed).toEqual({ sessionId: "abc", path: "temp/my model.glb" });
    expect(parseSessionFileAddress("dsh-resource://file/session/abc/%E6%A8%A1%E5%9E%8B.glb")?.path).toBe("模型.glb");
  });

  it("keeps a path that was not escaped", () => {
    expect(parseSessionFileAddress("dsh-resource://file/session/abc/temp/Box.glb")).toEqual({
      sessionId: "abc",
      path: "temp/Box.glb",
    });
  });

  it("does not treat a query or fragment as part of the path", () => {
    // A tab may carry one, and a '?' inside the path would also shift where the
    // extension is read from.
    expect(parseSessionFileAddress("dsh-resource://file/session/abc/temp/Box.glb?v=2")?.path).toBe("temp/Box.glb");
    expect(parseSessionFileAddress("dsh-resource://file/session/abc/temp/Box.glb#page")?.path).toBe("temp/Box.glb");
  });

  it("leaves a malformed escape as written instead of throwing", () => {
    // A lone % is a broken address, and a URIError here would blame the decoder.
    expect(parseSessionFileAddress("dsh-resource://file/session/abc/a%zz.glb")?.path).toBe("a%zz.glb");
  });
});

describe("baseName", () => {
  it("takes everything after the last slash", () => {
    expect(baseName("/a/b/c.glb")).toBe("c.glb");
    expect(baseName("c.glb")).toBe("c.glb");
  });
});
