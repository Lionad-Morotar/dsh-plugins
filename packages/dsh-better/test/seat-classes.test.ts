/**
 * The seat's class map, pinned against the real hazard.
 *
 * The class prefix is a per-build content hash. Verified on this machine, the
 * CLI build ships `_7KE1Ra_` and the desktop application's bundle ships
 * `htuFrW_` for the same stylesheet, so any code that spells the prefix out
 * renders a correctly styled trigger on one host and an unstyled button on the
 * other. These cases exist so that regression cannot come back silently.
 */
import { describe, expect, it } from "vitest";

import { readSeatClasses } from "../src/client/seat.tsx";

/** The stylesheet id the shell installs the seat's CSS under. */
const SHEET_ID = "@deepseek-ai/dsh-client-ui-model-selection/ModelSelect.module.css";

/** A `<style>` element carrying one build's prefix. */
function stylesheet(prefix: string): Element {
  const css = [
    `.${prefix}_root{min-width:0;position:relative}`,
    `.${prefix}_trigger{height:28px;background:0 0}`,
    `.${prefix}_triggerIcon{display:none}`,
    `.${prefix}_triggerLabel{overflow:hidden}`,
    `.${prefix}_triggerEffort{color:var(--x)}`,
    `.${prefix}_chevron{transition:transform .12s}`,
  ].join("");
  return { textContent: css } as unknown as Element;
}

/** A document whose querySelector answers with the given element. */
function documentWith(element: Element | null): Document {
  return { querySelector: () => element } as unknown as Document;
}

/** The prefixes actually observed on this machine. */
const CLI_PREFIX = "_7KE1Ra";
const DESKTOP_PREFIX = "htuFrW";

describe("readSeatClasses", () => {
  it("reads the CLI build's prefix", () => {
    const classes = readSeatClasses(documentWith(stylesheet(CLI_PREFIX)));
    expect(classes?.trigger).toBe("_7KE1Ra_trigger");
    expect(classes?.root).toBe("_7KE1Ra_root");
  });

  it("reads the desktop build's different prefix for the same stylesheet", () => {
    // The case that motivated this module: a hard-coded `_7KE1Ra_` set leaves the
    // desktop trigger completely unstyled.
    const classes = readSeatClasses(documentWith(stylesheet(DESKTOP_PREFIX)));
    expect(classes?.trigger).toBe("htuFrW_trigger");
  });

  it("reads every class the trigger draws with", () => {
    const classes = readSeatClasses(documentWith(stylesheet(CLI_PREFIX)));
    expect(classes).toEqual({
      root: "_7KE1Ra_root",
      trigger: "_7KE1Ra_trigger",
      triggerIcon: "_7KE1Ra_triggerIcon",
      triggerLabel: "_7KE1Ra_triggerLabel",
      triggerEffort: "_7KE1Ra_triggerEffort",
      chevron: "_7KE1Ra_chevron",
    });
  });

  it("returns nothing rather than a partial map when the stylesheet is absent", () => {
    // A partial map would render a button with `class="undefined"`.
    expect(readSeatClasses(documentWith(null))).toBeUndefined();
  });

  it("returns nothing when the stylesheet is present but not the seat's", () => {
    expect(readSeatClasses(documentWith(stylesheet("other")))).not.toBeUndefined();
    expect(readSeatClasses(documentWith({ textContent: ".nope_card{x:1}" } as unknown as Element))).toBeUndefined();
  });

  it("returns nothing without a document", () => {
    expect(readSeatClasses(undefined)).toBeUndefined();
  });

  it("asks for the seat's own stylesheet, not another plugin's", () => {
    const asked: string[] = [];
    const doc = {
      querySelector: (selector: string) => {
        asked.push(selector);
        return null;
      },
    } as unknown as Document;
    readSeatClasses(doc);
    expect(asked[0]).toContain(SHEET_ID);
  });
});
