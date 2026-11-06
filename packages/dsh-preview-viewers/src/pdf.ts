/**
 * The pdf surface's arithmetic: which page is showing, and how big it is drawn.
 *
 * Everything here is a pure function so it can be asserted in plain Node. The
 * React surface and the pdf.js document proxy are the parts that need a DOM and
 * a worker, and they are the parts that are hard to test; keeping the decisions
 * that are easy to get wrong (a page index off by one, a canvas that is blurry
 * because it was sized in CSS pixels) out of them is the point.
 *
 * The engine is not imported here. Only a chunk may carry pdf.js, and a static
 * import in this module would pull it into every bundle that reads the
 * catalogue.
 */

/** One page's size in PDF points, as the document reports it. */
export interface PageSize {
  readonly width: number;
  readonly height: number;
}

/**
 * Clamp a requested page index into the document.
 *
 * Page numbers are 1-based everywhere a reader sees them and 0-based in the
 * pdf.js API, so this takes the 1-based number and answers the 0-based index.
 * Both ends are clamped rather than rejected: a "next" button that throws on the
 * last page is worse than one that stays put.
 * @param page - requested page number, 1-based.
 * @param pageCount - pages in the document.
 * @returns the 0-based index to request, or 0 for an empty document.
 */
export function clampPage(page: number, pageCount: number): number {
  if (!Number.isFinite(pageCount) || pageCount < 1) return 0;
  if (!Number.isFinite(page)) return 0;
  const index = Math.trunc(page) - 1;
  if (index < 0) return 0;
  if (index > pageCount - 1) return pageCount - 1;
  return index;
}

/**
 * Whether a page has a neighbour in one direction.
 *
 * The controls are disabled from this rather than from a comparison at the call
 * site, so the two ends cannot disagree about whether page 1 is the first page.
 * @param page - current page number, 1-based.
 * @param pageCount - pages in the document.
 * @returns which directions exist.
 */
export function pageBounds(page: number, pageCount: number): { readonly hasPrev: boolean; readonly hasNext: boolean } {
  const index = clampPage(page, pageCount);
  return { hasPrev: index > 0, hasNext: index < pageCount - 1 };
}

/**
 * The scale that makes one page fill a container's width.
 *
 * A page is laid out in PDF points, so the ratio of the two widths is the scale
 * pdf.js wants. It is capped at 1 for the same reason a browser does not zoom a
 * small page up to fill a wide window: a 200-point-wide page blown up to 900
 * pixels is a blurry page, not a bigger one. The floor keeps a very narrow
 * container from producing a scale of zero, which pdf.js rejects.
 * @param containerWidth - available width in CSS pixels.
 * @param page - the page's own size in PDF points.
 * @returns the scale to render at.
 */
export function fitWidthScale(containerWidth: number, page: PageSize): number {
  if (!Number.isFinite(containerWidth) || containerWidth <= 0) return 1;
  if (!Number.isFinite(page.width) || page.width <= 0) return 1;
  return Math.min(1, Math.max(MIN_SCALE, containerWidth / page.width));
}

/** Smallest scale the surface will ask for; pdf.js refuses a zero-sized viewport. */
const MIN_SCALE = 0.05;

/**
 * The backing-store size for one canvas.
 *
 * A canvas drawn at its CSS size is blurry on a high-density display: the
 * browser scales the bitmap up to the device pixels. Sizing the bitmap by the
 * device ratio and letting CSS shrink it back is what makes text crisp. The
 * ratio is clamped because a fractional or absurd one would allocate a canvas
 * the browser then refuses.
 * @param viewport - the page's size at the chosen scale, in CSS pixels.
 * @param devicePixelRatio - the display's ratio.
 * @returns the bitmap dimensions to assign to the canvas.
 */
export function canvasSize(
  viewport: PageSize,
  devicePixelRatio: number,
): { readonly width: number; readonly height: number } {
  const ratio = Number.isFinite(devicePixelRatio) && devicePixelRatio > 0 ? Math.min(devicePixelRatio, 4) : 1;
  return {
    width: Math.max(1, Math.round(viewport.width * ratio)),
    height: Math.max(1, Math.round(viewport.height * ratio)),
  };
}

/**
 * Whether a thrown value means the document needs a password.
 *
 * pdf.js signals this with a named exception rather than a code, and the name is
 * the only stable thing about it: the class is not exported from the entry the
 * chunk imports. Reading the name keeps the check independent of which pdf.js
 * build is inlined.
 * @param error - whatever `getDocument`'s promise rejected with.
 * @returns true when the document is encrypted and a password would help.
 */
export function isPasswordError(error: unknown): boolean {
  const name = typeof error === "object" && error !== null ? (error as { name?: unknown }).name : undefined;
  return name === "PasswordException";
}

/**
 * A reader-facing reason one document could not be opened.
 *
 * The surface shows a translated sentence, not the engine's message: pdf.js
 * throws prose meant for a developer ("Invalid PDF structure"), and a reader
 * needs to know whether to try a password, re-download the file, or give up.
 * @param error - whatever the load rejected with.
 * @returns the locale key for that failure.
 */
export function loadFailureKey(error: unknown): string {
  if (isPasswordError(error)) return "pdf.error.password";
  const name = typeof error === "object" && error !== null ? (error as { name?: unknown }).name : undefined;
  if (name === "InvalidPDFException") return "pdf.error.invalid";
  if (name === "MissingPDFException") return "pdf.error.missing";
  return "pdf.error.unknown";
}

/**
 * The worker source turned into a URL a `Worker` constructor accepts.
 *
 * A `blob:` URL is the only address available here: the chunk is served from a
 * versioned asset route with no sibling files, so there is nothing for a relative
 * `workerSrc` to resolve against. The caller owns revoking it.
 * @param source - the inlined worker module text.
 * @param createObjectURL - `URL.createObjectURL`, injected so this stays testable.
 * @returns the blob URL to hand pdf.js.
 */
export function workerUrl(source: string, createObjectURL: (blob: Blob) => string): string {
  return createObjectURL(new Blob([source], { type: "text/javascript" }));
}
