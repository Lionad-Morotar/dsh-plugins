/**
 * Finding and painting the shell's four surfaces.
 *
 * The shell is faked here in the shape the real one publishes: a frame element
 * whose children are the sidebar, the centre column, the right column and the
 * bottom row, with `data-rightbar-col` and `data-shell-bottom` as the two stable
 * anchors. The point of these tests is that the discovery is structural: it must
 * work with the shell's hashed class names and without them.
 */
import { JSDOM } from "jsdom";
import { beforeEach, describe, expect, it } from "vitest";

import {
  clearRegionPaint,
  clearRegions,
  locateRegions,
  paintRegions,
  REGION_ATTRIBUTE,
  regionsAreCurrent,
  stampRegions,
  type RegionSurfaces,
} from "../src/client/regions.ts";

let dom: JSDOM;

/**
 * Build a shell with the real layout's shape.
 *
 * The class names carry a fake hash, exactly like the host's: if discovery ever
 * starts depending on them, these tests keep passing for the wrong reason only
 * until the hash changes, so the attributes are what the assertions rely on.
 */
function buildShell(options: { collapsed?: boolean } = {}): Document {
  dom = new JSDOM(
    `<!doctype html><html><body>
      <div id="root">
        <div class="x_f1a2b_frame">
          ${options.collapsed === true ? "" : '<div class="x_f1a2b_sidebarCol" id="sidebar"></div>'}
          <div class="x_f1a2b_centerCol" id="main"></div>
          <div class="x_f1a2b_rightbarCol" id="rightbar" data-rightbar-col></div>
          <div class="x_f1a2b_bottomRow" id="bottom" data-shell-bottom></div>
        </div>
      </div>
    </body></html>`,
    { url: "http://127.0.0.1/" },
  );
  return dom.window.document;
}

describe("locateRegions", () => {
  it("finds all four surfaces from the two stable anchors", () => {
    const doc = buildShell();
    const regions = locateRegions(doc);
    expect(regions).not.toBeNull();
    expect(regions?.sidebar.id).toBe("sidebar");
    expect(regions?.main.id).toBe("main");
    expect(regions?.rightbar.id).toBe("rightbar");
    expect(regions?.bottom.id).toBe("bottom");
  });

  it("returns null when the shell is not there yet", () => {
    dom = new JSDOM("<!doctype html><html><body></body></html>", { url: "http://127.0.0.1/" });
    expect(locateRegions(dom.window.document)).toBeNull();
  });

  it("returns null rather than mislabelling a collapsed frame", () => {
    // With the sidebar gone, the frame's first child is the centre column; calling
    // that the sidebar would paint the main panel with the sidebar's settings.
    const doc = buildShell({ collapsed: true });
    expect(locateRegions(doc)).toBeNull();
  });
});

describe("stamping and painting", () => {
  let regions: RegionSurfaces;

  beforeEach(() => {
    const doc = buildShell();
    regions = locateRegions(doc) as RegionSurfaces;
    stampRegions(regions);
  });

  it("stamps each surface with its own key", () => {
    expect(regions.sidebar.getAttribute(REGION_ATTRIBUTE)).toBe("sidebar");
    expect(regions.main.getAttribute(REGION_ATTRIBUTE)).toBe("main");
    expect(regions.rightbar.getAttribute(REGION_ATTRIBUTE)).toBe("rightbar");
    expect(regions.bottom.getAttribute(REGION_ATTRIBUTE)).toBe("bottom");
    expect(regionsAreCurrent(regions)).toBe(true);
  });

  it("finds the surfaces stale once the shell replaced them", () => {
    const doc = buildShell();
    const replaced = locateRegions(doc) as RegionSurfaces;
    // A freshly discovered set is unstamped, so the old references are no longer
    // the elements the shell is showing.
    expect(regionsAreCurrent(replaced)).toBe(false);
  });

  it("paints each region's colour on the element and on the token its subtree reads", () => {
    paintRegions(regions, {
      sidebar: "#111111aa",
      main: "#222222bb",
      rightbar: "#333333cc",
      bottom: "#444444dd",
    });
    expect(regions.sidebar.style.backgroundColor).toBe("rgba(17, 17, 17, 0.667)");
    // The token override is what makes cards and panels inside the region agree
    // with the column they sit in.
    expect(regions.main.style.getPropertyValue("--dsw-alias-bg-base")).toBe("#222222bb");
    expect(regions.sidebar.style.getPropertyValue("--dsw-specific-sidebar-fill")).toBe("#111111aa");
  });

  it("drops the paint but keeps the stamps, so the surfaces stay claimed", () => {
    paintRegions(regions, {
      sidebar: "#111111aa",
      main: "#222222bb",
      rightbar: "#333333cc",
      bottom: "#444444dd",
    });
    clearRegionPaint(regions);

    expect(regions.sidebar.style.backgroundColor).toBe("");
    expect(regions.main.style.getPropertyValue("--dsw-alias-bg-base")).toBe("");
    // Still claimed: without this the shell observer would re-locate the four
    // surfaces on every frame it paints.
    expect(regionsAreCurrent(regions)).toBe(true);
  });

  it("leaves the host's own styling in charge after clearing", () => {
    paintRegions(regions, {
      sidebar: "#111111aa",
      main: "#222222bb",
      rightbar: "#333333cc",
      bottom: "#444444dd",
    });
    clearRegions(regions);

    expect(regions.sidebar.hasAttribute(REGION_ATTRIBUTE)).toBe(false);
    expect(regions.sidebar.style.backgroundColor).toBe("");
    // Removed, not written back to a remembered value: the host may have changed
    // its token since, and a stale copy would outrank the live one.
    expect(regions.main.style.getPropertyValue("--dsw-alias-bg-base")).toBe("");
  });
});
