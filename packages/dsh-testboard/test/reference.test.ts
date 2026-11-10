/**
 * The reference writer and chip codec, without a DOM or a host.
 *
 * These pin the product decisions rather than the plumbing: a file spells
 * itself `@<path>` so the host's file bubble rule applies, a case carries both
 * ends, and the writer prefers the structured chip but never leaves the reader
 * with nothing when the chip channel is unavailable.
 */
import { describe, expect, it } from "vitest";

import {
  createTestboardReferenceSource,
  insertTestboardReference,
  openTestboardReference,
  parseTestboardFocus,
  referenceBlockReason,
  testboardFocusOf,
  testboardReferencePayload,
  testboardRefClipboardText,
  testboardRefModelText,
  type TestboardInsertionDeps,
  type TestboardReferenceInsert,
  type TestboardReferenceSeam,
  type TestboardReferenceSpan,
} from "../src/client/reference.ts";

const SPAN: TestboardReferenceSpan = { start: 4, end: 4, draftRev: 7 };

/**
 * A writer that records which channel was asked, in order.
 *
 * `chip` picks the facade's behaviour: accept the first write, refuse the first
 * and accept the retry, or refuse both (the plain-text fallback). `source`
 * models the registered trigger source, which is a separate capability from
 * whether this particular write lands.
 */
function writer(
  options: {
    readonly chip?: "ok" | "stale-then-ok" | "never";
    readonly source?: boolean;
    readonly span?: boolean;
    readonly text?: boolean;
  } = {},
) {
  const attempts: string[] = [];
  const inserts: TestboardReferenceInsert[] = [];
  const texts: string[] = [];
  let chipCalls = 0;
  const chipMode = options.chip ?? "ok";
  const deps: TestboardInsertionDeps = {
    captureSpan: () => {
      attempts.push("span");
      return options.span === false ? undefined : SPAN;
    },
    insertReference: (insert, span) => {
      inserts.push(insert);
      attempts.push(`chip@${String(span.draftRev)}`);
      chipCalls += 1;
      if (chipMode === "never") return false;
      if (chipMode === "stale-then-ok") return chipCalls > 1;
      return true;
    },
    insertText: (text, span) => {
      texts.push(text);
      attempts.push(`text@${String(span.draftRev)}`);
      return options.text !== false;
    },
    canInsertReference: options.source !== false,
  };
  return { deps, attempts, inserts, texts };
}

describe("testboard reference payload", () => {
  it("spells a file as the host's own @path file mention", () => {
    const payload = testboardReferencePayload({ kind: "file", path: "packages/dsh-arch/test/chrome.test.ts" });
    expect(payload.kind).toBe("testboard.file");
    expect(payload.clipboardText).toBe("@packages/dsh-arch/test/chrome.test.ts");
    expect(payload.modelText).toBe(payload.clipboardText);
    expect(payload.label).toBe("chrome.test.ts");
    expect(JSON.parse(payload.ref)).toMatchObject({ kind: "file", path: "packages/dsh-arch/test/chrome.test.ts" });
  });

  it("spells a case with both the file and the test name", () => {
    const payload = testboardReferencePayload({
      kind: "case",
      path: "packages/dsh-arch/test/chrome.test.ts",
      index: 3,
      name: "keeps the header fixed while the pane scrolls",
    });
    expect(payload.kind).toBe("testboard.case");
    expect(payload.modelText).toContain("packages/dsh-arch/test/chrome.test.ts");
    expect(payload.modelText).toContain("keeps the header fixed while the pane scrolls");
    expect(payload.label).toContain("chrome.test.ts");
    expect(payload.label).toContain("keeps the header fixed");
    expect(JSON.parse(payload.ref)).toMatchObject({ kind: "case", index: 3 });
  });

  it("normalises the path the row carries", () => {
    const payload = testboardReferencePayload({ kind: "file", path: "/packages\\dsh-arch/test/chrome.test.ts/" });
    expect(payload.path).toBe("packages/dsh-arch/test/chrome.test.ts");
    expect(payload.clipboardText).toBe("@packages/dsh-arch/test/chrome.test.ts");
  });

  it("decodes a chip back into the same text a reader saw", () => {
    const casePayload = testboardReferencePayload({ kind: "case", path: "a/b.test.ts", index: 1, name: "works" });
    expect(testboardRefClipboardText(casePayload.ref)).toBe(casePayload.clipboardText);
    expect(testboardRefModelText(casePayload.ref)).toBe(casePayload.modelText);
    // A foreign or malformed ref must not throw at send time.
    expect(testboardRefClipboardText("not json")).toBe("@not json");
    expect(testboardRefClipboardText(JSON.stringify({ kind: "other" }))).toBe(`@${JSON.stringify({ kind: "other" })}`);
  });
});

describe("insertTestboardReference", () => {
  it("writes a chip on the first attempt when the facade accepts it", () => {
    const w = writer();
    const result = insertTestboardReference(w.deps, testboardReferencePayload({ kind: "file", path: "a/b.test.ts" }));
    expect(result).toBe("reference");
    expect(w.attempts).toEqual(["span", "chip@7"]);
    expect(w.inserts[0]).toMatchObject({ source: "lionad.testboard", appearance: "file" });
  });

  it("re-captures the span after a stale revision is refused", () => {
    const w = writer({ chip: "stale-then-ok" });
    const result = insertTestboardReference(w.deps, testboardReferencePayload({ kind: "file", path: "a/b.test.ts" }));
    expect(result).toBe("reference");
    // First chip call refuses, the second accepts: two captures, two writes.
    expect(w.attempts).toEqual(["span", "chip@7", "span", "chip@7"]);
  });

  it("falls back to plain text when the chip channel refuses the write", () => {
    const w = writer({ chip: "never" });
    const result = insertTestboardReference(w.deps, testboardReferencePayload({ kind: "file", path: "a/b.test.ts" }));
    expect(result).toBe("text");
    expect(w.texts).toEqual(["@a/b.test.ts"]);
    expect(w.attempts).toEqual(["span", "chip@7", "span", "chip@7", "span", "text@7"]);
  });

  it("skips the chip channel entirely when no source is registered", () => {
    const w = writer({ source: false });
    expect(insertTestboardReference(w.deps, testboardReferencePayload({ kind: "file", path: "a/b.test.ts" }))).toBe(
      "text",
    );
    expect(w.attempts).toEqual(["span", "text@7"]);
  });

  it("fails without a span, because there is no caret to write at", () => {
    const w = writer({ span: false });
    expect(insertTestboardReference(w.deps, testboardReferencePayload({ kind: "file", path: "a/b.test.ts" }))).toBe(
      "failed",
    );
  });

  it("uses the session appearance for a case chip", () => {
    const w = writer();
    insertTestboardReference(
      w.deps,
      testboardReferencePayload({ kind: "case", path: "a/b.test.ts", index: 0, name: "works" }),
    );
    expect(w.inserts[0]?.appearance).toBe("session");
  });
});

describe("reference availability", () => {
  it("blocks with the reason the menu paints", () => {
    expect(referenceBlockReason(undefined)).toBe("noSession");
    expect(referenceBlockReason({ session: false, insertReference: true, source: true })).toBe("noSession");
    expect(referenceBlockReason({ session: true, insertReference: false, source: true })).toBe("noReference");
    expect(referenceBlockReason({ session: true, insertReference: true, source: false })).toBe("noReferenceSource");
    expect(referenceBlockReason({ session: true, insertReference: true, source: true })).toBeUndefined();
  });
});

describe("focus round trip", () => {
  it("carries a file path and a case index back to the view", () => {
    expect(parseTestboardFocus(testboardFocusOf({ kind: "file", path: "a/b.test.ts" }))).toEqual({
      kind: "file",
      path: "a/b.test.ts",
    });
    expect(parseTestboardFocus(testboardFocusOf({ kind: "case", path: "a/b.test.ts", index: 2, name: "x" }))).toEqual({
      kind: "case",
      path: "a/b.test.ts",
      index: 2,
      name: "",
    });
    expect(parseTestboardFocus("reveal:a/b.test.ts")).toBeUndefined();
    expect(parseTestboardFocus("case:notanumber:a/b.test.ts")).toBeUndefined();
  });
});

describe("reference source", () => {
  it("serialises a chip through the codec the host looks up by name", async () => {
    const source = createTestboardReferenceSource();
    expect(source.name).toBe("lionad.testboard");
    expect(source.trigger).toBe("@");
    expect(await source.candidates()).toEqual([]);
    const payload = testboardReferencePayload({ kind: "file", path: "a/b.test.ts" });
    expect(source.codec.clipboardText(payload.ref)).toBe("@a/b.test.ts");
    expect(await source.codec.serialize(payload.ref)).toBe("@a/b.test.ts");
  });

  it("opens the board on the referenced row when a chip is clicked", () => {
    const opened: { sessionId: string; viewId: string; focus: string }[] = [];
    const seam: TestboardReferenceSeam = {
      currentSessionId: () => "session-1",
      openView: (sessionId, viewId, focus) => {
        opened.push({ sessionId, viewId, focus });
        return true;
      },
    };
    const source = createTestboardReferenceSource(() => seam);
    const ref = testboardReferencePayload({ kind: "file", path: "a/b.test.ts" }).ref;
    expect(source.openReference({ id: "session-1" }, { ref })).toBe(true);
    expect(opened).toEqual([{ sessionId: "session-1", viewId: "testboard", focus: "file:a/b.test.ts" }]);
  });

  it("leaves a chip from another session inert", () => {
    const seam: TestboardReferenceSeam = {
      currentSessionId: () => "session-2",
      openView: () => true,
    };
    const source = createTestboardReferenceSource(() => seam);
    const ref = testboardReferencePayload({ kind: "file", path: "a/b.test.ts" }).ref;
    expect(source.openReference({ id: "session-1" }, { ref })).toBe(false);
  });
});

describe("openTestboardReference without a session-addressed seam", () => {
  it("queues the focus before switching, so the lazy mount can consume it", () => {
    const order: string[] = [];
    const seam: TestboardReferenceSeam = {
      requestFocus: (_viewId, focus) => {
        order.push(`focus:${focus}`);
      },
      openViewOrSwitch: () => {
        order.push("switch");
        return { opened: true, focused: false };
      },
    };
    const ref = testboardReferencePayload({ kind: "file", path: "a/b.test.ts" }).ref;
    expect(openTestboardReference(seam, "session-1", ref)).toBe(true);
    expect(order).toEqual(["focus:file:a/b.test.ts", "switch"]);
  });

  it("withdraws a focus the switch did not land on", () => {
    const order: string[] = [];
    const seam: TestboardReferenceSeam = {
      requestFocus: () => order.push("focus"),
      takeFocus: () => {
        order.push("take");
        return undefined;
      },
      openViewOrSwitch: () => {
        order.push("switch");
        return { opened: false, focused: false };
      },
    };
    const ref = testboardReferencePayload({ kind: "file", path: "a/b.test.ts" }).ref;
    expect(openTestboardReference(seam, "session-1", ref)).toBe(false);
    expect(order).toEqual(["focus", "switch", "take"]);
  });
});
