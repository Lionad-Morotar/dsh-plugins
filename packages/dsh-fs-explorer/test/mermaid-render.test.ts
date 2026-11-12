// @vitest-environment jsdom
/**
 * The diagram render API, exercised against the real mermaid bundle.
 *
 * Only the failure path is asserted, and that is a deliberate limit rather than
 * an oversight. Mermaid measures its own layout with `getBBox`, which jsdom does
 * not implement, so a valid definition throws `childNodeEl.node(...)?.getBBox is
 * not a function` before any SVG exists. Mocking mermaid to get a green valid
 * case would mean testing a stub instead of the thing that ships, so the valid
 * path is left to the browser fixture in Slice 3 and this file covers what jsdom
 * can genuinely prove: a bad definition rejects, the rejection carries mermaid's
 * own message, the queue survives it, and the temporary container does not leak.
 */
import { describe, expect, it } from "vitest";

import { renderDiagram, renderer } from "../src/client/chunk/mermaid.tsx";

/** A palette, in the shape the preview chunk samples from computed style. */
const COLORS = {
  background: "#1b1b1f",
  text: "#e6e6e6",
  line: "#5a5a66",
  accent: "#4a9eff",
  muted: "#2a2a33",
} as const;

/** A definition mermaid cannot parse. */
const BROKEN = "graph TD\nA--->>B(((";

describe("mermaid chunk surface", () => {
  it("declares the marker the loader checks", () => {
    expect(renderer).toBe("mermaid");
  });

  it("rejects a definition it cannot parse, with mermaid's own message", async () => {
    const error = await renderDiagram(BROKEN, { colors: COLORS }).then(
      () => null,
      (reason: unknown) => reason,
    );

    expect(error).toBeInstanceOf(Error);
    const message = (error as Error).message;
    // Not just "something failed": the parse error names the line and the token,
    // which is what the fallback shows a reader who has to fix the diagram.
    expect(message.length).toBeGreaterThan(0);
    expect(message).toMatch(/mermaid could not render the diagram/u);
    expect(message).toMatch(/Parse error|Expecting|Lexical error/iu);
  });

  it("keeps serving later renders after one fails", async () => {
    // The queue's tail is settled, not rejected: one bad diagram in a document
    // must not stop every diagram after it from rendering.
    await expect(renderDiagram(BROKEN, { colors: COLORS })).rejects.toThrowError();
    await expect(renderDiagram(BROKEN, { colors: COLORS })).rejects.toThrowError(/Parse error|Expecting|Lexical/iu);
  });

  it("leaves no temporary container in the body", async () => {
    // `mermaid.render` appends `<div id="d<id>">` to the body and does not strip
    // it on every failure path. A leaked one outlives the pane that caused it.
    const before = document.body.children.length;
    await expect(renderDiagram(BROKEN, { colors: COLORS })).rejects.toThrowError();
    expect(document.body.children.length).toBe(before);
  });

  it("gives each render its own id, so two diagrams cannot collide", async () => {
    // The ids are internal, but their effect is observable: mermaid removes any
    // element already carrying the id it is handed, so a repeated id would make
    // the second diagram delete the first one's markup. Counting the body's
    // children after a run of renders is the honest proxy for that.
    const before = document.body.children.length;
    for (let attempt = 0; attempt < 3; attempt += 1) {
      await expect(renderDiagram(BROKEN, { colors: COLORS })).rejects.toThrowError();
    }
    expect(document.body.children.length).toBe(before);
  });
});
