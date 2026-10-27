/**
 * Build-time virtual module carrying the Draco decoder.
 *
 * The decoder cannot be fetched at runtime: three's DRACOLoader resolves it
 * through `new URL(..., import.meta.url)`, and a plugin's chunks are served from
 * a versioned route with no file layout to resolve against. scripts/build.mjs
 * provides this module's contents from three's own `libs/draco/gltf` payloads,
 * so the shipped chunk carries the exact decoder version it was built with.
 */
declare module "virtual:draco-assets" {
  /** The wasm decoder's JavaScript side (`draco_wasm_wrapper.js`). */
  export const wasmWrapper: string;
  /** The compiled wasm decoder (`draco_decoder.wasm`). */
  export const wasmBinary: Uint8Array;
}
