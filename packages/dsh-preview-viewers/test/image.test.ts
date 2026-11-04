/**
 * The image family's MIME mapping, tested without a DOM.
 *
 * This is the half of the image preview that can be wrong in a way no screenshot
 * shows: a png handed to the browser as `image/jpeg` still renders in Chrome
 * because it sniffs the bytes, but it renders as nothing in a strict consumer,
 * and an SVG served as `image/png` is refused outright. So the mapping is a pure
 * function with its own tests rather than a table inlined in the component.
 */
import { describe, expect, it } from "vitest";

import { IMAGE_MIME, isImagePath, mimeFor } from "../src/image.ts";

describe("mimeFor", () => {
  it("maps every suffix the catalogue claims for this family", () => {
    expect(mimeFor("a.png")).toBe("image/png");
    expect(mimeFor("a.jpg")).toBe("image/jpeg");
    expect(mimeFor("a.jpeg")).toBe("image/jpeg");
    expect(mimeFor("a.gif")).toBe("image/gif");
    expect(mimeFor("a.webp")).toBe("image/webp");
    expect(mimeFor("a.bmp")).toBe("image/bmp");
    expect(mimeFor("a.ico")).toBe("image/x-icon");
    expect(mimeFor("a.svg")).toBe("image/svg+xml");
  });

  it("gives svg and ico their own types rather than a generic image one", () => {
    // Both are the cases a generic `image/*` guess gets wrong: svg is XML and a
    // browser will not decode it as a raster image, ico is not in the standard
    // registry under any `image/<suffix>` spelling.
    expect(mimeFor("a.svg")).not.toBe("image/svg");
    expect(mimeFor("a.ico")).not.toBe("image/ico");
    expect(mimeFor("a.ico")).toBe("image/x-icon");
  });

  it("reads the suffix case-insensitively", () => {
    expect(mimeFor("a.SVG")).toBe("image/svg+xml");
    expect(mimeFor("HERO.PNG")).toBe("image/png");
    expect(mimeFor("shot.JpEg")).toBe("image/jpeg");
  });

  it("decides on the basename, not on a dotted directory", () => {
    expect(mimeFor("assets/deep/hero.png")).toBe("image/png");
    expect(mimeFor("/tmp/shots.d/hero.png")).toBe("image/png");
    // The directory's dotted name must not be read as the file's suffix.
    expect(mimeFor("shots.png/README")).toBeNull();
  });

  it("returns null for a name with no suffix", () => {
    expect(mimeFor("README")).toBeNull();
    expect(mimeFor("assets/Makefile")).toBeNull();
    expect(mimeFor("")).toBeNull();
  });

  it("treats a leading dot as the name, not a suffix", () => {
    // `.png` is a dotfile called `png`, the same rule the format catalogue and
    // the renderer registry already apply. Reading it as a suffix would claim a
    // file whose whole name is `.png`.
    expect(mimeFor(".png")).toBeNull();
    expect(mimeFor("/tmp/.svg")).toBeNull();
  });

  it("returns null for a suffix this family does not own", () => {
    expect(mimeFor("a.txt")).toBeNull();
    expect(mimeFor("a.pdf")).toBeNull();
    // A claimed suffix that is not the last one is not this file's suffix.
    expect(mimeFor("a.png.bak")).toBeNull();
    expect(mimeFor("a.png.zip")).toBeNull();
    // raster owns TIFF; image must not answer for it.
    expect(mimeFor("scan.tif")).toBeNull();
  });

  it("covers exactly the suffixes the catalogue claims for image", () => {
    // The two lists answer different questions (what the family owns, and what
    // MIME to send), so they are asserted against each other rather than trusted
    // to stay in sync by convention.
    const claimed = [...IMAGE_MIME.keys()].sort();
    expect(claimed).toEqual(["bmp", "gif", "ico", "jpeg", "jpg", "png", "svg", "webp"]);
  });
});

describe("isImagePath", () => {
  it("agrees with the MIME mapping", () => {
    for (const suffix of IMAGE_MIME.keys()) {
      expect(isImagePath(`a.${suffix}`), suffix).toBe(true);
      expect(mimeFor(`a.${suffix}`), suffix).not.toBeNull();
    }
    for (const name of ["a.txt", "a.pdf", "README", ".png", "a.png.bak"]) {
      expect(isImagePath(name), name).toBe(false);
    }
  });
});
