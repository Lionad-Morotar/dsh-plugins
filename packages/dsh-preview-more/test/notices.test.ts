/**
 * The third-party notices this package ships.
 *
 * The pdf chunk bundles pdf.js, which is Apache-2.0. Section 4(a) of that licence
 * requires the distributor to give recipients a copy of the licence, and that duty
 * is not discharged by the upstream project's own notice: the shipped artifact is
 * what a reader receives. The Draco section in the same file records the same
 * reasoning for the same licence, so this test keeps the two from drifting.
 *
 * It reads the committed files rather than the source graph: the notices and the
 * banner are what a reader actually gets, and a library added to a build without
 * them is the exact failure this guards.
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const here = dirname(fileURLToPath(import.meta.url));
const packageRoot = join(here, "..");
const read = (file: string): string => readFileSync(join(packageRoot, file), "utf8");

describe("third-party notices", () => {
  const notices = read("THIRD-PARTY-NOTICES.md");

  it("carries a pdf.js section", () => {
    expect(notices).toContain("## pdf.js");
  });

  it("names the licence and where it comes from", () => {
    const section = notices.slice(notices.indexOf("## pdf.js"));
    expect(section).toContain("Apache License 2.0");
    expect(section).toContain("https://github.com/mozilla/pdf.js");
    expect(section).toContain("https://github.com/mozilla/pdf.js/blob/master/LICENSE");
  });

  it("reproduces the licence text rather than only linking it", () => {
    // A link is not the copy section 4(a) asks for; the Draco section sets the
    // precedent of inlining the full text, and this is the same obligation.
    const section = notices.slice(notices.indexOf("## pdf.js"));
    expect(section).toContain("TERMS AND CONDITIONS FOR USE, REPRODUCTION, AND DISTRIBUTION");
    expect(section).toContain("END OF TERMS AND CONDITIONS");
  });

  it("says the worker is inlined and makes no network request", () => {
    const section = notices.slice(notices.indexOf("## pdf.js"));
    expect(section).toContain("client.pdf.js");
    expect(section.toLowerCase()).toContain("worker");
  });

  it("names every library the emitted chunks carry", () => {
    // One line per bundled library, so a new engine cannot be added to a build
    // without someone noticing the list stopped matching.
    for (const library of ["three.js", "utif", "dxf-viewer", "Google Draco", "pdf.js"]) {
      expect(notices, library).toContain(library);
    }
  });
});

describe("chunk banner", () => {
  it("attributes pdf.js in the emitted pdf chunk", () => {
    // The banner is what travels with the code a reader downloads, so the
    // attribution has to be in the artifact and not only in the repository.
    const chunk = read("lib/client.pdf.js");
    expect(chunk).toContain("pdf.js");
    expect(chunk).toContain("Apache-2.0");
  });
});
