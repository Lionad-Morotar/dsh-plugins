/**
 * Reference recognition in the chat prose, tested as a table.
 *
 * Three shapes can name a workspace target: an anchor the markdown renderer
 * made, an inline code span, and a bare path left as text. An anchor is trusted
 * once it is not an external scheme; the other two must look like a path, and a
 * bare one must also be a single unbroken fragment. The refusals carry more
 * weight than the acceptances, because a wrong underline is a promise the click
 * cannot keep.
 */
import { describe, expect, it } from "vitest";

import { classifyReference, normalizeReferenceTarget, type ReferenceProbe } from "../src/client/reference-link.ts";

/** A probe for an element in a settled message, outside any fence. */
function probe(fields: {
  readonly tag: string;
  readonly text: string;
  readonly href?: string;
  readonly insidePre?: boolean;
  readonly streaming?: boolean;
}): ReferenceProbe {
  return { insidePre: false, streaming: false, ...fields };
}

/** An anchor the markdown renderer produced, with the href the host wrote. */
function link(href: string): ReferenceProbe {
  return probe({ tag: "A", text: "", href });
}

/** An inline code span, whose text is the whole candidate. */
function code(text: string): ReferenceProbe {
  return probe({ tag: "CODE", text });
}

/** A path left as plain text inside a paragraph. */
function bare(text: string): ReferenceProbe {
  return probe({ tag: "P", text });
}

describe("normalizeReferenceTarget", () => {
  it("drops the leading dot-slash, the trailing slash and the surrounding space", () => {
    expect(normalizeReferenceTarget("  ./content/a.md  ")).toBe("content/a.md");
    expect(normalizeReferenceTarget("././content/a.md")).toBe("content/a.md");
    expect(normalizeReferenceTarget("packages/dsh-fs-explorer/")).toBe("packages/dsh-fs-explorer");
  });

  it("reads a Windows separator as a slash, so one target has one spelling", () => {
    expect(normalizeReferenceTarget("content\\6.maps\\a.md")).toBe("content/6.maps/a.md");
    expect(normalizeReferenceTarget(".\\content\\a.md")).toBe("content/a.md");
  });

  it("has no target for text that normalises away", () => {
    expect(normalizeReferenceTarget("")).toBeUndefined();
    expect(normalizeReferenceTarget("   ")).toBeUndefined();
    expect(normalizeReferenceTarget("/")).toBeUndefined();
    expect(normalizeReferenceTarget("//")).toBeUndefined();
    expect(normalizeReferenceTarget("./")).toBeUndefined();
  });
});

describe("classifyReference", () => {
  it("takes a site path, a resource address and a relative path from an anchor", () => {
    expect(classifyReference(link("/maps/_business/analysis/ai-subscription-resale"))).toEqual({
      target: "/maps/_business/analysis/ai-subscription-resale",
      kind: "link",
    });
    expect(classifyReference(link("content/a.md"))).toEqual({ target: "content/a.md", kind: "link" });
  });

  it("keeps the resource scheme intact, because the address starts after it", () => {
    expect(classifyReference(link("dsh-resource://file/session/x/content/a.md"))).toEqual({
      target: "dsh-resource://file/session/x/content/a.md",
      kind: "link",
    });
  });

  it("takes a file path and a directory path from inline code", () => {
    expect(classifyReference(code("content/6.maps/_business/analysis/ai-subscription-resale.md"))).toEqual({
      target: "content/6.maps/_business/analysis/ai-subscription-resale.md",
      kind: "code",
    });
    expect(classifyReference(code("packages/dsh-fs-explorer/"))).toEqual({
      target: "packages/dsh-fs-explorer",
      kind: "code",
    });
  });

  it("takes a bare path, including one written with Chinese directory names", () => {
    expect(classifyReference(bare("content/6.maps/_business/analysis"))).toEqual({
      target: "content/6.maps/_business/analysis",
      kind: "text",
    });
    expect(classifyReference(bare("docs/设计/说明"))).toEqual({ target: "docs/设计/说明", kind: "text" });
  });

  it("refuses every anchor that leaves the workspace", () => {
    for (const href of [
      "https://example.com/a/b",
      "http://x/y",
      "HTTPS://example.com/a/b",
      "mailto:a@b.c",
      "tel:+123",
      "data:text/plain,a/b",
      "javascript:void(0)",
      "#section",
      "//cdn/x",
    ]) {
      expect(classifyReference(link(href))).toBeUndefined();
    }
  });

  it("refuses an anchor with no href, or one that normalises away", () => {
    expect(classifyReference(probe({ tag: "A", text: "x" }))).toBeUndefined();
    expect(classifyReference(link(""))).toBeUndefined();
    expect(classifyReference(link("   "))).toBeUndefined();
    expect(classifyReference(link("/"))).toBeUndefined();
    expect(classifyReference(link("./"))).toBeUndefined();
  });

  it("refuses inline code that is a command or a word rather than a path", () => {
    expect(classifyReference(code("pnpm install"))).toBeUndefined();
    expect(classifyReference(code("foo"))).toBeUndefined();
    expect(classifyReference(code("a b/c"))).toBeUndefined();
    expect(classifyReference(code(""))).toBeUndefined();
  });

  it("refuses a sentence, which has no slash or has space in it", () => {
    expect(classifyReference(bare("这是一句普通的中文句子"))).toBeUndefined();
    expect(classifyReference(bare("hello world"))).toBeUndefined();
    expect(classifyReference(bare("see content/a.md for detail"))).toBeUndefined();
  });

  it("refuses a path whose first segment is empty, a dot, or a scheme", () => {
    expect(classifyReference(bare("//host/x"))).toBeUndefined();
    expect(classifyReference(code("//host/x"))).toBeUndefined();
    expect(classifyReference(code("./a.md"))).toBeUndefined();
    expect(classifyReference(code("../a.md"))).toBeUndefined();
    expect(classifyReference(code("http:/a/b"))).toBeUndefined();
  });

  it("refuses a segment holding a character a file name cannot carry", () => {
    expect(classifyReference(code("content/a.md?x=1"))).toBeUndefined();
    expect(classifyReference(code("content/a b/c"))).toBeUndefined();
    expect(classifyReference(code("content//a.md"))).toBeUndefined();
  });

  it("refuses anything inside a fence or in a message still being written", () => {
    expect(classifyReference(probe({ tag: "CODE", text: "content/a.md", insidePre: true }))).toBeUndefined();
    expect(classifyReference(probe({ tag: "A", text: "", href: "/a/b", insidePre: true }))).toBeUndefined();
    expect(classifyReference(probe({ tag: "P", text: "content/a.md", insidePre: true }))).toBeUndefined();
    expect(classifyReference(probe({ tag: "CODE", text: "content/a.md", streaming: true }))).toBeUndefined();
    expect(classifyReference(probe({ tag: "A", text: "", href: "/a/b", streaming: true }))).toBeUndefined();
    expect(classifyReference(probe({ tag: "P", text: "content/a.md", streaming: true }))).toBeUndefined();
  });
});
