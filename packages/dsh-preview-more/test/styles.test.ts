/**
 * The stylesheet is a real requirement, not decoration.
 *
 * A canvas with no CSS box paints nothing, so a placeholder rule here would let
 * the exact bug this file prevents slip back: the surface mounts, the model
 * decodes, and the reader sees an empty pane.
 */
import { beforeEach, describe, expect, it } from "vitest";

import { insertStyles } from "../src/client/styles.ts";

/**
 * The stylesheet text a document received.
 * @param doc - document the entry installed into.
 * @returns the CSS, or an empty string when nothing was installed.
 */
function styleText(doc: Document): string {
  return (doc.head as unknown as { children: { textContent: string }[] }).children[0]?.textContent ?? "";
}

/** A minimal document: `head` is all this module touches. */
function fakeDocument(): Document {
  const children: { tagName: string; dataset: Record<string, string>; textContent: string }[] = [];
  const head = {
    get children() {
      return children;
    },
    append(child: { tagName: string; dataset: Record<string, string>; textContent: string }) {
      children.push(child);
    },
  };
  return {
    head,
    querySelector(selector: string) {
      // Only the guard selector is queried; it looks for the tag by its data
      // attribute, so a second insert sees the first one.
      return selector.includes("dsh-preview-more") && children.length > 0 ? children[0] : null;
    },
    querySelectorAll(selector: string) {
      return selector.includes("dsh-preview-more") ? children.slice() : [];
    },
    createElement(tag: string) {
      const element = {
        tagName: tag,
        dataset: {} as Record<string, string>,
        textContent: "",
        remove() {
          const at = children.indexOf(element);
          if (at >= 0) children.splice(at, 1);
        },
      };
      return element;
    },
  } as unknown as Document;
}

describe("insertStyles", () => {
  let doc: Document;
  beforeEach(() => {
    doc = fakeDocument();
  });

  it("gives the scene surface a box, a canvas and a toolbar", () => {
    insertStyles(doc);
    const css = (doc.head as unknown as { children: { textContent: string }[] }).children[0]?.textContent ?? "";

    expect(css).toContain(".preview-more-scene");
    expect(css).toContain("height: 100%");
    expect(css).toContain(".preview-more-canvas > canvas");
    expect(css).toContain(".preview-more-toolbar");
  });

  it("gives the raster surface the same box", () => {
    insertStyles(doc);
    const css = (doc.head as unknown as { children: { textContent: string }[] }).children[0]?.textContent ?? "";

    expect(css).toContain(".preview-more-raster");
    expect(css).toContain(".preview-more-image");
  });

  it("letterboxes a raster page instead of distorting it", () => {
    insertStyles(doc);
    const css = styleText(doc);
    const rule = /\.preview-more-canvas-image[^{]*\{([^}]*)\}/u.exec(css)?.[1] ?? "";

    // object-fit applies to a canvas only when both dimensions are set: with
    // max-width alone the computed value falls back to fill, which stretched a
    // 59x52 scan across the whole sidebar. The invariant is "contain, with a
    // full box", and it has to hold as a pair or neither part works.
    expect(rule).toMatch(/object-fit:\s*contain/u);
    expect(rule).toMatch(/(?<!max-)(?<!min-)width:\s*100%/u);
    expect(rule).toMatch(/(?<!max-)(?<!min-)height:\s*100%/u);
  });

  it("inserts at most one tag, so a second host does not stack stylesheets", () => {
    insertStyles(doc);
    insertStyles(doc);

    expect((doc.head as unknown as { children: unknown[] }).children).toHaveLength(1);
  });

  it("removes only the tag it inserted", () => {
    const dispose = insertStyles(doc);
    expect((doc.head as unknown as { children: unknown[] }).children).toHaveLength(1);
    dispose();
    expect((doc.head as unknown as { children: unknown[] }).children).toHaveLength(0);
  });

  it("backs out when a concurrent insert won the race", () => {
    // Two hosts applying at once can both pass the pre-append check, because
    // neither has appended yet when it looks. The loser must remove its own tag
    // and hand back a disposer that touches nothing, or its teardown deletes the
    // stylesheet the winner is still using.
    const children = (doc.head as unknown as { children: unknown[] }).children;
    let blindChecks = 1;
    const racing = {
      ...doc,
      // The losing insert's pre-check runs before the winner appended.
      querySelector(selector: string) {
        if (blindChecks > 0) {
          blindChecks -= 1;
          return null;
        }
        return selector.includes("dsh-preview-more") && children.length > 0 ? children[0] : null;
      },
      querySelectorAll(selector: string) {
        return selector.includes("dsh-preview-more") ? children.slice() : [];
      },
    } as unknown as Document;
    const childrenOf = (racing.head as unknown as { children: unknown[] }).children;
    // The winner is already in place by the time the loser appends.
    const winner = doc.createElement("style") as unknown as { dataset: Record<string, string>; textContent: string };
    winner.dataset.pluginCss = "dsh-preview-more";
    childrenOf.push(winner);

    const dispose = insertStyles(racing);
    expect(childrenOf).toHaveLength(1);
    dispose();
    expect(childrenOf).toHaveLength(1);
  });

  it("only references custom properties the host actually defines", () => {
    // A var() with a fallback still renders, which is exactly why an invented
    // token name survives review: nothing breaks, the colour just stops
    // following the theme. The host's tokens are the --dsw-* family; --dsh-* was
    // an earlier invention that matched nothing in the app bundle.
    insertStyles(doc);
    const css = styleText(doc);
    const referenced = [...css.matchAll(/var\((--[a-z0-9-]+)/gu)].map((match) => match[1]);

    expect(referenced.length).toBeGreaterThan(0);
    for (const name of referenced) expect(name).toMatch(/^--dsw-/u);
  });
});
