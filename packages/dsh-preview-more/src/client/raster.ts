/**
 * TIFF decoding: bytes in, RGBA pages out.
 *
 * TIFF is the format the host lists as an unviewable binary, so this module is
 * the whole reason the raster family exists. It is engine-free: no canvas, no
 * DOM, no WebGL, which is what lets the decode path be tested in plain Node.
 *
 * utif gives one IFD per page, and this module decodes every page up front so
 * the page control can report a total. Two costs follow, both accepted for now:
 * the whole file is parsed once per page plus once for the count, and the RGBA
 * pages stay resident, so a long multi-page scan costs hundreds of megabytes.
 * Page-at-a-time decoding would need the count to come from somewhere other than
 * a full pass, and it is the reason this module is a candidate for lazy loading
 * if large scans show up in practice.
 */

import type * as UtifModule from "utif";

/** The utif face this module calls. */
type UtifApi = typeof UtifModule;

/** How one raster file gets turned into pixels. */
export type DecodeMode = "tiff" | "native";

/**
 * A decode failure that names a locale key rather than a sentence.
 *
 * The decoder has no translator and should not grow one: it runs in plain Node
 * with no locale in scope. Carrying the key lets the component render a message
 * in the reader's language instead of putting English library prose on screen.
 */
export class RasterError extends Error {
  /**
   * @param key - locale key naming the failure.
   */
  constructor(readonly key: string) {
    super(key);
    this.name = "RasterError";
  }
}

/**
 * Decide which decoder draws one file.
 *
 * TIFF has no browser decoder, so it is decoded here with utif; AVIF has one but
 * the built-in preview omits the suffix, so an image element handles it.
 * @param path - decoded file path.
 * @returns the decode path, or null for a suffix this family does not own.
 */
export function decodeMode(path: string): DecodeMode | null {
  const name = path.slice(path.lastIndexOf("/") + 1);
  const dot = name.lastIndexOf(".");
  if (dot <= 0) return null;
  const suffix = name.slice(dot + 1).toLowerCase();
  if (suffix === "tif" || suffix === "tiff") return "tiff";
  if (suffix === "avif") return "native";
  return null;
}

/** One decoded page: its size and its RGBA pixels. */
export interface DecodedPage {
  readonly width: number;
  readonly height: number;
  readonly rgba: Uint8Array;
}

/**
 * Copy bytes into the standalone ArrayBuffer utif expects.
 *
 * utif reads through the whole buffer, so handing it a view over a larger
 * buffer would decode neighbouring bytes as image data.
 * @param bytes - the file bytes.
 * @returns an ArrayBuffer holding exactly those bytes.
 */
function bufferOf(bytes: Uint8Array): ArrayBuffer {
  return bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer;
}

/**
 * Decode one TIFF page.
 * @param api - the utif module.
 * @param buffer - the file bytes.
 * @param page - zero-based page index.
 * @returns the page's pixels.
 */
function decodePage(api: UtifApi, buffer: ArrayBuffer, page: number): DecodedPage {
  const ifds = api.decode(buffer);
  const ifd = ifds[page];
  if (ifd === undefined) throw new RasterError("raster.pageMissing");
  api.decodeImage(buffer, ifd);
  const width = ifd.width ?? 0;
  const height = ifd.height ?? 0;
  if (width <= 0 || height <= 0) throw new RasterError("raster.emptyPage");
  return { width, height, rgba: api.toRGBA8(ifd) };
}

/**
 * Decode every page of a TIFF file.
 * @param bytes - complete file bytes.
 * @param api - the utif module, injected so tests can supply the real one.
 * @returns one entry per page, in file order.
 */
export function decodeTiff(bytes: Uint8Array, api: UtifApi): DecodedPage[] {
  const buffer = bufferOf(bytes);
  const count = api.decode(buffer).length;
  const pages: DecodedPage[] = [];
  for (let page = 0; page < count; page += 1) pages.push(decodePage(api, buffer, page));
  return pages;
}
