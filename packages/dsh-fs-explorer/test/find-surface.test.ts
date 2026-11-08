// @vitest-environment jsdom
/**
 * The two find surfaces.
 *
 * The product promise is narrow and worth pinning: the counter and the visible
 * selection come from the same reading of the same text, so a hit count of
 * three never points at one highlight. The editor and DOM surfaces measure in
 * different spaces, and both are exercised here.
 */
import { describe, expect, it } from "vitest";

import { createDomSurface, createOffsetSurface } from "../src/client/find-surface.ts";
import { findMatches } from "../src/client/find.ts";

/** Build a rendered body the way a Markdown renderer would. */
function body(html: string): HTMLDivElement {
  const root = document.createElement("div");
  root.className = "fx-preview-body";
  root.innerHTML = html;
  document.body.append(root);
  return root;
}

describe("offset surface", () => {
  it("names the page scope unless the body claims the whole document", () => {
    expect(createOffsetSurface({ text: () => "x", select: () => {}, clear: () => {} }).scope).toBe("page");
    expect(
      createOffsetSurface({ scope: "document", text: () => "x", select: () => {}, clear: () => {} }).scope,
    ).toBe("document");
    expect(createDomSurface(() => null).scope).toBe("page");
  });

  it("counts hits in the live page text", () => {
    let text = "alpha beta";
    const surface = createOffsetSurface({ text: () => text, select: () => {}, clear: () => {} });
    expect(surface.count("beta")).toBe(1);

    // The editor outlives the page it holds, so the surface must re-read it.
    text = "gamma";
    expect(surface.count("beta")).toBe(0);
    expect(surface.count("gamma")).toBe(1);
  });

  it("selects the nth hit's own interval", () => {
    const selections: [number, number][] = [];
    const surface = createOffsetSurface({
      text: () => "one two one",
      select: (from, to) => selections.push([from, to]),
      clear: () => {},
    });
    surface.reveal("one", 1);
    expect(selections).toEqual([[8, 11]]);
  });

  it("ignores an index the current page does not have", () => {
    const selections: [number, number][] = [];
    const surface = createOffsetSurface({
      text: () => "one",
      select: (from, to) => selections.push([from, to]),
      clear: () => {},
    });
    surface.reveal("one", 4);
    expect(selections).toEqual([]);
  });
});

describe("dom surface", () => {
  it("counts what the reader sees, not the source markers", () => {
    const root = body("<p><strong>bold</strong> text</p>");
    const surface = createDomSurface(() => root);
    expect(surface.count("bold text")).toBe(1);
    // The `**` that produced the <strong> is not text on the page.
    expect(surface.count("**bold**")).toBe(0);
  });

  it("selects the nth hit over the rendered text nodes", () => {
    const root = body("<p>alpha beta</p><p>alpha gamma</p>");
    const surface = createDomSurface(() => root);
    surface.reveal("alpha", 1);

    const selection = document.getSelection();
    expect(selection?.rangeCount).toBe(1);
    expect(selection?.toString()).toBe("alpha");
    // The second paragraph, not the first, is where the second hit lives.
    expect(selection?.anchorNode?.parentElement?.tagName).toBe("P");
    expect(selection?.anchorNode?.parentElement).toBe(root.querySelectorAll("p")[1]);
  });

  it("does not match across a paragraph break", () => {
    const root = body("<p>end</p><p>start</p>");
    const surface = createDomSurface(() => root);
    expect(surface.count("endstart")).toBe(0);
    expect(surface.count("start")).toBe(1);
  });

  it("skips script and style contents", () => {
    const root = body("<p>visible</p><style>.x{color:red}</style><script>hidden()</script>");
    const surface = createDomSurface(() => root);
    expect(surface.count("visible")).toBe(1);
    expect(surface.count("hidden")).toBe(0);
    expect(surface.count("color")).toBe(0);
  });

  it("agrees with the pure matcher it is built on", () => {
    const root = body("<p>Needle needle</p>");
    const surface = createDomSurface(() => root);
    const text = root.textContent ?? "";
    expect(surface.count("needle")).toBe(findMatches(text, "needle").length);
  });

  it("clears the selection", () => {
    const root = body("<p>alpha</p>");
    const surface = createDomSurface(() => root);
    surface.reveal("alpha", 0);
    expect(document.getSelection()?.rangeCount).toBe(1);
    surface.clear();
    expect(document.getSelection()?.rangeCount).toBe(0);
  });

  it("answers nothing when no body is mounted", () => {
    const surface = createDomSurface(() => null);
    expect(surface.count("anything")).toBe(0);
    expect(() => surface.reveal("anything", 0)).not.toThrow();
  });
});
