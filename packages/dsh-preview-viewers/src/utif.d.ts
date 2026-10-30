/**
 * Minimal typing for the utif package, which ships none.
 *
 * The declaration covers only what raster.ts calls. That is deliberate: a
 * broader surface here would look like a maintained binding, while this file is
 * just the contract this plugin depends on.
 */
declare module "utif" {
  /** One image file directory: one page's tags, plus decoded pixels. */
  interface Ifd {
    width?: number;
    height?: number;
    data?: Uint8Array;
    [tag: string]: unknown;
  }

  /** Decode the directory structure only; pixels stay compressed. */
  export function decode(buffer: ArrayBuffer): Ifd[];
  /** Decode one directory's pixels in place. */
  export function decodeImage(buffer: ArrayBuffer, ifd: Ifd): void;
  /** Convert one decoded directory to 8-bit RGBA. */
  export function toRGBA8(ifd: Ifd): Uint8Array;
}
